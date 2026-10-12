# 02 — Colour palettes (measured from the reference)

Values below were extracted with median-cut quantisation from reference frames (see `palettes.json` for machine use).

## Universal
| Role | Hex | Notes |
|---|---|---|
| Character body | `#0b0709` | Not pure black; a hair warm. |
| Face features | `#f6f1e8` | Warm white. |
| Warm rim light | `#f0b27a` → `#ffd29a` | Peach/orange, 3–6 px. |
| Cool rim light | `#9fd0ff` | Night/blue scenes and future previews. |
| Letterbox | `#000000` | 62 px top + bottom at 1080p. |

## Dusk café / street (warm) — `t=10s, 26s`
`#1e101b` deep plum shadow · `#271620` · `#411f28` wine · `#4b3235` · `#7d564b` dusty clay · `#843834` awning red · `#b3875d` lit window amber.

## Night street (cool) — `t=82s, 405s`
`#100d1c` · `#171424` · `#211d30` · `#2a263a` · `#353045` · `#3f2f47` purple sky · `#464054` pavement · `#877a80` lit pavement.

## Interior warm hall (table-tennis gym) — `t=97s, 135s`
`#150d15` · `#2e1b22` · `#39262b` brown wall · `#653d41` · `#9f6b60` · `#c89d71` arched window glow.

## Sunset exterior (sports field) — `t=200s, 380s`
`#281a1c` · `#473237` · `#503e46` · `#745244` · `#816a5b` · `#a4754f` · `#c99166` · `#dcae8a` sun haze.

## Sky gradient recipe (the signature)
Top → bottom: `#2a1f4a` (indigo) → `#5b3d6e` (purple) → `#a35d6b` (mauve-rose) → `#e89a6a` (orange) → `#f6c98a` (horizon glow).
Night version: `#0d0b1e` → `#1c1838` → `#3a2c55` → `#5b3f63` (faint city glow at horizon).

## Character signature colours (this project)
| Character | Colour | Hex |
|---|---|---|
| Leo | red hoodie (white drawstrings) | `#d8373a` / shade `#9e2229` |
| Nora | mustard-yellow jacket + dark ponytail | `#e3b23c` / shade `#a77b1c` |
| Sam (friend) | green cap | `#4cc36b` |
| Boy | small, lime-green shirt (like the reference child) | `#7ee08a` |
| Crossing guard | hi-vis orange vest with silver stripes | `#ff7a1a` |
| Delivery truck | off-white box, red cab stripe | `#d9d4cc` / `#b5323a` |

## Future-preview palette (project-specific)
`#0a1a3a` base tint · `#2f7bff` glow · `#7fc8ff` ghost fill (40–55 % opacity) · `#d8f0ff` ghost edge.
The present is never tinted blue; the future always is.
