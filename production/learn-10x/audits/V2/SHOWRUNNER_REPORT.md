# Showrunner Report: learn-10x V2

**Overall: 6.0 / 10, up from 4.0.** V2 is a story a stranger can follow to the end. But the beats that carry the meaning still contradict the picture: a double finish, an invisible set-down, faces that look like they are laughing, and a cause beat that looks like a UI card.

| Auditor | V1 | V2 | Δ |
|---|---|---|---|
| Shot Rhythm | 4.5 | 6.5 | +2.0 |
| Logic & Sense | 4.0 | 6.0 | +2.0 |
| Lighting | 5.5 | 7.0 | +1.5 |
| Animation | 3.5 | 5.5 | +2.0 |
| Story Flow | 4.0 | 7.0 | +3.0 |
| *Mean* | *4.3* | *6.4* | *+2.1* |
| **Showrunner overall** | **4.0** | **6.0** | **+2.0** |

I predicted 7.0 for V2. It came in a point lower because several fixes only half landed:
- S066: the bench was under the letterbox.
- S093: the robot ran in the wrong lane.
- S091b: the LED read as a card.
- The clock went 0:01 → 0:02.

Animation also needs per-shot acting, not more lib passes.

## Director's read
What works now:
- **Pipeline:** the VO fix brought back the hook, the proof and the dialogue at 5:53 with no overlaps.
- **Climax:** B35 is cut at reference action tempo.
- **Workshop turn:** it has silence and room.
- **Clock:** one shared clock runs from S075.
- **Flashback:** S087 is clearly a memory.
- **Ending:** the S026 = S108 callback lands on a title over black.

What still breaks, all in the payoff and the hinge:
1. The finish happens twice and the clock runs backwards.
2. The "swerve" never threatens the barrier.
3. The cause beat (S091b) is an abstract blue card.
4. Noah's screwdriver set-down happens under the letterbox.
5. The shout mouth is a D-shaped grin, so the hall exchange reads as laughing.

**Working-tree status.** The animator has already addressed most of the story, rhythm and lighting items and has started on logic and animation:
- **Climax:** clock and finish fix, the S091b chassis/LED, the S093 close overhead in the order S091→S091b→S093→S092, L069 dropped, music stop on S094b and triumph on the horn.
- **Workshop:** S066 bench at y 880 with an eased tool set-down, plus the reverse plate for S061/S065/S067.
- **Rig and lip-sync:** new shout mouth, numeric `sit`, idle sway with a `still` override, smoothed speakAmp.
- **New shots:** S027b, S057b, S071b, S072b, S086b, S106b.
- **Sound:** room tone, and the tension cue restarts on S089.
- **Lighting:** S007 bloom under the characters, hotter floods, crowd blur, inward gold rims, rim cap at 16.

I dumped the WIP timeline to scratch: **350.2 s, 122 shots, 0 overlaps.** These items are marked `in_progress_done` in the JSON. Verify them on the V3 stills.

**New problems found in this review:**
- **G01 (P0):** the overhead route `[1220,400]→[1420,500]` cuts through barrier 3 (`[1300,260,40,200]`). S094 now shows exactly that segment during the payoff, so the robot drives through a metal barrier again.
- **G10 (P1):** timeline.js ignores per-shot `min`. S095 comes out at 2.16 s against its min of 2.6, which leaves about 1 s of release after the horn.
- **G41 (P2):** `scene()` drops `bloom`, `burn` and `flashColor`. S091b's blue flash and any per-shot bloom silently do nothing.

## V3 fix list: open items only
The full list of 53 items, with code-level fixes, is in `showrunner.json`.

**P0**
- **G01** Move barrier 3 to `[1300,180,40,190]` and add a route-vs-barrier assert. *(new)*
- **G02** Shout/panic mouth is reshaped. Still to do: close it when silent, then verify on S083/S086/S089/S090.
- **G03–G07** In the working tree, verify on render: the clock and single finish; S091b; S093 clearing barrier 1; B35 audio; the S066 bench and tool inside the frame.

**P1**
- **G08** S065: Eli in profile to his laptop, not smiling at Noah, with cool rims on the reverse plate. Also update the S067 desc.
- **G09** Lip-sync: soft knee, and keep held vowels moving.
- **G10** Enforce per-shot `min`, or give S095 `dur: 2.6`.
- **G11** S058: seat Eli with hands on the keys, add ghost arms, give Noah real page turns.
- **G12** Gestures:
  - S090: point anticipation.
  - S099/S100: beats on stressed words, plus a listener nod.
  - `still` on S081/S088.
- **G13** S044: draw the book under the head. Also verify S020.
- **G14** S054b: hand on a flat phone, bubble on the screen, L038 ends before the shot.
- **G15** Arena: haze only in the beams, bloom .8 on close-ups. Target p95 ≥ .45.
- **G16** Warm payoff: glows behind the speaker in S097–S101, WARM .15, true blacks in S096, S102 Eli on goldR.
- **G17** Acts 1–2 cut contrast:
  - Shorten S010/S015/S032/S078.
  - Lengthen S022.
  - Leave the action shots alone.
- **G18** Hall exchange:
  - Split S085 (4.07 s) and make it a true high angle.
  - S084 at about 1.8 s.
  - S089 a true low angle with a bigger FG timer.

**P2:** about 20 polish items, including:
- Blocking and acting: the S102 low wide, the S106 stool, the S108 pose, the S053/S054 swaps, S045, S013, S037, S036/S038, S097, palm-down hands.
- Sound: the S035 music duck, a button on S109.
- Small cuts and staging: the pre-final scoreboard, S091 flash, S078 framing, the S088 flash-out, field angles.
- Light: field shadows, lane light, crowd colour, lamp and windows.

The S006 title move is **deferred**.

## Conflicts resolved (short)
- **S093:** keep the close overhead. It is unambiguous and rhymes with the S077 failure map. Condition: the route must clear every barrier.
- **S013:** fix the final frame (torso horizontal) but keep the shot ≥2.2 s.
- **Rhythm vs animation:** shorten reactions, not actions.
- **S067:** accept the reversed staging (Eli back-turned in the FG, Noah exits through the BG door).
- **S106:** the S106b insert carries the payoff. The stool fix is P2.
- **L069:** dropped.
- **Tension cue:** stop under the flashback, restart on S089.
- **S061:** the reverse plate replaces the lamp fix.
- **Warm payoff:** keep the hue, swap the wash for emitted light.
- **Idle sway:** on by default, with `still` for deliberate freezes.
- **Rims:** capped at 16 px.
- **S006 title:** deferred.

## Must NOT be lost
- **Runtime and VO:** real VO, 0 overlaps, 5:30–6:00, and the render.js placeholder guard.
- **Climax:** the B35 cut grammar, the music stop at 0:01, heartbeat only, triumph on the horn.
- **Clock:** one monotonic shared clock, with WINNER only after the horn.
- **Plant chain:** S059 → S060 → S063 → L064 → sepia S087 → S090 → S091b.
- **Workshop hush:** the S066 hold with one click, the VO-free S067 exit, the S068 empty bench and DAY counter, L050 on S069. Room tone, never digital zero.
- **Callbacks:** S026 = S108 bewildered face, the sting, title on black; S105 → S106b red sleeve on gold keys → "ten hours".
- **Act 1 setup:** the hook "=" / SAME SONG, the S028 rule card with its limits, the S046 = S008 mirror.
- **The look:** the colour arc (cold → sepia → warm), arena floods with bloom, DOF on CUs, OTS shots on the backs of heads, thirds framing.
- **Rig and motion:** stride-locked walks, head tilt and nod, varied blinks, pose blending, numeric sit.
- **Staging:** hall screen direction, the photo, the TEAM card, the stripes, the empty bench.

## Prediction
**V3 ≈ 7.5 if P0 and P1 are done and verified.**

| Auditor | Predicted V3 |
|---|---|
| Story | 8.0 |
| Logic | 7.5 |
| Rhythm | 7.5 |
| Lighting | 7.5 |
| Animation | 6.5–7.0 |

Getting to 8+ needs the P2 acting pass and the reference's more dynamic angles.
