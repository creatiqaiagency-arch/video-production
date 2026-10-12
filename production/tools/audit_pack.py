#!/usr/bin/env python3
"""Build the review package auditors look at for a version.

usage: audit_pack.py V1 path/to/video.mp4
Creates production/audits/<V>/pack/:
  sheet_XX.jpg        2 labelled stills per shot (25 % / 75 %), 4×4 grid
  motion_XX.jpg       8-frame strips across selected shots (animation review)
  shots.md            shot list: id, type, start, duration, description, VO lines inside the shot
  cadence.md          automatic shot-length statistics vs the 3–5 s rule
"""
import json, os, subprocess, sys, statistics

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V, video = sys.argv[1], sys.argv[2]
out = os.path.join(ROOT, 'audits', V, 'pack'); os.makedirs(out, exist_ok=True)
tl = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
shots = json.load(open(os.path.join(ROOT, 'build', 'shotlist.json')))
lines = sorted(tl['lines'].items(), key=lambda kv: kv[1]['start'])

# shots.md
with open(os.path.join(out, 'shots.md'), 'w') as f:
    f.write(f'# {V} shot list — {len(shots)} shots, {tl["total"]:.1f}s\n\n| # | shot | type | start | dur | what we see | audio in shot |\n|---|---|---|---|---|---|---|\n')
    for i, s in enumerate(shots):
        inside = [f"{l['speaker']}{' (thought)' if l['kind'] == 'thought' else ''}: \"{l['text']}\"" for k, l in lines if l['start'] < s['t1'] and l['end'] > s['t0']]
        f.write(f"| {i + 1} | {s['id']} | {s['type']} | {s['t0']:.2f} | {s['dur']:.2f} | {s['desc']} | {' / '.join(inside)} |\n")

# cadence.md
d = [s['dur'] for s in shots]
import re as _re
_h = open(os.path.join(ROOT, 'engine', 'shots', '_helpers.js')).read()
def _set(name):
    m = _re.search(r'E\.%s = new Set\(\[([^\]]*)\]' % name, _h); return set(_re.findall(r"'([^']+)'", m.group(1))) if m else set()
BEATS, HOLDS = _set('BEATS') | {s['id'] for s in shots if s.get('beat')}, _set('HOLDS') | {s['id'] for s in shots if s.get('hold')}
TOL = 1 / 24 + 1e-6  # 1 frame at 24 fps
bad_short = [s for s in shots if s['dur'] < 3.0 - TOL]
bad_long = [s for s in shots if s['dur'] > 5.0 + TOL]
in_rule = len(shots) - len(bad_short) - len(bad_long)
ok_exc = [s for s in shots if (s['id'] in BEATS and 1.0 - TOL <= s['dur'] <= 2.5 + TOL) or (s['id'] in HOLDS and 3 - TOL <= s['dur'] <= 7 + TOL) or (3 - TOL <= s['dur'] <= 5 + TOL)]
types = [s['type'] for s in shots]
repeats = [(shots[i]['id'], shots[i + 1]['id']) for i in range(len(shots) - 1) if types[i] == types[i + 1] and types[i] in ('CU', 'ECU')]
with open(os.path.join(out, 'cadence.md'), 'w') as f:
    f.write(f'# {V} cadence report\n\nshots {len(shots)} · mean {statistics.mean(d):.2f}s · median {statistics.median(d):.2f}s · min {min(d):.2f}s · max {max(d):.2f}s\n\n')
    f.write(f'strictly within 3–5 s (±1 frame): **{in_rule}/{len(shots)} ({100 * in_rule / len(shots):.0f}%)**\n\n')
    f.write(f'shots between 2.90 and 3.10 s (metronome check): **{sum(1 for x in d if 2.9 <= x <= 3.1)}**\n\n')
    f.write(f'within the rule incl. declared exceptions: **{len(ok_exc)}/{len(shots)} ({100 * len(ok_exc) / len(shots):.0f}%)**\n\n')
    f.write('declared impact beats (allowed 1.0–2.5 s): ' + ', '.join(sorted(BEATS)) + '\n\n')
    f.write('declared moving Act-3 holds (allowed ≤7 s): ' + ', '.join(sorted(HOLDS)) + '\n\n')
    f.write('## shorter than 3 s\n' + ''.join(f"- {s['id']} {s['dur']:.2f}s ({s['type']})\n" for s in bad_short))
    f.write('\n## longer than 5 s\n' + ''.join(f"- {s['id']} {s['dur']:.2f}s ({s['type']})\n" for s in bad_long))
    f.write('\n## consecutive close-ups (same type back-to-back)\n' + ''.join(f'- {a} → {b}\n' for a, b in repeats))

# stills from the actual rendered video, with burned-in labels
tmp = os.path.join(out, 'frames'); os.makedirs(tmp, exist_ok=True)
for f_ in os.listdir(tmp): os.remove(os.path.join(tmp, f_))
k = 0
for s in shots:
    for frac in (0.25, 0.75):
        t = s['t0'] + s['dur'] * frac
        label = f"{s['id']}  {t:.1f}s  ({s['dur']:.1f}s shot)".replace(':', '\\:')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', video, '-frames:v', '1', '-vf',
                        f"scale=640:-2,drawtext=text='{label}':x=8:y=8:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.7", os.path.join(tmp, f'{k:04d}.jpg')], check=True)
        k += 1
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-pattern_type', 'glob', '-i', os.path.join(tmp, '*.jpg'), '-vf', 'tile=4x4:padding=4', os.path.join(out, 'sheet_%02d.jpg')], check=True)

# motion strips: 8 frames across a spread of shots (every ~8th shot)
sel = shots[::max(1, len(shots) // 12)][:12]
for j, s in enumerate(sel):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f"{s['t0']:.3f}", '-t', f"{s['dur']:.3f}", '-i', video, '-vf',
                    f"fps={8 / max(0.5, s['dur']):.3f},scale=400:-2,tile=8x1:padding=2,drawtext=text='{s['id']}':x=6:y=6:fontsize=16:fontcolor=yellow:box=1:boxcolor=black@0.7",
                    '-frames:v', '1', os.path.join(out, f'motion_{j:02d}.jpg')], check=True)
print('pack ->', out, 'sheets:', len([x for x in os.listdir(out) if x.startswith('sheet')]))
