'use client'

import { useLocale } from './LocaleProvider'
import { localizedHref } from 'lib/i18n'
import { ArrowLeft } from 'lucide-react'
import Link from './Link'

export default function HomeCommand() {
  const locale = useLocale()
  return (
    <Link
      href={localizedHref('/', locale)}
      className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:underline"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      cd ..
    </Link>
  )
}
