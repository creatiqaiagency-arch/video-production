import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, ROOT)
from vo_text import VO_TEXT; from shot_intent import INTENT
tl = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
out = ['| shot | time | dur | intent | VO heard during shot |', '|---|---|---|---|---|']
for s in tl['shots']:
    t0, t1 = s['f0'] / 24, s['f1'] / 24
    vo = ' / '.join(f"{v['clip']}: {VO_TEXT[v['clip']]}" for v in tl['vo'] if v['t0'] < t1 - .2 and v['t1'] > t0 + .2)
    out.append(f"| {s['id']} ({s['fn']}) | {int(t0 // 60)}:{t0 % 60:04.1f} | {t1 - t0:.1f}s | {INTENT.get(s['id'], '')} | {vo} |")
open(sys.argv[1], 'w').write('\n'.join(out) + '\n'); print('ok')
