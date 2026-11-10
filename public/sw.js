const CACHE_NAME = 'netforge-shell-v1'
const scopeUrl = new URL('./', self.registration.scope).href
const indexUrl = new URL('index.html', scopeUrl).href
const manifestUrl = new URL('manifest.webmanifest', scopeUrl).href

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll([scopeUrl, indexUrl, manifestUrl]))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

async function cacheResponse(request, response) {
  if (!response || !response.ok) return response
  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response.clone())
  return response
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME)
          return (
            (await cache.match(request)) ||
            (await cache.match(indexUrl)) ||
            (await cache.match(scopeUrl)) ||
            Response.error()
          )
        }),
    )
    return
  }

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(() => cached)
      return cached || network
    }),
  )
})
