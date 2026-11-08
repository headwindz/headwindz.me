# My personal blog

This blog serves as a platform for me to share my thoughts, experiences, and projects related to frontend development and web3 technologies.

[Visit the blog](https://headwindz.me)

## Tech stack

- Next.js 16 with the App Router and React 19
- TypeScript and Tailwind CSS 4
- MDX content processed with Contentlayer2
- ESLint and Prettier
- pnpm for package management

## Getting started

Use Node.js 20.9 or later and pnpm. From the repository root, install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000) to view the site. Changes to pages and MDX content reload during development.

## Available commands

| Command        | Description                                            |
| -------------- | ------------------------------------------------------ |
| `pnpm dev`     | Start the development server with Webpack.             |
| `pnpm build`   | Build the production site and generate RSS feeds.      |
| `pnpm serve`   | Serve the production build after running `pnpm build`. |
| `pnpm lint`    | Run ESLint on application code and scripts.            |
| `pnpm analyze` | Build with the bundle analyzer enabled.                |

## Project structure

| Path                     | Purpose                                                                   |
| ------------------------ | ------------------------------------------------------------------------- |
| `app/`                   | Pages, routing, layouts, SEO metadata, sitemap, and robots configuration. |
| `components/`            | Shared UI and custom MDX components.                                      |
| `data/blog/`             | Blog posts written in MDX.                                                |
| `data/authors/`          | Author profiles.                                                          |
| `data/siteMetadata.js`   | Site identity, social links, analytics, and search settings.              |
| `data/projectsData.ts`   | Project showcase entries.                                                 |
| `data/headerNavLinks.ts` | Navigation links.                                                         |
| `demos/`                 | Interactive examples used in blog posts.                                  |
| `layouts/`               | Blog, author, and list layouts.                                           |
| `public/`                | Static images and other assets.                                           |
| `scripts/`               | Post-build tasks and RSS generation.                                      |

## Writing a post

Create an `.mdx` file in `data/blog/`, using a kebab-case filename such as `my-new-post.mdx`:

```mdx
---
title: 'My new post'
date: '2026-11-08'
tags: ['frontend']
summary: 'A brief description of the post.'
draft: true
---

## Introduction

Write your post here.
```

Preview the post with `pnpm dev`. Remove `draft: true` or set it to `false` when the post is ready to publish. Use sentence case for headings.

Contentlayer processes posts and generates tag counts and the local search index. See `contentlayer.config.ts` for supported frontmatter fields and MDX plugins. Custom MDX components live in `components/MDXComponents.tsx`, with interactive examples in `demos/`.

## Configuration

Update `data/siteMetadata.js` to change the site title, URL, social links, theme, analytics, or search settings. Set `NEXT_UMAMI_ID` in `.env.local` if you want to enable the configured Umami analytics integration.

Update `next.config.js` when changing image domains, redirects, or the Content Security Policy. Styling is configured in `css/tailwind.css`.

## Attribution

Generated from the starter template: [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog)
