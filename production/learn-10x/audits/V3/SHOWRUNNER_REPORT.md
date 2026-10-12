# Showrunner Report: learn-10x V3

**Overall: 7.0 / 10, up from 6.0.** V3 is the first cut whose story reads end to end without the picture contradicting it. What still holds it back is sound and acting at the exact moments that matter most.

| Auditor | V1 | V2 | V3 | Δ V2→V3 |
|---|---|---|---|---|
| Shot Rhythm | 4.5 | 6.5 | 7.0 | +0.5 |
| Logic & Sense | 4.0 | 6.0 | 7.0 | +1.0 |
| Lighting | 5.5 | 7.0 | 7.4 | +0.4 |
| Animation | 3.5 | 5.5 | 6.3 | +0.8 |
| Story Flow | 4.0 | 7.0 | 7.8 | +0.8 |
| *Mean* | *4.3* | *6.4* | *7.1* | *+0.7* |
| **Showrunner overall** | **4.0** | **6.0** | **7.0** | **+1.0** |

**Trend:** 4 → 6 → 7. Every auditor is up again, but the gains are halving. I predicted 7.5 and V3 came in at 7.0. The missing half point is fixes that were never checked against the render:
- **Half-applied:** arena haze and bloom, warm payoff sources, gestures, S065.
- **Fixes that broke something else:**
  - The `min` water-fill clamps every short shot back to 2.2 s.
  - G52 was marked done, but the gap was set on the wrong line.
  - The new music stops left digital-zero holes.

**New rule for V4:** an item is done only when it has been checked on the stills and the audio scan.

## Director's read
**What works now.**
- **Payoff logic:** one finish and one clock (0:02 → 0:01 → WINNER after the horn).
- **Swerve:** S093 goes around the same barrier the robot was stuck on.
- **Workshop turn:** reference-grade. The screwdriver is set down on a visible bench, Noah exits past a back-turned Eli, and the empty bench gets its time-lapse.
- **Shout mouths:** they read as yelling now.
- **Lip-sync:** amplitude is healthy.
- **S007:** the hero silhouette is back.
- **B35:** cut at action tempo.
- **Ending:** the callback lands dry.

**What breaks, in viewing order:**
1. **S054b:** a third arm flips the phone.
2. **S064 and S100:** the sad lines are spoken through a grin. The talk mouth is a D-smile regardless of expression.
3. **S088:** 1.95 s of digital zero in the middle of the climax.
4. **The triumph plays twice:** first on S091b while the clock still reads 0:05, then again from bar 1 on the horn.
5. **S091b:** still reads as a UI card.
6. **S095:** the wheel is already on the checker, crosses about 1 s before the horn, and is unlit.
7. **S102:** the reconciliation ends on Noah frozen mid-stride.
8. **S109:** the title card ends on an `ending_light` wrap-glitch.

**Structural ceilings:**
- **Arena:** about a third of the film, and it measures the same as V2.
- **Payoff light:** the warm payoff is a brown wash.
- **Rhythm:** more metronomic than V2 (CV .42 vs the reference's 1.35, 23 shots at exactly 2.20 s).

## Root causes I traced (showrunner check)
- **Double triumph:** `act3.js:201` B35 `{stop, at:.15}` kills tension on S091, then `act3.js:204` starts `triumph_resolve` on S091b.
- **Final-card glitch:** `mix.py:70` wraps every music segment with `% len(a)`. That is the S109 burst, and it can recur wherever a cue outlasts its file.
- **Missing interruption:** `timeline.js:21` applies `gap` *after* a line. G52 put `gap:-.25` on L043, so L042 was never cut off.
- **Clipped label:** S073's "ROUND 2" label is clipped by the top letterbox (contact sheet 3).

## Publishable?
**No, not as-is.** A viewer can follow it. But the final-card glitch, the S088 dropout, the early triumph and the third arm look and sound broken on YouTube, and the two most important emotional lines read as smiling. Every P0 is a one-shot or one-function change, about a day of work. **With P0 alone it is publishable (~7.5). With P0+P1 it is a confident upload.**

## The 5 highest-leverage V4 fixes
1. **Sound at the peaks (H01–H03).**
   - Remove the B35 stop and the S091b triumph so tension runs to S094b. The triumph then plays only on the horn.
   - Fill the dropouts in S088, S064 and S099 with crowd, room tone or heartbeat.
   - Stop `mix.py` from wrapping cues, and give S109 its `piano_clean_chord` button.
   - Add a dropout QC gate.
2. **Make the payoff images read (H04, H05).**
   - **S095:** the wheel starts 140 px before the line and creeps on `E.inOut` so the tread meets the first checker *on the horn frame*. Light it as a hero ECU: spot pool, rim, blue LED and a warm horn flare.
   - **S091b:** a crop of the real robot's rear-left corner, with the LED sputtering to life.
3. **Expression-aware talk mouth (H06).** In `rig.js face()`, sad and worried get an inverted-D, neutral gets an oval, happy keeps the D. This fixes every sad line in the film.
4. **Blocking that reads as nonsense (H07, H11).**
   - **S054b:** Eli flips the phone with his own hand, eyes on his book, in cold light.
   - **S061/S065:** the same back-turned, typing Eli in both shots, with the laptop facing him.
5. **Rhythm engine (H09).** Change the `timeline.js` min default from 2.2 to 1.6, then set explicit punch-cut mins and longer establishing shots.
   - **Targets:** CV ≥ .6, ≥ 15 shots under 1.5 s, ≤ 6 shots at exactly 2.2 s.

## V4 fix list
The full code-level fixes are in `showrunner.json` (44 items).

**P0, blocks publishing**
- **H01** One triumph only, on the horn. Delete the B35 stop and the S091b cue, and add a riser.
- **H02** Fill the digital-zero holes (S088, S064, S099, S008). Add a fade param on `stop` in `mix.py`, plus a dropout QC gate.
- **H03** Stop `mix.py` from wrapping cues. Move the S109 `ending_light` stop to 0 and add a `piano_clean_chord` button.
- **H04** S095 crossing synced to the horn, lit as a hero ECU, real-time ticks stopped at the cut.
- **H05** S091b as a real-robot corner crop, with a sputter ignite and LED-led light.
- **H06** Expression-aware talk mouth.
- **H07** S054b: Eli's own hand, a flat phone, eyes down, cold windows, no VO.
- **H08** Noah's rim ghost at telephoto: rimW / camZ, and gold rims when warm.

**P1, must land for an 8**
- **H09** `timeline.js` min floor 1.6, plus per-shot punch cuts and long establishing shots. Remove S072's duplicate `w`.
- **H10** The L043 interruption: put `gap:-.3` on **L042**.
- **H11** S061/S065/S068: back-turned, typing Eli; laptop lid-back; Noah FG on a consistent side.
- **H12** Arena light:
  - Haze only in the beams, with floor pools and a cool kicker.
  - `bloom:.9` on CUs.
  - Mid-layer glow for practicals.
  - Desaturated crowd.
- **H13** Warm payoff: a glow behind each lead, WARM .15, warm flood cores, and a trophy specular and lift (S097).
- **H14** S102: contact bump and shared laugh, walk blended to stand, a low wide. B37 minShot 2.4.
- **H15** Acting:
  - S099/S100: gestures and nods.
  - S090: two-hit point.
  - S066: the hand withdraws and the tool is bigger.
- **H16** S106: stool flush, hands to the keys, eased sit. S108: seated at the keys, matching S026.
- **H17** Split S085 into an OTS-high and the S085b CU. S089 a true low angle, S088 a high-angle push.
- **H18** Split S073 into a TOP and an S073b LOW reverse, fix the clipped label, and show ✓ on the pre-final scoreboards.
- **H19** S013 pratfall lands flat on his back, not in a headstand.

**P2, polish (H20–H44)**
- **Cutting and pacing:**
  - Simplify S092.
  - Flash grammar.
  - Split S079.
  - Reorder the insert run.
  - Escalate S086b.
  - Holds on S028/S060/S104/S103.
  - Vary the camera drift.
- **Acting:** the obsession montage, S058 hands, S093 back-up, S067 door-jamb exit, lip closure, field animation and kick contact.
- **Lighting:** course and lane light, paper inserts, the lamp fixture, corners, S078 thirds, school windows.
- **Small blocking:** S009, S044, S069, S051, palm-down keyboard hands, S001 hook props.
- **Sound:** S035 double music.
- **Optional:** the L077 TTS pickup.

## Conflicts resolved
- **Music from the switch to 0:01:** no new cue is needed. Deleting the B35 stop lets the tension cue that restarted on S089 run until S094b. The cue is 60 s long and has used 10 s by then.
- **S092:** keep it, but make it wordless and readable in one glance. The moral depends on it.
- **Flash grammar:** white flashes are only for entering and leaving the memory (S087/S088). In B35, the light bursts come from the scene itself: the LED ignite and the warm horn. S091b, S094b and S079c are marked `impact:true` to satisfy the rubric.
- **S091b:** use logic's real-robot crop, with lighting's values and animation's sputter.
- **Runtime:** do the rhythm reshaping, don't restore L076, and keep the 330–360 s guard. If V4 runs over 360 s, drop the S035 extension first.
- **S066:** the body stays still; only the hand leaves the tool.
- **S061:** compatible. Keep the plate and change only the blocking.
- **S102:** a low wide *and* a readable bump.
- **L077:** an optional pickup. No L076.
- **G52:** the story auditor was right that it never landed. The cause is the `gap` semantics.

## Do NOT lose
- **Payoff logic:** one monotonic clock, S094 stops short at 0:02, S094b 0:01, WINNER only after the horn.
- **B35:** the cut order S091→S091b→S093→S092→S094→S094b→S095 at about a 1.3 s mean, the S094b music stop, triumph on the horn.
- **Workshop turn:** the L046 hard stop, room tone, the in-frame set-down on S066, the back-turned Eli on S067 and the door, the empty bench on S068, and the `ENV.workshopRev` plate.
- **Plant/payoff chain:** S059 → S060 → S063 → L064 → sepia S087 → S090 → S091/S091b → S093 → S094, with the route-vs-barrier assert.
- **Callback:** S105 → S106b sleeves → a 1.7 s melody, so the punchlines play dry → S108 = S026 face → title on black.
- **Rig gains:**
  - The shout arch.
  - speakAmp smoothing: 7.5% of frames fully open, 5.5% big jumps.
  - Numeric sit, idle sway with `still`.
  - The S058 4.8 Hz arms.
  - Blink-masked expression switches.
- **Look:**
  - Purple blacks, letterbox, grain.
  - The S007 silhouette with bloom under the characters.
  - DOF on thirds, rim cap 16, S099 inward rims.
  - The cold → sepia → gold arc.
- **Rhythm gains:** 120 of 122 shots move, S072 speed, the five cutaways, 5:50 with 0 overlaps, the runtime guard.
- **Sound and props:** the music map, plus the continuity props: the photo, the team card, the stripes, the abandoned screwdriver.

## Prediction
If P0 and P1 are done **and verified on the render**, I expect V4 to land at **7.8**:

| Auditor | Predicted V4 |
|---|---|
| Story Flow | 8.3 |
| Logic & Sense | 8.0 |
| Lighting | 8.0 |
| Shot Rhythm | 7.8 |
| Animation | 7.0 |

My last two predictions overshot by 1.0 and 0.5, and animation is the slowest-moving dimension, so I've discounted. Getting to 8.5+ needs three more passes:
- The P2 acting pass.
- The course lighting.
- A reference-style long-take pass.
