# Lighting audit — V1
SCORE: 4/10
VERDICT: V1 has the post basics the bible asks for: 62 px letterbox, background DOF on close-ups, window bloom, bokeh, and a few lighting moments with real intent (s03e desaturation, s07c bathroom top-light, s08d hallway darkening, the s04b one-point corridor, s11b/c sunset rays). The lighting model itself is missing, though. The reference lights every shot with one directional key: characters are dark silhouettes against a brighter background, with a thick warm rim on the side facing the key, and a light shape (rays, a cone or a pool) gives depth. In V1 most shots are lit from the front with no direction. Characters have a thin, even cream outline and fully lit flat clothes, light sources are flat near-white rectangles, and floors have no light pools. I measured the frames: the reference key frames average a luma of 45–90 with about 0 % clipping. V1's courtyard act sits at 95–110, the s18 sunset at 130–148, and several shots clip 15–31 % of the frame. The look is too bright and washed out to pass as an Ifverse frame. The two most-used sets, the hallway (~15 shots) and the courtyard (~30 shots), keep exactly the same light from the first beat to the last. So lighting tells none of the emotional arc (tense confrontation → warm reconciliation), and the courtyard frames have no cool tones at all. Ten or more thought panels are hard or impossible to read because they sit over blown-out windows.

## Issues (most important first)
1. [ALL character shots, worst in s03c, s03g, s04e, s04g, s10b–s10e, s12c–s17e, s18b–s18d] NO DIRECTIONAL RIM / NO BACKLIGHT MODEL. Characters get a thin 1–2 px cream outline of the same width all the way round, and their clothing is lit flat at full brightness. Nothing shows where the key light is. The reference uses a thick warm rim on the key side only, and the body falls off into shadow. → FIX: give every scene a `key = {x, y, color}`. Draw the rim as the character silhouette offset 5–7 px (1080p) TOWARD the key, filled with the key colour (sun or window `#ffb070`, violet power `#c79bff`, bathroom fluorescent or moon `#9fc4ff`), then draw the black body on top so only the key-side edge shows. Delete the uniform outline. Multiply clothing with a linear gradient running from 1.0 on the key side to 0.6 on the far side.

2. [s12a–s17f, the whole courtyard act, ~30 shots] SAME FLAT LIGHT FOR CONFRONTATION AND RECONCILIATION. Every shot has the same pale pink sky band, the same yellow window grid and the same tan floor. The frames measure 0 % cool pixels. The screenplay asks for "golden light" in s15a, yet s15a is identical to s12c. → FIX: build three lighting states.
   (a) Confrontation, s12a–s13f: sun hidden behind the building, sky `#4a3a66`→`#b9788a`, a long cool shadow `#2a1f3a` (multiply 60 %) across the gap between the boys, windows dimmed 50 %, vignette raised to 45 %.
   (b) Reveal, s14a–s14e: neutral, with the sun edge just appearing.
   (c) Reconciliation, s15a–s17f: low sun breaks out behind Leo, god-ray fan `#ffc27a` (additive 30 %, breathing), floor pools, warm rim on both boys, bloom up to 40 %.
   Each state adds a cool fill `#6a7bc0` at 15 % on the side away from the sun, so warm and cool both exist in the frame.

3. [s01a, s01c, s01k, s02b–s02f, s04a–s04h, s05a, s08a–s10g, s12–s17 windows] LIGHT SOURCES CLIPPED TO FLAT WHITE-YELLOW. Window panes are a single flat `#fff4c0`-ish fill: 5–9 % of the frame in s01a/c/k is ≥240 luma. Overall exposure is about 1.5× the reference. → FIX:
   - Fill each pane with a vertical gradient from `#ffcf7a` (top) to `#e8803a` (bottom). Add dark mullions and a soft interior silhouette (shelf or plant) at 20 %.
   - Cap the pane peak at about `#ffe2a8`, and let bloom supply the glow.
   - Add a global soft-clip so highlights above 235 compress.
   - Lower base exposure: Act 3 by 25 %, s18 by 35%.

4. [s14c_letter 31 % clipped, s08b_photo 17 %, s15e_memory 15 %, s18e_walkoff 15 %, s11b/s11c 7 %] LARGE BLOWN AREAS. → FIX:
   - s14c: paper `#efe4d2`, with a warm key gradient from the top-left and a 30 % shadow from Leo's hands. Background behind it `#3a2630`.
   - s08b: photo paper `#eadfcf`, and make the photo's internal sky `#f4c48a`, not white.
   - s15e: sky gradient `#f0a05a`→`#ffd59a`, peak ≤ 230, haze over the pink buildings so they are not flat `#e070b0`.
   - s18e/s11b/s11c: see #15.

5. [s04e, s04g, s08f, s09d, s10b, s14e, s12e, s17e, s01f, s01j, s16b–s16d] THOUGHT PANELS UNREADABLE. The panels sit directly on blown windows or the pink wall, with pale text on a pale translucent panel: "Wait… Noah", "He seems really upset", "I have to tell him", "stop asking" and "Please just be happy for me" are illegible in the stills. → FIX:
   - Panel fill `rgba(28,14,46,0.75)`, 1.5 px border `#c9a6ff`, text `#ffffff` at ≥ 28 px (1080p).
   - Before drawing a panel, darken and blur the area behind it (multiply 0.6, blur 8 px).
   - Never place a panel over a window rect. Move it to the wall or to the dark side of the frame, or dim the window under it by 50 %.
   - s16b–s16d: the THOUGHT box's pink-on-pink fill → use the dark panel above.

6. [s04a, s04c, s04f, s04h, s05a, s08a, s08c, s08e, s09c–s09f, s10a, s10c, s10f, s10g] HALLWAY: ONE REPEATED FLAT SETUP. Saturated locker blue (about `#3a64a8`) is the loudest element in the frame, and it fights the characters. The windows sit up high, but there are no light pools on the floor and no rays. The light never changes from morning to Thursday afternoon. → FIX:
   - Lockers `#2c3550` with a vertical gradient that gets 30 % darker toward the floor.
   - Skewed trapezoid floor pools under each window, `#ffd08a` additive 25 %, with dust motes inside the beams.
   - Vary by beat: s04 morning (bright, high sun, short pools). s08/s09 afternoon (pools longer and more orange, `#ffa060`). s10a–s10c Maya (warm and soft, bloom 35 %). s10f alone (dusk: windows `#d07050`, only one pool left, around Noah, vignette 50 %).

7. [s03a–s03h, s09a, s11a] CLASSROOM MUDDY, NO KEY. Mean luma is about 54 and the luma std dev is about 22, the lowest contrast in the film. Brown wall, green board, no source. The teacher's white shirt in s03c/s03g blooms to a clipped glow and becomes the brightest thing in frame. → FIX:
   - Add a tall window on the left wall with a god-ray fan crossing the room at about 20° down-right (`#ffd59a`, additive 25 %, breathing), and pools on the desks and floor.
   - Darken the far corners by 40 %.
   - Teacher shirt `#d9d2e6`, and exclude it from the bloom threshold.
   - s03i/s11a clock inserts: same window light raking across the clock face from the left, plus a soft shadow under the rim.

8. [s04e, s04g, s10b, s10d, s10e, s18c (Maya); s03c, s03g (teacher); s02a, s04f, s10g (Noah)] SUBJECT IS A FLAT BRIGHT STICKER, NOT A BACKLIT SILHOUETTE. Lavender, white and red clothing at full value reads brighter than the lit background, which inverts the reference's "dark subject on bright background" rule. → FIX: apply the issue-1 clothing gradient. In close-ups also add a 20 % darkening halo (radial, `#1a0f1a`) directly around the head, so the bright BG window becomes the backlight that the face silhouettes against.

9. [s01d_wake, s11d_date] BEDROOM HAS NO MOTIVATED LIGHT. s01d is lit flat, with a yellow window and a blue bed. s11d is a flat navy fill. → FIX:
   - s01d: morning sun trapezoid from the window (`#ffd89a`, additive 35 %) laid across the bed and Noah, dust motes in the beam, warm rim on Noah's head. Keep the violet shimmer as a secondary cool accent.
   - s11d: moonlight shaft `#9fb6ff` at 20 % across the bed, a cool rim on Noah, and a small warm practical (alarm-clock glow `#ffb36b` with bloom) for warm/cool contrast. Darken the room edges to `#0e0c1c`.

10. [s01a, s01c, s01k] OPENING EWS HAS NO SUN AND A FLAT SKY. The sky is a flat magenta band (`#d98ad8`-ish) with rays coming from behind the building, and the pavement is lit evenly. The reference opener shows a low sun disc, a graded sky and warm window spill on the street. → FIX:
    - Visible sun disc `#fff0c8` with a bloom halo in a gap in the roofline.
    - Sky gradient `#3b2a55` (top) → `#c7708a` → `#ffcf8a` (horizon).
    - Pavement darkened to `#2a1c26`, with warm spill trapezoids (`#ffb060` at 30 %) under each café window.
    - Vignette at 40 %.

11. [s06a_orbit, s06f_tighten, s06g_peak (first half), s05d_hold_on end] VIOLET VOID IS A FLAT SATURATED FILL. Electric `#5a3cf0`-ish everywhere, with no key and no depth. → FIX:
    - Radial background from `#4b2fa0` (centre) to `#120a26` (edges).
    - Single top spotlight cone on Noah, `#c9a6ff` additive 35 %, with a floor pool.
    - Panels act as practicals (each emits a 40 px soft glow).
    - Near panels DOF-blurred 6–10 px.
    - Vignette at 50 %, rising through s06f to sell the overload.

12. [s06b_overhead] BUSY AND UNIFORM. Hundreds of identical lit heads and bubbles at equal brightness, so nothing leads the eye and the "199 THOUGHTS" counter fights the pattern. → FIX:
    - Centre radial light pool (+20 %), edges darkened 50 %.
    - Tilt-shift blur on the top and bottom thirds (8 px).
    - Dark plate `rgba(0,0,0,0.5)` behind the counter text.

13. [s01g_eyes] READS AS A BROKEN FRAME. The frame is near-black with two flat beige discs (mean luma 34), so the face, light direction and context are all unreadable. → FIX:
    - Show the face fill `#0d0a10` against a softly blurred café-window background `#c7708a`.
    - Eye whites `#f2e8dc`, each with a warm catchlight `#ffe6b0` and a tiny reflected window rectangle. The reflected cup should be backlit.
    - Warm rim along the top of the head.

14. [s05b_doors] PROMISED "WARM LIGHT BEYOND" IS ABSENT. The doors are opaque brown with two small window squares, and no light spills when they open. → FIX: as the doors open, reveal a bright interior `#ffd38a` with bloom. Add god rays toward camera (additive 30 %) and a light trapezoid on the floor running up to Noah. Silhouette Noah's back, with a warm rim on both shoulders.

15. [s11b, s11c, s18a–s18e] SUNSET SKIES CLIPPED CREAM, CHARACTERS FRONTLIT. The sky reads as a near-white wash, no sun disc is visible, and the pink buildings are flat. Noah and Maya in s18b–s18d have fully lit clothing instead of sunset silhouettes. → FIX:
    - Sun disc `#fff0c8` low between buildings, behind the characters.
    - Sky gradient `#6b3f6e` (top) → `#e2876a` → `#ffc98a` (horizon), peak ≤ 235.
    - Buildings `#7a4a6a` with haze increasing toward the horizon.
    - Characters as silhouettes with warm rim `#ffb070` on the sun side and long shadows toward camera.
    - s18e: pure silhouette walk-off into the sun flare.

## Still open from previous version (if any)
None. V1 is the first audited version.

## What works (keep)
- 62 px letterbox is present and consistent; the edge darkening is mild but there.
- Background DOF on close-ups (s02a, s04e, s12d, s15a–s17e) separates the subject from the background well; keep the blur amounts.
- Bloom and bokeh on windows give the hallway and courtyard close-ups some atmosphere. Keep them, once the panes are no longer clipped.
- s03e_B: the full-room desaturation with the glowing "B" is an effective, motivated light change.
- s07c_bathroom / s07d_shout: cool teal top-light with a cone and floor pool. This is the most "lit" interior in the film; use it as the template for other interiors.
- s08d_cantkeep: darkening the hallway as Leo's thought arrives is the right instinct (tense = darker). Add a cool rim on Noah so he does not vanish into the background.
- s04b / s04d: the one-point corridor with an end window is a strong composition. Add the floor pool and rays that are supposed to put Maya "in a pool of warm light".
- s11b / s11c: god-ray fan and backlit Leo are the closest V1 gets to the reference. Fix the clipping and keep the idea.
- s06g_peak hard cut to black and the s16b–s16d dark plum revisit cards: controlled, low-key, readable (apart from the thought box).
