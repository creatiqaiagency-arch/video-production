"""Render keyframes for every shot (start/mid/end) and build labelled contact sheets for review.
usage: python3 tools/review_frames.py <outdir> [mid|all]"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1]; mode = sys.argv[2] if len(sys.argv) > 2 else 'all'
os.makedirs(out, exist_ok=True)
tl = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
specs = []
for s in tl['shots']:
    d = (s['f1'] - s['f0']) / 24
    pts = [round(d * .5, 2)] if mode == 'mid' else [0.1, round(d * .5, 2), round(max(d - .12, .1), 2)]
    specs += [f"{s['id']}:{p}" for p in pts]
video = sys.argv[3] if len(sys.argv) > 3 else None
if video:  # extract keyframes from the rendered film (exactly what the viewer sees)
    for s in tl['shots']:
        d = (s['f1'] - s['f0']) / 24
        pts = [round(d * .5, 2)] if mode == 'mid' else [0.1, round(d * .5, 2), round(max(d - .12, .1), 2)]
        for p in pts:
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f"{s['f0'] / 24 + p:.3f}", '-i', video, '-frames:v', '1', '-vf', 'scale=960:-1', '-q:v', '4', os.path.join(out, f"{s['id']}_{p}.jpg")], check=True)
else:
    chunks = [specs[i::4] for i in range(4)]
    procs = [subprocess.Popen(['node', os.path.join(ROOT, 'tools', 'render.cjs'), '--stills', ','.join(c), '--dir', out]) for c in chunks if c]
    for p in procs: p.wait()
font = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf', 22)
vo = tl['vo']
def vo_at(t0, t1): return ' '.join(v['clip'] for v in vo if v['t0'] < t1 and v['t1'] > t0)
tiles = []
for s in tl['shots']:
    d = (s['f1'] - s['f0']) / 24
    pts = [round(d * .5, 2)] if mode == 'mid' else [0.1, round(d * .5, 2), round(max(d - .12, .1), 2)]
    ims = [Image.open(os.path.join(out, f"{s['id']}_{p}.jpg")).resize((384, 216)) for p in pts]
    tile = Image.new('RGB', (384 * len(ims), 216 + 30), (20, 20, 24))
    for i, im in enumerate(ims): tile.paste(im, (i * 384, 30))
    t0 = s['f0'] / 24
    ImageDraw.Draw(tile).text((6, 3), f"{s['id']} {s['fn']}  {int(t0 // 60)}:{t0 % 60:04.1f}  {d:.1f}s  VO:{vo_at(t0, s['f1'] / 24)}", fill=(255, 230, 190), font=font)
    tiles.append(tile)
per = 8 if mode == 'all' else 24
cols = 1 if mode == 'all' else 3
for k in range(0, len(tiles), per):
    group = tiles[k:k + per]
    tw, th = group[0].size
    rows = (len(group) + cols - 1) // cols
    sheet = Image.new('RGB', (tw * cols, th * rows), (0, 0, 0))
    for i, t in enumerate(group): sheet.paste(t, ((i % cols) * tw, (i // cols) * th))
    sheet.save(os.path.join(out, f'sheet_{k // per:02d}.jpg'), quality=85)
print('sheets:', len(range(0, len(tiles), per)))
