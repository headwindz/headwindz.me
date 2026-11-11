# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Developers reading practical explanations of frontend development, AI tools and agents, Web3, and software engineering.
- Potential collaborators and employers evaluating Michael Zheng's work, experience, and technical judgment.

Both audiences are equally important.

## Product Purpose

headwindz.me is Michael Zheng's personal blog and portfolio. It shares knowledge and practical experience while making his capabilities and projects easy to evaluate. Knowledge sharing and professional presentation have equal priority.

## Positioning

The site brings Michael's own writing, interactive technical examples, projects, and author profile together. Ground its identity in those real contributions rather than generic expertise claims.

## Operating Context

Visitors can browse recent posts, explore the blog and tags, search locally indexed articles, read technical explanations, and try editable React examples. Projects and About provide context about the author and his work.

Articles and author profiles are maintained as MDX in the repository. Project entries and site identity are maintained in local data files.

## Capabilities and Constraints

- Preserve existing published article URLs. Intentional slug changes require redirects.
- Preserve search, tags, and editable examples in future redesigns.
- Preserve accurate author and project information; confirm changes to factual claims.
- The existing application uses Next.js App Router, React, TypeScript, Contentlayer2, and Tailwind CSS. Follow `README.md`, `AGENTS.md`, and `package.json` for current implementation and workflow details.
- Editable examples require a Node.js preview endpoint; static-only hosting cannot support that workflow. Keep supported-import restrictions and iframe isolation intact.
- Site-wide language policy remains undecided; do not infer a requirement to translate existing content.

## Brand Commitments

The user confirmed the personal notebook style in `DESIGN.md` as the main design: plain type, paper cards, subtle irregularity, and restrained yellow emphasis. Preserve it unless the user requests a redesign.

Use the existing identity: Michael Zheng, Headwindz, and headwindz.me. Site metadata currently uses `web3.headwindz` as its title. Preserve these factual identity references unless a naming change is explicitly requested.

## Evidence on Hand

- `data/blog/`: published and draft technical articles.
- `demos/`: interactive examples used by articles.
- `data/authors/default.mdx`: author biography and contribution references.
- `data/projectsData.ts`: project descriptions and outbound links.
- `data/siteMetadata.js`: site identity and social links.
- `public/static/`: existing image assets.

These sources establish what the site currently presents; they are not independent verification of external claims. Do not invent testimonials, client relationships, outcomes, or performance metrics.

## Product Principles

1. Give knowledge sharing and professional presentation equal weight.
2. Help readers understand technical subjects through clear explanations and usable examples.
3. Let real articles, projects, and contributions demonstrate capability.
4. Preserve access to existing content and its discovery tools as the site evolves.
