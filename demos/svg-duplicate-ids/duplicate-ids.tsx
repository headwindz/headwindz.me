'use client'

import { useState } from 'react'

function Icon() {
  return (
    <svg viewBox="0 0 100 100">
      <defs>
        <linearGradient id="gradient">
          <stop offset="0%" stop-color="pink" />
          <stop offset="100%" stop-color="teal" />
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

      <div className="flex gap-4">
        <div className="h-20 w-20 rounded border border-gray-300 p-4">
          <div style={{ display: isFirstIconVisible ? 'block' : 'none' }}>
            <Icon />
          </div>
        </div>
        <div className="h-20 w-20 rounded border border-gray-300 p-4">
          <Icon />
        </div>
      </div>
    </div>
  )
}
