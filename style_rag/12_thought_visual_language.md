# 12 — Thought visual language (project rules)

*What If You Could Hear Everyone's Thoughts?* — thoughts are invisible, so they need a strict
visual grammar. These meanings must NEVER change mid-film.

| Visual treatment | Meaning |
|---|---|
| White caption near mouth + mouth moving | Spoken dialogue |
| Violet luminous text / window, mouth closed, tail dots to head | A thought Noah actually hears |
| Small illustrated scene inside a thought window | What that person is imagining |
| Pink handwritten text | Maya's affectionate thoughts (Act 1 only) |
| Grainy, monochrome, torn-edge panel | Noah's **speculation** — NOT real |
| Many overlapping panels | Mental overload |
| Clean warm frame, few/no overlays | Attention on real people / real conversation |
| Thought graphics fading, small, out of focus | Noah choosing not to act on private thoughts |

## Construction
- Thought window: rounded rect radius 18, fill `#a98bff` @ 18 %, border `#d9c9ff` 2 px with glow,
  three tail dots shrinking toward the thinker's head. Pops in (see `07`) with `sfx_thought_pop`.
- Thought text: Caveat/Patrick Hand 44–64 px, `#efe6ff` with violet glow; appears word-by-word
  synced to the thought VO.
- Speculation panel: desaturated grey-violet `#8d8597`, heavy grain, jagged/torn border,
  slight flicker, slower drift.
- Overload: 20–80 windows across 3 depth layers, each with a fragment of text, drifting and
  multiplying; camera orbit; vignette tightens; colour shifts violet.

## The power's rules (logic auditor must enforce)
1. Noah hears only what a person is thinking **right now** — not memories or full knowledge.
2. Range = people near him (≈ a building). Walls, hands and headphones do not block it.
3. He cannot switch it off. In the end he still hears thoughts; he chooses not to react.
4. Thoughts are partial, emotional fragments — which is why he misreads them.
