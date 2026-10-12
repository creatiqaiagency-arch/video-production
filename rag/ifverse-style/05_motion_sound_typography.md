# Motion language, typography and sound

## Motion (how things move)

- **Ease everything.** Use easeInOutCubic for camera moves and easeOutBack (with a small overshoot) for poses snapping into place. Nothing moves linearly except clocks, timers and conveyors.
- **Idle life.** Characters breathe (torso scale ±1.5 % at ~0.3 Hz) and blink every 2–4 s (a 3-frame squash of the eyes). Heads tilt slightly while talking.
- **Talking.** While a character's VO line plays, the mouth cycles between open and closed shapes at ~7 Hz and the head bobs ±2°.
- **Anticipation → action → settle.** Before a kick, a reach or a jump there's a small counter-move first (4–6 frames).
- **Smear and speed lines** on fast actions: a ball streak, a whoosh arc, motion-trail ghosts (3 copies at decreasing opacity).
- **Holds.** After a big reaction, hold the pose 8–16 frames before moving on (that's the comedic beat).
- **Time compression** is shown as a fast-moving light direction across the room, clock hands spinning, or calendar pages flipping.

## Typography

- **Title / hook text:** heavy rounded display face (`Lilita One` style, fallback `Arial Black`), letter-spaced +6 %, cream `#fff3df` fill, a 2 px dark-plum stroke and an outer warm glow `#ff9e4a` at 30 %. Two lines with a size hierarchy. Example from the reference: "WHAT IF YOUR REACTION TIME / **WAS 10x FASTER?**".
- **Data labels:** condensed bold numerals (`Oswald` / `Bebas` style), white or gold, with a small drop shadow (`10 HOURS OF PRACTICE`, `0:06:00`, `9 / 10`).
- Labels animate in with a 6-frame scale-up from 85 % plus a fade, and leave with a 4-frame fade.

## Sound design (from the reference)

- **Score:** soft, warm piano and pads under narration. It rises with strings or synths in the competition sequences and drops out entirely before big realisation beats. **Silence is used as punctuation.**
- **Foley on every visible action:** cups, steps, paper, keyboard, ball kicks, mechanical whirs.
- **UI sounds** on graphics: soft ticks, clicks and pops when labels appear.
- **Comedy stings:** the music stops on punchlines, and a record-scratch-style cut on "We're in English class."
- **Whooshes** on whip transitions, and a low boom with shimmer on title reveals.
- VO is always on top (music ducked about −14 dB under dialogue).
