'use client'

import { useLocale } from './LocaleProvider'
import { dictionaries } from '../lib/i18n'

import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Terminal } from 'lucide-react'

const views = ['about', 'interests', 'opensource'] as const
type View = (typeof views)[number]

export default function AboutTerminal({
  identity,
  children,
}: {
  identity: ReactNode
  children: ReactNode
}) {
  const locale = useLocale()
  const t = dictionaries[locale]
  const input = useRef<HTMLInputElement>(null)
  const [view, setView] = useState<View>('about')
  const [command, setCommand] = useState('')
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const matches = views.filter((item) => item.startsWith(command.toLowerCase()))
  const suggestion = command && matches[0] !== command.toLowerCase() ? matches[0] : undefined
  const run = (raw: string) => {
    const value = raw.trim().toLowerCase()
    if (!value) return
    if (views.includes(value as View)) {
      setView(value as View)
      setMessage(locale === 'zh' ? `正在显示：${t[value as View]}。` : `Showing ${value}.`)
    } else {
      setMessage(
        locale === 'zh'
          ? `未知命令：${raw.trim()}。请选择下方命令。`
          : `Unknown command: ${raw.trim()}.`
      )
    }
    setHistory((previous) => [...previous.slice(-19), raw.trim()])
    setHistoryIndex(-1)
    setCommand('')
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    run(command)
  }

  return (
    <section className="profile-terminal" data-view={view} aria-label={t.terminal}>
      <div className="terminal-titlebar">
        <div className="terminal-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span>
          <Terminal size={15} aria-hidden="true" /> michael@headwindz: ~
        </span>
        <span className="terminal-file">profile.md</span>
      </div>
      <div className="terminal-identity">{identity}</div>
      <nav className="terminal-shortcuts" aria-label={t.profileSections}>
        {views.map((item) => (
          <button key={item} onClick={() => run(item)} aria-pressed={view === item}>
            {t[item]}
          </button>
        ))}
      </nav>
      <div className="terminal-output">
        <div className="terminal-document">{children}</div>
      </div>
      <div className="terminal-input-area">
        <p role="status" aria-live="polite" aria-atomic="true" className="terminal-status">
          {message}
        </p>
        <form onSubmit={submit} className="terminal-command">
          <label htmlFor="profile-command">
            <span aria-hidden="true">❯</span>
            <span className="sr-only">{t.profileCommand}</span>
          </label>
          <div className="terminal-entry">
            <input
              ref={input}
              id="profile-command"
              value={command}
              placeholder={t.commandPlaceholder}
              aria-describedby="command-hints"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              onChange={(event) => {
                setCommand(event.target.value)
                setHistoryIndex(-1)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Tab' && !event.shiftKey && suggestion) {
                  event.preventDefault()
                  setCommand(suggestion)
                }
                if (event.key === 'Escape') {
                  setCommand('')
                  setHistoryIndex(-1)
                }
                if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && history.length) {
                  event.preventDefault()
                  const next =
                    event.key === 'ArrowUp'
                      ? Math.min(historyIndex + 1, history.length - 1)
                      : Math.max(historyIndex - 1, -1)
                  setHistoryIndex(next)
                  setCommand(next < 0 ? '' : history[history.length - 1 - next])
                }
              }}
            />
            {suggestion && (
              <span className="terminal-ghost" aria-hidden="true">
                <span>{command}</span>
                {suggestion.slice(command.length)}
              </span>
            )}
            {!command && <i className="terminal-idle-caret" aria-hidden="true" />}
          </div>
          <button type="submit" aria-label={t.run}>
            ↵
          </button>
        </form>
        <div className="command-hints" id="command-hints">
          <span>{suggestion ? t.complete : t.commands}</span>
          {matches.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => {
                setCommand(item)
                input.current?.focus()
              }}
            >
              {item}
            </button>
          ))}
          {!matches.length && <span>{t.noMatch}</span>}
        </div>
      </div>
    </section>
  )
}
