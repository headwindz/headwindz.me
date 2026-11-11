'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, Terminal } from 'lucide-react'

const views = ['all', 'about', 'interests', 'opensource', 'help'] as const
type View = (typeof views)[number] | 'clear'

export default function AboutTerminal({
  identity,
  children,
}: {
  identity: ReactNode
  children: ReactNode
}) {
  const [view, setView] = useState<View>('all')
  const [command, setCommand] = useState('')
  const [message, setMessage] = useState('All profile sections are visible.')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const run = (raw: string) => {
    const value = raw.trim().toLowerCase()
    if (!value) return
    if (views.includes(value as (typeof views)[number]) || value === 'clear') {
      setView(value as View)
      setMessage(
        value === 'clear'
          ? 'Output cleared. Type all to restore the profile.'
          : value === 'help'
            ? 'Available commands are listed below.'
            : `Showing ${value === 'all' ? 'all profile sections' : value}.`
      )
    } else {
      setMessage(
        `Unknown command: ${raw.trim()}. Try about, interests, opensource, all, help, or clear.`
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
    <section
      className="profile-terminal"
      data-view={view}
      aria-label="Interactive profile terminal"
    >
      <div className="terminal-titlebar">
        <div className="terminal-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span>
          <Terminal size={15} aria-hidden="true" /> michael@headwindz: ~/about
        </span>
        <span className="terminal-file">profile.md</span>
      </div>
      <div className="terminal-identity">{identity}</div>
      <nav className="terminal-shortcuts" aria-label="Profile sections">
        {views.map((item) => (
          <button key={item} onClick={() => run(item)} aria-pressed={view === item}>
            {item}
          </button>
        ))}
      </nav>
      <div className="terminal-output">
        {view === 'help' && (
          <div className="terminal-help">
            <h2>Available commands</h2>
            <dl>
              <dt>about</dt>
              <dd>Background and the way I work.</dd>
              <dt>interests</dt>
              <dd>The topics I keep exploring.</dd>
              <dt>opensource</dt>
              <dd>Projects and open source contributions.</dd>
              <dt>all</dt>
              <dd>Show the complete profile.</dd>
              <dt>clear</dt>
              <dd>Clear the output. Use all to bring it back.</dd>
            </dl>
            <p>
              Use the buttons above, or type a command below. Up and down arrows recall recent
              commands.
            </p>
          </div>
        )}
        {view === 'clear' && (
          <p className="terminal-cleared">
            A clean slate. Type <code>all</code> to bring the profile back.
          </p>
        )}
        <div className="terminal-document">{children}</div>
      </div>
      <div className="terminal-input-area">
        <p role="status" aria-live="polite" aria-atomic="true" className="terminal-status">
          {message}
        </p>
        <form onSubmit={submit} className="terminal-command">
          <label htmlFor="profile-command">
            <span aria-hidden="true">❯</span>
            <span className="sr-only">Profile command</span>
          </label>
          <input
            id="profile-command"
            value={command}
            placeholder="Type help, or choose a section above"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            onChange={(event) => {
              setCommand(event.target.value)
              setHistoryIndex(-1)
            }}
            onKeyDown={(event) => {
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
          <button type="submit" aria-label="Run profile command">
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  )
}
