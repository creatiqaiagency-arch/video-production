# 06 — Lighting & post-processing

## Lighting model
- **One dominant key light per shot** (sun, window, lamp, screen, spotlight). Its direction sets
  the rim-light side on every character.
- **Motivated light shapes**: god-ray fans from the sun/windows, cones under pendant lamps,
  trapezoid light pools on floors, spotlight circles.
- **Practical glow**: windows, lamps, screens get an additive soft bloom halo.
- Backlighting is the default: characters are dark against a brighter background.
- Emotional scenes = lower contrast, warmer, softer bloom. Tense scenes = cooler, harsher contrast,
  smaller light pools, darker vignette.

## Post stack (order)
1. **Depth of field**: Gaussian blur per layer by distance from focus plane (0–14 px at 1080p).
2. **Bloom**: blur a thresholded copy of brights, add at 25–40 %.
3. **God rays / light leaks**: additive radial gradients, slowly breathing opacity.
4. **Dust motes**: 20–60 particles, 1–3 px, drifting, brighter inside light beams.
5. **Bokeh**: soft discs in out-of-focus zones.
6. **Grade**: lift blacks slightly toward plum (`#120a14`), warm highlights.
7. **Vignette**: radial darken to ~35 % at the corners.
8. **Film grain**: monochrome noise 4–6 %, re-seeded every frame.
9. **Letterbox**: black bars 62 px top + bottom (1080p) — always on.
10. (Optional) slight **chromatic fringe** on fast impacts only.

## Lighting auditor checklist
- Can you name the key light? Does every character's rim face it?
- Is the subject the brightest-contrast area of the frame?
- Is there a light shape (rays/cone/pool) that gives the frame depth?
- Do warm and cool both exist in the frame?
- Is anything clipped to flat white or crushed to flat black over a large area?
