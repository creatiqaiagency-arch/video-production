# RAG: Ifverse-style animated "What If" videos

This folder is the long-term memory for producing videos in the style of **Ifverse – "What If Your Reaction Time Was 10x Faster?"** (reference file at the repo root). Read it before writing a shot list, building art or auditing a render.

| File | What it holds |
|---|---|
| `01_style_bible.md` | The complete art style: character rig, environments, lighting, lens, post stack, do/don't |
| `02_palette.json` | Canonical colour tokens (measured from the reference) used by the engine |
| `03_camera_editing_pacing.md` | Measured shot stats, the 3–5 s shot rule, shot vocabulary, transitions, camera presets |
| `04_characters_learn10x.md` | Character sheet and continuity rules for *Learn Anything 10× Faster* |
| `05_motion_sound_typography.md` | Animation principles, title and label typography, sound design |
| `06_auditor_rubrics.md` | The 5 auditors plus the Showrunner: rubrics, output format, the V1→V2→V3 loop |
| `07_story_principles_from_breakdown.md` | Story and attention mechanics distilled from the breakdown |
| `shot_stats.json` | Raw measured shot lengths and cut times of the reference |
| `shot_cut_times.txt` | Scene-detection cut timestamps (threshold 0.25) |
| `reference_frames/` | 36 named key stills (establishing, OTS, close-up rim light, title card, overlays, flashback, stadium…) |
| `contact_sheets/` | 6 sheets: one frame every 4 s across the whole video |

## How the reference was made (our reading)

It's 2D vector art (flat shapes) staged in **2.5D layers** with a moving virtual camera, depth-of-field blur, bloom, vignette and grain. A few shots (stadium aerial, ping-pong table, robot-course-like overheads) use simple 3D or perspective-faked geometry. Our engine reproduces this with **code-generated SVG** (layered vector scenes, per-layer blur, an SVG-filter post stack) rendered frame-by-frame in headless Chromium and encoded with ffmpeg. See `engine/README.md`.
