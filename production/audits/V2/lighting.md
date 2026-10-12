# Lighting audit — V2
SCORE: 6/10
VERDICT: V2 fixes the exposure pipeline, which was the biggest technical failure in V1. I measured all 252 sheet stills with the same script I used on V1 and on the 144 reference contact-sheet cells. Mean luma fell from 86 to 74 (the reference averages 55, with a 90th percentile of 84). Shots with more than 1 % of pixels clipped fell from 86/112 to 0/126. Shots with more than 5 % of pixels above luma 225 fell from 57 to 3. Windows are now orange gradients instead of cream slabs. Rims come from per-location key presets (`E.KEY`). The 3/4 hallway has floor light shafts and changes mood across the story: warm morning in s04, orange afternoon in s08, cold violet in s09–s10, dusk window in s10f. s14c, s08b, s11b/c and the sunset entrance are no longer blown out. The film's lighting now changes with the story, and V1's didn't. It does not pass as an Ifverse film yet, for three reasons. (1) The emotional climax (s15a–s17f) is the brightest stretch of the film: luma 92–119 and 76–84 % warm pixels. The top of each frame is a cream sky band, rays fan out from a sun that is never shown, the characters are fully front-lit, and there is effectively no cool fill (0–3 % cool pixels). The reference would play this beat darker, with backlit silhouettes. (2) The "cool overcast" confrontation (s12a–s13f) is not cool. It is lilac and mauve with warm lit windows, it measures 0–8 % cool pixels, and the "cold band of shadow between them" promised for s12c is not in the frame. (3) Several sets were left out of the overhaul: the one-point corridor still has saturated blue lockers and no floor pool, and s01d, s11d, s01j, s05b, s06b, s09b and s15e have no motivated light shape. Thought windows are only partly readable. The dark plate exists in code, but the violet overlay, the glow and bloom lift most windows back to mid-lavender behind pale script.

### Changelog verification (Light / Thoughts / Sets lines checked against the pack and engine)
| Claim | Verdict |
|---|---|
| Rim key-side only, ∝ size, colour = scene key | **Mostly true.** `character.js:237` offsets the rim by 0.013·h (2.5–18 px) toward `rim.dx`, and the presets are in `shots/_helpers.js:56`. **Exception:** `MAYA_RIM = {dx:-1, color:'#ffc87a'}` (`s09_suspicion.js:101`) gives Maya a warm rim on the LEFT in the cool violet hallway, where the window key is on the RIGHT (s10a–s10e, s16c). The 1.0→0.55 clothing falloff is real but faint: at sheet size the hoodie still reads flat. |
| Tone curve / knee, no clipped windows | **True.** 0 shots clip more than 1 %. The café façade windows are still hot yellow (`#ffd650`-ish) and cover about 50 % of s01c (luma 99). |
| Smaller sun halo, bloom re-thresholded | **True** for the entrance and gate. Bloom still catches the thought panels (see #4). |
| Dark backing plate under every thought | **Partly.** `fx.js` draws `rgba(26,12,42,0.74)`, then adds a `#a98bff` gradient (0.34→0.16), a 2.5 px glow stroke and an 18 px lavender text glow. In the renders s01b/g/k, s02a2, s11c, s12e and s14e show mid-lavender panels (about `#7d6bc8`) with `#f1eaff` script, so contrast stays low. Only the s16 SAID/THOUGHT plates are actually dark. |
| Perspective hallway with floor light shafts and ceiling lamps | **True** for the 3/4 hallway (s04a, s04a2, s04c, s05a, s08a, s08c) and the perspective cafeteria. **Not applied** to the one-point corridor (s04b, s04d, s08e, s10f). |
| Courtyard: three moods, `conf` cool → `warm` with rays + cool fill | **Moods exist, but neither end does what it says.** `conf` is lilac, not cool (0–8 % cool pixels). `warm` has rays but 0–3 % cool pixels, so the cool fill is not visible. |
| Morning variants (café, street, school) | **Weak.** s01e looks the same as the dusk façade. The s02b–s02f sky band is washed near-white. s03a is the most over-exposed non-memory shot in the film (luma 116, 9.3 % above 225). |
| Less-blown sunset entrance | **True.** s18a–s18e: 0.0–0.1 % above 225, down from 12–21 %. |
| Doors pushed open with light spilling (s05b) | **Barely on screen.** `open` starts at `M('doors')` and s05c cuts in at `M('doors')+0.5`, so the doors open only in the last ~0.5 s. Both stills (at 25 % and 75 % of the shot) show the doors shut. |
| s11d "shaft of moonlight" (shots.md) | **Not visible.** The room is a flat navy fill with no shaft on the bed. |

## Issues (most important first)
1. [s15a–s15d, s15f, s15g, s16a, s16e, s16f, s17a–s17f] RECONCILIATION IS OVER-BRIGHT, ONE-NOTE ORANGE AND FRONT-LIT. Mean luma is 106 (V1 was 103, the reference 90th percentile is 84). Warm pixels are 76–84 % and cool pixels 0–3 %. In the Leo-side reverse (s15b, s15d, s15f, s17b, s17c, s17e) a cream sky (`#f2dc9a`-ish) fills the top 40 % of frame, and the rays come from behind the tree with no visible sun. Both boys sit in front of the sun yet their clothing is lit at full saturation. → FIX:
   - Lower `warm`-mood exposure by 25 %.
   - Sky gradient `#7a4a6e` (top) → `#e0906a` → `#ffcf8a` (horizon), with the horizon kept below the head line.
   - Draw the sun disc `#fff0c8` r=50 with a bloom halo just past Leo's shoulder (screen x≈1250, y≈520 in the tree view), so the rays have a visible source.
   - Multiply clothing by 0.65 on the side away from the sun. Raise rim `k` to 1.6 for the CUs.
   - Add a cool fill `#6a7bc0` at 15 % (screen blend) on the shadow side of each figure and across the lower third of the frame.
   - Vignette at 40 %.
   - For the building-side reverse (s15c, s15g, s16a, s16e, s17a, s17d), darken the facade 20 % so Noah's head separates as a dark shape against the warm windows.
2. [s12a–s12e, s13a–s13f, s14a, s14b, s14d, s14d2, s14e] CONFRONTATION IS NOT COOL, AND THE REVEAL LOOKS THE SAME AS THE CONFRONTATION. The sky is lilac (`#8a6aa8`), every window glows warm, and the floor is mauve: 0–8 % cool pixels. s12c promises "a cold band of shadow between them", and it is not in either still. s14 (`reveal`) is visually indistinguishable from s12/s13. → FIX:
   - `conf` mood: sky `#4a4f78` → `#8a8fb0`, building `#4a4660`, windows off or at 30 %, floor `#5a5468`.
   - Add a diagonal shadow band `#1e2238` (multiply 55 %) across the courtyard floor between the two boys in s12b, s12c, s13a and s13f.
   - Rim preset `yardConf` → `#9fb6e0`. Vignette 45 %.
   - `reveal` (s14a–s14e): warm the horizon to `#e8a080` and fade the sun edge in from 0 to 40 % across s14, so the light change starts on "I got accepted".
3. [s04e, s01b, s01g, s01k, s02a2, s11c, s12e, s14e, s05c, s06d, s06e] THOUGHT WINDOWS STILL RENDER MID-LAVENDER WITH LOW-CONTRAST SCRIPT. The dark plate is drawn and then washed back out by the `#a98bff` overlay, the 18 px text glow and bloom. Readability depends on what sits behind the window: s11c sits on the bright sunset sky and s01k on the bright café window. The pink window in s04e sits over the hot hallway window strip. → FIX:
   - Overlay alpha 0.34/0.16 → 0.14/0.06.
   - Plate alpha 0.74 → 0.85.
   - Text glow `shadowBlur` 18 → 6, at 0.5 alpha.
   - Text `#ffffff` at ≥ 44 px (1080p).
   - Exclude thought layers from the bloom threshold pass.
   - Use the s16b–s16d SAID/THOUGHT plate as the visual template, since those are the only windows that are fully legible.
4. [s04b, s04d, s08e, s10f] ONE-POINT CORRIDOR LEFT ON THE OLD LOOK. The lockers are saturated `#2f5a8a` (34–40 % of the frame), louder than the characters. The end window is a flat pale-yellow pane, with no floor pool or rays, so Maya is not "in a pool of warm light". → FIX:
   - Lockers `#2c3550`, getting 30 % darker toward the floor.
   - Window pane gradient `#ffcf7a` → `#e8803a` with dark mullions.
   - A floor trapezoid `#ffd08a` (additive 25 %) running from the window base toward camera, with Maya's feet inside it.
   - A ray fan (additive 18 %, breathing) and dust motes.
   - s10f: make the pool `#d07050` and shrink it to Maya only. Vignette 50 %.
5. [s18a–s18e, s19_endcard] SUNSET IS A UNIFORM PINK WASH AND THE CHARACTERS ARE NOT SILHOUETTED. Clipping is fixed, but luma is ~100 with 70–80 % warm pixels and 0 % cool. The buildings are flat magenta (`#c0609a`-ish). In s18e the couple walk at screen x≈900, while the sun sits at x≈1500 behind the fence, so the "silhouetted walk-off toward the sun" never happens. → FIX:
   - Sky `#5a3a66` → `#d77a6a` → `#ffc98a`.
   - Buildings `#5e3a58` with horizon haze. Exposure −20 %.
   - s18e: move the sun to x≈1100, y≈760 (behind the walking pair). Render both characters `rim:{k:1.8}` with clothing multiplied ×0.25, so they read as black shapes with orange rims. Add long shadows toward camera.
   - s18b–s18d: clothing ×0.7 on the side away from the sun.
6. [s10a, s10b, s10c, s10e, s16c] MAYA'S RIM IS ON THE WRONG SIDE AND IN THE WRONG COLOUR. `MAYA_RIM` draws a warm `#ffc87a` rim on her left in a violet hallway lit by windows on the right. Her lavender top is also the brightest object in s10b/s10c (V1 issue #8, still open). → FIX: use `E.KEY.hallCool` (`dx:+1`, `#c9b8e8`) for every character in the s09–s10 cool hallway. Multiply Maya's top by 0.7 there and add a 20 % `#1a0f1a` radial darkening around her head in the CUs.
7. [s15e_memory] STILL BLOWN (V1 #4 open). Luma 150, 16.8 % of the frame above 225, flat white-grey sky over half the frame. → FIX: sky gradient `#f0a05a` → `#ffd59a` with a peak ≤ 220, a sepia grade, a low sun disc behind the kids and a vignette of 50 %. Keep the white flash to 3 frames at the in and out points only.
8. [s01d_wake, s11d_date] BEDROOM STILL HAS NO LIGHT SHAPE (V1 #9 open). s01d is described as "warm morning light" but is flat, with no beam across the bed. In s11d, shots.md promises a moonlight shaft, and the room is a flat navy fill dominated by the date card. → FIX:
   - s01d: sun trapezoid from the window across the bed and Noah (`#ffd89a`, additive 35 %), dust motes in the beam, room corners −40 %.
   - s11d: moon shaft `#9fb6ff` (additive 20 %) across the bed, a warm alarm-clock practical `#ffb36b` with bloom, room edges `#0e0c1c`. Shrink the date card to 70 % and darken its plate so it is not the brightest element.
9. [s03a_school, s02b_outside, s02b2_every, s02c2_bizthought, s02d_woman, s02f_real, s01e_enter] MORNING EXTERIORS ARE WASHED OUT AND NOT LEGIBLE AS MORNING. s03a measures luma 116 with 9.3 % above 225, and its pale peach-white sky covers about 40 % of the frame. The street shots have a near-white sky strip. s01e repeats the dusk façade, with hot yellow interior windows and no sky. → FIX:
   - Morning sky `#6f8fc8` → `#c8b8c8` → `#f0c890` with a peak ≤ 215. Exposure −20 % on s03a.
   - Daylight café windows: cool sky reflection `#9fb4d8` at 40 % over the pane, with the warm interior only in the lower third.
   - Long cool-blue shadows `#3a3a5a` on the pavement from a low sun on the left. Rim preset `morningL`.
10. [s05b_doors] THE DOOR-LIGHT REVEAL IS ALMOST OFF SCREEN. The frame is flat brown (luma 45) and the doors open only in the final ~0.5 s. → FIX: move `open` to start at 45 % of the shot (`E.seg(lt, D*0.45, D*0.75)`). Hold the bright interior, rays and floor trapezoid for at least 1.2 s before the cut, and silhouette Noah's back against it with a two-shoulder rim.
11. [s09b_laptop] BUSIEST BACKGROUND IN THE FILM, WITH NO KEY. Full-saturation multicolour book spines in an evenly lit library sit at the same contrast as the characters. → FIX: desaturate the books 60 % and darken them 35 %. Add one tall window or reading-lamp key on the right (`#ffd08a` cone, additive 25 %) with a pool on the table. DOF-blur the shelves 8 px. Let the laptop screen glow `#9fc4ff` on Leo's face as a cool practical.
12. [s03b_smug, s03e_B, s16d_worry; teacher in s03c, s03g, s16d] CLASSROOM KEY ONLY IN SOME ANGLES; TEACHER'S SHIRT STILL THE BRIGHTEST THING (V1 #7 partly open). s03c, s03d, s03f, s03i and s09a now have window rays, but the establishing wide s03b has none (luma 54, sd 25, muddy), and neither does the s16d replay. → FIX: add the same left-window ray fan (`#ffd59a`, additive 25 %) and desk pools to s03b and s16d. Set the teacher's shirt to `#cfc6dc`, exclude it from bloom, and apply the key-side clothing falloff.
13. [s06b_overhead] STILL UNIFORM (V1 #12 partly open). The counter plate is fixed, but there is no centre pool and the table rows are equally bright edge to edge. → FIX: radial pool +20 % on the centre tables, edges −50 %, 8 px tilt-shift blur on the top and bottom thirds.
14. [s01j_crash] FLAT AND MUDDY. Luma 53, sd 17 (the lowest contrast in Act 1). The feet and shards sit on a uniform brown wall. → FIX: low back-key from the café window behind the barista (`#ffcf7a`), long shadows from her feet toward camera, a specular glint on each shard, and a warm pool where the coffee spreads. Floor `#2a1c26`.
15. [s04f, s04h, s02f, s07d, s10d, s13e, s14b] SUBJECT CLOTHING IS STILL HOTTER THAN THE REFERENCE IN CLOSE-UPS. Red hoodie pixels peak at R≈226. The reference CU (key_117s) sits at about 150–170, and the 1.0→0.55 falloff is hard to see. → FIX: in CU/MCU only (h ≥ 900), multiply the costume base colour by 0.8 and steepen the falloff to 1.0 → 0.45. That way the head-and-rim silhouette, not the hoodie, is the strongest-contrast shape.

## Still open from previous version (if any)
- V1 #1 (no directional rim): **largely fixed.** Key presets and key-side offset rims are in. Still open: Maya's rim in s10/s16c (#6) and the faint clothing falloff (#15).
- V1 #2 (same courtyard light for confrontation and reconciliation): **partly fixed.** The states now differ (confrontation luma 69 / 13 % warm vs reconciliation 106 / 76 % warm), but confrontation is not cool and reconciliation has no cool fill and is over-bright (#1, #2).
- V1 #3 (clipped windows): **fixed.** 0/126 shots clip more than 1 %, down from 86/112.
- V1 #4 (large blown areas): **fixed** for s14c (now dark background, 0.2 %), s08b, s18e, s11b and s11c. **Open** for s15e (#7).
- V1 #5 (thought panels unreadable): **partly fixed.** s08d, s10b/c and the s16 plates are readable. Most violet windows are still mid-lavender (#3).
- V1 #6 (hallway one flat setup): **fixed** for the 3/4 hallway (floor shafts, darker lockers, per-day moods). **Open** for the one-point corridor (#4).
- V1 #7 (classroom muddy): **partly fixed** (#12).
- V1 #8 (subject a bright sticker): **partly fixed** (#6, #15).
- V1 #9 (bedroom): **open** (#8).
- V1 #10 (opening EWS): **partly fixed.** The window gradients are better, but the dusk sky in s01a/s01l still has no sun disc and the pavement is evenly lit.
- V1 #11 (violet void flat): **fixed.** s06a, s06f and s06f2 have a top spotlight cone, a radial falloff and depth-blurred panels.
- V1 #12 (s06b busy): **partly fixed** (#13).
- V1 #13 (s01g eyes broken frame): **mostly fixed.** s01h now has the café window background and a warm head rim. The mug reflection is just two tiny red ticks, so enlarge it into a backlit mug shape about 30 % of the iris.
- V1 #14 (doors no light): **technically implemented, effectively unseen** (#10).
- V1 #15 (sunset clipped): **clipping fixed.** Silhouettes and grade are still open (#5).

## What works (keep)
- The exposure and tone curve: highlights roll off with no flat-white areas anywhere in 126 shots. Keep the knee.
- The 3/4 hallway: receding lockers, ceiling lamps, diagonal floor light shafts and the per-day mood shift (warm morning in s04a/s05a → orange afternoon in s08a/s08c → cold violet in s09c–s10g → dusk in s10f). This is the best lighting work in the film.
- s08d: the hallway drops to luma 32 as Leo's thought lands, and the plate is dark and readable. Tense = darker, done right.
- s07a–s07d: the move from the cool violet corridor to the teal bathroom top-light, plus the bokeh-dark close-ups in s07a2/s07b.
- s06a, s06f, s06f2: the violet void now has a source, falloff and depth; s06g's cut to black stays.
- s03c, s03d, s03f, s03i, s09a: the classroom window ray fan raking across desks and the clock is exactly the motivated shape the bible asks for.
- s11b gate: low sun with rays behind the school, the foreground Noah silhouette and no clipping. Closest to an Ifverse frame in V2.
- s14c letter on a dark background with hands in silhouette: readable and no longer blown.
- s16b–s16d SAID/THOUGHT plates: dark, high-contrast, legible. Use these as the template for all thought windows.
- s13b: Leo's thought projected across Noah's face in white with the bright windows behind it is readable and graphic.
