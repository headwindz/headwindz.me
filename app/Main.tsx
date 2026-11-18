import { dictionaries, localizedHref, featuredTranslations, type Locale } from '../lib/i18n'
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
  locale = 'en',
}: {
  locale?: Locale
  posts: CoreContent<Blog>[]
  profile: ReactNode
}) {
  const t = dictionaries[locale]
  const featuredPosts = posts
    .filter((post) => post.featured)
    .map((post) => (locale === 'zh' ? { ...post, ...featuredTranslations[post.slug] } : post))
  return (
    <>
      {profile}
      <section id="latest-writing" className="journal-latest writing-collection">
        <div className="section-heading">
          <h2>{t.posts}</h2>
          <Link href={localizedHref('/blog', locale)}>
            {t.allPosts} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="writing-list">
          {featuredPosts.map((post) => (
            <li key={post.slug}>
              <article>
                <div className="writing-copy">
                  <div className="writing-copy-heading">
                    <div className="article-row-meta">
                      <time dateTime={post.date}>
                        {formatDate(post.date, locale === 'zh' ? 'zh-CN' : siteMetadata.locale)}
                      </time>
                    </div>
                    <span className="writing-read-link" aria-hidden="true">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <h3>
                    <Link href={localizedHref(`/blog/${post.slug}`, locale)}>{post.title}</Link>
                  </h3>
                  <p className="article-summary">{post.summary}</p>
                </div>
                <ArticlePreview post={post} />
              </article>
            </li>
          ))}
        </ul>
        {featuredPosts.length === 0 && <p className="py-8">{t.empty}</p>}
      </section>
      <HomeProjects locale={locale} />
      {siteMetadata.newsletter?.provider && (
        <div className="py-8">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
