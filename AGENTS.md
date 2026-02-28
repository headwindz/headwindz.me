# AGENTS.md

This document provides guidance for AI agents working with this codebase.

## Project overview

This is a personal blog and portfolio website built with Next.js 15+ (App Router), TypeScript, and Contentlayer. The site features blog posts, project showcases, and interactive demos.

## Tech stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Content**: MDX with Contentlayer
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier

## Project structure

### Core directories

- **`app/`**: Next.js App Router pages and layouts
  - Uses file-based routing
  - Contains page components, layouts, and metadata
  - Dynamic routes: `[...slug]`, `[tag]`, `[page]`

- **`components/`**: Reusable React components
  - UI components (Header, Footer, Card, etc.)
  - MDX components for rich content
  - Theme and navigation components

- **`data/`**: Content and configuration
  - **`blog/`**: MDX blog posts
  - **`authors/`**: Author information
  - `siteMetadata.js`: Site configuration
  - `projectsData.ts`: Project showcase data
  - `headerNavLinks.ts`: Navigation structure

- **`demos/`**: Interactive demo components
  - Used within blog posts to demonstrate concepts
  - Each demo in its own subdirectory

- **`layouts/`**: Page layout components
  - `PostLayout.tsx`: Blog post layout
  - `ListLayout.tsx`: List views
  - `AuthorLayout.tsx`: Author pages

- **`lib/`**: Utility functions and configurations
  - Remark/rehype plugins for MDX processing

- **`public/`**: Static assets
  - Images in `static/images/`
  - Blog-specific assets in `static/blogs/`

- **`scripts/`**: Build and deployment scripts
  - RSS feed generation
  - Post-build optimizations

## Content management

### Blog posts

- Located in `data/blog/`
- Written in MDX format
- Frontmatter includes: title, date, tags, summary
- Organized with optional subdirectories (e.g., `cheatsheet/`)

### Adding a new blog post

1. Create a new `.mdx` file in `data/blog/`
2. Add required frontmatter:
   ```yaml
   ---
   title: 'Post Title'
   date: 'YYYY-MM-DD'
   tags: ['tag1', 'tag2']
   summary: 'Brief description'
   ---
   ```
3. Write content using MDX

- **Headers**: Use sentence case (only first letter capitalized)
- Correct: `## Getting started`, `### Using the API`
- Incorrect: `## Getting Started`, `### Using The API`

4. Contentlayer will process it automatically
5. Try to use condensed sentences and avoid unnecessary words to keep the content concise and clear.

### Custom MDX components

- Defined in `components/MDXComponents.tsx`
- Can include custom components like `LiveDemo`
- Interactive demos from `demos/` directory

## Development conventions

### Code style

- TypeScript for type safety
- Functional React components with hooks
- Tailwind CSS for styling
- ESLint and Prettier for code formatting

### File naming

- React components: PascalCase (e.g., `Header.tsx`)
- Utilities: camelCase (e.g., `remark-demo.mjs`)
- Pages: lowercase with Next.js conventions
- MDX content: kebab-case (e.g., `guide-to-authentication.mdx`)

### Component structure

- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Export components as default or named exports
- Co-locate related components in subdirectories

## Common tasks

### Running the development server

```bash
pnpm dev
```

### Building for production

```bash
pnpm build
```

### Creating a new demo

1. Create a new directory in `demos/`
2. Add demo component(s)
3. Import and use in relevant blog post MDX

## Configuration files

- `next.config.js`: Next.js configuration
- `contentlayer.config.ts`: Content processing configuration
- `tailwind.config.js`: Tailwind CSS customization
- `tsconfig.json`: TypeScript configuration
- `eslint.config.mjs`: Linting rules
- `prettier.config.js`: Code formatting rules

## Important notes

- The site uses Contentlayer for MDX processing
- Static generation preferred for performance
- Images optimized through Next.js Image component
- Dark/light theme support via `theme-providers.tsx`

## SEO and metadata

- SEO configuration in `app/seo.tsx`
- Sitemap generated automatically
- RSS feed generated via `scripts/rss.mjs`
- robots.txt configured in `app/robots.ts`

## When making changes

1. **Content changes**: Edit MDX files in `data/blog/`
2. **Component changes**: Modify files in `components/`
3. **Layout changes**: Edit layouts in `layouts/` or `app/`
4. **Styling**: Use Tailwind classes or update `css/tailwind.css`
5. **Configuration**: Update relevant config files

## Testing changes

After making changes, verify:

- Development server runs without errors
- Build completes successfully
- Linting passes (`pnpm lint`)
