/* NET FORGE v0.34.6 — cache-safe GitHub Pages PWA. */
const VERSION = 'nf-static-v0.34.6';
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(APP_FILES)));
  // Do not skipWaiting: ask players before activating a new worker.
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('nf-static-') && key !== VERSION) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  // No interception of external domains, auth or official-progress API.
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const home = url.pathname === scope.pathname || url.pathname === scope.pathname + 'index.html';
  const asset = ['manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'].some(name => url.pathname === scope.pathname + name);
  if (!home && !asset) return;
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    if (request.mode === 'navigate' || home) {
      // Prefer the deployed HTML when online, never hold players on an obsolete shell.
      try {
        const network = await fetch(request,{cache:'no-store'});
        if (network.ok) {
          await cache.put('./index.html', network.clone());
          return network;
        }
      } catch (_) {}
      return (await cache.match('./index.html')) || Response.error();
    }
    return (await cache.match(request)) || fetch(request);
  })());
});
