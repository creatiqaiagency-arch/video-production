#!/usr/bin/env bash
# Vertical 9:16 teaser cut from the long-form: blurred fill background, 16:9 frame in the middle, hook text on top,
# a curiosity-gap end card. usage: make_short.sh SRC START END OUT "HOOK LINE 1" "HOOK LINE 2" "END LINE 1" "END LINE 2"
set -euo pipefail
SRC=$1; SS=$2; TO=$3; OUT=$4; H1=$5; H2=$6; E1=$7; E2=$8
F=/usr/share/fonts/opentype/inter/InterDisplay-Black.otf
D=$(python3 -c "print($TO-$SS)")
ffmpeg -v error -y -ss $SS -to $TO -i "$SRC" -filter_complex "
[0:v]split[a][b];
[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.18[bg];
[b]scale=1080:-2[fg];
[bg][fg]overlay=0:(H-h)/2-40,
drawtext=fontfile=$F:text='$H1':fontsize=74:fontcolor=white:borderw=6:bordercolor=black@0.85:x=(w-tw)/2:y=330,
drawtext=fontfile=$F:text='$H2':fontsize=74:fontcolor=0xFFC24A:borderw=6:bordercolor=black@0.85:x=(w-tw)/2:y=420,
drawtext=fontfile=$F:text='FULL VIDEO ON THE CHANNEL':fontsize=44:fontcolor=white@0.9:borderw=4:bordercolor=black@0.8:x=(w-tw)/2:y=1500:enable='lt(t,$D-2.2)',
format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -preset slow -crf 19 -c:a aac -b:a 192k build/short_body.mp4
# 2.2 s end card: last frame frozen + darkened, curiosity line, CTA
ffmpeg -v error -y -sseof -0.05 -i build/short_body.mp4 -frames:v 1 build/short_last.png
ffmpeg -v error -y -loop 1 -t 2.4 -i build/short_last.png -f lavfi -t 2.4 -i anullsrc=r=48000:cl=stereo -filter_complex "
[0:v]eq=brightness=-0.35:saturation=0.6,
drawtext=fontfile=$F:text='$E1':fontsize=86:fontcolor=white:borderw=6:bordercolor=black:x=(w-tw)/2:y=820,
drawtext=fontfile=$F:text='$E2':fontsize=60:fontcolor=0xFFC24A:borderw=5:bordercolor=black:x=(w-tw)/2:y=950,
format=yuv420p[v]" -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 19 -r 24 -c:a aac -b:a 192k build/short_end.mp4
printf "file 'short_body.mp4'\nfile 'short_end.mp4'\n" > build/short_list.txt
ffmpeg -v error -y -f concat -safe 0 -i build/short_list.txt -c:v libx264 -preset slow -crf 19 -c:a aac -b:a 192k -movflags +faststart "$OUT"
echo done "$OUT"
