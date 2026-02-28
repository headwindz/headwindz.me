const CACHE = 'app-v1'
const ASSETS = ['./index.html', './app.js', './app.css']

// Install: pre-cache critical assets (pattern from "Installing" section)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching assets')
        return cache.addAll(ASSETS)
      })
      .then(() => {
        console.log('[SW] Skip waiting')
        self.skipWaiting()
      })
  )
})

// Activate: clean up old caches (pattern from "Activating" section)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
  )
  self.clients.claim()
})

// Fetch: cache-first strategy (pattern from "Cache first" section)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request).then((response) => {
        // Cache successful responses - clone BEFORE using the response
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE).then((cache) => cache.put(event.request, responseClone))
        }
        return response
      })
    })
  )
})
