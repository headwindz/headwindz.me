import 'css/prism.css'
import 'katex/dist/katex.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allBlogs } from 'contentlayer/generated'
import { coreContent } from 'pliny/utils/contentlayer'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { components } from '@/components/MDXComponents'
import PostSimple from '@/layouts/PostSimple'
import ReadingProgress from '@/components/ReadingProgress'
import siteMetadata from '@/data/siteMetadata'
import { chinesePosts, translations } from 'lib/i18n/posts'

type Props = { params: Promise<{ slug: string[] }> }

export function generateStaticParams() {
  return chinesePosts.map((post) => ({ slug: post.slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug.join('/')
  const translation = translations.get(slug)
  const original = allBlogs.find((post) => post.slug === slug && !post.draft)
  if (!original) notFound()
  if (!translation)
    return {
      title: original.title,
      robots: { index: false },
      alternates: { canonical: `/blog/${slug}` },
    }
  return {
    title: translation.title,
    description: translation.summary,
    alternates: {
      canonical: `/zh/blog/${slug}`,
      languages: { en: `/blog/${slug}`, 'zh-CN': `/zh/blog/${slug}` },
    },
    openGraph: {
      title: translation.title,
      description: translation.summary,
      type: 'article',
      locale: 'zh_CN',
      url: `/zh/blog/${slug}`,
      siteName: siteMetadata.title,
      publishedTime: new Date(original.date).toISOString(),
      modifiedTime: new Date(original.lastmod || original.date).toISOString(),
      authors: [siteMetadata.author],
      images: [siteMetadata.socialBanner],
    },
    twitter: {
      card: 'summary_large_image',
      title: translation.title,
      description: translation.summary,
      images: [siteMetadata.socialBanner],
    },
  }
}

export default async function Page({ params }: Props) {
  const slug = (await params).slug.join('/')
  const translation = translations.get(slug)
  const original = allBlogs.find((post) => post.slug === slug && !post.draft)
  if (!original) notFound()
  const posts = chinesePosts
  const index = posts.findIndex((post) => post.slug === slug)
  const content = {
    ...coreContent(original),
    ...(translation && {
      title: translation.title,
      summary: translation.summary,
      toc: translation.toc,
      readingTime: translation.readingTime,
    }),
  }
  const structuredData = {
    ...original.structuredData,
    headline: content.title,
    description: content.summary,
    inLanguage: translation ? 'zh-CN' : 'en',
    url: `${siteMetadata.siteUrl}/zh/blog/${slug}`,
  }
  return (
    <>
      <ReadingProgress key={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <PostSimple locale="zh" content={content} prev={posts[index + 1]} next={posts[index - 1]}>
        {translation ? (
          <MDXLayoutRenderer code={translation.body.code} components={components} />
        ) : (
          <>
            <p>这篇文章暂未翻译，下方为英文原文。</p>
            <div lang="en">
              <MDXLayoutRenderer code={original.body.code} components={components} />
            </div>
          </>
        )}
      </PostSimple>
    </>
  )
}
