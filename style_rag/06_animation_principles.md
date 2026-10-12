# 06 — Animation principles

The reference animates at 24 fps with mostly "on ones" motion for camera and "posey" character acting.

1. **Pose-to-pose acting.** Hit strong, readable silhouettes (key poses) and ease between them. Every pose must read in silhouette alone, because characters are black.
2. **Easing.** Use ease-in-out (cubic) for character moves, ease-out (expo) for crash-zooms, linear only for vehicles at cruising speed.
3. **Anticipation → action → follow-through.** Before a catch, the hand pulls back a little; after, it overshoots and settles.
4. **Squash & stretch on objects** (balls, coins, glass), never on heads.
5. **Smears & motion trails** for fast actions: 3–5 fading copies at 15–35 % opacity, or a stretched streak.
6. **Secondary motion:** hood/drawstrings and ponytail lag behind by 2–4 frames.
7. **Idle life:** subtle breathing (torso ±1 %), blinks every 2–5 s, slight head tilts. Nothing is ever perfectly frozen except the freeze-frames of the future vision.
8. **Walk cycle:** 12-frame stride (0.5 s), body bobs 2 % of height, arms swing opposite legs.
9. **Run cycle:** 8-frame stride, forward lean 15°, bigger arm swing.
10. **Lip flap** driven by voice amplitude (3 mouth shapes). Only the speaking character's mouth moves.
11. **Physics must be believable**: falling objects accelerate (y = ½gt²), balls arc in parabolas, a truck needs distance to stop.
12. **Readability first:** one main action per shot, staged in clear profile or 3/4 view.
