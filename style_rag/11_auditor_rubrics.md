# 11 — Auditor team (review loop)

Every version (V1, V2, V3 …) is reviewed by six independent auditors. Each scores **1–10** and must give
**specific, actionable fixes** (shot id + timestamp + what to change). The fixer applies the fixes and renders the next version.
Loop until every auditor gives ≥ 8, or after V3 ship the best version with remaining notes listed.

| # | Auditor | Looks at | 10/10 means |
|---|---|---|---|
| 1 | **Shot-Pacing Auditor** | Cut list, shot lengths, variety of shot types | New shot/major camera change every 3–5 s on average; no static hold > 8 s; mix of wide/medium/CU/insert/POV; cuts motivated |
| 2 | **Logic & Sense Auditor** ("the fixer") | Does every shot make sense to a normal viewer? Is the sequence physically and causally consistent? Do the power's rules hold? | A first-time viewer with the sound off could follow what happens and why; no continuity errors |
| 3 | **Lighting Auditor** | Key light, rim light, contrast, readability, mood, cinematic quality | Every shot has a motivated source, subject is readable, palette matches `02`, looks like a film frame |
| 4 | **Animation Auditor** | Posing, timing, easing, physics, lip-sync, idle life | Movements read clearly, have weight, no stiffness/popping, no limbs breaking, mouths match speech |
| 5 | **Story-Flow Auditor** | Hook, re-hooks, emotional arc, clarity of the 3 rules, payoff | Viewer is hooked in 5 s, never bored, understands the twist, feels the ending |
| 6 | **Director (Best-Video) Auditor** | The whole thing vs. the Ifverse reference | Would sit next to the reference on the same channel without looking out of place |

## Required output format (per auditor)
```
AUDITOR: <name>
SCORE: <1-10>
TOP PROBLEMS:
1. [shot id / mm:ss] problem → FIX: concrete change
...
WHAT WORKS: (1–3 bullets, so fixes don't break it)
```

## Inputs the auditors receive
- `contact sheet` (one frame per shot, labelled with shot id and time)
- 3 keyframes per shot (start / middle / end) for close inspection
- the shot list with durations and VO text
- this style RAG folder
