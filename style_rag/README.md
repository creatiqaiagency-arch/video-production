# Style RAG — "Ifverse" look for *What If…* animated films

This folder is the **single source of truth** for how our *What If…* films look, move and sound.
It was built by breaking down the reference video
`What If Your Reaction Time Was 10x Faster - Ifverse (1080p, h264).mp4` (7:13, 1920×1080, 24 fps)
frame by frame. Every production step (script → VO → animation → audit) must retrieve from here
before making decisions. If a choice is not covered here, decide it, then **add it here**.

| File | What it answers |
|---|---|
| `01_art_style.md` | What does the world look like? Shape language, rendering, texture |
| `02_color_palette.md` + `palette.json` | Exact colours (measured from the reference), per-mood palettes |
| `03_characters.md` | The stick-figure rig, faces, expressions, rim light, costumes, our cast |
| `04_environments.md` | How sets are built: layers, props, windows, skies, depth |
| `05_camera_and_shots.md` | Shot vocabulary, lenses, moves, framing rules |
| `06_lighting_and_post.md` | Rim light, god rays, bloom, DOF, grain, vignette, letterbox, grade |
| `07_animation_principles.md` | Timing, easing, acting, walk cycles, lip-flap, secondary motion |
| `08_typography_and_graphics.md` | Title cards, captions, data overlays, thought graphics |
| `09_pacing_and_editing.md` | Measured shot cadence, transitions, rhythm per act |
| `10_sound_design.md` | VO, thought-voice treatment, music cues, SFX, mix levels |
| `11_story_structure.md` | Why the format works: hook → demo → character → escalation → return |
| `12_thought_visual_language.md` | Project-specific rules for *Hear Everyone's Thoughts* |
| `13_production_pipeline.md` | How the film is made in code, and the auditor loop |
| `reference_frames/` | Contact sheets (1 frame / 3 s, timestamped) + full-res key frames |
| `reference_shot_log.csv` | Hard-cut timestamps detected in the reference |

## The look in one paragraph
Pure-black, round-headed stick figures with thick rounded limbs, a single coloured garment
(hoodie / cap / lab coat) and tiny white faces, set inside **painterly flat-vector dusk worlds**
— violet-to-peach skies, plum buildings, glowing amber windows. Every character carries a
**warm offset rim light** on the side facing the key light. Shots are composed like live-action
cinema: shallow depth of field with blurred foreground silhouettes, bokeh, god-rays, floating
dust, film grain, vignette and **letterbox bars (62 px top/bottom at 1080p)**. The camera almost
never sits still — slow push-ins, parallax slides, low angles, over-the-shoulders, top-downs —
and the composition changes every ~3 s.

## Golden rules (never break)
1. Characters are **silhouettes first**: black body `#0a080d`, white face marks only.
2. **Rim light on every character** that shares a frame with a light source.
3. **Depth in every shot**: at least 3 layers (blurred FG / sharp MG subject / soft BG).
4. **New composition every 3–5 s** (cut, or a camera move that clearly re-frames).
5. Light is warm (amber/peach) against cool shadows (violet/indigo). No neutral greys.
6. Text on screen is rare and purposeful; when it appears it glows cream `#ffefd7`.
7. Effects carry **consistent meaning** (see `12_thought_visual_language.md`).
