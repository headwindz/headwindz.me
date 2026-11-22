# AGENTS.md

## Working in this repository

- Read [README.md](./README.md) for setup, project structure, and deployment. Inspect `package.json` and the relevant implementation before changing behavior or documenting commands. Use pnpm and preserve `pnpm-lock.yaml`.
- Keep changes focused and preserve unrelated work in the working tree. Keep credentials out of version control by storing them in local environment files or deployment settings.
- Commit or deploy only when explicitly requested.
- Push only when explicitly requested. Request approval through the Codex approval dialog for each `git push` and include the commits and destination in the prompt. See the [Codex push rule](./.codex/rules/git-push.rules).

## Implementation

- Use functional React components, hooks, and typed props. Prefer static generation and add client boundaries only where needed. `LiveDemo` reads demo sources on the server.
- Use PascalCase for component filenames and follow neighboring conventions for utilities. Follow `prettier.config.js` for formatting.
- Use Tailwind classes and the theme in `css/tailwind.css`. Theme providers live in `app/theme-providers.tsx`.
- Use the existing image wrapper and Next.js image optimization. Check `next.config.js` when adding remote image hosts or external scripts.

## Posts and diagrams

- Follow [Writing a post](./README.md#writing-a-post) and [Chinese pilot](./README.md#chinese-pilot) for file layout, heading style, and translation conventions. Include `title`, `date`, `tags`, and `summary` for English posts. Check `contentlayer.config.ts` before changing frontmatter fields.
- Register reusable MDX components in `components/MDXComponents.tsx`. Preserve published URLs and add redirects in `next.config.js` when intentionally changing slugs.
- For new or revised architecture diagrams, prefer hand-drawn SVGs with transparent backgrounds, sketch-style rounded boxes and arrows, dashed groupings, and restrained blue, orange, green, and purple accents. Keep handwritten-style labels legible on mobile and ensure lines and text have sufficient contrast in both themes.
- Store diagram assets in `public/static/images/<topic>/`, add descriptive alt text, and use `SketchDiagram` for expand, zoom, and download controls. Replace existing diagrams only when requested.

## Interactive demos

- Follow [Adding an interactive demo](./README.md#adding-an-interactive-demo) for source paths, MDX links, and compiler requirements. Check both the editor and the rendered preview.
- Preserve the import restrictions, iframe isolation, and Node.js preview endpoint when changing demo behavior. Verify the absolute `/api/demo-preview` request under a subpath before changing `BASE_PATH`.
- Update `scripts/build-demo-runtime.mjs` or its inputs for runtime changes. Restart development after changing the runtime.

## Generated files

Regenerate `.next/`, `.contentlayer/`, `lib/demo-runtime.generated.json`, `app/tag-data.json`, `public/search.json`, and RSS feeds through the normal scripts. Review the diff after checks and keep generated changes only when required by the task.

## Validation

- For documentation-only edits, verify claims against source and run `pnpm exec prettier --check README.md AGENTS.md` and `git diff --check`.
- For code or content changes, run `pnpm lint` and `pnpm build`, then use `pnpm dev` to check affected pages and interactions. Check changed files outside the lint script's scope separately and run focused checks when warranted.
- Builds fetch the Space Grotesk font from Google. Report the checks actually run and any blockers or remaining limitations.
