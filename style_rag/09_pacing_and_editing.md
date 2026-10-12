# 09 — Pacing & editing

## Measured cadence (reference)
- Scene-detect (threshold 0.3) found 65 hard cuts → median 3.1 s, mean 6.7 s.
- BUT the contact sheets show many re-compositions that scene-detect missed (dissolves, camera
  moves and same-palette cuts — e.g. 0:13–0:27 contains 5 distinct compositions).
- Effective rule: **a new composition every ~2.5–4 s**, held longer (6–10 s) only for
  establishing wides with slow camera moves or for emotional beats.
- See `reference_shot_log.csv` for the detected hard cuts.

## Our rule (enforced by the Shot-Cadence auditor)
- Every shot 3–5 s. Allowed exceptions: montage/punch beats 1–2.5 s (max 3 in a row);
  emotional holds up to 7 s in Act 3 **only if** the camera moves continuously.
- No two consecutive shots with the same type & angle (e.g. MS → MS of the same person).

## Transitions
- Default: **hard cut** on action or on a VO phrase boundary.
- Match cuts (shape/position continuity) between locations.
- Whip/whoosh pans for time jumps; dip-to-black only between acts.
- "Push into graphic until it fills the screen" for entering a thought world.

## Act rhythm
| Act | Feel | Avg shot | Camera |
|---|---|---|---|
| 1 Discovery | fast, playful, bright | 3 s | punchy push-ins, snap zooms |
| 2 Overload | crowded → claustrophobic | 2.5–3.5 s | orbits, Dutch tilt, rapid cuts at peak |
| 3 Resolution | slow, quiet, warm | 4–6 s | locked or slow drift, wides with negative space |

## Audio-led editing
VO is recorded first; the picture is cut to the VO. Leave 0.3–0.6 s air after punchlines and
1–1.5 s silence after emotional lines ("He's gonna hate me.").
