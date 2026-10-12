# 05 — Lighting

Lighting is what makes cheap stick figures feel cinematic. Every shot needs **one clear key light with a visible,
motivated source** (sun, window, lamp, headlights, monitor, preview glow).

## Recipes
| Situation | Key | Rim | Fill/ambient | Extras |
|---|---|---|---|---|
| Dusk exterior | Low sun at horizon (back-light) | Warm `#ffd29a`, 4–6 px, on sun side | Purple ambient | God rays from sun, lens bloom, birds |
| Warm interior (kitchen/café/gym) | Big window or pendant lamps | Warm `#f0b27a` | Brown-plum shadows | Light shafts through windows with dust motes |
| Night street | Sodium street lamps + shop windows | Warm orange from lamps, cool `#9fd0ff` from sky side | Deep indigo | Pools of light on the pavement, wet reflections, headlight cones |
| Arcade | Screen/machine glow | Cool cyan + magenta | Very dark | Coloured light spill on floor |
| Future preview | Cold blue overall | Ice-white `#d8f0ff` | Blue tint | Ghost glow, shimmer |

## Rules
1. **Subject is the brightest or highest-contrast area** in the frame (or is silhouetted against the brightest area).
2. **Rim light on the side facing the source.** If the light is behind the character, rim both sides.
3. Light pools: radial gradients on floors under every lamp.
4. Bloom: light sources get a soft radial glow (radius 2–4× source size, 30–60 % opacity).
5. Volumetric rays: semi-transparent wedges, additive, 6–15 % opacity, slowly rotating.
6. Darken frame edges (vignette) so attention goes centre.
7. Night ≠ black. Keep shadow values around `#100d1c`–`#211d30`, never pure black except letterbox.
8. Time-of-day must stay continuous within a scene (the climax is at 8:17 PM — blue hour/night everywhere in that scene).
