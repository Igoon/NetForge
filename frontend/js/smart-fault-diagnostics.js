/* NET FORGE v0.70.0 — Smart Fault Diagnostics & CLI Hints (Unified + Classic Canvas) */
(function () {
  'use strict';
  if (window.__NF5_DIAGNOSTICS) return;
  window.__NF5_DIAGNOSTICS = true;

  const $ = id => document.getElementById(id);
  const API = () => window.NetForgeUniversalInventory || null;

  let activeFilter = 'all';
  let currentIssues = [];
  let scanTimer = null;
  const boundObs = new Set();

  /* 1. Inject tombol Diagnostik di Modebar Unified Canvas (fallback HUD Klasik) + Drawer panel */
  function injectUI() {
    const host = $('nf400Modebar') || $('nf24Hud');
    if (host) {
      let btn = $('nf5DiagBtn');
      if (!btn) {
        btn = document.createElement('button');
        btn.id = 'nf5DiagBtn';
        btn.type = 'button';
        btn.className = 'nf5-diag-btn';
        btn.textContent = '🩺 0 Masalah';
        btn.title = 'Buka Smart Fault Diagnostics & saran CLI';
        btn.addEventListener('click', toggleDrawer);
        host.appendChild(btn);
      } else if ($('nf400Modebar') && btn.parentElement !== $('nf400Modebar')) {
        $('nf400Modebar').appendChild(btn);
      }
    }

    if (!$('nf5Drawer')) {
      const drawer = document.createElement('aside');
      drawer.id = 'nf5Drawer';
      drawer.hidden = true;
      drawer.setAttribute('aria-label', 'Smart Fault Diagnostics');
      drawer.innerHTML = `
        <div class="nf5-head">
          <span class="nf5-title">🩺 Smart Fault Diagnostics</span>
          <div class="nf5-head-actions">
            <button type="button" id="nf5Rescan" class="nf5-mini-btn" title="Pindai ulang topologi">🔄 Scan</button>
            <button type="button" id="nf5Close" class="nf5-mini-btn" title="Tutup panel">✕</button>
          </div>
        </div>
        <div class="nf5-filters" role="tablist">
          <button type="button" class="nf5-filter-pill active" data-filter="all">Semua</button>
          <button type="button" class="nf5-filter-pill" data-filter="error">Error</button>
          <button type="button" class="nf5-filter-pill" data-filter="warn">Peringatan</button>
        </div>
        <div id="nf5List" class="nf5-list"></div>
      `;
      document.body.appendChild(drawer);

      $('nf5Close').addEventListener('click', () => { drawer.hidden = true; });
      $('nf5Rescan').addEventListener('click', () => runDiagnostics());
      drawer.querySelectorAll('.nf5-filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          activeFilter = pill.dataset.filter || 'all';
          drawer.querySelectorAll('.nf5-filter-pill').forEach(p => p.classList.toggle('active', p === pill));
          renderDrawerList();
        });
      });
    }
  }

  function toggleDrawer() {
    const drawer = $('nf5Drawer');
    if (!drawer) return;
    drawer.hidden = !drawer.hidden;
    if (!drawer.hidden) runDiagnostics();
  }

  /* 2. Helper IPv4 & Subnet Math */
  function parseIPv4(raw) {
    const m = String(raw || '').match(/\b((?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b(?:\/(\d{1,2}))?/);
    if (!m) return null;
    const ip = m[0].split('/')[0];
    const cidr = m[2] !== undefined ? Math.min(32, Math.max(1, parseInt(m[2], 10))) : null;
    return { ip, cidr };
  }

  function maskToCidr(mask) {
    if (!mask) return null;
    if (/^\d{1,2}$/.test(String(mask).trim())) return Math.min(32, Math.max(1, parseInt(mask, 10)));
    const parts = String(mask).trim().split('.').map(Number);
    if (parts.length !== 4 || parts.some(n => Number.isNaN(n) || n < 0 || n > 255)) return null;
    const bin = parts.map(n => n.toString(2).padStart(8, '0')).join('');
    const idx = bin.indexOf('0');
    return idx === -1 ? 32 : idx;
  }

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, oct) => ((acc << 8) + parseInt(oct, 10)) >>> 0, 0);
  }

  function networkInt(ip, cidr) {
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    return (ipToInt(ip) & maskInt) >>> 0;
  }

  function sameSubnet(ipA, cidrA, ipB, cidrB) {
    const c = Math.min(cidrA || 24, cidrB || 24);
    return networkInt(ipA, c) === networkInt(ipB, c);
  }

  /* 3. Ekstrak metadata Node & Kabel dari kanvas (mendukung Unified Canvas API + Classic DOM) */
  function getCanvasNodes() {
    if (document.body.classList.contains('nf400-mixed')) {
      return [...document.querySelectorAll('#nf400Canvas .nf400-node')];
    }
    return [...document.querySelectorAll('#board .node, #nf400Canvas .nf400-node')];
  }

  function getUnifiedConfigMap() {
    const api = API();
    const map = new Map();
    const rawNodes = api?.getState?.()?.nodes || [];
    const classicNodes = api?.classicView?.()?.nodes || [];
    const cMap = new Map(classicNodes.map(c => [String(c.id), c.config || {}]));
    rawNodes.forEach(n => {
      const cfg = cMap.get(String(n.id)) || {};
      map.set(String(n.id), {
        name: n.name || n.type,
        type: n.type,
        ip: (n.ip && String(n.ip).trim()) || cfg.ip || (n.type === 'router' ? '192.168.10.1' : ''),
        cidr: parseInt(String(cfg.prefix || '24').replace(/^\//, ''), 10) || 24,
        gateway: (n.gateway && String(n.gateway).trim()) || cfg.gateway || '',
        vlan: String((n.vlan && String(n.vlan).trim()) || cfg.vlan || '').trim()
      });
    });
    return map;
  }

  function readNodeProfile(el, idx, uniMap) {
    const d = el.dataset || {};
    const nodeId = String(d.node || d.id || d.nodeId || el.id || `node-${idx}`);
    const uni = uniMap?.get(nodeId) || null;

    const title = uni?.name || (el.querySelector('b, strong, .title, .nf400-title')?.textContent || '').trim() || d.name || `Device-${idx + 1}`;
    const rawText = el.textContent || '';

    const roleHint = `${uni?.type || ''} ${d.type || ''} ${d.role || ''} ${title}`.toLowerCase();
    const isSwitch = /switch|\bsw\d*\b|hub|modem/.test(roleHint);
    const isRouter = /router|\br\d*\b|gateway|firewall/.test(roleHint);
    const isEndDevice = !isSwitch && !isRouter;

    const ipParsed = parseIPv4(uni?.ip || d.ip || rawText);
    const maskCidr = uni?.cidr || maskToCidr(d.mask || d.subnet || d.cidr) || ipParsed?.cidr || 24;

    const gwMatch = (uni?.gateway || d.gateway || d.gw || rawText.match(/(?:gw|gateway)\s*[:=]\s*([^\s,;]+)/i)?.[1] || '');
    const gwParsed = parseIPv4(gwMatch);

    const statusDown = /shutdown|down|disabled|off/i.test(`${d.status || ''} ${d.state || ''}`);
    const vlan = uni?.vlan || d.vlan || rawText.match(/vlan\s*[:#-]?\s*(\d+)/i)?.[1] || '';

    return {
      el,
      idx,
      id: nodeId,
      name: title,
      isSwitch,
      isRouter,
      isEndDevice,
      ip: ipParsed?.ip || '',
      cidr: maskCidr,
      gateway: gwParsed?.ip || '',
      vlan,
      statusDown,
      rect: el.getBoundingClientRect()
    };
  }

  function getWireElements() {
    const svg = document.body.classList.contains('nf400-mixed')
      ? ($('nf49BezierWires') || $('nf400Wires') || $('wires'))
      : ($('wires') || $('nf49BezierWires'));
    if (!svg) return [];
    return [...svg.querySelectorAll('line, path')].filter(el => {
      if (el.closest('#nf4WireBadges') || el.closest('defs') || el.closest('marker')) return false;
      return true;
    });
  }

  function getWireScreenEnds(wire) {
    const ctm = typeof wire.getScreenCTM === 'function' ? wire.getScreenCTM() : null;
    if (ctm) {
      if (wire.tagName.toLowerCase() === 'line') {
        const p1 = new DOMPoint(parseFloat(wire.getAttribute('x1')) || 0, parseFloat(wire.getAttribute('y1')) || 0).matrixTransform(ctm);
        const p2 = new DOMPoint(parseFloat(wire.getAttribute('x2')) || 0, parseFloat(wire.getAttribute('y2')) || 0).matrixTransform(ctm);
        return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
      }
      if (typeof wire.getTotalLength === 'function') {
        try {
          const len = wire.getTotalLength();
          if (len > 0) {
            const p1 = wire.getPointAtLength(0).matrixTransform(ctm);
            const p2 = wire.getPointAtLength(len).matrixTransform(ctm);
            return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
          }
        } catch {}
      }
    }
    const r = wire.getBoundingClientRect();
    return { x1: r.left, y1: r.top, x2: r.right, y2: r.bottom };
  }

  function findNodeAtPoint(px, py, nodes) {
    let best = null;
    let bestDist = 28;
    nodes.forEach(n => {
      const r = n.rect;
      const cx = Math.max(r.left, Math.min(px, r.right));
      const cy = Math.max(r.top, Math.min(py, r.bottom));
      const dist = Math.hypot(px - cx, py - cy);
      if (dist <= bestDist) {
        bestDist = dist;
        best = n;
      }
    });
    return best;
  }

  function isWireDown(wire) {
    const cls = (wire.getAttribute('class') || '').toLowerCase();
    const st = (wire.dataset.status || wire.dataset.state || '').toLowerCase();
    const stroke = (wire.getAttribute('stroke') || getComputedStyle(wire).stroke || '').toLowerCase();
    return st === 'down' || st === 'off' || cls.includes('down') || cls.includes('nf4-wire-down') || stroke.includes('239, 68, 68') || stroke.includes('244, 63, 94') || stroke === '#ef4444';
  }

  /* 4. Mesin Analisis Kesalahan Topologi */
  function runDiagnostics() {
    const uniMap = getUnifiedConfigMap();
    const nodes = getCanvasNodes().map((el, idx) => readNodeProfile(el, idx, uniMap));
    const wires = getWireElements();
    const issues = [];
    const nodeFaultLevel = new Map();
    const faultyWires = new Set();

    function addFault(node, level) {
      if (!node) return;
      const prev = nodeFaultLevel.get(node.el);
      if (prev === 'error') return;
      nodeFaultLevel.set(node.el, level);
    }

    const links = [];
    const degreeMap = new Map(nodes.map(n => [n.el, 0]));

    // In Unified Canvas, read exact edge connectivity from API state too
    const api = API();
    const apiEdges = document.body.classList.contains('nf400-mixed') ? (api?.getState?.()?.edges || []) : [];
    const nodeById = new Map(nodes.map(n => [n.id, n]));

    if (apiEdges.length) {
      apiEdges.forEach((e, idx) => {
        const a = nodeById.get(String(e.a));
        const b = nodeById.get(String(e.b));
        const down = !api?.isLinkActive?.(e);
        if (a) degreeMap.set(a.el, (degreeMap.get(a.el) || 0) + 1);
        if (b && b !== a) degreeMap.set(b.el, (degreeMap.get(b.el) || 0) + 1);
        if (a && b && a !== b) links.push({ wire: wires[idx] || null, wIdx: idx, a, b, down });
        if (down && (a || b)) {
          const target = a || b;
          addFault(target, 'error');
          issues.push({
            id: `link-down-${idx}`,
            severity: 'error',
            node: target,
            title: `Port / Link DOWN (${a ? a.name : '?'} ↔ ${b ? b.name : '?'})`,
            desc: 'Kabel atau interface berstatus down sehingga frame tidak dapat lewat.',
            cli: `interface fa0/1\nno shutdown`
          });
        }
      });
    } else {
      wires.forEach((wire, wIdx) => {
        wire.classList.remove('nf5-wire-fault');
        const ends = getWireScreenEnds(wire);
        const a = findNodeAtPoint(ends.x1, ends.y1, nodes);
        const b = findNodeAtPoint(ends.x2, ends.y2, nodes);
        const down = isWireDown(wire);

        if (a) degreeMap.set(a.el, (degreeMap.get(a.el) || 0) + 1);
        if (b && b !== a) degreeMap.set(b.el, (degreeMap.get(b.el) || 0) + 1);
        if (a && b && a !== b) links.push({ wire, wIdx, a, b, down });

        if (down && (a || b)) {
          const target = a || b;
          addFault(target, 'error');
          issues.push({
            id: `link-down-${wIdx}`,
            severity: 'error',
            node: target,
            title: `Port / Link DOWN (${a ? a.name : '?'} ↔ ${b ? b.name : '?'})`,
            desc: 'Kabel atau interface berstatus administratively down sehingga frame tidak dapat lewat.',
            cli: `interface fa0/1\nno shutdown`
          });
        }
      });
    }

    // Rule A: Cek Duplikasi IP (IP Conflict)
    const ipOwners = new Map();
    nodes.forEach(n => {
      if (!n.ip) return;
      if (!ipOwners.has(n.ip)) ipOwners.set(n.ip, []);
      ipOwners.get(n.ip).push(n);
    });

    ipOwners.forEach((owners, ip) => {
      if (owners.length < 2) return;
      const names = owners.map(o => o.name).join(', ');
      owners.forEach(o => {
        addFault(o, 'error');
        issues.push({
          id: `dup-ip-${o.id}`,
          severity: 'error',
          node: o,
          title: `Konflik IP ${ip} pada ${o.name}`,
          desc: `Alamat IP ${ip} dipakai bersamaan oleh: ${names}. Setiap host harus memiliki IP unik.`,
          cli: o.isRouter
            ? `interface g0/0\nip address ${bumpLastOctet(ip)} 255.255.255.0\nno shutdown`
            : `set ip ${bumpLastOctet(ip)}/24`
        });
      });
    });

    // Rule B: Cek Subnet Mismatch pada link langsung antar perangkat L3
    links.forEach(({ wire, wIdx, a, b, down }) => {
      if (down) return;
      if (!a.isSwitch && !b.isSwitch && a.ip && b.ip && !sameSubnet(a.ip, a.cidr, b.ip, b.cidr)) {
        if (wire) faultyWires.add(wire);
        addFault(a, 'error');
        addFault(b, 'error');
        issues.push({
          id: `subnet-link-${wIdx}`,
          severity: 'error',
          node: a,
          title: `Subnet Mismatch: ${a.name} ↔ ${b.name}`,
          desc: `${a.name} (${a.ip}/${a.cidr}) terhubung langsung dengan ${b.name} (${b.ip}/${b.cidr}) namun berada di subnet berbeda.`,
          cli: `set ip ${suggestPeerIp(b.ip)}/${b.cidr}`
        });
      }
    });

    // Rule C: Cek End-Device yang belum punya IP atau Gateway saat ada Router
    const routers = nodes.filter(n => n.isRouter && n.ip);
    nodes.forEach(n => {
      if (n.statusDown) {
        addFault(n, 'error');
        issues.push({
          id: `node-down-${n.id}`,
          severity: 'error',
          node: n,
          title: `${n.name} dalam kondisi Shutdown`,
          desc: 'Perangkat atau port utamanya mati. Aktifkan kembali agar dapat mengirim paket.',
          cli: `no shutdown`
        });
      }

      const degree = degreeMap.get(n.el) || 0;
      if (nodes.length > 1 && degree === 0) {
        addFault(n, 'warn');
        issues.push({
          id: `unplugged-${n.id}`,
          severity: 'warn',
          node: n,
          title: `${n.name} belum terhubung kabel`,
          desc: 'Perangkat terisolasi dari topologi. Sambungkan kabel ke Switch atau Router terdekat.',
          cli: `devices`
        });
      }

      if (n.isEndDevice && degree > 0 && !n.ip) {
        addFault(n, 'warn');
        issues.push({
          id: `no-ip-${n.id}`,
          severity: 'warn',
          node: n,
          title: `${n.name} belum memiliki IP`,
          desc: 'Host belum dikonfigurasi IP statis maupun DHCP sehingga komunikasi Layer 3 gagal.',
          cli: `set ip 192.168.10.${10 + n.idx}/24`
        });
      }

      if (n.isEndDevice && n.ip && routers.length > 0) {
        const matchingRouter = routers.find(r => sameSubnet(n.ip, n.cidr, r.ip, r.cidr));
        if (!n.gateway && matchingRouter) {
          addFault(n, 'warn');
          issues.push({
            id: `no-gw-${n.id}`,
            severity: 'warn',
            node: n,
            title: `Default Gateway kosong pada ${n.name}`,
            desc: `Terdapat Router (${matchingRouter.name} · ${matchingRouter.ip}), tetapi gateway ${n.name} belum diisi untuk akses lintas subnet.`,
            cli: `set gw ${matchingRouter.ip}`
          });
        } else if (n.gateway && !sameSubnet(n.ip, n.cidr, n.gateway, n.cidr)) {
          addFault(n, 'error');
          issues.push({
            id: `bad-gw-${n.id}`,
            severity: 'error',
            node: n,
            title: `Gateway tidak terjangkau pada ${n.name}`,
            desc: `Gateway ${n.gateway} berada di luar subnet ${n.ip}/${n.cidr}. Paket keluar subnet akan di-drop.`,
            cli: matchingRouter
              ? `set gw ${matchingRouter.ip}`
              : `set gw ${suggestPeerIp(n.ip, 1)}`
          });
        }
      }
    });

    currentIssues = issues;
    applyCanvasMarkers(nodes, nodeFaultLevel, faultyWires);
    updateHudBadge();
    renderDrawerList();
  }

  function bumpLastOctet(ip) {
    const p = ip.split('.').map(Number);
    p[3] = p[3] >= 250 ? 2 : p[3] + 1;
    return p.join('.');
  }

  function suggestPeerIp(ip, forcedLastOctet) {
    const p = ip.split('.').map(Number);
    p[3] = forcedLastOctet || (p[3] >= 250 ? 10 : p[3] + 1);
    return p.join('.');
  }

  /* 5. Pasang penanda visual di Node & Kabel */
  function applyCanvasMarkers(nodes, faultMap, faultyWires) {
    faultyWires.forEach(w => w.classList.add('nf5-wire-fault'));

    const counts = new Map();
    currentIssues.forEach(iss => {
      if (!iss.node?.el) return;
      counts.set(iss.node.el, (counts.get(iss.node.el) || 0) + 1);
    });

    nodes.forEach(n => {
      const level = faultMap.get(n.el);
      n.el.classList.toggle('nf5-node-error', level === 'error');
      n.el.classList.toggle('nf5-node-warn', level === 'warn');
      if (level) n.el.setAttribute('data-nf5-fault', level);
      else n.el.removeAttribute('data-nf5-fault');

      let badge = n.el.querySelector('.nf5-fault-badge');
      const count = counts.get(n.el) || 0;

      if (!level || count === 0) {
        if (badge) badge.remove();
        return;
      }

      if (!badge) {
        badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'nf5-fault-badge';
        badge.title = 'Klik untuk lihat detail error perangkat ini';
        badge.addEventListener('click', e => {
          e.stopPropagation();
          const drawer = $('nf5Drawer');
          if (drawer) drawer.hidden = false;
          renderDrawerList();
        });
        n.el.appendChild(badge);
      }

      badge.className = `nf5-fault-badge${level === 'warn' ? ' warn' : ''}`;
      badge.textContent = `${level === 'warn' ? '⚠' : '!'} ${count}`;
    });
  }

  function updateHudBadge() {
    const btn = $('nf5DiagBtn');
    if (!btn) return;
    const errCount = currentIssues.filter(i => i.severity === 'error').length;
    const warnCount = currentIssues.filter(i => i.severity === 'warn').length;
    const total = currentIssues.length;

    btn.classList.toggle('has-error', errCount > 0);
    btn.classList.toggle('has-warn', errCount === 0 && warnCount > 0);

    if (total === 0) {
      btn.textContent = '✅ Topologi Sehat';
    } else if (errCount > 0) {
      btn.textContent = `🛑 ${errCount} Error${warnCount ? ` · ${warnCount} Warn` : ''}`;
    } else {
      btn.textContent = `⚠️ ${warnCount} Peringatan`;
    }
  }

  /* 6. Render daftar masalah & integrasi tombol >_ CLI */
  function renderDrawerList() {
    const list = $('nf5List');
    if (!list) return;

    const filtered = currentIssues.filter(i => activeFilter === 'all' || i.severity === activeFilter);

    if (filtered.length === 0) {
      list.innerHTML = `<div class="nf5-empty">${
        currentIssues.length === 0
          ? '🎉 Tidak ada salah konfigurasi terdeteksi. Topologi siap diuji ping atau simulasi paket!'
          : 'Tidak ada item pada filter ini.'
      }</div>`;
      return;
    }

    list.replaceChildren();
    filtered.forEach(issue => {
      const card = document.createElement('div');
      card.className = `nf5-card${issue.severity === 'warn' ? ' warn' : ''}`;
      card.innerHTML = `
        <div class="nf5-card-top">
          <span>${escapeHtml(issue.title)}</span>
          <span class="nf5-sev">${issue.severity === 'error' ? 'ERROR' : 'WARN'}</span>
        </div>
        <div class="nf5-desc">${escapeHtml(issue.desc)}</div>
        <pre class="nf5-cli-hint">${escapeHtml(issue.cli)}</pre>
        <div class="nf5-card-actions">
          <button type="button" class="nf5-act-btn nf5-focus-btn">🎯 Sorot Node</button>
          <button type="button" class="nf5-act-btn nf5-cli-btn">&gt;_ Kirim / Salin CLI</button>
        </div>
      `;

      card.querySelector('.nf5-focus-btn').addEventListener('click', () => {
        focusNode(issue.node?.el);
      });

      const cliBtn = card.querySelector('.nf5-cli-btn');
      cliBtn.addEventListener('click', () => {
        sendOrCopyCli(issue.node?.el, issue.cli, cliBtn);
      });

      list.appendChild(card);
    });
  }

  function focusNode(el) {
    if (!el) return;
    el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    el.classList.remove('nf5-node-focus');
    void el.offsetWidth;
    el.classList.add('nf5-node-focus');
  }

  function sendOrCopyCli(nodeEl, cmd, btn) {
    focusNode(nodeEl);

    const cliInput = document.querySelector(
      '#nf2CliInput, #nf64CliInput, #cliInput, [data-cli-input], .nf2-cli-input'
    );
    const firstCmd = cmd.split('\n').find(l => l.trim() && !l.trim().startsWith('#')) || cmd;

    if (cliInput && cliInput.offsetParent !== null) {
      cliInput.value = firstCmd;
      cliInput.focus();
      cliInput.dispatchEvent(new Event('input', { bubbles: true }));
      flashBtn(btn, '✅ Diisi ke CLI');
      return;
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).then(
        () => flashBtn(btn, '📋 Tersalin! Buka >_ CLI'),
        () => flashBtn(btn, 'ℹ️ Lihat perintah di atas')
      );
    } else {
      flashBtn(btn, 'ℹ️ Salin perintah di atas');
    }
  }

  function flashBtn(btn, msg) {
    const prev = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => { btn.textContent = prev; }, 1600);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(runDiagnostics, 260);
  }

  /* 7. Inisialisasi & Dynamic Observer (Unified + Classic Canvas) */
  function bindDynamicTargets() {
    injectUI();

    ['board', 'nf400Nodes'].forEach(id => {
      const el = $(id);
      if (el && !boundObs.has(id)) {
        boundObs.add(id);
        new MutationObserver(scheduleScan).observe(el, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['data-ip', 'data-mask', 'data-gateway', 'data-status']
        });
      }
    });

    ['wires', 'nf49BezierWires', 'nf400Wires'].forEach(id => {
      const el = $(id);
      if (el && !boundObs.has(id)) {
        boundObs.add(id);
        new MutationObserver(mutations => {
          const relevant = mutations.some(m => !(m.target?.id === 'nf4WireBadges' || m.target?.closest?.('#nf4WireBadges')));
          if (relevant) scheduleScan();
        }).observe(el, { childList: true, attributes: true, attributeFilter: ['x1', 'y1', 'x2', 'y2', 'd', 'stroke', 'data-status'] });
      }
    });

    scheduleScan();
    return Boolean($('nf400Modebar') && boundObs.has('nf400Nodes'));
  }

  function init() {
    $('cfgSave')?.addEventListener('click', () => setTimeout(runDiagnostics, 180));
    window.addEventListener('netforge:link-changed', scheduleScan);
    window.addEventListener('resize', scheduleScan);
    if (!bindDynamicTargets() && window.MutationObserver) {
      const bodyObs = new MutationObserver(() => {
        if (bindDynamicTargets()) bodyObs.disconnect();
      });
      bodyObs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => bodyObs.disconnect(), 20000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
