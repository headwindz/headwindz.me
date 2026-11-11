import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-2 inline-flex min-h-8 items-center py-1 text-xs font-medium tracking-wide uppercase"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
