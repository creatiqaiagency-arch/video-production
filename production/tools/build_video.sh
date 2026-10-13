#!/usr/bin/env bash
# usage: tools/build_video.sh V1 [workers]
set -euo pipefail
cd "$(dirname "$0")/.."
VER=${1:-dev}; WORKERS=${2:-4}
python3 tools/build_timeline.py
FRAMES=$(python3 -c "import json;print(json.load(open('build/timeline.json'))['frames'])")
mkdir -p build/seg renders
rm -f build/seg/*.mp4
CH=$(( (FRAMES + WORKERS - 1) / WORKERS ))
pids=()
for i in $(seq 0 $((WORKERS-1))); do
  S=$((i*CH)); E=$(( (i+1)*CH < FRAMES ? (i+1)*CH : FRAMES ))
  node tools/render.cjs --out build/seg/seg_$i.mp4 --start $S --end $E 2> build/seg/log_$i.txt &
  pids+=($!)
done
for p in "${pids[@]}"; do wait $p; done
ls build/seg/seg_*.mp4 | sort -V | sed "s/^/file '/; s/$/'/; s|file 'build/seg/|file '|" > build/seg/list.txt
ffmpeg -v error -y -f concat -safe 0 -i build/seg/list.txt -c copy build/silent.mp4
python3 tools/mix_audio.py
ffmpeg -v error -y -i build/silent.mp4 -i build/mix.wav -vf "noise=alls=3:allf=t,format=yuv420p" -c:v libx264 -preset slow -crf 19 -tune animation -c:a aac -b:a 192k -shortest -movflags +faststart renders/what_if_5_seconds_${VER}.mp4
ls -la renders/what_if_5_seconds_${VER}.mp4
ffmpeg -v error -y -i renders/what_if_5_seconds_${VER}.mp4 -vf scale=1280:-2 -c:v libx264 -preset medium -crf 26 -c:a aac -b:a 128k -movflags +faststart renders/preview_${VER}_720p.mp4
python3 tools/review_frames.py build/review/${VER} all renders/what_if_5_seconds_${VER}.mp4
python3 tools/make_shotlist.py build/review/${VER}/shotlist.md
echo BUILD_DONE
