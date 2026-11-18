'use client'

import { useLocale } from '@/components/LocaleProvider'
import { localizedHref } from 'lib/i18n'
import HomeCommand from '@/components/HomeCommand'
import { usePathname, useRouter } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const locale = useLocale()
  const zh = locale === 'zh'
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <nav
      aria-label={zh ? '分页' : 'Pagination'}
      className="flex items-center justify-between border-t border-gray-200 py-2 dark:border-gray-800"
    >
      {!prevPage && (
        <button className="min-h-11 cursor-auto disabled:opacity-50" disabled={!prevPage}>
          {zh ? '上一页' : 'Previous'}
        </button>
      )}
      {prevPage && (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          className="inline-flex min-h-11 items-center"
          rel="prev"
        >
          {zh ? '上一页' : 'Previous'}
        </Link>
      )}
      <span>
        {zh ? `第 ${currentPage} 页，共 ${totalPages} 页` : `${currentPage} of ${totalPages}`}
      </span>
      {!nextPage && (
        <button className="min-h-11 cursor-auto disabled:opacity-50" disabled={!nextPage}>
          {zh ? '下一页' : 'Next'}
        </button>
      )}
      {nextPage && (
        <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
          {zh ? '下一页' : 'Next'}
        </Link>
      )}
    </nav>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const locale = useLocale()
  const zh = locale === 'zh'
  const pathname = usePathname()
  const router = useRouter()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="archive-heading">
          <h1 className="journal-page-title">{title === 'All Posts' ? 'All Posts' : title}</h1>
          <label className="topic-picker">
            <span>{zh ? '主题' : 'Topic'}</span>
            <select
              aria-label={zh ? '按主题浏览文章' : 'Browse posts by topic'}
              value={pathname.split('/tags/')[1]?.split('/')[0] || ''}
              onChange={(event) =>
                router.push(
                  localizedHref(
                    event.target.value ? `/tags/${event.target.value}` : '/blog',
                    locale
                  )
                )
              }
            >
              <option value="">{zh ? '全部文章' : 'All posts'}</option>
              {sortedTags.map((tag) => (
                <option key={tag} value={slug(tag)}>
                  {tag} ({tagCounts[tag]})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="journal-archive">
          <div className="min-w-0 flex-1">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <li key={path} className="py-8 first:pt-0">
                    <article className="flex flex-col gap-1.5">
                      <dl>
                        <dt className="sr-only">{zh ? '发布日期' : 'Published on'}</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, zh ? 'zh-CN' : siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-2">
                        <div>
                          <h2 className="archive-post-title">
                            <Link
                              href={localizedHref(`/${path}`, locale)}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title === 'All Posts' ? 'Blogs' : title}
                            </Link>
                          </h2>
                          <div className="mt-2 flex flex-wrap gap-y-1">
                            {tags?.map((tag) => (
                              <Tag key={tag} text={tag} locale={locale} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
            <HomeCommand />
          </div>
        </div>
      </div>
    </>
  )
}
