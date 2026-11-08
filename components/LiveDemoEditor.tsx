'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronsDown, ChevronsUp, Copy, RotateCcw } from 'lucide-react'
import CodeAction from './CodeAction'

const tokenPattern =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:\\[\s\S]|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|<\/?[A-Za-z][\w.-]*|\b(?:import|from|export|default|const|let|var|function|return|if|else|new|async|await|type|interface|extends|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/g

function highlightCode(source: string) {
  return source.split(tokenPattern).map((part, index) => {
    if (!part) return null
    let color = ''
    if (part.startsWith('//') || part.startsWith('/*')) color = 'text-slate-500'
    else if (/^['"`]/.test(part)) color = 'text-emerald-300'
    else if (part.startsWith('<')) color = 'text-rose-300'
    else if (/^\d/.test(part)) color = 'text-orange-300'
    else if (/^(true|false|null|undefined)$/.test(part)) color = 'text-orange-300'
    else if (
      /^(import|from|export|default|const|let|var|function|return|if|else|new|async|await|type|interface|extends)$/.test(
        part
      )
    )
      color = 'text-violet-300'
    return color ? (
      <span key={index} className={color}>
        {part}
      </span>
    ) : (
      part
    )
  })
}

export default function LiveDemoEditor({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode)
  const [script, setScript] = useState('')
  const [runtime, setRuntime] = useState('')
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)
  const highlightRef = useRef<HTMLPreElement>(null)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setRunning(true)
      try {
        const response = await fetch('/api/demo-preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
        const result = await response.json()
        if (cancelled) return
        if (!response.ok) throw new Error(result.error || 'Could not run the demo.')
        setScript(result.script)
        setRuntime(result.runtime)
        setError('')
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not run the demo.')
      } finally {
        if (!cancelled) setRunning(false)
      }
    }, 450)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [code])

  const preview = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:14px system-ui,sans-serif;margin:0;padding:24px;color:#172033}button,input,select{font:inherit}button{cursor:pointer}.space-y-2>*+*{margin-top:8px}.space-y-4>*+*{margin-top:16px}.flex{display:flex}.items-center{align-items:center}.gap-2{gap:8px}.mb-4{margin-bottom:16px}.rounded{border-radius:6px}.bg-blue-500{background:#3b82f6}.text-white{color:white}.px-4{padding-left:16px;padding-right:16px}.py-2{padding-top:8px;padding-bottom:8px}.font-bold{font-weight:700}ul{padding-left:24px}</style></head><body><div id="root"></div><script>window.addEventListener('error',e=>{const p=document.createElement('pre');p.style.color='#b91c1c';p.textContent=e.message;document.body.append(p)})</script><script>${runtime.replaceAll('</script', '<\\/script')}</script><script>${script.replaceAll('</script', '<\\/script')}</script></body></html>`

  return (
    <div className="not-prose my-8 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 rounded-t-2xl border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Interactive playground
        </span>
        <div className="text-primary-600 dark:text-primary-400 flex flex-wrap items-center gap-1">
          <CodeAction label={copied ? 'Copied!' : 'Copy code'} onClick={copyCode}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </CodeAction>
          <CodeAction label="Reset code" onClick={() => setCode(initialCode)}>
            <RotateCcw size={16} />
          </CodeAction>
          <CodeAction
            label={collapsed ? 'Expand demo' : 'Collapse demo'}
            onClick={() => setCollapsed((value) => !value)}
            expanded={!collapsed}
          >
            {collapsed ? <ChevronsDown size={16} /> : <ChevronsUp size={16} />}
          </CodeAction>
        </div>
      </div>
      {!collapsed && (
        <div className="grid overflow-hidden rounded-b-2xl lg:grid-cols-2">
          <div className="min-w-0 border-b border-gray-200 lg:border-r lg:border-b-0 dark:border-gray-700">
            <div className="border-b border-gray-200 px-4 py-2 text-xs font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Edit TSX · updates automatically
            </div>
            <div className="relative h-80 overflow-hidden bg-gray-950">
              <pre
                ref={highlightRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden p-4 font-mono text-xs leading-5 whitespace-pre text-gray-100"
              >
                {highlightCode(code)}
                {'\n'}
              </pre>
              <textarea
                aria-label="Edit demo code"
                spellCheck={false}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                onScroll={(event) => {
                  if (highlightRef.current) {
                    highlightRef.current.scrollTop = event.currentTarget.scrollTop
                    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft
                  }
                }}
                className="selection:bg-primary-500/40 relative block h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-xs leading-5 text-transparent caret-white focus:ring-0"
              />
            </div>
          </div>
          <div className="min-w-0">
            <div className="border-b border-gray-200 px-4 py-2 text-xs font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Preview {running && '· updating…'}
            </div>
            {error && (
              <pre
                role="alert"
                className="m-4 max-h-32 overflow-auto rounded-lg bg-red-50 p-3 text-xs whitespace-pre-wrap text-red-700 dark:bg-red-950 dark:text-red-200"
              >
                {error}
              </pre>
            )}
            {script && (
              <iframe
                title="Live demo preview"
                sandbox="allow-scripts"
                srcDoc={preview}
                className="h-80 w-full bg-white"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
