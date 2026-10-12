# V2 changelog — response to the V1 audit (avg 4.8/10)

## Engine (affects every shot)
| Area | Change | Requested by |
|---|---|---|
| Rig | Front-view arm fix: `clutch / crossed / letter / hug / phone / holdOut / bag / facepalm / tap / sitDesk` bring the hands to the chest instead of splaying into a "W" | Animation #1 |
| Rig | Breathing on head, neck and shoulders (±1.1 %), arm micro-sway, idle head-tilt noise; new poses `cheerFists, neck, palms, behind, push` | Animation #2/#9 |
| Rig | Auto-grounding (lowest foot on the floor) + automatic seat/stool under seated poses; frontal seated legs foreshortened | Animation #4 |
| Rig | `hipRot` pivot (sit-up / lying in bed from the hips) | Animation #3, Logic #8 |
| Rig | Talking mouth blends with expression (open smile / open frown / O), `talkScale` for quiet lines; neutral face has a mouth | Animation #8 |
| Rig | Brows clipped below cap brims; headphones hug the skull; contact shadows under feet | Animation #13 |
| Light | Rim light is now key-side only, thickness ∝ character size, colour = scene key; clothing shaded 1.0 → 0.55 away from the key | Lighting #1/#8 |
| Light | Per-pixel tone curve: exposure 0.94 + soft highlight knee; windows re-coloured to warm orange gradients (no more clipped cream); smaller sun halo; bloom re-thresholded | Lighting #3/#4 |
| Thoughts | Dark backing plate under every window, darkened halo behind it, white text, auto-height wrapping, title-safe clamping, faster reveal (full line by ~60 %), 1.3 s linger | Logic #1, Lighting #5, Showrunner #5 |
| Sets | New perspective-room builder (vanishing point, receding lockers/windows, floor light shafts, ceiling lamps, depth-scaled characters): 3/4 hallway (4 moods), classroom reverse, perspective cafeteria | Showrunner #1, Cadence #4 |
| Sets | Courtyard with two axes (`building` / `tree` reverse) × three moods (`conf` cool overcast → `reveal` → `warm` gold with rays + cool fill) | Showrunner #2, Lighting #2, Cadence #1 |
| Sets | Morning variants (café interior/exterior, street, school), less-blown sunset entrance | Logic #7, Story #7, Lighting #15 |
| Edit | Cadence optimiser: every cut may slide ±0.7 s (L/J-cut) to land shots in 3–5 s; impact beats and moving Act-3 holds are exempt | Cadence #2–#9 |

## Story / logic
- **Time-of-day arc**: dusk teaser → MONDAY morning → afternoon → TUE/WED/THU montage → Thursday dusk → night → FRIDAY overcast → warm reconciliation → sunset sting.
- **Leo planted in Act 1**: walks into school with Noah, sits next to him, fist-bump in the montage, high-five in the hallway; green caps removed from extras.
- **Cold open rebuilt**: anonymous "everyone" vignettes with readable thoughts (secret / lie / crush), Monday wake-up with a real sit-up, morning café entrance, ceramic mug handed over and visibly slipping, a real eye ECU with the reflected mug, floor-level shatter, bold opaque title.
- **Thought attribution fixed**: s08d tail lands on Leo's cap, s12e on Leo's side, s01 barista window beside her, speculation panels rise out of Noah; s09a echoes are faded violet windows (not chalk).
- **Props**: phone actually in Leo's hand (and the timing bug fixed), laptop shows the Ashford "A" crest (pays off in the letter), letter pulled from the bag and passed to Noah, doors physically pushed open with light spilling, the clock snaps to 3:00.
- **Silences**: +0.9 s after "He's gonna hate me", "...What?" held, 3.5 s silence after "I KNOW what you're thinking", 3.4 s music-only hold before the realisation.
- **Realisation shown, not captioned**: early HEAR ≠ UNDERSTAND caption removed; SAID/THOUGHT replays now happen in the original locations, without "MEANT" captions.
- **The lesson through action**: in s17e and s18c a thought starts to form, Noah's eyes flick to it, he looks back at the person's face and the window fades unread.
- **Maya thread repaired**: Noah walks over first and silently apologises before she invites him.
- **Calendar logic**: story starts Monday (so "I hate Mondays" and "all week" are true); letter term starts January 11, not in two days. Adult voices on student thoughts recast with teen voices (ElevenLabs).

## Cadence
V1: 49/112 shots (44 %) in 3–5 s. V2: 126 shots, 97 strictly in 3–5 s (77 %), 110 (87 %) within the rule including allowed exceptions.

## Not done (and why)
- Narration lines not rewritten (would need new client-approved VO); runtime is 6:32 vs the 5–6 min estimate — the script itself is the floor, and the client's auditor note says not to stretch or squeeze artificially.
- Mouthed-only lines and lip-sync accuracy remain envelope-driven (no phoneme visemes).
