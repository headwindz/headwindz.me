import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <div className="notebook-tags py-4">
      <h1 className="journal-page-title border-b border-gray-200 pb-6 dark:border-gray-700">
        Tags
      </h1>
      <div className="flex flex-wrap gap-3 pt-8">
        {tagKeys.length === 0 && <p className="text-gray-600 dark:text-gray-400">No tags found.</p>}
        {sortedTags.map((t) => (
          <Link
            key={t}
            href={`/tags/${slug(t)}`}
            className="hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex min-h-11 items-center gap-3 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors dark:border-gray-800 dark:text-gray-200"
            aria-label={`View ${tagCounts[t]} posts tagged ${t}`}
          >
            {t.split(' ').join('-')}
            <span className="text-gray-500 tabular-nums dark:text-gray-400">{tagCounts[t]}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
