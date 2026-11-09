import { useState } from 'react'

function App() {
  const [passThrough, setPassThrough] = useState(true)
  const [clicks, setClicks] = useState(0)

  return (
    <main className="overlay-demo">
      <style>{`.overlay-demo {
  padding: 24px;
  font-family: sans-serif;
  line-height: 1.6;
}

.preview {
  position: relative;
  padding: 32px;
  margin-top: 16px;
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgb(0 0 0 / 15%);
  pointer-events: none;
}

.overlay[data-blocked='true'] {
  pointer-events: auto;
}`}</style>
      <label>
        <input
          type="checkbox"
          id="pass-through"
          checked={passThrough}
          onChange={(event) => setPassThrough(event.target.checked)}
        />{' '}
        Let pointer input pass through the overlay
      </label>
      <div className="preview">
        <button type="button" id="preview-button" onClick={() => setClicks((count) => count + 1)}>
          Click me
        </button>
        <div className="overlay" aria-hidden="true" data-blocked={String(!passThrough)} />
      </div>
      <p role="status" id="click-count">
        Button clicks: {clicks}
      </p>
      <p>Uncheck the option and try clicking again. Tab and Enter still activate the button.</p>
    </main>
  )
}
