#!/usr/bin/env bash
# Build a full version: timeline, stills, contact sheets, video, audio mix, final mux.
# usage: tools/build.sh V1 [res]
set -euo pipefail
V=${1:?version}; RES=${2:-1920x1080}; CRF=${3:-24}
cd "$(dirname "$0")/.."
PROD=../production/learn-10x
OUT=$PROD/renders/$V
SHOTS=shots/common.js,shots/act1.js,shots/act2.js,shots/act3.js
VO=$PROD/vo/vo_data.json
mkdir -p $OUT/stills
python3 tools/vo_data.py $PROD/vo $PROD/vo_lines.json $VO
node render.js --shots $SHOTS --vo $VO --timeline $OUT/timeline.json --stills shots --outdir $OUT/stills > /dev/null
python3 - $OUT/timeline.json <<'PY'
import json,sys
t=json.load(open(sys.argv[1])); T=t['total']
L=sorted(t['lines'],key=lambda l:l['start'])
ov=[(a['id'],b['id']) for a,b in zip(L,L[1:]) if b['start']<a['end']-.3]
print(f"runtime {T:.1f}s, shots {len(t['shots'])}, overlaps {ov}")
assert 300<=T<=380, 'runtime out of range'
assert len(set(l['spk'] for l in t['lines']))>3, 'speakers missing'
PY
python3 tools/sheet.py $OUT/stills $OUT/contact_sheet.jpg 4 28 > /dev/null
node render.js --shots $SHOTS --vo $VO --video $OUT/video_noaudio.mp4 --res $RES --workers 4 --crf $CRF
python3 tools/mix.py $OUT/timeline.json $VO $PROD $OUT/mix.wav
ffmpeg -y -v error -i $OUT/video_noaudio.mp4 -i $OUT/mix.wav -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k -shortest -movflags +faststart $OUT/learn10x_$V.mp4
rm -f $OUT/video_noaudio.mp4
ls -la $OUT
