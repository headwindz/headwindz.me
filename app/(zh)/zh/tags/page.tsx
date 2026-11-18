import HomeCommand from '@/components/HomeCommand'
import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  locale: 'zh',
  title: '标签',
  description: '按主题浏览文章',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <div className="notebook-tags pt-4">
      <h1 className="journal-page-title border-b border-gray-200 pb-3 dark:border-gray-700">
        标签
      </h1>
      <div className="flex flex-wrap gap-2 pt-4">
        {tagKeys.length === 0 && <p className="text-gray-600 dark:text-gray-400">暂无标签。</p>}
        {sortedTags.map((t) => (
          <Link
            key={t}
            href={`/zh/tags/${slug(t)}`}
            className="hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex min-h-11 items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors dark:border-gray-800 dark:text-gray-200"
            aria-label={`查看 ${tagCounts[t]} 篇 ${t} 文章`}
          >
            {t.split(' ').join('-')}
            <span className="text-gray-500 tabular-nums dark:text-gray-400">{tagCounts[t]}</span>
          </Link>
        ))}
      </div>
      <HomeCommand />
    </div>
  )
}
