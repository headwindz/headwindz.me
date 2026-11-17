'use client'

import React, { useState } from 'react'

export default function App() {
  const [isRelativeToViewport, setIsRelativeToViewport] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isRelativeToViewport}
            onChange={(e) => setIsRelativeToViewport(e.target.checked)}
            style={{ width: '1rem', height: '1rem' }}
          />
          <span>Relative to viewport</span>
        </label>
      </div>

      <div
        style={{
          position: 'relative',
          height: '10rem',
          width: '100%',
          overflow: 'auto',
          border: '1px solid #d1d5db',
          padding: '1rem',
          transform: isRelativeToViewport ? 'none' : 'translateX(0)',
        }}
      >
        <div style={{ position: 'fixed', top: '0.5rem', left: '0.5rem' }}>
          I am fixed {isRelativeToViewport ? 'to viewport' : 'to wrapper container'}
        </div>
      </div>
    </div>
  )
}
