#!/usr/bin/env python3
"""Pick VO takes, trim + process them, and lay out the film's audio timeline.

Outputs
  production/audio/vo/<id>.wav          trimmed (and thought-processed) line audio
  production/build/timeline.json        {lines:{id:{start,end,dur,speaker,kind,text,segs}}, marks:{}, total}
  production/build/envelopes.json       per-line lip-flap envelope at 24 fps (0..1)
The cue sheet below is the edit: order of lines, gaps and holds per scene.
"""
import json, os, re, subprocess, statistics, sys, wave, array, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'audio', 'vo_raw')
OUT = os.path.join(ROOT, 'audio', 'vo')
BUILD = os.path.join(ROOT, 'build')
FPS = 24
SR = 44100

# ---------------------------------------------------------------- cue sheet
# ('L', id, gap)              line starts `gap` s after previous event ends
# ('O', id, offset)           line starts `offset` s after previous LINE start (overlap)
# ('H', seconds, mark?)       hold / silence, optional named mark at its start
# ('M', name)                 named mark at current time
CUES = [
  ('M', 'S01'), ('H', 1.0, 'cafe_open'),
  ('L', 's01_vo1', 0), ('L', 's01_vo2', 0.45),
  ('H', 0.5, 'counter'), ('L', 's01_barista_say', 0), ('L', 's01_barista_th1', 0.2),
  ('H', 0.25, 'slip'), ('L', 's01_noah1', 0.35), ('H', 1.2, 'freeze'), ('H', 0.9, 'crash'),
  ('L', 's01_barista_th2', 0.15), ('H', 0.7),
  ('M', 'TITLE'), ('H', 4.2),
  ('M', 'S02'), ('L', 's02_vo1', 0.2), ('H', 0.3), ('L', 's02_biz_say', 0), ('L', 's02_biz_th', 0.25),
  ('L', 's02_woman_th', 0.6), ('L', 's02_man_th', 0.7), ('H', 0.5), ('L', 's02_noah1', 0), ('H', 0.6),
  ('M', 'S03'), ('L', 's03_vo1', 0.1), ('H', 0.4), ('L', 's03_teacher1', 0), ('L', 's03_noah1', 0.3),
  ('L', 's03_teacher_th', 0.25), ('H', 0.6, 'b_travel'), ('L', 's03_noah2', 0.0), ('L', 's03_teacher2', 0.35), ('H', 0.4),
  ('M', 'montage'), ('L', 's03_vo2', 0.2), ('H', 2.6, 'bell'),
  ('M', 'S04'), ('L', 's04_vo1', 0.3), ('H', 2.6, 'push'), ('L', 's04_maya_th1', 0), ('L', 's04_noah1', 0.35),
  ('H', 0.5), ('L', 's04_maya_th2', 0), ('L', 's04_noah2', 0.2), ('H', 1.0),
  ('M', 'S05'), ('L', 's05_vo1', 0.2), ('H', 0.6, 'doors'), ('L', 's05_noah1', 3.0), ('H', 0.8),
  ('M', 'S06'), ('L', 's06_vo1', 0.3), ('L', 's06_c1', 0.3), ('O', 's06_c2', 0.7), ('O', 's06_c3', 0.75), ('O', 's06_c4', 0.6),
  ('O', 's06_c5', 0.8), ('O', 's06_c6', 0.5), ('O', 's06_c7', 0.4), ('O', 's06_c8', 0.35), ('H', 0.6),
  ('L', 's06_vo2', 0.0), ('H', 2.2, 'peak'), ('H', 0.8, 'cut_silence'),
  ('M', 'S07'), ('L', 's07_vo1', 0.2), ('H', 1.4, 'bathroom'), ('L', 's07_noah1', 0), ('H', 0.8),
  ('M', 'S08'), ('L', 's08_vo1', 0.3), ('H', 0.5), ('L', 's08_leo_say1', 0), ('L', 's08_leo_th1', 0.35),
  ('L', 's08_noah1', 0.5), ('L', 's08_leo_say2', 0.25), ('L', 's08_leo_th2', 0.4), ('H', 1.6),
  ('M', 'S09'), ('L', 's09_vo1', 0.1), ('L', 's09_leo_th1', 0.4), ('L', 's09_leo_th2', 0.9), ('L', 's09_vo2', 0.5), ('H', 0.8),
  ('M', 'S10'), ('L', 's10_maya_say1', 0.3), ('L', 's10_maya_th1', 0.25), ('L', 's10_noah1', 0.3), ('L', 's10_maya_th2', 0.3),
  ('L', 's10_noah2', 0.15), ('H', 0.4), ('L', 's10_maya_say2', 0), ('H', 1.6, 'hold_hurt'), ('L', 's10_vo1', 0), ('H', 0.6),
  ('M', 'S11'), ('L', 's11_vo1', 0.3), ('L', 's11_leo_th', 0.6), ('H', 2.0, 'tick'),
  ('M', 'S12'), ('H', 2.4, 'courtyard_wide'), ('L', 's12_vo1', 0), ('H', 0.6), ('L', 's12_noah1', 0), ('L', 's12_leo1', 0.3),
  ('L', 's12_noah2', 0.3), ('L', 's12_leo_th', 0.35), ('H', 0.5),
  ('M', 'S13'), ('L', 's13_noah1', 0.2), ('L', 's13_leo1', 0.3), ('L', 's13_leo_th', 0.3), ('L', 's13_noah2', 0.35),
  ('L', 's13_leo2', 0.2), ('L', 's13_noah3', 0.1), ('H', 2.4, 'silence'),
  ('M', 'S14'), ('L', 's14_leo1', 0.5), ('L', 's14_noah1', 0.6), ('H', 0.6, 'letter'), ('L', 's14_leo2', 0), ('L', 's14_noah2', 0.6),
  ('L', 's14_leo3', 0.25), ('L', 's14_leo_th', 0.4), ('H', 0.8),
  ('M', 'S15'), ('L', 's15_noah1', 0.3), ('L', 's15_leo1', 0.4), ('L', 's15_noah2', 0.5), ('L', 's15_leo2', 0.4),
  ('H', 2.8, 'memory'), ('L', 's15_leo3', 0), ('H', 1.8, 'music_in'),
  ('M', 'S16'), ('L', 's16_vo1', 0.2), ('H', 1.6),
  ('M', 'S17'), ('L', 's17_noah1', 0.2), ('L', 's17_leo1', 0.3), ('L', 's17_noah2', 0.3), ('L', 's17_leo2', 0.25),
  ('H', 0.5), ('L', 's17_noah3', 0), ('L', 's17_leo_th', 0.3), ('L', 's17_laugh_noah', 0.3), ('O', 's17_laugh_leo', 0.15), ('H', 3.2, 'hug'),
  ('M', 'S18'), ('L', 's18_vo1', 0.3), ('H', 0.6), ('L', 's18_maya1', 0), ('L', 's18_maya_th', 0.3), ('H', 0.5), ('L', 's18_noah1', 0),
  ('H', 4.5, 'walk_off'), ('M', 'END'), ('H', 5.0), ('M', 'FIN'),
]

def sh(cmd):
    return subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)

def dur(f):
    return float(sh(f'ffprobe -v error -show_entries format=duration -of csv=p=0 "{f}"').stdout.strip())

def read_wav(f):
    with wave.open(f) as w:
        a = array.array('h', w.readframes(w.getnframes()))
    return a

def main():
    meta = json.load(open(os.path.join(ROOT, 'script', 'vo_lines.json')))
    lines = {l['id']: l for l in meta['lines']}
    os.makedirs(OUT, exist_ok=True); os.makedirs(BUILD, exist_ok=True)
    choice_path = os.path.join(BUILD, 'take_choice.json')
    choice = json.load(open(choice_path)) if os.path.exists(choice_path) else {}
    info = {}
    for lid, l in lines.items():
        takes = sorted(glob.glob(os.path.join(RAW, f'{lid}_t*.mp3')))
        takes = [t for t in takes if os.path.getsize(t) > 2000]
        if not takes:
            print('MISSING', lid); continue
        if lid in choice:
            pick = os.path.join(RAW, choice[lid])
        else:
            ds = [(dur(t), t) for t in takes]
            med = statistics.median([d for d, _ in ds])
            pick = min(ds, key=lambda x: abs(x[0] - med))[1]
            choice[lid] = os.path.basename(pick)
        out = os.path.join(OUT, f'{lid}.wav')
        trim = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse'
        chain = f'{trim},loudnorm=I=-18:TP=-2:LRA=9'
        if l['kind'] == 'thought':
            chain += ',highpass=f=170,lowpass=f=7600,aecho=0.85:0.55:55|110:0.32|0.18,volume=-1.5dB'
        sh(f'ffmpeg -v error -y -i "{pick}" -af "{chain}" -ar {SR} -ac 1 "{out}"')
        info[lid] = {'file': os.path.relpath(out, ROOT), 'dur': dur(out), 'take': os.path.basename(pick)}
    json.dump(choice, open(choice_path, 'w'), indent=1)

    # envelopes + speech segments
    env, segs = {}, {}
    for lid, i in info.items():
        a = read_wav(os.path.join(ROOT, i['file']))
        hop = SR // FPS
        rms = []
        for k in range(0, len(a), hop):
            ch = a[k:k + hop]
            rms.append((sum(x * x for x in ch[::4]) / max(1, len(ch[::4]))) ** 0.5 if len(ch) else 0)
        pk = max(rms) or 1
        env[lid] = [round(min(1, (r / pk) ** 0.8 * 1.15), 3) for r in rms]
        # phrase segments: gaps of >= 0.22 s below 12% of peak
        s, on, quiet, start = [], False, 0, 0
        for k, r in enumerate(rms):
            loud = r > 0.12 * pk
            if loud and not on: on, start = True, k
            if on:
                quiet = 0 if loud else quiet + 1
                if quiet >= int(0.22 * FPS):
                    s.append([round(start / FPS, 3), round((k - quiet + 1) / FPS, 3)]); on = False; quiet = 0
        if on: s.append([round(start / FPS, 3), round(len(rms) / FPS, 3)])
        segs[lid] = s

    # layout
    t, last_start, tl, marks = 0.0, 0.0, {}, {}
    for cue in CUES:
        if cue[0] == 'M':
            marks[cue[1]] = round(t, 3)
        elif cue[0] == 'H':
            if len(cue) > 2: marks[cue[2]] = round(t, 3)
            t += cue[1]
        elif cue[0] in ('L', 'O'):
            lid = cue[1]
            if lid not in info:
                l0 = lines[lid]; txt = re.sub(r'\[[^\]]*\]\s*', '', l0['text']).strip()
                info[lid] = {'file': None, 'dur': round(0.4 + len(txt) / 14.0, 3), 'take': None, 'placeholder': True}
                segs[lid] = [[0, info[lid]['dur']]]; env[lid] = []
                print('PLACEHOLDER', lid)
            st = t + cue[2] if cue[0] == 'L' else last_start + cue[2]
            d = info[lid]['dur']; l = lines[lid]
            tl[lid] = {'start': round(st, 3), 'end': round(st + d, 3), 'dur': round(d, 3), 'speaker': l['speaker'], 'kind': l['kind'],
                       'text': re.sub(r'\[[^\]]*\]\s*', '', l['text']).strip(), 'file': info[lid]['file'],
                       'segs': [[round(st + a, 3), round(st + b, 3)] for a, b in segs[lid]]}
            last_start = st
            t = max(t, st + d)
    out = {'lines': tl, 'marks': marks, 'total': round(t, 3)}
    json.dump(out, open(os.path.join(BUILD, 'timeline.json'), 'w'), indent=1)
    json.dump(env, open(os.path.join(BUILD, 'envelopes.json'), 'w'))
    print(f'lines {len(tl)}  total {t:.1f}s ({int(t // 60)}:{t % 60:04.1f})')
    for k in ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18', 'END']:
        if k in marks: print(k, marks[k])

if __name__ == '__main__':
    main()
