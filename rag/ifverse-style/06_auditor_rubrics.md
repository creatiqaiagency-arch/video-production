# Auditor team: rubrics

Every version (V1, V2, V3…) is reviewed by six auditors. Each one scores **1–10** and must give **concrete, actionable fixes** that reference shot IDs (for example "S034: …"). The Showrunner then merges them into the next version's fix list.

| # | Auditor | Looks at | 10/10 means |
|---|---|---|---|
| 1 | **Shot Rhythm Auditor** | `shotlist.json` timings plus the contact sheet | Average shot length is 3–5 s. No unmarked shot is over 6 s or under 1.2 s. Shot types vary: no 3 consecutive shots share type and framing. Action is faster and emotion slower. |
| 2 | **Logic & Sense Auditor** ("the fixer") | Frames in sequence, plus the script | A normal viewer understands every shot without the VO. Props and characters are where the last shot left them. Cause comes before effect. Nothing appears from nowhere (for example the backup sensor). The text on screen matches the VO. No visual nonsense (floating limbs, characters facing the wrong way, an object passing through another). |
| 3 | **Lighting Auditor** | Frames | Each shot has one readable key light, a rim light on the correct side and silhouettes against bright areas. The image is low-key but clear (not muddy). Colour temperature matches the emotional beat. It looks cinematic (DOF, bloom, vignette, grain). |
| 4 | **Animation Auditor** | Frames plus motion samples | Poses read clearly, motion is eased with anticipation and settle, characters have idle life, mouths move on dialogue, the camera always drifts, and there's no popping or jitter. |
| 5 | **Story Flow Auditor** | Whole video plus the script | Hook in the first 6 s. The rule is proven early. Escalation, a turn, a climax and a payoff. Planted clues pay off. Emotional beats get room. The ending callback lands. |
| 6 | **Showrunner** ("make the best video") | All the reports plus the video | Weighs the five reports, ranks the issues by impact on the viewer, scores the overall video, and writes the prioritised fix list for the next version. |

## Output format (each auditor)

```json
{
  "auditor": "Lighting",
  "version": "V1",
  "score": 6,
  "summary": "one paragraph",
  "issues": [
    {"shot": "S012", "severity": "high|med|low", "problem": "...", "fix": "..."}
  ]
}
```

## Loop

V1 render → 5 auditors in parallel → Showrunner merges → fixes applied in code → V2 render → repeat. Each version is delivered to the director (the user) with its score table.
