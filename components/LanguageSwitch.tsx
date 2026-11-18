'use client'

import { usePathname } from 'next/navigation'
import { useLocale } from './LocaleProvider'
import { localizedHref } from '../lib/i18n'

export default function LanguageSwitch() {
  const pathname = usePathname()
  const locale = useLocale()
  const englishPath = pathname.replace(/^\/zh(?=\/|$)/, '') || '/'
  return (
    <nav className="language-switch" aria-label={locale === 'zh' ? '语言' : 'Language'}>
      <a
        href={englishPath}
        lang="en"
        hrefLang="en"
        aria-current={locale === 'en' ? 'page' : undefined}
      >
        EN
      </a>
      <span aria-hidden="true">/</span>
      <a
        href={localizedHref(englishPath, 'zh')}
        lang="zh-CN"
        hrefLang="zh-CN"
        aria-current={locale === 'zh' ? 'page' : undefined}
      >
        中文
      </a>
    </nav>
  )
}
