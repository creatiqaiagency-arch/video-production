# 13 — Production pipeline & auditor loop

## Pipeline
1. **Script** → `production/script/` (screenplay + `vo_lines.json` with audio tags).
2. **VO** → ElevenLabs MCP (`eleven_v3`), 4 takes per line → `production/audio/vo_raw/`.
   Take selection + thought processing → `production/audio/vo/`.
3. **Timing** → `production/build/timeline.json`: VO placed scene by scene, shots cut to VO.
4. **Animation** → code. Canvas 2D (vector drawing, gradients, filters) rendered in headless
   Chromium by Playwright, frames piped to ffmpeg. Engine in `production/engine/`.
   - `core.js` maths/easing/noise · `post.js` grain/vignette/letterbox/bloom/rays/dust
   - `character.js` stick-figure rig with rim light, expressions, lip-flap
   - `sets.js` environments as parallax layer stacks · `fx.js` thought windows / text / overload
   - `shots/*.js` one function per shot, all timed from `timeline.json`
5. **Mix** → ffmpeg: VO + thoughts + music (ducked) + SFX → final AAC.
6. **Audit** → contact sheets + shot list + timeline → 6 auditors score 1–10 with fixes.
7. **Iterate** V1 → V2 → V3 … until every auditor ≥ 8 or the loop plateaus.

## The auditor team
| Auditor | Looks at | Fails when |
|---|---|---|
| Shot-Cadence | shot list durations, composition variety | a shot < 3 s or > 5 s without a reason; repeated angles |
| Logic / Sense ("the fixer") | sequence of events, power rules, continuity | anything a normal viewer would find confusing or contradictory |
| Lighting | frames vs `06_lighting_and_post.md` | flat, unmotivated, no rim, muddy, not cinematic |
| Animation | motion, acting, lip-sync, easing | stiff, frozen, wrong mouth, linear motion, teleporting props |
| Story Flow | scene order, hooks, emotional arc | dead spots, unclear stakes, rushed payoff |
| Showrunner (overall) | everything + reference match | below "would publish" quality |
Each returns `{score: 1-10, verdict, issues:[{shot, problem, fix}]}`. Scores and fixes are logged
in `production/audits/V<n>/`. The next version must address every fix or justify skipping it.
