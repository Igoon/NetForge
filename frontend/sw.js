/* NET FORGE v0.40.28 — PWA offline app shell */
const CACHE_NAME='netforge-app-v0.40.28';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
 // Defer activation if an older app is running until player confirms update.
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('netforge-app-')&&key!==CACHE_NAME).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 // Update metadata and repair UI always use network, bypass PWA cache.
 if(url.pathname.endsWith('/version.json')||url.pathname.endsWith('/recovery.html'))return;
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE_NAME);
   const cached=await cache.match('./index.html');
   if(cached)return cached;
   try{return await fetch(event.request)}catch{return Response.error()}
  })());return;
 }
 event.respondWith((async()=>{
  const cached=await caches.match(event.request);
  if(cached)return cached;
  try{return await fetch(event.request)}catch{return Response.error()}
 })());
});
