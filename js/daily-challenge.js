/* NET FORGE v0.69.0 — Tantangan Troubleshooting Harian (Daily Challenge + Streak) */
(function () {
  'use strict';
  if (window.__NF6900_DAILY) return;
  window.__NF6900_DAILY = true;

  const STORE_KEY = 'netforge.dailyChallenge.v1';
  const FW_KEY = 'netforge.firewallAcl.v1';
  const $ = id => document.getElementById(id);
  const API = () => window.NetForgeUniversalInventory || null;

  function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function dateHash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function loadStore() {
    try {
      return Object.assign({ streak: 0, lastSolvedDate: '', solvedDates: {}, bestTimes: {} }, JSON.parse(localStorage.getItem(STORE_KEY) || '{}'));
    } catch (_) {
      return { streak: 0, lastSolvedDate: '', solvedDates: {}, bestTimes: {} };
    }
  }

  function saveStore(st) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); } catch (_) {}
  }

  function loadFwRules() {
    try {
      return Object.assign({ 80: 'allow', 443: 'allow', 22: 'deny', 53: 'allow' }, JSON.parse(localStorage.getItem(FW_KEY) || '{}'));
    } catch (_) {
      return { 80: 'allow', 443: 'allow', 22: 'deny', 53: 'allow' };
    }
  }

  function saveFwRules(rules) {
    try { localStorage.setItem(FW_KEY, JSON.stringify(rules)); } catch (_) {}
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

  function hasActivePath(typeA, typeB) {
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

  // 6 Handcrafted Real-World Daily Troubleshooting Scenarios
  const SCENARIOS = [
    {
      id: 'dc_backbone_cut',
      title: 'Kabel Backbone Kantor Terputus',
      difficulty: 'Normal',
      brief: 'Kabel utama kantor rusak! Sambungkan kembali Modem ISP → Router → Switch → PC & Server hingga seluruh jalur aktif dan uji Ping berhasil.',
      graph: {
        nodes: [
          { id: 1, type: 'modem', name: 'Modem ISP', x: 14, y: 24 },
          { id: 2, type: 'router', name: 'Router Utama', x: 38, y: 24, ip: '192.168.10.1' },
          { id: 3, type: 'switch', name: 'Switch Inti', x: 64, y: 24 },
          { id: 4, type: 'pc', name: 'PC Kasir', x: 40, y: 68, ip: '192.168.10.20', gateway: '192.168.10.1' },
          { id: 5, type: 'server', name: 'Server Aplikasi', x: 70, y: 68, ip: '192.168.10.10', gateway: '192.168.10.1' }
        ],
        edges: [],
        nextId: 6,
        spent: 770
      },
      check() {
        return [
          { label: 'Modem ISP ↔ Router aktif', ok: hasActivePath('modem', 'router') },
          { label: 'Router ↔ Switch aktif', ok: hasActivePath('router', 'switch') },
          { label: 'PC Kasir ↔ Server Aplikasi aktif', ok: hasActivePath('pc', 'server') }
        ];
      }
    },
    {
      id: 'dc_ip_conflict',
      title: 'Darurat Konflik IP di Ruang Server',
      difficulty: 'Normal',
      brief: 'PC Admin dan Server sama-sama memakai IP 192.168.10.10! Hubungkan jaringan lalu ubah IP PC Admin menjadi unik di subnet 192.168.10.* (selain .1 dan .10).',
      graph: {
        nodes: [
          { id: 1, type: 'router', name: 'Router Gateway', x: 24, y: 24, ip: '192.168.10.1' },
          { id: 2, type: 'switch', name: 'Switch LAN', x: 52, y: 24 },
          { id: 3, type: 'pc', name: 'PC Admin', x: 34, y: 68, ip: '192.168.10.10', gateway: '192.168.10.1' },
          { id: 4, type: 'server', name: 'Server Utama', x: 68, y: 68, ip: '192.168.10.10', gateway: '192.168.10.1' }
        ],
        edges: [],
        nextId: 5,
        spent: 660
      },
      check() {
        const ns = getNodesWithCfg();
        const pc = ns.find(n => n.type === 'pc');
        const srv = ns.find(n => n.type === 'server');
        const ips = ns.map(n => n.ip).filter(Boolean);
        const noDup = new Set(ips).size === ips.length;
        const pcSub = Boolean(pc && /^192\.168\.10\.\d{1,3}$/.test(pc.ip) && pc.ip !== '192.168.10.1' && pc.ip !== '192.168.10.10');
        return [
          { label: 'Jalur Router ↔ Switch ↔ PC & Server aktif', ok: hasActivePath('router', 'pc') && hasActivePath('pc', 'server') },
          { label: 'Bebas konflik IP (tidak ada IP kembar)', ok: noDup && Boolean(srv?.ip) },
          { label: 'IP PC Admin unik di subnet 192.168.10.*', ok: pcSub }
        ];
      }
    },
    {
      id: 'dc_firewall_http',
      title: 'Portal Web Diblokir Firewall!',
      difficulty: 'Menengah',
      brief: 'Karyawan tidak bisa membuka portal web kantor (HTTP Port 80)! Sambungkan jalur lewat Firewall, lalu buka tab 🛡️ Firewall ACL di Kalkulator IP/CLI dan ubah Port 80 (HTTP) ke ALLOW serta pastikan Port 22 (SSH) tetap DENY.',
      setup() {
        const fw = loadFwRules();
        fw[80] = 'deny';
        fw[22] = 'deny';
        saveFwRules(fw);
      },
      graph: {
        nodes: [
          { id: 1, type: 'router', name: 'Router', x: 18, y: 24, ip: '192.168.10.1' },
          { id: 2, type: 'firewall', name: 'Firewall Kantor', x: 44, y: 24, ip: '192.168.10.2' },
          { id: 3, type: 'switch', name: 'Switch', x: 70, y: 24 },
          { id: 4, type: 'pc', name: 'PC Karyawan', x: 38, y: 68, ip: '192.168.10.25', gateway: '192.168.10.1' },
          { id: 5, type: 'server', name: 'Web Server', x: 70, y: 68, ip: '192.168.10.10', gateway: '192.168.10.1' }
        ],
        edges: [],
        nextId: 6,
        spent: 880
      },
      check() {
        const fw = loadFwRules();
        return [
          { label: 'Jalur PC ↔ Firewall ↔ Web Server aktif', ok: hasActivePath('pc', 'firewall') && hasActivePath('firewall', 'server') },
          { label: 'Firewall ACL: Port 80 (HTTP) = ALLOW', ok: fw[80] === 'allow' },
          { label: 'Firewall ACL: Port 22 (SSH) = DENY (aman)', ok: fw[22] === 'deny' }
        ];
      }
    },
    {
      id: 'dc_vlan_trunk',
      title: 'Switch Trunk VLAN 10 & 20 Hilang',
      difficulty: 'Menengah',
      brief: 'Switch lab belum diatur mode Trunk! Sambungkan Router → Switch → 2 PC, atur 1 PC ke VLAN 10, 1 PC ke VLAN 20, dan atur Switch ke mode trunk dengan VLAN 10,20.',
      graph: {
        nodes: [
          { id: 1, type: 'router', name: 'Router', x: 24, y: 24, ip: '192.168.10.1' },
          { id: 2, type: 'switch', name: 'Switch Lab', x: 54, y: 24 },
          { id: 3, type: 'pc', name: 'PC Admin', x: 36, y: 68, ip: '192.168.10.11', vlan: '10' },
          { id: 4, type: 'pc', name: 'PC Staff', x: 68, y: 68, ip: '192.168.10.21', vlan: '20' }
        ],
        edges: [],
        nextId: 5,
        spent: 510
      },
      check() {
        const ns = getNodesWithCfg();
        const sw = ns.find(n => n.type === 'switch');
        const swVlans = String(sw?.vlan || '').replace(/\s+/g, '').split(',');
        const trunkOk = Boolean(sw && sw.iface === 'trunk' && swVlans.includes('10') && swVlans.includes('20'));
        const has10 = ns.some(n => n.type === 'pc' && String(n.vlan) === '10');
        const has20 = ns.some(n => n.type === 'pc' && String(n.vlan) === '20');
        return [
          { label: 'Jalur Router ↔ Switch ↔ PC aktif', ok: hasActivePath('router', 'switch') && hasActivePath('switch', 'pc') },
          { label: 'PC Admin (VLAN 10) & PC Staff (VLAN 20)', ok: has10 && has20 },
          { label: 'Switch mode trunk dengan VLAN 10,20', ok: trunkOk }
        ];
      }
    },
    {
      id: 'dc_printer_offline',
      title: 'Network Printer Hilang dari Jaringan',
      difficulty: 'Mudah',
      brief: 'Printer kantor tidak bisa diakses dari PC! Sambungkan Switch ↔ Network Printer & PC, lalu atur IP Printer di subnet 192.168.10.* (mis. 192.168.10.50).',
      graph: {
        nodes: [
          { id: 1, type: 'router', name: 'Router', x: 22, y: 24, ip: '192.168.10.1' },
          { id: 2, type: 'switch', name: 'Switch', x: 52, y: 24 },
          { id: 3, type: 'pc', name: 'PC Frontdesk', x: 34, y: 68, ip: '192.168.10.15', gateway: '192.168.10.1' },
          { id: 4, type: 'printer', name: 'Printer Kantor', x: 68, y: 68 }
        ],
        edges: [],
        nextId: 5,
        spent: 500
      },
      check() {
        const ns = getNodesWithCfg();
        const pr = ns.find(n => n.type === 'printer');
        const ipOk = Boolean(pr && /^192\.168\.10\.\d{1,3}$/.test(pr.ip) && pr.ip !== '192.168.10.1' && pr.ip !== '192.168.10.15');
        return [
          { label: 'Router ↔ Switch aktif', ok: hasActivePath('router', 'switch') },
          { label: 'PC Frontdesk ↔ Printer Kantor aktif', ok: hasActivePath('pc', 'printer') },
          { label: 'IP Printer Kantor di subnet 192.168.10.*', ok: ipOk }
        ];
      }
    },
    {
      id: 'dc_https_hardening',
      title: 'Hardening Keamanan Server HTTPS',
      difficulty: 'Menengah',
      brief: 'Amankan jalur ke Web Server: hubungkan Router → Firewall → Switch → PC & Server (IP 192.168.10.10), izinkan HTTPS (443) & DNS (53), dan blokir SSH (22).',
      setup() {
        const fw = loadFwRules();
        fw[443] = 'deny';
        fw[22] = 'allow';
        fw[53] = 'allow';
        saveFwRules(fw);
      },
      graph: {
        nodes: [
          { id: 1, type: 'router', name: 'Router', x: 18, y: 24, ip: '192.168.10.1' },
          { id: 2, type: 'firewall', name: 'Firewall DMZ', x: 44, y: 24, ip: '192.168.10.2' },
          { id: 3, type: 'switch', name: 'Switch', x: 70, y: 24 },
          { id: 4, type: 'pc', name: 'PC Audit', x: 36, y: 68, ip: '192.168.10.30', gateway: '192.168.10.1' },
          { id: 5, type: 'server', name: 'Server HTTPS', x: 70, y: 68, ip: '192.168.10.10', gateway: '192.168.10.1' }
        ],
        edges: [],
        nextId: 6,
        spent: 880
      },
      check() {
        const fw = loadFwRules();
        const srv = getNodesWithCfg().find(n => n.type === 'server');
        return [
          { label: 'Jalur PC ↔ Firewall ↔ Server aktif', ok: hasActivePath('pc', 'firewall') && hasActivePath('firewall', 'server') },
          { label: 'IP Server = 192.168.10.10', ok: srv?.ip === '192.168.10.10' },
          { label: 'Firewall: HTTPS (443) ALLOW & SSH (22) DENY', ok: fw[443] === 'allow' && fw[22] === 'deny' }
        ];
      }
    }
  ];

  let activeDaily = null; // { scenario, dateKey, startedAt, timerId, isToday }

  function formatMMSS(sec) {
    const s = Math.max(0, Math.floor(sec));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function getTodayScenario() {
    const key = todayStr();
    const idx = dateHash('NF69_DAILY_' + key) % SCENARIOS.length;
    return { key, scenario: SCENARIOS[idx] };
  }

  function ensureHud() {
    if ($('nf69DailyHud')) return $('nf69DailyHud');
    const bar = document.createElement('div');
    bar.id = 'nf69DailyHud';
    bar.innerHTML = `
      <div class="nf69-hud-left">
        <strong id="nf69HudTitle">📅 Tantangan Harian</strong>
        <small id="nf69HudBrief"></small>
      </div>
      <div class="nf69-hud-checks" id="nf69HudChecks"></div>
      <div class="nf69-hud-right">
        <span id="nf69Clock">00:00</span>
        <button type="button" class="nf60-btn primary" id="nf69VerifyBtn">✅ Cek Hasil</button>
        <button type="button" class="nf60-btn danger" id="nf69ExitBtn">✕ Keluar</button>
      </div>`;
    const anchor = document.querySelector('#nf400Modebar') || document.querySelector('.workspace-shell');
    if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(bar, anchor.nextSibling);
    else document.body.prepend(bar);
    bar.querySelector('#nf69VerifyBtn').addEventListener('click', () => evaluateDaily(true));
    bar.querySelector('#nf69ExitBtn').addEventListener('click', stopDaily);
    return bar;
  }

  function stopDaily() {
    if (activeDaily?.timerId) clearInterval(activeDaily.timerId);
    activeDaily = null;
    const hud = $('nf69DailyHud');
    if (hud) hud.classList.remove('active');
  }

  function startDaily(scenario, dateKey, isToday) {
    stopDaily();
    const api = API();
    if (api?.setMode) api.setMode('mixed');
    if (typeof scenario.setup === 'function') scenario.setup();
    if (api?.importGraph && scenario.graph) {
      api.importGraph(structuredClone(scenario.graph));
    }
    const modal = $('nf69DailyModal');
    if (modal) modal.classList.remove('open');

    const hud = ensureHud();
    $('nf69HudTitle').textContent = `📅 Daily #${dateKey} — ${scenario.title}`;
    $('nf69HudBrief').textContent = scenario.brief;
    hud.classList.add('active');

    activeDaily = {
      scenario,
      dateKey,
      isToday: Boolean(isToday),
      startedAt: Date.now(),
      timerId: setInterval(() => {
        if (!activeDaily) return;
        const sec = (Date.now() - activeDaily.startedAt) / 1000;
        if ($('nf69Clock')) $('nf69Clock').textContent = formatMMSS(sec);
        evaluateDaily(false);
      }, 1000)
    };
    evaluateDaily(false);
  }

  function evaluateDaily(manualClick) {
    if (!activeDaily) return;
    const checks = activeDaily.scenario.check();
    const box = $('nf69HudChecks');
    if (box) {
      box.innerHTML = checks.map(c => `<span class="nf69-chk ${c.ok ? 'ok' : ''}">${c.ok ? '✅' : '⬜'} ${c.label}</span>`).join('');
    }
    const allOk = checks.length > 0 && checks.every(c => c.ok);
    if (allOk) {
      const elapsed = Math.max(1, Math.round((Date.now() - activeDaily.startedAt) / 1000));
      const finished = activeDaily;
      stopDaily();
      completeDaily(finished, elapsed);
    } else if (manualClick) {
      const rem = checks.filter(c => !c.ok).map(c => c.label).join(' · ');
      window.netforgeIgaSay?.('Belum semua beres! Periksa: ' + rem, 'think');
    }
  }

  function completeDaily(session, elapsedSec) {
    const st = loadStore();
    const key = session.dateKey;
    const alreadySolved = Boolean(st.solvedDates[key]);
    if (session.isToday && !alreadySolved) {
      const yest = new Date(Date.now() - 86400000);
      const yKey = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
      st.streak = st.lastSolvedDate === yKey ? (st.streak || 0) + 1 : 1;
      st.lastSolvedDate = key;
      st.solvedDates[key] = elapsedSec;
      if (!st.bestTimes[session.scenario.id] || elapsedSec < st.bestTimes[session.scenario.id]) {
        st.bestTimes[session.scenario.id] = elapsedSec;
      }
      saveStore(st);
    }
    window.NetForgeAlive?.SFX?.victory?.();
    const shareTxt = `NET FORGE Daily #${key} (${session.scenario.title}) ✅ Selesai dalam ${formatMMSS(elapsedSec)} · 🔥 Streak ${st.streak || 1} hari! #NetForge`;

    const m = ensureModal();
    const body = m.querySelector('#nf69ModalBody');
    body.innerHTML = `
      <div class="nf64-badge ok" style="font-size:13.5px;">
        🏆 <b>TANTANGAN HARIAN SELESAI!</b><br>
        ${session.scenario.title} berhasil diperbaiki dalam <b>${formatMMSS(elapsedSec)}</b>!<br>
        🔥 Streak Harian: <b>${st.streak || 1} hari</b>${alreadySolved ? ' (Sudah diselesaikan hari ini)' : ' · +150 XP Bonus!'}
      </div>
      <div style="font-size:12px;color:#94A3B8;margin-top:6px;">Bagikan pencapaianmu ke Threads atau grup kelas:</div>
      <pre id="nf69ShareBox" style="background:#040B16;border:1px solid rgba(34,211,238,0.35);border-radius:8px;padding:10px;font-size:12px;color:#BAE6FD;white-space:pre-wrap;margin:4px 0;">${shareTxt}</pre>
      <div class="nf60-row-actions" style="justify-content:flex-end;">
        <button type="button" class="nf60-btn accent" id="nf69CopyShare">📋 Salin Teks Bagikan</button>
        <button type="button" class="nf60-btn primary" id="nf69PlayOther">🎲 Coba Kasus Acak Lainnya</button>
      </div>`;
    body.querySelector('#nf69CopyShare').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareTxt);
        body.querySelector('#nf69CopyShare').textContent = '✓ Tersalin!';
      } catch (_) {}
    });
    body.querySelector('#nf69PlayOther').addEventListener('click', () => {
      const others = SCENARIOS.filter(s => s.id !== session.scenario.id);
      const pick = others[Math.floor(Math.random() * others.length)] || SCENARIOS[0];
      startDaily(pick, 'LATIHAN', false);
    });
    m.classList.add('open');
  }

  function ensureModal() {
    if ($('nf69DailyModal')) return $('nf69DailyModal');
    const m = document.createElement('div');
    m.id = 'nf69DailyModal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.innerHTML = `
      <div class="nf64-dialog" style="width:min(580px,95vw);">
        <div class="nf64-head">
          <h3>📅 Tantangan Troubleshooting Harian</h3>
          <button type="button" class="nf60-btn" id="nf69ModalClose">✕ Tutup</button>
        </div>
        <div class="nf64-body" id="nf69ModalBody"></div>
      </div>`;
    document.body.appendChild(m);
    m.querySelector('#nf69ModalClose').addEventListener('click', () => m.classList.remove('open'));
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) m.classList.remove('open'); });
    return m;
  }

  function openDailyModal() {
    const m = ensureModal();
    const { key, scenario } = getTodayScenario();
    const st = loadStore();
    const solvedTime = st.solvedDates[key];
    const body = m.querySelector('#nf69ModalBody');
    body.innerHTML = `
      <div class="nf64-grid">
        <div class="nf64-stat"><small>Tanggal Seed</small><strong>${key}</strong></div>
        <div class="nf64-stat"><small>Daily Streak</small><strong>🔥 ${st.streak || 0} Hari</strong></div>
      </div>
      <div class="nf60-box">
        <div class="nf60-box-title">Kasus Hari Ini · Tingkat ${scenario.difficulty}</div>
        <strong style="font-size:15px;color:#fff;display:block;margin-bottom:5px;">${scenario.title}</strong>
        <p style="margin:0;font-size:12.5px;color:#CBD5E1;line-height:1.45;">${scenario.brief}</p>
      </div>
      ${solvedTime ? `<div class="nf64-badge ok">✅ Anda sudah menyelesaikan tantangan hari ini dalam <b>${formatMMSS(solvedTime)}</b>! Anda tetap bisa mengulang atau mencoba kasus acak lainnya.</div>` : ''}
      <div class="nf60-row-actions" style="justify-content:flex-end;">
        <button type="button" class="nf60-btn" id="nf69RandomBtn">🎲 Kasus Acak Lainnya</button>
        <button type="button" class="nf60-btn primary" id="nf69StartToday">🚀 Mulai Tantangan Hari Ini</button>
      </div>`;
    body.querySelector('#nf69StartToday').addEventListener('click', () => startDaily(scenario, key, true));
    body.querySelector('#nf69RandomBtn').addEventListener('click', () => {
      const pick = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
      startDaily(pick, 'LATIHAN', false);
    });
    m.classList.add('open');
  }

  function injectButton() {
    const tabs = document.querySelector('#nf43DrawerBar .nf43-tabs');
    if (!tabs || $('nf69DailyBtn')) return Boolean($('nf69DailyBtn'));
    const b = document.createElement('button');
    b.id = 'nf69DailyBtn';
    b.type = 'button';
    b.textContent = '📅 Harian';
    b.title = 'Tantangan Troubleshooting Harian (1 kasus jaringan rusak baru setiap hari)';
    b.addEventListener('click', openDailyModal);
    tabs.appendChild(b);
    return true;
  }

  window.NetForgeDailyChallenge = {
    version: '0.69.0',
    open: openDailyModal,
    stop: stopDaily
  };

  let tries = 0;
  (function boot() {
    if (injectButton() || ++tries > 24) return;
    setTimeout(boot, 350);
  })();
})();
