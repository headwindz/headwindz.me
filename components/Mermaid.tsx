'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Download, Maximize2, Minimize2 } from 'lucide-react'
import CodeAction from './CodeAction'

type Props = { chart: string }

export default function Mermaid({ chart }: Props) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [zoom, setZoom] = useState(1)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expanded) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [expanded])

  useEffect(() => {
    async function render() {
      const { default: mermaid } = await import('mermaid')
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict',
        themeVariables:
          resolvedTheme === 'dark'
            ? {
                background: '#111827',
                primaryColor: '#1e293b',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#64748b',
                lineColor: '#a78bfa',
                secondaryColor: '#312e81',
                tertiaryColor: '#172033',
                fontFamily: 'system-ui, sans-serif',
              }
            : {
                background: '#f8fafc',
                primaryColor: '#eef2ff',
                primaryTextColor: '#172033',
                primaryBorderColor: '#a5b4fc',
                lineColor: '#6366f1',
                secondaryColor: '#f5f3ff',
                tertiaryColor: '#ffffff',
                fontFamily: 'system-ui, sans-serif',
              },
        flowchart: { curve: 'basis', nodeSpacing: 40, rankSpacing: 55 },
      })
      const safeId = `mermaid${id.replace(/[^a-zA-Z0-9]/g, '')}`
      // Remove any previously rendered SVG to avoid ID collisions on re-render
      document.getElementById(safeId)?.remove()
      try {
        const { svg } = await mermaid.render(safeId, chart.trim())
        if (ref.current) {
          ref.current.innerHTML = svg
          setError(false)
        }
      } catch {
        if (ref.current) {
          ref.current.textContent = 'Diagram failed to render.'
          setError(true)
        }
      }
    }
    render()
  }, [chart, id, resolvedTheme])

  const download = () => {
    const svg = ref.current?.querySelector('svg')
    if (!svg) return
    const url = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'architecture-diagram.svg'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className={`not-prose border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-900 ${expanded ? 'fixed inset-0 z-[80] m-0 flex h-dvh flex-col border-0 shadow-2xl' : 'my-8 rounded-2xl'}`}
    >
      <div
        className={`relative z-10 flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700 ${expanded ? '' : 'rounded-t-2xl'}`}
      >
        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          Architecture diagram
        </span>
        <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((value) => Math.max(0.6, value - 0.2))}
            className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((value) => Math.min(2, value + 0.2))}
            className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            +
          </button>
          <span className="ml-2">
            <CodeAction label="Download SVG" onClick={download} tooltipPlacement="bottom">
              <Download size={16} />
            </CodeAction>
          </span>
          <CodeAction
            label={expanded ? 'Close expanded diagram' : 'Expand diagram'}
            onClick={() => setExpanded((value) => !value)}
            expanded={expanded}
            tooltipPlacement="bottom"
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </CodeAction>
        </div>
      </div>
      <div className={`overflow-auto p-6 ${expanded ? 'flex-1' : 'max-h-[680px] rounded-b-2xl'}`}>
        <div
          ref={ref}
          className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-none"
          style={{ width: `${zoom * 100}%`, minWidth: expanded ? 960 : 640 }}
          role="img"
          aria-label={error ? 'Diagram failed to render' : 'Architecture diagram'}
        />
      </div>
    </div>
  )
}
