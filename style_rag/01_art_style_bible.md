# 01 — Art style bible

## One-line description
**Simple, pure-black stick figures with white cartoon faces, living inside detailed, softly lit, cinematic 2D vector
environments — shot like a live-action film (shallow depth of field, letterbox, grain, rim light).**

The contrast is the whole trick: characters cost almost nothing to draw, so all the craft goes into
environment, light, camera and timing.

## The non-negotiables (if any is missing, it doesn't look like Ifverse)

1. **Black silhouette characters.** Heads are perfect circles, bodies/limbs are thick black rounded strokes. Never outlined in black — they *are* black.
2. **White-only faces.** Eyes = white ovals/dots (or arcs when happy/smug), mouth = a white line/shape. No noses, no ears. Eyebrows only when emotional (thin white strokes).
3. **Clothing as flat colour shapes** laid over the black body (red hoodie with white drawstrings, yellow cap, white lab coat, green shirt). One signature colour per character.
4. **Rim light on every character.** A 3–6 px warm (peach/orange `#f0b27a`) or cool (ice blue `#9fd0ff`) edge on the side facing the key light. This is what separates black figures from dark backgrounds.
5. **Detailed environments built from flat shapes + gradients.** Buildings, windows with warm glow, awnings, street lamps, trees as dark silhouettes against a gradient sky. Low-contrast, desaturated, slightly purple shadows.
6. **Golden-hour / blue-hour palette.** Purple-mauve skies fading to orange at the horizon; interiors warm amber; night scenes deep indigo with sodium-orange lamps.
7. **Shallow depth of field.** Foreground objects and over-the-shoulder characters are heavily Gaussian-blurred; background is softly blurred; the subject is sharp.
8. **Letterbox.** Black bars top and bottom (measured 41/720 px → **62 px at 1080p**, ≈ 2:1 image).
9. **Film finish.** Fine animated grain, soft vignette, gentle bloom on light sources, floating dust motes.
10. **Camera that moves.** Slow push-ins, drifts, and crash-zooms. Static frames are rare and short.

## What it is NOT
- Not flat "explainer" motion graphics with white backgrounds.
- Not outlined cartoon characters with skin tones.
- Not high-saturation primaries. Saturation lives only in clothing accents and HUD/title text.
- Not fast random cutting: cuts are motivated (action, eyeline, reveal, punchline).

## Shape language
- Rounded everything: round heads, round limb caps (`stroke-linecap: round`), rounded window corners.
- Environments use mostly rectangles and perspective trapezoids; trees and bushes are clusters of circles.
- Scale contrast is used for drama: tiny figures in huge spaces (stadium, intersection) vs. a face filling the frame.

## Reference stills to study
`reference_frames/stills/026s_face_closeup_rim_light.jpg` (rim light + DOF),
`010s_ots_two_shot_dof.jpg` (over-the-shoulder blur),
`002s_establishing_wide_cafe_dusk.jpg` (environment detail vs. tiny figures),
`033s_title_card_gold_glow.jpg` (title treatment),
`382s_night_street_car_headlights.jpg` (night palette),
`145s_eyes_sparkle_extreme_closeup.jpg` (extreme close-up face).
