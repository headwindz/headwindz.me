'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { dictionaries, type Locale } from '../lib/i18n'

interface Heading {
  value: string
  url: string
  depth: number
}

export default function ArticleToc({
  headings = [],
  locale = 'en',
}: {
  headings?: Heading[]
  locale?: Locale
}) {
  const t = dictionaries[locale]
  const depth = Math.min(...headings.map((heading) => heading.depth))
  const sections: { heading: Heading; children: Heading[] }[] = []
  for (const heading of headings) {
    if (heading.depth > depth + 1) continue
    const parent = sections[sections.length - 1]
    if (heading.depth === depth || !parent || parent.heading.depth !== depth) {
      sections.push({ heading, children: [] })
    } else {
      parent.children.push(heading)
    }
  }
  const menuButton = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [percent, setPercent] = useState(0)
  const [currentSection, setCurrentSection] = useState<string>()
  const activeBranch =
    sections.find(
      ({ heading, children }) =>
        heading.url === currentSection || children.some((child) => child.url === currentSection)
    ) ?? sections[0]

  useEffect(() => {
    const body = document.getElementById('post-body')
    if (!body) return

    const targets = [...(navRef.current?.querySelectorAll('a') ?? [])]
      .flatMap((link) => {
        const target = document.getElementById(decodeURIComponent(link.hash.slice(1)))
        const href = link.getAttribute('href')
        return href && target && body.contains(target) ? [{ target, href }] : []
      })
      .reverse()
    let frame = 0

    const update = () => {
      frame = 0
      const rect = body.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      // A short post is complete when its final line is visible.
      const progress =
        distance <= 0
          ? Number(rect.bottom <= window.innerHeight)
          : Math.min(1, Math.max(0, -rect.top / distance))

      setPercent(progress === 1 ? 100 : Math.floor(progress * 100))

      const offset = targets.length
        ? parseFloat(getComputedStyle(targets[0].target).scrollMarginTop)
        : 0
      const section = targets.find(({ target }) => target.getBoundingClientRect().top <= offset + 2)
      setCurrentSection(section?.href)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(body)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector('[aria-current="location"]')
    if (!nav || !link || nav.scrollHeight <= nav.clientHeight || !nav.clientHeight) return

    const bounds = nav.getBoundingClientRect()
    const row = link.getBoundingClientRect()
    if (row.top < bounds.top) nav.scrollTop += row.top - bounds.top
    if (row.bottom > bounds.bottom) nav.scrollTop += row.bottom - bounds.bottom
  }, [currentSection, expanded])

  function dismissOnEscape(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !expanded) return
    setExpanded(false)
    menuButton.current?.focus()
  }

  function renderHeadingLink(heading: Heading) {
    return (
      <a
        href={heading.url}
        aria-current={currentSection === heading.url ? 'location' : undefined}
        onKeyDown={dismissOnEscape}
        onClick={(event) => {
          if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            setExpanded(false)
          }
        }}
      >
        {heading.value}
      </a>
    )
  }

  return (
    <aside
      className={sections.length ? 'article-index' : 'article-index article-index-progress-only'}
    >
      {sections.length > 0 && (
        <>
          <p className="article-index-label">{t.toc}</p>
          <button
            type="button"
            ref={menuButton}
            className="article-index-toggle"
            aria-expanded={expanded}
            aria-controls="article-sections"
            onClick={() => setExpanded((open) => !open)}
            onKeyDown={dismissOnEscape}
          >
            {t.toc}
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          <nav
            ref={navRef}
            id="article-sections"
            aria-label={t.sections}
            className={expanded ? 'is-expanded' : undefined}
          >
            <ol>
              {sections.map((section) => (
                <li key={section.heading.url}>
                  {renderHeadingLink(section.heading)}
                  {section.children.length > 0 && (
                    <ol hidden={activeBranch !== section}>
                      {section.children.map((heading) => (
                        <li key={heading.url}>{renderHeadingLink(heading)}</li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </>
      )}
      <div
        className="reading-progress"
        role="progressbar"
        aria-label={locale === 'zh' ? '阅读进度' : 'Reading progress'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="reading-progress-track" aria-hidden="true">
          <div className="reading-progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span aria-hidden="true">{percent}%</span>
      </div>
    </aside>
  )
}
