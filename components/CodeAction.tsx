import type { ReactNode } from 'react'

interface CodeActionProps {
  label: string
  onClick: () => void
  expanded?: boolean
  tooltipPlacement?: 'top' | 'bottom'
  children: ReactNode
}

export default function CodeAction({
  label,
  onClick,
  expanded,
  tooltipPlacement = 'top',
  children,
}: CodeActionProps) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-expanded={expanded}
        className="hover:bg-primary-50 focus-visible:ring-primary-500 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none dark:hover:bg-gray-800"
      >
        {children}
      </button>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 dark:bg-gray-100 dark:text-gray-900 ${tooltipPlacement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}`}
      >
        {label}
      </span>
    </span>
  )
}
