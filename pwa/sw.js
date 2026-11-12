/* NET FORGE v0.34.1 static PWA; never cache credentials or official progress API. */
const VERSION='nf-static-v0.34.1';
const APP_FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const key of await caches.keys())if((key.startsWith('nf-static-')||key.startsWith('netforge-shell-'))&&key!==VERSION)await caches.delete(key);
  await self.clients.claim();
 })());
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 // Exclude any external requests (particularly authentication/official progress servers).
 if(url.origin!==self.location.origin)return;
 const scope=new URL(self.registration.scope);
 if(!url.pathname.startsWith(scope.pathname))return;
 // Only cache this known static application shell: no API responses, tokens, or user data.
 const isAppPath=url.pathname===scope.pathname||url.pathname===scope.pathname+'index.html';
 const isAsset=['manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'].some(path=>url.pathname===scope.pathname+path);
 if(!isAppPath&&!isAsset)return;
 event.respondWith((async()=>{
  const cache=await caches.open(VERSION);
  if(request.mode==='navigate'){
   // Keep the current release consistent during active gameplay; new SW version
   // is installed separately and activated only after a user chooses update.
   const cached=await cache.match('./index.html');
   if(cached)return cached;
   try{return await fetch(request)}catch{return Response.error()}
  }
  return (await cache.match(request))||(await fetch(request));
 })());
});
