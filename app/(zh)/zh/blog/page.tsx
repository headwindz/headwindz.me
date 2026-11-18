import { chinesePosts } from 'lib/i18n/posts'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 6

export const metadata = genPageMetadata({ locale: 'zh', title: '文章' })

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const posts = chinesePosts
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="全部文章"
    />
  )
}
