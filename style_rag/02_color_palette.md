# 02 — Colour palette

Values were **measured** (median-cut quantisation + pixel picks) from reference key frames.
Machine-readable copy: `palette.json`.

## Core constants
| Role | Hex | Notes |
|---|---|---|
| Character body | `#0a080d` | measured `#09070c`; never pure #000 |
| Face marks (eyes/mouth) | `#f4ede6` | warm off-white |
| Rim light (warm) | `#f0a77e` | peach-orange offset outline |
| Rim light (cool, night) | `#9fc6ff` | used in purple/blue night scenes |
| Title / UI text | `#ffefd7` | with soft warm glow |
| Letterbox | `#000000` | 62 px top & bottom at 1080p |

## Mood palettes
**Dusk exterior (default, Act 1)**
sky top `#85618f` → sky mid `#bb80a0` → horizon `#e8a070` → sun core `#fff1c9`;
buildings `#3a2433` / `#2a1826`; far buildings `#6a4a66`; street `#593736`;
lit window `#d1966a` → `#f2c184` (top glow); awning red `#9a3a44` with cream `#e8d2bc` stripes.

**Warm interior (café, classroom, hallway)**
wall `#5b3a3e` / `#43343d`; floor `#3e2a32`; warm light `#cfa496`; lamp glow `#ffd59a`.

**Night interior (bedroom / screens)** — `#191a39`, `#2d2d5a`, `#1c2244`, monitor glow `#8fb4ff`,
accent violet `#8a5cff`.

**Thought world (project-specific)** — violet `#a98bff`, glow `#d9c9ff`, deep `#3b2a7a`,
blue `#6fa8ff`. Speculation (Noah's imagined fears) = desaturated grey-violet `#8d8597` + grain.

**Emotional / resolution** — late-afternoon gold `#f3b56f`, rose `#e58f86`, soft sky `#f6d0a8`.

## Character costume colours
| Character | Garment | Hex |
|---|---|---|
| Noah (protagonist) | red hoodie, white drawstrings | `#c8302f` (shade `#942327`) |
| Leo (best friend) | green cap + teal tee | cap `#5fd068`, tee `#2f8f87` |
| Maya (crush) | lilac cardigan, hair clip | `#c9a0e8`, clip `#ffd166` |
| Barista | cream apron | `#e8d8c0` |
| Teacher | white shirt + glasses | `#ece8e2` |
| Businessman | navy suit + tie | `#2c3550`, tie `#c8a03a` |
| Passers-by | muted single garment | mustard `#d0a040`, pink `#c98aa0`, teal `#3d8a8a` |

## Rules
- Big areas stay **desaturated & dark**; saturation lives in costumes, windows, sky, effects.
- Warm/cool split: lights warm, shadows violet. Never neutral grey shadows.
- Each scene picks ONE dominant palette from above and sticks to it.
