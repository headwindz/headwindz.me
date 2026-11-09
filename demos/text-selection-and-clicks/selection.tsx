function App() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
      <p>Drag across each example to compare text selection.</p>
      <button type="button" style={{ userSelect: 'none', WebkitUserSelect: 'none', padding: 12 }}>
        Drag handle: this label stays unselected
      </button>
      <p style={{ userSelect: 'text', WebkitUserSelect: 'text' }}>
        You can select part of this sentence.
      </p>
      <p style={{ userSelect: 'all', WebkitUserSelect: 'all', fontFamily: 'monospace' }}>
        npm install example-package
      </p>
    </main>
  )
}
