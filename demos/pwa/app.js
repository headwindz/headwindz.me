const log = (msg) => {
  const el = document.getElementById('container')
  el.textContent += `[${new Date().toLocaleTimeString()}] ${msg}\n`
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('serviceWorker.js', { scope: './' })
      log(`✓ Registered. Scope: ${reg.scope}`)
    } catch (err) {
      log(`✗ Failed: ${err.message}`)
    }
  })
}

document.getElementById('test-fetch').addEventListener('click', () => {
  fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then((res) => res.json())
    .then((data) => log(`Fetched data: ${JSON.stringify(data)}`))
    .catch((err) => log(`Fetch error: ${err.message}`))
})
