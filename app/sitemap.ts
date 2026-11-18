import { MetadataRoute } from 'next'
import { allBlogs, allTranslatedBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const translatedRoutes = allTranslatedBlogs.flatMap((translation) => {
    const original = allBlogs.find((post) => post.slug === translation.sourceSlug && !post.draft)
    return original
      ? [
          {
            url: `${siteUrl}/zh/blog/${translation.sourceSlug}`,
            lastModified: original.lastmod || original.date,
            alternates: {
              languages: {
                en: `${siteUrl}/blog/${original.slug}`,
                'zh-CN': `${siteUrl}/zh/blog/${original.slug}`,
              },
            },
          },
        ]
      : []
  })
  return [
    ...routes,
    ...blogRoutes,
    {
      url: `${siteUrl}/zh/`,
      alternates: { languages: { en: `${siteUrl}/`, 'zh-CN': `${siteUrl}/zh/` } },
    },
    ...translatedRoutes,
  ]
}
