# Style RAG — "Ifverse stickman what-if" look

This folder is the permanent memory for the art style and production method of the reference video
`What If Your Reaction Time Was 10x Faster - Ifverse (1080p, h264).mp4` (7:13, 1920×1080, 24 fps).

Every new video in this style should be built **from these documents first**. When an auditor or a
fixer is unsure what "correct" looks like, the answer is in here, not in memory.

| File | What it answers |
|---|---|
| `01_art_style_bible.md` | The overall look: what makes a frame read as "Ifverse". Non-negotiables. |
| `02_color_palettes.md` + `palettes.json` | Exact hex values measured from the reference, per location/mood. |
| `03_character_design.md` | Stick-figure construction, proportions, faces, outfits, rim light. Cast sheet for the 5-second film. |
| `04_camera_and_shot_grammar.md` | Shot types, lens feel, framing rules, cutting rhythm (measured: 130 shots, mean 3.3 s). |
| `05_lighting.md` | Motivated light, rim light, glow, god rays, time-of-day recipes. |
| `06_animation_principles.md` | Posing, timing, easing, smears, anticipation, lip flap, blinks. |
| `07_vfx_and_post.md` | DOF blur, bloom, grain, vignette, letterbox, motion trails, transitions. |
| `08_typography_and_hud.md` | Title cards, timers, measurement graphics. |
| `09_sound_design.md` | VO style, SFX palette, music, mix levels. |
| `10_future_preview_language.md` | Project-specific: how "5 seconds into the future" looks (blue ghost system). |
| `11_auditor_rubrics.md` | The six-auditor review team, their 1–10 scoring rubrics and output format. |
| `12_production_pipeline.md` | How the video is actually built: SVG/JS renderer → Chromium → ffmpeg, ElevenLabs VO. |
| `pacing_data.json` | Every detected cut in the reference + shot-length stats. |
| `reference_frames/` | 27 annotated stills + 7 contact sheets (one frame every 4 s). |

## How to use (for a human or an AI)

1. Read `01` and look at `reference_frames/contact_sheets/` before designing anything.
2. Build a shot list using `04` (one new shot every 3–5 s on average; never hold a static frame > 8 s without camera motion).
3. Light every shot with a motivated source from `05`; pick the palette from `02`.
4. After every render, run the six auditors in `11`. Do not ship a version where any auditor scores < 7.
