'use client'

import { isValidElement, useRef, useState, type HTMLAttributes } from 'react'
import { Check, ChevronsDown, ChevronsUp, Copy } from 'lucide-react'
import CodeAction from './CodeAction'

export default function CodeSnippet({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  const [collapsed, setCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const language = isValidElement<{ className?: string }>(children)
    ? children.props.className?.match(/language-([\w-]+)/)?.[1]
    : undefined

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeRef.current?.textContent ?? '')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-snippet not-prose my-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div
        className={`relative z-10 flex items-center justify-between gap-2 px-4 py-3 ${collapsed ? 'rounded-2xl' : 'rounded-t-2xl border-b border-gray-200 dark:border-gray-700'}`}
      >
        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
          {language ?? 'Code snippet'}
        </span>
        <div className="text-primary-600 dark:text-primary-400 flex items-center gap-1">
          <CodeAction label={copied ? 'Copied!' : 'Copy code'} onClick={copyCode}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </CodeAction>
          <CodeAction
            label={collapsed ? 'Expand code' : 'Collapse code'}
            onClick={() => setCollapsed((value) => !value)}
            expanded={!collapsed}
          >
            {collapsed ? <ChevronsDown size={16} /> : <ChevronsUp size={16} />}
          </CodeAction>
        </div>
      </div>
      <pre
        {...props}
        ref={codeRef}
        className={`m-0 overflow-auto rounded-b-2xl bg-gray-950 p-4 font-mono text-xs leading-5 text-gray-100 ${collapsed ? 'hidden' : ''} ${props.className ?? ''}`}
      >
        {children}
      </pre>
    </div>
  )
}
