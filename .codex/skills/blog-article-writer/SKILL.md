---
name: blog-article-writer
description: Expand outlines, notes, or main ideas into comprehensive, publication-ready technical MDX blog posts matching the style, formatting, and conventions of data/blog.
---

# Blog Article Writer

Expand article topics, outlines, or raw technical notes into structured, in-depth MDX articles following the conventions of the `data/blog` directory.

## Core Workflow

1. **Analyze input and determine scope**
   - Extract key technical concepts, arguments, comparisons, and practical applications from the prompt.
   - Select appropriate tags (aligning with existing tags in `app/tag-data.json` when possible).
   - Formulate a clean, descriptive title in **sentence case**.
   - Determine file path: `data/blog/<slug>.mdx` using kebab-case.

2. **Structure the article**
   - Begin with required frontmatter (`title`, `date`, `tags`, `summary`).
   - Write an immediate, engaging technical lead paragraph setting up the problem or architecture without filler or throat-clearing.
   - Optional: include an upfront part-by-part outline if the article has multiple chapters or major parts.
   - Break down the core concepts into logical sections with clear hierarchy (`##`, `###`).
   - Ground abstract theory with real-world code snippets, configuration examples, and comparison tables.
   - Where visual clarity helps (e.g. protocol flows, lifecycles, pipelines), use `<Mermaid chart={`...`} />` diagrams.
   - Conclude with actionable takeaways, architectural trade-offs, or a concise summary.

3. **Writing and style rules**
   - **Sentence case headers strictly required**: Only the first letter of each heading is capitalized (e.g., `## Under the hood`, `### Cache invalidation and revalidation`). Proper nouns and acronyms (like `JavaScript`, `React`, `HTTP`, `PWA`, `CSS`) retain their capitalization. Never use title case for headings.
   - **Condensed, direct sentences**: Eliminate fluff, unnecessary adverbs, and conversational meta-announcements.
   - **Concrete over generic**: Show real code, configurations, performance metrics, and browser/system mechanics rather than high-level generalities.

4. **Detailed conventions reference**
   - For complete details on frontmatter schemas, Mermaid usage, demos, and checklists, read [references/article_guide.md](references/article_guide.md).

5. **Validation and compilation**
   - Verify that all frontmatter fields adhere to Contentlayer types.
   - Verify headings adhere to sentence case.
   - Check that Mermaid code blocks and code syntax blocks are valid.
   - Test by running or checking the Contentlayer build (`pnpm build` or dev server logs).
