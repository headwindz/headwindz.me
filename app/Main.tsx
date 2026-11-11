import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import AgentLoop from '@/components/AgentLoop'
import HomeProjects from '@/components/HomeProjects'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export default function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  const featured =
    posts.find(
      (post) => post.slug === 'ai-agents-and-harnesses-from-tool-loops-to-reliable-systems'
    ) || posts[0]
  return (
    <>
      <section className="journal-opening" aria-labelledby="journal-title">
        <div className="journal-intro">
          <h1 id="journal-title">
            A little space for
            <br />
            <span>big ideas.</span>
          </h1>
          <p className="journal-byline">
            Hi, I’m <Link href="/about">Michael Zheng</Link>, a full-stack engineer.
          </p>
          <p className="journal-description">
            Notes on frontend, AI agents, and Web3.
            <br />
            Things I build, learn, and figure out along the way.
          </p>
          <div className="notebook-actions">
            <Link href="/blog" className="notebook-button">
              Browse blogs <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/projects" className="notebook-text-link">
              Explore projects <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <aside className="notebook-note" aria-label="About this notebook">
          <div className="notebook-profile">
            <Image
              src="/static/images/avatar.jpg"
              width={72}
              height={72}
              alt="Michael Zheng"
              className="notebook-avatar"
            />
            <div>
              <h2>Headwindz</h2>
              <p>A personal notebook.</p>
            </div>
          </div>
          <p>I like making complex tools clear and useful. This is where I share what I learn.</p>
          <div className="notebook-subjects">
            <Link href="/tags/react">Frontend</Link>
            <Link href="/tags/ai">AI agents</Link>
            <Link href="/tags/web3">Web3</Link>
          </div>
          <Link href="/about" className="notebook-text-link">
            A bit more about me <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </aside>
      </section>
      {featured && (
        <section className="journal-feature" aria-labelledby="feature-title">
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
                : 'An explanation worth spending time with.'}
            </p>
            <p className="feature-description">{featured.summary}</p>
            <Link href={`/blog/${featured.slug}`} className="notebook-text-link">
              Read the article <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <AgentLoop />
        </section>
      )}
      <HomeProjects />
      <section id="latest-writing" className="journal-latest">
        <div className="section-heading">
          <h2>Fresh from the notebook</h2>
          <Link href="/blog">
            All blogs <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="latest-grid">
          {posts.slice(0, 6).map((post) => (
            <li key={post.slug}>
              <article>
                <div className="article-row-meta">
                  <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
                  <div>
                    {post.tags.slice(0, 2).map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="article-summary">{post.summary}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="article-read-link"
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
      {siteMetadata.newsletter?.provider && (
        <div className="py-8">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
