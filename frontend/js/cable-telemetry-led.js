/* NET FORGE v0.72.1 — Live Cable Telemetry & Port LED (Unified + Classic Canvas) */
(function () {
  'use strict';
  if (window.__NF4_CABLE_TELEMETRY) return;
  window.__NF4_CABLE_TELEMETRY = true;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);

  let labelsVisible = true;
  let rebuildScheduled = false;
  let packetLoopId = null;
  let hoveredWire = null;
  const boundObservers = new Set();

  /* 1. Tombol toggle label kabel di Modebar Unified Canvas atau HUD Klasik */
  function injectHudToggle() {
    const host = $('nf400Modebar') || $('nf24Hud');
    if (!host) return false;
    let btn = $('nf4LabelToggle');
    if (btn) {
      if ($('nf400Modebar') && btn.parentElement !== $('nf400Modebar')) {
        $('nf400Modebar').appendChild(btn);
      }
      return true;
    }

    btn = document.createElement('button');
    btn.id = 'nf4LabelToggle';
    btn.type = 'button';
    btn.className = 'nf4-hud-toggle';
    btn.textContent = '⚡ Link LED';
    btn.title = 'Tampilkan/sembunyikan badge status di kabel';

    btn.addEventListener('click', () => {
      labelsVisible = !labelsVisible;
      document.body.classList.toggle('nf4-hide-labels', !labelsVisible);
      btn.classList.toggle('off', !labelsVisible);
    });

    host.appendChild(btn);
    return true;
  }

  /* 2. Pilih SVG kabel yang aktif (Unified Canvas #nf49BezierWires/#nf400Wires atau Klasik #wires) */
  function getActiveWireSvg() {
    const isMixed = document.body.classList.contains('nf400-mixed');
    if (isMixed) {
      const bz = $('nf49BezierWires');
      if (bz && bz.querySelector('path, line')) return bz;
      const u = $('nf400Wires');
      if (u) return u;
    }
    return $('wires') || $('nf49BezierWires') || $('nf400Wires');
  }

  function getWireElements() {
    const svg = getActiveWireSvg();
    if (!svg) return [];
    return [...svg.querySelectorAll('line, path')].filter(el => {
      if (el.closest('#nf4WireBadges') || el.closest('defs') || el.closest('marker')) return false;
      if (el.classList.contains('nf4-ignore')) return false;
      return true;
    });
  }

  /* 3. Baca metadata status & VLAN dari atribut/style kabel */
  function readWireMeta(wire) {
    const cls = (wire.getAttribute('class') || '').toLowerCase();
    const statusAttr = (wire.dataset.status || wire.dataset.state || '').toLowerCase();
    const strokeAttr = (wire.getAttribute('stroke') || getComputedStyle(wire).stroke || '').toLowerCase();
    const rawLabel = [
      wire.dataset.vlan ? `VLAN ${wire.dataset.vlan}` : '',
      wire.dataset.label || '',
      wire.getAttribute('aria-label') || '',
      wire.querySelector('title')?.textContent || ''
    ].filter(Boolean).join(' ');

    const isDown =
      statusAttr === 'down' ||
      statusAttr === 'off' ||
      cls.includes('down') ||
      cls.includes('broken') ||
      cls.includes('inactive') ||
      strokeAttr.includes('239, 68, 68') ||
      strokeAttr.includes('244, 63, 94') ||
      strokeAttr === '#ef4444';

    const vlanMatch = rawLabel.match(/vlan\s*[:#-]?\s*(\d+)/i);
    const vlan = wire.dataset.vlan || (vlanMatch ? vlanMatch[1] : '');
    const isTx = wire.classList.contains('nf4-wire-tx');

    const badgeText = isDown ? 'DOWN' : vlan ? `V${vlan}` : isTx ? 'TX' : 'UP';
    const portInfo = wire.dataset.ports || wire.dataset.ifaces || rawLabel || 'Ethernet Link';

    return { isDown, isTx, vlan, badgeText, portInfo };
  }

  /* 4. Hitung titik tengah kabel pada ruang koordinat SVG */
  function getWireSvgMidpoint(wire) {
    if (wire.tagName.toLowerCase() === 'line') {
      const x1 = parseFloat(wire.getAttribute('x1')) || 0;
      const y1 = parseFloat(wire.getAttribute('y1')) || 0;
      const x2 = parseFloat(wire.getAttribute('x2')) || 0;
      const y2 = parseFloat(wire.getAttribute('y2')) || 0;
      return { x: (x1 + x2) / 2, y: (y1 + y2) / 2, len: Math.hypot(x2 - x1, y2 - y1) };
    }
    if (typeof wire.getTotalLength === 'function') {
      try {
        const len = wire.getTotalLength();
        if (!len || !Number.isFinite(len)) return null;
        const pt = wire.getPointAtLength(len / 2);
        return { x: pt.x, y: pt.y, len };
      } catch {
        return null;
      }
    }
    return null;
  }

  /* 5. Hitung segmen kabel pada koordinat layar untuk deteksi paket melintas */
  function getWireScreenSegment(wire) {
    const ctm = typeof wire.getScreenCTM === 'function' ? wire.getScreenCTM() : null;
    if (ctm) {
      if (wire.tagName.toLowerCase() === 'line') {
        const p1 = new DOMPoint(
          parseFloat(wire.getAttribute('x1')) || 0,
          parseFloat(wire.getAttribute('y1')) || 0
        ).matrixTransform(ctm);
        const p2 = new DOMPoint(
          parseFloat(wire.getAttribute('x2')) || 0,
          parseFloat(wire.getAttribute('y2')) || 0
        ).matrixTransform(ctm);
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

  function pointToSegmentDist(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  /* 6. Render badge SVG di SVG aktif & pasang event hover tooltip */
  function rebuildWireTelemetry() {
    rebuildScheduled = false;
    const svg = getActiveWireSvg();
    if (!svg) return;

    // Skip SVG badge rendering on normalized 0..100 viewBox (#nf400Wires) where pixel fonts distort
    const isNormalizedViewBox = svg.id === 'nf400Wires';
    const wires = getWireElements();

    if (!isNormalizedViewBox) {
      let group = svg.querySelector('#nf4WireBadges');
      if (!group) {
        group = document.createElementNS(SVG_NS, 'g');
        group.id = 'nf4WireBadges';
        svg.appendChild(group);
      } else if (svg.lastElementChild !== group) {
        svg.appendChild(group);
      }

      const frag = document.createDocumentFragment();
      wires.forEach((wire, idx) => {
        const meta = readWireMeta(wire);
        wire.classList.toggle('nf4-wire-down', meta.isDown);
        wire.classList.toggle('nf4-wire-up', !meta.isDown);

        if (!wire.__nf4HoverBound) {
          wire.__nf4HoverBound = true;
          wire.style.pointerEvents = 'stroke';
          wire.addEventListener('mouseenter', e => showWireTip(wire, e));
          wire.addEventListener('mousemove', moveWireTip);
          wire.addEventListener('mouseleave', hideWireTip);
        }

        const mid = getWireSvgMidpoint(wire);
        if (!mid || mid.len < 28) return;

        const w = Math.max(24, meta.badgeText.length * 6.5 + 10);
        const h = 15;
        const g = document.createElementNS(SVG_NS, 'g');
        g.dataset.wireIdx = String(idx);

        const rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('x', (mid.x - w / 2).toFixed(1));
        rect.setAttribute('y', (mid.y - h / 2).toFixed(1));
        rect.setAttribute('width', String(w));
        rect.setAttribute('height', String(h));
        rect.setAttribute('rx', '7.5');
        rect.setAttribute('class', `nf4-badge-pill${meta.isDown ? ' down' : meta.isTx ? ' tx' : ''}`);

        const text = document.createElementNS(SVG_NS, 'text');
        text.setAttribute('x', mid.x.toFixed(1));
        text.setAttribute('y', mid.y.toFixed(1));
        text.setAttribute('class', `nf4-badge-text${meta.isDown ? ' down' : meta.isTx ? ' tx' : ''}`);
        text.textContent = meta.badgeText;

        g.appendChild(rect);
        g.appendChild(text);
        frag.appendChild(g);
      });
      group.replaceChildren(frag);
    }

    syncNodePortLeds(wires);
  }

  function scheduleRebuild() {
    if (rebuildScheduled) return;
    rebuildScheduled = true;
    requestAnimationFrame(rebuildWireTelemetry);
  }

  /* 7. Sinkronkan LED LINK & ACT pada setiap node di kanvas */
  function getCanvasNodes() {
    return [...document.querySelectorAll('#nf400Canvas .nf400-node, #board .node')];
  }

  function syncNodePortLeds(wires) {
    const wireList = wires || getWireElements();
    const wireSegments = wireList.map(w => ({
      wire: w,
      seg: getWireScreenSegment(w),
      meta: readWireMeta(w)
    }));

    getCanvasNodes().forEach(node => {
      let strip = node.querySelector('.nf4-led-strip');
      if (!strip) {
        strip = document.createElement('div');
        strip.className = 'nf4-led-strip';
        strip.innerHTML = '<span class="nf4-led link" title="Link Status"></span><span class="nf4-led act" title="Packet Activity"></span>';
        node.appendChild(strip);
      }

      const nr = node.getBoundingClientRect();
      let hasUpLink = false;
      let hasDownLink = false;
      let hasTx = node.classList.contains('nf3-node-active');

      wireSegments.forEach(({ seg, meta }) => {
        const endNear =
          (seg.x1 >= nr.left - 18 && seg.x1 <= nr.right + 18 && seg.y1 >= nr.top - 18 && seg.y1 <= nr.bottom + 18) ||
          (seg.x2 >= nr.left - 18 && seg.x2 <= nr.right + 18 && seg.y2 >= nr.top - 18 && seg.y2 <= nr.bottom + 18);
        if (!endNear) return;
        if (meta.isDown) hasDownLink = true;
        else hasUpLink = true;
        if (meta.isTx) hasTx = true;
      });

      const linkLed = strip.querySelector('.nf4-led.link');
      const actLed = strip.querySelector('.nf4-led.act');
      if (linkLed) {
        linkLed.classList.toggle('link-up', hasUpLink);
        linkLed.classList.toggle('link-down', !hasUpLink && hasDownLink);
      }
      if (actLed) {
        actLed.classList.toggle('act-tx', hasTx);
      }
    });
  }

  /* 8. Lacak paket #nf70PacketLayer yang melintas di atas kabel */
  function isPacketSimRunning() {
    const hud = $('nf70PacketHud');
    const layer = $('nf70PacketLayer');
    const hudOpen = Boolean(hud && !hud.hidden);
    const hasPackets = Boolean(layer && layer.children.length > 0);
    return hudOpen || hasPackets;
  }

  function tickPacketOverlay() {
    packetLoopId = null;
    const layer = $('nf70PacketLayer');
    const wires = getWireElements();

    if (!isPacketSimRunning()) {
      wires.forEach(w => w.classList.remove('nf4-wire-tx'));
      syncNodePortLeds(wires);
      return;
    }

    const packetEls = layer ? [...layer.children].filter(el => el.offsetParent !== null || el.getBoundingClientRect().width > 0) : [];
    const packetCenters = packetEls.map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    wires.forEach(wire => {
      const seg = getWireScreenSegment(wire);
      const hit = packetCenters.some(p => pointToSegmentDist(p.x, p.y, seg.x1, seg.y1, seg.x2, seg.y2) <= 24);
      wire.classList.toggle('nf4-wire-tx', hit);
    });

    syncNodePortLeds(wires);
    packetLoopId = requestAnimationFrame(tickPacketOverlay);
  }

  function ensurePacketLoop() {
    if (!packetLoopId && isPacketSimRunning()) {
      packetLoopId = requestAnimationFrame(tickPacketOverlay);
    }
  }

  /* 9. Tooltip Telemetri Kabel */
  function ensureTipEl() {
    let tip = $('nf4WireTip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'nf4WireTip';
      tip.hidden = true;
      document.body.appendChild(tip);
    }
    return tip;
  }

  function showWireTip(wire, ev) {
    hoveredWire = wire;
    const tip = ensureTipEl();
    const meta = readWireMeta(wire);
    tip.innerHTML = `
      <div class="nf4-tip-head">
        <span>Kabel Jaringan</span>
        <span class="nf4-tip-state${meta.isDown ? ' down' : ''}">${meta.isDown ? 'DOWN' : 'UP'}</span>
      </div>
      <div class="nf4-tip-meta">
        <div>Info: ${escapeHtml(meta.portInfo)}</div>
        <div>VLAN: ${meta.vlan ? escapeHtml(meta.vlan) : 'Default / Untagged'}</div>
        <div>Trafik: ${meta.isTx ? 'TX/RX Aktif' : meta.isDown ? 'Putus / Shutdown' : 'Idle'}</div>
      </div>
    `;
    tip.hidden = false;
    moveWireTip(ev);
  }

  function moveWireTip(ev) {
    const tip = $('nf4WireTip');
    if (!tip || tip.hidden || !hoveredWire) return;
    const x = Math.min(window.innerWidth - 260, ev.clientX + 14);
    const y = Math.min(window.innerHeight - 95, ev.clientY + 14);
    tip.style.left = `${Math.max(8, x)}px`;
    tip.style.top = `${Math.max(8, y)}px`;
  }

  function hideWireTip() {
    hoveredWire = null;
    const tip = $('nf4WireTip');
    if (tip) tip.hidden = true;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* 10. Inisialisasi & Dynamic Observer (Unified Canvas + Classic) */
  function bindDynamicTargets() {
    injectHudToggle();

    ['wires', 'nf49BezierWires', 'nf400Wires'].forEach(id => {
      const el = $(id);
      if (el && !boundObservers.has(id)) {
        boundObservers.add(id);
        new MutationObserver(mutations => {
          const relevant = mutations.some(m => {
            if (m.target && (m.target.id === 'nf4WireBadges' || m.target.closest?.('#nf4WireBadges'))) return false;
            if (m.type === 'attributes' && m.attributeName === 'class') return false;
            return true;
          });
          if (relevant) scheduleRebuild();
        }).observe(el, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['x1', 'y1', 'x2', 'y2', 'd', 'stroke', 'data-status', 'data-vlan']
        });
      }
    });

    ['board', 'nf400Nodes'].forEach(id => {
      const el = $(id);
      if (el && !boundObservers.has(id)) {
        boundObservers.add(id);
        new MutationObserver(() => scheduleRebuild()).observe(el, { childList: true });
      }
    });

    ['nf70PacketHud', 'nf70PacketLayer'].forEach(id => {
      const el = $(id);
      if (el && !boundObservers.has(id)) {
        boundObservers.add(id);
        new MutationObserver(() => ensurePacketLoop()).observe(el, {
          childList: true,
          attributes: true,
          attributeFilter: ['hidden', 'style', 'class']
        });
      }
    });

    scheduleRebuild();
    return Boolean($('nf400Modebar') && boundObservers.has('nf49BezierWires') && boundObservers.has('nf400Nodes'));
  }

  function init() {
    $('cfgSave')?.addEventListener('click', () => setTimeout(scheduleRebuild, 160));
    window.addEventListener('resize', scheduleRebuild);
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
