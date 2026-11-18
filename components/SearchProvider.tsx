'use client'

import ChineseSearch from './ChineseSearch'
import { useLocale } from './LocaleProvider'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SearchProvider as PlinySearchProvider, type SearchConfig } from 'pliny/search'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

type SearchPost = {
  path: string
  title: string
  date: string
  summary?: string
  tags?: string[]
}

export default function SearchProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  const router = useRouter()
  const onSearchDocumentsLoad = useCallback(
    (posts: SearchPost[]) =>
      posts.map((post) => ({
        id: post.path,
        name: post.title,
        keywords: [post.summary || '', ...(post.tags || [])].join(' '),
        section: 'Content',
        subtitle: formatDate(post.date, 'en-US'),
        perform: () => router.push(`/${post.path}`),
      })),
    [router]
  )
  const searchConfig = siteMetadata.search as SearchConfig

  if (locale === 'zh') return <ChineseSearch>{children}</ChineseSearch>

  return (
    <PlinySearchProvider
      searchConfig={
        searchConfig.provider === 'kbar'
          ? {
              ...searchConfig,
              kbarConfig: { ...searchConfig.kbarConfig, onSearchDocumentsLoad },
            }
          : searchConfig
      }
    >
      {children}
    </PlinySearchProvider>
  )
}
