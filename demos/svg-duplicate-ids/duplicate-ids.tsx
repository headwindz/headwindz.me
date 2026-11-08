'use client'

import { useState } from 'react'

function Icon() {
  return (
    <svg viewBox="0 0 100 100" width="48" height="48" aria-label="Gradient circle">
      <defs>
        <linearGradient id="gradient">
          <stop offset="0%" stopColor="pink" />
          <stop offset="100%" stopColor="teal" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#gradient)" />
    </svg>
  )
}

export default function App() {
  const [isFirstIconVisible, setFirstIconVisible] = useState(true)

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={isFirstIconVisible}
          onChange={(e) => setFirstIconVisible(e.target.checked)}
          className="h-4 w-4"
        />
        <span>Show first icon</span>
      </label>

      <div style={{ display: 'flex', gap: 16 }}>
        <div
          style={{
            width: 80,
            height: 80,
            padding: 16,
            border: '1px solid #d1d5db',
            borderRadius: 6,
          }}
        >
          <div style={{ display: isFirstIconVisible ? 'block' : 'none' }}>
            <Icon />
          </div>
        </div>
        <div
          style={{
            width: 80,
            height: 80,
            padding: 16,
            border: '1px solid #d1d5db',
            borderRadius: 6,
          }}
        >
          <Icon />
        </div>
      </div>
    </div>
  )
}
