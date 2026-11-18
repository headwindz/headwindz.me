'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'
import { useLocale } from './LocaleProvider'
import { dictionaries, localizedHref } from '../lib/i18n'
import headerNavLinks from '@/data/headerNavLinks'

export default function DesktopNav() {
  const locale = useLocale()
  const t = dictionaries[locale]
  const pathname = usePathname().replace(/^\/zh(?=\/|$)/, '') || '/'
  return (
    <nav aria-label={t.navigation} className="desktop-nav">
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`) ||
            (link.href === '/blog' && pathname === '/')
          return (
            <Link
              key={link.href}
              href={localizedHref(link.href, locale)}
              aria-current={active ? 'page' : undefined}
            >
              {t[link.title.toLowerCase() as 'home' | 'blogs' | 'projects' | 'tags']}
            </Link>
          )
        })}
    </nav>
  )
}
