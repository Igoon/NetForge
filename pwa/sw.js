/* NET FORGE v0.38.0 — Mission Adaptive Workspace; consent-gated cache-first shell. */
const VERSION='nf-static-v0.38.0';
const APP_FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(APP_FILES)));
 // No skipWaiting here: activation requires explicit consent via message.
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  for(const key of keys)if(key.startsWith('nf-static-')&&key!==VERSION)await caches.delete(key);
  await self.clients.claim();
 })());
});
self.addEventListener('message',event=>{
 if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url),base=new URL(self.registration.scope);
 if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
 // version.json is deliberately not intercepted: it reports LATEST server release.
 if(url.pathname===base.pathname+'version.json')return;
 const home=url.pathname===base.pathname||url.pathname===base.pathname+'index.html';
 const asset=['manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'].some(n=>url.pathname===base.pathname+n);
 if(!home&&!asset)return;
 event.respondWith((async()=>{
  const cache=await caches.open(VERSION);
  if(home){
   // Installed shell stays stable even when a newer index.html is deployed.
   const saved=await cache.match('./index.html');
   if(saved)return saved;
   try{const response=await fetch(req);if(response.ok){await cache.put('./index.html',response.clone());return response}}catch{}
   return Response.error();
  }
  return await cache.match(req)||fetch(req);
 })());
});
