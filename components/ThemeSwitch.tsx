'use client'

import { useLocale } from './LocaleProvider'
import { dictionaries } from '../lib/i18n'

import { useEffect, useState, useId, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'

export default function ThemeSwitch() {
  const t = dictionaries[useLocale()]
  const maskId = useId()
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  useEffect(() => setMounted(true), [])
  const light = mounted && resolvedTheme === 'light'

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next = light ? 'dark' : 'light'
    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(next)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })
    void transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 500,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })
      .catch(() => {})
  }

  return (
    <div className="reading-light" data-lit={light}>
      <button
        className="reading-light-switch"
        disabled={!mounted}
        aria-label={light ? t.dark : t.light}
        title={light ? t.dark : t.light}
        onClick={toggle}
      >
        <svg
          className="eclipse-toggle"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          aria-hidden="true"
        >
          <defs>
            <mask id={maskId}>
              <rect width="32" height="32" fill="white" />
              <circle className="eclipse-cutout" cx="22" cy="10" r="8" fill="black" />
            </mask>
          </defs>
          <g
            className="eclipse-rays"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M16 2v3M16 27v3M2 16h3M27 16h3M6.1 6.1l2.1 2.1M23.8 23.8l2.1 2.1M6.1 25.9l2.1-2.1M23.8 8.2l2.1-2.1" />
          </g>
          <circle
            className="eclipse-disc"
            cx="16"
            cy="16"
            r="8"
            fill="currentColor"
            mask={`url(#${maskId})`}
          />
        </svg>
      </button>
    </div>
  )
}
