---
name: headwindz.me
description: A personal notebook with plain type, paper cards, and restrained irregularity.
colors:
  paper: '#f8f8f5'
  card: '#ffffff'
  ink: '#252822'
  muted: '#5d6358'
  rule: '#d5d8cd'
  accent: '#705618'
  mark: '#f3d56b'
  note: '#fff8dc'
  paper-dark: '#20231e'
  card-dark: '#2b2f28'
  ink-dark: '#f1f2e9'
  muted-dark: '#b3b9a9'
  rule-dark: '#505748'
  accent-dark: '#f2d66d'
  mark-dark: '#685b27'
  note-dark: '#343426'
typography:
  display:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2.8rem, 4.7vw, 4.25rem)'
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2.1rem, 4.5vw, 3.5rem)'
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: '-0.035em'
  title:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.35rem'
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: '-0.025em'
  body:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    lineHeight: 1.8
  label:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.75rem'
rounded:
  button: '6px 9px 7px 10px'
  note: '10px 7px 12px 8px'
  card: '9px 13px 8px 12px'
  node: '5px 8px 6px 9px'
spacing:
  small: '0.5rem'
  base: '1rem'
  card: '1.5rem'
  section: '2rem'
  reading: '2.5rem'
components:
  notebook-button:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    rounded: '{rounded.button}'
    padding: '0.65rem 1rem'
  author-note:
    backgroundColor: '{colors.note}'
    rounded: '{rounded.note}'
    padding: '1.6rem'
  writing-card:
    backgroundColor: '{colors.card}'
    rounded: '{rounded.card}'
  agent-node:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.node}'
  agent-node-active:
    backgroundColor: '{colors.mark}'
---

# Design System: headwindz.me

## Overview

**Creative North Star: “Personal notebook.”**

Plain sans-serif typography, paper-like cards, small tilts, and sparse yellow
highlights make this a personal space for sharing technical work. Readability
stays orderly; irregularity belongs to the surrounding surfaces and controls.

This world replaces the rejected serif engineering journal. The user explicitly
selected the hand-crafted reference and instructed a direct rebuild. The visual
authority is the pinned reference captured at
.impeccable/review/handcraft/reference.png, not the earlier journal compositions.
Product facts remain in PRODUCT.md; css/tailwind.css owns implementation values.

**Key characteristics:**

- Modest sans-serif headings and comfortable technical reading.
- Fine borders, varied corner radii, and soft offset shadows.
- Restrained card tilts and yellow marker emphasis.

## Colors

### Primary

Yellow mark emphasizes the wordmark, a short phrase in the introduction, and
the selected agent node. The pale note surface distinguishes the author card.
The darker accent supports readable links and selected borders.

### Neutral

Use paper for the page, card for raised paper surfaces, ink for text, muted for
supporting copy, and rule for borders. Dark mode has explicit counterparts for
all eight roles; use the existing custom properties so surfaces and text change
together. Light is the default theme; saved selections and switching remain.

**The sparse marker rule.** Highlight a short phrase or current state; keep
paragraphs and broad reading surfaces neutral.

## Typography

Space Grotesk supplies display, headings, body, and interface text. app/layout.tsx
loads only this sans-serif family. The former Playfair Display loader and serif
hierarchy no longer define this system.

The primary headline caps at 4.25rem, with 650 weight and tight tracking. Article
mastheads cap at 3.5rem and 25ch; mobile mastheads cap at 2.6rem. Article paragraphs
and lists use 1.8 line-height and a maximum reading measure of 75ch. Body section
headings use 1.65rem and 1.3rem. Metadata and compact controls use small sans-serif
text, with tabular numbers for dates.

## Layout

The shared container is capped at 1120px with 2rem side gutters. Below 768px,
gutters become 1rem. The desktop header has a 100px minimum height; below 768px,
it becomes 82px. Desktop navigation yields to the mobile menu below 640px.

The homepage opening pairs a 3:2 introduction and author note, with a 4rem gap.
Below 768px it stacks, with the note capped at 480px. A separate selected-article
panel pairs real article copy with the interactive diagram; it stacks below
640px. Latest writing uses two columns, then one below 640px.

Reading pages pair a 190px sticky section index with a maximum 75ch body. Below
1024px the index moves above the body, using two columns of main sections. Below
640px it uses one column. Keep article body, code, index, and menus unrotated.

## Elevation & Depth

Paper cards use a small, soft offset shadow rather than dramatic elevation.
The light resting shadow is `0 3px 7px rgb(35 40 29 / 7%)`; dark mode uses
`0 3px 7px rgb(0 0 0 / 14%)`. The primary button's hover shadow is slightly
stronger, paired with a small lift. Borders remain visible and define edges.

## Shapes

Borders are fine (1px), with slightly different corner radii rather than one
uniform pill shape. Use the frontmatter's implemented four-corner values for
buttons, notes, cards, and nodes. Selected navigation tilts by -2 degrees; the
author note by 2 degrees. Latest cards alternate -0.65 and 0.7 degrees, reduced
to -0.35 and 0.4 degrees on phones. These are static tilts, not ambient motion.

## Components

### Buttons and text links

Primary notebook actions invert ink and paper, use a 46px minimum height, and
tilt -1 degree. Hover straightens and lifts them 2px over 180ms. Secondary links
use underlines and 44px minimum heights. Preserve the shared visible focus
outline and reduced-motion overrides.

### Navigation

Preserve Blogs, Projects, About, and Tags. The current desktop link receives a
paper card surface, fine border, soft shadow, and small tilt; hover adds the
card surface. Search, theme switching, and the mobile menu remain functional.
Menus stay aligned rather than tilted.

### Author note and topic chips

The pale yellow note includes the real avatar, author statement, topic links,
and profile link. A small marker-colored strip suggests tape. Topic chips use
card backgrounds, fine borders, small varied corners, and a 36px minimum height.
Keep text plain rather than imitating handwriting.

### Writing cards

Latest articles appear in slightly tilted paper cards with metadata above the
title, muted summaries, and a corner reading link. Alternate corner shapes and
small tilt directions. Archive entries use the same paper and border grammar
without rotating the reading layout. Preserve real dates, titles, and URLs.

### Agent loop

The diagram remains a meaningful, explicit interaction: Model → Tools → Context
→ Evaluate → Model. Selecting a node or Next step changes the active state and
its polite live explanation. Active nodes use marker yellow and an accent
border. There is no autoplay. The enclosing featured-article card tilts subtly;
the diagram geometry and explanation remain synchronized.

### Article index and fields

The native collapsible index uses a card background, varied small corners, and
a dashed internal rule. It becomes static above the body at smaller widths;
nested entries are hidden there. Search and editable-demo fields retain their
existing functional interfaces, focus visibility, and iframe isolation.

## Do's and Don'ts

- **Do** use plain sans-serif type, modest heading sizes, and sparse marker emphasis.
- **Do** apply hand-crafted character to containers while keeping long reading straight.
- **Do** preserve both themes, accessible controls, and real technical content.
- **Don't** restore the superseded serif editorial identity or its large display scale.
- **Don't** add ambient motion, faux terminal commands, fake claims, torn-paper polygons,
  or decorative imagery to this reference-led direction.

## Approved interaction refinement

The user confirmed the personal notebook as the main design. Preserve this
visual identity in future work unless a redesign is explicitly requested.

On fine pointers with hover support, paper cards straighten their resting tilt
and rise 4px over 240ms with cubic-bezier(0.16, 1, 0.3, 1). Their shadow deepens
and border strengthens. Keyboard focus within a card receives the same feedback.
This applies to writing cards, the author note, featured explanation, project
image triggers, and archive entries. Cards return naturally when interaction ends.

Touch has no hover movement. Reduced-motion mode retains each resting tilt and
uses only border/shadow feedback; the primary button also keeps its resting
position. Do not add autoplay or scroll reveals to this reading surface.

## Homepage project cards

Show the existing three projects together between the featured explanation and
recent writing. Use equal-width cards in three columns on desktop and one
column below 768px. Each card has a consistent 16:9 image, project name, short
factual summary, and one project link. Keep the full descriptions on Projects.
Project content and summaries live in data/projectsData.ts.

Reuse the notebook’s slight resting tilt and paper hover feedback. The whole
card is one keyboard-focusable link. There are no carousel controls, hidden
slides, scroll listeners, or client-side state. Reduced-motion mode preserves
the resting tilt and keeps only border/shadow feedback.

## About profile terminal

The user requested a terminal-style replacement for About. This is a scoped
exception to the notebook surfaces; retain the main design on other routes.
Use a dark green-black terminal with readable pale text and green accents,
monospace output, a compact identity row and straightforward command controls.
The titlebar lights are decoration, not nonfunctional window controls.

The full biography is shown by default from the author MDX source. Commands
about, interests, opensource, all, help and clear filter or explain that content.
Buttons offer the same sections without requiring command knowledge. Support
case-insensitive commands, clear recovery from unknown commands, and bounded
history through up/down arrows. No fake boot sequence, typewriter delay,
autoplay, backend shell, or invented activity logs. These are local profile
navigation commands. Keep the original facts, roles and links.

Terminal colors: background #18201d, titlebar #232d28, input area #1c2721,
body #dce7df, muted #b1beb6, accent #c0df99, links #bcd3e8, and rules #3d4a42.
The terminal remains dark in both outer themes. Stack contribution groups on
phones, preserve focus contrast, and avoid horizontal page scrolling.
