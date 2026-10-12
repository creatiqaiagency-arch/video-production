# Shot-Cadence audit — V2
SCORE: 6/10
VERDICT: V2 is a real step up from V1 on the problems a viewer notices most. All ten over-length shots in Acts 1–2 were split where V1 asked. The classroom, hallway and cafeteria now have reverse angles, OTS shots, one-point corridors, top-down and Dutch setups. Leo's courtyard coverage moved to the tree axis. The overload peak is now a real burst of cuts. Most of the V1 runs of 4–5 sub-3 s shots are gone.

The headline numbers in the CHANGELOG are only partly true, though, and the method behind them has created new problems:
- **"97 strictly in 3–5 s".** This only reproduces with a ±0.05 s tolerance. At ±1 frame at 24 fps (0.042 s) I count 95.
- **"110 (87%) within the rule".** This counts eight impact beats of 0.79–0.98 s and a 2.75 s "montage" as compliant, because `E.retime` and `audit_pack.py` use a self-declared 0.8 s floor (and a 3.2 s ceiling). The client rule is 1–2.5 s. It also counts s17e, whose 4% push is not visible. Applying the client rule, the real figure is about **101/126 (80%)**.
- **Cut placement.** `E.retime` has no term for VO phrase boundaries. I re-ran the engine with `noRetime` to get the planned cuts. The optimiser moved 88 cuts, pushed **30 clean phrase-boundary cuts into the middle of a word or phrase**, and fixed one. V2 now has **33 cuts at least 0.15 s inside a spoken segment**, against 20 in V1. They include the key thought "I have to tell him", "...Doing what?", "overseas", "FULL scholarship?", "I was TRYING to" and "people's thoughts".
- **Uniform rhythm.** Because every short shot was stretched to the 3.0 s floor, **60 of 126 shots (48%) now run 2.90–3.10 s**. There are runs of 5–7 identical-length shots (s09f→s10e). The edit ticks like a metronome instead of breathing like the reference, whose cuts range from 0.5 s to 40 s around a 3.1 s median.
- **Act tempo.** The act rhythm is still inverted (V1 issue 15). Act 1 averages 2.73 s, Act 2 3.25 s and Act 3 3.39 s (median 3.08 s, only 8 of 42 shots at 4 s or longer), against a 4–6 s Act-3 target. Act 3 is now cut faster than in V1 (3.49 s).
- **Repeated framings.** These remain: Noah's courtyard singles are the same centred frontal CU against the same blurred building windows nine times (s15g→s16a back to back). The café façade is used five times in the first 35 s (s01l→s02a back to back). Several shots labelled HIGH or LOW read as eye-level in the frames.

## Issues (most important first)
1. [optimiser; dialogue cuts s02e/s02f, s08d/s08e, s08e/s08f, s10c/s10d, s12d/s12e, s12e/s13a, s13d/s13e, s14a/s14b, s17a/s17b, s17c/s17d, s17d/s17e, s18c/s18d] PROBLEM: `E.retime` (engine/core.js) slides cuts up to ±0.7 s using duration cost only. It moved 30 planned cuts that sat in pauses into words. Examples:
   - The planned s08f cut was at 180.28. It now lands at 180.97, mid "I have to | tell him", so the film's key thought starts on the wrong shot.
   - s14b was planned at 288.32. It now lands at 287.62, mid "over|seas".
   - s17b was planned at 351.87. It now lands at 351.52, mid "FULL schol|arship?"
   - s17d was planned at 359.33. It now lands at 358.63, mid "I was TRYING | to".
   - s13a was planned at 266.11. It now lands at 266.81, so Noah's accusation starts on Leo's OTS.

   → FIX (engine): in `E.retime`, add to `cost` a penalty for any candidate cut `ti` that lies inside a segment of `E.TL.lines[*].segs`, with a 0.06 s margin: +30 for spoken or thought lines, +8 for narration. When a shot can only reach 3 s by cutting into a word, let the timeline builder add up to 0.3 s of air before the next line instead of moving the cut.

   → FIX (exact retimes if done by hand):

   | Cut | New time | Resulting durations |
   |---|---|---|
   | s02e/s02f | 55.30 | |
   | s08c/s08d | 175.50 | s08c 3.06 |
   | s08d/s08e | 178.55 | s08d 3.05 |
   | s08e/s08f | 180.50 | s08e 1.95, a "What?" punch beat |
   | s08f/s09a | 185.45 | s08f 4.95 |
   | s10c/s10d | 219.75 | s10c 3.67 |
   | s10d/s10e | 222.15 | s10d 2.40, outburst beat |
   | s10e/s10f | 225.45 | s10e 3.39 |
   | s12c/s12d | 260.60 | |
   | s12d/s12e | 263.45 | |
   | s12e/s13a | 266.25 | s12e 2.80, s13a 3.54 |
   | s13d/s13e | 278.50 | s13d 1.11 |
   | s13e/s13f | 281.30 | |
   | s14a/s14b | 288.25 | s14a 4.06 |
   | s14b/s14c | 290.90 | s14b 2.65; "...What?" plus 1.4 s of reaction |
   | s17a/s17b | 352.00 | s17a 3.87, s17b 2.50 |
   | s18c/s18d | 379.42 | |

   For s17c/s17d/s17e, see issue 4.
2. [s01h 0.80, s01j 0.80, s03d 0.93, s03f 0.98, s04c 0.81, s04h 0.85, s06c 0.81, s13d 0.79, s06g 2.75; inner cuts of s03h and s06g] PROBLEM: These beats break the client's 1–2.5 s exception, yet cadence.md reports them as compliant, because `E.BEATS` limits are [0.8, 3.2] in `E.retime` and ≥0.8 in `audit_pack.py`. The montages hide even shorter cuts:
   - s03h is three beats of about 0.67 s, and beats 2 and 3 use the same front chalkboard setup.
   - s06g is ECU eyes, back of head and window wall at about 0.67 s each, then black.
   - s06c cuts away at 132.60, before the punchline "Not so much" ends (132.79).

   → FIX: set the beat limits to [1.0, 2.5] in both `E.retime` and `audit_pack.py`. List montage sub-cuts as their own shotlist entries so they are measured. Then retime:
   - **s01g–s01l:** s01g/s01h → 23.10; s01h/s01i → 24.15; s01i/s01j → 25.25; s01j/s01k → 26.30; s01k/s01l → 29.30; s01l/s02a → 32.30.
   - **s03c–s03g:** s03c/s03d → 69.95; s03d/s03e → 71.10 (s03d 1.15); s03e/s03f → 74.30; s03f/s03g → 75.45 (s03f 1.15).
   - **s03h:** extend to 81.48, starting s03i at 81.48. That makes three 1.0 s beats. Give beat 3 a low angle under the desk row for the fist-bump.
   - **s04h:** run it to 107.60 (1.0 s), then start s05a.
   - **s06c:** 131.79–133.05 (1.26 s, punchline plus air). s06d/s06e → 135.85.
   - **s06g:** start at 145.30 and split it into ECU eyes 145.30–146.30, top-down hands 146.30–147.30, then window wall plus black 147.30–148.25.
3. [Act 3 overall; runs s12c→s13a2, s15a→s15b, s16e→s16f, s17c→s17d; also s09f→s10e] PROBLEM: Act 3 is still cut faster than the overload act. Its mean is 3.39 s, its median 3.08 s, and 19 of 42 shots run 2.85–3.15 s. Across the film, 60 shots sit on the 3.0 s grid, so the reconciliation has the same tick as the hallway gossip. → FIX: merge into moving holds of 5–7 s:
   - (a) s15a+s15b: one profile two-shot, 303.74–309.80 (6.06 s), with a slow push 1.00→1.10, with Leo's "Yeah. Pretending everything was normal..." played in it.
   - (b) s16e+s16f: one continuous crane-out, 341.71–348.13 (6.42 s). Start on Noah's CU for "He could hear what people were thinking" and pull back to the golden wide for "He still didn't know what they meant".
   - (c) s17c+s17d: one two-shot push, 354.50–360.98 (6.48 s), see issue 4.

   Act 3's median then rises to about 3.5 s, and three frontal Noah CUs disappear. Keep the confrontation (s12c–s14b) at about 3 s, where fast cutting fits the drama.
4. [s13b(end), s13e, s14b, s15c, s15g, s16a, s16e, s17a, s17d] PROBLEM: V1 issue 1 is half-fixed. Leo got the tree-axis OTS, but every Noah single is still the same centred frontal CU/MCU at eye level against the same blurred building windows. s15g→s16a is CU→CU from the same setup, 9.4 s of one framing broken by a jump cut, and cadence.md flags it. s17d→s17e also clips "Thank god" (361.38 lies inside 361.11–361.82). → FIX:
   - **s14b, s15c, s17a:** OTS from behind Leo's shoulder, with Leo's blurred green cap in the right foreground (the s12d setup).
   - **s15g:** a true left profile with a sun rim, Noah looking down at the letter.
   - **s16a:** keep it as the only frontal push.
   - **s16e:** merge (issue 3b).
   - **s17d:** fold into s17c. Noah's "...I'm happy for you, man" plays in the closing two-shot. s17e then starts at 360.98, before "Thank god".
   - **s13e:** make it a real low angle: camera at chest height, horizon below the lower third, tilted up 10°.
5. [s01a, s01c, s01e, s01l, s02a] PROBLEM: The same frontal elevation of the café façade (awning, yellow windows, flat parallel plane) is used five times in the first 35 s. s01l (title) → s02a is the same setup back to back. s02a was asked for in V1 as a "3/4 MS of Noah stumbling against the café window". It is labelled MS, but it renders as a wide with a tiny Noah. → FIX:
   - **s02a:** camera on the pavement 30° off the façade at Noah's chest height. Noah is large in frame left, his shoulder against the glass, and the window row recedes to a vanishing point on the right.
   - **s01e:** a low angle from across the street, with Noah walking into the foreground toward the door.
   - **s01c:** a 3/4 angle on the bench, the boy in the foreground and the girl's glance toward the lens.
6. [s01d, s01d2, s01e, s01f; s02b, s02b2, s02c, s02c2, s02d, s02e] PROBLEM: Two runs of short shots and flat framings:
   - s01d–s01f are four non-beat shots of 2.65–2.76 s in a row, and s01d/s01d2 cuts mid "Noah woke up" (12.19).
   - The street sequence is shot side-on, parallel to the storefronts. s02b and s02b2 are near-identical flat wides. s02c2→s02d→s02e are three eye-level MCUs of passers-by against the same storefront wall. s02d is labelled LOW but is eye-level.

   → FIX:
   - Merge s01d and s01d2 into one shot, 9.43–14.30 (4.87 s): the sit-up, then a push-in to CU as the violet rings ripple on "exactly that power". s01e then runs 14.30–17.49 (3.19 s).
   - Make s02b2 a real high angle (camera tilted 25° down, street receding on a diagonal).
   - Make s02d a real low angle (camera at knee height, sky behind the woman).
   - Shoot s02e as the snap-zoom from over Noah's shoulder.
   - Retime: s02b2/s02c → 44.75; s02c/s02c2 → 47.35; s02c2/s02d → 50.35; s02d/s02e → 52.40 (s02d 2.05 s, the oven gag as a beat).
7. [s02d, s09d, s10g, s13e, s15d] PROBLEM: These shots are typed LOW or HIGH in the shot list, but the stills show an eye-level camera with the horizon near the middle of frame. That inflates the variety on paper (a V1 issue 4 and 13 fix that did not land on screen). → FIX:
   - **HIGH shots:** put the horizon or vanishing point in the top 15% of the frame, have the floor fill at least 60%, and scale the characters down toward the bottom.
   - **LOW shots:** put the horizon below the lower third and tilt up 8–12°.
   - **s10g:** looking down from ceiling height, about 60°, with Noah small in the centre of the floor.
8. [s10a, s10b, s10g, s10g2] PROBLEM: s10a and s10b are the same OTS over Maya's shoulder onto Noah, with the same lockers and lens and only slightly tighter: a back-to-back near-identical framing. V1 issue 8 (merge or re-angle) is not done. s10g→s10g2 cuts in on the same axis against the same background, which reads as a jump cut. s10g2 is described as a profile but renders 3/4 front. → FIX:
   - **s10b:** a profile two-shot down the corridor. Both stand in profile with Maya's warm thought between them, and Noah's "I'm fine" plays in it.
   - **s10g:** the true overhead from issue 7.
   - **s10g2:** a true right-profile CU with the window light behind him.
9. [s17e_choose] PROBLEM: This 5.31 s MS is in `E.HOLDS`, but its camera is `E.push` 1.00→1.04. In the 11 frames I pulled from the render there is no visible movement, so it does not qualify for the moving-hold exception (V1 issue 3, still open for this shot). It also starts mid "Thank god". → FIX: start it at 360.98 (issue 4) and give it a slow arc: `dx` 140 px plus z 1.00→1.12, eased. Or end it at 365.90 and start s17f's hug earlier, so the shot is 4.9 s.
10. [s12e, s13a2, s14a, s14d2, s15b; s14e, s15d, s15f, s17b] PROBLEM: Leo's coverage now has a second axis, but it is one OTS setup (Noah's black head on the left, Leo centre-right, tree and skyline behind) used five times, plus one frontal single used four times. s15d→s15e→s15f returns to the same framing as before the memory. → FIX:
    - **s14a:** a low-angle insert of the letter coming out of the bag (hands and letter only).
    - **s15d:** the real high angle (issue 7).
    - **s15f:** a tighter CU with a 3/4 turn toward camera left and a shallow 3/4 skyline. Then cut it on the sound at 320.85, before "I wanted you".
11. [s12a, s12b, s13f, s14d, s16f, s17f] PROBLEM: All the courtyard wides are taken from the same position (tree left, building facing). s12a→s12b is a same-axis creep-in, so the cut reads as a jump. → FIX:
    - **s12b:** a rear 3/4 tracking shot behind Leo as he walks up to Noah.
    - **s13f:** keep it, but from a higher crane position, so "the gap" is a top-down that shows the empty ground between them.
    - **s16f:** if not merged per issue 3b, take it from the tree side, with the sun behind the pair.
12. [s04b, s04c, s04d; s04e–s04h] PROBLEM: s04b and s04d are near-identical one-point corridor framings (Maya small in the window, same lens). With only a 0.81 s insert between them, the push reads as a jump back to the previous shot. s04e/s04g and s04f/s04h are two exact repeat setups in a four-shot ping-pong. → FIX:
    - **s04d:** a lower camera at Noah's hip height and a longer lens (z 1.6→2.2), so Maya's window fills the top third and Noah's shoulder fills the left edge.
    - **s04b/s04c:** make s04c 92.90–94.40 (1.5 s, on "too scared to talk to her for almost a year").
    - **s04g:** push in to a CU on Maya, so it differs from s04e.
13. [s05c, s05d, s06c, s07a; S04–S10 hallway] PROBLEM: About 30 shots use the same 3/4 hallway (lockers on the left, windows on the right, same vanishing point). The cafeteria beats s05c/s05d/s06c render with hallway walls and windows behind Noah, even though s05b pushed through the CAFETERIA doors. → FIX:
    - Shoot s05c, s05d and s06c in the `cafPersp` set, with long tables and the serving counter behind Noah.
    - Mirror the hallway axis (lockers on the right) for the S09–S10 suspicion scenes, so Act 2's second half reads as a new space.
14. [narration cuts s01a/s01b, s03h/s03i, s05a/s05a2, s07a2/s07b, s09b/s09c, s09c/s09c2, s09f/s09f2, s11c/s11d, s16a/s16b, s16b/s16c, s16c/s16d, s18a/s18b] PROBLEM: These narration cuts land mid-phrase. Several were correct in the planned edit and the optimiser moved them: s07b was at 153.54 and now sits at 154.24; s16b was at 333.84 and now sits at 333.14, still clipping "people's thoughts" (V1 issue 12). Two V1 fixes were not applied: s01b at 4.05 and s09c at 191.45. → FIX (all on pauses):

    | Cut | New time | Resulting durations |
    |---|---|---|
    | s01a/s01b | 3.95 | s01b 3.95–6.45, a 2.5 s teaser beat |
    | s05a/s05a2 | 111.45 | |
    | s05a2/s05b | 114.45 | |
    | s05b/s05c | 117.15 | |
    | s07a2/s07b | 153.55 | s07a2 2.28 "Nothing." beat; s07b 4.41 |
    | s09a/s09b | 188.45 | |
    | s09b/s09c | 191.38 | |
    | s09c/s09c2 | 194.55 | |
    | s09f/s09f2 | 207.50 | |
    | s09f2/s10a | 210.40 | |
    | s11c/s11d | 246.95 | |
    | s16a/s16b | 333.75 | s16a 6.86 s, a moving hold |
    | s16b/s16c | 336.20 | |
    | s16c/s16d | 338.00 | |
    | s18a/s18b | 373.65 | |

    With these times the three replay cards follow "every passing fear / every unfinished sentence / every private worry". Shorten the caption text on s16c so it reads in 1.8 s.
15. [s18a, s18b, s18e, s19_endcard] PROBLEM: The ending uses one frontal setup of the school entrance and fence for four of six shots. s18a→s18b is a straight cut-in on the same axis, and s18e→s19 is an identical framing. → FIX:
    - **s18b:** a low 3/4 angle on the steps, with Maya's shoulder in the foreground as Noah approaches.
    - **s18e:** a rear long-lens shot of the pair walking toward the sun, so the end card's frontal wide is new.

## Still open from previous version (if any)
- **V1 #1 (courtyard identical singles): partly fixed.** Leo now has the tree-axis OTS. Noah's singles are unchanged (issue 4 above).
- **V1 #2 (10 shots over 5 s in Acts 1–2): fixed.** Every split was made: s02a2, s02b2, s02c2, s05a2, s06f2, s07a2, s09c2, s09f2, s10d, s10g2. s08a is 5.03 s, within a frame.
- **V1 #3 (locked Act-3 holds): mostly fixed.** s12a pushes, s14d and s15b were split, and s16a has a real 1.00→1.35 push. **s17e is still effectively locked** (issue 9).
- **V1 #4 (flat locker wall): fixed** with the 3/4 hallway, the corridor axis on s08e/s10f and the OTS shots. The new risk is set overuse (issue 13).
- **V1 #5 (repeated head-clutch CU; s06g not a montage; s02a):** s06g is now a 3-cut burst (sub-cuts too short, issue 2). s07a2 is a profile ECU. **s02a was not re-angled** (issue 5).
- **V1 #6 (s13b–s13f run): partly fixed.** s13b+s13c were merged (4.62 s) and s13f is 3.0 s. **s13d is still 0.79 s and still cuts inside "How did you—"** (issue 1).
- **V1 #7 (s14b 0.67 s): duration fixed (2.97 s), but s14b now starts mid "overseas"** (issue 1).
- **V1 #8 (merge s10b+s10c): not done.** s10a and s10b are near-identical (issue 8).
- **V1 #9 (mid-phrase cuts):**
  - Fixed: s01b/s01c, s01e/s01f, s06b/s06c and s18d/s18e.
  - Still open: s01a/s01b (3.38, not 4.05), s01h/s01i (24.0, inside "THE—") and s11c/s11d (inside "everything"). There are also 30 new mid-phrase cuts (issues 1 and 14).
- **V1 #10 (classroom reverses; s03h montage):** the reverses are fixed. s03h now has 3 cuts, but each is about 0.67 s and two share a setup (issue 2).
- **V1 #11 (s17a–s17c): structure fixed** (L-cut "That's insane", two-shot push). The s17a/s17b cut now clips "scholarship?".
- **V1 #12 (s16e, s16a clip): s16e fixed (3.0 s). The "people's thoughts" clip is still open,** because the optimiser moved the cut back into the word (issue 14).
- **V1 #13 (s06d/e, s02c/d, s08c/e near-identical):** s06e (high 3/4) and s08e (corridor axis) are fixed. s02d is front-on but not low (issues 6 and 7).
- **V1 #14 (s01g–s01j): partly fixed.** s01i is 1.2 s, but s01h and s01j are 0.80 s, below the 1 s floor (issue 2).
- **V1 #15 (inverted act tempo): still open, and Act 3 is worse** (3.39 s mean, down from 3.49 s; issue 3).

## What works (keep)
- Acts 1–2 have no shots over 5 s, and the V1 "dead" 5.5–6.6 s locked shots are gone. The film now changes composition at roughly the reference's 2.5–4 s pace.
- Real angle variety where the sets support it:
  - s03c→s03d→s03f: teacher OTS from Noah's desk, then the reverse from the front of the class, then a desk-height low angle.
  - s05b→s05c→s05d→s06a→s06b→s06c: door push, deep OTS, push into the windows, violet orbit, top-down counter.
  - s06d→s06e→s06f: bench MS, then a high 3/4 down the table, then a Dutch high angle.
- The s06g peak is a genuine accelerating burst into black, and s07a→s07a2→s07b→s07c→s07d changes size and axis on every "He tried..." beat. That is the reference's Act-2 escalation.
- Leo's side of the courtyard now uses the tree and skyline axis, so shot and reverse finally have different backgrounds. s12d/s12e and s14d→s14d2 work as true reverses.
- s13a is a real tracking move with visible tree parallax, s16a is a real continuous push that earns its 6.26 s, and s15e (2.3 s memory flash) is a good background-breaking cutaway.
- Silences land: s08f holds about 2.7 s after "He's gonna hate me", s15g gives 3.1 s of music only, and s13f keeps a 3 s silent wide.
- The planned (pre-optimiser) cut list was mostly phrase-led, with cuts at `E.sg(...)` minus 0.2 s. Keep that authoring style, and make the optimiser respect it (issue 1).
