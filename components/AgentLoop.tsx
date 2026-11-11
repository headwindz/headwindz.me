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
        <svg viewBox="0 0 560 360" className="agent-wires" aria-hidden="true">
          <defs>
            <marker
              id="loop-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0 0 L6 3 L0 6" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </marker>
          </defs>
          {[
            'M361 180H369',
            'M450 153V80Q450 60 430 60H130Q110 60 110 80V153',
            'M110 207V260Q110 280 130 280H198',
            'M280 252V208',
          ].map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              markerEnd="url(#loop-arrow)"
            />
          ))}
        </svg>
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
        <span className="agent-repeat">repeat</span>
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
