# V3 brief: what the team must fix (from the six V2 audits; V2 average 6.0)

Read the full reports in `audits/V2/*.md`. This brief consolidates them and splits the work by shot file.
Binding style rules: `style_rag/` (especially `14_lessons_from_audits.md`).

## Already done in the shared engine (do not redo; use these)
- **Thought windows:** violet overlay 0.34→0.14, plate alpha 0.86, frame glow 28→12, text glow 18→6. `E.th` forces text ≥44 px.
- **`E.retime`:**
  - Beat shots are 1.0–2.5 s. Normal shots are 3–5 s, with a soft push away from 3.0 s. Holds are 3–7 s.
  - Cuts that land inside a spoken phrase are penalised.
  - Shots can declare `keep: ['markName' | seconds]` in their `E.cut` meta so a mark stays inside the shot.
  - Shots can declare `beat: true` or `hold: true` in their `E.cut` meta instead of editing `_helpers.js`.
- **`E.inBed(ctx, {x, y: mattressTop, h, f: ±1, u: 0 lying … 1 sitting, arms, duvet, …char opts})`:** the hip stays on the mattress, the torso pivots, and the legs stay flat under a duvet. Use it for s01d and s11d.
- **Breathing:** now 1.5 % of height.
- **Mix:** `s17_leo_th` and `s18_maya_th` play as a muffled fragment (−18 dB, low-pass, cut mid-word), because Noah chooses not to read them.
- **Lighting:**
  - Corridor lockers are `#2c3550` and the end window is an orange gradient, with a floor light trapezoid and rays.
  - Courtyard moods: `conf` is truly cool/overcast (`#3a3f66`→`#8a8fb0`, windows 30 %), `reveal` sits in between, and `warm` uses `#7a4a6e`→`#e0906a`→`#ffcf8a` with cool fill.
  - The sunset entrance sky is `#5a3a66`→`#d77a6a`→`#ffc98a`.
- **V3 perspective sets in `sets2.js`:** `E.SET.cafeP`, `bedroomP` (+`E.bedP`), `libraryP`, `streetP`, `yardAngled`, plus the `tiles` option for `E.room`.

## The biggest global problem: cadence density
126 shots for 392 s gives a mean of 3.11 s, so the optimiser cannot fit 3–5 s. **Merge shots.** Target totals per file (about 3.8 s mean):

| file | V2 shots | target |
|---|---|---|
| s01_cafe | 13 | ≤ 10 (beats allowed) |
| s02_street | 9 | 7 |
| s03_classroom | 9 | 6–7 |
| s04_maya | 14 | 10–11 |
| s06_overload | 19 | 16 |
| s09_suspicion | 20 | 17 |
| s12_act3 | 42 | 34–36 |

- In Act 3 (s15–s17), merge into slow-push two-shots and moving holds (`hold: true`, ≤7 s), aiming for a mean ≥4.5 s.
- Every merged shot must still change composition within itself (push, pan, rack focus or reframe) and must cut on a phrase boundary.

## Rules for every shot you touch
- **Perspective, never a flat façade:** every location needs ≥3 setups, and Noah's and Leo's reverses get different backgrounds.
- **Angles that are labelled must be real:**
  - LOW: horizon in the bottom 25 %, ceiling or sky visible, camera below the eyes.
  - HIGH: floor fills the frame.
  - DUTCH: real 8–10° roll (`rot`).
  - PROFILE: `f: ±1`.
- **Thoughts:**
  - Every voiced thought window is ≥44 px, fully revealed ≥1 s before the cut, inside title-safe, not over a lit window or a foreground head, and its tail points at the thinker's head.
  - Speculation panels sit beside or above the head, never covering it.
- **Light:** rim on the key side in the key colour, light sources are orange gradients, morning is truly morning (saturated sky, unlit windows) and there is always some cool fill.
- **Acting:**
  - Change pose or head on every VO phrase (`E.sg(id,k)`).
  - Avoid the stock "one stiff arm straight out". Use two-handed, phrase-specific gestures.
  - Props physically travel and nobody floats.
- **Honesty:** if you cannot deliver something the desc claims, change the desc. The auditors check every claim against the frames.

## Verify before you hand back
- **Timeline:** `cd production/engine && node render.mjs --shotlist ../build/shotlist.json` (prints shot count; check your files' durations in the JSON).
- **Stills:** `node render.mjs --stills "t1,t2,..." --outdir /tmp/claude-0/-home-user-video-production/6142f904-8c99-555a-97eb-63a59d375158/scratchpad/<you> --label`, then look at the PNG/JPGs with the Read tool. Check at 25 % and 75 % of every shot you changed, plus extra frames for any motion beat.
- **Syntax:** `node -e "new (require('vm').Script)(require('fs').readFileSync('shots/<file>.js','utf8'))"`
