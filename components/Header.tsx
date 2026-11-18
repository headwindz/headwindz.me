import LanguageSwitch from './LanguageSwitch'
import { localizedHref, type Locale } from '../lib/i18n'
import siteMetadata from '@/data/siteMetadata'
import DesktopNav from './DesktopNav'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = ({ locale = 'en' }: { locale?: Locale }) => {
  const headerClass = `site-header${siteMetadata.stickyNav ? ' sticky top-0 z-50' : ''}`

  return (
    <header className={headerClass}>
      <Link href={localizedHref('/', locale)} aria-label={siteMetadata.headerTitle}>
        <span className="site-wordmark">{siteMetadata.headerTitle}</span>
      </Link>
      <div className="flex items-center gap-1 leading-5 sm:gap-2">
        <DesktopNav />
        <LanguageSwitch />
        <SearchButton locale={locale} />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
