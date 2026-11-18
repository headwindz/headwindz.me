'use client'

import { useLocale } from './LocaleProvider'
import { useEffect, useRef, useState } from 'react'

export default function ReadingProgress() {
  const locale = useLocale()
  const fillRef = useRef<HTMLDivElement>(null)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const body = document.getElementById('post-body')
    if (!body) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = body.getBoundingClientRect()
      const start = rect.top + window.scrollY
      const distance = rect.height - window.innerHeight
      // A short post is complete when its final line is visible.
      const progress =
        distance <= 0
          ? Number(rect.bottom <= window.innerHeight)
          : Math.min(1, Math.max(0, (window.scrollY - start) / distance))

      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`
      setPercent(Math.round(progress * 100))
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

  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label={locale === 'zh' ? '阅读进度' : 'Reading progress'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div ref={fillRef} className="reading-progress-fill" />
    </div>
  )
}
