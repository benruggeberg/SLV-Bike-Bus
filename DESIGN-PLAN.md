# Design token plan (proposal, awaiting Ben's review)

Nothing here is applied yet. The site currently uses Pico defaults plus functional
placeholder colors in `assets/css/site.css`. Once approved, the tokens go into
`:root` in that file. Colors will be revisited when the logo exists.

## Idea

A school-morning bus route through the redwoods. Spend the boldness on **the route
line**: the route list becomes a transit-map strip (thick green line, round stop
markers, times in bold). The hero gets one yellow "bus sign" block with the key facts.
Everything else stays calm: white or near-black background, plain type.

## Colors

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bb-forest` | `#1f4d35` deep forest | `#7fcf9f` | Primary: links, buttons, route line, headings accent |
| `--bb-redwood` | `#8a3b23` redwood bark | `#e79a7c` | Secondary: stop markers, small details. Never body text on dark. |
| `--bb-bus` | `#f5c400` school-bus yellow | `#f5c400` | Hero fact block background (with near-black text), "changed" banner |
| `--bb-ink` | `#16201b` | `#e8eee9` | Body text |
| `--bb-paper` | `#ffffff` | `#111714` | Page background (plain white, not cream) |
| `--bb-alert` | `#b3261e` | `#ff6b5f` | "Cancelled" banner only |

Measured contrast: ink on paper 16.7:1 (dark 15.4:1); forest on white 9.7:1
(dark 9.8:1); redwood on white 7.7:1 (dark 8.1:1); ink on bus yellow 10.2:1;
white on alert red 6.5:1. All pass AA.

## Type

- **Overpass 800/700** (US highway-sign lineage) for the site name, h1–h3, stop names,
  and times. Sentence case, no all-caps labels.
- **Atkinson Hyperlegible 400/700** for body text, sized at 18px base on phones.
- Both are already self-hosted in `assets/fonts/` (SIL OFL).

## Layout sketch (phone, 360px)

```
┌──────────────────────────────┐
│ [CANCELLED: No bus today…]   │  ← banner, only on the day
│ SLV Bike Bus   Join Route …  │
│ [logo] SLE Bike Bus          │
│ ┌──────────────────────────┐ │
│ │ Leaves 8:00am            │ │  ← yellow bus-sign block
│ │ Cooper St & Farmer St    │ │
│ │ Arrives 8:10–8:15        │ │
│ │ Every school day in Oct  │ │
│ └──────────────────────────┘ │
│ [ How to join ]              │  ← forest green button
├──────────────────────────────┤
│ 1 2 3 4 5 numbered steps     │
│ map                          │
│ ●  Cooper & Farmer   8:00    │  ← transit strip: thick green
│ │                            │     vertical line, round stops
│ ○  Fall Creek bridge         │
│ │                            │
│ ○  Hwy 9 shoulder            │
│ │                            │
│ ○  SLV High lot              │
│ │                            │
│ ◉  SLV Elementary 8:10–8:15  │
└──────────────────────────────┘
```

No cards with shadows, no scroll animations, no arrows on links.
