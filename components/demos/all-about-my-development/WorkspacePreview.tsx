'use client'

import { useState } from 'react'
import { Code2, Monitor, Terminal } from 'lucide-react'

export default function WorkspacePreview() {
  const [active, setActive] = useState(0)
  const tools = [
    {
      name: 'VS Code',
      Icon: Code2,
      text: 'editor.settings',
      code: 'formatOnSave: true\nESLint + Prettier\nVim keybindings',
    },
    {
      name: 'Warp',
      Icon: Terminal,
      text: 'terminal',
      code: '$ pnpm dev\n→ localhost:3000\nReady to build.',
    },
    {
      name: 'Hardware',
      Icon: Monitor,
      text: 'desk.setup',
      code: 'MacBook Pro\nMagic Trackpad\nVarmilo keyboard',
    },
  ]
  return (
    <div className="post-cover workspace-cover" aria-label="Development workspace preview">
      <div className="workspace-screen">
        <span>{tools[active].text}</span>
        <pre aria-live="polite">{tools[active].code}</pre>
      </div>
      <div className="workspace-dock">
        {tools.map(({ name, Icon }, i) => (
          <button key={name} onClick={() => setActive(i)} aria-pressed={active === i}>
            <Icon size={18} aria-hidden="true" />
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
