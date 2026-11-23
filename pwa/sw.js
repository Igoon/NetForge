/* NET FORGE v0.56.00 — self-activating updates, cache-safe recovery */
const RELEASE='0.56.00';
const CACHE='netforge-pwa-v'+RELEASE;
const ASSETS=['./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./recovery.html','./version.json','./css/core-theme.css','./css/ui-polish-shell.css','./js/core-engine.js','./js/alive-fun.js','./js/ui-shell.js','./js/gameplay-expansion.js','./css/visual-fx.css','./js/visual-fx.js','./icons/iga-talk.svg','./icons/iga-celebrate.svg','./icons/iga-panic.svg','./icons/iga-think.svg','./icons/iga-fail.svg','./icons/badge-verified.svg'];
self.addEventListener('install',event=>{
 // v0.56.00: unduh aset dengan cache:'reload' (hindari HTTP cache yang bisa
 // menyajikan index.html lama saat install) lalu skipWaiting — SW baru aktif
 // begitu diunduh. Halaman lama TIDAK dimuat ulang otomatis: reload tetap
 // menunggu persetujuan pemain (guard nf4041.approved di halaman).
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.all(ASSETS.map(async url=>{
   const res=await fetch(url,{cache:'reload'});
   if(!res.ok)throw new Error('gagal mengunduh '+url+' (HTTP '+res.status+')');
   await cache.put(url,res);
  }));
  await self.skipWaiting();
 })());
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
   try{
    const fresh=await fetch(request,{cache:'no-store'});
    if(fresh&&fresh.ok){const cache=await caches.open(CACHE);cache.put('./index.html',fresh.clone());return fresh;}
   }catch{}
   const cache=await caches.open(CACHE);
   return (await cache.match('./index.html'))||fetch(request);
  })());
  return;
 }
 event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
});
