#!/usr/bin/env bash
# 4K (3840x2160) master: the SVG frames are re-rendered at 2x device scale (true 4K, not an upscale), muxed with the existing mix.
# usage: tools/build_4k.sh V6 [workers]
set -euo pipefail
cd "$(dirname "$0")/.."
VER=${1:-V6}; WORKERS=${2:-4}
FRAMES=$(python3 -c "import json;print(json.load(open('build/timeline.json'))['frames'])")
mkdir -p build/seg4k; rm -f build/seg4k/*.mp4
CH=$(( (FRAMES + WORKERS - 1) / WORKERS )); pids=()
for i in $(seq 0 $((WORKERS-1))); do
  S=$((i*CH)); E=$(( (i+1)*CH < FRAMES ? (i+1)*CH : FRAMES ))
  node tools/render.cjs --scale 2 --crf 16 --out build/seg4k/seg_$i.mp4 --start $S --end $E 2> build/seg4k/log_$i.txt & pids+=($!)
done
for p in "${pids[@]}"; do wait $p; done
ls build/seg4k/seg_*.mp4 | sort -V | sed "s|^build/seg4k/|file '|; s/$/'/" > build/seg4k/list.txt
ffmpeg -v error -y -f concat -safe 0 -i build/seg4k/list.txt -c copy build/silent4k.mp4
ffmpeg -v error -y -i build/silent4k.mp4 -i build/mix.wav -vf "noise=alls=3:allf=t,format=yuv420p" -c:v libx264 -preset slow -crf 20 -tune animation -c:a aac -b:a 256k -shortest -movflags +faststart renders/what_if_5_seconds_${VER}_4K.mp4
echo BUILD4K_DONE
