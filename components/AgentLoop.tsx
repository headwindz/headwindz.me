'use client'

import { useState } from 'react'
import { ArrowRight, Braces, Check, Layers, Sparkles } from 'lucide-react'

const steps = [
  {
    name: 'Model',
    Icon: Sparkles,
    detail: 'Choose the next action from the goal and available context.',
  },
  {
    name: 'Tools',
    Icon: Braces,
    detail: 'Run a tool to read, build, or change something outside the model.',
  },
  {
    name: 'Context',
    Icon: Layers,
    detail: 'Bring the result back into context for the next decision.',
  },
  {
    name: 'Evaluate',
    Icon: Check,
    detail: 'Check the outcome. Continue the loop, or stop when the task is done.',
  },
]

export default function AgentLoop() {
  const [active, setActive] = useState(0)
  return (
    <div className="agent-lab" aria-label="Interactive agent execution loop">
      <div className="agent-drawing">
        {steps.map(({ name, Icon }, index) => (
          <button
            key={name}
            className={`agent-node node-${index} ${active === index ? 'is-active' : ''}`}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{name}</span>
          </button>
        ))}
        {['→', '↓', '←', '↑'].map((arrow, i) => (
          <span key={arrow} aria-hidden="true" className={`loop-arrow arrow-${i}`}>
            {arrow}
          </span>
        ))}
      </div>
      <div className="agent-console">
        <p aria-live="polite">
          <strong>{steps[active].name}.</strong> {steps[active].detail}
        </p>
        <button onClick={() => setActive((active + 1) % steps.length)} className="step-button">
          Next step <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
