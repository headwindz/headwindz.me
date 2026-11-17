import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col items-center border-t border-gray-200 pt-5 dark:border-gray-800">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
        <div className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          <Link href={siteMetadata.siteRepo} className="hover:text-primary-400 underline">
            View Source
          </Link>
        </div>
      </div>
    </footer>
  )
}
