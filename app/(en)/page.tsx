import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import AuthorLayout from '@/layouts/AuthorLayout'
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import Main from '../Main'

export const metadata = { alternates: { canonical: '/', languages: { en: '/', 'zh-CN': '/zh/' } } }

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const author = allAuthors.find((author) => author.slug === 'default')!
  return (
    <Main
      posts={posts}
      profile={
        <AuthorLayout content={coreContent(author)}>
          <MDXLayoutRenderer code={author.body.code} />
        </AuthorLayout>
      }
    />
  )
}
