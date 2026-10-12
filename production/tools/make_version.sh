#!/usr/bin/env bash
# Build a full version of the film: timeline -> shot list -> mix -> render -> mux -> audit pack.
# usage: tools/make_version.sh V1 [workers]
set -euo pipefail
V=$1; W=${2:-4}
cd "$(dirname "$0")/.."
mkdir -p renders
[ "${SKIP_PREP:-0}" = 1 ] || python3 tools/build_timeline.py
[ "${SKIP_PREP:-0}" = 1 ] || (cd engine && node render.mjs --shotlist ../build/shotlist.json)
[ -f build/mix_$V.wav ] || python3 tools/mix_audio.py build/mix_$V.wav
(cd engine && node render.mjs --out ../renders/${V}_picture.mp4 --workers $W)
ffmpeg -v error -y -i renders/${V}_picture.mp4 -i build/mix_$V.wav -c:v copy -c:a aac -b:a 192k -shortest renders/WhatIf_HearThoughts_$V.mp4
python3 tools/audit_pack.py $V renders/WhatIf_HearThoughts_$V.mp4
cp build/shotlist.json audits/$V/pack/shotlist.json; cp build/timeline.json audits/$V/pack/timeline.json
ls -la renders/WhatIf_HearThoughts_$V.mp4
