"""Resolve timeline_spec.py against VO durations/phrases -> build/timeline.json, build/timeline.js, build/vo_index.js"""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
import importlib; spec = importlib.import_module('timeline_spec')
VOI = json.load(open(os.path.join(ROOT, 'build', 'vo_index.json')))

def parse(anchor):
    m = re.match(r'^([^+\-]*)([+\-][\d.]+)?$', str(anchor))
    return m.group(1), float(m.group(2) or 0)

blocks, shots, vo, sfx = [], [], [], []
t = 0.0
warn = []
for b in spec.BLOCKS:
    b0 = t; cur = b0; clips = {}
    for name, gap in b['vo']:
        st = cur + gap; d = VOI[name]['dur']
        clips[name] = st; vo.append(dict(clip=name, t0=round(st, 3), t1=round(st + d, 3), speaker=spec.SPEAKER[name[0]], block=b['name']))
        cur = st + d
    shot_t = {}
    def resolve(a, prev):
        base, off = parse(a)
        if base == '': return prev + off
        if base == 'end': return cur + off
        m = re.match(r'^([NLOF]\d\d)(?:\.(\d+)|(\$))?$', base)
        if m:
            c = m.group(1); st = clips[c]
            if m.group(3): return st + VOI[c]['dur'] + off
            if m.group(2) is not None:
                ph = VOI[c]['phrases']; k = int(m.group(2))
                if k >= len(ph): warn.append(f'{b["name"]}: {a} phrase index out of range ({len(ph)})'); k = len(ph) - 1
                return st + ph[k][0] + off
            return st + off
        m = re.match(r'^(s\d+)(\$)?$', base)
        if m: s0, s1 = shot_t[m.group(1)]; return (s1 if m.group(2) else s0) + off
        raise ValueError(a)
    prev = b0
    for sid, fn, end in b['shots']:
        e = resolve(end, prev)
        if e - prev < 0.8: warn.append(f'{sid} {fn} only {e - prev:.2f}s (anchor {end})')
        shot_t[sid] = (prev, e); shots.append(dict(id=sid, fn=fn, t0=round(prev, 4), t1=round(e, 4), block=b['name'])); prev = e
    bend = max(prev, cur)
    if cur > prev + 0.05: warn.append(f'{b["name"]}: VO runs {cur - prev:.2f}s past last shot — extending last shot'); shots[-1]['t1'] = round(cur + 0.3, 4); bend = cur + 0.3
    for item in b.get('sfx', []):
        name, a, gain = item
        st = b0 + a if isinstance(a, (int, float)) else resolve(a, b0)
        sfx.append(dict(name=name, t0=round(st, 3), gain=gain, block=b['name'], block_end=None))
    blocks.append(dict(name=b['name'], t0=round(b0, 3), t1=round(bend, 3), shots={k: [round(v[0], 3), round(v[1], 3)] for k, v in shot_t.items()}))
    t = bend
# snap shot boundaries to frames
for s in shots: s['f0'] = round(s['t0'] * 24); s['f1'] = round(s['t1'] * 24)
for i in range(1, len(shots)): shots[i]['f0'] = shots[i - 1]['f1']
for s in sfx:
    b = next(x for x in blocks if x['name'] == s['block']); s['block_end'] = b['t1']
music = []
def mres(a):
    if ':' in a:
        bn, sh = a.split(':'); b = next(x for x in blocks if x['name'] == bn)
        sh, end = (sh[:-1], 1) if sh.endswith('$') else (sh, 0)
        return b['shots'][sh][end]
    if a.endswith('$'): return next(x for x in blocks if x['name'] == a[:-1])['t1']
    return next(x for x in blocks if x['name'] == a)['t0']
for name, a, e, gain, fi, fo in spec.MUSIC: music.append(dict(name=name, t0=round(mres(a), 3), t1=round(mres(e), 3), gain=gain, fade_in=fi, fade_out=fo))
total = round(shots[-1]['f1'] / 24, 3)
tl = dict(fps=24, duration=total, frames=shots[-1]['f1'], shots=shots, vo=vo, sfx=sfx, music=music, blocks=blocks)
B = os.path.join(ROOT, 'build')
json.dump(tl, open(os.path.join(B, 'timeline.json'), 'w'), indent=1)
open(os.path.join(B, 'timeline.js'), 'w').write('const TL = ' + json.dumps(tl) + ';\n')
open(os.path.join(B, 'vo_index.js'), 'w').write('const VOI = ' + json.dumps({k: {'dur': v['dur'], 'env': v['env']} for k, v in VOI.items()}) + ';\n')
lens = [s['t1'] - s['t0'] for s in shots]
print(f'{len(shots)} shots, duration {total:.1f}s ({int(total // 60)}:{total % 60:04.1f}), mean shot {sum(lens) / len(lens):.2f}s, max {max(lens):.2f}s, >5s: {sum(l > 5 for l in lens)}, >8s: {sum(l > 8 for l in lens)}')
for w in warn: print('WARN', w)
