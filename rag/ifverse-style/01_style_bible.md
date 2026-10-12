# Style bible: the "Ifverse stickman what-if" look

Source: `What If Your Reaction Time Was 10x Faster - Ifverse (1080p, h264).mp4` (7:13, 24 fps, 1080p).
Use with `reference_frames/` (36 named stills) and `contact_sheets/` (one frame every 4 s).

The look in one sentence: **flat black stickman characters with a warm rim light, standing in moody, softly lit illustrated environments, framed like a live-action film (shallow depth of field, letterbox, vignette, grain).**

The magic is the contrast. The characters are as simple as possible. Everything else (light, depth, camera) is cinematic.

---

## 1. Characters ("the stickman rig")

| Element | Rule |
|---|---|
| Head | A perfect circle, filled near-black (`#0b0709`). Head diameter ≈ 2× torso width. No neck, or a very short neck stub. |
| Body | A single rounded rectangle or thick stroke for the torso. Limbs are **thick, round-capped strokes** (width ≈ 0.22 × head diameter) with one bend (elbow/knee). No hands drawn at a distance; in close-ups, hands become a simple mitten silhouette with 4 rounded fingers. |
| Fill | Everything that is "skin" is the same near-black. Characters are silhouettes. |
| Rim light | **Signature element.** A 3–6 px (at 1080p) warm peach/orange edge (`#f3b483` → `#ffcf9a`) on the side facing the key light. Built as a copy of the silhouette offset towards the light and clipped behind the black shape. Night or cool scenes use a cyan/blue rim (`#7fc8ff`). |
| Eyes | Small white shapes: ovals for neutral, arcs `^ ^` for happy, flat lines for unimpressed, big circles with a dot for shock. Eyes sit in the upper-front third of the head, offset toward the facing direction. Eyebrows are thick short white or black-on-rim strokes for anger or worry. |
| Mouth | A single white stroke: a smile arc, a flat line, an "o" for shock, or a wide open D-shape for shouting. Hidden in wide shots. |
| Clothing | Flat colour, one per character, always the same: hoodie, cap, lab coat or shirt. The clothing is the identity tag. Hoodies have **white drawstrings**, a kangaroo pocket and darker sleeve shading. |
| Shading | One darker tone on the side away from the light (multiply ~35 %). Never gradients on characters, apart from the rim light. |
| Scale cues | Characters are ~6 heads tall in wide shots. Close-ups crop head + shoulders. Extreme close-ups crop only the face circle (eyes fill the frame, sparkle glints `✦`). |

**Identity colours in the reference:** the hero wears a red hoodie (`#d7383a`), the friend a yellow cap (`#f2c230`), the trainer a green cap (`#5fd16a`), and the scientist a white lab coat with round glasses.

## 2. Environments

- **Flat-shaded, geometric, illustrated.** Buildings, rooms and furniture are simple polygons with 2–3 value steps and no outlines.
- **Base palette is dusk mauve/purple** (`#1e101b`, `#3a2229`, `#5a3a55`, `#694a53`), always lit by **warm amber practical light** (`#f2a65a`, `#ffcf8a`): windows, lamps, sunsets. Most scenes are "golden hour going purple".
- **Depth comes from layers.** Foreground (very dark, blurred), midground (the characters, sharp), background (lighter, desaturated, blurred, hazy). There's atmospheric haze between layers.
- **Light shafts / god rays** through windows, and radial sun rays behind heroes.
- **Bloom** on every light source: windows, lamps, the sun, screens.
- **Floating dust particles** (tiny soft dots drifting slowly) in interiors.
- Night scenes shift to blue/indigo (`#14112a`, `#2a2a55`) with cool rim light, plus one warm practical.
- Sports and competition spaces: big, empty, with floodlights (rectangular light clusters with bloom), a crowd made of tiny repeated stickman silhouettes, and a green field with perspective lines.

## 3. Lighting rules (what makes it "cinematic")

1. Every shot has **one clear key light direction**. The character rim light always comes from that side.
2. **Low-key exposure.** Most of the frame sits in shadow (values 10–35 %), with bright accents under 15 % of the frame.
3. **Warm key vs cool fill.** Warm light comes through windows and lamps, and shadows lean purple/blue.
4. **Vignette** on every shot (corners about 35–50 % darker).
5. **Light tells emotion.** Warm and golden means hope or success. Cool and blue means loneliness or night. A single spotlight means pressure or focus. Sepia means a flashback.
6. Key subjects are placed against the brightest part of the background, so the black silhouette reads instantly.

## 4. Camera and lens language

- Film framing. **Letterbox bars** (about 2.39:1, 60 px at 1080p) are present in most of the video.
- **Shallow depth of field.** Backgrounds are blurred in medium shots and close-ups. Foreground objects (an out-of-focus shoulder, a cup or a railing) are big, dark and blurred.
- **Over-the-shoulder** two-shots with a big blurred head in the foreground.
- **Slow constant camera drift** (push-in, lateral slide or gentle rotation) on almost every shot, so nothing is ever perfectly static. The speed is about 2–5 % of the frame per second.
- **Low hero angles** with sun rays for triumphant moments, and **top-down overheads** for tables, games and diagrams.
- Extreme close-ups of hands, eyes and objects for key actions.

## 5. Post-processing stack (apply in this order)

1. Depth-of-field blur per layer (BG 4–10 px, FG 8–16 px at 1080p).
2. Bloom: blur the brightest pixels and add them back screen-blended.
3. Colour grade: lift the shadows toward `#1a0f1a` (purple blacks) and add a slight warm highlight roll-off.
4. Vignette (radial, multiply).
5. Film grain (monochrome noise, ~4 % opacity, regenerated each frame).
6. Letterbox bars.

## 6. Information graphics (the "explainer layer")

- Clean thin white lines and **bold rounded condensed numerals** (`0.25 s`, `160 km/h = 0.4 s`, `11 m`).
- Diagrams sit *inside* the world (on a chalkboard, a TV or a scoreboard) or as a minimal overlay with a dimmed background.
- Arrow chains such as `EYES → BRAIN → MUSCLES`, small clocks and stopwatches, dotted trajectory lines, and score cards (`9 / 10`, `VICTORY x28`).
- UI/data screens: dark panel, red and white horizontal bars.

## 7. What to avoid (breaks the style)

- Outlines on characters. Gradients on characters. Detailed faces or anatomy.
- Fully lit, flat, high-key frames. Pure-white or pure-saturated backgrounds.
- Static, locked-off frames that sit longer than ~2 s with no camera drift.
- Generic glowing-brain imagery and random stock-style B-roll.
- Characters changing colour or silhouette between shots.
