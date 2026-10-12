# 07 — Animation principles

## Timing
- 24 fps. Poses held, then moved with **ease-in-out** (cubic). Snappy actions use ease-out-back
  (slight overshoot) for 6–10 frames.
- Character acting is **pose-to-pose**: 2–4 key poses per line of dialogue, with a settle.
- Anticipation before big moves (a 3–4 frame counter-move).
- **Secondary motion**: hoodie strings swing, caps lag on head turns, hair bounces.
- **Idle breathing**: torso/head bob ±1.5 % at ~0.25 Hz on every visible character. Nobody is a
  frozen statue unless time is frozen on purpose.
- Blinks every 2–5 s, randomised per character.

## Lip-flap
Mouth shape driven by the VO RMS envelope of that character's line: closed < 0.08, small 0.08–0.2,
open > 0.2. Only the speaking character flaps. **Thought lines never move the mouth** — that is
the core visual rule that tells the audience it is a thought.

## Walks
2-step cycle ~0.5 s/step: legs swing ±25°, arms counter-swing ±20°, body bob 3 % at 2× step rate.

## Physics props
Falling objects accelerate (gravity), rotate, squash on impact, shatter into 5–9 shards that
scatter and slide. Slow-motion = time scale 0.15–0.25 with a whoosh in/out.

## Effects animation
- Pop-ins: scale 0 → 1.08 → 1.0 over 8 frames, opacity 0 → 1.
- Floating elements drift on sine paths (amplitude 4–10 px, 0.2–0.5 Hz).
- Panels/bubbles never just appear and freeze — they breathe, drift, or flicker.

## Animation auditor checklist
- Does every character have life (breathing/blinks) when on screen?
- Do mouths move ONLY when that character is speaking aloud?
- Are moves eased (no robotic linear slides)?
- Is the action readable — one main action at a time, clear silhouette?
- Do objects obey continuity (cup in hand → falls → on floor; nothing teleports)?
