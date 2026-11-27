/* NET FORGE v0.71.0 — Jalur Misi Bertingkat (Level 1-6) & Progressive Device Unlock */
(function () {
  'use strict';
  if (window.__NF7100_CAMPAIGN) return;
  window.__NF7100_CAMPAIGN = true;

  const STORE_KEY = 'netforge.campaignProgress.v1';
  const FW_KEY = 'netforge.firewallAcl.v1';
  const $ = id => document.getElementById(id);
  const API = () => window.NetForgeUniversalInventory || null;

  let activeRestriction = null; // null = all 15 unlocked, or Array<string> of allowed device types
  let activeRestrictionLabel = '';
  let activeLevel = null; // { levelObj, timerId }

  function loadProgress() {
    try {
      return Object.assign({ unlockedLevel: 1, completed: {} }, JSON.parse(localStorage.getItem(STORE_KEY) || '{}'));
    } catch (_) {
      return { unlockedLevel: 1, completed: {} };
    }
  }

  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (_) {}
  }

  function loadFwRules() {
    try {
      return Object.assign({ 80: 'allow', 443: 'allow', 22: 'deny', 53: 'allow' }, JSON.parse(localStorage.getItem(FW_KEY) || '{}'));
    } catch (_) {
      return { 80: 'allow', 443: 'allow', 22: 'deny', 53: 'allow' };
    }
  }

  function getNodesWithCfg() {
    const api = API();
    const raw = api?.getState?.()?.nodes || [];
    const classic = api?.classicView?.()?.nodes || [];
    const byId = new Map(classic.map(c => [String(c.id), c.config || {}]));
    return raw.map(n => {
      const cfg = byId.get(String(n.id)) || {};
      return {
        id: String(n.id),
        type: n.type,
        name: n.name || n.type,
        ip: (n.ip && String(n.ip).trim()) || cfg.ip || (n.type === 'router' ? '192.168.10.1' : ''),
        prefix: String(cfg.prefix || '24').replace(/^\//, ''),
        gateway: (n.gateway && String(n.gateway).trim()) || cfg.gateway || '',
        vlan: String((n.vlan && String(n.vlan).trim()) || cfg.vlan || '').trim(),
        iface: String((n.iface && String(n.iface).trim()) || cfg.iface || '').trim().toLowerCase()
      };
    });
  }

  function hasPath(typeA, typeB) {
    const api = API();
    const state = api?.getState?.() || { nodes: [], edges: [] };
    const nodes = state.nodes || [];
    const edges = (state.edges || []).filter(e => api?.isLinkActive?.(e));
    const a = nodes.find(n => n.type === typeA);
    const b = nodes.find(n => n.type === typeB);
    if (!a || !b) return false;
    const q = [String(a.id)];
    const seen = new Set(q);
    while (q.length) {
      const cur = q.shift();
      for (const e of edges) {
        const ea = String(e.a), eb = String(e.b);
        const nxt = ea === cur ? eb : (eb === cur ? ea : null);
        if (!nxt || seen.has(nxt)) continue;
        if (nxt === String(b.id)) return true;
        seen.add(nxt);
        q.push(nxt);
      }
    }
    return false;
  }

  function allNodesOnline() {
    const api = API();
    const state = api?.getState?.() || { nodes: [], edges: [] };
    const nodes = state.nodes || [];
    const active = (state.edges || []).filter(e => api?.isLinkActive?.(e));
    return nodes.length > 0 && nodes.every(n => active.some(e => String(e.a) === String(n.id) || String(e.b) === String(n.id)));
  }

  const LEVELS = [
    {
      level: 1,
      title: 'LAN Kantor Dasar',
      badge: 'Pemula · 4 Perangkat',
      brief: 'Pasang Router, Switch, Desktop PC, dan Server lalu hubungkan seluruhnya (Router → Switch → PC & Server) hingga online.',
      unlockReward: '🔓 Membuka Modem ISP & Access Point',
      allowedDevices: ['router', 'switch', 'pc', 'server'],
      check() {
        const ns = getNodesWithCfg();
        const hasAll = ['router', 'switch', 'pc', 'server'].every(t => ns.some(n => n.type === t));
        return [
          { label: 'Pasang Router, Switch, PC & Server', ok: hasAll },
          { label: 'Jalur Router ↔ Switch ↔ PC & Server', ok: hasPath('router', 'switch') && hasPath('pc', 'server') },
          { label: 'Semua perangkat online', ok: allNodesOnline() }
        ];
      }
    },
    {
      level: 2,
      title: 'IP Statis & Subnetting /24',
      badge: 'Dasar · 5 Perangkat',
      brief: 'Hubungkan Modem ISP → Router (192.168.10.1) → Switch → PC & Server (192.168.10.10). Atur IP PC di subnet 192.168.10.* tanpa konflik IP.',
      unlockReward: '🔓 Membuka Laptop, Tablet, HP, Smart TV, CCTV, IoT & NVR',
      allowedDevices: ['modem', 'router', 'switch', 'pc', 'server'],
      check() {
        const ns = getNodesWithCfg();
        const srv = ns.find(n => n.type === 'server');
        const pc = ns.find(n => n.type === 'pc');
        const ips = ns.map(n => n.ip).filter(Boolean);
        const noConflict = ips.length >= 2 && new Set(ips).size === ips.length;
        return [
          { label: 'Jalur Modem ↔ Router ↔ Switch ↔ PC & Server', ok: hasPath('modem', 'router') && hasPath('router', 'switch') && hasPath('pc', 'server') },
          { label: 'IP Server = 192.168.10.10', ok: srv?.ip === '192.168.10.10' },
          { label: 'IP PC di 192.168.10.* & bebas konflik', ok: Boolean(pc && /^192\.168\.10\.\d{1,3}$/.test(pc.ip) && noConflict) }
        ];
      }
    },
    {
      level: 3,
      title: 'Smart Home Wi-Fi & CCTV',
      badge: 'Menengah · 12 Perangkat',
      brief: 'Bangun jaringan rumah pintar: Modem → Router → Switch → Access Point, lalu sambungkan Laptop, IP Camera, dan NVR.',
      unlockReward: '🔓 Membuka Network Printer',
      allowedDevices: ['modem', 'router', 'switch', 'ap', 'pc', 'laptop', 'tablet', 'phone', 'tv', 'camera', 'iot', 'nvr'],
      check() {
        const ns = getNodesWithCfg();
        const hasDevices = ['modem', 'router', 'ap', 'laptop', 'camera', 'nvr'].every(t => ns.some(n => n.type === t));
        return [
          { label: 'Modem, Router, AP, Laptop, Camera & NVR terpasang', ok: hasDevices },
          { label: 'Laptop ↔ Router & Camera ↔ NVR terhubung', ok: hasPath('laptop', 'router') && hasPath('camera', 'nvr') },
          { label: 'Semua perangkat online', ok: allNodesOnline() }
        ];
      }
    },
    {
      level: 4,
      title: 'Kantor Modern & Network Printer',
      badge: 'Menengah · 14 Perangkat',
      brief: 'Rakit jaringan kantor lengkap: Modem → Router → Switch → PC, Server (192.168.10.10), dan Network Printer (192.168.10.*).',
      unlockReward: '🔓 Membuka Tantangan VLAN & Switch Trunk',
      allowedDevices: ['modem', 'router', 'switch', 'ap', 'pc', 'laptop', 'tablet', 'phone', 'tv', 'camera', 'iot', 'nvr', 'server', 'printer'],
      check() {
        const ns = getNodesWithCfg();
        const srv = ns.find(n => n.type === 'server');
        const pr = ns.find(n => n.type === 'printer');
        return [
          { label: 'Modem ↔ Router ↔ Switch ↔ PC, Server & Printer', ok: hasPath('modem', 'router') && hasPath('pc', 'server') && hasPath('printer', 'switch') },
          { label: 'IP Server = 192.168.10.10', ok: srv?.ip === '192.168.10.10' },
          { label: 'IP Printer di subnet 192.168.10.*', ok: Boolean(pr && /^192\.168\.10\.\d{1,3}$/.test(pr.ip)) }
        ];
      }
    },
    {
      level: 5,
      title: 'Segmentasi VLAN 10/20 & Trunk',
      badge: 'Lanjutan · VLAN Lab',
      brief: 'Pasang Router, Switch, dan minimal 4 PC. Atur 2 PC ke VLAN 10, 2 PC ke VLAN 20, dan Switch ke mode trunk (VLAN 10,20). Coba nyalakan 🩻 X-Ray → VLAN!',
      unlockReward: '🔓 Membuka 🛡️ Firewall Enterprise (Semua 15 Perangkat!)',
      allowedDevices: ['modem', 'router', 'switch', 'ap', 'pc', 'laptop', 'server', 'printer'],
      check() {
        const ns = getNodesWithCfg();
        const v10 = ns.filter(n => n.type === 'pc' && String(n.vlan) === '10').length;
        const v20 = ns.filter(n => n.type === 'pc' && String(n.vlan) === '20').length;
        const sw = ns.find(n => n.type === 'switch');
        const swV = String(sw?.vlan || '').replace(/\s+/g, '').split(',');
        const trunkOk = Boolean(sw && sw.iface === 'trunk' && swV.includes('10') && swV.includes('20'));
        return [
          { label: `Minimal 4 PC terhubung ke Router (${ns.filter(n => n.type === 'pc').length}/4)`, ok: ns.filter(n => n.type === 'pc').length >= 4 && hasPath('pc', 'router') },
          { label: `VLAN 10 (${v10}/2 PC) & VLAN 20 (${v20}/2 PC)`, ok: v10 >= 2 && v20 >= 2 },
          { label: 'Switch mode trunk dengan VLAN 10,20', ok: trunkOk }
        ];
      }
    },
    {
      level: 6,
      title: 'Keamanan DMZ, Firewall ACL & Web',
      badge: 'Master · Semua 15 Perangkat',
      brief: 'Bangun jaringan aman: Modem → Router → Firewall → Switch → PC & Server (192.168.10.10). Atur Firewall ACL: HTTP(80) & HTTPS(443) ALLOW, SSH(22) DENY!',
      unlockReward: '🏆 Gelar Master Network Architect',
      allowedDevices: null, // All 15 unlocked!
      check() {
        const ns = getNodesWithCfg();
        const srv = ns.find(n => n.type === 'server');
        const fw = loadFwRules();
        return [
          { label: 'Jalur Modem ↔ Router ↔ Firewall ↔ Switch ↔ PC & Server', ok: hasPath('modem', 'router') && hasPath('router', 'firewall') && hasPath('firewall', 'switch') && hasPath('pc', 'server') },
          { label: 'IP Server = 192.168.10.10', ok: srv?.ip === '192.168.10.10' },
          { label: 'Firewall ACL: 80/443 ALLOW & SSH(22) DENY', ok: fw[80] === 'allow' && fw[443] === 'allow' && fw[22] === 'deny' }
        ];
      }
    }
  ];

  // --- Progressive Inventory Filtering ---
  function applyInventoryFilter() {
    const list = $('nf400List');
    if (!list) return;
    let notice = $('nf71InvNotice');
    if (!notice && list.parentElement) {
      notice = document.createElement('div');
      notice.id = 'nf71InvNotice';
      list.parentElement.insertBefore(notice, list);
    }
    const allowedSet = Array.isArray(activeRestriction) && activeRestriction.length
      ? new Set(activeRestriction)
      : null;

    list.querySelectorAll('button.nf400-device').forEach(btn => {
      const t = btn.dataset.type || '';
      const hide = Boolean(allowedSet && !allowedSet.has(t));
      btn.classList.toggle('nf71-locked', hide);
    });

    if (notice) {
      if (allowedSet) {
        notice.textContent = activeRestrictionLabel || `🔓 Inventori fokus: ${allowedSet.size} perangkat aktif`;
        notice.classList.add('show');
      } else {
        notice.classList.remove('show');
      }
    }
  }

  function setAllowedDevices(listOrNull, label) {
    activeRestriction = Array.isArray(listOrNull) && listOrNull.length ? [...listOrNull] : null;
    activeRestrictionLabel = label || '';
    applyInventoryFilter();
  }

  // --- Campaign Level HUD & Execution ---
  function ensureHud() {
    if ($('nf71LevelHud')) return $('nf71LevelHud');
    const bar = document.createElement('div');
    bar.id = 'nf71LevelHud';
    bar.innerHTML = `
      <div class="nf71-hud-left">
        <strong id="nf71HudTitle">🎯 Level</strong>
        <small id="nf71HudBrief"></small>
      </div>
      <div class="nf71-hud-checks" id="nf71HudChecks"></div>
      <div class="nf71-hud-right">
        <button type="button" class="nf60-btn primary" id="nf71CheckBtn">✅ Cek Selesai</button>
        <button type="button" class="nf60-btn danger" id="nf71ExitBtn">✕ Keluar</button>
      </div>`;
    const anchor = document.querySelector('#nf400Modebar') || document.querySelector('.workspace-shell');
    if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(bar, anchor.nextSibling);
    else document.body.prepend(bar);
    bar.querySelector('#nf71CheckBtn').addEventListener('click', () => evaluateLevel(true));
    bar.querySelector('#nf71ExitBtn').addEventListener('click', stopLevel);
    return bar;
  }

  function stopLevel() {
    if (activeLevel?.timerId) clearInterval(activeLevel.timerId);
    activeLevel = null;
    const hud = $('nf71LevelHud');
    if (hud) hud.classList.remove('active');
    setAllowedDevices(null, '');
  }

  function startLevel(levelNum) {
    const lv = LEVELS.find(x => x.level === levelNum);
    if (!lv) return;
    stopLevel();

    const dlg = $('nf372MissionDialog');
    if (dlg) dlg.hidden = true;
    const intro = $('nf322Overlay');
    if (intro) intro.hidden = true;
    const home = $('nf322Home');
    if (home) home.hidden = false;
    const startModal = $('startModal');
    if (startModal) startModal.classList.remove('open');
    const modal = $('nf71Modal');
    if (modal) modal.classList.remove('open');

    const api = API();
    try {
      api?.setMode?.('mixed');
      api?.resetCanvas?.();
    } catch (_) {}

    if (lv.allowedDevices) {
      setAllowedDevices(lv.allowedDevices, `🔓 Level ${lv.level}: ${lv.allowedDevices.length}/15 perangkat aktif`);
    } else {
      setAllowedDevices(null, '');
    }

    const hud = ensureHud();
    $('nf71HudTitle').textContent = `🎯 Level ${lv.level} — ${lv.title}`;
    $('nf71HudBrief').textContent = lv.brief;
    hud.classList.add('active');

    activeLevel = {
      levelObj: lv,
      timerId: setInterval(() => evaluateLevel(false), 1200)
    };
    evaluateLevel(false);
  }

  function evaluateLevel(manualClick) {
    if (!activeLevel) return;
    const lv = activeLevel.levelObj;
    const checks = lv.check();
    const box = $('nf71HudChecks');
    if (box) {
      box.innerHTML = checks.map(c => `<span class="nf71-chk ${c.ok ? 'ok' : ''}">${c.ok ? '✅' : '⬜'} ${c.label}</span>`).join('');
    }
    if (checks.length && checks.every(c => c.ok)) {
      stopLevel();
      const prog = loadProgress();
      prog.completed[lv.level] = true;
      if (lv.level >= prog.unlockedLevel && lv.level < LEVELS.length) {
        prog.unlockedLevel = lv.level + 1;
      }
      saveProgress(prog);
      window.NetForgeAlive?.SFX?.victory?.();
      showLevelCompleteModal(lv, prog);
    } else if (manualClick) {
      const rem = checks.filter(c => !c.ok).map(c => c.label).join(' · ');
      window.netforgeIgaSay?.('Sedikit lagi! Cek: ' + rem, 'think');
    }
  }

  function ensureModal() {
    if ($('nf71Modal')) return $('nf71Modal');
    const m = document.createElement('div');
    m.id = 'nf71Modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.innerHTML = `
      <div class="nf64-dialog" style="width:min(700px,96vw);">
        <div class="nf64-head">
          <h3>🗺️ Jalur Misi Bertingkat (Level 1–6 · Progressive Unlock)</h3>
          <button type="button" class="nf60-btn" id="nf71ModalClose">✕ Tutup</button>
        </div>
        <div class="nf64-body" id="nf71ModalBody"></div>
      </div>`;
    document.body.appendChild(m);
    m.querySelector('#nf71ModalClose').addEventListener('click', () => m.classList.remove('open'));
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) m.classList.remove('open'); });
    return m;
  }

  function showLevelCompleteModal(lv, prog) {
    const m = ensureModal();
    const nextLv = LEVELS.find(x => x.level === lv.level + 1);
    const body = m.querySelector('#nf71ModalBody');
    body.innerHTML = `
      <div class="nf64-badge ok" style="font-size:13.5px;">
        🏆 <b>LEVEL ${lv.level} SELESAI — ${lv.title}!</b><br>
        ${lv.unlockReward}
      </div>
      <div style="font-size:12.5px;color:#CBD5E1;line-height:1.5;">
        Progres tersimpan otomatis (${Object.keys(prog.completed).length}/${LEVELS.length} level tuntas). Di <b>Free Lab Terpadu</b> &amp; <b>Mode Ujian</b>, seluruh 15 perangkat tetap terbuka bebas.
      </div>
      <div class="nf60-row-actions" style="justify-content:flex-end;">
        <button type="button" class="nf60-btn" id="nf71AllLevelsBtn">📋 Lihat Semua Level</button>
        ${nextLv ? `<button type="button" class="nf60-btn primary" id="nf71NextLvBtn">➡️ Lanjut ke Level ${nextLv.level}: ${nextLv.title}</button>` : ''}
      </div>`;
    body.querySelector('#nf71AllLevelsBtn').addEventListener('click', openCampaignModal);
    body.querySelector('#nf71NextLvBtn')?.addEventListener('click', () => startLevel(nextLv.level));
    m.classList.add('open');
  }

  function openCampaignModal() {
    const m = ensureModal();
    const prog = loadProgress();
    const doneCount = Object.keys(prog.completed).length;
    const body = m.querySelector('#nf71ModalBody');
    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;color:#94A3B8;">
        <span>Selesaikan tiap level untuk membuka perangkat baru secara bertahap. <b>Free Lab</b> &amp; <b>Ujian</b> tetap bebas 15 perangkat.</span>
        <span class="nf60-pill ok">Progres: ${doneCount}/${LEVELS.length} Level</span>
      </div>
      <div class="nf71-grid">
        ${LEVELS.map(lv => {
          const isDone = Boolean(prog.completed[lv.level]);
          const isUnlocked = lv.level <= (prog.unlockedLevel || 1) || isDone;
          return `
            <div class="nf71-card ${isDone ? 'done' : ''} ${isUnlocked ? '' : 'locked'}">
              <div class="nf71-card-top">
                <span>LEVEL ${lv.level} · ${lv.badge}</span>
                <span>${isDone ? '✅ Tuntas' : isUnlocked ? '🔓 Terbuka' : '🔒 Terkunci'}</span>
              </div>
              <strong>${lv.title}</strong>
              <p>${lv.brief}</p>
              <div class="nf71-unlock-tag">${lv.unlockReward}</div>
              <button type="button" class="nf60-btn ${isUnlocked ? 'primary' : ''}" data-start-lv="${lv.level}" ${isUnlocked ? '' : 'disabled'}>
                ${isDone ? '↺ Mainkan Ulang' : isUnlocked ? '▶ Mulai Level ' + lv.level : '🔒 Selesaikan Level ' + (lv.level - 1)}
              </button>
            </div>`;
        }).join('')}
      </div>`;
    body.querySelectorAll('[data-start-lv]').forEach(b => {
      b.addEventListener('click', () => startLevel(Number(b.dataset.startLv)));
    });
    m.classList.add('open');
  }

  function injectEntries() {
    let okMode = false;
    let okPicker = false;
    const modebar = $('nf400Modebar');
    if (modebar) {
      if (!$('nf71ModebarBtn')) {
        const b = document.createElement('button');
        b.id = 'nf71ModebarBtn';
        b.type = 'button';
        b.textContent = '🎯 Level 1–6';
        b.title = 'Jalur Misi Bertingkat dengan Progressive Unlock Perangkat';
        b.addEventListener('click', openCampaignModal);
        const dailyBtn = $('nf69ModebarDaily') || $('nf400Mixed');
        if (dailyBtn && dailyBtn.parentElement === modebar) modebar.insertBefore(b, dailyBtn);
        else modebar.appendChild(b);
      }
      okMode = true;
    }

    const grid = document.querySelector('#nf372MissionDialog .nf372-mission-grid');
    if (grid) {
      if (!$('nf71PickerCampaign')) {
        const prog = loadProgress();
        const card = document.createElement('button');
        card.id = 'nf71PickerCampaign';
        card.type = 'button';
        card.className = 'nf372-choice nf71-picker-card';
        card.innerHTML = `<span class="nf372-chip">Karir · Lv ${prog.unlockedLevel || 1}/6</span><strong>🎯 Jalur Misi Bertingkat (Level 1–6)</strong><small>Belajar runtut dari LAN Dasar, Subnetting, Smart Home, Printer, VLAN Trunk, hingga Firewall DMZ dengan Progressive Unlock.</small>`;
        card.addEventListener('click', openCampaignModal);
        grid.prepend(card);
      }
      okPicker = true;
    }

    // Re-apply inventory filter whenever #nf400List re-renders
    const invList = $('nf400List');
    if (invList && !invList.__nf71Bound) {
      invList.__nf71Bound = true;
      new MutationObserver(() => {
        if (activeRestriction) applyInventoryFilter();
      }).observe(invList, { childList: true });
    }

    // Clear level restriction if player clicks Free Lab Terpadu
    const freeBtn = $('nf400Mixed');
    if (freeBtn && !freeBtn.__nf71Bound) {
      freeBtn.__nf71Bound = true;
      freeBtn.addEventListener('click', () => {
        if (activeLevel) stopLevel();
      });
    }

    return okMode && okPicker;
  }

  window.NetForgeCampaign = {
    version: '0.71.0',
    open: openCampaignModal,
    startLevel,
    stopLevel,
    setAllowedDevices,
    levels: LEVELS
  };

  let tries = 0;
  (function boot() {
    if (injectEntries() || ++tries > 30) return;
    setTimeout(boot, 350);
  })();
})();
