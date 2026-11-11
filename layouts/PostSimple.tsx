import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import ArticleToc from '@/components/ArticleToc'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, tags, readingTime, toc } = content
  const basePath = path.split('/')[0]
  return (
    <>
      <ScrollTopAndComment />
      <article className="journal-article">
        <header className="article-masthead">
          <div className="article-topline">
            <Link href={`/${basePath}`}>
              <ArrowLeft size={16} aria-hidden="true" /> All blogs
            </Link>
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
          </div>
          <h1>{title}</h1>
          <div className="article-provenance">
            <Link href="/about">{siteMetadata.author}</Link>
            <span>{readingTime?.text}</span>
            <div className="flex flex-wrap gap-y-1">
              {tags?.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>
        </header>
        <div className={`article-reading-layout ${toc?.length > 1 ? 'has-index' : ''}`}>
          <ArticleToc headings={toc} />
          <div className="article-body prose dark:prose-invert">{children}</div>
        </div>
        {siteMetadata.comments && (
          <div className="py-8 text-center" id="comment">
            <Comments slug={slug} />
          </div>
        )}
        <footer className="article-pagination">
          {prev && (
            <Link href={`/${prev.path}`}>
              <span>
                <ArrowLeft size={16} aria-hidden="true" /> Previous article
              </span>
              <strong>{prev.title}</strong>
            </Link>
          )}
          {next && (
            <Link href={`/${next.path}`}>
              <span>
                Next article <ArrowRight size={16} aria-hidden="true" />
              </span>
              <strong>{next.title}</strong>
            </Link>
          )}
        </footer>
      </article>
    </>
  )
}
