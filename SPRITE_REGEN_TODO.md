# Sprite Regeneration TODO — Targeted Re-Run

This document lists the **11 specific PNG sprites** that need to be regenerated
because the previous run produced bad output (checkerboard background pattern
baked into pixels, or solid white/dark rectangle around the subject instead of
real transparency).

**ALL OTHER SPRITES ARE FINE.** Do not regenerate the ~80 working ones.

---

## Why these specific files

A PNG was flagged as broken if **either**:

- It is `mode=RGB` (no alpha channel at all) → the model returned a flat
  rectangle with the "background" drawn as opaque pixels instead of leaving
  alpha=0 around the subject. The game then renders this rectangle on top of
  the sky gradient, exposing the bg.
- It is `mode=RGB` AND visually contains the editor's transparency-indicator
  checkerboard pattern as image content (the model literally drew the checker
  grid because it confused "transparent background" with the visual symbol
  for transparency).

`hill-grass.png` is intentionally opaque (it's the foreground hill scene) and
should **not** be regenerated.

The unused variants (`cloud-fluffy-1.png`, `cloud-fluffy-2.png`,
`cloud-fluffy-3.png`, `cloud-wispy-1.png`, `cloud-wispy-2.png`) exist on disk
but are not referenced anywhere in `index.html`. They can either be deleted or
left as-is; not in the regen list either way.

---

## File list (11 sprites)

### World (8 — referenced by `index.html`)

| File | Current problem |
|---|---|
| `assets/world/cloud-fluffy.png` | RGB, checkerboard pattern drawn around the cloud |
| `assets/world/cloud-wispy.png` | RGB, checkerboard pattern drawn around the cloud |
| `assets/world/rain-cloud-soft.png` | RGB, solid white rectangle around the cloud |
| `assets/world/house-left.png` | RGB, checkerboard + a stray color palette swatch on the right side |
| `assets/world/house-right.png` | RGB, solid white rectangle around the house |
| `assets/world/school.png` | RGB, checkerboard pattern |
| `assets/world/school-flag.png` | RGB, checkerboard pattern |
| `assets/world/tree-center.png` | RGB, checkerboard pattern |

### Characters (3)

| File | Current problem |
|---|---|
| `assets/characters/onero-idle.png` | RGB, opaque background |
| `assets/characters/onero-action.png` | RGB, opaque background |
| `assets/characters/onero-magical.png` | RGB, opaque background |

---

## API parameters (the most important fix)

The previous run's checkerboard / solid-bg failures almost certainly came from
**not passing `background="transparent"`** on the API call, or passing a
non-PNG `output_format`. Verify every call uses these:

```python
response = client.images.generate(
    model="gpt-image-1",          # NOT dall-e-3 — only gpt-image-1
                                  #   supports the transparent-bg flag
    prompt=prompt_text,
    background="transparent",     # ← this is the critical one
    output_format="png",          # ← required for alpha to be preserved
    quality="medium",             # ~$0.042/img — sweet spot
    size="1024x1024",
    n=1,
)
# Response is base64 — gpt-image-1 doesn't support response_format="url"
import base64
open(out_path, "wb").write(base64.b64decode(response.data[0].b64_json))
```

**Cost ceiling**: 11 × $0.042 = **~$0.46 total**, plus prompt-input cost
(negligible — under $0.01 across all 11).

---

## Prompts (one per file)

Every prompt below ends with the same **anti-checkerboard suffix**. Don't drop
it — it's what stops the model from drawing the editor checker grid as content.

> `Sticker-style cutout, centered, no background, no scenery, no border,
> no ground shadow, no text, no color palette swatches. Pure transparent PNG —
> the background must be fully transparent alpha=0, NOT a checkerboard pattern,
> NOT white, NOT any color.`

### `assets/world/cloud-fluffy.png`
```
A single fluffy white cumulus cloud, soft and rounded, gentle pastel highlights
of pale blue and lavender. Whimsical, magical, cute children's-book style.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/world/cloud-wispy.png`
```
A wispy thin cloud, soft and stretched, pale white with subtle pastel pink and
blue highlights. Whimsical, light, airy. Children's-book style.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/world/rain-cloud-soft.png`
```
A soft rain cloud, rounded and friendly, dark lavender-grey with a kind face
(closed sleepy eyes, small smile, soft pink cheeks), a few cute teardrop
raindrops falling below. Children's-book style, never scary, gentle.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/world/house-left.png`
```
A whimsical storybook cottage with a thatched or tiled roof, warm cream walls,
small round windows, a wooden front door, soft pastel detailing. Children's
book illustration style, cute, magical. Front-facing, slightly 3/4 view.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/world/house-right.png`
```
A whimsical storybook cottage variant — different shape from a typical cottage,
maybe with a tall narrow tower or different roof angle. Pastel pinks and warm
yellows, cute round windows with flower boxes, charming front door. Children's
book illustration style. Front-facing, slightly 3/4 view.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/world/school.png`
```
A magical storybook elementary school building, two stories, brick or warm
stone walls, large arched windows glowing softly, a charming peaked roof with
a small tower and pennant flag, welcoming front entrance with stone steps.
Children's-book style, warm and inviting, never institutional. Front-facing,
slight 3/4 view. NO sparkles or magic effects in this version (those will be
added by the game at runtime).
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/world/school-flag.png`
```
A small magical pennant flag on a slim flagpole — triangular cloth in warm
red/gold with a single white star, gold finial on top of the pole, just the
upper portion of the pole visible. Whimsical children's-book style. NO ground,
NO base, NO sparkles.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/world/tree-center.png`
```
A single full-grown leafy tree, lush green canopy with rounded foliage clusters,
warm brown trunk with visible bark, a small grassy mound at the very base of
the trunk. Children's-book style, cute, magical. Front view.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/characters/onero-idle.png`
```
A magical unicorn named Onero with a mysterious moonlit glow — pale lavender
and silvery-blue coloring, soft flowing mane with star-like sparkles, gentle
wise expression, big kind eyes, sitting peacefully. Whimsical, calm, magical.
Children's game art style. Side view.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/characters/onero-action.png`
```
The same unicorn Onero — pale lavender and silvery-blue, moonlit glow — now
standing tall and ready, mane flowing, surrounded by gentle starlight sparkles,
calm protective expression. Whimsical, magical, kind.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

### `assets/characters/onero-magical.png`
```
The same unicorn Onero in their full magical form — pale lavender and silver,
horn glowing with soft moonlight, surrounded by swirling starlight magic and
constellation sparkles, eyes closed in serene concentration, mane lifted by
magic energy. Whimsical, gentle, peaceful magical aura.
Sticker-style cutout, centered, no background, no scenery, no border, no ground
shadow, no text, no color palette swatches. Pure transparent PNG — the
background must be fully transparent alpha=0, NOT a checkerboard pattern,
NOT white, NOT any color.
```

---

## Validation per file (run after each generation)

```python
from PIL import Image
img = Image.open(path)
assert img.mode == "RGBA", f"{path} is {img.mode}, not RGBA — failed"
px = list(img.getdata())
n = len(px)
a0   = sum(1 for p in px if p[3] == 0)   / n
a255 = sum(1 for p in px if p[3] == 255) / n
pa   = 1 - a0 - a255
assert a0   >= 0.08, f"{path} has only {a0*100:.1f}% transparent pixels — failed"
assert a255 >= 0.30, f"{path} has only {a255*100:.1f}% opaque pixels — failed"
assert 0.005 <= pa <= 0.08, f"{path} partial-alpha {pa*100:.2f}% out of range — failed"
```

If any check fails, retry that prompt up to 2 more times before giving up.

## Post-process per file

After validation, trim to bounding box and downsize to ≤512×512:

```python
bbox = img.getbbox()
if bbox:
    img = img.crop((max(0, bbox[0]-4), max(0, bbox[1]-4),
                    min(img.width,  bbox[2]+4),
                    min(img.height, bbox[3]+4)))
if max(img.size) > 512:
    img.thumbnail((512, 512), Image.Resampling.LANCZOS)
img.save(path, "PNG", optimize=True)
```

---

## After this re-run

Push the 11 new PNGs and ping back here for verification. I'll re-scan every
asset and confirm:
- All 11 are RGBA with healthy alpha distribution
- No remaining RGB-mode files except `hill-grass.png`
- The game still loads every manifest entry

## Optional cleanup (not required for the regen)

Five orphan duplicate PNGs are sitting in `assets/world/` but not referenced
by `index.html`:
- `cloud-fluffy-1.png` (RGB checkerboard)
- `cloud-fluffy-2.png` (RGB checkerboard)
- `cloud-fluffy-3.png` (RGB dark bg)
- `cloud-wispy-1.png` (RGB dark bg)
- `cloud-wispy-2.png` (RGB checkerboard)

Safe to `rm` them — the game doesn't use them and they're another ~6 MB of
unused asset weight on the deploy.
