'use client'

import { useState } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'

export default function WorkflowPreview() {
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
