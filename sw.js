/* NET FORGE v0.40.56 — controlled updates, cache-safe recovery */
const RELEASE='0.40.56';
const CACHE='netforge-pwa-v'+RELEASE;
const ASSETS=['./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./recovery.html','./version.json'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
 // Explicit approval only. No skipWaiting in install.
});
self.addEventListener('message',event=>{
 if(event.data?.type==='GET_VERSION'){
  event.ports?.[0]?.postMessage({version:RELEASE,cache:CACHE});
 } else if(event.data?.type==='SKIP_WAITING'){
  event.waitUntil(self.skipWaiting());
 }
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('netforge-pwa-')&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/version.json')||url.pathname.endsWith('/recovery.html')||url.pathname.endsWith('/sw.js')){
  event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>new Response('Offline - internet required',{status:503})));
  return;
 }
 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   // Recovery-triggered navigation must avoid stale shell if still controlled.
   if(url.searchParams.has('recover')){
    try{return await fetch(request,{cache:'reload'})}catch{}
   }
   const cache=await caches.open(CACHE);
   return (await cache.match('./index.html'))||fetch(request);
  })());
  return;
 }
 event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
});
