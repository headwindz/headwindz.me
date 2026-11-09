function App() {
  return (
    <>
      <style>{`.selection-demo {
  padding: 24px;
  font-family: sans-serif;
  line-height: 1.6;
}

.select-text {
  -webkit-user-select: text;
  user-select: text;
}

.select-none {
  -webkit-user-select: none;
  user-select: none;
}

.select-all {
  -webkit-user-select: all;
  user-select: all;
}`}</style>
      <main className="selection-demo">
        <p>Try selecting a word in each example.</p>
        <section>
          <strong>user-select: text</strong>
          <p className="select-text">Try selecting part of this sentence.</p>
        </section>
        <section>
          <strong>user-select: none</strong>
          <p className="select-none">Try selecting part of this sentence.</p>
        </section>
        <section>
          <strong>user-select: all</strong>
          <p className="select-all">Try selecting part of this sentence.</p>
        </section>
      </main>
    </>
  )
}
