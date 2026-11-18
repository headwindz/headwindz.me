import { dictionaries, localizedHref, type Locale } from '../lib/i18n'
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
  locale?: Locale
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({ content, next, prev, children, locale = 'en' }: LayoutProps) {
  const t = dictionaries[locale]
  const { path, slug, date, title, tags, readingTime, toc } = content
  const basePath = path.split('/')[0]
  return (
    <>
      <ScrollTopAndComment />
      <article className="journal-article">
        <header className="article-masthead">
          <div className="article-topline">
            <Link href={localizedHref(`/${basePath}`, locale)}>
              <ArrowLeft size={16} aria-hidden="true" /> {t.allBlogs}
            </Link>
            <time dateTime={date}>
              {formatDate(date, locale === 'zh' ? 'zh-CN' : siteMetadata.locale)}
            </time>
          </div>
          <h1>{title}</h1>
          <div className="article-provenance">
            <Link href={localizedHref('/about', locale)}>{siteMetadata.author}</Link>
            <span>
              {locale === 'zh'
                ? `约 ${Math.ceil(readingTime.minutes)} 分钟阅读`
                : readingTime?.text}
            </span>
            <div className="flex flex-wrap gap-y-1">
              {tags?.map((tag) => (
                <Tag key={tag} text={tag} locale={locale} />
              ))}
            </div>
          </div>
        </header>
        <div className={`article-reading-layout ${toc?.length > 1 ? 'has-index' : ''}`}>
          <ArticleToc headings={toc} locale={locale} />
          <div id="post-body" className="article-body prose dark:prose-invert">
            {children}
          </div>
        </div>
        {siteMetadata.comments && (
          <div className="py-8 text-center" id="comment">
            <Comments slug={slug} />
          </div>
        )}
        <footer className="article-pagination">
          {prev && (
            <Link href={localizedHref(`/${prev.path}`, locale)}>
              <span>
                <ArrowLeft size={16} aria-hidden="true" /> {t.previous}
              </span>
              <strong>{prev.title}</strong>
            </Link>
          )}
          {next && (
            <Link href={localizedHref(`/${next.path}`, locale)}>
              <span>
                {t.next} <ArrowRight size={16} aria-hidden="true" />
              </span>
              <strong>{next.title}</strong>
            </Link>
          )}
        </footer>
      </article>
    </>
  )
}
