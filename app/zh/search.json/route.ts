import { chinesePosts } from 'lib/i18n/posts'

export const dynamic = 'force-static'

export function GET() {
  return Response.json(
    chinesePosts.map(({ path, title, summary, tags, date }) => ({
      path,
      title,
      summary,
      tags,
      date,
    }))
  )
}
