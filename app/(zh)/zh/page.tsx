import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { allCoreContent, coreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors, allTranslatedAuthors } from 'contentlayer/generated'
import AuthorLayout from '@/layouts/AuthorLayout'
import Main from '../../Main'

export const metadata = {
  title: '首页',
  alternates: { canonical: '/zh/', languages: { en: '/', 'zh-CN': '/zh/' } },
}

export default function Page() {
  const author = allAuthors.find((author) => author.slug === 'default')!
  const translated = allTranslatedAuthors.find((author) => author.name === 'default')!
  return (
    <Main
      locale="zh"
      posts={allCoreContent(sortPosts(allBlogs))}
      profile={
        <AuthorLayout content={{ ...coreContent(author), occupation: '全栈工程师' }}>
          <MDXLayoutRenderer code={translated.body.code} />
        </AuthorLayout>
      }
    />
  )
}
