/* === script:nf-release-metadata === */
/* Version source for public app UI; module and export schema versions remain independent. */
window.NETFORGE_RELEASE = Object.freeze({ version: "0.59.00", label: "v0.59.00", release: "Layout & Polish v0.59.00" });
;

/* === script:inline === */
(()=>{
const $=s=>document.querySelector(s), board=$('#board'), svg=$('#wires');
const nfGameplaySound=(type)=>window.dispatchEvent(new CustomEvent('netforge:gameplay-sound',{detail:{type}}));
const defs={router:{name:'Router',emoji:'📡',cost:180},switch:{name:'Switch',emoji:'🔀',cost:120},server:{name:'Server',emoji:'🗄️',cost:300},pc:{name:'Workstation',emoji:'🖥️',cost:100}};
const deviceArt=type=>{
const common=`<defs>
 <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d8f7ff"/><stop offset=".24" stop-color="#70b9e7"/><stop offset=".63" stop-color="#366397"/><stop offset="1" stop-color="#101f48"/></linearGradient>
 <linearGradient id="front" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#304b83"/><stop offset="1" stop-color="#09142f"/></linearGradient>
 <linearGradient id="glass" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#4bdaff"/><stop offset=".52" stop-color="#107cce"/><stop offset="1" stop-color="#092c7b"/></linearGradient>
 <linearGradient id="tower" x1="0" y1="0" x2="1" y2=".25"><stop stop-color="#738ed3"/><stop offset=".2" stop-color="#233965"/><stop offset="1" stop-color="#080f2a"/></linearGradient>
 <filter id="glow"><feGaussianBlur stdDeviation="2.3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
let shape='';
if(type==='router')shape=`<ellipse cx="80" cy="91" rx="65" ry="7" fill="#000b26" opacity=".52"/>
 <path d="M24 35 L141 35 L151 51 L36 51 Z" fill="url(#metal)" stroke="#a1e5ff" stroke-width="2"/>
 <path d="M36 51H151V78Q151 85 144 85H42Q36 85 36 78Z" fill="url(#front)" stroke="#79d9ff" stroke-width="2"/>
 <path d="M24 35 L36 51 V78 L23 65Z" fill="#152958" stroke="#50aff4" stroke-width="1.5"/>
 <path d="M46 51V24Q44 16 40 8" stroke="#92caff" stroke-width="5" stroke-linecap="round"/><path d="M134 51V24Q136 16 142 8" stroke="#92caff" stroke-width="5" stroke-linecap="round"/>
 <path d="M65 40Q91 17 117 40 M74 42Q91 28 108 42 M84 45Q91 39 98 45" stroke="#3ffbff" stroke-width="3" fill="none" filter="url(#glow)"/>
 ${[51,74,97,120].map(x=>`<rect x="${x}" y="61" width="17" height="12" rx="2" fill="#030b23" stroke="#65b8fa" stroke-width="1.5"/><rect x="${x+4}" y="61" width="9" height="3" fill="#31f5ae"/>`).join('')}
 <path d="M43 78H144" stroke="#3d86c8"/><circle cx="132" cy="78" r="2.5" fill="#3cfaaa" filter="url(#glow)"/>`;
else if(type==='switch')shape=`<ellipse cx="80" cy="88" rx="70" ry="8" fill="#000b26" opacity=".55"/>
 <path d="M13 39L131 39L151 52L29 52Z" fill="url(#metal)" stroke="#a4ebff" stroke-width="2"/>
 <path d="M29 52H151V82H29Z" fill="url(#front)" stroke="#64caff" stroke-width="2"/>
 <path d="M13 39L29 52V82L13 68Z" fill="#163359" stroke="#65aefd" stroke-width="1.3"/>
 ${Array.from({length:8},(_,i)=>{let x=39+i*13;return `<rect x="${x}" y="59" width="10" height="14" rx="1.5" fill="#030b24" stroke="#91cff9"/><path d="M${x+2} 60h6" stroke="#40f9ad" stroke-width="2"/>`}).join('')}
 <path d="M33 79H147" stroke="#398fdb"/><circle cx="141" cy="45" r="2.8" fill="#56ffbc" filter="url(#glow)"/>`;
else if(type==='pc')shape=`<ellipse cx="82" cy="92" rx="70" ry="6" fill="#000b26" opacity=".55"/>
 <path d="M17 13L92 7L99 66L21 72Z" fill="url(#tower)" stroke="#c9edff" stroke-width="2"/>
 <path d="M24 19L87 15L92 59L27 63Z" fill="url(#glass)" stroke="#3bdeff" stroke-width="2"/>
 <path d="M48 27L61 24V37L48 39Z M65 23L78 20V35L65 37Z M48 42L61 40V53L48 55Z M65 39L78 37V50L65 52Z" fill="#c6fbff" opacity=".95"/>
 <path d="M53 69L65 68L64 77L55 78Z" fill="url(#metal)"/><path d="M42 79L78 77L86 83L35 86Z" fill="#6c9fd0" stroke="#a7ddff"/>
 <path d="M110 31L147 34V78L108 75Z" fill="url(#tower)" stroke="#94cdff" stroke-width="2"/><path d="M116 43L139 45" stroke="#3bd9ff" stroke-width="3"/><circle cx="132" cy="68" r="3" fill="#58ff9d" filter="url(#glow)"/>
 <path d="M74 85L113 85L127 91L85 91Z" fill="#456b9f" stroke="#a8d8ff"/>`;
else shape=`<ellipse cx="80" cy="92" rx="55" ry="7" fill="#000b26" opacity=".55"/>
 <path d="M35 9L104 9L119 20L50 20Z" fill="url(#metal)" stroke="#a4dfff"/><path d="M50 20H119V84H50Z" fill="url(#tower)" stroke="#73bdff" stroke-width="2"/>
 <path d="M35 9L50 20V84L35 73Z" fill="#253a69" stroke="#75b8ee"/>
 ${[28,40,52,64].map(y=>`<rect x="57" y="${y}" width="52" height="8" rx="2" fill="#071630" stroke="#4a729f"/><path d="M62 ${y+4}h24" stroke="#327bc0" stroke-width="2"/><circle cx="102" cy="${y+4}" r="2" fill="#35ff91" filter="url(#glow)"/>`).join('')}`;
return `<svg class="device-art art-${type}" viewBox="0 0 166 100" aria-label="Ilustrasi ${type}" role="img">${common}${shape}</svg>`;
};
// Relocate existing functional controls into the v0.17 command dock without duplicating IDs.
const relocate=(selector,target)=>{const el=$(selector),box=$(target);if(el&&box)box.appendChild(el)};
relocate('.iga','#igaDockPortrait');relocate('.iga-bubble','#igaDockTalk');relocate('.ping-panel','#terminalDockContent');relocate('#log','#activityDockContent');relocate('#eventArea','#eventRightContent');
const inspectorBtn=$('#inspectorConfigBtn');if(inspectorBtn)inspectorBtn.addEventListener('click',()=>{const n=nodes.find(x=>x.id===selected);if(n)openDeviceConfig(n)});
function macAddress(n){const hex=(Number(n.id)*2654435761>>>0).toString(16).padStart(8,'0').toUpperCase();return '02:4E:46:'+hex.slice(0,2)+':'+hex.slice(2,4)+':'+hex.slice(4,6)}
function switchMacRows(n){return links.filter(l=>!l.broken&&(l.a===n.id||l.b===n.id)).map(l=>{const other=nodes.find(x=>x.id===(l.a===n.id?l.b:l.a));return {port:l.a===n.id?l.portA:l.portB,mac:other?macAddress(other):'—',device:other?((other.config&&other.config.name)||defs[other.type].name+' #'+other.id):'Unknown'}})}
function updateInspector(){const box=$('#deviceInspector');if(!box)return;const n=nodes.find(x=>x.id===selected);if(!n){box.className='inspector-empty';box.textContent='Pilih perangkat pada workspace untuk melihat detail konfigurasi.';if(inspectorBtn)inspectorBtn.disabled=true;return}const c=n.config||{},connected=links.filter(l=>l.a===n.id||l.b===n.id);let layer='';if(n.type==='switch'){const rows=switchMacRows(n);layer='<div class="layer2-block"><div class="layer2-title">SWITCH MAC ADDRESS TABLE · '+rows.length+' ENTRIES</div><table class="layer2-table"><thead><tr><th>PORT</th><th>MAC ADDRESS</th><th>DEVICE</th></tr></thead><tbody>'+(rows.map(r=>'<tr><td>'+r.port+'</td><td class="mac-pill">'+r.mac+'</td><td>'+r.device+'</td></tr>').join('')||'<tr><td colspan="3">Belum ada MAC yang dipelajari.</td></tr>')+'</tbody></table></div>'}else{const rows=[...arpCache.entries()].filter(([ip,v])=>v.seenBy===n.id);layer='<div class="layer2-block"><div class="layer2-title">ARP CACHE · '+rows.length+' ENTRIES</div><table class="layer2-table"><thead><tr><th>IP ADDRESS</th><th>MAC ADDRESS</th><th>STATE</th></tr></thead><tbody>'+(rows.map(([ip,v])=>'<tr><td>'+ip+'</td><td class="mac-pill">'+v.mac+'</td><td>'+v.state+'</td></tr>').join('')||'<tr><td colspan="3">Belum ada entri. Jalankan PING untuk mempelajari ARP.</td></tr>')+'</tbody></table></div>'}box.className='inspector-data';box.innerHTML='<b>'+defs[n.type].name+' #'+n.id+'</b><br>IP: '+(c.ip||'Belum dikonfigurasi')+(c.prefix?'/'+c.prefix:'')+'<br>Gateway: '+(c.gateway||'—')+'<br>DNS: '+(c.dns||'—')+'<br>MAC: <span class="mac-pill">'+macAddress(n)+'</span><br>Port aktif: '+connected.length+' · Status: '+(powerOut?'OFFLINE':n.broken?'FAULT':'ONLINE')+layer;if(inspectorBtn)inspectorBtn.disabled=false}
function showPortDetails(n,port){const link=links.find(l=>(l.a===n.id&&l.portA===port)||(l.b===n.id&&l.portB===port));let peer=null,peerPort='—';if(link){peer=nodes.find(x=>x.id===(link.a===n.id?link.b:link.a));peerPort=link.a===n.id?link.portB:link.portA}const state=!link?'EMPTY':(link.broken||powerOut||n.broken||(peer&&peer.broken))?'LINK DOWN':'CONNECTED';const fields=[['Perangkat',defs[n.type].name+' #'+n.id],['Interface',port],['Status',state],['Kecepatan simulasi',link?'1 Gbps (virtual)':'—'],['Terhubung ke',peer?defs[peer.type].name+' #'+peer.id:'Tidak ada'],['Port tujuan',peer?peerPort:'—'],['MAC lokal',macAddress(n)],['MAC tetangga',peer?macAddress(peer):'—'],['Kabel',link?(link.broken?'Rusak':'UTP virtual'):'—']];$('#portModalTitle').textContent=defs[n.type].name+' · '+port;$('#portModalBody').innerHTML=fields.map(([k,v])=>'<span>'+k+'</span><b>'+v+'</b>').join('');$('#portModal').classList.add('open')}
$('#portModalClose').onclick=()=>$('#portModal').classList.remove('open');$('#portModal').addEventListener('click',e=>{if(e.target.id==='portModal')$('#portModal').classList.remove('open')});
let pendingPort=null;let lastPing=null;const arpCache=new Map();let editingNodeId=null;let diff='easy',budget=1000,xp=0,hostInstalled=false,guests=[],nodes=[],links=[],nextId=1,selected=null,connectMode=false,won=false,incident=null,powerOut=false,upsInstalled=false,cableProtected=false,acInstalled=false,temp=24,mission=1,mission1Complete=false,contractNo=1,missionConfig=null;try{xp=Math.max(0,Math.min(999999,Number(localStorage.getItem('netforge.local.xp.v1'))||0))}catch{}
window.netforgePowerOnline=()=>!powerOut; const settings={easy:{budget:1000,event:0.12,label:'EASY'},normal:{budget:750,event:0.28,label:'NORMAL'},hard:{budget:600,event:0.45,label:'HARDCORE'}};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const campaign=[
 {id:1,title:'Hello, Network!',brief:'Satu workstation baru harus terhubung langsung ke router. Bangun koneksi dan konfigurasi IP statis.',pcs:1,sw:0,server:0,budget:430,topology:'direct',type:'static'},
 {id:2,title:'Two Friends, One Network',brief:'Dua workstation berbagi satu switch sebelum terhubung ke router. Pastikan keduanya berada di subnet yang sama.',pcs:2,sw:1,server:0,budget:680,topology:'switch',type:'static'},
 {id:3,title:'Growing Office',brief:'Tiga workstation harus saling berkomunikasi. Hindari alamat IP duplikat dan pastikan semua perangkat satu subnet.',pcs:3,sw:1,server:0,budget:800,topology:'switch',type:'static'},
 {id:4,title:'DHCP Trouble',brief:'Konfigurasikan DHCP server pada router. Workstation harus memperoleh alamat IP otomatis dari pool yang benar.',pcs:3,sw:1,server:0,budget:850,topology:'switch',type:'dhcp'},
 {id:5,title:'Where Is the Internet?',brief:'Bangun jaringan kantor kecil dengan server DNS. Atur gateway dan DNS klien, lalu buktikan konektivitas.',pcs:3,sw:1,server:1,budget:1250,topology:'switch',type:'dns'},
 {id:6,title:'VLAN Separation',brief:'Kantor ingin memisahkan jaringan Admin dan Staff. Gunakan VLAN 10 untuk Admin dan VLAN 20 untuk Staff, lalu tandai port switch sebagai trunk.',pcs:4,sw:1,server:0,budget:1450,topology:'switch',type:'vlan'}
];
function generateContract(stage=1){
 const m=campaign[Math.max(0,Math.min(campaign.length-1,stage-1))];
 return {...m,seed:Math.random().toString(36).slice(2,8).toUpperCase(),modifier:{name:'Learning Contract',desc:'Parameter perangkat disesuaikan dengan tujuan pembelajaran.'},requiredCost:m.budget-120,budget:m.budget};
}
function showContract(){if(!missionConfig)return;$('#missionMeta').textContent='Contract seed: '+missionConfig.seed+' · Replay '+contractNo+' · '+missionConfig.modifier.name+' — '+missionConfig.modifier.desc;$('#missionTitle').textContent=missionConfig.title;$('#missionDesc').textContent=missionConfig.brief+' Parameter kontrak ini dibuat secara dinamis.';}
const log=(s)=>{let d=document.createElement('div');d.textContent=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})+' · '+s;$('#log').prepend(d)};
const IGA_ASSETS={talk:'./icons/iga-talk.svg',success:'./icons/iga-talk.svg',confused:'./icons/iga-think.svg',fail:'./icons/iga-fail.svg',panic:'./icons/iga-panic.svg',think:'./icons/iga-think.svg',celebrate:'./icons/iga-celebrate.svg'};
function say(s,mood='talk'){if(mood==='panic'||mood==='confused'||mood==='fail')nfGameplaySound('iga-alert');const bubble=$('#igaTalk'),avatar=$('#igaAvatar'),label=$('#igaMood');if(bubble){bubble.textContent=s;try{bubble.scrollTop=0}catch(_e){}try{if(window.netforgeUnclipTop)window.netforgeUnclipTop(bubble)}catch(_e){}}/* v0.40.92: selain reset scrollTop gelembung sendiri, kembalikan juga gelembung ke dalam pandangan bila wadah induknya (.right / .panelbody) ter-scroll - pemotongan baris pertama + header "IGA - DIAGNOSTIK & PROGRES" di audit live berasal dari scroll wadah induk, bukan dari scroll gelembung (terbukti: gelembung sempat utuh setelah hard reload = scrollTop wadah 0; header panel yang sama juga terpotong padahal itu bukan gelembung). *//* v0.40.92: reset scrollTop — gelembung memakai overflow-y:auto + max-height; bila isinya pernah di-scroll, scrollTop menempel sehingga pesan berikutnya tampil tergeser ke bawah dan baris pertamanya terpotong di tepi atas kotak (gejala audit v0.40.84/85). */const faces={talk:'talk',success:'success',confused:'confused',fail:'fail',panic:'panic',think:'think',celebrate:'celebrate'};const labels={talk:'SEDANG MENJELASKAN',success:'BERHASIL',confused:'SEDANG BINGUNG',fail:'ADA KESALAHAN',panic:'KONDISI DARURAT',think:'SEDANG MENGANALISIS',celebrate:'MISI SELESAI'};if(avatar){avatar.dataset.expression=faces[mood]||faces.talk;const portrait=avatar.querySelector('.iga-portrait');if(portrait)portrait.src=IGA_ASSETS[faces[mood]||'talk'];avatar.className='avatar mood-'+mood+' react';clearTimeout(say.timer);say.timer=setTimeout(()=>avatar.classList.remove('react'),650)}if(label)label.textContent=labels[mood]||labels.talk}
window.netforgeIgaSay=say;
/* v0.40.92: geser scrollTop ancestor seminimal mungkin hanya bila tepi atas elemen terpotong oleh wadah scroll induknya. Hanya memperbaiki pemotongan ATAS (bukan menarik elemen yang di bawah lipatan); tidak menyentuh body/html (scroll halaman milik pengguna); no-op di jsdom (rect 0) dan bila elemen sudah terlihat penuh. */
window.netforgeUnclipTop=function(el){try{
 if(!el||!el.getBoundingClientRect)return;
 var p=el.parentElement;
 while(p){
  if(p===document.body||p===document.documentElement){p=p.parentElement;continue;}
  var scrollable=false;
  try{var cs=window.getComputedStyle(p);var oy=String((cs&&(cs.overflowY||''))||'');scrollable=(oy==='auto'||oy==='scroll');}catch(_e){}
  if(!scrollable){try{scrollable=p.scrollHeight>p.clientHeight;}catch(_e){}}
  if(scrollable){
   var r=el.getBoundingClientRect();if(!r.height)break;
   var pr=p.getBoundingClientRect();if(!pr.height){p=p.parentElement;continue;}
   if(r.top<pr.top+1){p.scrollTop-=(pr.top-r.top);}
  }
  p=p.parentElement;
 }
}catch(_e){}};
function toast(s){let t=$('#toast');t.textContent=s;t.classList.add('show');clearTimeout(toast.timer);/* v0.40.92: durasi tampil sebanding panjang pesan (min 2600 ms, +40 ms/karakter, maks 9000 ms) — sebelumnya tetap 2600 ms sehingga pesan panjang (mis. penolakan repair Chaos, ~165 karakter) hilang sebelum sempat dibaca (audit live v0.40.89 butir 5). Isi pesan tidak dipersingkat. */const _ms=Math.min(9000,2600+Math.max(0,String(s||'').length)*40);toast.timer=setTimeout(()=>t.classList.remove('show'),_ms)}
function updateStats(){try{updateVirtualLab()}catch{}const _budgetEl=$('#budget'),_budgetLabel=document.querySelector('.budget-stat small');const _realBudget=(document.body.classList.contains('nf400-mixed')&&typeof budgetNow==='function')?budgetNow():budget;if(window.NetForgeLab?.active?.()){/* v0.40.92: Lab memakai budget unified (budgetNow) saat mode mixed — sebelumnya Free Lab menampilkan budget klasik $1.000.000 padahal pembelian menagih budget misi; saat bukan mixed, Lab klasik memang memakai budget klasik. */const _labBudget=document.body.classList.contains('nf400-mixed')?_realBudget:budget;_budgetEl.textContent='$'+_labBudget.toLocaleString('en-US');if(_budgetLabel)_budgetLabel.textContent='BUDGET LAB';}else if(document.body.classList.contains('nf400-mixed')){_budgetEl.textContent='$'+_realBudget.toLocaleString('en-US');if(_budgetLabel)_budgetLabel.textContent='BUDGET CANVAS';if(typeof updateBudgetUI==='function')updateBudgetUI();}else{_budgetEl.textContent='$'+budget.toLocaleString('en-US');if(_budgetLabel)_budgetLabel.textContent='BUDGET MISI';}/* v0.40.92: dana darurat — mekaniknya jalan (budget boleh minus sampai -$50 untuk kabel/perbaikan Chaos) tapi tidak pernah terlihat; hanya ada di pesan sementara. Tampilkan persisten di stat budget saat minus (tooltip + border kuning). */try{const _bs=document.querySelector('.budget-stat');if(_bs){if(_realBudget<0){_bs.title='Dana darurat aktif: budget minus $'+Math.abs(_realBudget).toLocaleString('en-US')+' (batas −$50). Kabel ($10) dan perbaikan Chaos ($25) boleh memakai dana darurat; pembelian perangkat butuh budget cukup. Jual perangkat untuk memulihkan budget.';_bs.style.borderColor='#e8a13c'}else{_bs.title='Dana darurat: budget boleh minus sampai −$50 untuk kabel ($10) dan perbaikan Chaos ($25). Pembelian perangkat butuh budget cukup.';_bs.style.borderColor=''}} }catch{}try{xp=Math.max(0,Math.min(999999,Number(localStorage.getItem('netforge.local.xp.v1'))||0))}catch{}$('#xp').textContent=xp+' XP';const level=$('.level-stat strong');if(level)level.textContent='Lv. '+(Math.floor(xp/100)+1);$('#difficultyLabel').textContent=settings[diff].label;$('#upgradeStatus').textContent=[upsInstalled?'🔋 UPS':'',cableProtected?'🛡️ Cable protector':'',acInstalled?'❄️ Server AC':''].filter(Boolean).join(' · ')||'Belum ada upgrade terpasang.';updateClimate()}
// v0.59.00: updateStats dipakai lintas-skrip lewat guard typeof
// updateStats==='function', tapi ia lokal di IIFE klasik sehingga guard itu
// selalu gagal. Ekspos ke window agar label budget diperbarui.
window.updateStats=updateStats;
function updateClimate(){let t=$('#tempValue'),bar=$('#tempBar'),state=$('#climateState');if(!t)return;t.textContent=temp+'°C';bar.style.width=Math.min(100,Math.max(5,(temp-15)*3.2))+'%';bar.style.background=temp>=38?'#ff6f78':temp>=32?'#ffbf5e':'#53d69a';state.textContent=temp>=38?'CRITICAL · Server overheating':temp>=32?'WARNING · Cooling recommended':acInstalled?'AC active · Stable':'Conditions '+(temp<29?'optimal':'warming')}

function updateVirtualLab(){let used=guests.reduce((n,g)=>n+g.ram,0);let list=$('#virtualList');if(!list)return;list.innerHTML=guests.length?guests.map(g=>`<div style="padding:4px 0;border-bottom:1px solid #2a3b54">${g.icon} ${g.name} <span style="float:right">${g.ram} GB</span></div>`).join(''):'Belum ada guest system.';$('#hostState').textContent=hostInstalled?'Running · Proxmox VE':'Powered off';$('#ramBar').style.width=(used/32*100)+'%';$('#resourceText').textContent=`RAM terpakai: ${used} / 32 GB · ${guests.length} guest`;['vmBtn','lxcBtn','dockerBtn'].forEach(id=>$('#'+id).disabled=!hostInstalled);renderVirtualMap()}
function deployGuest(kind){if(!hostInstalled){toast('Install Proxmox Host terlebih dahulu.');return}let cfg={vm:{name:'Virtual Machine',ram:8,cost:100,icon:'🖥️'},lxc:{name:'LXC Container',ram:2,cost:45,icon:'📦'},docker:{name:'Docker Container',ram:1,cost:25,icon:'🐳'}}[kind];let used=guests.reduce((n,g)=>n+g.ram,0);if(used+cfg.ram>32){toast('RAM host tidak cukup!');say('Kita kehabisan RAM. Hentikan atau optimalkan guest yang berjalan.');return}if(budget<cfg.cost){toast('Budget tidak cukup.');return}budget-=cfg.cost;guests.push({...cfg,id:guests.length+1,name:cfg.name+' #'+(guests.length+1)});updateStats();log(cfg.name+' berhasil dibuat. RAM +'+cfg.ram+' GB.');say(kind==='vm'?'Satu VM lagi siap dijalankan. Perhatikan alokasi RAM!':kind==='lxc'?'LXC siap! Lebih ringan daripada VM untuk banyak workload.':'Container Docker berhasil dideploy. Jangan lupa memantau resource.');toast(cfg.name+' deployed!')}
function renderVirtualMap(){board.querySelectorAll('.infra-rack,.rack-cable').forEach(el=>el.remove());if(!hostInstalled)return;let rack=document.createElement('div');rack.className='infra-rack';rack.innerHTML=`<div class="rackicon">🗄️</div><b>PROXMOX HOST · PVE</b><small>8 vCPU · 32 GB RAM · 500 GB</small><div class="guest-grid">${guests.map(g=>`<span class="guest-chip ${g.name.includes('Virtual')?'vm':g.name.includes('Docker')?'docker':''}">${g.icon} ${g.name.replace(/ #\d+/, '')} ${g.id}</span>`).join('')||'<span class="guest-chip">No guest deployed</span>'}</div><small style="display:block;margin-top:6px;color:#53d69a">● HOST RUNNING</small>`;board.appendChild(rack);let cable=document.createElement('div');cable.className='rack-cable';board.appendChild(cable)}
// v0.59.00 — bounded, local in-memory topology history (not official LAB scores).
const nf364Undo=[],nf364Redo=[];
function nf364Snapshot(){return JSON.stringify({nodes,links,nextId,budget,selected,hostInstalled,guests,upsInstalled,cableProtected,acInstalled});}
function nf364Notify(){window.dispatchEvent(new CustomEvent('netforge:history-state',{detail:{undo:nf364Undo.length,redo:nf364Redo.length}}));}
function nf364Checkpoint(){if(window.__nf364Restoring)return;nf364Undo.push(nf364Snapshot());if(nf364Undo.length>40)nf364Undo.shift();nf364Redo.length=0;nf364Notify();}
function nf364Restore(raw){try{const x=JSON.parse(raw);if(!Array.isArray(x.nodes)||!Array.isArray(x.links))return false;window.__nf364Restoring=true;nodes=x.nodes;links=x.links;nextId=x.nextId;budget=x.budget;selected=x.selected;hostInstalled=!!x.hostInstalled;guests=x.guests||[];upsInstalled=!!x.upsInstalled;cableProtected=!!x.cableProtected;acInstalled=!!x.acInstalled;pendingPort=null;lastPing=null;arpCache.clear();render();updateStats();updateObjectives();return true;}catch(e){console.warn('History restore:',e);return false}finally{window.__nf364Restoring=false}}
function nf364Travel(kind){const src=kind==='undo'?nf364Undo:nf364Redo,dst=kind==='undo'?nf364Redo:nf364Undo;if(!src.length){toast(kind==='undo'?'Tidak ada tindakan yang bisa dibatalkan.':'Tidak ada tindakan untuk diulangi.');return}const now=nf364Snapshot(),prior=src.pop();dst.push(now);if(!nf364Restore(prior)){dst.pop();src.push(prior);return}nf364Notify();log(kind==='undo'?'Perubahan topologi dibatalkan.':'Perubahan topologi diulangi.');toast(kind==='undo'?'↶ Undo berhasil':'↷ Redo berhasil');}
window.NetForgeWorkspaceHistory={undo:()=>nf364Travel('undo'),redo:()=>nf364Travel('redo'),state:()=>({undo:nf364Undo.length,redo:nf364Redo.length})};

function addNode(type,x,y){let d=defs[type];if(budget<d.cost){toast('Budget tidak cukup!');say('Waduh, dana proyek kita terbatas. Pilih perangkat dengan bijak.');return}nf364Checkpoint();budget-=d.cost;let n={id:nextId++,type,x,y,broken:false};nodes.push(n);nfGameplaySound('device');render();updateStats();log(d.name+' ditambahkan ke workspace.');say(d.name+' siap dipasang. Jangan lupa hubungkan kabelnya!')}
function openDeviceConfig(n){
 editingNodeId=n.id;
 const d=defs[n.type],c=n.config||{};
 $('#deviceConfigTitle').textContent=d.name+' · '+(n.type==='pc'?'Workstation #'+n.id:d.name+' #'+n.id);
 $('#cfgName').value=c.name||((n.type==='pc'?'pc':n.type)+n.id);
 $('#cfgIP').value=c.ip||'';
 $('#cfgPrefix').value=c.prefix||'24';
 const _rg=n.type==='router'?null:nodes.find(x=>x.type==='router');const _rip=_rg&&_rg.config&&_rg.config.ip;$('#cfgGateway').value=c.gateway||(n.type==='router'?((c.ip&&c.ip!=='DHCP'&&c.ip.split('.').length===4)?c.ip:'192.168.10.1'):((_rip&&_rip!=='DHCP'&&_rip.split('.').length===4)?_rip:'192.168.10.1'));/* v0.40.92: gateway Router diisi IP-nya sendiri sebagai nilai. */
 $('#cfgDNS').value=c.dns||'';
 $('#cfgMode').value=c.mode||'static';
 $('#cfgVLAN').value=c.vlan||'';
 $('#cfgInterface').value=c.iface||(n.type==='router'?'wan0':n.type==='switch'?'access':'eth0');
 $('#cfgDHCP').value=c.dhcp?'on':'off';$('#cfgPoolStart').value=c.poolStart||'192.168.10.100';$('#cfgPoolEnd').value=c.poolEnd||'192.168.10.150';
 ['dhcpToggleField','dhcpStartField','dhcpEndField'].forEach(id=>$('#'+id).style.display=n.type==='router'?'block':'none');
 $('#cfgFeedback').textContent='Isi parameter yang diperlukan, lalu pilih Simpan konfigurasi.';
 $('#deviceConfigModal').classList.add('open');say('Yuk, periksa pengaturan perangkat ini. Pastikan alamat IP dan gateway sesuai.', 'think');
}
function closeDeviceConfig(){$('#deviceConfigModal').classList.remove('open');editingNodeId=null}
function saveDeviceConfig(){
 const n=nodes.find(x=>x.id===editingNodeId);if(!n)return;
 const mode=$('#cfgMode').value,ip=$('#cfgIP').value.trim(),prefix=$('#cfgPrefix').value.trim();
 if(mode==='static'&&ip&&!ipv4Parts(ip)){ $('#cfgFeedback').textContent='Alamat IP tidak valid. Contoh: 192.168.10.20.';say('Sepertinya format alamat IP belum benar. Coba periksa lagi.', 'confused');return}
 if(prefix&&(!/^\d{1,2}$/.test(prefix)||Number(prefix)>32)){ $('#cfgFeedback').textContent='Awalan subnet harus berupa angka 0 sampai 32.';say('Awalan subnet harus berupa angka 0 sampai 32, ya.', 'confused');return}
 const vlan=$('#cfgVLAN').value.trim();
 if(vlan&&(Number(vlan)<1||Number(vlan)>4094)){ $('#cfgFeedback').textContent='ID VLAN harus berada di antara 1–4094.';say('ID VLAN di luar rentang yang diperbolehkan.', 'confused');return}
 const dhcp=$('#cfgDHCP').value==='on',poolStart=$('#cfgPoolStart').value.trim(),poolEnd=$('#cfgPoolEnd').value.trim();
 if(n.type==='router'&&dhcp&&(!ipv4Parts(poolStart)||!ipv4Parts(poolEnd))){$('#cfgFeedback').textContent='Rentang DHCP harus menggunakan alamat IPv4 yang valid.';say('Rentang IP DHCP belum valid. Periksa alamat awal dan akhirnya.', 'confused');return}
 nf364Checkpoint();n.config={name:$('#cfgName').value.trim(),ip:mode==='dhcp'?'DHCP':ip,prefix,gateway:$('#cfgGateway').value.trim(),dns:$('#cfgDNS').value.trim(),mode,vlan,iface:$('#cfgInterface').value.trim(),dhcp,poolStart,poolEnd};
 if(mode==='dhcp'&&n.type!=='router'&&n.type!=='switch'&&dhcp){const router=nodes.find(x=>x.type==='router');if(router&&router.config&&router.config.dhcp){/* v0.40.92: alokasi DHCP klasik kini unik — sebelumnya hanya menghitung node 'pc' (laptop/server tidak dihitung dan tidak diberi IP) dan memakai hitungan urutan simpan, sehingga hapus + tambah ulang bisa memberi alamat yang sudah dipakai klien lain. Kini: alamat bebas pertama mulai .101 yang belum dipakai node lain/router. */const _used=new Set(nodes.filter(x=>x!==n&&x.config&&x.config.ip).map(x=>x.config.ip));_used.add(router.config.ip);let _pick='';for(let _o=101;_o<=254;_o++){const _c='192.168.10.'+_o;if(!_used.has(_c)){_pick=_c;break}}if(_pick){n.config.ip=_pick;n.config.prefix='24';n.config.gateway=router.config.ip;n.config.dns=router.config.dns||'1.1.1.1'}}}
 if(n.type==='switch'&&String(n.config.iface).toLowerCase()==='trunk'&&String(n.config.vlan).includes(',')){say('Mode trunk disimpan. Pastikan VLAN yang diizinkan sudah benar.', 'success')}
 nfGameplaySound('config');log('Konfigurasi '+(n.config.name||defs[n.type].name)+' disimpan'+(n.config.ip?' · '+n.config.ip+'/'+n.config.prefix:'')+'.');
 closeDeviceConfig();render();toast('KONFIGURASI PERANGKAT TERSIMPAN');say('Sip! Pengaturan perangkat sudah disimpan.', 'success');
}
$('#cfgSave').onclick=saveDeviceConfig;$('#cfgCancel').onclick=closeDeviceConfig;
$('#deviceConfigModal').addEventListener('click',e=>{if(e.target.id==='deviceConfigModal')closeDeviceConfig()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDeviceConfig()});
function render(){board.querySelectorAll('.node').forEach(e=>e.remove());nodes.forEach(n=>{let el=document.createElement('div');el.className='node node-'+n.type+(selected===n.id?' selected':'')+(n.broken?' broken':'')+(powerOut?' offline':' online');el.dataset.id=n.id;el.style.left=n.x+'%';el.style.top=n.y+'%';el.innerHTML=`<span class="node-light"></span><span class="nemoji">${deviceArt(n.type)}</span><b>${defs[n.type].name} ${n.type==='pc'?'#'+n.id:''}</b><small>${n.broken?'LINK FAULT':(n.config&&n.config.ip?n.config.ip+(n.config.mode==='dhcp'?'':'/'+(n.config.prefix||24)):'NOT CONFIGURED')}</small><div class="port-bank">${portNames(n).map(port=>`<button type="button" class="port-jack ${isPortUsed(n.id,port)?'used':''} ${pendingPort&&pendingPort.nodeId===n.id&&pendingPort.port===port?'pending':''}" data-port="${port}" title="${port}">${port}</button>`).join('')}</div><span class="cfg-hint">DOUBLE-CLICK · CONFIG</span><span class="status">${n.broken?'!':(powerOut?'OFF':'●')}</span>`;el.addEventListener('dblclick',e=>{e.stopPropagation();openDeviceConfig(n)});el.addEventListener('pointerdown',e=>{if(e.target.closest('.port-jack')){e.stopPropagation();return}startDrag(e,n,el)});el.addEventListener('click',e=>{if(e.target.closest('.port-jack')){e.stopPropagation();choosePort(n,e.target.dataset.port);return}e.stopPropagation();nodeClick(n)});board.appendChild(el)});drawLinks();renderVirtualMap();populatePingSelects();updateObjectives();updateInspector();nf24UpdateHud()}
function portNames(n){if(n.type==='switch')return Array.from({length:8},(_,i)=>'LAN'+(i+1));if(n.type==='router')return ['LAN1','LAN2','WAN'];if(n.type==='server')return ['ETH0','ETH1'];return ['ETH0'];}
function isPortUsed(nodeId,port){return links.some(l=>(l.a===nodeId&&l.portA===port)||(l.b===nodeId&&l.portB===port));}
function choosePort(n,port){if(!connectMode){selected=n.id;render();showPortDetails(n,port);return}if(isPortUsed(n.id,port)){toast(port+' sudah digunakan.');return}if(!pendingPort){pendingPort={nodeId:n.id,port};selected=n.id;render();toast('Port '+port+' dipilih. Pilih port perangkat tujuan.');return}if(pendingPort.nodeId===n.id){pendingPort={nodeId:n.id,port};render();toast('Port sumber diganti ke '+port+'.');return}const a=nodes.find(x=>x.id===pendingPort.nodeId);if(!a||!validLink(a.type,n.type)){toast('Kombinasi perangkat tidak valid untuk topologi ini.');return}if(links.some(l=>(l.a===a.id&&l.b===n.id)||(l.a===n.id&&l.b===a.id))){toast('Perangkat sudah terhubung.');return}nf364Checkpoint();const portA=pendingPort.port,portB=port;links.push({a:a.id,b:n.id,portA,portB,broken:false});nfGameplaySound('cable');log('Kabel '+portA+' ('+defs[a.type].name+') ↔ '+portB+' ('+defs[n.type].name+') tersambung.');pendingPort=null;selected=null;render();say('Port tersambung! Link aktif. Sekarang uji koneksi dengan PING.','success');}
function nf4073PopulatePingSelectsUnified(src,dst){
 const s=window.NetForgeUniversalInventory?.getState?.()||{nodes:[]};
 const ns=s.nodes||[];
 const oldS=src.value,oldD=dst.value;
 const label=n=>(n.name||n.type)+' #'+n.id+' · '+(n.ip||'DHCP');
 src.innerHTML='<option value="">Pilih workstation</option>'+ns.filter(n=>n.type==='pc'||n.type==='laptop').map(n=>`<option value="${n.id}">${label(n)}</option>`).join('');
 dst.innerHTML='<option value="router">Router / Gateway</option>'+ns.filter(n=>n.type==='pc'||n.type==='laptop'||n.type==='server').map(n=>`<option value="${n.id}">${label(n)}</option>`).join('');
 if([...src.options].some(o=>o.value===oldS))src.value=oldS;
 if([...dst.options].some(o=>o.value===oldD))dst.value=oldD;
}
function populatePingSelects(){const src=$('#pingSource'),dst=$('#pingTarget');if(!src||!dst)return;if(document.body.classList.contains('nf400-mixed'))return nf4073PopulatePingSelectsUnified(src,dst);const oldS=src.value,oldD=dst.value;src.innerHTML='<option value="">Pilih workstation</option>'+nodes.filter(n=>n.type==='pc').map(n=>`<option value="${n.id}">${(n.config&&n.config.name)||'PC-'+n.id} · ${n.config&&n.config.ip||'Belum ada IP'}</option>`).join('');dst.innerHTML='<option value="router">Router / Gateway</option>'+nodes.filter(n=>n.type==='pc'||n.type==='server').map(n=>`<option value="${n.id}">${(n.config&&n.config.name)||defs[n.type].name+' '+n.id} · ${n.config&&n.config.ip||'Belum ada IP'}</option>`).join('');if([...src.options].some(o=>o.value===oldS))src.value=oldS;if([...dst.options].some(o=>o.value===oldD))dst.value=oldD;}
function pathBetween(sourceId,targetId){const queue=[[sourceId,[sourceId]]],seen=new Set([sourceId]);while(queue.length){const [id,path]=queue.shift();if(id===targetId)return path;for(const l of links){if(l.broken)continue;const next=l.a===id?l.b:l.b===id?l.a:null;if(next&&!seen.has(next)){seen.add(next);queue.push([next,[...path,next]])}}}return null;}
function nf4073RunNetworkTestUnified(trace){
 const inv=window.NetForgeUniversalInventory;
 const out=$('#pingResult');
 const s=inv?.getState?.()||{nodes:[]};
 const ns=s.nodes||[];
 const srcId=Number($('#pingSource').value);
 const source=ns.find(n=>n.id===srcId);
 const targetValue=$('#pingTarget').value;
 const target=targetValue==='router'?ns.find(n=>n.type==='router'):ns.find(n=>n.id===Number(targetValue));
 if(!source||!target){out.className='ping-result fail';out.textContent='Pilih workstation sumber dan perangkat tujuan.';return}
 const res=inv?.ping?.(source.id,target.id);
 if(!res||!res.ok)return showTestFail(out,'FAIL: '+(res?.reason||'Uji konektivitas gagal.'));
 const srcIP=res.sourceIP,dstIP=res.targetIP,latency=(res.latencyMs??0),ttl=(res.ttl??64);
 const hops=(res.path||[]).map(id=>{const n=ns.find(x=>x.id===id);return (n?.name||n?.type||('Perangkat '+id))});
 const lines=trace?['TRACEROUTE '+dstIP,' '+hops.map((h,i)=>(i+1)+'  '+h).join('\\n ')]:['PING '+dstIP+' dari '+srcIP,'64 bytes · time='+latency+' ms · TTL='+ttl,'4 packets transmitted, 4 received, 0% packet loss'];
 nfGameplaySound('ping-success');out.className='ping-result ok';out.textContent=lines.join('\\n');
 lastPing={source:source.id,target:target.id,ok:true};
 window.dispatchEvent(new CustomEvent('netforge:network-test',{detail:{ok:true,trace:!!trace,source:source.id,target:target.id,hops:(res.path||[]).slice(),latency:Number(latency)}}));
 log((trace?'Traceroute':'Ping')+' '+srcIP+' → '+dstIP+' berhasil · '+latency+' ms');
 say(trace?'Jalur paket berhasil dilacak. Perhatikan setiap perangkat yang dilewati.':'Reply diterima! Koneksi sumber dan tujuan berjalan dengan baik.','success');
}
function runNetworkTest(trace=false){if(document.body.classList.contains('nf400-mixed'))return nf4073RunNetworkTestUnified(trace);populatePingSelects();const source=nodes.find(n=>n.id===Number($('#pingSource').value)),targetValue=$('#pingTarget').value,target=targetValue==='router'?nodes.find(n=>n.type==='router'):nodes.find(n=>n.id===Number(targetValue));const out=$('#pingResult');if(!source||!target){out.className='ping-result fail';out.textContent='Pilih workstation sumber dan perangkat tujuan.';return}const srcIP=source.config&&source.config.ip,dstIP=target.config&&target.config.ip;if(powerOut){return showTestFail(out,'FAIL: listrik padam. Perangkat tidak memiliki daya.')}if(source.broken||target.broken||!srcIP||!dstIP||srcIP==='DHCP'||dstIP==='DHCP'){return showTestFail(out,'FAIL: IP belum dikonfigurasi atau perangkat mengalami gangguan.')}if(srcIP===dstIP){return showTestFail(out,'FAIL: alamat IP sumber dan tujuan sama (IP conflict).')}if(!sameSubnet(srcIP,dstIP,Number(source.config.prefix||24))&&target.type!=='router'){return showTestFail(out,'FAIL: host berbeda subnet. Routing antar-subnet belum tersedia di lab ini.')}const path=pathBetween(source.id,target.id);if(!path)return showTestFail(out,'Request timed out. Tidak ada jalur Layer 2 yang aktif menuju tujuan.');const dup=nodes.some(n=>n.id!==source.id&&n.id!==target.id&&n.config&&n.config.ip===dstIP);if(dup)return showTestFail(out,'FAIL: terdeteksi IP conflict pada alamat tujuan.');const latency=(1.2+path.length*0.7+(Math.random()*1.8)).toFixed(1);const hops=path.map(id=>{const n=nodes.find(x=>x.id===id);return (n.config&&n.config.name)||defs[n.type].name+'-'+id});const lines=trace?['TRACEROUTE '+dstIP,' '+hops.map((h,i)=>(i+1)+'  '+h).join('\n ')]:['PING '+dstIP+' dari '+srcIP,'64 bytes · time='+latency+' ms · TTL=64','4 packets transmitted, 4 received, 0% packet loss'];nfGameplaySound('ping-success');out.className='ping-result ok';out.textContent=lines.join('\n');arpCache.set(dstIP,{mac:macAddress(target),seenBy:source.id,state:'REACHABLE'});arpCache.set(srcIP,{mac:macAddress(source),seenBy:target.id,state:'REACHABLE'});lastPing={source:source.id,target:target.id,ok:true};nf24ShowPath(source.id,target.id);window.dispatchEvent(new CustomEvent('netforge:network-test',{detail:{ok:true,trace:!!trace,source:source.id,target:target.id,hops:path.slice(),latency:Number(latency)}}));if(selected===source.id||selected===target.id)updateInspector();log((trace?'Traceroute':'Ping')+' '+srcIP+' → '+dstIP+' berhasil · '+latency+' ms');say(trace?'Jalur paket berhasil dilacak. Perhatikan setiap perangkat yang dilewati.':'Reply diterima! Koneksi sumber dan tujuan berjalan dengan baik.','success');}
function showTestFail(out,msg){nfGameplaySound('ping-fail');out.className='ping-result fail';out.textContent=msg;lastPing={ok:false};nf24ShowPath(null,null);window.dispatchEvent(new CustomEvent('netforge:network-test',{detail:{ok:false,message:msg}}));log(msg);say('Ping gagal. Periksa kabel, alamat IP, subnet, dan kondisi perangkat.','fail');}
function drawLinks(){
 svg.innerHTML='';let w=board.clientWidth,h=board.clientHeight;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
 const ns='http://www.w3.org/2000/svg';
 links.forEach((l,i)=>{
  let a=nodes.find(n=>n.id===l.a),b=nodes.find(n=>n.id===l.b);if(!a||!b)return;
  let x1=a.x/100*w,y1=a.y/100*h,x2=b.x/100*w,y2=b.y/100*h;
  // Kabel melengkung ringan agar terasa seperti jalur fisik di ruang server.
  let bend=Math.max(24,Math.min(76,Math.abs(x2-x1)*.16));let cy=(y1+y2)/2-bend;
  let d=`M ${x1} ${y1} Q ${(x1+x2)/2} ${cy} ${x2} ${y2}`;
  let path=document.createElementNS(ns,'path');path.setAttribute('d',d);path.setAttribute('class','wire'+(l.broken||powerOut?' down':''));path.setAttribute('data-a',String(l.a));path.setAttribute('data-b',String(l.b));path.setAttribute('fill','none');svg.appendChild(path);
  // Titik port pada kedua ujung kabel.
  [ [x1,y1],[x2,y2] ].forEach(([x,y])=>{let port=document.createElementNS(ns,'circle');port.setAttribute('cx',x);port.setAttribute('cy',y);port.setAttribute('r','5');port.setAttribute('class','wire-port'+(l.broken||powerOut?' down':''));svg.appendChild(port)});
  // Paket data bergerak hanya pada link yang aktif dan saat listrik tersedia.
  /* v0.34: no misleading perpetual traffic; packet FX is event-driven. */
  let hit=document.createElementNS(ns,'path');hit.setAttribute('d',d);hit.setAttribute('class','wire-hit');hit.setAttribute('fill','none');hit.style.pointerEvents='stroke';hit.addEventListener('click',()=>{if(l.broken){nf364Checkpoint();l.broken=false;let target=nodes.find(n=>n.id===l.b);if(target)target.broken=false;log('Kabel diperbaiki. Link kembali aktif.');toast('Kabel berhasil diperbaiki!');say('Nice! Koneksi sudah pulih.');render()}else toast('Kabel sehat. Tidak perlu diperbaiki.')});svg.appendChild(hit);
 });
}
let drag=null;function startDrag(e,n,el){if(connectMode)return;drag={n,el,sx:e.clientX,sy:e.clientY,moved:false};el.setPointerCapture(e.pointerId);el.addEventListener('pointermove',moveDrag);el.addEventListener('pointerup',endDrag,{once:true})}function moveDrag(e){if(!drag)return;let r=board.getBoundingClientRect();let dx=(e.clientX-drag.sx)/r.width*100,dy=(e.clientY-drag.sy)/r.height*100;if(Math.abs(dx)+Math.abs(dy)>1&&!drag.moved){nf364Checkpoint();drag.moved=true;}drag.n.x=Math.max(7,Math.min(93,drag.n.x+dx));drag.n.y=Math.max(9,Math.min(90,drag.n.y+dy));drag.sx=e.clientX;drag.sy=e.clientY;drag.el.style.left=drag.n.x+'%';drag.el.style.top=drag.n.y+'%';drawLinks()}function endDrag(){if(drag&&drag.moved)log('Posisi perangkat dipindahkan.');drag=null;render()}
function nodeClick(n){if(!connectMode){selected=n.id;render();say(defs[n.type].name+' dipilih. Bisa dipindahkan atau dihapus.');return}if(!selected){selected=n.id;render();toast('Pilih perangkat kedua untuk memasang kabel.');return}if(selected===n.id){selected=null;render();return}let a=nodes.find(x=>x.id===selected);if(links.some(l=>(l.a===a.id&&l.b===n.id)||(l.a===n.id&&l.b===a.id))){toast('Kedua perangkat sudah terhubung.');return}if(!validLink(a.type,n.type)){toast('Topologi tidak valid. Gunakan Router ↔ Switch, lalu Switch ↔ Server/Workstation.');say('Ingat: endpoint sebaiknya terhubung ke switch, bukan langsung ke router.');return}nf364Checkpoint();links.push({a:a.id,b:n.id,broken:false});log(defs[a.type].name+' terhubung ke '+defs[n.type].name+'.');selected=null;render();say('Kabel terpasang! Pastikan semua perangkat punya jalur menuju router.')}
function validLink(a,b){return (a==='router'&&b==='pc')||(b==='router'&&a==='pc')||(a==='router'&&b==='switch')||(b==='router'&&a==='switch')||(a==='switch'&&['switch','server','pc'].includes(b))||(b==='switch'&&['switch','server','pc'].includes(a))}
function reachableIds(ns,ls){
  const router=(ns||nodes).find(n=>n.type==='router');
  const seen=new Set();
  if(!router)return seen;
  const queue=[router.id];seen.add(router.id);
  while(queue.length){
    const current=queue.shift();
    for(const link of (ls||links)){
      let next=null;
      if(link.a===current)next=link.b;
      else if(link.b===current)next=link.a;
      if(next!==null&&!seen.has(next)){seen.add(next);queue.push(next)}
    }
  }
  return seen;
}
function ipv4Parts(value){
 const p=String(value||'').trim().split('.');
 if(p.length!==4||p.some(x=>!/^\d{1,3}$/.test(x)||Number(x)<0||Number(x)>255))return null;
 return p.map(Number);
}
function validPveNetwork(){
 const host=$('#pveHostname').value.trim();
 const ipRaw=$('#pveIP').value.trim().split('/');
 const ip=ipv4Parts(ipRaw[0]),gw=ipv4Parts($('#pveGateway').value),dns=ipv4Parts($('#pveDNS').value);
 const prefix=Number(ipRaw[1]);
 const hostOK=/^(?=.{1,253}$)[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(host);
 const ipOK=!!ip&&prefix===24&&ipRaw.length===2&&ip[0]===192&&ip[1]===168&&ip[2]===10&&ip[3]>1&&ip[3]<255;
 const gwOK=!!gw&&gw[0]===192&&gw[1]===168&&gw[2]===10&&gw[3]===1;
 const dnsOK=!!dns&&!(dns[0]===0||dns[0]===127||dns[0]>=224);
 const bridgeOK=$('#pveBridge').value.trim()==='vmbr0';
 const uplinkOK=$('#pveUplink').checked,guestOK=$('#pveGuestBridge').checked;
 return {ok:hostOK&&ipOK&&gwOK&&dnsOK&&bridgeOK&&uplinkOK&&guestOK,hostOK,ipOK,gwOK,dnsOK,bridgeOK,uplinkOK,guestOK};
}
function testPveNetwork(){
 if(!hostInstalled){$('#pveTestResult').textContent='Gagal: install Proxmox host terlebih dahulu.';return false}
 const r=validPveNetwork();
 const items=[
  ['Hostname/FQDN',r.hostOK],['Management IP 192.168.10.0/24',r.ipOK],
  ['Gateway satu subnet',r.gwOK],['DNS server valid',r.dnsOK],
  ['Linux bridge vmbr0',r.bridgeOK],['Physical NIC uplink',r.uplinkOK],
  ['Guest terhubung ke vmbr0',r.guestOK]
 ];
 $('#pveTestResult').innerHTML=items.map(x=>`<div style="margin:4px 0;color:${x[1]?'#8de5bb':'#ff9a9a'}">${x[1]?'✓':'✕'} ${x[0]}</div>`).join('')+(r.ok?'<b style="color:#8de5bb">PING TEST: HOST ↔ GATEWAY ↔ GUEST OK</b>':'<b style="color:#ff9a9a">Connectivity belum berhasil. Periksa konfigurasi.</b>');
 updateObjectives();
 if(r.ok){log('Proxmox management network dan vmbr0 berhasil dikonfigurasi.');toast('NETWORK CONFIGURATION OK')}
 else{log('Network test gagal. Periksa IP, gateway, DNS, dan bridge.');toast('NETWORK CONFIGURATION FAILED')}
 return r.ok;
}
function sameSubnet(a,b,prefix=24){
 const x=ipv4Parts(a),y=ipv4Parts(b);if(!x||!y)return false;
 const bits=Number(prefix);if(bits<0||bits>32)return false;
 const mask=bits===0?0:(0xffffffff<<(32-bits))>>>0;
 const num=v=>(((v[0]<<24)|(v[1]<<16)|(v[2]<<8)|v[3])>>>0);
 return (num(x)&mask)===(num(y)&mask);
}
function networkChecks(ns,ls){
 const _nodes=ns||nodes,_links=ls||links;
 const cfg=missionConfig||campaign[0],router=_nodes.find(n=>n.type==='router'),pcs=_nodes.filter(n=>n.type==='pc'),sw=_nodes.filter(n=>n.type==='switch'),servers=_nodes.filter(n=>n.type==='server');
 const reachable=reachableIds(_nodes,_links);
 const routerSwitch=router&&sw.some(s=>_links.some(l=>(l.a===router.id&&l.b===s.id)||(l.b===router.id&&l.a===s.id)));
 const pcsOnSwitch=cfg.topology==='direct'
  ?(router&&pcs.some(p=>_links.some(l=>(l.a===router.id&&l.b===p.id)||(l.b===router.id&&l.a===p.id))))
  :(sw.length>=1&&pcs.length>=cfg.pcs&&pcs.every(p=>sw.some(s=>_links.some(l=>(l.a===s.id&&l.b===p.id)||(l.b===s.id&&l.a===p.id)))));
 const serversOnSwitch=cfg.server===0||(servers.length>=cfg.server&&servers.every(p=>sw.some(s=>_links.some(l=>(l.a===s.id&&l.b===p.id)||(l.b===s.id&&l.a===p.id)))));
 const topology=!!router&&pcs.length>=cfg.pcs&&pcs.every(p=>reachable.has(p.id))&&(cfg.sw===0||sw.length>=cfg.sw)&&servers.length>=cfg.server&&(cfg.topology==='direct'?pcsOnSwitch:(routerSwitch&&pcsOnSwitch&&serversOnSwitch));
 const rc=router&&router.config||{},routerIP=rc.ip||'';
 const routerOK=!!ipv4Parts(routerIP)&&Number(rc.prefix||24)===24;
 const pcConfigured=pcs.length>=cfg.pcs&&pcs.every(p=>p.config&&p.config.mode&&(p.config.mode==='dhcp'?!!ipv4Parts(p.config.ip):!!ipv4Parts(p.config.ip)));
 const noConflict=(()=>{const ips=[routerIP,...pcs.map(p=>p.config&&p.config.ip)].filter(x=>x&&x!=='DHCP');return new Set(ips).size===ips.length})();
 const sameNet=pcs.length>=cfg.pcs&&pcs.every(p=>p.config&&sameSubnet(p.config.ip,routerIP,24));
 const gateways=pcs.length>=cfg.pcs&&pcs.every(p=>p.config&&p.config.gateway===routerIP);
 const dhcpOK=cfg.type!=='dhcp'||(!!rc.dhcp&&pcs.length>=cfg.pcs&&pcs.every(p=>p.config&&p.config.mode==='dhcp'&&p.config.ip!=='DHCP'&&sameSubnet(p.config.ip,routerIP,24)));
 const server=servers[0],serverOK=cfg.type!=='dns'||(!!server&&server.config&&ipv4Parts(server.config.ip)&&sameSubnet(server.config.ip,routerIP,24)&&server.config.gateway===routerIP&&pcs.every(p=>p.config&&p.config.dns===server.config.ip));
 const dnsOK=cfg.type!=='dns'||(!!serverOK&&!!server&&server.config&&server.config.dns&&pcs.every(p=>p.config&&p.config.dns===server.config.ip));
 return {topology,routerOK,pcConfigured,noConflict,sameNet,gateways,dhcpOK,serverOK,dnsOK,router,pcs,servers};
}
window.NetForgeClassicMission={active:()=>!!missionConfig};
function updateObjectives(){
 // v0.59.00: saat Unified Canvas aktif DAN tidak ada misi klasik berjalan,
 // panel objective dimiliki validator unified. Bila misi klasik aktif, objektif
 // klasik dirender dari graf unified — placeholder "Memuat…" tidak boleh tertinggal.
 let c,_nodes=nodes;
 if(document.body.classList.contains('nf400-mixed')){
  if(!missionConfig)return [];
  const view=window.NetForgeUniversalInventory?.classicView?.();
  if(view){_nodes=view.nodes;c=networkChecks(view.nodes,view.links);}else{c=networkChecks();}
 }else{
  if(!missionConfig){$('#objectives').innerHTML='<div class="objective"><span>○</span><span>Mulai misi untuk memuat objective.</span></div>';$('#progressBar').style.width='0%';$('#progressText').textContent='0 / 5 objectives';return [false,false,false,false,false]}
  c=networkChecks();
 }
 let checks,labels;
 const activeMission=Number(missionConfig.id);
 if(activeMission===1){
  checks=[!!c.router,c.topology,c.routerOK,c.pcConfigured&&c.sameNet,c.gateways];
  labels=['Pasang 1 Router dan 1 Workstation','Hubungkan PC langsung ke Router','Atur IP Router 192.168.10.1/24','Atur IP PC 192.168.10.10/24','Atur default gateway PC'];
 }else if(activeMission===2||activeMission===3){
  checks=[!!c.router,c.topology,c.routerOK,c.pcConfigured&&c.noConflict,c.sameNet&&c.gateways];
  labels=['Pasang Router, Switch, dan '+missionConfig.pcs+' Workstation','Hubungkan semua perangkat melalui Switch','Atur IP Router 192.168.10.1/24','Atur IP unik untuk setiap PC','Pastikan subnet dan gateway benar'];
 }else if(activeMission===4){
  const rc=c.router&&c.router.config||{};
  checks=[!!c.router,c.topology,!!rc.dhcp, c.dhcpOK,c.gateways&&c.noConflict];
  labels=['Pasang Router, Switch, dan 3 Workstation','Hubungkan semua perangkat','Aktifkan DHCP server pada Router','PC memperoleh IP otomatis dari DHCP pool','Gateway benar dan tidak ada IP conflict'];
 }else if(activeMission===5){
  checks=[!!c.router&&c.servers.length>=1,c.topology,c.routerOK&&c.pcConfigured,c.serverOK,c.dnsOK];
  labels=['Pasang Router, Switch, 3 PC, dan Server','Hubungkan semua perangkat','Atur IP, subnet, dan gateway','Atur IP statis Server dan gateway','Atur DNS klien ke alamat DNS Server'];
 }else if(activeMission===6){
  const sw=_nodes.find(n=>n.type==='switch'),pcs=_nodes.filter(n=>n.type==='pc');
  const admin=pcs.filter(p=>p.config&&String(p.config.vlan)==='10').length;
  const staff=pcs.filter(p=>p.config&&String(p.config.vlan)==='20').length;
  const trunk=!!(sw&&sw.config&&String(sw.config.vlan).replace(/\\s/g,'').split(',').includes('10')&&String(sw.config.vlan).replace(/\\s/g,'').split(',').includes('20')&&String(sw.config.iface).toLowerCase()==='trunk');
  checks=[!!c.router&&!!sw&&pcs.length>=4,c.topology,c.routerOK&&pcs.every(p=>p.config&&ipv4Parts(p.config.ip)),admin>=2&&staff>=2,trunk];
  labels=['Pasang Router, Switch, dan 4 Workstation','Hubungkan semua PC melalui Switch','Atur IP dan gateway setiap workstation','Pisahkan 2 PC Admin (VLAN 10) dan 2 PC Staff (VLAN 20)','Atur Switch: antarmuka trunk dan VLAN 10,20'];
 }else{
  const vm=guests.filter(g=>g.name.includes('Virtual Machine')).length,lxc=guests.filter(g=>g.name.includes('LXC Container')).length,docker=guests.filter(g=>g.name.includes('Docker Container')).length;
  checks=[hostInstalled,validPveNetwork().ok,vm>=missionConfig.vms,lxc>=missionConfig.lxcs,docker>=missionConfig.dockers,guests.reduce((n,g)=>n+g.ram,0)<=missionConfig.ram];
  labels=['Install Proxmox','Konfigurasi management network dan vmbr0',`Deploy ${missionConfig.vms} VM`,`Deploy ${missionConfig.lxcs} LXC`,`Deploy ${missionConfig.dockers} Docker`,'RAM guest dalam batas'];
 }
 $('#objectives').innerHTML=checks.map((v,i)=>`<div class="objective"><span>${v?'✓':'○'}</span><span style="color:${v?'#8de5bb':'#d1deee'}">${labels[i]}</span></div>`).join('');
 let done=checks.filter(Boolean).length;$('#progressBar').style.width=done/checks.length*100+'%';$('#progressText').textContent=done+' / '+checks.length+' objectives';
 // v0.59.00: di Unified Canvas tombol validasi klasik dialihkan ke validator unified,
 // jadi misi klasik diselesaikan otomatis begitu semua objective terpenuhi.
 if(document.body.classList.contains('nf400-mixed')&&missionConfig&&checks.every(Boolean))completeClassicMission();
 return checks;
}
function startCampaignMission(next){
 // Mulai misi sebagai sesi baru: reset state JavaScript DAN elemen visual yang dibuat dinamis.
 mission=next;missionConfig=generateContract(next);won=false;
 nodes=[];links=[];nextId=1;selected=null;connectMode=false;pendingPort=null;lastPing=null;drag=null;
 hostInstalled=false;guests=[];incident=null;powerOut=false;
 upsInstalled=false;cableProtected=false;acInstalled=false;temp=24;
 budget=missionConfig.budget;
 // Tutup dialog yang mungkin masih terbuka dan bersihkan semua artefak topologi lama.
 const modal=$('#deviceConfigModal');if(modal)modal.classList.remove('open');editingNodeId=null;
 board.querySelectorAll('.node,.infra-rack,.rack-cable').forEach(el=>el.remove());
 svg.innerHTML='';
 // Bersihkan parameter lab Proxmox agar tidak terbawa ke misi berikutnya.
 ['pveHostname','pveIP','pveGateway','pveDNS'].forEach(id=>{const el=$('#'+id);if(el)el.value=''});
 $('#pveBridge').value='vmbr0';$('#pveUplink').checked=false;$('#pveGuestBridge').checked=false;
 $('#pveTestResult').textContent='Status: konfigurasi Proxmox belum dibuka.';
 $('#missionCode').textContent=(next<=5?'NETWORKING FUNDAMENTALS · ':'NETWORK ADMINISTRATION · ')+String(next<=5?next:next-5).padStart(2,'0')+'/05';
 $('#missionTitle').textContent='Mission '+String(next).padStart(2,'0')+' · '+missionConfig.title;
 $('#missionDesc').textContent=missionConfig.brief;
 $('#missionMeta').textContent='Learning path · '+missionConfig.type.toUpperCase()+' · Contract '+missionConfig.seed;
 $('#objectives').innerHTML='<div class="objective"><span>…</span><span>Memuat objective misi '+String(next).padStart(2,'0')+'…</span></div>';
 $('#progressBar').style.width='0%';$('#progressText').textContent='0 / 5 objectives';
 const eyebrow=document.querySelector('.panelhead .eyebrow');if(eyebrow)eyebrow.textContent=next<=5?'NETWORKING FUNDAMENTALS':'NETWORK ADMINISTRATION';
 $('#nextMissionBtn').style.display='none';$('#newContractBtn').style.display='none';
 if($('#proxmoxLabPanel'))$('#proxmoxLabPanel').style.display='none';if($('#pveConfigPanel'))$('#pveConfigPanel').style.display='none';
 $('#connectBtn').classList.remove('good');$('#connectBtn').textContent='🔌 Hubungkan kabel';
 $('#modeHint').textContent='Bangun topologi, pilih port LAN/ETH untuk menyambungkan kabel, klik ⚙ pada perangkat untuk konfigurasi, lalu uji dengan PING.';
 const _ea=$('#eventArea');if(_ea)_ea.textContent='Lab siap. Baca objective sebelum memasang perangkat.';/* v0.40.92: #eventArea ada di HTML statis tapi DIHAPUS saat boot oleh panel rebuild (catatan v0.40.81 — penulisan ke #eventArea di jalur lain sudah di-guard if(_a)) — penulisan tanpa guard ini melempar TypeError tak tertangkap di SETIAP klik Start, sehingga updateStats()/render()/updateObjectives()/say()/toast() sesudahnya tidak jalan. Ditemukan karena blok B89-3 (yang pertama kali mengklik #startBtn di harness) membuat harness melaporkan 1 jsdomError; terkonfirmasi pra-ada di v0.40.88 (probe sama pada backup juga melempar). */
 $('#log').innerHTML='<div>Misi '+String(next).padStart(2,'0')+' dimulai. Selamat belajar!</div>';
 updateStats();
 // Muat ulang daftar objective berdasarkan misi yang baru dipilih.
 // Tanpa pemanggilan ini, HTML bawaan (objective Misi 01) tetap terlihat.
 render();
 updateObjectives();
 const hints=[
 'Pasang satu kabel Ethernet langsung dari PC ke router. Jangan lupa alamat IP dan gerbang utama.',
 'Switch menjadi pusat koneksi. Kedua PC harus berada dalam subnet yang sama.',
 'Tambah workstation, tetapi pastikan setiap perangkat memiliki alamat IP yang unik.',
 'Biarkan router membagikan alamat IP. Rentang DHCP harus berada di subnet LAN.',
 'Server akan menjadi DNS internal. Semua klien harus menunjuk ke alamat DNS server.'
 ];
 say(hints[next-1]||'Konfigurasi jaringan dan uji koneksi.');toast('MISI '+String(next).padStart(2,'0')+' DIMULAI');
}
// v0.59.00: penyelesaian misi klasik dipisah dari validate() agar bisa dipanggil
// otomatis dari updateObjectives saat mode Unified Canvas aktif (tombol validasi
// klasik dialihkan ke validator unified di mode itu).
function completeClassicMission(){
 if(won)return;
 nfGameplaySound('mission');won=true;let reward=(diff==='easy'?250:diff==='normal'?350:500)+(mission*50);
 // v0.59.00: hadiah XP hanya untuk kelulusan PERTAMA tiap misi (anti-farming).
 // Flag tersimpan di localStorage; pengulangan misi memberi 0 XP.
 let firstPass=true;try{const _done=JSON.parse(localStorage.getItem('netforge.mission.completed.v1')||'{}');firstPass=!_done[String(mission)];if(firstPass){_done[String(mission)]=true;localStorage.setItem('netforge.mission.completed.v1',JSON.stringify(_done))}}catch{firstPass=true}
 // v0.59.00: XP dijumlahkan ke kunci bersama (increment), bukan ditimpa —
 // penulisan lama menimpa +100 XP bonus validator yang sudah tersimpan.
 if(firstPass){try{xp=Math.max(0,Math.min(999999,(Number(localStorage.getItem('netforge.local.xp.v1'))||0)+reward));localStorage.setItem('netforge.local.xp.v1',String(xp))}catch{xp+=reward}}else{reward=0;try{xp=Math.max(0,Math.min(999999,Number(localStorage.getItem('netforge.local.xp.v1'))||0))}catch{}}
 updateStats();
 if(mission<6){$('#nextMissionBtn').textContent='➡️ Lanjut ke Mission '+String(mission+1).padStart(2,'0');$('#nextMissionBtn').style.display='block';say('Nah, ngono dong! Jaringannya sudah berfungsi. Lanjut ke tantangan berikutnya!', 'success');toast(firstPass?('MISSION COMPLETE! +'+reward+' XP · Total '+xp+' XP'):('MISSION COMPLETE! (tanpa XP — misi ini sudah pernah lulus) · Total '+xp+' XP'));$('#eventArea').innerHTML='<b style="color:var(--green)">✅ Network test passed</b><p>Semua objective terpenuhi. Misi berikutnya telah terbuka.</p>';}
 else{$('#nextMissionBtn').style.display='none';$('#newContractBtn').style.display='none';say('Mantap! VLAN Admin dan Staff sudah terpisah. Kamu menyelesaikan pengantar Network Administration!', 'celebrate');toast('LEVEL 2 · MISSION 06 COMPLETE!');$('#eventArea').innerHTML='<b style="color:var(--green)">🏆 VLAN SEPARATION COMPLETE</b><p>Segmentasi VLAN dasar berhasil. Misi berikutnya: subnetting dan inter-VLAN routing akan hadir pada pembaruan selanjutnya.</p>';}
 log('Mission '+mission+' completed. '+(firstPass?('+'+reward+' XP (kelulusan pertama)'):('tanpa XP tambahan (sudah pernah lulus)'))+' (total '+xp+' XP lokal)');
}
function validate(){
 const c=updateObjectives();
 if(c.every(Boolean)){completeClassicMission();return;}
 const names=['perangkat/topologi','kabel koneksi','IP router','konfigurasi IP klien','gateway/subnet/DHCP/DNS'];const missing=names.filter((x,i)=>!c[i]);say('Waduh, tes belum lolos. Coba periksa: '+missing.join(', ')+'.', 'confused');toast('NETWORK TEST FAILED');log('Tes jaringan gagal: '+missing.join(', '));
}

function startMission2(){if(!mission1Complete)return;mission=2;missionConfig=generateContract(2);showContract();won=false;nodes=[];links=[];nextId=1;selected=null;connectMode=false;hostInstalled=false;guests=[];incident=null;powerOut=false;['pveHostname','pveIP','pveGateway','pveDNS'].forEach(id=>$('#'+id).value='');$('#pveBridge').value='vmbr0';$('#pveUplink').checked=false;$('#pveGuestBridge').checked=false;$('#pveTestResult').textContent='Status: konfigurasi belum diuji.';budget=missionConfig.budget;$('#missionCode').textContent='DYNAMIC CONTRACT · #'+String(contractNo).padStart(3,'0');$('#missionMeta').textContent='Seed: '+missionConfig.seed+' · '+missionConfig.modifier.name+' — '+missionConfig.modifier.desc;$('#missionTitle').textContent=missionConfig.title;$('#missionDesc').textContent=missionConfig.brief+' Konfigurasikan hostname, management IP, gateway, DNS, vmbr0, dan koneksi guest. Setelah jaringan lulus tes, deploy '+missionConfig.vms+' VM, '+missionConfig.lxcs+' LXC, dan '+missionConfig.dockers+' Docker. RAM host '+missionConfig.ram+' GB (kebutuhan guest '+missionConfig.requiredRam+' GB). Estimasi biaya guest $'+missionConfig.requiredCost+'.';$('#nextMissionBtn').style.display='none';$('#newContractBtn').style.display='none';document.querySelector('.panelhead .eyebrow').textContent='DYNAMIC CONTRACT · v0.8.1';$('#modeHint').textContent='Mission 02: install Proxmox, lalu deploy guest system.';$('#eventArea').textContent='Virtualization lab siap dibangun. Perhatikan kapasitas RAM!';$('#log').innerHTML='<div>Mission 02 unlocked: Proxmox Virtualization Lab.</div>';updateStats();render();say('Selamat datang di lab! Install Proxmox pada server fisik, lalu buat VM, LXC, dan Docker.');toast('MISSION 02 UNLOCKED!')}
function showChaosFx(icon,label){
 const stage=$('#stage');if(!stage)return;
 stage.classList.remove('chaos-active');stage.querySelectorAll('.chaos-fx').forEach(e=>e.remove());
 void stage.offsetWidth;stage.classList.add('chaos-active');
 const fx=document.createElement('div');fx.className='chaos-fx';fx.innerHTML=`${icon}<span>${label}</span>`;
 stage.appendChild(fx);setTimeout(()=>{fx.remove();stage.classList.remove('chaos-active')},2200);
}
// v0.59.00: panel Chaos menampilkan teks statis "Chaos butuh minimal 2 perangkat
// dan 1 kabel aktif" bahkan setelah reload padahal topologi unified sudah
// memenuhi syarat — teks itu tidak pernah disegarkan dari state aktif.
// v0.59.00: header "INCIDENT" + ikon kucing hanya tampil saat ada insiden
// aktif — sebelumnya keduanya statis di HTML dan tetap tampil setelah
// insiden selesai. refreshChaosStatus() yang mengatur tampil/sembunyinya.
function syncChaosHeader(active){const panel=document.querySelector('.chaos-panel');if(!panel)return;const eyebrow=panel.querySelector('.panelhead .eyebrow'),art=panel.querySelector('.chaos-art');if(eyebrow)eyebrow.style.display=active?'':'none';if(art)art.style.display=active?'':'none';}
/* v0.40.92: chaosRepairNote(reason) — tulis salinan pesan penolakan repair DI DALAM kotak insiden panel Chaos (tepat di tempat pengguna melihat saat mengklik tombol), sebagai penguat toast fixed. Dipakai ketiga handler repair yang gagal (dua jalur unified + satu klasik). */
function chaosRepairNote(reason){try{const box=document.querySelector('#eventRightContent .eventbox')||document.querySelector('#eventArea .eventbox');if(!box||!reason)return;let n=box.querySelector('.nf4091-chaos-note');if(!n){n=document.createElement('p');n.className='nf4091-chaos-note';n.setAttribute('role','status');box.appendChild(n)}n.textContent=String(reason);}catch(_e){}}
function refreshChaosStatus(){
 const right=document.getElementById('eventRightContent'),btn=document.getElementById('chaosBtn');
 if(!right||!btn)return;
 const inv=window.NetForgeUniversalInventory;
 const mixed=document.body.classList.contains('nf400-mixed');
 const _chaosActive=mixed?!!(inv?.chaosActive&&inv.chaosActive()):!!incident;
 syncChaosHeader(_chaosActive);
 // Insiden Chaos yang masih aktif jangan ditimpa oleh teks status.
 if(document.getElementById('nf4072ChaosRepair')){if(inv?.chaosActive&&!inv.chaosActive()){right.textContent='Belum ada gangguan. Chaos siap dipicu — tekan 🐾 Acak kejadian.';btn.title='Acak kejadian Chaos';}return;}
 /* v0.40.92: bila Chaos masih aktif tapi kotak insidennya hilang (mis. setelah navigasi Lab→Misi), gambar ulang kotak itu — sebelumnya fall-through ini selalu menulis "Belum ada gangguan" walau kabel masih LINK DOWN (audit live v0.40.89 butir 4). Judul generik (tanpa nama hewan) karena hewan pemicu asli tidak tersimpan di penanda; tombol Perbaiki memakai handler yang sama seperti triggerChaos. Bila rincian insiden tidak ditemukan (mis. kabel sudah dihapus), jatuh ke teks status biasa. */
 if(_chaosActive&&mixed){const inc=inv?.chaosIncident?.();if(inc){right.innerHTML='<div class="eventbox"><b>⚠️ '+(inc.animal||'Chaos')+' — Cable incident</b><p>Kabel jaringan diganggu! Koneksi '+inc.a+' ↔ '+inc.b+' terputus.</p><button class="good" id="nf4072ChaosRepair">🛠️ Perbaiki kabel · $25</button></div>';/* v0.40.92: judul gambar-ulang memakai hewan pemicu bila tersimpan (audit live v0.40.90 butir 5: sebelumnya selalu judul generik "Chaos — Cable incident"); fallback generik hanya bila hewan tidak diketahui. */const _b=document.getElementById('nf4072ChaosRepair');if(_b)_b.onclick=()=>{const r=inv?.chaosRepair?.();if(!r||!r.ok){const _rsn=r?.reason||'Perbaikan gagal.';toast(_rsn);try{if(typeof chaosRepairNote==='function')chaosRepairNote(_rsn);}catch(_e){}if(window.NetForgeChaosStatus?.refresh)window.NetForgeChaosStatus.refresh();return}if(right)queueMicrotask(()=>{right.textContent='Insiden selesai. Area kembali aman (untuk sekarang).';});const _a=document.getElementById('eventArea');if(_a)_a.textContent='Insiden selesai. Area kembali aman (untuk sekarang).';log('Insiden hewan berhasil ditangani. Biaya perbaikan $25.'+(r.emergency?' Dana darurat dipakai (budget minus).':''));say('Kabel sudah aman. Insiden selesai — jaringan kembali normal.','success');syncChaosHeader(false)};btn.title='Perbaiki insiden Chaos yang aktif';return;}}
 const s=mixed?inv?.getState?.():null;
 const nCount=mixed?(s?.nodes?.length||0):nodes.length;
 const activeEdges=mixed?(s?.edges?.filter(e=>!e.disabled)?.length||0):links.filter(l=>!l.broken).length;
 const ready=nCount>=2&&activeEdges>=1;
 right.textContent=ready?'Belum ada gangguan. Chaos siap dipicu — tekan 🐾 Acak kejadian.':'Belum ada gangguan. Chaos butuh minimal 2 perangkat dan 1 kabel aktif.';
 btn.title=ready?'Acak kejadian Chaos':'Butuh minimal 2 perangkat dan 1 kabel aktif';
}
window.NetForgeChaosStatus={refresh:refreshChaosStatus};
let nf4073ChaosRolls=0;
function triggerChaos(){
 // v0.40.72: Unified Canvas memakai graf sendiri; daftar nodes klasik kosong di sana,
 // sehingga pemeriksaan lama selalu gagal. Cabang ini memakai graf unified.
 if(document.body.classList.contains('nf400-mixed')){
   const inv=window.NetForgeUniversalInventory;const s=inv?.getState?.()||{nodes:[],edges:[]};
   const activeEdges=(s.edges||[]).filter(e=>!e.disabled);
   if((s.nodes||[]).length<2||!activeEdges.length){toast('Chaos butuh minimal 2 perangkat dan 1 kabel aktif di Unified Canvas.');say('Pasang minimal dua perangkat dan satu kabel aktif, lalu tekan Acak kejadian lagi.');return}
   if(inv?.chaosActive?.()){toast('Selesaikan insiden sebelumnya dulu.');return}
   /* v0.40.92: hewan dipilih SEBELUM chaosBreak agar identitasnya tersimpan di kabel (e.chaosAnimal) dan dipakai judul panel saat render ulang (audit live v0.40.90 butir 5). Guard chaosActive di atas mencegah counter "Kucing pertama" terpakai saat insiden sudah aktif. */
   const animal=(nf4073ChaosRolls++===0)?'🐈 Kucing Nakal!':['🐈 Kucing','🐭 Tikus','🐓 Ayam','🦎 Cicak','🐒 Monyet','🐕 Anjing','🐦 Burung'][Math.floor(Math.random()*7)];
   const res=inv?.chaosBreak?.(animal);
   if(!res||!res.ok){toast(res&&res.reason==='active'?'Selesaikan insiden sebelumnya dulu.':'Tidak ada kabel aktif untuk diganggu.');return}
   const cmsg=animal+' mengganggu kabel jaringan! Koneksi '+res.a+' ↔ '+res.b+' terputus.';
   const box='<div class="eventbox"><b>⚠️ '+animal+' — Cable incident</b><p>'+cmsg+'</p><button class="good" id="nf4072ChaosRepair">🛠️ Perbaiki kabel · $25</button></div>';
   const right=$('#eventRightContent');if(right)right.innerHTML=box;const area=$('#eventArea');if(area)area.textContent='Chaos aktif: '+cmsg+' Perbaiki dari panel Chaos Event.';
   const btn=document.getElementById('nf4072ChaosRepair');if(btn)btn.onclick=()=>{const r=inv?.chaosRepair?.();if(!r||!r.ok){const _rsn=r?.reason||'Perbaikan gagal.';toast(_rsn);try{if(typeof chaosRepairNote==='function')chaosRepairNote(_rsn);}catch(_e){}if(window.NetForgeChaosStatus?.refresh)window.NetForgeChaosStatus.refresh();return}if(right)queueMicrotask(()=>{right.textContent='Insiden selesai. Area kembali aman (untuk sekarang).';});if(area)area.textContent='Insiden selesai. Area kembali aman (untuk sekarang).';log('Insiden hewan berhasil ditangani. Biaya perbaikan $25.'+(r.emergency?' Dana darurat dipakai (budget minus).':''));say('Kabel sudah aman. Insiden selesai — jaringan kembali normal.','success');syncChaosHeader(false)};
   nfGameplaySound('chaos');log(cmsg);say('Waduh! '+animal+' bikin ulah. Kabelnya putus! Ayo kita perbaiki.','panic');toast('CHAOS EVENT! Kabel jaringan terputus.');return;
 }
 if(nodes.length<2){toast('Pasang minimal 2 perangkat dan 1 kabel aktif sebelum memanggil chaos!');return}if(incident){toast('Selesaikan insiden sebelumnya dulu.');return}let kind=Math.random()<0.72?'animal':'power';nfGameplaySound('chaos');if(kind==='power'){powerOut=!upsInstalled;incident={kind:'power'};syncChaosHeader(true);showChaosFx('⚡','TOKEN LISTRIK HABIS');$('#eventArea').innerHTML='<div class="eventbox"><b>⚡ TOKEN LISTRIK HABIS!</b><p>'+(upsInstalled?'UPS mengambil alih daya sementara. Jaringan tetap online, tetapi cadangan baterai terbatas.':'Tidak ada UPS. Host dan layanan kehilangan daya hingga listrik dipulihkan.')+'</p><button class="good" id="repairBtn">🔋 Isi token & pulihkan listrik · $80</button></div>';$('#repairBtn').onclick=()=>{if(budget<80){toast('Dana tidak cukup untuk mengisi token.');return}budget-=80;powerOut=false;incident=null;syncChaosHeader(false);$('#eventArea').textContent='Listrik kembali normal. UPS sedang mengisi baterai.';updateStats();render();log('Listrik pulih setelah token diisi. Biaya $80.');say('Untung UPS masih sempat menyelamatkan server!')};render();log('Token listrik habis. Infrastruktur kehilangan daya.');say('Aduh! Token listrik habis. Cepat pulihkan daya sebelum UPS kehabisan baterai!', 'panic');toast('POWER FAILURE!');return}let choices=links.filter(l=>!l.broken);if(!choices.length){toast('Tidak ada kabel aktif untuk diganggu.');say('Aman... untuk sementara.');return}/* v0.40.92: hewan baru dipilih SETELAH ada kabel aktif — sebelumnya penanda "Kucing pertama" dikonsumsi di sini walau tidak ada kabel yang diganggu, sehingga Chaos pertama yang terlihat bisa bukan Kucing. */let animal=(nf4073ChaosRolls++===0)?'🐈 Kucing Nakal!':['🐈 Kucing','🐭 Tikus','🐓 Ayam','🦎 Cicak','🐒 Monyet','🐕 Anjing','🐦 Burung'][Math.floor(Math.random()*7)];showChaosFx(animal.split(' ')[0],animal+' MENGGANGGU INFRASTRUKTUR');if(cableProtected&&Math.random()<0.65){incident={kind:'animal-safe'};syncChaosHeader(true);$('#eventArea').innerHTML='<div class="eventbox"><b>🐾 Hewan terdeteksi!</b><p>'+animal+' mencoba mengganggu kabel, tetapi pelindung kabel berhasil mencegah kerusakan.</p></div>';log(animal+' gagal merusak kabel berkat cable protector.');say('Hampir saja! Investasi cable protector ternyata berguna.');toast('CABLE PROTECTED!');setTimeout(()=>{if(incident&&incident.kind==='animal-safe'){incident=null;syncChaosHeader(false);$('#eventArea').textContent='Area kembali aman.'}},4200);return}let l=choices[Math.floor(Math.random()*choices.length)];l.broken=true;incident={kind:'animal',animal,link:l};syncChaosHeader(true);let a=nodes.find(n=>n.id===l.a),b=nodes.find(n=>n.id===l.b);let msg=animal+' mengganggu kabel jaringan! Koneksi '+defs[a.type].name+' ↔ '+defs[b.type].name+' terputus.';$('#eventArea').innerHTML=`<div class="eventbox"><b>⚠️ ${animal} — Cable incident</b><p>${msg}</p><button class="good" id="repairBtn">🛠️ Perbaiki kabel · $25</button></div>`;$('#repairBtn').onclick=()=>{if(budget<25){toast('Dana tidak cukup untuk perbaikan.');try{if(typeof chaosRepairNote==='function')chaosRepairNote('Dana tidak cukup untuk perbaikan ($25).');}catch(_e){}return}budget-=25;xp+=20;try{localStorage.setItem('netforge.local.xp.v1',String(Math.max(0,Math.min(999999,xp))))}catch{}l.broken=false;incident=null;$('#eventArea').textContent='Insiden selesai. Area kembali aman (untuk sekarang).';updateStats();render();log('Insiden hewan berhasil ditangani. Biaya perbaikan $25.');say('Kabel sudah aman. Insiden selesai — jaringan kembali normal.','success');syncChaosHeader(false)};render();log(msg);say('Waduh! '+animal+' bikin ulah. Kabelnya putus! Ayo kita perbaiki.', 'panic');toast('CHAOS EVENT! Kabel jaringan terputus.')}

// NET FORGE v0.28.0 — View-layer add-ons (does not mutate links or IP configs).
let nf24PreviousFocus=null;
function nf24UpdateHud(){
 const hud=document.getElementById('nf24Hud');if(!hud)return;
 const brokenCount=links.filter(l=>l.broken).length;
 hud.innerHTML=`<span>⬡ ${nodes.length} perangkat</span><span>⛓ ${links.length} kabel</span><span>${powerOut?'⚠ Listrik padam':brokenCount?'⚠ '+brokenCount+' kabel rusak':'● '+(nodes.length?'Lab aktif':'Siap')}</span>`;
}
function nf24Arrange(){
 if(!nodes.length){toast('Tambahkan perangkat dari inventori dahulu.');say('Ambil router, switch, dan workstation dari inventori dulu, ya.','think');return}
 nf364Checkpoint();const byType={router:[],switch:[],pc:[],server:[],ap:[],firewall:[],ups:[]};
 nodes.forEach(n=>{(byType[n.type]||(byType[n.type]=[])).push(n)});
 const order=['router','firewall','switch','ap','pc','server','ups'];
 const layers=order.filter(t=>byType[t]&&byType[t].length);
 const fixedY={router:13,firewall:28,switch:40,ap:56,pc:73,server:85,ups:85};
 layers.forEach((type,li)=>{
   const group=byType[type];let y=fixedY[type]??(18+li*12);
   // Preserve legibility for crowded workspaces by distributing groups across rows.
   const columns=Math.min(5,group.length);
   group.forEach((n,i)=>{
     const row=Math.floor(i/columns),col=i%columns,count=Math.min(columns,group.length-row*columns);
     n.x= count===1?50:13+(74/(count-1))*col;
     n.y=Math.min(89,y+row*13);
   });
 });
 selected=null;pendingPort=null;
 render();nf24UpdateHud();
 const stage=document.getElementById('stage');stage.classList.remove('nf24-topology-flash');void stage.offsetWidth;stage.classList.add('nf24-topology-flash');
 toast('Topologi dirapikan. Konfigurasi IP dan kabel tetap tersimpan.');say('Topologi lebih rapi! Perangkat dan kabel tetap terhubung.','success');
}
function nf24SetFocus(force){
 const active=typeof force==='boolean'?force:!document.body.classList.contains('nf24-focus');
 document.body.classList.toggle('nf24-focus',active);
 const btn=document.getElementById('nf24Focus');btn.setAttribute('aria-pressed',String(active));btn.textContent=active?'↙ Kembali':'⛶ Fokus';
 requestAnimationFrame(()=>{drawLinks();});
}
function nf24ShowPath(source,target){
 document.querySelectorAll('.nf24-active-path').forEach(el=>el.classList.remove('nf24-active-path'));
 if(!source||!target)return;
 const hops=pathBetween(source,target);if(!hops)return;
 hops.forEach(id=>{const node=document.querySelector(`.node[data-id="${id}"]`);if(node)node.classList.add('nf24-active-path')});
 const wireEls=document.querySelectorAll('#wires .wire');
 links.forEach((link,index)=>{if(hops.some((id,i)=>hops[i+1]!==undefined&&((id===link.a&&hops[i+1]===link.b)||(id===link.b&&hops[i+1]===link.a)))){if(wireEls[index])wireEls[index].classList.add('nf24-active-path')}});
}
document.getElementById('nf24Arrange')?.addEventListener('click',nf24Arrange);
document.getElementById('nf24Focus')?.addEventListener('click',()=>nf24SetFocus());
const nf24Guide=document.getElementById('nf24Guide');
function nf24GuideToggle(open){nf24Guide.hidden=!open;if(open)document.getElementById('nf24Close').focus()}
document.getElementById('nf24Help')?.addEventListener('click',()=>nf24GuideToggle(true));
document.getElementById('nf24Close')?.addEventListener('click',()=>nf24GuideToggle(false));
document.getElementById('nf24Begin')?.addEventListener('click',()=>nf24GuideToggle(false));
nf24Guide?.addEventListener('click',e=>{if(e.target===nf24Guide)nf24GuideToggle(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nf24Guide.hidden)nf24GuideToggle(false)});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>{if(nodes.length)drawLinks()}).observe(document.getElementById('board'));
nf24UpdateHud();


/* Net Forge v0.26 Network Lab: core bridge reuses the existing topology engine. */
const nf26MissionSnapshot = {value:null};
let nf26LabActive=false;
let nf26LabMode='free';
function nf26Snapshot(){
 const logHtml=(()=>{try{return [...document.querySelectorAll('#log > div')].slice(0,30).map(d=>d.outerHTML).join('')}catch{return ''}})();
 return JSON.parse(JSON.stringify({nodes,links,nextId,budget,xp,mission,missionConfig,won,mission1Complete,contractNo,hostInstalled,guests,upsInstalled,cableProtected,acInstalled,temp,powerOut,diff,logHtml}));
}
function nf26Restore(data){
 nodes=data.nodes.map(n=>({...n}));links=data.links.map(l=>({...l}));
 nextId=data.nextId;budget=data.budget;try{xp=Math.max(Number(data.xp)||0,Number(localStorage.getItem('netforge.local.xp.v1'))||0)}catch{xp=Number(data.xp)||0}mission=data.mission;
 missionConfig=data.missionConfig;won=!!data.won;mission1Complete=!!data.mission1Complete;contractNo=Number(data.contractNo)||1;hostInstalled=!!data.hostInstalled;
 guests=data.guests||[];upsInstalled=data.upsInstalled;cableProtected=data.cableProtected;
 acInstalled=data.acInstalled;temp=data.temp;powerOut=data.powerOut;diff=data.diff;
 incident=null;selected=null;pendingPort=null;connectMode=false;lastPing=null;
 const cb=$('#connectBtn');if(cb){cb.classList.remove('good');cb.textContent='🔌 Hubungkan kabel'}
 const md=$('#deviceConfigModal');if(md)md.classList.remove('open');editingNodeId=null;
 render();updateStats();
 if(data.logHtml){const logEl=$('#log');if(logEl){/* v0.40.92: GABUNGKAN, jangan timpa — sebelumnya innerHTML diganti snapshot pra-Lab sehingga seluruh entri log yang dibuat DI DALAM Lab (mis. Chaos Lab 11.45) hilang dari live feed setelah kembali ke Misi (audit live v0.40.90 butir 4). Entri yang sudah ada di snapshot tidak diduplikasi; entri baru (Lab) dipertahankan di atas, urutan terbaru-dulu dipertahankan. */const _cur=[...logEl.children].map(d=>d.outerHTML);const _snap=new Set();try{const _t=document.createElement('div');_t.innerHTML=data.logHtml;[..._t.children].forEach(d=>_snap.add(d.outerHTML));}catch(_e){}logEl.innerHTML=data.logHtml;const _extra=_cur.filter(h=>!_snap.has(h)).map(h=>{const _d=document.createElement('div');_d.innerHTML=h;return _d.firstElementChild;}).filter(Boolean);if(_extra.length)logEl.prepend(..._extra);}}
}
function nf26ResetLab(){
 nodes=[];links=[];nextId=1;budget=1000000;selected=null;pendingPort=null;connectMode=false;lastPing=null;
 won=false;missionConfig=null;incident=null;powerOut=false;hostInstalled=false;guests=[];
 upsInstalled=false;cableProtected=false;acInstalled=false;temp=24;
 const cb=$('#connectBtn');if(cb){cb.classList.remove('good');cb.textContent='🔌 Hubungkan kabel'}
 render();updateStats();
}
function nf26Template(kind){
 const cfg=(type,name,ip)=>({name,mode:'static',ip,prefix:'24',gateway:type==='router'?'':'192.168.10.1',dns:'8.8.8.8',iface:'eth0'});
 const mk=(id,type,x,y,name,ip)=>({id,type,x,y,broken:false,config:cfg(type,name,ip)});
 let nd=[],lk=[];
 if(kind==='direct'){
   nd=[mk(1,'router',50,22,'Router-01','192.168.10.1'),mk(2,'pc',50,69,'PC-01','192.168.10.10')];
   lk=[{a:1,b:2,portA:'LAN1',portB:'ETH0',broken:false}];
 }else if(kind==='star'){
   nd=[mk(1,'router',50,12,'Router-01','192.168.10.1'),mk(2,'switch',50,42,'Switch-01',''),mk(3,'pc',23,78,'PC-01','192.168.10.10'),mk(4,'pc',50,78,'PC-02','192.168.10.11'),mk(5,'pc',77,78,'PC-03','192.168.10.12')];
   lk=[{a:1,b:2,portA:'LAN1',portB:'LAN1',broken:false},
       {a:2,b:3,portA:'LAN2',portB:'ETH0',broken:false},
       {a:2,b:4,portA:'LAN3',portB:'ETH0',broken:false},
       {a:2,b:5,portA:'LAN4',portB:'ETH0',broken:false}];
 }else if(kind==='server'){
   nd=[mk(1,'router',50,12,'Router-01','192.168.10.1'),mk(2,'switch',50,42,'Switch-01',''),mk(3,'pc',25,79,'PC-01','192.168.10.10'),mk(4,'server',75,79,'Server-01','192.168.10.20')];
   lk=[{a:1,b:2,portA:'LAN1',portB:'LAN1',broken:false},
       {a:2,b:3,portA:'LAN2',portB:'ETH0',broken:false},
       {a:2,b:4,portA:'LAN3',portB:'ETH0',broken:false}];
 }else if(kind==='broken'){
   nd=[mk(1,'router',50,12,'Router-01','192.168.10.1'),mk(2,'switch',50,43,'Switch-01',''),mk(3,'pc',24,78,'PC-01','192.168.10.10'),mk(4,'pc',76,78,'PC-02','192.168.11.11')];
   lk=[{a:1,b:2,portA:'LAN1',portB:'LAN1',broken:false},
       {a:2,b:3,portA:'LAN2',portB:'ETH0',broken:false},
       {a:2,b:4,portA:'LAN3',portB:'ETH0',broken:true}];
 }
 if(nd.length){nodes=nd;links=lk;nextId=Math.max(...nodes.map(n=>n.id))+1;selected=null;pendingPort=null;
   render();updateStats();log('Lab memuat template '+kind+'.');
   if(kind==='broken')say('Iga menemukan kabel bermasalah dan IP berbeda subnet. Coba perbaiki keduanya!', 'think');
   else say('Topologi '+kind+' siap. Uji koneksi melalui terminal, atau ubah konfigurasi untuk bereksperimen!','success');
 }
}
window.NetForgeLab={
 enter(mode){
   if(!nf26LabActive){nf26MissionSnapshot.value=nf26Snapshot();nf26LabActive=true;nf26ResetLab()}
   nf26LabMode=mode;missionConfig=null;updateObjectives();
   $('#missionCode').textContent='NETWORK LAB · SANDBOX';
   $('#missionTitle').textContent=mode==='guided'?'Guided Lab · Jaringan Dasar':mode==='challenge'?'Challenge Lab · Troubleshooting':'Free Lab · Eksperimen Bebas';
   $('#missionDesc').textContent=mode==='guided'?'Susun perangkat, atur IP, dan lakukan pengujian koneksi.':'Eksperimen bebas dengan router, switch, PC, server, port dan kabel.';
   if(mode==='challenge')$('#missionDesc').textContent='Temukan kabel rusak dan IP PC-02 yang tidak sesuai subnet. Perbaiki lalu lakukan ping.';
   $('#missionMeta').textContent='Sesi LAB independen • XP misi tetap aman';
   $('#nextMissionBtn').style.display='none';$('#newContractBtn').style.display='none';
   log('Masuk Network Lab · '+mode);say('Selamat datang di Lab! Kita bisa bereksperimen tanpa mengorbankan progres Misi.');
   return true;
 },
 leave(){
   if(!nf26LabActive)return;
   if(nf26MissionSnapshot.value){nf26Restore(nf26MissionSnapshot.value);nf26MissionSnapshot.value=null}
   nf26LabActive=false;nf26LabMode='free';
   if(missionConfig){
     $('#missionCode').textContent='NETWORKING FUNDAMENTALS · '+String(mission).padStart(2,'0')+'/05';
     $('#missionTitle').textContent='Mission '+String(mission).padStart(2,'0')+' · '+missionConfig.title;
     $('#missionDesc').textContent=missionConfig.brief;
     $('#missionMeta').textContent='Learning path · '+missionConfig.type.toUpperCase();
   }
   render();updateStats();if(typeof updateBudgetUI==='function')updateBudgetUI();log('Kembali ke Misi.');
 },
 active(){return nf26LabActive},mode(){return nf26LabMode},
 template(kind){if(nf26LabActive)nf26Template(kind)},
 clear(){if(nf26LabActive){nf26ResetLab();log('Canvas Lab dikosongkan. Progres misi tetap tersimpan.')}},
 export(){return JSON.stringify({format:'NETFORGE-LAB',version:1,created:new Date().toISOString(),nodes,links,nextId},null,2)},
 import(raw){
   if(!nf26LabActive)throw Error('Buka Lab terlebih dahulu.');
   const data=typeof raw==='string'?JSON.parse(raw):raw;
   if(data.format!=='NETFORGE-LAB'||data.version!==1||!Array.isArray(data.nodes)||!Array.isArray(data.links))throw Error('Format file bukan NETFORGE-LAB v1.');
   if(data.nodes.length>60||data.links.length>150)throw Error('Topologi terlalu besar.');
   const validTypes=['router','switch','pc','server'];const ids=new Set();
   const cleaned=data.nodes.map(n=>{
     if(!Number.isSafeInteger(n.id)||n.id<1||ids.has(n.id)||!validTypes.includes(n.type))throw Error('Perangkat tidak valid/ID duplikat.');
     ids.add(n.id);
     if(!Number.isFinite(n.x)||!Number.isFinite(n.y)||n.x<0||n.x>100||n.y<0||n.y>100)throw Error('Posisi perangkat tidak valid.');
     const c=n.config||{};
     return {id:n.id,type:n.type,x:n.x,y:n.y,broken:!!n.broken,config:{name:String(c.name||'').slice(0,50),mode:c.mode==='dhcp'?'dhcp':'static',ip:String(c.ip||'').slice(0,45),prefix:String(c.prefix||24).slice(0,2),gateway:String(c.gateway||'').slice(0,45),dns:String(c.dns||'').slice(0,45),vlan:String(c.vlan||'').slice(0,10)}};
   });
   const used=new Set();
   const cleanedLinks=data.links.map(l=>{
     if(!ids.has(l.a)||!ids.has(l.b)||l.a===l.b)throw Error('Kabel menuju perangkat tidak valid.');
     const a=cleaned.find(n=>n.id===l.a),b=cleaned.find(n=>n.id===l.b);
     if(!validLink(a.type,b.type)||!portNames(a).includes(l.portA)||!portNames(b).includes(l.portB))throw Error('Pasangan perangkat atau port tidak valid.');
     for(const key of [l.a+':'+l.portA,l.b+':'+l.portB]){if(used.has(key))throw Error('Port dipakai lebih dari sekali.');used.add(key)}
     return {a:l.a,b:l.b,portA:l.portA,portB:l.portB,broken:!!l.broken};
   });
   nodes=cleaned;links=cleanedLinks;nextId=Math.max(0,...cleaned.map(n=>n.id))+1;selected=null;pendingPort=null;
   render();updateStats();/* v0.40.92: jangan klaim sukses bila tidak ada yang dimuat (audit live v0.40.90 butir 3f: resume tanpa cadangan menulis "Topologi Lab berhasil dimuat." padahal 0 perangkat). */if(nodes.length)log('Topologi Lab berhasil dimuat.');else log('Tidak ada topologi Lab yang dimuat (cadangan kosong).');return nodes.length;
 },
 assess(){
   const router=nodes.find(n=>n.type==='router');const pc=nodes.filter(n=>n.type==='pc');
   const wired=!!router&&pc.length>=2&&pc.every(n=>pathBetween(n.id,router.id));
   const noBad=links.every(l=>!l.broken);
   const ips=[...(router?[router]:[]),...pc].map(n=>n.config&&n.config.ip||'');
   const configured=ips.every(ip=>!!ipv4Parts(ip))&&new Set(ips).size===ips.length;
   const subnet=!!router&&pc.length>=2&&pc.every(n=>n.config&&sameSubnet(n.config.ip,router.config&&router.config.ip,24)&&n.config.gateway===router.config.ip);
   return {wired,noBad,configured,subnet,pass:wired&&noBad&&configured&&subnet};
 }
};

function reset(){startCampaignMission(mission||1);try{xp=Math.max(0,Number(localStorage.getItem('netforge.local.xp.v1'))||0)}catch{xp=0}updateStats();log('Misi diulang dari awal.');}

document.querySelectorAll('.device').forEach(el=>el.addEventListener('click',()=>{let type=el.dataset.type;let idx=nodes.length;let spots=[[20,28],[50,25],[80,28],[25,70],[50,72],[78,70],[38,48],[65,50]];let p=spots[idx%spots.length];addNode(type,p[0],p[1])}));$('#connectBtn').onclick=()=>{connectMode=!connectMode;selected=null;pendingPort=null;$('#connectBtn').classList.toggle('good',connectMode);$('#connectBtn').textContent=connectMode?'✋ Exit connect mode':'🔌 Hubungkan kabel';$('#modeHint').textContent=connectMode?'Klik port LAN/ETH sumber, lalu port tujuan.':'Pilih perangkat dari inventory untuk mulai.';toast(connectMode?'Mode koneksi port aktif. Pilih port sumber.':'Mode koneksi selesai.');render()};$('#pingBtn').onclick=()=>runNetworkTest(false);$('#traceBtn').onclick=()=>runNetworkTest(true);$('#validateBtn').onclick=()=>{if(!missionConfig){toast('Mulai misi terlebih dahulu.');say('Klik Start Mission untuk memulai kontrak.');return}toast('Memeriksa objective jaringan...');validate()};$('#removeBtn').onclick=()=>{if(!selected){toast('Pilih perangkat di workspace terlebih dahulu.');return}nf364Checkpoint();let id=selected;nodes=nodes.filter(n=>n.id!==id);links=links.filter(l=>l.a!==id&&l.b!==id);selected=null;render();log('Perangkat dihapus dari workspace.');say('Perangkat dilepas. Kabel yang terhubung ikut terhapus.');};$('#resetBtn').onclick=()=>{if(confirm('Reset seluruh perangkat dan mulai ulang misi?'))reset()};$('#chaosBtn').onclick=triggerChaos;
$('#motionToggle').onclick=()=>{const off=document.body.classList.toggle('motion-off');$('#motionToggle').textContent=off?'⏸️ Animasi: Nonaktif':'✨ Animasi: Aktif';$('#motionToggle').setAttribute('aria-pressed',String(!off));toast(off?'Animasi dinonaktifkan':'Animasi diaktifkan')};$('#upsBtn').onclick=()=>{if(upsInstalled)return;if(budget<150){toast('Dana tidak cukup untuk membeli UPS.');return}budget-=150;upsInstalled=true;updateStats();log('UPS dipasang. Sistem memiliki cadangan daya sementara.');say('UPS terpasang! Saat listrik padam, kita punya waktu untuk recovery.');toast('UPS INSTALLED!')};$('#cableBtn').onclick=()=>{if(cableProtected)return;if(budget<100){toast('Dana tidak cukup untuk cable protector.');return}budget-=100;cableProtected=true;updateStats();log('Cable protector dipasang. Risiko kerusakan kabel oleh hewan berkurang.');say('Kabel sekarang lebih terlindungi. Semoga tikus mencari camilan lain.');toast('CABLE PROTECTION ACTIVE!')};$('#hostBtn').onclick=()=>{if(hostInstalled)return;if(budget<250){toast('Dana tidak cukup untuk host Proxmox.');return}budget-=250;hostInstalled=true;updateStats();render();log('Proxmox VE berhasil dipasang pada physical server.');say('Proxmox aktif! Sekarang kita bisa membuat VM dan LXC.');toast('PROXMOX HOST ONLINE!')};$('#vmBtn').onclick=()=>deployGuest('vm');$('#lxcBtn').onclick=()=>deployGuest('lxc');$('#dockerBtn').onclick=()=>deployGuest('docker');$('#acBtn').onclick=()=>{if(acInstalled){toast('AC sudah terpasang.');return}if(budget<220){toast('Dana tidak cukup untuk memasang AC.');return}budget-=220;acInstalled=true;temp=Math.max(24,temp-5);updateStats();log('AC ruang server dipasang. Temperatur mulai terkendali.');say('Akhirnya server room adem. Server juga butuh lingkungan yang nyaman!');toast('SERVER AC INSTALLED!')};
$('#pveTestBtn').onclick=testPveNetwork;['pveHostname','pveIP','pveGateway','pveDNS','pveBridge','pveUplink','pveGuestBridge'].forEach(id=>{const el=$('#'+id);el.addEventListener('input',()=>updateObjectives());el.addEventListener('change',()=>updateObjectives())});document.querySelectorAll('[data-diff]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-diff]').forEach(x=>x.classList.remove('active'));b.classList.add('active');diff=b.dataset.diff});$('#nextMissionBtn').onclick=()=>{if(mission<6)startCampaignMission(mission+1)};$('#newContractBtn').onclick=()=>startCampaignMission(6);$('#startBtn').onclick=()=>{$('#startModal').classList.remove('open');startCampaignMission(1);updateObjectives();say(diff==='easy'?'Santai, kita mulai dari satu PC.':diff==='normal'?'Kita mulai dari dasar. Konfigurasi harus tepat.':'Perhatikan setiap detail konfigurasi. Tidak ada banyak petunjuk.');log('Networking Fundamentals dimulai · '+settings[diff].label)};window.addEventListener('resize',drawLinks);window.addEventListener('netforge:unified-mode-left',()=>{updateObjectives();});
window.addEventListener('netforge:unified-graph-changed',()=>{if(document.body.classList.contains('nf400-mixed')&&missionConfig)updateObjectives();});
window.addEventListener('netforge:unified-graph-changed',()=>{try{refreshChaosStatus()}catch{}});window.addEventListener('netforge:link-changed',()=>{try{refreshChaosStatus()}catch{}});window.addEventListener('netforge:unified-mission-opened',()=>{try{refreshChaosStatus()}catch{}});setTimeout(()=>{try{refreshChaosStatus()}catch{}},1500);setInterval(()=>{if(nodes.some(n=>n.type==='server')&&!powerOut){temp=acInstalled?Math.max(23,temp-1):Math.min(46,temp+1);updateClimate();if(temp>=38&&!incident){incident={kind:'heat'};syncChaosHeader(true);$('#eventArea').innerHTML='<div class="eventbox"><b>🔥 SERVER OVERHEATING!</b><p>Temperatur ruang server mencapai '+temp+'°C. Performa server terganggu. Pasang AC atau dinginkan ruang server.</p><button class="good" id="coolBtn">🧊 Emergency cooling · $60</button></div>';$('#coolBtn').onclick=()=>{if(budget<60){toast('Dana tidak cukup.');return}budget-=60;temp=30;incident=null;syncChaosHeader(false);$('#eventArea').textContent='Temperatur turun. Server kembali stabil sementara.';updateStats();log('Emergency cooling dilakukan. Biaya $60.');say('Server selamat! Tapi sebaiknya pasang AC permanen.');};log('Peringatan: server room overheating ('+temp+'°C).');say('Waduh, ruang server kepanasan! Kita harus segera mendinginkannya.', 'panic');}}},9000);updateStats();render();

/* v0.31.1 unified autosave bridge; inserted inside the simulation closure. */
const NF31_MISSION='netforge.mission.autosave.v031';
const NF31_LAB='netforge.lab.autosave.v031';
let nf31Paused=false,nf31LastMission='',nf31LastLab='';
function nf31ValidatedMission(p){
 if(!p||typeof p!=='object'||!Array.isArray(p.nodes)||!Array.isArray(p.links)||p.nodes.length>60||p.links.length>150)throw Error('Topologi Misi tidak valid');
 if(!Number.isInteger(p.mission)||p.mission<1||p.mission>6||!Number.isFinite(p.budget)||!Number.isFinite(p.xp)||p.xp<0||!Number.isInteger(p.nextId))throw Error('Progres Misi tidak valid');
 if(!p.missionConfig||typeof p.missionConfig!=='object'||!Number.isInteger(p.missionConfig.id)||p.missionConfig.id!==p.mission||typeof p.missionConfig.title!=='string'||typeof p.missionConfig.brief!=='string'||typeof p.missionConfig.type!=='string')throw Error('Kontrak Misi tidak valid');
 const ids=new Set();
 for(const n of p.nodes){if(!n||!Number.isSafeInteger(n.id)||n.id<1||ids.has(n.id)||!defs[n.type]||!Number.isFinite(n.x)||!Number.isFinite(n.y)||n.x<0||n.x>100||n.y<0||n.y>100)throw Error('Perangkat Misi tidak valid');ids.add(n.id)}
 for(const l of p.links){if(!l||!ids.has(l.a)||!ids.has(l.b)||l.a===l.b||typeof l.portA!=='string'||typeof l.portB!=='string')throw Error('Kabel Misi tidak valid')}
 return p;
}
function nf31SnapshotMission(){return nf26LabActive?(nf26MissionSnapshot.value||null):(missionConfig?nf26Snapshot():null)}
// v0.40.72: nf365SaveWithRotation sempat tidak terdefinisi sehingga setiap
// autosave Misi melempar ReferenceError dan chip menampilkan "Penyimpanan
// tidak tersedia" padahal penyimpanan berfungsi. Rotasi: simpan cadangan
// sebelumnya sebelum menimpa autosave aktif.
const NF365_BACKUP_MISSION='netforge.mission.previous.v0365';
const NF365_BACKUP_LAB='netforge.lab.previous.v0365';
function nf365SaveWithRotation(key,backupKey,encoded){try{const prev=localStorage.getItem(key);if(prev){try{const parsed=JSON.parse(prev);if(parsed&&parsed.schema===1)localStorage.setItem(backupKey,prev)}catch{}}}catch{}localStorage.setItem(key,encoded);}
function nf31Save(){
 if(nf31Paused)return;
 let failed=false;
 try{
   const m=nf31SnapshotMission();
   if(m){const encoded=JSON.stringify({format:'NETFORGE-MISSION',schema:1,savedAt:new Date().toISOString(),progress:m});
   const fingerprint=JSON.stringify(m);
   if(fingerprint!==nf31LastMission){nf365SaveWithRotation(NF31_MISSION,NF365_BACKUP_MISSION,encoded,'mission');nf31LastMission=fingerprint}}
 }catch(err){failed=true}
 try{
   if(nf26LabActive){const lab=window.NetForgeLab;
     if(lab){const payload=lab.export(), plain=JSON.parse(payload);delete plain.created;const fingerprint=JSON.stringify(plain)+'|'+lab.mode();
       if(fingerprint!==nf31LastLab){nf365SaveWithRotation(NF31_LAB,NF365_BACKUP_LAB,JSON.stringify({format:'NETFORGE-LAB-AUTOSAVE',schema:1,mode:lab.mode(),savedAt:new Date().toISOString(),payload:JSON.parse(payload)}),'lab');nf31LastLab=fingerprint}
       /* v0.40.92: simpan juga topologi Guided Lab (unified) — autosave Lab di atas hanya menyimpan export() klasik yang KOSONG di mode mixed, sehingga topologi Guided tidak pernah tersimpan (B1). Helper ini punya penjaga fingerprint sendiri (hanya menulis bila graf berubah) dan no-op bila mode bukan guided. */
       try{if(window.NetForgeGuidedTopologySave)window.NetForgeGuidedTopologySave();}catch(_e){}}
   }
 }catch(err){failed=true}
 const chip=document.getElementById('nf31Status');if(chip)chip.textContent=failed?'⚠ Penyimpanan tidak tersedia':'✓ Autosave aktif';
}
function nf31ReadMission(){
 try{const raw=localStorage.getItem(NF31_MISSION);if(!raw)return null;const d=JSON.parse(raw);if(d.format!=='NETFORGE-MISSION'||d.schema!==1||!Number.isFinite(Date.parse(d.savedAt)))return null;return {savedAt:d.savedAt,progress:nf31ValidatedMission(d.progress)}}catch{return null}
}
function nf31Resume(){
 const d=nf31ReadMission();if(!d)return false;
 if(nf26LabActive){if(typeof window.NetForgeLabLeaveUI==='function')window.NetForgeLabLeaveUI();else window.NetForgeLab.leave();}
 nf26Restore(d.progress);nf31LastMission=JSON.stringify(d.progress);
 $('#missionCode').textContent=(mission<=5?'NETWORKING FUNDAMENTALS · ':'NETWORK ADMINISTRATION · ')+String(mission<=5?mission:mission-5).padStart(2,'0')+'/05';
 $('#missionTitle').textContent='Mission '+String(mission).padStart(2,'0')+' · '+missionConfig.title;
 $('#missionDesc').textContent=missionConfig.brief;
 $('#missionMeta').textContent='Learning path · '+missionConfig.type.toUpperCase()+' · Contract '+missionConfig.seed;
 $('#nextMissionBtn').style.display=won&&mission<6?'block':'none';
 $('#newContractBtn').style.display=won&&mission===6?'block':'none';
 document.querySelectorAll('[data-diff]').forEach(b=>b.classList.toggle('active',b.dataset.diff===diff));
 $('#startModal').classList.remove('open');
 updateObjectives();updateStats();render();
 // v0.59.00: "Lanjut Bermain" klasik hanya memulihkan engine klasik; canvas
 // unified tetap di default boot sehingga workspace aktif terakhir hilang.
 // Pulihkan juga workspace unified terakhir bila ada simpanan profilnya.
 try{const _up=localStorage.getItem('netforge.universal.active-profile.v1');if(_up&&['basics','smart','office','free'].includes(_up)&&window.NetForgeUniversalInventory?.openMission)window.NetForgeUniversalInventory.openMission(_up)}catch{}
 log('Progres Misi dipulihkan dari autosave.');say('Selamat datang kembali! Topologi dan konfigurasi terakhir berhasil dipulihkan.','success');
 return true;
}
window.NetForgeProgress={save:nf31Save,resume:nf31Resume,readMission:nf31ReadMission,missionKey:NF31_MISSION,labKey:NF31_LAB,pause(){nf31Paused=true},resumeSaving(){nf31Paused=false}};
setInterval(nf31Save,3000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')nf31Save()});
window.addEventListener('freeze',nf31Save);
window.addEventListener('netforge:save-now',nf31Save);
window.addEventListener('pagehide',nf31Save);
window.addEventListener('netforge:backup-imported',()=>{nf31Paused=true;const c=document.getElementById('nf31Status');if(c)c.textContent='↻ Muat ulang untuk memakai backup';});

})();

// v0.27.0 status strip: elapsed session clock and live power state.
let simStartedAt=(()=>{try{const raw=Number(localStorage.getItem('netforge.session.start.v1'));if(Number.isFinite(raw)&&Date.now()-raw<12*3600*1000)return raw}catch{}const now=Date.now();try{localStorage.setItem('netforge.session.start.v1',String(now))}catch{}return now})();
function updateSimulationStatus(){
 const elapsed=Math.max(0,Math.floor((Date.now()-simStartedAt)/1000));
 const mm=String(Math.floor(elapsed/60)).padStart(2,'0');
 const ss=String(elapsed%60).padStart(2,'0');
 const clock=document.getElementById('simClock'); if(clock) clock.textContent=mm+':'+ss;
 const led=document.getElementById('simLed'),label=document.getElementById('simStatus'),state=document.querySelector('.simstate');
 const online=typeof window.netforgePowerOnline==='function'?window.netforgePowerOnline():true;
 if(label) label.textContent=online?'Online':'Offline';
 if(state) state.classList.toggle('offline',!online);
 if(label) label.style.color=online?'#49ed9a':'#ff7889';
}
setInterval(updateSimulationStatus,1000); updateSimulationStatus();
;

/* === script:inline === */
(function(){
const btn=document.getElementById('igaHintBtn');
if(!btn)return;
const hints=[
'Pertama, tambahkan perangkat dari inventori ke area kerja. Perhatikan jumlah perangkat sesuai objective.',
'Gunakan tool kabel lalu klik dua port pada perangkat yang ingin dihubungkan.',
'Setiap perangkat pada satu jaringan perlu IP unik dan subnet mask yang sama.',
'Coba perintah ping dari PC-01 ke alamat PC-02 untuk menguji konektivitas.',
'Jika ping gagal, cek kabel, alamat IP, subnet mask, dan gateway pada perangkat.'
];
let idx=0;
btn.addEventListener('click',()=>{if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay(hints[idx++%hints.length],'think')});
})();
;

/* === script:nf25-extension === */
(()=>{
'use strict';
const get=id=>document.getElementById(id);
const dock=document.createElement('div');dock.className='nf25-dock';
dock.innerHTML=`<section class="nf25-card" id="nf25Coach" aria-label="Panduan Iga" hidden>
 <header class="nf25-head"><span class="nf25-icon">🧑‍💻</span><div><strong>IGA · Mission Coach</strong><small>PANDUAN BERDASARKAN OBJECTIVE</small></div><button class="nf25-close" id="nf25Close" aria-label="Tutup panduan">×</button></header>
 <div class="nf25-inner"><div class="nf25-kicker" id="nf25Stage">MULAI BERMAIN</div><h3 class="nf25-current" id="nf25Current">Pilih kesulitan dan mulai misi.</h3><p class="nf25-detail" id="nf25Detail">Iga akan membantu menentukan langkah berikutnya berdasarkan kondisi misi.</p>
 <div class="nf25-progress"><span id="nf25Bar"></span></div><div class="nf25-foot"><span class="nf25-count" id="nf25Count">0 / 5 objective</span><button class="nf25-action" id="nf25Action">🎯 Tunjukkan langkah</button></div>
 <div class="nf25-mini">Pintasan: <kbd>H</kbd> Iga · <kbd>R</kbd> Rapikan · <kbd>C</kbd> Kabel · <kbd>Esc</kbd> Tutup</div></div></section>
 <button class="nf25-launch" id="nf25Launch" aria-controls="nf25Coach" aria-expanded="false">💡 Iga Coach</button>`;
document.body.appendChild(dock);
const card=get('nf25Coach'), launch=get('nf25Launch');
function toggle(open){card.hidden=!open;launch.setAttribute('aria-expanded',String(open));if(open)refresh();}
launch.addEventListener('click',()=>toggle(card.hidden));get('nf25Close').addEventListener('click',()=>toggle(false));
const hints=[
 [/pasang|install|deploy|create/i,'Tambahkan perangkat yang diminta melalui panel inventori. Periksa budget sebelum memasang.','.device,#hostBtn,#vmBtn,#lxcBtn,#dockerBtn'],
 [/hubungkan|kabel|topologi/i,'Klik “Hubungkan kabel”, lalu pilih port dari dua perangkat berbeda. Perhatikan port yang sudah digunakan.','#connectBtn'],
 [/dhcp/i,'Buka konfigurasi router dengan klik dua kali, aktifkan DHCP, lalu atur klien agar memperoleh IP otomatis.','#board .node-router'],
 [/ip|gateway|subnet|dns|vlan|trunk|network|management|vmbr/i,'Klik dua kali perangkat untuk membuka konfigurasi. Gunakan IP unik dan periksa subnet, gateway, serta parameter yang disebutkan objective.','#board .node'],
 [/ping|uji|reachable/i,'Pilih workstation sumber dan tujuan pada panel pengujian, jalankan PING, lalu klik Uji jaringan untuk memeriksa objective.','#pingBtn'],
 [/ram/i,'Periksa alokasi RAM guest; totalnya tidak boleh melampaui kapasitas host.','#proxmoxLabPanel']
];
function currentState(){const isStart=get('startModal')?.classList.contains('open');if(isStart)return {title:'Pilih kesulitan dan klik Start mission',detail:'Mulai dengan EASY jika baru belajar. Setiap misi memiliki objective dan batas budget.',target:'#startBtn',done:0,total:5,stage:'SIAP BERMAIN'};
 const rows=[...document.querySelectorAll('#objectives .objective')];const total=rows.length;
 const done=rows.filter(el=>el.firstElementChild?.textContent.trim()==='✓').length;
 const remaining=rows.filter(el=>el.firstElementChild?.textContent.trim()!=='✓');
 if(!total)return {title:'Memuat misi…',detail:'Periksa mission panel di sebelah kanan.',target:'#objectives',done:0,total:5,stage:'MEMUAT'};
 if(!remaining.length)return {title:'Seluruh objective terpenuhi!',detail:'Klik “Uji jaringan” untuk mengesahkan misi dan memperoleh XP. Setelah berhasil, lanjutkan ke misi berikutnya.',target:'#validateBtn',done,total,stage:'SIAP VALIDASI'};
 const title=remaining[0].lastElementChild?.textContent.trim()||'Selesaikan objective berikutnya';
 const match=hints.find(([regex])=>regex.test(title));
 return {title,detail:match?.[1]||'Perhatikan objective berikutnya dan gunakan perangkat serta panel konfigurasi yang sesuai.',target:match?.[2]||'#objectives',done,total,stage:'LANGKAH BERIKUTNYA'};
}
let latest=null;
function refresh(){latest=currentState();get('nf25Stage').textContent=latest.stage;get('nf25Current').textContent=latest.title;get('nf25Detail').textContent=latest.detail;get('nf25Bar').style.width=Math.round(latest.done/latest.total*100)+'%';get('nf25Count').textContent=`${latest.done} / ${latest.total} objective`;}
function highlight(){refresh();const targets=latest.target.split(',');let el=targets.map(t=>document.querySelector(t)).find(Boolean);
 if(el){el.scrollIntoView({block:'nearest',behavior:'smooth'});el.classList.remove('nf25-hl');void el.offsetWidth;el.classList.add('nf25-hl');setTimeout(()=>el.classList.remove('nf25-hl'),3000);}
 if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay(latest.detail,'think');
 toggle(false);
}
get('nf25Action').addEventListener('click',highlight);
const objectives=get('objectives');if(objectives)new MutationObserver(()=>queueMicrotask(refresh)).observe(objectives,{childList:true,subtree:true,characterData:true});
const start=get('startModal');if(start)new MutationObserver(refresh).observe(start,{attributes:true,attributeFilter:['class']});
const ping=get('pingResult');let previousPing='';
function feedback(success){if(document.body.classList.contains('motion-off'))return;
 const old=document.querySelector('.nf25-flash');if(old)old.remove();const el=document.createElement('div');el.className='nf25-flash'+(success?'':' fail');el.role='status';el.textContent=success?'✅ PING BERHASIL · KONEKSI AKTIF':'⚠️ PING GAGAL · PERIKSA KONEKSI';document.body.appendChild(el);setTimeout(()=>el.remove(),1800);
 if(success){const layer=document.createElement('div');layer.className='nf25-particles';for(let i=0;i<22;i++){let p=document.createElement('i');p.className='nf25-particle';p.style.left=(8+(i*37)%85)+'vw';p.style.background=['#13d9ff','#4fffc8','#ffdc59','#9d91ff'][i%4];p.style.animationDelay=(i%7)*0.075+'s';p.style.setProperty('--dx',((i%2?1:-1)*(18+(i*19)%145))+'px');layer.appendChild(p)}document.body.appendChild(layer);setTimeout(()=>layer.remove(),2400)}
}
if(ping)new MutationObserver(()=>{const text=ping.textContent.trim();if(!text||text===previousPing)return;previousPing=text;if(ping.classList.contains('ok'))feedback(true);else if(ping.classList.contains('fail'))feedback(false);}).observe(ping,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;const t=e.target;if(t?.matches?.('input,textarea,select,[contenteditable],button'))return;
 if(e.key.toLowerCase()==='h'){toggle(card.hidden);e.preventDefault()}else if(e.key.toLowerCase()==='r'&&!get('startModal')?.classList.contains('open')){get('nf24Arrange')?.click();e.preventDefault()}else if(e.key.toLowerCase()==='c'&&!get('startModal')?.classList.contains('open')){get('connectBtn')?.click();e.preventDefault()}else if(e.key==='Escape'){toggle(false);}
});
refresh();
})();
;

/* === script:inline === */
/* v0.27.0 additive effects: never modify the network simulation state */
(function(){
'use strict';
function init(){
 const toggle=document.getElementById('nfFxToggle');
 const result=document.getElementById('pingResult');
 const terminal=document.querySelector('.terminal-dock');
 if(!toggle)return;
 let enabled=true;try{enabled=localStorage.getItem('nf252-fx')!=='off'}catch(e){}
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const toast=document.createElement('div');toast.id='nfFeedback';toast.className='nf-feedback';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.appendChild(toast);
 let timer=null,lastState='';
 function show(text,kind){
  if(!enabled||reduced)return;
  toast.textContent=text;toast.className='nf-feedback is-visible '+(kind==='ok'?'is-success':'is-error');
  clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('is-visible'),2400);
  if(terminal){terminal.classList.remove('nf-terminal-pulse');void terminal.offsetWidth;terminal.classList.add('nf-terminal-pulse')}
 }
 function refresh(){toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'✦ FX Aktif':'◌ FX Nonaktif';document.body.classList.toggle('nf-polish-no-fx',!enabled);if(!enabled)toast.classList.remove('is-visible')}
 toggle.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem('nf252-fx',enabled?'on':'off')}catch(e){}refresh()});refresh();
 if(result&&window.MutationObserver){
  // Only report on explicit success/error CSS states emitted by existing simulator.
  const observe=()=>{const state=result.classList.contains('ok')?'ok':result.classList.contains('fail')?'fail':'';
   if(state&&state!==lastState)show(state==='ok'?'✓ Ping berhasil — koneksi terverifikasi':'⚠ Ping gagal — periksa IP, kabel, dan perangkat',state);
   lastState=state;
  };
  const observer=new MutationObserver(observe);observer.observe(result,{attributes:true,attributeFilter:['class'],childList:true,characterData:true,subtree:true});observe();
 }
 const nodes=document.querySelector('.workspace')||document.querySelector('#workspace');
 if(nodes){nodes.addEventListener('click',e=>{if(!enabled||reduced)return;const n=e.target.closest&&e.target.closest('.node');if(n){n.classList.remove('nf-device-pulse');void n.offsetWidth;n.classList.add('nf-device-pulse')}})}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:inline === */
(function(){
 'use strict';
 function setup(){
   const dock=document.querySelector('.command-dock');
   const log=document.getElementById('activityDockContent');
   const target=document.getElementById('nf255LogContainer');
   const panel=document.getElementById('nf255LogDrawer');
   const scrim=document.getElementById('nf255Scrim');
   const close=document.getElementById('nf255LogClose');
   if(!dock||!log||!target||!panel||!scrim||!close) return;
   // Move the existing live DOM node: log subscriptions and updates are preserved.
   /* v0.40.38: Activity Log remains in command dock; avoid relocating it to a separate drawer. */
   const btn=document.createElement('button');
   btn.type='button';btn.id='nf255LogOpen';btn.className='nf-log-open-btn';
   btn.textContent='📟 Log Aktivitas';btn.setAttribute('aria-controls','nf255LogDrawer');
   btn.setAttribute('aria-expanded','false');
   const title=dock.querySelector('.iga-dock .dock-title');
   if(title) { title.parentElement.insertBefore(btn,title.nextSibling); }
   else { dock.parentElement.insertBefore(btn,dock); }
   function toggle(open){
     panel.hidden=!open;scrim.hidden=!open;
     btn.setAttribute('aria-expanded',String(open));
     if(open){close.focus()} else {btn.focus()}
   }
   btn.addEventListener('click',()=>{dock.querySelector('.activity-dock')?.scrollIntoView({behavior:'smooth',block:'nearest'});});
   close.addEventListener('click',()=>toggle(false));
   scrim.addEventListener('click',()=>toggle(false));
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)toggle(false)});
 }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup);
 else setup();
})();
;

/* === script:nf26-ui-script === */
(function(){
 'use strict';
 const $=s=>document.querySelector(s);
 const lab=()=>window.NetForgeLab;
 const key='netforge.lab.v026';
 let labReturnMixed=false;let nf26SavedHeader=null;/* v0.40.92: judul misi sebelum masuk Lab (dipulihkan saat keluar). */
 const nav=[...document.querySelectorAll('.topnav a')];
 const labLink=nav.find(a=>a.textContent.includes('Lab'));
 const missionLink=nav.find(a=>a.textContent.includes('Misi'));
 const shade=$('#nf26Shade');
 if(!labLink||!shade)return;
 const workspace=$('.workspace-shell');
 const toolbar=document.createElement('div'); toolbar.className='nf26-lab-toolbar';toolbar.hidden=true;
 toolbar.innerHTML='<strong>🧪 NETWORK LAB</strong><select id="nf26Template"><option value="">Pilih template…</option><option value="direct">2 perangkat langsung</option><option value="star">Topologi Star (3 PC)</option><option value="server">Jaringan Client-Server</option><option value="broken">Troubleshooting (rusak)</option></select><button id="nf26Blank">🗑️ Kosongkan</button><button id="nf26Check">✅ Periksa</button><button id="nf26Save">💾 Simpan</button><button id="nf26Load">📂 Muat</button><button id="nf26Export">⬇️ Ekspor JSON</button><button id="nf26Import">⬆️ Impor</button><button class="nf26-back" id="nf26Back">↩ Misi</button><span class="nf26-status" id="nf26Status">Mode eksperimen • data misi terpisah</span>';
 const tip=document.createElement('div');tip.className='nf26-lab-tip';tip.hidden=true;
 workspace.insertBefore(toolbar,workspace.firstChild);workspace.insertBefore(tip,toolbar.nextSibling);
 const file=document.createElement('input');file.type='file';file.accept='.json,application/json';file.hidden=true;toolbar.appendChild(file);
 const st=$('#nf26Status');
 function note(message){st.textContent=message}
 /* v0.40.92: lencana progres Guided Lab pada kartu dialog - sebelumnya kartu tidak menampilkan progres apa pun (perbaikan v0.40.86 hanya menyentuh teks coach Iga). Membaca sumber yang sama dengan panel nf27 (NetForgeGuidedProgress, fallback localStorage netforge.guided.progress.v1). Free/Challenge sengaja tanpa lencana (tidak punya sumber progres tahap). */
 function syncGuidedBadge(){var b=document.getElementById('nf26GuidedBadge');if(!b)return;/* v0.40.92: baca SELALU dari kunci localStorage (sumber kebenaran), bukan dari closure nf27 — closure tetap menyimpan progres lama setelah "Kosongkan" mode guided menghapus kuncinya langsung, sehingga lencana basi "Selesai · 5/5" padahal cadangan 0 perangkat (audit live v0.40.90 butir 8). Bila kunci tidak ada, progres memang Tahap 1/5. */var p=null;try{var raw=localStorage.getItem('netforge.guided.progress.v1');if(raw){var d=JSON.parse(raw);p={index:Number(d.index)||0,finished:!!d.finished};}}catch(_e){}if(!p)p={index:0,finished:false};var ix=Math.max(0,Math.min(4,Number(p.index)||0));b.textContent=p.finished?'Selesai · 5/5':'Tahap '+(ix+1)+' / 5';b.classList.toggle('done',!!p.finished);}
 /* v0.40.92: simpan/pulihkan topologi Guided Lab (B1) + status Iga segar saat masuk Lab (butir 3).
    Akar B1: topologi Lab hanya hidup di memori canvas unified — keluar Lab (leave) menimpanya dengan
    snapshot misi, persist() melewatkan penulisan saat Lab aktif (profil bukan 'free'), dan autosave Lab
    (nf31) hanya menyimpan export() klasik yang KOSONG di mode mixed. Jadi masuk ulang Guided Lab
    tidak punya apa pun untuk dipulihkan, dan "Kosongkan" Free Lab (yang menghapus kunci progres
    Guided) melengkapinya menjadi Tahap 1/5 + canvas kosong. Kini topologi Guided (graf unified +
    spent/budget, plus export klasik untuk mode klasik) disimpan di netforge.guided.topology.v1:
    saat meninggalkan Lab, saat autosave 3 detik (hanya bila berubah), dan saat Guided selesai.
    Dipulihkan saat masuk Guided Lab. "Ulang latihan" dan "Kosongkan" mode guided menghapus kunci ini;
    "Kosongkan" mode free/challenge TIDAK menyentuhnya. */
 const NF4088_GUIDED_TOPO_KEY='netforge.guided.topology.v1';
 let _nf88GuidedTopoFp=null;
 function saveGuidedTopology(){try{
  if(!(window.NetForgeLab&&window.NetForgeLab.active&&window.NetForgeLab.active()))return false;
  if(window.NetForgeLab.mode&&window.NetForgeLab.mode()!=='guided')return false;
  const uni=window.NetForgeUniversalInventory?.exportGraph?.()||null;
  let classic=null;try{classic=JSON.parse(window.NetForgeLab.export());if(classic)delete classic.created;}catch(_e){}
  const rec={format:'NETFORGE-GUIDED-TOPOLOGY',schema:1,savedAt:new Date().toISOString(),mode:'guided',unified:uni,classic:classic};
  const fp=JSON.stringify(rec.unified)+'|'+JSON.stringify(rec.classic);
  /* v0.40.92-fix (harness B88-4a/4c): jangan lewatkan penulisan hanya karena fingerprint sama dengan yang terakhir disimpan DALAM SESI INI — kuncinya bisa sudah dihapus sesudahnya ("Ulang latihan", "Kosongkan" guided, hapus manual), sehingga lewati-tulis = topologi hilang walau save mengembalikan true. Lewati tulis hanya bila rekaman yang TERSIMPAN benar-benar cocok. */
  try{const _st=JSON.parse(localStorage.getItem(NF4088_GUIDED_TOPO_KEY)||'null');if(_st&&_st.format==='NETFORGE-GUIDED-TOPOLOGY'&&JSON.stringify(_st.unified)+'|'+JSON.stringify(_st.classic)===fp){_nf88GuidedTopoFp=fp;return true}}catch(_e){}
  _nf88GuidedTopoFp=fp;
  localStorage.setItem(NF4088_GUIDED_TOPO_KEY,JSON.stringify(rec));return true;
 }catch(_e){return false}}
 function restoreGuidedTopology(){try{
  const raw=localStorage.getItem(NF4088_GUIDED_TOPO_KEY);if(!raw)return false;
  const rec=JSON.parse(raw);if(!rec||rec.format!=='NETFORGE-GUIDED-TOPOLOGY')return false;
  if(document.body.classList.contains('nf400-mixed')){
   if(rec.unified&&Array.isArray(rec.unified.nodes)&&rec.unified.nodes.length){
    if(window.NetForgeUniversalInventory?.importGraph)window.NetForgeUniversalInventory.importGraph(rec.unified);
    _nf88GuidedTopoFp=JSON.stringify(rec.unified)+'|'+JSON.stringify(rec.classic);
    return true;
   }
   return false;
  }
  if(rec.classic&&Array.isArray(rec.classic.nodes)&&rec.classic.nodes.length){
   if(window.NetForgeLab?.import)window.NetForgeLab.import(rec.classic);
   return true;
  }
  return false;
 }catch(_e){return false}}
 window.NetForgeGuidedTopologySave=saveGuidedTopology;
 window.NetForgeGuidedTopologyRestore=restoreGuidedTopology;
 /* v0.40.92 B3: simpan topologi Guided Lab pada SETIAP perubahan graf saat Lab guided aktif — bukan hanya tiap 3 detik (autosave) dan saat leave(). Sebelumnya pekerjaan Lab yang dibuat kurang dari 3 detik sebelum reload/navigasi (mis. hapus kabel Chaos lalu reload) belum sempat tersimpan, sehingga masuk ulang Guided memulihkan snapshot lama yang masih berisi kabel Chaos LINK DOWN + kabel yang sudah dihapus (audit live v0.40.91 B3). Penjaga fingerprint di saveGuidedTopology membuat penyimpanan ini murah (lewati tulis bila graf tidak berubah) dan tidak ada rekursi (penyimpanan hanya menulis localStorage, bukan graf). Graf KOSONG sengaja dilewati di sini: penyimpanan kosong ditangani jalur eksplisit leave()/finish dan penghapusan kunci di "Kosongkan"/"Ulang latihan" — bila disimpan di sini, resetCanvas saat masuk Lab berbendera cleared akan menimpa topologi tersimpan yang sah. */
 window.addEventListener('netforge:unified-graph-changed',()=>{try{if(window.NetForgeLab&&window.NetForgeLab.active&&window.NetForgeLab.active()&&window.NetForgeLab.mode&&window.NetForgeLab.mode()==='guided'){const _g=window.NetForgeUniversalInventory?.getState?.();if(_g&&Array.isArray(_g.nodes)&&_g.nodes.length)saveGuidedTopology();}}catch(_e){}});
 /* v0.40.92: tulis status Lab saat ini ke gelembung Iga — dipanggil sinkron di akhir enter(), sehingga
    gelembung segar pada SETIAP masuk Lab walau refresh() coach (rAF / MutationObserver judul) tidak
    jalan atau jalan dengan state lama (audit live v0.40.87 butir 3: masuk ulang Guided Lab masih
    menampilkan pesan Kosongkan Free Lab). Tidak menimpa peringatan Chaos yang aktif. */
 function sayLabStatus(){try{
  if(window.NetForgeUniversalInventory?.chaosActive?.())return;
  if(typeof window.netforgeIgaSay!=='function')return;
  const lp=window.NetForgeLabProgress?window.NetForgeLabProgress():null;
  if(!lp)return;
  window.netforgeIgaSay(lp.complete?('Lab '+lp.name+': '+lp.label+' — semua selesai.'):('Lab '+lp.name+': '+lp.label+'. Berikutnya: '+(lp.goal||'')+'.'),'think');
 }catch(_e){}}
 function enter(mode){
   /* v0.40.92: bersihkan toast status link dari mode sebelumnya (nf4047) — sebelumnya toast 'Link dinonaktifkan…' dari Free Lab menempel di canvas Guided Lab (audit live v0.40.88 butir 6). */
   try{if(window.NetForgeLinkToastClear)window.NetForgeLinkToastClear();}catch(_e){}
   // v0.59.00: snapshot topologi+budget misi (unified) sebelum masuk Lab;
   // dipulihkan saat keluar Lab agar pekerjaan Lab tidak menimpa misi.
   // Snapshot hanya diambil bila belum ada — sebelumnya setiap enter()
   // menimpanya, sehingga ganti mode Lab atau masuk lagi saat Lab aktif
   // menimpa snapshot misi dengan graf Lab dan misi hilang saat keluar Lab.
   // v0.59.00: cap profil pemilik ke snapshot agar openMission()
   // saat boot tahu misi mana yang harus dipulihkan (snapshot lama
   // tanpa cap hanya bisa ditebak ke 'basics').
   try{if(!localStorage.getItem('netforge.lab.mission-snapshot.v1')){const _g=window.NetForgeUniversalInventory&&window.NetForgeUniversalInventory.exportGraph&&window.NetForgeUniversalInventory.exportGraph();if(_g){try{const _prof=window.NetForgeUniversalInventory.getProfile&&window.NetForgeUniversalInventory.getProfile();if(_prof&&['basics','smart','office'].includes(_prof))_g.profile=_prof}catch(_e2){}/* v0.40.92: sertakan kunci insiden Chaos aktif di snapshot (chaosKey) — sebelumnya importGraph() di leave() selalu mengosongkan chaosBrokenKey, sehingga insiden yang masih aktif hilang dari panel Chaos setelah Lab→Misi (audit live v0.40.89 butir 4: repair ditolak karena dana, kabel Laptop tetap LINK DOWN, panel menulis "Belum ada gangguan"). */try{const _ck=window.NetForgeUniversalInventory?.chaosIncident?.();if(_ck&&_ck.key){_g.chaosKey=_ck.key;if(_ck.animal)_g.chaosAnimal=_ck.animal;}}catch(_e3){}localStorage.setItem('netforge.lab.mission-snapshot.v1',JSON.stringify(_g))}}}catch(_e){}
   /* v0.40.92: simpan judul misi sebelum Lab menimpanya — leave() classic hanya memulihkan bila missionConfig ada (null di mode unified), sehingga judul + gelembung Iga tetap berlabel Lab setelah '↩ Misi'. */try{const _h={code:$('#missionCode')?.textContent,title:$('#missionTitle')?.textContent,desc:$('#missionDesc')?.textContent,meta:$('#missionMeta')?.textContent};if(_h.title)nf26SavedHeader=_h}catch(_e){}try{lab().enter(mode)}catch(err){alert('Lab gagal dibuka: '+err.message);return}
   // v0.59.00: bila Lab sebelumnya dikosongkan (tombol Kosongkan), mulai Lab
   // dengan canvas kosong — bukan dengan topologi misi sebagai titik awal.
   // Snapshot misi sudah diambil di atas, jadi misi tetap dipulihkan saat
   // keluar Lab.
   /* v0.40.92: bendera cleared kini menyimpan MODE Lab yang dikosongkan — sebelumnya nilainya selalu '1' sehingga "Kosongkan" di Free Lab juga mengosongkan Guided Lab berikutnya (B1). Kini hanya Lab dengan mode yang sama yang mulai kosong; bendera mode lain dibiarkan untuk masuk Lab berikutnya dengan mode itu. Nilai lama '1' tetap dihormati (kompatibel). */
   /* v0.40.92-fix (harness B88-4m): bendera cleared kini PETA mode {"free":true,"guided":true} — satu string mode kehilangan permintaan clear mode lain bila "Kosongkan" kedua menimpanya sebelum mode pertama dimasuki lagi. enter() hanya mengonsumsi entrinya sendiri; kunci dihapus bila peta kosong. Nilai lama '1' (semua mode) dan string mode tunggal tetap dihormati. */
   try{const _cf=localStorage.getItem('netforge.lab.cleared.v1');let _hit=false;if(_cf==='1'){_hit=true;localStorage.removeItem('netforge.lab.cleared.v1')}else if(_cf){try{const _m=JSON.parse(_cf);if(_m&&typeof _m==='object'){if(_m[mode]){_hit=true;delete _m[mode];if(Object.keys(_m).length)localStorage.setItem('netforge.lab.cleared.v1',JSON.stringify(_m));else localStorage.removeItem('netforge.lab.cleared.v1')}}}catch(_e2){if(_cf===mode){_hit=true;localStorage.removeItem('netforge.lab.cleared.v1')}}}if(_hit&&window.NetForgeUniversalInventory?.resetCanvas)window.NetForgeUniversalInventory.resetCanvas()}catch(_e){}
   /* v0.40.92: pulihkan topologi Guided Lab yang tersimpan (B1) — lihat saveGuidedTopology di atas. */
   var _nf4092GuidedRestored=false;try{if(mode==='guided'&&window.NetForgeGuidedTopologyRestore)_nf4092GuidedRestored=!!window.NetForgeGuidedTopologyRestore();}catch(_e){}
   /* v0.40.92 B1: masuk Guided Lab TANPA cadangan tersimpan HARUS menampilkan canvas Lab kosong — sebelumnya bila tidak ada topologi Guided (mis. setelah "Ulang latihan" yang menghapus kuncinya) DAN tidak ada bendera cleared (Ulang latihan tidak menyetelnya), canvas unified yang sedang aktif (workspace misi: 5 perangkat, budget $-35) tetap terpasang di bawah panel Guided, sehingga "Periksa tahap" menilai perangkat misi (audit live v0.40.91 B1: Tahap 1 GAGAL di canvas Free Lab berisi Router/Switch/PC/Laptop tapi LULUS di canvas Misi dengan perangkat yang sama). resetCanvas() di sini aman: snapshot misi sudah diambil di atas (dipulihkan saat keluar Lab), dan bila ada topologi tersimpan restore di atas sudah mengembalikannya (tidak di-reset). */
   try{if(mode==='guided'&&!_nf4092GuidedRestored&&window.NetForgeUniversalInventory?.resetCanvas)window.NetForgeUniversalInventory.resetCanvas();}catch(_e){}
   shade.hidden=true;toolbar.hidden=false;
   labLink.classList.add('active');if(missionLink)missionLink.classList.remove('active');
   if(mode==='guided'){
     tip.hidden=false;tip.textContent='🎓 GUIDED: Bangun topologi sendiri sesuai tahapan Iga. Ikuti panduan di atas workspace. Topologi Lab yang sudah ada dipertahankan; gunakan Ulang latihan untuk mulai dari kosong.';
   }else if(mode==='challenge'){
     lab().template('broken');tip.hidden=false;tip.textContent='🛠️ CHALLENGE: PC-02 berbeda subnet dan kabel ke PC-02 rusak. Klik kabel rusak untuk memperbaiki, lalu konfigurasi IP PC-02 menjadi 192.168.10.11/24 dan tes ping.';
   }else{tip.hidden=false;tip.textContent='🧩 FREE LAB: Klik inventori untuk menambah perangkat, aktifkan mode kabel, klik port, konfigurasikan IP dengan klik dua kali pada perangkat.'}
   labReturnMixed=document.body.classList.contains('nf400-mixed');note('Lab '+mode+' aktif');if(typeof updateStats==='function')updateStats();
   $('#nf26Template').value='';
   /* v0.40.92: segarkan panel yang hanya mendengarkan perubahan graf/misi saat masuk Lab — validator (panel Objective) dan coach Iga tidak punya pemicu masuk-Lab, sehingga panel Objective masih menampilkan status misi lama sampai ada perubahan graf dan gelembung bisa mempertahankan pesan Lab sebelumnya (audit live v0.40.87 butir 1 & 3). Event ini sinkron menyegarkan validator render(), nf4034 refresh(), dan nf4040 sync(). */
   try{window.dispatchEvent(new CustomEvent('netforge:unified-graph-changed'))}catch(_e){}
   try{sayLabStatus()}catch(_e){}
 }
  function leave(){/* v0.40.92: tangkap insiden Chaos yang masih hidup SEBELUM snapshot dipulihkan (dipakai di bawah) — snapshot ditulis saat enter(), sebelum Chaos di Lab terjadi, jadi tidak mengenal insiden ini. */const _liveChaos=(window.NetForgeUniversalInventory&&window.NetForgeUniversalInventory.chaosIncident)?window.NetForgeUniversalInventory.chaosIncident():null;/* v0.40.92: bersihkan toast status link dari Lab (lihat enter()). */try{if(window.NetForgeLinkToastClear)window.NetForgeLinkToastClear();}catch(_e){}/* v0.40.92: simpan topologi Guided Lab SEBELUM snapshot misi dipulihkan — leave() menimpa canvas dengan topologi misi, jadi ini saat terakhir graf Lab masih utuh. Tanpa ini, topologi Guided hanya tersimpan bila autosave 3 detik sempat jalan. */try{if(window.NetForgeGuidedTopologySave)window.NetForgeGuidedTopologySave();}catch(_e){}lab().leave();/* v0.40.92: pulihkan judul misi yang disimpan saat masuk Lab — SEBELUM event unified-mission-opened, agar refresh() Iga membaca judul misi (bukan label Lab). */if(nf26SavedHeader){const _h=nf26SavedHeader;nf26SavedHeader=null;if(_h.code!=null&&$('#missionCode'))$('#missionCode').textContent=_h.code;if(_h.title!=null&&$('#missionTitle'))$('#missionTitle').textContent=_h.title;if(_h.desc!=null&&$('#missionDesc'))$('#missionDesc').textContent=_h.desc;if(_h.meta!=null&&$('#missionMeta'))$('#missionMeta').textContent=_h.meta;}
    // v0.59.00: pulihkan snapshot misi (topologi+budget) yang disimpan saat masuk Lab.
    try{const _raw=localStorage.getItem('netforge.lab.mission-snapshot.v1');if(_raw){const _g=JSON.parse(_raw);if(window.NetForgeUniversalInventory&&window.NetForgeUniversalInventory.importGraph){window.NetForgeUniversalInventory.importGraph(_g);/* v0.40.92: pulihkan penanda insiden Chaos dari snapshot bila kabelnya masih LINK DOWN (chaosRebind) — importGraph() mengosongkan penanda itu (audit live v0.40.89 butir 4). */try{if(_g.chaosKey&&window.NetForgeUniversalInventory.chaosRebind)window.NetForgeUniversalInventory.chaosRebind(_g.chaosKey)}catch(_e2){}/* v0.40.92: bila penanda masih hilang, pulihkan insiden yang hidup saat leave() (Chaos yang dipicu DI DALAM Lab — snapshot pra-Lab tidak mengenalnya dan graf snapshot berisi kabel LINK UP; audit live v0.40.90 butir 1). chaosRestoreLive menonaktifkan lagi kabel yang sama di graf misi + menandai flag-nya, sehingga panel Chaos tetap menampilkan insiden sampai benar-benar diperbaiki. */try{if(!(window.NetForgeUniversalInventory.chaosActive&&window.NetForgeUniversalInventory.chaosActive())&&_liveChaos&&window.NetForgeUniversalInventory.chaosRestoreLive)window.NetForgeUniversalInventory.chaosRestoreLive(_liveChaos);}catch(_e4){}}localStorage.removeItem('netforge.lab.mission-snapshot.v1')}}catch(_e){}
    toolbar.hidden=true;tip.hidden=true;if(missionLink)missionLink.classList.add('active');labLink.classList.remove('active');if(labReturnMixed){labReturnMixed=false;try{if(window.NetForgeUniversalInventory?.setMode)window.NetForgeUniversalInventory.setMode('mixed')}catch{}}if(typeof updateStats==='function')updateStats();if(typeof updateBudgetUI==='function')updateBudgetUI();/* v0.40.92: beri tahu coach Iga bahwa misi kembali aktif — sebelumnya keluar Lab tidak memicu refresh() nf4034 (hanya MutationObserver judul/objective, yang tidak menulis gelembung bila misi sudah lulus), sehingga gelembung tetap menampilkan pesan Lab ('Misi Free Lab · Eksperimen Bebas'). Event yang sama dipakai openMission, jadi validator dan panel lain ikut segar. */try{window.dispatchEvent(new CustomEvent('netforge:unified-mission-opened',{detail:{profile:window.NetForgeUniversalInventory?.getProfile?.()||'basics'}}))}catch(_e){}}
 // v0.59.00: expose leave() agar openMission()/resume bisa keluar Lab lewat
 // jalur UI (snapshot misi dipulihkan), bukan hanya classic leave().
 window.NetForgeLabLeaveUI=leave;
 labLink.href='#';labLink.addEventListener('click',e=>{e.preventDefault();if(lab().active())return;shade.hidden=false;syncGuidedBadge();/* v0.40.92: segarkan lencana tiap kali dialog Lab dibuka. */});
 if(missionLink)missionLink.addEventListener('click',e=>{if(lab().active()){e.preventDefault();leave();}});
 $('#nf26Cancel').addEventListener('click',()=>shade.hidden=true);
 shade.addEventListener('click',e=>{if(e.target===shade)shade.hidden=true});
 document.querySelectorAll('[data-nfmode]').forEach(b=>b.addEventListener('click',()=>enter(b.dataset.nfmode)));
 window.addEventListener('netforge:guided-progress',()=>{try{syncGuidedBadge()}catch(_e){}});syncGuidedBadge();/* v0.40.92: lencana kartu dialog segar saat progres Guided berubah. */
 $('#nf26Back').onclick=leave;
 $('#nf26Template').onchange=e=>{if(e.target.value){lab().template(e.target.value);note('Template '+e.target.selectedOptions[0].text+' dimuat')}};
 let _nf26BlankArmedAt=0;$('#nf26Blank').onclick=()=>{const _btn=$('#nf26Blank');if(!_btn||Date.now()-_nf26BlankArmedAt>10000){_nf26BlankArmedAt=Date.now();if(_btn){_btn.dataset.armed='1';_btn.textContent='⚠ Yakin kosongkan? Klik lagi (10 dtk)'}note('Klik Kosongkan sekali lagi dalam 10 detik untuk mengonfirmasi.');setTimeout(()=>{if(Date.now()-_nf26BlankArmedAt>=10000&&_btn&&_btn.isConnected){_btn.dataset.armed='';_btn.textContent='🗑️ Kosongkan'}},10100);return;}_nf26BlankArmedAt=0;if(_btn){_btn.dataset.armed='';_btn.textContent='🗑️ Kosongkan'}lab().clear();/* v0.40.92: Kosongkan dulunya hanya membersihkan state klasik (nodes/links/budget) — canvas unified tetap menampilkan perangkat dan autosave Lab memulihkan semuanya saat masuk lagi. Kini: hapus kunci simpanan eksperimen Lab, bersihkan canvas unified, hapus progres panduan, dan tandai agar Lab berikutnya mulai kosong. Misi tetap aman (snapshot misi dipulihkan saat keluar Lab). *//* v0.40.92: Kosongkan hanya menghapus simpanan mode Lab yang SEDANG aktif — sebelumnya kunci progres Guided (netforge.guided.progress.v1) ikut dihapus walau yang dikosongkan Free Lab, dan bendera cleared '1' mengosongkan Lab berikutnya apa pun modenya, sehingga masuk ulang Guided menunjukkan Tahap 1/5 + canvas kosong padahal lencana/validator masih mencatat Selesai · 5/5 (audit live v0.40.87 B1). Kini: progres + topologi Guided hanya dihapus bila mode aktif 'guided'; autosave Lab dipertahankan bila isinya mode 'guided'; bendera cleared menyimpan mode. Gelembung Iga juga ditulis eksplisit di sini (bukan hanya lewat refresh coach) agar pesan Kosongkan tidak tertinggal setelah aksi lain. */try{const _m=lab().mode();const _keys=['netforge.lab.v026'];let _keepAutosave=false;try{const _as=JSON.parse(localStorage.getItem('netforge.lab.autosave.v031')||'null');if(_as&&_as.mode==='guided')_keepAutosave=true;}catch(_e){}if(!_keepAutosave)_keys.push('netforge.lab.autosave.v031','netforge.lab.previous.v0365');if(_m==='guided')_keys.push('netforge.guided.progress.v1','netforge.guided.topology.v1');_keys.forEach(k=>localStorage.removeItem(k));}catch(_e){}try{if(window.NetForgeUniversalInventory?.resetCanvas)window.NetForgeUniversalInventory.resetCanvas()}catch{}try{const _cm=lab().mode()||'free';let _map={};try{const _old=localStorage.getItem('netforge.lab.cleared.v1');if(_old==='1')_map={free:true,guided:true,challenge:true};else if(_old){let _p=null;try{_p=JSON.parse(_old)}catch(_e2){}if(_p&&typeof _p==='object')_map=_p;else if(_old==='free'||_old==='guided'||_old==='challenge')_map[_old]=true}}catch(_e){}_map[_cm]=true;localStorage.setItem('netforge.lab.cleared.v1',JSON.stringify(_map))}catch{}try{if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay('Canvas Lab dikosongkan. Progres misi tetap tersimpan.','think')}catch(_e){}note('Canvas Lab dikosongkan. Progres misi tetap tersimpan.')};
 $('#nf26Check').onclick=()=>{
   const r=lab().assess();const items=[['Terhubung ke router',r.wired],['Semua kabel sehat',r.noBad],['IP valid & unik',r.configured],['Subnet & gateway sesuai',r.subnet]];
   note(items.map(([name,ok])=>(ok?'✅ ':'❌ ')+name).join(' • '));
   tip.hidden=false;tip.textContent=r.pass?'🏆 Semua pemeriksaan dasar berhasil! Lanjutkan tes PING untuk memvalidasi perilaku jaringan.':'💡 Iga: '+items.filter(i=>!i[1]).map(i=>i[0]).join(', ')+' perlu diperiksa.';
 };
 $('#nf26Save').onclick=()=>{try{localStorage.setItem(key,lab().export());note('Tersimpan di browser ini.')}catch(e){note('Gagal menyimpan: '+e.message)}};
 $('#nf26Load').onclick=()=>{try{const saved=localStorage.getItem(key);if(!saved)throw Error('Belum ada eksperimen tersimpan.');const n=lab().import(saved);note(n+' perangkat dimuat dari browser.')}catch(e){note('Gagal memuat: '+e.message)}};
 $('#nf26Export').onclick=()=>{const blob=new Blob([lab().export()],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='net-forge-lab.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);note('Topologi diekspor sebagai JSON.')} ;
 $('#nf26Import').onclick=()=>file.click();
 file.onchange=async()=>{if(!file.files||!file.files[0])return;try{const raw=await file.files[0].text();const n=lab().import(raw);note('Impor berhasil: '+n+' perangkat')}catch(e){note('Impor gagal: '+e.message)}finally{file.value=''}};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!shade.hidden)shade.hidden=true});
})();
;

/* === script:nf27-script === */
(function(){
'use strict';
function init(){
 const toolbar=document.querySelector('.nf26-lab-toolbar');
 if(!toolbar||!window.NetForgeLab)return;
 const coach=document.createElement('section');coach.id='nf27Coach';coach.hidden=true;
 coach.innerHTML=`<div class="nf27-top"><h3>🎓 IGA · GUIDED LAB</h3><small id="nf27Counter">Tahap 1 / 5</small></div>
 <div class="nf27-steps" id="nf27Steps"></div><div class="nf27-main"><strong id="nf27Title"></strong><p id="nf27Text"></p></div>
 <div class="nf27-actions"><button type="button" id="nf27Check">✅ Periksa tahap</button><button type="button" id="nf27Hint">💡 Petunjuk Iga</button><button type="button" id="nf27Restart">↺ Ulang latihan</button><span id="nf27Message" role="status" aria-live="polite"></span></div>
 <div class="nf27-bar"><i id="nf27Fill"></i></div>`;
 toolbar.insertAdjacentElement('afterend',coach);
 const $=id=>document.getElementById(id),lab=()=>window.NetForgeLab;
 const labels=['Perangkat','Kabel','IP unik','Subnet & Gateway','Tes Ping'];
 const steps=[
  {name:'Pasang perangkat',detail:'Tambahkan 1 Router, 1 Switch, dan minimal 2 Workstation (Desktop PC atau Laptop) dari inventori kiri. Anda harus menempatkannya sendiri di workspace.',hint:'Klik perangkat Router, Switch, dan Workstation pada inventori. Workstation perlu ditambahkan dua kali; Desktop PC dan Laptop sama-sama dihitung sebagai Workstation.'},
  {name:'Hubungkan kabel',detail:'Hubungkan Router ke Switch, lalu hubungkan setiap Workstation ke Switch. Pastikan tidak ada kabel rusak.',hint:'Klik Hubungkan kabel, pilih port LAN router ke port switch yang kosong, kemudian sambungkan masing-masing PC ke port switch lainnya.'},
  {name:'Atur alamat IP',detail:'Gunakan Router 192.168.10.1/24, PC-01 192.168.10.10/24, PC-02 192.168.10.11/24. Semua IP harus valid, unik, dan sesuai jaringan.',hint:'Klik dua kali perangkat untuk membuka konfigurasi. Pilih mode Static dan masukkan IP Address serta prefix 24.'},
  {name:'Atur gateway',detail:'Set gateway kedua Workstation ke 192.168.10.1. Periksa bahwa semua PC berada satu subnet dengan router.',hint:'Buka konfigurasi masing-masing PC. Gateway harus sama dengan alamat router. Pastikan subnet mask 255.255.255.0.'},
  {name:'Uji koneksi',detail:'Jalankan PING dari salah satu Workstation ke Router/Gateway melalui Terminal Jaringan. Semua klien harus tetap punya jalur Ethernet/Wi-Fi aktif (tidak ada kabel rusak/nonaktif dan tidak ada klien OFFLINE) — bila ada klien tanpa jalur aktif, latihan tidak dapat dinilai walau PING sudah sukses. Setelah sukses, klik Periksa tahap untuk mendapatkan hasil.',hint:'Pada Terminal Jaringan pilih sumber PC, tujuan Router/Gateway, lalu klik PING. Harus muncul hasil sukses sebelum latihan dinilai. Pastikan juga semua Workstation tetap tersambung ke Switch (tidak ada kabel rusak/nonaktif).'}
 ];
 let index=0,pingSuccess=false,finished=false,startedAt=null,lastPing='';
 // v0.59.00: progres Guided Lab disimpan di localStorage agar tidak reset
 // saat keluar Lab; dipulihkan saat masuk kembali. 'Ulang latihan' menghapusnya.
 const NF4075_PROGRESS_KEY='netforge.guided.progress.v1';
 function saveProgress(){try{localStorage.setItem(NF4075_PROGRESS_KEY,JSON.stringify({index,pingSuccess,finished,startedAt}))}catch{}}
 function loadProgress(){try{const d=JSON.parse(localStorage.getItem(NF4075_PROGRESS_KEY)||'null');if(!d||typeof d!=='object')return false;index=Math.min(4,Math.max(0,Number(d.index)||0));pingSuccess=!!d.pingSuccess;finished=!!d.finished;startedAt=d.startedAt||null;return true}catch{return false}}
 function clearProgress(){try{localStorage.removeItem(NF4075_PROGRESS_KEY)}catch{}/* v0.40.92: "Ulang latihan" juga menghapus topologi Guided yang tersimpan — tanpa ini, masuk ulang Guided setelah Ulang latihan akan memulihkan topologi lama dan bertentangan dengan "mulai dari kosong". */try{localStorage.removeItem('netforge.guided.topology.v1')}catch{}}
 function data(){try{return JSON.parse(lab().export())}catch{return {nodes:[],links:[]}}}
 function nf4073UnifiedLabNodes(){const uni=window.NetForgeUniversalInventory?.getState?.();if(!uni||!Array.isArray(uni.nodes))return {nodes:[],links:[]};const maskToPrefix=m=>{if(typeof m!=='string'||!m)return '24';const bits=m.split('.').reduce((s,o)=>s+Number(o).toString(2).replace(/0/g,'').length,0);return String(bits>=0&&bits<=32?bits:24)};/* v0.40.92: Router memakai IP efektifnya (IP eksplisit atau 192.168.10.1) — sebelumnya Router DHCP tanpa IP eksplisit dipetakan ke '' sehingga tahap 3 gagal dan Router harus di-Static-kan manual. */const nodes=uni.nodes.map(n=>({id:'u'+n.id,type:n.type,x:n.x,y:n.y,config:{ip:n.type==='router'?(validIP(n.ip||'')?n.ip:'192.168.10.1'):((n.ipMode==='static'||n.ip)?(n.ip||''):''),prefix:maskToPrefix(n.mask||'255.255.255.0'),gateway:n.gateway||'',mode:n.ipMode||((n.ip||'')?'static':'dhcp'),dhcp:n.dhcp!==false,dns:n.dns||''}}));const links=(uni.edges||[]).map(e=>({a:'u'+e.a,b:'u'+e.b,broken:!!e.disabled}));return {nodes,links}}
 // v0.59.00: Guided Lab menghitung perangkat di Unified Canvas juga — sebelumnya
 // perangkat di canvas tidak ada di state Lab, jadi tahap 1 selalu gagal.
 function state(){const u=nf4073UnifiedLabNodes();if(document.body.classList.contains('nf400-mixed')){/* v0.40.92 B2: dalam mode mixed, "Periksa tahap" menilai HANYA graf unified — itulah canvas yang ditampilkan. Sebelumnya state klasik (lab().export()) digabung dengan unified, sehingga tautan klasik yang basi/rusak (mis. dari file Lab yang dimuat, atau snapshot misi) ikut menggagalkan tahap walau semua kabel di canvas unified sudah LINK UP — pesan gagal identik dengan sebelum perbaikan (audit live v0.40.91 B2). Di luar mode mixed (papan klasik yang tampil), gabungan lama dipertahankan. */return {ns:u.nodes,ls:u.links,router:u.nodes.find(n=>n.type==='router'),sw:u.nodes.find(n=>n.type==='switch'),pcs:u.nodes.filter(n=>['pc','laptop'].includes(n.type))};}const d=data(),ns=d.nodes||[],ls=d.links||[];const allNs=[...ns,...u.nodes],allLs=[...ls,...u.links];return {ns:allNs,ls:allLs,router:allNs.find(n=>n.type==='router'),sw:allNs.find(n=>n.type==='switch'),pcs:allNs.filter(n=>['pc','laptop'].includes(n.type))}}
 function connected(ns,ls,a,b){if(!a||!b)return false;const queue=[a.id],visited=new Set([a.id]);while(queue.length){const id=queue.shift();if(id===b.id)return true;for(const l of ls){if(l.broken)continue;const v=l.a===id?l.b:l.b===id?l.a:null;if(v!=null&&!visited.has(v)){visited.add(v);queue.push(v)}}}return false}
 function validIP(ip){if(typeof ip!=='string')return false;const p=ip.split('.');return p.length===4&&p.every(x=>/^\d{1,3}$/.test(x)&&Number(x)<=255)}
 // v0.59.00: tahap 2 menuntut KABEL LANGSUNG tiap Workstation ke Switch —
 // sebelumnya connected() (BFS: jalur apa pun) sehingga Workstation yang
 // terkabel ke Router ikut dihitung "terhubung ke Switch" lewat Router, dan
 // tahap 2 lolos hanya dengan kabel Router→Switch bila topologi misi sudah
 // mengkabel PC/Laptop ke Router (terbukti di jsdom). Teks tahap memang
 // meminta kabel langsung. connected() dibiarkan (tidak dipakai lagi di sini).
 function directLink(ls,a,b){if(!a||!b)return false;return ls.some(l=>!l.broken&&((l.a===a.id&&l.b===b.id)||(l.a===b.id&&l.b===a.id)))}
 function stepValid(n){const s=state();if(n===0)return !!s.router&&!!s.sw&&s.pcs.length>=2;
 if(n===1)return !!s.router&&!!s.sw&&s.pcs.length>=2&&s.ls.every(l=>!l.broken)&&directLink(s.ls,s.router,s.sw)&&s.pcs.every(pc=>directLink(s.ls,pc,s.sw));
 if(n===2){const devices=[s.router,...s.pcs];return !!s.router&&s.pcs.length>=2&&devices.every(x=>x&&validIP(x.config?.ip)&&String(x.config?.prefix)==='24')&&new Set(devices.map(x=>x.config.ip)).size===devices.length&&s.router.config.ip==='192.168.10.1'&&s.pcs.some(pc=>pc.config.ip==='192.168.10.10')&&s.pcs.some(pc=>pc.config.ip==='192.168.10.11')}
 if(n===3){return !!s.router&&s.pcs.length>=2&&s.router.config?.ip==='192.168.10.1'&&s.pcs.every(pc=>pc.config?.gateway==='192.168.10.1'&&String(pc.config?.prefix)==='24'&&pc.config?.ip?.startsWith('192.168.10.'))}
 if(n===4){return pingSuccess&&stepValid(0)&&stepValid(1)&&stepValid(2)&&stepValid(3)}return false}
 /* v0.40.92: sebutkan pemeriksaan mana yang gagal saat "Periksa tahap" ditolak — sebelumnya pesan selalu hint tahapnya saja, sehingga Tahap 5 menyuruh mengulang PING yang sudah sukses padahal yang gagal adalah syarat tersembunyi: semua klien harus punya jalur Ethernet/Wi-Fi aktif (audit live v0.40.89 butir 2: topologi Guided yang tersimpan kehilangan kabel Laptop, Laptop OFFLINE, PING 4/4 sukses 3x tetap ditolak). Nama klien diambil dari inventory unified (nama + IP, agar dua Workstation yang bernama sama tetap bisa dibedakan); node hasil pemetaan validator tidak membawa nama. */
 function stepFailures(n){const s=state(),out=[];
  const _uni=window.NetForgeUniversalInventory?.getState?.()||{nodes:[]};
  const _nm=id=>{const _s=String(id||'').replace(/^u/,'');const _n=(_uni.nodes||[]).find(x=>String(x.id)===_s);if(!_n)return null;return (_n.name||_n.type)+(_n.ip?(' ('+_n.ip+')'):(' #'+_n.id));};
  if(n===0){if(!s.router)out.push('Router belum ada di canvas');if(!s.sw)out.push('Switch belum ada di canvas');if(s.pcs.length<2)out.push('Workstation kurang (butuh 2, baru '+(s.pcs.length||0)+')');}
  if(n===1){if(!s.router||!s.sw||s.pcs.length<2)out.push('Perangkat dasar belum lengkap (Router, Switch, 2 Workstation)');
   const _broken=s.ls.filter(l=>l.broken);_broken.forEach(l=>{out.push('Kabel '+(_nm(l.a)||'perangkat')+' ↔ '+(_nm(l.b)||'perangkat')+' masih rusak/nonaktif');});
   if(s.router&&s.sw&&!directLink(s.ls,s.router,s.sw))out.push('Router tidak ada jalur aktif ke Switch');
   s.pcs.forEach(pc=>{if(!directLink(s.ls,pc,s.sw))out.push((_nm(pc.id)||'Workstation')+' tidak ada jalur Ethernet/Wi-Fi aktif ke Switch');});}
  if(n===2){const devices=[s.router,...s.pcs].filter(Boolean);if(!s.router)out.push('Router belum ada');if(s.pcs.length<2)out.push('Workstation kurang (butuh 2)');
   devices.forEach(x=>{if(!validIP(x.config?.ip))out.push((_nm(x.id)||'Perangkat')+' belum punya IP yang valid');else if(String(x.config?.prefix)!=='24')out.push((_nm(x.id)||'Perangkat')+' memakai subnet /'+(x.config?.prefix||'?')+' (harus /24)');});
   if(s.router&&s.router.config?.ip!=='192.168.10.1')out.push('IP Router harus 192.168.10.1');if(!s.pcs.some(pc=>pc.config?.ip==='192.168.10.10'))out.push('Belum ada Workstation dengan IP 192.168.10.10');if(!s.pcs.some(pc=>pc.config?.ip==='192.168.10.11'))out.push('Belum ada Workstation dengan IP 192.168.10.11');
   const _ips=devices.map(x=>x.config?.ip).filter(Boolean);if(new Set(_ips).size!==_ips.length)out.push('Ada alamat IP yang duplikat');}
  if(n===3){if(!s.router||s.router.config?.ip!=='192.168.10.1')out.push('IP Router harus 192.168.10.1');
   s.pcs.forEach(pc=>{if(pc.config?.gateway!=='192.168.10.1')out.push((_nm(pc.id)||'Workstation')+' gateway-nya bukan 192.168.10.1');});}
  if(n===4){if(!pingSuccess)out.push('PING ke Router/Gateway belum berhasil — jalankan PING dulu dari Terminal Jaringan');
   [0,1,2,3].forEach(k=>{if(!stepValid(k))out.push('Tahap '+(k+1)+' belum terpenuhi: '+stepFailures(k).join('; '));});}
  return out;}
 function render(){coach.hidden=!(lab().active()&&lab().mode()==='guided');if(coach.hidden)return;
 $('nf27Counter').textContent=finished?'Selesai · 5/5':`Tahap ${index+1} / 5`;
 $('nf27Steps').innerHTML=labels.map((label,i)=>`<div class="nf27-step ${finished||i<index?'passed':i===index?'active':''}">${finished||i<index?'✓':i+1}. ${label}</div>`).join('');
 $('nf27Title').textContent=finished?'🏆 Praktik jaringan dasar selesai':steps[index].name;
 $('nf27Text').textContent=finished?'Anda berhasil memasang perangkat, mengonfigurasi jaringan, dan memvalidasi konektivitas melalui ping. Hasil latihan disimpan pada browser ini.':steps[index].detail;
 $('nf27Fill').style.width=(finished?100:index*20)+'%';$('nf27Check').disabled=finished;
 /* v0.40.92: beri tahu coach Iga bahwa progres Guided Lab berubah — coach membaca progres asli (bukan objective klasik yang basi) lewat NetForgeGuidedProgress. */try{window.dispatchEvent(new CustomEvent('netforge:guided-progress',{detail:{index,finished}}))}catch(_e){}
 }
 /* v0.40.92: ekspos progres Guided Lab yang sebenarnya (index/finished dari kunci netforge.guided.progress.v1) agar panel coach Iga tidak lagi menampilkan objective klasik misi terakhir sebagai progres Lab. */window.NetForgeGuidedProgress=()=>({index,finished,total:5,stepName:finished?'Selesai':steps[index].name,steps:steps.map(s=>s.name)});/* v0.40.92: sertakan nama kelima tahap agar panel Objective bisa menampilkan progres Lab per-tahap (butir 1) tanpa menduplikasi nama tahap di tempat lain. */
 function setMessage(text){$('nf27Message').textContent=text}
 function store(){const result={type:'Guided Lab',date:new Date().toISOString(),completed:true,steps:5,score:100,durationSeconds:startedAt?Math.round((Date.now()-startedAt)/1000):null};try{const key='netforge.guided.history.v027';const history=JSON.parse(localStorage.getItem(key)||'[]');history.unshift(result);localStorage.setItem(key,JSON.stringify(history.slice(0,50)));}catch(e){setMessage('Latihan selesai, tetapi riwayat lokal tidak dapat disimpan.')} }
 function say(msg,mood='think'){if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay(msg,mood)}
 $('nf27Check').addEventListener('click',()=>{if(!lab().active()||lab().mode()!=='guided')return;
 if(!stepValid(index)){const _f=stepFailures(index);const m='Belum sesuai. '+(_f.length?('Yang belum terpenuhi: '+_f.join('; ')+'.'):steps[index].hint);setMessage(m);say(m);return;}
 if(index===4){finished=true;store();/* v0.40.92: simpan topologi Guided Lab saat selesai — tanpa ini, topologi 5/5 hanya tersimpan bila autosave 3 detik / leave sempat jalan (B1). */try{if(window.NetForgeGuidedTopologySave)window.NetForgeGuidedTopologySave();}catch(_e){}setMessage('Selamat! Semua tahap berhasil. Skor: 100/100.');say('Hebat! Kamu berhasil membangun dan menguji jaringan sendiri.','success');}
 else{index++;/* v0.40.92: sebut nomor tahap yang BARU lulus — sebelumnya "Tahap berhasil!" tanpa nomor membuat counter "Tahap 2/5" (tahap BERIKUTNYA) terbaca sebagai "tahap 2 lulus". */setMessage('Tahap '+index+' berhasil! Lanjutkan ke '+steps[index].name+'.');say('Bagus! '+steps[index].detail,'success')}
 saveProgress();render()});
 $('nf27Hint').addEventListener('click',()=>{if(finished){const done='Latihan sudah selesai (5/5, skor 100/100). Klik Ulang latihan untuk berlatih lagi dari awal.';setMessage(done);say(done,'success');return}setMessage(steps[index].hint);say(steps[index].hint)});
 let restartArmed=false,restartTimer=null;
 $('nf27Restart').addEventListener('click',()=>{if(!lab().active()||lab().mode()!=='guided')return;const btn=$('nf27Restart');if(!restartArmed){restartArmed=true;if(btn)btn.textContent='⚠ Yakin ulang? Klik lagi';setMessage('Klik Ulang latihan sekali lagi untuk menghapus progres dan topologi Lab (termasuk canvas).');restartTimer=setTimeout(()=>{restartArmed=false;if(btn)btn.textContent='↺ Ulang latihan'},10000);/* v0.40.92: jendela arm 5 -> 10 detik (disamakan dengan konfirmasi dua-klik lain: Kosongkan, Hapus Kabel, update). Di browser uji yang lambat, jeda arm->konfirmasi mudah melewati 5 detik sehingga klik kedua hanya meng-arm ulang. */return;}clearTimeout(restartTimer);restartArmed=false;if(btn)btn.textContent='↺ Ulang latihan';lab().clear();try{if(window.NetForgeUniversalInventory?.resetCanvas)window.NetForgeUniversalInventory.resetCanvas()}catch{}reset();clearProgress();/* v0.40.92 B1 (lapis kedua): "Ulang latihan" juga menyetel bendera cleared untuk mode guided — sebelumnya hanya kunci progres + topologi yang dihapus, tanpa bendera, sehingga masuk ulang Guided mengandalkan tidak adanya topologi saja (audit live v0.40.91 B1). Dengan bendera ini, Lab berikutnya mulai kosong lewat jalur yang sama seperti "Kosongkan". */try{var _m92='guided',_map92={};try{var _old92=localStorage.getItem('netforge.lab.cleared.v1');if(_old92==='1')_map92={free:true,guided:true,challenge:true};else if(_old92){var _p92=null;try{_p92=JSON.parse(_old92)}catch(_e92){}if(_p92&&typeof _p92==='object')_map92=_p92;else if(_old92==='free'||_old92==='guided'||_old92==='challenge')_map92[_old92]=true;}}catch(_e){}_map92[_m92]=true;localStorage.setItem('netforge.lab.cleared.v1',JSON.stringify(_map92));}catch(_e){}say('Latihan diulang dari awal. Mulai dari tahap 1: siapkan router, switch, dan dua PC.','think');setMessage('Latihan diulang dari awal. Workspace Lab dan canvas dibersihkan. Topologi misi aman — dipulihkan saat keluar Lab.');});
 function reset(){index=0;pingSuccess=false;finished=false;startedAt=Date.now();lastPing='';saveProgress();render()}
 // Observe mode transition from existing Lab buttons; defer until underlying handler completes.
 document.querySelectorAll('[data-nfmode]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>{if(lab().active()&&lab().mode()==='guided'){if(loadProgress()){render();setMessage(finished?'Latihan sudah selesai. Klik Ulang latihan untuk mulai dari awal.':'Lanjutkan dari tahap '+(index+1)+' (progres tersimpan).')}else{reset();setMessage('Mulai dari tahap pertama.')}}else coach.hidden=true},0)));
 $('nf26Back')?.addEventListener('click',()=>{coach.hidden=true});
 document.querySelector('.topnav a')?.addEventListener('click',()=>{if(!lab().active())coach.hidden=true});
 // v0.59.00: deteksi ping sukses tidak lagi hanya lewat class 'ok' pada
 // #pingResult — Terminal unified (runTerminal) tidak pernah menyetel class
 // itu, sehingga pingSuccess tidak pernah true dan tahap 5 mustahil lulus.
 // Kini: (a) event 'netforge:ping-success' dari Terminal, (b) observer juga
 // menerima pola teks sukses, (c) teks yang sama berulang tetap dicek kelasnya.
 const ping=$('pingResult');const markPingOk=()=>{if(!lab().active()||lab().mode()!=='guided'||finished)return;pingSuccess=true;saveProgress();setMessage('Ping berhasil. Klik Periksa tahap untuk menyelesaikan latihan.');/* v0.40.92: segarkan panel Iga — sebelumnya hanya #nf27Message yang berubah, sehingga panel bantuan tetap 'Tahap 5/5 · Ping belum berhasil.' dan gelembung Iga tetap menampilkan petunjuk lama. */try{const _c=document.getElementById('nf361IgaContext');if(_c)_c.textContent='Tahap '+(index+1)+'/5 · Ping berhasil! Klik Periksa tahap untuk menyelesaikan latihan.';if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay('Ping berhasil! Klik Periksa tahap untuk menyelesaikan latihan.','success')}catch(_e){}};/* v0.40.92: nomor tahap dari closure nf27 (index+1) — sebelumnya hard-coded 'Tahap 5/5' padahal markPingOk() dipicu ping sukses di tahap berapa pun selama Guided (audit live v0.40.88 butir 7: ping di Tahap 3/5 menulis 'Tahap 5/5'). */if(ping){window.addEventListener('netforge:ping-success',()=>{markPingOk()});if(window.MutationObserver){const observer=new MutationObserver(()=>{
 if(!lab().active()||lab().mode()!=='guided'||finished)return;
 const value=ping.textContent.trim();if(value&&value!==lastPing)lastPing=value;
 if(ping.classList.contains('ok')||/4 dikirim, 4 diterima|Tujuan tercapai/.test(value))markPingOk();
 });observer.observe(ping,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['class']});}}
 /* v0.40.92: muat progres Guided Lab dari localStorage SAAT BOOT — sebelumnya loadProgress() hanya dipanggil dari handler klik [data-nfmode] (masuk Lab), sehingga sepanjang sesi sebelum masuk Lab, closure index/finished tetap default (Tahap 1/5). Akibatnya lencana dialog Lab (#nf26GuidedBadge) yang membaca NetForgeGuidedProgress() — objek truthy — tidak pernah mencapai fallback localStorage-nya, dan pada pembukaan dialog pertama setelah muat halaman lencana menunjukkan "Tahap 1 / 5" padahal penyelesaian "Selesai · 5/5" tersimpan (audit live v0.40.87 butir 2). Satu panggilan ini memperbaiki lencana, NetForgeLabProgress, dan state coach nf4034 sekaligus. */
 loadProgress();
 render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
;

/* === script:nf28ReportLogic === */
(function(){
 'use strict';
 function init(){
  const nav=Array.from(document.querySelectorAll('.topnav a'));
  const link=nav.find(a=>/laporan/i.test(a.textContent||''));
  const overlay=document.getElementById('nf28ReportOverlay');
  if(!link||!overlay)return;
  const el=id=>document.getElementById(id), historyKey='netforge.guided.history.v027';
  let rows=[];let lastFocus=null;
  function readHistory(){try{const raw=JSON.parse(localStorage.getItem(historyKey)||'[]');return Array.isArray(raw)?raw.filter(r=>r&&r.completed===true&&r.type==='Guided Lab'):[]}catch(e){el('nf28Message').textContent='Data riwayat tidak dapat dibaca. Periksa penyimpanan browser.';return []}}
  function selected(){const n=el('nf28Filter').value;const min=n==='all'?0:Date.now()-Number(n)*86400000;return rows.filter(r=>{const t=Date.parse(r.date);return Number.isFinite(t)&&(!min||t>=min)}).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date))}
  function number(val){return Number.isFinite(Number(val))?Number(val):null}
  function duration(v){const n=number(v);if(n===null||n<0)return '—';const x=Math.round(n);return `${Math.floor(x/60)}m ${String(x%60).padStart(2,'0')}s`}
  function date(v){const ms=Date.parse(v);return Number.isFinite(ms)?new Date(ms).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'}):'—'}
  function cell(text,cls){const td=document.createElement('td');td.textContent=String(text);if(cls)td.className=cls;return td}
  function draw(){const list=selected(),body=el('nf28Rows');body.replaceChildren();el('nf28Count').textContent=String(list.length);
   const scores=list.map(r=>number(r.score)).filter(x=>x!==null&&x>=0&&x<=100),times=list.map(r=>number(r.durationSeconds)).filter(x=>x!==null&&x>=0);
   el('nf28Average').textContent=scores.length?`${(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1)}/100`:'—';
   el('nf28Best').textContent=scores.length?`${Math.max(...scores)}/100`:'—';
   el('nf28Time').textContent=times.length?duration(times.reduce((a,b)=>a+b,0)/times.length):'—';
   if(!list.length){const tr=document.createElement('tr'),td=cell('Belum ada Guided Lab yang selesai untuk periode ini.','nf28-empty');td.colSpan=7;tr.appendChild(td);body.appendChild(tr);return}
   list.forEach((r,i)=>{const tr=document.createElement('tr');[
    cell(i+1),cell(date(r.date)),cell('Guided Lab'),cell(`${Number.isFinite(Number(r.steps))?r.steps:5} / 5`),cell(number(r.score)!==null?`${r.score}/100`:'—','nf28-grade'),cell(duration(r.durationSeconds)),cell('✓ Selesai')
   ].forEach(td=>tr.appendChild(td));body.appendChild(tr)})
  }
  function refresh(){rows=readHistory();draw();el('nf28Message').textContent=`${selected().length} hasil ditampilkan.`}
  function show(){lastFocus=document.activeElement;overlay.hidden=false;refresh();document.body.dataset.nf28ReportOpen='true';el('nf28Close').focus()}
  function hide(){overlay.hidden=true;delete document.body.dataset.nf28ReportOpen;if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  function quote(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"'}
  function exportFile(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  function csv(){const list=selected(),head=['Tanggal','Jenis latihan','Tahap','Nilai','Durasi (detik)','Status'];const data=list.map(r=>[r.date,'Guided Lab',r.steps,r.score,r.durationSeconds,'Selesai']);return '\uFEFF'+[head,...data].map(row=>row.map(v=>quote(v)).join(',')).join('\r\n')}
  link.href='#laporan';link.addEventListener('click',e=>{e.preventDefault();show()});
  el('nf28Close').addEventListener('click',hide);
  overlay.addEventListener('click',e=>{if(e.target===overlay)hide()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden){e.stopImmediatePropagation();hide()}});
  el('nf28Filter').addEventListener('change',()=>{draw();el('nf28Message').textContent=`${selected().length} hasil ditampilkan.`});
  el('nf28Refresh').addEventListener('click',refresh);
  el('nf28ExportCsv').addEventListener('click',()=>{exportFile('net-forge-guided-lab-report.csv',csv(),'text/csv;charset=utf-8');el('nf28Message').textContent='CSV berhasil disiapkan.'});
  el('nf28ExportJson').addEventListener('click',()=>{const data={app:'NET FORGE',version:'0.28.0',source:'Guided Lab',exportedAt:new Date().toISOString(),records:selected()};exportFile('net-forge-guided-lab-report.json',JSON.stringify(data,null,2),'application/json');el('nf28Message').textContent='JSON berhasil disiapkan.'});
  el('nf28Print').addEventListener('click',()=>window.print());
  window.addEventListener('storage',e=>{if(e.key===historyKey&&!overlay.hidden)refresh()});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
;

/* === script:nf29Logic === */
(function(){
'use strict';
function init(){
 const nav=Array.from(document.querySelectorAll('.topnav a'));
 const link=nav.find(a=>/pencapaian/i.test(a.textContent||''));
 const overlay=document.getElementById('nf29Overlay');
 if(!link||!overlay)return;
 const $=id=>document.getElementById(id);
 const key='netforge.guided.history.v027';
 const badges=[
  {id:'first',icon:'🔌',name:'First Connection',description:'Selesaikan Guided Lab pertama.',threshold:1},
  {id:'starter',icon:'🧭',name:'Network Explorer',description:'Selesaikan 3 sesi Guided Lab.',threshold:3},
  {id:'builder',icon:'🛠️',name:'Topology Builder',description:'Selesaikan 5 sesi Guided Lab.',threshold:5},
  {id:'regular',icon:'⚡',name:'Consistency Engineer',description:'Selesaikan 10 sesi Guided Lab.',threshold:10},
  {id:'expert',icon:'🏆',name:'Network Veteran',description:'Selesaikan 20 sesi Guided Lab.',threshold:20},
  {id:'swift',icon:'⏱️',name:'Quick Resolver',description:'Selesaikan Guided Lab dalam 5 menit atau kurang.',test:rs=>rs.some(r=>Number.isFinite(Number(r.durationSeconds))&&Number(r.durationSeconds)>=0&&Number(r.durationSeconds)<=300)}
 ];
 const levels=[0,200,500,900,1400,2000,2700,3500,4400,5400];
 const names=['Network Rookie','Cable Apprentice','IP Explorer','Switch Operator','Network Builder','Subnet Pathfinder','Routing Apprentice','Network Engineer','Master Technician','Forge Legend'];
 let lastFocus=null;let current=null;
 function history(){
  try{
   const raw=JSON.parse(localStorage.getItem(key)||'[]');
   if(!Array.isArray(raw))return [];
   const seen=new Set();
   return raw.filter(r=>{
    if(!r||r.completed!==true||r.type!=='Guided Lab'||!Number.isFinite(Date.parse(r.date)))return false;
    const ident=r.date+'|'+r.type;
    if(seen.has(ident))return false;
    seen.add(ident);return true;
   });
  }catch(e){$('nf29Message').textContent='Riwayat lokal tidak dapat dibaca.';return []}
 }
 function calc(){
  const records=history(),count=records.length;
  let missionXP=0;
  try{const saved=JSON.parse(localStorage.getItem('netforge.mission.autosave.v031')||'null');
  if(saved?.format==='NETFORGE-MISSION'&&saved.schema===1&&Number.isFinite(saved.progress?.xp))missionXP=Math.max(0,Math.min(999999,saved.progress.xp));}catch{}
  const xp=count*100+missionXP;
  let level=1;for(let i=1;i<levels.length;i++)if(xp>=levels[i])level=i+1;
  const min=levels[level-1],max=levels[level]??null;
  const unlocked=badges.filter(b=>b.test?b.test(records):count>=b.threshold).map(b=>b.id);
  const times=records.map(r=>Number(r.durationSeconds)).filter(t=>Number.isFinite(t)&&t>=0);
  return {records,count,xp,level,min,max,unlocked,fastest:times.length?Math.min(...times):null};
 }
 function readableTime(s){return s===null?'—':`${Math.floor(s/60)}m ${String(Math.round(s%60)).padStart(2,'0')}s`}
 function render(){
  current=calc();const d=current;
  $('nf29XP').firstChild.textContent=d.xp.toLocaleString('id-ID')+' XP';
  $('nf29Level').textContent='Level '+d.level;
  $('nf29LevelName').textContent=names[Math.min(d.level-1,names.length-1)];
  $('nf29Completed').textContent=String(d.count);
  $('nf29Earned').textContent=d.unlocked.length+' / '+badges.length;
  $('nf29Best').textContent=readableTime(d.fastest);
  $('nf29Fill').style.width=d.max===null?'100%':Math.min(100,Math.max(0,100*(d.xp-d.min)/(d.max-d.min)))+'%';
  $('nf29Next').textContent=d.max===null?'Level tertinggi tercapai':`${d.xp-d.min} / ${d.max-d.min} XP menuju Level ${d.level+1}`;
  const grid=$('nf29BadgeGrid');grid.replaceChildren();
  for(const b of badges){
   const earned=d.unlocked.includes(b.id);const box=document.createElement('article');box.className='nf29-badge '+(earned?'unlocked':'locked');
   const ico=document.createElement('div');ico.className='nf29-badge-icon';ico.textContent=earned?b.icon:'🔒';
   const title=document.createElement('b');title.textContent=b.name;
   const desc=document.createElement('p');desc.textContent=b.description;
   const status=document.createElement('div');status.className='nf29-badge-status';status.textContent=earned?'✓ TERBUKA':b.threshold?`🔒 ${Math.min(d.count,b.threshold)} / ${b.threshold} sesi`:'🔒 Belum memenuhi syarat';
   box.append(ico,title,desc,status);grid.appendChild(box);
  }
  $('nf29Updated').textContent='Data lokal · '+new Date().toLocaleDateString('id-ID');
 }
 function open(){lastFocus=document.activeElement;overlay.hidden=false;render();$('nf29Close').focus()}
 function close(){overlay.hidden=true;if(lastFocus?.focus)lastFocus.focus()}
 link.href='#pencapaian';link.addEventListener('click',e=>{e.preventDefault();open()});
 $('nf29Close').addEventListener('click',close);
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden){e.stopImmediatePropagation();close()}});
 $('nf29Refresh').addEventListener('click',()=>{render();$('nf29Message').textContent='Data pencapaian diperbarui.'});
 $('nf29Export').addEventListener('click',()=>{
   render();const payload={app:'NET FORGE',version:'0.29.0',source:'Guided Lab + Mission',exportedAt:new Date().toISOString(),completed:current.count,learningXP:current.xp,level:current.level,badges:current.unlocked};
   const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
   const a=document.createElement('a');a.href=url;a.download='net-forge-achievements.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
   $('nf29Message').textContent='Berkas JSON disiapkan.';
 });
 window.addEventListener('storage',e=>{if(e.key===key&&!overlay.hidden)render()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
;

/* === script:nf30Logic === */
(()=>{
 'use strict';
 const PREF='netforge.player.settings.v030';
 const ALLOWED=['netforge.lab.v026','netforge.guided.history.v027','nf252-fx','netforge.mission.autosave.v031','netforge.lab.autosave.v031'];
 const $=id=>document.getElementById(id);
 const defaults=()=>({name:'Network Explorer',role:'beginner',motion:true,sound:false,compact:false});
 function safeRead(key){try{return localStorage.getItem(key)}catch{return null}}
 function safeWrite(key,val){try{localStorage.setItem(key,val);return true}catch{return false}}
 function prefs(){try{const x=JSON.parse(safeRead(PREF)||'null');return x&&typeof x==='object'?{...defaults(),...x}:defaults()}catch{return defaults()}}
 let data=prefs(),ctx=null,lastFocus=null;
 const panel=$('nf30Overlay'),nav=[...document.querySelectorAll('.topnav a')].find(a=>/pengaturan/i.test(a.textContent||''));
 if(!panel||!nav)return;
 function setStatus(s,error=false){const el=$('nf30Status');el.textContent=s;el.style.color=error?'#ffa5a8':'#6df2c7'}
 function setUi(){
   $('nf30Name').value=data.name;$('nf30Role').value=data.role;
   $('nf30Motion').checked=!!data.motion;$('nf30Sound').checked=!!data.sound;$('nf30Compact').checked=!!data.compact;
 }
 function apply(){
   document.body.classList.toggle('motion-off',!data.motion);
   document.body.classList.toggle('nf30-compact',!!data.compact);
   const motion=$('motionToggle');if(motion){motion.textContent=data.motion?'✨ Animasi: Aktif':'⏸️ Animasi: Nonaktif';motion.setAttribute('aria-pressed',String(!!data.motion));}
 }
 function store(){if(!safeWrite(PREF,JSON.stringify(data)))setStatus('Gagal menyimpan. Periksa pengaturan penyimpanan browser.',true)}
 function open(){lastFocus=document.activeElement;setUi();panel.hidden=false;setStatus('');$('nf30Name').focus()}
 function close(){panel.hidden=true;if(lastFocus?.focus)lastFocus.focus()}
 nav.addEventListener('click',e=>{e.preventDefault();open()});$('nf30Close').addEventListener('click',close);
 panel.addEventListener('click',e=>{if(e.target===panel)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.stopPropagation();close()}});
 function beep(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;ctx=ctx||new Audio();if(ctx.state==='suspended')ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(660,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+.09);g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.045,ctx.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.11);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.12)}catch{}}
 $('nf30TestSound').addEventListener('click',()=>window.NetForgeAudio?.preview());
 // A low-volume sound only for game button clicks, not during timers or automatic updates.
 // v0.34.2: Click sounds routed through unified Audio Manager; legacy handler disabled.
 $('nf30SaveProfile').addEventListener('click',()=>{data.name=$('nf30Name').value.trim().slice(0,40)||'Network Explorer';data.role=$('nf30Role').value;store();setStatus('Profil disimpan pada browser ini.')});
 $('nf30SavePrefs').addEventListener('click',()=>{data.motion=$('nf30Motion').checked;data.sound=$('nf30Sound').checked;data.compact=$('nf30Compact').checked;store();apply();setStatus('Preferensi diterapkan dan disimpan.')});
 // Synchronize pre-existing animation toggle, which belongs to the original engine.
 $('motionToggle')?.addEventListener('click',()=>{queueMicrotask(()=>{data.motion=!document.body.classList.contains('motion-off');store();setUi()})});
 $('nf30ResetPrefs').addEventListener('click',()=>{if(!confirm('Reset hanya profil dan preferensi? Data latihan tetap disimpan.'))return;data=defaults();store();apply();setUi();setStatus('Profil dan preferensi kembali ke default.')});
 $('nf30Export').addEventListener('click',()=>{
  window.NetForgeProgress?.save();
  const values={};for(const key of ALLOWED){const raw=safeRead(key);if(raw!==null)values[key]=raw}
  values[PREF]=JSON.stringify(data);
  const payload={format:'net-forge-backup',schema:1,createdAt:new Date().toISOString(),records:values};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='net-forge-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Backup JSON berhasil dibuat.')
 });
 $('nf30Import').addEventListener('click',()=>$('nf30BackupFile').click());
 $('nf30BackupFile').addEventListener('change',async e=>{
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  if(file.size>2*1024*1024){setStatus('File terlalu besar (maks. 2 MB).',true);return}
  try{
    const parsed=JSON.parse(await file.text());
    if(parsed?.format!=='net-forge-backup'||parsed.schema!==1||!parsed.records||typeof parsed.records!=='object'||Array.isArray(parsed.records))throw new Error('Format backup NET FORGE tidak dikenali.');
    const keys=[PREF,...ALLOWED].filter(k=>Object.prototype.hasOwnProperty.call(parsed.records,k));
    if(!keys.length)throw new Error('Backup tidak berisi data NET FORGE yang dikenali.');
    for(const key of keys){if(typeof parsed.records[key]!=='string')throw new Error('Struktur data tidak valid: '+key);if(key==='nf252-fx'){if(!['on','off'].includes(parsed.records[key]))throw new Error('Status FX tidak valid.')}else JSON.parse(parsed.records[key]);}
    if(!confirm('Pulihkan '+keys.length+' data dari backup? Data tersimpan untuk kategori yang sama akan ditimpa.'))return;
    const originals={};for(const key of keys) originals[key]=safeRead(key);
    const written=[];
    try{
      for(const key of keys){if(!safeWrite(key,parsed.records[key]))throw new Error('Penyimpanan browser tidak tersedia.');written.push(key)}
    }catch(writeError){
      for(const key of written.reverse()){
        try{if(originals[key]===null)localStorage.removeItem(key);else localStorage.setItem(key,originals[key])}catch{}
      }
      throw new Error('Backup gagal diterapkan; pemulihan data lama telah dicoba. '+writeError.message);
    }
    window.dispatchEvent(new Event('netforge:backup-imported'));data=prefs();apply();setUi();setStatus('Backup berhasil dipulihkan. Muat ulang halaman untuk menerapkan data LAB dan riwayat latihan.')
  }catch(err){setStatus('Impor gagal: '+err.message,true)}
 });
 apply();
})();
;

/* === script:inline === */
(function(){
 function init(){
   const save=window.NetForgeProgress;
   if(!save)return;
   const badge=document.createElement('div');badge.id='nf31SaveBadge';badge.textContent='◷ Autosave siap';
   const status=document.createElement('span');status.id='nf31Status';status.textContent='◷ Autosave siap';badge.replaceChildren(status);document.body.appendChild(badge);
   // v0.40.72: "Lanjut Bermain" juga aktif bila hanya ada simpanan Unified Canvas.
   const unifiedProfiles=['basics','smart','office','free'];
   const hasUnified=unifiedProfiles.some(p=>{try{const raw=localStorage.getItem('netforge.universal.mission.v2.'+p);if(!raw)return false;const dd=JSON.parse(raw);return Array.isArray(dd.nodes)&&dd.nodes.length>0}catch{return false}});
   const unifiedDone=(()=>{try{const raw=localStorage.getItem('netforge.unified.mission.progress.v1');const dd=JSON.parse(raw||'null');return dd&&typeof dd==='object'&&Object.values(dd).some(v=>v&&v.completed)}catch{return false}})();
   const d=save.readMission();
   const start=document.getElementById('startModal');
   if(d&&start){
     const target=start.querySelector('.modal-content')||start.querySelector('.modal')||start.firstElementChild;
     if(target){
       const resume=document.createElement('button');resume.type='button';resume.id='nf31Resume';
       resume.textContent='↩ Lanjutkan Misi Tersimpan';
       const info=document.createElement('p');info.textContent='Misi '+d.progress.mission+' · '+new Date(d.savedAt).toLocaleString('id-ID');info.style.cssText='color:#9cdce7;font-size:11px;text-align:center;margin:7px 0';
       resume.onclick=()=>{if(!save.resume())alert('Autosave tidak dapat dipulihkan.')};target.append(info,resume);
     }
   }
   if((hasUnified||unifiedDone)&&start){
     const target2=start.querySelector('.modal-content')||start.querySelector('.modal')||start.firstElementChild;
     if(target2&&!document.getElementById('nf31UnifiedResume')){
       const uresume=document.createElement('button');uresume.type='button';uresume.id='nf31UnifiedResume';uresume.textContent='↩ Lanjutkan Workspace Unified';
       const uinfo=document.createElement('p');uinfo.textContent='Topologi Unified Canvas tersimpan di browser ini.';uinfo.style.cssText='color:#9cdce7;font-size:11px;text-align:center;margin:7px 0';
       uresume.onclick=()=>{try{const p=localStorage.getItem('netforge.universal.active-profile.v1')||'basics';document.getElementById('nf322Overlay').hidden=true;document.getElementById('nf322Home').hidden=false;start.classList.remove('open');window.NetForgeUniversalInventory?.openMission?.(p);}catch(e){alert('Workspace Unified tidak dapat dipulihkan.')}};
       target2.append(uinfo,uresume);
     }
   }
   const labShade=document.getElementById('nf26Shade');
   if(labShade){
    // Always resolve the CURRENT autosave on click, never a stale boot-time snapshot.
    const readLab=()=>{try{const d=JSON.parse(localStorage.getItem(save.labKey)||'null');return d?.format==='NETFORGE-LAB-AUTOSAVE'&&d.schema===1&&d.payload?d:null}catch{return null}};
    {
      const b=document.createElement('button');b.type='button';b.id='nf31LabResume';b.textContent='↩ Lanjutkan Eksperimen Lab';
      // v0.59.00: status inline di dalam dialog — sebelumnya kegagalan hanya
      // lewat alert() (auto-dismiss di browser uji) atau diam-diam (selector
      // tidak ketemu), sehingga tombol tampak mati dan dialog tetap terbuka
      // tanpa penjelasan pada percobaan pertama. Kini penyebabnya tertulis
      // persisten di dialog. Penyebab pasti klik pertama yang gagal tidak
      // dapat direproduksi dari kode statis (wiring tombol dan selector
      // terverifikasi benar); jalur tanpa autosave di atas adalah satu-satunya
      // jalur "tombol tampak mati" yang terbukti ada.
      const st=document.createElement('p');st.id='nf31LabResumeStatus';st.style.cssText='color:#ffc789;font-size:11px;text-align:center;margin:4px 0 0;min-height:14px';
      b.onclick=()=>{
       /* v0.40.92: fallback ke topologi Guided yang tersimpan (netforge.guided.topology.v1) bila cadangan klasik kosong/tidak ada — sebelumnya handler ini HANYA membaca kunci autosave klasik (netforge.lab.autosave.v031 via readLab()); autosave 3-detik menulis lab().export() yang KOSONG di mode mixed, sehingga setelah "Simpan" + hard reload resume masuk Free Lab kosong (0 perangkat, BUDGET LAB $1.000) padahal klaim "Topologi Guided Lab dipulihkan di Free Lab" tetap ditampilkan (audit live v0.40.88 butir 2b). Topologi Guided yang sebenarnya tersimpan di netforge.guided.topology.v1 (ditulis autosave 3-detik, leave(), dan saat Guided selesai — v0.40.88) dan handler ini tidak pernah membacanya. */
       const restoreGuidedTopo=()=>{/* Kembalikan topologi Guided yang tersimpan (graf unified + spent) ke canvas Lab aktif; kembalikan jumlah perangkat yang dipulihkan, 0 bila tidak ada. */try{if(typeof window.NetForgeGuidedTopologyRestore==='function'){const _r=window.NetForgeGuidedTopologyRestore();/* v0.40.92-perbaikan (harness B89-2d/2f): restoreGuidedTopology() mengembalikan BOOLEAN (true bila graf diimpor, false bila tidak ada), BUKAN jumlah node — asumsi awal (angka) membuat klaim pemulihan selalu salah ("Belum ada cadangan LAB...") walau topologi berhasil dipulihkan. Bila true, hitung perangkat dari canvas setelah impor. */if(_r===true){try{return (window.NetForgeUniversalInventory?.getState?.().nodes||[]).length;}catch(_e){return 1;}}if(typeof _r==='number')return _r;return 0;}}catch(_e){}return 0;};
       const hasGuidedTopo=()=>{/* Ada topologi Guided yang tersimpan (punya perangkat)? Dibaca langsung dari kunci netforge.guided.topology.v1 — dipakai jalur tanpa autosave: bila ada, resume masuk Lab dan memulihkannya; bila tidak ada cadangan apa pun, perilaku lama dipertahankan (alasan di dialog, dialog tetap terbuka — tes R80-2). */try{const _r=JSON.parse(localStorage.getItem('netforge.guided.topology.v1')||'null');if(!_r||_r.format!=='NETFORGE-GUIDED-TOPOLOGY')return false;const _u=_r.unified&&Array.isArray(_r.unified.nodes)?_r.unified.nodes.length:0;const _c=_r.classic&&Array.isArray(_r.classic.nodes)?_r.classic.nodes.length:0;return (_u+_c)>0;}catch(_e){return false;}};
       const labData=readLab();
       if(!labData){/* v0.40.92: tidak ada cadangan klasik — bila topologi Guided tersimpan, masuk Lab dan pulihkan (kuncinya bertahan walau autosave dihapus "Kosongkan" Free Lab, sesuai desain v0.40.88); bila tidak ada cadangan apa pun, perilaku lama dipertahankan: alasan tertulis di dialog dan dialog tetap terbuka. */if(!hasGuidedTopo()){st.textContent='Belum ada cadangan LAB yang dapat dipulihkan (Lab pernah dikosongkan atau belum pernah disimpan).';return}const mode='free';const selector=labShade.querySelector('[data-nfmode="'+mode+'"]');if(!selector){st.textContent='Mode Lab "'+mode+'" tidak ditemukan di dialog ini.';return}st.textContent='';selector.click();const _n=restoreGuidedTopo();const _st26=document.getElementById('nf26Status');if(_st26)_st26.textContent=_n>0?'Topologi Guided Lab dipulihkan di Free Lab (tahap panduan tidak tersimpan).':'Belum ada cadangan LAB yang dapat dipulihkan (Lab pernah dikosongkan atau belum pernah disimpan).';return}
       const previousMode=['free','guided','challenge'].includes(labData.mode)?labData.mode:'free';
       // Guided Lab stage index is not part of the autosave. Restore its network as Free Lab rather than inventing stage progress.
       const mode=previousMode==='guided'?'free':previousMode;
       const selector=labShade.querySelector('[data-nfmode="'+mode+'"]');
       if(!selector){st.textContent='Mode Lab "'+mode+'" tidak ditemukan di dialog ini.';return}
       const _payloadEmpty91=!(labData.payload&&Array.isArray(labData.payload.nodes)&&labData.payload.nodes.length);
       /* v0.40.92: bila muatan autosave berasal dari Guided Lab (previousMode==='guided', mis. setelah "Ulang latihan") DAN muatannya kosong DAN tidak ada topologi Guided — tidak ada cadangan sama sekali — JANGAN navigasi: alasan ditulis di dialog dan dialog tetap terbuka (audit live v0.40.90 butir 3: setelah "Ulang latihan", klik Lanjutkan menutup dialog dan membuka Free Lab kosong, alasan hanya di bar Lab). Mode lain (mis. mode 'free' + muatan kosong) adalah resume yang sah atas workspace Free Lab yang memang kosong — tetap dilanjutkan (tes R80-3). Alasan juga ditulis ke bar Lab (#nf26Status) dengan teks yang sama seperti v0.40.90 ("Cadangan LAB kosong (0 perangkat)…") agar status lama tetap terbaca (tes B90-1f). Pemeriksaan ini harus SEBELUM selector.click() — sebelumnya pemeriksaan baru terjadi setelah masuk Lab. */
       if(_payloadEmpty91&&previousMode==='guided'&&!hasGuidedTopo()){st.textContent='Belum ada cadangan LAB yang dapat dipulihkan (Lab pernah dikosongkan atau belum pernah disimpan).';const _st26=document.getElementById('nf26Status');if(_st26)_st26.textContent='Cadangan LAB kosong (0 perangkat) — tidak ada topologi Guided untuk dipulihkan.';return}
       st.textContent='';
       selector.click();
       try{window.NetForgeLab.import(labData.payload);/* v0.40.92: putuskan dari MUATAN AUTOSAVE klasik, bukan dari isi canvas — di mode mixed, payload klasik selalu KOSONG (0 perangkat) walau topologi Guided tersimpan, dan import() payload kosong membiarkan canvas lama tetap di tempat; gate lama (_after===0, jumlah canvas) tidak pernah lolos saat Free Lab masih berisi topologi lama, sehingga fallback Guided tidak jalan dan status salah menuduh "Cadangan LAB kosong" (audit live v0.40.89 butir 1: Guided 4 perangkat/$405 tidak pulih, Free Lab lama 5 perangkat/2 koneksi yang tampil). Kini: bila payload klasik kosong dan mode sebelumnya Guided, pulihkan topologi Guided yang tersimpan (menggantikan isi Free Lab saat ini); klaim "Cadangan LAB kosong" hanya ditulis bila cadangan Guided memang tidak ada. */const _payloadEmpty=!(labData.payload&&Array.isArray(labData.payload.nodes)&&labData.payload.nodes.length);let _restored=0;if(_payloadEmpty&&previousMode==='guided')_restored=restoreGuidedTopo();const _st26=document.getElementById('nf26Status');if(_st26)_st26.textContent=previousMode==='guided'?(_restored>0?'Topologi Guided Lab dipulihkan di Free Lab (tahap panduan tidak tersimpan).':'Cadangan LAB kosong (0 perangkat) — tidak ada topologi Guided untuk dipulihkan.'):'Eksperimen tersimpan berhasil dipulihkan.'}catch(e){st.textContent='Eksperimen tersimpan tidak dapat dipulihkan: '+e.message}
      };
      const box=labShade.querySelector('.nf26-modal')||labShade.firstElementChild;
      if(box){box.appendChild(b);box.appendChild(st);}
    }
   }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
;

/* === script:nf311-regression-guards === */
(function(){
 'use strict';
 function run(){
  const btn=document.getElementById('nf311Diagnostics');
  const output=document.getElementById('nf311DiagnosticsResult');
  if(!btn||!output)return;
  btn.addEventListener('click',()=>{
   const results=[];
   function test(label,fn){try{results.push((fn()?'✅ ':'⚠️ ')+label)}catch(e){results.push('❌ '+label+' — '+e.message)}}
   test('Mesin Misi tersedia',()=>!!window.NetForgeProgress&&typeof window.NetForgeProgress.save==='function');
   test('Mesin LAB tersedia',()=>!!window.NetForgeLab&&typeof window.NetForgeLab.export==='function');
   test('Penyimpanan browser tersedia',()=>{const k='netforge.diag.temp';localStorage.setItem(k,'ok');const good=localStorage.getItem(k)==='ok';localStorage.removeItem(k);return good});
   test('Data Misi terbaca atau belum ada',()=>{const raw=localStorage.getItem('netforge.mission.autosave.v031');return !raw||!!window.NetForgeProgress.readMission()});
   test('Data LAB terbaca atau belum ada',()=>{const raw=localStorage.getItem('netforge.lab.autosave.v031');if(!raw)return true;const d=JSON.parse(raw);return d.format==='NETFORGE-LAB-AUTOSAVE'&&d.schema===1&&d.payload&&Array.isArray(d.payload.nodes)&&Array.isArray(d.payload.links)});
   test('Riwayat Guided Lab valid',()=>{const raw=localStorage.getItem('netforge.guided.history.v027');return !raw||Array.isArray(JSON.parse(raw))});
   test('Tombol Start Mission tersedia',()=>!!document.getElementById('startBtn'));
   test('Menu utama tersedia',()=>document.querySelectorAll('.topnav a').length>=5);
   output.textContent=results.join('\n')+'\n\nPemeriksaan ini tidak mengubah progres Misi atau LAB.';
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
;

/* === script:netforge-v032-gpu === */
/* NET FORGE v0.32.0 — optional WebGL2 particle layer, DOM/SVG remains authoritative. */
(()=>{'use strict';
 const KEY='netforge.graphics.v032';const AUTO_KEY='netforge.graphics.auto.v1';let autoQuality=true;try{autoQuality=localStorage.getItem(AUTO_KEY)!=='off'}catch{}
 const $=s=>document.querySelector(s);
 const quality={off:{fps:0,particles:0},low:{fps:30,particles:1},medium:{fps:60,particles:2},high:{fps:60,particles:4}};
 const board=$('#board'); if(!board)return;
 let mode='medium'; try{const saved=localStorage.getItem(KEY);if(saved in quality)mode=saved;}catch{}
  // v0.59.00: nilai 'off' tersimpan adalah warisan auto-tune lama (v0.40.75
  // ke bawah menyimpan 'off'); migrasikan ke 'low' agar game tidak lagi
  // memuat dengan "FX: SVG saja" tanpa pilihan manual pemain.
  if(mode==='off'){mode='low';try{localStorage.setItem(KEY,'low')}catch{}}
 const canvas=document.createElement('canvas');canvas.id='nf32Canvas';canvas.setAttribute('aria-hidden','true');board.insertBefore(canvas,board.firstChild.nextSibling);
 const hud=document.createElement('div');hud.id='nf32Hud';hud.textContent='GPU: initializing';
 const header=$('.workspace-panel .panelhead')||board.parentElement;
 const select=document.createElement('select');select.id='nf32Graphics';select.setAttribute('aria-label','Kualitas grafis GPU');
 select.innerHTML='<option value="off">FX: SVG saja</option><option value="low">GPU: Low</option><option value="medium">GPU: Medium</option><option value="high">GPU: High</option>';
 select.value=mode;
 const tools=document.createElement('div');tools.className='nf32-tools';tools.append(select,hud);const autoBox=document.createElement('label');autoBox.style.cssText='display:flex;gap:4px;align-items:center;font-size:11px;color:#9addec;cursor:pointer';const autoInput=document.createElement('input');autoInput.type='checkbox';autoInput.id='nf32AutoQuality';autoInput.checked=autoQuality;autoBox.append(autoInput,document.createTextNode(' Kualitas otomatis'));autoInput.addEventListener('change',()=>{autoQuality=autoInput.checked;try{localStorage.setItem(AUTO_KEY,autoQuality?'on':'off')}catch{}});tools.append(autoBox);header.appendChild(tools);
 let gl=null,glTried=false,program=null,buffer=null,loc=null,enabled=false,raf=0,lastFrame=0,fpsAvg=0,frames=0,lastFpsStamp=performance.now(),paused=false,wireCache=[],wireCacheAt=0,wireCount=-1,wireCountCheckAt=0,ptsBuf=null,boxCache=null,boxCacheAt=0,lowFpsSince=0,autoTuned='';
 function ensureGL(){
  if(glTried)return enabled;
  glTried=true;
  try{
   gl=canvas.getContext('webgl2',{alpha:true,antialias:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
   enabled=!!gl;
   if(gl){
    const shader=(type,code)=>{const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
    program=gl.createProgram();
    const vs=shader(gl.VERTEX_SHADER,`#version 300 es
 in vec2 p; uniform vec2 size; uniform float diameter;
 void main(){ gl_Position=vec4((p/size)*vec2(2.,-2.)+vec2(-1.,1.),0.,1.); gl_PointSize=diameter; }`);
    const fs=shader(gl.FRAGMENT_SHADER,`#version 300 es
 precision mediump float; out vec4 color;
 void main(){float r=length(gl_PointCoord-vec2(.5));float a=smoothstep(.5,.1,r);color=vec4(.35,.99,.83,a*.88);}`);
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    loc={p:gl.getAttribLocation(program,'p'),size:gl.getUniformLocation(program,'size'),diameter:gl.getUniformLocation(program,'diameter')};
    buffer=gl.createBuffer();
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
   }
  }catch(e){enabled=false;hud.textContent='GPU fallback: '+String(e.message).slice(0,65);}
  return enabled;
 }
 function resize(){const now=performance.now();if(!boxCache||now-boxCacheAt>1000){boxCache=board.getBoundingClientRect();boxCacheAt=now}const box=boxCache,dpr=1;const w=Math.max(1,Math.round(box.width*dpr)),h=Math.max(1,Math.round(box.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}return {box,dpr};}
 window.addEventListener('resize',()=>{boxCache=null});
 /* v0.40.92: hitung kabel dari canvas yang SEDANG aktif, segar tiap baca - sebelumnya HUD memakai wireCache.length (kabel klasik saja, hanya di-refresh bila jumlah klasik berubah) + jumlah unified; saat masuk Lab, jumlah klasik tidak berubah sehingga cache basi (3 kabel misi) tetap dihitung walau canvas unified kosong ("3 packets" di canvas kosong). Mixed -> hitung unified saja; klasik -> hitung klasik saja. wireCache sendiri TIDAK diubah: ia hanya menyimpan geometri kabel klasik untuk partikel WebGL, bukan untuk HUD. */
 function liveWireCount(){try{
  if(document.body.classList.contains('nf400-mixed'))return document.querySelectorAll('#nf400Wires line.nf400-wire.nf4017-live').length;
  return document.querySelectorAll('#wires .wire:not(.down)').length;
 }catch(_e){return 0}}
 function draw(time){raf=requestAnimationFrame(draw);
 // v0.59.00: FPS diukur SELALU (termasuk saat FX mati) — dulu draw() langsung
 // return saat mode 'off', sehingga HUD membeku di angka terakhir ("WebGL2 · 6
 // FPS") dan angka basi itu yang terlihat berjam-jam. Auto-tune juga tidak
 // lagi menurunkan sampai 'off' (berhenti di 'low') dan tidak lagi menyimpan
 // pilihannya — penurunan otomatis sebelumnya tersimpan ke localStorage,
 // sehingga sesi berikutnya langsung mulai di "FX: SVG saja".
 if(time-lastFpsStamp>=1000){fpsAvg=frames*1000/(time-lastFpsStamp);frames=0;lastFpsStamp=time;if(fpsAvg>0&&fpsAvg<15&&mode!=='off'&&autoQuality){if(!lowFpsSince)lowFpsSince=time;else if(time-lowFpsSince>3000){const next=mode==='high'?'medium':mode==='medium'?'low':null;if(next){select.value=next;listener(true);autoTuned=' · kualitas otomatis: '+next;lowFpsSince=0;}}}else lowFpsSince=0;const _fps=fpsAvg>0?fpsAvg.toFixed(1):'—';/* v0.40.92: FPS satu desimal (Math.round menyembunyikan variasi 2.5-3.4 semua jadi '3') + hitung juga kabel unified (line.nf400-wire.nf4017-live) — wireCache hanya mengambil kabel klasik #wires, sehingga di mode unified packets selalu 0. */const _liveWires=liveWireCount();hud.textContent=mode==='off'?('FX: SVG saja · '+_fps+' FPS (lingkungan)'+autoTuned):('WebGL2 · '+_fps+' FPS · '+_liveWires*quality[mode].particles+' packets'+autoTuned);}frames++;
  if(paused||document.hidden||mode==='off')return;
  // v0.59.00: skip WebGL2 rendering when legacy #board is hidden (Unified Canvas active)
  // or invisible/collapsed, preventing software-WebGL GPU stalls & 23 FPS drag.
  if(document.body.classList.contains('nf400-mixed')){
   if(time-lastFrame>=500){lastFrame=time;hud.textContent='Unified Canvas · '+Math.round(fpsAvg||60)+' FPS · '+liveWireCount()+' links';}
   return;
  }
  const q=quality[mode];if(time-lastFrame<1000/q.fps)return;lastFrame=time;
  const {box,dpr}=resize();
  if(!box||box.width<2||box.height<2)return;
  if(!ensureGL()){hud.textContent='SVG fallback · GPU tidak tersedia';return;}
 // v0.59.00: cache berisi TITIK sampel (bukan path). Refresh cache HANYA saat
 // jumlah kabel berubah (dicek tiap 500 ms) atau tiap 10 detik untuk geometri
 // yang bergeser — refresh paksa tiap 2 detik memanggil getPointAtLength /
 // getScreenCTM (forced layout, mahal di software rendering) dan menahan FPS.
 const needCountCheck=time-wireCountCheckAt>500;if(needCountCheck)wireCountCheckAt=time;
 if(!wireCache.length||time-wireCacheAt>10000||(needCountCheck&&document.querySelectorAll('#wires .wire:not(.down)').length!==wireCount)){wireCache=[];for(const path of [...document.querySelectorAll('#wires .wire:not(.down)')].slice(0,60)){try{const len=path.getTotalLength(),ctm=path.getScreenCTM();if(!ctm||len<=0)continue;const samples=[];for(let s=0;s<=15;s++){const pt=path.getPointAtLength(len*s/15);const p=new DOMPoint(pt.x,pt.y).matrixTransform(ctm);samples.push([(p.x-box.left)*dpr,(p.y-box.top)*dpr])}wireCache.push({samples})}catch{}}wireCount=wireCache.length;wireCacheAt=time;}
 const pts=[];
 for(const w of wireCache){
  const n=w.samples.length-1;
  for(let i=0;i<q.particles;i++){
   const ratio=((time*.00016+i/q.particles)%1)*n,idx=Math.min(n-1,Math.floor(ratio)),frac=ratio-idx,a=w.samples[idx],b=w.samples[idx+1];
   pts.push(a[0]+(b[0]-a[0])*frac,a[1]+(b[1]-a[1])*frac);
  }
 }
 gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
 if(pts.length){gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);if(!ptsBuf||ptsBuf.length<pts.length)ptsBuf=new Float32Array(Math.max(pts.length,1024));ptsBuf.set(pts);gl.bufferData(gl.ARRAY_BUFFER,ptsBuf.subarray(0,pts.length),gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(loc.p);gl.vertexAttribPointer(loc.p,2,gl.FLOAT,false,0,0);gl.uniform2f(loc.size,canvas.width,canvas.height);gl.uniform1f(loc.diameter,Math.min(15,7*dpr));gl.drawArrays(gl.POINTS,0,pts.length/2);}
 }
 // v0.59.00: listener(auto) — perubahan OTOMATIS (auto-tune) tidak disimpan
 // ke localStorage; hanya pilihan manual pemain yang disimpan.
 const listener=(auto)=>{mode=select.value;if(!auto){try{localStorage.setItem(KEY,mode)}catch{}}canvas.style.display=(enabled&&mode!=='off')?'block':'none';hud.textContent=mode==='off'?'FX: SVG saja':enabled?'WebGL2 active':'SVG fallback';};
 select.addEventListener('change',()=>listener(false));listener(false);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();enabled=false;canvas.style.display='none';hud.textContent='GPU context lost · SVG fallback';});
 document.addEventListener('visibilitychange',()=>{paused=document.hidden;});
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){select.value='off';listener(true);}
 raf=requestAnimationFrame(draw);
 window.NetForgeGraphics={getMode:()=>mode,setMode:value=>{if(value in quality){select.value=value;listener()}},getLiveWires:liveWireCount,getStatus:()=>({webgl2:!!gl,active:enabled&&mode!=='off',fps:Math.round(fpsAvg),auto:autoQuality})};
})();
;

/* === script:netforge-v032-progress === */
/* NET FORGE v0.32 — explicit official progress synchronization. Local mode never submits automatically. */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const settings=document.querySelector('#nf30Overlay .nf30-body'); if(!settings)return;
 const section=document.createElement('section');section.className='nf30-card';
 section.innerHTML=`<h3>🛡️ Progres Resmi (Server)</h3>
  <p class="nf30-help">Guest Mode tetap tersedia offline. Untuk skor resmi, gunakan Google Login di bagian Akun Resmi. Hasil LAB dihitung ulang oleh server. Backend harus dapat diakses oleh perangkat pemain.</p>
  <label for="nf32Url">URL API resmi (HTTPS)</label><input id="nf32Url" type="url" placeholder="https://game.example.edu/api/v1" autocomplete="url"/>
  <details id="nf350Legacy"><summary>Opsi pengelola: token legacy (tidak diperlukan pemain umum)</summary><label for="nf32Token">Token legacy</label><input id="nf32Token" type="password" placeholder="nf_..." autocomplete="off"/></details>
  <div class="nf32-actions"><button type="button" class="nf30-btn" id="nf32Connect">🔍 Cek Akun Resmi</button>
  <button type="button" class="nf30-btn primary" id="nf32Submit">✅ Verifikasi Guided Lab</button>
  <button type="button" class="nf30-btn" id="nf32Progress">📈 Lihat progres resmi</button>
  <button type="button" class="nf30-btn" id="nf32Disconnect">Keluar</button></div>
  <pre id="nf32OfficialStatus" role="status" aria-live="polite">Belum terhubung. Gunakan mode LAB lokal tanpa server kapan pun.</pre>`;
 settings.appendChild(section);
 const status=$('nf32OfficialStatus'),url=$('nf32Url'),token=$('nf32Token');
 // v0.40.72: tidak ada backend bawaan. Satu konstanta ini adalah satu-satunya
 // default URL API; isi dengan URL HTTPS publik backend Anda di Pengaturan.
 // Nilai kosong berarti "belum dikonfigurasi" — mode tamu tetap berfungsi penuh.
 const NETFORGE_API_DEFAULT_URL='https://netforge-docker2.taild3997b.ts.net/api/v1';
 try{url.value=localStorage.getItem('netforge.server.url.v032')||NETFORGE_API_DEFAULT_URL;}catch{url.value=NETFORGE_API_DEFAULT_URL;}
 const previous=url.value.trim();if(previous==='http://netforge-docker2.taild3997b.ts.net:8085/api/v1'||previous==='https://netforge-docker2.taild3997b.ts.net/api/v1'){url.value=NETFORGE_API_DEFAULT_URL;}
 try{token.value=sessionStorage.getItem('netforge.server.token.v032')||'';}catch{}
 const show=v=>{status.textContent=typeof v==='string'?v:JSON.stringify(v,null,2)};
 function cfg(){let base=url.value.trim().replace(/\/+$/,'');if(!/^https:\/\//.test(base)&&!/^http:\/\/localhost(?::\d+)?\/api\/v1$/.test(base)&&!/^http:\/\/127\.0\.0\.1(?::\d+)?\/api\/v1$/.test(base))throw Error('Gunakan HTTPS atau localhost untuk development.');if(!base.endsWith('/api/v1'))throw Error('URL harus berakhir /api/v1');const t=token.value.trim();try{localStorage.setItem('netforge.server.url.v032',base);if(/^nf_[0-9a-f]{64}$/.test(t))sessionStorage.setItem('netforge.server.token.v032',t);}catch{}return {base,t};}
 async function api(path,body){const {base,t}=cfg();const bearer=await window.NetForgeAuth?.accessToken?.()||t;if(!/^(?:(?:nf_|nfa_)[0-9a-f]{64}|[0-9]+\|[A-Za-z0-9]{40,})$/.test(bearer))throw Error('Masuk dengan Google pada bagian Akun Resmi, atau main sebagai tamu.');const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),10000);
  try{const res=await fetch(base+path,{method:body?'POST':'GET',headers:{'Authorization':'Bearer '+bearer,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:ctrl.signal,cache:'no-store'});const data=await res.json();if(!res.ok)throw Error(data.error||'HTTP '+res.status);return data;}finally{clearTimeout(timeout)} }
 async function perform(action){try{show('Menghubungi server…');show(await action())}catch(e){show('Tidak dapat terhubung: '+e.message+'\nPastikan: backend HTTPS publik aktif, URL API di Pengaturan sudah benar, dan CORS backend mengizinkan https://igoon.github.io.\nMode LAB lokal tetap tersedia.') }}
 $('nf32Connect').onclick=()=>perform(()=>api('/me'));
 $('nf32Progress').onclick=()=>perform(()=>api('/progress'));
 $('nf32Submit').onclick=()=>perform(async()=>{
  if(!window.NetForgeLab?.active()||window.NetForgeLab.mode()!=='guided')throw Error('Buka LAB → Guided Lab untuk mengirim bukti latihan.');
  const topology=JSON.parse(window.NetForgeLab.export());
  const buf=new Uint8Array(18);crypto.getRandomValues(buf);const id='guided_'+Array.from(buf,b=>b.toString(16).padStart(2,'0')).join('');
  const result=await api('/attempts',{attemptId:id,topology});
  window.dispatchEvent(new CustomEvent('netforge:official-attempt',{detail:{attemptId:result.attemptId,score:result.score,passed:result.passed}}));
  return {message:result.passed?'Diverifikasi server · lulus':'Belum lulus verifikasi server',score:result.score,checks:result.checks,attemptId:result.attemptId,official:true};
 });
 $('nf32Disconnect').onclick=async()=>{if(window.NetForgeAuth?.logout)await window.NetForgeAuth.logout();token.value='';try{sessionStorage.removeItem('netforge.server.token.v032')}catch{}show('Keluar dari akun resmi. Guest Mode tetap tersedia.')};
 window.NetForgeOfficial={getConnected:()=>Boolean(window.NetForgeAuth?.isSignedIn?.())};
})();
;

/* === script:nf322IntroLogic === */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const overlay=$('nf322Overlay'),intro=$('nf322Intro'),menu=$('nf322Menu'),credits=$('nf322Credits'),skip=$('nf322Skip');
 const key='netforge.intro.skip.v0325';let timers=[],moving=[],runToken=0;
 const keyMotion='netforge.intro.fullmotion.v0326',keySfx='netforge.intro.sfx.v0326';
 const getBool=(k,def=false)=>{try{const v=localStorage.getItem(k);return v===null?def:v==='1'}catch{return def}};
 const putBool=(k,v)=>{try{localStorage.setItem(k,v?'1':'0')}catch{}};
 let audioCtx=null;
 function chirp(startHz,endHz,duration=.16,kind='sine',vol=.06){
   // Intro and gameplay now share the same AudioContext, mute and volume.
   window.NetForgeAudio?.introTone?.(startHz,endHz,duration,kind,vol);
 }
 async function unlockAudio(){
   return !!(await window.NetForgeAudio?.enable?.(true));
 }
 function updateAudioUI(){
  const on=!!window.NetForgeAudio?.config?.().enabled;
  $('nf326Sound').checked=on;
  $('nf326IntroAudio').textContent=on?'🔊 SFX Aktif':'🔇 Aktifkan SFX (putar intro)';
 }

 const getPref=()=>{try{return localStorage.getItem(key)==='1'}catch{return false}};
 const setPref=(v)=>{try{localStorage.setItem(key,v?'1':'0')}catch{}};
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const clear=()=>{for(const t of timers)clearTimeout(t);timers=[];for(const a of moving)a.cancel();moving=[]};
 const later=(callback,ms)=>timers.push(setTimeout(callback,ms));
 function showMenu(){++runToken;clear();intro.hidden=true;menu.hidden=false;credits.hidden=true;skip.hidden=true;$('nf322Remember').checked=getPref();$('nf326FullIntro').checked=getBool(keyMotion,true);updateAudioUI();
  // v0.59.00: "Lanjut Bermain" juga aktif bila ada snapshot misi
  // Lab yang belum dikonsumsi atau profil misi berisi perangkat —
  // bukan hanya bila tombol resume nf31 sudah dibuat (regresi
  // regresi ronde lalu: tombol mati padahal topologi misi tersimpan).
  let _hasMission=false;try{const _snap=localStorage.getItem('netforge.lab.mission-snapshot.v1');if(_snap){const _g=JSON.parse(_snap);if(_g&&Array.isArray(_g.nodes)&&_g.nodes.length)_hasMission=true}if(!_hasMission){for(const _p of['basics','smart','office']){const _v=JSON.parse(localStorage.getItem('netforge.universal.mission.v2.'+_p)||'null');if(_v&&Array.isArray(_v.nodes)&&_v.nodes.length){_hasMission=true;break}}}}catch(_e){}$('nf322Continue').disabled=!(document.getElementById('nf31Resume')||document.getElementById('nf31UnifiedResume')||_hasMission);}
 function showCredits(){credits.hidden=false;credits.querySelector('#nf322CreditsBack').focus()}
 function dismiss(){overlay.hidden=true;$('nf322Home').hidden=false;}
 function openHome(){clear();overlay.hidden=false;$('nf322Home').hidden=true;showMenu();}
 function animateTitle(){
  clear();
  const initial=$('nf322Initial'),final=$('nf322Final');
  initial.replaceChildren();final.replaceChildren();
  const build=(target,word)=>[...word].map((char,i)=>{
    const span=document.createElement('span');
    span.className=char===' '?'nf322-space':'nf322-letter';
    span.textContent=char===' '?'\u00a0':char;
    span.dataset.index=i;
    target.appendChild(span);
    return span;
  });
  const a=build(initial,'NEVER FORGET'),b=build(final,'NET FORGE');
  intro.hidden=false;menu.hidden=true;credits.hidden=true;skip.hidden=false;
  initial.style.visibility='visible';final.style.visibility='hidden';
  initial.classList.remove('nf323-shaking');
  const stage=$('nf322Stage');
  stage?.classList.remove('nf323-finish');
  // Timeline intentionally spaced to make the title transformation readable:
  // 0-1.8s title holds, 1.8-3.3s V E R fall, 3.5-5.4s T flies to NET,
  // 5.6-7.4s finished logo holds, then main menu appears.
  later(()=>{
    initial.classList.add('nf323-shaking');chirp(210,76,.43,'sawtooth',.035);
    // NEVER -> NE: all three characters V, E and R fall visibly.
    [2,3,4].forEach((i,k)=>{
      moving.push(a[i].animate([
        {transform:'translate(0,0) rotate(0deg)',opacity:1,offset:0},
        {transform:`translate(${k%2?5:-5}px,-13px) rotate(${k%2?7:-8}deg)`,opacity:1,offset:.20},
        {transform:`translate(${(k-1)*36}px,230px) rotate(${(k-1)*58}deg)`,opacity:0,offset:1}
      ],{duration:1250,delay:k*125,fill:'forwards',easing:'cubic-bezier(.33,.03,.82,.58)'}));
    });
  },2300);
  later(()=>{
    initial.classList.remove('nf323-shaking');chirp(400,960,.48,'sine',.045);
    // Final letters are the target coordinates; keep target hidden until arrival.
    const target=b.map(n=>n.getBoundingClientRect());
    const origin=a.map(n=>n.getBoundingClientRect());
    // index 11 is T in FORGET; target index 2 is T in NET.
    const moves=[[0,0],[1,1],[11,2],[6,4],[7,5],[8,6],[9,7],[10,8]];
    for(const [from,to] of moves){
      if(!a[from]||!b[to])continue;
      const dx=target[to].left-origin[from].left;
      const dy=target[to].top-origin[from].top;
      const frames=from===11?[
        {transform:'translate(0,0) scale(1)',opacity:1,offset:0},
        {transform:'translate(0,-65px) scale(1.34)',opacity:1,offset:.30},
        {transform:`translate(${dx}px,${dy-24}px) scale(1.13)`,opacity:1,offset:.78},
        {transform:`translate(${dx}px,${dy}px) scale(1)`,opacity:1,offset:1}
      ]:[
        {transform:'translate(0,0)',opacity:1},
        {transform:`translate(${dx}px,${dy}px)`,opacity:1}
      ];
      moving.push(a[from].animate(frames,{duration:from===11?1750:1350,fill:'forwards',easing:'cubic-bezier(.23,.7,.22,1)'}));
    }
    // Remove the original gap left by the fallen VER.
    a[5]?.animate([{opacity:1},{opacity:0}],{duration:900,fill:'forwards'});
  },3500);
  later(()=>{
    initial.style.visibility='hidden';
    final.style.visibility='visible';
    stage?.classList.add('nf323-finish');chirp(500,880,.60,'triangle',.07);
    moving.push(final.animate([
      {opacity:.25,filter:'brightness(2.7) blur(3px)',transform:'translate(-50%,-50%) scale(1.12)'},
      {opacity:1,filter:'brightness(1) blur(0px)',transform:'translate(-50%,-50%) scale(1)'}
    ],{duration:700,fill:'forwards',easing:'ease-out'}));
  },6500);
  later(showMenu,9600);
 }
 const hasSavedProgress=()=>{try{if(window.NetForgeProgress?.readMission?.())return true;for(const p of ['basics','smart','office','free']){const raw=localStorage.getItem('netforge.universal.mission.v2.'+p);if(raw){const d=JSON.parse(raw);if(Array.isArray(d.nodes)&&d.nodes.length>0)return true}}const prog=JSON.parse(localStorage.getItem('netforge.unified.mission.progress.v1')||'null');if(prog&&typeof prog==='object'&&Object.values(prog).some(v=>v&&v.completed))return true}catch{}return false;};
 function startIntro(forceReplay=false){
  const token=++runToken;
  clear();
  overlay.hidden=false;$('nf322Home').hidden=true;intro.hidden=false;menu.hidden=true;credits.hidden=true;skip.hidden=false;
  if(!forceReplay && (getPref()||hasSavedProgress())){showMenu();return;}
  updateAudioUI();
  // Wait for two paint opportunities so startup and replay share the same visible timeline.
  const launch=()=>{
    if(token!==runToken)return;
    if(document.hidden){document.addEventListener('visibilitychange',()=>{if(!document.hidden&&token===runToken)launch()},{once:true});return;}
    if(!forceReplay && reduced && !getBool(keyMotion,true)){
      animateTitle();clear();$('nf322Initial').style.visibility='hidden';$('nf322Final').style.visibility='visible';
      later(showMenu,3500);return;
    }
    animateTitle();
  };
  requestAnimationFrame(()=>requestAnimationFrame(launch));
 }
 $('nf330ListenReplay').addEventListener('click',async()=>{
   const ok=await window.NetForgeAudio?.enable?.(true);
   updateAudioUI();
   if(ok) startIntro(true);
   else { const note=$('nf330AudioNote'); if(note)note.textContent='Audio tidak tersedia atau diblokir. Periksa pengaturan suara browser.'; startIntro(true); }
 });
 document.addEventListener('netforge:audio-updated',()=>{
   const note=$('nf330AudioNote');
   if(note)note.textContent=window.NetForgeAudio?.config?.().enabled?'🔊 SFX aktif. Intro akan berbunyi jika browser mengizinkan audio.':'🔇 Intro otomatis tanpa suara sampai Anda mengaktifkan audio.';
 });
 $('nf322Remember').addEventListener('change',e=>setPref(e.target.checked));
 $('nf326FullIntro').addEventListener('change',e=>putBool(keyMotion,e.target.checked));
 $('nf326Sound').addEventListener('change',async e=>{
    await window.NetForgeAudio?.enable?.(e.target.checked);
    updateAudioUI();
 });
 $('nf326IntroAudio').addEventListener('click',async()=>{
    const ok=await window.NetForgeAudio?.enable?.(true);
    updateAudioUI();
    const note=$('nf330AudioNote');
    if(note && !ok)note.textContent='Audio belum dapat dimainkan. Periksa volume browser dan izin audio.';
    // This button always replays; never silently disables audio.
    startIntro(true);
 });
 document.addEventListener('netforge:audio-updated',updateAudioUI);
 skip.addEventListener('click',showMenu);$('nf322Replay').addEventListener('click',()=>{setPref(false);startIntro(true)});
 $('nf322CreditsBtn').addEventListener('click',showCredits);$('nf322CreditsBack').addEventListener('click',()=>{credits.hidden=true});
 $('nf322Home').addEventListener('click',openHome);
 $('nf322Adventure').addEventListener('click',()=>{dismiss();$('startModal')?.classList.add('open')});
 $('nf322Continue').addEventListener('click',()=>{const resume=$('nf31Resume')||$('nf31UnifiedResume');dismiss();if(resume)resume.click();else{let _target=null;try{const _snap=localStorage.getItem('netforge.lab.mission-snapshot.v1');if(_snap){const _g=JSON.parse(_snap);const _own=_g&&(_g.profile||_g.mission);if(_own&&['basics','smart','office'].includes(_own)&&_g.nodes&&_g.nodes.length)_target=_own;else if(_g&&_g.nodes&&_g.nodes.length)_target='basics'}}catch(_e){}if(!_target){try{for(const _p of['basics','smart','office']){const _v=JSON.parse(localStorage.getItem('netforge.universal.mission.v2.'+_p)||'null');if(_v&&Array.isArray(_v.nodes)&&_v.nodes.length){_target=_p;break}}}catch(_e){}}if(_target&&window.NetForgeUniversalInventory?.openMission)window.NetForgeUniversalInventory.openMission(_target);else $('startModal')?.classList.add('open')}});
 $('nf322Lab').addEventListener('click',()=>{
  dismiss();const start=$('startModal');if(start?.classList.contains('open')){const resume=$('nf31Resume');if(resume)resume.click();else $('startBtn')?.click();}
  const link=[...document.querySelectorAll('.topnav a')].find(n=>n.textContent.includes('Lab'));if(link)link.click();
 });
 $('nf322Settings').addEventListener('click',()=>{
  dismiss();$('startModal')?.classList.remove('open');const link=[...document.querySelectorAll('.topnav a')].find(n=>n.textContent.includes('Pengaturan'));if(link)link.click();
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!credits.hidden){credits.hidden=true;e.stopPropagation()}});
 // Hand startup to the audio-choice controller so the browser can unlock audio first.
 window.NetForgeIntroStart=startIntro;
})();
;

/* === script:nf327-audio === */
/* NET FORGE v0.34.2 — Audio manager. No external assets or streaming. */
(()=>{'use strict';
const KEY='netforge.game.audio.v0327';
const el=id=>document.getElementById(id);
const defaults={enabled:false,master:.65,sfx:.75,iga:true,click:false};
const clamp=x=>Math.max(0,Math.min(1,Number(x)||0));
function load(){try{const obj=JSON.parse(localStorage.getItem(KEY)||'null');return obj&&typeof obj==='object'?{...defaults,...obj,master:clamp(obj.master??defaults.master),sfx:clamp(obj.sfx??defaults.sfx)}:{...defaults}}catch{return {...defaults}}}
let cfg=load(),ctx=null,lastPlay=new Map(),audioActive=false;
const AudioClass=window.AudioContext||window.webkitAudioContext;
const status=()=>{const e=el('nf327AudioStatus');if(e)e.textContent=!AudioClass?'Browser tidak mendukung Web Audio API.':!cfg.enabled?'Audio MATI — aktifkan dengan klik.':!audioActive?'Audio terkunci browser — klik Tes SFX.':(cfg.master===0||cfg.sfx===0)?'Audio aktif tetapi volume 0%.':'AudioContext RUNNING — SFX siap.'};
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(cfg))}catch{}};
async function unlock(){if(!AudioClass)return false;try{ctx??=new AudioClass();await ctx.resume();audioActive=ctx.state==='running';status();return audioActive}catch{audioActive=false;status();return false}}
function tone(freq,duration,opts={}){
 if(!ctx||ctx.state!=='running')return;
 const {end=freq,type='sine',level=.12,delay=0}=opts;
 const now=ctx.currentTime+delay,osc=ctx.createOscillator(),gain=ctx.createGain();
 const vol=Math.min(.15,Math.max(.0001,level*cfg.master*cfg.sfx));
 osc.type=type;osc.frequency.setValueAtTime(Math.max(40,freq),now);
 osc.frequency.exponentialRampToValueAtTime(Math.max(40,end),now+duration);
 gain.gain.setValueAtTime(.0001,now);
 gain.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),now+Math.min(.018,duration*.22));
 gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
 osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+duration+.025);
}
const sounds={
 device:()=>{tone(280,.09,{end:470,type:'triangle',level:.09});tone(580,.11,{end:730,delay:.08,level:.065})},
 cable:()=>{tone(860,.045,{end:650,type:'square',level:.025});tone(480,.15,{end:730,delay:.075,type:'triangle',level:.08})},
 config:()=>{tone(510,.09,{end:680,level:.06});tone(820,.15,{end:980,delay:.10,level:.06})},
 'ping-success':()=>{tone(540,.13,{end:720,level:.07});tone(880,.20,{end:1080,delay:.14,level:.09})},
 'ping-fail':()=>{tone(280,.2,{end:170,type:'sawtooth',level:.065});tone(160,.18,{end:105,type:'triangle',level:.055,delay:.15})},
 mission:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.2,{end:f*1.03,delay:i*.17,type:'triangle',level:.08}))},
 chaos:()=>{tone(520,.2,{end:220,type:'sawtooth',level:.055});tone(560,.21,{end:200,delay:.22,type:'sawtooth',level:.055})},
 'iga-alert':()=>tone(465,.12,{end:365,type:'triangle',level:.032}),
 click:()=>tone(680,.043,{end:720,level:.022}),
};
const cooldowns={device:140,cable:140,config:230,'ping-success':400,'ping-fail':400,mission:1500,chaos:1200,'iga-alert':1100,click:65};
function play(type,forced=false){
 if(!cfg.enabled||!AudioClass||(!cfg.iga&&type==='iga-alert')||(!cfg.click&&type==='click'))return;
 const now=performance.now(),prior=lastPlay.get(type)||-1e6;
 if(!forced&&now-prior<(cooldowns[type]||180))return;
 lastPlay.set(type,now);
 if(!ctx||ctx.state!=='running')return;
 try{sounds[type]?.()}catch(e){console.warn('NET FORGE Audio:',e)}
}
function ui(){el('nf327Mute').checked=cfg.enabled;el('nf327Master').value=Math.round(cfg.master*100);el('nf327Sfx').value=Math.round(cfg.sfx*100);el('nf327Iga').checked=cfg.iga;el('nf327Click').checked=cfg.click;el('nf327MasterText').textContent=Math.round(cfg.master*100)+'%';el('nf327SfxText').textContent=Math.round(cfg.sfx*100)+'%';el('nf327AudioToggle').textContent=cfg.enabled?'🔊 Audio':'🔇 Audio';el('nf327AudioToggle').setAttribute('aria-pressed',String(cfg.enabled));status()}
function syncAudio(){persist();ui();document.dispatchEvent(new Event('netforge:audio-updated'))}
async function enable(next){
  cfg.enabled=!!next;
  // Create/resume AudioContext as part of direct user-initiated gesture.
  const ok=cfg.enabled?await unlock():true;
  if(cfg.enabled&&!ok){cfg.enabled=false;}
  syncAudio();
  return ok;
}
function introTone(start,end,duration=.16,type='sine',level=.06){
  if(!cfg.enabled||!ctx||ctx.state!=='running')return;
  try{tone(start,duration,{end,type,level});}catch(e){console.warn('NET FORGE Intro SFX:',e)}
}
window.NetForgeAudio={play,introTone,enable,preview:async()=>{if(!cfg.enabled)await enable(true);if(await unlock())play('ping-success',true)},muted:()=>!cfg.enabled,volumeScale:()=>cfg.enabled?cfg.master*cfg.sfx:0,config:()=>({...cfg})};
window.addEventListener('netforge:gameplay-sound',ev=>play(ev.detail?.type));
function init(){if(!el('nf327AudioToggle'))return;
 const toggle=el('nf327AudioToggle'),popup=el('nf327AudioPopover');
 function open(v){popup.hidden=!v;toggle.setAttribute('aria-expanded',String(v))}
 toggle.addEventListener('click',()=>open(popup.hidden));el('nf327Close').addEventListener('click',()=>open(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!popup.hidden)open(false)});
 el('nf327Mute').addEventListener('change',async ev=>{await enable(ev.target.checked);if(cfg.enabled)play('device',true)});
 for(const [id,key] of [['nf327Master','master'],['nf327Sfx','sfx']])el(id).addEventListener('input',ev=>{cfg[key]=clamp(Number(ev.target.value)/100);persist();ui()});
 for(const [id,key] of [['nf327Iga','iga'],['nf327Click','click']])el(id).addEventListener('change',ev=>{cfg[key]=ev.target.checked;persist();ui()});
 el('nf327Preview').addEventListener('click',async()=>{if(!cfg.enabled)await enable(true);if(await unlock())play('ping-success',true)});
 // Unlock only after explicit user interaction, never autoplay on page load.
 document.addEventListener('pointerdown',()=>{if(cfg.enabled&&!audioActive)void unlock()},{passive:true});
 document.addEventListener('click',e=>{if(!cfg.enabled||!cfg.click)return;if(e.target.closest('button')&&!e.target.closest('#nf327AudioPopover'))play('click')},true);
 ui();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf328-pwa-runtime === */
(()=>{'use strict';
 // Never derive installed version from remotely fetched version.json.
 // This constant is compiled into the RUNNING HTML shell.
 const current=window.NETFORGE_RELEASE?.version||'0.59.00';
 const secure=location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname);
 let deferredInstall=null,reg=null,waiting=null,reloaded=false,remote=null,checking=false,activeNew=false;
 const $=id=>document.getElementById(id);
 const compare=(a,b)=>{const x=String(a||'0').split('.').map(Number),y=String(b||'0').split('.').map(Number);for(let i=0;i<3;i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)-(y[i]||0)}return 0};
 const notes=[
   'Pusat Diagnostik: status PWA, versi aktif/terbaru, penyimpanan, audio, profil Google, dan koneksi API.',
   'Perbaikan: pemulihan LAB membaca data terbaru saat tombol digunakan.',
   'Pemeriksaan ekspor dan pemulihan tidak mengirim token ke server.',
   'Recovery Center: simpan, periksa waktu cadangan, dan pulihkan topologi Misi/LAB.',
   'Auto-save ketika PWA berpindah ke background dan cadangan lokal versi sebelumnya.',
   'Ekspor cadangan topologi tanpa menyertakan token Google atau kredensial.',
   'Perbaikan: versi berjalan tetap menunjukkan build HTML yang aktif, tidak meniru version.json terbaru.',
   'Update PWA meminta persetujuan dan hanya reload setelah pemain menyetujui.',
   'Pemulihan PWA dapat melepas Service Worker lama tanpa menghapus progres dan preferensi.',
   'Dialog versi membedakan versi terpasang, versi server, dan status update yang siap diaktifkan.',
   'Shortcut workspace: Alt+1 Perangkat, Alt+2 Workspace, Alt+3 Misi/Iga, Alt+H Bantuan; Ctrl+Z Undo; Ctrl+Shift+Z Redo.'
 ];
 function setup(){
  const install=document.createElement('button');install.id='nf328Install';install.type='button';install.hidden=true;install.textContent='⬇ Instal NET FORGE';
  const update=document.createElement('button');update.id='nf328Update';update.type='button';update.hidden=true;update.textContent='🔄 Lihat Update';
  const check=document.createElement('button');check.id='nf330CheckUpdate';check.type='button';check.textContent='⟳ Cek Update';
  const status=document.createElement('div');status.id='nf330PwaStatus';status.setAttribute('role','status');
  const modal=document.createElement('section');modal.id='nf361UpdateDialog';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','nf361UpdateHeading');
  modal.innerHTML=`<div class="nf361-update-card"><div class="nf361-update-top"><h2 id="nf361UpdateHeading">📦 Informasi Update NET FORGE</h2><button type="button" id="nf361UpdateClose" aria-label="Tutup informasi update">✕</button></div><div class="nf361-versions"><div><small>Versi game yang sedang berjalan</small><strong id="nf361Current"></strong></div><div><small>Versi terbaru di server</small><strong id="nf361Latest"></strong></div></div><p id="nf361UpdateState" role="status"></p><h3 id="nf363ChangeHeading">Apa yang baru?</h3><ul id="nf361Changelog"></ul><div class="nf361-update-actions"><button type="button" id="nf361UpdateLater">Nanti saja</button><button type="button" id="nf361UpdateApply">Perbarui sekarang</button><button type="button" id="nf367UpdateRepair" hidden>Pulihkan Update (aman)</button><a href="./recovery.html" target="_blank" rel="noopener" style="color:#8be5ff;font-size:12px;align-self:center">Diagnostik update</a></div><p class="nf361-update-note">Simpan atau ekspor progres lokal sebelum pembaruan. Versi game yang berjalan berubah hanya setelah pembaruan diaktifkan dan halaman dimuat ulang.</p></div>`;
  const banner=document.createElement('aside');banner.id='nf4039UpdateBanner';banner.hidden=true;
  banner.setAttribute('role','status');banner.setAttribute('aria-live','polite');
  banner.innerHTML='<div class="nf4039-row"><div><strong id="nf4039BannerTitle">Pembaruan tersedia</strong><div id="nf4039BannerBody">Versi baru siap dipasang.</div></div><div class="nf4039-actions"><button type="button" id="nf4039Details">Lihat update</button><button type="button" id="nf4039Later">Nanti</button></div></div>';
  document.body.append(install,update,check,status,modal,banner);
  const deferredKey='nf4039.deferredVersion';
  const showBanner=()=>{
   const ready=Boolean(reg?.waiting&&navigator.serviceWorker.controller);
   if(!remote){banner.hidden=true;return}
   if(!newer()&&!ready){banner.hidden=true;return}
   // v0.59.00: jangan tampilkan banner "update tersedia" bila versi server sama dengan versi aktif.
   if(remote&&remote.version===current){banner.hidden=true;return}
   const target=remote?.version||'unknown';
   if(sessionStorage.getItem(deferredKey)===target){banner.hidden=true;return}
   $('nf4039BannerTitle').textContent='🔔 Update NET FORGE'+(remote?.version?' v'+remote.version:'')+' tersedia';
   $('nf4039BannerBody').textContent='Versi aktif v'+current+' tetap berjalan sampai Anda memilih perbarui.';
   banner.hidden=false;
  };
  $('nf4039Details').onclick=()=>{banner.hidden=true;display()};
  $('nf4039Later').onclick=()=>{sessionStorage.setItem(deferredKey,remote?.version||'unknown');banner.hidden=true};
  if(sessionStorage.getItem('nf4039.justUpdated')==='1'){sessionStorage.removeItem('nf4039.justUpdated');status.textContent='NET FORGE v'+current+' aktif. Jika versi belum sesuai, buka Diagnostik update.';}
  // Correct any visible 'current version' badges from the compiled shell, not server metadata.
  for(const el of document.querySelectorAll('[data-nf-release-label]'))el.textContent="IGA'S NETWORK ADVENTURE · v"+current;
  const say=t=>{status.textContent=t};
  const setNotes=items=>{$('nf361Changelog').replaceChildren(...items.map(item=>{const li=document.createElement('li');li.textContent=String(item);return li}))};
  const newer=()=>Boolean(remote&&compare(remote.version,current)>0);
  function display(){
   $('nf361Current').textContent='v'+current;
   $('nf361Latest').textContent=remote?'v'+remote.version:'Belum diketahui';
   const ready=Boolean(reg?.waiting&&navigator.serviceWorker.controller)||activeNew; waiting=ready?reg.waiting:null;
   const state=ready?(newer()?'Versi baru sudah diunduh. Aktifkan untuk mulai memakai rilis terbaru.':'Paket pembaruan siap diaktifkan; versi server belum dapat dipastikan.'):newer()?'Rilis baru tersedia. Game masih menjalankan v'+current+'.':remote?'Game sudah memakai rilis terbaru.':'Versi server belum ditemukan/terbaca. Periksa deployment dan gunakan Pemulihan PWA. Data pemain tidak dihapus.';
   $('nf361UpdateState').textContent=state;
   const changes=newer()&&Array.isArray(remote?.changes)&&remote.changes.length?remote.changes:notes;
   $('nf363ChangeHeading').textContent=newer()?'Apa yang baru di v'+remote.version+'?':'Perubahan pada versi yang sedang berjalan';
   setNotes(changes);
   const apply=$('nf361UpdateApply');apply.hidden=!ready&&!newer();apply.disabled=false;
   apply.textContent=ready?'Aktifkan pembaruan': 'Unduh dan siapkan update';
   $('nf367UpdateRepair').hidden=false;
   modal.hidden=false;$('nf361UpdateClose').focus();
  }
  function close(){modal.hidden=true;check.focus()}
  $('nf361UpdateClose').onclick=close;$('nf361UpdateLater').onclick=close;
  modal.addEventListener('click',e=>{if(e.target===modal)close()});modal.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  async function metadata(){
   if(!navigator.onLine){remote=null;return null}
   try{
    // Not intercepted by the SW. Always fetch latest server metadata separately.
    const r=await fetch('./version.json?t='+Date.now(),{cache:'no-store'});
    if(!r.ok)throw Error('metadata HTTP '+r.status);
    const data=await r.json();if(typeof data.version!=='string'||!/^\d+\.\d+\.\d+$/.test(data.version))throw Error('bad version');
    remote=data;return data;
   }catch{remote=null;return null}
  }
  // Verify all deployed assets match before accepting any new worker.
  // No local player state is written or deleted by this check.
  async function verifyServerBundle(){
   const token=Date.now().toString(36);
   const get=async name=>{
    const response=await fetch('./'+name+'?verify='+token,{cache:'no-store'});
    if(!response.ok)throw Error(name+' HTTP '+response.status);
    return response;
   };
   const [metaResponse,htmlResponse,swResponse]=await Promise.all([get('version.json'),get('index.html'),get('sw.js')]);
   const meta=await metaResponse.json();
   const page=await htmlResponse.text();
   const worker=await swResponse.text();
   const wanted=String(meta.version||'');
   if(!/^\d+\.\d+\.\d+$/.test(wanted))throw Error('version.json tidak valid');
   const match=page.match(/window\.NETFORGE_RELEASE\s*=\s*Object\.freeze\(\{\s*version:\s*["']([^"']+)["']/);
   if(match?.[1]!==wanted)throw Error('HTML v'+(match?.[1]||'?')+' tidak sesuai metadata v'+wanted);
   if(!worker.includes("const RELEASE='"+wanted+"'"))throw Error('Service Worker belum sesuai v'+wanted);
   return wanted;
  }
  function found(){
   waiting=reg?.waiting&&navigator.serviceWorker.controller?reg.waiting:null;
   // v0.59.00: SW baru aktif sendiri (skipWaiting) — tidak ada waiting worker,
   // tapi versi server lebih baru sudah mengontrol halaman.
   if(activeNew){update.hidden=false;update.textContent='🔄 Pembaruan siap diaktifkan';say('Pembaruan telah diunduh dan aktif di latar belakang; game masih menjalankan v'+current+'.');showBanner();return;}
   if(!waiting)return;
   if(!remote)return;
   if(remote.version===current){update.hidden=true;banner.hidden=true;say('NET FORGE v'+current+' sudah yang terbaru.');return;}
   update.hidden=false;update.textContent='🔄 Pembaruan siap diaktifkan';say('Pembaruan telah diunduh; game masih menjalankan v'+current+'.');showBanner();
  }
  // Wait for the NEW service worker to finish installing instead of immediately checking reg.waiting.
  // An updatefound event can arrive AFTER reg.update() resolves.
  async function waitUntilReady(ms=12000){
   if(!reg)return false;
   if(reg.waiting&&navigator.serviceWorker.controller){waiting=reg.waiting;return true}
   return await new Promise(resolve=>{
    let done=false;const stop=(ready)=>{if(done)return;done=true;clearInterval(tick);clearTimeout(limit);reg.removeEventListener('updatefound',onFound);resolve(ready)};
    const probe=()=>{if(reg.waiting&&navigator.serviceWorker.controller){waiting=reg.waiting;stop(true)}};
    const onFound=()=>{const installing=reg.installing;if(installing)installing.addEventListener('statechange',probe);probe()};
    reg.addEventListener('updatefound',onFound);
    const tick=setInterval(probe,200);
    const limit=setTimeout(()=>stop(false),ms);
    onFound();
   });
  }
  // v0.59.00: tanyakan versi SW yang sedang mengontrol lewat MessageChannel.
  function workerVersion(worker){return new Promise(resolve=>{if(!worker)return resolve(null);const ch=new MessageChannel();const timer=setTimeout(()=>resolve(null),1500);ch.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data?.version||null)};try{worker.postMessage({type:'GET_VERSION'},[ch.port2])}catch{clearTimeout(timer);resolve(null)}})}
  // v0.59.00: SW baru bisa aktif sendiri (skipWaiting saat install) sehingga
  // reg.waiting bisa kosong padahal SW baru sudah mengontrol halaman. Deteksi
  // itu lewat versi SW aktif — tanpa ini tombol update mengira belum siap.
  async function detectActiveNew(){activeNew=false;try{if(!reg?.active)return false;const v=await workerVersion(reg.active);activeNew=!!(v&&compare(v,current)>0);return activeNew}catch{return false}}
  async function tryStageUpdate(){
   if(!reg)return false;
   try{await reg.update()}catch(err){console.warn('[NET FORGE] gagal mengunduh SW:',err)}
   if(await detectActiveNew())return true;
   return await waitUntilReady(12000);
  }
  async function recoverUpdate(){
   // recovery.html is OUTSIDE the SW fetch intercept list, so always reaches the network.
   // Keep recovery action explicit, and never delete player data here.
   const url=new URL('./recovery.html', location.href);
   location.assign(url.href+'?from='+encodeURIComponent(current));
  }
  $('nf367UpdateRepair').onclick=recoverUpdate;
  async function checkUpdate(show=false){
   if(checking){if(show)display();return}checking=true;
   try{
    await metadata();
    if(newer()){
     try{const checked=await verifyServerBundle();if(checked!==remote.version)throw Error('Rilis berubah saat diperiksa')}
     catch(err){say('Update ditunda: berkas server belum konsisten ('+err.message+'). Coba lagi setelah deployment selesai.');if(show)display();return}
    }
    // Download in background; don't block the update information dialog.
    if(reg && (newer() || reg.waiting))try{await reg.update()}catch(err){console.warn('[NET FORGE] update check',err)}
    // v0.59.00: SW baru mungkin sudah aktif sendiri (skipWaiting) — deteksi
    // lewat versi SW aktif sebelum memutuskan banner/tombol.
    try{await detectActiveNew()}catch(err){console.warn('[NET FORGE] cek SW aktif',err)}
    found();
    if(newer()){
     update.hidden=false;update.textContent='🔄 Rilis v'+remote.version+' tersedia';
     say('Sedang memainkan v'+current+' · rilis v'+remote.version+' tersedia.');showBanner();
    }else if(!waiting){
     update.hidden=true;banner.hidden=true;
     say(remote?'NET FORGE v'+current+' — versi aktif terverifikasi.':'NET FORGE v'+current+' — tidak dapat memeriksa versi server.');
    }
    if(show)display();
   }finally{checking=false}
  }
  check.onclick=()=>checkUpdate(true);
  update.onclick=()=>checkUpdate(true);
  $('nf361UpdateApply').onclick=async()=>{
   const apply=$('nf361UpdateApply'),state=$('nf361UpdateState');
   // v0.59.00: konfirmasi dua-klik di dalam dialog — window.confirm() auto-dismiss
   // di beberapa browser sehingga tombol "Aktifkan pembaruan" tampak mati.
   const _armedAt=Number(apply.dataset.armedAt||0);
   if(apply.dataset.armed!=='1'||Date.now()-_armedAt>10000){apply.dataset.armed='1';apply.dataset.armedAt=String(Date.now());const _normal=apply.textContent;state.textContent='Progres tersimpan otomatis. Klik "Perbarui sekarang" sekali lagi dalam 10 detik untuk mengonfirmasi pembaruan.';apply.textContent='Klik lagi untuk mengonfirmasi';setTimeout(()=>{if(apply.dataset.armed==='1'){apply.dataset.armed='';apply.textContent=_normal}},10100);return;}
   apply.dataset.armed='';
   sessionStorage.removeItem(deferredKey);banner.hidden=true;
   apply.disabled=true;apply.textContent='Menyiapkan update…';
   $('nf367UpdateRepair').hidden=false;
   state.textContent='Mengunduh dan memasang berkas pembaruan. Periksa koneksi internet…';
   try{
    state.textContent='Memastikan HTML, metadata, dan Service Worker berasal dari satu rilis…';
    const deployed=await verifyServerBundle();
    if(remote?.version && remote.version!==deployed)throw Error('Versi server berubah saat update; cek ulang dahulu');
    if(compare(deployed,current)<=0){state.textContent='Tidak ditemukan versi server yang lebih baru daripada v'+current+'.';return}
    let ready=Boolean(reg?.waiting&&navigator.serviceWorker.controller);
    if(!ready)ready=await tryStageUpdate();
    // v0.59.00: SW baru sudah aktif sendiri (skipWaiting saat install) — tidak
    // ada waiting worker; halaman lama cukup dimuat ulang.
    if(activeNew){state.textContent='Versi baru sudah aktif di latar belakang. Memuat ulang ke v'+(remote?.version||'terbaru')+'…';sessionStorage.setItem('nf4041.approved','1');sessionStorage.setItem('nf4039.justUpdated','1');location.replace('./index.html?updated='+Date.now());return;}
    if(ready&&reg?.waiting){
     waiting=reg.waiting;
     // Never activate an unverified waiting worker. Old SW may be a stale version.
     const staged=await workerVersion(waiting);
     if(!staged || staged!==deployed){
      state.textContent='Paket Service Worker belum dapat diverifikasi ('+(staged||'versi tidak diketahui')+'). Gunakan Pemulihan PWA untuk memperbarui tanpa menghapus progres.';
      $('nf367UpdateRepair').hidden=false;apply.disabled=false;return;
     }
     state.textContent='Berkas siap. Mengaktifkan versi baru…';
     sessionStorage.setItem('nf4041.approved','1');
     waiting.postMessage({type:'SKIP_WAITING'});
     setTimeout(()=>{
      if(sessionStorage.getItem('nf4041.approved')==='1'){
       state.textContent='Aktivasi terlalu lama. Gunakan Pemulihan PWA untuk memuat rilis baru langsung dari server tanpa menghapus data pemain.';
       $('nf367UpdateRepair').hidden=false;
       apply.disabled=false;
      }
     },8000);
     return;
    }
    // Do not strand users on a vague retry loop: offer safe, explicit recovery.
    state.textContent='Rilis tersedia di server tetapi Service Worker belum siap. Coba muat ulang halaman (Ctrl+Shift+R) — shell baru dimuat dari server; bila tetap gagal, gunakan Pemulihan PWA untuk mengunduh ulang shell aplikasi secara aman; progres lokal tidak dihapus.';
    $('nf367UpdateRepair').hidden=false;
   }catch(err){
    state.textContent='Update tidak dapat disiapkan: '+String(err?.message||err)+'. Buka Pemulihan PWA.';
    $('nf367UpdateRepair').hidden=false;
   }finally{apply.disabled=false;apply.textContent='Coba unduh ulang'}
  };
  if(!secure){say('Mode HTML lokal · v'+current+' — cek update memerlukan HTTPS.');return}
  if(!('serviceWorker' in navigator)){say('NET FORGE v'+current+' — Service Worker tidak tersedia.');return}
  say('NET FORGE v'+current+' · cek update');
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;install.hidden=false});
  window.addEventListener('appinstalled',()=>{deferredInstall=null;install.hidden=true;say('NET FORGE berhasil diinstal.')});
  install.onclick=async()=>{if(!deferredInstall)return;const p=deferredInstall;deferredInstall=null;install.hidden=true;await p.prompt()};
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
   if(reloaded)return;
   // Do not reload on initial SW registration, tab focus, or other uncontrolled takeover.
   // v0.59.00: SW baru bisa aktif sendiri di latar belakang (skipWaiting) — bila
   // dialog update sedang terbuka, segarkan tombolnya agar siap diaktifkan.
   if(sessionStorage.getItem('nf4041.approved')!=='1'){detectActiveNew().then(()=>{if(activeNew&&!$('nf361UpdateDialog').hidden)display()}).catch(()=>{});return;}
   reloaded=true;sessionStorage.removeItem('nf4041.approved');
   sessionStorage.setItem('nf4039.justUpdated','1');
   location.replace('./index.html?updated='+Date.now());
  });
  navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(r=>{
   reg=r;found();
   reg.addEventListener('updatefound',()=>{const w=reg.installing;w?.addEventListener('statechange',()=>{if(w.state==='installed')found()})});
   document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate()});
   window.addEventListener('online',()=>checkUpdate());
   window.addEventListener('offline',()=>say('Offline — menjalankan NET FORGE v'+current+' dari cache.'));
   checkUpdate();
  }).catch(err=>{say('Registrasi PWA gagal; game masih dapat dimainkan.');console.warn('[NET FORGE PWA]',err)})
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
;

/* === script:nf340ImmersiveScript === */
/* NET FORGE v0.34.2 — event-driven immersive packet visuals (non-authoritative layer) */
(()=>{'use strict';
const KEY='netforge.immersive.v034';
let pref='standard', timer=null, active=[];
try{let saved=localStorage.getItem(KEY);if(['off','lite','standard'].includes(saved))pref=saved;}catch(e){}
const $=s=>document.querySelector(s);
const motionAllowed=()=>pref!=='off'&&!document.body.classList.contains('motion-off')&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS='http://www.w3.org/2000/svg';
function status(msg,kind=''){const el=$('#nf34Status');if(!el)return;el.textContent=msg;el.dataset.state=kind;}
function cleanup(){if(timer){clearTimeout(timer);timer=null;}for(const x of active){try{x.remove()}catch(e){}}active=[];document.querySelectorAll('#wires .nf34-path-highlight').forEach(p=>p.classList.remove('nf34-path-highlight'));}
function init(){
 const host=$('.terminal-dock');const svg=$('#wires');if(!host||!svg)return;
 const bar=document.createElement('div');bar.id='nf34Controls';
 bar.innerHTML='<label>🎨 Animasi paket <select id="nf34Preset" aria-label="Kualitas animasi paket"><option value="off">Mati</option><option value="lite">Ringan</option><option value="standard">Standar</option></select></label><button id="nf34Replay" type="button" title="Putar ulang jalur ping terakhir">↻ Ulangi aliran paket</button><span id="nf34Status" role="status" aria-live="polite">Efek paket mengikuti hasil ping/traceroute.</span>';
 host.appendChild(bar);const select=$('#nf34Preset');select.value=pref;
 select.addEventListener('change',()=>{pref=select.value;try{localStorage.setItem(KEY,pref)}catch(e){}cleanup();status(pref==='off'?'Efek paket dinonaktifkan.':`Efek paket: ${pref==='lite'?'ringan':'standar'}.`)});
 let last=null;
 function spark(hops,reverse=false,delay=0,duration=2100){
  if(!Array.isArray(hops)||hops.length<2)return;
  const segments=[];
  for(let i=0;i<hops.length-1;i++){
   const from=String(hops[i]),to=String(hops[i+1]);
   const edge=Array.from(svg.querySelectorAll('path.wire')).find(e=> (e.dataset.a===from&&e.dataset.b===to)||(e.dataset.a===to&&e.dataset.b===from));
   if(!edge||edge.classList.contains('down'))return;
   const len=edge.getTotalLength();if(!Number.isFinite(len)||len<=0)return;
   let forward=edge.dataset.a===from;
   const steps=14;
   for(let k=0;k<=steps;k++){
    const u=k/steps;const p=edge.getPointAtLength((forward?u:1-u)*len);
    if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))return;
    if(i!==0&&k===0)continue;
    segments.push([p.x,p.y]);
   }
   edge.classList.add('nf34-path-highlight');
  }
  if(!segments.length)return;
  const path='M '+segments.map(p=>p.map(v=>v.toFixed(1)).join(' ')).join(' L ');
  const circle=document.createElementNS(NS,'circle');circle.setAttribute('r',pref==='lite'?'4':'5');circle.setAttribute('fill',reverse?'#baffc8':'#42eaff');circle.setAttribute('stroke','#ffffff');circle.setAttribute('stroke-width','1');circle.setAttribute('class','nf34-packet');
  const animate=document.createElementNS(NS,'animateMotion');animate.setAttribute('dur',duration+'ms');animate.setAttribute('repeatCount','1');animate.setAttribute('fill','freeze');animate.setAttribute('path',path);animate.setAttribute('begin','indefinite');circle.appendChild(animate);svg.appendChild(circle);active.push(circle);
  window.setTimeout(()=>{if(circle.isConnected){try{animate.beginElement()}catch(e){circle.remove();}}},delay);
 }
 function play(details){cleanup();if(!details||!details.ok){status('Ping gagal — periksa jalur dan konfigurasi.','fail');return;}last={...details,hops:[...details.hops]};status(`Jalur terverifikasi: ${details.hops.length} perangkat · ${details.latency} ms`,'success');
  if(!motionAllowed())return;
  spark(details.hops,false,0,1900);
  if(pref==='standard'){spark([...details.hops].reverse(),true,1950,1900)}
  timer=setTimeout(cleanup,pref==='standard'?4100:2100);
 }
 window.addEventListener('netforge:network-test',e=>{
  play(e.detail);const avatar=$('.iga-dock .avatar');if(avatar){avatar.classList.remove('nf34-success','nf34-warning');void avatar.offsetWidth;avatar.classList.add(e.detail?.ok?'nf34-success':'nf34-warning');setTimeout(()=>avatar.classList.remove('nf34-success','nf34-warning'),1800);}
 });
 $('#nf34Replay').addEventListener('click',()=>{if(last){play(last)}else status('Lakukan ping berhasil terlebih dahulu.')});
 const observer=new MutationObserver(()=>{if(active.length&&svg.querySelectorAll('.nf34-packet').length===0){active=[];if(timer){clearTimeout(timer);timer=null;}}});observer.observe(svg,{childList:true});
 window.addEventListener('pagehide',cleanup);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf344AudioStartupController === */
(function(){'use strict';
 const gate=document.getElementById('nf344AudioGate'),startSound=document.getElementById('nf344SoundStart'),startSilent=document.getElementById('nf344SilentStart'),msg=document.getElementById('nf344AudioResult');
 let entered=false;
 function finish(){if(entered)return;entered=true;gate.hidden=true;window.NetForgeIntroStart?.(false)}
 function show(){
  // Keep the first intro paused until a real user gesture unlocks audio.
  gate.hidden=false;startSound.focus();
 }
 startSound.addEventListener('click',async()=>{
   startSound.disabled=true;msg.textContent='Mengaktifkan AudioContext...';
   try{
     // AudioContext is created synchronously inside the click handler before await.
     const ok=await window.NetForgeAudio?.enable?.(true);
     if(ok){window.NetForgeAudio?.play?.('device',true);msg.textContent='Audio siap. Memulai intro...'}
     else msg.textContent='Browser menolak audio. Intro tetap dapat berjalan tanpa suara.';
   }catch(e){msg.textContent='Audio tidak tersedia: '+String(e?.message||e)}
   finish();
 });
 startSilent.addEventListener('click',()=>{window.NetForgeAudio?.enable?.(false);finish()});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});else show();
})();
;

/* === script:nf346PublicScript === */
/* NET FORGE v0.40.92 — guest-first access; official results remain server-only. */
(()=>{'use strict';
const VERSION='0.36.0';
const K='netforge.guest.profile.v0346';
const TOK='netforge.server.token.v032';
const d=id=>document.getElementById(id);
const safeRead=(s,k)=>{try{return s.getItem(k)}catch{return null}};
const safeWrite=(s,k,v)=>{try{s.setItem(k,v);return true}catch{return false}};
let player;
function validProfile(raw){
 try{let x=JSON.parse(raw);if(!x||typeof x!=='object'||!/^guest_[a-f0-9]{24}$/.test(x.id)||typeof x.name!=='string')return null;
 return {id:x.id,name:x.name.slice(0,36)||'Petualang Jaringan',createdAt:x.createdAt||new Date().toISOString()};}catch{return null}
}
function createGuest(){
 const b=new Uint8Array(12);crypto.getRandomValues(b);
 return {id:'guest_'+Array.from(b,n=>n.toString(16).padStart(2,'0')).join(''),name:'Petualang Jaringan',createdAt:new Date().toISOString()};
}
function save(){safeWrite(localStorage,K,JSON.stringify(player));}
function getToken(){return safeRead(sessionStorage,TOK)||'';}
function setStatus(msg){const x=d('nf346AccountState');if(x)x.textContent=msg;}
function sync(){
 const hasOfficial=Boolean(window.NetForgeAuth?.isSignedIn?.());
 const label=hasOfficial?'🔐 Official Player':'👤 Guest Mode';
 const menu=d('nf346GuestLabel'),badge=d('nf346GlobalStatus');
 if(menu)menu.textContent=label+' · '+player.name;
 if(badge)badge.textContent=label;
 const nick=d('nf346GuestName');if(nick&&document.activeElement!==nick)nick.value=player.name;
 setStatus(hasOfficial?'Akun resmi aktif. Gunakan Lihat Progres Resmi untuk melihat hasil server.':'Mode tamu aktif. Tidak perlu login untuk Misi dan LAB. Nilai lokal tidak dianggap nilai resmi.');
}
async function checkExistingSession(){
 const token=getToken(),status=d('nf346AccountState');
 if(!/^nf_[0-9a-f]{64}$/.test(token)||!status)return;
 const base=d('nf32Url')?.value.trim().replace(/\/+$/,'');
 if(!base||!/^https:\/\//.test(base))return;
 const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),6000);
 status.textContent='Memeriksa sesi akun resmi…';
 try{
   const res=await fetch(base+'/me',{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:ctrl.signal});
   if(res.ok){const info=await res.json();status.textContent='Akun resmi terverifikasi untuk sesi browser ini.'+(info?.name?' Nama: '+String(info.name).slice(0,80):'');}
   else if(res.status===401||res.status===403){sessionStorage.removeItem(TOK);status.textContent='Sesi resmi tidak berlaku. Anda tetap dapat bermain sebagai tamu.';sync();}
   else status.textContent='Akun belum dapat diverifikasi (HTTP '+res.status+'). LAB lokal tetap tersedia.';
 }catch{status.textContent='Server tidak terjangkau. Guest Mode tetap tersedia.';}finally{clearTimeout(timer)}
}
function boot(){
 player=validProfile(safeRead(localStorage,K))||createGuest();save();
 const menu=d('nf322Menu');
 if(menu){const entry=document.createElement('section');entry.id='nf346MenuEntry';
 entry.innerHTML='<strong id="nf346GuestLabel">👤 Guest Mode</strong><p>Mulai bermain tanpa akun. Progres disimpan di browser ini; sinkronisasi resmi bersifat opsional.</p><div class="nf346-actions"><button type="button" class="nf346-btn" id="nf346GuestPlay">▶ Main sebagai Tamu</button><button type="button" class="nf346-btn secondary" id="nf346SettingsOpen">⚙ Kelola Profil</button></div>';
 const buttons=menu.querySelector('.nf322-menu-actions');if(buttons)buttons.before(entry);else menu.appendChild(entry);
 d('nf346GuestPlay')?.addEventListener('click',()=>d('nf322Adventure')?.click());
 d('nf346SettingsOpen')?.addEventListener('click',()=>d('nf322Settings')?.click());
 }
 const settings=d('nf30Overlay')?.querySelector('.nf30-body');
 if(settings){
 const box=document.createElement('section');box.className='nf30-card';box.id='nf346ProfileCard';
 box.innerHTML='<h3>👤 Akses Pemain — Guest Mode</h3><p class="nf346-note">Game dapat dimainkan tanpa login. Nama tamu hanya tersimpan pada browser ini.</p><label for="nf346GuestName">Nama tampilan</label><input id="nf346GuestName" type="text" maxlength="36" autocomplete="nickname" /><div class="nf346-actions"><button class="nf346-btn" type="button" id="nf346SaveName">💾 Simpan Nama</button><button class="nf346-btn secondary" type="button" id="nf346CheckSession">🔄 Cek Sesi Resmi</button></div><div id="nf346AccountState" role="status" aria-live="polite"></div>';
 settings.insertBefore(box,settings.firstChild);
 d('nf346SaveName')?.addEventListener('click',()=>{player.name=(d('nf346GuestName')?.value||'').trim().slice(0,36)||'Petualang Jaringan';save();sync();});
 d('nf346CheckSession')?.addEventListener('click',checkExistingSession);
 const official=d('nf32OfficialStatus')?.closest('section');
 if(official){
  const explain=document.createElement('p');explain.className='nf30-help';explain.textContent='Akun resmi opsional. Gunakan Google Login untuk menyimpan progres resmi; token manual hanya untuk pengelola lama.';
  official.insertBefore(explain,official.children[1]||null);
  const tokenInput=d('nf32Token');const connect=d('nf32Connect');
  if(connect){connect.textContent='🔍 Cek Akun Resmi';connect.addEventListener('click',()=>setTimeout(sync,400));}
  const logout=d('nf32Disconnect');if(logout)logout.addEventListener('click',()=>setTimeout(sync,20));
 }
 d('nf30Overlay')?.addEventListener('click',e=>{if(e.target?.id==='nf346CheckSession')checkExistingSession();});
 }
 const status=document.createElement('span');status.id='nf346GlobalStatus';status.className='nf346-chip';status.setAttribute('aria-label','Mode akses pemain');document.body.appendChild(status);
 sync();
 // Only check an existing session after opening settings; no forced server login on startup.
 d('nf322Settings')?.addEventListener('click',()=>{if(getToken())checkExistingSession()});
 const settingsNav=Array.from(document.querySelectorAll('.topnav a')).find(e=>/Pengaturan/i.test(e.textContent||''));
 settingsNav?.addEventListener('click',()=>{if(getToken())checkExistingSession()});
 window.NetForgeGuest={profile:()=>({...player}),mode:()=>window.NetForgeAuth?.isSignedIn?.()?'official-session':'guest',version:VERSION};
 window.addEventListener('netforge:auth-change',sync);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf350OfficialAuth === */
/* Public Google OIDC credential -> PHP verification -> rotating access/refresh sessions. Guest stays fully offline. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const REFRESH='netforge.official.refresh.v0350';
const SESSION='netforge.official.access.v0350';
let access='',deadline=0,player=null,refreshPromise=null,initPromise=null,loginBusy=false,sessionVerified=false,lastPublishedIdentity='guest';
const read=(s,key)=>{try{return s.getItem(key)||''}catch{return ''}};
const write=(s,key,value)=>{try{s.setItem(key,value)}catch{}};
const remove=(s,key)=>{try{s.removeItem(key)}catch{}};
const status=(msg)=>{const el=$('nf350AuthStatus');if(el)el.textContent=msg;};
const base=()=>{
 const x=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');
 if(!/^https:\/\//.test(x)&&!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/v1$/.test(x))throw Error('API harus HTTPS (atau localhost saat development).');
 if(!x.endsWith('/api/v1'))throw Error('URL API harus berakhir /api/v1');
 return x;
};
async function call(path,body,bearer){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);
 try{const res=await fetch(base()+path,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(bearer?{'Authorization':'Bearer '+bearer}:{})},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:ctrl.signal});
 const out=await res.json().catch(()=>({}));if(!res.ok)throw Error(out.error||'HTTP '+res.status);return out;
 }finally{clearTimeout(timer)}
}
async function acceptVerifiedSession(data){
 if(!data||!(/^(?:nfa_[a-f0-9]{64}|[0-9]+\|[A-Za-z0-9]{40,})$/.test(data.accessToken))||!/^nfr_[a-f0-9]{64}$/.test(data.refreshToken))throw Error('Format access token server tidak valid (Sanctum atau token legacy)');
 const candidate=data.accessToken;
 const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),12000);
 let identity;
 try{
  const res=await fetch(base()+'/me',{headers:{Authorization:'Bearer '+candidate,'Accept':'application/json'},cache:'no-store',signal:ctrl.signal});
  const payload=await res.json().catch(()=>null);
  if(!res.ok)throw Error('Verifikasi identitas /me ditolak (HTTP '+res.status+').');
  identity=payload?.player||payload?.user||payload;
  if(!identity||typeof identity!=='object'||!Number.isSafeInteger(Number(identity.id))||Number(identity.id)<=0)throw Error('Identitas server tidak lengkap (ID pemain tidak valid).');
 }finally{clearTimeout(timer)}
 // Sesi lama baru digantikan setelah /me sukses; jangan percaya identitas dari callback Google saja.
 access=candidate;deadline=Date.now()+Math.max(60,Number(data.expiresIn)||900)*1000;
 player=identity;sessionVerified=true;
 write(localStorage,REFRESH,data.refreshToken);write(sessionStorage,SESSION,access);render();
 return identity;
}
function render(){
 const name=$('nf350Player');if(name)name.textContent=player?.name||'Pemain resmi';
 const signed=sessionVerified&&!!access&&Date.now()<deadline&&!!player;
 if($('nf350Login'))$('nf350Login').hidden=signed;
 if($('nf350Logout'))$('nf350Logout').hidden=!signed; if($('nf363CloudLink'))$('nf363CloudLink').hidden=!signed;
 if($('nf350Who'))$('nf350Who').hidden=!signed;
 if($('nf350Login'))$('nf350Login').disabled=loginBusy;
 const chip=$('nf362AuthChip');if(chip)chip.textContent=signed?'✅ Sesi Google terverifikasi':(read(localStorage,REFRESH)?'⏳ Sesi tersimpan, belum diverifikasi':'🎮 Mode Tamu');
 const currentIdentity=signed?'verified:'+String(player.id):'guest';
 if(currentIdentity!==lastPublishedIdentity){lastPublishedIdentity=currentIdentity;window.dispatchEvent(new Event('netforge:auth-change'));}
}
async function refresh(){
 if(refreshPromise)return refreshPromise;
 const token=read(localStorage,REFRESH);if(!token)return null;
 refreshPromise=(async()=>{try{
  const data=await call('/auth/refresh',{refreshToken:token});
  await acceptVerifiedSession(data);
  status('✅ Sesi Google sudah diverifikasi oleh server.');return access;
 }catch(err){
  // Jangan tampilkan token kedaluwarsa sebagai sesi valid.
  access='';deadline=0;sessionVerified=false;player=null;remove(sessionStorage,SESSION);
  if(/(kedaluwarsa|tidak valid|berakhir|tidak ditemukan|HTTP 401|HTTP 403)/i.test(err.message))remove(localStorage,REFRESH);
  render();status('Sesi belum bisa dipulihkan: '+err.message+'\nGuest Mode tetap dapat dimainkan.');return null;
 }finally{refreshPromise=null}})();return refreshPromise;
}
async function accessToken(){if(sessionVerified&&access&&Date.now()+30000<deadline)return access;return await refresh();}
async function googleCredential(credential){
 if(loginBusy)return;loginBusy=true;render();
 status('Memverifikasi identitas Google di server…');
 try{const data=await call('/auth/google',{credential});await acceptVerifiedSession(data);status('✅ Login berhasil dan akun telah diverifikasi. Selamat datang, '+(player?.name||'Official Player')+'. Buka Cloud Save untuk membandingkan progres sebelum sinkronisasi.');}
 catch(err){sessionVerified=false;access='';deadline=0;player=null;render();status('Login gagal: '+err.message+'\nGunakan Diagnostik Login untuk memeriksa API dan origin.')}
 finally{loginBusy=false;render();}
}
function loadGoogle(){return new Promise((resolve,reject)=>{
 if(window.google?.accounts?.id)return resolve();
 const x=document.createElement('script');x.src='https://accounts.google.com/gsi/client';x.async=true;x.onload=resolve;x.onerror=()=>reject(Error('Google Identity Services tidak dapat dimuat'));document.head.appendChild(x);
});}
async function showGoogle(){
 if(loginBusy)return;
 if(location.protocol==='file:'){status('Google Login tidak tersedia dari file://. Buka instalasi HTTPS pada GitHub Pages atau localhost.');return;}
 try{status('Menghubungi API dan menyiapkan Login Google…');
 const config=await call('/auth/config');if(!config.enabled||!config.googleClientId)throw Error('Google Login belum diaktifkan: periksa /auth/config dan NETFORGE_GOOGLE_CLIENT_ID di backend.');
 await loadGoogle();const mount=$('nf350GoogleMount');if(!mount)throw Error('Panel login tidak ditemukan');mount.replaceChildren();
 google.accounts.id.initialize({client_id:config.googleClientId,callback:result=>{if(result?.credential)googleCredential(result.credential);else status('Google tidak mengirim kredensial.')}});
 google.accounts.id.renderButton(mount,{type:'standard',theme:'filled_blue',size:'large',text:'signin_with',shape:'pill',width:260});
 status('Klik tombol Masuk dengan Google. Tidak diperlukan token Tailscale.');
 }catch(err){status('Google Login belum tersedia: '+err.message+'\nGuest Mode tetap tersedia. Pastikan API publik, CORS, dan OAuth origin sudah benar.');}
}
async function logout(){const token=read(localStorage,REFRESH),oldAccess=access;
 access='';deadline=0;player=null;sessionVerified=false;remove(localStorage,REFRESH);remove(sessionStorage,SESSION);render();
 status('Keluar dari perangkat ini berhasil. Meminta server mencabut token sesi…');
 if(token){try{await call('/auth/logout',{refreshToken:token},oldAccess);status('✅ Keluar berhasil. Refresh token dan access token yang dikirim telah dicabut server.');}
 catch{status('⚠ Keluar lokal berhasil, tetapi pencabutan token server tidak dapat dikonfirmasi. Gunakan perangkat pribadi dan periksa koneksi API.');}}
 else status('Keluar lokal berhasil. Tidak ada refresh token untuk dicabut.');
}

async function diagnose(){
 const out=$('nf362DiagOutput');if(!out)return;out.hidden=false;
 const lines=[];const add=(k,v)=>{lines.push(k+': '+v);out.textContent=lines.join('\n');};
 add('Halaman',location.protocol+'//'+location.host);
 if(location.protocol==='file:'){add('Google', 'file:// tidak mendukung OAuth web. Gunakan HTTPS atau localhost.');return;}
 let api;try{api=base();add('Alamat API',api);}catch(e){add('Konfigurasi API',e.message);return;}
 try{
  const res=await fetch(api+'/auth/config',{cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!res.ok){add('Koneksi API','HTTP '+res.status);return;}
  const cfg=await res.json();add('Koneksi API','Terhubung');
  add('Google OAuth',cfg.enabled&&cfg.googleClientId?'Dikonfigurasi':'Belum aktif di server');
  if(cfg.googleClientId)add('Client ID','Tersedia (nilai disembunyikan)');
  add('Origin OAuth',location.origin+' — tambahkan sebagai Authorized JavaScript origin pada Google Cloud Console');
  add('GIS library',window.google?.accounts?.id?'Sudah dimuat':'Akan dimuat saat tombol Login dipilih');
  add('Sesi',sessionVerified&&player?'Terverifikasi server':read(localStorage,REFRESH)?'Token tersimpan, belum terverifikasi':'Mode Tamu');
 }catch(e){add('Akses API','Gagal ('+(e.name==='TypeError'?'periksa jaringan, CORS, DNS, sertifikat HTTPS':e.name||'error')+').');}
}

window.addEventListener('storage',event=>{
 if(event.key!==REFRESH)return;
 const latest=read(localStorage,REFRESH);
 if(!latest){access='';deadline=0;player=null;sessionVerified=false;remove(sessionStorage,SESSION);render();status('Sesi diakhiri dari tab lain. Mode Tamu aktif.');}
 else if(!sessionVerified){status('Sesi akun berubah dari tab lain. Verifikasi ulang sedang dijalankan…');refresh();}
 else if(latest!==event.oldValue){access='';deadline=0;player=null;sessionVerified=false;remove(sessionStorage,SESSION);render();refresh();}
});
function boot(){
 const body=document.querySelector('#nf30Overlay .nf30-body');if(!body)return;
 const section=document.createElement('section');section.id='nf350AuthPanel';section.className='nf30-card';
 section.innerHTML='<h3>🌐 Akun Resmi — Google Login</h3><p>Login hanya diperlukan untuk skor resmi dan sinkronisasi dengan server. Guest Mode dapat dimainkan tanpa login. Tidak memerlukan token Tailscale.</p><div id="nf350Who" hidden>✅ Masuk sebagai <strong id="nf350Player">Pemain resmi</strong></div><button type="button" id="nf350Login">Masuk dengan Google</button><div id="nf350GoogleMount"></div><button type="button" id="nf363CloudLink" hidden>☁️ Lihat Cloud Save (bandingkan progres)</button><button type="button" id="nf350Logout" hidden>Keluar dari Akun Resmi</button><div id="nf362AuthChip" role="status">🎮 Mode Tamu</div><button type="button" id="nf367Verify">🔎 Verifikasi Sesi di Server</button><button type="button" id="nf362Diagnose">🩺 Diagnostik Google Login</button><div id="nf362DiagOutput" role="status" aria-live="polite" style="white-space:pre-wrap;font-size:12px;max-height:190px;overflow-y:auto;background:#061d31;padding:10px;border-radius:8px" hidden></div><div id="nf350AuthStatus" role="status" aria-live="polite">Guest Mode aktif. Login Google opsional.</div><p>Untuk publik: pengelola harus menyediakan API HTTPS yang dapat diakses tanpa Tailnet. Token sesi perangkat disimpan di browser untuk fitur ingat login; gunakan perangkat pribadi.</p>';
 const official=$('nf32OfficialStatus')?.closest('section');if(official)body.insertBefore(section,official);else body.appendChild(section);
 $('nf363CloudLink')?.addEventListener('click',()=>{const panel=$('nf52-panel');if(panel){panel.scrollIntoView({behavior:'smooth',block:'start'});panel.focus?.({preventScroll:true});}else status('Panel Cloud Save belum tersedia. Buka Pengaturan atau halaman Progres.');}); $('nf350Login').addEventListener('click',showGoogle);
 $('nf367Verify')?.addEventListener('click',async()=>{
  status('Memeriksa sesi dengan server…');
  try{const bearer=await accessToken();if(!bearer)throw Error('Tidak ada sesi. Masuk dengan Google terlebih dahulu.');
   const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);
   try{const resp=await fetch(base()+'/me',{headers:{Authorization:'Bearer '+bearer,Accept:'application/json'},cache:'no-store',signal:ctrl.signal});
    if(!resp.ok)throw Error('HTTP '+resp.status);const data=await resp.json();
    if(Number(data.id)!==Number(player?.id))throw Error('ID akun berbeda. Keluar dan login ulang.');
    status('✅ Sesi server terverifikasi untuk '+String(data.name||'pemain')+'. Cloud Save dapat dibandingkan secara manual.');
   }finally{clearTimeout(timer)}
  }catch(err){status('⚠ Verifikasi sesi gagal: '+err.message+'; periksa koneksi atau login ulang.');}
 });
 $('nf362Diagnose')?.addEventListener('click',diagnose); $('nf350Logout').addEventListener('click',logout);
 if(read(localStorage,REFRESH)){status('Memulihkan sesi secara otomatis…');refresh();}render();
}
window.NetForgeAuth={accessToken,isSignedIn:()=>sessionVerified&&Boolean(access)&&Date.now()<deadline&&Boolean(player),getPlayer:()=>player?{name:String(player.name||''),picture:String(player.picture||'')}:null,logout,refresh,version:'0.59.00'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf351CloudDashboard === */
(()=>{'use strict';
 const $=id=>document.getElementById(id);let busy=false,lastFocus=null,autoRefresh=null;
 const fmt=v=>Number.isFinite(Number(v))?Number(v).toLocaleString('id-ID'):'—';
 const status=message=>{$('nf351Status').textContent=message};
 function clearStats(){for(const id of ['nf351XP','nf351Passed','nf351Total','nf351Best'])$(id).textContent='—';$('nf351Rows').replaceChildren();const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=4;td.textContent='Belum ada data resmi untuk ditampilkan.';tr.append(td);$('nf351Rows').append(tr)}
 function apiBase(){const v=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');if(!/^https:\/\//.test(v)&&!/^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/api\/v1$/.test(v))throw Error('Alamat API harus HTTPS.');if(!v.endsWith('/api/v1'))throw Error('Alamat API harus berakhir dengan /api/v1');return v}
 async function fetchOfficial(path){const token=await window.NetForgeAuth?.accessToken?.();if(!token)throw Error('Belum login atau sesi tidak dapat dipulihkan. Buka Pengaturan → Akun Resmi untuk masuk dengan Google.');const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);try{const res=await fetch(apiBase()+path,{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:controller.signal});const data=await res.json().catch(()=>({}));if(!res.ok)throw Error(data.error||'HTTP '+res.status);return data}finally{clearTimeout(timer)}}
 function appendCell(tr,value){const td=document.createElement('td');td.textContent=String(value);tr.append(td)}
 function display(data,identity){
   $('nf352IdentityText').textContent='✅ Official Player: '+String(identity?.name||data.player||'Pemain resmi');window.NF352?.showAvatar?.(identity?.picture);
   const attempts=Array.isArray(data.attempts)?data.attempts:[];
   const total=Number.isFinite(Number(data.totalAttempts))?Number(data.totalAttempts):null;
   const best=Number.isFinite(Number(data.bestScore))?Number(data.bestScore):Math.max(0,...attempts.map(a=>Number(a.score)||0));
   $('nf351XP').textContent=fmt(data.officialXP);$('nf351Passed').textContent=fmt(data.completedLabs??(Number(data.completedAttempts)>0?1:0));$('nf351Total').textContent=total===null?(attempts.length>=50?'50+':fmt(attempts.length)):fmt(total);$('nf351Best').textContent=fmt(best);
   $('nf351Rows').replaceChildren();if(!attempts.length){const tr=document.createElement('tr');const td=document.createElement('td');td.colSpan=4;td.textContent='Belum ada penilaian Guided Lab di server. Selesaikan Guided Lab dan pilih Verifikasi Guided Lab.';tr.append(td);$('nf351Rows').append(tr);return}
   for(const a of attempts){const tr=document.createElement('tr');const raw=String(a.created_at||'');let date=raw;const parsed=Date.parse(raw.replace(' ','T')+'Z');if(Number.isFinite(parsed))date=new Date(parsed).toLocaleString('id-ID',{timeZone:'UTC',hour12:false})+' UTC';appendCell(tr,date);appendCell(tr,fmt(a.score)+'/100');appendCell(tr,Number(a.passed)===1?'✓ Lulus':'Belum lulus');appendCell(tr,String(a.attempt_id||'').slice(0,80));$('nf351Rows').append(tr)}
 }
 async function reload(){if(busy)return;busy=true;$('nf351Reload').disabled=true;status('Mengambil progres resmi dari server…');try{if(!window.NetForgeAuth?.isSignedIn?.()){clearStats();$('nf352IdentityText').textContent='👤 Guest Player — belum masuk ke akun resmi';window.NF352?.showAvatar?.(null);status('Guest Mode aktif. Data lokal tidak ditampilkan sebagai nilai resmi.');return}const [me,progress]=await Promise.all([fetchOfficial('/me'),fetchOfficial('/progress')]);display(progress,me);window.NF352?.setProfile?.(me);window.NF352?.loadBoard?.();status('✅ Progres resmi berhasil disinkronkan dari server.')}catch(e){clearStats();$('nf352IdentityText').textContent='⚠️ Koneksi akun resmi belum tersedia';window.NF352?.showAvatar?.(null);status('Gagal mengambil data resmi: '+(e?.message||e)+'\nData lokal tidak diubah. Silakan coba lagi.')}finally{busy=false;$('nf351Reload').disabled=false}}
 function open(){lastFocus=document.activeElement;$('nf351Overlay').hidden=false;$('nf351Close').focus();reload()}
 function close(){$('nf351Overlay').hidden=true;lastFocus?.focus?.()}
 function account(){close();const settings=$('nf322Settings');if($('nf322Menu')&&!$('nf322Menu').hidden){settings?.click()}else{const shortcut=$('nf30Settings')||document.querySelector('[data-nf-settings]');if(shortcut)shortcut.click();else{status('Buka Pengaturan dari menu utama untuk mengakses Akun Resmi.');}}}
 function boot(){
  $('nf351DashboardMenu')?.addEventListener('click',open);$('nf351Close').addEventListener('click',close);$('nf351Reload').addEventListener('click',reload);$('nf351Account').addEventListener('click',account);
  $('nf351Overlay').addEventListener('click',e=>{if(e.target===$('nf351Overlay'))close()});document.addEventListener('keydown',e=>{if($('nf351Overlay').hidden)return;if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const buttons=[...$('nf351Overlay').querySelectorAll('button:not(:disabled)')];if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons[buttons.length-1].focus()}else if(!e.shiftKey&&document.activeElement===buttons[buttons.length-1]){e.preventDefault();buttons[0].focus()}}});
  window.addEventListener('netforge:official-attempt',()=>{if(!$('nf351Overlay').hidden)reload();else autoRefresh=true});window.addEventListener('netforge:auth-change',()=>{if(!$('nf351Overlay').hidden)reload()});
  const auth=$('nf350AuthPanel');if(auth){const b=document.createElement('button');b.type='button';b.id='nf351DashboardSettings';b.textContent='📊 Buka Dashboard Pemain';b.addEventListener('click',open);auth.append(b)}
  window.NetForgeDashboard={open,refresh:reload,fetchOfficial,version:'0.36.0'};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf352Leaderboard === */
(()=>{'use strict';const $=id=>document.getElementById(id);let profile=null;
const allowedPicture=url=>{try{let u=new URL(url);return u.protocol==='https:'&&(u.hostname==='googleusercontent.com'||u.hostname.endsWith('.googleusercontent.com'))?u.href:''}catch{return ''}};
function showAvatar(url){const img=$('nf352Avatar');if(!img)return;const safe=allowedPicture(url);img.hidden=!safe;if(safe){img.referrerPolicy='no-referrer';img.src=safe}else img.removeAttribute('src')}
function setProfile(p){profile=p;$('nf352OptIn').checked=!!p?.leaderboardOptIn;$('nf352ConsentStatus').textContent=p?.leaderboardOptIn?'✅ Anda memilih tampil di leaderboard.':'🔒 Profil Anda tidak ditampilkan pada leaderboard.';}
async function loadBoard(){const area=$('nf352Players');area.textContent='Memuat leaderboard…';try{if(!window.NetForgeAuth?.isSignedIn?.()){area.textContent='Masuk dengan Google untuk melihat leaderboard.';return}const data=await window.NetForgeDashboard.fetchOfficial('/leaderboard');area.replaceChildren();if(!data.players?.length){area.textContent='Belum ada pemain yang mengaktifkan leaderboard.';return}
for(const p of data.players){const a=document.createElement('article');const pic=allowedPicture(p.picture);if(pic){const img=document.createElement('img');img.alt='';img.referrerPolicy='no-referrer';img.src=pic;a.append(img)}const n=document.createElement('div');n.id='';n.textContent='#'+p.rank+' · '+p.name;a.append(n);const xp=document.createElement('span');xp.textContent=p.officialXP+' XP · '+p.bestScore+'/100';a.append(xp);area.append(a)}}catch(e){area.textContent='Leaderboard belum dapat dimuat: '+e.message}}
async function save(){const b=$('nf352SaveConsent');b.disabled=true;try{const token=await window.NetForgeAuth?.accessToken?.();if(!token)throw Error('Login Google diperlukan.');const base=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');const r=await fetch(base+'/profile/leaderboard',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({optIn:$('nf352OptIn').checked}),cache:'no-store'});const j=await r.json();if(!r.ok)throw Error(j.error||'HTTP '+r.status);setProfile(j);await loadBoard()}catch(e){$('nf352ConsentStatus').textContent='Tidak tersimpan: '+e.message;$('nf352OptIn').checked=!!profile?.leaderboardOptIn}finally{b.disabled=false}}
function boot(){$('nf352SaveConsent')?.addEventListener('click',save);$('nf352ReloadBoard')?.addEventListener('click',loadBoard)}window.NF352={showAvatar,setProfile,loadBoard};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();})();
;

/* === script:nf360UXEnhancements === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
function showTab(name){const tabs=[...document.querySelectorAll('[data-nf360-tab]')];if(!tabs.some(t=>t.dataset.nf360Tab===name))return;for(const tab of tabs){const active=tab.dataset.nf360Tab===name;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;const pane=$('nf360Panel'+name[0].toUpperCase()+name.slice(1));if(pane)pane.hidden=!active;} }
function updateIdentity(){const el=$('nf360MenuIdentityText');if(!el)return;const name=window.NetForgeGuest?.profile?.()?.name;const isSigned=Boolean(window.NetForgeAuth?.isSignedIn?.());el.textContent=isSigned?'Official Player · Google terhubung':name?'Guest Player · '+String(name).slice(0,60):'Guest Player · langsung bermain tanpa akun';}
function play(){const dash=$('nf351Close');if(dash && !$('nf351Overlay')?.hidden)dash.click();const menu=$('nf322Menu');if(menu && !menu.hidden){const resume=$('nf322Continue');resume?.click()}else{const lab=$('nf322Lab');const opening=$('nf322Adventure');if(lab && !$('nf322Overlay')?.hidden)opening?.click();}}
function boot(){for(const tab of document.querySelectorAll('[data-nf360-tab]')){tab.addEventListener('click',()=>showTab(tab.dataset.nf360Tab));tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('[data-nf360-tab]')];let i=tabs.indexOf(tab);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;showTab(tabs[i].dataset.nf360Tab);tabs[i].focus();});}showTab('overview');$('nf360PlayNext')?.addEventListener('click',play);updateIdentity();window.addEventListener('netforge:auth-change',updateIdentity);$('nf351DashboardMenu')?.addEventListener('click',()=>showTab('overview'));window.NetForgeUX={showTab,version:'0.40.47'};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf361-guided-tutorial === */
(()=>{'use strict';
 const KEY='netforge.iga.briefing.v0361';
 function init(){
  const coach=document.getElementById('nf27Coach');if(!coach)return;
  const box=document.createElement('section');box.id='nf361IgaGuide';box.innerHTML=`<strong>💡 Iga · Bantuan Interaktif</strong><p id="nf361IgaContext">Mulai Guided Lab untuk melihat petunjuk langkah berikutnya.</p><div class="nf361-controls"><button type="button" id="nf361IgaExplain">Apa yang harus saya lakukan?</button><button type="button" id="nf361IgaBrief">Panduan awal</button></div><p id="nf361IgaDiagnostic" role="status" aria-live="polite"></p>`;
  coach.append(box);
  const modal=document.createElement('div');modal.id='nf361IgaBriefing';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Petunjuk Guided Lab');
  modal.innerHTML=`<div class="nf361-iga-card"><h2>🎓 Halo, aku Iga!</h2><p>Di Guided Lab, kita membangun jaringan secara bertahap. Tidak harus langsung sempurna — periksa setiap tahap dan perbaiki bila ada kesalahan.</p><ol><li>Tarik atau tambah <b>Router, Switch, dan dua PC</b> ke workspace.</li><li>Hubungkan perangkat dengan <b>kabel jaringan</b>.</li><li>Atur <b>alamat IP unik</b> dalam satu subnet.</li><li>Masukkan <b>gateway</b> setiap PC.</li><li>Jalankan <b>Ping</b> lalu klik <b>Periksa tahap</b>.</li></ol><p>Gunakan tombol <b>Petunjuk Iga</b> jika tersendat. Nilai resmi tetap harus diverifikasi oleh server.</p><div class="nf361-iga-actions"><button type="button" class="secondary" id="nf361IgaLater">Tutup</button><button type="button" id="nf361IgaStart">Mengerti, mulai!</button></div></div>`;
  document.body.append(modal);
  const $=id=>document.getElementById(id);let lastIndex=-1,shown=false,doneShown=false;
  const descriptions=[
   ['Perangkat belum lengkap','Tambahkan 1 router, 1 switch, dan sekurang-kurangnya 2 PC melalui inventori.'],
   ['Kabel belum terhubung','Pastikan router tersambung ke switch, dan setiap PC terhubung ke switch. Periksa kabel yang rusak.'],
   ['Alamat IP belum sesuai','Set router ke 192.168.10.1/24, PC pertama 192.168.10.10/24, dan PC kedua 192.168.10.11/24.'],
   ['Gateway/subnet belum sesuai','Atur gateway setiap PC menjadi 192.168.10.1, dan prefix subnet ke 24.'],
   ['Ping belum berhasil','Buka Terminal Jaringan, pilih PC sebagai sumber dan router sebagai tujuan, jalankan PING hingga sukses.']
  ];
  function currentIndex(){const steps=[...coach.querySelectorAll('.nf27-step')];const active=steps.findIndex(el=>el.classList.contains('active'));return active<0?4:active}
  function update(){if(coach.hidden)return;const _steps=[...coach.querySelectorAll('.nf27-step')];const _done=_steps.length===5&&_steps.every(el=>el.classList.contains('passed'));if(_done){if(!doneShown){doneShown=true;lastIndex=-1;$('nf361IgaContext').textContent='🏆 Latihan selesai! Semua 5 tahap berhasil (skor 100/100). Kerja bagus — jaringanmu sudah valid.';$('nf361IgaDiagnostic').textContent='';}}else{doneShown=false;const i=currentIndex();if(i!==lastIndex){lastIndex=i;$('nf361IgaContext').textContent='Tahap '+(i+1)+'/5 · '+descriptions[i][0]+'. '+descriptions[i][1];$('nf361IgaDiagnostic').textContent='';}}if(!shown){shown=true;try{if(!localStorage.getItem(KEY)){open();localStorage.setItem(KEY,'seen')}}catch{}}}
  function open(){modal.hidden=false;$('nf361IgaStart').focus()}
  function close(){modal.hidden=true;$('nf361IgaExplain').focus()}
  $('nf361IgaBrief').onclick=open;$('nf361IgaLater').onclick=close;$('nf361IgaStart').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});modal.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  $('nf361IgaExplain').onclick=()=>{const _steps=[...coach.querySelectorAll('.nf27-step')];if(_steps.length===5&&_steps.every(el=>el.classList.contains('passed'))){$('nf361IgaDiagnostic').textContent='Semua tahap sudah selesai — tidak ada lagi yang perlu dilakukan di latihan ini.';return}const i=currentIndex();const d=descriptions[i];$('nf361IgaDiagnostic').textContent=d[1];$('nf361IgaDiagnostic').dataset.kind='hint';if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay(d[1],'think')};
  $('nf27Check')?.addEventListener('click',()=>{const msg=$('nf27Message')?.textContent||'';const error=msg.startsWith('Belum sesuai');$('nf361IgaDiagnostic').dataset.kind=error?'error':'success';$('nf361IgaDiagnostic').textContent=error?'Iga menjelaskan: '+msg:'✓ '+msg;setTimeout(update,0)});
  const observer=new MutationObserver(update);observer.observe(coach,{subtree:true,attributes:true,childList:true,attributeFilter:['hidden','class']});/* v0.40.92: render() Guided Lab membangun ulang langkah via innerHTML (childList), bukan perubahan atribut — observer lama tidak pernah terpanggil saat "Ulang latihan", sehingga petunjuk Iga basi di tahap lama. */
  window.addEventListener('netforge:auth-change',update);update();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf362-responsive-controls === */
(()=>{'use strict';
 const choices=[['workspace','🕹 Workspace'],['devices','🧰 Perangkat'],['mission','🎯 Misi & Iga']];
 const dock=document.createElement('nav');dock.id='nf362MobileDock';dock.setAttribute('aria-label','Navigasi workspace untuk layar kecil');
 for(const [key,label] of choices){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.nf362Panel=key;b.setAttribute('aria-pressed',key==='workspace'?'true':'false');dock.append(b)}
 const help=document.createElement('div');help.id='nf362WorkspaceHelp';help.textContent='💡 Pilih Perangkat untuk menambah alat jaringan, Misi & Iga untuk petunjuk, lalu kembali ke Workspace untuk menghubungkan perangkat.';
 function activate(key,scroll){if(!choices.some(([k])=>k===key))return;
  for(const [k] of choices)document.body.classList.toggle('nf362-mobile-selected-'+k,k===key);
  for(const b of dock.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.nf362Panel===key));
  if(scroll && matchMedia('(max-width:820px)').matches){const target=key==='devices'?document.querySelector('.layout>.left'):key==='mission'?document.querySelector('.layout>.right'):document.querySelector('.layout>.workspace-shell');target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});}
 }
 function boot(){const layout=document.querySelector('.layout'),workspace=document.querySelector('.layout>.workspace-shell');if(!layout||!workspace)return;
  document.querySelector('.topbar')?.insertAdjacentElement('afterend',dock);
  workspace.prepend(help);
  dock.addEventListener('click',e=>{const b=e.target.closest('button[data-nf362-panel]');if(b)activate(b.dataset.nf362Panel,true)});
  const media=matchMedia('(max-width:820px)');function reconcile(){if(media.matches){if(!choices.some(([k])=>document.body.classList.contains('nf362-mobile-selected-'+k)))activate('workspace',false)}else{for(const [k] of choices)document.body.classList.remove('nf362-mobile-selected-'+k)}}
  media.addEventListener?.('change',reconcile);reconcile();
  window.NetForgeMobile={openPanel:key=>activate(key,true)};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf363-workspace-shortcuts === */
(()=>{'use strict';
 function boot(){
  const stage=document.querySelector('.stagebar');if(!stage)return;
  const help=document.createElement('button');help.id='nf363ShortcutTip';help.type='button';help.textContent='⌨ Pintasan Keyboard';stage.append(help);
  const modal=document.createElement('section');modal.id='nf363ShortcutHelp';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-label','Pintasan NET FORGE');modal.setAttribute('aria-modal','true');
  modal.innerHTML='<div><h2>⌨ Pintasan NET FORGE</h2><p><kbd>Alt</kbd> + <kbd>1</kbd> — Panel Perangkat (mobile)</p><p><kbd>Alt</kbd> + <kbd>2</kbd> — Workspace (mobile)</p><p><kbd>Alt</kbd> + <kbd>3</kbd> — Misi & Iga (mobile)</p><p><kbd>Alt</kbd> + <kbd>H</kbd> — Panduan workspace</p><p><kbd>Esc</kbd> — Tutup panduan ini</p><button type="button" id="nf363ShortcutClose">Tutup</button></div>';
  document.body.append(modal);
  const close=()=>{modal.hidden=true;help.focus()};
  help.onclick=()=>{modal.hidden=false;document.getElementById('nf363ShortcutClose').focus()};
  document.getElementById('nf363ShortcutClose').onclick=close;
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  document.addEventListener('keydown',e=>{
   if(e.key==='Escape'&&!modal.hidden){e.preventDefault();close();return}
   if(!e.altKey||e.ctrlKey||e.metaKey||e.repeat||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
   const k=e.key.toLowerCase();
   if(['1','2','3'].includes(k)){
    const p={'1':'devices','2':'workspace','3':'mission'}[k];
    const b=document.querySelector('[data-nf362-panel="'+p+'"]');
    if(b&&matchMedia('(max-width:820px)').matches){e.preventDefault();b.click()}
   }else if(k==='h'){const b=document.getElementById('nf24Help');if(b){e.preventDefault();b.click()}}
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf364-ergonomics === */
(()=>{'use strict';const $=id=>document.getElementById(id),stage=$('stage'),board=$('board');if(!stage||!board)return;
const tools=document.createElement('div');tools.id='nf364Tools';tools.setAttribute('role','toolbar');tools.setAttribute('aria-label','Kontrol area simulasi');
tools.innerHTML='<button type="button" id="nf364Undo" title="Batalkan perubahan topologi (Ctrl+Z)">↶ Undo</button><button type="button" id="nf364Redo" title="Ulangi perubahan topologi (Ctrl+Shift+Z)">↷ Redo</button><button type="button" id="nf364ZoomOut" title="Perkecil">−</button><output id="nf364ZoomStatus" aria-live="polite">100%</output><button type="button" id="nf364ZoomIn" title="Perbesar">＋</button><button type="button" id="nf364Fit" title="Reset tampilan">⛶ Fit</button><button type="button" id="nf364Pan" aria-pressed="false" title="Geser kanvas tanpa memindahkan node">✋ Pan</button>';
const host=document.querySelector('.workspace-panel .panelhead');if(host)host.insertAdjacentElement('afterend',tools);else stage.insertAdjacentElement('beforebegin',tools);
let zoom=1,x=0,y=0,panMode=false,drag=null;const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
function apply(){board.style.transformOrigin='center center';board.style.transform=`translate(${x}px,${y}px) scale(${zoom})`;$('nf364ZoomStatus').textContent=Math.round(zoom*100)+'%'}
function setZoom(next){zoom=clamp(next,.6,1.8);x=clamp(x,-board.offsetWidth*.45,board.offsetWidth*.45);y=clamp(y,-board.offsetHeight*.45,board.offsetHeight*.45);apply()}
$('nf364ZoomIn').onclick=()=>setZoom(+(zoom+.1).toFixed(2));$('nf364ZoomOut').onclick=()=>setZoom(+(zoom-.1).toFixed(2));$('nf364Fit').onclick=()=>{zoom=1;x=0;y=0;apply()};
$('nf364Pan').onclick=()=>{panMode=!panMode;$('nf364Pan').setAttribute('aria-pressed',String(panMode));board.classList.toggle('nf364-pan-mode',panMode);board.style.pointerEvents='auto';};
board.addEventListener('pointerdown',e=>{if(!panMode||e.target.closest('button,input'))return;if(e.button!==0)return;e.stopPropagation();drag={id:e.pointerId,sx:e.clientX,sy:e.clientY,startX:x,startY:y};board.setPointerCapture(e.pointerId);e.preventDefault()},true);
board.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;x=clamp(drag.startX+e.clientX-drag.sx,-board.offsetWidth*.6,board.offsetWidth*.6);y=clamp(drag.startY+e.clientY-drag.sy,-board.offsetHeight*.6,board.offsetHeight*.6);apply()},true);
function stop(e){if(drag&&e.pointerId===drag.id){drag=null;try{board.releasePointerCapture(e.pointerId)}catch{}}}board.addEventListener('pointerup',stop,true);board.addEventListener('pointercancel',stop,true);
board.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();setZoom(zoom+(e.deltaY<0?.1:-.1))},{passive:false});
const history=window.NetForgeWorkspaceHistory;function updateHistory(){const h=history?.state?.()||{};$('nf364Undo').disabled=!h.undo;$('nf364Redo').disabled=!h.redo}updateHistory();window.addEventListener('netforge:history-state',updateHistory);
$('nf364Undo').onclick=()=>history?.undo?.();$('nf364Redo').onclick=()=>history?.redo?.();
document.addEventListener('keydown',e=>{if(!e.ctrlKey&&!e.metaKey)return;const t=e.target;if(t?.closest?.('input,textarea,select,[contenteditable="true"]'))return;if(e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)history?.redo?.();else history?.undo?.()}else if(e.key.toLowerCase()==='y'){e.preventDefault();history?.redo?.()}});
const chip=document.createElement('div');chip.id='nf364PlayerChip';chip.innerHTML='<span class="nf364-initials" id="nf364ChipInitials">G</span><img id="nf364ChipAvatar" alt="" hidden><span class="nf364-label" id="nf364ChipName">Guest Player</span>';
const top=document.querySelector('.topbar .topstats')||document.querySelector('.topbar');if(top)top.prepend(chip);
const menu=$('nf360MenuIdentity');if(menu){const pic=document.createElement('img');pic.id='nf364MenuAvatar';pic.alt='';pic.hidden=true;const initials=document.createElement('span');initials.id='nf364MenuInitials';initials.textContent='G';menu.prepend(initials,pic)}
const safePhoto=url=>{try{const u=new URL(url);return u.protocol==='https:'&&(u.hostname==='googleusercontent.com'||u.hostname.endsWith('.googleusercontent.com'))?u.href:''}catch{return ''}};
let identityFetch=null;
function show(identity){const signed=Boolean(window.NetForgeAuth?.isSignedIn?.());const guest=window.NetForgeGuest?.profile?.()?.name||'Guest Player';const name=String(signed?(identity?.name||'Official Player'):guest).trim().slice(0,80)||'Player';const url=signed?safePhoto(identity?.picture):'';const initials=name.split(/\s+/).slice(0,2).map(word=>word[0]||'').join('').toUpperCase();
$('nf364ChipName').textContent=name;$('nf364ChipName').title=name;$('nf364ChipInitials').textContent=initials;$('nf364MenuInitials')&&($('nf364MenuInitials').textContent=initials);
const menuText=$('nf360MenuIdentityText');if(menuText)menuText.textContent=(signed?'✓ Official Player · ':'Guest Player · ')+name;
for(const pair of [['nf364ChipAvatar','nf364ChipInitials'],['nf364MenuAvatar','nf364MenuInitials']]){const img=$(pair[0]),fallback=$(pair[1]);if(!img)continue;img.hidden=!url;if(fallback)fallback.hidden=!!url;if(url){img.referrerPolicy='no-referrer';img.onerror=()=>{img.hidden=true;if(fallback)fallback.hidden=false};if(img.src!==url)img.src=url}else img.removeAttribute('src')}
}
async function sync(){const signed=Boolean(window.NetForgeAuth?.isSignedIn?.());const cached=window.NetForgeAuth?.getPlayer?.();show(cached);if(!signed)return;if(identityFetch)return identityFetch;
 identityFetch=(async()=>{try{const tok=await window.NetForgeAuth?.accessToken?.();if(!tok)return;const base=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');if(!/^https:\/\//.test(base)&&!/^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/api\/v1$/.test(base))return;const c=new AbortController(),timer=setTimeout(()=>c.abort(),7000);try{const r=await fetch(base+'/me',{headers:{Authorization:'Bearer '+tok},cache:'no-store',signal:c.signal});if(r.ok&&window.NetForgeAuth?.isSignedIn?.())show(await r.json())}finally{clearTimeout(timer)}}catch{}finally{identityFetch=null}})();return identityFetch;
}
show(window.NetForgeAuth?.getPlayer?.());window.addEventListener('netforge:auth-change',()=>{show(window.NetForgeAuth?.getPlayer?.());sync()});window.addEventListener('netforge:guest-change',()=>show(window.NetForgeAuth?.getPlayer?.()));
// Give login scripts time to restore sessions, without polling indefinitely.
setTimeout(sync,900);window.NetForgeWorkspaceUI={version:'0.40.31',zoom:()=>zoom,refreshPlayer:sync};apply();
})();
;

/* === script:nf365-recovery-center === */
(()=>{'use strict';
const KEYS={mission:'netforge.mission.autosave.v031',lab:'netforge.lab.autosave.v031',previousMission:'netforge.mission.previous.v0365',previousLab:'netforge.lab.previous.v0365'};
// v0.59.00: status "armed" dua-klik disimpan di sini (per kind), bukan hanya di
// dataset tombol — render() membangun ulang semua tombol setiap dialog dibuka,
// sehingga armed di elemen bisa hilang sebelum klik kedua.
const $=id=>document.getElementById(id);
// v0.59.00: clearArmed dipakai di clear()/render() tapi TIDAK PERNAH dideklarasikan,
// sehingga di 'use strict' render() throw ReferenceError dan dialog Pemulihan
// tidak pernah terbuka (tombol "Hapus Lokal" tidak pernah ada di DOM).
const clearArmed={};
function read(key){try{const raw=localStorage.getItem(key);if(!raw)return null;const x=JSON.parse(raw);if(!x||x.schema!==1||!Number.isFinite(Date.parse(x.savedAt)))return null;return x}catch{return null}}
function valid(kind,d){if(!d)return false;if(kind==='mission'){
 if(d.format!=='NETFORGE-MISSION'||!d.progress||!Array.isArray(d.progress.nodes)||!Array.isArray(d.progress.links)||d.progress.nodes.length>60||d.progress.links.length>150)return false;
 return !!d.progress.missionConfig&&Number.isInteger(d.progress.mission)&&d.progress.mission>=1&&d.progress.mission<=6;
 }return d.format==='NETFORGE-LAB-AUTOSAVE'&&d.payload?.format==='NETFORGE-LAB'&&Array.isArray(d.payload.nodes)&&Array.isArray(d.payload.links)&&d.payload.nodes.length<=60&&d.payload.links.length<=150;}
function when(v){try{return new Date(v).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'})}catch{return 'Tidak diketahui'}}
function makeBtn(text,fn,active=true,primary=false){const b=document.createElement('button');b.type='button';b.textContent=text;b.disabled=!active;if(primary)b.className='nf365-primary';b.addEventListener('click',fn);return b}
function status(t){const el=$('nf365Status');if(el)el.textContent=t}
function exportData(){const data={format:'NETFORGE-LOCAL-TOPOLOGY-BACKUP',schema:1,exportedAt:new Date().toISOString(),mission:read(KEYS.mission),lab:read(KEYS.lab),previousMission:read(KEYS.previousMission),previousLab:read(KEYS.previousLab)};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='netforge-topologi-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);status('File JSON topologi berhasil disiapkan. Token akun tidak ikut diekspor.')}
function resume(kind,d,isPrevious){
 if(!valid(kind,d)){status('Cadangan tidak valid, tidak dapat dipulihkan.');return}
 if(isPrevious){if(!confirm('Menggantikan autosave '+(kind==='mission'?'Misi':'LAB')+' sekarang dengan cadangan sebelumnya? Simpan file ekspor dahulu bila diperlukan.'))return;
 try{localStorage.setItem(KEYS[kind],JSON.stringify(d))}catch{status('Penyimpanan browser tidak tersedia.');return}
 // Ensure active game state isn't overwritten by old in-memory state before reload.
 window.location.reload();return;
 }
 if(kind==='mission'){
  const ok=window.NetForgeProgress?.resume?.();status(ok?'Misi berhasil dipulihkan.':'Gagal memulihkan Misi.');if(ok)close();return;
 }
 // LAB currently has an established safe import flow in the LAB modal.
 const shade=$('nf26Shade');const button=$('nf31LabResume');if(shade&&button){shade.hidden=false;shade.classList.add('open');button.click();status('Pemulihan LAB dijalankan melalui menu LAB.');close()}else{status('Buka Network LAB terlebih dahulu lalu pilih Lanjutkan Eksperimen Lab.')}
}
function clear(kind,btn){
 // v0.59.00: reset misi yang BENAR-BENAR berfungsi. Dua masalah lama: (1)
 // confirm() native sering auto-dismiss di browser uji sehingga hapus tidak
 // pernah jalan — diganti konfirmasi dua-klik pada tombolnya sendiri; (2)
 // clear hanya menghapus kunci klasik, sementara autosave 3-detik menulis
 // ulang state lama dari memori dan kunci unified memulihkan topologi.
 // Kini: kunci klasik + unified dihapus, state memori direset, lalu autosave
 // menulis state kosong yang baru. XP dan flag kelulusan pertama TIDAK dihapus.
 const _armedAt=clearArmed[kind]||0;
 if(!_armedAt||Date.now()-_armedAt>10000){clearArmed[kind]=Date.now();if(btn){btn.dataset.armed='1';btn.textContent='⚠ Yakin hapus? Klik lagi (10 dtk)'}status('Klik Hapus Lokal sekali lagi untuk mengonfirmasi (10 detik).');setTimeout(()=>{if(Date.now()-(clearArmed[kind]||0)>=10000){delete clearArmed[kind];if(btn&&btn.isConnected&&btn.dataset.armed==='1'){btn.dataset.armed='';btn.textContent='Hapus Lokal'}}},10100);return}
 delete clearArmed[kind];
 if(btn){btn.dataset.armed='';btn.textContent='Hapus Lokal'}
 doReset(kind);}
function doReset(kind){
 const _prevKey=kind==='mission'?'previousMission':'previousLab';
 try{const _cur=localStorage.getItem(KEYS[kind]);if(_cur)localStorage.setItem(KEYS[_prevKey],_cur)}catch{}
 try{
  const _keys=[KEYS[kind],KEYS[_prevKey]];
  if(kind==='mission'){_keys.push('netforge.universal.mission.v2.basics','netforge.universal.mission.v2.smart','netforge.universal.mission.v2.office','netforge.universal.mission.v2.free','netforge.universal.free.v1','netforge.universal.active-profile.v1','netforge.guided.progress.v1')/* v0.40.92: 'netforge.unified.mission.progress.v1' TIDAK ikut dihapus — reset() validator kini mempertahankan stempel kelulusan pertama + skor terbaik (sesuai klaim dialog). */}
  for(const _k of _keys)try{localStorage.removeItem(_k)}catch{}
  if(kind==='mission'){
   try{if(window.NetForgeLab?.active?.())window.NetForgeLab.leave()}catch{}
   try{startCampaignMission(mission||1)}catch{}
   try{window.NetForgeUniversalInventory?.resetCanvas?.()}catch{}
   try{if(typeof updateObjectives==='function')updateObjectives()}catch{}
   try{if(typeof updateStats==='function')updateStats()}catch{}
   try{if(window.NetForgeMissionProgress?.reset)window.NetForgeMissionProgress.reset()}catch{}
   try{if(window.NetForgeMissionValidator?.preview)window.NetForgeMissionValidator.preview()}catch{}
  }else{
   try{if(window.NetForgeLab?.active?.())window.NetForgeLab.leave()}catch{}
  }
  status(kind==='mission'?'Data lokal misi dihapus. Misi kembali ke 0 objective dengan topologi kosong dan budget awal. XP dan catatan kelulusan pertama tetap tersimpan (pengulangan misi tetap 0 XP).':'Data lokal LAB dihapus.');render();
 }catch{status('Gagal menghapus data lokal.')}}
function render(){const body=$('nf365Records');if(!body)return;body.replaceChildren();for(const [kind,label] of [['mission','Misi'],['lab','Network LAB']]){
 const current=read(KEYS[kind]);const prior=read(KEYS[kind==='mission'?'previousMission':'previousLab']);const box=document.createElement('div');box.className='nf365-rec';const title=document.createElement('strong');title.textContent=label;box.append(title);
 const desc=document.createElement('small');desc.textContent=valid(kind,current)?'Autosave terakhir: '+when(current.savedAt):'Belum ada autosave valid';box.append(desc);
 const acts=document.createElement('div');acts.className='nf365-actions';acts.append(makeBtn('↩ Pulihkan',()=>resume(kind,current,false),valid(kind,current),true));acts.append(makeBtn('↶ Cadangan Sebelumnya'+(prior?' · '+when(prior.savedAt):''),()=>resume(kind,prior,true),valid(kind,prior)));const _hb=makeBtn('Hapus Lokal',e=>clear(kind,e.currentTarget),!!current);if(clearArmed[kind]&&Date.now()-clearArmed[kind]<10000){_hb.dataset.armed='1';_hb.textContent='⚠ Yakin hapus? Klik lagi (10 dtk)'}acts.append(_hb);box.append(acts);body.append(box);
 }}
function close(){const d=$('nf365Dialog');d.hidden=true;}
function init(){if($('nf365Launcher'))return;const btn=document.createElement('button');btn.id='nf365Launcher';btn.type='button';btn.textContent='💾 Pemulihan';btn.setAttribute('aria-label','Buka pusat penyimpanan dan pemulihan NET FORGE');document.body.append(btn);
 const d=document.createElement('section');d.id='nf365Dialog';d.hidden=true;d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','nf365Title');
 const card=document.createElement('div');card.id='nf365Card';const h=document.createElement('h2');h.id='nf365Title';h.textContent='💾 Simpan & Pulihkan';card.append(h);
 const info=document.createElement('p');info.textContent='Autosave topologi berjalan otomatis setiap 3 detik dan saat aplikasi berpindah ke background. Cadangan sebelumnya disimpan secara berkala. Semua data di sini bersifat lokal, bukan skor resmi server.';card.append(info);
 const controls=document.createElement('div');controls.className='nf365-actions';controls.append(makeBtn('Simpan Sekarang',()=>{window.NetForgeProgress?.save?.();render();status('Penyimpanan diproses. Periksa waktu autosave di bawah.')},true,true));controls.append(makeBtn('Ekspor JSON',exportData));controls.append(makeBtn('Tutup',close));card.append(controls);
 const records=document.createElement('div');records.id='nf365Records';card.append(records);const note=document.createElement('p');note.id='nf365Status';note.setAttribute('role','status');card.append(note);d.append(card);document.body.append(d);
 btn.addEventListener('click',()=>{render();status('');d.hidden=false});d.addEventListener('click',e=>{if(e.target===d)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!d.hidden)close()});
 window.addEventListener('netforge:local-save',()=>{if(!d.hidden)render()});
 window.NetForgeMissionReset={clear,reset:doReset};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf366-qa-center === */
(()=>{'use strict';
const $=id=>document.getElementById(id),release=window.NETFORGE_RELEASE?.version||'0.40.30';
let results=[],busy=false,previousFocus=null;
const label={pass:'✓ OK',warn:'! Perlu diperiksa',fail:'✕ Gagal'};
function add(name,state,detail){results.push({name,state,detail:String(detail||'')})}
function render(){const host=$('nf366Checks');host.replaceChildren();for(const c of results){const line=document.createElement('div');line.className='nf366-test';const h=document.createElement('strong');h.textContent=c.name;const st=document.createElement('span');st.className='nf366-'+c.state;st.textContent=label[c.state];const d=document.createElement('small');d.textContent=c.detail;line.append(h,st,d);host.append(line)}const good=results.filter(r=>r.state==='pass').length;$('nf366Summary').textContent=good+'/'+results.length+' pemeriksaan OK · Status server/Tailscale dapat berbeda menurut perangkat.'}
async function run(){if(busy)return;busy=true;results=[];$('nf366Summary').textContent='Memeriksa…';
 try{
  add('Versi game aktif','pass','v'+release+' berasal dari kode HTML yang sedang dijalankan, bukan metadata versi terbaru.');
  try{const resp=await fetch('./version.json?qa='+Date.now(),{cache:'no-store'});if(!resp.ok)throw Error('HTTP '+resp.status);const x=await resp.json();if(!/^\d+\.\d+\.\d+$/.test(x.version||''))throw Error('Format versi tidak valid');add('Versi terbaru GitHub Pages','pass','v'+x.version+' tersedia di server; versi aktif v'+release+'.')}catch(e){add('Versi terbaru GitHub Pages','warn','Belum dapat diakses: '+e.message)}
  if('serviceWorker' in navigator){try{const r=await navigator.serviceWorker.getRegistration('./');const controlled=Boolean(navigator.serviceWorker.controller);add('Service Worker / PWA',controlled?'pass':'warn',controlled?'PWA dikontrol Service Worker.':'Belum dikontrol Service Worker (normal untuk HTML lokal atau kunjungan pertama).'+(r?' Registrasi tersedia.':''))}catch(e){add('Service Worker / PWA','warn',e.message)}}else add('Service Worker / PWA','warn','Browser tidak mendukung Service Worker.');
  try{const k='nf366.check.'+Math.random().toString(36).slice(2);localStorage.setItem(k,'ok');const ok=localStorage.getItem(k)==='ok';localStorage.removeItem(k);add('Penyimpanan lokal',ok?'pass':'fail',ok?'Baca/tulis localStorage berhasil, tidak menghapus progres pemain.':'Baca/tulis gagal.')}catch(e){add('Penyimpanan lokal','fail','Periksa mode privat/kuota penyimpanan: '+e.message)}
  const m=window.NetForgeProgress?.readMission?.();const labKey=window.NetForgeProgress?.labKey;let lab=false;try{const raw=localStorage.getItem(labKey);const d=raw&&JSON.parse(raw);lab=Boolean(d?.format==='NETFORGE-LAB-AUTOSAVE'&&d.schema===1)}catch{}add('Autosave Misi / LAB','pass','Misi '+(m?'tersedia':'belum dibuat')+' · LAB '+(lab?'tersedia':'belum dibuat')+'. Belum ada data merupakan kondisi normal.');
  const signed=Boolean(window.NetForgeAuth?.isSignedIn?.());const p=window.NetForgeAuth?.getPlayer?.();const nm=signed?(p?.name||'Nama belum dimuat'):(window.NetForgeGuest?.profile?.()?.name||'Guest Player');add('Identitas pemain',signed&&p?.name?'pass':'warn',signed?'Official Player: '+nm+'. Avatar '+(p?.picture?'tersedia (belum tentu berhasil dimuat).':'tidak tersedia; fallback inisial aktif.'):'Guest Mode: '+nm+'. Login Google opsional.');
  const ac=window.AudioContext||window.webkitAudioContext;add('Dukungan efek suara',ac?'pass':'warn',ac?'Web Audio didukung. Audio bisa tetap terkunci sampai pemain menekan tombol Mulai dengan Suara / Tes SFX.':'Web Audio tidak didukung.');
  const url=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');if(!url||!/^https:\/\//.test(url)){add('Koneksi API','warn','API tidak dikonfigurasi HTTPS. Guest Mode tetap dapat dimainkan.')}else{try{const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),4500);try{const res=await fetch(url+'/health',{cache:'no-store',signal:ctl.signal});add('Koneksi API',res.ok?'pass':'warn',res.ok?'Health endpoint dapat dijangkau tanpa token.':'HTTP '+res.status+'; cek akses Tailnet/CORS.')}finally{clearTimeout(t)}}catch(e){add('Koneksi API','warn','Tidak dapat menjangkau health: '+e.message+'. Periksa jaringan, Tailnet dan CORS.')}}
 }finally{render();busy=false}}
function copy(){const content='NET FORGE QA v'+release+'\n'+results.map(x=>x.name+': '+label[x.state]+' — '+x.detail).join('\n');if(navigator.clipboard?.writeText){navigator.clipboard.writeText(content).then(()=>$('nf366Summary').textContent='Laporan pemeriksaan disalin (tanpa token akses).').catch(()=>fallback(content))}else fallback(content)}
function fallback(content){const ta=document.createElement('textarea');ta.value=content;ta.style.cssText='position:fixed;left:-9999px';document.body.append(ta);ta.select();try{document.execCommand('copy');$('nf366Summary').textContent='Laporan pemeriksaan disalin (tanpa token akses).'}catch{$('nf366Summary').textContent='Salin manual melalui clipboard tidak tersedia.'}ta.remove()}
function close(){$('nf366Modal').hidden=true;previousFocus?.focus?.()}
function init(){if($('nf366Open'))return;const b=document.createElement('button');b.id='nf366Open';b.type='button';b.textContent='🩺 Diagnostik';document.body.append(b);
 const modal=document.createElement('section');modal.id='nf366Modal';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','nf366Title');const card=document.createElement('div');card.id='nf366Card';const h=document.createElement('h2');h.id='nf366Title';h.textContent='🩺 Pusat Diagnostik NET FORGE';card.append(h);const p=document.createElement('p');p.textContent='Pemeriksaan ini tidak mengubah nilai resmi, tidak melakukan logout, dan tidak menampilkan token akun. Uji suara aktual tetap perlu dilakukan dengan tombol Tes SFX di pengaturan audio.';card.append(p);const content=document.createElement('div');content.id='nf366Checks';card.append(content);const controls=document.createElement('div');controls.className='nf366-actions';const re=document.createElement('button');re.textContent='Periksa Ulang';re.onclick=run;const cp=document.createElement('button');cp.textContent='Salin Laporan';cp.onclick=copy;const x=document.createElement('button');x.textContent='Tutup';x.onclick=close;controls.append(re,cp,x);card.append(controls);const sum=document.createElement('p');sum.id='nf366Summary';sum.setAttribute('role','status');card.append(sum);modal.append(card);document.body.append(modal);
 b.onclick=()=>{previousFocus=document.activeElement;modal.hidden=false;re.focus();run()};modal.onclick=e=>{if(e.target===modal)close()};modal.addEventListener('keydown',e=>{if(e.key==='Escape')close()});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf370-smart-home-script === */
/* NET FORGE v0.40.92 — Smart Home Hybrid: a local, deterministic teaching simulator. */
(()=>{'use strict';
const KEY='netforge.smart-home.n01.v1';
const defaults={tv:'wifi5',camera:'poe',iot:'wifi24',nvr:'lan',distance:5,walls:1,poe:'60',uplink:'1000',dhcp:true,onvif:true,segment:false};
let state={...defaults},last=null,open=false,previousFocus=null;
const by=id=>document.getElementById(id);
const esc=v=>String(v).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function restore(){try{const old=JSON.parse(localStorage.getItem(KEY)||'null');if(old?.state&&typeof old.state==='object'){for(const k of Object.keys(defaults))if(typeof old.state[k]===typeof defaults[k])state[k]=old.state[k]}}catch{}}
function save(){try{const old=JSON.parse(localStorage.getItem(KEY)||'null');localStorage.setItem(KEY,JSON.stringify({schema:1,state,bestScore:Math.max(old?.bestScore||0,last?.score||0),savedAt:new Date().toISOString()}))}catch{}}
function evaluate(s){
 const rf=window.NetForgeWirelessEngine?.evaluate?.(s)||null;const radio=s.tv!=='lan';const band=s.tv==='wifi24'?'2.4 GHz':'5 GHz';
 // Educational approximation — not a calibrated Wi-Fi propagation or throughput model.
 const rssi=Math.round(-34-2.1*s.distance-(s.tv==='wifi5'?7:4)*s.walls);
 const throughput=s.tv==='lan'?Math.min(Number(s.uplink),300):Math.max(2,Math.round((s.tv==='wifi5'?260:85)*Math.max(.10,Math.min(1,(rssi+91)/52))));
 const ipReady=Boolean(s.dhcp||window.NetForgeDeviceConfig?.staticReady?.());
 const tvPass=Boolean(ipReady&&(s.tv==='lan'||(rf?rf.tv.ok:(rssi>=-75&&throughput>=25))));
 const poeDraw=4*12,poePower=s.camera==='poe'&&Number(s.poe)>=poeDraw;
 const camsPowered=s.camera==='poe'?poePower:true;
 const camSignal=-34-2.1*(s.distance+3)-4*s.walls;
 const cameraStable=s.camera==='poe'?poePower:(rf?rf.camera.ok:camSignal>=-67);
 const nvrCapacity=s.nvr==='lan'?Number(s.uplink):(rf?rf.nvr.mbps:Math.max(10,Math.round(85*Math.max(.15,(rssi+91)/52))));
 const camTraffic=4*8,record=Boolean(ipReady&&camsPowered&&cameraStable&&s.onvif&&nvrCapacity>=camTraffic);
 const iotPass=Boolean(ipReady&&s.iot==='wifi24'&&(!rf||rf.iot.ok)); // 2.4 GHz-only and sufficient modeled coverage
 const backbone=Number(s.uplink)>=1000;
 const tests=[
  {key:'tv',name:'Smart TV: streaming 4K',ok:tvPass,points:25,info:s.tv==='lan'?`LAN ${s.uplink} Mbps; butuh ≥25 Mbps`:`${band} · sinyal ~${rf?rf.tv.dbm:rssi} dBm · estimasi ${rf?rf.tv.mbps:throughput} Mbps; target ≥25 Mbps`},
  {key:'camera',name:'CCTV: suplai dan koneksi',ok:cameraStable&&camsPowered,points:20,info:s.camera==='poe'?`4 kamera × 12 W = 48 W; budget switch ${s.poe} W`:`Kamera Wi-Fi; sinyal ~${rf?rf.camera.dbm:Math.round(camSignal)} dBm; kapasitas ~${rf?rf.camera.mbps:'?'} Mbps`},
  {key:'nvr',name:'NVR: perekaman 4 kamera',ok:record,points:20,info:`Kebutuhan 32 Mbps · link NVR ~${nvrCapacity} Mbps · ONVIF ${s.onvif?'aktif':'nonaktif'} · DHCP ${s.dhcp?'aktif':'nonaktif'}`},
  {key:'iot',name:'IoT: sensor 2,4 GHz',ok:iotPass,points:15,info:s.iot==='wifi24'?`2,4 GHz · sinyal ~${rf?rf.iot.dbm:'—'} dBm; perlu DHCP dan cakupan`:'Sensor pada skenario ini tidak mendukung 5 GHz'},
  {key:'uplink',name:'Uplink Gigabit',ok:backbone,points:10,info:`Negosiasi ${s.uplink} Mbps; 100 Mbps belum tentu gagal, tetapi ruang ekspansinya lebih kecil`},
  {key:'security',name:'Segmentasi IoT/CCTV',ok:s.segment,points:10,info:s.segment?'Segmentasi rancangan aktif; ACL nyata tetap perlu diverifikasi':'Belum dipisahkan dari jaringan pengguna; risiko lateral access'}
 ];
 const ipCheck=window.NetForgeDeviceConfig?.validate?.(s);
 if(ipCheck){
   const testMap={tv:'tv',camera:'camera',iot:'iot',nvr:'nvr'};
   for(const test of tests){
     if(test.key==='tv'&&ipCheck.failures.tv){test.ok=false;test.info+=' · IP: '+ipCheck.failures.tv}
     if(test.key==='camera'&&ipCheck.failures.camera){test.ok=false;test.info+=' · IP: '+ipCheck.failures.camera}
     if(test.key==='iot'&&ipCheck.failures.iot){test.ok=false;test.info+=' · IP: '+ipCheck.failures.iot}
     if(test.key==='nvr'&&ipCheck.failures.nvr){test.ok=false;test.info+=' · IP: '+ipCheck.failures.nvr}
   }
 }
 const build=window.NetForgeBuilder?.check?.(s);
 if(build){for(const test of tests){const requirement=build.tests[test.key];if(requirement&&!requirement.ok){test.ok=false;test.info+=' · BUILD: '+requirement.reason;}}}
 const score=tests.reduce((t,x)=>t+(x.ok?x.points:0),0);
 const critical=tvPass&&record&&iotPass;
 const hints=[];if(!ipReady)hints.push('Aktifkan DHCP router atau atur alamat IP statis valid pada seluruh perangkat yang digunakan.');if(ipCheck?.issues?.length)hints.push('Perbaiki konfigurasi IP: '+ipCheck.issues[0]);if(s.tv!=='lan'&&!tvPass)hints.push('Dekatkan TV ke AP, kurangi dinding, atau gunakan kabel Ethernet.');if(s.camera==='poe'&&!poePower)hints.push('Naikkan anggaran daya PoE ke minimal 48 W, sebaiknya ada cadangan.');if(s.camera==='wifi'&&!cameraStable)hints.push('Kamera Wi-Fi tidak stabil; pertimbangkan Ethernet PoE.');if(!s.onvif)hints.push('Aktifkan layanan video kompatibel dan autentikasi kamera di NVR.');if(s.nvr==='wifi'&&!record)hints.push('Gunakan LAN untuk NVR agar uplink rekaman lebih konsisten.');if(!iotPass&&s.dhcp)hints.push('Pindahkan sensor IoT ke Wi-Fi 2,4 GHz.');if(!s.segment)hints.push('Pisahkan jaringan IoT/CCTV dan berikan hanya akses yang diperlukan.');if(build&&!build.ok)hints.unshift('Bangun perangkat dan koneksi: '+build.hints.slice(0,2).join('; '));
 return {score,critical,tests,hints,throughput:rf?rf.tv.mbps:throughput,rssi:rf?rf.tv.dbm:rssi,camTraffic};
}
function mapMarkup(){const wifi=(state.tv!=='lan');const tvText=state.tv==='lan'?'Ethernet':state.tv==='wifi5'?'Wi-Fi 5 GHz':'Wi-Fi 2,4 GHz';const cameraText=state.camera==='poe'?'Ethernet PoE':'Wi-Fi';const cW=state.camera==='wifi';return `<svg class="nf370-map" role="img" aria-label="Diagram topologi rumah pintar dengan router, smart TV, kamera IP, IoT, NVR, dan uplink" viewBox="0 0 660 370">
 <text x="330" y="25" text-anchor="middle">🏠 SMART HOME HYBRID</text><rect x="264" y="48" width="132" height="58" rx="11"/><text x="330" y="75" text-anchor="middle">🌐 Router / AP</text><text class="sub" x="330" y="91" text-anchor="middle">DHCP ${state.dhcp?'ON':'OFF'}</text>
 <line class="${wifi?'wifi':'ok'}" x1="291" y1="106" x2="115" y2="166"/><line class="${cW?'wifi':'ok'}" x1="355" y1="106" x2="536" y2="166"/><line class="wifi" x1="315" y1="106" x2="266" y2="284"/><line class="${state.nvr==='lan'?'ok':'wifi'}" x1="346" y1="106" x2="465" y2="284"/>
 <rect x="18" y="166" width="194" height="67" rx="11"/><text x="115" y="190" text-anchor="middle">📺 Smart TV</text><text class="sub" x="115" y="210" text-anchor="middle">${esc(tvText)}</text>
 <rect x="442" y="166" width="201" height="67" rx="11"/><text x="543" y="190" text-anchor="middle">📹 4× IP Camera</text><text class="sub" x="543" y="210" text-anchor="middle">${esc(cameraText)}</text>
 <rect x="171" y="284" width="183" height="67" rx="11"/><text x="263" y="309" text-anchor="middle">💡 IoT Sensors</text><text class="sub" x="263" y="329" text-anchor="middle">Wi-Fi ${state.iot==='wifi24'?'2,4':'5'} GHz</text>
 <rect x="374" y="284" width="183" height="67" rx="11"/><text x="465" y="309" text-anchor="middle">🗄️ NVR</text><text class="sub" x="465" y="329" text-anchor="middle">${state.nvr==='lan'?'Ethernet':'Wi-Fi'} · Uplink ${state.uplink}</text>
 <line class="${cW?'wifi':'ok'}" x1="542" y1="233" x2="500" y2="284"/><text class="sub" x="549" y="269">Video stream</text>
 </svg>`}
function resultsMarkup(r){return `<div class="nf370-meta"><span class="nf370-pill">Skor lokal: <strong class="nf370-score">${r.score}/100</strong></span><span class="nf370-pill">Layanan inti: ${r.critical?'✅ Lulus':'⚠️ Belum lulus'}</span></div><div class="nf370-results">${r.tests.map(t=>`<div class="nf370-test ${t.ok?'pass':'fail'}"><strong>${t.ok?'✅':'❌'} ${t.name} · ${t.ok?t.points:0}/${t.points}</strong><small>${esc(t.info)}</small></div>`).join('')}</div><p class="nf370-summary">${r.hints.length?'💡 Iga: '+esc(r.hints[0]):'🏆 Iga: Semua target inti terpenuhi. Optimalkan uplink dan segmentasi untuk nilai sempurna.'}</p>`}
function update(fromAssess=false){const map=by('nf370Topology');if(map)map.innerHTML=mapMarkup();by('nf370DistanceLabel').textContent=state.distance+' m';by('nf370WallLabel').textContent=state.walls+' dinding';if(fromAssess){last=evaluate(state);by('nf370Results').innerHTML=resultsMarkup(last);save()}else{last=null;by('nf370Results').innerHTML='<p>Tekan <strong>Jalankan Pengujian</strong> untuk mengevaluasi konfigurasi terbaru. Nilai sebelumnya tidak diperhitungkan sebagai skor resmi.</p>';save()}}
function field(id,label,choices){return `<label class="nf370-field" for="nf370_${id}">${label}<select id="nf370_${id}" data-setting="${id}">${choices.map(([val,txt])=>`<option value="${val}">${txt}</option>`).join('')}</select></label>`}
function init(){restore();const btn=document.createElement('button');btn.type='button';btn.id='nf370Launch';btn.className='nf322-btn nf370-launch';btn.textContent='🏠 Smart Home Hybrid · Misi Baru';btn.addEventListener('click',show);const lab=by('nf322Lab');if(lab)lab.insertAdjacentElement('afterend',btn);else document.body.append(btn);
 const modal=document.createElement('div');modal.id='nf370Dialog';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','nf370Title');
 modal.innerHTML=`<section id="nf370Card"><header class="nf370-head"><div><div class="nf370-eyebrow">NET FORGE · Real World Missions · N01 · Normal</div><h2 id="nf370Title">🏠 Smart Home Hybrid</h2><p>ISP 300 Mbps · 2 Smart TV · 4 IP Camera (8 Mbps/kamera) · 1 NVR · sensor IoT 2,4 GHz-only. Bangun konfigurasi yang memenuhi kebutuhan streaming, perekaman, dan keamanan.</p></div><button id="nf370Close" type="button" class="nf370-btn ghost">✕ Tutup</button></header>
 <div class="nf370-meta"><span class="nf370-pill">📺 Streaming 4K ≥25 Mbps</span><span class="nf370-pill">📹 Kamera 4×12 W PoE</span><span class="nf370-pill">🎥 NVR 32 Mbps</span><span class="nf370-pill">🎮 Simulasi lokal</span></div>
 <div class="nf370-grid"><section class="nf370-pane"><h3>Topologi rumah pintar</h3><div id="nf370Topology"></div><div class="nf370-legend"><span>━━ Kabel Ethernet</span><span>┄┄ Wi-Fi</span><span>🔧 Pilih koneksi di panel kanan</span></div><p>Topologi mengikuti konfigurasi pilihan Anda. Ini adalah model edukasi deterministik; bukan pengukuran jaringan fisik atau emulator Wi-Fi penuh.</p><h3>Hasil pengujian</h3><div id="nf370Results" aria-live="polite"></div></section>
 <section class="nf370-pane"><h3>Konfigurasi jaringan</h3><div class="nf370-field-grid">
 ${field('tv','Smart TV',[['wifi5','Wi-Fi 5 GHz'],['wifi24','Wi-Fi 2,4 GHz'],['lan','Ethernet']])}
 ${field('camera','IP Camera',[['poe','Ethernet PoE'],['wifi','Wi-Fi']])}
 ${field('iot','IoT (khusus 2,4 GHz)',[['wifi24','Wi-Fi 2,4 GHz'],['wifi5','Wi-Fi 5 GHz']])}
 ${field('nvr','NVR',[['lan','Ethernet'],['wifi','Wi-Fi']])}
 ${field('poe','PoE Budget',[['30','30 W'],['60','60 W'],['120','120 W']])}
 ${field('uplink','Kecepatan uplink',[['100','100 Mbps'],['1000','1 Gbps']])}
 <label class="nf370-field" for="nf370_distance">Jarak TV ke AP: <span id="nf370DistanceLabel"></span><input id="nf370_distance" type="range" min="2" max="20" step="1" data-setting="distance"></label>
 <label class="nf370-field" for="nf370_walls">Penghalang: <span id="nf370WallLabel"></span><input id="nf370_walls" type="range" min="0" max="4" step="1" data-setting="walls"></label></div>
 <label class="nf370-check"><input type="checkbox" data-setting="dhcp" id="nf370_dhcp"> DHCP router aktif (perangkat memperoleh alamat IP)</label>
 <label class="nf370-check"><input type="checkbox" data-setting="onvif" id="nf370_onvif"> Layanan kamera/NVR kompatibel dan autentikasi benar</label>
 <label class="nf370-check"><input type="checkbox" data-setting="segment" id="nf370_segment"> Segmentasi IoT/CCTV dengan akses layanan yang diperlukan</label>
 <div class="nf370-actions"><button id="nf370Assess" type="button" class="nf370-btn primary">▶ Jalankan Pengujian</button><button id="nf370Scenario" type="button" class="nf370-btn">⚡ Simulasi Gangguan</button><button id="nf370Reset" type="button" class="nf370-btn ghost">↺ Reset</button></div><div id="nf370Status" class="nf370-summary" role="status">Perubahan konfigurasi disimpan lokal secara otomatis.</div></section></div>
 <p class="nf370-foot">Penilaian hanya disimpan di browser ini. Belum menjadi nilai/XP resmi backend. Perhitungan sinyal serta throughput merupakan asumsi edukasi, bukan angka ukur radio yang terkalibrasi.</p></section>`;
 document.body.append(modal);
 for(const c of modal.querySelectorAll('[data-setting]')){const k=c.dataset.setting;c.type==='checkbox'?c.checked=Boolean(state[k]):c.value=String(state[k]);c.addEventListener('input',()=>{state[k]=c.type==='checkbox'?c.checked:(k==='distance'||k==='walls'?Number(c.value):c.value);update();by('nf370Status').textContent='Konfigurasi berubah. Jalankan Pengujian untuk melihat hasil terbaru.'})}
 by('nf370Close').addEventListener('click',hide);modal.addEventListener('click',e=>{if(e.target===modal)hide()});modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();hide()}});
 by('nf370Assess').addEventListener('click',()=>{update(true);by('nf370Status').textContent='Hasil tersimpan lokal · '+(last.critical?'Misi inti lulus':'Masih ada layanan yang perlu diperbaiki');by('nf370Results').scrollIntoView({behavior:'smooth',block:'nearest'})});
 by('nf370Scenario').addEventListener('click',()=>{state={...defaults,poe:'30',uplink:'100',distance:16,walls:3,onvif:false,segment:false};sync();update();by('nf370Status').textContent='⚡ Gangguan disuntikkan: anggaran PoE rendah, jarak TV jauh, layanan NVR nonaktif. Temukan dan perbaiki.'});
 by('nf370Reset').addEventListener('click',()=>{if(!confirm('Kembalikan konfigurasi Smart Home ke kondisi awal?'))return;state={...defaults};sync();update()});
 function sync(){for(const c of modal.querySelectorAll('[data-setting]')){const k=c.dataset.setting;if(c.type==='checkbox')c.checked=Boolean(state[k]);else c.value=String(state[k])}}
 update();
 }
function show(){const modal=by('nf370Dialog');if(!modal)return;previousFocus=document.activeElement;window.NetForgeMissionUI?.activate('smart');modal.hidden=false;open=true;document.body.style.setProperty('--nf370-open','1');by('nf370Close').focus()}
function hide(){by('nf370Dialog').hidden=true;open=false;window.NetForgeMissionUI?.activate('basic');previousFocus?.focus?.()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.NetForgeSmartHome={evaluate,version:'0.40.31',getState:()=>({...state}),open:show,close:hide,assess:()=>update(true)};
})();
;

/* === script:nf372MissionScript === */
/* v0.40.38 mission registry: UI gating only, not new emulated network hardware. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
let mode='basic',lastFocus=null;
const missions=[
 {id:'basics',title:'Network Basics · Petualangan Dasar',level:'Easy–Normal',desc:'Misi kabel, router, switch, IP, DHCP, VLAN dasar, dan tes koneksi.',action:'basic'},
 {id:'N01',title:'Smart Home Hybrid',level:'Normal',desc:'Smart TV, kamera PoE, NVR, IoT, pilihan Wi-Fi, dan evaluasi layanan.',action:'smart'},
 {id:'office',title:'Office Starter · LAN & Server',level:'Normal',desc:'Bangun jaringan kantor pada canvas yang sama dan uji layanan IPv4.',action:'office'},
 {id:'sandbox',title:'Free Network Lab',level:'Sandbox',desc:'Eksperimen bebas tanpa mengubah progres misi.',action:'sandbox'},
 {id:'classic',title:'Mode Klasik (Kompatibilitas)',level:'Legacy',desc:'Akses simulator Network Basics atau Smart Home versi lama bila diperlukan.',action:'classic-basic'}
];
const manifest={
 basic:{title:'SIMULASI TOPOLOGI · JARINGAN DASAR',help:'Gunakan router, switch dan workstation; sesuaikan perangkat dengan tujuan misi.',inventory:['router','switch','pc','server'],tools:['connect','remove','ping','trace','validate'],infra:['ups','cable','ac']},
 smart:{title:'DENAH LOGIS · SMART HOME HYBRID',help:'Pilih perangkat dan alat untuk fokus ke pengaturan Smart Home. Ini belum editor drag-and-drop untuk perangkat IoT.',inventory:['Smart TV','IP Camera','IoT Sensor','NVR','Router / AP','PoE Switch'],tools:['Uji seluruh layanan','Simulasi gangguan','Reset konfigurasi'],infra:['Wi-Fi & jarak','PoE budget','Kecepatan uplink','DHCP & segmentasi']}
};
function closePicker(){const dlg=$('nf372MissionDialog');if(!dlg)return;dlg.hidden=true;lastFocus?.focus?.()}
function hideLegacyStart(){const modal=$('startModal');modal?.classList.remove('open')}
function dismissMainMenu(){const overlay=$('nf322Overlay');if(overlay)overlay.hidden=true;const home=$('nf322Home');if(home)home.hidden=false}
function openPicker(){
 // Opening Mission Control must NEVER start or re-open the legacy campaign.
 hideLegacyStart();
 lastFocus=document.activeElement;
 $('nf372MissionDialog').hidden=false;
 $('nf372MissionClose').focus();
}
function currentVirtualization(){
 const panel=$('pveConfigPanel');return !!(mode!=='smart'&&panel&&getComputedStyle(panel).display!=='none');
}
function refresh(){
 const smart=mode==='smart',left=document.querySelector('.panel.left');if(!left)return;
 document.body.classList.toggle('nf372-smart-active',smart);
 const virtual=currentVirtualization();
 for(const el of document.querySelectorAll('[data-nf372-virtual]'))el.hidden=!virtual;
 const header=left.querySelector('.panelhead h3');if(header)header.textContent=smart?'▤ PERANGKAT & ALAT SMART HOME':'▤ INVENTORI PERANGKAT';
 const active=$('nf372Active');if(active)active.textContent=smart?'🏠 N01 · Smart Home Hybrid · Normal':'🌐 Network Basics / Free Lab · Topology View';
 const title=document.querySelector('.workspace-shell .workspace-panel .panelhead h3');if(title)title.textContent=smart?'🏠 WORKSPACE · SMART HOME':'🏢 WORKSPACE · SIMULASI JARINGAN';
 const r=$('nf372Return');if(r)r.hidden=!smart;
 if(!smart){
  const subtitle=$('nf372Basictips');if(subtitle)subtitle.textContent=virtual?'Skenario virtualisasi aktif: Proxmox Host dan jaringan VM tersedia.':'Perangkat dan alat ditampilkan sesuai kompetensi misi. Virtualisasi tidak tersedia untuk skenario ini.';
  // Server only shown when mission requires it or user is in unrestricted sandbox.
  const missionLabel=($('missionTitle')?.textContent||'').toLowerCase();
  const serverNeeded=virtual||/server|dns|office|proxmox|lab|sandbox|contract|datacenter/.test(missionLabel);
  const server=left.querySelector('.device[data-type="server"]');if(server)server.hidden=!serverNeeded;
 }
}
function activate(next){
 mode=next==='smart'?'smart':'basic';
 const dlg=$('nf370Dialog');const shell=document.querySelector('.workspace-shell');
 if(mode==='smart'&&dlg&&shell&&dlg.parentElement!==shell)shell.appendChild(dlg);
 if(mode!=='smart'&&dlg)dlg.hidden=true;
 refresh();
 window.dispatchEvent(new CustomEvent('netforge:mission-changed',{detail:{mode,missionId:mode==='smart'?'N01':'legacy'}}));
}
function select(choice){
 closePicker();hideLegacyStart();dismissMainMenu();
 if(['basic','smart','office','sandbox'].includes(choice)){
  const profile={basic:'basics',smart:'smart',office:'office',sandbox:'free'}[choice];
  window.NetForgeUniversalInventory?.openMission?.(profile);
  return;
 }
 // Opt-in backwards compatibility only; never silently start legacy evaluator.
 if(choice==='classic-smart'){window.NetForgeSmartHome?.open?.();return}
 if(mode==='smart')window.NetForgeSmartHome?.close?.();
 activate('basic');
 if(choice==='classic-basic')$('startModal')?.classList.add('open');
}

function makeSmartInventory(){
 const body=document.querySelector('.panel.left .panelbody');if(!body)return;
 const section=document.createElement('div');section.id='nf372SmartInventory';section.hidden=true;
 section.innerHTML='<p style="font-size:11px;color:#b7d8e7">Alat dan perangkat yang tersedia untuk misi N01. Ketuk untuk menuju pengaturan, bukan menambah node virtual.</p><div class="nf372-inventory-heading">PERANGKAT</div>'+
 [['📺 Smart TV','tv'],['📷 IP Camera','camera'],['💡 IoT Sensor','iot'],['🎥 NVR','nvr'],['📶 Router / Access Point','distance'],['🔌 PoE Switch','poe']].map(([label,field])=>'<button type="button" class="nf372-device" data-nf372-focus="'+field+'">'+label+'</button>').join('')+
 '<div class="nf372-inventory-heading">ALAT KERJA</div><button type="button" class="nf372-tool" data-nf372-click="nf370Assess">▶ Uji seluruh layanan</button><button type="button" class="nf372-tool" data-nf372-click="nf370Scenario">⚡ Simulasi gangguan</button><button type="button" class="nf372-tool" data-nf372-click="nf370Reset">↺ Reset konfigurasi</button>'+
 '<div class="nf372-inventory-heading">PENINGKATAN INFRASTRUKTUR</div>'+
 [['Wi-Fi & jarak','distance'],['Anggaran daya PoE','poe'],['Uplink 100/1000 Mbps','uplink'],['DHCP & segmentasi','segment']].map(([label,field])=>'<button type="button" class="nf372-tool" data-nf372-focus="'+field+'">⚙ '+label+'</button>').join('');
 body.prepend(section);
 section.addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;
  if(btn.dataset.nf372Click){$(btn.dataset.nf372Click)?.click();return}
  const item=$('nf370_'+btn.dataset.nf372Focus);if(item){item.scrollIntoView({block:'center',behavior:'smooth'});item.focus()}
 });
}
function groupVirtual(){
 const aside=document.querySelector('.panel.left');if(!aside)return;
 const label=[...aside.querySelectorAll('.eyebrow')].find(el=>el.textContent.trim()==='LAB VIRTUALISASI');
 if(!label)return;
 label.setAttribute('data-nf372-virtual','');
 const box=label.nextElementSibling;if(box)box.setAttribute('data-nf372-virtual','');
 // pveConfigPanel is governed by the legacy engine; do not hide it directly.
}
function boot(){
 if($('nf372MissionDialog'))return;
 const menu=$('nf322Lab');if(!menu)return;
 const oldLaunch=$('nf370Launch');if(oldLaunch)oldLaunch.hidden=true;
 // ONE mission-entry button only. Previous versions inserted a second button
 // (nf372MissionControl) that duplicated nf322Adventure's action.
 // Clean up a stale duplicate if a shell has been hot-upgraded in place.
 $('nf372MissionControl')?.remove();
 // Unified entry point is the main-menu Adventure button.
 const adventure=$('nf322Adventure');
 if(adventure){
  adventure.textContent='🗺️ Pilih Misi / Petualangan Baru';
  adventure.addEventListener('click',event=>{
   event.preventDefault();event.stopImmediatePropagation();openPicker();
  },true);
 }
 // Do not use the old automatic start dialog while browsing the mission list.

 const panel=document.createElement('div');panel.id='nf372MissionDialog';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','nf372MissionTitle');
 panel.innerHTML='<section id="nf372MissionCard"><div style="display:flex;justify-content:space-between;gap:10px;align-items:start"><div><div style="font-size:11px;color:#65dff5;letter-spacing:.12em">NET FORGE · MISSION CONTROL</div><h2 id="nf372MissionTitle">Pilih petualangan jaringan</h2><p class="nf372-sub">Satu game, beberapa skenario. Perangkat, alat dan workspace menyesuaikan misi.</p></div><button id="nf372MissionClose" type="button">✕ Tutup</button></div><div class="nf372-mission-grid">'+
 missions.map(m=>'<button class="nf372-choice" data-nf372-select="'+m.action+'" type="button"><span class="nf372-chip">'+m.level+'</span><strong>'+m.title+'</strong><small>'+m.desc+'</small></button>').join('')+'</div><p class="nf372-sub" style="margin-top:17px">Misi yang belum didukung engine (mis. virtualisasi bebas, fiber dan wireless RF detail) tidak ditawarkan sebagai kategori mandiri.</p></section>';
 document.body.appendChild(panel);
 $('nf372MissionClose').addEventListener('click',closePicker);
 panel.addEventListener('click',e=>{if(e.target===panel)closePicker();const btn=e.target.closest('[data-nf372-select]');if(btn)select(btn.dataset.nf372Select)});
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closePicker()}});
 const left=document.querySelector('.panel.left');if(left){const active=document.createElement('div');active.id='nf372Active';left.querySelector('.panelhead')?.appendChild(active);}
 const text=document.createElement('p');text.id='nf372Basictips';text.className='muted';text.style='padding:6px 12px;font-size:11px';text.textContent='Inventori disesuaikan dengan misi.';left?.querySelector('.panelhead')?.appendChild(text);
 makeSmartInventory();groupVirtual();
 const r=document.createElement('button');r.id='nf372Return';r.textContent='← Kembali ke Mission Control';r.addEventListener('click',()=>{
  window.NetForgeSmartHome?.close?.();hideLegacyStart();openPicker();
});
 const shell=document.querySelector('.workspace-shell');shell?.prepend(r);const switcher=document.createElement('button');switcher.id='nf372Switch';switcher.type='button';switcher.textContent='🗺️ Ganti Misi';switcher.addEventListener('click',openPicker);shell?.prepend(switcher);
 // Existing mission selection, lab transitions, and PVE config may change independently.
 const observer=new MutationObserver(()=>{if(mode!=='smart')refresh()});
 for(const id of ['missionTitle','missionCode','pveConfigPanel']){const el=$(id);if(el)observer.observe(el,id==='pveConfigPanel'?{attributes:true,attributeFilter:['style']}:{childList:true,subtree:false})}
 refresh();
 window.NetForgeMissionUI={activate,openPicker,manifest,missions,currentMode:()=>mode};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf377-floorplan-script === */
(()=>{'use strict';
const KEY='netforge.smart-home.n01.floor.v1';
const defaults={ap:[43,34],tv:[22,28],camera:[83,26],iot:[24,78],nvr:[78,78]};
const labels={ap:['📡','Router / AP'],tv:['📺','Smart TV'],camera:['📹','4× Kamera'],iot:['💡','IoT'],nvr:['🗄️','NVR']};
const $=id=>document.getElementById(id);
let positions=JSON.parse(JSON.stringify(defaults)),view='floor',drag=null;
const bounded=(x,min,max)=>Math.max(min,Math.min(max,x));
function load(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw&&typeof raw==='object')for(const k of Object.keys(defaults)){const pair=raw[k];if(Array.isArray(pair)&&pair.length===2&&pair.every(Number.isFinite))positions[k]=[bounded(pair[0],8,92),bounded(pair[1],9,91)];}}catch{}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(positions))}catch{}}
function geometry(){const a=positions.ap,t=positions.tv;const walls=Number((a[0]<52)!==(t[0]<52))+Number((a[1]<54)!==(t[1]<54));const distance=bounded(Math.round(Math.hypot((a[0]-t[0])*.29,(a[1]-t[1])*.19)),2,20);return {distance,walls}}
function positionNode(k){const node=$('nf377_'+k);if(!node)return;node.style.left=positions[k][0]+'%';node.style.top=positions[k][1]+'%'}
function render(){for(const k of Object.keys(defaults))positionNode(k);let svg='';for(const key of ['tv','camera','iot','nvr']){const wired=key==='camera'?$('nf370_camera')?.value==='poe':key==='nvr'?$('nf370_nvr')?.value==='lan':key==='tv'?$('nf370_tv')?.value==='lan':false;const a=positions.ap,b=positions[key];svg+=`<line class="${wired?'wired':'wifi'}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;}if($('nf377Links'))$('nf377Links').innerHTML=svg;const g=geometry();$('nf377Distance').textContent=g.distance+' m';$('nf377Walls').textContent=g.walls+' dinding';}
function apply(){const g=geometry();for(const [id,n] of [['nf370_distance',g.distance],['nf370_walls',g.walls]]){const input=$(id);if(input&&Number(input.value)!==n){input.value=String(n);input.dispatchEvent(new Event('input',{bubbles:true}));}}render();save();}
function toRelative(e){const r=$('nf377Floor').getBoundingClientRect();return [bounded((e.clientX-r.left)/r.width*100,8,92),bounded((e.clientY-r.top)/r.height*100,9,91)]}
function down(e){if(e.button!==undefined&&e.button!==0)return;const node=e.target.closest('[data-nf377]');if(!node)return;drag={key:node.dataset.nf377,pointerId:e.pointerId};node.setPointerCapture(e.pointerId);e.preventDefault();}
function move(e){if(!drag||drag.pointerId!==e.pointerId)return;positions[drag.key]=toRelative(e);render();}
function up(e){if(!drag||drag.pointerId!==e.pointerId)return;drag=null;apply();}
function keymove(e){const node=e.target.closest('[data-nf377]');if(!node||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();let p=positions[node.dataset.nf377].slice(),step=e.shiftKey?5:2;p[0]+=e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0;p[1]+=e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0;positions[node.dataset.nf377]=[bounded(p[0],8,92),bounded(p[1],9,91)];apply();}
function setView(v){view=v;const floor=v==='floor';$('nf377Floor').hidden=!floor;$('nf370Topology').hidden=floor;$('nf377Metrics').hidden=!floor;$('nf377FloorNotice').hidden=!floor;for(const b of document.querySelectorAll('[data-nf377-view]'))b.setAttribute('aria-pressed',String(b.dataset.nf377View===v));if(floor)render();}
function init(){const map=$('nf370Topology');if(!map||$('nf377Floor'))return;load();const controls=document.createElement('div');controls.id='nf377Controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Tampilan Smart Home');controls.innerHTML='<button type="button" data-nf377-view="floor" aria-pressed="true">🏠 Denah Rumah</button><button type="button" data-nf377-view="topology" aria-pressed="false">🌐 Topologi Logis</button><button type="button" id="nf377Reset" title="Mengatur ulang hanya posisi perangkat, tidak menghapus konfigurasi jaringan">↺ Reset Posisi</button><button type="button" id="nf377Guide" aria-expanded="false">❔ Panduan Denah</button>';
 map.before(controls);
 const help=document.createElement('div');help.id='nf377Help';help.hidden=true;help.textContent='Geser kartu perangkat dengan mouse atau sentuhan. Gunakan tombol panah saat perangkat terfokus (Shift + panah = lebih jauh). Memindahkan Router/AP atau Smart TV memperbarui jarak dan jumlah dinding pada evaluasi Wi-Fi. Garis hijau = kabel, ungu putus-putus = Wi-Fi. Model ini bersifat edukasi.';controls.after(help);
 const floor=document.createElement('div');floor.id='nf377Floor';floor.setAttribute('aria-label','Denah Smart Home interaktif dengan perangkat yang bisa digeser');floor.innerHTML='<div class="nf377-room nf377-living">Ruang Keluarga</div><div class="nf377-room nf377-office">Ruang Kerja</div><div class="nf377-room nf377-bedroom">Kamar Tidur</div><div class="nf377-room nf377-security">Ruang Keamanan</div><svg id="nf377Links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>' + Object.entries(labels).map(([id,label])=>`<button type="button" id="nf377_${id}" data-nf377="${id}" class="nf377-device" title="Geser ${label[1]} untuk mengatur posisi" aria-label="${label[1]}, geser atau gunakan tombol panah"><span>${label[0]}</span><small>${label[1]}</small></button>`).join('');map.before(floor);
 const metrics=document.createElement('div');metrics.id='nf377Metrics';metrics.innerHTML='<span>📏 Jarak TV–AP: <b id="nf377Distance">—</b></span><span>🧱 Penghalang: <b id="nf377Walls">—</b></span><span>🟢 Ethernet &nbsp; 🟣 Wi-Fi</span>';floor.after(metrics);
 const note=document.createElement('div');note.id='nf377FloorNotice';note.textContent='Jarak dan hambatan dihitung dari posisi AP dan TV pada denah. Kamera, IoT, dan NVR dapat dipindahkan untuk visualisasi; posisinya belum memengaruhi seluruh validator jaringan. Skor tetap latihan lokal.';metrics.after(note);
 controls.addEventListener('click',e=>{const b=e.target.closest('[data-nf377-view]');if(b){setView(b.dataset.nf377View);return}if(e.target.id==='nf377Reset'){if(!confirm('Kembalikan posisi perangkat pada denah rumah?'))return;positions=JSON.parse(JSON.stringify(defaults));apply();}if(e.target.id==='nf377Guide'){help.hidden=!help.hidden;e.target.setAttribute('aria-expanded',String(!help.hidden));}});
 floor.addEventListener('pointerdown',down);floor.addEventListener('pointermove',move);floor.addEventListener('pointerup',up);floor.addEventListener('pointercancel',up);floor.addEventListener('keydown',keymove);
 for(const id of ['nf370_tv','nf370_camera','nf370_iot','nf370_nvr'])$(id)?.addEventListener('change',render);
 setView('floor');render();
 window.NetForgeFloorPlan={version:'0.40.31',getPositions:()=>JSON.parse(JSON.stringify(positions)),geometry,apply,setView};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf378-wireless-script === */
(()=>{'use strict';
const KEY='netforge.smart-home.n01.rf.v1';
const defaults={interference:'medium',channel24:'6',channel5:'36',showHeatmap:true};
const settings={...defaults};
const el=id=>document.getElementById(id);const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
try{const old=JSON.parse(localStorage.getItem(KEY)||'{}');if(old&&typeof old==='object')for(const k of Object.keys(defaults))if(typeof old[k]===typeof defaults[k])settings[k]=old[k];}catch{}
const pos=()=>window.NetForgeFloorPlan?.getPositions?.()||{ap:[43,34],tv:[22,28],camera:[83,26],iot:[24,78],nvr:[78,78]};
function geometry(a,b){const d=Math.hypot((a[0]-b[0])*.29,(a[1]-b[1])*.19);const w=Number((a[0]<52)!==(b[0]<52))+Number((a[1]<54)!==(b[1]<54));return {metres:Math.max(1,Math.round(d*10)/10),walls:w};}
const penalties={low:0,medium:8,high:19};
function radio(a,b,band){const {metres,walls}=geometry(a,b);const five=band==='5';const extra=penalties[settings.interference] + ((five?settings.channel5:settings.channel24)==='auto'?0:0);const dbm=Math.round(-35-(five?2.2:1.7)*metres-(five?8:5)*walls-extra);const factor=clamp((dbm+91)/51,.04,1);const capacity=five?260:90;const mbps=Math.round(Math.max(1,capacity*factor*(settings.interference==='high'?.65:settings.interference==='medium'?.83:1)));return {dbm,mbps,metres,walls,ok:dbm>=-75,quality:dbm>=-65?'good':dbm>=-75?'fair':'bad'};}
function evaluate(s={}){const p=pos(),ap=p.ap;const tvBand=s.tv==='wifi24'?'2.4':'5';const tv=radio(ap,p.tv,tvBand), camera=radio(ap,p.camera,'2.4'),iot=radio(ap,p.iot,'2.4'),nvr=radio(ap,p.nvr,'5');tv.ok=tv.dbm>=-75&&tv.mbps>=25;camera.ok=camera.dbm>=-70&&camera.mbps>=32;iot.ok=iot.dbm>=-78;nvr.ok=nvr.dbm>=-72&&nvr.mbps>=32;return {tv,camera,iot,nvr};}
function paint(){const canvas=el('nf378Heatmap'),floor=el('nf377Floor');if(!canvas||!floor)return;const rect=floor.getBoundingClientRect();if(rect.width<1||rect.height<1)return;const w=220,h=150;canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');if(!ctx)return;const data=ctx.createImageData(w,h),p=pos();for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=radio(p.ap,[x/w*100,y/h*100],'5');const n=(y*w+x)*4;const level=clamp((a.dbm+88)/45,0,1);data.data[n]=Math.round(245*(1-level)+20*level);data.data[n+1]=Math.round(65*(1-level)+224*level);data.data[n+2]=Math.round(85*(1-level)+175*level);data.data[n+3]=Math.round(170*clamp(level+.35,.15,1));}ctx.putImageData(data,0,0);canvas.hidden=!settings.showHeatmap;}
function render(){const s=window.NetForgeSmartHome?.getState?.()||{};const r=evaluate(s);const rows=[['tv','📺 Smart TV',s.tv==='lan'],['camera','📹 IP Camera',s.camera==='poe'],['iot','💡 IoT',false],['nvr','🗄️ NVR',s.nvr==='lan']];const uplink=Number(s.uplink||1000);let html='';for(const [key,name,wired] of rows){const x=r[key];const speed=wired?Math.min(uplink,1000):x.mbps;const good=wired?true:x.ok;const q=wired?'good':x.quality;html+=`<div class="nf378-result"><strong>${name}</strong><span>${wired?'Ethernet':'Wi-Fi'} · ${wired?'Kabel':x.metres+' m / '+x.walls+' dinding'}</span><small>${wired?'Link '+uplink+' Mbps':`~${x.dbm} dBm · ~${speed} Mbps`} ${key==='iot'?'· Sensor 2,4 GHz-only':''}</small><span class="nf378-quality ${good?q:'bad'}">${wired?'Wired':good?'Cakupan memadai':'Periksa koneksi'}</span></div>`;}
 el('nf378Results').innerHTML=html;el('nf378Metrics').textContent=`Cakupan Wi-Fi: TV ~${r.tv.dbm} dBm / ${r.tv.mbps} Mbps · IoT ~${r.iot.dbm} dBm / ${r.iot.mbps} Mbps. Uplink Ethernet: ${uplink} Mbps. Hasil simulasi, bukan speedtest.`;paint();}
function store(){try{localStorage.setItem(KEY,JSON.stringify(settings))}catch{}}
function init(){const controls=el('nf377Controls'),floor=el('nf377Floor');if(!controls||!floor||el('nf378Panel'))return;const canvas=document.createElement('canvas');canvas.id='nf378Heatmap';canvas.setAttribute('aria-hidden','true');floor.prepend(canvas);
 const panel=document.createElement('section');panel.id='nf378Panel';panel.setAttribute('aria-label','Wi-Fi Coverage & Performance');panel.innerHTML=`<h4>📶 Wi-Fi Coverage & Performance</h4><div id="nf378Options"><label>Interferensi lingkungan<select id="nf378Interference"><option value="low">Rendah</option><option value="medium">Sedang</option><option value="high">Tinggi</option></select></label><label>Channel 2,4 GHz<select id="nf378Channel24"><option value="1">1</option><option value="6">6</option><option value="11">11</option></select></label><label>Channel 5 GHz<select id="nf378Channel5"><option value="36">36</option><option value="44">44</option><option value="149">149</option></select></label><label class="nf378-check"><input type="checkbox" id="nf378ShowHeatmap">Tampilkan heatmap 5 GHz</label></div><div id="nf378Legend"><span><i style="background:#2ee4b2"></i>Sinyal kuat</span><span><i style="background:#c1ac43"></i>Menengah</span><span><i style="background:#e94c73"></i>Lemah</span></div><div id="nf378Results" aria-live="polite"></div><div id="nf378Metrics" role="status"></div><div id="nf378Explain">Model deterministik: posisi, jarak, dinding, band, dan interferensi memengaruhi perkiraan sinyal. Pilihan channel dicatat untuk pembelajaran; belum ada simulasi kepadatan tiap channel. Perangkat Ethernet tidak terpengaruh sinyal Wi-Fi. Skor N01 hanya latihan lokal.</div>`;
 const note=el('nf377FloorNotice');(note||floor).after(panel);
 for(const [id,k] of [['nf378Interference','interference'],['nf378Channel24','channel24'],['nf378Channel5','channel5'],['nf378ShowHeatmap','showHeatmap']]){const node=el(id);node.type==='checkbox'?node.checked=settings[k]:node.value=settings[k];node.addEventListener('change',()=>{settings[k]=node.type==='checkbox'?node.checked:node.value;store();render();el('nf370Results').innerHTML='<p>Parameter radio diubah. Klik <strong>Jalankan Pengujian</strong> untuk memperbarui skor lokal.</p>';});}
 // The current floor plan renders on pointer/keyboard moves; observe actual coordinate mutations to refresh coverage.
 const observer=new MutationObserver(()=>{if(!document.hidden)queueMicrotask(render);});for(const key of ['ap','tv','camera','iot','nvr']){const node=el('nf377_'+key);if(node)observer.observe(node,{attributes:true,attributeFilter:['style']});}
 for(const id of ['nf370_tv','nf370_camera','nf370_iot','nf370_nvr','nf370_uplink'])el(id)?.addEventListener('change',render);
 el('nf370Assess')?.addEventListener('click',render);
 el('nf377Reset')?.addEventListener('click',()=>setTimeout(render,0));
 for(const btn of document.querySelectorAll('[data-nf377-view]'))btn.addEventListener('click',()=>{panel.hidden=btn.dataset.nf377View!=='floor';if(!panel.hidden)render();});
 window.addEventListener('resize',()=>{if(!floor.hidden)paint()});render();
 window.NetForgeWirelessEngine={version:'0.40.31',evaluate,render,settings:()=>({...settings})};
}
// Set engine before first user interaction; init on DOM ready, after floor plan init script's DOMContentLoaded listener.
window.NetForgeWirelessEngine={version:'0.40.31',evaluate,render,settings:()=>({...settings})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf380-unified-network-builder === */
(()=>{'use strict';
const KEY='netforge.smart-home.n01.builder.v1';
const $=id=>document.getElementById(id);
const spec={ap:['📡','Router / AP'],switch:['🔌','PoE Switch'],tv:['📺','Smart TV'],camera:['📹','4× IP Camera'],iot:['💡','IoT Sensor'],nvr:['🗄️','NVR']};
const all=Object.keys(spec);const required=all.slice();
const guidedEdges=[['ap','switch','ethernet'],['ap','tv','wifi'],['ap','iot','wifi'],['switch','camera','poe'],['switch','nvr','ethernet']];
const starter={mode:'guided',nodes:[...all],links:guidedEdges.map(([a,b,medium])=>({a,b,medium})),switchPos:[62,48]};
let state=structuredClone(starter),selected=null,connectionStart=null,dragging=null,ready=false;
const validKey=id=>Object.prototype.hasOwnProperty.call(spec,id);
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');if(!x||!['guided','challenge'].includes(x.mode))return;
 state.mode=x.mode;state.nodes=[...new Set((Array.isArray(x.nodes)?x.nodes:[]).filter(validKey))];state.links=(Array.isArray(x.links)?x.links:[]).filter(e=>e&&validKey(e.a)&&validKey(e.b)&&e.a!==e.b&&['wifi','ethernet','poe'].includes(e.medium)).slice(0,24);if(Array.isArray(x.switchPos)&&x.switchPos.length===2&&x.switchPos.every(Number.isFinite))state.switchPos=x.switchPos.map(v=>Math.min(92,Math.max(8,v)));}catch{}}
function store(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function nodePos(id){if(id==='switch')return state.switchPos;const el=$('nf377_'+id);if(!el)return null;return [parseFloat(el.style.left)||50,parseFloat(el.style.top)||50]}
function linkType(a,b,medium){if(medium==='poe')return (a==='switch'&&b==='camera')||(a==='camera'&&b==='switch');if(medium==='wifi')return (a==='ap'||b==='ap')&&!([a,b].includes('switch'));return !([a,b].includes('iot'));}
function connected(a,b,medium){return state.links.some(e=>((e.a===a&&e.b===b)||(e.a===b&&e.b===a))&&(!medium||e.medium===medium))}
function reachable(node,media){if(!state.nodes.includes(node)||!state.nodes.includes('ap'))return false;const seen=new Set([node]),queue=[node];while(queue.length){const item=queue.shift();if(item==='ap')return true;for(const l of state.links){if(!state.nodes.includes(l.a)||!state.nodes.includes(l.b))continue;if(media&&l.medium!==media)continue;const next=l.a===item?l.b:l.b===item?l.a:null;if(next&&!seen.has(next)){seen.add(next);queue.push(next)}}}return false}
function check(s){const present=x=>state.nodes.includes(x);const wifi=(x)=>connected('ap',x,'wifi');const wired=(x)=>reachable(x,'ethernet')||reachable(x,'poe')||connected('ap',x,'ethernet');
 const tests={
 tv:{ok:present('tv')&&present('ap')&&(s.tv==='lan'?wired('tv'):wifi('tv')),reason:'Smart TV perlu link '+(s.tv==='lan'?'Ethernet':'Wi-Fi')+' ke jaringan'},
 camera:{ok:present('camera')&&present('ap')&&(s.camera==='poe'?present('switch')&&connected('switch','camera','poe')&&reachable('switch','ethernet'):wifi('camera')),reason:'IP Camera harus tersambung ke AP atau PoE switch'},
 nvr:{ok:present('nvr')&&present('ap')&&(s.nvr==='lan'?wired('nvr'):wifi('nvr'))&&present('camera'),reason:'NVR butuh koneksi ke jaringan dan kamera tersedia'},
 iot:{ok:present('iot')&&present('ap')&&wifi('iot'),reason:'IoT perlu koneksi Wi-Fi ke router/AP'},
 uplink:{ok:present('ap')&&(!state.nodes.includes('switch')||reachable('switch','ethernet')),reason:'Router/AP dan uplink switch harus tersambung'},
 security:{ok:present('ap')&&present('iot'),reason:'Router/AP dan IoT wajib tersedia untuk segmentasi'}
 };const hints=Object.entries(tests).filter(([,x])=>!x.ok).map(([key,x])=>key.toUpperCase()+': '+x.reason);
 return {ok:hints.length===0,tests,hints};}
function status(text){const e=$('nf380Status');if(e)e.textContent=text;}
function activate(mode){state=mode==='guided'?structuredClone(starter):{mode:'challenge',nodes:[],links:[],switchPos:[62,48]};selected=null;connectionStart=null;store();render();status(mode==='guided'?'Guided: perangkat dan jalur awal disediakan, ubah atau hapus untuk bereksperimen.':'Challenge: mulai kosong. Tambahkan perangkat dari inventori, lalu hubungkan secara manual.');}
function addDevice(id,point){if(!validKey(id))return;if(!state.nodes.includes(id))state.nodes.push(id);if(id==='switch'&&point)state.switchPos=point;selected=id;store();render();status(spec[id][1]+' dipasang. Geser pada denah untuk mengubah posisi.');}
function removeDevice(id){if(!validKey(id))return;state.nodes=state.nodes.filter(n=>n!==id);state.links=state.links.filter(l=>l.a!==id&&l.b!==id);if(selected===id)selected=null;if(connectionStart===id)connectionStart=null;store();render();status(spec[id][1]+' dihapus dari topologi.');}
function connect(a,b,medium){
 if(!a||!b||a===b)return status('Pilih dua perangkat berbeda untuk dihubungkan.');
 if(!state.nodes.includes(a)||!state.nodes.includes(b))return status('Pasang kedua perangkat dahulu.');
 if(!linkType(a,b,medium))return status('Media '+medium+' tidak didukung pada pasangan ini. Periksa AP, switch dan kemampuan perangkat.');
 const current={nodes:state.nodes,links:state.links};
 const finish=ports=>{
  if(!ports){status('Pemilihan port dibatalkan. Tidak ada koneksi yang diubah.');return;}
  const proposal=window.NetForgeNetworkGraph?.validateSmartLink?.(current,a,b,medium,ports);
  if(proposal&&!proposal.ok){status('Iga: Koneksi ditolak: '+proposal.reason);window.NetForgePortBuilder?.error?.(proposal.reason);return;}
  state.links=state.links.filter(l=>!((l.a===a&&l.b===b)||(l.a===b&&l.b===a)));
  state.links.push({a,b,medium,portA:ports.portA||proposal?.portA,portB:ports.portB||proposal?.portB});
  store();render();status('✓ '+spec[a][1]+':'+(ports.portA||'RADIO')+' ↔ '+spec[b][1]+':'+(ports.portB||'RADIO')+' ('+medium+').');
  window.dispatchEvent(new CustomEvent('netforge:ports-changed'));
 };
 const picker=window.NetForgePortBuilder?.request;
 if(picker){picker(current,a,b,medium).then(finish).catch(err=>status('Iga: Pemilihan port gagal: '+err.message));}
 else{const proposal=window.NetForgeNetworkGraph?.validateSmartLink?.(current,a,b,medium);finish(proposal?.ok?{portA:proposal.portA,portB:proposal.portB}:null);}
}
function disconnect(a,b){const before=state.links.length;state.links=state.links.filter(l=>!((l.a===a&&l.b===b)||(l.a===b&&l.b===a)));if(state.links.length!==before){store();render();status('Koneksi '+a+'–'+b+' dilepas.')}else status('Tidak ada koneksi pada pasangan tersebut.');}
function refreshLinks(){const svg=$('nf380Links');if(!svg)return;let lines='';for(const l of state.links){if(!state.nodes.includes(l.a)||!state.nodes.includes(l.b))continue;const a=nodePos(l.a),b=nodePos(l.b);if(!a||!b)continue;lines+=`<line class="${l.medium==='wifi'?'wifi':'wired'}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"><title>${l.a} ↔ ${l.b}: ${l.medium}</title></line>`;}svg.innerHTML=lines;}
function render(){if(!ready)return;for(const id of all){const n=id==='switch'?$('nf380_switch'):$('nf377_'+id);if(!n)continue;n.hidden=!state.nodes.includes(id);n.classList.toggle('nf380-selected',id===selected||id===connectionStart)}const sb=$('nf380_switch');if(sb){sb.style.left=state.switchPos[0]+'%';sb.style.top=state.switchPos[1]+'%'}
 $('nf380ModeGuided').setAttribute('aria-pressed',String(state.mode==='guided'));$('nf380ModeChallenge').setAttribute('aria-pressed',String(state.mode==='challenge'));
 for(const b of document.querySelectorAll('[data-nf380-add]')){b.disabled=state.nodes.includes(b.dataset.nf380Add);b.querySelector('small').textContent=b.disabled?'Terpasang':'Pasang'}
 const c=check(window.NetForgeSmartHome?.getState?.()||{});$('nf380Summary').textContent=`${state.nodes.length}/${all.length} perangkat · ${state.links.length} koneksi · ${c.ok?'Semua jalur inti terbangun':'Ada '+c.hints.length+' persyaratan topologi belum terpenuhi'} · Skor tetap lokal`;
 refreshLinks();window.dispatchEvent(new CustomEvent('netforge:builder-render'));}
function floorPoint(e){const r=$('nf377Floor').getBoundingClientRect();return [Math.min(92,Math.max(8,(e.clientX-r.left)/r.width*100)),Math.min(91,Math.max(9,(e.clientY-r.top)/r.height*100))]}
function deviceClick(id){if(!state.nodes.includes(id))return;const tool=$('nf380Tool')?.value||'move';if(tool==='connect'||tool==='disconnect'){
 if(!connectionStart){connectionStart=id;selected=id;status('Sumber '+spec[id][1]+' dipilih. Klik perangkat tujuan.');render();return}
 const a=connectionStart;connectionStart=null;selected=id;
 if(tool==='connect')connect(a,id,$('nf380Medium').value);else disconnect(a,id);
 return;
 }selected=id;render();status(spec[id][1]+' dipilih. Gunakan alat Hubungkan, Putuskan, atau Hapus.');}
function updateControl(){connectionStart=null;selected=null;render();status('Alat kerja: '+$('nf380Tool').selectedOptions[0].text+'.');}
function init(){if(ready||!$('nf377Floor')||!$('nf372SmartInventory'))return;read();const controls=$('nf377Controls');
 const panel=document.createElement('section');panel.id='nf380Panel';panel.innerHTML=`<h4>🧰 Build & Connect — Smart Home</h4><p>Tarik perangkat dari inventori ke denah (desktop), atau ketuk <strong>Pasang</strong> lalu geser perangkat pada denah (HP/tablet). Pilih alat Hubungkan untuk membuat kabel / Wi-Fi.</p>
 <div class="nf380-row"><button id="nf380ModeGuided" type="button">📘 Guided Mode</button><button id="nf380ModeChallenge" type="button">🎯 Challenge Mode (kosong)</button></div>
 <div id="nf380Inventory" role="group" aria-label="Inventori perangkat Smart Home"></div>
 <div class="nf380-row"><label for="nf380Tool">Alat:</label><select id="nf380Tool"><option value="move">✋ Pilih / Geser</option><option value="connect">🔗 Hubungkan</option><option value="disconnect">✂ Putuskan</option><option value="delete">🗑 Hapus perangkat</option></select><label for="nf380Medium">Media:</label><select id="nf380Medium"><option value="ethernet">Ethernet</option><option value="poe">Ethernet PoE</option><option value="wifi">Wi-Fi</option></select><button id="nf380Audit" type="button">🔎 Periksa Topologi</button></div>
 <div id="nf380Summary"></div><div id="nf380Status" role="status" aria-live="polite">Pilih Guided atau Challenge untuk memulai.</div><p>Mode Challenge menguji keberadaan perangkat dan jalur sebelum skor layanan dapat dinyatakan lulus. Tidak menambahkan XP resmi.</p>`;
 controls.after(panel);
 for(const id of all){const button=document.createElement('button');button.className='nf380-inv';button.type='button';button.draggable=true;button.dataset.nf380Add=id;button.innerHTML=`<span>${spec[id][0]} ${spec[id][1]}</span><small>Pasang</small>`;button.addEventListener('click',()=>addDevice(id));button.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','netforge-device:'+id);e.dataTransfer.effectAllowed='copy'});$('nf380Inventory').append(button)}
 const floor=$('nf377Floor');const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='nf380Links';svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');floor.append(svg);
 const sw=document.createElement('button');sw.id='nf380_switch';sw.className='nf380-extra';sw.type='button';sw.dataset.nf380Device='switch';sw.innerHTML='🔌<small>PoE Switch</small>';floor.append(sw);
 for(const id of Object.keys(spec).filter(k=>k!=='switch')){const n=$('nf377_'+id);if(n)n.dataset.nf380Device=id;}
 const sidebar=$('nf372SmartInventory');sidebar.querySelector('p').textContent='Klik perangkat untuk memasangnya di denah Smart Home. Pengaturan lanjutan tersedia di panel Konfigurasi Jaringan.';
 // Reuse the mission-adaptive LEFT inventory, not only a second in-workspace palette.
 const sideMap={tv:'tv',camera:'camera',iot:'iot',nvr:'nvr',distance:'ap',poe:'switch'};
 sidebar.addEventListener('click',e=>{const b=e.target.closest('.nf372-device');if(!b)return;const id=sideMap[b.dataset.nf372Focus];if(!id)return;e.preventDefault();e.stopImmediatePropagation();addDevice(id);$('nf377Floor')?.scrollIntoView({block:'nearest',behavior:'smooth'});},true);
 for(const b of sidebar.querySelectorAll('.nf372-device')){const id=sideMap[b.dataset.nf372Focus];if(!id)continue;b.draggable=true;b.setAttribute('title','Klik untuk memasang atau seret ke denah');b.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','netforge-device:'+id);e.dataTransfer.effectAllowed='copy'});}

 $('nf380ModeGuided').onclick=()=>{if(state.nodes.length&&!confirm('Ganti ke Guided Mode? Posisi dan koneksi Builder saat ini akan diganti.'))return;activate('guided')};
 $('nf380ModeChallenge').onclick=()=>{if(state.nodes.length&&!confirm('Mulai Challenge dari denah kosong? Topologi Builder saat ini akan diganti.'))return;activate('challenge')};
 $('nf380Tool').onchange=updateControl;
 $('nf380Audit').onclick=()=>{const c=check(window.NetForgeSmartHome?.getState?.()||{});status(c.ok?'Semua perangkat dan jalur penting tersedia. Klik Jalankan Pengujian untuk tes layanan.':c.hints.join(' | '));};
 floor.addEventListener('dragover',e=>{if(e.dataTransfer.types.includes('text/plain'))e.preventDefault()});
 floor.addEventListener('drop',e=>{const d=e.dataTransfer.getData('text/plain');if(d.startsWith('netforge-device:')){e.preventDefault();const id=d.split(':')[1];addDevice(id,floorPoint(e));if(id==='switch')state.switchPos=floorPoint(e);else{const n=$('nf377_'+id);if(n){n.style.left=floorPoint(e)[0]+'%';n.style.top=floorPoint(e)[1]+'%';window.NetForgeFloorPlan?.apply?.();}}store();render()}});
 floor.addEventListener('click',e=>{const node=e.target.closest('[data-nf380-device]');if(!node)return;const id=node.dataset.nf380Device;const tool=$('nf380Tool').value;if(tool==='delete'){removeDevice(id);return}deviceClick(id)});
 sw.addEventListener('pointerdown',e=>{if($('nf380Tool').value!=='move'||e.button!==0)return;dragging=e.pointerId;sw.setPointerCapture(e.pointerId);e.preventDefault()});
 sw.addEventListener('pointermove',e=>{if(dragging!==e.pointerId)return;state.switchPos=floorPoint(e);sw.style.left=state.switchPos[0]+'%';sw.style.top=state.switchPos[1]+'%';refreshLinks()});
 sw.addEventListener('pointerup',e=>{if(dragging!==e.pointerId)return;dragging=null;store();render()});sw.addEventListener('pointercancel',()=>{dragging=null});
 sw.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const n=e.shiftKey?5:2;state.switchPos[0]=Math.max(8,Math.min(92,state.switchPos[0]+(e.key==='ArrowRight'?n:e.key==='ArrowLeft'?-n:0)));state.switchPos[1]=Math.max(9,Math.min(91,state.switchPos[1]+(e.key==='ArrowDown'?n:e.key==='ArrowUp'?-n:0)));store();render()});
 floor.addEventListener('pointerup',()=>{requestAnimationFrame(refreshLinks)},true);
 floor.addEventListener('keyup',()=>{requestAnimationFrame(refreshLinks)},true);
 for(const n of document.querySelectorAll('[data-nf377]'))new MutationObserver(refreshLinks).observe(n,{attributes:true,attributeFilter:['style']});
 for(const f of ['nf370_tv','nf370_camera','nf370_iot','nf370_nvr'])$(f)?.addEventListener('change',()=>{status('Jenis koneksi berubah. Hubungkan ulang jalur dengan media yang sesuai, lalu jalankan pengujian.');render()});
 ready=true;render();
}
window.NetForgeBuilder={version:'0.40.31',check,getState:()=>structuredClone(state),getSelected:()=>selected,activate,addDevice,connect,removeDevice};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf390-universal-workspace === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const devices={ap:['📡','Router / AP','Atur SSID, band dan cakupan Wi-Fi','nf370_distance'],switch:['🔌','PoE Switch','Atur anggaran PoE dan koneksi kabel','nf370_poe'],tv:['📺','Smart TV','Pilih Ethernet atau band Wi-Fi untuk streaming','nf370_tv'],camera:['📹','IP Camera','Pilih Wi-Fi atau Ethernet PoE untuk CCTV','nf370_camera'],iot:['💡','IoT Sensor','Atur pita Wi-Fi perangkat IoT','nf370_iot'],nvr:['🗄️','NVR','Atur akses dan penerimaan rekaman','nf370_nvr']};
const positions={ap:[49,15],switch:[24,42],tv:[76,40],camera:[22,74],iot:[77,73],nvr:[49,75]};
let built=false,active='basic';
function attach(){
 if(built||!$('nf380Inventory')||!$('nf372SmartInventory')||!$('nf377Floor'))return;
 built=true;
 const left=document.querySelector('.panel.left .panelbody');const smart=$('nf372SmartInventory');
 const shelf=document.createElement('section');shelf.id='nf390DeviceShelf';shelf.innerHTML='<div class="nf372-inventory-heading">INVENTORI TERPADU · TARIK / KETUK</div><p style="font-size:11px;color:#b1d7e7">Perangkat yang sesuai dengan misi aktif. Tarik ke workspace atau ketuk untuk menambahkan.</p>';
 smart.prepend(shelf);shelf.append($('nf380Inventory'));
 const info=document.createElement('div');info.id='nf390Inspector';info.innerHTML='<b>DEVICE INSPECTOR</b><p>Pilih perangkat di workspace untuk melihat konfigurasi yang tersedia.</p>';
 smart.append(info);
 const toolbar=document.createElement('div');toolbar.id='nf390Toolbar';toolbar.innerHTML='<div class="nf390-line"><div><strong>⬡ UNIVERSAL WORKSPACE</strong><br><small id="nf390MissionLabel">Network Basics · Topologi</small></div><small>Inventori & area simulasi terpadu menurut misi</small></div>';
 document.querySelector('.workspace-shell')?.prepend(toolbar);
 const floor=$('nf377Floor'),logical=document.createElement('div');logical.id='nf390Logical';logical.hidden=true;logical.setAttribute('role','group');logical.setAttribute('aria-label','Topologi logis interaktif Smart Home');
 logical.innerHTML='<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" id="nf390Wires"></svg><div id="nf390Nodes"></div><div id="nf390LogicalHelp">Klik dua perangkat dengan alat Hubungkan untuk membuat koneksi · garis ungu: Wi-Fi · hijau: kabel</div>';
 floor.after(logical);
 new MutationObserver(render).observe(floor,{attributes:true,attributeFilter:['hidden']});
 logical.addEventListener('click',e=>{const btn=e.target.closest('[data-nf390-node]');if(!btn)return;const original=btn.dataset.nf390Node==='switch'?$('nf380_switch'):$('nf377_'+btn.dataset.nf390Node);original?.dispatchEvent(new MouseEvent('click',{bubbles:true}));setTimeout(render,0)});
 logical.addEventListener('dragover',e=>{if(e.dataTransfer?.types?.includes('text/plain'))e.preventDefault()});
 logical.addEventListener('drop',e=>{const token=e.dataTransfer?.getData('text/plain')||'';if(!token.startsWith('netforge-device:'))return;e.preventDefault();window.NetForgeBuilder?.addDevice?.(token.split(':')[1]);render()});
 for(const b of document.querySelectorAll('[data-nf377-view]'))b.addEventListener('click',()=>setTimeout(render,0));
 document.addEventListener('click',e=>{if(e.target.closest('[data-nf380-device],.nf380-inv,.nf372-device,#nf380Tool,#nf380ModeGuided,#nf380ModeChallenge'))setTimeout(render,0)},true);
 window.addEventListener('netforge:builder-render',render);
 window.addEventListener('netforge:mission-changed',e=>{active=e.detail?.mode||'basic';render()});
 const legacyLabel=document.querySelector('.panel.left .panelhead h3');if(legacyLabel)legacyLabel.textContent='▤ INVENTORI PERANGKAT';
 render();
}
function render(){if(!built)return;
 const smart=document.body.classList.contains('nf372-smart-active');
 $('nf390MissionLabel').textContent=smart?'Smart Home Hybrid · Denah & topologi':'Network Basics / Free Lab · Topologi';
 if(!smart){$('nf390Logical').hidden=true;return}
 const floor=$('nf377Floor'),original=$('nf370Topology'),logical=$('nf390Logical');
 const viewFloor=!floor.hidden;
 logical.hidden=viewFloor;
 // Legacy logical diagram is illustrative, while this view always reflects real builder nodes/edges.
 original.hidden=true;
 const model=window.NetForgeBuilder?.getState?.();if(!model)return;
 const selected=window.NetForgeBuilder?.getSelected?.();
 const ns=$('nf390Nodes');ns.replaceChildren();
 for(const id of model.nodes){const item=devices[id];if(!item)continue;const node=document.createElement('button');node.type='button';node.className='nf390-logical-node';node.dataset.nf390Node=id;node.dataset.selected=String(id===selected);node.style.left=positions[id][0]+'%';node.style.top=positions[id][1]+'%';node.textContent=item[0]+' '+item[1];ns.append(node)}
 const wires=$('nf390Wires');wires.replaceChildren();
 for(const l of model.links){if(!model.nodes.includes(l.a)||!model.nodes.includes(l.b)||!positions[l.a]||!positions[l.b])continue;const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',positions[l.a][0]);line.setAttribute('y1',positions[l.a][1]);line.setAttribute('x2',positions[l.b][0]);line.setAttribute('y2',positions[l.b][1]);line.setAttribute('class',l.medium==='wifi'?'wifi':'wired');wires.append(line)}
 window.NetForgeDeviceInspector?.render?.();
}
function start(){let count=0;const tick=()=>{attach();if(!built&&count++<20)setTimeout(tick,100)};tick()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.NetForgeUniversalWorkspace={version:'0.40.31',render};
})();
;

/* === script:nf391-shared-graph === */
(()=>{'use strict';
/* v0.40.38: Shared read model + media/port validation. Legacy engines remain authoritative for their own simulation. */
const $=id=>document.getElementById(id);
const CATALOG={
 ap:{name:'Router / Wi-Fi AP',ports:['LAN1','LAN2','LAN3','LAN4'],wifi:true},
 switch:{name:'PoE Switch',ports:['LAN1','LAN2','LAN3','LAN4','LAN5','LAN6','LAN7','LAN8'],poe:['LAN1','LAN2','LAN3','LAN4']},
 tv:{name:'Smart TV',ports:['ETH0'],wifi:true},camera:{name:'IP Camera',ports:['ETH0'],wifi:true,poeIn:true},
 iot:{name:'IoT Sensor',ports:[],wifi:true},nvr:{name:'NVR',ports:['ETH0'],wifi:true},
 router:{name:'Router',ports:['LAN1','LAN2','LAN3','LAN4','WAN']},pc:{name:'PC',ports:['ETH0']},server:{name:'Server',ports:['ETH0']}
};
const pairs=(a,b)=>a+' ⇄ '+b;
function normalizeSmart(s){
 const ids=new Set((s?.nodes||[]).filter(id=>CATALOG[id]));const used=new Set(),issues=[];
 const nodes=[...ids].map(id=>({id,type:id,label:CATALOG[id].name,ports:CATALOG[id].ports.slice(),wireless:!!CATALOG[id].wifi}));
 const edges=[];
 for(const [i,l] of (s?.links||[]).entries()){
  const a=l.a,b=l.b,medium=l.medium;
  if(!ids.has(a)||!ids.has(b)||a===b||!['ethernet','poe','wifi'].includes(medium)){issues.push('Sambungan '+(i+1)+' tidak valid atau perangkat tidak tersedia.');continue;}
  if(medium==='wifi'){
   if(!CATALOG[a].wifi||!CATALOG[b].wifi||!(a==='ap'||b==='ap')){issues.push('Wi-Fi '+pairs(a,b)+' tidak kompatibel.');continue;}
   edges.push({a,b,medium,portA:'RADIO',portB:'RADIO',status:'up'});continue;
  }
  const findPort=(id,preferred)=>{const ports=CATALOG[id].ports;const list=medium==='poe'&&id==='switch'?CATALOG[id].poe:ports;
   if(preferred)return list.includes(preferred)&&!used.has(id+':'+preferred)?preferred:null;
   return list.find(v=>!used.has(id+':'+v))||null};
  const portA=findPort(a,l.portA),portB=findPort(b,l.portB);
  if(medium==='poe'&&!(a==='camera'&&b==='switch'||b==='camera'&&a==='switch')){issues.push('Koneksi PoE '+pairs(a,b)+' tidak sesuai perangkat.');continue;}
  if(!portA||!portB){issues.push('Port habis / tidak tersedia pada '+pairs(a,b)+'.');continue;}
  used.add(a+':'+portA);used.add(b+':'+portB);
  edges.push({a,b,medium,portA,portB,status:'up'});
 }
 return {schema:'netforge.graph.v1',source:'smart-home',nodes,edges,issues};
}
function normalizeBasics(payload){
 let data=payload;try{if(typeof data==='string')data=JSON.parse(data)}catch{return null}
 if(!data||!Array.isArray(data.nodes)||!Array.isArray(data.links))return null;
 const nodes=data.nodes.filter(n=>n&&Number.isSafeInteger(n.id)&&CATALOG[n.type]).map(n=>({id:String(n.id),type:n.type,label:n.config?.name||n.type,ports:CATALOG[n.type].ports.slice(),wireless:false}));
 const ids=new Set(nodes.map(n=>n.id));const issues=[],used=new Set(),edges=[];
 for(const l of data.links){const a=String(l.a),b=String(l.b),pa=l.portA,pb=l.portB;
  if(!ids.has(a)||!ids.has(b)){issues.push('Kabel ke perangkat yang tidak tersedia.');continue}
  const na=nodes.find(n=>n.id===a),nb=nodes.find(n=>n.id===b);
  if(!na.ports.includes(pa)||!nb.ports.includes(pb))issues.push('Nama port tidak dikenal: '+pairs(a,b));
  if(used.has(a+':'+pa)||used.has(b+':'+pb))issues.push('Port digunakan lebih dari sekali: '+pairs(a,b));
  used.add(a+':'+pa);used.add(b+':'+pb);
  edges.push({a,b,medium:'ethernet',portA:pa,portB:pb,status:l.broken?'down':'up'});
 }
 return {schema:'netforge.graph.v1',source:'network-basics',nodes,edges,issues};
}
function smartDraftValidation(state,a,b,medium,ports={}){
 const simulated={nodes:state.nodes,links:state.links.filter(l=>!((l.a===a&&l.b===b)||(l.a===b&&l.b===a))).concat([{a,b,medium,portA:ports.portA,portB:ports.portB}])};
 const graph=normalizeSmart(simulated);const extra=graph.edges.find(e=>(e.a===a&&e.b===b)||(e.a===b&&e.b===a));
 const fail=graph.issues.length||!extra;
 return {ok:!fail,reason:graph.issues[0]||(!extra?'Port atau media tidak tersedia.':''),portA:extra?.portA,portB:extra?.portB};
}
function activeGraph(){
 if(document.body.classList.contains('nf372-smart-active'))return normalizeSmart(window.NetForgeBuilder?.getState?.());
 try{return normalizeBasics(window.NetForgeLab?.export?.())}catch{return null}
}
function audit(){const g=activeGraph();if(!g)return {ok:false,issues:['Model jaringan belum tersedia'],graph:null};return {ok:g.issues.length===0,issues:g.issues,graph:g}}
function showAudit(){const result=audit(),g=result.graph,modal=$('nf391AuditDialog');if(!modal)return;
 const out=$('nf391AuditOutput');out.replaceChildren();const intro=document.createElement('p');intro.textContent=g?`Model bersama ${g.schema} · ${g.source} · ${g.nodes.length} perangkat · ${g.edges.length} sambungan`:'Belum ada model jaringan';out.append(intro);
 const note=document.createElement('p');note.textContent='Audit port adalah pemeriksaan struktur. Konektivitas, kualitas Wi-Fi, skor dan layanan tetap diuji oleh simulator misi.';out.append(note);
 const items=document.createElement('ul');for(const e of g?.edges||[]){const li=document.createElement('li');li.textContent=`${e.a}:${e.portA} ⇄ ${e.b}:${e.portB} · ${e.medium} · ${e.status}`;items.append(li)}out.append(items);
 const status=document.createElement('p');status.textContent=result.issues.length?'⚠ '+result.issues.join(' | '):'✓ Struktur sambungan dan alokasi port konsisten.';out.append(status);modal.hidden=false;
}
function setup(){if($('nf391AuditButton'))return;const bar=$('nf390Toolbar');if(!bar)return;
 const b=document.createElement('button');b.id='nf391AuditButton';b.type='button';b.textContent='🔎 Audit Port & Koneksi';b.addEventListener('click',showAudit);bar.append(b);
 const modal=document.createElement('section');modal.id='nf391AuditDialog';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Audit port dan koneksi');
 const panel=document.createElement('div');panel.className='nf391-panel';const title=document.createElement('h3');title.textContent='🔎 Audit Struktur Jaringan';const body=document.createElement('div');body.id='nf391AuditOutput';const close=document.createElement('button');close.type='button';close.textContent='Tutup';close.addEventListener('click',()=>{modal.hidden=true;b.focus()});panel.append(title,body,close);modal.append(panel);document.body.append(modal);
 modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true});modal.addEventListener('keydown',e=>{if(e.key==='Escape'){modal.hidden=true;b.focus()}});
}
window.NetForgeNetworkGraph={version:'0.40.31',schema:'netforge.graph.v1',catalog:CATALOG,normalizeSmart,normalizeBasics,validateSmartLink:smartDraftValidation,activeGraph,audit};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
;

/* === script:nf392-visual-port-builder === */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 let rejectPending=null,donePending=null;
 const spec=()=>window.NetForgeNetworkGraph?.catalog||{};
 const human={ap:'Router / AP',switch:'PoE Switch',tv:'Smart TV',camera:'IP Camera',iot:'IoT Sensor',nvr:'NVR'};
 function init(){if($('nf392Dialog'))return;
 const root=document.createElement('section');root.id='nf392Dialog';root.hidden=true;root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','nf392Title');
 root.innerHTML=`<div class="nf392-card"><h2 id="nf392Title">🔌 Hubungkan Port Perangkat</h2><p id="nf392Intro"></p><div class="nf392-grid"><div class="nf392-box"><label id="nf392LabelA" for="nf392PortA">Perangkat A</label><select id="nf392PortA"></select><div class="nf392-leds" id="nf392LedsA"></div></div><div class="nf392-box"><label id="nf392LabelB" for="nf392PortB">Perangkat B</label><select id="nf392PortB"></select><div class="nf392-leds" id="nf392LedsB"></div></div></div><p class="nf392-note" id="nf392Feedback" aria-live="polite"></p><div class="nf392-actions"><button class="secondary" type="button" id="nf392Cancel">Batal</button><button type="button" id="nf392Confirm">🔗 Sambungkan</button></div></div>`;
 root.addEventListener('click',e=>{if(e.target===root)cancel()});root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();cancel()}});
 document.body.append(root);$('nf392Cancel').onclick=cancel;
 }
 function cancel(){if(!$('nf392Dialog')||$('nf392Dialog').hidden)return;$('nf392Dialog').hidden=true;const resolve=donePending;donePending=null;resolve?.(null);}
 function request(state,a,b,medium){init();if(donePending)cancel();return new Promise(resolve=>{
 donePending=resolve;const modal=$('nf392Dialog'),catalog=spec();const allLinks=(state?.links||[]).filter(l=>!((l.a===a&&l.b===b)||(l.a===b&&l.b===a)));
 const used=new Set();for(const l of allLinks)if(l.medium!=='wifi'){
  if(l.portA)used.add(l.a+':'+l.portA);if(l.portB)used.add(l.b+':'+l.portB);
  // Legacy links may not carry assigned ports; normalize with the graph instead.
 }
 const graph=window.NetForgeNetworkGraph?.normalizeSmart?.({nodes:state.nodes,links:allLinks});
 for(const edge of graph?.edges||[])if(edge.medium!=='wifi'){used.add(edge.a+':'+edge.portA);used.add(edge.b+':'+edge.portB)}
 const options=(id)=>{if(medium==='wifi')return catalog[id]?.wifi?['RADIO']:[];const item=catalog[id];if(!item)return [];
  if(medium==='poe'&&id==='switch')return item.poe||[];
  return item.ports||[]};
 const build=(id,side)=>{const select=$('nf392Port'+side),leds=$('nf392Leds'+side);select.replaceChildren();leds.replaceChildren();const ports=options(id);
  const allPorts=medium==='wifi'?['RADIO']:(catalog[id]?.ports||[]);
  for(const p of allPorts){const span=document.createElement('span'),occupied=used.has(id+':'+p),allowed=ports.includes(p);span.className='nf392-port'+(occupied?' used':!allowed?' incompatible':'');span.innerHTML='<span class="nf392-dot"></span>';span.append(document.createTextNode(p));span.title=occupied?'Terpakai':!allowed?'Tidak sesuai media':'Tersedia';leds.append(span)}
  for(const p of ports){const o=new Option(p+(used.has(id+':'+p)?' (terpakai)':''),p);o.disabled=used.has(id+':'+p);select.add(o)}
  const free=ports.find(p=>!used.has(id+':'+p));select.value=free||'';return !!free;
 };
 $('nf392Intro').textContent=`${human[a]||a} ↔ ${human[b]||b} · ${medium==='poe'?'Ethernet PoE':medium==='wifi'?'Wi-Fi':'Ethernet'}. Pilih port fisik yang masih kosong pada kedua perangkat.`;
 $('nf392LabelA').textContent=human[a]||a;$('nf392LabelB').textContent=human[b]||b;
 const aa=build(a,'A'),bb=build(b,'B'),feedback=$('nf392Feedback');
 const validate=()=>{const portA=$('nf392PortA').value,portB=$('nf392PortB').value;
  const res=portA&&portB?window.NetForgeNetworkGraph?.validateSmartLink?.(state,a,b,medium,{portA,portB}):{ok:false,reason:'Tidak ada port kompatibel yang masih tersedia.'};
  const ok=!!res?.ok;$('nf392Confirm').disabled=!ok;
  feedback.textContent=ok?(medium==='wifi'?'🟢 Iga: Kedua perangkat mendukung radio Wi-Fi. Asosiasi dan kualitas sinyal diperiksa oleh pengujian misi.':'🟢 Iga: Kedua port siap digunakan. LED hijau menandakan port sudah dipakai; LED tanpa cahaya berarti tersedia.'):'⚠ Iga: '+(res?.reason||'Pilih port yang kompatibel dan belum digunakan.');
  return ok;
 };
 $('nf392PortA').onchange=validate;$('nf392PortB').onchange=validate;
 $('nf392Confirm').onclick=()=>{if(!validate())return;const result={portA:$('nf392PortA').value,portB:$('nf392PortB').value};modal.hidden=true;donePending=null;resolve(result)};
 modal.hidden=false;validate();$('nf392PortA').focus();
 })}
 function error(reason){const feedback=$('nf392Feedback');if(feedback)feedback.textContent='⚠ Iga: '+reason;}
 window.NetForgePortBuilder={version:'0.40.31',request,error};
})();
;

/* === script:nf393-device-inspector === */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const labels={ap:['📡','Router / Wi-Fi AP'],switch:['🔌','PoE Switch'],tv:['📺','Smart TV'],camera:['📹','IP Camera'],iot:['💡','IoT Sensor'],nvr:['🗄️','NVR']};
 const config={ap:'nf370_distance',switch:'nf370_poe',tv:'nf370_tv',camera:'nf370_camera',iot:'nf370_iot',nvr:'nf370_nvr'};
 const make=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=String(txt);return el};
 const linkName=m=>m==='poe'?'Ethernet PoE':m==='wifi'?'Wi-Fi':'Ethernet';
 function render(){const target=$('nf390Inspector');if(!target||!document.body.classList.contains('nf372-smart-active'))return;
  const state=window.NetForgeBuilder?.getState?.(), id=window.NetForgeBuilder?.getSelected?.();
  if(!state){target.replaceChildren(make('b','','DEVICE INSPECTOR'),make('p','nf393-muted','Model jaringan sedang disiapkan.'));return}
  const graph=window.NetForgeNetworkGraph?.normalizeSmart?.(state);
  target.replaceChildren();
  const heading=make('div','nf393-head');heading.append(make('b','',id?(labels[id]?.join(' ')||id):'🔎 DEVICE INSPECTOR'),make('span','nf393-chip',state.mode==='guided'?'Guided':'Challenge'));target.append(heading);
  if(!id||!state.nodes.includes(id)){
   target.append(make('p','nf393-muted','Pilih perangkat pada Denah Rumah atau Topologi Logis untuk melihat kondisi port, jalur, dan konfigurasi.'));
   const summary=make('div','nf393-kpis');for(const [a,b] of [['Perangkat',state.nodes.length],['Sambungan',state.links.length]]){const c=make('div','nf393-kpi');c.append(make('span','',a),make('strong','',b));summary.append(c)}target.append(summary);return;
  }
  const all=window.NetForgeNetworkGraph?.catalog?.[id]||{};
  const edges=(graph?.edges||[]).filter(e=>e.a===id||e.b===id);
  const raw=(state.links||[]).filter(e=>e.a===id||e.b===id);
  const kpis=make('div','nf393-kpis');for(const [label,value] of [['Port kabel terpakai',edges.filter(e=>e.medium!=='wifi').length+' / '+(all.ports||[]).length],['Koneksi Wi-Fi',edges.filter(e=>e.medium==='wifi').length]]){const c=make('div','nf393-kpi');c.append(make('span','',label),make('strong','',value));kpis.append(c)}target.append(kpis);
  target.append(make('b','','STATUS PORT & KONEKSI'));
  const list=make('div','nf393-portlist');const ports=[...(all.ports||[])];if(all.wifi)ports.push('RADIO');
  if(!ports.length)list.append(make('p','nf393-muted','Tidak ada port fisik pada katalog perangkat ini.'));
  for(const port of ports){const matches=edges.filter(e=>e.a===id?e.portA===port:e.portB===port);const row=make('div','nf393-portrow'),led=make('span','nf393-light'+(matches.length?' used':'')),detail=make('div','nf393-portdetail');
   const name=make('b','',port);detail.append(name);
   if(!matches.length){detail.append(make('div','nf393-muted',port==='RADIO'?'Radio tersedia · belum ada asosiasi topologi':'Kosong · belum dialokasikan'));}
   for(const e of matches){const peer=e.a===id?e.b:e.a;const medium=linkName(e.medium);detail.append(make('div','nf393-muted',medium+' → '+(labels[peer]?.[1]||peer)+' ('+(e.a===id?e.portB:e.portA)+')'));}
   if(id==='switch'&&(all.poe||[]).includes(port))detail.append(make('div','nf393-muted','PoE capable'));
   row.append(led,detail);list.append(row);
  }
  target.append(list);
  if(raw.length>edges.length||graph?.issues?.length){const caution=make('div','nf393-warning');caution.textContent='⚠ Iga: Ada '+Math.max(0,raw.length-edges.length)+' sambungan yang belum lolos audit port. '+(graph?.issues?.slice(0,2).join(' • ')||'Periksa jenis media dan port.');target.append(caution)}
  if(id==='camera'){const poe=edges.some(e=>e.medium==='poe');target.append(make('p','nf393-muted','Daya kamera: '+(poe?'jalur PoE teralokasi; periksa budget switch melalui konfigurasi':'belum ada jalur PoE teralokasi. Kamera Wi-Fi memerlukan daya terpisah.')))}
  if(edges.some(e=>e.medium==='wifi'))target.append(make('p','nf393-muted','Wi-Fi terhubung secara topologi; kualitas sinyal dan throughput perlu diperiksa pada Wi-Fi Analyzer.'));
  const actions=make('div','nf393-actions');const settings=make('button','','⚙ Buka konfigurasi');settings.type='button';settings.onclick=()=>{const el=$(config[id]);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.focus()}else $('nf380Panel')?.scrollIntoView({behavior:'smooth',block:'center'})};actions.append(settings);
  const audit=make('button','','🔎 Audit Port & Koneksi');audit.type='button';audit.onclick=()=>$('nf391AuditButton')?.click();actions.append(audit);
  target.append(actions,make('p','nf393-muted','● Hijau = port dialokasikan oleh topologi, bukan verifikasi link fisik atau traffic real-time. Periksa misi untuk hasil layanan.'));
 }
 window.NetForgeDeviceInspector={version:'0.40.31',render};
 const refresh=()=>render();window.addEventListener('netforge:builder-render',refresh);window.addEventListener('netforge:ports-changed',refresh);window.addEventListener('netforge:mission-changed',()=>setTimeout(refresh,0));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(refresh,100));else setTimeout(refresh,100);
})();
;

/* === script:nf395-interactive-device-configuration === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const KEY='netforge.smart-home.device-network.v1';
const DEVICES=['tv','camera','iot','nvr'];
const defaultItem=()=>({mode:'auto',ip:'',mask:'255.255.255.0',gateway:'192.168.10.1'});
let data={};
try{let parsed=JSON.parse(localStorage.getItem(KEY)||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))data=parsed}catch{}
function get(id){const d=data[id]||{};return {...defaultItem(),...d}}
function put(id,value){data[id]={...get(id),...value};try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
function octets(v){const a=String(v||'').trim().split('.');if(a.length!==4||a.some(x=>!/^\d{1,3}$/.test(x)||Number(x)>255))return null;return a.map(Number)}
function ipnum(v){const a=octets(v);return a?(((a[0]*16777216)+(a[1]<<16)+(a[2]<<8)+a[3])>>>0):null}
function validHost(ip,mask){const n=ipnum(ip),m=ipnum(mask);if(n===null||m===null||!m||m===0xffffffff)return false;const host=(~m)>>>0;const network=(n&m)>>>0;return n!==network&&n!==((network|host)>>>0)}
function validate(settings){const active=window.NetForgeBuilder?.getState?.()?.nodes||[];const present=DEVICES.filter(id=>active.includes(id));const failures={},issues=[],ips={};
for(const id of present){const d=get(id);if(d.mode==='auto'){
 if(!settings.dhcp){failures[id]='DHCP router mati; gunakan IP statis';issues.push(id+': DHCP tidak tersedia')}
 continue;
}
const ip=ipnum(d.ip),mask=ipnum(d.mask),gw=ipnum(d.gateway);
if(!validHost(d.ip,d.mask)){failures[id]='Alamat IP/mask tidak valid';issues.push(id+': alamat IP tidak valid');continue}
if(mask!==0xffffff00){failures[id]='Model misi mendukung subnet /24 (255.255.255.0)';issues.push(id+': subnet belum didukung');continue}
if(gw===null||(ip&mask)!==(gw&mask)||!validHost(d.gateway,d.mask)){failures[id]='Gateway tidak berada pada subnet yang sama';issues.push(id+': gateway berbeda subnet');continue}
const n=String(ip);if(ips[n]){failures[id]='Duplikasi alamat IP dengan '+ips[n];failures[ips[n]]='Duplikasi alamat IP dengan '+id;issues.push('Duplikasi IP '+d.ip)}else ips[n]=id;
if(d.ip===d.gateway){failures[id]='IP perangkat sama dengan gateway';issues.push(id+': IP sama gateway')}
}
return {ok:issues.length===0,failures,issues,present};}
function staticReady(){return validate({dhcp:false}).ok}
function select(label,items,value,change){const wrap=document.createElement('label');wrap.textContent=label;const sel=document.createElement('select');for(const [v,l] of items){const op=document.createElement('option');op.value=v;op.textContent=l;sel.append(op)}sel.value=value;sel.addEventListener('change',()=>change(sel.value));wrap.append(sel);return wrap}
function setOriginal(id,value){const el=$(id);if(!el)return false;if(el.type==='checkbox')el.checked=Boolean(value);else el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true}
let rendering=false;
function render(){if(rendering)return;const target=$('nf390Inspector'),id=window.NetForgeBuilder?.getSelected?.();if(!target||!document.body.classList.contains('nf372-smart-active')||!id)return;
if(!window.NetForgeBuilder?.getState?.()?.nodes?.includes(id))return;
rendering=true;try{
const old=target.querySelector('.nf395-config');old?.remove();const form=document.createElement('section');form.className='nf395-config';const title=document.createElement('h4');title.textContent='⚙ Konfigurasi Perangkat';form.append(title);
function addControl(label,items,field){const el=$(field);if(!el)return;form.append(select(label,items,el.type==='checkbox'?(el.checked?'on':'off'):el.value,v=>{setOriginal(field,el.type==='checkbox'?v==='on':v);window.NetForgeDeviceInspector?.render?.();}));}
if(id==='ap'){
 addControl('DHCP Router',[['on','Aktif'],['off','Nonaktif']], 'nf370_dhcp');
 const status=document.createElement('p');status.className='nf395-hint';status.textContent='LAN gateway simulasi: 192.168.10.1/24. DHCP hanya berlaku untuk perangkat yang memilih mode otomatis.';form.append(status);
} else if(id==='switch'){
 addControl('Anggaran daya PoE',[['30','30 W'],['60','60 W'],['120','120 W']],'nf370_poe');
 addControl('Uplink kabel',[['100','100 Mbps'],['1000','1 Gbps']],'nf370_uplink');
} else if(id==='tv'){
 addControl('Media Smart TV',[['wifi5','Wi-Fi 5 GHz'],['wifi24','Wi-Fi 2,4 GHz'],['lan','Ethernet']],'nf370_tv');
} else if(id==='camera'){
 addControl('Koneksi IP Camera',[['poe','Ethernet PoE'],['wifi','Wi-Fi']],'nf370_camera');
 addControl('Kompatibilitas video kamera/NVR',[['on','Layanan aktif'],['off','Layanan bermasalah']],'nf370_onvif');
} else if(id==='iot'){
 addControl('Wi-Fi IoT',[['wifi24','2,4 GHz (didukung)'],['wifi5','5 GHz (tidak didukung pada sensor ini)']],'nf370_iot');
} else if(id==='nvr'){
 addControl('Koneksi NVR',[['lan','Ethernet'],['wifi','Wi-Fi']],'nf370_nvr');
 addControl('Layanan perekaman',[['on','Aktif'],['off','Tidak kompatibel']],'nf370_onvif');
}
if(DEVICES.includes(id)){
 const d=get(id);form.append(select('Konfigurasi IPv4',[['auto','Otomatis (DHCP)'],['static','Statis']],d.mode,v=>{put(id,{mode:v});window.NetForgeDeviceInspector?.render?.()}));
 if(d.mode==='static'){
 const grid=document.createElement('div');grid.className='nf395-grid';const fields=[['ip','Alamat IPv4','192.168.10.20'],['mask','Subnet Mask','255.255.255.0'],['gateway','Gateway','192.168.10.1']];const els={};
 for(const [key,label,placeholder] of fields){const l=document.createElement('label');l.textContent=label;const x=document.createElement('input');x.type='text';x.inputMode='decimal';x.placeholder=placeholder;x.value=d[key]||'';x.autocomplete='off';l.append(x);grid.append(l);els[key]=x}
 form.append(grid);const save=document.createElement('button');save.type='button';save.className='nf395-save';save.textContent='Simpan konfigurasi IP';save.onclick=()=>{put(id,{mode:'static',ip:els.ip.value.trim(),mask:els.mask.value.trim(),gateway:els.gateway.value.trim()});window.NetForgeDeviceInspector?.render?.()};form.append(save);
 }
 const current=window.NetForgeSmartHome?.getState?.()||{dhcp:true};const v=validate(current),msg=document.createElement('div');msg.className='nf395-status'+(v.failures[id]?' bad':'');msg.textContent=v.failures[id]?'⚠ Iga: '+v.failures[id]:(get(id).mode==='auto'?'DHCP '+(current.dhcp?'aktif — IP otomatis tersedia':'nonaktif — butuh IP statis'):'✓ Format IP statis dan subnet valid pada model misi');form.append(msg);
}
const tip=document.createElement('p');tip.className='nf395-hint';tip.textContent='Perubahan media/layanan memengaruhi evaluasi lokal. Jika jenis media diubah, periksa dan sambungkan ulang kabel/Wi-Fi pada Builder. Konfigurasi IPv4 adalah model edukasi /24, bukan emulator protokol penuh.';form.append(tip);target.append(form);
}finally{rendering=false}}
function init(){if(!window.NetForgeDeviceInspector)return;const old=window.NetForgeDeviceInspector.render;if(!old||old.__nf395)return;const wrap=function(...args){old.apply(this,args);render()};wrap.__nf395=true;window.NetForgeDeviceInspector.render=wrap;
 window.addEventListener('netforge:builder-render',()=>setTimeout(render,0));window.addEventListener('netforge:mission-changed',()=>setTimeout(render,0));setTimeout(render,100);
}
window.NetForgeDeviceConfig={version:'0.40.31',validate,staticReady,get};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf396-packet-traffic === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const SAMPLES=[['tv-stream','📺 Streaming: Router/AP → Smart TV','ap','tv'],['camera-record','📹 Rekaman: Kamera → NVR','camera','nvr'],['iot-ping','💡 Ping: IoT → Router/AP','iot','ap'],['tv-ping','📡 Ping: Smart TV → Router/AP','tv','ap'],['nvr-to-router','🗄️ Diagnostik: NVR → Router/AP','nvr','ap']];
const names={ap:'Router/AP',switch:'PoE Switch',tv:'Smart TV',camera:'IP Camera',iot:'IoT Sensor',nvr:'NVR'};
let panel=null,runId=0,frame=0;
function model(){const s=window.NetForgeBuilder?.getState?.();const graph=window.NetForgeNetworkGraph?.normalizeSmart?.(s);return {s,graph};}
function pathFind(s,graph,start,end){if(!s?.nodes?.includes(start)||!s.nodes.includes(end))return null;
 const edges=(graph?.edges||[]).filter(e=>e.status==='up');const q=[start],seen=new Set([start]),prev=new Map();
 while(q.length){const n=q.shift();if(n===end){const path=[end];while(prev.has(path[0]))path.unshift(prev.get(path[0]));return path}
 for(const e of edges){const v=e.a===n?e.b:e.b===n?e.a:null;if(v&&!seen.has(v)){seen.add(v);prev.set(v,n);q.push(v)}}}return null}
function serviceCheck(kind, s, route){const settings=window.NetForgeSmartHome?.getState?.()||{};
 if(!route)return 'Tidak tersedia jalur dari sumber ke tujuan. Periksa inventori, kabel, dan port.';
 const invalid=window.NetForgeDeviceConfig?.validate?.(settings);
 const ends=SAMPLES.find(x=>x[0]===kind);
 for(const id of [ends?.[2],ends?.[3]])if(invalid?.failures?.[id])return 'Konfigurasi IP '+(names[id]||id)+': '+invalid.failures[id];
 if(kind==='camera-record'&&!settings.onvif)return 'Jalur ditemukan, tetapi layanan kamera/NVR belum kompatibel atau autentikasi bermasalah.';
 if(kind==='camera-record'&&settings.camera==='poe'&&Number(settings.poe||0)<48)return 'Jalur ditemukan, tetapi budget PoE tidak cukup untuk empat kamera.';
 if(kind==='iot-ping'&&settings.iot==='wifi5')return 'Sensor IoT ini hanya mendukung Wi-Fi 2,4 GHz.';
 const e=route.slice(1).map((n,i)=>({a:route[i],b:n}));
 if(kind==='tv-stream'&&settings.tv==='lan'&&e.some(x=>{const edge=(graphFor(s)?.edges||[]).find(y=>(y.a===x.a&&y.b===x.b)||(y.a===x.b&&y.b===x.a));return edge?.medium==='wifi'}))return 'Smart TV dipilih Ethernet, tetapi jalur masih melalui Wi-Fi. Perbaiki media atau pengaturan.';
 return '';
}
function graphFor(s){return window.NetForgeNetworkGraph?.normalizeSmart?.(s)}
function container(){const floor=$('nf377Floor'),logical=$('nf390Logical');if(logical&&!logical.hidden&&document.body.classList.contains('nf372-smart-active'))return logical;if(floor&&!floor.hidden)return floor;return null}
function xy(view,id){let el;if(view.id==='nf390Logical')el=view.querySelector('[data-nf390-node="'+id+'"]');else el=id==='switch'?$('nf380_switch'):$('nf377_'+id);
 if(!el||el.hidden||!el.getBoundingClientRect().width)return null;const r=el.getBoundingClientRect(),v=view.getBoundingClientRect();return [(r.left+r.width/2-v.left)/v.width*100,(r.top+r.height/2-v.top)/v.height*100]}
function clearTrail(){for(const v of [$('nf377Floor'),$('nf390Logical')])v?.querySelectorAll('.nf396-trail').forEach(x=>x.remove())}
function log(t){const li=document.createElement('li');li.textContent=new Date().toLocaleTimeString('id-ID')+' · '+t;$('nf396Log')?.prepend(li);const list=$('nf396Log');while(list?.children.length>8)list.lastChild.remove()}
function status(msg,bad=false){const el=$('nf396Status');if(!el)return;el.textContent=msg;el.dataset.fail=String(bad)}
function stop(){runId++;if(frame)cancelAnimationFrame(frame);frame=0;clearTrail();$('nf396Start')?.removeAttribute('disabled')}
function animate(points,failed,token,done){const view=container();if(!view){done();return}const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.classList.add('nf396-trail');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');view.append(svg);
 const segments=points.slice(1).map((p,i)=>[points[i],p]);const path=document.createElementNS(ns,'path');path.setAttribute('d','M'+points.map(p=>p.join(' ')).join(' L'));if(failed)path.classList.add('failed');svg.append(path);
 const dot=document.createElementNS(ns,'circle');dot.setAttribute('r','1.55');svg.append(dot);const speed=Number($('nf396Speed')?.value||1),duration=Math.max(450,segments.length*850/speed);const start=performance.now();
 const draw=t=>{if(token!==runId)return;const progress=Math.min(1,(t-start)/duration),u=progress*segments.length,i=Math.min(segments.length-1,Math.floor(u)),f=Math.min(1,u-i);const a=segments[i][0],b=segments[i][1];dot.setAttribute('cx',String(a[0]+(b[0]-a[0])*f));dot.setAttribute('cy',String(a[1]+(b[1]-a[1])*f));if(progress<1)frame=requestAnimationFrame(draw);else{dot.setAttribute('fill',failed?'#ff9f89':'#fff8b4');frame=0;done()}};frame=requestAnimationFrame(draw)}
function play(){stop();const token=runId,kind=$('nf396Scenario').value,scenario=SAMPLES.find(s=>s[0]===kind),{s,graph}=model();if(!scenario||!s)return status('Builder Smart Home belum tersedia.',true);
 const route=pathFind(s,graph,scenario[2],scenario[3]);if(!route){status('❌ Iga: '+serviceCheck(kind,s,null),true);log('GAGAL · '+scenario[1]+' · Tidak ada jalur yang valid');return}
 const issue=serviceCheck(kind,s,route);const view=container();if(!view)return status('Pilih Denah Rumah atau Topologi Logis terlebih dahulu.',true);
 const pts=route.map(id=>xy(view,id));if(pts.some(p=>!p))return status('Perangkat pada lintasan belum terlihat. Ubah tampilan atau periksa topologi.',true);
 $('nf396Start').disabled=true;status('▶ Mengirim paket melalui '+route.map(id=>names[id]||id).join(' → ')+' …');
 animate(pts,!!issue,token,()=>{if(token!==runId)return;const info=route.map(id=>names[id]||id).join(' → ');status(issue?'⚠ Iga: '+issue:'✅ Paket mencapai tujuan melalui '+info,!!issue);log((issue?'GAGAL LAYANAN':'BERHASIL')+' · '+scenario[1]+' · '+info+(issue?' · '+issue:''));$('nf396Start').disabled=false})}
function init(){if($('nf396Panel')||!$('nf377Controls'))return;panel=document.createElement('section');panel.id='nf396Panel';panel.setAttribute('aria-label','Simulasi trafik paket Smart Home');panel.innerHTML='<h3>📡 Network Traffic & Packet Visualization</h3><p>Simulasikan aliran paket pada perangkat dan koneksi yang Anda bangun. Jika jalur putus, paket tidak akan bergerak secara fiktif.</p><div class="nf396-controls"><label>Jenis pengujian<select id="nf396Scenario"></select></label><label>Kecepatan animasi<select id="nf396Speed"><option value="0.5">0,5× · Lambat</option><option value="1" selected>1× · Normal</option><option value="2">2× · Cepat</option></select></label><button type="button" id="nf396Start">▶ Kirim Paket</button><button type="button" id="nf396Stop">■ Hentikan</button></div><div id="nf396Status" role="status" aria-live="polite">Pilih skenario lalu tekan Kirim Paket. Jalur dibaca dari topologi aktual.</div><ul id="nf396Log" aria-label="Riwayat pengiriman paket"></ul><p class="nf396-note">Simulasi edukatif berbasis graf dan konfigurasi misi. Bukan packet capture, traceroute protokol, atau pengukuran throughput fisik. Tidak menambah XP resmi.</p>';
 for(const s of SAMPLES){const opt=document.createElement('option');opt.value=s[0];opt.textContent=s[1];panel.querySelector('#nf396Scenario').append(opt)}$('nf377Controls').before(panel);
 $('nf396Start').addEventListener('click',play);$('nf396Stop').addEventListener('click',()=>{stop();status('Animasi dihentikan.')});
 window.addEventListener('netforge:builder-render',stop);window.addEventListener('netforge:mission-changed',stop);
 document.querySelectorAll('[data-nf377-view]').forEach(b=>b.addEventListener('click',stop));
 window.NetForgeTraffic={version:'0.40.31',pathFind:(a,b)=>{const {s,graph}=model();return pathFind(s,graph,a,b)},play,stop};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf397-traffic-analyzer === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const FLOW=[
 {id:'tv',title:'📺 Streaming Smart TV',from:'ap',to:'tv',rate:25},
 {id:'camera',title:'📹 Rekaman 4 IP Camera → NVR',from:'camera',to:'nvr',rate:32},
 {id:'iot',title:'💡 Telemetri sensor IoT',from:'iot',to:'ap',rate:1},
 {id:'nvr',title:'🗄️ Monitoring NVR → Router',from:'nvr',to:'ap',rate:5}
];
const names={ap:'Router/AP',switch:'PoE Switch',tv:'Smart TV',camera:'IP Camera',iot:'IoT Sensor',nvr:'NVR'};
let initialized=false;
const safe=n=>Number.isFinite(n)?Math.round(n*10)/10:0;
function getModel(){const state=window.NetForgeBuilder?.getState?.(),settings=window.NetForgeSmartHome?.getState?.()||{};
 const graph=state?window.NetForgeNetworkGraph?.normalizeSmart?.(state):null;
 return {state,graph,settings};}
function path(graph,src,dst){if(!graph?.nodes?.some(n=>n.id===src)||!graph.nodes.some(n=>n.id===dst))return null;
 const q=[src],prev=new Map(),seen=new Set(q);
 while(q.length){const n=q.shift();if(n===dst){const route=[];let x=dst;while(x!==src){const v=prev.get(x);route.unshift(v.edge);x=v.node;}return route;}
 for(const [index,edge] of (graph.edges||[]).entries()){if(edge.status!=='up')continue;const next=edge.a===n?edge.b:edge.b===n?edge.a:null;if(next&&!seen.has(next)){seen.add(next);prev.set(next,{node:n,edge:{...edge,index}});q.push(next)}}}
 return null;}
function edgeKey(e){return [e.a,e.b].sort().join(':')+':'+e.medium;}
function estimate(opts={}){
 const {graph,settings}=getModel();if(!graph)return {error:'Builder Smart Home belum tersedia.'};
 const active=FLOW.filter(f=>opts['on_'+f.id]!==false).map(f=>({...f,rate:Math.max(0,Math.min(250,Number(opts['rate_'+f.id]??f.rate)))}));
 const flows=active.map(f=>({...f,route:path(graph,f.from,f.to)}));
 // Concurrency: demands are added only on shared modeled physical edges. This is an educational link contention model.
 const demand={};for(const f of flows){if(!f.route)continue;for(const e of f.route){const k=edgeKey(e);demand[k]=(demand[k]||0)+f.rate;}}
 const wireless=window.NetForgeWirelessEngine?.evaluate?.(settings);
 const link=window.NetForgeCable?.evaluate?.(settings)||window.NetForgeEthernet?.evaluate?.(settings)||null;
 const caps={};for(const e of graph.edges||[]){const k=edgeKey(e);
  let capacity=e.medium==='wifi'?150:1000;
  if(e.medium==='wifi'){
    const peer=e.a==='ap'?e.b:e.b==='ap'?e.a:null;
    const radio=wireless?.[peer];if(radio&&Number.isFinite(Number(radio.mbps)))capacity=Math.max(1,Number(radio.mbps));
    else if(peer==='iot')capacity=40;
    else capacity=Number(settings.tv==='wifi24'&&peer==='tv'?75:150);
  }else if(e.a==='ap'||e.b==='ap'){
    const negotiated=Number(link?.speedMbps??link?.mbps??link?.speed??settings.uplink??1000);
    capacity=negotiated>0?negotiated:0;
  }
  caps[k]=capacity;
 }
 const utilization={};for(const [k,val] of Object.entries(demand))utilization[k]=caps[k]>0?val/caps[k]:Infinity;
 const rows=flows.map(f=>{
  if(!f.route)return {...f,delivered:0,latency:null,loss:100,reason:'Tidak ada lintasan pada topologi aktif.',util:0,failed:true};
  const high=Math.max(0,...f.route.map(e=>utilization[edgeKey(e)]||0));
  const factor=high>1?1/high:1;
  const delivered=safe(f.rate*factor);
  const loss=high>1?safe(Math.min(95,(1-1/high)*100)):0;
  // Not empirical network RTT: illustrative queueing delay grows as utilization approaches/exceeds 100%.
  const latency=safe(3+f.route.length*2+(high<1?Math.min(32,high*high*18):30+(high-1)*35));
  let reason=high>1?'Bottleneck: trafik gabungan melampaui kapasitas link bersama.':high>.8?'Utilisasi tinggi; tersedia sedikit ruang untuk lonjakan trafik.':'Lintasan tersedia dan permintaan trafik tertampung.';
  if(f.id==='camera'&&(!settings.onvif||settings.camera==='poe'&&Number(settings.poe||0)<48))reason='Layanan kamera/NVR atau budget PoE belum siap (meskipun koneksi fisik tersedia).';
  const failed=(f.id==='camera'&&(!settings.onvif||settings.camera==='poe'&&Number(settings.poe||0)<48));
  return {...f,delivered:failed?0:delivered,loss:failed?100:loss,latency,util:safe(high*100),reason,failed};
 });
 const hot=Object.keys(demand).map(k=>({id:k,demand:safe(demand[k]),capacity:safe(caps[k]||0),util:utilization[k]})).sort((a,b)=>b.util-a.util);
 return {rows,hot,issues:graph.issues||[],totalDemand:safe(rows.reduce((a,f)=>a+f.rate,0)),totalDelivered:safe(rows.reduce((a,f)=>a+f.delivered,0))};
}
function opt(){const x={};for(const f of FLOW){x['on_'+f.id]=$('nf397_on_'+f.id)?.checked!==false;x['rate_'+f.id]=Number($('nf397_rate_'+f.id)?.value??f.rate)}return x}
function render(){const out=$('nf397Results');if(!out)return;const res=estimate(opt());out.replaceChildren();if(res.error){out.textContent=res.error;return;}
 const summary=document.createElement('div');summary.className='nf397-total';summary.textContent=`Total permintaan ${res.totalDemand} Mbps · kapasitas efektif gabungan yang terkirim ${res.totalDelivered} Mbps · ${res.hot.length} link dilalui. Angka estimasi model, bukan hasil speed test.`;out.append(summary);
 for(const f of res.rows){const card=document.createElement('div');card.className='nf397-flow'+(f.loss>0||f.failed?' nf397-warn':'');const h=document.createElement('div');h.className='nf397-flow-head';h.textContent=f.title;const sub=document.createElement('div');sub.className='nf397-flow-rate';sub.textContent=`Permintaan ${f.rate} Mbps · Terkirim ${f.delivered} Mbps · Latensi ~${f.latency??'—'} ms · Loss ~${f.loss}%`;const meter=document.createElement('div');meter.className='nf397-meter';const bar=document.createElement('div');bar.className='nf397-bar';bar.style.width=Math.max(0,Math.min(100,f.rate?f.delivered/f.rate*100:100))+'%';meter.append(bar);const note=document.createElement('div');note.className=f.failed||f.loss?'nf397-bad':'nf397-ok';note.textContent='Iga: '+f.reason;card.append(h,sub,meter,note);out.append(card);}
 const bottleneck=document.createElement('div');bottleneck.className='nf397-total';const worst=res.hot[0];bottleneck.textContent=worst?`Link terberat: ${worst.id} · beban ${worst.demand} Mbps / kapasitas ${worst.capacity} Mbps (${safe(worst.util*100)}%). ${worst.util>1?'Saran Iga: upgrade link/perbaiki kabel, pindahkan trafik ke jalur lain, atau turunkan bitrate kamera dan streaming.':worst.util>.8?'Saran Iga: sediakan headroom kapasitas dan awasi lonjakan beban.':'Saran Iga: kapasitas link cukup untuk profil trafik ini.'}`:'Belum ada link yang membawa trafik.';out.append(bottleneck);
 if(res.issues.length){const issue=document.createElement('p');issue.className='nf397-bad';issue.textContent='Audit graf: '+res.issues.join('; ');out.append(issue)}
}
function init(){if(initialized||!$('nf377Controls'))return;initialized=true;const panel=document.createElement('section');panel.id='nf397Panel';panel.setAttribute('aria-label','Network Traffic Analyzer');const h=document.createElement('h3');h.textContent='📊 Apache 2.0 License & Official Repository';const p=document.createElement('p');p.textContent='Jalankan beban trafik bersamaan dan amati bottleneck, throughput efektif, latency, serta packet loss perkiraan pada topologi yang dibangun.';const controls=document.createElement('div');controls.className='nf397-controls';
 for(const f of FLOW){const label=document.createElement('label');label.className='nf397-flow';const name=document.createElement('span');name.textContent=f.title;const tog=document.createElement('label');tog.className='nf397-toggle';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=true;checkbox.id='nf397_on_'+f.id;const caption=document.createElement('span');caption.textContent='Aktif';tog.append(checkbox,caption);const inp=document.createElement('input');inp.type='number';inp.id='nf397_rate_'+f.id;inp.min='0';inp.max='250';inp.step='1';inp.value=String(f.rate);inp.setAttribute('aria-label','Kebutuhan Mbps '+f.title);label.append(name,tog,inp);controls.append(label);checkbox.addEventListener('change',render);inp.addEventListener('input',render);}
 const btn=document.createElement('button');btn.type='button';btn.textContent='↻ Analisis Ulang';btn.addEventListener('click',render);const out=document.createElement('div');out.id='nf397Results';out.setAttribute('aria-live','polite');const foot=document.createElement('p');foot.className='nf397-note';foot.textContent='Estimasi edukatif deterministik: kapasitas setiap koneksi, antrean sederhana dan pembagian adil pada link bersama. Latensi/loss bukan hasil pengukuran; jalur internet eksternal, interferensi detail, dan protokol TCP nyata belum dimodelkan. Tidak memengaruhi nilai resmi.';panel.append(h,p,controls,btn,out,foot);if($('nf396Panel'))$('nf396Panel').after(panel);else $('nf377Controls').before(panel);render();
 window.addEventListener('netforge:builder-render',render);window.addEventListener('netforge:ports-changed',render);window.addEventListener('netforge:mission-changed',render);
 window.NetForgeTrafficAnalyzer={version:'0.40.31',estimate,refresh:render};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf400-universal-engine === */
(()=>{'use strict';
const $=id=>document.getElementById(id);const KEY='netforge.universal.free.v1';
const catalog=[
 {id:'router',name:'Router',icon:'📡',cat:'Jaringan',basic:true,mixed:true,ports:['LAN1','LAN2','LAN3','LAN4','WAN','SFP1'],wifi:true,cost:120},
 {id:'switch',name:'Switch',icon:'🔀',cat:'Jaringan',basic:true,mixed:true,ports:['LAN1','LAN2','LAN3','LAN4','LAN5','LAN6','LAN7','LAN8','SFP1'],poe:true,cost:90},
 {id:'pc',name:'Desktop PC',icon:'🖥️',cat:'Klien',basic:true,mixed:true,ports:['ETH0'],cost:150},
 {id:'server',name:'Server',icon:'🗄️',cat:'Server',basic:true,mixed:true,ports:['ETH0'],cost:300},
 {id:'ap',name:'Access Point',icon:'📶',cat:'Wireless',smart:true,mixed:true,ports:['ETH0'],wifi:true,cost:100},
 {id:'laptop',name:'Laptop',icon:'💻',cat:'Klien',basic:true,mixed:true,ports:['ETH0'],wifi:true,cost:180},
 {id:'tablet',name:'Tablet',icon:'📱',cat:'Klien',basic:true,mixed:true,ports:[],wifi:true,cost:120},
 {id:'phone',name:'Smartphone',icon:'📱',cat:'Klien',basic:true,mixed:true,ports:[],wifi:true,cost:100},
 {id:'tv',name:'Smart TV',icon:'📺',cat:'Smart Home',smart:true,mixed:true,ports:['ETH0'],wifi:true,cost:200},
 {id:'camera',name:'IP Camera',icon:'📷',cat:'Smart Home',smart:true,mixed:true,ports:['ETH0'],wifi:true,poeIn:true,cost:150},
 {id:'iot',name:'IoT Sensor',icon:'💡',cat:'Smart Home',smart:true,mixed:true,ports:[],wifi:true,cost:40},
 {id:'nvr',name:'NVR',icon:'🎥',cat:'Smart Home',smart:true,mixed:true,ports:['ETH0'],wifi:true,cost:180},
 {id:'modem',name:'Modem ISP',icon:'🌐',cat:'Jaringan',basic:true,smart:true,mixed:true,ports:['WAN','LAN1'],cost:110},
 {id:'firewall',name:'Firewall',icon:'🛡️',cat:'Jaringan',basic:true,mixed:true,ports:['WAN','LAN1','LAN2','DMZ'],cost:220},
 {id:'printer',name:'Network Printer',icon:'🖨️',cat:'Klien',basic:true,mixed:true,ports:['ETH0'],wifi:true,cost:140}
];
const registry=Object.fromEntries(catalog.map(d=>[d.id,d]));let mode='basic',activeProfile='free',state={nodes:[],edges:[],nextId:1,spent:0},selected=null,source=null,drag=null,booted=false;
// v0.40.72: budget Unified Canvas (mode tamu). Biaya dihitung dari state, jadi
// konsisten setelah reload: perangkat + kabel ($10) + perbaikan chaos ($25).
const NF4072_BUDGET_START=1500,NF4072_CABLE_COST=10;
// v0.59.00: dana darurat anti soft-lock. Budget boleh minus sampai -$50 untuk
// pembelian yang diperlukan agar misi bisa diselesaikan (kabel $10 dan repair
// Chaos $25) — dicatat di log. Tanpa ini, pemain dengan sisa $5 dan tanpa
// perangkat cadangan untuk dijual terkunci total. Pembelian perangkat tetap
// butuh budget penuh (harganya besar dan selalu bisa dijual kembali).
const NF4076_EMERGENCY_FLOOR=-50;
function canAfford(cost){return budgetNow()-cost>=NF4076_EMERGENCY_FLOOR}
// v0.59.00: angka dana darurat = sisa budget sebenarnya (budgetNow()).
// Rumus lama budgetNow()-cost menghitung biaya dua kali karena kedua
// pemanggil sudah memotong biaya kabel sebelum memanggil (push dulu).
// Kondisi: dana darurat dipakai bila budget SUDAH minus. Parameter
// cost dipertahankan demi kompatibilitas pemanggil.
function emergencyNote(cost){return budgetNow()<0?' ⚠ Dana darurat dipakai: budget $'+budgetNow().toLocaleString('en-US')+'. Jual perangkat untuk memulihkan budget.':''}
 // v0.59.00: wording akurat — dana darurat belum tentu habis; yang
 // melebihi batas adalah BIAYA terhadap sisa dana darurat (batas
 // −$50). Mis. budget −$45: sisa dana darurat $5, kabel $10
 // melewati batas. Bila sisa <= 0, "sudah habis" tetap akurat.
 function emergencyShort(cost,label){const rem=budgetNow()-NF4076_EMERGENCY_FLOOR;return rem>0?('Sisa dana darurat $'+rem.toLocaleString('en-US')+' — '+label+' $'+cost+' akan melewati batas −$50.'):'Dana darurat sudah habis (−$50).'}
function budgetNow(){return NF4072_BUDGET_START-state.nodes.reduce((s,n)=>s+(registry[n.type]?.cost||0),0)-state.edges.length*NF4072_CABLE_COST-(state.spent||0)}
function updateBudgetUI(){if(mode!=='mixed')return;const el=document.getElementById('budget');if(el)el.textContent='$'+budgetNow().toLocaleString('en-US');const lab=document.querySelector('.budget-stat small');if(lab)lab.textContent=(window.NetForgeLab?.active?.())?'BUDGET LAB':'BUDGET CANVAS';/* v0.40.92: label mengikuti mode aktif — sebelumnya selalu 'BUDGET CANVAS', padahal persist() memanggil fungsi ini tiap pembelian di Lab sehingga label 'BUDGET LAB' dari updateStats() langsung tertimpa. Dana darurat terlihat (lihat updateStats). */try{const _bs=document.querySelector('.budget-stat');if(_bs){const _b=budgetNow();if(_b<0){_bs.title='Dana darurat aktif: budget minus $'+Math.abs(_b).toLocaleString('en-US')+' (batas −$50). Kabel ($10) dan perbaikan Chaos ($25) boleh memakai dana darurat; pembelian perangkat butuh budget cukup. Jual perangkat untuk memulihkan budget.';_bs.style.borderColor='#e8a13c'}else{_bs.title='Dana darurat: budget boleh minus sampai −$50 untuk kabel ($10) dan perbaikan Chaos ($25). Pembelian perangkat butuh budget cukup.';_bs.style.borderColor=''}} }catch{}}
// v0.59.00: budgetNow/updateBudgetUI dipakai updateStats() klasik (skrip lain)
// lewat guard typeof — tanpa diekspos ke window, guard itu selalu gagal dan
// header menampilkan budget klasik $1.000 walau mode mixed (bug tampil di rilis sebelumnya).
window.budgetNow=budgetNow;window.updateBudgetUI=updateBudgetUI;
let chaosBrokenKey=null;
/* v0.40.92 B3: setiap kabel unified punya identitas stabil (e.uid) — dibuat saat kabel dibuat, dipertahankan lewat sanitizeGraph/importGraph/exportGraph (structuredClone). Sebelumnya identitas kabel HANYA pasangan endpoint+port, sehingga kabel BARU yang dibuat dengan endpoint dan port yang sama persis seperti kabel Chaos yang sudah dihapus/diperbaiki mewarisi kunci insiden lama dan chaosRestoreLive() mematikannya lagi (audit live v0.40.91 B3: kabel Laptop↔Switch baru ikut LINK DOWN setelah "↩ Misi"). Token sesi mencegah tabrakan uid antar-sesi; kabel lama dari simpanan sebelum patch tidak punya uid dan memakai kunci port lama sebagai fallback. nf4092EnsureEdgeUids() juga membuang flag chaos pada kabel yang sedang UP (insidennya sudah berakhir — bila tidak dibuang, menonaktifkan kabel itu secara manual kelak akan terbaca sebagai insiden Chaos). */
const NF4092_EDGE_SESSION=Date.now().toString(36)+Math.floor(Math.random()*46656).toString(36);let nf4092EdgeUidCounter=0;function nf4092EdgeUid(){return 'e'+(++nf4092EdgeUidCounter)+'-'+NF4092_EDGE_SESSION}
function nf4092EnsureEdgeUids(edges){if(!Array.isArray(edges))return edges;for(const e of edges){if(!e)continue;if(!e.uid)e.uid=nf4092EdgeUid();if(e.chaos&&!e.disabled){e.chaos=false;e.chaosAnimal='';}}return edges}
const chaosEdgeKey=e=>e&&e.uid?('uid:'+e.uid):[e.a,e.b,e.portA||'',e.portB||''].join('|');
/* v0.40.92: insiden Chaos ditandai DI KABELNYA (e.chaos + e.chaosAnimal), bukan hanya di memori (chaosBrokenKey). Akar kegagalan v0.40.90 (audit live v0.40.90 butir 1): (a) snapshot misi ditulis saat enter() — SEBELUM Chaos dipicu di Lab — sehingga tidak membawa chaosKey DAN graf snapshot berisi kabel LINK UP; leave() memulihkan kabel UP + penanda hilang. (b) switchProfile() selalu mengosongkan chaosBrokenKey dan insiden tidak pernah dipersist, sehingga pindah misi bolak-balik menghapus insiden walau kabel tetap LINK DOWN (probe-91-chaos-live.js mereproduksi keduanya di v0.40.90). Flag di kabel selamat melewati importGraph/switchProfile/persist (ikut tersimpan di localStorage sebagai bagian edge), sehingga insiden dapat diturunkan kembali dari graf itu sendiri. chaosEdge() = kabel insiden aktif (kunci dulu, lalu flag); rebindChaosFromEdges() = sinkronkan kunci dari flag setiap kali graf dimuat. */
function chaosEdge(){let e=chaosBrokenKey?state.edges.find(x=>chaosEdgeKey(x)===chaosBrokenKey):null;if(e&&e.disabled)return e;return state.edges.find(x=>x.chaos&&x.disabled)||null}
function rebindChaosFromEdges(){const e=state.edges.find(x=>x.chaos&&x.disabled);if(e){chaosBrokenKey=chaosEdgeKey(e);return true}if(chaosBrokenKey&&!state.edges.some(x=>chaosEdgeKey(x)===chaosBrokenKey))chaosBrokenKey=null;return false}
let inspectorVisible=false,lastClickId=null,lastClickAt=0;
// v0.40.28: every mission owns an independent topology snapshot.
// The previous shared canvas key remains untouched as a migration backup.
const PROFILE_PREFIX='netforge.universal.mission.v2.';
const emptyGraph=()=>({nodes:[],edges:[],nextId:1,spent:0});
const profileKey=p=>PROFILE_PREFIX+p;
const sanitizeGraph=raw=>{
 if(!raw||!Array.isArray(raw.nodes)||!Array.isArray(raw.edges))return emptyGraph();
 // v0.59.00: clamp posisi saat muat — simpanan lama bisa menyimpan node di
 // y=90 yang terpotong di tepi bawah (kartu berpusat di titiknya, setengah
 // kartu ~60px berada di bawah titik). y dibatasi 12..84 agar kartu utuh.
 const nodes=raw.nodes.filter(n=>n&&registry[n.type]&&Number.isFinite(n.x)&&Number.isFinite(n.y)&&Number.isFinite(Number(n.id))).map(n=>({...n,x:Math.max(8,Math.min(92,n.x)),y:Math.max(12,Math.min(84,n.y))})).slice(0,80);
 const ids=new Set(nodes.map(n=>String(n.id)));
 const edges=nf4092EnsureEdgeUids(raw.edges.filter(e=>e&&ids.has(String(e.a))&&ids.has(String(e.b))&&String(e.a)!==String(e.b)).map(e=>({...e})).slice(0,150));
 const maxId=nodes.reduce((m,n)=>Math.max(m,Number(n.id)||0),0);
 return {nodes,edges,nextId:Math.max(maxId+1,Number(raw.nextId)||1),spent:Math.max(0,Number(raw.spent)||0)};
};
function loadProfile(profile){
 try{
  let saved=localStorage.getItem(profileKey(profile));
  // One-time backward-compatible migration: shared v0.40.28 topology belongs to Basics.
  // Never delete the old key, so rollback still has the original topology.
  if(saved===null&&profile==='basics'){
   const legacy=localStorage.getItem(KEY);
   if(legacy!==null){saved=legacy;localStorage.setItem(profileKey('basics'),legacy)}
  }
  return sanitizeGraph(saved===null?null:JSON.parse(saved));
 }catch{return emptyGraph()}
}
const nf4023Undo=[],nf4023Redo=[];let nf4023Baseline=null,nf4023Restoring=false;
const nf4023HistoryEvent=()=>window.dispatchEvent(new CustomEvent('netforge:unified-history-state',{detail:{undo:nf4023Undo.length,redo:nf4023Redo.length,profile:activeProfile}}));
const nf4023ResetHistory=()=>{nf4023Undo.length=0;nf4023Redo.length=0;nf4023Baseline=JSON.stringify(state);nf4023HistoryEvent();};
/* v0.40.92: explicitIP — hanya alamat yang dikonfigurasi eksplisit (IP
   statis, atau lease DHCP yang benar-benar diberikan) yang bisa menimbulkan
   konflik. Router tanpa IP eksplisit memakai default 192.168.10.1 bersama —
   itu BUKAN konflik, dan perangkat tanpa kabel aktif tidak dihitung. */
function explicitIP(n){if(!n)return null;if(n.type==='router')return validIP(n.ip||'')?n.ip:null;if(addressMode(n)==='static')return validIP(n.ip||'')?n.ip:null;return dhcpLease(n)}
function nodeHasActiveLink(n){return state.edges.some(e=>(e.a===n.id||e.b===n.id)&&linkActive(e))}
/* v0.40.92: spreadNodes — geser node yang bertumpuk (jarak minimum ~15%
   lebar dan ~14% tinggi canvas, sesuai lebar kartu node ~118px) saat state
   dimuat, saat ganti misi, saat tambah perangkat, setelah drag, dan setelah
   undo/redo. Ambang lama (11%/12%) sama dengan lebar kartu sehingga node
   masih tampak menutupi; dan pemanggilan lama spreadNodes(drag.id)
   melewatkan pasangan yang melibatkan node yang digeser. anchorId = node
   yang diam (node yang baru digeser); node lain yang bergerak menjauhinya. */
function spreadNodes(exceptId,anchorId){let changed=false;for(let pass=0;pass<8;pass++){let moved=false;for(let i=0;i<state.nodes.length;i++){const a=state.nodes[i];for(let j=i+1;j<state.nodes.length;j++){const b=state.nodes[j];if(a.id===exceptId||b.id===exceptId)continue;if(Math.abs(a.x-b.x)<15&&Math.abs(a.y-b.y)<24){let t;if(a.id===anchorId)t=b;else if(b.id===anchorId)t=a;else t=b;t.x=t.x+16>92?9:t.x+16;if(Math.abs(a.x-b.x)<15&&Math.abs(a.y-b.y)<24)t.y=t.y+25>84?14:t.y+25;moved=true;changed=true}}}if(!moved)break}return changed}
const parse=()=>{activeProfile='basics';state=loadProfile('basics');spreadNodes();nf4023ResetHistory();};
const persist=()=>{const now=JSON.stringify(state);if(!nf4023Restoring&&nf4023Baseline!==null&&now!==nf4023Baseline){nf4023Undo.push(nf4023Baseline);if(nf4023Undo.length>80)nf4023Undo.shift();nf4023Redo.length=0;nf4023HistoryEvent();}nf4023Baseline=now;const _labActive=(()=>{try{return !!window.NetForgeLab?.active?.()}catch{return false}})();if(!(_labActive&&activeProfile!=='free')){try{localStorage.setItem(profileKey(activeProfile),now)}catch{}};updateBudgetUI();notifyGraphChange()};
function nf4023Travel(kind){const from=kind==='undo'?nf4023Undo:nf4023Redo,to=kind==='undo'?nf4023Redo:nf4023Undo;if(!from.length){msg('Tidak ada perubahan yang dapat '+(kind==='undo'?'dibatalkan.':'diulangi.'));return false}const prev=from.pop();to.push(JSON.stringify(state));nf4023Restoring=true;try{state=sanitizeGraph(JSON.parse(prev));spreadNodes();selected=null;source=null;inspectorVisible=false;rebindChaosFromEdges();persist();draw();msg(kind==='undo'?'↶ Perubahan Unified Canvas dibatalkan.':'↷ Perubahan Unified Canvas diulangi.');return true}finally{nf4023Restoring=false;nf4023HistoryEvent()}}
function switchProfile(profile){
 if(activeProfile===profile){if(spreadNodes()){persist();draw()}return false;}
 // Preserve the prior mission exactly before loading a different mission.
 try{localStorage.setItem(profileKey(activeProfile),JSON.stringify(state))}catch{}
 state=loadProfile(profile);activeProfile=profile;spreadNodes();try{localStorage.setItem('netforge.universal.active-profile.v1',profile)}catch{}nf4023ResetHistory();chaosBrokenKey=null;rebindChaosFromEdges();/* v0.40.92: profil yang dimuat bisa membawa insiden Chaos tersimpan (flag e.chaos di kabelnya) — sebelumnya kunci selalu dikosongkan di sini, sehingga insiden hilang saat pindah misi bolak-balik (audit live v0.40.90 butir 1). */
 selected=null;source=null;drag=null;inspectorVisible=false;
 const tool=$('nf400Tool');if(tool)tool.value='move';
 draw();notifyGraphChange();
 return true;
}

const node=id=>state.nodes.find(n=>String(n.id)===String(id));const used=(id,port)=>state.edges.some(e=>!e.disabled&&((String(e.a)===String(id)&&e.portA===port)||(String(e.b)===String(id)&&e.portB===port)));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const point=e=>{const r=$('nf400Canvas').getBoundingClientRect(),v=window.NetForgeUnifiedViewport;const p=v?.screenToPercent?.(e.clientX,e.clientY)||{x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100};return {x:clamp(p.x,8,92),y:clamp(p.y,12,84)}};
const msg=s=>{const out=$('nf400Status');if(out)out.textContent=s;const list=$('nf4016Log');if(list){const li=document.createElement('li');const time=document.createElement('time');time.textContent=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});const content=document.createElement('span');content.textContent=String(s);li.append(time,content);list.prepend(li);while(list.children.length>80)list.lastElementChild.remove();try{list.scrollTop=0}catch(_e){};}};
let assessmentPending=false;
function notifyGraphChange(){if(assessmentPending)return;assessmentPending=true;queueMicrotask(()=>{assessmentPending=false;window.dispatchEvent(new CustomEvent('netforge:unified-graph-changed',{detail:{profile:activeProfile}}));});} 
// v0.40.28: distinct vector pseudo-3D device models; no external assets or scripts.
function deviceArt(kind){
 const common='viewBox="0 0 100 76" xmlns="http://www.w3.org/2000/svg" focusable="false"';
 const shell=(inner)=>'<svg '+common+' class="nf4020-svg nf4020-art-'+kind+'">'+inner+'</svg>';
 const chassis=(face='#246383')=>'<path d="M12 34 L68 34 L89 44 L33 45 Z" fill="#5394ae"/><path d="M12 34 L33 45 L33 61 L12 48 Z" fill="#0a2c45"/><path d="M33 45 L89 44 L89 59 L33 61 Z" fill="'+face+'"/><path d="M35 48 L86 47" stroke="#9fdbee" stroke-width="1.2" opacity=".7"/>';
 const led=(x,y,c='#50e6b4')=>'<circle cx="'+x+'" cy="'+y+'" r="2" fill="'+c+'" class="nf4020-led-dot"/>';
 const screen=(x,y,w,h)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="#061e35" stroke="#9ac9df" stroke-width="2"/><rect x="'+(x+4)+'" y="'+(y+4)+'" width="'+(w-8)+'" height="'+(h-8)+'" rx="1" class="nf4020-screen" fill="#174e6d"/><path d="M'+(x+7)+' '+(y+h-8)+' L'+(x+w-7)+' '+(y+8)+'" stroke="#9ff9f1" stroke-width="2" opacity=".25"/>';
 const wifi='<path d="M49 16 Q59 7 69 16 M53 21 Q59 15 65 21" fill="none" stroke="#7aefff" stroke-width="2.8" stroke-linecap="round"/><circle cx="59" cy="26" r="2" fill="#a8fbff"/>';
 switch(kind){
 case 'router':return shell('<path d="M20 32 L16 7" stroke="#9bb6cb" stroke-width="3" stroke-linecap="round"/><path d="M80 34 L87 5" stroke="#9bb6cb" stroke-width="3" stroke-linecap="round"/>'+chassis()+'<path d="M38 52 H67" stroke="#0c283d" stroke-width="3"/>'+[39,47,55,63].map(x=>led(x,56)).join('')+wifi);
 case 'switch':return shell(chassis('#1d566f')+[37,47,57,67,77].map(x=>'<rect x="'+x+'" y="50" width="7" height="6" rx="1" fill="#051727" stroke="#80cce9" stroke-width=".75"/>').join('')+led(82,55));
 case 'ap':return shell('<ellipse cx="49" cy="46" rx="39" ry="17" fill="#0d2840"/><ellipse cx="48" cy="38" rx="38" ry="16" fill="#3c859c"/><ellipse cx="48" cy="35" rx="29" ry="10" fill="#80bacc"/>'+led(57,37)+wifi);
 case 'pc':return shell(screen(13,7,60,43)+'<path d="M45 51 L45 60 M34 62 H57" stroke="#8baac0" stroke-width="4" stroke-linecap="round"/><path d="M77 24 L93 28 L93 62 L77 57 Z" fill="#1d5373" stroke="#83b3c7" stroke-width="2"/>'+led(85,52));
 case 'laptop':return shell('<path d="M18 9 L70 8 L73 48 L20 49 Z" fill="#102f4d" stroke="#93cada" stroke-width="2"/>'+screen(23,13,44,30)+'<path d="M17 49 L74 48 L88 62 L4 64 Z" fill="#598da7" stroke="#b5dfef" stroke-width="1.5"/><path d="M42 52 H62 L66 57 H36 Z" fill="#163f5c"/>');
 case 'tablet':return shell('<path d="M17 14 L74 7 L83 59 L27 67 Z" fill="#142f4c" stroke="#9cb6ce" stroke-width="3"/><path d="M23 20 L69 14 L76 53 L30 60 Z" class="nf4020-screen" fill="#1d6088"/><circle cx="78" cy="61" r="2" fill="#9dc8df"/>');
 case 'phone':return shell('<path d="M33 4 L67 11 L62 71 L28 62 Z" fill="#0c263d" stroke="#96c1d9" stroke-width="2.6"/><path d="M36 12 L63 17 L59 61 L32 57 Z" class="nf4020-screen" fill="#1b5b89"/><path d="M45 10 L55 13" stroke="#d3e6ee" stroke-width="2"/>');
 case 'tv':return shell(screen(7,7,86,47)+'<path d="M45 56 L45 63 M30 64 L65 64" stroke="#9ac8d8" stroke-width="4" stroke-linecap="round"/>');
 case 'camera':return shell('<path d="M21 36 L67 22 L81 34 L34 49 Z" fill="#77b7cb"/><path d="M34 49 L81 34 L79 52 L34 65 Z" fill="#245676"/><path d="M21 36 L34 49 L34 65 L21 52 Z" fill="#16405e"/><circle cx="30" cy="46" r="10" fill="#092539" stroke="#a5e8f3" stroke-width="3"/><circle cx="30" cy="46" r="5" fill="#268cb8"/><path d="M55 56 L66 67" stroke="#7ca4b7" stroke-width="5"/>');
 case 'nvr':return shell(chassis('#1c4c63')+'<rect x="40" y="50" width="32" height="6" rx="2" fill="#0b2537"/>'+led(79,54)+led(84,54,'#f0bc66'));
 case 'server':return shell('<path d="M24 8 L74 8 L87 18 L37 18 Z" fill="#5795b0"/><path d="M37 18 L87 18 L87 66 L37 66 Z" fill="#1d4c6b"/><path d="M24 8 L37 18 L37 66 L24 55 Z" fill="#0a293e"/>'+[27,39,51].map(y=>'<rect x="44" y="'+y+'" width="35" height="8" rx="1" fill="#0b2437" stroke="#5694a9"/>'+led(72,y+4)).join(''));
 case 'iot':return shell('<path d="M36 17 L64 17 L75 30 L75 56 L59 66 L35 57 L26 40 Z" fill="#2c6785" stroke="#84b8ce" stroke-width="2"/><circle cx="50" cy="39" r="16" fill="#09354a" stroke="#7be4d9" stroke-width="2"/><path d="M42 40 L48 46 L59 32" fill="none" stroke="#84eabb" stroke-width="4"/>'+led(62,55));
 case 'modem':return shell(chassis('#165a72')+'<circle cx="50" cy="24" r="12" fill="#0b2d47" stroke="#5ce1ff" stroke-width="2"/><ellipse cx="50" cy="24" rx="5.5" ry="11.5" fill="none" stroke="#5ce1ff" stroke-width="1.4"/><path d="M38 24 H62" stroke="#5ce1ff" stroke-width="1.4"/>'+led(40,54,'#34d399')+led(48,54,'#38bdf8')+led(56,54,'#38bdf8'));
 case 'firewall':return shell(chassis('#6b1d33')+'<path d="M50 10 L66 17 V31 C66 40 58 46 50 49 C42 46 34 40 34 31 V17 Z" fill="#b91c3c" stroke="#fda4af" stroke-width="2"/><path d="M44 29 L49 34 L58 23" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+led(40,55,'#fb7185')+led(49,55,'#fbbf24')+led(58,55,'#34d399'));
 case 'printer':return shell('<rect x="28" y="10" width="44" height="16" rx="2" fill="#e2f1ff" stroke="#7dd3fc" stroke-width="1.6"/>'+chassis('#235473')+'<rect x="38" y="54" width="38" height="14" rx="2" fill="#e2f1ff" stroke="#7dd3fc" stroke-width="1.4"/><path d="M44 59 H70 M44 63 H64" stroke="#3b82f6" stroke-width="1.6"/>'+led(81,51,'#34d399'));
 default:return shell(chassis()+wifi);
 }
}
function draw(){const canvas=$('nf400Canvas');if(!canvas)return;canvas.hidden=mode!=='mixed';const layer=$('nf400Nodes'),wire=$('nf400Wires');wire.replaceChildren();/* v0.40.92: layer node TIDAK lagi di-replaceChildren — elemen tombol dipakai ulang agar klik ganda (dblclick) mengenai elemen yang sama dan konfigurasi bisa terbuka. */
 let _ei=-1;for(const e of state.edges){_ei++;const a=node(e.a),b=node(e.b);if(!a||!b)continue;/* v0.40.92: garis hit dipendekkan di kedua ujung (inset 72px layar) agar bentang tengahnya tidak tertutup kartu node (124x~119px, pointer-events:auto) — garis dilaporkan "covered" oleh kartu. Garis terlihat tetap ujung-ke-ujung; hanya area klik yang dipendekkan ke bentang bebas antar kartu. */const _cw=canvas.clientWidth||1000,_ch=canvas.clientHeight||500,_dx=(b.x-a.x)/100*_cw,_dy=(b.y-a.y)/100*_ch,_len=Math.hypot(_dx,_dy)||1,_in=Math.max(0,Math.min(72,_len/2-8)),_ux=_dx/_len,_uy=_dy/_len,_hx1=a.x+_ux*_in/_cw*100,_hy1=a.y+_uy*_in/_ch*100,_hx2=b.x-_ux*_in/_cw*100,_hy2=b.y-_uy*_in/_ch*100;const hit=document.createElementNS('http://www.w3.org/2000/svg','line');hit.setAttribute('x1',_hx1);hit.setAttribute('y1',_hy1);hit.setAttribute('x2',_hx2);hit.setAttribute('y2',_hy2);hit.setAttribute('class','nf400-wire-hit');hit.setAttribute('data-edge',String(_ei));hit.setAttribute('aria-label','Kabel '+(a.name||a.type)+' ke '+(b.name||b.type));wire.append(hit);const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',b.x);line.setAttribute('y2',b.y);line.setAttribute('class','nf400-wire '+e.medium+(linkActive(e)?' nf4017-live':' nf4017-down'));line.setAttribute('data-medium',e.medium);line.setAttribute('data-edge',String(_ei));wire.append(line)}
 const _kept=new Map();for(const _el of layer.children)if(_el.dataset&&_el.dataset.node!=null)_kept.set(String(_el.dataset.node),_el);
 for(const n of state.nodes){const d=registry[n.type];if(!d)continue;let b=_kept.get(String(n.id));if(b)_kept.delete(String(n.id));else{b=document.createElement('button');b.type='button';layer.append(b)}b.className='nf400-node nf4017-device nf4017-type-'+n.type+(state.edges.some(e=>(e.a===n.id||e.b===n.id)&&linkActive(e))?' nf4017-online':' nf4017-offline')+(selected===n.id||source===n.id?' sel':'');b.dataset.node=n.id;b.style.left=n.x+'%';b.style.top=n.y+'%';const _jackRow=b.querySelector('.nf4033-jack-row');b.innerHTML='<span class="nf4017-chassis"><span class="nf4020-asset" aria-hidden="true">'+deviceArt(n.type)+'</span><span class="nf4017-led" aria-hidden="true"></span></span><span class="nf4017-device-name">'+d.name+'</span><em>#'+n.id+' · '+(state.edges.some(e=>(e.a===n.id||e.b===n.id)&&linkActive(e))?'LINK UP':'OFFLINE')+'</em><span class="nf400-node-gear" role="button" tabindex="0" title="Konfigurasi" aria-label="Konfigurasi '+d.name+' #'+n.id+'">⚙</span>';if(_jackRow)b.appendChild(_jackRow);}
 for(const _stale of _kept.values())_stale.remove();
 $('nf400Empty').hidden=!!state.nodes.length;$('nf400Count').textContent=state.nodes.length+' perangkat · '+state.edges.length+' koneksi';
 for(const id of ['nf401Source','nf401Target']){const sel=$(id);if(!sel)continue;const prev=sel.value;sel.replaceChildren();for(const n of state.nodes){const o=document.createElement('option');o.value=n.id;o.textContent=(n.name||registry[n.type].name)+' #'+n.id;sel.append(o)}if([...sel.options].some(o=>o.value===prev))sel.value=prev;else if(id==='nf401Target'&&sel.options.length>1)sel.selectedIndex=1}inspector();}
function hasWifi(n){return !!(n&&(registry[n.type]?.wifi||n.type==='pc'&&n.wifiAdapter))}
function available(n,medium){const d=registry[n.type];if(medium==='wifi')return hasWifi(n)?['RADIO']:[];return d.ports.filter(p=>!used(n.id,p)&& (medium==='fiber'?nf4031Port(n,p).kind==='fiber':nf4031Port(n,p).kind==='rj45'))}
// v0.40.38 physical port metadata. Logical speed is negotiated for copper.
function nf4031Port(n,p){const t=n.type,pn=String(p||'');if(pn==='RADIO')return {kind:'wifi',speed:0,power:false};if(/^SFP/i.test(pn))return {kind:'fiber',speed:1000,power:false};if(t==='router'&&pn==='WAN')return {kind:'rj45',speed:1000,power:false,role:'WAN'};if(t==='switch'&&['LAN7','LAN8'].includes(pn))return {kind:'rj45',speed:1000,power:true};if(t==='router'&&['LAN3','LAN4'].includes(pn))return {kind:'rj45',speed:100,power:false};return {kind:'rj45',speed:1000,power:false}}
function nf4031Compatible(a,pa,b,pb,medium,strict=false){const x=nf4031Port(a,pa),y=nf4031Port(b,pb);if(medium==='wifi')return {ok:x.kind==='wifi'&&y.kind==='wifi',reason:'Kedua perangkat membutuhkan adaptor Wi-Fi.'};if(medium==='fiber')return {ok:x.kind==='fiber'&&y.kind==='fiber',reason:'Fiber memerlukan port SFP pada kedua ujung.'};if(x.kind!=='rj45'||y.kind!=='rj45')return {ok:false,reason:'RJ45 tidak dapat langsung dipasang pada port Fiber/SFP.'};if(medium==='poe'&&!(x.power||y.power))return {ok:false,reason:'PoE membutuhkan port switch berkemampuan PoE.'};if(medium==='poe'&&strict&&!(x.power&&registry[b.type]?.poeIn||y.power&&registry[a.type]?.poeIn))return {ok:false,reason:'Perangkat penerima tidak mendukung PoE.'};return {ok:true,reason:x.speed!==y.speed?'Auto-negotiation '+Math.min(x.speed,y.speed)+' Mbps':'Port kompatibel'};}
function nf4031Difficulty(){const txt=String(document.getElementById('difficultyLabel')?.textContent||'EASY').toLowerCase();return txt.includes('hard')?'hard':txt.includes('normal')?'normal':'easy'}
function nf4031PortDialog(a,b,medium,done){const old=document.getElementById('nf4031PortOverlay');old?.remove();const choicesA=available(a,medium),choicesB=available(b,medium);const overlay=document.createElement('div');overlay.id='nf4031PortOverlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Pilih interface kabel');overlay.innerHTML='<div class="nf4031-port-card"><div class="nf4031-port-head"><strong>🔌 Pilih port fisik</strong><button type="button" id="nf4031Cancel">✕</button></div><p id="nf4031PortDesc"></p><div class="nf4031-port-fields"><label>Port sumber <select id="nf4031SourcePort"></select></label><label>Port tujuan <select id="nf4031DestPort"></select></label></div><p id="nf4031PortStatus" aria-live="polite"></p><div class="nf4031-port-actions"><button type="button" id="nf4031Confirm" class="primary">Hubungkan port</button><button type="button" id="nf4031Dismiss">Batal</button></div></div>';document.body.append(overlay);
const qa=overlay.querySelector('#nf4031SourcePort'),qb=overlay.querySelector('#nf4031DestPort'),st=overlay.querySelector('#nf4031PortStatus'),confirm=overlay.querySelector('#nf4031Confirm');overlay.querySelector('#nf4031PortDesc').textContent=(a.name||a.type)+' #'+a.id+' → '+(b.name||b.type)+' #'+b.id+' · '+medium.toUpperCase()+' · Mode '+nf4031Difficulty().toUpperCase();
function populate(sel,n,arr){for(const p of arr){const x=nf4031Port(n,p),o=document.createElement('option');o.value=p;o.textContent=p+' · '+(x.kind==='fiber'?'SFP/Fiber':x.kind==='wifi'?'Wireless':x.speed+' Mbps'+(x.power?' · PoE':''));sel.append(o)}}populate(qa,a,choicesA);populate(qb,b,choicesB);
function check(){const r=nf4031Compatible(a,qa.value,b,qb.value,medium,nf4031Difficulty()==='hard');confirm.disabled=!r.ok;st.textContent=(r.ok?'✓ ':'⚠ ')+r.reason;st.style.color=r.ok?'#7cf9d1':'#ffc789'}qa.addEventListener('change',check);qb.addEventListener('change',check);check();
let closed=false;function close(){if(closed)return;closed=true;overlay.remove();document.removeEventListener('keydown',key)}function key(e){if(e.key==='Escape')close()}document.addEventListener('keydown',key);overlay.querySelector('#nf4031Cancel').onclick=close;overlay.querySelector('#nf4031Dismiss').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close()});confirm.addEventListener('click',()=>{if(confirm.disabled)return;const p=qa.value,q=qb.value;close();done(p,q)});qa.focus();}
function pairValid(a,b,medium){const da=registry[a.type],db=registry[b.type];if(medium==='fiber')return available(a,medium).length>0&&available(b,medium).length>0;if(medium==='wifi')return hasWifi(a)&&hasWifi(b)&&(a.type==='ap'||b.type==='ap'||a.type==='router'||b.type==='router');if(medium==='poe')return (da.poe&&db.poeIn)||(db.poe&&da.poeIn);return !!(da.ports.length&&db.ports.length)}
const DEFAULT_WIFI={ssid:'NETFORGE-LAB',password:'NetForge123',band:'2.4'};
function wifiProfile(n){return {ssid:String(n.wifiSSID||DEFAULT_WIFI.ssid),password:String(n.wifiPassword||DEFAULT_WIFI.password),band:String(n.wifiBand||DEFAULT_WIFI.band)}}
function wifiStatus(a,b){if(!pairValid(a,b,'wifi'))return {ok:false,reason:'Perangkat membutuhkan radio Wi-Fi atau adaptor. Hubungkan ke Router/AP.'};const ap=['router','ap'].includes(a.type)?a:b;const client=ap===a?b:a;const network=wifiProfile(ap),station=wifiProfile(client);if(!ap.wifiEnabled&&ap.wifiEnabled!==undefined)return {ok:false,reason:'Radio Router/AP dinonaktifkan.'};if(network.ssid!==station.ssid)return {ok:false,reason:'SSID berbeda. Periksa nama jaringan Wi-Fi.'};if(network.password!==station.password)return {ok:false,reason:'Password Wi-Fi tidak sesuai.'};if(network.band!==station.band)return {ok:false,reason:'Band Wi-Fi berbeda. Samakan 2.4 GHz atau 5 GHz.'};return {ok:true,reason:'Asosiasi Wi-Fi berhasil.'}}
function linkReason(e){if(e.disabled)return 'Link dinonaktifkan untuk simulasi kegagalan.';const a=node(e.a),b=node(e.b);if(!a||!b)return 'Perangkat ujung kabel tidak ditemukan.';if(!pairValid(a,b,e.medium))return 'Jenis media tidak kompatibel atau adaptor Wi-Fi tidak tersedia.';if(e.portA&&e.portB){const c=nf4031Compatible(a,e.portA,b,e.portB,e.medium,nf4031Difficulty()==='hard');if(!c.ok)return c.reason;}if(e.medium==='wifi'){const w=wifiStatus(a,b);if(!w.ok)return w.reason}return null}
function linkActive(e){return !linkReason(e)}
function connect(a,b){const medium=$('nf400Medium').value;if(a.id===b.id)return msg('Iga: Pilih dua perangkat berbeda.');if(state.edges.some(e=>!e.disabled&&((e.a===a.id&&e.b===b.id)||(e.a===b.id&&e.b===a.id))))return msg('Iga: Pasangan perangkat sudah terhubung. Putuskan koneksi terlebih dahulu.');if(state.edges.some(e=>e.disabled&&((e.a===a.id&&e.b===b.id)||(e.a===b.id&&e.b===a.id))))return msg('Iga: Pasangan ini sudah punya kabel yang sedang rusak (LINK DOWN). Aktifkan kembali lewat panel kabel, atau hapus kabelnya lalu sambung ulang.');if(!pairValid(a,b,medium))return msg('Iga: Media '+medium+' tidak kompatibel atau port belum tersedia.');if(medium==='wifi'){const w=wifiStatus(a,b);if(!w.ok)return msg('Iga: '+w.reason)}
const pa=available(a,medium),pb=available(b,medium);if(!pa.length||!pb.length)return msg('Iga: Port fisik habis atau tidak tersedia.');function commit(x,y){const c=nf4031Compatible(a,x,b,y,medium,nf4031Difficulty()==='hard');if(!c.ok)return msg('⚠ '+c.reason);if(!canAfford(NF4072_CABLE_COST))return msg('Iga: Budget tidak cukup untuk kabel ($'+NF4072_CABLE_COST+'). Sisa budget $'+budgetNow().toLocaleString('en-US')+'. '+emergencyShort(NF4072_CABLE_COST,'kabel')+' Jual perangkat untuk memulihkan budget.');state.edges.push({uid:nf4092EdgeUid(),a:a.id,b:b.id,medium,portA:x,portB:y});const _em=emergencyNote(NF4072_CABLE_COST);persist();draw();msg('✓ '+registry[a.type].name+':'+x+' ↔ '+registry[b.type].name+':'+y+' ('+medium+'). '+c.reason+(_em||(' Sisa budget $'+budgetNow().toLocaleString('en-US')+'.')));window.dispatchEvent(new CustomEvent('netforge:link-created',{detail:{from:a.id,to:b.id}}));}
if(nf4031Difficulty()==='easy'){for(const x of pa)for(const y of pb){if(nf4031Compatible(a,x,b,y,medium).ok)return commit(x,y)}return msg('⚠ Tidak ditemukan pasangan port yang kompatibel.')}nf4031PortDialog(a,b,medium,commit);}

function add(type,p){const d=registry[type];if(!d||!d.mixed)return;if(budgetNow()<(d.cost||0)){msg('Iga: Budget tidak cukup untuk '+(d.name||type)+' ($'+(d.cost||0)+'). Sisa budget $'+budgetNow().toLocaleString('en-US')+'. Hapus perangkat lain atau kosongkan canvas. Dana darurat (−$50) hanya berlaku untuk kabel ($10) dan perbaikan Chaos ($25), bukan pembelian perangkat.');return}const id=state.nextId++;state.nodes.push({id,type,x:p?.x??clamp(16+(state.nodes.length%4)*21,9,90),y:p?.y??clamp(18+Math.floor(state.nodes.length/4)*26,12,84),name:d.name,ip:'',wifiSSID:DEFAULT_WIFI.ssid,wifiPassword:DEFAULT_WIFI.password,wifiBand:DEFAULT_WIFI.band,wifiEnabled:true});spreadNodes(id);selected=id;source=null;inspectorVisible=false;persist();draw();msg('✓ '+d.name+' ditambahkan ke workspace aktif ($'+(d.cost||0)+'). Geser perangkat untuk mengubah posisi.');}
function deleteSelected(){const n=node(selected);if(!n){msg('Iga: Pilih satu perangkat di canvas terlebih dahulu.');return false}const count=state.edges.filter(e=>e.a===n.id||e.b===n.id).length;state.nodes=state.nodes.filter(v=>v.id!==n.id);state.edges=state.edges.filter(e=>e.a!==n.id&&e.b!==n.id);if(chaosBrokenKey&&!state.edges.some(e=>chaosEdgeKey(e)===chaosBrokenKey))chaosBrokenKey=null;selected=null;source=null;drag=null;inspectorVisible=false;persist();draw();msg('✓ '+(n.name||registry[n.type].name)+' dihapus bersama '+count+' kabel terkait. Perangkat lain tetap ada.');return true}
function act(n){const tool=$('nf400Tool').value;const now=Date.now();const doubleSelected=lastClickId===n.id&&now-lastClickAt<550;lastClickId=n.id;lastClickAt=now;selected=n.id;inspectorVisible=doubleSelected;if(tool==='delete'){deleteSelected();return}if(mode==='mixed'){try{if(window.NetForgeActionPanel&&window.NetForgeActionPanel.sync)window.NetForgeActionPanel.sync(n.id)}catch(e){}}
 if(tool==='disconnect'||tool==='connect'){
  // v0.59.00: sumber "Hubungkan" dari panel TERKUNCI (nf4019
  // connectSource). Dulu klik sumber di canvas (mengikuti instruksi
  // Iga "klik perangkat pertama") melakukan self-connect ("Pilih
  // dua perangkat berbeda.") lalu menghapus sumber pending,
  // sehingga klik tujuan berikutnya hanya menjadi sumber baru dan
  // kabel tidak pernah tercipta — tanpa pesan. Kini klik pada sumber
  // yang terkunci hanya menegaskan kunci; klik tujuan langsung
  // memakai sumber terkunci (connect/disconnect).
  const _locked=window.NetForgeActionPanel?.getLockedSource?.();
  if(_locked!=null&&String(n.id)===String(_locked)){source=_locked;draw();msg('Sumber terkunci: '+((node(_locked)?.name)||'perangkat')+' #'+_locked+'. Klik perangkat tujuan pada canvas.');return}
  if(_locked!=null)source=_locked;
  if(source===null){source=n.id;draw();msg('Pilih perangkat tujuan.');return}const a=node(source);source=null;if(!a){draw();return}if(tool==='connect')connect(a,n);else{const count=state.edges.length;state.edges=state.edges.filter(e=>!((e.a===a.id&&e.b===n.id)||(e.a===n.id&&e.b===a.id)));const _removed=count>state.edges.length;if(chaosBrokenKey&&!state.edges.some(e=>chaosEdgeKey(e)===chaosBrokenKey))chaosBrokenKey=null;/* v0.40.92 B3: "Putuskan" juga membersihkan kunci insiden bila kabel Chaos ikut terputus — sebelumnya hanya deleteSelected() yang melakukannya, sehingga kunci basi bisa membangkitkan insiden dari graf yang dipulihkan. */persist();draw();msg(_removed?'Koneksi berhasil diputus.':'Tidak ada sambungan pada pasangan tersebut.');/* v0.40.92: gelembung Iga juga segar setelah Putuskan berhasil — sebelumnya hanya msg()/status yang diperbarui, sehingga gelembung mempertahankan pesan lama (mis. pesan Kosongkan) walau kabel sudah diputus (audit live v0.40.87 butir 3). say() dipanggil SETELAH persist() agar tidak ditimpa refresh() coach yang dipicu perubahan graf (refresh itu jalan sinkron di persist, dan refresh berikutnya tidak menulis apa-apa karena wasComplete sudah false). */if(_removed){try{if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay('Koneksi berhasil diputus.','think')}catch(_e){}}/* v0.40.92: pemutusan BERHASIL dari alur panel juga kembali ke Pindah di sini — sebelumnya reset hanya hidup di handler canvas nf4019, yang kembali dini bila body kehilangan kelas nf400-mixed (atau klik tujuan bukan node), sehingga mode Putuskan + sumber terkunci menempel walau kabel sudah terputus (terbukti di jsdom: tanpa kelas itu tool tetap 'disconnect' dan locked tetap ada). Penolakan (pasangan tidak punya kabel) TIDAK me-reset — mode tetap aktif agar bisa coba pasangan lain, seperti mode port setelah penolakan. */if(_removed&&_locked!=null){try{window.NetForgeActionPanel?.reset?.()}catch(_e){}const _st=$('nf400Status');if(_st)_st.textContent='Koneksi berhasil diputus.';}}/* v0.40.92: alur LANGSUNG (tool dipilih dari dropdown / tombol legacy, tanpa kunci panel) kembali ke Pindah setelah percobaan kabel — sebelumnya tool tetap 'connect' setelah berhasil MAUPUN ditolak, sehingga klik perangkat berikutnya dianggap percobaan kabel baru (duplikat / port habis / ditolak budget) dan Escape tidak membatalkannya. Alur panel TIDAK disentuh di sini: handler nf4019 sudah me-reset (dan mengisi tip penolakan) — bila ada kunci, biarkan handler itu yang bekerja. Nilai select diubah langsung (tanpa dispatch change) agar pesan sukses/penolakan dari connect() tidak tertimpa 'Alat diubah.' dari handler change; tombol Batal disembunyikan langsung karena syncCancelBtn() berada di dalam init() dan tidak terjangkau dari act(). */if(_locked==null){const _t=$('nf400Tool');if(_t)_t.value='move';const _cb=$('nf400CancelTool');if(_cb)_cb.hidden=true;}return}draw();msg(doubleSelected?'Konfigurasi perangkat dibuka.':'Perangkat dipilih. Klik ⚙ pada kartu atau tombol Konfigurasi untuk mengatur, atau geser perangkat.');if(doubleSelected)$('nf4014CloseInspector')?.focus();}
function inspector(){const el=$('nf400Inspector');if(!el)return;el.replaceChildren();const n=node(selected);el.classList.toggle('nf4014-open',!!(n&&inspectorVisible&&mode==='mixed'));const modal=$('nf4016Modal');if(modal){modal.hidden=!(n&&inspectorVisible&&mode==='mixed');document.body.classList.toggle('nf4016-modal-open',!modal.hidden);}if(!n){el.textContent='Pilih perangkat pada canvas untuk melihat port dan konfigurasi.';return}const close=document.createElement('button');close.type='button';close.id='nf4014CloseInspector';close.textContent='✕ Tutup';close.setAttribute('aria-label','Tutup konfigurasi perangkat');close.addEventListener('click',()=>{inspectorVisible=false;inspector();});el.append(close);const d=registry[n.type];const title=document.createElement('strong');title.textContent=d.icon+' '+(n.name||d.name)+' · #'+n.id;el.append(title);const deleteButton=document.createElement('button');deleteButton.type='button';deleteButton.id='nf4010InspectorDelete';deleteButton.className='nf4010-delete';deleteButton.textContent='🗑 Hapus Perangkat Ini';deleteButton.addEventListener('click',deleteSelected);el.append(deleteButton);const links=state.edges.filter(e=>e.a===n.id||e.b===n.id);const p=document.createElement('p');p.textContent='Port: '+(d.ports.length?d.ports.map(port=>port+(used(n.id,port)?' ●':' ○')).join(' · '):'Wireless only')+(d.wifi?' · RADIO':'');el.append(p);for(const e of links){const other=node(e.a===n.id?e.b:e.a),ln=document.createElement('p');ln.textContent='⛓ '+(e.a===n.id?e.portA:e.portB)+' ↔ '+(other?.name||'Perangkat hilang')+' / '+(e.a===n.id?e.portB:e.portA)+' · '+e.medium;el.append(ln);const toggle=document.createElement('button');toggle.type='button';toggle.textContent=e.disabled?'▶ Aktifkan Link':'⏸ Matikan Link';toggle.title='Simulasi link failure tanpa menghapus kabel';toggle.addEventListener('click',()=>{const _wasChaos=!!e.disabled&&chaosEdgeKey(e)===chaosBrokenKey;e.disabled=!e.disabled;if(!e.disabled&&chaosEdgeKey(e)===chaosBrokenKey){chaosBrokenKey=null;e.chaos=false;e.chaosAnimal='';}/* v0.40.92: bersihkan juga flag kabel (bukan hanya kunci memori) agar insiden tidak bangkit lagi dari graf yang tersimpan. */persist();draw();msg(e.disabled?'⚠ Link dinonaktifkan.':'✓ Link diaktifkan kembali.');/* v0.40.92: beri tahu pendengar link-changed (toast nf4047 + status Chaos) — sebelumnya jalur inspector ini tidak mendispatch event, sehingga toast/status tidak ikut berubah saat link dimatikan/dinyalakan dari panel perangkat. */window.dispatchEvent(new CustomEvent('netforge:link-changed',{detail:{action:'toggle',index:state.edges.indexOf(e),reason:e.disabled?'Link dinonaktifkan.':'Link diaktifkan kembali.'}}));/* v0.40.92: sertakan indeks kabel yang baru diubah — sebelumnya toast nf4047 selalu memakai kabel LINK DOWN pertama, bukan aksi terakhir (audit live v0.40.89 butir 3). */if(_wasChaos&&!e.disabled){const _r=document.getElementById('eventRightContent'),_a=document.getElementById('eventArea');if(_a)_a.textContent='Insiden selesai. Area kembali aman (untuk sekarang).';if(_r)queueMicrotask(()=>{_r.textContent='Insiden selesai. Area kembali aman (untuk sekarang).';});/* v0.40.92: segarkan gelembung Iga (seperti jalur 'Aktifkan Link'). */try{if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay('Kabel sudah aman. Insiden selesai — jaringan kembali normal.','success')}catch(_e){}}else{/* v0.40.92: segarkan gelembung Iga saat toggle link biasa (butir 1, seperti manageLink). */try{if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay(e.disabled?'Link dinonaktifkan.':'Link diaktifkan kembali.','think')}catch(_e){}}});el.append(toggle)}
 const row=document.createElement('div');const nameLabel=document.createElement('label');nameLabel.textContent='Nama ';const nameInput=document.createElement('input');nameInput.value=n.name||d.name;nameInput.maxLength=40;nameInput.addEventListener('change',()=>{n.name=nameInput.value.trim()||d.name;persist();draw()});nameLabel.append(nameInput);row.append(nameLabel);
 const ipLabel=document.createElement('label');ipLabel.textContent='IPv4 ';const ipInput=document.createElement('input');ipInput.placeholder='contoh: 192.168.10.20';/* v0.40.92: placeholder yang polos terbaca sebagai nilai - auditor membaca "kolom IPv4 berisi 192.168.10.20" padahal kolom sebenarnya kosong dan "IPv4 efektif: 192.168.10.1 · DHCP" itu sudah benar (router tanpa IP eksplisit memakai default .1; effectiveIP()/routerIP() terverifikasi benar). */ipInput.value=n.ip||'';ipInput.addEventListener('change',()=>{msg('Tekan Simpan Konfigurasi untuk menerapkan IPv4.');});ipLabel.append(ipInput);row.append(ipLabel);el.append(row);
 const cfg=document.createElement('div');cfg.className='nf401-settings';
 const modeLabel=document.createElement('label');modeLabel.textContent='Mode IPv4 ';const modeSelect=document.createElement('select');for(const [v,label] of [['dhcp','DHCP / Otomatis'],['static','Statis']]){const o=document.createElement('option');o.value=v;o.textContent=label;modeSelect.append(o)}modeSelect.value=n.ipMode||((n.ip||'')?'static':'dhcp');if(n.type==='switch'||n.type==='iot')modeSelect.title='Alamat management/klien disimulasikan secara edukatif';modeLabel.append(modeSelect);cfg.append(modeLabel);
 const maskLabel=document.createElement('label');maskLabel.textContent='Subnet ';const maskInput=document.createElement('input');maskInput.value=n.mask||'255.255.255.0';maskInput.placeholder='255.255.255.0';maskLabel.append(maskInput);cfg.append(maskLabel);
 const gatewayLabel=document.createElement('label');gatewayLabel.textContent='Gateway ';const gwInput=document.createElement('input');gwInput.value=n.gateway||(n.type==='router'?routerIP(n):routerIP(state.nodes.find(x=>x.type==='router')||{ip:''}));/* v0.40.92: gateway Router diisi IP-nya sendiri sebagai nilai (bukan placeholder) — routerIP(n) = IP eksplisit atau 192.168.10.1. */gwInput.placeholder='192.168.10.1';gatewayLabel.append(gwInput);cfg.append(gatewayLabel);
 const dhcpLabel=document.createElement('label');if(n.type==='router'){const ch=document.createElement('input');ch.type='checkbox';ch.checked=n.dhcp!==false;dhcpLabel.append(ch,document.createTextNode(' Layanan DHCP router aktif'));ch.addEventListener('change',()=>{n.dhcp=ch.checked;persist();inspector();msg('Layanan DHCP '+(ch.checked?'aktif':'nonaktif')+'.')});cfg.append(dhcpLabel)}
 if(n.type==='router'){
  const interfaces=document.createElement('fieldset');interfaces.className='nf401-settings';const h=document.createElement('legend');h.textContent='🌐 Interface Router (IPv4 per port)';interfaces.append(h);
  const help=document.createElement('p');help.textContent='IP utama di atas adalah alamat default router. Tambahkan IP pada port lain untuk menghubungkan subnet berbeda. Port yang tidak diisi menggunakan IP utama hanya pada port pertama.';interfaces.append(help);
  const connectedPorts=registry.router.ports;
  for(const port of connectedPorts){const label=document.createElement('label');label.textContent=port+' ';const field=document.createElement('input');field.placeholder='contoh 192.168.20.1/24';field.value=n.interfaces?.[port]||'';field.setAttribute('aria-label','IPv4 interface '+port);field.addEventListener('change',()=>{const value=field.value.trim();if(value&&!parseInterface(value)){msg('Iga: Gunakan format IPv4/prefix (contoh 192.168.20.1/24).');return}n.interfaces={...(n.interfaces||{})};if(value)n.interfaces[port]=value;else delete n.interfaces[port];persist();msg('✓ Interface '+port+' diperbarui.');});label.append(field);interfaces.append(label)}cfg.append(interfaces);
  const routes=document.createElement('fieldset');routes.className='nf401-settings';const caption=document.createElement('legend');caption.textContent='🧭 Static Routing';routes.append(caption);
  const hint=document.createElement('p');hint.textContent='Destination IPv4/CIDR dan next-hop harus berada pada subnet interface router yang aktif. Metric lebih rendah diprioritaskan untuk prefix sama.';routes.append(hint);
  const entries=document.createElement('div');routes.append(entries);
  const showRoutes=()=>{entries.replaceChildren();for(const [index,r] of (n.staticRoutes||[]).entries()){const item=document.createElement('div');item.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:5px 0';const span=document.createElement('span');span.textContent=r.destination+' → '+r.via+' (metric '+(r.metric||1)+')';const del=document.createElement('button');del.type='button';del.textContent='Hapus';del.addEventListener('click',()=>{n.staticRoutes.splice(index,1);persist();showRoutes()});item.append(span,del);entries.append(item)}};showRoutes();
  const dst=document.createElement('input');dst.placeholder='172.16.30.0/24';dst.setAttribute('aria-label','Destination CIDR');const via=document.createElement('input');via.placeholder='10.0.12.2';via.setAttribute('aria-label','Next hop IPv4');const metric=document.createElement('input');metric.type='number';metric.min='1';metric.max='999';metric.value='1';metric.style.width='65px';metric.setAttribute('aria-label','Metric');const addRoute=document.createElement('button');addRoute.type='button';addRoute.textContent='+ Static Route';addRoute.addEventListener('click',()=>{const target=parseInterface(dst.value.trim()),hop=via.value.trim(),m=Number(metric.value);if(!target||!validIP(hop)||!Number.isInteger(m)||m<1||m>999)return msg('Iga: Isi destination CIDR, next-hop IPv4, metric 1–999.');const canonical=intToIPv4(networkOf(target.ip,target.mask))+'/'+target.prefix;if(!(n.staticRoutes||[]).some(r=>r.destination===canonical&&r.via===hop)){n.staticRoutes=[...(n.staticRoutes||[]),{destination:canonical,via:hop,metric:m}];persist();showRoutes();msg('✓ Static route tersimpan: '+canonical+' via '+hop)}else msg('Rute tersebut sudah terdaftar.');});routes.append(dst,via,metric,addRoute);cfg.append(routes);
 }
 const effective=document.createElement('p');effective.textContent='IPv4 efektif: '+(effectiveIP(n)||'belum tersedia')+' · '+(modeSelect.value==='dhcp'?'DHCP':'IP statis');cfg.append(effective);
 const save=document.createElement('button');save.type='button';save.textContent='Simpan Konfigurasi';save.addEventListener('click',()=>{const chosen=modeSelect.value,ip=(ipInput.value||'').trim(),gw=gwInput.value.trim(),mask=maskInput.value.trim();if(chosen==='static'&&!validIP(ip))return msg('Iga: Isi alamat IPv4 statis yang valid.');if(!validMask(mask))return msg('Iga: Subnet mask harus berupa mask IPv4 kontigu.');if(gw&&!validIP(gw))return msg('Iga: Gateway tidak valid.');if(chosen==='static'&&gw&&!sameSubnet(ip,gw,mask))return msg('Iga: Gateway harus berada pada subnet IPv4 perangkat.');n.ipMode=chosen;n.ip=chosen==='static'?ip:'';n.mask=mask;n.gateway=gw;persist();draw();msg('✓ Konfigurasi tersimpan. Jalankan Uji Konektivitas untuk memeriksa jalur.');});cfg.append(save);el.append(cfg);
 if(hasWifi(n)||n.type==='pc'){
 const wifi=document.createElement('fieldset');wifi.className='nf4013-wifi';const legend=document.createElement('legend');legend.textContent='📶 Pengaturan Wi-Fi '+(n.type==='router'||n.type==='ap'?'(Access Point)':'(Klien)');wifi.append(legend);
 if(n.type==='pc'){const adapter=document.createElement('label');const check=document.createElement('input');check.type='checkbox';check.checked=!!n.wifiAdapter;adapter.append(check,document.createTextNode(' Pasang adaptor Wi-Fi pada Desktop PC'));wifi.append(adapter);check.addEventListener('change',()=>{n.wifiAdapter=check.checked;persist();draw();msg(check.checked?'✓ Adaptor Wi-Fi PC aktif.':'Adaptor Wi-Fi PC dilepas.')})}
 if(n.type==='router'||n.type==='ap'){const enable=document.createElement('label');const check=document.createElement('input');check.type='checkbox';check.checked=n.wifiEnabled!==false;enable.append(check,document.createTextNode(' Radio Wi-Fi aktif'));wifi.append(enable);check.addEventListener('change',()=>{n.wifiEnabled=check.checked;persist();draw();msg('Status radio Wi-Fi diperbarui.')})}
 const inputs={};for(const [key,label,value] of [['wifiSSID','SSID',DEFAULT_WIFI.ssid],['wifiPassword','Password (simulasi)',DEFAULT_WIFI.password]]){const wrap=document.createElement('label');wrap.textContent=label+' ';const input=document.createElement('input');input.value=n[key]||value;input.maxLength=48;input.autocomplete='off';if(key==='wifiPassword')input.type='password';wrap.append(input);wifi.append(wrap);inputs[key]=input}
 const band=document.createElement('label');band.textContent='Band ';const bandSelect=document.createElement('select');for(const x of ['2.4','5']){const o=document.createElement('option');o.value=x;o.textContent=x+' GHz';bandSelect.append(o)}bandSelect.value=n.wifiBand||'2.4';band.append(bandSelect);wifi.append(band);
 const saveWifi=document.createElement('button');saveWifi.type='button';saveWifi.textContent='Simpan Pengaturan Wi-Fi';saveWifi.addEventListener('click',()=>{const ssid=inputs.wifiSSID.value.trim(),pass=inputs.wifiPassword.value;if(!ssid||pass.length<8)return msg('Iga: SSID wajib diisi dan password simulasi minimal 8 karakter.');n.wifiSSID=ssid;n.wifiPassword=pass;n.wifiBand=bandSelect.value;persist();draw();msg('✓ Wi-Fi tersimpan. Uji kembali koneksi jika SSID, password, atau band berubah.')});wifi.append(saveWifi);
 const hint=document.createElement('p');hint.textContent='Sambungkan: pilih Router/AP, lalu gunakan Hubungkan → Wi-Fi dan klik klien. Kredensial hanya untuk simulasi lokal; jangan gunakan password asli.';wifi.append(hint);el.append(wifi);
 }
 const info=document.createElement('p');info.textContent='IP, DHCP dan ping adalah simulasi graf lokal, bukan paket ICMP asli. Static routing antar-router dan simulasi link failure tersedia. OSPF belum tersedia. Skor misi lama belum disatukan.';el.append(info);}
function validIP(v){const a=v.split('.');return a.length===4&&a.every(x=>/^\d{1,3}$/.test(x)&&+x<=255)}
function validMask(mask){if(!validIP(mask))return false;const binary=mask.split('.').map(x=>(+x).toString(2).padStart(8,'0')).join('');return /^1*0*$/.test(binary)&&binary.includes('1')}
function sameSubnet(a,b,m){if(!validIP(a)||!validIP(b)||!validMask(m))return false;const aa=a.split('.').map(Number),bb=b.split('.').map(Number),mm=m.split('.').map(Number);return aa.every((v,i)=>(v&mm[i])===(bb[i]&mm[i]))}
function pathBetween(a,b){if(!a||!b)return null;if(a.id===b.id)return [a.id];const queue=[[a.id]],seen=new Set([a.id]);while(queue.length){const path=queue.shift(),v=path.at(-1);for(const e of state.edges){if(!linkActive(e))continue;const u=e.a===v?e.b:e.b===v?e.a:null;if(u===null||seen.has(u)||!node(u))continue;const next=[...path,u];if(u===b.id)return next;seen.add(u);queue.push(next)}}return null}
function dhcpRouter(n){return state.nodes.find(r=>r.type==='router'&&r.dhcp!==false&&pathBetween(n,r))||null}
function ipv4ToInt(ip){if(!validIP(ip))return null;return ip.split('.').reduce((v,x)=>((v<<8)>>>0)+Number(x),0)>>>0}
function intToIPv4(value){return [24,16,8,0].map(n=>(value>>>n)&255).join('.')}
function networkOf(ip,mask){const a=ipv4ToInt(ip),m=ipv4ToInt(mask);return a===null||m===null?null:(a&m)>>>0}
function addressMode(n){return n.ipMode||((n.ip||'')?'static':'dhcp')}
function routerIP(r){return validIP(r.ip||'')?r.ip:'192.168.10.1'}
function routerMask(r){return validMask(r.mask||'')?r.mask:'255.255.255.0'}
function firstDhcpRouter(){return state.nodes.find(r=>r.type==='router'&&r.dhcp!==false)||null}
function dhcpLease(n,forcedRouter){const router=forcedRouter||dhcpRouter(n);if(!router)return null;
// v0.59.00: lease harus unik se-jaringan, bukan per-router. Sebelumnya tiap
// router memulai poolnya sendiri di net+100, sehingga dua klien yang dilayani
// router berbeda sama-sama mendapat .100 (duplikat — terbukti pada topologi
// dua router). Kini peta lease dibangun global: semua klien DHCP diurutkan
// (router id, lalu client id); tiap lease diambil dari pool routernya dengan
// melewati alamat yang sudah dipakai (statis, IP router, dan lease klien
// lain). forcedRouter (dipakai classicView saat klien belum punya jalur)
// hanya memaksa router untuk node yang diminta.
const taken=new Set();
state.nodes.forEach(v=>{if(addressMode(v)==='static'&&validIP(v.ip||''))taken.add(v.ip)});
state.nodes.forEach(v=>{if(v.type==='router')taken.add(routerIP(v))});
const routers=[...state.nodes.filter(v=>v.type==='router')].sort((a,b)=>a.id-b.id);
const leaseMap=new Map();
for(const r of routers){const mask=routerMask(r),base=ipv4ToInt(routerIP(r)),bits=ipv4ToInt(mask),net=(base&bits)>>>0,broadcast=(net|(~bits>>>0))>>>0;const start=(net+100)>>>0,first=(net+1)>>>0,last=(broadcast-1)>>>0;if(last<first||last-first>65536)continue;const clients=state.nodes.filter(v=>v.id!==r.id&&addressMode(v)!=='static'&&(dhcpRouter(v)?.id===r.id||(forcedRouter&&forcedRouter.id===r.id&&v.id===n.id))).sort((a,b)=>a.id-b.id);/* v0.40.92: lease MENETAP (sticky). Sebelumnya peta dibangun ulang dari nol tiap pemanggilan, sehingga setelah satu klien diubah statis, klien lain BERGESER (PC#4 .102 -> .101 setelah PC#3 jadi statis .10) — dibaca berurutan, kedua dialog menampilkan .101 dan tampak duplikat, padahal tak pernah simultan. Kini lease tersimpan di node (n.dhcpLease, ikut tersimpan lewat persist()) dan dipakai ulang bila masih valid (satu subnet dengan routernya, belum dipakai alamat statis/IP router/klien lain); klien tanpa lease valid mendapat alamat bebas pertama seperti sebelumnya. */const pending=[];for(const c of clients){const _keep=validIP(c.dhcpLease||'')&&sameSubnet(c.dhcpLease,routerIP(r),mask)&&!taken.has(c.dhcpLease);if(_keep){leaseMap.set(c.id,c.dhcpLease);taken.add(c.dhcpLease)}else pending.push(c)}const usable=[];for(let x=start;x<=last&&usable.length<pending.length;x++){const ip=intToIPv4(x);if(!taken.has(ip))usable.push(ip)}for(let x=first;x<start&&x<=last&&usable.length<pending.length;x++){const ip=intToIPv4(x);if(!taken.has(ip))usable.push(ip)}for(let i=0;i<pending.length;i++){const ip=usable[i];if(!ip)continue;leaseMap.set(pending[i].id,ip);taken.add(ip);pending[i].dhcpLease=ip}}
return leaseMap.get(n.id)||null}
function effectiveIP(n){if(!n)return null;if(addressMode(n)==='static')return validIP(n.ip||'')?n.ip:null;if(n.type==='router')return routerIP(n);return dhcpLease(n)}
function effectiveMask(n){if(addressMode(n)==='dhcp'){const r=n.type==='router'?n:dhcpRouter(n);return r?routerMask(r):null}return validMask(n.mask||'')?n.mask:'255.255.255.0'}
function effectiveGateway(n){if(n.type==='router')return null;if(addressMode(n)==='dhcp')return dhcpRouter(n)?routerIP(dhcpRouter(n)):null;return n.gateway||null}
function prefixMask(bits){const b=Number(bits);if(!Number.isInteger(b)||b<1||b>30)return null;return intToIPv4((0xffffffff<<(32-b))>>>0)}
function parseInterface(raw){const m=String(raw||'').trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d{1,2})$/);if(!m||!validIP(m[1]))return null;const mask=prefixMask(m[2]);return mask?{ip:m[1],mask,prefix:Number(m[2])}:null}
function routerInterfaces(r){if(!r||r.type!=='router')return [];const entries=[];
 for(const [port,raw] of Object.entries(r.interfaces||{})){const parsed=parseInterface(raw);if(parsed)entries.push({...parsed,port})}
 if(!entries.length){const activePorts=[...new Set(state.edges.filter(e=>(e.a===r.id||e.b===r.id)&&linkActive(e)).map(e=>e.a===r.id?e.portA:e.portB))];const ports=activePorts.length?activePorts:['LAN1'];for(const port of ports)entries.push({ip:routerIP(r),mask:routerMask(r),port});}
 return entries}
function portFor(edge,id){return edge.a===id?edge.portA:edge.portB}
// Layer-2 transit is possible through switches and access points, never across a router.
function lanPath(start,end,routerPort=null){if(!start||!end)return null;if(start.id===end.id)return [start.id];const queue=[[start.id]],seen=new Set([start.id]);while(queue.length){const path=queue.shift(),v=path.at(-1);for(const e of state.edges){if(!linkActive(e))continue;const u=e.a===v?e.b:e.b===v?e.a:null;if(u===null||seen.has(u))continue;const dest=node(u);if(!dest)continue;if(v===start.id&&start.type==='router'&&routerPort&&portFor(e,start.id)!==routerPort)continue;if(dest.type==='router'&&dest.id!==end.id)continue;if(dest.type==='router'&&routerPort&&dest.id===end.id&&portFor(e,end.id)!==routerPort)continue;const next=[...path,u];if(u===end.id)return next;seen.add(u);queue.push(next)}}return null}
function gatewayRoute(host,gw){if(!validIP(gw))return null;const hostIP=effectiveIP(host),mask=effectiveMask(host);if(!hostIP||!mask||!sameSubnet(hostIP,gw,mask))return null;
 for(const router of state.nodes.filter(n=>n.type==='router'))for(const iface of routerInterfaces(router))if(iface.ip===gw&&lanPath(host,router,iface.port))return {router,iface,path:lanPath(host,router,iface.port)};
 return null}
function gatewayIssue(n,ip){if(!ip||n.type==='router'||n.type==='switch')return null;const gw=effectiveGateway(n),mask=effectiveMask(n);if(!gw)return null;if(!validIP(gw))return 'Gateway IPv4 tidak valid';if(!sameSubnet(ip,gw,mask))return 'Gateway '+gw+' berada di luar subnet '+mask;if(!gatewayRoute(n,gw))return 'Gateway '+gw+' tidak ditemukan pada segmen Layer 2 aktif';return null}
function routingTable(router){if(!router||router.type!=='router')return [];const connected=routerInterfaces(router).map(i=>({type:'CONNECTED',network:intToIPv4(networkOf(i.ip,i.mask)),mask:i.mask,prefix:i.prefix??i.mask.split('.').reduce((v,o)=>v+Number(o).toString(2).replace(/0/g,'').length,0),via:'direct',metric:0,port:i.port,ip:i.ip}));const statics=(router.staticRoutes||[]).map(r=>{const p=parseInterface(r.destination);return p?{type:'STATIC',network:intToIPv4(networkOf(p.ip,p.mask)),mask:p.mask,prefix:p.prefix,via:r.via,metric:Number(r.metric)||1,port:'-',ip:'-'}:null}).filter(Boolean);return [...connected,...statics]}
function routeFor(router,target){return routingTable(router).filter(r=>sameSubnet(target,r.network,r.mask)).sort((a,b)=>b.prefix-a.prefix||a.metric-b.metric||((a.type==='CONNECTED')?-1:1))[0]||null}
function findNextRouter(router,via){for(const iface of routerInterfaces(router)){if(!sameSubnet(iface.ip,via,iface.mask))continue;for(const peer of state.nodes.filter(n=>n.type==='router'&&n.id!==router.id)){for(const remote of routerInterfaces(peer)){if(remote.ip!==via)continue;const path=lanPath(router,peer,iface.port);if(path&&path.length>1&&state.edges.some(e=>linkActive(e)&&((e.a===peer.id&&portFor(e,peer.id)===remote.port)||(e.b===peer.id&&portFor(e,peer.id)===remote.port))))return {peer,path,iface}}}}return null}
function forwardRoute(first,target,maxHops=16){let r=first;const seen=new Set(),travel=[r.id],steps=[];const dest=effectiveIP(target);for(let hop=0;hop<maxHops;hop++){if(seen.has(r.id))return {ok:false,reason:'Routing loop: router dikunjungi kembali.',path:travel};seen.add(r.id);const route=routeFor(r,dest);if(!route)return {ok:false,reason:(r.name||'Router')+': tidak ada route menuju '+dest+'.',path:travel};steps.push({router:r.id,route});if(route.type==='CONNECTED'){for(const iface of routerInterfaces(r).filter(i=>i.port===route.port)){const path=lanPath(r,target,iface.port);if(path)return {ok:true,path:[...travel,...path.slice(1)],steps}}return {ok:false,reason:(r.name||'Router')+': subnet terhubung tetapi host tujuan tidak terjangkau pada '+route.port+'.',path:travel}}
 const next=findNextRouter(r,route.via);if(!next)return {ok:false,reason:(r.name||'Router')+': next hop '+route.via+' tidak terjangkau (link/interface down).',path:travel};travel.push(...next.path.slice(1));r=next.peer}
 return {ok:false,reason:'TTL habis: kemungkinan routing loop atau terlalu banyak hop.',path:travel}}
function linkLatency(path,routerHops){const hops=Math.max(0,(path?.length||1)-1);const base=1+Math.round(hops*1.8)+Math.round((routerHops||0)*2.5);const jitter=((path||[]).reduce((s,id)=>s+Number(id),0)%7)/10;return {latencyMs:Math.round((base+jitter)*10)/10,ttl:Math.max(1,64-hops)}}
function ping(from,to){const a=node(from),b=node(to);const fail=(reason,path=[])=>({ok:false,reason,path});if(!a||!b)return fail('Pilih perangkat asal dan tujuan yang tersedia.');const ia=effectiveIP(a),ib=effectiveIP(b);if(!ia||!ib)return fail('Alamat IPv4 belum tersedia; periksa DHCP dan koneksi.');const dupNode=state.nodes.find(n=>{if(n.id===a.id||n.id===b.id)return false;const ip=explicitIP(n);if(!ip||(ip!==ia&&ip!==ib))return false;return nodeHasActiveLink(n)});if(dupNode)return fail('IP conflict: alamat IPv4 '+explicitIP(dupNode)+' dipakai juga oleh '+(dupNode.name||registry[dupNode.type]?.name||dupNode.type)+' #'+dupNode.id+'. Ubah IP salah satunya di konfigurasi.');if(ia===ib&&explicitIP(a)&&explicitIP(a)===explicitIP(b))return fail('IP conflict: alamat IPv4 '+ia+' dipakai oleh '+(a.name||a.type)+' #'+a.id+' dan '+(b.name||b.type)+' #'+b.id+'. Ubah IP salah satunya di konfigurasi.');const ma=effectiveMask(a),mb=effectiveMask(b);if(!ma||!mb)return fail('Subnet mask IPv4 tidak valid.');const sameA=sameSubnet(ia,ib,ma),sameB=sameSubnet(ia,ib,mb);if(sameA&&sameB){const path=lanPath(a,b);if(!path)return fail('Tidak ada jalur Layer 2 aktif pada subnet yang sama.');return {ok:true,reason:'Ping satu subnet berhasil.',path,sourceIP:ia,targetIP:ib,hops:path.length-1,routeType:'local',...linkLatency(path,0)}}if(sameA!==sameB)return fail('Subnet mask asal dan tujuan tidak selaras.');if(a.type==='router'||b.type==='router')return fail('Uji antarsubnet saat ini menggunakan dua klien melalui gateway router.');const ga=effectiveGateway(a),gb=effectiveGateway(b);if(!ga||!gb)return fail('Kedua klien memerlukan default gateway.');const origin=gatewayRoute(a,ga),destination=gatewayRoute(b,gb);if(!origin)return fail('Gateway asal '+ga+' tidak terjangkau.');if(!destination)return fail('Gateway tujuan '+gb+' tidak terjangkau.');const forward=forwardRoute(origin.router,b);if(!forward.ok)return fail(forward.reason,[...origin.path,...forward.path.slice(1)]);const reverse=forwardRoute(destination.router,a);if(!reverse.ok)return fail('Jalur balik gagal: '+reverse.reason,[...origin.path,...forward.path.slice(1)]);const path=[...origin.path,...forward.path.slice(1)];return {ok:true,reason:'Routing antarsubnet berhasil ('+forward.steps.filter(s=>s.route.type==='STATIC').length+' static route, jalur balik valid).',path,sourceIP:ia,targetIP:ib,hops:path.length-1,routerHops:forward.steps.length,routeType:'routed',gateway:ga,steps:forward.steps,...linkLatency(path,forward.steps.length)}}
function diagnose(){const issues=[],ips=new Map(),links=[];for(const e of state.edges){const reason=linkReason(e),a=node(e.a),b=node(e.b);links.push({a:e.a,b:e.b,medium:e.medium,active:!reason,reason:reason||'Koneksi aktif'});if(reason)issues.push('Link '+(a?.name||e.a)+' ↔ '+(b?.name||e.b)+': '+reason)}for(const n of state.nodes){const ip=explicitIP(n),eff=effectiveIP(n),name=n.name||n.type;if(ip&&nodeHasActiveLink(n)){if(ips.has(ip))issues.push('Duplikasi IPv4 '+ip+' pada '+name+' dan '+ips.get(ip));else ips.set(ip,name);const err=gatewayIssue(n,ip);if(err)issues.push(name+': '+err)}else if(!eff&&n.type!=='switch'&&n.type!=='iot')issues.push(name+': tidak memiliki IPv4. Periksa DHCP, router dan sambungan.');if(addressMode(n)==='dhcp'&&n.type!=='router'&&n.type!=='switch'&&!dhcpRouter(n))issues.push(name+': DHCP server tidak terjangkau atau dinonaktifkan');if(addressMode(n)==='static'&&validIP(n.ip||'')&&!validMask(n.mask||'255.255.255.0'))issues.push(name+': subnet mask tidak valid')}
const disconnected=state.nodes.filter(n=>!state.edges.some(e=>(e.a===n.id||e.b===n.id)&&linkActive(e))).map(n=>n.id);return {issues,disconnected,nodes:state.nodes.length,links:links.length,linksDetail:links,activeLinks:links.filter(e=>e.active).length,profile:activeProfile}}
function audit(){const result=diagnose();const text=result.issues.length?'⚠ Iga: '+result.issues.join('; '):'✓ Semua pemeriksaan link/IP yang tersedia berhasil.';msg(text+' · '+result.disconnected.length+' perangkat tanpa link aktif.');return result}
function addCurrent(type,evt){if(mode!=='mixed'&&['pc','laptop','tablet','phone'].includes(type)){openMission('basics');add(type);return}if(mode==='mixed'){add(type);return}if(mode==='smart'){const map={router:'ap',ap:'ap',switch:'switch',tv:'tv',camera:'camera',iot:'iot',nvr:'nvr'};if(!map[type])return msg('Iga: Perangkat belum didukung simulator Smart Home. Pilih Free Lab Terpadu.');window.NetForgeBuilder?.addDevice?.(map[type]);window.NetForgeUniversalWorkspace?.render?.();return}const nodeEl=document.querySelector('.panel.left .device[data-type="'+type+'"]');if(nodeEl&&!nodeEl.hidden){nodeEl.click();return} // Hidden legacy inventory item is still event-bound.
 if(nodeEl){nodeEl.click();return}msg('Iga: Perangkat ini tersedia dalam Free Lab Terpadu.');}
function renderInventory(){const filter=$('nf400Category').value.toLowerCase(),q=$('nf400Search').value.trim().toLowerCase(),list=$('nf400List');list.replaceChildren();
 for(const d of [...catalog].sort((a,b)=>{const recommendations={basics:['router','modem','pc','laptop','tablet','phone','switch','printer','firewall','server','ap'],smart:['modem','router','ap','switch','tv','camera','iot','nvr','server'],office:['modem','firewall','router','switch','pc','server','printer','laptop','tablet','phone','ap'],free:catalog.map(d=>d.id)};const order=recommendations[mode==='mixed'?activeProfile:mode==='smart'?'smart':'basics'];return (order.indexOf(a.id)<0?99:order.indexOf(a.id))-(order.indexOf(b.id)<0?99:order.indexOf(b.id))}) ){/* v0.40.38: inventory never hides supported devices; recommendations are sorted first. */if(filter!=='semua'&&d.cat.toLowerCase()!==filter)continue;if(q&&!((d.name+' '+d.id+' '+d.cat).toLowerCase().includes(q)))continue;const allowed=mode==='mixed'?d.mixed:mode==='smart'?(d.smart||d.id==='router'||d.id==='switch'):!!d.basic;
 const b=document.createElement('button');b.type='button';b.className='nf400-device';b.draggable=!!allowed;b.disabled=!allowed;b.dataset.type=d.id;b.title=allowed?'Klik untuk memasang, atau tarik ke canvas':'Engine misi ini belum mendukung perangkat tersebut';b.innerHTML='<span class="nf400-icon">'+d.icon+'</span><span><strong>'+d.name+'</strong><small>'+(allowed?(d.id==='server'?'Server · $'+d.cost+' · semua profil':'Tarik / Tambah · $'+d.cost):'Free Lab Terpadu')+'</small></span>';b.addEventListener('click',()=>addCurrent(d.id));b.addEventListener('dragstart',e=>e.dataTransfer?.setData('text/plain','netforge-device:'+d.id));list.append(b)}
 $('nf400ModeName').textContent=mode==='mixed'?({basics:'Network Basics',smart:'Smart Home Hybrid',office:'Office Starter',free:'Free Lab Terpadu'}[activeProfile]):mode==='smart'?'Smart Home Klasik':'Network Basics Klasik';
 for(const [k,id] of [['basics','nf400Basic'],['smart','nf400Smart'],['office','nf403Office'],['free','nf400Mixed']])$(id)?.setAttribute('aria-pressed',String(mode==='mixed'&&activeProfile===k));
 $('nf400InventoryTip').textContent=mode==='mixed'?(activeProfile==='free'?'Semua perangkat dapat digabung pada satu canvas.':'Perangkat untuk '+activeProfile+' diprioritaskan; workspace terpisah per misi dan tersimpan otomatis. Klik atau tarik untuk menambah perangkat.'):mode==='smart'?'Perangkat di katalog yang didukung Smart Home bisa langsung ditambahkan ke denah.':'Network Basics: Router/AP dan klien Desktop PC, Laptop, Tablet, atau Smartphone. Pilih Ethernet atau Wi-Fi sesuai adaptor.';
}
function setMode(next){if(!['basic','smart','mixed'].includes(next))return;const leavingMixed=mode==='mixed'&&next!=='mixed';if(next!=='mixed')inspectorVisible=false;if(mode==='smart'&&next!=='smart')window.NetForgeSmartHome?.close?.();if(next==='smart'){mode='smart';window.NetForgeSmartHome?.open?.();}else{mode=next;window.NetForgeMissionUI?.activate?.('basic');}document.body.classList.toggle('nf400-mixed',mode==='mixed');if($('nf4012CableTools'))$('nf4012CableTools').hidden=mode!=='mixed';$('nf400Panel').hidden=mode!=='mixed';if($('nf403MissionBanner'))$('nf403MissionBanner').hidden=mode!=='mixed';renderInventory();draw();updateBudgetUI();if(typeof updateStats==='function')updateStats();if(leavingMixed)window.dispatchEvent(new CustomEvent('netforge:unified-mode-left'));}
function openMission(profile='free'){
 // v0.59.00: bila Lab masih aktif, keluar dulu lewat leave() UI agar snapshot
 // misi dipulihkan — sebelumnya openMission langsung memuat profil dan canvas
 // tetap menampilkan topologi Lab sehingga misi tampak terhapus.
 if(window.NetForgeLab?.active?.()&&typeof window.NetForgeLabLeaveUI==='function'){try{window.NetForgeLabLeaveUI()}catch{}}
  // v0.59.00: bila ada snapshot misi yang TERSISA (Lab berakhir tanpa
  // leave(), mis. reload saat di Lab — setelah reload Lab tidak lagi
  // aktif sehingga leave() tidak pernah terpanggil), pulihkan SEBELUM
  // ganti profil. Jika tidak, switchProfile memuat profil misi yang
  // sudah tertimpa graf Lab kosong dan canvas misi tampil kosong.
  // Snapshot hanya dibuat saat masuk Lab dan dihapus leave(); bila
  // tersisa saat Lab tidak aktif, isinya selalu keadaan misi terakhir
  // yang benar. Terbukti di jsdom (probe-82-lab-return.js).
  // v0.59.00: snapshot Lab HANYA ditulis ke kunci profil misi
  // PEMILIKNYA. Dulu snapshot diimpor lewat importGraph() yang
  // persist() ke profil AKTIF saat itu (tergantung parse()=
  // 'basics') lalu switchProfile() memuat profil yang diminta
  // ('free') — misi tersimpan di kunci lain tetapi canvas
  // menampilkan Lab kosong, dan "Lanjut Bermain" mati karena
  // resume-init sudah jalan sebelum impor. Kini tulis langsung
  // ke kunci pemilik (tanpa efek samping persist), lalu
  // switchProfile memuatnya bila profil yang diminta adalah
  // pemiliknya. Snapshot tanpa cap (dibuat ronde lalu): pakai profil yang
  // diminta bila itu misi, atau 'basics' bila kuncinya kosong.
  // Bila profil AKTIF sudah pemiliknya, impor juga ke state hidup —
  // parse() memuat profil itu SEBELUM snapshot ditulis, sehingga
  // switchProfile() early-return tanpa memuat ulang kunci, dan
  // langkah "preserve"-nya malah menimpa kunci pemilik dengan
  // state basi yang kosong.
  if(!window.NetForgeLab?.active?.()){try{const _raw=localStorage.getItem('netforge.lab.mission-snapshot.v1');if(_raw){const _g=JSON.parse(_raw);if(_g&&Array.isArray(_g.nodes)&&_g.nodes.length){const _own=(_g.profile||_g.mission||null);let _target=null;if(_own&&['basics','smart','office'].includes(_own))_target=_own;else if(profile&&['basics','smart','office'].includes(profile))_target=profile;else{try{const _b=JSON.parse(localStorage.getItem('netforge.universal.mission.v2.basics')||'null');if(!_b||!Array.isArray(_b.nodes)||!_b.nodes.length)_target='basics'}catch(_e2){_target='basics'}}if(_target){localStorage.setItem('netforge.universal.mission.v2.'+_target,JSON.stringify(_g));if(activeProfile===_target&&window.NetForgeUniversalInventory?.importGraph){window.NetForgeUniversalInventory.importGraph(_g);/* v0.40.92: pulihkan penanda insiden Chaos dari snapshot (seperti leave()). */try{if(_g.chaosKey&&window.NetForgeUniversalInventory.chaosRebind)window.NetForgeUniversalInventory.chaosRebind(_g.chaosKey)}catch(_e3){}/* v0.40.92: fallback seperti leave() (butir 1) — bila graf snapshot berisi kabel LINK UP, terapkan ulang insiden dari kunci snapshot. */try{if(!(window.NetForgeUniversalInventory.chaosActive&&window.NetForgeUniversalInventory.chaosActive())&&_g.chaosKey&&window.NetForgeUniversalInventory.chaosRestoreLive)window.NetForgeUniversalInventory.chaosRestoreLive({key:_g.chaosKey,animal:_g.chaosAnimal});}catch(_e4){}}}}localStorage.removeItem('netforge.lab.mission-snapshot.v1')}}catch(_e){}}
 if(!['basics','smart','office','free'].includes(profile))profile='free';
 const switched=switchProfile(profile);
 if($('nf400Category'))$('nf400Category').value='Semua';if($('nf400Search'))$('nf400Search').value='';
 // Always enter the very same mixed canvas; legacy evaluators remain untouched.
 setMode('mixed');
 const dropdown=$('nf402Mission');if(dropdown&&profile!=='free'){dropdown.value=profile;window.NetForgeMissionValidator?.preview?.()}
 const heading=$('nf403MissionHeading');if(heading)heading.textContent=({basics:'🌐 Network Basics — LAN Fundamental',smart:'🏠 Smart Home Hybrid',office:'🏢 Office Starter — LAN, Firewall & Printer',free:'🧪 Free Lab Terpadu'}[profile]);
 const desc=$('nf403MissionInstructions');if(desc)desc.textContent=({basics:'Hubungkan Desktop PC, Laptop, Tablet, atau Smartphone ke Router/AP via Ethernet atau Wi-Fi. Uji IPv4 tiap perangkat.',smart:'Bangun Router/AP, Switch, Smart TV, kamera PoE, IoT, dan NVR pada canvas yang sama.',office:'Bangun Router, Switch, PC dan Server, lalu verifikasi konektivitas.',free:'Bangun jaringan bebas. Anda dapat memilih profil penilaian di bawah.'}[profile]);
 const evalbtn=$('nf403RunMission');if(evalbtn)evalbtn.hidden=profile==='free';
 const legacyTitle=$('missionTitle'),legacyDescription=$('missionDesc');
 if(legacyTitle)legacyTitle.textContent=({basics:'Network Basics — Unified',smart:'Smart Home Hybrid — Unified',office:'Office Starter — Unified',free:'Free Lab Terpadu'}[profile]);
 if(legacyDescription)legacyDescription.textContent='Setiap misi mempunyai workspace tersimpan sendiri. Perangkat misi sebelumnya tersedia saat Anda kembali ke misi itu.';
 const toolTitle=$('nf4012CableTools')?.querySelector('strong');if(toolTitle)toolTitle.textContent='🔧 Alat '+({basics:'Network Basics',smart:'Smart Home',office:'Office Starter',free:'Free Lab'}[profile]);
 const oldNext=$('nextMissionBtn'),oldContract=$('newContractBtn');if(oldNext)oldNext.style.display='none';if(oldContract)oldContract.style.display='none';
 const reset=$('resetBtn');if(reset)reset.title='Reset klasik tidak memengaruhi Unified Canvas; gunakan Kosongkan Canvas.';
 // Preview automatically when selecting a mission; avoid recording an attempt.
 queueMicrotask(()=>window.NetForgeMissionValidator?.preview?.());
 $('nf400Status').textContent='Iga: Misi aktif: '+({basics:'Network Basics',smart:'Smart Home Hybrid',office:'Office Starter',free:'Free Lab'}[profile])+'. Workspace misi ini '+(state.nodes.length?'dipulihkan dari progres tersimpan.':'dimulai kosong.');
 window.dispatchEvent(new CustomEvent('netforge:unified-mission-opened',{detail:{profile}}));
}
function init(){if(booted||!document.querySelector('.panel.left .panelbody')||!$('stage'))return;booted=true;parse();document.body.classList.add('nf400-unified');const left=document.querySelector('.panel.left .panelbody');const inv=document.createElement('section');inv.id='nf400Inventory';inv.innerHTML='<h4>⬡ UNIVERSAL DEVICE INVENTORY</h4><p id="nf400InventoryTip"></p><div class="nf400-controls"><input id="nf400Search" type="search" aria-label="Cari perangkat" placeholder="🔎 Cari semua perangkat..."><select id="nf400Category" aria-label="Filter kategori"><option value="Semua">Semua kategori</option><option>Jaringan</option><option>Wireless</option><option>Klien</option><option>Smart Home</option><option>Server</option></select><span id="nf400ModeName" style="font-size:10px;color:#9ad7ed;align-self:center"></span></div><div id="nf400List" aria-label="Daftar perangkat"></div>';left.prepend(inv);
 const shell=document.querySelector('.workspace-shell');const bar=document.createElement('div');bar.id='nf400Modebar';bar.innerHTML='<strong style="color:#90eaff">UNIFIED CANVAS</strong><button type="button" id="nf400Basic">Network Basics</button><button type="button" id="nf400Smart">Smart Home</button><button type="button" id="nf403Office">Office Starter</button><button type="button" id="nf400Mixed">Free Lab Terpadu</button><span class="nf400-help">Satu inventori · filter mengikuti mode</span>';shell.prepend(bar);
 const canvas=document.createElement('section');canvas.id='nf400Canvas';canvas.hidden=true;canvas.setAttribute('aria-label','Universal Free Lab canvas');canvas.innerHTML='<div id="nf4024Viewport"><svg viewBox="0 0 100 100" preserveAspectRatio="none" id="nf400Wires" aria-hidden="true"></svg><div id="nf400Nodes"></div></div><div class="nf400-placeholder" id="nf400Empty">Tarik perangkat ke sini, atau klik perangkat pada inventori kiri.</div>';const stage=$('stage');stage.append(canvas);
 const banner=document.createElement('section');banner.id='nf403MissionBanner';banner.hidden=true;banner.innerHTML='<div><strong id="nf403MissionHeading">🧪 Free Lab Terpadu</strong><p id="nf403MissionInstructions">Bangun jaringan bebas.</p></div><div class="nf403-actions"><button type="button" id="nf403RunMission">▶ Evaluasi Misi</button><button type="button" id="nf403ChooseMission">🗺️ Pilih Misi</button></div>';stage.before(banner);/* v0.40.92: banner keluar dari #stage — di dalam stage (tinggi tetap + overflow:hidden) judul misi terpotong saat halaman digulir; di sini ia mengalir normal di atas stage, di bawah panelhead. */const panel=document.createElement('section');panel.id='nf400Panel';panel.hidden=true;panel.innerHTML='<div class="nf400-tools"><strong>🔧 Alat Workspace</strong><label>Tool <select id="nf400Tool"><option value="move">Pilih / Geser</option><option value="connect">Hubungkan</option><option value="disconnect">Putuskan</option><option value="delete">Hapus</option></select></label><label>Media <select id="nf400Medium"><option value="ethernet">Ethernet</option><option value="poe">PoE</option><option value="fiber">Fiber/SFP</option><option value="wifi">Wi-Fi</option></select></label><button type="button" id="nf4014ConfigSelected">⚙ Buka Konfigurasi</button><button type="button" id="nf4010DeleteSelected" class="nf4010-delete">🗑 Hapus Terpilih</button><button type="button" id="nf400Audit">Audit</button><button type="button" id="nf400Clear">Kosongkan Canvas</button><span id="nf400Count"></span></div><div role="status" aria-live="polite" id="nf400Status">Siap membangun topologi campuran.</div><div id="nf400Inspector"></div>';stage.after(panel);/* v0.40.92: panel (inspector + diagnostik + Log Aktivitas Workspace) keluar dari #stage — di dalam stage ia berada di bawah canvas 60vh sehingga terpotong oleh tinggi tetap + overflow:hidden; di sini ia tampil penuh di bawah stage. */
 // Keep the cable controls next to the visible workspace, not below a tall canvas.
 const quickTools=document.createElement('section');quickTools.id='nf4012CableTools';quickTools.hidden=true;quickTools.setAttribute('aria-label','Alat koneksi workspace aktif');
 canvas.before(quickTools);quickTools.append(panel.querySelector('.nf400-tools'),$('nf400Status'));
 panel.querySelector('.nf400-tools')?.setAttribute('data-legacy-toolbar','true');
 const diagnostics=document.createElement('section');diagnostics.id='nf401Diagnostics';diagnostics.innerHTML='<h4>🧪 Uji Konektivitas Terpadu (Free Lab)</h4><p>Memeriksa jalur dan IPv4 antarperangkat pada graf Free Lab.</p><label>Asal <select id="nf401Source"></select></label><label>Tujuan <select id="nf401Target"></select></label><button id="nf401Ping" type="button">Ping / Uji Jalur</button><div id="nf401Result" role="status" aria-live="polite">Tambahkan dua perangkat dan hubungkan untuk memulai.</div>';panel.append(diagnostics);
 $('nf401Ping').addEventListener('click',()=>{const result=ping(Number($('nf401Source').value),Number($('nf401Target').value));const nodes=result.path?.map(id=>node(id)?.name||id).join(' → ');$('nf401Result').textContent=(result.ok?'✓ ':'⚠ Iga: ')+result.reason+(nodes?' · Jalur: '+nodes:'')+(result.ok?' · '+result.sourceIP+' → '+result.targetIP+' · time='+result.latencyMs+' ms · TTL='+result.ttl:'');});
 const traceButton=document.createElement('button');traceButton.type='button';traceButton.id='nf4029Trace';traceButton.textContent='Traceroute';$('nf401Ping').after(traceButton);
 const routeButton=document.createElement('button');routeButton.type='button';routeButton.id='nf4029Routes';routeButton.textContent='Tabel Routing';traceButton.after(routeButton);
 const detail=document.createElement('pre');detail.id='nf4029Detail';detail.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace;max-height:260px;overflow:auto;padding:10px;border-radius:8px;background:rgba(8,19,34,.75);color:#c7e9fe';routeButton.after(detail);
 traceButton.addEventListener('click',()=>{const r=ping(Number($('nf401Source').value),Number($('nf401Target').value));const perHop2=r.ok&&(r.path?.length||0)?(r.latencyMs||0)/r.path.length:0;detail.textContent=r.ok?'Traceroute (simulasi):\n'+r.path.map((id,i)=>String(i+1).padStart(2,' ')+'  '+(node(id)?.name||'Device')+(node(id)?.type==='router'?' [L3 gateway]':'')+'  '+(perHop2*(i+1)).toFixed(1)+' ms').join('\n')+'\n✓ '+r.reason+' · TTL='+r.ttl:'⚠ '+r.reason;});
 routeButton.addEventListener('click',()=>{const routers=state.nodes.filter(n=>n.type==='router');detail.textContent=routers.length?routers.map(r=>(r.name||'Router')+' (#'+r.id+')\nDESTINATION          MASK             VIA        PORT / IPv4\n'+routingTable(r).map(t=>[t.network.padEnd(20),t.mask.padEnd(16),t.via.padEnd(10),(t.port+' / '+t.ip)].join(' ')).join('\n')).join('\n\n'):'Belum ada router. Tambahkan router dan atur IP pada port masing-masing.';});

 $('nf403RunMission').addEventListener('click',()=>{if(activeProfile==='free')return;const d=$('nf402Mission');if(d)d.value=activeProfile;window.NetForgeMissionValidator?.run?.();$('nf402MissionPanel')?.scrollIntoView?.({behavior:'smooth',block:'nearest'})});$('nf403ChooseMission').addEventListener('click',()=>{const opener=$('nf372Switch');opener?.click()});$('nf400Search').addEventListener('input',renderInventory);$('nf400Category').addEventListener('change',renderInventory);
 $('nf400Basic').addEventListener('click',()=>openMission('basics'));$('nf400Smart').addEventListener('click',()=>openMission('smart'));$('nf403Office').addEventListener('click',()=>openMission('office'));$('nf400Mixed').addEventListener('click',()=>openMission('free'));
 let _lockedHintFor=null;/* v0.40.92: kunci dedupe pesan panduan mode kabel (butir 5) — nilainya "tool:id-sumber-terkunci", direset saat tool kembali ke Pindah. */
 $('nf400Tool').addEventListener('change',()=>{if($('nf400Tool').value==='move')_lockedHintFor=null;source=null;if($('nf400Tool').value!=='move')inspectorVisible=false;draw();msg($('nf400Tool').value==='delete'?'Iga: Klik perangkat yang ingin dihapus, atau gunakan Hapus Terpilih.':$('nf400Tool').value==='connect'?'Iga: MODE KABEL AKTIF. '+(window.NetForgeActionPanel?.getLockedSource?.()!=null?'Sumber terkunci. Klik perangkat tujuan pada canvas.':'Pilih perangkat sumber pada canvas, lalu klik perangkat tujuan.'):'Alat diubah.');});// v0.59.00: batalkan mode kabel — tombol TERLIHAT + Escape. Sebelumnya
 // tool 'connect'/'disconnect' tidak punya jalan keluar yang terlihat:
 // Escape tidak ditangani untuk tool unified (hanya mode port yang punya),
 // dan tombol Pan tidak membatalkannya. Tombol '✕ Batal' muncul di samping
 // dropdown Tool saat mode kabel aktif; Escape membatalkan dari mana pun
 // (kecuali saat mengetik di input).
 function cancelCableMode(){const t=$('nf400Tool');if(!t)return;const _wasTool=t.value;const locked=window.NetForgeActionPanel?.getLockedSource?.()!=null;const _port=window.NetForgePortConnect?.isActive?.();if(t.value!=='connect'&&t.value!=='disconnect'&&!locked&&!_port)return;source=null;try{window.NetForgeActionPanel?.reset?.()}catch(_e){}try{window.NetForgePortConnect?.exit?.()}catch(_e){}t.value='move';draw();msg(_wasTool==='disconnect'?'Mode putuskan dibatalkan. Kembali ke mode Pindah.':'Mode kabel dibatalkan. Kembali ke mode Pindah.');syncCancelBtn();}/* v0.40.92: pembatalan Putuskan tidak lagi tercatat sebagai "Mode kabel dibatalkan" (audit minor a). */
 function syncCancelBtn(){const b=$('nf400CancelTool'),t=$('nf400Tool');if(!b||!t)return;/* v0.40.92: tampil juga saat mode port (nf4044) aktif — sebelumnya tombol hanya mengikuti tool connect/disconnect + kunci panel, sehingga di mode port ia tetap tersembunyi walau mode kabel sedang aktif. */b.hidden=!(t.value==='connect'||t.value==='disconnect'||window.NetForgeActionPanel?.getLockedSource?.()!=null||window.NetForgePortConnect?.isActive?.());}window.NetForgeCancelTool={sync:syncCancelBtn,cancel:cancelCableMode};window.NetForgeActivityLog=msg;/* v0.40.92: ekspos penulisan Activity Log — msg() hidup di dalam IIFE inventory unified dan tidak terjangkau dari scope nf4044 (IIFE terpisah), sehingga tombol 'Selesai' mode port keluar tanpa jejak (audit live v0.40.88 butir 5). *//* v0.40.92: ekspos cancel agar tombol Batal di panel aksi (nf4019) bisa memakai jalur batal yang sama dengan tombol Batal utama. */
 const _cancelBtn=document.createElement('button');_cancelBtn.type='button';_cancelBtn.id='nf400CancelTool';_cancelBtn.textContent='✕ Batal';_cancelBtn.title='Batalkan mode kabel dan kembali ke Pilih / Geser';_cancelBtn.hidden=true;_cancelBtn.addEventListener('click',()=>cancelCableMode());const _toolLabel=$('nf400Tool')?.closest('label');if(_toolLabel)_toolLabel.after(_cancelBtn);else $('nf400Tool')?.after?.(_cancelBtn);
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(e.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;cancelCableMode();});
 $('nf400Tool').addEventListener('change',()=>syncCancelBtn());
 syncCancelBtn();
$('nf4014ConfigSelected').addEventListener('click',()=>{if(!node(selected)){msg('Iga: Klik perangkat pada canvas terlebih dahulu.');return}inspectorVisible=true;inspector();});$('nf4010DeleteSelected').addEventListener('click',deleteSelected);$('nf400Audit').addEventListener('click',audit);/* v0.40.92 (bonus): "Kosongkan Canvas" dulunya memakai confirm() native (auto-dismiss di browser uji — tombol tampak mati). Kini dua-klik 10 detik, seperti tombol reset/Kosongkan Lab. */let _nf400ClearArmedAt=0;$('nf400Clear').addEventListener('click',()=>{const _btn=$('nf400Clear');const _now=Date.now();if(!_btn||_now-_nf400ClearArmedAt>10000){_nf400ClearArmedAt=_now;if(_btn)_btn.textContent='⚠ Yakin kosongkan? Klik lagi (10 dtk)';msg('Klik Kosongkan Canvas sekali lagi dalam 10 detik untuk mengonfirmasi. Perubahan dapat dibatalkan dengan Undo.');setTimeout(()=>{if(Date.now()-_nf400ClearArmedAt>=10000&&_btn&&_btn.isConnected)_btn.textContent='Kosongkan Canvas'},10100);return}_nf400ClearArmedAt=0;if(_btn)_btn.textContent='Kosongkan Canvas';state={nodes:[],edges:[],nextId:1,spent:0};selected=null;source=null;chaosBrokenKey=null;persist();draw();msg('Canvas dikosongkan.');});
 canvas.addEventListener('dragover',e=>{if((e.dataTransfer?.types||[]).includes('text/plain'))e.preventDefault()});canvas.addEventListener('drop',e=>{const raw=e.dataTransfer?.getData('text/plain')||'';if(!raw.startsWith('netforge-device:'))return;e.preventDefault();add(raw.slice(16),point(e))});
 canvas.addEventListener('pointerdown',e=>{/* v0.40.92: bersihkan penanda ignoreClick yang tertinggal — bila pointerup terlewat, klik berikutnya tidak boleh ditelan selamanya. */if(drag?.ignoreClick)drag=null;const b=e.target.closest('[data-node]');if(!b||e.button!==0||$('nf400Tool').value!=='move')return;if(e.target.closest('.nf400-node-gear'))return;const n=node(b.dataset.node);if(!n)return;drag={id:n.id,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:n.x,y:n.y,moved:false};/* v0.40.92: setPointerCapture DIHAPUS — capture mengalihkan mousedown/mouseup/click/dblclick ke canvas sehingga handler click/dblclick tidak pernah melihat node di tool Pilih/Geser. Drag tetap jalan karena pointermove/pointerup terdaftar di canvas dan event dari node menggelembung ke canvas. */});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;const n=node(drag.id),r=canvas.getBoundingClientRect();if(!n)return;if(Math.abs(e.clientX-drag.startX)+Math.abs(e.clientY-drag.startY)>5)drag.moved=true;if(!drag.moved)return;n.x=clamp(drag.x+(e.clientX-drag.startX)/r.width*100/(window.NetForgeUnifiedViewport?.scale?.()||1),8,92);n.y=clamp(drag.y+(e.clientY-drag.startY)/r.height*100/(window.NetForgeUnifiedViewport?.scale?.()||1),12,84);const moving=canvas.querySelector('[data-node="'+n.id+'"]');if(moving){moving.style.left=n.x+'%';moving.style.top=n.y+'%'}for(const line of canvas.querySelectorAll('#nf400Wires line')){const ei=Number(line.dataset.edge);if(!Number.isInteger(ei))continue;const edge=state.edges[ei];if(!edge)continue;const a=node(edge.a),b=node(edge.b);if(a&&b){line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',b.x);line.setAttribute('y2',b.y)}}});
 canvas.addEventListener('pointerup',e=>{if(!drag||drag.pointerId!==e.pointerId)return;try{canvas.releasePointerCapture(e.pointerId)}catch{}if(drag.moved){spreadNodes(null,drag.id);persist();const last=drag;drag={...last,ignoreClick:true};const _d=drag;setTimeout(()=>{if(drag===_d)drag=null;draw()},0)}else drag=null});
 canvas.addEventListener('pointercancel',e=>{if(!drag||drag.pointerId!==e.pointerId)return;try{canvas.releasePointerCapture(e.pointerId)}catch{}drag=null;draw()});
 /* v0.40.92: fallback klik kabel — bila hit-test DOM pada garis gagal
    (garis tertutup overlay/SVG pointer-events), petakan klik ke edge
    terdekat secara matematis (koordinat user 0–100, ambang 12px layar)
    lalu teruskan sebagai klik pada garis hit-nya. Klik pada kartu node
    dan kontrol lain tidak disentuh. */
 canvas.addEventListener('click',e=>{if(e.defaultPrevented)return;if(e.target.closest('[data-node],button,input,select,textarea,#nf4019Actions,#nf400Panel,#nf400Modebar,#nf400Inventory,.nf400-placeholder'))return;const _r=canvas.getBoundingClientRect();if(!_r.width||!_r.height)return;const _ux=(e.clientX-_r.left)/_r.width*100,_uy=(e.clientY-_r.top)/_r.height*100;let _best=-1,_bestD=12;state.edges.forEach((ed,i)=>{const a=node(ed.a),b=node(ed.b);if(!a||!b)return;/* v0.40.92: ukur jarak ke HIT-LINE yang terrender (geometri jack), bukan ke segmen pusat node — garis terlihat mengikuti posisi jack (nf4045), sehingga klik titik tengahnya bisa meleset >12px dari segmen pusat node dan panel tidak terbuka. Bila hit-line belum ada, pakai geometri pusat node seperti sebelumnya. */let _ax=a.x,_ay=a.y,_bx=b.x,_by=b.y;const _hl=document.querySelector('line.nf400-wire-hit[data-edge="'+i+'"]');if(_hl){const _v=[_hl.getAttribute('x1'),_hl.getAttribute('y1'),_hl.getAttribute('x2'),_hl.getAttribute('y2')].map(Number);if(_v.every(Number.isFinite)){_ax=_v[0];_ay=_v[1];_bx=_v[2];_by=_v[3];}}const vx=_bx-_ax,vy=_by-_ay,L2=vx*vx+vy*vy||1;let t=((_ux-_ax)*vx+(_uy-_ay)*vy)/L2;t=Math.max(0,Math.min(1,t));const px=_ax+t*vx,py=_ay+t*vy,d=Math.hypot((_ux-px)/100*_r.width,(_uy-py)/100*_r.height);if(d<_bestD){_bestD=d;_best=i}});if(_best<0)return;const hit=document.querySelector('line.nf400-wire-hit[data-edge="'+_best+'"]');if(!hit)return;e.stopImmediatePropagation();/* v0.40.92: stopImmediatePropagation (bukan stopPropagation) — handler canvas 5517 di elemen yang sama tetap jalan bila hanya stopPropagation, sehingga klik garis yang berhasil membuka panel tetap mencatat log menyesatkan "Sumber sudah terkunci". */hit.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));});
 canvas.addEventListener('click',e=>{if(drag?.ignoreClick)return;const gear=e.target.closest('.nf400-node-gear');if(gear){const gb=gear.closest('[data-node]');if(gb){const gn=node(gb.dataset.node);if(gn){selected=gn.id;inspectorVisible=true;inspector();$('nf4014CloseInspector')?.focus();msg('Konfigurasi '+(gn.name||registry[gn.type].name)+' dibuka.');}return}}const b=e.target.closest('[data-node]');if(b){const n=node(b.dataset.node);if(n)act(n);return}if(e.target.closest('button,input,select,textarea,#nf4019Actions,#nf400Panel,#nf400Modebar,#nf400Inventory,.nf400-placeholder'))return;/* v0.40.92: klik tombol/panel saat mode kabel aktif bukan "klik canvas yang nyasar" — sebelumnya tiap klik tombol media/panel saat sumber terkunci mencatat "Sumber sudah terkunci" (duplikat). */const tool=$('nf400Tool')?.value;if(tool!=='connect'&&tool!=='disconnect'){_lockedHintFor=null;return;}const _locked=window.NetForgeActionPanel?.getLockedSource?.()??null;const _hintKey=tool+':'+(_locked==null?'':String(_locked));if(_lockedHintFor===_hintKey)return;_lockedHintFor=_hintKey;/* v0.40.92: panduan "Sumber sudah terkunci" hanya SATU KALI per penguncian sumber — sebelumnya tercatat di SETIAP klik non-node (canvas kosong, tombol panel, garis) selama mode kabel aktif. Pesan tetap ada untuk klik pertama yang relevan. */if(tool==='connect')msg('Iga: '+(_locked!=null?'Sumber sudah terkunci. Klik perangkat tujuan pada canvas.':'Pilih perangkat sumber pada canvas, lalu klik perangkat tujuan.'));else msg('Iga: Klik perangkat pertama, lalu perangkat kedua untuk memutus sambungan.');});
 canvas.addEventListener('dblclick',e=>{const b=e.target.closest('[data-node]');if(!b)return;e.preventDefault();const n=node(b.dataset.node);if(!n)return;/* Klik ganda membuka konfigurasi apa pun tool yang aktif — pindah ke tool Pilih/Geser dan batalkan sumber kabel yang tertunda. */$('nf400Tool').value='move';source=null;selected=n.id;inspectorVisible=true;inspector();$('nf4014CloseInspector')?.focus();msg('Konfigurasi '+(n.name||registry[n.type].name)+' dibuka.');});
 // Legacy toolbar actions must operate on the currently visible workspace, not the hidden classic engine.
 const legacyConnect=$('connectBtn');if(legacyConnect)legacyConnect.addEventListener('click',e=>{if(mode!=='mixed')return;e.preventDefault();e.stopImmediatePropagation();$('nf400Tool').value='connect';source=null;draw();msg('Iga: MODE KABEL AKTIF. Pilih jenis kabel (Ethernet/PoE/Wi-Fi), lalu klik perangkat tujuan pada Unified Canvas (sumber sudah dipilih).');$('nf400Canvas')?.scrollIntoView?.({block:'nearest'})},true);
 const legacyValidate=$('validateBtn');if(legacyValidate)legacyValidate.addEventListener('click',e=>{if(mode!=='mixed')return;e.preventDefault();e.stopImmediatePropagation();if(activeProfile!=='free'){$('nf402Mission').value=activeProfile;window.NetForgeMissionValidator?.run?.()}else window.NetForgeMissionValidator?.preview?.();},true);
 // Allow the legacy toolbar to delete the selected node from the unified canvas.
 const legacyDelete=$('removeBtn');if(legacyDelete)legacyDelete.addEventListener('click',e=>{if(mode!=='mixed')return;e.preventDefault();e.stopImmediatePropagation();deleteSelected()},true);
 document.addEventListener('keydown',e=>{if(mode!=='mixed'||!['Delete','Backspace'].includes(e.key)||e.altKey||e.ctrlKey||e.metaKey)return;const t=e.target;if(t&&((t.closest?.('input,textarea,select,[contenteditable="true"]'))||t.isContentEditable))return;if(node(selected)){e.preventDefault();deleteSelected();}});

 // Preserve the native mission picker, but make its Free Lab entry switch to the unified canvas.
 document.addEventListener('click',e=>{const b=e.target.closest('[data-nf372-select="sandbox"]');if(b)setTimeout(()=>setMode('mixed'),0)},true);
 window.addEventListener('netforge:mission-changed',e=>{const requested=e.detail?.mode;if(requested==='smart'&&mode!=='mixed'){mode='smart';document.body.classList.remove('nf400-mixed');$('nf400Panel').hidden=true;renderInventory();draw()}else if(requested==='basic'&&mode!=='mixed'){mode='basic';renderInventory();draw()}});
 renderInventory();draw();let _savedProfile='basics';try{const _p=localStorage.getItem('netforge.universal.active-profile.v1');if(['basics','smart','office','free'].includes(_p))_savedProfile=_p}catch{} // v0.59.00: bila profil tersimpan adalah 'free' (Lab) tetapi ada
 // snapshot misi atau profil misi berisi perangkat, boot kembali
 // ke misi terakhir — bukan Lab kosong (regresi ronde lalu: hard
 // reload berhenti di Lab kosong dengan "Lanjut Bermain" mati).
 let _bootProfile=_savedProfile;if(_savedProfile==='free'){try{const _snap=localStorage.getItem('netforge.lab.mission-snapshot.v1');if(_snap){const _g=JSON.parse(_snap);const _own=_g&&(_g.profile||_g.mission);if(_own&&['basics','smart','office'].includes(_own)&&_g.nodes&&_g.nodes.length)_bootProfile=_own;else if(_g&&_g.nodes&&_g.nodes.length)_bootProfile='basics'}if(_bootProfile==='free'){for(const _p of['basics','smart','office']){const _v=JSON.parse(localStorage.getItem('netforge.universal.mission.v2.'+_p)||'null');if(_v&&Array.isArray(_v.nodes)&&_v.nodes.length){_bootProfile=_p;break}}}}catch(_e){}}openMission(_bootProfile);/* v0.40.92: segarkan header budget setelah canvas mixed aktif — updateStats klasik sebelumnya hanya jalan sebelum kelas mixed ditambahkan, sehingga header tertahan di $1.000. */try{if(typeof window.updateStats==='function')window.updateStats()}catch{}
 const cfg=$('nf400Inspector'),cv=$('nf400Canvas');if(cfg&&cv){
 const oldDock=$('nf4015Workspace');if(oldDock){oldDock.parentNode.insertBefore(cv,oldDock);oldDock.remove();}
 const overlay=document.createElement('div');overlay.id='nf4016Modal';overlay.hidden=true;overlay.setAttribute('role','presentation');
 const sheet=document.createElement('section');sheet.id='nf4016Dialog';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-label','Konfigurasi perangkat');sheet.tabIndex=-1;
 overlay.append(sheet);sheet.append(cfg);document.body.append(overlay);
 overlay.addEventListener('pointerdown',e=>{if(e.target!==overlay)return;inspectorVisible=false;inspector();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden){e.preventDefault();inspectorVisible=false;inspector();$('nf400Canvas')?.focus?.();}},true);
 const logPanel=document.createElement('section');logPanel.id='nf4016Activity';logPanel.innerHTML='<div class="nf4016-log-head"><strong>📋 Log Aktivitas Workspace</strong><button type="button" id="nf4016ClearLog">Bersihkan Log</button></div><p>Riwayat aksi selama sesi bermain. Tidak mencatat password, token login, atau isi pengaturan pribadi.</p><ol id="nf4016Log" aria-live="polite" aria-relevant="additions"></ol>';
 $('nf400Panel').prepend(logPanel);
 $('nf4016ClearLog').addEventListener('click',()=>{$('nf4016Log').replaceChildren();msg('Log sesi dibersihkan.');});
 const diag=$('nf401Diagnostics');if(diag){const details=document.createElement('details');details.id='nf4016Diagnostics';const summary=document.createElement('summary');summary.textContent='🧪 Alat diagnostik: Ping / Uji Jalur';diag.before(details);details.append(summary,diag);}
 msg('Workspace siap. Klik sekali untuk memilih; klik dua kali perangkat untuk membuka konfigurasi.');
 } }
function nf4044ConnectPorts(aId,pa,bId,pb,medium){
 if(mode!=='mixed')return {ok:false,reason:'Buka workspace jaringan terlebih dahulu.'};
 const a=node(Number(aId)),b=node(Number(bId));
 if(!a||!b||a.id===b.id)return {ok:false,reason:'Pilih port pada dua perangkat yang berbeda.'};
 if(state.edges.some(e=>!e.disabled&&((e.a===a.id&&e.b===b.id)||(e.a===b.id&&e.b===a.id))))return {ok:false,reason:'Kedua perangkat sudah terhubung. Putuskan link sebelumnya jika ingin mengganti port.'};
 if(state.edges.some(e=>e.disabled&&((e.a===a.id&&e.b===b.id)||(e.a===b.id&&e.b===a.id))))return {ok:false,reason:'Pasangan ini sudah punya kabel yang sedang rusak (LINK DOWN). Aktifkan kembali lewat panel kabel, atau hapus kabelnya lalu sambung ulang.'};
 if(!registry[a.type].ports.includes(pa)||!registry[b.type].ports.includes(pb))return {ok:false,reason:'Port tidak tersedia pada perangkat tersebut.'};
 if(used(a.id,pa)||used(b.id,pb))return {ok:false,reason:'Salah satu port telah dipakai oleh kabel lain.'};
 const c=nf4031Compatible(a,pa,b,pb,medium,nf4031Difficulty()==='hard');
 if(!c.ok)return {ok:false,reason:c.reason};
 // v0.59.00: penjaga affordability seperti connect() — sebelumnya
 // kabel port-connect mendorong budget di bawah lantai darurat −$50
 // tanpa pemeriksaan. Pesan sama persis dengan jalur connect().
 if(!canAfford(NF4072_CABLE_COST))return {ok:false,reason:'Budget tidak cukup untuk kabel ($'+NF4072_CABLE_COST+'). Sisa budget $'+budgetNow().toLocaleString('en-US')+'. '+emergencyShort(NF4072_CABLE_COST,'kabel')+' Jual perangkat untuk memulihkan budget.'};
 state.edges.push({uid:nf4092EdgeUid(),a:a.id,b:b.id,medium,portA:pa,portB:pb});
 const _em=emergencyNote(NF4072_CABLE_COST);persist();draw();msg('✓ Kabel '+a.name+':'+pa+' ↔ '+b.name+':'+pb+' · '+medium.toUpperCase()+'. '+c.reason+(_em||(' Sisa budget $'+budgetNow().toLocaleString('en-US')+'.')));
 window.dispatchEvent(new CustomEvent('netforge:link-created',{detail:{from:a.id,to:b.id,portA:pa,portB:pb,medium}}));
 return {ok:true,reason:c.reason};
}

// v0.59.00: controlled link maintenance; mutations use normal persistence/history.
function nf4046LinkDetails(index){
 const e=state.edges[Number(index)];if(!e)return null;
 const a=node(e.a),b=node(e.b);if(!a||!b)return null;
 const reason=linkReason(e);
 const pa=nf4031Port(a,e.portA),pb=nf4031Port(b,e.portB);
 const speed=(pa.kind==='wifi'||pb.kind==='wifi')?null:Math.min(pa.speed,pb.speed);
 return {index:Number(index),aId:a.id,bId:b.id,aName:a.name||registry[a.type]?.name||a.type,bName:b.name||registry[b.type]?.name||b.type,
  portA:e.portA||'AUTO',portB:e.portB||'AUTO',medium:e.medium||'ethernet',disabled:!!e.disabled,
  up:!reason,reason:reason||'Port dan media kompatibel; link aktif menurut simulator.',speedMbps:speed};
}
function nf4046ManageLink(index,action){
 if(mode!=='mixed')return {ok:false,reason:'Buka workspace jaringan terlebih dahulu.'};
 const e=state.edges[Number(index)];if(!e)return {ok:false,reason:'Kabel tidak ditemukan; pilih ulang kabel.'};
 // v0.59.00: catat apakah toggle ini memulihkan kabel Chaos SEBELUM
 // kunci dibersihkan — konfirmasi 'Insiden selesai...' harus tampil
 // seperti jalur repair $25 (sebelumnya panel langsung menampilkan
 // 'Belum ada gangguan...' tanpa konfirmasi).
 const wasChaosFixed=action==='toggle'&&!!e.disabled&&chaosEdgeKey(e)===chaosBrokenKey;
 if(action==='toggle'){e.disabled=!e.disabled;if(!e.disabled&&chaosEdgeKey(e)===chaosBrokenKey){chaosBrokenKey=null;e.chaos=false;e.chaosAnimal='';}}
 else if(action==='remove'){if(chaosEdgeKey(e)===chaosBrokenKey)chaosBrokenKey=null;state.edges.splice(Number(index),1)}
 else return {ok:false,reason:'Tindakan kabel tidak dikenal.'};
 persist();draw();
 const reason=action==='remove'?'Kabel dihapus.':'Link '+(e.disabled?'dinonaktifkan untuk simulasi gangguan.':'diaktifkan kembali.');
 msg('Iga: '+reason);
 window.dispatchEvent(new CustomEvent('netforge:link-changed',{detail:{action,index:Number(index),reason}}));
 // v0.59.00: konfirmasi ditulis ke #eventArea secara sinkron dan ke
 // #eventRightContent via queueMicrotask — diantre SETELAH refresh
 // sinkron dari link-changed dan refresh dari microtask persist(),
 // jadi teks konfirmasi bertahan (pola yang sama seperti repair $25).
 if(wasChaosFixed){const _r=document.getElementById('eventRightContent'),_a=document.getElementById('eventArea');if(_a)_a.textContent='Insiden selesai. Area kembali aman (untuk sekarang).';if(_r)queueMicrotask(()=>{_r.textContent='Insiden selesai. Area kembali aman (untuk sekarang).';});/* v0.40.92: segarkan gelembung Iga — sebelumnya perbaikan lewat 'Aktifkan Link' hanya menulis msg() (baris status), sehingga gelembung tetap menampilkan pesan Chaos ('Kucing Nakal...'). */try{if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay('Kabel sudah aman. Insiden selesai — jaringan kembali normal.','success')}catch(_e){}}else if(action==='toggle'){/* v0.40.92: segarkan gelembung Iga saat toggle link biasa — sebelumnya jalur ini hanya msg() (baris status), sehingga setelah 'Nonaktifkan Link' gelembung utama tetap menampilkan pesan lama ('Koneksi berhasil diputus.') padahal log dan toast sudah berubah (audit live v0.40.88 butir 1). Pesan say() memakai reason yang sama dengan msg()/log, untuk disable DAN enable. */try{if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay(reason,'think')}catch(_e){}}
 return {ok:true,reason};
}

window.NetForgeUniversalInventory={version:'0.40.47',catalog,getMode:()=>mode,getProfile:()=>activeProfile,setMode,openMission,add:(type,p)=>{if(mode==='mixed')add(type,p);else addCurrent(type)},audit,diagnose,ping,routingTable,routerInterfaces,routeFor,forwardRoute,exportGraph:()=>structuredClone(state),importGraph:(g)=>{if(!g||!Array.isArray(g.nodes)||!Array.isArray(g.edges))return false;state={nodes:structuredClone(g.nodes),edges:nf4092EnsureEdgeUids(structuredClone(g.edges)),nextId:Number.isInteger(g.nextId)?g.nextId:1,spent:Number.isFinite(g.spent)?g.spent:0};selected=null;source=null;drag=null;inspectorVisible=false;chaosBrokenKey=null;rebindChaosFromEdges();nf4023ResetHistory();persist();draw();return true},getState:()=>structuredClone(state),classicView:()=>{const maskToPrefix=m=>{if(!validMask(m||''))return '24';return String(m.split('.').reduce((s,o)=>s+Number(o).toString(2).replace(/0/g,'').length,0))};const nodes=state.nodes.map(n=>{const _fr=n.type!=='router'&&addressMode(n)==='dhcp'?firstDhcpRouter():null;const ip=effectiveIP(n)||(_fr?dhcpLease(n,_fr)||'':'');const cfg={ip:n.type==='router'?(validIP(n.ip||'')?n.ip:''):ip,prefix:maskToPrefix(effectiveMask(n)),gateway:effectiveGateway(n)||(_fr?routerIP(_fr):''),mode:addressMode(n),dhcp:n.dhcp!==false,dns:n.dns||'',vlan:n.vlan||'',iface:n.iface||''};return {id:n.id,type:(n.type==='laptop'?'pc':n.type),x:n.x,y:n.y,name:n.name,config:cfg}});const links=state.edges.map(e=>({a:e.a,b:e.b,portA:e.portA,portB:e.portB,broken:!!e.disabled}));return {nodes,links}},getSelected:()=>selected,selectNode:(id)=>{const n=node(id);if(!n)return false;selected=n.id;draw();return true},resetCanvas:()=>{state=emptyGraph();spreadNodes();nf4023ResetHistory();chaosBrokenKey=null;selected=null;source=null;inspectorVisible=false;persist();draw();return true},undo:()=>nf4023Travel('undo'),redo:()=>nf4023Travel('redo'),history:()=>({undo:nf4023Undo.length,redo:nf4023Redo.length}),isLinkActive:linkActive,wifiStatus,connectPorts:nf4044ConnectPorts,linkDetails:nf4046LinkDetails,manageLink:nf4046ManageLink,chaosActive:()=>!!chaosEdge(),/* v0.40.92: chaosActive()/chaosIncident() diturunkan dari kabel insiden (chaosEdge(): kunci dulu, lalu flag e.chaos) — sebelumnya hanya chaosBrokenKey (memori), sehingga insiden hilang setiap kali graf dimuat ulang (audit live v0.40.90 butir 1). chaosIncident() kini juga mengembalikan hewan pemicu (butir 5). */chaosIncident:()=>{const e=chaosEdge();if(!e)return null;const d=nf4046LinkDetails(state.edges.indexOf(e));return {key:chaosEdgeKey(e),a:d?.aName||node(e.a)?.name||'Perangkat',b:d?.bName||node(e.b)?.name||'Perangkat',medium:e.medium||'ethernet',animal:e.chaosAnimal||null};},chaosRebind:(key)=>{if(!key)return false;const e=state.edges.find(x=>chaosEdgeKey(x)===key&&x.disabled);if(!e)return false;chaosBrokenKey=key;e.chaos=true;return true;},chaosBreak:(animal)=>{if(chaosBrokenKey||state.edges.some(e=>e.chaos&&e.disabled))return {ok:false,reason:'active'};const act=state.edges.filter(e=>linkActive(e));if(!act.length)return {ok:false,reason:'no-edge'};const e=act[Math.floor(Math.random()*act.length)];e.disabled=true;e.chaos=true;if(animal)e.chaosAnimal=animal;chaosBrokenKey=chaosEdgeKey(e);persist();draw();/* v0.40.92: dispatch link-changed — sebelumnya Chaos menonaktifkan kabel TANPA event, sehingga toast fault nf4047 tidak pernah disegarkan dari jalur ini (butir 10). */window.dispatchEvent(new CustomEvent('netforge:link-changed',{detail:{action:'chaos',index:state.edges.indexOf(e),reason:'Kabel diganggu Chaos.'}}));return {ok:true,a:node(e.a)?.name||'Perangkat',b:node(e.b)?.name||'Perangkat',medium:e.medium};},chaosRepair:()=>{const e=chaosEdge();if(!e||!e.disabled)return {ok:false,reason:'Tidak ada kabel chaos yang perlu diperbaiki.'};if(!canAfford(25))return {ok:false,reason:'Dana tidak cukup untuk perbaikan ($25). Sisa budget $'+budgetNow().toLocaleString('en-US')+'. '+emergencyShort(25,'perbaikan')+' Putuskan kabel (gratis) lalu sambung ulang.'};const _em=budgetNow()-25<0;state.spent=(state.spent||0)+25;e.disabled=false;e.chaos=false;e.chaosAnimal='';chaosBrokenKey=null;persist();draw();/* v0.40.92: dispatch link-changed (lihat chaosBreak) — toast fault ikut hilang saat kabel diperbaiki. */window.dispatchEvent(new CustomEvent('netforge:link-changed',{detail:{action:'repair',index:state.edges.indexOf(e),reason:'Kabel Chaos diperbaiki.'}}));return {ok:true,emergency:_em};},/* v0.40.92: chaosRestoreLive(incident) — terapkan ulang insiden yang masih hidup ke graf yang BARU dipulihkan (dipakai leave()/openMission): cari kabel yang sama (kunci, lalu ujung a/b bila port berubah), nonaktifkan + tandai flag-nya + ikat kunci, lalu persist agar insiden tersimpan di profil misi. Dipakai bila chaosRebind gagal karena graf pulihan berisi kabel LINK UP (kasus Chaos di Lab: snapshot pra-Lab). */chaosRestoreLive:(incident)=>{if(!incident||!incident.key)return false;let e=state.edges.find(x=>chaosEdgeKey(x)===incident.key);/* v0.40.92 B3: tanpa fallback endpoint — hanya kabel dengan kunci yang SAMA PERSIS yang dipulihkan. Fallback lama mencocokkan kabel BARU yang kebetulan berujung sama (tanpa memeriksa port/uid) dan mematikannya lagi (audit live v0.40.91 B3). Kunci uid ("uid:...") hanya cocok dengan kabel aslinya; kunci port lama (simpanan pra-patch, tanpa uid) tetap cocok persis port-nya, sehingga pemulihan insiden Lab->Misi yang sah (v0.40.91 butir 1) dipertahankan. */if(!e)return false;e.disabled=true;e.chaos=true;if(incident.animal)e.chaosAnimal=incident.animal;chaosBrokenKey=chaosEdgeKey(e);persist();draw();return true;}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf402-unified-mission-assessment === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const autoRecorded={};
const RULES={
 basics:{label:'Network Basics — LAN Fundamental',description:'Router ↔ Switch ↔ PC; verifikasi jalur dan IPv4 pada jaringan sederhana.'},
 smart:{label:'Smart Home — Mixed Network',description:'Modem ISP, Router/AP, Smart TV, kamera PoE, NVR, dan IoT pada satu graf.'},
 office:{label:'Office Starter — LAN, Firewall & Printer',description:'Router, Firewall, Switch, PC, Server, dan Network Printer; uji jalur aman serta IPv4.'}
};
const api=()=>window.NetForgeUniversalInventory;
function assess(profile='basics',graph){
 if(!RULES[profile])profile='basics';
 const snap=graph||api()?.getState?.()||{nodes:[],edges:[]};
 const nodes=Array.isArray(snap.nodes)?snap.nodes:[],edges=Array.isArray(snap.edges)?snap.edges:[];
 const byId=new Map(nodes.map(n=>[String(n.id),n]));
 const first=type=>nodes.find(n=>n.type===type);
 const aType=(...types)=>nodes.find(n=>types.includes(n.type));
 function path(a,b,filter){if(!a||!b)return null;if(a.id===b.id)return [String(a.id)];let q=[[String(a.id)]],seen=new Set([String(a.id)]);while(q.length){const p=q.shift(),end=p[p.length-1];for(const e of edges){if(!api()?.isLinkActive?.(e))continue;if(filter&&!filter(e))continue;const x=String(e.a),y=String(e.b),next=x===end?y:y===end?x:null;if(next===null||seen.has(next)||!byId.has(next))continue;const candidate=[...p,next];if(next===String(b.id))return candidate;seen.add(next);q.push(candidate)}}return null}
 const linked=(a,b,medium)=>edges.some(e=>a&&b&&((String(e.a)===String(a.id)&&String(e.b)===String(b.id))||(String(e.b)===String(a.id)&&String(e.a)===String(b.id)))&&(!medium||e.medium===medium)&&api()?.isLinkActive?.(e));
 const results=[];
 const check=(id,label,ok,why,na)=>results.push({id,label,ok:!!ok&&!na,na:!!na,detail:na?'Tidak dipakai pada topologi ini.':(ok?'Terpenuhi':why)});
 const ipConfigured=(n,pingOk)=>!!(n&&(n.ipMode||n.ip||pingOk));
 const router=first('router'),sw=first('switch'),pc=first('pc'),ap=aType('ap','router'),tv=first('tv'),camera=first('camera'),nvr=first('nvr'),iot=first('iot'),server=first('server'),modem=first('modem'),firewall=first('firewall'),printer=first('printer');
 const ipTest=(a,b)=>{if(!a||!b)return {ok:false,reason:'Perangkat belum tersedia.'};try{return api()?.ping?.(a.id,b.id)||{ok:false,reason:'Mesin uji IP belum siap.'}}catch{return {ok:false,reason:'Uji alamat IP belum tersedia.'}}};
 if(profile==='basics'){
  const clients=nodes.filter(n=>['pc','laptop','tablet','phone'].includes(n.type));
 const paths=clients.map(n=>path(n,router));
 const switchInPath=!sw||!edges.some(e=>String(e.a)===String(sw.id)||String(e.b)===String(sw.id))||!!path(sw,router);
 check('basics-devices','Router dan minimal satu perangkat klien tersedia',!!router&&clients.length>0,'Pasang Router serta Desktop PC, Laptop, Tablet, atau Smartphone.');
 check('basics-cable','Semua klien mempunyai jalur Ethernet atau Wi-Fi aktif',!!router&&clients.length>0&&paths.every(Boolean),'Gunakan Ethernet untuk port LAN, atau Wi-Fi dengan adaptor, SSID, password, dan band yang sesuai.');
 if(sw)check('basics-switch','Switch yang digunakan memiliki uplink aktif',switchInPath,'Jika memakai Switch, hubungkan uplink ke Router/AP. Switch tidak wajib.');
  if(modem)check('basics-wan','Modem ISP terhubung ke Router (uplink Internet)',!!path(modem,router),'Hubungkan Modem ISP (LAN1) ke port WAN/LAN Router.');
 const tests=clients.map(p=>ipTest(p,router));const configuredOk=clients.length>0&&clients.every((n,i)=>ipConfigured(n,tests[i]&&tests[i].ok));check('basics-ip','IPv4 seluruh klien dapat menjangkau Router',!!router&&tests.length>0&&tests.every(t=>t.ok)&&configuredOk,configuredOk?('Iga: '+(tests.find(t=>!t.ok)?.reason||'Periksa DHCP, subnet, atau autentikasi Wi-Fi.')):'Buka konfigurasi tiap klien dan simpan mode IP (DHCP atau statis). IP efektif dari DHCP dihitung sebagai konfigurasi.');
 }else if(profile==='smart'){
  check('smart-devices','Perangkat Smart Home lengkap (termasuk Modem ISP)',modem&&ap&&sw&&tv&&camera&&nvr&&iot,'Tambahkan Modem ISP, Router/AP, PoE Switch, Smart TV, IP Camera, NVR dan IoT Sensor.');
  check('smart-wan','Modem ISP ↔ Router/AP terhubung (Internet aktif)',!!path(modem,ap),'Hubungkan Modem ISP ke Router/AP menggunakan kabel Ethernet.');
  check('smart-backhaul','Router/AP ↔ Switch terhubung',!!path(ap,sw),'Buat koneksi uplink Router/AP ke PoE Switch.');
  check('smart-tv','Smart TV mempunyai jalur ke Router/AP',!!path(tv,ap),'Hubungkan TV melalui Wi-Fi atau Ethernet sehingga mencapai Router/AP.');
  check('smart-iot','IoT terhubung melalui Wi-Fi ke Router/AP',linked(iot,ap,'wifi'),'Hubungkan IoT Sensor langsung ke Router/AP dengan Wi-Fi.');
  const poe=edges.some(e=>e.medium==='poe'&&api()?.isLinkActive?.(e)&&camera&&sw&&((String(e.a)===String(sw.id)&&String(e.b)===String(camera.id))||(String(e.b)===String(sw.id)&&String(e.a)===String(camera.id))));
  check('smart-poe','IP Camera memperoleh jalur PoE dari switch',poe,'Gunakan koneksi PoE antara Switch dan IP Camera.');
  check('smart-recording','IP Camera mempunyai jalur ke NVR',!!path(camera,nvr),'Hubungkan NVR ke jaringan switch agar kamera dapat menjangkaunya.');
 }else{
  check('office-devices','Router, Firewall, Switch, PC, Server & Printer tersedia',router&&firewall&&sw&&pc&&server&&printer,'Tambahkan Router, Firewall, Switch, Desktop PC, Server, dan Network Printer.');
  check('office-security','Jalur keamanan Router ↔ Firewall ↔ Switch aktif',!!path(router,firewall)&&!!path(firewall,sw),'Hubungkan Router ke Firewall lalu dari Firewall ke Switch menggunakan Ethernet.');
  check('office-clients','PC dan Server terhubung ke Switch',!!path(pc,sw)&&!!path(server,sw),'Hubungkan Desktop PC dan Server ke Switch melalui Ethernet.');
  check('office-printer','Network Printer terhubung ke jaringan kantor',!!path(printer,sw),'Hubungkan Network Printer (ETH0) ke Switch atau Router kantor.');
  if(modem)check('office-wan','Modem ISP terhubung ke Router/Firewall (uplink Internet)',!!path(modem,router)||!!path(modem,firewall),'Hubungkan Modem ISP ke port WAN Router atau Firewall.');
  const t=ipTest(pc,server);const cfgOk=ipConfigured(pc,t.ok)&&ipConfigured(server,t.ok);check('office-ip','Konektivitas IPv4 PC ↔ Server',t.ok&&cfgOk,cfgOk?('Iga: '+(t.reason||'Periksa IPv4 dan DHCP.')):'Buka konfigurasi PC dan Server, lalu simpan mode IP masing-masing.');
 }
 // Preserve legacy and official scores: this is a separate local checklist, never a server score.
 const counted=results.filter(x=>!x.na);
 const passed=counted.filter(x=>x.ok).length;
 return {profile,version:'0.40.31',passed,total:counted.length,score:counted.length?Math.round(100*passed/counted.length):0,complete:counted.length>0&&passed===counted.length,results,official:false};
}
function render(commit=false,viaChange=false){const select=$('nf402Mission'),out=$('nf402Results');if(!select||!out)return;const report=assess(select.value);out.replaceChildren();const summary=document.createElement('div');const prog=window.NetForgeMissionProgress?.getState?.()?.[report.profile]||null;const recordedComplete=!!prog?.completed;const displayScore=report.score;const neutralCount=report.results.filter(r=>r&&r.na).length;const latched=recordedComplete;const displayComplete=report.complete||latched;summary.className='nf402-summary'+(displayComplete?'':' nf402-fail');summary.textContent=(displayComplete?(latched?'✓ LULUS · terkunci':'✓ LULUS'):'⚠ BELUM LULUS')+' · '+report.passed+'/'+report.total+' pemeriksaan dinilai'+(neutralCount?' · '+neutralCount+' netral':'')+' · '+displayScore+'/100 (lokal)'+(recordedComplete?' · pernah lulus, skor terbaik '+prog.best+'/100':'');out.append(summary);if(latched&&!report.complete){const failing=report.results.filter(r=>r&&!r.na&&!r.ok);const incident=document.createElement('div');incident.className='nf402-check';const warn=document.createElement('div');warn.innerHTML='<strong>⚠ Insiden aktif (bukan pembatal kelulusan):</strong> '+failing.length+' pemeriksaan konektivitas sedang gagal'+(failing.length?' ('+failing.map(f=>f.label).join('; ')+')':'')+' — kemungkinan kabel putus (mis. Chaos). Perbaiki link untuk memulihkan kondisi penuh; kelulusan misi tetap terkunci.';incident.append(warn);out.append(incident);}
 for(const item of report.results){const div=document.createElement('div');div.className='nf402-check';const sign=document.createElement('span');sign.textContent=item.na?'–':item.ok?'✅':'⚠️';const content=document.createElement('div');const strong=document.createElement('strong');strong.textContent=item.label;content.append(strong);if(!item.ok){const info=document.createElement('div');info.textContent=item.detail;info.className='nf402-fail';content.append(info)}div.append(sign,content);out.append(div)}
 const note=document.createElement('p');note.className='nf402-note';note.textContent='Kelulusan pertama: hadiah misi +250/+350/+500 (per kesulitan) + 50×nomor misi, + 100 XP bonus validator. Total dijumlahkan di header. Pengulangan misi: 0 XP. Skor lokal, bukan XP resmi server.';note.style.cssText='white-space:normal;overflow:visible;text-overflow:clip;max-width:none;display:block;line-height:1.5';out.append(note);
 if(window.NetForgeUniversalInventory?.getMode?.()==='mixed'&&!window.NetForgeClassicMission?.active?.()){
  /* v0.40.92: di Lab, panel Objective menampilkan progres Lab — sebelumnya render() TIDAK menimpa #objectives/#progressText saat Lab aktif, sehingga panel mempertahankan "4 / 4 objective Unified Canvas · LULUS (terkunci)" dari misi terakhir di atas canvas Lab yang kosong (audit live v0.40.87 butir 1). Kini render() menulis progres Lab (dari NetForgeLabProgress, sumber yang sama dengan diagnostik Iga): Guided = 5 tahap, Free/Challenge = 4 pemeriksaan. Panel #nf402Results sendiri tetap menunjukkan hasil validator misi. */
  if(window.NetForgeLab&&window.NetForgeLab.active&&window.NetForgeLab.active()){
   const _lp=window.NetForgeLabProgress?window.NetForgeLabProgress():null;
   if(_lp){
    const targets=$('objectives'),progress=$('progressBar'),label=$('progressText');
    if(targets){targets.replaceChildren();for(const item of (_lp.checks||[])){const line=document.createElement('div');line.className='objective';const sign=document.createElement('span');sign.textContent=item.ok?'✓':'○';const text=document.createElement('span');text.textContent=item.name;line.append(sign,text);targets.append(line)}}
    if(progress)progress.style.width=(100*_lp.done/Math.max(1,_lp.total))+'%';
    if(label)label.textContent=_lp.label+' · '+(_lp.mode==='guided'?'Guided Lab':_lp.mode==='challenge'?'Challenge Lab':'Free Lab')+(_lp.complete?' · LULUS':'');
   }
  }else{
   const targets=$('objectives'),progress=$('progressBar'),label=$('progressText');
   if(targets){targets.replaceChildren();for(const item of report.results){const line=document.createElement('div');line.className='objective';const sign=document.createElement('span');sign.textContent=item.na?'–':item.ok?'✓':'○';const text=document.createElement('span');text.textContent=item.label;line.append(sign,text);targets.append(line)}}
   if(progress)progress.style.width=(displayComplete?100:(100*report.passed/Math.max(1,report.total)))+'%';
   if(label)label.textContent=report.passed+' / '+report.total+' objective Unified Canvas'+(displayComplete?(latched?' · LULUS (terkunci)':' · LULUS'):'');
  }
 }
 if(commit===true){window.NetForgeMissionProgress?.record?.(report);autoRecorded[report.profile]=true;}
 // v0.59.00: auto-record dulu jalan di SETIAP render() — termasuk preview saat
 // muat ulang — sehingga satu evaluasi eksplisit tercatat 2x (commit + auto)
 // dan setiap reload dengan topologi lulus menambah "evaluasi" serta bisa
 // mencap stempel "Pertama lulus" di waktu muat. Kini auto-record hanya saat
 // perubahan graf (bukan preview/muat) dan hanya bila riwayat tersimpan belum
 // menunjukkan lulus; evaluasi eksplisit tetap tercatat lewat commit.
 if(report.complete&&viaChange&&!autoRecorded[report.profile]&&!prog?.completed){autoRecorded[report.profile]=true;window.NetForgeMissionProgress?.record?.(report);}else if(!report.complete){autoRecorded[report.profile]=false;}
 window.NetForgeMissionProgress?.syncXP?.();
}
function init(){const parent=$('nf400Panel');if(!parent||$('nf402MissionPanel'))return;const section=document.createElement('section');section.id='nf402MissionPanel';section.innerHTML='<h4>🎯 Unified Mission Validator</h4><p>Evaluasi perangkat dan koneksi <strong>pada workspace misi yang sedang aktif</strong>.</p><div class="nf402-bar"><label for="nf402Mission">Skenario</label><select id="nf402Mission"><option value="basics">Network Basics — LAN Fundamental</option><option value="smart">Smart Home — Mixed Network</option><option value="office">Office Starter — LAN & Server</option></select><button type="button" id="nf402Run">Jalankan Evaluasi</button></div><div id="nf402Results" role="status" aria-live="polite"></div>';parent.append(section);$('nf402Run').addEventListener('click',()=>render(true));$('nf402Mission').addEventListener('change',()=>render(false));render(false)}
window.addEventListener('netforge:unified-graph-changed',()=>render(false,true));
window.addEventListener('netforge:unified-mission-opened',e=>{const value=e.detail?.profile;if(value&&RULES[value]&&$('nf402Mission'))$('nf402Mission').value=value;render(false)});
  /* v0.40.92: render ulang saat Guided selesai — penyelesaian Guided (nf27Check -> saveProgress() -> render()) hanya mendispatch 'netforge:guided-progress' tanpa perubahan graf, sementara validator hanya mendengarkan 'netforge:unified-graph-changed' dan 'netforge:unified-mission-opened', sehingga panel Objective tetap 'Tahap 3 / 5' sampai keluar-masuk Lab (audit live v0.40.88 butir 4). NetForgeLabProgress() membaca closure nf27 secara sinkron, jadi render ini langsung melihat finished=true. */
  window.addEventListener('netforge:guided-progress',()=>render(false));
window.NetForgeMissionValidator={version:'0.40.31',assess,run:()=>render(true),preview:()=>render(false),profiles:RULES};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf404-mission-progress === */
(()=>{'use strict';
const KEY='netforge.unified.mission.progress.v1';
const PROFILES=['basics','smart','office'];
const NAMES={basics:'Network Basics',smart:'Smart Home Hybrid',office:'Office Starter'};
const $=id=>document.getElementById(id);
let memory={};let stored=false;
function sanitise(obj){const clean={};for(const k of PROFILES){const v=obj&&typeof obj==='object'?obj[k]:null;if(!v||typeof v!=='object')continue;clean[k]={attempts:Math.min(999999,Math.max(0,Number(v.attempts)||0)),best:Math.min(100,Math.max(0,Number(v.best)||0)),completed:Boolean(v.completed),firstCompleted:typeof v.firstCompleted==='string'?v.firstCompleted.slice(0,40):null,lastRun:typeof v.lastRun==='string'?v.lastRun.slice(0,40):null};}return clean}
function load(){try{const raw=localStorage.getItem(KEY);memory=raw?sanitise(JSON.parse(raw)):{};stored=true}catch{stored=false;memory={}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(memory));stored=true}catch{stored=false}}
function snapshot(){return JSON.parse(JSON.stringify(memory))}
const XP_KEY='netforge.local.xp.v1';
// v0.59.00: bonus +100 XP validator hanya untuk kelulusan pertama PER PROFIL
// yang tercatat permanen (netforge.validator.completed.v1). Dulu firstComplete
// hanya melihat memori riwayat (memory[k]) — setelah riwayat dihapus lewat
// "Hapus Catatan Lokal", kelulusan berikutnya memberi +100 lagi (farming lewat
// reset). Flag persisten ini TIDAK dihapus oleh reset misi.
const VKEY='netforge.validator.completed.v1';
function everCompleted(profile){try{const d=JSON.parse(localStorage.getItem(VKEY)||'{}');return !!d[profile]}catch{return false}}
function markEverCompleted(profile){try{const d=JSON.parse(localStorage.getItem(VKEY)||'{}');d[profile]=true;localStorage.setItem(VKEY,JSON.stringify(d))}catch{}}
function syncXP(){let xp=0;try{xp=Math.max(0,Math.min(999999,Number(localStorage.getItem(XP_KEY))||0))}catch{}const el=$('xp');if(el)el.textContent=xp+' XP';const lv=document.querySelector('.level-stat strong');if(lv)lv.textContent='Lv. '+(Math.floor(xp/100)+1);}
function render(){const root=$('nf404Progress');if(!root)return;syncXP();root.querySelector('.nf404-grid').replaceChildren();let finished=0;for(const k of PROFILES){const v=memory[k]||{attempts:0,best:0,completed:false};if(v.completed)finished++;const card=document.createElement('div');card.className='nf404-card';const label=document.createElement('strong');label.textContent=NAMES[k];const detail=document.createElement('span');detail.textContent=(v.completed?'✓ Selesai':'Belum selesai')+' · Skor terbaik '+v.best+'/100 · '+v.attempts+' evaluasi';const time=document.createElement('span');time.textContent=v.firstCompleted?'Pertama lulus: '+new Date(v.firstCompleted).toLocaleString('id-ID'):'Belum ada kelulusan';card.append(label,detail,time);root.querySelector('.nf404-grid').append(card)}root.querySelector('.nf404-summary').textContent=finished+' / 3 misi pernah diselesaikan (catatan lokal, tanpa XP resmi)';root.querySelector('.nf404-storage').textContent=stored?'Riwayat tersimpan di browser ini.':'Penyimpanan browser tidak tersedia; riwayat hanya bertahan selama sesi aktif.';window.dispatchEvent(new CustomEvent('netforge:unified-local-update',{detail:snapshot()}))}
function record(report){if(!report||!PROFILES.includes(report.profile)||!Array.isArray(report.results)||!report.results.length)return false;const k=report.profile;const counted=report.results.filter(r=>r&&!r.na);const total=counted.length,passes=counted.filter(r=>r&&r.ok===true).length;const score=total?Math.round(passes/total*100):0;const complete=total>0&&passes===total;const now=new Date().toISOString();const prev=memory[k]||{attempts:0,best:0,completed:false,firstCompleted:null,lastRun:null};const firstComplete=complete&&!prev.completed&&!everCompleted(k);memory[k]={attempts:Math.min(999999,prev.attempts+1),best:Math.max(prev.best,score),completed:prev.completed||complete,firstCompleted:prev.firstCompleted||(complete?now:null),lastRun:now};save();render();if(firstComplete){markEverCompleted(k);try{const xk='netforge.local.xp.v1';localStorage.setItem(xk,String(Math.max(0,Number(localStorage.getItem(xk))||0)+100));}catch{}}syncXP();return true}
function exportProgress(){const data={format:'netforge-local-progress-v1',version:'0.40.31',exportedAt:new Date().toISOString(),official:false,profiles:snapshot()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='netforge-unified-progress-v0.59.00.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 // v0.59.00: "Hapus Catatan Lokal" dulunya hanya memanggil confirm() native
 // (sering auto-dismiss di browser uji sehingga tombol tampak tidak berfungsi)
 // DAN hanya menghapus memori riwayat validator — topologi, objektif, dan
 // budget misi tidak ikut direset. Kini tombol ini memakai konfirmasi dua-klik
 // (tanpa confirm) dan memanggil reset misi bersama (NetForgeMissionReset):
 // topologi dikosongkan, objektif kembali ke 0 (jumlah objective berbeda per misi: basics 3-4, smart 6, office 4), budget awal, riwayat tampilan
 // dihapus. XP dan flag kelulusan pertama (anti-farming) TIDAK dihapus, jadi
 // pengulangan misi tetap 0 XP.
 let clearArmedAt=0;
 /* v0.40.92: reset misi menghapus progres berjalan (topologi/objektif/evaluasi) TAPI mempertahankan catatan kelulusan pertama + skor terbaik — sesuai klaim dialog reset ("catatan kelulusan pertama tetap tersimpan"). Sebelumnya memory={} menghapus stempel sehingga dialog berbohong. */
 function reset(){const keep={};for(const k in memory){const m=memory[k]||{};if(m.firstCompleted||m.best)keep[k]={attempts:0,best:m.best||0,completed:false,firstCompleted:m.firstCompleted||null,lastRun:null}}memory=keep;save();render()}
 function clear(btn){const now=Date.now();if(!btn||now-clearArmedAt>10000){clearArmedAt=now;if(btn)btn.textContent='⚠ Yakin hapus? Klik lagi (10 dtk)';setTimeout(()=>{if(Date.now()-clearArmedAt>=10000&&btn&&btn.isConnected)btn.textContent='Hapus Catatan Lokal'},10100);return}clearArmedAt=0;if(btn)btn.textContent='Hapus Catatan Lokal';try{window.NetForgeMissionReset?.reset?.('mission')}catch{}reset();if(btn){btn.textContent='✓ Progres misi dihapus';setTimeout(()=>{if(btn.isConnected)btn.textContent='Hapus Catatan Lokal'},3000)}}
function init(){load();const parent=$('nf402MissionPanel');if(!parent||$('nf404Progress'))return;const panel=document.createElement('section');panel.id='nf404Progress';panel.innerHTML='<h4>🏅 Riwayat Misi Unified Canvas</h4><p>Hasil misi disimpan lokal per profil. Skor terbaik tidak berkurang; misi yang sudah lulus tidak dihitung sebagai kelulusan baru ketika evaluasi diulang. Kelulusan pertama tiap misi: hadiah misi +250/+350/+500 (per kesulitan) + 50×nomor misi, ditambah +100 XP bonus validator; keduanya dijumlahkan di header. Pengulangan misi tidak memberi XP.</p><div class="nf404-summary"></div><div class="nf404-grid"></div><p class="nf404-storage"></p><button id="nf404Export" type="button">⬇ Ekspor Riwayat JSON</button><button id="nf404Clear" type="button" title="Hapus progres misi: topologi, objektif, dan evaluasi berjalan. XP, skor terbaik, dan catatan kelulusan pertama tetap tersimpan.">Hapus Catatan Lokal</button><p>Catatan ini bukan sertifikat, XP, atau leaderboard resmi. Penilaian resmi memerlukan validasi backend.</p>';parent.after(panel);$('nf404Export').addEventListener('click',exportProgress);$('nf404Clear').addEventListener('click',e=>clear(e.currentTarget));render()}
window.NetForgeMissionProgress={version:'0.40.31',record,getState:snapshot,render,syncXP,reset,clear};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf407-server-sync === */
(()=>{'use strict';
const $=id=>document.getElementById(id),KEY='netforge.unified.mission.pending.v0406',MAX=8;
const labels={basics:'Network Basics',smart:'Smart Home Hybrid',office:'Office Starter'};
let pending=[],busy=false,verifiedAccount=null,identityEpoch=0;
const clean=x=>x&&labels[x.profile]&&typeof x.attemptId==='string'&&x.topology?.format==='NETFORGE-UNIFIED-1';
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter(clean).slice(-MAX):[]}catch{return []}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(pending));return true}catch{return false}}
function status(msg){if($('nf407Status'))$('nf407Status').textContent=msg}
function show(){const el=$('nf407Queue');if(el){el.replaceChildren();if(!pending.length)el.textContent='Tidak ada pengiriman tertunda.';for(const p of pending){const row=document.createElement('div');row.textContent=`${labels[p.profile]} · ID ${p.attemptId.slice(-10)} · ${p.accountId?'akun #'+p.accountId:'akun lama belum diverifikasi'} · ${new Date(p.time||Date.now()).toLocaleString('id-ID')}`;el.append(row)}}window.dispatchEvent(new CustomEvent('netforge:unified-queue-update',{detail:pending.map(p=>({profile:p.profile,accountId:p.accountId||null,time:p.time}))}));for(const id of ['nf407Retry','nf407Clear','nf407Bind']){const b=$(id);if(b)b.disabled=busy||!pending.length}}
function url(){const u=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');if(!/^https:\/\/[^/]+\/api\/v1$/.test(u)&&!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/v1$/.test(u))throw Error('Atur URL API HTTPS di Pengaturan.');return u}
async function call(method,path,body){const token=await window.NetForgeAuth?.accessToken?.();if(!token)throw Object.assign(Error('Silakan login Google kembali.'),{status:401});const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),14000);try{const response=await fetch(url()+path,{method,headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:controller.signal});const data=await response.json().catch(()=>({}));if(!response.ok)throw Object.assign(Error(data.error||'HTTP '+response.status),{status:response.status});return data}finally{clearTimeout(timeout)}}
async function getAccount(allowCached=false){try{const me=await call('GET','/me');if(!Number.isSafeInteger(me.id)||me.id<=0)throw Error('Respons identitas server tidak valid');verifiedAccount=me.id;return me.id}catch(e){if(allowCached&&verifiedAccount&&window.NetForgeAuth?.isSignedIn?.())return verifiedAccount;throw e}}
function evidence(){const s=window.NetForgeUniversalInventory?.getState?.();if(!Array.isArray(s?.nodes)||!Array.isArray(s?.edges))throw Error('Unified Canvas belum siap.');return{format:'NETFORGE-UNIFIED-1',nodes:s.nodes.map(n=>({id:String(n.id),type:n.type,ipMode:n.ipMode||'dhcp',ip:n.ip||'',mask:n.mask||'255.255.255.0',gateway:n.gateway||''})),edges:s.edges.map(e=>({a:String(e.a),b:String(e.b),medium:e.medium,portA:e.portA,portB:e.portB}))}}
function nextId(){if(typeof crypto?.randomUUID==='function')return'unified_'+crypto.randomUUID().replace(/-/g,'');const b=new Uint8Array(16);crypto.getRandomValues(b);return'unified_'+Array.from(b,x=>x.toString(16).padStart(2,'0')).join('')}
async function send(p){return call('POST','/unified-missions',{attemptId:p.attemptId,profile:p.profile,topology:p.topology})}
function remove(item){pending=pending.filter(x=>x.attemptId!==item.attemptId);persist()}
async function submit(){if(busy)return;const profile=$('nf402Mission')?.value;if(!labels[profile])return status('Pilih profil misi.');if(pending.length>=MAX)return status('Antrean penuh (8). Kirim ulang atau hapus antrean.');busy=true;show();let item;try{const accountId=await getAccount(true);item={attemptId:nextId(),profile,topology:evidence(),accountId,time:Date.now()};pending.push(item);const saved=persist();status(saved?'Percobaan dicatat dalam antrean. Menghubungi server…':'Local Storage tidak tersedia: percobaan hanya ada selama tab ini dibuka.');const result=await send(item);remove(item);status(`Server: ${result.passed?'LULUS':'BELUM LULUS'} · ${result.score}/100 · ${result.replayed?'sudah pernah dicatat':'tersimpan'} · XP resmi 0.`);await history()}catch(e){status(item?`Belum tersinkron (${e.status||'offline/timeout'}): ${e.message}. Gunakan Kirim Ulang saat koneksi pulih.`:`Tidak dapat mengirim: ${e.message}. Verifikasi akun /me diperlukan setidaknya sekali dalam sesi login ini.`)}finally{busy=false;show()}}
async function retry(){if(busy||!pending.length)return;busy=true;show();let done=0;try{const id=await getAccount(false);const mismatched=pending.filter(x=>x.accountId&&x.accountId!==id);if(mismatched.length){status(`DITOLAK: ${mismatched.length} percobaan milik akun berbeda. Login ke akun yang membuat percobaan itu. Tidak ada yang dikirim.`);return}if(pending.some(x=>!x.accountId)){status('Antrean lama belum memiliki ID akun. Gunakan tombol Verifikasi Antrean Lama sebelum kirim ulang.');return}if(!window.confirm(`Kirim ${pending.length} percobaan sebagai akun server #${id}?`))return;for(const item of [...pending]){try{await send(item);remove(item);done++;status(`${done} percobaan dikirim ulang tanpa mengganti attemptId.`)}catch(e){status(`${done} terkirim. Dihentikan: ${e.message}${[409,422].includes(e.status)?' (konflik/validasi permanen; periksa antrean)':''}`);break}}if(done)await history()}catch(e){status('Verifikasi akun gagal: '+e.message+'. Antrean tetap tersimpan.')}finally{busy=false;show()}}
async function bindLegacy(){if(busy||!pending.some(x=>!x.accountId))return status('Tidak ada antrean lama yang perlu diverifikasi.');busy=true;show();try{const id=await getAccount(false);if(!window.confirm(`Antrean dari rilis lama tidak menyimpan identitas server. Tidak mungkin membuktikan akun asalnya. HANYA jika Anda yakin semua percobaan lama dibuat memakai akun #${id}, pilih OK untuk menandainya. Lainnya pilih Cancel.`))return;pending.forEach(x=>{if(!x.accountId)x.accountId=id});persist();status('Antrean lama ditandai untuk akun yang Anda konfirmasi. Belum dikirim; tekan Kirim Ulang.')}catch(e){status('Gagal memverifikasi akun: '+e.message)}finally{busy=false;show()}}
async function history(){const epoch=identityEpoch;try{const id=await getAccount(false),result=await call('GET','/unified-missions');if(epoch!==identityEpoch)return;const rows=Object.entries(result.missions||{}).map(([k,v])=>`${labels[k]||k}: terbaik ${v.bestScore}/100 · ${v.attempts} percobaan · ${v.completed?'LULUS':'belum lulus'}`);const el=$('nf407History');if(el)el.textContent=`Akun #${id}: `+(rows.join(' | ')||'Belum ada evaluasi server.');window.dispatchEvent(new CustomEvent('netforge:unified-server-history',{detail:{accountId:id,missions:result.missions||{},updatedAt:new Date().toISOString()}}));return result}catch(e){if(epoch!==identityEpoch)return;const el=$('nf407History');if(el)el.textContent='Riwayat tidak dapat dimuat: '+e.message;window.dispatchEvent(new CustomEvent('netforge:unified-server-error',{detail:{message:e.message}}))}}
function clearQueue(){if(busy||!pending.length||!window.confirm('Hapus antrean yang belum tersinkron? Data server dan progres lokal lain tidak dihapus.'))return;pending=[];persist();show();status('Antrean lokal dihapus.')}
function init(){const old=$('nf406Panel'),parent=$('nf402MissionPanel');if(old)old.remove();if(!parent||$('nf407Panel'))return;pending=load();const panel=document.createElement('section');panel.id='nf407Panel';panel.style.cssText='margin:12px 0;padding:14px;background:#0d2b40;border:1px solid #488eae;border-radius:10px;color:#e8f8ff;font:12px/1.6 system-ui';panel.innerHTML='<strong style="font-size:14px;color:#9ceafd">☁ Sinkronisasi Misi Aman — v0.59.00</strong><p>Setiap percobaan terikat pada ID akun server. Kirim ulang ditolak bila akun berbeda. XP resmi tetap 0.</p><div style="display:flex;flex-wrap:wrap;gap:7px"><button id="nf407Submit" type="button">Kirim Evaluasi</button><button id="nf407Retry" type="button">Kirim Ulang Antrean</button><button id="nf407Bind" type="button">Verifikasi Antrean Lama</button><button id="nf407Refresh" type="button">Muat Riwayat</button><button id="nf407Clear" type="button">Hapus Antrean</button></div><p id="nf407Status" role="status" aria-live="polite">Siap. Pastikan login Google aktif.</p><div id="nf407Queue" aria-live="polite"></div><p id="nf407History"></p><p style="color:#aacedd">Saat offline, pengiriman baru hanya dapat diantrikan setelah identitas server diverifikasi setidaknya sekali pada sesi login saat ini. Antrean v0.59.00 tidak memiliki pengenal akun dan perlu dikonfirmasi manual.</p>';parent.after(panel);panel.querySelectorAll('button').forEach(b=>b.style.cssText='padding:9px;background:#12567a;border:1px solid #63bcdb;border-radius:7px;color:white;cursor:pointer');$('nf407Submit').addEventListener('click',submit);$('nf407Retry').addEventListener('click',retry);$('nf407Bind').addEventListener('click',bindLegacy);$('nf407Refresh').addEventListener('click',history);$('nf407Clear').addEventListener('click',clearQueue);window.addEventListener('netforge:auth-change',()=>{verifiedAccount=null;identityEpoch++;const historyEl=$('nf407History');if(historyEl)historyEl.textContent='Akun berubah. Muat kembali riwayat server.';window.dispatchEvent(new Event('netforge:unified-server-clear'));status('Akun berubah. Identitas server harus diverifikasi ulang sebelum sinkronisasi.')});show()}
window.NetForgeUnifiedServer={version:'0.40.31',topology:evidence,submit,history,retry,pending:()=>pending.length};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf408-mission-progress-dashboard === */
(()=>{'use strict';
const PROFILES=['basics','smart','office'],LABELS={basics:'Network Basics',smart:'Smart Home Hybrid',office:'Office Starter'};
const LOCAL='netforge.unified.mission.progress.v1',QUEUE='netforge.unified.mission.pending.v0406';
const $=id=>document.getElementById(id);
let server=null,serverError='',loading=false,local={},queue=[];
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
function loadLocal(){const p=window.NetForgeMissionProgress?.getState?.()||read(LOCAL,{});local=p&&typeof p==='object'?p:{}}
function loadQueue(){const q=read(QUEUE,[]);queue=Array.isArray(q)?q.filter(x=>x&&PROFILES.includes(x.profile)&&typeof x.attemptId==='string'):[]}
function update(){loadLocal();loadQueue();render()}
function score(v,key){const n=Number(v?.[key]);return Number.isFinite(n)?Math.max(0,Math.min(100,Math.round(n))):0}
function count(v,key){const n=Number(v?.[key]);return Number.isFinite(n)?Math.max(0,Math.round(n)):0}
function line(container,label,value,kind){const el=document.createElement('div');el.className='nf408-line';const prefix=document.createElement('span');prefix.textContent=label+': ';const suffix=document.createElement('span');suffix.className='nf408-value '+(kind||'');suffix.textContent=value;el.append(prefix,suffix);container.append(el)}
function render(){const root=$('nf408Dashboard');if(!root)return;const cards=$('nf408Cards');cards.replaceChildren();let completed=0;for(const p of PROFILES){const l=local[p]||{},s=server?.missions?.[p],n=queue.filter(x=>x.profile===p).length;const card=document.createElement('article');card.className='nf408-card';const heading=document.createElement('h4');heading.textContent=LABELS[p];card.append(heading);const localPassed=Boolean(l.completed);if(localPassed)completed++;
line(card,'Latihan lokal',(localPassed?'Lulus · ':'Belum lulus · ')+score(l,'best')+'/100');line(card,'Evaluasi lokal',count(l,'attempts')+' kali');
if(server){line(card,'Server',s?(s.completed?'Terverifikasi lulus':'Belum lulus')+' · '+score(s,'bestScore')+'/100':'Belum ada hasil');line(card,'Percobaan server',s?count(s,'attempts')+' kali':'0 kali');if(s&&score(l,'best')!==score(s,'bestScore'))line(card,'Perbandingan','Skor lokal dan server berbeda','nf408-warn')}
else line(card,'Server',serverError?'Belum tersedia — gagal memuat':'Belum dimuat (butuh login)');
line(card,'Menunggu sync',n+' percobaan',n?'nf408-warn':'nf408-good');const bar=document.createElement('div');bar.className='nf408-meter';bar.setAttribute('aria-label','Skor lokal '+score(l,'best')+' dari 100');const fill=document.createElement('span');fill.style.width=score(l,'best')+'%';bar.append(fill);card.append(bar);cards.append(card)}
$('nf408Summary').textContent=completed+' / 3 profil pernah lulus secara lokal · '+queue.length+' percobaan menunggu pengiriman';
$('nf408ServerState').textContent=server?'Server: riwayat akun #'+server.accountId+' · diperbarui '+new Date(server.updatedAt).toLocaleString('id-ID'):serverError?'Server: '+serverError:'Server: belum dimuat. Login lalu pilih Muat Progres Server.';
$('nf408Refresh').disabled=loading;
$('nf408Sync').disabled=loading||!queue.length;
}
async function refresh(){if(loading)return;const api=window.NetForgeUnifiedServer;if(typeof api?.history!=='function'){serverError='API sinkronisasi belum siap';render();return}loading=true;serverError='';render();try{await api.history()}catch(e){serverError=e.message||'Gagal memuat'}finally{loading=false;render()}}
async function retry(){if(loading)return;const api=window.NetForgeUnifiedServer;if(typeof api?.retry!=='function')return;loading=true;render();try{await api.retry()}finally{loading=false;update()}}
function init(){const anchor=$('nf404Progress')||$('nf402MissionPanel');if(!anchor||$('nf408Dashboard'))return;const root=document.createElement('section');root.id='nf408Dashboard';root.setAttribute('aria-label','Dashboard progres misi');root.innerHTML='<h3>📊 Mission Progress Dashboard</h3><p>Perbandingan progres latihan lokal, hasil pemeriksaan server, dan antrean pengiriman. Skor lokal bukan XP atau nilai resmi.</p><div class="nf408-toolbar"><button type="button" id="nf408Refresh">☁ Muat Progres Server</button><button type="button" id="nf408Sync">↻ Kirim Ulang Antrean</button></div><div id="nf408Summary" class="nf408-notice" aria-live="polite"></div><div id="nf408Cards" class="nf408-cards" style="margin-top:10px"></div><p id="nf408ServerState" role="status" aria-live="polite"></p><p>Hasil server hanya ditampilkan setelah dimuat secara sadar dan akan dikosongkan bila akun berubah. Data latihan tetap tersimpan secara lokal. XP resmi tidak diubah.</p>';anchor.after(root);
$('nf408Refresh').addEventListener('click',refresh);$('nf408Sync').addEventListener('click',retry);
window.addEventListener('netforge:unified-local-update',()=>{loadLocal();render()});window.addEventListener('netforge:unified-queue-update',()=>{loadQueue();render()});
window.addEventListener('netforge:unified-server-history',e=>{const d=e.detail;if(d&&Number.isSafeInteger(d.accountId)&&d.accountId>0){server={accountId:d.accountId,missions:d.missions||{},updatedAt:d.updatedAt};serverError='';render()}});
window.addEventListener('netforge:unified-server-error',e=>{server=null;serverError=e.detail?.message||'Tidak dapat memuat server';render()});
const clear=()=>{server=null;serverError='';render()};window.addEventListener('netforge:auth-change',clear);window.addEventListener('netforge:unified-server-clear',clear);
update()}
window.NetForgeMissionDashboard={version:'0.40.31',refresh,update,getState:()=>({local:structuredClone(local),server:server?structuredClone(server):null,queueCount:queue.length})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf409-learning-path === */
(()=>{'use strict';
const PROFILES=[{id:'basics',name:'Network Fundamentals',mission:'Network Basics',icon:'🌐',desc:'Router, Switch, PC, IP address, dan uji konektivitas.',skills:['Topologi LAN','IPv4','Ping']},{id:'smart',name:'Smart Home Networking',mission:'Smart Home Hybrid',icon:'🏠',desc:'Wi-Fi, kamera PoE, NVR, dan perangkat IoT.',skills:['Wi-Fi','PoE','IoT']},{id:'office',name:'Office Network',mission:'Office Starter',icon:'🏢',desc:'Topologi LAN kantor, server, dan layanan jaringan.',skills:['Server','LAN Kantor','Diagnostik']}];
const LOCAL='netforge.unified.mission.progress.v1';
const $=id=>document.getElementById(id);let local={},server=null,accountId=null;
function loadLocal(){try{local=window.NetForgeMissionProgress?.getState?.()||JSON.parse(localStorage.getItem(LOCAL)||'{}');if(!local||typeof local!=='object')local={}}catch{local={}}}
function n(v){const x=Number(v);return Number.isFinite(x)?Math.max(0,Math.min(100,Math.round(x))):0}
function passed(p){return Boolean(local[p]?.completed)}
function earned(){const b=passed('basics'),s=passed('smart'),o=passed('office');const count=[b,s,o].filter(Boolean).length;return [
 {name:'🔰 First Connection',desc:'Selesaikan Network Basics',ok:b},
 {name:'🏡 Smart Home Builder',desc:'Selesaikan Smart Home Hybrid',ok:s},
 {name:'🏢 Office Network Builder',desc:'Selesaikan Office Starter',ok:o},
 {name:'🏆 Network Explorer',desc:'Selesaikan ketiga misi',ok:count===3},
 {name:'🎯 Practice Champion',desc:'Jalankan setidaknya 5 evaluasi lokal',ok:PROFILES.reduce((sum,p)=>sum+Math.max(0,Number(local[p.id]?.attempts)||0),0)>=5}
]}
function el(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x}
function render(){const root=$('nf409Path');if(!root)return;loadLocal();const done=PROFILES.filter(p=>passed(p.id)).length;const next=PROFILES.find(p=>!passed(p.id));$('nf409Summary').textContent=done+' dari 3 misi telah lulus dalam latihan lokal · '+(next?'Rekomendasi berikutnya: '+next.mission:'Semua misi dasar selesai.');$('nf409TrackFill').style.width=Math.round(done/3*100)+'%';$('nf409TrackText').textContent=Math.round(done/3*100)+'% progres latihan lokal';const grid=$('nf409Steps');grid.replaceChildren();for(const p of PROFILES){const v=local[p.id]||{},ok=passed(p.id),rec=p.id===next?.id;const card=el('article','nf409-step');card.dataset.recommended=String(rec);card.append(el('span','nf409-pill'+(ok?' nf409-done':rec?' nf409-next':''),ok?'✓ Selesai lokal':rec?'▶ Disarankan':'Belum selesai'));
card.append(el('h4','',p.icon+' '+p.name));card.append(el('p','',p.desc));card.append(el('div','nf409-stat','Skor latihan terbaik: '+n(v.best)+'/100'));
card.append(el('div','nf409-stat','Kompetensi: '+p.skills.join(' · ')));if(server){const s=server[p.id];card.append(el('div','nf409-stat',s?(s.completed?'Server: lulus diverifikasi':'Server: belum lulus')+' · '+n(s.bestScore)+'/100':'Server: belum ada hasil'));}
else card.append(el('div','nf409-stat','Server: belum dimuat / login diperlukan'));const btn=el('button','',ok?'Buka / latihan ulang':'Mulai misi');btn.type='button';btn.addEventListener('click',()=>{window.NetForgeUniversalInventory?.openMission?.(p.id);$('nf400Canvas')?.scrollIntoView?.({behavior:'smooth',block:'center'})});card.append(btn);grid.append(card)}
const badges=$('nf409Badges');badges.replaceChildren();for(const b of earned()){const div=el('div','nf409-badge',b.name+' — '+(b.ok?'Diraih':'Belum diraih'));div.dataset.earned=String(b.ok);div.title=b.desc;badges.append(div)}$('nf409ServerNote').textContent=server?'Status server dari akun #'+accountId+' (dimuat secara manual). Badge dan progres jalur belajar tetap pencapaian lokal, bukan XP resmi.':'Belum ada hasil server yang dimuat. Badge adalah pencapaian edukatif lokal, bukan XP resmi.';}
function init(){if($('nf409Path'))return;const anchor=$('nf408Dashboard')||$('nf404Progress');if(!anchor)return;const section=el('section');section.id='nf409Path';section.setAttribute('aria-label','Learning Path & Achievements');section.innerHTML='<h3>🧭 Learning Path & Achievements</h3><p>Jalur belajar dari Network Fundamentals → Smart Home → Office Network. Misi dapat dibuka dalam urutan bebas; rekomendasi menyesuaikan progres latihan.</p><div id="nf409Summary" aria-live="polite"></div><div class="nf409-track"><span id="nf409TrackFill" style="width:0%"></span></div><p id="nf409TrackText"></p><div class="nf409-grid" id="nf409Steps"></div><h3 style="font-size:15px;margin-top:16px">🏅 Pencapaian edukatif</h3><div class="nf409-badges" id="nf409Badges"></div><div id="nf409ServerNote" class="nf409-server-note" role="status"></div>';anchor.after(section);window.addEventListener('netforge:unified-local-update',render);window.addEventListener('netforge:unified-server-history',e=>{const d=e.detail;if(Number.isSafeInteger(d?.accountId)&&d.accountId>0){accountId=d.accountId;server=d.missions||{};render()}});function clear(){server=null;accountId=null;render()}window.addEventListener('netforge:auth-change',clear);window.addEventListener('netforge:unified-server-clear',clear);window.addEventListener('netforge:unified-server-error',clear);render()}
window.NetForgeLearningPath={version:'0.40.31',refresh:render,getState:()=>({local:JSON.parse(JSON.stringify(local)),achievements:earned(),serverLoaded:server!==null})};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4017-visual-workspace === */
(()=>{'use strict';
function init(){const $=id=>document.getElementById(id);const canvas=$('nf400Canvas');if(!canvas)return;
const bar=$('nf4012CableTools')||$('nf400Modebar');const legend=document.createElement('div');legend.id='nf4017Legend';legend.innerHTML='<b>Jenis koneksi:</b><span><i style="background:#58c6ff"></i>Ethernet</span><span><i style="background:#ffc264"></i>PoE</span><span><i style="background:#65dfa9"></i>Wi-Fi</span><span><i style="background:#f07576"></i>Terputus / salah konfigurasi</span>';
bar?.after(legend);const btn=document.createElement('button');btn.type='button';btn.id='nf4017FXToggle';btn.textContent='✦ Animasi trafik: Nonaktif';btn.setAttribute('aria-pressed','false');bar?.append(btn);
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;const toggle=enabled=>{canvas.classList.toggle('nf4017-motion',enabled&&!reduced);btn.setAttribute('aria-pressed',String(enabled&&!reduced));btn.textContent='✦ Animasi trafik: '+(enabled&&!reduced?'Aktif':'Nonaktif')};toggle(false);btn.addEventListener('click',()=>toggle(btn.getAttribute('aria-pressed')!=='true'));
// A single inspector for Smart Home too: physically move the existing element into a modal,
// leaving Activity Log in its former location. Do not clone configuration controls.
let attempts=0;function setupSmart(){const original=$('nf390Inspector');if(!original){if(attempts++<25)setTimeout(setupSmart,160);return}if($('nf4017SmartModal'))return;
 const log=document.createElement('section');log.id='nf4017SmartLog';log.innerHTML='<strong>📋 Log Aktivitas Smart Home</strong><p><small>Konfigurasi perangkat dibuka dengan klik dua kali. Panel lama sudah dipindahkan ke modal.</small></p><ol id="nf4017SmartEntries"><li>Workspace Smart Home siap.</li></ol>';original.before(log);
 const overlay=document.createElement('div');overlay.id='nf4017SmartModal';overlay.hidden=true;const dialog=document.createElement('section');dialog.id='nf4017SmartDialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Konfigurasi perangkat Smart Home');const close=document.createElement('button');close.type='button';close.id='nf4017SmartClose';close.textContent='✕ Tutup';dialog.append(close,original);overlay.append(dialog);document.body.append(overlay);
 function dismiss(){overlay.hidden=true;document.body.classList.remove('nf4016-modal-open')};function open(){if(!document.body.classList.contains('nf372-smart-active'))return;overlay.hidden=false;document.body.classList.add('nf4016-modal-open');window.NetForgeDeviceInspector?.render?.();close.focus()};
 close.addEventListener('click',dismiss);overlay.addEventListener('pointerdown',e=>{if(e.target===overlay)dismiss()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden){e.preventDefault();dismiss()}},true);
 // Floor and logical topologies dispatch their existing click-to-select handlers first.
 // Open the original (not duplicated) settings after selection is updated.
 document.addEventListener('dblclick',e=>{const t=e.target;if(!t.closest?.('#nf377Floor [id^="nf377_"],#nf377Floor #nf380_switch,#nf390Logical [data-nf390-node]'))return;setTimeout(open,0)},false);
 const list=$('nf4017SmartEntries');window.addEventListener('netforge:builder-render',()=>{if(!document.body.classList.contains('nf372-smart-active'))return;const item=document.createElement('li');item.textContent=new Date().toLocaleTimeString('id-ID')+' — Topologi Smart Home diperbarui';list?.prepend(item);while(list&&list.children.length>20)list.lastChild.remove()});
 }setupSmart();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4018-workspace-interaction === */
(()=>{'use strict';function init(){
 const get=id=>document.getElementById(id),dock=document.querySelector('.command-dock'),log=get('activityDockContent');
 // Keep existing log event listeners and log DOM; do not clone it or create a second settings form.
 if(log){const feed=document.createElement('div');feed.id='nf4018UnifiedFeed';const existing=get('log');if(existing)log.insertBefore(feed,existing);else log.prepend(feed);
 const head=document.createElement('div');head.className='nf4018-head';const title=document.createElement('strong');title.textContent='Aktivitas Unified Canvas';const clear=document.createElement('button');clear.id='nf4018ClearLog';clear.type='button';clear.textContent='Bersihkan log';head.append(title,clear);log.prepend(head);
 clear.addEventListener('click',()=>{feed.replaceChildren();log.querySelector('#log')?.replaceChildren();});
 let previous='';function note(message){const s=String(message||'').trim();if(!s||s===previous)return;previous=s;const item=document.createElement('div');item.className='nf4018-entry';const stamp=document.createElement('strong');stamp.textContent=new Date().toLocaleTimeString('id-ID')+' · ';item.append(stamp,document.createTextNode(s));feed.prepend(item);while(feed.children.length>50)feed.lastElementChild.remove();}
 const status=get('nf400Status');if(status){note(status.textContent);new MutationObserver(()=>note(status.textContent)).observe(status,{childList:true,subtree:true,characterData:true});}
 function syncTopo(){const s=window.NetForgeUniversalInventory?.getState?.();if(!s)return;const count=s.nodes?.length||0,links=s.edges?.length||0;const key=count+':'+links;if(window.__nf4018GraphKey===key)return;window.__nf4018GraphKey=key;const text='Topologi: '+count+' perangkat, '+links+' koneksi';note(text);/* v0.40.92: baris yang sama ke Log Aktivitas Workspace (#nf4016Log) — sebelumnya hanya live feed yang menerimanya, sehingga Log Aktivitas Workspace tidak pernah menampilkan baris Topologi, termasuk setelah hard reload + "Lanjut Bermain" (audit live v0.40.90 butir 6). Format li disamakan dengan msg() (time + span, maks 80). Baris ini SATU dan diperbarui di tempat (bukan prepend baru tiap perubahan): prepend baru tiap perubahan akan mengubur entri log terbaru — mis. baris "Sisa budget" setelah menyambung kabel (tes L81 membaca entri teratas) — dan menduplikasi baris Topologi. */try{const list=document.getElementById('nf4016Log');if(list){const _now=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});if(window.__nf4018TopoLi&&list.contains(window.__nf4018TopoLi)){const _t=window.__nf4018TopoLi.querySelector('time');if(_t)_t.textContent=_now;const _c=window.__nf4018TopoLi.querySelector('span');if(_c)_c.textContent=text;}else{const li=document.createElement('li');const time=document.createElement('time');time.textContent=_now;const content=document.createElement('span');content.textContent=text;li.append(time,content);list.prepend(li);window.__nf4018TopoLi=li;while(list.children.length>80)list.lastElementChild.remove();try{list.scrollTop=0}catch(_e){}}}}catch(_e){}}
 window.addEventListener('netforge:unified-graph-changed',syncTopo);
 syncTopo();/* v0.40.92: tulis sekali saat init — pemulihan boot ("Lanjut Bermain") memicu graph-changed SEBELUM pendengar ini terdaftar, sehingga baris Topologi tidak pernah muncul setelah hard reload. */
 }
 // Canvas tool UI: function selectors remain intact in a single thin row, no redundant panel header.
 const tools=get('nf4012CableTools'),row=tools?.querySelector('.nf400-tools');if(row){row.setAttribute('role','toolbar');row.setAttribute('aria-label','Alat sambungan dan pengelolaan perangkat');}
 // Packet pulse uses the actual graph and only fires after a successful connectivity test.
 get('nf255LogOpen')?.remove();const canvas=get('nf400Canvas');if(!canvas)return;const layer=document.createElement('div');layer.id='nf4018Packets';layer.setAttribute('aria-hidden','true');(document.getElementById('nf4024Viewport')||canvas).append(layer);
 let alive=[];function reset(){for(const a of alive)a.cancel?.();alive=[];layer.replaceChildren()}
 function pulse(ids){if(window.matchMedia?.('(prefers-reduced-motion:reduce)')?.matches)return;const topology=window.NetForgeUniversalInventory?.getState?.();if(!topology||ids.length<2)return;const points=ids.map(id=>topology.nodes.find(n=>String(n.id)===String(id))).filter(Boolean);if(points.length!==ids.length)return;reset();const el=document.createElement('span');el.className='nf4018-packet';layer.append(el);const frames=points.map((n,i)=>({left:n.x+'%',top:n.y+'%',offset:i/(points.length-1)}));const animation=el.animate(frames,{duration:Math.max(650,(points.length-1)*550),easing:'linear',fill:'forwards'});alive.push(animation);animation.finished.then(()=>el.remove()).catch(()=>{});}
 get('nf401Ping')?.addEventListener('click',()=>{setTimeout(()=>{const text=get('nf401Result')?.textContent||'';if(!text.startsWith('✓'))return;const a=get('nf401Source')?.value,b=get('nf401Target')?.value;if(!a||!b)return;const outcome=window.NetForgeUniversalInventory?.ping?.(Number(a),Number(b));if(outcome?.ok&&Array.isArray(outcome.path))pulse(outcome.path);},40)});
 get('nf400Tool')?.addEventListener('change',reset);get('nf4017FXToggle')?.addEventListener('click',()=>{if(get('nf4017FXToggle')?.getAttribute('aria-pressed')==='false')reset()});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4019-context-actions === */
(()=>{'use strict';function boot(){
const $=id=>document.getElementById(id),canvas=$('nf400Canvas'),bar=$('nf400Modebar');if(!canvas||!bar)return;
const actions=document.createElement('section');actions.id='nf4019Actions';actions.hidden=true;actions.setAttribute('aria-label','Aksi perangkat terpilih');actions.innerHTML='<div class="nf4019-head"><span id="nf4019DeviceLabel">Perangkat terpilih</span><span><button type="button" id="nf4019Cancel" style="display:none">✕ Batal</button><button type="button" class="nf4019-close" id="nf4019Collapse" aria-label="Ciutkan panel aksi">▾</button><button type="button" class="nf4019-close" id="nf4019Close" aria-label="Tutup aksi">×</button></span></div><div class="nf4019-actions"><button type="button" id="nf4019Connect">🔗 Hubungkan</button><button type="button" id="nf4019Disconnect">✂ Putuskan</button><button type="button" id="nf4019Configure">⚙ Konfigurasi</button><button type="button" id="nf4019Delete" class="nf4019-danger">🗑 Hapus</button><button type="button" id="nf4019Audit">✓ Audit</button></div><div id="nf4019MediaMenu" hidden role="group" aria-label="Pilih media koneksi"><button type="button" data-medium="ethernet">🔵 Ethernet</button><button type="button" data-medium="poe">🟠 PoE</button><button type="button" data-medium="fiber">🟣 Fiber</button><button type="button" data-medium="wifi">🟢 Wi-Fi</button></div><p id="nf4019Tip">Klik ⚙ pada kartu perangkat, atau tombol Konfigurasi di sini, untuk membuka konfigurasi.</p>';
canvas.append(actions);
const help=document.createElement('button');help.id='nf4019GlobalHelp';help.type='button';help.textContent='ⓘ Cara menghubungkan';bar.append(help);
let selected=null,phase='idle',connectSource=null;
function tool(mode){const el=$('nf400Tool');if(!el)return;el.value=mode;el.dispatchEvent(new Event('change',{bubbles:true}));}
function reset(hide=false){phase='idle';connectSource=null;const _cb=$('nf4019Cancel');if(_cb)_cb.style.display='none';$('nf4019MediaMenu').hidden=true;tool('move');$('nf4019Tip').textContent='Pilih Hubungkan, atau klik ⚙ pada kartu perangkat untuk konfigurasi.';if(hide){selected=null;actions.hidden=true;}}
 // v0.59.00: panel aksi TIDAK lagi menyimpan pilihan sendiri yang bisa usang.
 // Dulu nf4019 punya `selected` sendiri yang hanya disinkronkan lewat klik
 // canvas — jalur lain (gear, dblclick, selectNode dari tempat lain) mengubah
 // pilihan unified tanpa memperbarui panel, sehingga label "Dipilih: Router
 // #1" bisa tampil padahal Router #7 yang disorot dan tombol Hapus bisa
 // menghapus perangkat yang salah. Kini label selalu dikonfirmasi ke pilihan
 // unified yang sebenarnya, dan tombol Konfigurasi/Hapus membaca pilihan
 // unified pada saat diklik.
 function select(id){if(!document.body.classList.contains('nf400-mixed')&&window.NetForgeUniversalInventory?.getMode?.()!=='mixed')return;let n=null;try{n=window.NetForgeUniversalInventory?.getState?.()?.nodes?.find(x=>String(x.id)===String(id))||null}catch(e){n=null}if(!n){const _b=canvas.querySelector('[data-node="'+id+'"]');if(!_b)return;n={id:id,name:'Perangkat',type:''}}try{window.NetForgeUniversalInventory?.selectNode?.(id)}catch(e){}const confirmed=window.NetForgeUniversalInventory?.getSelected?.();if(confirmed!=null&&String(confirmed)!==String(id))return;selected=String(confirmed!=null?confirmed:id);actions.hidden=false;$('nf4019DeviceLabel').textContent='Dipilih: '+(n.name||n.type)+' #'+n.id;if(n&&Number(n.x)>50)actions.classList.add('nf4019-left');else actions.classList.remove('nf4019-left');if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>{try{const _overlaps=()=>{const _pr=actions.getBoundingClientRect();if(!_pr.width)return false;for(const _el of canvas.querySelectorAll('[data-node]')){const _r=_el.getBoundingClientRect();if(_r.left<_pr.right&&_r.right>_pr.left&&_r.top<_pr.bottom&&_r.bottom>_pr.top)return true}/* v0.40.92: panel aksi juga bisa menutupi TITIK TENGAH kabel — klik kabel lewat referensi (titik tengah garis) ditolak 'covered' walau klik garis di titik lain berhasil, karena pemeriksaan tumpang-tindih hanya melihat kartu perangkat. Periksa juga midpoint tiap kabel (margin 14px). */try{const _g=window.NetForgeUniversalInventory?.getState?.();const _cr=canvas.getBoundingClientRect();if(_g&&_cr.width){const _byId=new Map(_g.nodes.map(n=>[String(n.id),n]));for(const _e of _g.edges||[]){const _a=_byId.get(String(_e.a)),_b=_byId.get(String(_e.b));if(!_a||!_b)continue;const _mx=_cr.left+((_a.x+_b.x)/2)/100*_cr.width,_my=_cr.top+((_a.y+_b.y)/2)/100*_cr.height;if(_mx>_pr.left-14&&_mx<_pr.right+14&&_my>_pr.top-14&&_my<_pr.bottom+14)return true}}}catch(_e){}return false};if(_overlaps()){if(!actions.classList.contains('nf4019-collapsed')){actions.classList.add('nf4019-collapsed');const _c=$('nf4019Collapse');if(_c){_c.textContent='▸';_c.setAttribute('aria-label','Kembangkan panel aksi')}}/* v0.40.92: pil terlipat masih bisa menutupi sudut kartu (mis. Router kiri atas) — coba sisi berlawanan; bila tetap menutupi, kembali ke sisi semula. */if(_overlaps()){actions.classList.toggle('nf4019-left');if(!_overlaps())return;actions.classList.toggle('nf4019-left')}}}catch(_e){}});if(phase==='idle')$('nf4019Tip').textContent='Pilih aksi perangkat. Konfigurasi dan audit tersedia di sini.';}
function begin(type){if(!selected)return;phase=type;connectSource=selected;const _cb=$('nf4019Cancel');if(_cb)_cb.style.display='';/* v0.40.92: tombol Batal di panel aksi tampil saat mode kabel aktif (fase connect/disconnect); panel juga dikembangkan otomatis - sebelumnya panel yang terlipat menyembunyikan seluruh baris aksi dan pengguna harus mengembangkannya dulu; Batal kini tinggal di baris kepala sehingga tetap terlihat walau panel dilipat manual. */actions.classList.remove('nf4019-collapsed');const _cl=$('nf4019Collapse');if(_cl){_cl.textContent='▾';_cl.setAttribute('aria-label','Ciutkan panel aksi');}tool(type);const start=canvas.querySelector('[data-node="'+selected+'"]');if(!start){reset(true);return}start.click();$('nf4019Tip').textContent=type==='connect'?'Pilih perangkat tujuan pada canvas.':'Klik perangkat tujuan untuk memutus koneksi.';}
$('nf4019Connect').addEventListener('click',()=>{$('nf4019MediaMenu').hidden=false;$('nf4019Tip').textContent='Easy: port otomatis. Normal/Hard: pilih port sumber dan tujuan.';});
$('nf4019MediaMenu').addEventListener('click',e=>{const b=e.target.closest('[data-medium]');if(!b)return;const medium=$('nf400Medium');medium.value=b.dataset.medium;medium.dispatchEvent(new Event('change',{bubbles:true}));$('nf4019MediaMenu').hidden=true;begin('connect');});
$('nf4019Disconnect').addEventListener('click',()=>begin('disconnect'));
$('nf4019Cancel').addEventListener('click',()=>{try{window.NetForgeCancelTool?.cancel?.()}catch(_e){}});/* v0.40.92: tombol Batal di panel aksi — membatalkan mode kabel, melepas sumber terkunci, kembali ke Pindah (jalur yang sama dengan tombol Batal utama + Escape). */
$('nf4019Configure').addEventListener('click',()=>{const id=window.NetForgeUniversalInventory?.getSelected?.();if(id==null)return;window.NetForgeUniversalInventory?.selectNode?.(id);reset();$('nf4014ConfigSelected')?.click()});
$('nf4019Delete').addEventListener('click',()=>{const id=window.NetForgeUniversalInventory?.getSelected?.();if(id==null)return;const s=window.NetForgeUniversalInventory?.getState?.();const wires=s?.edges?.filter(e=>String(e.a)===String(id)||String(e.b)===String(id))?.length||0;if(wires&&!confirm('Hapus perangkat ini beserta '+wires+' koneksi?'))return;reset();$('nf4010DeleteSelected')?.click();selected=null;actions.hidden=true;});
$('nf4019Audit').addEventListener('click',()=>$('nf400Audit')?.click());
$('nf4019Close').addEventListener('click',()=>reset(true));
$('nf4019Collapse').addEventListener('click',()=>{const c=actions.classList.toggle('nf4019-collapsed');$('nf4019Collapse').textContent=c?'▸':'▾';$('nf4019Collapse').setAttribute('aria-label',c?'Kembangkan panel aksi':'Ciutkan panel aksi');});
help.addEventListener('click',()=>{const old=document.getElementById('nf4019GuideOverlay');old?.remove();const overlay=document.createElement('div');overlay.id='nf4019GuideOverlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Cara menghubungkan perangkat');overlay.innerHTML='<div class="nf4019-guide-card"><div class="nf4019-guide-head"><strong>ⓘ Cara menghubungkan perangkat</strong><button type="button" id="nf4019GuideClose" aria-label="Tutup panduan">✕</button></div><ol><li><b>Pilih perangkat sumber</b> — klik kartu perangkat pada canvas (atau tambahkan dari inventori kiri).</li><li><b>Klik tombol 🔗 Hubungkan</b> pada panel aksi, lalu pilih media: <b>Ethernet</b>, <b>PoE</b>, <b>Fiber</b>, atau <b>Wi-Fi</b>.</li><li><b>Klik perangkat tujuan</b> pada canvas. Mode Easy: port dipilih otomatis. Mode Normal/Hard: pilih port sumber dan tujuan pada dialog.</li><li><b>Atau pakai 🔗 Sambung port</b> (tombol di panel Iga): klik port sumber lalu port tujuan langsung pada kartu perangkat — port yang cocok berwarna hijau.</li><li><b>Periksa hasilnya</b>: kabel muncul di canvas dan di log aktivitas; klik garis kabel untuk membuka <b>Pemeriksaan Kabel</b>. Putuskan lewat tombol <b>✂ Putuskan</b>.</li></ol><p>Tips: port yang sudah terpakai berwarna hijau pada kartu perangkat. Satu kabel berharga $10; dana darurat mengizinkan budget sampai −$50.</p><button type="button" id="nf4019GuideOk" class="primary">Mengerti</button></div>';document.body.append(overlay);const close=()=>overlay.remove();overlay.querySelector('#nf4019GuideClose').onclick=close;overlay.querySelector('#nf4019GuideOk').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc)}});overlay.querySelector('#nf4019GuideOk').focus();});
// v0.59.00: sinkronisasi panel diekspos agar act() unified bisa memanggilnya
// langsung — klik tunggal terbukti memilih node tapi panel tidak selalu ikut.
 // v0.59.00: kunci sumber Hubungkan/Putuskan diekspos agar act()
 // unified bisa memakainya — klik sumber di canvas tidak lagi
 // self-connect dan menghapus sumber pending.
 /* v0.40.92: reset diekspos agar Escape/tombol Batal bisa membatalkan mode kabel dari luar. */window.NetForgeActionPanel={sync:select,getLockedSource:()=>((phase==='connect'||phase==='disconnect')?connectSource:null),reset};
canvas.addEventListener('click',e=>{const b=e.target.closest('[data-node]');if(!b||!document.body.classList.contains('nf400-mixed'))return;const id=b.dataset.node;
 // v0.59.00: sinkron, bukan queueMicrotask — handler canvas unified sudah
 // berjalan lebih dulu (terdaftar lebih awal pada elemen yang sama), jadi
 // pilihan unified sudah mutakhir. Microtask dulu membuat panel bisa
 // tertinggal satu langkah dan tidak terbuka lagi setelah ditutup.
 {if(phase==='connect'||phase==='disconnect'){
   // v0.59.00: bandingkan terhadap SUMBER (connectSource), bukan
   // `selected` — handler nf400 sudah berjalan lebih dulu dan
   // act()->sync() sudah mengisi `selected` dengan node tujuan,
   // sehingga `id!==selected` tidak pernah benar dan reset()
   // + pesan penolakan tidak pernah jalan.
   if(id!==connectSource){const status=$('nf400Status')?.textContent||'';if(phase==='disconnect'||status.startsWith('✓ ')||document.getElementById('nf4031PortOverlay')){reset();select(id);if(status.startsWith('✓ '))$('nf400Status').textContent=status}else{reset();select(id);$('nf4019Tip').textContent=status.replace(/^Iga:\s*/, '').slice(0,300)||'Koneksi gagal. Periksa port dan konfigurasi.';} }else select(id);
 }else select(id);}
});
canvas.addEventListener('contextmenu',e=>{const b=e.target.closest('[data-node]');if(!b)return;e.preventDefault();tool('move');b.click();select(b.dataset.node);});canvas.addEventListener('dblclick',e=>{const b=e.target.closest('[data-node]');if(!b)return;e.preventDefault();select(b.dataset.node);/* Klik ganda memilih perangkat apa pun tool yang aktif — jangan stopPropagation dan jangan tutup inspector, biarkan dblclick mencapai handler canvas nf400 yang membuka konfigurasi. */},true);
// Leaving the universal workspace must remove the contextual UI and reset the hidden tool.
window.addEventListener('netforge:unified-mission-opened',()=>reset(true));
window.addEventListener('netforge:unified-graph-changed',()=>{if(selected&&!window.NetForgeUniversalInventory?.getState?.()?.nodes?.some(n=>String(n.id)===selected))reset(true)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf4021-mission-progression-and-traffic === */
(()=>{'use strict';const $=id=>document.getElementById(id);
const flow=['basics','smart','office','free'];const names={basics:'Network Basics',smart:'Smart Home Hybrid',office:'Office Starter',free:'Free Lab Terpadu'};
let current='basics', last=null, intervals=[], active=[];
function status(message){const out=$('nf4021TrafficStatus');if(out)out.textContent=message;}
function nextProfile(){return flow[Math.min(flow.length-1,flow.indexOf(current)+1)]}
function refresh(){const validator=window.NetForgeMissionValidator,api=window.NetForgeUniversalInventory;if(!validator||!api)return;const mode=api.getMode?.();if(mode!=='mixed')return;
 if(window.NetForgeLab&&window.NetForgeLab.active&&window.NetForgeLab.active()){/* v0.40.92: saat Lab aktif, bilah progres menampilkan progres Lab (bukan validator misi) - sebelumnya "N/total objektif · LULUS/belum lulus" dari profil misi membingungkan di Lab. */
  const progress=$('nf4021Progress');if(progress){const lp=window.NetForgeLabProgress?window.NetForgeLabProgress():null;progress.textContent=lp?('🧪 '+lp.label+' · Lab'):'🧪 Lab aktif — progres misi dijeda.';}
  const next=$('nf4021Next'),mini=$('nf4021Advance');for(const b of [next,mini])if(b)b.hidden=true;last=null;return;}const profile=current==='free'?'basics':current;let report;try{report=validator.assess(profile)}catch{return}last=report;const next=$('nf4021Next'),mini=$('nf4021Advance'),progress=$('nf4021Progress');if(progress)progress.textContent=`${report.passed}/${report.total} objektif · ${report.complete?'LULUS':'belum lulus'}`;const canAdvance=current!=='free'&&report.complete;for(const b of [next,mini])if(b){b.hidden=!canAdvance;b.textContent=current==='office'?'✓ Selesai — Buka Free Lab':'▶ Lanjut: '+names[nextProfile()];b.disabled=!canAdvance;}}
function advance(){if(!last?.complete||current==='free')return;const target=nextProfile();window.NetForgeUniversalInventory?.openMission?.(target);status('Misi '+names[target]+' dibuka di workspace tersendiri. Topologi misi sebelumnya aman dan dapat dipulihkan.');const cv=$('nf400Canvas');cv?.scrollIntoView?.({behavior:'smooth',block:'nearest'});}
function linkPath(start,end,state,api){const links=(state.edges||[]).filter(e=>api.isLinkActive?.(e));const neighbors=new Map();for(const e of links){for(const [a,b] of [[e.a,e.b],[e.b,e.a]]){const key=String(a);if(!neighbors.has(key))neighbors.set(key,[]);neighbors.get(key).push(String(b));}}const q=[[String(start)]],seen=new Set([String(start)]);while(q.length){const path=q.shift(),tail=path.at(-1);if(tail===String(end))return path;for(const n of neighbors.get(tail)||[]){if(seen.has(n))continue;seen.add(n);q.push([...path,n]);}}return null;}
function findScenario(s,state){const nodes=state.nodes||[];const one=types=>nodes.find(n=>types.includes(n.type));if(s==='stream'){return [one(['router','ap']),one(['tv','laptop','tablet','phone'])];}if(s==='camera'){return [one(['camera']),one(['nvr'])];}return [one(['phone','tablet','laptop','pc']),one(['router','ap'])];}
function stop(){for(const t of intervals)clearInterval(t);intervals=[];for(const a of active){try{a.cancel()}catch{}}active=[];const layer=$('nf4021PulseLayer');if(layer)layer.replaceChildren();$('nf4021Stop')?.setAttribute('disabled','');}
function run(){stop();const api=window.NetForgeUniversalInventory,graph=api?.getState?.();if(!graph)return status('Canvas belum siap.');const scenario=$('nf4021Scenario').value;const [src,dst]=findScenario(scenario,graph);if(!src||!dst)return status('Perangkat yang dibutuhkan belum tersedia. Pasang perangkat asal dan tujuan dari inventori.');const path=linkPath(src.id,dst.id,graph,api);if(!path||path.length<2)return status('Iga: Koneksi terputus atau salah konfigurasi. Periksa jalur, port, SSID, dan password Wi-Fi.');const nodes=path.map(id=>graph.nodes.find(n=>String(n.id)===id));if(nodes.some(n=>!n))return status('Iga: Topologi tidak konsisten.');const cv=$('nf400Canvas'),layer=$('nf4021PulseLayer');if(!cv||!layer)return;const reduced=window.matchMedia?.('(prefers-reduced-motion:reduce)')?.matches;const label=scenario==='camera'?'Rekaman CCTV':scenario==='stream'?'Streaming':'Ping visual';status(`✓ ${label}: ${nodes.map(n=>n.name||n.type).join(' → ')}. Ini animasi simulasi, bukan trafik nyata.`);$('nf4021Stop').disabled=false;if(reduced)return;const frames=nodes.map((n,i)=>({left:n.x+'%',top:n.y+'%',offset:i/(nodes.length-1)}));let cycles=0;function shot(){if(!document.body.classList.contains('nf400-mixed'))return;const p=document.createElement('span');p.className='nf4021-packet '+scenario;layer.append(p);const anim=p.animate(frames,{duration:Math.max(720,(nodes.length-1)*570),easing:'linear',fill:'forwards'});active.push(anim);anim.finished.then(()=>{p.remove();active=active.filter(a=>a!==anim)}).catch(()=>p.remove());}shot();if(scenario!=='ping'){const t=setInterval(()=>{if(++cycles>=12){stop();return}shot()},scenario==='camera'?580:950);intervals.push(t)}}
function init(){const banner=$('nf403MissionBanner'),mission=$('nf402MissionPanel'),cv=$('nf400Canvas');if(!banner||!mission||!cv||$('nf4021Next'))return;
const controls=banner.querySelector('.nf403-actions')||banner;const next=document.createElement('button');next.id='nf4021Next';next.type='button';next.hidden=true;next.addEventListener('click',advance);controls.append(next);
const panel=document.createElement('div');panel.style.cssText='display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px';panel.innerHTML='<span id="nf4021Progress" aria-live="polite">0/4 objektif</span><button type="button" id="nf4021Advance" hidden>▶ Misi berikutnya</button>';mission.querySelector('.nf402-bar')?.after(panel);$('nf4021Advance').addEventListener('click',advance);
const traffic=document.createElement('section');traffic.id='nf4021Traffic';traffic.innerHTML='<h4>◉ Trafik Jaringan — Animasi Interaktif</h4><div class="nf4021-row"><label for="nf4021Scenario">Skenario</label><select id="nf4021Scenario"><option value="ping">Ping visual (Klien → Router)</option><option value="stream">Streaming (Router → Smart TV/Klien)</option><option value="camera">Rekaman CCTV (Kamera → NVR)</option></select><button id="nf4021Run" type="button">▶ Jalankan Trafik</button><button id="nf4021Stop" type="button" disabled>■ Hentikan</button></div><p id="nf4021TrafficStatus" role="status" aria-live="polite">Animasi memakai jalur koneksi valid pada canvas. Jika jalur gagal, Iga menampilkan diagnosis.</p>';mission.before(traffic);const layer=document.createElement('div');layer.id='nf4021PulseLayer';layer.setAttribute('aria-hidden','true');(document.getElementById('nf4024Viewport')||cv).append(layer);$('nf4021Run').addEventListener('click',run);$('nf4021Stop').addEventListener('click',()=>{stop();status('Animasi dihentikan.');});
window.addEventListener('netforge:unified-graph-changed',()=>{refresh();stop()});window.addEventListener('netforge:unified-mission-opened',e=>{current=e.detail?.profile||'free';stop();queueMicrotask(refresh)});$('nf402Mission')?.addEventListener('change',()=>queueMicrotask(refresh));setTimeout(()=>{const target=window.NetForgeUniversalInventory?.getProfile?.();if(target)current=target;refresh()},20);
window.NetForgeMissionFlow={version:'0.40.31',getStatus:()=>({profile:current,report:last}),advance,refresh,runTraffic:run,stopTraffic:stop};
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4023-unified-controls-hotfix === */
(()=>{'use strict';const $=id=>document.getElementById(id);let zoom=1,panX=0,panY=0,pan=false,panGesture=null,ignoreNextClick=false;
function api(){return window.NetForgeUniversalInventory}function unified(){return api()?.getMode?.()==='mixed'&&!$('nf400Canvas')?.hidden}
function clamp(x,lo,hi){return Math.max(lo,Math.min(hi,x))}
function paint(){const cv=$('nf400Canvas');if(!cv)return;const el=$('nf4024Viewport');if(el){el.style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`; }const out=$('nf364ZoomStatus');if(out)out.textContent=Math.round(zoom*100)+'%';window.dispatchEvent(new CustomEvent('netforge:viewport-changed',{detail:{zoom,panX,panY}}));}
function scale(n){zoom=clamp(n,.5,2);paint()}
function center(){zoom=1;panX=panY=0;paint()}
function position(clientX,clientY){const r=$('nf400Canvas')?.getBoundingClientRect();if(!r)return{x:50,y:50};return{x:((clientX-r.left-r.width/2-panX)/zoom+r.width/2)/r.width*100,y:((clientY-r.top-r.height/2-panY)/zoom+r.height/2)/r.height*100}}
window.NetForgeUnifiedViewport={scale:()=>zoom,screenToPercent:position,reset:center,getState:()=>({zoom,panX,panY,pan})};
function signal(text,opts){/* v0.40.92: status Terminal hanya baris pertama. Sebelumnya pesan multi-baris ditulis ke #nf4023TerminalStatus DAN #pingResult, sehingga tiap entri ping/traceroute muncul DUA KALI di kotak Terminal dan isinya menggembung sampai hop ke-3 harus di-scroll. Log Aktivitas tetap menerima teks lengkap. */const el=$('nf4023TerminalStatus');if(el){if(opts&&opts.skipStatus)el.textContent='';else el.textContent=String(text).split('\n')[0];}const log=$('nf4016Log');if(log){const li=document.createElement('li');li.style.whiteSpace='pre-wrap';li.style.display='block';const _shown=(opts&&opts.summary)?opts.summary:text;li.textContent=new Date().toLocaleTimeString('id-ID')+' · '+(_shown.length>600?_shown.slice(0,600)+' … (dipotong)':_shown);log.prepend(li);while(log.children.length>80)log.lastElementChild.remove();try{log.scrollTop=0}catch(_e){}}}
function terminalSync(){if(!unified())return;const s=api()?.getState?.();if(!s)return;const source=$('pingSource'),target=$('pingTarget');if(!source||!target)return;const prevA=source.value,prevB=target.value;source.replaceChildren();target.replaceChildren();const nodes=s.nodes||[];const clients=nodes.filter(n=>['pc','laptop','tablet','phone','tv','server','camera','iot'].includes(n.type));for(const [sel,arr] of [[source,clients.length?clients:nodes],[target,nodes]]){for(const n of arr){const o=document.createElement('option');o.value=String(n.id);o.textContent=(n.name||n.type)+' #'+n.id;sel.append(o)}}if([...source.options].some(o=>o.value===prevA))source.value=prevA;const router=nodes.find(n=>n.type==='router'||n.type==='ap');if([...target.options].some(o=>o.value===prevB))target.value=prevB;else if(router)target.value=String(router.id);if(source.value===target.value&&target.options.length>1)target.selectedIndex=(target.selectedIndex+1)%target.options.length;}
function runTerminal(trace){if(!unified())return;terminalSync();const a=Number($('pingSource')?.value),b=Number($('pingTarget')?.value);if(!a||!b){const note='Iga: Tambahkan perangkat, lalu pilih sumber dan tujuan pada Terminal Jaringan.';$('pingResult').textContent=note;signal(note,{skipStatus:true});return}const result=api()?.ping?.(a,b);if(!result){signal('Terminal Unified Canvas belum siap.');return}const graph=api()?.getState?.()||{nodes:[]},name=id=>graph.nodes.find(n=>String(n.id)===String(id))?.name||'Perangkat #'+id;
let message;if(result.ok){const route=(result.path||[]).map(name).join(' → ');const perHop=(result.path?.length||0)?(result.latencyMs||0)/result.path.length:0;message=trace?`TRACEROUTE SIMULASI: ${route||name(a)+' → '+name(b)}\n`+(result.path||[]).map((id,i)=>String(i+1).padStart(2,' ')+'  '+name(id)+'  '+(perHop*(i+1)).toFixed(1)+' ms').join('\n')+`\nTujuan tercapai · TTL=${result.ttl??64}.`:`PING SIMULASI: ${name(a)} → ${name(b)}\n${result.sourceIP||'?'} → ${result.targetIP||'?'}\n4 dikirim, 4 diterima (simulasi) · time=${result.latencyMs??'—'} ms · TTL=${result.ttl??64}.`;}else message=(trace?'TRACEROUTE':'PING')+' GAGAL: '+(result.reason||'Koneksi tidak valid.');$('pingResult').textContent=message;const _pr=$('pingResult');_pr.classList.toggle('ok',!!result.ok);_pr.classList.toggle('fail',!result.ok);if(result.ok)window.dispatchEvent(new CustomEvent('netforge:ping-success',{detail:{source:a,target:b,trace:!!trace}}));const _summary=result.ok?(trace?'TRACEROUTE '+((result.path||[]).map(name).join(' → '))+' · '+(result.path||[]).length+' hop · '+(result.latencyMs??'—')+' ms · TTL='+(result.ttl??64):'PING '+name(a)+' → '+name(b)+' · time='+(result.latencyMs??'—')+' ms · TTL='+(result.ttl??64)):message;signal(message,{skipStatus:true,summary:_summary});/* v0.40.92: (a) tulis juga ke feed bawah #log — jalur Terminal unified tidak pernah memanggil log() klasik, sehingga entri ping/traceroute tidak muncul di LOG AKTIVITAS; (b) auto-scroll kotak Terminal ke hop terakhir agar hop ke-3 + TTL terbaca tanpa scroll manual. */try{const _feed=document.getElementById('log');if(_feed){const _d=document.createElement('div');const _sum=result.ok?message.split('\n')[0].replace(/^(TRACEROUTE|PING) SIMULASI: /,'')+' berhasil · '+(result.latencyMs??'—')+' ms':'gagal: '+(result.reason||'Koneksi tidak valid.');_d.textContent=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})+' · '+(trace?'Traceroute':'Ping')+' '+_sum;_feed.prepend(_d);try{_feed.scrollTop=0}catch(_e2){}}}catch(_e){}try{const _dock=document.getElementById('terminalDockContent');if(_dock)_dock.scrollTop=_dock.scrollHeight;const _pr=document.getElementById('pingResult');if(_pr)_pr.scrollTop=_pr.scrollHeight;}catch(_e){}}
function onTerminalClick(e){if(!unified())return;const btn=e.target.closest?.('#pingBtn,#traceBtn');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();runTerminal(btn.id==='traceBtn')}
function refreshHistory(){const on=unified(),h=on?api()?.history?.():window.NetForgeWorkspaceHistory?.state?.();for(const [id,value] of [['nf364Undo',h?.undo],['nf364Redo',h?.redo]]){const el=$(id);if(el)el.disabled=!value}const toolbar=$('nf364Tools');toolbar?.classList.toggle('nf4023-active',on);if(!on){pan=false;panGesture=null;$('nf400Canvas')?.classList.remove('nf4023-pan');}}
function init(){const cv=$('nf400Canvas');if(!cv||!$('nf364Tools'))return;
 for(const [id,fn] of [['nf364Undo',()=>unified()?api()?.undo?.():window.NetForgeWorkspaceHistory?.undo?.()],['nf364Redo',()=>unified()?api()?.redo?.():window.NetForgeWorkspaceHistory?.redo?.()],['nf364ZoomIn',()=>unified()?scale(+(zoom+.1).toFixed(2)):null],['nf364ZoomOut',()=>unified()?scale(+(zoom-.1).toFixed(2)):null],['nf364Fit',()=>unified()?center():null],['nf364Pan',()=>{if(!unified())return;pan=!pan;cv.classList.toggle('nf4023-pan',pan);$('nf364Pan')?.setAttribute('aria-pressed',String(pan));$('nf364Pan')?.setAttribute('title',pan?'Pan aktif: geser area kosong untuk memindahkan tampilan':'Aktifkan Pan untuk menggeser tampilan');}]]){const b=$(id);if(!b)continue;b.addEventListener('click',e=>{if(!unified())return;e.stopImmediatePropagation();e.preventDefault();fn();refreshHistory()},true)}
 cv.addEventListener('pointerdown',e=>{if(!unified()||!pan||e.button!==0)return;if(e.target?.closest?.('.nf400-node,.nf4033-jack,button,input,select,textarea,[role=button]'))return;e.stopImmediatePropagation();e.preventDefault();panGesture={id:e.pointerId,x:e.clientX,y:e.clientY,px:panX,py:panY};try{cv.setPointerCapture(e.pointerId)}catch{}},true);
 cv.addEventListener('pointermove',e=>{if(!panGesture||panGesture.id!==e.pointerId)return;e.stopImmediatePropagation();panX=clamp(panGesture.px+e.clientX-panGesture.x,-cv.clientWidth,cv.clientWidth);panY=clamp(panGesture.py+e.clientY-panGesture.y,-cv.clientHeight,cv.clientHeight);ignoreNextClick=true;paint()},true);
 for(const ev of ['pointerup','pointercancel'])cv.addEventListener(ev,e=>{if(!panGesture||panGesture.id!==e.pointerId)return;e.stopImmediatePropagation();panGesture=null;try{cv.releasePointerCapture(e.pointerId)}catch{}},true);
 cv.addEventListener('click',e=>{if(!unified())return;/* v0.40.92: klik pada perangkat/kontrol JANGAN ditelan mode Pan — sebelumnya SEMUA klik canvas ditelan saat Pan aktif (termasuk klik kartu perangkat dan tombol panel aksi), sehingga seleksi tampak MEMBEKU dan panel aksi mati. Pan hanya butuh menelan klik di area kosong (ujung gestur geser). Klik interaktif juga mengonsumsi ignoreNextClick agar tidak menelan klik berikutnya. */const _interactive=e.target.closest?.('[data-node],button,input,select,textarea,[role="button"],#nf4019Actions,#nf400Panel,#nf400Modebar,#nf400Inventory,.nf400-placeholder');if(_interactive){ignoreNextClick=false;return}if(pan||ignoreNextClick){e.preventDefault();e.stopImmediatePropagation();ignoreNextClick=false}},true);
 cv.addEventListener('wheel',e=>{if(!unified()||!e.ctrlKey)return;e.preventDefault();scale(zoom+(e.deltaY<0?.1:-.1))},{capture:true,passive:false});
 document.addEventListener('click',onTerminalClick,true);
 document.addEventListener('keydown',e=>{if(!unified()||!(e.ctrlKey||e.metaKey)||!['z','y'].includes(e.key.toLowerCase()))return;if(e.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;e.preventDefault();e.stopImmediatePropagation();if(e.key.toLowerCase()==='y'||e.shiftKey)api()?.redo?.();else api()?.undo?.();refreshHistory()},true);
 const dock=$('terminalDockContent');if(dock&&!$('nf4023TerminalStatus')){const status=document.createElement('div');status.id='nf4023TerminalStatus';status.setAttribute('role','status');status.textContent='Terminal siap. Pilih perangkat pada Unified Canvas untuk menjalankan ping atau traceroute simulasi.';dock.append(status)}
 window.addEventListener('netforge:unified-graph-changed',()=>{terminalSync();refreshHistory()});window.addEventListener('netforge:unified-mission-opened',()=>{ignoreNextClick=false;panGesture=null;pan=false;$('nf400Canvas')?.classList.remove('nf4023-pan');$('nf364Pan')?.setAttribute('aria-pressed','false');center();terminalSync();refreshHistory()});window.addEventListener('netforge:unified-history-state',refreshHistory);refreshHistory();terminalSync();paint();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4026-accessibility-stability === */
(()=>{'use strict';
function init(){const modal=document.getElementById('nf4016Modal'),dialog=document.getElementById('nf4016Dialog'),nodes=document.getElementById('nf400Nodes');if(!modal||!dialog||!nodes)return;
 let prior=null,wasOpen=false;
 const watcher=new MutationObserver(()=>{const opened=!modal.hidden;if(opened&&!wasOpen){prior=document.activeElement;dialog.focus({preventScroll:true});}else if(!opened&&wasOpen){if(prior?.isConnected&&typeof prior.focus==='function')prior.focus({preventScroll:true});prior=null;}wasOpen=opened;});
 watcher.observe(modal,{attributes:true,attributeFilter:['hidden']});
 // Misi baru menonaktifkan efek trafik lama, mengembalikan status Pan, dan menyembunyikan konfigurasi.
 window.addEventListener('netforge:unified-mission-opened',()=>{if(!modal.hidden){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));}const b=document.getElementById('nf364Pan');if(b?.getAttribute('aria-pressed')==='true')b.click();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4027-network-diagnostics === */
(()=>{'use strict';const $=id=>document.getElementById(id);
function run(){const api=window.NetForgeUniversalInventory,output=$('nf4027DiagOutput');if(!api||!output)return;const d=api.diagnose?.();if(!d){output.textContent='Diagnostik belum tersedia.';return}const lines=[`Misi: ${d.profile} · ${d.nodes} perangkat · ${d.activeLinks}/${d.links} link aktif`];for(const e of d.linksDetail)lines.push(`${e.active?'✓':'✕'} ${e.medium.toUpperCase()} #${e.a} ↔ #${e.b}: ${e.reason}`);if(d.issues.length){lines.push('Masalah ditemukan:');for(const i of d.issues)lines.push('• '+i)}else lines.push('✓ Tidak ditemukan masalah dari pemeriksaan yang tersedia.');output.textContent=lines.join('\n')}
function init(){if($('nf4027Diagnostics'))return;const parent=$('nf4016Diagnostics')||$('nf401Diagnostics');if(!parent)return;const root=document.createElement('section');root.id='nf4027Diagnostics';const btn=document.createElement('button');btn.type='button';btn.textContent='Periksa status link & IPv4';btn.addEventListener('click',run);const output=document.createElement('pre');output.id='nf4027DiagOutput';output.textContent='Jalankan pemeriksaan untuk melihat detail masalah jaringan.';root.append(btn,output);parent.append(root);window.addEventListener('netforge:unified-graph-changed',()=>{if(output.dataset.ran==='yes')run()});btn.addEventListener('click',()=>output.dataset.ran='yes');window.addEventListener('netforge:unified-mission-opened',()=>{output.dataset.ran='no';output.textContent='Pilih Periksa status link & IPv4 untuk workspace misi ini.'})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();window.NetForgeNetworkDiagnostics={run};
})();
;

/* === script:nf4031-effects === */
(()=>{'use strict';function boot(){const $=id=>document.getElementById(id),api=()=>window.NetForgeUniversalInventory;let audio=null;
function sfx(ok){if(localStorage.getItem('netforge4031-sfx')!=='on')return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;audio??=new C();audio.resume();const now=audio.currentTime;for(const [i,f] of (ok?[660,880,1100]:[350,260]).entries()){const osc=audio.createOscillator(),vol=audio.createGain();osc.type='sine';osc.frequency.value=f;vol.gain.setValueAtTime(.0001,now+i*.105);vol.gain.exponentialRampToValueAtTime(.045,now+i*.105+.02);vol.gain.exponentialRampToValueAtTime(.0001,now+i*.105+.13);osc.connect(vol).connect(audio.destination);osc.start(now+i*.105);osc.stop(now+i*.105+.14)}}catch{}}
const bar=$('nf400Modebar');if(bar&&!$('nf4031Sound')){const b=document.createElement('button');b.id='nf4031Sound';b.type='button';b.textContent=localStorage.getItem('netforge4031-sfx')==='on'?'🔊 SFX Aktif':'🔇 SFX Mati';b.style.cssText='font-size:11px;border:1px solid #3f82a3;border-radius:9px;padding:7px 10px;background:#123e59;color:#cbf6ff;cursor:pointer';bar.append(b);b.onclick=()=>{const on=localStorage.getItem('netforge4031-sfx')!=='on';localStorage.setItem('netforge4031-sfx',on?'on':'off');b.textContent=on?'🔊 SFX Aktif':'🔇 SFX Mati';if(on)sfx(true)}}
function paint(result){const canvas=$('nf400Canvas'),nodes=canvas?.querySelectorAll('[data-node]'),wires=$('nf400Wires')?.querySelectorAll('line');if(!canvas||!nodes||!wires)return;for(const el of canvas.querySelectorAll('.nf4031-node-glow,.nf4031-node-fail,.nf4031-path-glow'))el.classList.remove('nf4031-node-glow','nf4031-node-fail','nf4031-path-glow');const graph=api()?.getState?.();if(!graph)return;const path=result.path||[],error=!result.ok;for(let i=0;i<path.length;i++){const node=[...nodes].find(el=>el.dataset.node===String(path[i]));if(node)node.classList.add(error?'nf4031-node-fail':'nf4031-node-glow');if(i>0){const edgeidx=graph.edges.findIndex(e=>(String(e.a)===String(path[i-1])&&String(e.b)===String(path[i]))||(String(e.b)===String(path[i-1])&&String(e.a)===String(path[i])));if(edgeidx>=0)wires[edgeidx]?.classList.add('nf4031-path-glow')}}setTimeout(()=>{for(const el of canvas.querySelectorAll('.nf4031-node-glow,.nf4031-node-fail,.nf4031-path-glow'))el.classList.remove('nf4031-node-glow','nf4031-node-fail','nf4031-path-glow')},2700);sfx(!error)}
function test(out){const a=$('nf401Source')?.value,b=$('nf401Target')?.value;if(!a||!b)return;const result=api()?.ping?.(Number(a),Number(b));if(!result)return;paint(result);const el=$(out);if(el){el.classList.remove('nf4031-result-success','nf4031-result-fail');el.classList.add(result.ok?'nf4031-result-success':'nf4031-result-fail');setTimeout(()=>el.classList.remove('nf4031-result-success','nf4031-result-fail'),1800)}}
$('nf401Ping')?.addEventListener('click',()=>setTimeout(()=>test('nf401Result'),70));$('nf4029Trace')?.addEventListener('click',()=>setTimeout(()=>test('nf4029Detail'),70));
window.addEventListener('netforge:link-created',()=>sfx(true));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot()})();
;

/* === script:nf4033-smart-network === */
(()=>{'use strict';const $=id=>document.getElementById(id);let latest=null,frame=null,flight=null;
const api=()=>window.NetForgeUniversalInventory;
function explain(result){const msg=String(result?.reason||result?.message||'Tidak tersedia').toLowerCase();
 if(result?.ok)return ['Jalur komunikasi berhasil','Alamat IP, jaringan, dan jalur perangkat lolos pengujian saat ini. Anda dapat menjalankan Traceroute untuk melihat hop yang dilewati.'];
 const rules=[[/conflict|duplicate|duplikat/,['Konflik alamat IPv4','Periksa konfigurasi IP seluruh endpoint. Pastikan setiap perangkat memiliki alamat IP unik di jaringan yang sama.']],[/gateway|gerbang/,['Default gateway bermasalah','Pastikan IP gateway berada dalam subnet host, interface router aktif, dan router terhubung ke segmen yang benar.']],[/route|routing|next.hop/,['Rute tidak tersedia','Periksa tabel routing, next-hop, prefix, serta rute balik pada setiap router.']],[/subnet|mask|prefix/,['Subnet tidak sesuai','Periksa alamat IP dan prefix kedua perangkat. Komunikasi antar-subnet memerlukan router dengan interface yang sesuai.']],[/dhcp|alamat ipv4 belum|ip belum/,['Konfigurasi IP/DHCP belum siap','Periksa layanan DHCP, rentang pool, koneksi ke router, atau tetapkan IP statis yang sesuai.']],[/port|media|fiber|sfp|ethernet/,['Masalah port atau media','Periksa apakah kedua konektor, jenis kabel, modul SFP, dan status port kompatibel.']],[/link|kabel|terputus|disconnected|down|jalur|reachable/,['Jalur jaringan terputus','Periksa koneksi dan status kabel di workspace, lalu gunakan Audit untuk memeriksa link yang tidak aktif.']],[/vlan/,['VLAN tidak cocok','Periksa access VLAN, trunk, dan VLAN yang diizinkan pada port switch.']]];
 for(const [r,out] of rules)if(r.test(msg))return out;
 return ['Pengujian belum berhasil','Jalankan Audit, periksa status kabel dan port, kemudian cek IP, prefix, default gateway, dan routing.'];}
function report(result,where){const host=$(where);if(!host)return;let panel=$('nf4033Help');if(!panel){panel=document.createElement('div');panel.id='nf4033Help';panel.setAttribute('role','status');panel.setAttribute('aria-live','polite');host.insertAdjacentElement('afterend',panel)}else if(panel.previousElementSibling!==host)host.insertAdjacentElement('afterend',panel);
 const [title,advice]=explain(result);panel.dataset.kind=result?.ok?'ok':'fail';panel.replaceChildren();const heading=document.createElement('strong');heading.textContent=(result?.ok?'✓ ':'⚠ ')+title;const p=document.createElement('div');p.textContent=advice;panel.append(heading,p)}
function flightPath(hops,ok){if(!Array.isArray(hops)||hops.length<2||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const svg=$('nf400Wires');if(!svg)return;const state=api()?.getState?.();if(!state?.edges)return;
 const lines=[...svg.querySelectorAll('line')];const points=[];
 for(let i=1;i<hops.length;i++){
  const idx=state.edges.findIndex(e=>String(e.a)===String(hops[i-1])&&String(e.b)===String(hops[i])||String(e.b)===String(hops[i-1])&&String(e.a)===String(hops[i]));
  if(idx<0||!lines[idx])return;const line=lines[idx],edge=state.edges[idx],f=String(edge.a)===String(hops[i-1]);
  const p1=[Number(line.getAttribute(f?'x1':'x2')),Number(line.getAttribute(f?'y1':'y2'))],p2=[Number(line.getAttribute(f?'x2':'x1')),Number(line.getAttribute(f?'y2':'y1'))];if(![...p1,...p2].every(Number.isFinite))return;
  if(!points.length)points.push(p1);points.push(p2);
 }
 if(points.length<2)return;
 if(flight){flight.remove();flight=null}if(frame)cancelAnimationFrame(frame);
 const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');circle.setAttribute('r','6');circle.setAttribute('class','nf4033-flight');circle.setAttribute('fill',ok?'#6dfbe0':'#ff9b6c');circle.setAttribute('stroke','#ffffff');circle.setAttribute('stroke-width','2');svg.append(circle);flight=circle;
 const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));const total=lengths.reduce((a,b)=>a+b,0);if(!total){circle.remove();return}const start=performance.now();const duration=Math.min(4500,Math.max(900,points.length*430));
 function step(t){if(!circle.isConnected)return;let dist=Math.min(1,(t-start)/duration)*total,j=0;while(j<lengths.length-1&&dist>lengths[j]){dist-=lengths[j];j++}const ratio=lengths[j]?dist/lengths[j]:0;const x=points[j][0]+(points[j+1][0]-points[j][0])*ratio,y=points[j][1]+(points[j+1][1]-points[j][1])*ratio;circle.setAttribute('cx',x);circle.setAttribute('cy',y);if(t-start<duration)frame=requestAnimationFrame(step);else{setTimeout(()=>circle.remove(),450);flight=null}}
 frame=requestAnimationFrame(step);
}
function portKind(name){const p=String(name||'').toUpperCase();return p.includes('SFP')||p.includes('FIBER')?'fiber':p.includes('POE')||p==='LAN7'||p==='LAN8'?'poe':'copper'}
function updatePorts(){const canvas=$('nf400Canvas'),state=api()?.getState?.();if(!canvas||!state?.nodes)return;const items=[...canvas.querySelectorAll('[data-node]')];for(const el of items){const n=state.nodes.find(x=>String(x.id)===String(el.dataset.node));if(!n)continue;let row=el.querySelector('.nf4033-jack-row');if(!row){row=document.createElement('div');row.className='nf4033-jack-row';el.appendChild(row)}const descriptor=(api()?.catalog||[]).find(d=>d.id===n.type);const ports=Array.isArray(n.ports)?n.ports:(descriptor?.ports||[]);const used=new Set((state.edges||[]).filter(e=>!e.disabled&&(String(e.a)===String(n.id)||String(e.b)===String(n.id))).map(e=>String(e.a)===String(n.id)?e.portA??e.aPort??e.fromPort:e.portB??e.bPort??e.toPort));const signature=ports.map(p=>typeof p==='string'?p:p.name||p.id||'').join('|')+'-'+[...used].join('|');if(row.dataset.sig===signature)continue;row.dataset.sig=signature;row.replaceChildren();for(const p of ports.slice(0,12)){const name=String(typeof p==='string'?p:p.name||p.id||'PORT');const tag=document.createElement('span');tag.setAttribute('role','button');tag.setAttribute('tabindex','0');tag.setAttribute('aria-label','Port '+name);tag.className='nf4033-jack';tag.dataset.kind=portKind(name);tag.dataset.used=String(used.has(name));tag.textContent=name;row.append(tag)}if(!ports.length)row.remove();}}
function init(){const dock=$('nf401Diagnostics')||$('nf401Result')?.parentElement;if(dock&&!$('nf4033Legend')){const legend=document.createElement('div');legend.id='nf4033Legend';legend.textContent='Port: biru = Ethernet · ungu = Fiber/SFP · kuning = PoE · hijau = sedang digunakan. Klik kanan / double-click perangkat untuk aksi dan konfigurasi.';dock.append(legend)}
 const ping=$('nf401Ping'),trace=$('nf4029Trace');for(const btn of [ping,trace])btn?.addEventListener('click',()=>{setTimeout(()=>{const from=Number($('nf401Source')?.value),to=Number($('nf401Target')?.value),result=api()?.ping?.(from,to);if(!result)return;latest=result;report(result,btn===ping?'nf401Result':'nf4029Detail');flightPath(result.path,result.ok)},120)},false);
 window.addEventListener('netforge:network-test',event=>{const d=event.detail||{};const result={ok:!!d.ok,reason:d.reason||''};report(result,'pingResult');flightPath(d.hops,d.ok)});
 const canvas=$('nf400Canvas');if(canvas){let ticking=false;new MutationObserver(()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;updatePorts()})}).observe($('nf400Nodes')||canvas,{childList:true,subtree:false});}setInterval(updatePorts,3000);updatePorts();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4034-iga-mission-engine === */
(()=>{
'use strict';
const get=id=>document.getElementById(id);
function init(){
 const objectives=get('objectives'), missionTitle=get('missionTitle');
 if(!objectives||!missionTitle||get('nf4034Coach'))return;
 const missionBox=objectives.closest('.panelbody');
 const coach=document.createElement('section');coach.id='nf4034Coach';coach.setAttribute('aria-label','Iga pendamping misi');
 coach.innerHTML=`<div class="nf4034-head"><b>🧑‍🔧 IGA · PENDAMPING MISI</b><span id="nf4034Presence">● SIAP MEMBANTU</span></div>
 <div class="nf4034-persona"><div id="nf4034Portrait"></div><div id="nf4034Talk"></div></div>
 <div class="nf4034-step"><div class="nf4034-stage" id="nf4034Stage">BRIEFING MISI</div><div class="nf4034-title" id="nf4034Step">Memuat objective…</div><div class="nf4034-status" id="nf4034Status">Iga mengikuti perkembangan misi.</div></div>
 <div class="nf4034-actions"><button type="button" class="nf4034-primary" id="nf4034Brief">📖 Jelaskan misi</button><button type="button" class="nf4034-secondary" id="nf4034Hint">💡 Petunjuk</button><button type="button" class="nf4034-secondary" id="nf4034Show">🎯 Tunjukkan</button></div>
 <div class="nf4034-foot"><span id="nf4034Foot">Panduan mengikuti objective yang belum selesai</span><div id="nf4034Fx"></div></div>`;
 missionBox.insertBefore(coach,objectives);
 const avatar=document.querySelector('#igaDockPortrait .iga')||document.querySelector('.iga');
 if(avatar)get('nf4034Portrait').appendChild(avatar);
 const talk=document.getElementById('igaTalk');if(talk)get('nf4034Talk').appendChild(talk);
 const fx=get('nfFxToggle');if(fx)get('nf4034Fx').appendChild(fx);
 const oldHint=get('igaHintBtn');if(oldHint)oldHint.hidden=true;
 // Retire the separate coach overlay. Existing mission and objective logic remain authoritative.
 const oldFloating=get('nf25Coach'),oldLaunch=get('nf25Launch');if(oldFloating)oldFloating.hidden=true;if(oldLaunch)oldLaunch.hidden=true;
 const oldPanel=[...document.querySelectorAll('.right .panel')].find(p=>p.querySelector('h3')?.textContent.includes('ASISTEN · IGA'));
 if(oldPanel)oldPanel.style.display='none';
 const aid=(msg,mood='talk')=>{if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay(msg,mood);else if(talk)talk.textContent=msg};
 const hintMap=[
 {test:/pasang|install|deploy|create/i,brief:'Mulai dengan perangkat yang diminta objective. Periksa inventori dan budget.',detail:'Buka inventori dan tambahkan perangkat satu per satu. Bandingkan jumlahnya dengan objective.',target:'.inventory,#inventory,#hostBtn'},
 {test:/hubungkan|kabel|topologi/i,brief:'Sekarang bentuk hubungan fisik antarperangkat.',detail:'Klik kanan atau double-click perangkat, pilih Hubungkan, kemudian pilih perangkat tujuan. Pada Normal/Hard pilih port yang kompatibel.',target:'#board,#nf400Canvas'},
 {test:/dhcp/i,brief:'DHCP membagikan alamat IP otomatis ke klien.',detail:'Buka router, aktifkan layanan DHCP, tetapkan pool alamat, lalu ubah metode IP PC ke DHCP.',target:'#board,#nf400Canvas'},
 {test:/ip|gateway|subnet|dns|vlan|trunk|bridge|management|vmbr/i,brief:'Konfigurasi jaringan harus konsisten antarperangkat.',detail:'Buka konfigurasi perangkat dengan double-click. Atur alamat unik, subnet, gateway, dan parameter yang disebut dalam objective.',target:'#board,#nf400Canvas'},
 {test:/ping|reachable|uji|koneksi/i,brief:'Pastikan jaringan dapat meneruskan paket sampai tujuan.',detail:'Pilih PC sumber dan target di Terminal Jaringan, lalu jalankan Ping atau Traceroute. Jika gagal, cek link, IP, gateway dan routing.',target:'.terminal-dock,#pingBtn'},
 {test:/ram/i,brief:'Kapasitas RAM host membatasi total guest.',detail:'Cek jumlah RAM VM/LXC, kurangi alokasi bila melewati kapasitas host.',target:'#proxmoxLabPanel'}
 ];
 let stage='',lastObjective='',hintLevel=0,wasComplete=false,lastMission='',lastCelebratedKey='';/* v0.40.92: penulisan gelembung ganti-misi yang tertunda (butir 3) — pendingMissionBubble: ada pesan 'Misi ...' yang menunggu snapshot menetap; pendingMissionKey: kunci snapshot saat penulisan ditandai; pendingMissionTries: berapa kali refresh dijadwalkan ulang; missionBubbleTimer: handle timer 150 ms. */let pendingMissionBubble=false,pendingMissionKey='',pendingMissionTries=0,missionBubbleTimer=null;
 function state(){
  /* v0.40.92: di Guided Lab, baris objective klasik adalah SISA misi terakhir (tidak dihapus saat masuk Lab — enter() hanya mengganti judul; updateObjectives() kembali dini bila missionConfig null), sehingga coach bisa mengklaim "5/5 · SELESAI" padahal panel Guided Lab masih "Tahap 1/5". Di mode guided, progres dibaca dari NetForgeGuidedProgress (sumber yang sama dengan panel nf27), bukan dari baris DOM. */
  const _lab=window.NetForgeLab;
  if(_lab?.active?.()&&_lab.mode?.()==='guided'&&window.NetForgeGuidedProgress){const _p=window.NetForgeGuidedProgress();const _done=_p.finished?5:Math.min(5,Math.max(0,Number(_p.index)||0));return {rows:[],done:_done,total:5,goal:_p.finished?'':(_p.stepName||''),complete:!!_p.finished,started:true,lab:true,labMode:'guided',labLabel:_p.finished?'Selesai · 5/5':'Tahap '+(_done+1)+' / 5'};}
  if(_lab?.active?.()&&window.NetForgeLabProgress){const _lp=window.NetForgeLabProgress();if(_lp)return {rows:[],done:_lp.done,total:_lp.total,goal:_lp.complete?'':(_lp.goal||''),complete:_lp.complete,started:true,lab:true,labMode:_lp.mode,labLabel:_lp.label};}/* v0.40.92: Free/Challenge Lab memakai sumber progres Lab yang sama (bukan baris objective klasik sisa misi terakhir, yang membuat coach mengklaim "Semua objective terpenuhi!" di Lab). */
  const rows=[...objectives.querySelectorAll('.objective')];
  const done=rows.filter(x=>x.firstElementChild?.textContent.trim()==='✓').length;
  const next=rows.find(x=>x.firstElementChild?.textContent.trim()!=='✓');
  const goal=next?.lastElementChild?.textContent.trim()||'';
  const started=!get('startModal')?.classList.contains('open');
  const complete=started&&rows.length>0&&!next;
  return {rows,done,total:rows.length,goal,complete,started};
 }
 function refresh(){
  const s=state(), name=missionTitle.textContent.trim(),key=name+'|'+s.goal;
  const goalChanged=key!==lastObjective;/* v0.40.92: goal berubah (misi sama, objective maju) — sebelumnya perubahan ini terdeteksi (lastObjective) tapi tidak pernah menulis gelembung karena cabang penulisan hanya memeriksa missionChanged (nama misi). */
  if(goalChanged){hintLevel=0;lastObjective=key;}
  const missionChanged=name!==lastMission;
  if(missionChanged){lastMission=name;wasComplete=false;lastCelebratedKey='';}
  const newStage=!s.started?'SIAP BERMAIN':s.complete?(s.lab?'LATIHAN SELESAI':'MISI TUNTAS'):(s.lab?'TAHAP BERIKUTNYA':'OBJECTIVE BERIKUTNYA');
  get('nf4034Stage').textContent=newStage;
  get('nf4034Step').textContent=!s.started?'Pilih kesulitan untuk memulai':s.complete?(s.lab?(s.labMode==='guided'?'Latihan selesai! Semua 5 tahap berhasil.':'Semua pemeriksaan dasar Lab lulus!'):'Semua objective terpenuhi!'):s.goal||'Persiapan misi';
  get('nf4034Status').textContent=s.labLabel||`${s.done} / ${s.total} objective selesai`;
  get('nf4034Presence').textContent=s.complete?(s.lab?'● LATIHAN SELESAI':'● MISI TUNTAS'):'● SIAP MEMBANTU';
  get('nf4034Foot').textContent=s.complete?(s.lab?(s.labMode==='guided'?'Latihan selesai — skor tersimpan di browser ini':'Pemeriksaan dasar Lab lulus — lanjutkan eksperimen.'):'Periksa validasi, lalu lanjutkan misi'):'Klik Petunjuk untuk bantuan bertingkat';
  coach.classList.toggle('nf4034-complete',s.complete);
  // v0.59.00: cabang ketiga — saat ganti misi ke misi yang BELUM lulus,
  // bubble Iga juga harus menampilkan status misi BARU. Sebelumnya hanya
  // kotak/panel yang diperbarui: cabang 'progres direset' tidak pernah jalan
  // saat ganti misi karena wasComplete di-reset lebih dulu pada
  // missionChanged, sehingga bubble menampilkan perayaan misi lama selamanya.
  // Misi baru yang sudah lengkap tetap dirayakan cabang pertama (trade-off
  // yang dipertahankan: masuk kembali ke misi lulus menampilkan perayaan).
  if(s.complete&&!wasComplete){const _ck=name+'|'+(s.lab?('lab:'+(s.labMode||'guided')+'|'):'')+s.done+'/'+s.total;if(lastCelebratedKey!==_ck){lastCelebratedKey=_ck;aid(s.lab?(s.labMode==='guided'?'Hebat! Semua 5 tahap Guided Lab berhasil. Latihan selesai — skor tersimpan di browser ini.':'Hebat! Semua pemeriksaan dasar Lab lulus.'):'Kerja bagus! Semua objective sudah terpenuhi. Sekarang uji atau validasi jaringan sebelum melanjutkan misi.','celebrate')}}/* v0.40.92: perayaan hanya sekali per kunci penyelesaian - sebelumnya wasComplete hanya direset saat ganti misi, sehingga perbaikan setelah Chaos (putus -> perbaiki -> lengkap lagi) merayakan ulang dan menimpa pesan repair yang segar (jalur kedua penimpaan di audit live, selain nf4040). Reset saat ganti misi mempertahankan trade-off v0.40.86: masuk kembali ke misi lulus tetap dirayakan. */else if(!s.complete&&wasComplete){/* v0.40.92: jangan timpa peringatan Chaos yang lebih segar — saat Chaos memutus kabel dan misi beralih lulus->tidak lulus, bubble harus tetap menampilkan peringatan Chaos ('Kucing Nakal...'), bukan 'Progres misi direset'. Tanpa penjaga ini, refresh() (microtask via MutationObserver) menimpa say() dari triggerChaos (sinkron). Bila tidak ada insiden Chaos, perilaku lama dipertahankan. */if(!window.NetForgeUniversalInventory?.chaosActive?.()){/* v0.40.92: pesan "Canvas Lab dikosongkan" hanya bila canvas Lab BENAR-BENAR kosong — sebelumnya cabang ini jalan pada SETIAP transisi lengkap->belum lengkap di Lab (mis. Putuskan berhasil), sehingga gelembung mengklaim canvas dikosongkan padahal hanya satu kabel yang diputus (audit live v0.40.87 butir 3). Bila canvas masih berisi perangkat, tulis pesan progres yang netral. */const _inLab=(window.NetForgeLab?.active?.()||window.NetForgeUniversalInventory?.getProfile?.()==='free');let _labEmpty=false;if(_inLab){try{if(document.body.classList.contains('nf400-mixed')&&window.NetForgeUniversalInventory?.getState){_labEmpty=(window.NetForgeUniversalInventory.getState().nodes||[]).length===0;}else{const _d=JSON.parse(window.NetForgeLab.export());_labEmpty=(_d.nodes||[]).length===0;}}catch(_e){_labEmpty=false;}}aid(_inLab?(_labEmpty?'Canvas Lab dikosongkan. Progres misi tetap tersimpan.':'Progres Lab berubah. '+(s.goal?('Objective berikutnya: '+s.goal+'.'):'Lanjutkan latihan.')):'Progres misi direset. '+(s.goal?'Objective berikutnya: '+s.goal+'.':'Mulai dari awal.'),'talk')}}else if(missionChanged&&!s.complete&&!s.started&&!s.lab&&!bubbleMissionMismatch(name)){/* v0.40.92 B4: misi berganti saat misi belum dimulai (startModal masih terbuka — pengguna unified yang tidak pernah mengklik "Start mission" klasik) — sebelumnya cabang penulisan gelembung mensyaratkan s.started, sehingga setelah keluar Lab gelembung macet di status Lab ("Lab Guided Lab...") selamanya walau misi sudah berganti (audit live v0.40.91 B4). Pesan ini tidak memakai objective (belum ada yang berjalan), jadi aman ditulis sinkron. */aid('Misi '+name+'. Pilih kesulitan untuk memulai.','talk');}else if((missionChanged||goalChanged)&&!s.complete&&s.started&&!s.lab){/* v0.40.92: JANGAN tulis gelembung dari snapshot ini — judul (#missionTitle) diperbarui SEBELUM baris objective (#objectives) diganti (preview validator jalan via microtask setelah event unified-mission-opened; baris klasik diperbarui belakangan), sehingga refresh() ini membaca "misi baru + objective lama" dan cabang sekali-jalan ini menghabiskan penulisannya untuk pesan campuran itu; refresh berikutnya tidak menulis apa-apa karena missionChanged sudah false (audit live v0.40.88 butir 3: gelembung tertinggal satu misi — ke Smart Home gelembung menyebut objective Network Basics, dan sebaliknya). Tandai tertunda; penulisannya dilakukan refresh() berikutnya setelah baris objective menetap (maks. 2x jadwal ulang). Di Lab tidak ada penulisan "Misi ..." di sini (status Lab ditulis sayLabStatus saat enter). Bila Chaos aktif, peringatan Chaos yang lebih segar tidak ditimpa. Trade-off: gelembung misi baru tampil paling lambat ~450 ms setelah ganti misi (bukan sinkron). Lanjutan (R3d): cabang ini JUGA jalan saat objective maju di dalam misi yang sama (goalChanged) — sebelumnya gelembung tetap menyebut objective lama sampai misi berganti/lulus. s.started: jangan timpa pesan 'Pilih kesulitan...' saat misi belum dimulai; s.lab: status Lab ditulis sayLabStatus, bukan di sini. */pendingMissionBubble=true;pendingMissionKey=key;pendingMissionTries=0;scheduleMissionBubble();}
  else if(pendingMissionBubble){/* v0.40.92: penulisan tertunda (ganti misi ATAU objective maju). Kunci yang BERUBAH berarti snapshot masih bergerak — tandai ulang dan jadwalkan lagi, jangan tulis; tulis hanya setelah kunci stabil 2x refresh timer (~300 ms). */if(s.lab){pendingMissionBubble=false;}else if(key!==pendingMissionKey){pendingMissionKey=key;pendingMissionTries=0;scheduleMissionBubble();}else if(pendingMissionTries<2){pendingMissionTries++;scheduleMissionBubble();}else if(window.NetForgeUniversalInventory?.chaosActive?.()){pendingMissionBubble=false;}else if(s.complete){const _ck=name+'|'+s.done+'/'+s.total;if(lastCelebratedKey!==_ck){lastCelebratedKey=_ck;aid('Kerja bagus! Semua objective sudah terpenuhi. Sekarang uji atau validasi jaringan sebelum melanjutkan misi.','celebrate');}pendingMissionBubble=false;}else if(bubbleMissionMismatch(name)){pendingMissionBubble=false;/* v0.40.92 B4: gelembung tertunda dibuang, bukan ditulis — judul misi sudah berganti ke misi lain (profil aktif tidak cocok), sehingga pesan lama akan menyebut misi yang salah (audit live v0.40.91 B4). */}else{aid('Misi '+name+'. '+(s.goal?('Objective berikutnya: '+s.goal+'.'):'Bangun jaringan bebas di workspace ini.'),'talk');pendingMissionBubble=false;}}
  wasComplete=s.complete;
  stage=newStage;
 }
 function missionBrief(){const s=state(),name=missionTitle.textContent.trim(),desc=get('missionDesc')?.textContent.trim()||'';
  let msg=s.started?`Misi ${name}. ${desc} Ada ${s.total} objective. ${s.goal?'Mulailah dari: '+s.goal+'.':'Kamu sudah menyelesaikan semuanya. Validasi hasilnya.'}`:'Pilih kesulitan, lalu mulai misi. Saya akan menjelaskan objective satu per satu.';
  aid(msg,'talk');
 }
 function help(){const s=state();if(!s.started){aid('Pilih mode Easy untuk bantuan port otomatis; Normal/Hard meminta pilihan port lebih teliti. Lalu klik Start mission.','think');return;}
  if(s.complete){aid('Semua langkah selesai. Jalankan uji jaringan dan pastikan objective tervalidasi, kemudian lanjutkan ke misi berikutnya.','success');return;}
  const hint=hintMap.find(x=>x.test.test(s.goal));
  const message=hintLevel===0?`${s.goal}. ${hint?.brief||'Periksa instruksi objective dan pastikan persyaratannya.'}`:hintLevel===1?(hint?.detail||'Baca objective aktif, buka konfigurasi perangkat terkait, dan periksa nilai yang diperlukan.'):`Langkah praktis: ${hint?.detail||'Periksa kembali topologi dan konfigurasi.'} Setelah itu lihat indikator objective; yang sudah benar akan bertanda ✓.`;
  aid(message,'think');hintLevel=Math.min(2,hintLevel+1);
 }
 function show(){const s=state();const h=hintMap.find(x=>x.test.test(s.goal));
  const target=[...(h?.target||'#objectives').split(',')].map(q=>{try{return document.querySelector(q)}catch{return null}}).find(Boolean)||objectives;
  target.scrollIntoView({behavior:'smooth',block:'nearest'});target.classList.remove('nf25-hl');void target.offsetWidth;target.classList.add('nf25-hl');setTimeout(()=>target.classList.remove('nf25-hl'),2500);
  help();
 }
 get('nf4034Brief').addEventListener('click',missionBrief);
 get('nf4034Hint').addEventListener('click',help);
 get('nf4034Show').addEventListener('click',show);
 const oldHintButton=get('igaHintBtn');if(oldHintButton)oldHintButton.addEventListener('click',e=>e.stopImmediatePropagation(),true);
 let scheduled=false;
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;refresh()})}
 /* v0.40.92: jadwalkan ulang refresh untuk penulisan gelembung ganti-misi yang tertunda (pendingMissionBubble di refresh()). Timer 150 ms: preview validator (microtask) + MutationObserver sudah jalan sebelum timer berbunyi; bila baris objective belum berubah (kunci sama), refresh berikutnya menjadwalkan ulang (maks. 2x). */
 function scheduleMissionBubble(){if(missionBubbleTimer)return;missionBubbleTimer=setTimeout(()=>{missionBubbleTimer=null;try{refresh()}catch(_e){}},150);}
 /* v0.40.92 B4: cocokkan judul gelembung dengan profil yang SEDANG aktif — bila judul menyebut misi lain (mis. "Smart Home" sementara profil aktif "basics"), gelembung itu basi dan harus dibuang, bukan ditulis. Judul klasik ("Mission 01 · ...") tidak menyebut fragmen misi unified mana pun, jadi dibiarkan (bukan mismatch). */
 function bubbleMissionMismatch(name){try{const _p=window.NetForgeUniversalInventory?.getProfile?.();if(!_p)return false;const _f={basics:'Network Basics',smart:'Smart Home',office:'Office Starter',free:'Free Lab'};const _mine=_f[_p];if(!_mine)return false;for(const _k of Object.keys(_f)){if(_k!==_p&&String(name||'').indexOf(_f[_k])!==-1)return true;}return false;}catch(_e){return false;}}
 new MutationObserver(schedule).observe(objectives,{childList:true,subtree:true,characterData:true});
 new MutationObserver(schedule).observe(missionTitle,{childList:true,subtree:true,characterData:true});
 if(get('startModal'))new MutationObserver(schedule).observe(get('startModal'),{attributes:true,attributeFilter:['class']});
 // v0.59.00: segarkan coach SINKRON saat misi dibuka. refresh() lewat
 // rAF memberi jendela basi: buka pemilih misi menutup startModal lalu
 // refresh() rAF merayakan misi lama yang masih 3/3 di DOM sebelum
 // openMission mengganti objective — terbukti di jsdom (probe-switch2).
 window.addEventListener('netforge:unified-mission-opened',()=>{/* v0.40.92 B4: batalkan gelembung tertunda dari misi SEBELUMNYA — sebelumnya timer 150 ms dari misi lama tetap bisa berbunyi setelah misi berganti dan menulis gelembung misi lama. */try{if(missionBubbleTimer){clearTimeout(missionBubbleTimer);missionBubbleTimer=null;}pendingMissionBubble=false;}catch(_e){}try{refresh()}catch(e){}});
 window.addEventListener('netforge:guided-progress',()=>{try{refresh()}catch(e){}});/* v0.40.92: segarkan coach saat progres Guided Lab berubah (render nf27), agar lencana selalu sinkron dengan progres sebenarnya. */
 window.addEventListener('netforge:unified-graph-changed',()=>{try{refresh()}catch(e){}});/* v0.40.92: coach segar saat graf unified berubah (kabel dibuat/diputus/diperbaiki). */
 const previousMission=get('nextMissionBtn');previousMission?.addEventListener('click',()=>setTimeout(missionBrief,160));
 refresh();missionBrief();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4036-compact-script === */
(()=>{'use strict';
function compact(){
 const shell=document.querySelector('.workspace-shell');
 const head=shell?.querySelector('.workspace-panel > .panelhead');
 if(!shell||!head)return;
 let tools=document.getElementById('nf4036HeaderTools');
 if(!tools){tools=document.createElement('div');tools.id='nf4036HeaderTools';head.appendChild(tools)}
 const switcher=document.getElementById('nf372Switch'),audit=document.getElementById('nf391AuditButton');
 for(const b of [switcher,audit])if(b&&b.parentNode!==tools)tools.appendChild(b);
 const toolbar=document.getElementById('nf390Toolbar'),label=document.getElementById('nf390MissionLabel');
 let caption=document.getElementById('nf4036MissionCaption');
 if(!caption){caption=document.createElement('span');caption.id='nf4036MissionCaption';head.insertBefore(caption,tools)}
 if(label)caption.textContent=label.textContent;
 else if(!caption.textContent)caption.textContent='Network Basics · Topologi';
 // Preserve the live mission label via observation, not by removing its source element.
 if(label&&!label.dataset.nf4036Watched){label.dataset.nf4036Watched='1';new MutationObserver(()=>{caption.textContent=label.textContent}).observe(label,{subtree:true,characterData:true,childList:true})}
 // Hide deprecated duplicate marketing/version badge while retaining the mission caption.
 const eye=head.querySelector('.eyebrow');if(eye)eye.textContent=window.NETFORGE_RELEASE?.label||'v0.59.00';
}
function init(){compact();requestAnimationFrame(compact);setTimeout(compact,500);setTimeout(compact,1700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4037-logic === */
(function(){'use strict';
 const ready=()=>{
  document.querySelectorAll('.nf4037-license-open').forEach(b=>b.addEventListener('click',()=>{if(!document.getElementById('nf322Intro')?.hidden)document.getElementById('nf322Skip')?.click();document.getElementById('nf322CreditsBtn')?.click();}));
  const head=document.querySelector('.workspace-panel>.panelhead')||document.querySelector('.workspace-shell .panelhead');
  if(!head||document.getElementById('nf4037FocusToggle'))return;
  const b=document.createElement('button'); b.id='nf4037FocusToggle';b.type='button';
  const update=()=>{const active=document.body.classList.contains('nf4037-focus');b.textContent=active?'◧ Tampilkan Inventori':'⛶ Fokus Workspace';b.setAttribute('aria-pressed',String(active));};
  b.addEventListener('click',()=>{document.body.classList.toggle('nf4037-focus');update();});
  head.appendChild(b);update();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
;

/* === script:nf4040AdaptiveGuide === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const now=()=>Date.now();
/* v0.40.92: SATU sumber progres Lab untuk nf4040 + nf4034 + validator + lencana dialog - sebelumnya diagnostik membaca baris objective klasik (#objectives, sisa misi terakhir yang tidak dihapus saat masuk Lab) sehingga mengklaim "Misi Guided Lab: semua objective selesai." saat masih Tahap 1/5 dan "Misi Free Lab: semua objective selesai." saat 0/4 (audit live). Guided memakai NetForgeGuidedProgress (sumber yang sama dengan panel nf27); Free/Challenge memakai 4 pemeriksaan dasar atas topologi Lab saat ini lewat classicView() (node {type, config:{ip,gateway}}; link {a,b,broken}; IP efektif sudah termasuk lease DHCP; router tanpa IP eksplisit fallback 192.168.10.1). Mengembalikan null bila Lab tidak aktif. */
window.NetForgeLabProgress=function(){try{
 if(!(window.NetForgeLab&&window.NetForgeLab.active&&window.NetForgeLab.active()))return null;
 var mode=window.NetForgeLab.mode?window.NetForgeLab.mode():'guided';
 if(mode==='guided'){
  var gp=null;try{gp=window.NetForgeGuidedProgress?window.NetForgeGuidedProgress():null}catch(_e){}
  if(!gp){try{var raw=localStorage.getItem('netforge.guided.progress.v1');if(raw){var d=JSON.parse(raw);gp={index:Number(d.index)||0,finished:!!d.finished,total:5,stepName:''};}}catch(_e){}}
  if(!gp)gp={index:0,finished:false,total:5,stepName:''};
  var ix=Math.max(0,Math.min(4,Number(gp.index)||0));
  var _names=(gp.steps&&gp.steps.length===5)?gp.steps:['Pasang perangkat','Hubungkan kabel','Atur alamat IP','Atur gateway','Uji koneksi'];
  var _checks=_names.map(function(nm,i){return {name:nm,ok:!!gp.finished||i<ix};});
  return {mode:'guided',name:'Guided Lab · Jaringan Dasar',done:gp.finished?5:ix,total:5,complete:!!gp.finished,goal:gp.stepName||'',label:gp.finished?'Selesai · 5/5':'Tahap '+(ix+1)+' / 5',checks:_checks};/* v0.40.92: sertakan rincian tahap (checks) agar panel Objective di Lab bisa menampilkan progres per-tahap, bukan status lulus misi yang terkunci (butir 1). */
 }
 var nodes=[],edges=[];
 if(document.body.classList.contains('nf400-mixed')&&window.NetForgeUniversalInventory&&window.NetForgeUniversalInventory.classicView){
  var view=window.NetForgeUniversalInventory.classicView();nodes=view.nodes||[];edges=view.links||[];
 }
 var adj={};edges.forEach(function(e){var a=e.a,b=e.b;if(a==null||b==null)return;if(e.broken)return;(adj[a]=adj[a]||[]).push(b);(adj[b]=adj[b]||[]).push(a);});
 var noBad=true;edges.forEach(function(e){if(e.broken)noBad=false;});
 var router=null,routerIP='';
 nodes.forEach(function(n){if(n.type==='router'&&!router){router=n;var ip=n.config&&n.config.ip?String(n.config.ip):'';routerIP=ip||'192.168.10.1';}});
 var seen={};var stack=router?[router.id]:[];
 while(stack.length){var cur=stack.pop();if(seen[cur])continue;seen[cur]=true;(adj[cur]||[]).forEach(function(nb){if(!seen[nb])stack.push(nb);});}
 var endpoints=nodes.filter(function(n){return n.type!=='router'&&n.type!=='switch';});
 var linked=0,allConfigured=true,sameSubnet=true,gwOk=true,ipSeen={};
 var net=routerIP?routerIP.split('.').slice(0,3).join('.'):'';
 endpoints.forEach(function(n){
  var ip=n.config&&n.config.ip?String(n.config.ip):'';
  if(!ip){allConfigured=false;sameSubnet=false;gwOk=false;return;}
  if(!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)){allConfigured=false;return;}
  if(ipSeen[ip])allConfigured=false;ipSeen[ip]=1;
  if(!net||ip.split('.').slice(0,3).join('.')!==net)sameSubnet=false;
  var gw=n.config&&n.config.gateway?String(n.config.gateway):'';if(gw&&routerIP&&gw!==routerIP)gwOk=false;
  if(seen[n.id])linked++;
 });
 if(!endpoints.length){allConfigured=false;sameSubnet=false;gwOk=false;}
 if(!router){allConfigured=false;sameSubnet=false;gwOk=false;}
 var checks=[
  {key:'wired',ok:!!router&&linked>=2,name:'2 PC terhubung ke router'},
  {key:'noBad',ok:noBad,name:'tidak ada kabel LINK DOWN'},
  {key:'configured',ok:allConfigured,name:'IP valid dan unik'},
  {key:'subnet',ok:sameSubnet&&gwOk,name:'satu subnet + gateway router'}
 ];
 var done=0;checks.forEach(function(c){if(c.ok)done++;});
 var firstBad=null;checks.forEach(function(c){if(!firstBad&&!c.ok)firstBad=c;});
 var nm=mode==='challenge'?'Challenge Lab · Tantangan':'Free Lab · Eksperimen Bebas';
 return {mode:mode,name:nm,done:done,total:4,complete:done===4,goal:firstBad?firstBad.name:'',label:done+'/4 pemeriksaan',checks:checks};/* v0.40.92: sertakan rincian 4 pemeriksaan agar panel Objective di Lab menampilkan progres Lab (butir 1). */
}catch(_e){return null;}};
function init(){
 const coach=$('nf4034Coach'),objectives=$('objectives'),title=$('missionTitle');
 if(!coach||!objectives||!title||$('nf4040Panel'))return;
 const panel=document.createElement('section'); panel.id='nf4040Panel'; panel.dataset.status='idle';
 panel.setAttribute('aria-label','Iga: panduan adaptif');
 panel.innerHTML='<div class="nf4040heading"><span>🧭 IGA · DIAGNOSTIK & PROGRES</span><span id="nf4040Mode">EASY</span></div><div id="nf4040Message" role="status" aria-live="polite">Saya akan mengikuti hasil uji jaringan dan kemajuan misimu.</div><div class="nf4040detail" id="nf4040Details" hidden></div><div class="nf4040actions"><button type="button" id="nf4040Advice">💡 Analisis & saran</button><button type="button" id="nf4040Summary">📊 Evaluasi misi</button><button type="button" id="nf4040Quiet">🔕 Pengingat: Aktif</button></div><div class="nf4040sub" id="nf4040Meta">Bantuan tidak mengubah konfigurasi atau nilai misi.</div>';
 coach.appendChild(panel);
 let lastActivity=now(),lastHintAt=0,lastTest=null,failCount=0,hintShownFor='',lastKey='',completeReported=false,celebrationShown=false,lastName='',celebratedKey='';
 let reminders=true;let currentMode='easy';
 try {reminders=localStorage.getItem('nf4040.reminders')!=='off'}catch(e){}
 function setMode(){let m=document.querySelector('.difficulty [data-diff].active')?.dataset.diff;
  if(!m){const v=document.querySelector('#modeBadge,#difficultyBadge,#gameMode')?.textContent||'';m=/hard/i.test(v)?'hard':/normal/i.test(v)?'normal':'easy'}
  currentMode=m||currentMode;$('nf4040Mode').textContent=currentMode==='hard'?'HARDCORE':currentMode.toUpperCase();}
 function snapshot(){const lab=window.NetForgeLabProgress?window.NetForgeLabProgress():null;
  if(lab)return {name:lab.name,done:lab.done,total:lab.total,goal:lab.goal||'',complete:lab.complete,lab:true,labMode:lab.mode,labLabel:lab.label};
  const rows=[...objectives.querySelectorAll('.objective')],done=rows.filter(x=>x.firstElementChild?.textContent.trim()==='✓').length;
  const next=rows.find(x=>x.firstElementChild?.textContent.trim()!=='✓');
  return {name:title.textContent.trim(),done,total:rows.length,goal:next?.lastElementChild?.textContent.trim()||'',complete:rows.length>0&&!next};}
 /* v0.40.92: teks diagnostik sadar-Lab - sebelumnya sync() menulis "Misi X: semua objective selesai." dari baris objective klasik sisa misi terakhir, padahal itu progres Lab. */
 function diagText(st){if(st.lab){if(st.complete)return 'Lab '+st.name+': '+(st.labMode==='guided'?'Selesai · 5/5 — semua tahap berhasil.':'semua pemeriksaan dasar lulus.');return 'Lab '+st.name+': '+st.labLabel+'. Berikutnya: '+(st.goal||'');}return 'Misi '+st.name+': '+(st.complete?'semua objective selesai.':st.done+'/'+st.total+' objective selesai.');}
 function category(raw){const text=String(raw||'').toLowerCase();
  if(/(dhcp|pool|lease)/.test(text))return ['DHCP','Cek layanan DHCP di router, rentang pool, dan apakah klien disetel DHCP.'];
  if(/(duplicate|konflik|already in use|ip conflict)/.test(text))return ['Konflik IP','Periksa dua perangkat yang memakai alamat IPv4 sama; setiap alamat harus unik dalam subnet.'];
  if(/(gateway|gerbang)/.test(text))return ['Default gateway','Periksa apakah gateway klien satu subnet, aktif, dan memiliki rute ke tujuan.'];
  if(/(subnet|prefix|mask)/.test(text))return ['Subnet','Bandingkan alamat IP dan prefix kedua interface; periksa apakah perlu router antarjaringan.'];
  if(/(vlan|trunk|access)/.test(text))return ['VLAN','Periksa VLAN access/trunk, tagging, serta kesesuaian port di kedua ujung link.'];
  if(/(route|routing|next.hop|unreachable|ttl|loop)/.test(text))return ['Routing','Periksa rute ke jaringan tujuan, next-hop, dan rute balik di router lain.'];
  if(/(port|fiber|sfp|poe|media|cable|kabel|link|disconnect)/.test(text))return ['Lapisan fisik','Periksa status kabel, media RJ45/SFP, port aktif, dan kecocokan port pada kedua perangkat.'];
  if(/(dns|resolve)/.test(text))return ['DNS','Periksa server DNS dan apakah host tujuan dapat ditemukan.'];
  return ['Konektivitas','Periksa urutan: kabel dan port → IP/prefix → gateway → route → uji ulang.'];}
 function speak(msg,mood){if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay(msg,mood||'think');}
 function present(msg,status='idle',details='',voice=false){panel.dataset.status=status;$('nf4040Message').textContent=msg;
  $('nf4040Details').textContent=details;$('nf4040Details').hidden=!details;
  try{if(window.netforgeUnclipTop)window.netforgeUnclipTop(panel);}catch(_e){}/* v0.40.92: kembalikan panel diagnostik ke dalam pandangan bila wadah induknya ter-scroll (header "IGA - DIAGNOSTIK & PROGRES" ikut terpotong di audit live). */
  if(voice)speak(msg,status==='ok'?'success':'think');}
 function modeAdvice(goal){setMode();const g=String(goal||'').toLowerCase();
  if(currentMode==='hard')return 'Petunjuk Hardcore: periksa sendiri port fisik, mask, interface, dan tabel routing sebelum mengganti konfigurasi.';
  if(currentMode==='normal')return 'Petunjuk Normal: bandingkan port sumber dan tujuan, cek parameter IP, lalu verifikasi dengan Ping dan Traceroute.';
  if(/dhcp/.test(g))return 'Buka konfigurasi router untuk mengaktifkan DHCP, lalu pastikan perangkat klien menerima alamat dari pool.';
  if(/kabel|hubung|connect/.test(g))return 'Pilih Hubungkan dari panel perangkat, lalu pilih perangkat tujuan; port sesuai dipilih otomatis di Easy.';
  if(/ip|subnet|gateway|dns/.test(g))return 'Klik dua kali perangkat, atur IP dan prefix, lalu pastikan gateway sesuai subnet.';
  if(/ping|reachable|uji/.test(g))return 'Pilih sumber dan tujuan di terminal, jalankan Ping, dan perhatikan pesan diagnosa jika gagal.';
  return 'Mulai dari objective yang belum selesai. Periksa perangkat, koneksi, konfigurasi, lalu jalankan uji jaringan.';}
 function evaluate(){const st=snapshot();let detail=st.lab?('Progres Lab: '+st.labLabel+'.'):('Progres: '+st.done+'/'+st.total+' objective.');
  if(st.complete)detail+=' Seluruh objective tercentang. Jalankan evaluasi misi resmi sebelum lanjut.';
  else detail+=` Objective berikutnya: ${st.goal||'lihat kendali misi'}.`;
  if(lastTest)detail+=`\nTes jaringan terakhir: ${lastTest.ok?'berhasil':'gagal'}; jumlah kegagalan beruntun: ${failCount}.`;
  detail+=`\nMode: ${currentMode.toUpperCase()}.`;
  present(st.complete?'🏆 Iga: objektif telah terpenuhi, periksa validasi akhir.':'📊 Iga: berikut ringkasan kemajuan latihanmu.',st.complete?'ok':'idle',detail,true);
 }
 $('nf4040Advice').addEventListener('click',()=>{
  lastActivity=now();const st=snapshot();
  if(lastTest&&!lastTest.ok){const [head,advice]=category(lastTest.message);present(`🛠️ Kemungkinan masalah: ${head}`, 'warn',advice+'\n'+modeAdvice(st.goal),true)}
  else present('💡 Iga: coba langkah berikutnya', 'idle',(st.goal?'Objective: '+st.goal+'\n':'')+modeAdvice(st.goal),true);
 });
 $('nf4040Summary').addEventListener('click',()=>{lastActivity=now();evaluate()});
 $('nf4040Quiet').addEventListener('click',()=>{reminders=!reminders;$('nf4040Quiet').textContent=reminders?'🔕 Pengingat: Aktif':'🔔 Pengingat: Mati';try{localStorage.setItem('nf4040.reminders',reminders?'on':'off')}catch(e){}lastActivity=now()});
 $('nf4040Quiet').textContent=reminders?'🔕 Pengingat: Aktif':'🔔 Pengingat: Mati';
 document.addEventListener('pointerdown',()=>{lastActivity=now()},{passive:true});
 document.querySelectorAll('.difficulty [data-diff]').forEach(b=>b.addEventListener('click',()=>setTimeout(setMode,0)));
 window.addEventListener('netforge:network-test',event=>{const d=event.detail||{};lastActivity=now();lastTest={ok:!!d.ok,message:String(d.message||d.reason||'')};
  if(d.ok){failCount=0;present('✅ Ping/Traceroute berhasil. Periksa objective aktif dan lanjutkan konfigurasi berikutnya.','ok',`Jalur paket${Array.isArray(d.hops)?': '+d.hops.length+' titik':''}. Berhasilnya tes tidak otomatis berarti semua objective selesai.`)}
  else {failCount++;const [head,advice]=category(lastTest.message);const context=lastTest.message?'Hasil tes: '+lastTest.message.slice(0,500)+'\n':'';
   present('⚠️ Uji jaringan gagal — kemungkinan: '+head,'warn',context+advice+(failCount>=2?'\nKesalahan ini sudah berulang. Gunakan Audit Port & Koneksi untuk mengisolasi titik masalah.':''));
  }
 });
 function sync(){const st=snapshot(),key=st.name+'|'+st.done+'|'+st.goal;
  if(key!==lastKey){const previous=lastKey;const switched=previous&&lastName!==st.name;lastKey=key;lastName=st.name;lastActivity=now();hintShownFor='';setMode();
   // v0.59.00: baris diagnostik selalu disegarkan saat progres berubah —
   // sebelumnya hanya cabang "belum selesai" yang menulisnya, sehingga
   // setelah ganti misi baris bisa menampilkan objective misi lama.
   $('nf4040Meta').textContent=st.lab?('Lab aktif · Mode '+currentMode.toUpperCase()+' · Bantuan tidak mengubah konfigurasi.'):(st.complete?`Misi ${st.name}: semua objective selesai.`:`Objective aktif: ${st.goal||'—'}. Bantuan disesuaikan dengan ${currentMode.toUpperCase()}.`);/* v0.40.92: Meta Lab tidak lagi menduplikasi baris progres (butir 8) — sebelumnya Meta = diagText(st) yang sama persis dengan Message di cabang switched/complete (dan versi panjangnya di cabang !complete), sehingga kalimat progres muncul 2x di dalam kotak diagnostik yang sama (3x di halaman bila dihitung gelembung Iga). Kini Message satu-satunya baris progres di kotak ini; Meta hanya sub-baris konteks. */
   // v0.59.00: jangan rayakan dari snapshot transisi saat ganti misi — judul
   // dan baris objective diperbarui dalam langkah terpisah, sehingga snapshot
   // sesaat bisa membaca "misi baru + objective lama yang sudah selesai" dan
   // menampilkan banner "Semua objective selesai" padahal misi baru 0/6.
   // Rayakan hanya bila nama misi sama dengan sync sebelumnya (DOM menetap).
   if(switched){completeReported=false;celebrationShown=false;celebratedKey='';present(st.lab?diagText(st):(st.complete?`Misi ${st.name}: semua objective selesai.`:`Objective aktif: ${st.goal||'—'}. Bantuan disesuaikan dengan ${currentMode.toUpperCase()}.`),'idle',st.complete?'':(st.goal?('Objective berikutnya: '+st.goal):''));return;}
   if(previous&&st.complete&&!completeReported){completeReported=true;celebrationShown=true;const _ck=st.name+'|'+(st.lab?('lab:'+st.labMode+'|'):'')+st.done+'/'+st.total;const _fresh=celebratedKey!==_ck;celebratedKey=_ck;present('🎉 '+(st.lab?diagText(st):'Semua objective misi sudah selesai!'),'ok','Gunakan Evaluasi Misi untuk melihat ringkasan dan validasi jaringan.',st.lab?false:_fresh);/* v0.40.92: perayaan hanya BERSUARA bila ini penyelesaian PERTAMA untuk kunci ini di misi/Lab ini - perbaikan setelah Chaos (putus -> perbaiki -> lengkap lagi) tidak lagi merayakan ulang dan menimpa pesan repair yang segar (audit live v0.40.86); di Lab perayaan TIDAK PERNAH bersuara (panel tetap diperbarui, gelembung menyimpan pesan repair). */}
   else if(previous&&!st.complete){completeReported=false;/* v0.40.92: baris diagnostik SELALU ditulis ulang saat progres berubah — sebelumnya present() hanya jalan bila celebrationShown, sehingga pesan "Selesai · 5/5" yang tiba lewat cabang switched (yang TIDAK menyetel celebrationShown) tidak pernah tertimpa saat progres kembali ke Tahap 1/5: #nf4040Message basi sementara #nf4040Meta (ditulis tanpa syarat di atas) sudah benar (audit live v0.40.87 butir 1). Kini Message dan Meta selalu membaca sumber yang sama (snapshot/NetForgeLabProgress) pada setiap perubahan kunci. */celebrationShown=false;present(st.lab?diagText(st):'📊 Iga: progres '+st.done+'/'+st.total+' objective.','idle',st.goal?('Objective berikutnya: '+st.goal):'');/* v0.40.92: Message Lab kini baris penuh diagText (seperti cabang switched/complete) — sebelumnya bentuk pendek '📊 Iga: progres Lab Tahap N/5.' sementara Meta membawa bentuk panjangnya; dengan Meta yang kini statis, baris penuh tetap ada tepat 1x di kotak diagnostik. */}
  }
 }
 let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;sync()})});
 observer.observe(objectives,{subtree:true,childList:true,characterData:true});observer.observe(title,{subtree:true,childList:true,characterData:true});window.addEventListener('netforge:guided-progress',sync);window.addEventListener('netforge:unified-graph-changed',sync);/* v0.40.92: perbarui diagnostik saat progres Lab / graf unified berubah - MutationObserver pada #objectives/#missionTitle tidak melihat perubahan itu. */sync();
 // Gentle inactivity reminder: only after 3 min without interactions, once per current objective.
 setInterval(()=>{if(!reminders||document.hidden||!snapshot().goal)return;const k=lastKey;
  if(now()-lastActivity<180000||hintShownFor===k)return;
  hintShownFor=k;const st=snapshot();present('🧑‍🔧 Iga: butuh petunjuk untuk objective ini?','idle',modeAdvice(st.goal));lastHintAt=now();
 },30000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4042VisualTour === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
function boot(){
 const coach=$('nf4034Coach'),objectives=$('objectives');if(!coach||!objectives||$('nf4042Tutorial'))return;
 const actions=coach.querySelector('.nf4034-actions');if(!actions)return;
 const start=document.createElement('button');start.type='button';start.id='nf4042Tutorial';start.textContent='🧭 Panduan visual';start.title='Iga menunjukkan area yang diperlukan untuk objective aktif';actions.append(start);
 const spot=document.createElement('div');spot.id='nf4042Spotlight';spot.hidden=true;spot.setAttribute('aria-hidden','true');document.body.append(spot);
 const tour=document.createElement('section');tour.id='nf4042Tour';tour.hidden=true;tour.setAttribute('role','dialog');tour.setAttribute('aria-modal','false');tour.setAttribute('aria-label','Panduan visual Iga');
 tour.innerHTML='<div id="nf4042TourTitle">🧑‍🔧 IGA · PANDUAN VISUAL</div><p id="nf4042TourDesc"></p><div id="nf4042TourNav"><button type="button" id="nf4042Close">Tutup</button><button type="button" id="nf4042Next">Berikutnya →</button></div>';
 document.body.append(tour);
 let steps=[],index=0,active=false,previousFocus=null;
 const goal=()=>{const rows=[...objectives.querySelectorAll('.objective')];const next=rows.find(x=>x.firstElementChild?.textContent.trim()!=='✓');return next?.lastElementChild?.textContent.trim()||'Semua objective selesai';};
 function candidate(selectors){for(const selector of selectors){try{const el=document.querySelector(selector);if(el&&el.getClientRects().length)return el;}catch{}}return null;}
 function buildSteps(){
  const g=goal();const tasks=[{selectors:['#nf4034Step','#missionTitle'],title:'Tujuan aktif',desc:'Baca objective yang harus dipenuhi terlebih dahulu. Iga akan mengikuti progres misi.'}];
  if(/pasang|router|switch|workstation|server|device|install|deploy|create/i.test(g))tasks.push({selectors:['.inventory','#inventory','.left .panelbody','.left'],title:'Pilih perangkat',desc:'Pilih perangkat yang diminta dari inventori. Perhatikan budget dan jumlah perangkat.'});
  if(/hubungkan|kabel|port|topologi/i.test(g))tasks.push({selectors:['#board','#nf400Canvas','.workspace','.canvas-wrap'],title:'Hubungkan port',desc:'Klik kanan atau klik dua kali perangkat untuk memilih Hubungkan. Pada Normal/Hard pastikan port dan media cocok.'});
  if(/ip|gateway|subnet|vlan|dhcp|dns|routing|bridge|vmbr/i.test(g))tasks.push({selectors:['#board','#nf400Canvas','.workspace'],title:'Konfigurasi perangkat',desc:'Klik dua kali perangkat tujuan, lalu periksa IP, subnet, gateway, DHCP atau VLAN sesuai objective.'});
  if(/ping|traceroute|reachable|uji|koneksi|verifikasi/i.test(g))tasks.push({selectors:['.terminal-dock','#pingBtn','#tracerouteBtn','#terminalResult'],title:'Uji konektivitas',desc:'Pilih sumber dan tujuan pada terminal, jalankan Ping atau Traceroute, lalu baca hasil dan saran Iga.'});
  if(tasks.length===1)tasks.push({selectors:['#board','#nf400Canvas','.workspace','.right'],title:'Periksa hasil misi',desc:'Gunakan workspace untuk menyelesaikan instruksi. Tekan Petunjuk jika memerlukan bantuan bertingkat.'});
  return tasks.map(x=>({...x,element:candidate(x.selectors)})).filter(x=>x.element);
 }
 function position(){if(!active||!steps[index])return;const el=steps[index].element;if(!el.isConnected){close();return;}const r=el.getBoundingClientRect(),p=8;
  spot.style.left=Math.max(3,r.left-p)+'px';spot.style.top=Math.max(3,r.top-p)+'px';spot.style.width=Math.max(30,Math.min(innerWidth-8,r.width+2*p))+'px';spot.style.height=Math.max(24,Math.min(innerHeight-8,r.height+2*p))+'px';
  const width=Math.min(340,innerWidth-22),height=tour.offsetHeight||150;
  let top=r.bottom+16;if(top+height>innerHeight-8)top=Math.max(8,r.top-height-16);
  if(top+height>innerHeight)top=Math.max(8,innerHeight-height-8);
  tour.style.top=top+'px';tour.style.left=Math.min(Math.max(11,r.left),innerWidth-width-11)+'px';
 }
 function show(){const step=steps[index];if(!step)return close();$('nf4042TourTitle').textContent=`🧑‍🔧 IGA · LANGKAH ${index+1}/${steps.length}: ${step.title}`;$('nf4042TourDesc').textContent=step.desc;$('nf4042Next').textContent=index===steps.length-1?'Selesai ✓':'Berikutnya →';
  // Scroll first, then keep the overlay pinned on resize/scroll.
  step.element.scrollIntoView({block:'nearest',behavior:'instant'});position();
 }
 function open(){if(active)return close();steps=buildSteps();if(!steps.length){if(typeof window.netforgeIgaSay==='function')window.netforgeIgaSay('Belum ada area yang dapat disorot. Buka misi terlebih dahulu.','think');return;}previousFocus=document.activeElement;active=true;index=0;spot.hidden=false;tour.hidden=false;start.setAttribute('aria-expanded','true');show();$('nf4042Close').focus();}
 function close(){active=false;spot.hidden=true;tour.hidden=true;start.setAttribute('aria-expanded','false');if(previousFocus?.isConnected)previousFocus.focus();}
 start.setAttribute('aria-expanded','false');start.addEventListener('click',open);$('nf4042Close').addEventListener('click',close);$('nf4042Next').addEventListener('click',()=>{if(index>=steps.length-1)return close();index++;show();});
 document.addEventListener('keydown',e=>{if(active&&e.key==='Escape')close()});window.addEventListener('resize',position);document.addEventListener('scroll',position,true);
 // If the mission or objective changes while tour is open, don't leave stale markers.
 new MutationObserver(()=>{if(active)close()}).observe(objectives,{subtree:true,childList:true,characterData:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf4043SmartGuide === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const api=()=>window.NetForgeGraphLab||window.NetForge400||window.NetForgeLab||null;
function init(){
 const coach=$('nf4034Coach');if(!coach||$('nf4043Guide'))return;
 const actions=coach.querySelector('.nf4034-actions');if(!actions)return;
 const button=document.createElement('button');button.type='button';button.id='nf4043Guide';button.textContent='🔌 Panduan port';button.title='Iga memandu perangkat dan port sesuai tingkat kesulitan';actions.append(button);
 const card=document.createElement('section');card.id='nf4043Card';card.hidden=true;card.setAttribute('aria-live','polite');
 card.innerHTML='<h4>🧑‍🔧 IGA · PANDUAN PORT</h4><p id="nf4043Message"></p><div class="nf4043-actions"><button type="button" id="nf4043Next">Perangkat berikutnya</button><button type="button" id="nf4043Check">Periksa hasil tes</button><button type="button" id="nf4043Close">Tutup</button></div>';
 coach.append(card);
 const spot=document.createElement('div');spot.id='nf4043Spot';spot.hidden=true;spot.setAttribute('aria-hidden','true');document.body.append(spot);
 const pop=document.createElement('aside');pop.id='nf4043Popover';pop.hidden=true;pop.setAttribute('role','status');pop.innerHTML='<button type="button" id="nf4043PopClose" aria-label="Tutup detail port">×</button><div id="nf4043PopText"></div>';document.body.append(pop);
 const canvas=$('nf400Canvas');let active=false,index=0,nodes=[],selected=null,lastTest=null;let lastGo=0;
 const mode=()=>{const raw=($('difficultyLabel')?.textContent||'EASY').trim().toLowerCase();return raw.includes('hard')?'hard':raw.includes('normal')?'normal':'easy'};
 const modeHint=()=>mode()==='easy'?'Easy: cukup pilih Hubungkan; game akan memilih port Ethernet yang cocok secara otomatis.':mode()==='normal'?'Normal: pilih port sumber dan tujuan; periksa RJ45, Fiber/SFP, dan fungsi PoE sebelum menyambung.':'Hardcore: pilih port manual, periksa jenis media, status interface, peran WAN/LAN, PoE, VLAN, dan pengaturan jaringan.';
 const goal=()=>{const rows=[...document.querySelectorAll('#objectives .objective')];const next=rows.find(x=>x.firstElementChild?.textContent.trim()!=='✓');return next?.lastElementChild?.textContent.trim()||'Semua objective sudah selesai.';};
 const ports=el=>[...el.querySelectorAll('.nf4033-jack')];
 function describe(el){const label=(el.querySelector('strong,b,.nf400-name,.device-name')?.textContent||el.textContent||'Perangkat').trim().slice(0,58);const p=ports(el);let available=p.filter(x=>x.dataset.used!=='true');return `${label}: ${p.length} port terlihat, ${available.length} belum digunakan. `+(p.length?'Klik salah satu label port untuk melihat fungsi dan kecocokannya.':'Klik kanan atau double-click perangkat untuk membuka konfigurasi dan melihat pilihan port.');}
 function move(){if(!active||!selected||!selected.isConnected)return;let r=selected.getBoundingClientRect(),x=Math.max(2,r.left-5),y=Math.max(2,r.top-5);spot.style.left=x+'px';spot.style.top=y+'px';spot.style.width=Math.max(30,Math.min(innerWidth-x-4,r.width+10))+'px';spot.style.height=Math.max(24,Math.min(innerHeight-y-4,r.height+10))+'px';}
 function update(){nodes=[...(canvas?.querySelectorAll('[data-node]')||[])].filter(el=>el.getClientRects().length);if(!nodes.length){selected=canvas;spot.hidden=false;$('nf4043Message').textContent='Belum ada perangkat. Tambahkan Router atau Workstation dari inventori. '+modeHint();move();return;}
  if(index>=nodes.length)index=0;selected=nodes[index];selected.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});spot.hidden=false;
  $('nf4043Message').textContent=`Objective: ${goal()} ${describe(selected)} ${modeHint()}`;move();}
 function toggle(){active=!active;card.hidden=!active;spot.hidden=!active;if(active){index=0;update();}else{selected=null;pop.hidden=true;}button.setAttribute('aria-expanded',String(active));}
 button.setAttribute('aria-expanded','false');button.addEventListener('click',toggle);
 $('nf4043Next').addEventListener('click',()=>{index++;update()});$('nf4043Close').addEventListener('click',()=>{if(active)toggle()});
 $('nf4043Check').addEventListener('click',()=>{const msg=lastTest?lastTest.ok?'Tes terakhir berhasil. Periksa apakah objective konektivitas sudah ditandai selesai.':failureAdvice(lastTest.message):'Belum ada hasil pengujian yang tercatat. Gunakan Ping atau Traceroute lalu lihat penjelasan Iga.';$('nf4043Message').textContent=msg+' '+modeHint();});
 function failureAdvice(msg){let s=String(msg||'').toLowerCase();if(/vlan|trunk/.test(s))return 'Periksa VLAN access/trunk dan kesamaan VLAN pada kedua ujung jaringan.';if(/gateway|gerbang/.test(s))return 'Default gateway harus berada di subnet perangkat sumber dan port router menuju jaringan itu harus aktif.';if(/subnet|mask|prefix/.test(s))return 'Periksa alamat IP dan subnet mask kedua ujung; beda subnet memerlukan router.';if(/route|routing|hop|loop/.test(s))return 'Periksa tabel static route, next-hop, dan jalur balik pada router.';if(/cable|kabel|link|port|ethernet|fiber|sfp|media/.test(s))return 'Periksa kabel aktif, port tidak disabled, kecocokan media RJ45/Fiber, dan apakah port telah terpakai.';if(/dhcp/.test(s))return 'Pastikan DHCP router aktif, pool sesuai subnet, dan klien menggunakan metode DHCP.';if(/dns/.test(s))return 'Periksa alamat DNS serta konektivitas IP terlebih dahulu.';return 'Periksa urutannya: port/kabel → IP/subnet → gateway → route → Ping ulang. '+(msg?'Pesan simulasi: '+String(msg).slice(0,130):'');}
 function portInfo(port){const name=port.textContent.trim(),kind=port.dataset.kind,used=port.dataset.used==='true';let message=kind==='fiber'?'Fiber / SFP: memerlukan jenis media dan modul optik yang kompatibel; tidak langsung memakai kabel RJ45.':kind==='poe'?'PoE: memakai RJ45, dapat memberi daya ke perangkat penerima yang mendukung. Tidak semua perangkat membutuhkan PoE.':'Ethernet RJ45: hubungkan ke port tembaga yang kompatibel; kecepatan bergantung kemampuan kedua ujung.';
 return `${name} · ${used?'Sedang digunakan':'Tersedia'}\n${message}\n${modeHint()}`;}
 if(canvas)canvas.addEventListener('click',e=>{const port=e.target.closest('.nf4033-jack');if(!port)return;if(window.NetForgePortConnect&&window.NetForgePortConnect.isActive&&window.NetForgePortConnect.isActive())return;/* v0.40.92: jangan buka tooltip saat mode port aktif - klik port adalah percobaan sambung, bukan permintaan detail (pertahanan bila handler port kembali dini, mis. saat alur Hubungkan juga aktif). */e.stopPropagation();e.preventDefault();pop.hidden=false;$('nf4043PopText').textContent=portInfo(port);const rect=port.getBoundingClientRect();const w=Math.min(315,innerWidth-24);pop.style.left=Math.max(12,Math.min(innerWidth-w-12,rect.left))+'px';pop.style.top=Math.max(12,Math.min(innerHeight-160,rect.bottom+10))+'px';port.setAttribute('tabindex','0');});
 if(canvas)canvas.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('nf4033-jack')){e.preventDefault();e.target.click();}});
 $('nf4043PopClose').addEventListener('click',()=>{pop.hidden=true});
 window.addEventListener('netforge:network-test',e=>{const d=e.detail||{};lastTest={ok:!!d.ok,message:d.message||d.reason||''};if(!d.ok&&active){$('nf4043Message').textContent='Tes gagal. '+failureAdvice(lastTest.message)+' '+modeHint();}if(d.ok&&active){$('nf4043Message').textContent='Tes koneksi berhasil! Jalur yang diuji telah terhubung. Cek objective misi, kemudian lanjutkan.';}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){pop.hidden=true;if(active)toggle();}});
 window.addEventListener('scroll',move,true);window.addEventListener('resize',move);
 // Only update open guidance after topology changes; never mutate game topology.
 if(canvas)new MutationObserver(()=>{if(!active)return;const now=Date.now();if(now-lastGo<400)return;lastGo=now;requestAnimationFrame(update);}).observe(canvas,{childList:true,subtree:false});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf4044InteractivePort === */
(()=>{'use strict';
const $=id=>document.getElementById(id),API=()=>window.NetForgeUniversalInventory;
function boot(){const canvas=$('nf400Canvas'),coach=$('nf4034Coach'),actions=coach?.querySelector('.nf4034-actions');if(!canvas||!actions||$('nf4044Connect'))return;
 const btn=document.createElement('button');btn.id='nf4044Connect';btn.type='button';btn.textContent='🔗 Sambung port';btn.title='Klik port sumber dan port tujuan secara langsung';actions.append(btn);
 const bar=document.createElement('div');bar.id='nf4044Toolbar';bar.innerHTML='<strong>🔌 MODE PORT</strong><span class="nf4044-status" id="nf4044Status" role="status" aria-live="polite">Pilih port sumber, lalu port tujuan.</span><label>Kabel <select id="nf4044Media"><option value="auto">Otomatis</option><option value="ethernet">Ethernet RJ45</option><option value="poe">PoE RJ45</option><option value="fiber">Fiber/SFP</option></select></label><button type="button" id="nf4044Cancel">Selesai</button><button type="button" id="nf4044Batal">✕ Batal</button>';canvas.parentElement.insertBefore(bar,canvas);
 let active=false,first=null;const status=$('nf4044Status');window.NetForgePortConnect={isActive:()=>active,exit:()=>toggle(false)};/* v0.40.92: ekspos status mode port agar tombol Batal utama bisa tampil + membatalkan mode port. */
 // v0.59.00: bila alur Hubungkan/Putuskan unified sedang berjalan
 // (tool connect/disconnect), klik pada chip port adalah klik
 // perangkat tujuan — JANGAN ditelan mode port. Sebelumnya klik
 // itu hilang tanpa jejak (tanpa kabel/log/budget) bila mode port
 // masih aktif dari pemakaian sebelumnya.
 function isHubungkanActive(){const t=$('nf400Tool');return !!t&&(t.value==='connect'||t.value==='disconnect')}
 const nodes=()=>API()?.getState?.().nodes||[];
 const catalog=()=>API()?.catalog||[];
 const getPort=(el)=>{const host=el.closest('[data-node]');if(!host)return null;const id=Number(host.dataset.node),port=el.textContent.trim();const node=nodes().find(n=>Number(n.id)===id);const spec=catalog().find(d=>d.id===node?.type);return node&&spec?.ports.includes(port)?{node,port,el}:null};
 const kind=p=>p.el.dataset.kind==='fiber'?'fiber':'copper';
 const used=p=>p.el.dataset.used==='true';
 function media(a,b){const chosen=$('nf4044Media').value;if(chosen!=='auto')return chosen;return kind(a)==='fiber'||kind(b)==='fiber'?'fiber':'ethernet'}
 function compatibility(a,b){if(a.node.id===b.node.id)return {ok:false,reason:'Pilih perangkat berbeda.'};if(used(a)||used(b))return {ok:false,reason:'Port sedang digunakan.'};const m=media(a,b);if(m==='fiber'&&(kind(a)!=='fiber'||kind(b)!=='fiber'))return {ok:false,reason:'Fiber memerlukan SFP/Fiber di kedua ujung.'};if(m!=='fiber'&&(kind(a)==='fiber'||kind(b)==='fiber'))return {ok:false,reason:'RJ45 tidak dapat disambungkan langsung ke SFP/Fiber.'};if(m==='poe'&&a.el.dataset.kind!=='poe'&&b.el.dataset.kind!=='poe')return {ok:false,reason:'Kabel PoE memerlukan setidaknya satu port PoE.'};return {ok:true,reason:'Port cocok.'}}
 function clearHighlights(){canvas.querySelectorAll('.nf4044-from,.nf4044-good,.nf4044-bad').forEach(e=>e.classList.remove('nf4044-from','nf4044-good','nf4044-bad'))}
 function refresh(){clearHighlights();if(first){first.el.classList.add('nf4044-from');canvas.querySelectorAll('.nf4033-jack').forEach(e=>{if(e===first.el)return;const p=getPort(e);if(!p)return;e.classList.add(compatibility(first,p).ok?'nf4044-good':'nf4044-bad')})}}
 function reset(){first=null;clearHighlights()}
 function toggle(force){active=typeof force==='boolean'?force:!active;bar.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));try{window.NetForgeCancelTool?.sync?.()}catch(_e){}if(!active){reset();status.textContent='Pilih port sumber, lalu port tujuan.'}else{status.textContent='Klik port pertama pada perangkat sumber.';canvas.scrollIntoView({block:'nearest'});} }
 btn.addEventListener('click',()=>toggle());$('nf4044Cancel').addEventListener('click',()=>{const _wasActive=active;toggle(false);/* v0.40.92: 'Selesai' mode port kini menulis entri log seperti '✕ Batal' — sebelumnya hanya toggle(false) tanpa msg() (audit live v0.40.88 butir 5). */if(_wasActive){try{if(window.NetForgeActivityLog)window.NetForgeActivityLog('Mode Sambung port selesai. Kembali ke mode Pindah.');}catch(_e){}}});$('nf4044Batal').addEventListener('click',()=>{/* v0.40.92: Batal mode port kini mencatat log seperti Batal alur Hubungkan — sebelumnya hanya toggle(false) tanpa msg(), sehingga pembatalan tidak meninggalkan jejak di Activity Log (audit live v0.40.87 B5). cancelCableMode() menulis "Mode kabel dibatalkan. Kembali ke mode Pindah." via msg() sekaligus keluar dari mode port; fallback ke toggle(false) bila belum tersedia. */try{if(window.NetForgeCancelTool?.cancel)window.NetForgeCancelTool.cancel();else toggle(false);}catch(_e){toggle(false);}});$('nf4044Media').addEventListener('change',refresh);
 canvas.addEventListener('pointerdown',e=>{if(e.target.closest('.nf4033-jack')&&!isHubungkanActive())e.stopImmediatePropagation()},true);
 canvas.addEventListener('click',e=>{if(isHubungkanActive())return;const el=e.target.closest('.nf4033-jack');if(!el)return;e.preventDefault();e.stopImmediatePropagation();if(!active)toggle(true);const p=getPort(el);if(!p){status.textContent='Port belum tersedia di katalog perangkat.';return}if(!first){if(used(p)){status.textContent='Port '+p.port+' sudah digunakan. Pilih port yang kosong.';return}first=p;status.textContent='Sumber '+(p.node.name||p.node.type)+':'+p.port+' dipilih. Klik port tujuan berwarna hijau.';refresh();return}
 const test=compatibility(first,p);if(!test.ok){status.textContent='⚠ '+test.reason;refresh();return}const m=media(first,p),answer=API()?.connectPorts?.(first.node.id,first.port,p.node.id,p.port,m);if(!answer){status.textContent='Engine koneksi belum tersedia.';return}if(answer.ok){/* v0.40.92: TETAP di mode port setelah kabel berhasil agar pasangan berikutnya bisa langsung disambung - v0.40.86 keluar otomatis (reset+toggle(false)), sehingga percobaan pasangan kedua (mis. Desktop ETH0->Switch LAN2 di Lab) jatuh ke mode nonaktif: klik hanya membuka tooltip detail port + memilih perangkat, tanpa kabel, dan bar mode hilang (terbukti di jsdom). Keluar eksplisit tetap lewat Selesai / ✕ Batal / Escape. */reset();status.textContent='✓ Link berhasil dibuat! Pilih port sumber berikutnya, atau klik Selesai / ✕ Batal untuk keluar.';refresh();return}status.textContent='⚠ '+answer.reason;reset();},true);
 canvas.addEventListener('keydown',e=>{if(active&&(e.key==='Enter'||e.key===' ')&&e.target.classList.contains('nf4033-jack')){e.preventDefault();e.target.click()}},true);
 document.addEventListener('keydown',e=>{if(active&&e.key==='Escape')toggle(false)});
 window.addEventListener('netforge:unified-history-state',()=>{if(active)requestAnimationFrame(refresh)});
 const obs=new MutationObserver(()=>{if(active&&first&&!first.el.isConnected){first=null;status.textContent='Tampilan topologi diperbarui. Pilih kembali port sumber.';requestAnimationFrame(refresh)}});obs.observe(canvas,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf4045-port-cable-engine === */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const api=()=>window.NetForgeUniversalInventory;
 const catalog=()=>api()?.catalog||[];
 const nodePort=(node,name)=>{const n=String(name||'');if(/^SFP/i.test(n))return {kind:'fiber',speed:1000};if(node?.type==='router'&&n==='LAN3'||node?.type==='router'&&n==='LAN4')return {kind:'rj45',speed:100};return {kind:'rj45',speed:1000};};
 function endpoint(node,port,canvas,view){
  const host=canvas.querySelector('[data-node="'+String(node.id)+'"]');
  const jack=host&&[...host.querySelectorAll('.nf4033-jack')].find(p=>p.textContent.trim()===String(port));
  const el=jack||host; if(!el)return {x:node.x,y:node.y,found:false};
  const a=el.getBoundingClientRect(),r=view.getBoundingClientRect();
  if(!r.width||!r.height)return {x:node.x,y:node.y,found:false};
  return {x:(a.left+a.width/2-r.left)/r.width*100,y:(a.top+a.height/2-r.top)/r.height*100,found:!!jack};
 }
 let pending=false,signature='';
 function update(){pending=false;const canvas=$('nf400Canvas'),wires=$('nf400Wires'),view=$('nf4024Viewport');if(!canvas||!view||!wires||canvas.hidden)return;
  const state=api()?.getState?.();if(!state?.nodes||!state?.edges)return;
  const lines=[...wires.querySelectorAll('line.nf400-wire')];const hits=[...wires.querySelectorAll('line.nf400-wire-hit')];
  for(let i=0;i<state.edges.length;i++){
   const edge=state.edges[i],line=lines[i];if(!line)continue;
   const a=state.nodes.find(n=>String(n.id)===String(edge.a)),b=state.nodes.find(n=>String(n.id)===String(edge.b));if(!a||!b)continue;
   const left=endpoint(a,edge.portA,canvas,view),right=endpoint(b,edge.portB,canvas,view);
   // SVG viewBox is 0..100; geometry is updated in the current transformed viewport.
   line.setAttribute('x1',left.x.toFixed(3));line.setAttribute('y1',left.y.toFixed(3));line.setAttribute('x2',right.x.toFixed(3));line.setAttribute('y2',right.y.toFixed(3));
   const infoA=nodePort(a,edge.portA),infoB=nodePort(b,edge.portB);
   const down=!api().isLinkActive?.(edge),speed=Math.min(infoA.speed,infoB.speed);
   line.classList.toggle('nf4045-down',down);line.classList.toggle('nf4045-fiber',edge.medium==='fiber');line.classList.toggle('nf4045-poe',edge.medium==='poe');line.classList.toggle('nf4045-good',!down);
   const desc=(a.name||a.type)+' '+(edge.portA||'auto')+' ↔ '+(b.name||b.type)+' '+(edge.portB||'auto')+' · '+(edge.medium||'ethernet').toUpperCase()+' · '+(down?'LINK DOWN':speed+' Mbps (simulasi)');
   let title=line.querySelector('title');if(!title){title=document.createElementNS('http://www.w3.org/2000/svg','title');line.appendChild(title)}if(title.textContent!==desc)title.textContent=desc;
   /* v0.40.92: label deskriptif + geometri klik PINDAH ke hit-line — sebelumnya label "Laptop ETH0 ↔ Switch LAN3 · ..." (role=button) menempel di garis TERLIHAT (pointer-events:none) sementara yang bisa diklik adalah hit-line transparan (label generik, tanpa role), sehingga klik lewat referensi ditolak "covered". Garis terlihat kini hanya membawa <title> (tooltip hover). Hit-line juga disejajarkan ke geometri jack yang sama dengan garis terlihat (inset 28px layar agar tidak menutupi chip jack) — sebelumnya hit-line memakai geometri pusat node + inset 72px dari draw(), sehingga titik tengah garis terlihat bisa meleset dari area klik. */
   line.removeAttribute('aria-label');
   const hit=hits[i];
   if(hit){const vr=view.getBoundingClientRect();if(vr&&vr.width&&vr.height){const _px=vr.width/100,_py=vr.height/100,_dx=(right.x-left.x)*_px,_dy=(right.y-left.y)*_py,_len=Math.hypot(_dx,_dy)||1,_in=Math.max(0,Math.min(28,_len/2-4)),_ux=_dx/_len,_uy=_dy/_len;hit.setAttribute('x1',(left.x+_ux*_in/_px).toFixed(3));hit.setAttribute('y1',(left.y+_uy*_in/_py).toFixed(3));hit.setAttribute('x2',(right.x-_ux*_in/_px).toFixed(3));hit.setAttribute('y2',(right.y-_uy*_in/_py).toFixed(3));}const _cur=hit.getAttribute('aria-label')||'';if(!_cur.startsWith(desc))hit.setAttribute('aria-label',desc);}
  }
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(update)}
 function boot(){const canvas=$('nf400Canvas'),nodes=$('nf400Nodes'),wires=$('nf400Wires');if(!canvas||!nodes||!wires)return false;
  const observer=new MutationObserver(schedule);observer.observe(nodes,{childList:true,subtree:true,attributes:true,attributeFilter:['style','data-used']});
  const wo=new MutationObserver(schedule);wo.observe(wires,{childList:true,subtree:false});
  new ResizeObserver(schedule).observe(canvas);const v=$('nf4024Viewport');if(v)new ResizeObserver(schedule).observe(v);
  canvas.addEventListener('pointermove',schedule,{passive:true});canvas.addEventListener('pointerup',schedule,{passive:true});canvas.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});window.addEventListener('netforge:viewport-changed',schedule);window.addEventListener('netforge:unified-graph-changed',schedule);window.addEventListener('netforge:unified-mission-opened',schedule);window.addEventListener('netforge:link-created',schedule);
  ['nf4044Connect','nf4044Cancel','nf4044Media'].forEach(id=>$(id)?.addEventListener('click',schedule));
  const info=document.createElement('div');info.id='nf4045LinkInfo';info.textContent='Kabel mengikuti titik port • Hover kabel untuk melihat media, status link, dan kecepatan negosiasi (simulasi).';
  const toolbar=$('nf4044Toolbar');if(toolbar)toolbar.after(info);else canvas.before(info);
  schedule();return true;
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{if(!boot())setTimeout(boot,500)},{once:true});else if(!boot())setTimeout(boot,500);
})();
;

/* === script:nf4046-link-panel === */
(()=>{'use strict';
 const $=id=>document.getElementById(id),api=()=>window.NetForgeUniversalInventory;
 let activeIndex=null,lastTrigger=null,frame=null;
 function explain(d){
  if(d.disabled)return 'Link sengaja dinonaktifkan. Klik Aktifkan Link untuk memulihkan jalur.';
  const m=String(d.reason||'').toLowerCase();
  if(m.includes('sfp')||m.includes('fiber')||m.includes('media'))return 'Iga: Periksa jenis konektor kedua ujung. RJ45 dan SFP/Fiber tidak dapat disambungkan langsung tanpa perangkat atau modul yang sesuai.';
  if(m.includes('poe'))return 'Iga: Cocokkan port sumber daya PoE dengan kemampuan penerima. Periksa perangkat yang membutuhkan daya dan jenis port switch.';
  if(m.includes('wi-fi')||m.includes('wifi'))return 'Iga: Samakan SSID, kata sandi, dan band wireless untuk mengembalikan asosiasi.';
  if(!d.up)return 'Iga: Periksa jenis media, port sumber/tujuan, dan kondisi interface perangkat.';
  return 'Iga: Link fisik dinyatakan aktif. Untuk memeriksa IP, subnet, gateway, dan routing gunakan Ping/Traceroute pada terminal.';
 }
 function boot(){const canvas=$('nf400Canvas'),wires=$('nf400Wires');if(!canvas||!wires||$('nf4046Overlay'))return;
  const overlay=document.createElement('div');overlay.id='nf4046Overlay';overlay.hidden=true;
  overlay.innerHTML='<section id="nf4046Card" role="dialog" aria-modal="true" aria-labelledby="nf4046Title"><header><h3 id="nf4046Title">🔌 Pemeriksaan Kabel</h3><button type="button" id="nf4046Close" aria-label="Tutup pemeriksaan kabel">✕ Tutup</button></header><strong id="nf4046Endpoints"></strong><div id="nf4046Meta" class="nf4046-meta"></div><div id="nf4046Status" class="nf4046-status" role="status"></div><p class="nf4046-tips" id="nf4046Tips"></p><div class="nf4046-actions"><button type="button" id="nf4046Test">▶ Uji Link Fisik</button><button type="button" id="nf4046Toggle">Nonaktifkan Link</button><button type="button" class="danger" id="nf4046Remove">🗑️ Hapus Kabel</button></div></section>';
  document.body.append(overlay);
  const els={endpoint:$('nf4046Endpoints'),meta:$('nf4046Meta'),status:$('nf4046Status'),tips:$('nf4046Tips'),toggle:$('nf4046Toggle')};
  function current(){return api()?.linkDetails?.(activeIndex)||null}
  function deselect(){wires.querySelectorAll('.nf4046-selected').forEach(el=>el.classList.remove('nf4046-selected'))}
  function close(){overlay.hidden=true;deselect();activeIndex=null;lastTrigger?.focus?.();}
  function refresh(){const d=current();if(!d){close();return}els.endpoint.textContent=d.aName+' : '+d.portA+' ↔ '+d.bName+' : '+d.portB;
   els.meta.replaceChildren();for(const text of [d.medium.toUpperCase(),d.speedMbps?d.speedMbps+' Mbps (simulasi)':'Media wireless',d.up?'LINK UP':'LINK DOWN',d.disabled?'Admin: Off':'Admin: On']){const span=document.createElement('span');span.textContent=text;els.meta.append(span)}
   els.status.textContent=(d.up?'✓ Link aktif. ':'⚠ Link bermasalah. ')+d.reason;els.status.classList.toggle('down',!d.up);
   els.tips.textContent=explain(d);els.toggle.textContent=d.disabled?'Aktifkan Link':'Nonaktifkan Link';}
  function open(index,trigger){activeIndex=index;lastTrigger=trigger;overlay.hidden=false;deselect();trigger.classList.add('nf4046-selected');refresh();$('nf4046Close').focus();}
  function lineIndex(line){const all=[...wires.querySelectorAll('line.nf400-wire')];return all.indexOf(line)}
  wires.addEventListener('click',e=>{const line=e.target.closest('line.nf400-wire,line.nf400-wire-hit');if(!line)return;const i=line.dataset.edge!=null?Number(line.dataset.edge):lineIndex(line);if(i<0||!Number.isInteger(i))return;e.preventDefault();e.stopPropagation();const vis=[...wires.querySelectorAll('line.nf400-wire')][i];open(i,vis||line)});
  wires.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const line=e.target.closest('line.nf400-wire,line.nf400-wire-hit');if(!line)return;e.preventDefault();const i=line.dataset.edge!=null?Number(line.dataset.edge):lineIndex(line);if(i>=0&&Number.isInteger(i))open(i,line)});
  // Keep dynamically rendered wires keyboard reachable.
  function labelLine(line){/* v0.40.92: idempotent — jangan menimpa label endpoint nf4045 ("Router LAN1 ↔ Switch LAN1 · ETHERNET · ...") dan jangan menambahkan suffix berulang. Sebelumnya '; Enter untuk detail' ditambahkan di SETIAP mutasi (label memanjang tanpa batas), dan labelLine menimpa label nf4045 lalu ditimpa balik oleh update() nf4045 di rAF berikutnya. */line.setAttribute('tabindex','0');line.setAttribute('role','button');const _cur=line.getAttribute('aria-label')||'';if(!_cur)line.setAttribute('aria-label','Kabel jaringan; Enter untuk detail');else if(!_cur.includes('; Enter untuk detail'))line.setAttribute('aria-label',_cur+'; Enter untuk detail')}
  const obs=new MutationObserver(()=>{for(const line of wires.querySelectorAll('line.nf400-wire-hit'))labelLine(line);if(!overlay.hidden&&activeIndex!==null&&!current())close()});/* v0.40.92: label keyboard (role/tabindex/aria-label) diterapkan ke HIT-LINE yang bisa diklik — sebelumnya ke garis terlihat (pointer-events:none) sehingga elemen berlabel tidak bisa diklik dan ditolak "covered". */
  obs.observe(wires,{childList:true});for(const line of wires.querySelectorAll('line.nf400-wire-hit'))labelLine(line);
  wires.setAttribute('aria-hidden','false');
  $('nf4046Close').addEventListener('click',close);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close()});
  function animate(){const d=current();if(!d)return;const line=[...wires.querySelectorAll('line.nf400-wire')][activeIndex];if(!line)return;
   if(frame)cancelAnimationFrame(frame);for(const el of wires.querySelectorAll('.nf4046-packet'))el.remove();
   if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
   const p=document.createElementNS('http://www.w3.org/2000/svg','circle');p.setAttribute('r','1.25');p.setAttribute('fill',d.up?'#68ffe3':'#ff9778');p.classList.add('nf4046-packet');wires.append(p);
   const x1=Number(line.getAttribute('x1')),y1=Number(line.getAttribute('y1')),x2=Number(line.getAttribute('x2')),y2=Number(line.getAttribute('y2'));const started=performance.now();
   function tick(t){if(!p.isConnected)return;const u=Math.min(1,(t-started)/880);p.setAttribute('cx',String(x1+(x2-x1)*u));p.setAttribute('cy',String(y1+(y2-y1)*u));if(u<1)frame=requestAnimationFrame(tick);else p.remove()}
   frame=requestAnimationFrame(tick);
  }
  $('nf4046Test').addEventListener('click',()=>{refresh();animate();const d=current();if(d)els.tips.textContent=(d.up?'✓ Uji link fisik berhasil. ':'⚠ Uji link fisik gagal. ')+explain(d)});
  $('nf4046Toggle').addEventListener('click',()=>{const result=api()?.manageLink?.(activeIndex,'toggle');if(!result?.ok){els.status.textContent=result?.reason||'Gagal mengubah link';return}refresh()});
  // v0.59.00: Hapus Kabel dulunya memakai window.confirm() — auto-dismiss di
  // browser uji sehingga handler berhenti sebelum manageLink('remove')
  // (kabel tetap ada, tanpa log/status). Kini konfirmasi dua-klik 10 detik
  // pada tombolnya sendiri, seperti tombol reset. Refund: budget dihitung
  // dari graf (budgetNow = $1.000 − perangkat − kabel×$10 − spent), jadi
  // menghapus kabel otomatis mengembalikan $10 — sama seperti Putuskan.
  let nf4046RemoveArmedAt=0;
  $('nf4046Remove').addEventListener('click',()=>{const d=current();if(!d)return;const btn=$('nf4046Remove');const now=Date.now();if(now-nf4046RemoveArmedAt>10000){nf4046RemoveArmedAt=now;if(btn)btn.textContent='⚠ Yakin hapus? Klik lagi (10 dtk)';els.status.textContent='Klik Hapus Kabel sekali lagi dalam 10 detik untuk mengonfirmasi. Kabel '+d.aName+' ↔ '+d.bName+' akan dilepas (refund $10, dapat dibatalkan dengan Undo).';setTimeout(()=>{if(Date.now()-nf4046RemoveArmedAt>=10000&&btn&&btn.isConnected)btn.textContent='🗑️ Hapus Kabel'},10100);return}nf4046RemoveArmedAt=0;if(btn)btn.textContent='🗑️ Hapus Kabel';const result=api()?.manageLink?.(activeIndex,'remove');if(result?.ok){const _msg='✓ Kabel '+d.aName+' ↔ '+d.bName+' dihapus (refund $10).';els.status.textContent=_msg;const _st=document.getElementById('nf400Status');if(_st)_st.textContent=_msg;setTimeout(close,1200)}else els.status.textContent=result?.reason||'Kabel gagal dihapus'});
  window.addEventListener('netforge:link-changed',()=>{if(!overlay.hidden)refresh()});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf4047TrafficGuide === */
(()=>{'use strict';
 const NS='http://www.w3.org/2000/svg';
 const $=id=>document.getElementById(id);
 const api=()=>window.NetForgeUniversalInventory;
 let generation=0,raf=0,timeout=0;
 const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-off');
 function status(title,body,ok){const p=$('nf4047Status');if(!p)return;p.hidden=false;p.dataset.ok=String(ok);p.querySelector('strong').textContent=title;p.querySelector('.nf4047-text').textContent=body;}
 function clear(){generation++;if(raf)cancelAnimationFrame(raf);if(timeout)clearTimeout(timeout);raf=0;document.querySelectorAll('#nf400Wires .nf4047-traffic').forEach(n=>n.remove());document.querySelectorAll('#nf400Wires .nf4047-fault').forEach(n=>n.classList.remove('nf4047-fault'));document.querySelectorAll('#nf400Canvas .nf4047-hop').forEach(n=>n.classList.remove('nf4047-hop'));}
 function pathSegments(path){const graph=api()?.getState?.(),svg=$('nf400Wires');if(!graph||!svg||!Array.isArray(path))return [];
   const lines=[...svg.querySelectorAll('line.nf400-wire')],list=[];
   for(let k=1;k<path.length;k++){
    const from=String(path[k-1]),to=String(path[k]);
    const i=graph.edges.findIndex(e=>(String(e.a)===from&&String(e.b)===to)||(String(e.a)===to&&String(e.b)===from));
    if(i<0||!lines[i])return [];
    const l=lines[i],forward=String(graph.edges[i].a)===from;
    const a={x:Number(l.getAttribute(forward?'x1':'x2')),y:Number(l.getAttribute(forward?'y1':'y2'))};
    const b={x:Number(l.getAttribute(forward?'x2':'x1')),y:Number(l.getAttribute(forward?'y2':'y1'))};
    if(![a.x,a.y,b.x,b.y].every(Number.isFinite))return [];
    list.push({a,b,line:l,to});
   }return list;
 }
 function animateLeg(leg,token,color,duration){return new Promise(resolve=>{
   if(token!==generation||reduced()){resolve();return}
   const svg=$('nf400Wires');if(!svg||!leg.line.isConnected){resolve();return}
   const dot=document.createElementNS(NS,'circle');dot.classList.add('nf4047-traffic');dot.setAttribute('r','5');dot.setAttribute('fill',color);dot.setAttribute('stroke','#fff');dot.setAttribute('stroke-width','1.6');svg.appendChild(dot);
   const start=performance.now();let previous=-1;
   function tick(now){if(token!==generation||!dot.isConnected||!leg.line.isConnected){dot.remove();resolve();return}
     const t=Math.min(1,(now-start)/duration);const p=t*t*(3-2*t);
     const x=leg.a.x+(leg.b.x-leg.a.x)*p,y=leg.a.y+(leg.b.y-leg.a.y)*p;
     dot.setAttribute('cx',String(x));dot.setAttribute('cy',String(y));
     if(t<1)raf=requestAnimationFrame(tick);else{dot.remove();resolve()}
   }raf=requestAnimationFrame(tick);
 });}
 async function animatePath(path,returnTrip,trace){clear();const token=generation;const seg=pathSegments(path);if(!seg.length)return;
   for(const s of seg){if(token!==generation)return;const n=document.querySelector('#nf400Nodes [data-node="'+CSS.escape(String(s.to))+'"]');
     if(n){n.classList.add('nf4047-hop');setTimeout(()=>n.classList.remove('nf4047-hop'),700)}
     await animateLeg(s,token,'#5cf8f0',trace?470:360);
   }
   if(returnTrip&&token===generation){for(const s of [...seg].reverse()){if(token!==generation)return;await animateLeg({a:s.b,b:s.a,line:s.line},token,'#f8d278',270)}}
 }
 function explainFail(message){const s=String(message||'').toLowerCase();
  if(/down|kabel|link|layer 2|media|port|interface/.test(s))return 'Iga: Periksa status kabel dan port kedua ujung. Klik kabel berwarna merah untuk melihat penyebabnya.';
  if(/subnet|mask|ip conflict|duplikat/.test(s))return 'Iga: Cocokkan IPv4, prefix/subnet mask dan pastikan tidak ada IP duplikat.';
  if(/gateway|next hop|route|routing|ttl/.test(s))return 'Iga: Periksa default gateway, interface router dan tabel routing beserta jalur balik.';
  if(/dhcp/.test(s))return 'Iga: Periksa layanan DHCP dan alamat IP yang diterima klien.';
  if(/vlan/.test(s))return 'Iga: Periksa VLAN pada port access dan trunk sepanjang jalur.';
  return 'Iga: Buka diagnostik, periksa konfigurasi IP serta link yang aktif, kemudian ulangi tes.';
 }
 /* v0.40.92: highlightFault(preferredIndex) — bila dipanggil dari link-changed dengan indeks kabel yang baru diubah, utamakan kabel itu; sebelumnya selalu kabel LINK DOWN pertama, sehingga toast "Link bermasalah" menamai kabel lama (bekas Chaos Router↔Switch) bukan aksi terakhir (Laptop↔Switch, audit live v0.40.89 butir 3). Tanpa indeks (mis. kegagalan ping/traceroute), tetap kabel LINK DOWN pertama. */
 function highlightFault(preferredIndex){const graph=api()?.getState?.(),svg=$('nf400Wires');if(!graph||!svg)return null;
   const lines=[...svg.querySelectorAll('line.nf400-wire')];
   let index=-1;
   if(Number.isInteger(preferredIndex)&&preferredIndex>=0&&preferredIndex<graph.edges.length&&api()?.linkDetails?.(preferredIndex)?.up===false)index=preferredIndex;
   if(index<0)index=graph.edges.findIndex((e,i)=>api()?.linkDetails?.(i)?.up===false);
   if(index<0||!lines[index])return null;
   const d=api()?.linkDetails?.(index);lines[index].classList.add('nf4047-fault');
   return d?`${d.aName} (${d.portA}) ↔ ${d.bName} (${d.portB}): ${d.reason}`:null;
 }
 function onTest(ev){const d=ev.detail||{};clear();if(d.ok){const hops=Array.isArray(d.hops)?d.hops:[];
   status(d.trace?'✓ Traceroute berhasil':'✓ Ping berhasil',d.trace?'Iga: Ikuti paket pada setiap hop.':'Iga: Paket permintaan bergerak cyan, paket balasan bergerak kuning.',true);
   animatePath(hops,!d.trace,!!d.trace);
 }else{
   const detail=highlightFault(),hint=explainFail(d.message||d.reason);
   status('⚠ Pengujian jaringan gagal',detail?hint+' Link bermasalah: '+detail:hint,false);
 }}
 function boot(){const canvas=$('nf400Canvas');if(!canvas||$('nf4047Status'))return;
   const p=document.createElement('aside');p.id='nf4047Status';p.hidden=true;p.setAttribute('role','status');
   p.innerHTML='<button type="button" aria-label="Tutup informasi Iga">×</button><strong></strong><span class="nf4047-text"></span>';
   p.querySelector('button').addEventListener('click',()=>{p.hidden=true;clear()});canvas.appendChild(p);
   window.addEventListener('netforge:network-test',onTest);
   window.addEventListener('netforge:link-changed',(ev)=>{clear();const fault=highlightFault(ev&&ev.detail?ev.detail.index:undefined);if(fault)status('⚠ Link bermasalah','Iga: '+fault,false);else{const _p=$('nf4047Status');if(_p)_p.hidden=true;}});/* v0.40.92: bila tidak ada kabel DOWN, sembunyikan toast (sebelumnya menampilkan "Status link diperbarui" yang menempel tanpa batas — audit live v0.40.90 butir 10). */
   window.addEventListener('netforge:unified-graph-changed',()=>{/* v0.40.92: backstop — mutasi graf yang TIDAK mendispatch link-changed (importGraph, undo/redo, pemulihan snapshot) bisa meninggalkan toast fault basi; bila panel sedang menampilkan fault "Link bermasalah" tapi sudah tidak ada kabel DOWN, sembunyikan. Tidak pernah memunculkan toast (menghormati tombol ✕) dan tidak menyentuh status hasil tes. */const _p=$('nf4047Status');if(!_p||_p.hidden||_p.dataset.ok!=='false')return;const _t=_p.querySelector('strong');if(!_t||_t.textContent!=='⚠ Link bermasalah')return;if(!highlightFault()){_p.hidden=true;clear();}});
   window.addEventListener('netforge:link-created',()=>{clear();p.hidden=true});
   window.addEventListener('netforge:unified-mission-opened',()=>{clear();p.hidden=true;});/* v0.40.92: toast status link ('⚠ Link bermasalah' / '✓ Status link diperbarui') adalah milik canvas/mode sebelumnya — sebelumnya tidak ada yang membersihkannya saat ganti misi, sehingga bisa menempel di workspace misi berikutnya. */
   window.NetForgeLinkToastClear=()=>{clear();p.hidden=true;};/* v0.40.92: ekspos pembersih toast agar enter()/leave() Lab bisa memanggilnya (butir 6). */
   // Existing network engine owns device repositioning and redraw. Stop any stale animation immediately.
   const wires=$('nf400Wires');if(wires){const observer=new MutationObserver(records=>{
     if(records.some(r=>r.type==='childList'&&[...r.removedNodes].some(n=>n.nodeType===1&&n.nodeName.toLowerCase()==='line')))clear();
   });observer.observe(wires,{childList:true});}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf48PlayerRatings === */
(()=>{'use strict';
const KEY='netforge-rating-v1';let rating=0,lastFocus=null;
const $=id=>document.getElementById(id);
const modal=$('nf48Modal'), dialog=modal?.querySelector('.nf48-window');if(!modal||!dialog)return;
const stars=[...modal.querySelectorAll('[data-rating]')];
const status=msg=>{$('nf48Status').textContent=msg};
const parse=()=>{try{const d=JSON.parse(localStorage.getItem(KEY)||'null');return d&&Number.isInteger(d.rating)&&d.rating>=1&&d.rating<=5?d:null}catch{return null}};
function update(){stars.forEach(b=>{const active=Number(b.dataset.rating)<=rating;b.dataset.active=String(active);b.setAttribute('aria-pressed',String(Number(b.dataset.rating)===rating))});$('nf48RatingLabel').textContent=rating?`${rating}/5 bintang — ${['','Perlu banyak perbaikan','Perlu perbaikan','Cukup baik','Bagus','Sangat bagus'][rating]}`:'Pilih jumlah bintang'}
function render(){const d=parse();$('nf48Result').textContent=d?`${d.rating} dari 5 bintang · ${d.categoryLabel||'Pengalaman keseluruhan'} · disimpan ${new Date(d.createdAt).toLocaleString('id-ID')}`:'Belum ada rating tersimpan.';if(d){rating=d.rating;$('nf48Category').value=d.category||'overall';$('nf48Comment').value=d.comment||''}update()}
function open(){lastFocus=document.activeElement;modal.hidden=false;render();status('');dialog.focus()}
function close(){modal.hidden=true;if(lastFocus&&typeof lastFocus.focus==='function')lastFocus.focus()}
$('nf48RateNav')?.addEventListener('click',open);$('nf48Close').addEventListener('click',close);
modal.addEventListener('click',e=>{if(e.target===modal)close()});
modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Tab'){const nodes=[...modal.querySelectorAll('button,select,textarea,a[href]')].filter(n=>!n.disabled);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
stars.forEach(button=>button.addEventListener('click',()=>{rating=Number(button.dataset.rating);update()}));
$('nf48Save').addEventListener('click',()=>{if(rating<1||rating>5){status('Pilih 1–5 bintang dahulu.');return}const c=$('nf48Category');const data={schema:1,rating,category:c.value,categoryLabel:c.options[c.selectedIndex].text,comment:$('nf48Comment').value.trim().slice(0,600),createdAt:new Date().toISOString(),appVersion:window.NETFORGE_RELEASE?.version||'0.59.00',scope:'local'};try{localStorage.setItem(KEY,JSON.stringify(data));render();status('✓ Rating tersimpan pada browser ini. Belum dikirim ke server.') }catch{status('Gagal menyimpan. Periksa izin penyimpanan browser.')} });
$('nf48Export').addEventListener('click',()=>{const d=parse();if(!d){status('Belum ada rating untuk diekspor.');return}const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='netforge-rating-'+d.appVersion+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);status('Rating diekspor. Ekspor tidak mengirim data ke server.');});
window.NetForgeRatings={open,read:parse};
})();
;

/* === script:nf49CommunityRatings === */
(()=>{'use strict';
  const $=id=>document.getElementById(id);
  const key='netforge-rating-v1';
  const state=$('nf49RemoteState'), summary=$('nf49Summary'), refresh=$('nf49Refresh'), sync=$('nf49Sync');
  if(!state||!summary||!refresh||!sync)return;
  const status=s=>{state.textContent=s};
  function base(){
    const value=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');
    if(!value)throw Error('Alamat backend belum diatur. Buka Pengaturan → Akun Resmi.');
    const url=new URL(value);
    const local=['localhost','127.0.0.1'].includes(url.hostname);
    if(url.protocol!=='https:'&&!(url.protocol==='http:'&&local))throw Error('API harus memakai HTTPS.');
    if(!url.pathname.endsWith('/api/v1'))throw Error('URL backend harus berakhir dengan /api/v1.');
    return url.href.replace(/\/$/,'');
  }
  async function request(path,{method='GET',body,auth=false}={}){
    const headers={Accept:'application/json'};
    if(body)headers['Content-Type']='application/json';
    if(auth){const token=await window.NetForgeAuth?.accessToken?.();if(!token)throw Error('Masuk dengan akun resmi NET FORGE dahulu.');headers.Authorization='Bearer '+token}
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
    try{
      const resp=await fetch(base()+path,{method,headers,body:body?JSON.stringify(body):undefined,mode:'cors',cache:'no-store',signal:controller.signal,credentials:'omit'});
      const json=await resp.json().catch(()=>null);
      if(!resp.ok)throw Error((typeof json?.message==='string'?json.message:null)||'Server mengembalikan HTTP '+resp.status);
      return json;
    }finally{clearTimeout(timeout)}
  }
  function validate(x){return x&&typeof x==='object'&&Number.isFinite(Number(x.average))&&Number(x.average)>=0&&Number(x.average)<=5&&Number.isInteger(x.count)&&x.count>=0}
  async function getSummary(){refresh.disabled=true;status('Memeriksa API rating komunitas…');
    try{const data=await request('/ratings/summary');if(!validate(data))throw Error('Format ringkasan backend tidak sesuai kontrak.');
      summary.textContent=data.count===0?'Belum ada penilaian komunitas yang masuk.':`⭐ ${Number(data.average).toFixed(2)} / 5 dari ${data.count.toLocaleString('id-ID')} pemain.`;
      status('Data komunitas berhasil dibaca dari backend.');
    }catch(error){summary.textContent='Statistik global belum tersedia.';status('Tidak dapat mengambil rating komunitas: '+error.message)}
    finally{refresh.disabled=false}
  }
  async function sendRating(){
    let item;try{item=JSON.parse(localStorage.getItem(key)||'null')}catch{}
    if(!item||!Number.isInteger(item.rating)||item.rating<1||item.rating>5){status('Simpan rating lokal 1–5 bintang terlebih dahulu.');return}
    if(!window.confirm('Kirim rating dan komentar Anda ke backend NET FORGE? Rating sebelumnya pada akun yang sama dapat diperbarui.'))return;
    sync.disabled=true;status('Mengirim rating melalui akun resmi…');
    try{
      const body={rating:item.rating,category:['overall','learning','interface','missions','performance'].includes(item.category)?item.category:'overall',comment:String(item.comment||'').slice(0,600)};
      await request('/ratings/me',{method:'PUT',body,auth:true});
      status('✓ Rating berhasil disimpan oleh backend.');await getSummary();
    }catch(error){status('Pengiriman gagal; rating lokal tetap aman. '+error.message)}finally{sync.disabled=false}
  }
  refresh.addEventListener('click',getSummary);sync.addEventListener('click',sendRating);
  $('nf48RateNav')?.addEventListener('click',()=>{void getSummary()});
  window.NetForgeCommunityRatings={refresh:getSummary};
})();
;

/* === script:nf50CommunityFeedback === */
(()=>{'use strict';
 const $=id=>document.getElementById(id), modal=$('nf50Modal'),panel=$('nf50Panel');if(!modal||!panel)return;
 const DRAFT='netforge-bug-draft-v1';let lastFocus=null;const msg=(id,s)=>{$(id).textContent=s};
 function open(){lastFocus=document.activeElement;modal.hidden=false;panel.focus();restoreDraft();}
 function close(){modal.hidden=true;if(lastFocus?.focus)lastFocus.focus()}
 $('nf50FeedbackNav')?.addEventListener('click',open);$('nf50Close').addEventListener('click',close);
 modal.addEventListener('click',e=>{if(e.target===modal)close()});modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();return}if(e.key==='Tab'){const nodes=[...panel.querySelectorAll('button,input,select,textarea')].filter(n=>!n.disabled);if(!nodes.length)return;if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus()}}});
 function base(){const raw=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');if(!raw)throw Error('Atur URL backend melalui Pengaturan → Akun Resmi.');const url=new URL(raw);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)))throw Error('Backend harus HTTPS.');if(!url.pathname.endsWith('/api/v1'))throw Error('URL backend harus berakhir dengan /api/v1.');return url.href.replace(/\/$/,'')}
 async function request(path,{method='GET',data,auth=false}={}){const headers={Accept:'application/json'};if(data)headers['Content-Type']='application/json';if(auth){const token=await window.NetForgeAuth?.accessToken?.();if(!token)throw Error('Silakan login akun resmi NET FORGE terlebih dahulu.');headers.Authorization='Bearer '+token;}const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const r=await fetch(base()+path,{method,mode:'cors',cache:'no-store',credentials:'omit',signal:controller.signal,headers,body:data?JSON.stringify(data):undefined});const json=await r.json().catch(()=>null);if(!r.ok)throw Error(json?.message||'Server HTTP '+r.status);return json}finally{clearTimeout(timer)}}
 function distribution(d){const root=$('nf50Distribution');root.replaceChildren();const total=d.count||0;for(let i=5;i>=1;i--){const n=Number(d.distribution?.[String(i)]??0);const line=document.createElement('div');line.className='nf50-dist';const label=document.createElement('span');label.textContent=i+' ★';const meter=document.createElement('div');meter.className='nf50-meter';const fill=document.createElement('span');fill.style.width=(total?Math.max(0,Math.min(100,100*n/total)):0)+'%';meter.append(fill);const val=document.createElement('span');val.textContent=String(n);line.append(label,meter,val);root.append(line)}}
 async function stats(){const button=$('nf50Reload');button.disabled=true;msg('nf50SummaryMessage','Mengambil ringkasan dari server…');try{const d=await request('/ratings/summary');if(!d||!Number.isFinite(Number(d.average))||!Number.isInteger(d.count)||d.count<0||Number(d.average)<0||Number(d.average)>5)throw Error('Format respons statistik tidak valid.');$('nf50Avg').textContent=Number(d.average).toFixed(2)+' / 5';$('nf50Count').textContent=d.count.toLocaleString('id-ID');$('nf50Online').textContent='Terhubung';distribution(d);msg('nf50SummaryMessage','Statistik berasal dari backend resmi NET FORGE.')}catch(e){$('nf50Avg').textContent='—';$('nf50Count').textContent='—';$('nf50Online').textContent='Offline';$('nf50Distribution').textContent='Belum ada data server.';msg('nf50SummaryMessage','Tidak dapat memuat statistik komunitas: '+e.message)}finally{button.disabled=false}}
 $('nf50Reload').addEventListener('click',stats);$('nf50OpenRating').addEventListener('click',()=>{close();window.NetForgeRatings?.open?.()});
 function readForm(){return {kind:$('nf50Kind').value,title:$('nf50Title').value.trim(),description:$('nf50Description').value.trim(),severity:$('nf50Severity').value,app_version:window.NETFORGE_RELEASE?.version||'0.59.00'}}
 function restoreDraft(){try{const d=JSON.parse(localStorage.getItem(DRAFT)||'null');if(!d)return;$('nf50Kind').value=d.kind||'other';$('nf50Title').value=d.title||'';$('nf50Description').value=d.description||'';$('nf50Severity').value=d.severity||'medium'}catch{}}
 function save(){try{localStorage.setItem(DRAFT,JSON.stringify(readForm()));msg('nf50ReportMessage','✓ Draf disimpan di browser ini; belum dikirim ke server.')}catch{msg('nf50ReportMessage','Tidak dapat menyimpan draf pada browser ini.')}}
 $('nf50Draft').addEventListener('click',save);
 $('nf50Export').addEventListener('click',()=>{const d=readForm();const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));a.href=url;a.download='netforge-bug-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);msg('nf50ReportMessage','Berkas JSON diekspor tanpa mengirim data ke server.')});
 $('nf50Submit').addEventListener('click',async()=>{const d=readForm();if(d.title.length<8||d.description.length<20){msg('nf50ReportMessage','Judul minimal 8 karakter dan deskripsi minimal 20 karakter.');return}if(!confirm('Kirim laporan bug ini ke backend NET FORGE?'))return;const btn=$('nf50Submit');btn.disabled=true;msg('nf50ReportMessage','Mengirim laporan…');try{const r=await request('/feedback/reports',{method:'POST',data:d,auth:true});msg('nf50ReportMessage','✓ Laporan berhasil terkirim. Nomor #'+String(r.id||'—'));localStorage.removeItem(DRAFT);await mine()}catch(e){save();msg('nf50ReportMessage','Gagal mengirim; draf disimpan lokal. '+e.message)}finally{btn.disabled=false}});
 async function mine(){const root=$('nf50MineList');root.replaceChildren();const li=document.createElement('li');li.textContent='Memuat…';root.append(li);try{const data=await request('/feedback/reports/me',{auth:true});const records=Array.isArray(data?.data)?data.data:Array.isArray(data)?data:[];root.replaceChildren();if(!records.length){li.textContent='Belum ada laporan pada akun ini.';root.append(li);return}for(const item of records.slice(0,30)){const node=document.createElement('li');node.textContent='#'+item.id+' — '+String(item.title||'Laporan');const sub=document.createElement('small');sub.textContent='Status: '+String(item.status||'new')+' · '+String(item.created_at||'');node.append(sub);root.append(node)}}catch(e){li.textContent='Gagal memuat: '+e.message}}
 $('nf50Mine').addEventListener('click',mine);window.NetForgeFeedback={open,refresh:stats};
})();
;

/* === script:nf51AdminFeedback === */
(()=>{'use strict';
 const $=id=>document.getElementById(id), modal=$('nf51Modal'), entry=$('nf51AdminEntry');if(!modal||!entry)return;
 let authorized=false,tab='reports',page=1,lastPage=1,lastFocus=null,requestVersion=0;
 const statuses=['new','triaged','in_progress','resolved','closed'];
 const message=t=>{$('nf51Message').textContent=t};
 function base(){const raw=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');if(!raw)throw Error('Atur URL API melalui Pengaturan → Akun Resmi.');const u=new URL(raw);if(u.protocol!=='https:'&&!(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname)))throw Error('Backend harus HTTPS.');if(!u.pathname.endsWith('/api/v1'))throw Error('URL API harus berakhir dengan /api/v1.');return u.href.replace(/\/$/,'')}
 async function api(path,method='GET',data){const token=await window.NetForgeAuth?.accessToken?.();if(!token)throw Error('Masuk dengan akun resmi terlebih dahulu.');const ctrl=new AbortController(),timeout=setTimeout(()=>ctrl.abort(),12000);try{const r=await fetch(base()+path,{method,headers:{Accept:'application/json',Authorization:'Bearer '+token,...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined,signal:ctrl.signal,mode:'cors',cache:'no-store',credentials:'omit'});const json=await r.json().catch(()=>null);if(!r.ok){if(r.status===401||r.status===403){authorized=false;entry.hidden=true}throw Error(r.status===403?'Tidak memiliki izin administrator.':(typeof json?.message==='string'?json.message:'HTTP '+r.status))}return json}finally{clearTimeout(timeout)}}
 const append=(parent,tag,content,cls)=>{const e=document.createElement(tag);if(content!==undefined)e.textContent=String(content);if(cls)e.className=cls;parent.append(e);return e};
 async function verify(){entry.hidden=true;$('nf51AccessStatus').textContent='';try{await api('/admin/feedback/reports?page=1');authorized=true;entry.hidden=false;$('nf51AccessStatus').textContent='Akses administrator diverifikasi.'}catch(e){authorized=false;$('nf51AccessStatus').textContent='Panel admin tidak tersedia: '+e.message}}
 function show(){if(!authorized)return;lastFocus=document.activeElement;$('nf50Modal').hidden=true;modal.hidden=false;$('nf51Dialog').focus();tab='reports';page=1;switchTab('reports')}
 function hide(){modal.hidden=true;if(lastFocus?.focus)lastFocus.focus()}
 async function load(){const seq=++requestVersion;message('Memuat data dari server…');$('nf51TableBody').replaceChildren();const suffix=tab==='reports'?'/admin/feedback/reports':'/admin/feedback/ratings';const filter=tab==='reports'&&$('nf51Filter').value?'&status='+encodeURIComponent($('nf51Filter').value):'';
 try{const data=await api(suffix+'?page='+page+filter);if(seq!==requestVersion)return;const rows=Array.isArray(data?.data)?data.data:[];lastPage=Math.max(1,Number(data.last_page)||1);$('nf51Page').textContent='Halaman '+page+' / '+lastPage;$('nf51Prev').disabled=page<=1;$('nf51Next').disabled=page>=lastPage;draw(rows);message('Menampilkan '+rows.length+' entri dari server.');}catch(e){if(seq!==requestVersion)return;message('Gagal memuat: '+e.message)}}
 function draw(rows){const head=$('nf51TableHead'),body=$('nf51TableBody');head.replaceChildren();body.replaceChildren();const tr=append(head,'tr');(tab==='reports'?['ID / masalah','Prioritas','Status / aksi']:['ID / kategori','Ulasan','Moderasi']).forEach(t=>append(tr,'th',t));if(!rows.length){const row=append(body,'tr'),cell=append(row,'td','Tidak ada data pada halaman ini.');cell.colSpan=3;return}
 for(const item of rows){const row=append(body,'tr');const a=append(row,'td');append(a,'strong','#'+item.id+' — '+(tab==='reports'?item.title:item.category));append(a,'span','Akun #'+item.user_id+' · '+(item.created_at||''),'nf51-muted');const b=append(row,'td');const c=append(row,'td');if(tab==='reports'){append(b,'strong',item.severity||'-');append(b,'div',item.description||'','nf51-detail');const select=append(c,'select');for(const s of statuses){const o=append(select,'option',s);o.value=s;if(item.status===s)o.selected=true;}const note=append(c,'textarea');note.placeholder='Catatan administrator';note.maxLength=2000;note.value=item.admin_note||'';const btn=append(c,'button','Simpan penanganan');btn.type='button';btn.addEventListener('click',async()=>{if(!confirm('Simpan perubahan laporan #'+item.id+'?'))return;btn.disabled=true;try{await api('/admin/feedback/reports/'+encodeURIComponent(item.id),'PATCH',{status:select.value,admin_note:note.value});message('Laporan #'+item.id+' diperbarui.');await load();await summary()}catch(e){message('Gagal menyimpan: '+e.message)}finally{btn.disabled=false}})}else{append(b,'strong',(Number(item.rating)||0)+' ★');append(b,'div',item.comment||'(tanpa komentar)','nf51-detail');const visible=!!item.is_visible;append(c,'span',visible?'Ditampilkan':'Disembunyikan','nf51-muted');const btn=append(c,'button',visible?'Sembunyikan':'Tampilkan');btn.type='button';btn.addEventListener('click',async()=>{if(!confirm((visible?'Sembunyikan':'Tampilkan')+' rating #'+item.id+'?'))return;btn.disabled=true;try{await api('/admin/feedback/ratings/'+encodeURIComponent(item.id),'PATCH',{is_visible:!visible});message('Moderasi rating berhasil.');await load();}catch(e){message('Gagal memoderasi: '+e.message)}finally{btn.disabled=false}})}}}
 async function summary(){try{const d=await api('/admin/feedback/summary');if(!d||!Number.isInteger(d.total))throw Error('Ringkasan tidak valid');$('nf51Total').textContent=d.total;$('nf51New').textContent=d.new;$('nf51Progress').textContent=d.in_progress;$('nf51Resolved').textContent=d.resolved;}catch(e){['nf51Total','nf51New','nf51Progress','nf51Resolved'].forEach(id=>$(id).textContent='—');message('Ringkasan admin belum tersedia: '+e.message)}}
 function switchTab(t){tab=t;page=1;$('nf51ReportsTab').setAttribute('aria-selected',String(t==='reports'));$('nf51RatingsTab').setAttribute('aria-selected',String(t==='ratings'));$('nf51Filter').disabled=t!=='reports';load();summary()}
 entry.addEventListener('click',show);$('nf51Close').addEventListener('click',hide);modal.addEventListener('click',e=>{if(e.target===modal)hide()});modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();hide()}else if(e.key==='Tab'){const els=[...$('nf51Dialog').querySelectorAll('button,select,textarea')].filter(x=>!x.disabled);if(!els.length)return;if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus()}}});
 $('nf51ReportsTab').addEventListener('click',()=>switchTab('reports'));$('nf51RatingsTab').addEventListener('click',()=>switchTab('ratings'));$('nf51Filter').addEventListener('change',()=>{page=1;load()});$('nf51Refresh').addEventListener('click',()=>{load();summary()});$('nf51Prev').addEventListener('click',()=>{if(page>1){page--;load()}});$('nf51Next').addEventListener('click',()=>{if(page<lastPage){page++;load()}});
 $('nf50FeedbackNav')?.addEventListener('click',()=>{void verify()});window.NetForgeAdminFeedback={verify};
})();
;

/* === script:nf52-progress-sync === */
(()=>{'use strict';
const KEYNAMES={
 'netforge.mission.autosave.v031':'Topologi dan progres Misi',
 'netforge.guided.history.v027':'Riwayat Guided Lab / badge',
 'netforge.unified.mission.progress.v1':'Progres misi terpadu',
 'netforge.player.settings.v030':'Profil pemain',
 'netforge.lab.autosave.v031':'Eksperimen LAB tersimpan'
};
const KEYS=Object.keys(KEYNAMES),MAX_BYTES=350000;
const $=id=>document.getElementById(id);
let server=null,verifiedAccount=null,busy=false,compared=null;
function status(t){const e=$('nf52-status');if(e)e.textContent=t}
function state(name,txt){const e=$('nf53-state');if(e){e.dataset.state=name;e.textContent=txt}}
function getBase(){const raw=($('nf32Url')?.value||'').trim().replace(/\/+$/,'');if(!raw)throw Error('Konfigurasikan URL backend di Pengaturan > Akun Resmi.');const u=new URL(raw);if(u.protocol!=='https:'&&!(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname)))throw Error('API harus HTTPS.');if(!u.pathname.endsWith('/api/v1'))throw Error('URL API harus berakhir dengan /api/v1.');return raw}
async function api(path,method='GET',body){if(!navigator.onLine)throw Error('Perangkat offline. Progres lokal tetap aman.');const token=await window.NetForgeAuth?.accessToken?.();if(!token)throw Error('Masuk dengan Google di Akun Resmi terlebih dahulu.');const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),14000);try{const resp=await fetch(getBase()+path,{method,cache:'no-store',credentials:'omit',mode:'cors',signal:ctrl.signal,headers:{'Accept':'application/json','Authorization':'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const data=await resp.json().catch(()=>null);if(!resp.ok)throw Object.assign(Error(typeof data?.message==='string'?data.message:'HTTP '+resp.status),{status:resp.status});return data}finally{clearTimeout(timer)}}
function collect(){window.NetForgeProgress?.save?.();const out={};for(const key of KEYS){try{const raw=localStorage.getItem(key);if(raw===null)continue;const parsed=JSON.parse(raw);if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed)&&key.includes('autosave')&&parsed.schema!==1)continue;out[key]=parsed}catch{}}if(JSON.stringify(out).length>MAX_BYTES)throw Error('Progres terlalu besar untuk sinkronisasi. Ekspor backup lokal dahulu.');return out}
function valid(obj){if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('Format data server tidak valid.');const keys=Object.keys(obj);if(keys.some(k=>!KEYS.includes(k)))throw Error('Server mengandung jenis data yang tidak dikenal.');if(JSON.stringify(obj).length>MAX_BYTES)throw Error('Data server terlalu besar.');for(const [k,v] of Object.entries(obj)){if(v===null||typeof v!=='object')throw Error('Format '+k+' tidak valid.');if(k==='netforge.guided.history.v027'&&!Array.isArray(v))throw Error('Riwayat latihan tidak valid.');if(k==='netforge.mission.autosave.v031'&&(v.format!=='NETFORGE-MISSION'||v.schema!==1))throw Error('Simpan misi tidak valid.');}return obj}
async function identify(){const me=await api('/me');if(!Number.isSafeInteger(me?.id)||me.id<=0)throw Error('Identitas akun backend tidak valid.');if(verifiedAccount!==null&&verifiedAccount!==me.id){server=null;compared=null;}verifiedAccount=me.id;return me.id}
function summary(records){const p=records['netforge.unified.mission.progress.v1']||{};const completed=['basics','smart','office'].filter(k=>Boolean(p[k]?.completed)).length;const history=records['netforge.guided.history.v027'];return 'Misi selesai '+completed+'/3 · Guided Lab '+(Array.isArray(history)?history.length:0)+' · Jenis data '+Object.keys(records).length}
function equal(a,b){return JSON.stringify(a)===JSON.stringify(b)}
function diff(local,remote){const list=[];for(const key of KEYS){const localHas=Object.prototype.hasOwnProperty.call(local,key),serverHas=Object.prototype.hasOwnProperty.call(remote,key);let st=!localHas&&!serverHas?'Tidak ada':!localHas?'Hanya server':!serverHas?'Hanya lokal':equal(local[key],remote[key])?'Sama':'Berbeda';list.push({key,title:KEYNAMES[key],state:st})}return list}
function renderDiff(local,remote){const target=$('nf53-diff');if(!target)return;target.replaceChildren();for(const item of diff(local,remote)){const div=document.createElement('div');const strong=document.createElement('strong');strong.textContent=item.title;const small=document.createElement('div');small.textContent=item.state;small.style.color=item.state==='Sama'?'#91e7c1':item.state==='Berbeda'?'#ffcf90':'#b2d0e5';div.append(strong,small);target.append(div)}}
async function run(fn){if(busy)return;busy=true;const buttons=$('nf52-panel')?.querySelectorAll('button')||[];buttons.forEach(b=>b.disabled=true);try{await fn()}catch(e){state(e.status===409?'conflict':'offline',e.status===409?'Konflik revisi':'Periksa koneksi / akun');status('⚠ '+(e.status===409?'Data server berubah dari perangkat lain. Bandingkan ulang sebelum melanjutkan.':e.message));if(e.status===409)compared=null}finally{busy=false;buttons.forEach(b=>b.disabled=false)}}
async function fetchServer(){await identify();const v=await api('/player-sync');if(!Number.isInteger(v?.revision)||v.revision<0)throw Error('Revisi server tidak valid.');server={revision:v.revision,records:valid(v.records||{}),updatedAt:v.updated_at||null};return server}
async function compare(){state('checking','Memeriksa progres…');const remote=await fetchServer();const local=collect();compared={revision:remote.revision,account:verifiedAccount,localSnapshot:JSON.stringify(local),remoteSnapshot:JSON.stringify(remote.records)};$('nf53-allow').checked=false;renderDiff(local,remote.records);const different=diff(local,remote.records).filter(d=>d.state!=='Sama'&&d.state!=='Tidak ada');state(different.length?'conflict':'saved',different.length?'Ada perbedaan ('+different.length+')':'Data sudah cocok');status('Akun #'+verifiedAccount+' · server rev '+remote.revision+(remote.updatedAt?' · diperbarui '+remote.updatedAt:'')+'\nServer: '+summary(remote.records)+'\nLokal: '+summary(local)+'\nPerbandingan selesai. Pilih secara sadar arah sinkronisasi; tidak ada data diganti.');}
function requireCompare(current,local){if(!compared||compared.account!==verifiedAccount)throw Error('Klik Bandingkan Progres terlebih dahulu sebelum mengganti data.');if(current.revision!==compared.revision||JSON.stringify(current.records)!==compared.remoteSnapshot){compared=null;state('conflict','Progres server berubah');throw Error('Progres server sudah berubah sejak perbandingan terakhir. Bandingkan ulang agar data perangkat lain tidak tertimpa.');}if(JSON.stringify(local)!==compared.localSnapshot){compared=null;state('conflict','Data lokal berubah');throw Error('Progres lokal berubah sejak perbandingan. Bandingkan ulang sebelum melanjutkan.');}}
async function upload(){state('checking','Memeriksa ulang revisi…');const current=await fetchServer(),records=collect();requireCompare(current,records);if(!Object.keys(records).length)throw Error('Belum ada progres lokal untuk diunggah.');const different=diff(records,current.records).some(x=>['Berbeda','Hanya server'].includes(x.state));if(different&&!$('nf53-allow').checked)throw Error('Progres server berbeda atau berisi data yang tidak ada di lokal. Centang persetujuan penggantian setelah meninjau perbandingan.');if(!window.confirm('GANTI progres server rev '+current.revision+' dengan data LOKAL?\nData server sebelumnya dapat tertimpa. Gunakan unduh cadangan bila perlu.'))return;const reply=await api('/player-sync','PUT',{revision:current.revision,records});if(!Number.isInteger(reply?.revision))throw Error('Server tidak mengembalikan revisi baru.');server={revision:reply.revision,records};compared=null;$('nf53-allow').checked=false;state('saved','Tersimpan · rev '+reply.revision);status('✅ Progres lokal tersimpan di akun #'+verifiedAccount+' (revisi '+reply.revision+'). Data lokal tidak dihapus.');}
function exportBackup(records){const payload=JSON.stringify({format:'NETFORGE-SYNC-BACKUP',version:1,createdAt:new Date().toISOString(),records},null,2);const url=URL.createObjectURL(new Blob([payload],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='netforge-before-cloud-restore-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
async function restore(){state('checking','Memeriksa ulang server…');const remote=await fetchServer(),loc=collect();requireCompare(remote,loc);if(!Object.keys(remote.records).length)throw Error('Server belum mempunyai progres untuk dipulihkan.');const details='Server rev '+remote.revision+'\n'+summary(remote.records)+'\n\nLokal:\n'+summary(loc);status(details);if(!window.confirm(details+'\n\nGANTI data lokal dengan data server? Backup JSON akan diunduh sebelum pemulihan.'))return;
 exportBackup(loc);const before={};for(const k of KEYS)before[k]=localStorage.getItem(k);
 try{for(const key of KEYS){if(Object.prototype.hasOwnProperty.call(remote.records,key))localStorage.setItem(key,JSON.stringify(remote.records[key]));else localStorage.removeItem(key)}}catch(e){for(const k of KEYS)try{if(before[k]===null)localStorage.removeItem(k);else localStorage.setItem(k,before[k])}catch{}throw Error('Penyimpanan gagal; rollback data lokal dicoba: '+e.message)}
 state('saved','Progres dipulihkan');status('✅ Pemulihan selesai. Aplikasi dimuat ulang untuk menggunakan progres server.');window.location.reload()}
function refreshConnection(){if(!navigator.onLine){state('offline','Offline · progres lokal aman');return}if(!compared)state('idle','Online · belum dibandingkan');}
function invalidate(){compared=null;const el=$('nf53-diff');if(el)el.replaceChildren();if($('nf53-allow'))$('nf53-allow').checked=false;refreshConnection()}
function init(){const settings=document.querySelector('#nf30Overlay .nf30-body');if(!settings||$('nf52-panel'))return;const panel=document.createElement('section');panel.id='nf52-panel';panel.innerHTML='<h3>☁️ Player Cloud Save</h3><p>Sinkronisasi manual antarperangkat melalui akun resmi. Bandingkan lebih dahulu, lalu pilih unggah atau pulihkan. Tidak ada sinkronisasi otomatis. Endpoint /player-sync harus tersedia di backend.</p><span id="nf53-state" role="status" aria-live="polite">Memeriksa koneksi…</span><div class="nf52-actions"><button id="nf52-check" type="button">🔍 Bandingkan Progres</button><button id="nf52-upload" type="button">☁ Unggah Progres Lokal</button><button id="nf52-restore" type="button">⬇ Pulihkan dari Server</button></div><div id="nf53-diff" class="nf53-diff" aria-label="Perbedaan progres tiap kategori"></div><label><input id="nf53-allow" type="checkbox"> Saya sudah membandingkan data dan mengizinkan penggantian progres server yang berbeda saat mengunggah.</label><pre id="nf52-status" role="status" aria-live="polite">Progres tetap tersimpan secara lokal. Masuk dengan akun resmi untuk membandingkan data di server.</pre><p>Cadangkan progres sebelum berpindah perangkat. XP dan hasil resmi tetap harus diverifikasi backend. Jangan unggah token atau kata sandi.</p>';settings.append(panel);
 $('nf52-check').addEventListener('click',()=>run(compare));$('nf52-upload').addEventListener('click',()=>run(upload));$('nf52-restore').addEventListener('click',()=>run(restore));
 window.addEventListener('netforge:auth-change',()=>{server=null;verifiedAccount=null;invalidate();status('Akun berubah. Bandingkan ulang progres server.')});window.addEventListener('online',refreshConnection);window.addEventListener('offline',refreshConnection);window.addEventListener('storage',e=>{if(e.key&&KEYS.includes(e.key)){invalidate();state('conflict','Progres tab lain berubah');status('Progres lokal diubah dari tab lain. Bandingkan ulang sebelum sinkronisasi.')}});refreshConnection()}
window.NetForgePlayerSync={version:'0.59.00',collect,keys:KEYS.slice()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf56CareerLogic === */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const stages=[{name:'Network Rookie',xp:0},{name:'Network Apprentice',xp:500},{name:'Network Technician',xp:1400},{name:'Network Engineer',xp:3500}];
 const skills=[
  {name:'Topologi & Perangkat',desc:'Kemajuan latihan Guided Lab',count:2,mission:100},
  {name:'IP, Subnet & Gateway',desc:'Indikator aktivitas misi dan latihan',count:5,mission:400},
  {name:'Konektivitas & Diagnostik',desc:'Aktivitas troubleshooting tersimpan',count:10,mission:900},
  {name:'Routing & Infrastruktur',desc:'Progres lanjutan, bukan tes keterampilan',count:20,mission:1900}
 ];
 function snapshot(){
  let records=[];try{const arr=JSON.parse(localStorage.getItem('netforge.guided.history.v027')||'[]');if(Array.isArray(arr))records=arr.filter(r=>r&&r.completed===true&&r.type==='Guided Lab'&&Number.isFinite(Date.parse(r.date)))}catch{}
  const count=new Set(records.map(r=>r.date+'|'+r.type)).size;
  let missionXP=0;try{const save=JSON.parse(localStorage.getItem('netforge.mission.autosave.v031')||'null');if(save?.format==='NETFORGE-MISSION'&&save.schema===1&&Number.isFinite(save.progress?.xp))missionXP=Math.max(0,Math.min(999999,save.progress.xp))}catch{}
  return {count,missionXP,xp:missionXP+count*100};
 }
 const pct=(x,y)=>Math.max(0,Math.min(100,Math.round(x/y*100)));
 function render(){
  const root=$('nf56Career');if(!root||$('nf29Overlay')?.hidden)return;
  const d=snapshot();let tier=0;stages.forEach((v,i)=>{if(d.xp>=v.xp)tier=i});$('nf56Tier').textContent=stages[tier].name;
  const path=$('nf56Path');path.replaceChildren();
  stages.forEach((v,i)=>{const el=document.createElement('div');el.className='nf56-stage '+(i<tier?'done':i===tier?'active':'');const h=document.createElement('strong');h.textContent=(i<tier?'✓ ':i===tier?'◆ ':'○ ')+v.name;const sub=document.createElement('small');sub.textContent=v.xp.toLocaleString('id-ID')+' XP';el.append(h,sub);path.append(el)});
  const area=$('nf56Skills');area.replaceChildren();const scores=[];
  skills.forEach(skill=>{const score=Math.round(.6*pct(d.count,skill.count)+.4*pct(d.missionXP,skill.mission));scores.push(score);const box=document.createElement('div');box.className='nf56-skill';const top=document.createElement('div');top.className='nf56-skill-title';const name=document.createElement('b');name.textContent=skill.name;const val=document.createElement('span');val.textContent=score+'%';top.append(name,val);const track=document.createElement('div');track.className='nf56-track';const bar=document.createElement('div');bar.className='nf56-fill';bar.style.width=score+'%';track.append(bar);const desc=document.createElement('small');desc.textContent=skill.desc;box.append(top,track,desc);area.append(box)});
  const min=Math.min(...scores);const ix=scores.indexOf(min);const label=skills[ix].name;
  $('nf56Advice').textContent=d.count===0&&d.missionXP===0?'Mulailah dari misi jaringan dasar atau Guided Lab. Saya akan menyesuaikan saran setelah progres tersimpan.':min<100?'Latihan yang paling perlu ditingkatkan: '+label+'. Coba Guided Lab, kemudian jalankan misi dan uji koneksi. Indikator ini mencerminkan aktivitas, bukan kemampuan yang sudah teruji.':'Bagus, indikator aktivitas dasar sudah penuh. Coba tantangan Normal/Hardcore serta tinjau ulang konfigurasi yang sebelumnya gagal.';
 }
 function go(label){const a=[...document.querySelectorAll('.topnav a')].find(x=>(x.textContent||'').toLowerCase().includes(label));$('nf29Close')?.click();if(a)a.click();else document.querySelector(label==='misi'?'#missionTitle':'#pveConfigPanel')?.scrollIntoView({behavior:'smooth',block:'start'})}
 function init(){if(!$('nf56Career'))return; $('nf56GoMission').addEventListener('click',()=>go('misi'));$('nf56GoLab').addEventListener('click',()=>go('lab'));
  const overlay=$('nf29Overlay');new MutationObserver(()=>{if(!overlay.hidden)render()}).observe(overlay,{attributes:true,attributeFilter:['hidden']});
  $('nf29Refresh')?.addEventListener('click',()=>requestAnimationFrame(render));
  window.addEventListener('storage',e=>{if(['netforge.guided.history.v027','netforge.mission.autosave.v031'].includes(e.key))render()});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf57AssessmentLogic === */
(()=>{'use strict';
 const KEY='netforge.assessment.history.v057';
 const BANK={
  foundation:[
   ['PC 192.168.10.20/24 ingin menghubungi 192.168.10.80/24. Jalur apa yang diperlukan?',['Komunikasi langsung pada LAN/VLAN yang sama','Selalu melewati default gateway','Wajib mengaktifkan NAT','Harus menggunakan koneksi fiber'],0,'Dua alamat termasuk jaringan 192.168.10.0/24; dapat berkomunikasi langsung jika Layer 2 dan VLAN sesuai.','Topologi'],
   ['PC 192.168.10.20/24 perlu menghubungi 192.168.20.30/24. Konfigurasi terpenting di PC adalah…',['DNS diarahkan ke PC tujuan','Default gateway menuju router yang reachable','Menonaktifkan subnet mask','Mengganti kabel menjadi PoE'],1,'Tujuan berada di subnet berbeda. PC memerlukan gateway router yang dapat dijangkau pada subnet lokal.','Gateway'],
   ['Klien DHCP mendapat alamat 169.254.x.x, sedangkan alamat yang direncanakan 192.168.10.x. Pemeriksaan awal yang tepat?',['Cek server DHCP, pool, dan konektivitas broadcast','Tambah static route ke Internet','Perbesar ukuran monitor','Ubah DNS publik saja'],0,'Alamat link-local biasanya menunjukkan klien tidak memperoleh sewa IPv4 yang sesuai dari DHCP.','DHCP'],
   ['Port switch bertipe SFP fiber ingin disambungkan ke port Ethernet RJ45 biasa. Apa pilihan tepat?',['Sambung langsung dengan kabel tembaga tanpa modul','Gunakan modul/transceiver dan media/interface yang kompatibel','Gunakan kabel console','Aktifkan DHCP untuk mengganti media'],1,'Jenis konektor dan media harus kompatibel; SFP fiber tidak langsung cocok dengan RJ45 tanpa transceiver yang sesuai.','Media'],
   ['Dua PC berada pada switch yang sama, tetapi masing-masing berada dalam VLAN 10 dan VLAN 20. Agar saling ping diperlukan…',['Hanya IP sama persis','Routing antarkedua VLAN melalui perangkat Layer 3','Menukar monitor kedua PC','Mengaktifkan PoE'],1,'VLAN yang berbeda merupakan domain Layer 2 berbeda dan memerlukan inter-VLAN routing.','VLAN'],
   ['Ping ke alamat IP berhasil, tetapi akses lewat nama host gagal. Pemeriksaan paling relevan?',['DNS server dan resolusi nama','Tegangan PoE','Warna kabel Ethernet','Jumlah vCPU'],0,'Keberhasilan ke IP menandakan jalur IP tersedia; masalah nama mengarah pada konfigurasi atau layanan DNS.','DNS']
  ],
  troubleshoot:[
   ['Traceroute berhenti di router pertama. Jaringan tujuan berada di belakang router kedua. Apa langkah awal yang tepat?',['Ganti nama PC','Periksa routing table dan next-hop router pertama','Aktifkan suara game','Hapus seluruh VLAN'],1,'Router pertama harus memiliki route valid ke prefix tujuan dan next-hop yang reachable.','Routing'],
   ['Request Ping sampai tujuan, tetapi balasan tidak kembali. Komponen yang paling tepat diperiksa adalah…',['Hanya resolusi DNS sumber','Kecerahan monitor','Routing jalur balik dan firewall di sisi tujuan','Nama switch'],2,'Echo reply membutuhkan rute balik dan izin ICMP; keberhasilan satu arah belum menjamin balasan.','Return path'],
   ['Sebuah kabel dinonaktifkan dan muncul Link Down. Tindakan perbaikan awal?',['Mengubah alamat DNS','Menambah XP pemain','Menghapus default gateway','Periksa enable port, media, kabel dan status kedua ujung'],3,'Link Down pada simulasi berada di lapisan fisik/port; fokus pada status kedua interface dan media.','Physical link'],
   ['Port akses switch berada di VLAN 20, sedangkan PC dikonfigurasi untuk subnet VLAN 10. Apa yang perlu diperiksa?',['Ukuran cache PWA','Kesesuaian VLAN port dan IP/subnet klien','Lisensi game','Suhu browser'],1,'Konfigurasi Layer 2 dan Layer 3 perlu selaras dengan jaringan yang dipakai.','VLAN'],
   ['Dua workstation di LAN yang sama memakai IP 192.168.10.50. Dampak paling mungkin?',['Koneksi otomatis menjadi 2 Gbps','DHCP tidak pernah diperlukan lagi','Konflik alamat IP dan komunikasi tidak stabil','Switch berubah menjadi router'],2,'Alamat IP duplikat dalam satu domain Layer 2 dapat menimbulkan gangguan ARP dan konektivitas.','IP conflict'],
   ['Static route 192.168.30.0/24 memiliki next-hop 10.2.2.2, tetapi interface router hanya berada pada 10.1.1.0/30 tanpa rute menuju next-hop. Apa masalahnya?',['Terlalu banyak ikon pada topologi','Port USB kurang','DNS harus diganti ke 8.8.8.8','Next-hop tidak reachable'],3,'Next-hop static route harus dapat dijangkau secara langsung atau lewat rute yang valid, bergantung implementasi router.','Next-hop']
  ]
 };
 const $=id=>document.getElementById(id);let current='foundation',index=0,answers=[];
 const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.filter(r=>r&&['foundation','troubleshoot'].includes(r.track)&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=6).slice(-30):[]}catch{return []}};
 function summary(){const r=read();const passed=new Set(r.filter(x=>x.correct>=5).map(x=>x.track));const label=passed.size===2?'Kedua tantangan lulus':passed.size===1?'1 dari 2 tantangan lulus':'Belum ada tantangan lulus';if($('nf57Summary'))$('nf57Summary').textContent=label+(r.length?' · '+r.length+' percobaan tersimpan':' · mulai untuk menguji pemahaman');if($('nf57History'))$('nf57History').textContent=r.length?'Riwayat terakhir: '+r.slice(-4).reverse().map(x=>(x.track==='foundation'?'Fundamental':'Troubleshooting')+' '+x.correct+'/6').join(' · '):'Belum ada hasil asesmen.';}
 function view(name){['Picker','Quiz','Results'].forEach(x=>$('nf57'+x)?.classList.toggle('nf57-hidden',x!==name))}
 function open(){const modal=$('nf57Overlay');if(!modal)return;modal.hidden=false;summary();view('Picker');$('nf57Exit').focus()}
 function close(){$('nf57Overlay').hidden=true;}
 function draw(){const q=BANK[current][index];$('nf57Step').textContent=(current==='foundation'?'Network Fundamentals':'Troubleshooting & Routing')+' · Soal '+(index+1)+'/6';$('nf57Question').textContent=q[0];const root=$('nf57Options');root.replaceChildren();q[1].forEach((opt,i)=>{const label=document.createElement('label');const radio=document.createElement('input');radio.type='radio';radio.name='nf57Answer';radio.value=String(i);radio.checked=answers[index]===i;radio.addEventListener('change',()=>{answers[index]=i;$('nf57Next').disabled=false;$('nf57Answered').textContent='Jawaban dipilih'});label.append(radio,document.createTextNode(opt));root.append(label)});$('nf57Previous').disabled=index===0;$('nf57Next').disabled=!Number.isInteger(answers[index]);$('nf57Next').textContent=index===5?'Nilai Jawaban':'Berikutnya →';$('nf57Answered').textContent=Number.isInteger(answers[index])?'Jawaban dipilih':'Pilih satu jawaban';}
 function start(){current=document.querySelector('input[name="nf57Track"]:checked')?.value==='troubleshoot'?'troubleshoot':'foundation';index=0;answers=[];view('Quiz');draw()}
 function finish(){const data=BANK[current];const correct=data.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0);const history=read();history.push({track:current,correct,total:6,date:new Date().toISOString(),version:'0.59.00'});try{localStorage.setItem(KEY,JSON.stringify(history.slice(-30)))}catch{$('nf57Advice').textContent='Penyimpanan browser tidak tersedia. Hasil hanya berlaku untuk sesi ini.'}
 $('nf57Score').textContent=(correct>=5?'✓ Lulus latihan':'Perlu latihan ulang')+' · '+correct+'/6 ('+Math.round(correct/6*100)+'%)';$('nf57Advice').textContent=correct>=5?'Iga: Bagus! Kamu memahami sebagian besar konsep pada tantangan ini. Terapkan lagi pada topologi dan misi nyata dalam game.':'Iga: Pelajari penjelasan pada jawaban yang belum tepat, lalu praktikkan konsepnya di Lab sebelum mengulang.';const root=$('nf57Details');root.replaceChildren();data.forEach((q,i)=>{const item=document.createElement('div');item.className='nf57-result-item'+(answers[i]!==q[2]?' bad':'');const strong=document.createElement('strong');strong.textContent=(answers[i]===q[2]?'✓ ':'✕ ')+(i+1)+'. '+q[4];const desc=document.createElement('div');desc.textContent=q[3]+' Jawaban benar: '+q[1][q[2]]+'.';item.append(strong,desc);root.append(item)});summary();view('Results');$('nf57Results').scrollIntoView({block:'nearest'});window.dispatchEvent(new CustomEvent('netforge:assessment-complete',{detail:{track:current,correct,total:6,passed:correct>=5}}));}
 function init(){if(!$('nf57Open'))return;$('nf57Open').addEventListener('click',open);$('nf57Exit').addEventListener('click',close);$('nf57Overlay').addEventListener('click',e=>{if(e.target===$('nf57Overlay'))close()});$('nf57Start').addEventListener('click',start);$('nf57Previous').addEventListener('click',()=>{if(index>0){index--;draw()}});$('nf57Next').addEventListener('click',()=>{if(!Number.isInteger(answers[index]))return;if(index<5){index++;draw()}else finish()});$('nf57Retry').addEventListener('click',start);$('nf57Back').addEventListener('click',()=>{summary();view('Picker')});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('nf57Overlay').hidden)close()});window.addEventListener('storage',e=>{if(e.key===KEY)summary()});summary();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf58PracticalLogic === */
(()=>{'use strict';
 const KEY='netforge.practical.history.v058';const $=id=>document.getElementById(id);let started=false,pingProof=null,openedBy=null,recorded=false;
 const criteria=['Minimal 1 router, 1 switch, dan 2 workstation','Router dan kedua workstation tersambung ke switch','Kedua PC memiliki IP IPv4 berbeda dalam subnet yang sama','Gateway kedua PC berada pada subnet dan cocok dengan IP router','Ping berhasil selama sesi asesmen setelah konfigurasi topologi terakhir'];
 const safeRead=()=>{try{const lab=window.NetForgeLab;if(!lab?.active?.())return null;const d=JSON.parse(lab.export());return d&&Array.isArray(d.nodes)&&Array.isArray(d.links)?d:null}catch{return null}};
 const ipParts=x=>{if(typeof x!=='string')return null;let p=x.trim().split('.').map(Number);return p.length===4&&p.every(n=>Number.isInteger(n)&&n>=0&&n<=255)?p:null};
 const sameSubnet=(a,b,p)=>{const x=ipParts(a),y=ipParts(b),bits=Number(p);if(!x||!y||!Number.isInteger(bits)||bits<1||bits>30)return false;let ia=x.reduce((v,n)=>(v<<8)|n,0)>>>0,ib=y.reduce((v,n)=>(v<<8)|n,0)>>>0;let mask=(0xffffffff <<(32-bits))>>>0;return (ia&mask)===(ib&mask)};
 const fingerprint=d=>JSON.stringify({nodes:d.nodes.map(n=>[n.id,n.type,n.broken,n.config?.ip,n.config?.prefix,n.config?.gateway]),links:d.links.map(l=>[l.a,l.b,l.down,l.disabled,l.broken,l.portA,l.portB])});
 const evaluate=()=>{
   const d=safeRead();if(!d)return {ok:[false,false,false,false,false],details:['Buka Free Lab untuk memulai asesmen.'],hash:null};
   const ns=d.nodes,ls=d.links, routers=ns.filter(n=>n.type==='router'),switches=ns.filter(n=>n.type==='switch'),pcs=ns.filter(n=>n.type==='pc');
   const router=routers[0],sw=switches[0];const pcA=pcs[0],pcB=pcs[1];
   const connected=(a,b)=>!!(a&&b&&ls.some(l=>!l.down&&!l.disabled&&!l.broken&&((l.a===a.id&&l.b===b.id)||(l.b===a.id&&l.a===b.id))));
   const cfg=n=>n?.config||{};const ca=cfg(pcA),cb=cfg(pcB),cr=cfg(router);
   const prefix=Number(ca.prefix||24),pb=Number(cb.prefix||24);
   const validIPs=!!(ca.ip&&cb.ip&&ca.ip!==cb.ip&&prefix===pb&&sameSubnet(ca.ip,cb.ip,prefix));
   const gw=ca.gateway, gw2=cb.gateway;
   const validGateway=!!(router&&gw&&gw===gw2&&cr.ip===gw&&sameSubnet(ca.ip,gw,prefix)&&sameSubnet(cb.ip,gw,pb));
   const hash=fingerprint(d);
   const checks=[!!(router&&sw&&pcA&&pcB),connected(router,sw)&&connected(pcA,sw)&&connected(pcB,sw),validIPs,validIPs&&validGateway,!!(started&&pingProof&&pingProof.hash===hash)];
   return {ok:checks,hash,details:[]};
 };
 function history(){let data=[];try{data=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(data))data=[]}catch{};return data}
 function showHistory(){let h=history();$('nf58History').textContent=h.length?h.slice(0,8).map(x=>`${new Date(x.at).toLocaleString('id-ID')} · ${x.score}/5 · ${x.passed?'LULUS':'Belum lulus'}`).join(' | '):'Belum ada asesmen praktik tersimpan.'}
 function render(){const r=evaluate();const score=r.ok.filter(Boolean).length;const checks=$('nf58Checks');checks.replaceChildren();criteria.forEach((item,i)=>{const div=document.createElement('div');div.className='nf58-step '+(r.ok[i]?'nf58-good':'nf58-bad');div.textContent=(r.ok[i]?'✓ ':'○ ')+(i+1)+'. '+item;checks.append(div)});
  $('nf58Status').textContent=started?`Sesi aktif · ${score}/5 langkah terpenuhi. ${r.ok[4]?'Ping terverifikasi pada topologi saat ini.':'Gunakan terminal Ping di workspace, lalu kembali ke sini.'}`:'Mulai asesmen untuk mengaktifkan pemantauan.';
  $('nf58Finish').disabled=!started||recorded;
  return r;
 }
 function open(){openedBy=document.activeElement;$('nf58Overlay').hidden=false;render();showHistory();$('nf58Close').focus()}
 function close(){$('nf58Overlay').hidden=true;openedBy?.focus?.()}
 const init=()=>{let source=$('nf57Open');if(!source)return;
  const btn=document.createElement('button');btn.id='nf58Open';btn.type='button';btn.className=source.className;btn.textContent='🧪 Asesmen Praktik';source.insertAdjacentElement('afterend',btn);btn.addEventListener('click',open);
  $('nf58Close').addEventListener('click',close);
  $('nf58Overlay').addEventListener('click',e=>{if(e.target===$('nf58Overlay'))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('nf58Overlay').hidden)close()});
  $('nf58Start').addEventListener('click',()=>{if(!window.NetForgeLab?.enter){$('nf58Status').textContent='Network Lab belum siap.';return}if(started&&!confirm('Mulai ulang asesmen? Bukti Ping sesi sebelumnya akan direset.'))return;
    window.NetForgeLab.enter('free');started=true;recorded=false;pingProof=null;close();window.dispatchEvent(new CustomEvent('netforge:practical-assessment',{detail:{action:'start'}}));
    try{document.getElementById('board')?.scrollIntoView({behavior:'smooth',block:'center'})}catch{};
  });
  $('nf58Check').addEventListener('click',render);
  $('nf58Finish').addEventListener('click',()=>{if(!started||recorded)return;const r=render();const score=r.ok.filter(Boolean).length;const entry={at:new Date().toISOString(),score,passed:score===5,checks:r.ok,version:'0.59.00'};
    try{const h=history();h.unshift(entry);localStorage.setItem(KEY,JSON.stringify(h.slice(0,30)))}catch{$('nf58Status').textContent='Tidak dapat menyimpan riwayat: penyimpanan browser dibatasi.';return}
    recorded=true;started=false;$('nf58Status').textContent=`Hasil disimpan: ${score}/5. ${entry.passed?'Lulus! Iga menyarankan lanjut ke latihan routing.':'Iga menyarankan memperbaiki langkah yang belum terpenuhi dan mencoba kembali.'}`;render();showHistory();
  });
  window.addEventListener('netforge:network-test',ev=>{if(!started||!ev.detail?.ok||ev.detail?.trace)return;const d=safeRead();if(!d)return;const ids=[ev.detail.source,ev.detail.target];if(ids[0]==null||ids[1]==null||ids[0]===ids[1])return;
   const pcIds=new Set(d.nodes.filter(n=>n.type==='pc').map(n=>String(n.id)));
   if(!ids.every(id=>pcIds.has(String(id))))return;
   pingProof={hash:fingerprint(d),at:Date.now()};if(!$('nf58Overlay').hidden)render();
  });
  window.addEventListener('netforge:mission-changed',()=>{if(started&&!window.NetForgeLab?.active?.()){started=false;pingProof=null;recorded=false;if(!$('nf58Overlay').hidden)render()}});
  showHistory();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf59ChallengeLogic === */
(()=>{'use strict';
 const KEY='netforge.troubleshooting.history.v059', $=id=>document.getElementById(id);
 let started=false,recorded=false,pingProof=null,openingFocus=null,baseline=null,session=0;
 const criteria=['Jaringan berisi Router, Switch, PC-01 dan PC-02','Kabel Switch ke PC-02 sudah diperbaiki (Link Up)','IP PC-02 diperbaiki agar sesuai subnet PC-01','Gateway PC-01 dan PC-02 benar menuju Router','Ping antara PC-01 dan PC-02 berhasil setelah perbaikan'];
 const labData=()=>{try{if(!window.NetForgeLab?.active?.()||window.NetForgeLab.mode()!=='challenge')return null;const d=JSON.parse(window.NetForgeLab.export());return Array.isArray(d.nodes)&&Array.isArray(d.links)?d:null}catch{return null}};
 const bytes=ip=>{if(typeof ip!=='string')return null;const a=ip.trim().split('.');if(a.length!==4||a.some(x=>!/^\d{1,3}$/.test(x)||Number(x)>255))return null;return a.map(Number)};
 const sameSubnet=(a,b,p)=>{const x=bytes(a),y=bytes(b),k=Number(p);if(!x||!y||!Number.isInteger(k)||k<1||k>30)return false;const u=x.reduce((v,n)=>(v*256+n)>>>0,0),v=y.reduce((t,n)=>(t*256+n)>>>0,0),mask=(0xffffffff<<(32-k))>>>0;return (u&mask)===(v&mask)};
 const stamp=d=>JSON.stringify({nodes:d.nodes.map(n=>[n.id,n.type,!!n.broken,n.config?.ip,n.config?.prefix,n.config?.gateway]),links:d.links.map(l=>[l.a,l.b,l.portA,l.portB,!!l.broken,!!l.down,!!l.disabled])});
 function grade(){const d=labData();if(!d)return {ok:[false,false,false,false,false],reason:'Buka Challenge Lab melalui tombol Mulai.',hash:null};
  const router=d.nodes.find(n=>n.type==='router'),sw=d.nodes.find(n=>n.type==='switch'),pcs=d.nodes.filter(n=>n.type==='pc');const pc1=pcs.find(n=>(n.config?.name||'').includes('01'))||pcs[0],pc2=pcs.find(n=>(n.config?.name||'').includes('02'))||pcs[1];
  const link=(a,b)=>d.links.find(l=>a&&b&&((String(l.a)===String(a.id)&&String(l.b)===String(b.id))||(String(l.b)===String(a.id)&&String(l.a)===String(b.id))));
  const up=l=>!!(l&&!l.broken&&!l.down&&!l.disabled),rLink=link(router,sw),link1=link(sw,pc1),link2=link(sw,pc2),cfg1=pc1?.config||{},cfg2=pc2?.config||{},cfgR=router?.config||{};
  const devices=!!(router&&sw&&pc1&&pc2),physical=devices&&up(rLink)&&up(link1)&&up(link2),ips=!!(devices&&cfg1.ip&&cfg2.ip&&cfg1.ip!==cfg2.ip&&Number(cfg1.prefix||24)===Number(cfg2.prefix||24)&&sameSubnet(cfg1.ip,cfg2.ip,cfg1.prefix||24)),gateway=!!(ips&&cfg1.gateway&&cfg2.gateway&&cfg1.gateway===cfg2.gateway&&cfgR.ip===cfg1.gateway&&sameSubnet(cfg1.ip,cfgR.ip,cfg1.prefix||24));
  const hash=stamp(d);return {ok:[devices,physical,ips,gateway,!!(started&&pingProof&&pingProof.session===session&&pingProof.hash===hash&&physical&&ips&&gateway)],hash,reason:!physical?'Periksa kabel dari Switch menuju PC-02: status link harus aktif.':!ips?'Alamat IP PC-02 harus satu subnet dengan PC-01, tetapi tidak boleh duplikat.':!gateway?'Periksa gateway setiap PC dan IP router.':'Jalankan Ping antara kedua PC dari Terminal Jaringan.'};
 }
 function history(){try{const h=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(h)?h:[]}catch{return []}}
 function renderHistory(){$('nf59History').textContent=history().slice(0,8).map(h=>`${new Date(h.at).toLocaleString('id-ID')} · ${h.score}/5 · ${h.passed?'LULUS':'BELUM LULUS'}`).join(' | ')||'Belum ada riwayat.'}
 function render(){const r=grade(),score=r.ok.filter(Boolean).length;$('nf59Checks').replaceChildren();criteria.forEach((txt,i)=>{const div=document.createElement('div');div.className='nf59-step '+(r.ok[i]?'nf59-ok':'nf59-fail');div.textContent=(r.ok[i]?'✓ ':'○ ')+`${i+1}. ${txt}`;$('nf59Checks').append(div)});
  $('nf59Status').textContent=started?`Tantangan aktif · ${score}/5 pemeriksaan terpenuhi.`:'Belum ada tantangan aktif. Pilih Mulai Challenge.';
  $('nf59Iga').textContent='Iga: '+(started?r.reason:'Tantangan menguji troubleshooting fisik dan Layer 3. Mulai, lalu periksa perangkat di workspace.');
  $('nf59Save').disabled=!started||recorded;return r;
 }
 function open(){openingFocus=document.activeElement;$('nf59Overlay').hidden=false;render();renderHistory();$('nf59Close').focus()}
 function close(){$('nf59Overlay').hidden=true;openingFocus?.focus?.()}
 function init(){const anchor=$('nf58Open')||$('nf57Open');if(!anchor)return;const b=document.createElement('button');b.type='button';b.id='nf59Open';b.className=anchor.className;b.textContent='🛠️ Troubleshooting Challenge';anchor.insertAdjacentElement('afterend',b);b.addEventListener('click',open);
  $('nf59Close').addEventListener('click',close);$('nf59Overlay').addEventListener('click',e=>{if(e.target===$('nf59Overlay'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('nf59Overlay').hidden)close()});
  $('nf59Start').addEventListener('click',()=>{if(!window.NetForgeLab?.enter||!window.NetForgeLab?.template){$('nf59Status').textContent='Network Lab belum tersedia.';return}if(started&&!confirm('Mulai ulang? Perubahan topologi tantangan saat ini akan diganti.'))return;
    window.NetForgeLab.enter('challenge');window.NetForgeLab.template('broken');started=true;recorded=false;pingProof=null;session++;baseline=stamp(labData());close();window.dispatchEvent(new CustomEvent('netforge:troubleshooting-start',{detail:{session}}));try{$('board')?.scrollIntoView({block:'center',behavior:'smooth'})}catch{}
  });
  $('nf59Check').addEventListener('click',render);
  $('nf59Save').addEventListener('click',()=>{if(!started||recorded)return;const r=render();const score=r.ok.filter(Boolean).length;const entry={at:new Date().toISOString(),version:'0.59.00',score,passed:score===5,checks:r.ok,challenge:'broken-link-and-subnet'};
    try{const h=history();h.unshift(entry);localStorage.setItem(KEY,JSON.stringify(h.slice(0,40)))}catch{$('nf59Status').textContent='Penyimpanan riwayat tidak tersedia.';return}recorded=true;started=false;$('nf59Status').textContent=`Hasil tersimpan: ${score}/5 — ${entry.passed?'LULUS':'PERLU PERBAIKAN'}.`;renderHistory();render();
  });
  window.addEventListener('netforge:network-test',e=>{if(!started||!e.detail?.ok||e.detail?.trace)return;const d=labData();if(!d)return;const pcs=new Set(d.nodes.filter(n=>n.type==='pc').map(n=>String(n.id))),ids=[String(e.detail.source),String(e.detail.target)];if(ids[0]===ids[1]||!ids.every(id=>pcs.has(id)))return;const g=grade();if(!g.ok.slice(0,4).every(Boolean))return;pingProof={hash:stamp(d),session};if(!$('nf59Overlay').hidden)render()});
  window.addEventListener('netforge:mission-changed',()=>{if(started&&!window.NetForgeLab?.active?.()){started=false;pingProof=null;recorded=false;if(!$('nf59Overlay').hidden)render()}});renderHistory();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf60AdvancedLogic === */
(()=>{'use strict';
 const $=id=>document.getElementById(id),KEY='netforge.advanced.troubleshooting.v060';
 const defs={
 link:{title:'Link Down',fault:'Kabel menuju PC-02 tidak aktif.',fix:'Periksa link Switch ↔ PC-02 lalu aktifkan atau sambungkan ulang.',test:'link',hints:['Mulailah dengan layer fisik.','Klik kabel menuju PC-02 dan periksa status link.','Aktifkan koneksi dari Switch ke PC-02, lalu jalankan Ping antar-PC.']},
 ipconflict:{title:'IP Conflict',fault:'PC-02 menggunakan IPv4 yang sama dengan PC-01.',fix:'Berikan IPv4 unik kepada PC-02 pada subnet yang sama.',test:'ip',hints:['Periksa alamat IPv4 semua host.','Bandingkan IP PC-01 dengan PC-02.','Ubah PC-02 menjadi 192.168.10.11/24 lalu Ping antar-PC.']},
 dhcp:{title:'DHCP Address Failure',fault:'PC-02 belum memperoleh IPv4 valid.',fix:'Perbaiki konfigurasi IP PC-02 (atau gunakan DHCP jika layanan tersedia).',test:'ip',hints:['Periksa apakah klien memiliki IPv4 yang dapat dipakai.','Lihat metode IP PC-02 dan layanan DHCP pada router.','Untuk lab ini boleh gunakan IP statis 192.168.10.11/24; DHCP tidak dibuktikan melalui pertukaran paket DHCP.']},
 gateway:{title:'Gateway Mismatch',fault:'Gateway PC-02 tidak sesuai IP router.',fix:'Samakan default gateway PC-02 dengan IP router pada subnet tersebut.',test:'gateway',hints:['Periksa konfigurasi layer 3.','Bandingkan gateway PC-02 dengan alamat LAN router.','Atur gateway PC-02 ke 192.168.10.1. Jalankan Ping setelahnya.']},
 vlan:{title:'VLAN Mismatch',fault:'PC-02 menggunakan VLAN ID yang tidak sesuai kelompok LAN.',fix:'Sesuaikan VLAN PC-02 dengan PC-01 pada konfigurasi perangkat.',test:'vlan',hints:['Periksa segmentasi logis LAN.','Perhatikan VLAN ID PC-01 dan PC-02.','Samakan VLAN ID PC-02 dengan PC-01 (misalnya 10). Validasi VLAN di sini berbasis konfigurasi, bukan simulasi forwarding 802.1Q.']}
 };
 let active=false,saved=false,scenario='link',session=0,ping=null,focus=null,hintIndex=0;
 const lab=()=>{try{if(!window.NetForgeLab?.active?.()||window.NetForgeLab.mode()!=='challenge')return null;const d=JSON.parse(window.NetForgeLab.export());return d&&Array.isArray(d.nodes)&&Array.isArray(d.links)?d:null}catch{return null}};
 const ipnum=x=>{if(typeof x!=='string')return null;const a=x.split('.');if(a.length!==4||a.some(k=>!/^(0|[1-9]\d{0,2})$/.test(k)||Number(k)>255))return null;return a.reduce((n,z)=>n*256+Number(z),0)>>>0};
 const subnet=(a,b,p)=>{const x=ipnum(a),y=ipnum(b),v=Number(p);if(x===null||y===null||!Number.isInteger(v)||v<1||v>30)return false;const mask=(0xffffffff<<(32-v))>>>0;return (x&mask)===(y&mask)};
 const sig=d=>JSON.stringify({nodes:d.nodes.map(n=>[n.id,n.type,!!n.broken,n.config]),links:d.links.map(l=>[l.a,l.b,l.portA,l.portB,!!l.broken,!!l.disabled,!!l.down])});
 const pieces=d=>{const r=d.nodes.find(n=>n.type==='router'),s=d.nodes.find(n=>n.type==='switch'),p=d.nodes.filter(n=>n.type==='pc');return {r,s,a:p.find(n=>n.config?.name==='PC-01')||p[0],b:p.find(n=>n.config?.name==='PC-02')||p[1]}};
 const up=(d,a,b)=>d.links.some(l=>a&&b&&((l.a===a.id&&l.b===b.id)||(l.b===a.id&&l.a===b.id))&&!l.broken&&!l.down&&!l.disabled);
 function grade(){const d=lab();if(!active||!d)return {checks:[false,false,false,false],message:'Tantangan belum aktif. Klik Mulai terlebih dahulu.'};const {r,s,a,b}=pieces(d);const devices=!!(r&&s&&a&&b),link=devices&&up(d,r,s)&&up(d,s,a)&&up(d,s,b),ca=a?.config||{},cb=b?.config||{},cr=r?.config||{};
 const goodIp=devices&&ca.ip&&cb.ip&&ca.ip!==cb.ip&&ipnum(ca.ip)!==null&&ipnum(cb.ip)!==null&&Number(ca.prefix||24)===Number(cb.prefix||24)&&subnet(ca.ip,cb.ip,ca.prefix||24);
 const gw=!!(goodIp&&cr.ip&&ca.gateway===cr.ip&&cb.gateway===cr.ip&&subnet(cb.ip,cr.ip,cb.prefix||24));
 const vlan=String(ca.vlan??'10')===String(cb.vlan??'10');
 const faultOk=({link:link,ipconflict:goodIp,dhcp:goodIp&&cb.ip!=='DHCP',gateway:gw,vlan:vlan})[scenario];
 const pre=devices&&link&&goodIp&&gw&&(scenario!=='vlan'||vlan);
 const proof=!!(pre&&ping?.session===session&&ping.sig===sig(d));
 const checks=[devices,!!faultOk,!!pre,proof];return {checks,score:checks.filter(Boolean).length,message:!devices?'Pastikan Router, Switch, dan dua PC tersedia.':!faultOk?defs[scenario].fix:!pre?'Kondisi jaringan lain belum siap: periksa kabel, IPv4, dan gateway.':!proof?'Jalankan Ping berhasil antara PC-01 dan PC-02 setelah perbaikan.':'Semua pemeriksaan terpenuhi. Hasil siap disimpan.'};
 }
 function render(){const z=grade(),area=$('nf60Steps');area.replaceChildren();['Perangkat lengkap',`Gangguan ${defs[scenario].title} telah diperbaiki`,'Koneksi dan konfigurasi dasar valid','Bukti Ping antar-PC terbaru berhasil'].forEach((label,i)=>{const d=document.createElement('div');d.className='step '+(z.checks[i]?'pass':'');d.textContent=(z.checks[i]?'✓ ':'○ ')+label;area.append(d)});$('nf60Status').textContent=active?`${defs[scenario].title}: ${z.score}/4 pemeriksaan terpenuhi`:'Belum ada tantangan aktif.';$('nf60Save').disabled=!active||saved;$('nf60Iga').textContent='Iga: '+z.message;return z}
 function history(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
 function showHistory(){$('nf60History').textContent=history().slice(0,8).map(x=>`${new Date(x.at).toLocaleString('id-ID')} · ${x.title} · ${x.score}/4 · ${x.passed?'LULUS':'BELUM LULUS'}`).join(' | ')||'Belum ada hasil.'}
 function open(){focus=document.activeElement;$('nf60Overlay').hidden=false;render();showHistory();$('nf60Close').focus()}function close(){$('nf60Overlay').hidden=true;focus?.focus?.()}
 function init(){const anchor=$('nf59Open')||$('nf58Open');if(!anchor)return;const trigger=document.createElement('button');trigger.id='nf60Open';trigger.type='button';trigger.className=anchor.className;trigger.textContent='🧪 Advanced Troubleshooting';anchor.insertAdjacentElement('afterend',trigger);trigger.addEventListener('click',open);
 $('nf60Close').addEventListener('click',close);$('nf60Overlay').addEventListener('click',e=>{if(e.target===$('nf60Overlay'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('nf60Overlay').hidden)close()});$('nf60Variant').addEventListener('change',()=>{if(active){$('nf60Variant').value=scenario;return}scenario=$('nf60Variant').value;hintIndex=0;render()});
 $('nf60Start').addEventListener('click',()=>{if(!window.NetForgeLab?.enter||!window.NetForgeLab?.import){$('nf60Status').textContent='Network Lab belum tersedia.';return}if(active&&!confirm('Mulai ulang akan mengganti topologi Lab sekarang. Lanjutkan?'))return;
 scenario=$('nf60Variant').value;window.NetForgeLab.enter('challenge');window.NetForgeLab.template('broken');const d=lab();if(!d){$('nf60Status').textContent='Gagal memuat template.';return}const {a,b}=pieces(d);if(!a||!b)return;const wire=d.links.find(l=>(l.a===2&&l.b===4)||(l.a===4&&l.b===2));if(wire)wire.broken=false;b.config={...b.config,ip:'192.168.10.11',prefix:'24',gateway:'192.168.10.1',mode:'static'};
 if(scenario==='link'){if(wire)wire.broken=true}else if(scenario==='ipconflict'){b.config.ip=a.config.ip}else if(scenario==='dhcp'){b.config.ip='DHCP';b.config.mode='dhcp'}else if(scenario==='gateway'){b.config.gateway='192.168.11.1'}else if(scenario==='vlan'){a.config.vlan='10';b.config.vlan='20'};
 try{window.NetForgeLab.import(d)}catch(e){$('nf60Status').textContent='Tidak dapat memuat skenario: '+e.message;return}active=true;saved=false;ping=null;session++;hintIndex=0;close();try{$('board')?.scrollIntoView({block:'center',behavior:'smooth'})}catch{}
 });
 $('nf60Check').addEventListener('click',render);$('nf60Hint').addEventListener('click',()=>{const hints=defs[scenario].hints;$('nf60Iga').textContent='Iga · Petunjuk '+(Math.min(hintIndex+1,hints.length))+'/'+hints.length+': '+hints[Math.min(hintIndex++,hints.length-1)]});
 $('nf60Save').addEventListener('click',()=>{if(!active||saved)return;const z=grade();const entry={at:new Date().toISOString(),version:'0.59.00',scenario,title:defs[scenario].title,score:z.score,passed:z.score===4,checks:z.checks};try{const h=history();h.unshift(entry);localStorage.setItem(KEY,JSON.stringify(h.slice(0,50)))}catch{$('nf60Status').textContent='Penyimpanan lokal gagal.';return}saved=true;active=false;showHistory();render();$('nf60Status').textContent=`Tersimpan: ${entry.score}/4 — ${entry.passed?'LULUS':'PERLU PERBAIKAN'}`});
 window.addEventListener('netforge:network-test',e=>{if(!active||!e.detail?.ok||e.detail?.trace)return;const d=lab();if(!d)return;const pcs=new Set(d.nodes.filter(n=>n.type==='pc').map(n=>String(n.id))),src=String(e.detail.source),dst=String(e.detail.target);if(src===dst||!pcs.has(src)||!pcs.has(dst))return;const g=grade();if(!g.checks.slice(0,3).every(Boolean))return;ping={session,sig:sig(d)};if(!$('nf60Overlay').hidden)render()});
 window.addEventListener('netforge:mission-changed',()=>{if(active&&!lab()){active=false;ping=null;if(!$('nf60Overlay').hidden)render()}});showHistory();render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf61ProtocolLogic === */
(()=>{'use strict';
const el=id=>document.getElementById(id);let tab='dhcp',last=null,focus=null;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ipnum=x=>{if(typeof x!=='string'||!/^\d+\.\d+\.\d+\.\d+$/.test(x))return null;const a=x.split('.').map(Number);return a.some(n=>n<0||n>255)?null:a.reduce((n,v)=>((n*256)+v)>>>0,0)};
const same=(a,b,p)=>{const x=ipnum(a),y=ipnum(b),n=Number(p);return x!==null&&y!==null&&Number.isInteger(n)&&n>=1&&n<=30&&((x&(0xffffffff<<(32-n)))===(y&(0xffffffff<<(32-n))))};
const data=()=>{try{if(!window.NetForgeLab?.active?.())return null;const d=JSON.parse(window.NetForgeLab.export());return Array.isArray(d.nodes)&&Array.isArray(d.links)?d:null}catch{return null}};
const label=n=>n?.config?.name||n?.name||(n?.type||'Device')+' '+(n?.id??'');
const isUp=(d,a,b)=>d.links.some(l=>((l.a===a.id&&l.b===b.id)||(l.b===a.id&&l.a===b.id))&&!l.broken&&!l.disabled&&!l.down);
const reachable=(d,a,b)=>{if(!a||!b)return false;const seen=new Set([a.id]),q=[a.id];while(q.length){const id=q.shift();if(id===b.id)return true;for(const l of d.links){if(l.broken||l.disabled||l.down)continue;const next=l.a===id?l.b:l.b===id?l.a:null;if(next!==null&&!seen.has(next)){seen.add(next);q.push(next)}}}return false};
function renderNodes(){const d=data(),sel=el('nf61Node'),old=sel.value;sel.replaceChildren();if(!d){sel.add(new Option('Buka Network Lab terlebih dahulu',''));return}const candidates=d.nodes.filter(n=>tab==='dhcp'?n.type==='pc':tab==='route'?n.type==='router':true);for(const n of candidates)sel.add(new Option(label(n)+' · '+n.type,String(n.id)));if([...sel.options].some(o=>o.value===old))sel.value=old;}
const step=(title,body,ok)=>`<div class="nf61step ${ok===true?'ok':ok===false?'warn':''}"><strong>${esc(title)}</strong><div>${esc(body)}</div></div>`;
function dhcp(d,n){if(!n||n.type!=='pc')return {ok:false,html:step('Perangkat belum dipilih','Pilih satu workstation.',false)};
 const c=n.config||{},routers=d.nodes.filter(x=>x.type==='router'&&reachable(d,n,x)),r=routers.find(x=>x.config?.dhcp)||routers[0],rc=r?.config||{};
 const needs=String(c.mode||'').toLowerCase().includes('dhcp')||String(c.ip||'').toUpperCase()==='DHCP';
 const poolStart=rc.poolStart||'',poolEnd=rc.poolEnd||'',validPool=ipnum(poolStart)!==null&&ipnum(poolEnd)!==null&&ipnum(poolStart)<=ipnum(poolEnd)&&same(poolStart,rc.ip,rc.prefix||24)&&same(poolEnd,rc.ip,rc.prefix||24);
 const offer=!!(r&&rc.dhcp&&validPool),conflict=offer&&d.nodes.some(x=>x!==n&&x.config?.ip===poolStart),ok=needs&&offer&&!conflict;
 let h=step('1 · DISCOVER',needs?'Klien meminta alamat secara broadcast (ilustrasi).':'Klien masih menggunakan IP statis; DORA tidak dijalankan.',needs);
 h+=step('2 · OFFER',!r?'Tidak ada router terjangkau lewat link aktif.':!rc.dhcp?'Router ditemukan tetapi DHCP belum aktif.':!validPool?'Pool DHCP tidak valid atau di luar subnet router.':`Router ${label(r)} menawarkan kandidat ${poolStart} (visualisasi pool, bukan lease aktual).`,offer);
 h+=step('3 · REQUEST',offer?'Klien memilih tawaran server DHCP.': 'Tidak ada tawaran valid untuk diminta.',offer);
 h+=step('4 · ACK',!needs?'Aktifkan metode DHCP pada klien untuk menguji DORA.':conflict?'Kandidat alamat pool dipakai perangkat lain; periksa konflik IP.':offer?'ACK simulasi diterima. Alamat final tetap mengikuti engine DHCP utama saat dikonfigurasi.':'ACK belum dapat dibuat karena penawaran gagal.',ok);
 return {ok,html:h,summary:ok?'DORA edukatif selesai: syarat konfigurasi terpenuhi.':'DORA belum lengkap: periksa metode IP, link, server DHCP, dan pool.'};}
function vlan(d,n){if(!n)return{ok:false,html:step('Pilih perangkat','Buka Lab dan pilih perangkat.',false)};let h='',all=true,count=0;const own=String(n.config?.vlan??'10');for(const l of d.links.filter(l=>l.a===n.id||l.b===n.id)){const other=d.nodes.find(x=>x.id===(l.a===n.id?l.b:l.a));if(!other)continue;count++;const peer=String(other.config?.vlan??'10');const up=!l.broken&&!l.disabled&&!l.down;const switchNode=[n,other].find(x=>x.type==='switch');const claimed=String(switchNode?.config?.vlan??'10');const list=claimed.split(/[ ,;]+/).filter(Boolean);const allowed=!switchNode||list.includes(own)&&list.includes(peer);const ok=up&&(own===peer||allowed);all=all&&ok;
 h+=step(`${label(n)} ↔ ${label(other)}`,`VLAN ${own} ↔ ${peer}; link ${up?'UP':'DOWN'}; ${switchNode?'daftar VLAN switch: '+claimed:'tanpa switch'}. ${ok?'Konsisten menurut aturan konfigurasi Lab.':'Periksa VLAN dan link.'}`,ok);
 }if(!count)h=step('Tidak ada link','Tambahkan kabel untuk mengevaluasi akses VLAN.',false);
 return {ok:!!count&&all,html:h,summary:'Pemeriksaan VLAN berbasis data konfigurasi. Trunk/tagging 802.1Q tidak disimulasikan sebagai frame.'};}
function route(d,n){if(!n||n.type!=='router')return{ok:false,html:step('Pilih router','Routing diperiksa pada perangkat Router.',false)};let h='',routes=n.staticRoutes||[],c=n.config||{},valid=!!(ipnum(c.ip)!==null);h+=step('Connected network',`${label(n)} · ${c.ip||'IP tidak ada'}/${c.prefix||24}`,valid);
 if(!routes.length)h+=step('Static routes','Belum ada static route; hanya jaringan langsung yang dapat digunakan.',null);
 for(const r of routes){const next=d.nodes.filter(x=>x.type==='router'&&x!==n).find(x=>reachable(d,n,x)&&same(r.via,x.config?.ip||'',30)||reachable(d,n,x)&&r.via===x.config?.ip);const isValid=ipnum(r.via)!==null&&typeof r.destination==='string'&&/^\d+\.\d+\.\d+\.\d+\/\d+$/.test(r.destination);h+=step(`${r.destination||'?'} → ${r.via||'?'}`,`Metric ${r.metric||1} · ${isValid?'format valid':'format tidak valid'} · ${next?'Router next-hop terindikasi terjangkau':'Next-hop belum diverifikasi dalam Lab'}`,isValid);}
 return{ok:valid&&routes.every(x=>ipnum(x.via)!==null),html:h,summary:'Connected/static route ditampilkan dari konfigurasi. Jalankan Traceroute pada terminal utama untuk uji jalur sebenarnya.'};}
function render(run=false){const d=data(),n=d?.nodes.find(x=>String(x.id)===el('nf61Node').value),res=el('nf61Results');if(!d){el('nf61Results').innerHTML='';el('nf61Overlay').querySelector('[data-nf61-status]').textContent='Network Lab belum aktif. Buka Network Lab lalu buat atau muat topologi terlebih dahulu.';return}const result=tab==='dhcp'?dhcp(d,n):tab==='vlan'?vlan(d,n):route(d,n);res.innerHTML=result.html;el('nf61Overlay').querySelector('[data-nf61-status]').textContent=(run?'Hasil simulasi · ':'Pratinjau · ')+(result.summary|| (result.ok?'Validasi konfigurasi berhasil.':'Ada hal yang perlu diperiksa.'));}
function setTab(t){tab=t;for(const x of ['Dhcp','Vlan','Route'])el('nf61Tab'+x).setAttribute('aria-selected',String(t===x.toLowerCase()));renderNodes();render()}
function init(){const anchor=el('nf60Open')||el('nf59Open')||el('nf58Open');if(!anchor)return;const btn=document.createElement('button');btn.id='nf61Open';btn.type='button';btn.className=anchor.className;btn.textContent='🧬 Protocol Lab';anchor.insertAdjacentElement('afterend',btn);const open=()=>{focus=document.activeElement;el('nf61Overlay').hidden=false;renderNodes();render();el('nf61Close').focus()};const close=()=>{el('nf61Overlay').hidden=true;focus?.focus?.()};btn.addEventListener('click',open);el('nf61Close').addEventListener('click',close);el('nf61Overlay').addEventListener('click',e=>{if(e.target===el('nf61Overlay'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!el('nf61Overlay').hidden)close()});el('nf61Refresh').addEventListener('click',()=>{renderNodes();render()});el('nf61Node').addEventListener('change',()=>render());el('nf61Run').addEventListener('click',()=>render(true));for(const x of ['Dhcp','Vlan','Route'])el('nf61Tab'+x).addEventListener('click',()=>setTab(x.toLowerCase()));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;

/* === script:nf64-account-ux-script === */
/* NET FORGE 0.40.92: restore missing settings navigation and make Google sign-in discoverable right after intro. */
(()=>{'use strict';
 const byId=id=>document.getElementById(id);
 function openAccount(focusGoogle=false){
   const intro=byId('nf322Overlay');
   if(intro&&!intro.hidden){
     // Use the intro's own state-machine button to close modal and clean audio/animation state.
     byId('nf322Settings')?.click();
   }else{
     byId('nf64SettingsNav')?.click();
   }
   // Native settings controller does not expose a public API; verify opened panel.
   const settings=byId('nf30Overlay');
   if(settings?.hidden){
     settings.hidden=false;
     byId('startModal')?.classList.remove('open');
   }
   if(focusGoogle){
     requestAnimationFrame(()=>requestAnimationFrame(()=>{
       const pane=byId('nf350AuthPanel');
       if(pane){pane.scrollIntoView({behavior:'smooth',block:'start'});}
       const btn=byId('nf350Login');
       if(btn&&!btn.hidden)btn.focus({preventScroll:true});
     }));
   }else{
     requestAnimationFrame(()=>byId('nf346GuestName')?.focus({preventScroll:true}));
   }
 }
 function boot(){
   const introEntry=byId('nf346MenuEntry');
   if(introEntry&&!byId('nf64GoogleFromIntro')){
     const btn=document.createElement('button');btn.id='nf64GoogleFromIntro';btn.type='button';btn.textContent='🔐 Masuk dengan Google';
     const wrap=introEntry.querySelector('.nf346-actions');
     if(wrap)wrap.append(btn);else introEntry.append(btn);
     const note=document.createElement('p');note.id='nf64AccountNote';
     note.textContent='Masuk dengan Google untuk sinkronisasi progres Cloud, atau langsung main dalam Mode Tamu.';
     introEntry.append(note);
     btn.addEventListener('click',()=>openAccount(true));
   }
   byId('nf346SettingsOpen')?.addEventListener('click',ev=>{
     // Defensive: if legacy handler fails, this still opens the settings panel.
     if(byId('nf30Overlay')?.hidden)openAccount(false);
   });
   const auth=byId('nf350AuthPanel');
   if(auth&&!byId('nf64SignInHelp')){
     const note=document.createElement('div');note.id='nf64SignInHelp';
     note.textContent='Google Login memerlukan backend yang menyediakan /api/v1/auth/config, /auth/google, /me, dan refresh session. ZIP PWA saja tidak menyediakan API tersebut. Bila tombol login gagal, jalankan Diagnostik Google Login di panel ini.';
     auth.insertBefore(note,auth.children[2]||null);
   }
   window.NetForgeAccountUI={open:openAccount,version:'0.59.00'};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
;

/* === script:nf65-auth-help === */
(()=>{'use strict';function init(){const p=document.getElementById('nf350AuthPanel');if(!p||document.getElementById('nf65AuthHelp'))return;const e=document.createElement('div');e.id='nf65AuthHelp';e.innerHTML='<strong>Login Google v0.59.00:</strong> autentikasi memerlukan backend Laravel HTTPS yang dikonfigurasi. Token akses sekarang kompatibel dengan Laravel Sanctum. Bila belum tersedia, tetap gunakan Mode Tamu; progres lokal tetap aman.';p.insertBefore(e,p.children[2]||null)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();
;

/* === script:nf4066-profile-account-layout === */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 function arrange(){
   const parent=document.querySelector('#nf30Overlay .nf30-body');
   const guest=$('nf346ProfileCard'),google=$('nf350AuthPanel');
   if(!parent||!guest||!google)return false;
   let row=$('nf4066AccountRow');
   if(!row){
     row=document.createElement('div');row.id='nf4066AccountRow';
     row.setAttribute('role','group');row.setAttribute('aria-label','Pilihan akun pemain: Guest Mode dan Google Login');
     parent.insertBefore(row,parent.firstChild);
   }
   if(guest.parentElement!==row)row.appendChild(guest);
   if(google.parentElement!==row)row.appendChild(google);
   return true;
 }
 function boot(){
  if(arrange())return;
  // In case a component initializes asynchronously, retry only until both cards exist.
  const parent=document.querySelector('#nf30Overlay .nf30-body');if(!parent)return;
  const observer=new MutationObserver(()=>{if(arrange())observer.disconnect()});
  observer.observe(parent,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),10000);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 window.NetForgeAccountLayout={version:'0.59.00',refresh:arrange};
})();
;

/* === script:nf4068-workspace-stability === */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 function boot(){const tools=$('nf364Tools'),canvas=$('nf400Canvas');if(!tools||!canvas)return false;
  if($('nf4068WorkspaceStatus'))return true;
  const status=document.createElement('span');status.id='nf4068WorkspaceStatus';status.setAttribute('role','status');status.textContent='Workspace siap';tools.appendChild(status);
  const update=()=>{const v=window.NetForgeUnifiedViewport?.getState?.();if(!v)return;
    status.textContent='Zoom '+Math.round(v.zoom*100)+'%'+(v.pan?' · Pan aktif':'');};
  window.addEventListener('netforge:viewport-changed',update);
  window.addEventListener('netforge:unified-mission-opened',()=>{requestAnimationFrame(()=>{update();window.dispatchEvent(new Event('resize'));});});
  window.addEventListener('netforge:unified-history-state',update);
  $('nf364Pan')?.addEventListener('click',()=>requestAnimationFrame(update));
  update();return true;
 }
 const start=()=>{if(boot())return;let attempts=0;const timer=setInterval(()=>{if(boot()||++attempts>=20)clearInterval(timer)},150)};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.NetForgeWorkspaceStability={version:'0.59.00'};
})();
;

/* === script:nf69FrameLabLogic === */
(()=>{'use strict';
const $=id=>document.getElementById(id),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ipnum=s=>{if(typeof s!=='string'||!/^\d{1,3}(\.\d{1,3}){3}$/.test(s))return null;const a=s.split('.').map(Number);return a.some(x=>x>255)?null:a.reduce((n,x)=>n*256+x,0)>>>0;};
const subnet=(a,b,p)=>{const x=ipnum(a),y=ipnum(b),bits=Number(p);if(x===null||y===null||!Number.isInteger(bits)||bits<1||bits>30)return false;const mask=(0xffffffff << (32-bits))>>>0;return (x&mask)===(y&mask);};
const label=n=>n?.config?.name||n?.name||`${n?.type||'device'} ${n?.id}`;
const mac=n=>{const x=Number(n.id)>>>0;return '02:4e:46:'+[(x>>>16)&255,(x>>>8)&255,x&255].map(v=>v.toString(16).padStart(2,'0')).join(':');};
const getData=()=>{try{if(!window.NetForgeLab?.active?.())return null;const d=JSON.parse(window.NetForgeLab.export());if(!Array.isArray(d.nodes)||!Array.isArray(d.links))return null;return d;}catch{return null;}};
const stable=d=>JSON.stringify({nodes:d.nodes.map(n=>[n.id,n.type,n.config?.ip,n.config?.prefix,n.config?.vlan,n.broken]).sort((a,b)=>a[0]-b[0]),links:d.links.map(l=>[l.a,l.b,l.portA,l.portB,l.broken,l.disabled,l.down]).sort((a,b)=>a[0]-b[0]||a[1]-b[1])});
let lastKey=null,arpCache=new Map(),macTables=new Map(),focus=null;
function checkData(d){if(!d){lastKey=null;arpCache.clear();macTables.clear();return;}const next=stable(d);if(next!==lastKey){lastKey=next;arpCache.clear();macTables.clear();}}
function options(d){const src=$('nf69Source'),dst=$('nf69Target'),s=src.value,t=dst.value;src.replaceChildren();dst.replaceChildren();if(!d){src.add(new Option('Buka Network Lab',''));dst.add(new Option('Buka Network Lab',''));return;}for(const n of d.nodes.filter(n=>n.type==='pc'||n.type==='server')){const txt=`${label(n)} · ${n.config?.ip||'IP kosong'}`;src.add(new Option(txt,String(n.id)));dst.add(new Option(txt,String(n.id)));}if([...src.options].some(o=>o.value===s))src.value=s;if([...dst.options].some(o=>o.value===t))dst.value=t;else if(dst.options.length>1)dst.selectedIndex=1;}
const up=l=>!l.broken&&!l.down&&!l.disabled;
function neighbors(d,node){const out=[];for(const l of d.links){if(!up(l))continue;let id,port,other;if(l.a===node.id){id=l.b;port=l.portB;other=l.portA;}else if(l.b===node.id){id=l.a;port=l.portA;other=l.portB;}else continue;const n=d.nodes.find(v=>v.id===id);if(n)out.push({node:n,link:l,toPort:port,fromPort:other});}return out;}
function validVlan(a,b){if(a.type==='router'||b.type==='router')return false;const x=String(a.config?.vlan||'10'),y=String(b.config?.vlan||'10');return x===y;}
function findPath(d,source,target){const queue=[[source.id]],seen=new Set([source.id]);while(queue.length){const path=queue.shift(),last=d.nodes.find(n=>n.id===path[path.length-1]);if(last.id===target.id)return path;for(const e of neighbors(d,last)){const n=e.node;if(!validVlan(last,n)||seen.has(n.id)||n.type==='router'||(n.type!=='switch'&&n.id!==target.id))continue;seen.add(n.id);queue.push([...path,n.id]);}}return null;}
function learn(d,source,sourceMac){const queue=[{id:source.id,from:null}],seen=new Set([source.id]);while(queue.length){const item=queue.shift(),n=d.nodes.find(x=>x.id===item.id);if(n?.type==='switch'&&item.from){let table=macTables.get(n.id);if(!table)macTables.set(n.id,table=new Map());table.set(sourceMac,item.from.port);}for(const e of neighbors(d,n)){const peer=e.node;if(seen.has(peer.id)||!validVlan(n,peer)||peer.type==='router')continue;if(n.id!==source.id&&n.type!=='switch')continue;seen.add(peer.id);queue.push({id:peer.id,from:{port:e.toPort}});}}}
const step=(head,desc,kind='')=>`<div class="nf69step ${kind}"><strong>${esc(head)}</strong><div>${esc(desc)}</div></div>`;
function renderTables(){let a='<table><thead><tr><th>Perangkat</th><th>Alamat IPv4</th><th>MAC Tujuan</th></tr></thead><tbody>';for(const [key,v] of arpCache)a+=`<tr><td>${esc(v.source)}</td><td>${esc(v.ip)}</td><td><code>${esc(v.mac)}</code></td></tr>`;a+='</tbody></table>';$('nf69Arp').innerHTML=arpCache.size?a:'<p class="nf69muted">Belum ada ARP Reply berhasil.</p>';
let m='<table><thead><tr><th>Switch</th><th>MAC yang dipelajari</th><th>Port Masuk</th></tr></thead><tbody>',count=0;for(const [id,table] of macTables){for(const [address,port] of table){m+=`<tr><td>${esc(id)}</td><td><code>${esc(address)}</code></td><td>${esc(port)}</td></tr>`;count++;}}m+='</tbody></table>';$('nf69Mac').innerHTML=count?m:'<p class="nf69muted">Belum ada frame yang dipelajari switch.</p>';}
function refresh(){const d=getData();checkData(d);options(d);$('nf69Status').textContent=d?`Network Lab terbaca: ${d.nodes.length} perangkat, ${d.links.length} kabel. Cache simulasi hanya berlaku untuk topologi ini.`:'Network Lab belum aktif. Masuk ke Network Lab terlebih dahulu.';$('nf69Steps').innerHTML='';renderTables();}
function run(){const d=getData();checkData(d);if(!d){refresh();return;}const a=d.nodes.find(n=>String(n.id)===$('nf69Source').value),b=d.nodes.find(n=>String(n.id)===$('nf69Target').value);const steps=[];
if(!a||!b||a.id===b.id){$('nf69Status').textContent='Pilih dua endpoint yang berbeda.';return;}
const ai=a.config?.ip||'',bi=b.config?.ip||'';
if(ipnum(ai)===null||ipnum(bi)===null){steps.push(step('Alamat IP belum valid','Tetapkan IPv4 valid pada kedua endpoint melalui konfigurasi perangkat.','warn'));}
else if(!subnet(ai,bi,a.config?.prefix||24)||!subnet(ai,bi,b.config?.prefix||24)){steps.push(step('Beda subnet','ARP hanya menyelesaikan alamat MAC tujuan dalam jaringan lokal. Untuk beda subnet, endpoint memerlukan ARP untuk gateway dan forwarding Layer 3 yang belum dimodelkan di Frame Lab.','warn'));}
else {const path=findPath(d,a,b);if(!path){steps.push(step('Broadcast tidak mencapai tujuan','Periksa kabel aktif, koneksi switch, serta VLAN ID. ARP tidak melewati router.','warn'));}else{
const names=path.map(id=>label(d.nodes.find(n=>n.id===id))).join(' → ');
steps.push(step('1 · ARP Request',`${label(a)} (${ai}) mengirim broadcast FF:FF:FF:FF:FF:FF menanyakan MAC pemilik ${bi}.`,'ok'));
learn(d,a,mac(a));steps.push(step('2 · Switch Flood & Learn',`Frame broadcast mengikuti jalur ${names}. Switch belajar MAC sumber ${mac(a)} pada port masuk.`, 'ok'));
steps.push(step('3 · ARP Reply',`${label(b)} membalas secara unicast dengan MAC ${mac(b)}; switch belajar MAC sumber pada jalur balasan.`,'ok'));
learn(d,b,mac(b));arpCache.set(a.id+':'+bi,{source:label(a),ip:bi,mac:mac(b)});arpCache.set(b.id+':'+ai,{source:label(b),ip:ai,mac:mac(a)});
steps.push(step('4 · Cache Updated',`Kedua endpoint sekarang memiliki entri ARP hasil simulasi. Perkiraan jalur Layer 2: ${names}.`,'ok'));
}}
$('nf69Steps').innerHTML=steps.join('');$('nf69Status').textContent=steps.some(s=>s.includes('warn'))?'Simulasi belum berhasil: baca langkah diagnosis di bawah.':'Simulasi ARP edukatif berhasil. Ini bukan hasil Ping atau paket jaringan fisik.';renderTables();}
function init(){if(!$('nf69Overlay')||!$('nf61Open'))return;const btn=document.createElement('button');btn.type='button';btn.id='nf69Open';btn.className=$('nf61Open').className;btn.textContent='📡 Frame Lab';$('nf61Open').insertAdjacentElement('afterend',btn);
const open=()=>{focus=document.activeElement;$('nf69Overlay').hidden=false;refresh();$('nf69Close').focus();},close=()=>{$('nf69Overlay').hidden=true;focus?.focus?.();};btn.addEventListener('click',open);$('nf69Close').addEventListener('click',close);$('nf69Overlay').addEventListener('click',e=>{if(e.target===$('nf69Overlay'))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('nf69Overlay').hidden)close();});$('nf69Refresh').addEventListener('click',refresh);$('nf69Run').addEventListener('click',run);$('nf69Clear').addEventListener('click',()=>{arpCache.clear();macTables.clear();$('nf69Steps').innerHTML='';$('nf69Status').textContent='Cache simulasi dibersihkan.';renderTables();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();window.NetForgeFrameLab={version:'0.59.00',reset(){arpCache.clear();macTables.clear();lastKey=null;}};
})();
;

/* === script:nf70PacketFlowLogic === */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const nodeLabel=n=>n?.config?.name||n?.name||`${n?.type||'Device'} #${n?.id}`;
const mac=n=>{const x=Number(n.id)>>>0;return '02:4e:46:'+[(x>>>16)&255,(x>>>8)&255,x&255].map(v=>v.toString(16).padStart(2,'0')).join(':');};
const ipnum=s=>{if(typeof s!=='string'||!/^\d{1,3}(\.\d{1,3}){3}$/.test(s))return null;const a=s.split('.').map(Number);return a.some(x=>x>255)?null:a.reduce((n,x)=>n*256+x,0)>>>0;};
const sameSubnet=(a,b,p)=>{const x=ipnum(a),y=ipnum(b),bits=Number(p);if(x===null||y===null||!Number.isInteger(bits)||bits<1||bits>30)return false;const mask=(0xffffffff<<(32-bits))>>>0;return (x&mask)===(y&mask);};
const getData=()=>{try{if(!window.NetForgeLab?.active?.())return null;const d=JSON.parse(window.NetForgeLab.export());return Array.isArray(d.nodes)&&Array.isArray(d.links)?d:null;}catch{return null;}};
const fingerprint=d=>JSON.stringify({nodes:d.nodes.map(n=>[n.id,n.type,n.config?.ip,n.config?.prefix,n.config?.vlan,n.broken]).sort((a,b)=>a[0]-b[0]),links:d.links.map(l=>[l.a,l.b,l.portA,l.portB,l.broken,l.disabled,l.down]).sort((a,b)=>a[0]-b[0]||a[1]-b[1])});
const up=l=>!l.broken&&!l.disabled&&!l.down;
const vlan=(a,b)=>a.type!=='router'&&b.type!=='router'&&String(a.config?.vlan||'10')===String(b.config?.vlan||'10');
function findPath(d,a,b){const nodes=new Map(d.nodes.map(n=>[n.id,n]));const queue=[[a.id]],seen=new Set([a.id]);while(queue.length){const path=queue.shift(),last=nodes.get(path.at(-1));if(last.id===b.id)return path;for(const l of d.links){if(!up(l))continue;const next=l.a===last.id?l.b:l.b===last.id?l.a:null;if(next==null||seen.has(next))continue;const peer=nodes.get(next);if(!peer||!vlan(last,peer)||peer.type==='router'||(last.id!==a.id&&last.type!=='switch')||(peer.type!=='switch'&&peer.id!==b.id))continue;seen.add(next);queue.push([...path,next]);}}return null;}
let running=null,raf=0;
function stop(reason){cancelAnimationFrame(raf);raf=0;running=null;$('nf70PacketLayer').hidden=true;$('nf70PacketHud').hidden=true;const status=$('nf69Status');if(reason&&status&&$('nf69Overlay')?.hidden===false)status.textContent=reason;}
const center=el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};};
function endpoint(id){const el=document.querySelector('#board .node[data-id="'+CSS.escape(String(id))+'"]');if(!el||!el.getClientRects().length)return null;return center(el);}
function saySegment(state,index){const seg=state.segments[index],nodes=state.nodes;
const a=nodes.get(seg.a),b=nodes.get(seg.b),kind=seg.reply?'ARP Reply · Unicast':'ARP Request · Broadcast';
$('nf70State').textContent=kind+' · '+nodeLabel(a)+' → '+nodeLabel(b)+' · Hop '+(index+1)+'/'+state.segments.length;
$('nf70Headers').textContent=`Ethernet src=${mac(seg.reply?state.dest:state.source)} · dst=${seg.reply?mac(state.source):'ff:ff:ff:ff:ff:ff'} · EtherType=0x0806 · Target IP=${seg.reply?state.source.config?.ip:state.dest.config?.ip}`;
$('nf70Dot').classList.toggle('reply',!!seg.reply);
}
function frame(now){const state=running;if(!state)return;
const d=getData();if(!d||fingerprint(d)!==state.key){stop('Animasi dihentikan karena topologi LAB berubah atau LAB ditutup. Jalankan ulang setelah konfigurasi stabil.');return;}
if(document.hidden){state.then=now;raf=requestAnimationFrame(frame);return;}
if(state.then===null)state.then=now;
const dt=Math.min(80,Math.max(0,now-state.then));state.then=now;state.elapsed+=dt;
const segIndex=Math.min(Math.floor(state.elapsed/state.duration),state.segments.length-1);
if(segIndex!==state.index){state.index=segIndex;saySegment(state,segIndex);}
const seg=state.segments[segIndex],from=endpoint(seg.a),to=endpoint(seg.b);
if(!from||!to){stop('Animasi berhenti: perangkat tidak terlihat di workspace. Pastikan Network Lab terbuka.');return;}
const t=Math.min(1,(state.elapsed%state.duration)/state.duration),e=t*t*(3-2*t);
const dot=$('nf70Dot');dot.style.left=(from.x+(to.x-from.x)*e)+'px';dot.style.top=(from.y+(to.y-from.y)*e)+'px';
$('nf70Progress').style.width=Math.min(100,100*state.elapsed/(state.duration*state.segments.length))+'%';
if(state.elapsed>=state.duration*state.segments.length){stop();const status=$('nf69Status');if(status)status.textContent='Visualisasi ARP selesai. Buka Frame Lab untuk mengulang atau melihat tabel MAC/ARP.';return;}
raf=requestAnimationFrame(frame);
}
function play(){stop();const d=getData();if(!d){$('nf69Status').textContent='Masuk Network Lab terlebih dahulu untuk memvisualisasikan paket.';return;}
const a=d.nodes.find(n=>String(n.id)===$('nf69Source').value),b=d.nodes.find(n=>String(n.id)===$('nf69Target').value);
if(!a||!b||a.id===b.id){$('nf69Status').textContent='Pilih dua endpoint berbeda di Frame Lab.';return;}
if(!sameSubnet(a.config?.ip,b.config?.ip,a.config?.prefix||24)||!sameSubnet(a.config?.ip,b.config?.ip,b.config?.prefix||24)){$('nf69Status').textContent='Tidak dapat memvisualisasikan ARP lokal: IP harus valid dan kedua perangkat satu subnet.';return;}
const path=findPath(d,a,b);if(!path||path.length<2){$('nf69Status').textContent='Jalur ARP tidak ditemukan: periksa VLAN, port, kabel, dan switch.';return;}
if(path.some(id=>!endpoint(id))){$('nf69Status').textContent='Perangkat tidak terlihat di workspace. Buka Network Lab sebelum memulai animasi.';return;}
const segments=[];for(let i=1;i<path.length;i++)segments.push({a:path[i-1],b:path[i],reply:false});for(let i=path.length-1;i>0;i--)segments.push({a:path[i],b:path[i-1],reply:true});
running={key:fingerprint(d),source:a,dest:b,nodes:new Map(d.nodes.map(n=>[n.id,n])),segments,duration:900,elapsed:0,then:null,index:-1};
$('nf69Overlay').hidden=true;$('nf70PacketLayer').hidden=false;$('nf70PacketHud').hidden=false;
saySegment(running,0);raf=requestAnimationFrame(frame);
}
function init(){if(!$('nf70Play')||!$('nf70Stop'))return;$('nf70Play').addEventListener('click',play);$('nf70Stop').addEventListener('click',()=>stop());window.addEventListener('pagehide',()=>stop());document.addEventListener('keydown',e=>{if(e.key==='Escape'&&running)stop();});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.NetForgePacketFlow={version:'0.59.00',stop,isRunning:()=>!!running};
})();
;

/* === script:nf71-version-label-fix === */
(()=>{'use strict';function sync(){const label=window.NETFORGE_RELEASE?.label||'v0.59.00';document.querySelectorAll('[data-nf-intro-version]').forEach(el=>{if(el.textContent!==label)el.textContent=label})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();window.NetForgeReleaseLabels={sync};})();
;

/* === script:nf4074-fab-cluster === */
/* NET FORGE v0.40.92 — ringkas tombol mengambang kanan-bawah (Audio, Lanjut Bermain, Diagnostik, Install, Update) menjadi satu klaster "Menu" agar tidak menutupi panel OBJECTIVE dan catatan validator. Tombol tetap berfungsi penuh; yang berubah hanya wadahnya. */
(()=>{'use strict';var IDS=['nf327AudioToggle','nf365Launcher','nf366Open','nf328Install','nf328Update'],fab=null,menu=null;
function collect(){if(!fab){fab=document.createElement('div');fab.id='nf4074Fab';menu=document.createElement('div');menu.id='nf4074FabMenu';var t=document.createElement('button');t.type='button';t.id='nf4074FabToggle';t.textContent='⋮ Menu';t.setAttribute('aria-label','Menu aksi');t.setAttribute('aria-expanded','false');t.addEventListener('click',function(){var open=fab.classList.toggle('open');t.setAttribute('aria-expanded',open?'true':'false')});fab.append(menu,t);document.body.append(fab);}
for(var i=0;i<IDS.length;i++){var el=document.getElementById(IDS[i]);if(el&&el.parentNode!==menu)menu.append(el);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',collect);else collect();
// v0.59.00: menu menutup sendiri saat klik di luar atau tekan Escape, agar
// menu yang terbuka tidak terus menutupi panel OBJECTIVE / tombol lain.
document.addEventListener('click',function(e){if(fab&&fab.classList.contains('open')&&!fab.contains(e.target)){fab.classList.remove('open');var t=document.getElementById('nf4074FabToggle');if(t)t.setAttribute('aria-expanded','false')}},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&fab&&fab.classList.contains('open')){fab.classList.remove('open');var t=document.getElementById('nf4074FabToggle');if(t)t.setAttribute('aria-expanded','false')}});
setTimeout(collect,800);setTimeout(collect,2500);
if(window.MutationObserver){var mo=new MutationObserver(function(){collect()});try{mo.observe(document.body,{childList:true,subtree:false})}catch(e){}setTimeout(function(){try{mo.disconnect()}catch(e){}},15000);}
})();
;
