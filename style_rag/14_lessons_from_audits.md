# 14 — Lessons from the auditor loop (binding for future films)

These rules were learned the hard way in V1 → V2 of *Hear Everyone's Thoughts* (V1 averaged 4.8/10).
Apply them from the first draft of every new film.

## Camera & sets
1. **Never stage on a flat wall facing the lens.** Every location needs a vanishing point (angled walls,
   receding floor lines, depth-scaled characters). Use `E.room()` / `hall3q` / `classRev` / `cafPersp`.
2. **Each location gets ≥ 3 setups**: a 3/4 wide, a low or high angle, and an OTS with a big blurred foreground.
3. **Dialogue scenes get two axes.** Character A's reverse has a different background from B's
   (e.g. building vs. tree/sky). Never cut CU → CU of the same person from the same setup.
4. **Every shot moves**: ≥ 6 % push or a pan, eased. Locked-off frames read as "dead".

## Light
5. Rim light only on the **key side**, coloured like the key; clothing falls off to ~55 % on the far side.
6. Light sources are **orange gradients, never flat cream/white**; keep a soft highlight knee in post.
7. Give each act its own light state, and make the emotional arc visible in the grade
   (e.g. cool overcast confrontation → warm golden reconciliation). Always keep some cool fill.
8. The **time of day must match the script** ("one morning" ≠ dusk).

## Acting
9. New pose on every VO phrase; breathing + sway always on; heads tilt on stressed words.
10. Seated characters sit **on something**; nobody floats. Pivot sit-ups from the hips.
11. Props must physically travel (hand-off, slip, pull from bag, pass, pocket). No teleporting props.
12. Mouths blend with the emotion (open smile vs. O); thoughts never move the mouth.

## Thoughts (the film's core device)
13. Dark backing plate, white text ≥ 40 px, kept inside title-safe, never over a lit window, fully revealed
    ≥ 1 s before the cut, **tail on the right head**.
14. Never show plain white floating text for a thought (white = speech).
15. Speculation panels must visibly come out of the person who imagines them.

## Story & edit
16. Plant every important relationship in Act 1 (the best friend must appear before the conflict).
17. Show the passage of time on screen (date chips / montage) whenever dialogue depends on it.
18. Show the lesson through action at the end; don't caption the moral early.
19. Give key reactions room: ≥ 1.5 s holds after a revelation, ≥ 3 s silence at the climax.
20. Cut on VO phrase boundaries; shots 3–5 s (use the `E.retime` optimiser), with only deliberate
    impact/montage beats shorter and moving Act-3 holds longer.
21. Check calendar/age/voice logic (e.g. "I hate Mondays" requires a Monday; teens get teen voices).

## Added after the V2 audit (V2 averaged 6.0)
22. **Shot budget = runtime ÷ 3.8 s.** If there are more shots than that, no optimiser can satisfy 3–5 s; the
    result is a metronomic 3.0 s rhythm and cuts pushed into words. Merge shots first, then retime.
23. Motion that a shot exists to show (doors opening, a slip, a hand-off) is keyed to the **shot's own clock**,
    or the shot declares `keep: [mark]` so retiming cannot cut it off.
24. Impact beats are 1.0–2.5 s; anything under 1 s does not register.
25. Changelog claims are verified on rendered stills before they are written. "In the code" ≠ "on screen".
26. A thought window's look: dark plate ≥ 0.85, light tint, small glow; it must not wash out to lavender.
27. A lesson shown through action (e.g. choosing not to read a thought) needs a full-size, visible stimulus,
    a readable eye **and** head turn (10–12 frames), and sound that agrees with the picture.
28. Act 3 emotional scenes breathe: moving holds of 4–7 s, a mean of ≥ 4.5 s.
29. Characters in bed: hip on the mattress, torso pivots from the hip, legs flat under the duvet (`E.inBed`).
