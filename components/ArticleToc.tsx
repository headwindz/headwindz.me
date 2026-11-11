interface Heading {
  value: string
  url: string
  depth: number
}

export default function ArticleToc({ headings = [] }: { headings?: Heading[] }) {
  if (headings.length < 2) return null
  const depth = Math.min(...headings.map((heading) => heading.depth))
  const sections = headings.filter((heading) => heading.depth <= depth + 1)
  return (
    <aside className="article-index">
      <details open>
        <summary>In this article</summary>
        <nav aria-label="Article sections">
          <ol>
            {sections.map((heading, i) => (
              <li key={`${heading.url}-${i}`} className={heading.depth > depth ? 'is-nested' : ''}>
                <a href={heading.url}>{heading.value}</a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
    </aside>
  )
}
