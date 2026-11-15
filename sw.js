/* NET FORGE v0.40.51: explicit consent, safe cache lifecycle */
const CACHE = 'netforge-pwa-v0.40.51';
const ASSETS = ['./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./recovery.html'];
self.addEventListener('install', event => {
  // Stage shell before showing a ready-to-activate notification.
  // No skipWaiting here: user explicitly approves activation via message.
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('message', event => {
  if(event.data?.type === 'SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    await self.clients.claim();
    // Old caches are removed only after the new shell successfully precaches.
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('netforge-pwa-')&&key!==CACHE).map(key=>caches.delete(key)));
  })());
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  // Never serve release metadata or recovery UI from application cache.
  if(url.pathname.endsWith('/version.json')||url.pathname.endsWith('/recovery.html')){
    event.respondWith(fetch(req,{'cache': 'no-store'}).catch(()=>new Response('Offline: pemulihan memerlukan koneksi',{'status': 503})));
    return;
  }
  if(req.mode==='navigate'){
    event.respondWith(caches.open(CACHE).then(async cache=>{
      const shell=await cache.match('./index.html');
      return shell || fetch(req);
    }));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});
