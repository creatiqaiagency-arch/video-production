#!/usr/bin/env python3
"""Contact sheet from rendered stills named <SHOT>_<time>.jpg. usage: sheet.py dir out.jpg [cols] [per_sheet]"""
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
per = int(sys.argv[4]) if len(sys.argv) > 4 else 1000
fs = sorted(glob.glob(os.path.join(d, '*.jpg')), key=lambda f: float(os.path.basename(f).rsplit('_', 1)[-1][:-4]))
fs = [f for f in fs if 'sheet' not in f]
w, h = 480, 270
outs = []
for k in range(0, len(fs), per):
    chunk = fs[k:k + per]; rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * w, rows * h), 'black')
    for i, f in enumerate(chunk):
        im = Image.open(f).resize((w, h)); dr = ImageDraw.Draw(im); dr.rectangle([0, 0, 230, 22], fill='black'); dr.text((4, 4), os.path.basename(f)[:-4], fill='yellow')
        sheet.paste(im, ((i % cols) * w, (i // cols) * h))
    o = out if per >= len(fs) else out.replace('.jpg', f'_{k // per + 1}.jpg')
    sheet.save(o, quality=85); outs.append(o)
print('\n'.join(outs))
