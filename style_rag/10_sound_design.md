# 10 — Sound design

## Voice
- One warm, engaging young-adult American **narrator** carries the story (Ifverse style:
  conversational, slightly playful, never documentary-dry).
- Characters have distinct voices (see `03_characters.md`). All VO via ElevenLabs `eleven_v3`
  with inline audio tags (`[whispers]`, `[nervous]`, `[laughs]`…).
- Generate 4 takes per line; pick the take whose duration is closest to the median of the takes
  (avoids clipped/rambling takes), then the Story auditor can request a swap.

## Thought-voice treatment (project rule)
Thoughts = same actor, recorded `[softly]`, then processed: high-pass 180 Hz, slight low-pass
7 kHz, short airy reverb (aecho 60 ms, 0.35), chorus-like double (+8 ms), panned toward the
thinker's screen position, −3 dB vs spoken lines. They must sound **inside the head**.

## Music (ElevenLabs music)
| Cue | Use |
|---|---|
| m01 curious/playful | Acts 1 opening, street, classroom |
| m02 romantic swell | Maya hallway (stops with record scratch) |
| m03 overload tension | cafeteria / overload |
| m04 suspicion low | Leo suspicion, Thursday night |
| m05 heartfelt piano | courtyard revelation / realisation |
| m06 warm resolution | reconciliation + walk home sting |
Music sits −18 to −22 LUFS-ish under VO (duck 8 dB when VO is present).

## SFX palette
café ambience, ceramic shatter, thought pop (every thought window), soft/deep whooshes, record
scratch, school bell, classroom tone, cafeteria walla, street ambience, low isolated tone, clock
tick, courtyard wind, time-freeze suck, double doors, lock click, paper unfold, riser, soft boom.

## Mix rules
- VO is king: −16 LUFS integrated target for the final mix, VO peaks ≈ −3 dBFS.
- Silence is a tool: hard-cut the overload wall to silence; hold silence after key lines.
