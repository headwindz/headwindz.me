import siteMetadata from '@/data/siteMetadata'
import DesktopNav from './DesktopNav'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  const headerClass = `site-header${siteMetadata.stickyNav ? ' sticky top-0 z-50' : ''}`

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <span className="site-wordmark">{siteMetadata.headerTitle}</span>
      </Link>
      <div className="flex items-center gap-1 leading-5 sm:gap-2">
        <DesktopNav />
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
