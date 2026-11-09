import { useState } from 'react'

function App() {
  const [passThrough, setPassThrough] = useState(true)
  const [clicks, setClicks] = useState(0)

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
      <label>
        <input
          type="checkbox"
          checked={passThrough}
          onChange={(event) => setPassThrough(event.target.checked)}
        />{' '}
        Let pointer input pass through the overlay
      </label>
      <div style={{ position: 'relative', padding: 32, marginTop: 16 }}>
        <button type="button" onClick={() => setClicks((count) => count + 1)}>
          Click me
        </button>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'rgb(0 0 0 / 15%)',
            pointerEvents: passThrough ? 'none' : 'auto',
          }}
        />
      </div>
      <p role="status">Button clicks: {clicks}</p>
      <p>Uncheck the option and try clicking again. Tab and Enter still activate the button.</p>
    </main>
  )
}
