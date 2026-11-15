/* NET FORGE v0.40.39 — explicit-consent update lifecycle */
const CACHE='netforge-pwa-v0.40.39';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./recovery.html'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));
  // Deliberately NO skipWaiting() here. The old version remains active until user approval.
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('activate', event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('netforge-pwa-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  // Always query the server for release metadata and repair page.
  if(url.pathname.endsWith('/version.json')||url.pathname.endsWith('/recovery.html'))return;
  if(request.mode==='navigate'){
    event.respondWith(caches.match('./index.html').then(cached=>cached||fetch(request)));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
