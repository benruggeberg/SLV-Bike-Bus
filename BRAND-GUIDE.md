# SLV Bike Bus Brand & Style Guide

**Version:** 0.2 - Working system  
**Date:** September 30, 2026  
**Status:** Core brand system is usable now. Final logo, wordmark, illustration assets, and logo production rules are still in progress.

This file is the implementation-oriented source of truth for the SLV Bike Bus visual and verbal system. It is intentionally lightweight. Use it when updating the website, building school pages, making social graphics, flyers, stickers, shirts, signs, banners, email/newsletter materials, or other public-facing assets.

## 1. Brand foundation

### Brand character
SLV Bike Bus should feel:

- **Local** - unmistakably rooted in the San Lorenzo Valley, its redwoods, roads, schools, and families.
- **Joyful** - riding together should look fun, social, and welcoming.
- **Clear** - practical information must be easy to scan, especially times, route details, safety information, and cancellations.
- **Outdoorsy** - warm, sturdy, and nature-connected rather than slick, corporate, or tech-forward.

Supporting traits: friendly, adventurous, neighborly, capable, kid-centered.

### Emotional priority
When tradeoffs are necessary, prioritize the brand in this order:

1. **Family and community**
2. **Fun and small adventure**
3. **Practical clarity and reliability**
4. **Active-transportation benefits**

The program should feel like **riding to school with neighbors**, not like an advocacy campaign or institutional transportation initiative.

### Design filter
When making a design choice, ask:

> Does this feel local, joyful, clear, and outdoorsy?

If not, simplify it or bring it back toward the core system.

### Avoid
- Corporate transportation-program styling
- Racing/performance-cycling aesthetics
- Advocacy jargon as the lead message
- Neon, glossy, or high-tech visual treatments
- Generic bicycle clip art
- Excessive gradients, glass effects, or decorative shadows
- Childish/cartoon styling that makes the organization feel less capable or trustworthy

---

## 2. Color system

### Master brand colors

These colors identify **SLV Bike Bus itself** and should remain consistent across every school.

| Token | Name | Hex | Primary use |
|---|---|---|---|
| `brand.green` | Redwood Green | `#1B4332` | Master brand anchor: links, primary buttons, logo/wordmark applications, major headings, progress indicators |
| `brand.gold` | Sun Gold | `#FDB43C` | Warm highlight: sun/road motifs, signs, selected cards, cheerful emphasis |
| `brand.cream` | Redwood Cream | `#F6EBD7` | Warm illustration/background field, large panels, printed materials |
| `brand.bark` | Bark Brown | `#5A3A28` | Redwood/trail imagery, grounding accents, footer/forest applications |

### Neutral colors

| Token | Name | Hex | Primary use |
|---|---|---|---|
| `neutral.ink` | Ink | `#16201B` | Body text and darkest typography; also serves as the system's near-black |
| `neutral.paper` | Paper | `#FCF8F0` | Main page background and reading surface |
| `neutral.muted` | Muted | `#56625C` | Captions, notes, metadata, secondary copy |
| `neutral.rule` | Rule | `#E2DCCB` | Dividers, borders, untraveled/progress tracks |

### Shared school/campus accent

| Token | Name | Hex | Primary use |
|---|---|---|---|
| `school.red` | School Red | `#C1121F` | Shared SLV school/campus accent: route line, schedule times, school labels, map markers, selected school-specific details |

**School Red is not a master SLV Bike Bus color.** It is an accent that connects the Bike Bus to the existing visual language of the SLV school campus.

The three initial schools are:

- **San Lorenzo Valley Elementary (SLE)** - Bobcats
- **San Lorenzo Valley Middle School (SLVMS)** - Panthers
- **San Lorenzo Valley High School (SLVHS)** - Cougars

All three schools already use a red/black visual tradition. SLVHS officially lists red and black as its school colors. Current official SLE and SLVMS materials also prominently use red with black/white. No official exact red hex was found for the schools, so `#C1121F` remains the Bike Bus's chosen **School Red**, not a claim that it is an official district hex.

### Why the schools do not get separate colors
The three schools share one campus and are expected to use substantially the same Bike Bus route, with differences mainly in school destination and timing. Giving each school a different route color would imply different physical routes when there may be only one.

Differentiate schools with:
- school abbreviation/name
- mascot or school label where useful
- departure/arrival time
- destination text

Do **not** invent three unrelated accent colors just to make the schools look different.

### Recommended color hierarchy
A typical SLV Bike Bus layout should be mostly Paper/Cream, anchored by Ink/Redwood Green, with Gold or School Red used selectively.

A useful default balance is approximately:

- **70%** Paper / Cream / open space
- **20%** Ink / Redwood Green
- **10%** Gold / School Red / Bark Brown

This is a guide, not a rigid formula.

### Preferred accessible combinations

| Foreground | Background | Contrast | Guidance |
|---|---|---:|---|
| Ink `#16201B` | Paper `#FCF8F0` | 15.8:1 | Excellent for all text |
| Redwood Green `#1B4332` | Paper `#FCF8F0` | 10.5:1 | Excellent for text, links, buttons |
| School Red `#C1121F` | Paper `#FCF8F0` | 5.9:1 | Good for normal text and operational information |
| Ink `#16201B` | Sun Gold `#FDB43C` | 9.4:1 | Preferred text treatment on gold |
| Redwood Cream `#F6EBD7` | Redwood Green `#1B4332` | 9.4:1 | Excellent reverse treatment |
| Redwood Cream `#F6EBD7` | Bark Brown `#5A3A28` | 8.6:1 | Excellent reverse treatment |
| Sun Gold `#FDB43C` | Paper `#FCF8F0` | 1.7:1 | **Do not use for small text** |

### Dark mode

| Token | Role | Hex |
|---|---|---|
| `dark.background` | Page background | `#23302A` |
| `dark.elevated` | Header/elevated surface | `#2A3A31` |
| `dark.text` | Main text | `#E8EEE9` |
| `dark.green` | Links / progress / green accent | `#7FCF9F` |
| `dark.schoolRed` | School/route/time accent | `#FF9A8A` |
| `dark.bark` | Footer / earth accent | `#3D271B` |

Use **Elevated Green** rather than the implementation-specific name "Header Sky" so the color can also serve cards, navigation, overlays, and other elevated surfaces.

---

## 3. Typography

Typography is now **locked for the working brand system**. Both fonts are free/open-source and are self-hosted on the site.

### Heading / sign face: Overpass

Use **Overpass** for headings and anything that should feel sign-like. Its highway-signage lineage fits the transportation context without making the project feel institutional.

- **Overpass ExtraBold 800** - H1s, major campaign statements, large signs, high-impact labels
- **Overpass Bold 700** - H2/H3, navigation, stop names, times, status labels, step numbers, compact UI labels

Current examples include page titles, section headings, nav links, facts-sign labels and times, next-bus messaging, route stop names/times, map labels, step numbers, status-banner labels, and the footer's primary meetup line.

### Body / reading face: Atkinson Hyperlegible

Use **Atkinson Hyperlegible** for body text and practical instructions. It was designed for high legibility and is especially appropriate for parents reading quickly on phones or outdoors.

- **Regular 400** - paragraphs, instructions, FAQ answers, lists, banner messages, footer/disclaimer copy
- **Bold 700** - body-level emphasis, FAQ questions, important instructions
- **Italic 400** - occasional human aside; avoid long passages in italic

### System font
Use the system font only where platform-native controls benefit from it, such as map `+` / `-` zoom controls.

### Typography rule
**Do not add a third brand typeface for extra personality.** The final logo can carry the chunkier, more playful lettering. Overpass and Atkinson Hyperlegible should keep the website and practical materials clear.

### Suggested web hierarchy

| Role | Typeface | Desktop | Mobile | Weight |
|---|---|---:|---:|---:|
| H1 | Overpass | 48-56 px | 38-44 px | 800 |
| H2 | Overpass | 30-36 px | 28-32 px | 700 |
| H3 | Overpass | 21-24 px | 20-22 px | 700 |
| Body | Atkinson Hyperlegible | 17-18 px | 17 px | 400 |
| Body emphasis | Atkinson Hyperlegible | same as body | same as body | 700 |
| Small / metadata | Atkinson Hyperlegible | 14-15 px | 14-15 px | 400-700 |
| Key time / number | Overpass | 18-24 px | 18-22 px | 700-800 |

Target body line-height around **1.5-1.65**. Favor comfortable reading over density.

### Typographic behavior
- Default to **sentence case**.
- Avoid all-caps for ordinary headings and body content.
- Use weight and size - not extra typefaces - to create hierarchy.
- Make departure/arrival times extremely easy to scan.
- Keep paragraphs relatively narrow.
- Use ExtraBold selectively so the site does not feel shouty.

---

## 4. Logo, illustration, and graphic system

**Status: in progress.** The final badge, wordmark, and asset files are still being developed.

### Planned identity assets
Maintain three levels of identity:

1. **Primary badge** - circular SLV Bike Bus family/cargo-bike identity for avatars, stickers, shirts, signage, flyers, and high-recognition applications.
2. **Wordmark** - `SLV BIKE BUS` without the full illustration for tight or horizontal layouts.
3. **Supporting illustrations** - mountain-lion/cougar family, bikes, redwoods, mountains, sun, roads/trails, and school-route scenes that can vary without changing the logo.

### Illustration-first brand
SLV Bike Bus should be **illustration-led by default**. Real photography can document the program, but the normal website, social, and print system should not depend on recognizable photographs of children.

This improves visual consistency and reduces the need to make child-photo consent decisions for routine communications.

### Illustration language
Preferred visual vocabulary:
- redwoods and Santa Cruz Mountains
- warm sun
- cargo bikes and family riding
- mountain-lion/cougar family characters
- cream negative space
- bold, friendly outlines
- simplified forms with enough detail to feel handcrafted, not generic

### Badge on dark backgrounds
On dark surfaces, give the circular badge a thin Redwood Cream outline (about 3px at web sizes) so its dark green ring doesn't disappear into the background.

### Important distinction
**Do not make every graphic look like the logo.** The logo should remain stable. Supporting illustrations may change pose, composition, season, school, and activity.

### Reusable graphic motifs
Use a small set of recurring motifs so materials remain recognizable even without the full badge:

- **Sun circle** - warm gold/orange circular sun
- **Road/trail curve** - broad sweeping cream/gold pathway
- **Redwood silhouettes** - simplified green/brown tree forms
- **Route line + dots** - shared School Red for route/wayfinding information on the SLV campus

### Shape language
- Soft but sturdy
- Rounded corners, but avoid turning every component into a pill
- Circles for stops, suns, and badges
- Broad organic curves for landscape and roads
- Relatively thick borders/lines
- Minimal shadows
- Little or no glassmorphism
- Avoid decorative gradients unless a future illustration system intentionally calls for one

The overall feel can be described as **clean park-sign / field-guide / screen-print adjacent**, with modern web clarity.

---

## 5. School and route architecture

SLV Bike Bus is the umbrella brand. Individual school pages are applications of the same brand, not separate mini-brands.

### Initial campus
The first implementation serves the Felton SLV school campus:

- SLE - San Lorenzo Valley Elementary
- SLVMS - San Lorenzo Valley Middle School
- SLVHS - San Lorenzo Valley High School

The schools share a campus area and are expected to use the same or substantially the same route. Times and exact destination details may differ.

### Master identity: always consistent
Every school page keeps:
- Redwood Green
- Sun Gold
- Redwood Cream
- Bark Brown
- Ink / Paper neutrals
- Overpass + Atkinson Hyperlegible
- core logo / wordmark
- illustration language
- voice and component rules

### Shared school/campus identity
Use School Red for:
- route line and stop dots
- schedule times
- school abbreviation/name when emphasis is needed
- destination labels
- selected campus-specific campaign accents

Use **labels and times**, not arbitrary color changes, to distinguish SLE, SLVMS, and SLVHS.

### Future expansion
If a Bike Bus later serves a school outside the SLV tri-campus, do not automatically give it a new accent. First check whether the school has a recognizable existing visual identity and whether a distinct accent improves comprehension. The SLV Bike Bus master palette must remain recognizable either way.

---

## 6. Voice and writing

### Voice principles
SLV Bike Bus copy should be:

- **Family/community-first** - invite people into a shared neighborhood experience.
- **Warm** - written like a helpful local parent, not an institution.
- **Fun** - small moments of adventure are welcome.
- **Short** - get to the point quickly.
- **Active** - use direct verbs and concrete actions.
- **Specific** - say where, when, and what people need to do.

A little playfulness is welcome. Do not rely on constant bicycle puns.

### Prefer
- `Ride to school with neighbors.`
- `Meet at 8:00. Roll at 8:05.`
- `Bring your kids. Bring your bike. We'll ride together.`
- `Light rain is part of the adventure.`
- `No. Join when it works for you.`

### Avoid
- `Participants are encouraged to arrive at the designated departure location prior to the scheduled departure time.`
- `We seek to facilitate active transportation modalities for school communities.`

### Information order
For practical rider communications, favor:
1. What is happening?
2. When?
3. Where?
4. What should the family do?
5. Any safety/change information?

---

## 7. Photography and child privacy

Photography is **secondary to illustration**, but authentic photographs can be useful for documenting the program.

Prefer:
- candid over posed
- families riding over bikes sitting still
- real local landscape over generic streets
- movement and conversation over sports/performance imagery
- redwoods, Fall Creek, cargo bikes, group arrival, and community moments

For routine public materials, favor images that do not depend on identifiable child faces: wider group scenes, back/side angles, helmets, motion, or parent-focused compositions can work well.

When identifiable children appear, follow the program/school's applicable photo-consent practices. Do not publish children's names with images unless there is a clear, intentional reason and appropriate permission.

Avoid generic stock cycling photography when authentic local imagery or illustration is available.

---

## 8. Print and production

Print matters to this brand. The system should work on flyers, stickers, yard signs, banners, shirts, and other physical materials without needing a separate visual identity.

### General production principles
- Prefer **vector artwork** (SVG/PDF) for logos and illustrations whenever possible.
- For raster artwork, target **300 ppi at final printed size**.
- Keep important text and marks comfortably inside trim/cut lines.
- Add bleed when the printer requests it; **0.125 in** is a common starting point for full-bleed print pieces.
- Ask for a physical or digital proof for large runs, unusual materials, or color-critical work.
- Do not treat screen HEX values as guaranteed print matches. Let the printer convert using the correct CMYK/output profile.

### Logo production set - required once the logo is final
Create and keep:
1. full-color primary badge
2. simplified/small-use badge if needed
3. one-color dark version
4. one-color light/reversed version
5. standalone wordmark
6. vector master files plus high-resolution transparent PNG exports

The final guide should also define logo clear space and minimum sizes after the artwork is locked.

### Shirts and screen printing
- Favor one- or two-color versions when practical.
- Avoid tiny internal details that can fill in on fabric.
- Test the logo at real chest/pocket/back-print sizes before ordering a run.
- Do not add extra effects just because more ink colors are available.

### Stickers
- Keep the silhouette recognizable at small sizes.
- Provide a simple contour or margin around intricate artwork when needed for die cutting.
- Test the primary badge at approximately 2-3 inches before assuming smaller sizes will hold detail.

### Yard signs and banners
- Prioritize **message > time > location > logo**.
- Use Overpass for the key message and numbers.
- Keep copy very short and readable at distance.
- Favor Ink/Green on Cream/Paper or Cream on Green; use Gold and School Red as accents rather than large fields of small text.

### Flyers
- Maintain generous open space.
- Put the action and date/time near the top.
- Use illustration as an invitation, not as competition with practical details.
- Keep body copy in Atkinson Hyperlegible.

---

## 9. UI and component guidance

### Buttons
Primary buttons:
- Redwood Green background
- Cream or Paper text
- clear focus state
- moderate corner radius, not an exaggerated pill

Gold buttons/callouts:
- Use Ink text on Sun Gold
- Reserve for cheerful emphasis or a special action; do not let gold compete with the primary green CTA everywhere

### Cards
- Paper or Cream surface
- use Rule for borders
- use School Red only when the content is operational/school-specific
- keep shadows subtle or omit them
- **Clickable cards** (e.g. a live school card) get a solid offset edge, not a soft shadow: 3px Ink edge at rest, lifting to 6px on hover/focus. Use a Redwood Cream edge in dark mode. Non-clickable cards stay flat.

### Status messages
Use semantic meaning first, brand color second.
- Information / changed: Gold with Ink text
- School/route operational emphasis: School Red where appropriate
- Cancellation / urgent: School Red can work, but text/icon semantics must also communicate the state; do not rely on color alone

### Maps and schedules
- Shared route line and key times may use School Red
- Keep labels and explanatory text Ink/Muted
- Use strong numeric hierarchy for times
- Identify the destination/school explicitly rather than relying on color
- Preserve accessible text alternatives for map content

---

## 10. Implementation tokens

Use semantic variables in code rather than scattering raw hex values.

```css
:root {
  /* Master brand */
  --brand-green: #1B4332;
  --brand-gold: #FDB43C;
  --brand-cream: #F6EBD7;
  --brand-bark: #5A3A28;

  /* Neutrals */
  --ink: #16201B;
  --paper: #FCF8F0;
  --muted: #56625C;
  --rule: #E2DCCB;

  /* Shared SLV school/campus accent */
  --school-red: #C1121F;
  --school-red-dark: #FF9A8A;
  --school-accent: var(--school-red);
  --route-line: var(--school-red);

  /* Typography */
  --font-heading: "Overpass", Arial, sans-serif;
  --font-body: "Atkinson Hyperlegible", Arial, sans-serif;
  --weight-heading: 700;
  --weight-display: 800;
  --weight-body: 400;
  --weight-body-bold: 700;

  /* Dark mode */
  --dark-bg: #23302A;
  --dark-elevated: #2A3A31;
  --dark-text: #E8EEE9;
  --dark-green: #7FCF9F;
  --dark-bark: #3D271B;

  /* Semantic aliases */
  --color-text: var(--ink);
  --color-background: var(--paper);
  --color-link: var(--brand-green);
  --color-primary-action: var(--brand-green);
  --color-highlight: var(--brand-gold);
  --color-school-accent: var(--school-accent);
  --color-route: var(--route-line);
  --color-divider: var(--rule);
}
```

### School-level hooks
SLE, SLVMS, and SLVHS currently inherit the same school accent because they share the same red/black campus visual language and likely the same route.

```css
[data-school="sle"],
[data-school="slvms"],
[data-school="slvhs"] {
  --school-accent: var(--school-red);
  --route-line: var(--school-red);
}
```

Do not create different school colors unless there is a real communication need.

### Claude Code implementation instruction
When modifying the project:

1. Reuse these semantic tokens before adding a new color.
2. Keep master brand colors separate from School Red.
3. Do not invent separate route colors for SLE, SLVMS, and SLVHS merely to distinguish them.
4. Preserve the distinction between `--paper` (reading surface) and `--brand-cream` (warmer brand/illustration field).
5. Preserve accessible contrast. In particular, do not use Sun Gold as small text on Paper/Cream.
6. Keep **Overpass** for sign-like/headline roles and **Atkinson Hyperlegible** for body/reading roles. Do not add a third brand typeface without updating this guide.
7. Prefer illustration over child photography for routine public materials.
8. Keep school differentiation explicit in text: school name/abbreviation, destination, and time.
9. Do not introduce a new visual motif, corner-radius system, shadow language, or typeface without updating this guide.
10. When preparing printable assets, preserve vector artwork where possible and do not assume web HEX values are exact print specifications.

---

## 11. Current status / next decisions

| Area | Status | Next step |
|---|---|---|
| Brand character | Locked enough to use | Family/community and fun should lead |
| Master colors | Working / recommended | Keep green-gold-cream master system |
| School/campus accent | Working / recommended | Shared School Red for the SLV tri-campus; do not imply different routes with arbitrary colors |
| Dark mode | Working / recommended | Use Elevated Green naming |
| Typography | Locked for working system | Overpass + Atkinson Hyperlegible |
| Primary badge | In progress | Insert final approved artwork and usage rules |
| Wordmark | In progress | Insert final artwork and minimum-size/clear-space rules |
| Supporting illustrations | In progress | Define final asset set and examples |
| Photography | Working guidance | Illustration-first; document photo-consent practice as needed |
| Voice | Working / recommended | Family/community first; use now |
| School/route architecture | Working / recommended | Shared route/campus treatment; distinguish by labels + times |
| Print production | Working guidance | Finalize one-color logo, clear space, min size, and production exports after logo approval |

---

**Website:** https://slvbikebus.org/  
**Current SLE page:** https://slvbikebus.org/sle/  

This guide should stay lightweight. Update it when a design decision becomes repeatable enough that another person - or an AI coding agent - should be able to apply it consistently without guessing.
