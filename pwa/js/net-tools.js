/* NET FORGE v0.71.1 — Utilitas Jaringan: Kalkulator IP/Subnet & Terminal CLI Ringan */
(function () {
  'use strict';
  if (window.__NF6400_NETTOOLS) return;
  window.__NF6400_NETTOOLS = true;

  const $ = id => document.getElementById(id);
  const API = () => window.NetForgeUniversalInventory || null;

  // --- Pure IPv4 Math Helpers ---
  function parseIPv4(str) {
    const parts = String(str || '').trim().split('.');
    if (parts.length !== 4) return null;
    let num = 0;
    for (const p of parts) {
      if (!/^\d+$/.test(p)) return null;
      const v = Number(p);
      if (v < 0 || v > 255) return null;
      num = ((num << 8) | v) >>> 0;
    }
    return num;
  }

  function intToIPv4(n) {
    const u = n >>> 0;
    return [(u >>> 24) & 255, (u >>> 16) & 255, (u >>> 8) & 255, u & 255].join('.');
  }

  function prefixToMask(prefix) {
    const p = Math.max(0, Math.min(32, Number(prefix) || 0));
    return p === 0 ? 0 : ((0xffffffff << (32 - p)) >>> 0);
  }

  function calcSubnet(ipStr, prefixRaw) {
    let ipPart = String(ipStr || '').trim();
    let pref = prefixRaw;
    if (ipPart.includes('/')) {
      const [a, b] = ipPart.split('/');
      ipPart = a.trim();
      if (b !== undefined && b.trim() !== '') pref = Number(b.trim());
    }
    const ipInt = parseIPv4(ipPart);
    const p = Number(pref);
    if (ipInt === null || !Number.isInteger(p) || p < 0 || p > 32) return null;

    const maskInt = prefixToMask(p);
    const wildInt = (~maskInt) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | wildInt) >>> 0;
    const totalAddrs = Math.pow(2, 32 - p);
    let usable = 0;
    let firstHost = '-';
    let lastHost = '-';
    if (p === 32) {
      usable = 1;
      firstHost = intToIPv4(ipInt);
      lastHost = firstHost;
    } else if (p === 31) {
      usable = 2;
      firstHost = intToIPv4(netInt);
      lastHost = intToIPv4(bcastInt);
    } else {
      usable = Math.max(0, totalAddrs - 2);
      firstHost = intToIPv4((netInt + 1) >>> 0);
      lastHost = intToIPv4((bcastInt - 1) >>> 0);
    }

    const firstOctet = (ipInt >>> 24) & 255;
    const secondOctet = (ipInt >>> 16) & 255;
    let ipClass = 'Kelas E (Eksperimen)';
    if (firstOctet <= 127) ipClass = firstOctet === 127 ? 'Loopback (127.0.0.0/8)' : 'Kelas A';
    else if (firstOctet <= 191) ipClass = 'Kelas B';
    else if (firstOctet <= 223) ipClass = 'Kelas C';
    else if (firstOctet <= 239) ipClass = 'Kelas D (Multicast)';

    const isPrivate =
      firstOctet === 10 ||
      (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) ||
      (firstOctet === 192 && secondOctet === 168);

    let role = 'Host Valid (Bisa dipakai perangkat)';
    let roleTone = 'ok';
    if (p <= 30 && ipInt === netInt) {
      role = '⚠️ Ini adalah Network Address (jangan dipasang ke PC/Router!)';
      roleTone = 'warn';
    } else if (p <= 30 && ipInt === bcastInt) {
      role = '⚠️ Ini adalah Broadcast Address (jangan dipasang ke PC/Router!)';
      roleTone = 'warn';
    }

    const bin32 = ipInt.toString(2).padStart(32, '0');
    const netBits = bin32.slice(0, p);
    const hostBits = bin32.slice(p);
    const fmtBin = (str, startIdx) => {
      let out = '';
      for (let i = 0; i < str.length; i++) {
        const gIdx = startIdx + i;
        if (gIdx > 0 && gIdx % 8 === 0) out += '.';
        out += str[i];
      }
      return out;
    };

    return {
      ip: intToIPv4(ipInt),
      prefix: p,
      mask: intToIPv4(maskInt),
      wildcard: intToIPv4(wildInt),
      network: intToIPv4(netInt),
      broadcast: intToIPv4(bcastInt),
      firstHost,
      lastHost,
      usable,
      ipClass: `${ipClass} · ${isPrivate ? 'IP Privat (RFC 1918)' : 'IP Publik / Khusus'}`,
      role,
      roleTone,
      netInt,
      binHtml: `<span class="net">${fmtBin(netBits, 0)}</span><span class="host">${fmtBin(hostBits, p)}</span>`
    };
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // --- Live Canvas Topology Helpers for CLI ---
  function getCanvasNodes() {
    const api = API();
    const raw = api?.getState?.()?.nodes || [];
    const classic = api?.classicView?.()?.nodes || [];
    const byId = new Map(classic.map(c => [String(c.id), c.config || {}]));
    return raw.map(n => {
      const cfg = byId.get(String(n.id)) || {};
      const idNum = Number(n.id) || 1;
      const macHex = idNum.toString(16).padStart(2, '0').toUpperCase();
      return {
        id: String(n.id),
        type: n.type,
        name: n.name || n.type,
        ip: (n.ip && String(n.ip).trim()) || cfg.ip || (n.type === 'router' ? '192.168.10.1' : ''),
        prefix: Number(String(cfg.prefix || '24').replace(/^\//, '')) || 24,
        gateway: (n.gateway && String(n.gateway).trim()) || cfg.gateway || '',
        mac: `02:4E:46:00:${(n.type || '00').slice(0, 2).toUpperCase().replace(/[^0-9A-F]/g, 'A').padStart(2, 'A')}:${macHex}`
      };
    });
  }

  function findPathNodes(srcId, dstId) {
    const api = API();
    const edges = (api?.getState?.()?.edges || []).filter(e => api?.isLinkActive?.(e));
    if (srcId === dstId) return [srcId];
    const q = [[srcId]];
    const seen = new Set([srcId]);
    while (q.length) {
      const path = q.shift();
      const cur = path[path.length - 1];
      for (const e of edges) {
        const a = String(e.a), b = String(e.b);
        const nxt = a === cur ? b : (b === cur ? a : null);
        if (!nxt || seen.has(nxt)) continue;
        const nextPath = [...path, nxt];
        if (nxt === dstId) return nextPath;
        seen.add(nxt);
        q.push(nextPath);
      }
    }
    return null;
  }

  // --- Modal UI ---

  // --- v0.71.1 Firewall ACL State & Port Filter Helpers ---
  const FW_KEY = 'netforge.firewallAcl.v1';
  const DEFAULT_FW = { 80: 'allow', 443: 'allow', 22: 'deny', 53: 'allow' };
  const FW_SERVICES = [
    { port: 80, proto: 'TCP', name: 'HTTP (Web Server)', desc: 'Akses halaman web standar (http://...)' },
    { port: 443, proto: 'TCP', name: 'HTTPS (Web Aman / TLS)', desc: 'Akses halaman web terenkripsi (https://...)' },
    { port: 22, proto: 'TCP', name: 'SSH (Remote Admin)', desc: 'Akses terminal jarak jauh ke Server/Router' },
    { port: 53, proto: 'UDP', name: 'DNS (Domain Name System)', desc: 'Penerjemah domain (mis. server.local → IP)' }
  ];

  function loadFwRules() {
    try {
      const parsed = JSON.parse(localStorage.getItem(FW_KEY) || 'null');
      return Object.assign({}, DEFAULT_FW, parsed || {});
    } catch (_) {
      return Object.assign({}, DEFAULT_FW);
    }
  }

  function saveFwRules(rules) {
    try { localStorage.setItem(FW_KEY, JSON.stringify(rules)); } catch (_) {}
  }

  function checkFirewallOnPath(pathIds, port) {
    const nodes = getCanvasNodes();
    const byId = new Map(nodes.map(n => [n.id, n]));
    const fwNode = (pathIds || []).map(id => byId.get(id)).find(n => n && n.type === 'firewall');
    if (!fwNode) return { blocked: false, firewall: null };
    const rules = loadFwRules();
    const action = rules[port] || 'allow';
    return { blocked: action === 'deny', firewall: fwNode, action };
  }

  const cliHistory = [];
  let cliHistIdx = -1;

  function ensureModal() {
    if ($('nf64Modal')) return $('nf64Modal');
    const m = document.createElement('div');
    m.id = 'nf64Modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');

    const prefOpts = Array.from({ length: 25 }, (_, i) => 32 - i)
      .reverse()
      .map(p => `<option value="${p}" ${p === 24 ? 'selected' : ''}>/${p} (${intToIPv4(prefixToMask(p))})</option>`)
      .join('');

    m.innerHTML = `
      <div class="nf64-dialog">
        <div class="nf64-head">
          <h3>🧰 Utilitas Jaringan — Kalkulator IP &amp; Terminal CLI</h3>
          <button type="button" class="nf60-btn" id="nf64ModalClose">✕ Tutup</button>
        </div>
        <div class="nf64-tabs">
          <button type="button" class="nf64-tab active" data-nf64-tab="calc">🧮 Subnet</button>
          <button type="button" class="nf64-tab" data-nf64-tab="compare">🔀 Cek 2 IP</button>
          <button type="button" class="nf64-tab" data-nf64-tab="cli">💻 CLI</button>
          <button type="button" class="nf64-tab" data-nf64-tab="web">🌐 Mini Browser</button>
          <button type="button" class="nf64-tab" data-nf64-tab="fw">🛡️ Firewall ACL</button>
        </div>

        <!-- TAB 1: CIDR CALCULATOR -->
        <div class="nf64-body" id="nf64TabCalc">
          <div class="nf64-row">
            <div class="nf64-field" style="flex:2 1 220px;">
              <label for="nf64IpInput">Alamat IPv4 (boleh langsung dengan /CIDR)</label>
              <input id="nf64IpInput" type="text" value="192.168.10.10" placeholder="Contoh: 192.168.10.10 atau 10.0.0.5/26">
            </div>
            <div class="nf64-field" style="flex:1 1 180px;">
              <label for="nf64PrefSelect">Prefix / Subnet Mask</label>
              <select id="nf64PrefSelect">${prefOpts}</select>
            </div>
          </div>
          <div id="nf64CalcRole" class="nf64-badge ok"></div>
          <div class="nf64-grid" id="nf64CalcGrid"></div>
          <div class="nf64-bin" id="nf64CalcBin"></div>
        </div>

        <!-- TAB 2: SAME SUBNET CHECKER -->
        <div class="nf64-body" id="nf64TabCompare" style="display:none;">
          <div style="font-size:12px;color:#94a3b8;">Cek cepat apakah dua perangkat (misalnya PC dan Gateway/Server) berada pada satu subnet yang sama.</div>
          <div class="nf64-row">
            <div class="nf64-field"><label>IP Perangkat A</label><input id="nf64CmpA" type="text" value="192.168.10.10"></div>
            <div class="nf64-field"><label>IP Perangkat B</label><input id="nf64CmpB" type="text" value="192.168.10.1"></div>
            <div class="nf64-field"><label>Prefix</label><select id="nf64CmpPref">${prefOpts}</select></div>
          </div>
          <div id="nf64CmpResult" class="nf64-badge ok"></div>
        </div>

        <!-- TAB 3: NETWORK CLI TERMINAL -->
        <div class="nf64-body" id="nf64TabCli" style="display:none;">
          <div class="nf64-row" style="align-items:center;">
            <div class="nf64-field" style="flex:1 1 240px;">
              <label for="nf64CliHost">Perangkat Aktif di Kanvas (Host Terminal)</label>
              <select id="nf64CliHost"></select>
            </div>
            <button type="button" class="nf60-btn" id="nf64CliRefresh">🔄 Segarkan Kanvas</button>
          </div>
          <div class="nf64-quick-cmds">
            <button type="button" class="nf60-btn sm" data-cli-cmd="help">help</button>
            <button type="button" class="nf60-btn sm" data-cli-cmd="ipconfig">ipconfig</button>
            <button type="button" class="nf60-btn sm" data-cli-cmd="devices">devices</button>
            <button type="button" class="nf60-btn sm" data-cli-cmd="arp -a">arp -a</button>
            <button type="button" class="nf60-btn sm" data-cli-cmd="ping 192.168.10.1">ping 192.168.10.1</button>
            <button type="button" class="nf60-btn sm" data-cli-cmd="tracert 192.168.10.10">tracert 192.168.10.10</button>
            <button type="button" class="nf60-btn sm danger" data-cli-cmd="clear">clear</button>
          </div>
          <div class="nf64-cli-screen" id="nf64CliScreen" aria-live="polite"></div>
          <div class="nf64-cli-input-row">
            <span class="nf64-cli-prompt" id="nf64CliPrompt">PC&gt;</span>
            <input id="nf64CliInput" type="text" placeholder="Ketik perintah (mis. ipconfig, ping 192.168.10.1, tracert, arp -a, help)…" autocomplete="off">
            <button type="button" class="nf60-btn primary" id="nf64CliRun">Jalankan</button>
          </div>
        </div>

        <!-- TAB 4: MINI WEB BROWSER (HTTP/HTTPS/DNS + FIREWALL CHECK) -->
        <div class="nf64-body" id="nf64TabWeb" style="display:none;">
          <div class="nf64-row" style="align-items:center;">
            <div class="nf64-field" style="flex:1 1 220px;">
              <label for="nf68WebClient">Klien Sumber (PC / Laptop / HP di Kanvas)</label>
              <select id="nf68WebClient"></select>
            </div>
            <button type="button" class="nf60-btn" id="nf68WebRefresh">🔄 Segarkan</button>
          </div>
          <div class="nf68-browser-bar">
            <input id="nf68WebUrl" type="text" value="http://server.local" placeholder="Contoh: http://server.local atau https://192.168.10.10">
            <button type="button" class="nf60-btn primary" id="nf68WebGo">🌐 Buka URL</button>
          </div>
          <div class="nf64-quick-cmds">
            <button type="button" class="nf60-btn sm" data-web-url="http://server.local">http://server.local</button>
            <button type="button" class="nf60-btn sm" data-web-url="https://server.local">https://server.local</button>
            <button type="button" class="nf60-btn sm" data-web-url="http://192.168.10.10">http://192.168.10.10</button>
            <button type="button" class="nf60-btn sm" data-web-url="http://intranet.sekolah:22">Test Port 22 (SSH)</button>
          </div>
          <div class="nf68-viewport" id="nf68WebViewport">
            <div style="color:#94A3B8;">Ketik alamat IP Server atau domain lokal (mis. <code>http://server.local</code>) lalu klik <b>🌐 Buka URL</b> untuk menguji HTTP, HTTPS, DNS, dan aturan Firewall ACL di topologi Anda.</div>
          </div>
        </div>

        <!-- TAB 5: FIREWALL ACL PORT FILTER -->
        <div class="nf64-body" id="nf64TabFw" style="display:none;">
          <div id="nf68FwBanner" class="nf64-badge ok"></div>
          <div class="nf68-fw-list" id="nf68FwList"></div>
          <div style="font-size:11.5px;color:#94A3B8;">Perubahan aturan Firewall langsung berlaku di <b>🌐 Mini Browser</b> dan <b>💻 Terminal CLI</b> (coba ubah HTTP Port 80 ke <code>DENY</code> lalu buka <code>http://server.local</code>!).</div>
        </div>
      </div>`;
    document.body.appendChild(m);

    // Tab switching
    m.querySelectorAll('.nf64-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const which = tab.dataset.nf64Tab;
        if ((which === 'calc' || which === 'compare') && document.body.classList.contains('nf60-exam-active') && document.body.classList.contains('nf60-no-ipcalc')) {
          return;
        }
        m.querySelectorAll('.nf64-tab').forEach(t => t.classList.toggle('active', t === tab));
        $('nf64TabCalc').style.display = which === 'calc' ? 'flex' : 'none';
        $('nf64TabCompare').style.display = which === 'compare' ? 'flex' : 'none';
        $('nf64TabCli').style.display = which === 'cli' ? 'flex' : 'none';
        $('nf64TabWeb').style.display = which === 'web' ? 'flex' : 'none';
        $('nf64TabFw').style.display = which === 'fw' ? 'flex' : 'none';
        if (which === 'cli') {
          syncCliHosts();
          setTimeout(() => $('nf64CliInput')?.focus(), 40);
        }
        if (which === 'web') syncWebClients();
        if (which === 'fw') renderFirewallPanel();
      });
    });

    m.querySelector('#nf64ModalClose').addEventListener('click', () => m.classList.remove('open'));
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && m.classList.contains('open')) m.classList.remove('open');
    });

    // Calculator bindings
    function renderCalc() {
      const ipVal = $('nf64IpInput').value;
      if (ipVal.includes('/')) {
        const pPart = Number(ipVal.split('/')[1]);
        if (Number.isInteger(pPart) && pPart >= 8 && pPart <= 32) {
          $('nf64PrefSelect').value = String(pPart);
        }
      }
      const res = calcSubnet(ipVal, $('nf64PrefSelect').value);
      const roleEl = $('nf64CalcRole');
      const gridEl = $('nf64CalcGrid');
      const binEl = $('nf64CalcBin');
      if (!res) {
        roleEl.className = 'nf64-badge err';
        roleEl.textContent = '❌ Format IPv4 tidak valid. Contoh valid: 192.168.10.10 atau 10.10.0.1/26';
        gridEl.innerHTML = '';
        binEl.innerHTML = '';
        return;
      }
      roleEl.className = 'nf64-badge ' + res.roleTone;
      roleEl.textContent = `${res.role} · ${res.ipClass}`;
      gridEl.innerHTML = `
        <div class="nf64-stat"><small>Network Address</small><strong>${res.network}/${res.prefix}</strong></div>
        <div class="nf64-stat"><small>Subnet Mask</small><strong>${res.mask}</strong></div>
        <div class="nf64-stat"><small>Rentang Host Usable</small><strong>${res.firstHost} – ${res.lastHost}</strong></div>
        <div class="nf64-stat"><small>Broadcast Address</small><strong>${res.broadcast}</strong></div>
        <div class="nf64-stat"><small>Jumlah Host Usable</small><strong>${res.usable.toLocaleString('id-ID')} host</strong></div>
        <div class="nf64-stat"><small>Wildcard Mask</small><strong>${res.wildcard}</strong></div>
      `;
      binEl.innerHTML = `<div style="font-size:10.5px;color:#94a3b8;margin-bottom:3px;">Biner 32-bit (<span class="net">Biru = Network ${res.prefix} bit</span> · <span class="host">Hijau = Host ${32 - res.prefix} bit</span>)</div>${res.binHtml}`;
    }

    function renderCompare() {
      const p = Number($('nf64CmpPref').value);
      const a = calcSubnet($('nf64CmpA').value, p);
      const b = calcSubnet($('nf64CmpB').value, p);
      const out = $('nf64CmpResult');
      if (!a || !b) {
        out.className = 'nf64-badge err';
        out.textContent = '❌ Pastikan kedua alamat IPv4 valid (contoh: 192.168.10.10 dan 192.168.10.1).';
        return;
      }
      if (a.netInt === b.netInt) {
        out.className = 'nf64-badge ok';
        out.innerHTML = `✅ <b>SATU SUBNET!</b> Keduanya berada di jaringan <code>${a.network}/${p}</code> (Mask ${a.mask}) dan dapat berkomunikasi langsung di Layer 2 (Switch).`;
      } else {
        out.className = 'nf64-badge warn';
        out.innerHTML = `⚠️ <b>BEDA SUBNET!</b><br>• Perangkat A berada di <code>${a.network}/${p}</code><br>• Perangkat B berada di <code>${b.network}/${p}</code><br>Diperlukan <b>Router / Default Gateway</b> agar kedua perangkat bisa saling Ping.`;
      }
    }

    $('nf64IpInput').addEventListener('input', renderCalc);
    $('nf64PrefSelect').addEventListener('change', () => {
      const ipVal = $('nf64IpInput').value;
      if (ipVal.includes('/')) $('nf64IpInput').value = ipVal.split('/')[0];
  
    // --- Mini Web Browser & Firewall ACL Logic ---
    function syncWebClients() {
      const sel = $('nf68WebClient');
      if (!sel) return;
      const prev = sel.value;
      const nodes = getCanvasNodes();
      const clients = nodes.filter(n => !['switch', 'modem', 'firewall'].includes(n.type));
      if (!clients.length) {
        sel.innerHTML = '<option value="">(Tambahkan PC / Laptop ke kanvas dulu)</option>';
        return;
      }
      sel.innerHTML = clients.map(n => `<option value="${escapeHtml(n.id)}">${escapeHtml(n.name)} (${escapeHtml(n.ip || 'no IP')})</option>`).join('');
      if (prev && clients.some(c => c.id === prev)) sel.value = prev;
    }

    function renderFirewallPanel() {
      const banner = $('nf68FwBanner');
      const list = $('nf68FwList');
      if (!banner || !list) return;
      const nodes = getCanvasNodes();
      const fwCount = nodes.filter(n => n.type === 'firewall').length;
      if (fwCount > 0) {
        banner.className = 'nf64-badge ok';
        banner.textContent = `🛡️ ${fwCount} perangkat Firewall aktif di kanvas — aturan ACL di bawah ini sedang menyaring trafik jalur yang melewati Firewall.`;
      } else {
        banner.className = 'nf64-badge warn';
        banner.textContent = '⚠️ Belum ada perangkat 🛡️ Firewall di kanvas. Aturan sudah tersimpan dan akan otomatis aktif begitu Anda memasang Firewall di jalur jaringan.';
      }
      const rules = loadFwRules();
      list.innerHTML = FW_SERVICES.map(svc => {
        const act = rules[svc.port] || 'allow';
        return `
          <div class="nf68-fw-row">
            <div>
              <strong>Port ${svc.port} (${svc.proto}) — ${svc.name}</strong>
              <small>${svc.desc}</small>
            </div>
            <button type="button" class="nf68-fw-toggle ${act}" data-fw-port="${svc.port}">${act === 'allow' ? '✅ ALLOW' : '🚫 DENY'}</button>
          </div>`;
      }).join('');
      list.querySelectorAll('[data-fw-port]').forEach(btn => {
        btn.addEventListener('click', () => {
          const port = Number(btn.dataset.fwPort);
          const cur = loadFwRules();
          cur[port] = (cur[port] === 'deny') ? 'allow' : 'deny';
          saveFwRules(cur);
          renderFirewallPanel();
        });
      });
    }

    function openSimulatedUrl(rawUrl) {
      const vp = $('nf68WebViewport');
      if (!vp) return;
      const urlStr = String(rawUrl || '').trim();
      const m = urlStr.match(/^(https?):\/\/([^/:]+)(?::(\d+))?(\/.*)?$/i);
      if (!m) {
        vp.innerHTML = '<div class="nf68-page-block"><h4>⚠️ Format URL Tidak Valid</h4>Gunakan format seperti <code>http://server.local</code> atau <code>https://192.168.10.10</code>.</div>';
        return;
      }
      const proto = m[1].toLowerCase();
      const hostStr = m[2].toLowerCase();
      const port = m[3] ? Number(m[3]) : (proto === 'https' ? 443 : 80);

      const nodes = getCanvasNodes();
      const client = nodes.find(n => n.id === $('nf68WebClient')?.value) || nodes.find(n => n.type === 'pc' || n.type === 'laptop');
      if (!client) {
        vp.innerHTML = '<div class="nf68-page-block"><h4>⚠️ Tidak Ada Klien di Kanvas</h4>Tambahkan minimal 1 Desktop PC / Laptop dan 1 Server terlebih dahulu.</div>';
        return;
      }

      const isIp = parseIPv4(hostStr) !== null;
      const server = isIp
        ? nodes.find(n => n.ip === hostStr)
        : (nodes.find(n => n.type === 'server') || nodes.find(n => n.name.toLowerCase().includes(hostStr.split('.')[0])));

      if (!server) {
        window.NetForgeTacticalHUD?.animatePacketPath?.([client.id], { drop: true });
        vp.innerHTML = `<div class="nf68-page-block"><h4>❌ ERR_NAME_NOT_RESOLVED / Host Tidak Ditemukan</h4>Target <code>${escapeHtml(hostStr)}</code> tidak ditemukan di topologi saat ini. Pastikan perangkat <b>Server</b> sudah terpasang di kanvas.</div>`;
        return;
      }

      const path = findPathNodes(client.id, server.id);
      if (!path) {
        window.NetForgeTacticalHUD?.animatePacketPath?.([client.id], { drop: true });
        vp.innerHTML = `<div class="nf68-page-block"><h4>❌ ERR_CONNECTION_TIMED_OUT</h4>Tidak ada jalur kabel/Wi-Fi aktif dari <b>${escapeHtml(client.name)}</b> menuju <b>${escapeHtml(server.name)}</b> (${escapeHtml(server.ip || 'belum ada IP')}).</div>`;
        return;
      }

      // Check DNS Port 53 if using domain name
      if (!isIp) {
        const dnsFw = checkFirewallOnPath(path, 53);
        if (dnsFw.blocked) {
          window.NetForgeTacticalHUD?.animatePacketPath?.(path.slice(0, path.indexOf(dnsFw.firewall.id) + 1), { drop: true });
          vp.innerHTML = `<div class="nf68-page-block"><h4>🛡️ BLOCKED BY FIREWALL (DNS Port 53)</h4>Permintaan resolusi domain <code>${escapeHtml(hostStr)}</code> diblokir oleh <b>${escapeHtml(dnsFw.firewall.name)}</b> karena <b>Port 53 (DNS)</b> diatur <code>DENY</code>. Buka tab <b>🛡️ Firewall ACL</b> untuk mengizinkannya.</div>`;
          return;
        }
      }

      // Check Target Service Port on Firewall
      const fwCheck = checkFirewallOnPath(path, port);
      if (fwCheck.blocked) {
        const fwIdx = path.indexOf(fwCheck.firewall.id);
        window.NetForgeTacticalHUD?.animatePacketPath?.(path.slice(0, fwIdx + 1), { drop: true });
        vp.innerHTML = `
          <div class="nf68-page-block">
            <h4>🛡️ 403 BLOCKED BY FIREWALL — Port ${port} (${proto.toUpperCase()})</h4>
            <p>Koneksi dari <b>${escapeHtml(client.name)}</b> ke <b>${escapeHtml(server.name)}</b> dihentikan oleh <b>${escapeHtml(fwCheck.firewall.name)}</b> karena aturan Firewall ACL untuk <b>Port ${port}</b> sedang berstatus <code>DENY</code>.</p>
            <div style="font-size:11px;color:#94A3B8;">Tips: Buka tab <b>🛡️ Firewall ACL</b> untuk mengubah Port ${port} menjadi <b>ALLOW</b>, lalu uji ulang.</div>
          </div>`;
        return;
      }

      const byId = new Map(nodes.map(n => [n.id, n]));
      const hopNames = path.map(id => byId.get(id)?.name || id).join(' → ');
      const latency = Math.max(2, (path.length - 1) * 3);
      window.NetForgeTacticalHUD?.animatePacketPath?.(path, { label: proto.toUpperCase(), bounce: true });

      vp.innerHTML = `
        <div class="nf68-page-ok">
          <h4>✅ 200 OK — Portal Intranet ${escapeHtml(server.name)}</h4>
          <p style="margin:0 0 8px;color:#E2E8F0;">Selamat! Koneksi <b>${proto.toUpperCase()} (Port ${port})</b> dari <b>${escapeHtml(client.name)}</b> berhasil mencapai server tujuan melalui jaringan yang Anda bangun.</p>
          <div style="padding:8px 10px;border-radius:8px;background:rgba(15,23,42,0.85);border:1px solid rgba(52,211,153,0.3);font-family:ui-monospace,monospace;font-size:11.5px;color:#BAE6FD;">
            URL: ${escapeHtml(urlStr)}<br>
            Resolved IP: ${escapeHtml(server.ip || '(L2 Server)')} · Latensi: ${latency} ms<br>
            Jalur Hop: ${escapeHtml(hopNames)}<br>
            Firewall Status: ${fwCheck.firewall ? '🛡️ Lolos inspeksi ' + escapeHtml(fwCheck.firewall.name) + ' (ALLOW)' : 'Langsung (tanpa Firewall)'}
          </div>
        </div>`;
    }

    $('nf68WebRefresh').addEventListener('click', syncWebClients);
    $('nf68WebGo').addEventListener('click', () => openSimulatedUrl($('nf68WebUrl').value));
    $('nf68WebUrl').addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); openSimulatedUrl($('nf68WebUrl').value); }
    });
    m.querySelectorAll('[data-web-url]').forEach(b => {
      b.addEventListener('click', () => {
        $('nf68WebUrl').value = b.dataset.webUrl;
        openSimulatedUrl(b.dataset.webUrl);
      });
    });

    renderCalc();
    syncWebClients();
    renderFirewallPanel();
    });
    $('nf64CmpA').addEventListener('input', renderCompare);
    $('nf64CmpB').addEventListener('input', renderCompare);
    $('nf64CmpPref').addEventListener('change', renderCompare);

    // CLI Logic
    function appendCli(html) {
      const scr = $('nf64CliScreen');
      if (!scr) return;
      scr.innerHTML += html + '\n';
      scr.scrollTop = scr.scrollHeight;
    }

    function syncCliHosts() {
      const sel = $('nf64CliHost');
      if (!sel) return;
      const prev = sel.value;
      const nodes = getCanvasNodes();
      if (!nodes.length) {
        sel.innerHTML = '<option value="">(Kanvas masih kosong — tambahkan perangkat dulu)</option>';
        $('nf64CliPrompt').textContent = 'NETFORGE>';
        return;
      }
      sel.innerHTML = nodes.map(n => `<option value="${escapeHtml(n.id)}">${escapeHtml(n.name)} (${escapeHtml(n.ip || 'belum ada IP')})</option>`).join('');
      if (prev && nodes.some(n => n.id === prev)) sel.value = prev;
      const cur = nodes.find(n => n.id === sel.value) || nodes[0];
      $('nf64CliPrompt').textContent = (cur?.name || 'HOST').replace(/\s+/g, '_').slice(0, 14) + '>';
    }

    function runCliCommand(rawCmd) {
      const cmd = String(rawCmd || '').trim();
      if (!cmd) return;
      cliHistory.unshift(cmd);
      if (cliHistory.length > 40) cliHistory.pop();
      cliHistIdx = -1;

      const nodes = getCanvasNodes();
      const selId = $('nf64CliHost')?.value;
      const host = nodes.find(n => n.id === selId) || nodes[0] || null;
      const promptTxt = $('nf64CliPrompt')?.textContent || 'NETFORGE>';
      appendCli(`<span class="cmd">${escapeHtml(promptTxt)} ${escapeHtml(cmd)}</span>`);

      const tokens = cmd.split(/\s+/);
      const op = tokens[0].toLowerCase();
      const arg = tokens.slice(1).join(' ').trim();

      if (op === 'clear' || op === 'cls') {
        $('nf64CliScreen').innerHTML = '';
        return;
      }
      if (op === 'help' || op === '?') {
        appendCli(
          `<span class="dim">Perintah tersedia di Terminal NET FORGE:</span>
` +
          `  <b>ipconfig</b> / <b>ifconfig</b>   Tampilkan konfigurasi IP, Subnet Mask &amp; Gateway host ini
` +
          `  <b>devices</b>                 Daftar semua perangkat &amp; IP di kanvas saat ini
` +
          `  <b>arp -a</b>                  Tabel IP ↔ MAC perangkat yang terjangkau dari host ini
` +
          `  <b>ping &lt;ip|nama&gt;</b>          Uji konektivitas ICMP ke IP atau nama perangkat tujuan
` +
          `  <b>tracert &lt;ip|nama&gt;</b>       Lacak jalur hop-by-hop dari host ini ke tujuan
` +
          `  <b>curl &lt;url&gt;</b>              Uji akses HTTP/HTTPS + Firewall ACL dari host ini\n  <b>ssh &lt;ip|nama&gt;</b>           Uji akses SSH (Port 22) melewati Firewall ACL\n  <b>clear</b>                   Bersihkan layar terminal`
        );
        return;
      }
      if (!host) {
        appendCli(`<span class="err">Kanvas masih kosong. Tambahkan minimal 1 perangkat ke kanvas terlebih dahulu.</span>`);
        return;
      }
      if (op === 'ipconfig' || op === 'ifconfig') {
        const mask = intToIPv4(prefixToMask(host.prefix));
        const sub = host.ip ? calcSubnet(host.ip, host.prefix) : null;
        appendCli(
          `NET FORGE Network Adapter — <b>${escapeHtml(host.name)}</b> (${escapeHtml(host.type.toUpperCase())})
` +
          `   Physical Address (MAC) . : ${host.mac}
` +
          `   IPv4 Address . . . . . . : ${escapeHtml(host.ip || '(belum diatur — klik 2x perangkat)')}
` +
          `   Subnet Mask  . . . . . . : ${mask} (/${host.prefix})
` +
          `   Network ID . . . . . . . : ${sub ? sub.network + '/' + sub.prefix : '-'}
` +
          `   Default Gateway  . . . . : ${escapeHtml(host.gateway || '(tidak diatur)')}`
        );
        return;
      }
      if (op === 'devices' || op === 'netstat') {
        const lines = nodes.map(n => `  • ${n.name.padEnd(18)} | ${(n.ip || '(no IP)').padEnd(16)} | /${n.prefix} | GW: ${n.gateway || '-'}`);
        appendCli(`<span class="dim">Perangkat aktif di kanvas (${nodes.length}):</span>
${escapeHtml(lines.join('\n'))}`);
        return;
      }
      if (op === 'arp') {
        const reachable = nodes.filter(n => n.id !== host.id && n.ip && findPathNodes(host.id, n.id));
        if (!reachable.length) {
          appendCli(`<span class="dim">Tabel ARP kosong — belum ada tetangga ber-IP yang terhubung aktif.</span>`);
          return;
        }
        const rows = reachable.map(n => `  ${n.ip.padEnd(16)}  ${n.mac}   dynamic  (${n.name})`);
        appendCli(`Interface: ${escapeHtml(host.ip || host.name)}
  Internet Address  Physical Address   Type
${escapeHtml(rows.join('\n'))}`);
        return;
      }
      if (op === 'curl' || op === 'ssh') {
        if (!arg) {
          appendCli(`<span class="err">Gunakan: ${op === 'curl' ? 'curl http://server.local' : 'ssh 192.168.10.10'}</span>`);
          return;
        }
        const port = op === 'ssh' ? 22 : (arg.toLowerCase().startsWith('https://') ? 443 : 80);
        const target = nodes.find(n => (n.ip && arg.includes(n.ip)) || n.type === 'server');
        if (!target) {
          appendCli(`<span class="err">${op}: target server tidak ditemukan di kanvas.</span>`);
          return;
        }
        const path = findPathNodes(host.id, target.id);
        if (!path) {
          window.NetForgeTacticalHUD?.animatePacketPath?.([host.id], { drop: true });
          appendCli(`<span class="err">${op}: tidak ada jalur aktif menuju ${escapeHtml(target.name)}.</span>`);
          return;
        }
        const fw = checkFirewallOnPath(path, port);
        if (fw.blocked) {
          window.NetForgeTacticalHUD?.animatePacketPath?.(path.slice(0, path.indexOf(fw.firewall.id) + 1), { drop: true });
          appendCli(`<span class="err">🛡️ BLOCKED BY ${escapeHtml(fw.firewall.name)}: Port ${port} (${op.toUpperCase()}) berstatus DENY di Firewall ACL!</span>`);
          return;
        }
        window.NetForgeTacticalHUD?.animatePacketPath?.(path, { label: op.toUpperCase(), bounce: true });
        appendCli(`<span class="ok">✅ ${op.toUpperCase()} ke ${escapeHtml(target.name)} [${escapeHtml(target.ip || 'server')}] Port ${port} BERHASIL (ALLOW).</span>`);
        return;
      }

      if (op === 'ping' || op === 'tracert' || op === 'traceroute') {
        if (!arg) {
          appendCli(`<span class="err">Gunakan: ${op} &lt;alamat_ip atau nama_perangkat&gt;</span>`);
          return;
        }
        const target = nodes.find(n =>
          (n.ip && n.ip.toLowerCase() === arg.toLowerCase()) ||
          n.name.toLowerCase().includes(arg.toLowerCase()) ||
          n.type.toLowerCase() === arg.toLowerCase()
        );
        if (!target) {
          appendCli(`<span class="err">Ping request could not find host "${escapeHtml(arg)}". Periksa IP atau nama perangkat di kanvas (ketik "devices").</span>`);
          return;
        }
        const path = findPathNodes(host.id, target.id);
        const byId = new Map(nodes.map(n => [n.id, n]));

        if (op === 'ping') {
          const tLabel = target.ip || target.name;
          if (!path) {
            window.NetForgeTacticalHUD?.animatePacketPath?.([host.id], { drop: true });
            appendCli(
              `Pinging ${escapeHtml(target.name)} [${escapeHtml(tLabel)}] with 32 bytes of data:
` +
              `<span class="err">Request timed out.
Request timed out.
Destination host unreachable — tidak ada jalur kabel aktif dari ${escapeHtml(host.name)} ke ${escapeHtml(target.name)}.</span>
` +
              `Packets: Sent = 2, Received = 0, Lost = 2 (100% loss)`
            );
            return;
          }
          window.NetForgeTacticalHUD?.animatePacketPath?.(path, { label: 'ICMP', bounce: true });
          const hops = Math.max(1, path.length - 1);
          const ms = hops * 2;
          appendCli(
            `Pinging ${escapeHtml(target.name)} [${escapeHtml(tLabel)}] with 32 bytes of data:
` +
            `<span class="ok">Reply from ${escapeHtml(tLabel)}: bytes=32 time=${ms}ms TTL=${65 - hops}
` +
            `Reply from ${escapeHtml(tLabel)}: bytes=32 time=${ms + 1}ms TTL=${65 - hops}
` +
            `Reply from ${escapeHtml(tLabel)}: bytes=32 time=${ms}ms TTL=${65 - hops}</span>
` +
            `Packets: Sent = 3, Received = 3, Lost = 0 (0% loss), Hops = ${hops}`
          );
          return;
        }

        // tracert
        if (!path) {
          appendCli(`<span class="err">Tracing route to ${escapeHtml(target.name)} gagal — jalur terputus atau belum terhubung.</span>`);
          return;
        }
        window.NetForgeTacticalHUD?.animatePacketPath?.(path, { label: 'TRACE', bounce: false });
        const hopLines = path.map((id, idx) => {
          const nd = byId.get(id);
          const hopIp = nd?.ip || '(L2 Switch/No IP)';
          return `  ${String(idx + 1).padStart(2)}    ${(idx + 1) * 2} ms    ${hopIp.padEnd(17)} [${nd?.name || id}]`;
        });
        appendCli(
          `Tracing route to ${escapeHtml(target.name)} [${escapeHtml(target.ip || target.name)}] over ${path.length} hops:
` +
          `<span class="ok">${escapeHtml(hopLines.join('\n'))}</span>
Trace complete.`
        );
        return;
      }

      appendCli(`<span class="err">Perintah "${escapeHtml(op)}" tidak dikenali. Ketik "help" untuk daftar perintah.</span>`);
    }

    $('nf64CliHost').addEventListener('change', () => {
      const nodes = getCanvasNodes();
      const cur = nodes.find(n => n.id === $('nf64CliHost').value);
      $('nf64CliPrompt').textContent = (cur?.name || 'HOST').replace(/\s+/g, '_').slice(0, 14) + '>';
    });
    $('nf64CliRefresh').addEventListener('click', syncCliHosts);
    $('nf64CliRun').addEventListener('click', () => {
      const inp = $('nf64CliInput');
      runCliCommand(inp.value);
      inp.value = '';
      inp.focus();
    });
    $('nf64CliInput').addEventListener('keydown', e => {
      const inp = $('nf64CliInput');
      if (e.key === 'Enter') {
        e.preventDefault();
        runCliCommand(inp.value);
        inp.value = '';
      } else if (e.key === 'ArrowUp' && cliHistory.length) {
        e.preventDefault();
        cliHistIdx = Math.min(cliHistory.length - 1, cliHistIdx + 1);
        inp.value = cliHistory[cliHistIdx];
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        cliHistIdx = Math.max(-1, cliHistIdx - 1);
        inp.value = cliHistIdx >= 0 ? cliHistory[cliHistIdx] : '';
      }
    });
    m.querySelectorAll('[data-cli-cmd]').forEach(b => {
      b.addEventListener('click', () => runCliCommand(b.dataset.cliCmd));
    });

    $('nf64CliScreen').innerHTML = `<span class="dim">NET FORGE Network CLI v0.71.1 — Terhubung langsung ke topologi kanvas.
Ketik "help", "ipconfig", "devices", "ping &lt;ip&gt;", atau "tracert &lt;ip&gt;".</span>
`;
    renderCalc();
    renderCompare();
    syncCliHosts();
    return m;
  }

  function openNetTools(tabName) {
    const m = ensureModal();
    const ipCalcBlocked = document.body.classList.contains('nf60-exam-active') && document.body.classList.contains('nf60-no-ipcalc');
    m.querySelectorAll('.nf64-tab[data-nf64-tab="calc"], .nf64-tab[data-nf64-tab="compare"]').forEach(t => {
      t.style.display = ipCalcBlocked ? 'none' : '';
    });
    const targetTab = ipCalcBlocked ? 'cli' : (tabName || 'calc');
    const btn = m.querySelector(`.nf64-tab[data-nf64-tab="${targetTab}"]`);
    if (btn) btn.click();
    m.classList.add('open');
  }

  function injectButtons() {
    const tabs = document.querySelector('#nf43DrawerBar .nf43-tabs');
    if (!tabs) return false;
    if (!$('nf64IpCalcBtn')) {
      const b1 = document.createElement('button');
      b1.id = 'nf64IpCalcBtn';
      b1.type = 'button';
      b1.textContent = '🧮 IP/Web';
      b1.title = 'Kalkulator IPv4 / CIDR Subnetting & Cek Satu Subnet';
      b1.addEventListener('click', () => openNetTools('calc'));
      tabs.appendChild(b1);
    }
    if (!$('nf64CliBtn')) {
      const b2 = document.createElement('button');
      b2.id = 'nf64CliBtn';
      b2.type = 'button';
      b2.textContent = '💻 CLI';
      b2.title = 'Terminal CLI Jaringan (ipconfig, ping, tracert, arp)';
      b2.addEventListener('click', () => openNetTools('cli'));
      tabs.appendChild(b2);
    }
    return true;
  }

  window.NetForgeNetTools = {
    version: '0.71.1',
    open: openNetTools,
    calcSubnet
  };

  let tries = 0;
  (function boot() {
    if (injectButtons() || ++tries > 24) return;
    setTimeout(boot, 350);
  })();
})();
