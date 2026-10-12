# 07 — VFX & post-processing stack

Applied in this order:

1. **Depth layers** — background (blur 2–6 px), midground subject (sharp), foreground (blur 10–25 px). OTS shoulders are always foreground-blurred.
2. **Bloom / glow** on lamps, windows, sun, screens, title text.
3. **God rays / light shafts** (additive wedges).
4. **Dust motes / particles** drifting slowly in light (1–3 px dots, 20–50 % opacity).
5. **Motion trails / speed lines** for fast objects.
6. **Colour grade** — lift shadows toward plum/indigo, gentle S-curve, warm highlights.
7. **Vignette** — radial darkening, ~35 % at corners.
8. **Film grain** — animated luminance noise, strength ≈ 6–8 (ffmpeg `noise=alls=7:allf=t`).
9. **Letterbox** — 62 px black bars at 1080p.

## Transitions seen in the reference
- Hard cuts (90 %+).
- Match cuts by shape/motion.
- Whip/zoom blur between related shots.
- Flash to white/blue for power moments.
- Fade to black only at act breaks/ending.

## Project additions (5-second future)
- **Preview activation:** thin blue ring expands across the eye/frame + chromatic shimmer + short white-blue flash.
- **Shatter return:** future frame breaks into triangular shards that fly outward, revealing the present.
- **Rewind:** 4–6 frames of horizontal streak blur with a reversed-motion feel.
