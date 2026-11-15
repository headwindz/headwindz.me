# Blog redesign (superseded)

Historical record only. The user rejected this direction. Current visual authority is `.impeccable/briefs/handcraft.md` and root `DESIGN.md`; the journal composition and its similarity measurements do not govern the replacement.

## Confirmed brief

- User: engineer-oriented, bold, innovative. Preserve Blogs, Projects, About, Tags.
- Redesign the homepage, archive, and reading pages as one coherent experience.
- Preserve factual content, existing URLs, search, examples, and both themes.
- User delegated creative choices and instructed implementation: “你决定，可以给点建议”, then “Do it”.
- Build path: comp, as previously chosen in .impeccable/config.json.
- Mode: Read. The homepage also demonstrates the author's engineering work.

## Direction

Engineering journal: editorial typography, precise diagrams, generous reading space. Warm ivory and dark ink, vermilion accent, muted sage secondary surfaces. Playfair Display with existing Space Grotesk body (the implemented font pairing). No decorative grids, fake terminal commands, invented metrics, or ambient animation.

## First viewport

Clear four-module navigation. Large editorial title, factual author introduction, one meaningful interactive agent loop linked to the actual agents-and-harnesses article. Expressive opening resolves into a calm writing archive. Recent articles remain reachable without confusing curation with chronology.

## Signature interaction

Step through Model → Tools → Context → Evaluate using an explicit button. Every step has a concise explanation. No autoplay; reduced motion keeps state changes immediate. Interaction demonstrates the subject rather than serving as decoration.

## Cross-surface reach

Archive: clear title, compact topic entry, ruled writing rows. Article: large serif title, real metadata, sticky section index at large sizes, collapsible index on phones, legible body. Projects: editorial image/text spreads. About: portrait and factual biography. Tags: readable topic index.

## Validation

Desktop, mobile, and intermediate widths; both themes; keyboard navigation and menu; search; article index; preview dialogs; editable demo; lint and production build. Preserve the pre-existing stablecoin diagram work and staged articles.

## Grounded direction exploration

The audience's visual world yielded: editorial engineering journal; code-review marginalia; topic transit map; museum catalogue; personal hypertext wiki; technical specification sheets; experimental typography specimen. The roll assigned the seventh; user then pinned engineer-oriented editorial direction, which wins over the roll. External catalog was unavailable after one escalated retry, so no external quality boards are claimed.

## Approved comp

.impeccable/mocks/engineering-journal-a.png. Selected under user delegation; three compositions generated and inspected. Correct invented dates and inaccurate article summaries. Diagram edges must reflect the explanatory loop. Use real UI and SVG geometry, not a flattened screenshot.

## Final implementation notes

- Token-bearing DESIGN.md and the schema-version-2 sidecar record the implemented engineering journal.
- Final review corrected the diagram arrows to Model → Tools → Context → Evaluate → Model and gray-500 secondary text to #626b64 (approximately 4.69:1 against paper).
- The hero similarity gate remains below its threshold at approximately 67%; the implementation is not a pixel-identical reproduction of the approved composition.
- Production rebuild passed after the final corrections. Lint passed with one pre-existing app/seo.tsx warning. Production browser checks found no console errors and confirmed Model → Tools → Context → Evaluate → Model, computed secondary text #626b64, and 4.69:1 contrast. The independent finish review accepted shipment within this scope after the loop, contrast, and theme-menu fixes.
