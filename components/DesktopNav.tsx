'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

export default function DesktopNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Main navigation" className="desktop-nav">
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`) ||
            (link.href === '/blog' && pathname === '/')
          return (
            <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined}>
              {link.title}
            </Link>
          )
        })}
    </nav>
  )
}
