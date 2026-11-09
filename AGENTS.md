# AGENTS.md

Guidance for agents working on headwindz.me, Michael Zheng's personal blog and portfolio.

## Source of truth

Inspect `package.json` and the relevant implementation before changing behavior or documenting commands. The current stack is Next.js 16 App Router, React 19, TypeScript, Contentlayer2, and Tailwind CSS 4. Use pnpm and preserve `pnpm-lock.yaml`.

Read [README.md](./README.md) for setup, commands, authoring examples, and deployment limitations. Use Node.js 20.9 or newer. `pnpm start` starts development; `pnpm serve` runs the production server after a build.

## Where to make changes

| Concern                             | Files                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Pages, API handlers, metadata       | `app/`, including `app/seo.tsx`, `app/sitemap.ts`, `app/robots.ts`                                    |
| Shared UI and MDX registration      | `components/`, `components/MDXComponents.tsx`                                                         |
| Post, list, and author presentation | `layouts/`                                                                                            |
| Posts and author profiles           | `data/blog/**/*.mdx`, `data/authors/**/*.mdx`                                                         |
| Site configuration                  | `data/siteMetadata.js`, `data/projectsData.ts`, `data/headerNavLinks.ts`                              |
| Styling and theme tokens            | `css/tailwind.css`; there is no `tailwind.config.js`                                                  |
| MDX schema and processing           | `contentlayer.config.ts`, `lib/remark-demo.mjs`                                                       |
| Interactive demos                   | `demos/`, `components/LiveDemo.tsx`, `components/LiveDemoEditor.tsx`, `app/api/demo-preview/route.ts` |
| Runtime and RSS generation          | `scripts/build-demo-runtime.mjs`, `scripts/postbuild.mjs`, `scripts/rss.mjs`                          |
| Framework and tooling               | `next.config.js`, `tsconfig.json`, `eslint.config.mjs`, `prettier.config.js`                          |

## Implementation conventions

- Keep changes focused and preserve unrelated work already in the working tree.
- Use functional React components, hooks, and typed props. Add client boundaries only where needed; `LiveDemo` reads source files on the server.
- Use PascalCase for component filenames, kebab-case for MDX and demo paths, and existing neighboring conventions for utilities.
- Use Tailwind classes and the CSS-based theme. Theme providers live in `app/theme-providers.tsx`.
- Follow Prettier: no semicolons, single quotes, two-space indentation, and a 100-character print width.
- Prefer static generation where appropriate, while preserving the Node.js endpoint required for editable demos.
- Use the existing image wrapper and Next.js image optimization. Check `next.config.js` when adding remote image hosts or external scripts.
- Keep secrets in local environment files or deployment settings. Never commit credentials.

## Content conventions

- Add posts under `data/blog/` as `.mdx`, optionally in subdirectories.
- Include `title`, `date`, `tags`, and `summary`. The schema requires only `title` and `date`; tags default to an empty list.
- Consult `contentlayer.config.ts` before introducing or changing frontmatter fields.
- Use sentence case headings, preserving acronyms and proper names: `## Getting started`, `### Using the API`.
- Write concise, clear sentences and avoid unnecessary words.
- Register reusable MDX components in `components/MDXComponents.tsx`.
- Preserve existing URLs; add redirects in `next.config.js` when intentionally changing published slugs.

## Demo workflow and constraints

1. Create a self-contained file at `demos/<topic>/<example>.tsx`. Each path segment must contain only lowercase letters, digits, or hyphens.
2. Define a component named `App`; the preview compiler appends the React mount call.
3. Add `[Try the example](demo://<topic>/<example>.tsx)` in its own MDX paragraph. The remark plugin inserts `LiveDemo`, which reads the file from `demos/`.
4. Use only supported imports: `react`, `react-dom/client`, and `react/jsx-runtime`. The API rejects other packages and local imports.
5. Check the editor and rendered preview. Its iframe stylesheet is separate from the site's full Tailwind CSS.

`pnpm dev`, `pnpm start`, `pnpm build`, and `pnpm analyze` generate `lib/demo-runtime.generated.json` before Next.js runs. Change the generator rather than hand-editing the generated runtime. Restart development after runtime changes. Keep the import restrictions and iframe isolation intact when modifying preview behavior.

Static-only deployment does not support the preview API. The editor also uses an absolute `/api/demo-preview` URL; verify subpath behavior before changing `BASE_PATH`.

## Generated files

Do not manually edit `.next/`, `.contentlayer/`, `lib/demo-runtime.generated.json`, `app/tag-data.json`, `public/search.json`, or generated RSS feeds. Regenerate them through the normal scripts. Review the diff after checks and keep generated changes only when required by the task.

## Validation

- For documentation-only edits, run `pnpm exec prettier --check README.md AGENTS.md` and `git diff --check`, and verify claims against source.
- For code or content changes, run `pnpm lint` and `pnpm build`. Start `pnpm dev` and check affected pages and interactive behavior.
- The lint script covers `app`, `components`, `lib`, `layouts`, `scripts`, and `next.config.js`; it does not check every directory. Check changed files outside those paths explicitly where applicable.
- There is no dedicated automated test script. Add or run focused checks when the change warrants them.
- Builds need network access for the Space Grotesk Google font. Report runtime or network blockers accurately rather than claiming checks passed.
- Summarize changes, checks actually run, and remaining limitations. Do not commit or deploy unless explicitly requested.
- Push only when the user explicitly asks to push the changes being delivered. Editing files or requesting a commit does not authorize a push. A previous push request does not authorize pushing later changes or follow-up tasks; wait for a new explicit push request.
