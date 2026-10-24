---
name: blog-article-writer
description: Expand outlines, notes, or main ideas into publication-ready technical MDX blog posts in data/blog, using the user's global tech-writing skill for article content and this skill for repository conventions and validation.
---

# Blog Article Writer

Create technical MDX articles for `data/blog`. Use the user's global `tech-writing` skill for the main article content; this skill handles blog-specific formatting, integration, and validation.

## Required writing skill

Before outlining, drafting, or revising the article body, read and apply `~/.codex/skills/tech-writing/SKILL.md` (expand `~` to the user's home directory). If the session's available-skills catalog gives a different location for the user's global `tech-writing` skill, use that location.

Use `tech-writing` as the source of truth for the body's structure, explanations, examples, evidence and citations, voice, prose, visuals, and editorial review. Read its supporting references when its instructions call for them. Do not duplicate its writing rules here or impose a fixed outline, length, or conclusion.

Keep the user's requested scope and audience. Apply the repository's frontmatter, sentence case, MDX, and component conventions when integrating the content.

## Core workflow

1. **Determine scope and destination**
   - Use `tech-writing` to establish the article's purpose and develop its main content from the supplied topic, notes, or sources.
   - Select appropriate tags, aligning with `app/tag-data.json` when possible.
   - Choose a sentence case title and a kebab-case path: `data/blog/<slug>.mdx`.

2. **Draft and integrate the article**
   - Follow `tech-writing` for outlining, drafting, and reviewing the body.
   - Add required frontmatter: `title`, `date`, `tags`, and `summary`.
   - Use sentence case headings; preserve capitalization for proper nouns and acronyms.
   - Use the site's `<Mermaid chart={`...`} />` component for suitable diagrams and existing MDX components or demos when relevant.
   - Consult [references/article_guide.md](references/article_guide.md) for frontmatter details, heading conventions, and component syntax.

3. **Review and validate**
   - Complete the editorial and source review required by `tech-writing`.
   - Verify frontmatter against Contentlayer types and headings against sentence case conventions.
   - Check code examples and Mermaid syntax, and inspect rendered visuals when present.
   - Verify compilation with `pnpm build` or Contentlayer/dev server logs.
