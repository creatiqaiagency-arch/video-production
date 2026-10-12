# The auditor team

Every version (V1, V2, V3 …) of *What If You Could Hear Everyone's Thoughts?* is reviewed by six
independent auditors. Each one looks ONLY at its own specialty, scores it **1–10**, and gives
concrete, implementable fixes (shot id + what to change). Scores are honest: a 10 means
"indistinguishable from the Ifverse reference on this dimension", a 5 means "a viewer notices
problems", below 4 means "broken".

Inputs for every auditor (in `audits/<V>/pack/`): `sheet_XX.jpg` (2 stills per shot, labelled),
`motion_XX.jpg` (8-frame strips), `shots.md` (shot list with dialogue), `cadence.md`,
`timeline.json`, plus the style bible in `style_rag/` and the script `production/script/screenplay.md`.
The reference look is in `style_rag/reference_frames/`.

| # | Auditor | Question it answers | Primary sources |
|---|---|---|---|
| 1 | **Shot-Cadence** | Is there a new shot every 3–5 s? Variety of shot types and angles? | `cadence.md`, `shots.md`, `style_rag/09` |
| 2 | **Logic / Sense ("the fixer")** | Would a normal viewer be confused? Does the sequence of events and the power's rules make sense? Continuity errors? | `shots.md`, sheets, `style_rag/12`, screenplay |
| 3 | **Lighting** | Is lighting clear, motivated, cinematic, matching the reference? Rim lights, depth, contrast? | sheets, reference frames, `style_rag/06` |
| 4 | **Animation** | Does motion read? Acting, poses, lip-sync rules, easing, stiffness, props? | motion strips, sheets, `style_rag/07` |
| 5 | **Story Flow** | Does the story flow? Hooks, stakes, emotional arc, pacing between acts, payoff? | `shots.md`, screenplay, `style_rag/11` |
| 6 | **Showrunner** | Overall: is this the best possible video? How close to the reference? What are the top fixes that would most improve it? | everything |

## Output format (each auditor writes `audits/<V>/<role>.md`)
```
# <Role> audit — <V>
SCORE: <1-10>
VERDICT: <one paragraph>
## Issues (most important first)
1. [shot id(s)] PROBLEM … → FIX: … (implementable instruction)
...
## What works (keep)
```
The Showrunner also writes the version's scorecard row and a ranked TOP-10 fix list.
The next version must address every fix or note why it was skipped (`audits/<V+1>/CHANGELOG.md`).
