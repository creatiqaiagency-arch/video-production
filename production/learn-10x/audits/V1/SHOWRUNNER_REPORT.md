# Showrunner Report: learn-10x V1

**Overall score: 4.0 / 10.** In stills V1 looks like Ifverse, but a pipeline bug makes it unwatchable as a video and the climax contradicts itself.

| Auditor | Score |
|---|---|
| Shot Rhythm | 4.5 |
| Logic & Sense | 4.0 |
| Lighting & Cinematography | 5.5 |
| Animation | 3.5 |
| Story Flow | 4.0 |
| *Mean* | *4.3* |

## Director's read
The script and art direction are already close to the bar: the power is shown first, then a rule with explicit limits, then escalation, a properly planted backup sensor, and a piano callback. What a first-time viewer actually experiences is different. The VO bug (placeholder 2.5 s lines, every speaker NAR) puts about 58 s of narration on top of itself, leaves every mouth shut, desyncs every line-anchored cut, and cuts the runtime to 4:50. That bug is **already fixed in the working tree**, giving a 345 s timeline with real speakers.

After the bug, Act 3 is where the film loses the viewer:
- The scoreboard reads ROUND 1 / 1:00 next to a 0:09 timer.
- The robot drives *through* the barrier in the payoff shot.
- Triumph music starts before anything is solved.
- The arena, a third of the film, is lit flat and cold, with a confetti crowd.
- Eli glares at Noah instead of ignoring him, so the falling-out reads as a fight.

Side by side with the reference contact sheets:
- Our rims are about half as thick.
- Close-ups sit dead centre instead of on thirds.
- OTS shots show faces instead of the backs of heads.
- The characters move like posed paper dolls.

V2 is a re-render with a clarity pass on Act 3. The script does not need rewriting.

**Working-tree status.** Beyond the VO fix, the lib groundwork for V2 is already in place but not yet used by the shot files. It includes the arena relight, dawn bedroom, bloom/burn/desat/sepia in post, thicker rims, head tilt/nod, the `busy` expression, `sitFacepalm`, `cheerBounce` and `walkPh`. Commit it, then wire it per shot.

## Keep (do not lose in V2)
- The look: purple-lifted blacks, letterbox, grain, and window god-rays (S007, classroom, music room).
- The match-cut chain S002 to S005, the S046 = S008 mirror, and the S105 key callback.
- The full backup-sensor plant: robot label, S060 diagram, S077/S094 overhead map.
- The S028 rule card with its limits.
- Wardrobe and prop continuity: the photo, the red+blue stripe, the cap.
- The time devices: S034 practice bar, S037 rep counter, S068 empty-bench time-lapse, S053 to S054 warm-to-cool.
- DOF on CUs, and screen direction in the hall shout.
- The beat/anchor timeline system.
- The "ten hours" ending.

## Conflicts resolved
- **Runtime vs narration cuts.** Cut L065 and L076, keep L077, and move L050 to S069. The cuts save about 12 s and the new holds and inserts add about 17 s, so V2 lands near 350 s (5:50). The build fails outside 330–360 s.
- **S001 hook.** It stays a single split-screen shot that ends on the "=" reveal, capped at 6 s. A CU of Eli is used only if the shot runs over.
- **S026/S108 callback.** S026 stays wide-eyed shock. S108 opens on the identical face and framing, then droops to deadpan.
- **S027 stamp.** It reads **6/7**, because 7 questions are visible on the sheet.
- **S092 sensor graphic.** Cut to 1.0 s with a flash-in, no picture-in-picture.
- **Workshop.** The new angles and the re-blocking (Eli seated and working) are done in one pass.
- **L042 to L043.** The interruption gets a -0.25 s gap plus an 80 ms fade. "Backup on the left" must stay audible.
- **Title.** It stays at about 16 s, with a 1 s music hold before L004. Moving it is a V3 question.
- **Arena light.** It stays cold through S095 and turns warm from S096, so the colour change is the payoff.

## Fix list for V2
Full code-level detail is in `showrunner.json`.

| ID | P | Shots | Fix (short) | Raised by | Status |
|---|---|---|---|---|---|
| F01 | P0 | ALL | VO bug: `buildTimeline(BEATS, window.VO)` and a render.js guard. Re-render, assert real dur/spk and no overlaps. | all 5 | **Done** (verify) |
| F02 | P0 | S043, S053/54, S103, S104, all `on:` cuts | Retime pass: split or mark the >6 s shots, cap locked-off shots at 2.5 s, re-check cuts, runtime guard 330–360 s | rhythm | todo |
| F03 | P0 | S074–S102 | One `finalClock(T)`. Scoreboard reads FINAL with a live clock. Timer stays visible through S082–S090. WINNER at 0:01. | logic, story | todo |
| F04 | P0 | S093 | Robot swerves around a barrier drawn in front of it (yaw −12°, depth arc). Blue LED fires *before* the turn. | logic, anim, light | todo |
| F05 | P0 | S051 | Add Eli at the desk so the cube challenge has a target. Student stands behind the desk. | logic | todo |
| F06 | P1 | B23–B37 | Music map: silence starts on L046. Tension pulse runs to S091. Triumph on S093. Soft piano bed under the apology. | story | todo |
| F07 | P1 | S087/88, S103/04, S068/69 | Cut L065 and L076. L050 moves to S069. S068 opens on music only. | story | todo |
| F08 | P1 | S070–S102 | Wire the arena relight. Flood rims L/R. Warm payoff from S096. Isolate Noah in S082. Light pool on the course table. | light | partial |
| F09 | P1 | S058–S069 | Workshop: Eli seated and working with `busy` expr. Noah points at his own diagram. Reverse, TOP, OTS and doorway angles. Darken time of day. | rhythm, logic, story, light | todo |
| F10 | P1 | S066–S068 | 5 s hold. Screwdriver at hand size, placed on the bench with hesitation and settle. Light darkens. | all but story | todo |
| F11 | P1 | S072, S076–77, S091–95 | Climax shots of 1.2–1.8 s with flash cuts. Speed cues on S072. Finish overshoot, slow-mo and heartbeat. | rhythm, anim, story | todo |
| F12 | P1 | S080–S090 | Wide and OTS geography shots. Two robot-stuck inserts. Shout anticipation, rise and shake. | rhythm, story, anim | todo |
| F13 | P1 | S087, S060 | Flashback reuses S059 framing, desat+sepia grade, grain, flash in/out. Fix the METAL label overlapping its caption. | logic, light, story | partial |
| F14 | P1 | dialogue CUs, S013–S038 | Lip sync check, head tilt/nod, expression "take" helper, blend the pose pops, rework the S013 kick and fall | anim, logic | partial |
| F15 | P1 | S006, S016, S053, S098, S103 | Stride-locked walks with `walkPh`. Walkers in S006 move or are dropped. | anim | partial |
| F16 | P1 | S001 | Hook shows the equal outcome: DAY 10 = 1 HOUR, "=" wipe, push-in, ≤6 s | story, rhythm | todo |
| F17 | P1 | S025, S027 | Timer reaches 06:00 and "6 MIN vs 60 MIN" pops. Sleeve enters from the frame edge. Full-size 6/7 stamp. | story, logic | todo |
| F18 | P1 | S019–S029, S020/S044 | Dawn bedroom for B08–B12. Fix desk scale. Head lies on the book in S044. | logic, light | partial |
| F19 | P1 | S074, S097, inserts | Announcer arm clears his face and gets a headset. Official holds the trophy. Sleeves run off-frame. Hands palms-down on the keys. | logic | partial |
| F20 | P1 | OTS + CUs | Backs of heads in OTS shots. CUs on thirds. Rims 12–16 px on CUs. | logic, light | partial |
| F21 | P1 | S098–S102 | Apology pauses and 3.5–4 s CUs. Noah reaction CU. Low two-shot for the bump. Sincere face in S098. | rhythm, story, anim, logic | todo |
| F22 | P1 | S106–S108 | Seated continuity with no hop. Callback face plus snap turn. Silence, sting, title on black for 3.5 s. | story, logic, anim | todo |
| F23 | P1 | global | Per-beat `minShot`: 1.3 s for action, 3.5–4 s for emotion. At least 15 shots under 1.8 s and at least 10 of 5–9 s. | rhythm | todo |
| F24 | P2 | inserts, field, bedroom, S007, school | Light polish: lamp pools, long field shadows, S007 double rim plus flare. Check bloom render cost. | light | partial |
| F25 | P2 | S037, S053/54, S073, S092–95 | No locked-off shots over 2.5 s. Default drift dx 30 / dz .05. | rhythm | todo |
| F26 | P2 | S036, S038, S047, S070, S095/96 | Flash and whip transitions | rhythm | todo |
| F27 | P2 | S050, S053/54, S058 | Real props in S050, obsession-swap smears and poses, faster typing in S058. Optional S054b. | logic, anim, story | todo |
| F28 | P2 | S035, S106 | VO-free piano moment, and two bars at the ending (only if runtime stays ≤360 s) | story | todo |
| F29 | P2 | S061 | L042 to L043 interruption (-0.25 s gap and fade) | story, logic | todo |
| F30 | P2 | S002–05, S027/28, S056/57 | Variety in the information shots: S005 pull-out, ECU between S027 and S028, split S057 | rhythm | todo |
| F31 | P2 | crowds, blinks | `cheerBounce` for crowds. Blink timing varied instead of a fixed period. | anim | partial |
| F32 | P2 | S048, S006 | Teacher's glasses on their own layer and slide down. 1 s music hold before the title. | logic, story | todo |

**Prediction:** with P0 and P1 done, V2 should score about **7.0** (range 6.5–7.5). The film becomes comprehensible, in sync and emotionally timed. Animation stays the ceiling at around 6, and getting to 8+ needs a real acting pass in V3.
