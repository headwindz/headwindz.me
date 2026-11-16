'use client'

import AgentLoop from './AgentLoop'
import type { Blog } from 'contentlayer/generated'
import { useState, type CSSProperties } from 'react'
import { ArrowRight, Check, Code2, Monitor, Terminal, RotateCcw } from 'lucide-react'

function WorkspacePreview() {
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
function DesignTokenPreview() {
  const [active, setActive] = useState(0)
  const colors = ['#705618', '#336b80', '#77549a']
  return (
    <div
      className="post-cover tokens-cover"
      style={{ '--sample-accent': colors[active] } as CSSProperties}
      aria-label="Live design token preview"
    >
      <div className="token-controls">
        <span>accent</span>
        {colors.map((color, i) => (
          <button
            key={color}
            style={{ background: color }}
            aria-label={`Use ${['gold', 'blue', 'purple'][i]} accent`}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            {active === i && <Check size={14} />}
          </button>
        ))}
      </div>
      <div className="token-samples">
        <span className="sample-badge">Component</span>
        <span className="sample-button">
          Continue <ArrowRight size={14} />
        </span>
        <span className="sample-check">
          <Check size={16} /> Shared token
        </span>
      </div>
      <p>One token. Every component updates.</p>
    </div>
  )
}
function WorkflowPreview() {
  const [active, setActive] = useState(0)
  const steps = ['Prompt', 'Model', 'Tool', 'Result']
  return (
    <div className="post-cover workflow-cover" aria-label="AI workflow preview">
      <div className="workflow-track">
        {steps.map((step, i) => (
          <span key={step} data-active={active >= i}>
            <span className="workflow-dot" />
            {step}
            {i < 3 && <ArrowRight size={14} aria-hidden="true" />}
          </span>
        ))}
      </div>
      <div className="workflow-output">
        <code aria-live="polite">
          {
            [
              '→ Receive a task',
              '→ Generate the next action',
              '→ Read external information',
              '✓ Return the result',
            ][active]
          }
        </code>
        <button
          onClick={() => setActive((active + 1) % 4)}
          aria-label={active === 3 ? 'Restart AI workflow' : 'Run next AI workflow step'}
        >
          {active === 3 ? <RotateCcw size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  )
}
function StablecoinPreview() {
  const [minted, setMinted] = useState(false)
  return (
    <div
      className="post-cover reserve-cover"
      aria-label="Simplified stablecoin mint and redeem illustration"
    >
      <div className="reserve-ledger">
        <div>
          <span>Reserve</span>
          <strong>{minted ? '$100' : '$0'}</strong>
        </div>
        <span aria-hidden="true">⇄</span>
        <div>
          <span>Tokens issued</span>
          <strong>{minted ? '100' : '0'}</strong>
        </div>
      </div>
      <div className="reserve-action">
        <span>Illustrative 1:1 backing</span>
        <button onClick={() => setMinted(!minted)}>
          {minted ? 'Redeem 100' : 'Mint 100'} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

const previews = {
  'all-about-my-development': WorkspacePreview,
  'building-enterprise-design-systems': DesignTokenPreview,
  'ai-concepts-from-llms-to-multi-agent-systems': WorkflowPreview,
  'web3-stablecoins': StablecoinPreview,
  'ai-agents-and-harnesses-from-tool-loops-to-reliable-systems': AgentLoop,
}

export default function ArticlePreview({
  post,
}: {
  post: Pick<Blog, 'slug' | 'tags' | 'readingTime'>
}) {
  const Preview = Object.hasOwn(previews, post.slug)
    ? previews[post.slug as keyof typeof previews]
    : undefined
  if (Preview) return <Preview />
  return (
    <div className="post-cover p-4 text-sm">
      {[post.readingTime.text, ...post.tags].join(' · ')}
    </div>
  )
}
