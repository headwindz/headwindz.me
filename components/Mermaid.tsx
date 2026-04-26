'use client'

import { useEffect, useId, useRef } from 'react'
import { useTheme } from 'next-themes'

type Props = { chart: string }

export default function Mermaid({ chart }: Props) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    async function render() {
      const { default: mermaid } = await import('mermaid')
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
      })
      const safeId = `mermaid${id.replace(/[^a-zA-Z0-9]/g, '')}`
      // Remove any previously rendered SVG to avoid ID collisions on re-render
      document.getElementById(safeId)?.remove()
      try {
        const { svg } = await mermaid.render(safeId, chart.trim())
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      } catch {
        if (ref.current) {
          ref.current.textContent = 'Diagram failed to render.'
        }
      }
    }
    render()
  }, [chart, id, resolvedTheme])

  return <div ref={ref} className="my-6 flex justify-center overflow-x-auto" />
}
