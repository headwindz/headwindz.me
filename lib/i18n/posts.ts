import { allBlogs, allTranslatedBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { featuredTranslations } from './index'

export const translations = new Map(allTranslatedBlogs.map((post) => [post.sourceSlug, post]))
export const chinesePosts = allCoreContent(sortPosts(allBlogs)).map((post) => {
  const copy = translations.get(post.slug) || featuredTranslations[post.slug]
  return copy ? { ...post, title: copy.title, summary: copy.summary } : post
})
