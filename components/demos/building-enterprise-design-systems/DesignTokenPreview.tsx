'use client'

import { useState, type CSSProperties } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export default function DesignTokenPreview() {
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
