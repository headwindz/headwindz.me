import Link from '@/components/Link'
import type { ReactNode } from 'react'
import ArticlePreview from '@/components/ArticlePreview'
import HomeProjects from '@/components/HomeProjects'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { ArrowUpRight } from 'lucide-react'

export default function Home({
  posts,
  profile,
}: {
  posts: CoreContent<Blog>[]
  profile: ReactNode
}) {
  const featured =
    posts.find(
      (post) => post.slug === 'ai-agents-and-harnesses-from-tool-loops-to-reliable-systems'
    ) || posts[0]
  return (
    <>
      {profile}
      <section id="latest-writing" className="journal-latest writing-collection">
        <div className="section-heading">
          <h2>Fresh from the notebook</h2>
          <Link href="/blog">
            All blogs <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {featured && (
          <article className="journal-feature" aria-labelledby="feature-title">
            <div className="feature-copy">
              <h2 id="feature-title">
                <Link href={`/blog/${featured.slug}`}>
                  {featured.slug.startsWith('ai-agents-and-harnesses')
                    ? 'AI agents and harnesses'
                    : featured.title}
                </Link>
              </h2>
              <p className="feature-subtitle">
                {featured.slug.startsWith('ai-agents-and-harnesses')
                  ? 'From tool loops to reliable systems.'
                  : featured.summary}
              </p>

              <Link href={`/blog/${featured.slug}`} className="notebook-text-link">
                Read the article <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <ArticlePreview post={featured} />
          </article>
        )}
        <ul className="writing-list">
          {posts
            .filter((post) => post.slug !== featured?.slug)
            .slice(0, 4)
            .map((post) => (
              <li key={post.slug}>
                <article>
                  <div className="article-row-meta">
                    <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
                  </div>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="article-summary">{post.summary}</p>
                  <ArticlePreview post={post} />
                  <Link
                    href={`/blog/${post.slug}`}
                    className="writing-read-link"
                    aria-label={`Read ${post.title}`}
                  >
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </Link>
                </article>
              </li>
            ))}
        </ul>
        {!posts.length && <p className="py-8">No posts found.</p>}
      </section>
      <HomeProjects />
      {siteMetadata.newsletter?.provider && (
        <div className="py-8">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
