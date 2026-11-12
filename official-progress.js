/* NET FORGE v0.32 — explicit official progress synchronization. Local mode never submits automatically. */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const settings=$('nf30Overlay .nf30-body'); if(!settings)return;
 const section=document.createElement('section');section.className='nf30-card';
 section.innerHTML=`<h3>🛡️ Progres Resmi (Server)</h3>
  <p class="nf30-help">LAB tetap offline. Nilai resmi hanya berasal dari verifikasi server. Token tidak disimpan dalam backup atau localStorage.</p>
  <label for="nf32Url">URL API resmi (HTTPS)</label><input id="nf32Url" type="url" placeholder="https://game.example.edu/api/v1" autocomplete="url"/>
  <label for="nf32Token">Token pemain (tersimpan hanya selama tab ini aktif)</label><input id="nf32Token" type="password" placeholder="nf_..." autocomplete="off"/>
  <div class="nf32-actions"><button type="button" class="nf30-btn" id="nf32Connect">🔐 Verifikasi akun</button>
  <button type="button" class="nf30-btn primary" id="nf32Submit">✅ Verifikasi Guided Lab</button>
  <button type="button" class="nf30-btn" id="nf32Progress">📈 Lihat progres resmi</button>
  <button type="button" class="nf30-btn" id="nf32Disconnect">Keluar</button></div>
  <pre id="nf32OfficialStatus" role="status" aria-live="polite">Belum terhubung. Gunakan mode LAB lokal tanpa server kapan pun.</pre>`;
 settings.appendChild(section);
 const status=$('nf32OfficialStatus'),url=$('nf32Url'),token=$('nf32Token');
 try{url.value=localStorage.getItem('netforge.server.url.v032')||'';}catch{}
 try{token.value=sessionStorage.getItem('netforge.server.token.v032')||'';}catch{}
 const show=v=>{status.textContent=typeof v==='string'?v:JSON.stringify(v,null,2)};
 function cfg(){let base=url.value.trim().replace(/\/+$/,'');if(!/^https:\/\//.test(base)&&!/^http:\/\/localhost(?::\d+)?\/api\/v1$/.test(base)&&!/^http:\/\/127\.0\.0\.1(?::\d+)?\/api\/v1$/.test(base))throw Error('Gunakan HTTPS atau localhost untuk development.');if(!base.endsWith('/api/v1'))throw Error('URL harus berakhir /api/v1');const t=token.value.trim();if(!/^nf_[0-9a-f]{64}$/.test(t))throw Error('Token pemain tidak valid');try{localStorage.setItem('netforge.server.url.v032',base);sessionStorage.setItem('netforge.server.token.v032',t);}catch{}return {base,t};}
 async function api(path,body){const {base,t}=cfg();const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),10000);
  try{const res=await fetch(base+path,{method:body?'POST':'GET',headers:{'Authorization':'Bearer '+t,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:ctrl.signal,cache:'no-store'});const data=await res.json();if(!res.ok)throw Error(data.error||'HTTP '+res.status);return data;}finally{clearTimeout(timeout)} }
 async function perform(action){try{show('Menghubungi server…');show(await action())}catch(e){show('Tidak dapat terhubung: '+e.message+'\nMode LAB lokal tetap tersedia.') }}
 $('nf32Connect').onclick=()=>perform(()=>api('/me'));
 $('nf32Progress').onclick=()=>perform(()=>api('/progress'));
 $('nf32Submit').onclick=()=>perform(async()=>{
  if(!window.NetForgeLab?.active()||window.NetForgeLab.mode()!=='guided')throw Error('Buka LAB → Guided Lab untuk mengirim bukti latihan.');
  const topology=JSON.parse(window.NetForgeLab.export());
  const buf=new Uint8Array(18);crypto.getRandomValues(buf);const id='guided_'+Array.from(buf,b=>b.toString(16).padStart(2,'0')).join('');
  const result=await api('/attempts',{attemptId:id,topology});
  return {message:result.passed?'Diverifikasi server · lulus':'Belum lulus verifikasi server',score:result.score,checks:result.checks,attemptId:result.attemptId,official:true};
 });
 $('nf32Disconnect').onclick=()=>{token.value='';try{sessionStorage.removeItem('netforge.server.token.v032')}catch{}show('Token sesi dihapus. LAB lokal tetap tersedia.')};
 window.NetForgeOfficial={getConnected:()=>Boolean(token.value.trim())};
})();
