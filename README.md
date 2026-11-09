# headwindz.me

Michael Zheng's personal blog and portfolio about frontend development, Web3, and software engineering.

Visit [headwindz.me](https://headwindz.me).

## Stack

- Next.js 16 App Router and React 19
- TypeScript and MDX, processed with Contentlayer2
- Tailwind CSS 4, configured in `css/tailwind.css`
- ESLint 9, Prettier 3, and pnpm
- Editable React demos compiled with esbuild, Mermaid diagrams, and local search

## Getting started

Use Node.js 20.9 or newer and install pnpm:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:3000](http://localhost:3000). Development and build scripts use webpack and generate the demo runtime before starting Next.js.

Environment variables are optional for basic local development. For integrations, copy `.env.example` to `.env.local` and fill only the values you need. The example includes starter integrations that are not all enabled. Configure active services in `data/siteMetadata.js`; Umami uses `NEXT_UMAMI_ID`, which is absent from the example. Keep credentials out of version control.

## Commands

| Command                                          | Purpose                                                     |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `pnpm dev`                                       | Generate the demo runtime and start development             |
| `pnpm start`                                     | Also start development                                      |
| `pnpm build`                                     | Generate the runtime, build Next.js, and generate RSS feeds |
| `pnpm serve`                                     | Serve a completed production build                          |
| `pnpm lint`                                      | Lint the paths configured in `package.json`                 |
| `pnpm analyze`                                   | Build with the bundle analyzer enabled                      |
| `pnpm exec prettier --check README.md AGENTS.md` | Check documentation formatting                              |

## Project structure

| Path                                             | Contents                                    |
| ------------------------------------------------ | ------------------------------------------- |
| `app/`                                           | Routes, layouts, metadata, and API handlers |
| `components/`                                    | Shared UI, MDX components, and demo editor  |
| `data/blog/`, `data/authors/`                    | MDX posts and author profiles               |
| `data/siteMetadata.js`                           | Site identity, analytics, and search        |
| `data/projectsData.ts`, `data/headerNavLinks.ts` | Projects and navigation                     |
| `layouts/`                                       | Post, list, and author layouts              |
| `demos/`                                         | Interactive examples referenced by posts    |
| `lib/`                                           | MDX plugins and generated demo runtime      |
| `css/`                                           | Tailwind theme and syntax highlighting      |
| `public/static/`                                 | Images and blog assets                      |
| `scripts/`                                       | Demo runtime and RSS generation             |

## Writing a post

Create `data/blog/my-post.mdx`:

```mdx
---
title: 'My post'
date: '2026-11-08'
tags: ['frontend']
summary: 'A concise description of the post.'
---

## Getting started

Write the post here.
```

Only `title` and `date` are required by the schema; include tags and a summary for useful listings and metadata. Optional fields include `lastmod`, `draft`, `images`, `authors`, `layout`, `bibliography`, and `canonicalUrl`. See `contentlayer.config.ts` for the schema and processing pipeline.

Preview posts with `pnpm dev`. Set `draft: true` in frontmatter while writing, then remove it or set it to `false` when the post is ready to publish.

Use kebab-case filenames, concise sentences, and sentence case headings, preserving proper names and acronyms. Register shared MDX components in `components/MDXComponents.tsx`. Contentlayer generates post data, tag counts, and the local search index.

## Configuration

Update `data/siteMetadata.js` to change the site title, URL, social links, theme, analytics, or search settings. Update `data/projectsData.ts` for project entries and `data/headerNavLinks.ts` for navigation.

Update `next.config.js` when changing image domains, redirects, or the Content Security Policy. Styling is configured in `css/tailwind.css`.

## Adding an interactive demo

Create a self-contained TSX file such as `demos/my-topic/example.tsx` with a component named `App`. Reference it from its own paragraph in MDX:

```md
[Try the example](demo://my-topic/example.tsx)
```

`lib/remark-demo.mjs` converts the link into `LiveDemo`. Demo paths must match `topic/example.tsx`, using lowercase letters, numbers, and hyphens. The preview compiler allows imports only from `react`, `react-dom/client`, and `react/jsx-runtime`; local modules and other packages are unavailable. The iframe has a small built-in stylesheet, not the site's full Tailwind styles.

The editor sends code to `POST /api/demo-preview`, which runs esbuild on the server. Keep the named `App` component because the compiler appends the mount call. Restart development after changing the runtime generator or its dependencies.

## Validation and deployment

For application changes, run `pnpm lint` and `pnpm build`, then check affected routes with `pnpm dev`. Builds use `next/font/google` for Space Grotesk and need access to Google's font service. There is no dedicated test script.

Deploy with a Next.js-compatible Node.js runtime. Although `next.config.js` supports `EXPORT`, live demo previews require the Node.js API handler and cannot run on static-only hosting. `BASE_PATH` and `UNOPTIMIZED` are also supported flags; the editor currently uses an absolute `/api/demo-preview` URL, so verify it before deploying under a subpath.

Metadata lives in `app/seo.tsx` and `app/layout.tsx`; sitemap and robots routes live in `app/`. `scripts/postbuild.mjs` generates RSS feeds after the production build.

## Attribution

Based on [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog). See [LICENSE](./LICENSE).
