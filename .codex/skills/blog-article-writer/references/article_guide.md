# Article Guide for data/blog

Detailed reference on frontmatter, structural patterns, styling conventions, and components.

## Frontmatter Specification

The frontmatter is YAML enclosed between triple-dashes `---`.

```yaml
---
title: 'Sentence case title without period'
date: 'YYYY-MM-DD'
tags: ['tag1', 'tag2', 'tag3']
summary: 'Concise summary of the article (1-2 sentences) explaining key takeaways or topics covered.'
---
```

### Field Rules

- `title`:
  - Required string.
  - **Must be sentence case** (e.g. `Understanding modern web caching`, not `Understanding Modern Web Caching`).
  - Do not end with a trailing period or punctuation.
- `date`:
  - Required date string in `YYYY-MM-DD` format (typically today's date).
- `tags`:
  - Required array of lowercase strings (kebab-case or single words).
  - Prefer aligning with existing tags where possible: `web`, `javascript`, `react`, `nextjs`, `css`, `performance`, `security`, `http`, `pwa`, `devtools`, `notes`, `cheatsheet`, etc.
- `summary`:
  - Required string. Single-line or clean multi-line string summarizing the post.
- `draft`:
  - Optional boolean (`true` or `false`). Defaults to `false` if omitted.

## Heading and Casing Conventions

- **Sentence case is strictly required for all headings**:
  - Only the very first letter of the heading and proper nouns (like `JavaScript`, `React`, `HTML`, `DevTools`, `HTTP`, `PWA`) are capitalized.
  - Correct: `## Getting started`, `### Core web vitals and performance metrics`, `## Deep dive into caching strategies`
  - Incorrect: `## Getting Started`, `### Core Web Vitals And Performance Metrics`, `## Deep Dive Into Caching Strategies`
- **Hierarchy**:
  - Do not use `# Title` at the very beginning of the post body if the frontmatter `title` is rendered by the layout.
  - Major parts or chapters can use `# Part name` or `## Section name`, with sub-sections using `###` and `####`.
  - Keep hierarchy logical and consistent.

## Writing Tone and Mechanics

- **Direct and authoritative**: Write from the perspective of an experienced systems / software engineer.
- **Concise and condensed**: Avoid throat-clearing, filler phrases, or introductory fluff (e.g., "In this comprehensive blog post, we will explore..."). Jump immediately into the core problem, context, or architectural premise.
- **Explanatory clarity**: Explain the _why_ and the _how_ under the hood, not just syntax. Provide browser internals, protocol details, or architectural implications where relevant.
- **Structured outlines**:
  - Often include a brief outline list early in the post:
    ```markdown
    This post is organized into four parts:

    1. **Part title**: summary of focus
    2. **Part title**: summary of focus
    ```
- **Tables**: Use Markdown tables for comparison matrices, pros/cons, trade-offs, and metric mappings.
- **Code examples**:
  - Real, idiomatic code snippets with appropriate syntax highlighting (`js`, `ts`, `tsx`, `html`, `css`, `bash`, `nginx`).
  - Annotate code with succinct comments pointing out critical subtleties.

## Interactive and Visual Components

The blog uses custom MDX components imported in `components/MDXComponents.tsx`:

### Mermaid Diagrams

Use Mermaid for workflows, architectural flows, sequence interactions, or state transitions:

```tsx
<Mermaid
  chart={`
flowchart TD
  client[Browser client] -->|Initial request| cdn[Edge CDN cache]
  cdn -->|Cache miss| origin[Origin server]
  origin -->|Response + Cache-Control| cdn
  cdn -->|Cached response| client

style client fill:#3b82f6,color:#fff
style cdn fill:#8b5cf6,color:#fff
style origin fill:#10b981,color:#fff
`}
/>
```

### In-article Demos or LiveDemo

If the article demonstrates an interactive concept (e.g. CSS properties, canvas, web APIs):

- Demos are located in `demos/<demo-name>/`
- MDX can import or use `<LiveDemo demo="demo-name" />` or direct demo components.

### Images

For diagrams or illustrations:

```markdown
![Alt text](/static/images/topic/diagram-name.png)
```

## File Naming and Location

- File path: `data/blog/<slug>.mdx` or `data/blog/<category>/<slug>.mdx`.
- The filename must be kebab-case (e.g. `understanding-http-caching.mdx`).

## Verification Checklist

Before finalizing the MDX:

1. Does frontmatter contain `title`, `date`, `tags`, and `summary`?
2. Are all Markdown headings formatted in strict sentence case?
3. Is the writing concise, free of fluff, and rich in concrete technical depth?
4. Are code snippets syntactically valid with language tags specified?
5. If Mermaid diagrams are included, is the Mermaid chart syntax valid?
6. Does `pnpm build` or Contentlayer compile without errors?
