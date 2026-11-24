/* NET FORGE v0.61.0 — Offline-Safe Modular Cache & Network-First Auto-Update */
const RELEASE = '0.61.0';
const CACHE = 'netforge-pwa-v' + RELEASE;
const ASSETS = [
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './recovery.html',
  './version.json',
  './css/core-theme.css',
  './css/ui-polish-shell.css',
  './css/visual-fx.css',
  './css/mission-designer.css',
  './js/core-engine.js',
  './js/alive-fun.js',
  './js/ui-shell.js',
  './js/gameplay-expansion.js',
  './js/visual-fx.js',
  './js/mission-designer.js',
  './icons/iga-talk.svg',
  './icons/iga-celebrate.svg',
  './icons/iga-panic.svg',
  './icons/iga-think.svg',
  './icons/iga-fail.svg',
  './icons/badge-verified.svg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async url => {
      const res = await fetch(url, { cache: 'reload' });
      if (!res.ok) throw new Error('Gagal mengunduh ' + url + ' (HTTP ' + res.status + ')');
      await cache.put(url, res);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'GET_VERSION') {
    event.ports?.[0]?.postMessage({ version: RELEASE, cache: CACHE });
  } else if (event.data?.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
  }
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(key => key.startsWith('netforge-pwa-') && key !== CACHE).map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  // 1. Metadata & recovery endpoints always bypass cache
  if (
    url.pathname.endsWith('/version.json') ||
    url.pathname.endsWith('/recovery.html') ||
    url.pathname.endsWith('/sw.js')
  ) {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(() => new Response('Offline - internet required', { status: 503 }))
    );
    return;
  }

  // 2. Navigation (index.html): Network-First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await fetch(request, { cache: 'no-store' });
        if (fresh && fresh.ok) {
          cache.put('./index.html', fresh.clone());
          return fresh;
        }
      } catch (_) {}
      return (await cache.match('./index.html', { ignoreSearch: true })) || fetch(request);
    })());
    return;
  }

  // 3. Modular CSS & JS: Network-First so updates apply cleanly, with ignoreSearch offline fallback
  if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cleanUrl = url.origin + url.pathname;
      try {
        const fresh = await fetch(request, { cache: 'no-cache' });
        if (fresh && fresh.ok) {
          cache.put(cleanUrl, fresh.clone());
          return fresh;
        }
      } catch (_) {}
      return (await cache.match(request, { ignoreSearch: true })) || fetch(request);
    })());
    return;
  }

  // 4. Static icons & manifest: Cache-First with ignoreSearch
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(hit => hit || fetch(request))
  );
});
