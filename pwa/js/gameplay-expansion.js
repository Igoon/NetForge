/* === script:nf4400-expansion-engine === */
/* NET FORGE v0.56.00 — Mode Darurat 60s, Deck Insiden Kantor & Toko Teknisi */
(function () {
  'use strict';
  if (window.__NF4400_LOADED) return;
  window.__NF4400_LOADED = true;

  const $ = id => document.getElementById(id);
  const API = () => window.NetForgeUniversalInventory || null;
  const ALIVE = () => window.NetForgeAlive || null;
  const STORE_KEY = 'netforge.shop.v044';

  // =========================================================================
  // 1. PERSISTENT PROFILE (XP, STARS, BEST EMERGENCY TIME, COSMETICS)
  // =========================================================================
  const SHOP_ITEMS = [
    { id: 'cable_default', type: 'cable', val: 'default', name: '🔵 Kabel Standar', desc: 'Biru klasik bawaan NET FORGE', cost: 0 },
    { id: 'cable_matrix', type: 'cable', val: 'matrix', name: '🟢 Matrix Neon', desc: 'Kabel hijau neon ala ruang server', cost: 50 },
    { id: 'cable_cyber', type: 'cable', val: 'cyber', name: '🟣 Cyberpunk Violet', desc: 'Kabel ungu neon bercahaya terang', cost: 100 },
    { id: 'cable_lava', type: 'cable', val: 'lava', name: '🟠 Lava Emas', desc: 'Kabel oranye-emas berkecepatan tinggi', cost: 150 },
    { id: 'acc_none', type: 'acc', val: '', name: '✨ Tanpa Aksesori', desc: 'Tampilan standar Iga', cost: 0 },
    { id: 'acc_glasses', type: 'acc', val: '😎', name: '😎 Kacamata Pro', desc: 'Gaya teknisi senior paling santai', cost: 75 },
    { id: 'acc_crown', type: 'acc', val: '👑', name: '👑 Mahkota Master', desc: 'Penghargaan arsitek jaringan elit', cost: 200 }
  ];

  function loadStore() {
    const def = { xp: 100, stars: 0, bestEmergency: null, owned: ['cable_default', 'acc_none'], cable: 'default', acc: '' };
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return def;
      return Object.assign(def, JSON.parse(raw));
    } catch (_) { return def; }
  }
  let store = loadStore();
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (_) {}
  }

  function applyCosmetics() {
    if (store.cable && store.cable !== 'default') {
      document.body.setAttribute('data-nf44-cable', store.cable);
    } else {
      document.body.removeAttribute('data-nf44-cable');
    }
    const av = $('igaAvatar');
    if (av) av.setAttribute('data-nf44-acc', store.acc || '');
    // Sync XP pill visually if lower than store.xp
    try {
      const xpEl = document.querySelector('#xp, [id*="xp" i]');
      if (xpEl && /\d+/.test(xpEl.textContent)) {
        const cur = Number((xpEl.textContent.match(/\d+/) || [0])[0]);
        if (store.xp > cur) xpEl.textContent = xpEl.textContent.replace(/\d+/, String(store.xp));
      }
    } catch (_) {}
  }

  function addReward(xpGain, starsGain) {
    store.xp = (store.xp || 0) + (xpGain || 0);
    if (starsGain) store.stars = (store.stars || 0) + starsGain;
    saveStore();
    applyCosmetics();
  }

  // =========================================================================
  // 2. DECK INSIDEN KANTOR (3 VARIASI INTERAKTIF: SI OYEN, OVERHEAT, STREAMING 4K)
  // =========================================================================
  let activeIncidentCount = 0;
  let incidentCursor = 0;

  function spawnOfficeIncident(forceIdx) {
    const canvas = $('nf400Canvas');
    if (!canvas) return false;
    const nodeEls = [...canvas.querySelectorAll('[data-node]')];
    if (!nodeEls.length) {
      ALIVE()?.igaReact?.('Kanvas masih kosong! Tambah perangkat dulu sebelum memicu insiden kantor.', 'confused', true);
      return false;
    }

    const pick = typeof forceIdx === 'number' ? forceIdx % 3 : (incidentCursor++ % 3);
    if (pick === 0 && ALIVE()?.spawnCatChaos) {
      // Use existing Si Oyen cat chaos and hook bonus XP into store
      const ok = ALIVE().spawnCatChaos();
      if (ok) {
        activeIncidentCount = 1;
        const catEl = canvas.querySelector('.nf41-cat-overlay');
        if (catEl) {
          catEl.addEventListener('click', () => {
            activeIncidentCount = 0;
            addReward(25, 0);
          }, { once: true });
        }
      }
      return ok;
    }

    // Clear previous incident overlays
    canvas.querySelectorAll('.nf41-cat-overlay').forEach(el => el.remove());
    canvas.querySelectorAll('.nf41-cat-hot').forEach(el => el.classList.remove('nf41-cat-hot'));

    const target = nodeEls[Math.floor(Math.random() * nodeEls.length)];
    target.classList.add('nf41-cat-hot');
    activeIncidentCount = 1;

    const isOverheat = pick === 1;
    const wrap = document.createElement('div');
    wrap.className = 'nf41-cat-overlay ' + (isOverheat ? 'nf44-inc-overheat' : 'nf44-inc-stream');
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.innerHTML = isOverheat
      ? '<span class="nf41-cat-badge">🔥 88°C Overheat! Klik kipas ❄️</span><div class="nf44-inc-icon">🔥</div>'
      : '<span class="nf41-cat-badge">📺 Streaming 4K! Klik batasi QoS 🚦</span><div class="nf44-inc-icon">📺</div>';

    const resolveInc = ev => {
      if (ev) { ev.stopPropagation(); ev.preventDefault(); }
      wrap.remove();
      target.classList.remove('nf41-cat-hot');
      activeIncidentCount = 0;
      addReward(25, 0);
      ALIVE()?.SFX?.catPurrHappy?.();
      ALIVE()?.igaReact?.(
        isOverheat
          ? 'Fiuuh! Kipas turbo menyala, suhu perangkat turun ke 34°C (+25 XP)!'
          : 'Mantap! QoS aktif, rekan kerja yang streaming 4K langsung kena limit bandwidth (+25 XP)!',
        'celebrate',
        true
      );
    };
    wrap.addEventListener('click', resolveInc);
    wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') resolveInc(e); });
    target.appendChild(wrap);

    ALIVE()?.SFX?.errorBonk?.();
    ALIVE()?.igaReact?.(
      isOverheat
        ? 'DARURAT SUHU! Perangkat kepanasan 88°C! Klik ikon api di kanvas untuk menyalakan kipas pendingin!'
        : 'BANDWIDTH PENUH! Ada rekan kerja streaming 4K di jam kerja! Klik ikon TV di kanvas untuk aktifkan QoS!',
      'panic',
      true
    );
    return true;
  }

  // =========================================================================
  // 3. MODE DARURAT 60 DETIK (TROUBLESHOOTING KILAT)
  // =========================================================================
  let emergencyTimer = null;
  let emergencyLeft = 0;

  function ensureTimerBar() {
    if ($('nf44TimerBar')) return $('nf44TimerBar');
    const banner = $('nf403MissionBanner');
    if (!banner || !banner.parentElement) return null;
    const bar = document.createElement('div');
    bar.id = 'nf44TimerBar';
    bar.innerHTML = `
      <span id="nf44TimerMsg">🚨 MODE DARURAT: Bereskan insiden & sambungkan semua perangkat hingga 3/3!</span>
      <div style="display:flex;align-items:center;gap:8px;">
        <span id="nf44TimerClock">01:00</span>
        <button type="button" id="nf44TimerStop">Hentikan</button>
      </div>`;
    banner.parentElement.insertBefore(bar, banner.nextSibling);
    bar.querySelector('#nf44TimerStop').addEventListener('click', () => stopEmergency(false));
    return bar;
  }

  function stopEmergency(won) {
    if (emergencyTimer) { clearInterval(emergencyTimer); emergencyTimer = null; }
    const bar = $('nf44TimerBar');
    if (bar) bar.classList.remove('active');
    if (won) {
      const elapsed = Math.max(1, 60 - emergencyLeft);
      if (!store.bestEmergency || elapsed < store.bestEmergency) store.bestEmergency = elapsed;
      addReward(100, 3);
      ALIVE()?.SFX?.victory?.();
      ALIVE()?.igaReact?.('LUAR BIASA! Mode Darurat selesai dalam ' + elapsed + ' detik! Bonus +100 XP & 3 Bintang masuk kantong!', 'celebrate', true);
    }
  }

  function startEmergencyMode() {
    const bar = ensureTimerBar();
    if (!bar) return;
    stopEmergency(false);

    // Ensure at least Router + Desktop PC exist on canvas so player can immediately troubleshoot
    const nodes = API()?.getState?.()?.nodes || [];
    if (nodes.length < 2) {
      const btns = [...document.querySelectorAll('#nf400List button, #nf400List .nf400-device')];
      const rBtn = btns.find(b => /Router/i.test(b.textContent || ''));
      const pcBtn = btns.find(b => /Desktop PC/i.test(b.textContent || ''));
      if (!nodes.some(n => n.type === 'router') && rBtn) rBtn.click();
      if (!nodes.some(n => n.type === 'pc' || n.type === 'desktop') && pcBtn) pcBtn.click();
    }

    emergencyLeft = 60;
    $('nf44TimerClock').textContent = '01:00';
    bar.classList.add('active');

    setTimeout(() => spawnOfficeIncident(), 300);

    emergencyTimer = setInterval(() => {
      emergencyLeft--;
      const sec = String(Math.max(0, emergencyLeft)).padStart(2, '0');
      const clk = $('nf44TimerClock');
      if (clk) clk.textContent = '00:' + sec;

      // Check win condition: 3/3 objective complete AND no active incident overlay
      const rightText = document.querySelector('.right')?.innerText || '';
      const passed = rightText.includes('3 / 3') || rightText.includes('MISI TUNTAS');
      const hasInc = !!document.querySelector('#nf400Canvas .nf41-cat-overlay');
      if (passed && !hasInc) {
        stopEmergency(true);
        return;
      }

      if (emergencyLeft <= 0) {
        stopEmergency(false);
        ALIVE()?.SFX?.errorBonk?.();
        ALIVE()?.igaReact?.('WAKTU HABIS! Klien keburu pindah ke tethering HP. Klik "🚨 Darurat 60s" lagi buat balas dendam!', 'fail', true);
      }
    }, 1000);
  }

  // =========================================================================
  // 4. TOKO TEKNISI MODAL (KOSMETIK KABEL NEON & AKSESORI IGA)
  // =========================================================================
  function renderShop() {
    const modal = $('nf44ShopModal');
    if (!modal) return;
    $('nf44WalletXP').textContent = '⭐ ' + store.xp + ' XP';
    $('nf44WalletStars').textContent = '🏆 ' + store.stars + ' Bintang';
    $('nf44WalletBest').textContent = store.bestEmergency ? ('⏱️ Rekor Darurat: ' + store.bestEmergency + 'd') : '⏱️ Belum ada rekor Darurat';

    const makeGrid = type => SHOP_ITEMS.filter(it => it.type === type).map(it => {
      const owned = store.owned.includes(it.id);
      const equipped = (type === 'cable' && store.cable === it.val) || (type === 'acc' && store.acc === it.val);
      const canBuy = store.xp >= it.cost;
      const btnCls = equipped ? 'equipped-btn' : (owned ? 'owned' : '');
      const btnText = equipped ? '✓ Dipakai' : (owned ? 'Pakai' : ('Beli · ' + it.cost + ' XP'));
      return `
        <div class="nf44-item ${equipped ? 'equipped' : ''}">
          <strong>${it.name}</strong>
          <small>${it.desc}</small>
          <button type="button" class="${btnCls}" data-nf44-item="${it.id}" ${(!owned && !canBuy) || equipped ? 'disabled' : ''}>${btnText}</button>
        </div>`;
    }).join('');

    $('nf44CableGrid').innerHTML = makeGrid('cable');
    $('nf44AccGrid').innerHTML = makeGrid('acc');
  }

  function openShop() {
    let modal = $('nf44ShopModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'nf44ShopModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="nf44-shop-card">
          <div class="nf44-shop-head">
            <h3>🎨 Toko Teknisi & Kosmetik</h3>
            <button type="button" class="nf43-sheet-close" id="nf44ShopClose">✕ Tutup</button>
          </div>
          <div class="nf44-shop-wallet">
            <span id="nf44WalletXP">⭐ 100 XP</span>
            <span id="nf44WalletStars">🏆 0 Bintang</span>
            <span id="nf44WalletBest">⏱️ Belum ada rekor</span>
          </div>
          <div class="nf44-shop-sec">Warna Kabel Neon (Langsung Aktif di Kanvas)</div>
          <div class="nf44-shop-grid" id="nf44CableGrid"></div>
          <div class="nf44-shop-sec">Aksesori Avatar Iga</div>
          <div class="nf44-shop-grid" id="nf44AccGrid"></div>
        </div>`;
      document.body.appendChild(modal);
      modal.querySelector('#nf44ShopClose').addEventListener('click', () => modal.classList.remove('open'));
      modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('open');
        const btn = e.target.closest('button[data-nf44-item]');
        if (!btn) return;
        const item = SHOP_ITEMS.find(x => x.id === btn.dataset.nf44Item);
        if (!item) return;
        if (!store.owned.includes(item.id)) {
          if (store.xp < item.cost) return;
          store.xp -= item.cost;
          store.owned.push(item.id);
        }
        if (item.type === 'cable') store.cable = item.val;
        if (item.type === 'acc') store.acc = item.val;
        saveStore();
        applyCosmetics();
        renderShop();
        ALIVE()?.SFX?.catPurrHappy?.();
      });
    }
    renderShop();
    modal.classList.add('open');
  }

  // =========================================================================
  // 5. WIRE BUTTONS INTO EXISTING UI CLEANLY
  // =========================================================================
  function injectControls() {
    applyCosmetics();

    // Upgrade Chaos: Si Oyen button into Deck Insiden Kantor (3 random funny incidents)
    const catBtn = $('nf41CatBtn');
    if (catBtn && !catBtn.__nf44Upgraded) {
      catBtn.__nf44Upgraded = true;
      const clone = catBtn.cloneNode(true);
      clone.textContent = '🎲 Insiden Kantor';
      clone.title = 'Picu insiden kocak acak: Si Oyen, Server Overheat, atau Streaming 4K (+25 XP)';
      clone.addEventListener('click', () => spawnOfficeIncident());
      catBtn.replaceWith(clone);
    }

    // Add Mode Darurat 60s button beside Insiden Kantor
    if (!$('nf44EmergencyBtn')) {
      const host = $('nf41CatBtn')?.parentElement || $('nf403RunMission')?.parentElement;
      if (host) {
        const eBtn = document.createElement('button');
        eBtn.id = 'nf44EmergencyBtn';
        eBtn.type = 'button';
        eBtn.textContent = '🚨 Darurat 60s';
        eBtn.title = 'Tantangan Troubleshooting Kilat 60 detik (+100 XP & 3 Bintang)';
        eBtn.addEventListener('click', startEmergencyMode);
        host.appendChild(eBtn);
      }
    }

    // Add Toko Teknisi button inside #nf43DrawerBar
    if (!$('nf44ShopBtn')) {
      const tabs = document.querySelector('#nf43DrawerBar .nf43-tabs');
      if (tabs) {
        const sBtn = document.createElement('button');
        sBtn.id = 'nf44ShopBtn';
        sBtn.type = 'button';
        sBtn.textContent = '🎨 Toko Teknisi';
        sBtn.title = 'Tukar XP dengan tema kabel neon & aksesori Iga';
        sBtn.addEventListener('click', openShop);
        tabs.appendChild(sBtn);
      }
    }
  }

  window.NetForgeExpansion = {
    version: '0.56.00',
    startEmergencyMode,
    stopEmergency,
    spawnOfficeIncident,
    openShop,
    getStore: () => store
  };

  let tries = 0;
  (function boot() {
    injectControls();
    if (++tries < 16) setTimeout(boot, 450);
  })();
})();
;

/* === script:nf4500-master-engine === */
/* NET FORGE v0.56.00 — Achievements, Live Network Health Bar & Optional Auto-Chaos */
(function () {
  'use strict';
  if (window.__NF4500_LOADED) return;
  window.__NF4500_LOADED = true;

  const $ = id => document.getElementById(id);
  const ALIVE = () => window.NetForgeAlive || null;
  const EXP = () => window.NetForgeExpansion || null;
  const ACH_KEY = 'netforge.achievements.v045';

  const ACHIEVEMENTS = [
    { id: 'first_wire', ico: '🔌', name: 'Tukang Kabel Pertama', desc: 'Sambungkan kabel pertama di kanvas', xp: 20 },
    { id: 'first_incident', ico: '🐱', name: 'Pawang Si Oyen', desc: 'Atasi insiden kantor pertama', xp: 30 },
    { id: 'emergency_win', ico: '🚨', name: 'Pemadam Kebakaran IT', desc: 'Menangkan Mode Darurat 60 Detik', xp: 50 },
    { id: 'speedrunner', ico: '⚡', name: 'Speedrunner Jaringan', desc: 'Menang Mode Darurat di bawah 20 detik', xp: 75 },
    { id: 'shop_buyer', ico: '🎨', name: 'Sultan Ruang Server', desc: 'Beli kosmetik di Toko Teknisi', xp: 30 },
    { id: 'star_collector', ico: '🌟', name: 'Kolektor Bintang', desc: 'Kumpulkan minimal 3 Bintang', xp: 50 }
  ];

  function loadAch() {
    try {
      const raw = localStorage.getItem(ACH_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }
  let unlocked = loadAch();
  function saveAch() {
    try { localStorage.setItem(ACH_KEY, JSON.stringify(unlocked)); } catch (_) {}
  }

  function showBadgeToast(ach) {
    let stack = $('nf45ToastStack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'nf45ToastStack';
      document.body.appendChild(stack);
    }
    const el = document.createElement('div');
    el.className = 'nf45-toast';
    el.innerHTML = `<div class="nf45-toast-ico">${ach.ico}</div><div class="nf45-toast-txt"><strong>🏆 Lencana Terbuka! (+${ach.xp} XP)</strong><span>${ach.name}</span></div>`;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3600);
  }

  function unlock(id) {
    if (unlocked.includes(id)) return false;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return false;
    unlocked.push(id);
    saveAch();
    // Grant XP into shop store if available
    try {
      const st = EXP()?.getStore?.();
      if (st) {
        st.xp = (st.xp || 0) + ach.xp;
        localStorage.setItem('netforge.shop.v044', JSON.stringify(st));
      }
    } catch (_) {}
    showBadgeToast(ach);
    ALIVE()?.SFX?.catPurrHappy?.();
    return true;
  }

  function evaluateAchievements() {
    const wires = document.querySelectorAll('#nf400Wires line.nf400-wire').length;
    if (wires >= 1) unlock('first_wire');

    const st = EXP()?.getStore?.();
    if (st) {
      if (st.bestEmergency) unlock('emergency_win');
      if (st.bestEmergency && st.bestEmergency <= 20) unlock('speedrunner');
      if ((st.owned || []).length > 2) unlock('shop_buyer');
      if ((st.stars || 0) >= 3) unlock('star_collector');
    }
  }

  // Track incident resolution clicks
  document.addEventListener('click', e => {
    if (e.target.closest('.nf41-cat-overlay')) {
      setTimeout(() => unlock('first_incident'), 150);
    }
    setTimeout(() => {
      updateHealthPill();
      evaluateAchievements();
    }, 260);
  }, true);

  // =========================================================================
  // 2. LIVE NETWORK HEALTH PILL
  // =========================================================================
  function updateHealthPill() {
    const pill = $('nf45HealthPill');
    const canvas = $('nf400Canvas');
    if (!pill || !canvas) return;
    const nodes = [...canvas.querySelectorAll('.nf400-node')];
    const online = nodes.filter(n => /LINK UP|ONLINE|ACTIVE/i.test(n.textContent || '') && !/OFFLINE/i.test(n.textContent || '')).length;
    const wires = document.querySelectorAll('#nf400Wires line.nf400-wire').length;
    const inc = !!canvas.querySelector('.nf41-cat-overlay');
    const statusHtml = inc
      ? '<span class="warn">⚠ Gangguan!</span>'
      : (nodes.length > 0 && online === nodes.length ? '<span class="ok">● Sehat</span>' : '<span class="warn">○ Siaga</span>');
    pill.innerHTML = `${statusHtml} <span>🖥️ ${online}/${nodes.length}</span> <span>🔗 ${wires}</span>`;
  }

  // =========================================================================
  // 3. OPTIONAL AUTO-CHAOS TOGGLE (every 35s when enabled)
  // =========================================================================
  let autoChaosOn = false;
  let autoChaosTimer = null;
  function toggleAutoChaos() {
    autoChaosOn = !autoChaosOn;
    const btn = $('nf45AutoChaosBtn');
    if (btn) {
      btn.classList.toggle('on', autoChaosOn);
      btn.textContent = autoChaosOn ? '⚡ Auto-Chaos: Aktif' : '⚡ Auto-Chaos: Mati';
    }
    if (autoChaosTimer) { clearInterval(autoChaosTimer); autoChaosTimer = null; }
    if (autoChaosOn) {
      ALIVE()?.igaReact?.('Mode Auto-Chaos aktif! Siap-siap, insiden kantor bisa muncul sewaktu-waktu setiap 35 detik.', 'think', true);
      autoChaosTimer = setInterval(() => {
        if (document.hidden) return;
        const canvas = $('nf400Canvas');
        if (!canvas || canvas.querySelector('.nf41-cat-overlay')) return;
        if (canvas.querySelectorAll('[data-node]').length >= 1) {
          EXP()?.spawnOfficeIncident?.();
        }
      }, 35000);
    }
  }

  // =========================================================================
  // 4. ACHIEVEMENTS MODAL
  // =========================================================================
  function openBadgesModal() {
    evaluateAchievements();
    let m = $('nf45BadgeModal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'nf45BadgeModal';
      m.setAttribute('role', 'dialog');
      m.setAttribute('aria-modal', 'true');
      m.innerHTML = `
        <div class="nf45-badge-card">
          <div class="nf44-shop-head">
            <h3>🏆 Lencana Pencapaian (<span id="nf45BadgeCount">0/6</span>)</h3>
            <button type="button" class="nf43-sheet-close" id="nf45BadgeClose">✕ Tutup</button>
          </div>
          <div class="nf45-badge-grid" id="nf45BadgeGrid"></div>
        </div>`;
      document.body.appendChild(m);
      m.querySelector('#nf45BadgeClose').addEventListener('click', () => m.classList.remove('open'));
      m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
    }
    $('nf45BadgeCount').textContent = unlocked.length + '/' + ACHIEVEMENTS.length;
    $('nf45BadgeGrid').innerHTML = ACHIEVEMENTS.map(a => {
      const ok = unlocked.includes(a.id);
      return `
        <div class="nf45-ach ${ok ? 'unlocked' : ''}">
          <div class="nf45-ach-ico">${a.ico}</div>
          <div>
            <strong>${a.name} ${ok ? '✅' : ''}</strong>
            <small>${a.desc}</small>
            <span class="xp">${ok ? 'Tercapai' : 'Hadiah +' + a.xp + ' XP'}</span>
          </div>
        </div>`;
    }).join('');
    m.classList.add('open');
  }

  function injectBarItems() {
    const bar = $('nf43DrawerBar');
    if (!bar) return false;
    const tabs = bar.querySelector('.nf43-tabs');
    if (tabs && !$('nf45BadgeBtn')) {
      const b = document.createElement('button');
      b.id = 'nf45BadgeBtn';
      b.type = 'button';
      b.textContent = '🏆 Lencana';
      b.addEventListener('click', openBadgesModal);
      tabs.appendChild(b);
    }
    if (tabs && !$('nf45AutoChaosBtn')) {
      const c = document.createElement('button');
      c.id = 'nf45AutoChaosBtn';
      c.type = 'button';
      c.textContent = '⚡ Auto-Chaos: Mati';
      c.title = 'Aktifkan insiden kantor acak otomatis setiap 35 detik';
      c.addEventListener('click', toggleAutoChaos);
      tabs.appendChild(c);
    }
    if (!$('nf45HealthPill')) {
      const hint = bar.querySelector('.nf43-hint');
      const pill = document.createElement('div');
      pill.id = 'nf45HealthPill';
      pill.textContent = '○ Siaga';
      if (hint) hint.replaceWith(pill);
      else bar.appendChild(pill);
    }
    updateHealthPill();
    return true;
  }

  window.NetForgeMaster = {
    version: '0.56.00',
    openBadgesModal,
    toggleAutoChaos,
    getUnlocked: () => [...unlocked],
    updateHealthPill
  };

  let tries = 0;
  (function boot() {
    if (injectBarItems() || ++tries > 20) return;
    setTimeout(boot, 400);
  })();
  setInterval(updateHealthPill, 2000);
})();
;
