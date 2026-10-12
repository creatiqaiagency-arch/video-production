# 12 — Production pipeline (how these videos are actually built)

The reference look is reproduced entirely **in code**: every frame is an SVG drawn by JavaScript as a pure function of time,
rasterised by headless Chromium, and encoded with ffmpeg. No hand-drawn assets, no stock footage.

```
script ──► ElevenLabs VO (eleven_v3, one clip per line)
              │
              ▼
  tools/analyze_vo.py      trim silence, detect phrase starts, 24 fps loudness envelope (lip-sync)
              │
  timeline_spec.py  ──►  tools/build_timeline.py   shots anchored to VO phrases ('N07.3', 'L02$+0.6')
              │                                     → build/timeline.json (+ timeline.js for the browser)
              ▼
  engine/*.js (SVG renderer)                       lib.js (math, filters, camera) · chars.js (stick-figure rig)
              │                                     env.js (locations) · fx.js (future-vision, HUD, titles)
              │                                     shots1-3.js (one function per shot: (localTime, dur, globalTime) → SVG)
              ▼
  tools/render.cjs (Playwright/Chromium)           4 parallel workers → JPEG frames piped into ffmpeg segments
              │
  tools/mix_audio.py                                VO + SFX + looping ambience + music, ducked under dialogue
              │
  tools/build_video.sh VX                           concat + film grain + mux → renders/what_if_5_seconds_VX.mp4
              │
  tools/review_frames.py                            3 keyframes per shot → labelled contact sheets for the auditors
```

## Key engine ideas (reuse for the next video)
- **Camera layers with parallax**: `layer(cam, svg, {p, blur})` — background layers use p < 1 so they drift and zoom less; `blur` gives depth of field.
- **Rim light as an SVG filter** (`fRim`): the silhouette alpha is offset toward the light, flooded with the rim colour and merged behind the figure. One filter = the whole Ifverse character look.
- **Future vision** (`futureWrap`): colour-matrix grade to cold blue + vignette glow + scanline + border + "+5 s" tag. Ghost characters use `ghost: true` (cyan fill + blue glow).
- **Pose library + keyframes**: `poseAt(t, [[0,'stand'],[.4,'pushOff']])`, plus procedural `walkPose(phase)` and `runPose(phase)`.
- **Lip-sync**: `talkOf('leo', globalTime)` reads the VO loudness envelope for whichever clip that character is speaking.
- **Shots anchor to speech**, not to fixed seconds, so re-recording a line automatically re-times the edit.

## Commands
```bash
cd production
python3 tools/analyze_vo.py            # after (re)downloading VO
python3 tools/build_timeline.py        # prints shot count / pacing stats / warnings
python3 tools/review_frames.py build/review/V1 all   # auditor contact sheets
tools/build_video.sh V1 4              # full render (≈5 min for 5:20 at 1080p on 4 cores)
```
