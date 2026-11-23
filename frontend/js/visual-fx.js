/* NET FORGE v0.56.00 — Complete Living Graphics Controller (Pixel-Exact Bezier Cables & Pan/Zoom-Synced) */
(function () {
  'use strict';
  if (window.__NF4900_VFX) return;
  window.__NF4900_VFX = true;

  const $ = id => document.getElementById(id);
  const REDUCED = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pickThemeColor() {
    const theme = document.body.getAttribute('data-nf44-cable') || 'default';
    if (theme === 'matrix') return { stroke: '#22c55e', dot: '#86efac' };
    if (theme === 'cyber') return { stroke: '#d946ef', dot: '#f5d0fe' };
    if (theme === 'lava') return { stroke: '#f97316', dot: '#fed7aa' };
    return { stroke: '#38bdf8', dot: '#a5f3fc' };
  }

  function classifyNode(nodeEl) {
    const txt = (nodeEl.textContent || '').toLowerCase();
    if (/router|access point|\bap\b|wifi/.test(txt)) return 'wireless';
    if (/switch|server|nvr|camera|modem|firewall/.test(txt)) return 'rack';
    return 'client';
  }

  function ensureAmbientDust() {
    const canvas = $('nf400Canvas');
    if (!canvas || $('nf48AmbientDust') || REDUCED()) return;
    const dust = document.createElement('div');
    dust.id = 'nf48AmbientDust';
    dust.setAttribute('aria-hidden', 'true');
    const coords = [
      [8, 18, 0], [19, 72, 1.1], [31, 32, 2.2], [44, 80, 0.6],
      [56, 22, 1.8], [67, 64, 2.9], [78, 36, 0.9], [89, 74, 2.4],
      [14, 48, 3.1], [48, 52, 1.4], [73, 16, 2.6], [92, 28, 0.4]
    ];
    dust.innerHTML = coords.map(([x, y, d]) =>
      `<span class="nf48-dot" style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`
    ).join('');
    canvas.insertBefore(dust, canvas.firstChild);
  }

  function spawnPortRipple(portEl) {
    const canvas = $('nf400Canvas');
    if (!canvas || !portEl || REDUCED()) return;
    const cr = canvas.getBoundingClientRect();
    const pr = portEl.getBoundingClientRect();
    const rip = document.createElement('div');
    rip.className = 'nf48-ripple';
    rip.style.left = (pr.left - cr.left + pr.width / 2) + 'px';
    rip.style.top = (pr.top - cr.top + pr.height / 2) + 'px';
    canvas.appendChild(rip);
    setTimeout(() => rip.remove(), 550);
  }

  // Convert #nf400Wires viewBox coordinates (typically 0..100) to exact unscaled pixel coords inside host
  function getWireSpace(wiresSvg) {
    const host = wiresSvg.parentElement || $('nf400Canvas');
    const w = host.clientWidth || wiresSvg.clientWidth || 800;
    const h = host.clientHeight || wiresSvg.clientHeight || 400;
    const vb = (wiresSvg.getAttribute('viewBox') || '').trim().split(/\s+/).map(Number);
    const vbW = (vb.length === 4 && vb[2] > 0) ? vb[2] : w;
    const vbH = (vb.length === 4 && vb[3] > 0) ? vb[3] : h;
    return { host, w, h, sx: w / vbW, sy: h / vbH };
  }

  function bezierPointsPx(x1, y1, x2, y2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const sag = Math.min(48, Math.max(14, dist * 0.16));
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 + sag;
    return { x1, y1, cx, cy, x2, y2 };
  }

  let cachedBeziers = [];
  let wireObsAttached = false;

  function syncBezierCables() {
    const wiresSvg = $('nf400Wires');
    if (!wiresSvg) return;
    const sp = getWireSpace(wiresSvg);

    // Watch #nf400Wires mutations so Bezier curves update instantaneously on connect/drag/delete!
    if (!wireObsAttached && window.MutationObserver) {
      wireObsAttached = true;
      new MutationObserver(() => requestAnimationFrame(syncBezierCables)).observe(wiresSvg, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['x1', 'y1', 'x2', 'y2', 'class']
      });
    }

    const lines = [...wiresSvg.querySelectorAll('line.nf400-wire')];
    let bSvg = $('nf49BezierWires');
    if (!bSvg) {
      bSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      bSvg.id = 'nf49BezierWires';
      bSvg.setAttribute('aria-hidden', 'true');
    }
    if (bSvg.parentElement !== sp.host) {
      sp.host.appendChild(bSvg);
    }
    bSvg.setAttribute('viewBox', `0 0 ${sp.w} ${sp.h}`);
    bSvg.setAttribute('preserveAspectRatio', 'none');

    const theme = pickThemeColor();
    cachedBeziers = [];
    const frag = [];

    lines.forEach(ln => {
      const rx1 = parseFloat(ln.getAttribute('x1') || '0');
      const ry1 = parseFloat(ln.getAttribute('y1') || '0');
      const rx2 = parseFloat(ln.getAttribute('x2') || '0');
      const ry2 = parseFloat(ln.getAttribute('y2') || '0');
      if (rx1 === rx2 && ry1 === ry2) return;

      const x1 = rx1 * sp.sx;
      const y1 = ry1 * sp.sy;
      const x2 = rx2 * sp.sx;
      const y2 = ry2 * sp.sy;
      const isDown = ln.classList.contains('nf4045-down') || ln.classList.contains('down');
      const pt = bezierPointsPx(x1, y1, x2, y2);
      cachedBeziers.push({ ...pt, isDown, w: sp.w, h: sp.h });

      const d = `M ${pt.x1.toFixed(1)} ${pt.y1.toFixed(1)} Q ${pt.cx.toFixed(1)} ${pt.cy.toFixed(1)} ${pt.x2.toFixed(1)} ${pt.y2.toFixed(1)}`;
      const strokeCol = isDown ? '#ff5c7c' : theme.stroke;
      frag.push(
        `<path class="nf49-cable-glow" d="${d}" stroke="${strokeCol}" stroke-width="7"/>`,
        `<path class="nf49-cable-core ${isDown ? 'down' : ''}" d="${d}" stroke="${strokeCol}" stroke-width="2.8"/>`,
        `<circle cx="${pt.x1.toFixed(1)}" cy="${pt.y1.toFixed(1)}" r="3.4" fill="${strokeCol}"/>`,
        `<circle cx="${pt.x2.toFixed(1)}" cy="${pt.y2.toFixed(1)}" r="3.4" fill="${strokeCol}"/>`
      );
    });

    bSvg.innerHTML = frag.join('');
    document.body.classList.toggle('nf49-bezier-on', lines.length > 0);
  }

  function syncHardwareMicroFx() {
    ensureAmbientDust();
    syncBezierCables();
    const canvas = $('nf400Canvas');
    if (!canvas) return;
    canvas.querySelectorAll('.nf400-node').forEach(node => {
      const txt = node.textContent || '';
      const isOnline = /LINK UP|ONLINE|ACTIVE/i.test(txt) && !/OFFLINE/i.test(txt);
      const isHot = node.classList.contains('nf41-cat-hot');

      let steam = node.querySelector(':scope > .nf49-steam');
      if (isHot && !steam) {
        steam = document.createElement('div');
        steam.className = 'nf49-steam';
        steam.setAttribute('aria-hidden', 'true');
        steam.innerHTML = '<i></i><i></i><i></i>';
        node.appendChild(steam);
      } else if (!isHot && steam) {
        steam.remove();
      }

      let fx = node.querySelector(':scope > .nf47-fx-layer');
      if (!isOnline) {
        if (fx) fx.remove();
        return;
      }
      if (fx) return;
      fx = document.createElement('div');
      fx.className = 'nf47-fx-layer';
      fx.setAttribute('aria-hidden', 'true');
      const kind = classifyNode(node);
      let badge = '';
      if (kind === 'wireless') {
        badge = '<div class="nf47-radar"><span></span><span></span></div>';
      } else if (kind === 'rack') {
        badge = '<div class="nf47-leds"><span class="nf47-led"></span><span class="nf47-led"></span><span class="nf47-led"></span></div>';
      } else {
        badge = '<div class="nf47-wave"><i></i><i></i><i></i><i></i></div>';
      }
      fx.innerHTML = badge + '<div class="nf49-floor-glow"></div>';
      node.appendChild(fx);
    });
  }

  function emitAmbientTraffic() {
    if (document.hidden || REDUCED()) return;
    syncBezierCables();
    if (!cachedBeziers.length) return;
    const wiresSvg = $('nf400Wires');
    if (!wiresSvg) return;
    const sp = getWireSpace(wiresSvg);

    let layer = $('nf41PacketLayer');
    if (!layer) {
      layer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      layer.id = 'nf41PacketLayer';
    }
    if (layer.parentElement !== sp.host) {
      sp.host.appendChild(layer);
    }
    layer.setAttribute('viewBox', `0 0 ${sp.w} ${sp.h}`);
    layer.setAttribute('preserveAspectRatio', 'none');

    const theme = pickThemeColor();
    cachedBeziers.slice(0, 12).forEach((b, idx) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', b.isDown ? '#ff5c7c' : theme.dot);
      dot.setAttribute('opacity', '0.96');
      layer.appendChild(dot);

      const forward = (idx + Math.floor(Date.now() / 2000)) % 2 === 0;
      const startAt = performance.now() + (idx % 4) * 130;
      const dur = b.isDown ? 560 : 980;
      function step(ts) {
        const t = (ts - startAt) / dur;
        if (t < 0) { requestAnimationFrame(step); return; }
        if (t >= 1) { dot.remove(); return; }
        const p = b.isDown ? Math.min(0.5, t) : (forward ? t : 1 - t);
        const u = 1 - p;
        const bx = u * u * b.x1 + 2 * u * p * b.cx + p * p * b.x2;
        const by = u * u * b.y1 + 2 * u * p * b.cy + p * p * b.y2;
        dot.setAttribute('cx', bx.toFixed(1));
        dot.setAttribute('cy', by.toFixed(1));
        if (b.isDown && t > 0.45) dot.setAttribute('opacity', String(Math.max(0, 1 - (t - 0.45) * 2)));
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  window.addEventListener('resize', () => requestAnimationFrame(syncBezierCables));
  window.addEventListener('netforge:viewport-changed', () => requestAnimationFrame(syncBezierCables));

  let moveRaf = 0;
  document.addEventListener('pointermove', e => {
    if (e.buttons !== 1 || moveRaf) return;
    moveRaf = requestAnimationFrame(() => { moveRaf = 0; syncBezierCables(); });
  }, { passive: true });

  let lastWireCount = 0;
  document.addEventListener('click', e => {
    const port = e.target.closest?.('.nf4033-jack');
    setTimeout(() => {
      syncHardwareMicroFx();
      const cur = document.querySelectorAll('#nf400Wires line.nf400-wire').length;
      if (port && cur > lastWireCount) spawnPortRipple(port);
      lastWireCount = cur;
    }, 160);
  }, true);

  setInterval(syncHardwareMicroFx, 1600);
  setInterval(emitAmbientTraffic, 2000);

  window.NetForgeVisualFX = {
    version: '0.56.00',
    syncHardwareMicroFx,
    syncBezierCables,
    emitAmbientTraffic,
    spawnPortRipple
  };
})();
