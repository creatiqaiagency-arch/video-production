# Camera, editing and pacing (measured)

## Measured shot statistics (`shot_stats.json`)

- 7:13 runtime. **97 shots** after merging sub-0.5 s flashes (130 raw cuts, scene threshold 0.25).
- **Mean shot is 4.5 s and the median is 2.4 s.** Long shots (over 8 s) are almost always *moving-camera* shots (pans or push-ins through a space), so the eye still gets new information every 2–4 s.
- Histogram: <1.5 s: 24 · 1.5–3 s: 33 · 3–5 s: 15 · 5–8 s: 13 · >8 s: 12.

## Production rule for our videos (the "Shot Auditor" enforces this)

- **A new shot every 3–5 seconds** on average. The hard limits are 1.2 s minimum (except deliberate flash or impact cuts) and 6 s maximum. The exception is an *intentional emotional hold* that is marked `hold: true` in the shot list (the empty workshop, Noah leaving). A hold must still have slow camera motion or an in-frame change, and must not run over 9 s.
- Action and competition sequences run 1.5–3 s per shot. Emotional sequences run 4–7 s.
- Every shot has camera motion (drift, push or pan). Locked-off is allowed only for deliberate comedic "flat" framing, and even then for no more than 2.5 s.

## Shot vocabulary (seen in the reference)

| Code | Shot | Use |
|---|---|---|
| EST | Establishing wide: building or space at dusk, tiny characters | Opening a location |
| WS | Wide: full bodies, environment dominant | Action geography |
| MS | Medium: waist up, blurred BG | Dialogue, reactions |
| OTS | Over-the-shoulder with a big blurred black head in FG | Conversations |
| CU | Close-up: head fills about 50 % of the frame height | Emotion |
| ECU | Extreme close-up: eyes only, or hand, or object | Realisation, key actions |
| TOP | Top-down overhead | Tables, keyboards, tests, diagrams, robot route |
| LOW | Low-angle hero with sun rays | Triumph, comedy fake-hero |
| INSERT | Prop insert: a cup, a clock or a screen | Proof and details |
| GFX | Graphic overlay or diagram card | Rules, numbers |
| FLASH | Sepia or desaturated flashback | Memory payoff |

## Transitions

- Mostly **hard cuts**, often on action.
- **Match cuts** on shape: a round object becomes another round object.
- Quick white **flash frames** (2–4 frames) on power moments.
- **Dip to black** only between acts.
- Whip-pan blur (motion-blurred horizontal smear, 6–8 frames) for energetic location changes.

## Camera motion presets (engine `camera` keys)

- `drift`: scale 1.00 → 1.04, x ± 1 % over the shot (the default).
- `push`: scale 1.0 → 1.15 toward a target point (realisation, tension).
- `pull`: the reverse of push (reveal).
- `pan`: x moves 8–20 % across the shot (tracking).
- `shake`: 2–6 px noise for impacts and panic.
- `rack`: blur moves from the FG layer to the BG layer (rack focus).

## Pacing principle (from the breakdown)

Fast pacing means **changing what the viewer is mentally doing** (reading a face, predicting an outcome, comparing numbers or feeling a moment). It does not mean cutting every second. Let emotional beats breathe, and make action beats short.
