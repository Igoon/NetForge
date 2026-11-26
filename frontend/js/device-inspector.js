/* NET FORGE v0.69.8 — Contextual Device Inspector, Switch Port Strip & Mini CLI */
(function () {
  'use strict';
  if (window.__NF2_INSPECTOR) return;
  window.__NF2_INSPECTOR = true;

  const $ = id => document.getElementById(id);

  let lastClickedType = null;
  let currentRole = 'pc';
  let activeTab = 'gui';
  let selectedPortIdx = 0;
  const switchPortStore = new Map();
  const cliHistory = [];
  let historyPtr = -1;

  const DEFAULT_PORTS = [
    { id: 'Fa0/1', speed: '100M', mode: 'access', vlan: 10, up: true },
    { id: 'Fa0/2', speed: '100M', mode: 'access', vlan: 10, up: true },
    { id: 'Fa0/3', speed: '100M', mode: 'access', vlan: 20, up: false },
    { id: 'Fa0/4', speed: '100M', mode: 'access', vlan: 20, up: false },
    { id: 'Fa0/5', speed: '100M', mode: 'access', vlan: 10, up: false },
    { id: 'Fa0/6', speed: '100M', mode: 'access', vlan: 10, up: false },
    { id: 'Gi0/1', speed: '1G', mode: 'trunk', vlan: 1, up: true },
    { id: 'Gi0/2', speed: '1G', mode: 'trunk', vlan: 1, up: false }
  ];

  /* Rekam tipe node yang terakhir diklik di kanvas sebelum modal terbuka */
  document.addEventListener('pointerdown', e => {
    const node = e.target.closest?.('.nf400-node, .node, [data-type], [data-device-type]');
    if (!node || !node.closest('#board, #nf400Canvas')) return;
    const raw = (
      node.getAttribute('data-type') ||
      node.getAttribute('data-device-type') ||
      node.textContent ||
      ''
    ).toLowerCase();
    lastClickedType = inferRoleFromText(raw);
  }, true);

  function inferRoleFromText(text) {
    const t = String(text || '').toLowerCase();
    if (/\brouter\b|\bgateway\b|\bwan\b|\br\d+\b/.test(t)) return 'router';
    if (/\bswitch\b|\bsw\d+\b|\bvlan\b|\btrunk\b/.test(t)) return 'switch';
    if (/\bserver\b|\bsrv\b|\bpve\b|\bproxmox\b|\bdns\b|\bweb\b/.test(t)) return 'server';
    if (/\bpc\b|\bworkstation\b|\bclient\b|\bdesktop\b|\blaptop\b/.test(t)) return 'pc';
    return null;
  }

  function detectDeviceRole() {
    const titleTxt = $('deviceConfigTitle')?.textContent || '';
    const nameVal = $('cfgName')?.value || '';
    const ifaceVal = $('cfgInterface')?.value || '';
    const dhcpField = $('dhcpToggleField');
    const dhcpShown = dhcpField && getComputedStyle(dhcpField).display !== 'none' && !dhcpField.classList.contains('nf2-hidden');

    const byTitle = inferRoleFromText(titleTxt);
    if (byTitle) return byTitle;

    const byName = inferRoleFromText(nameVal + ' ' + ifaceVal);
    if (byName) return byName;

    if (lastClickedType) return lastClickedType;
    if (dhcpShown && $('cfgDHCP')?.value === 'on') return 'router';
    return 'pc';
  }

  /* Helper IPv4 & Subnet */
  function parseIPv4(ip) {
    const parts = String(ip || '').trim().split('.');
    if (parts.length !== 4) return null;
    const nums = parts.map(p => (/^\d+$/.test(p) ? Number(p) : -1));
    if (nums.some(n => n < 0 || n > 255)) return null;
    return (((nums[0] << 24) >>> 0) + (nums[1] << 16) + (nums[2] << 8) + nums[3]) >>> 0;
  }

  function intToIPv4(n) {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  }

  function prefixToMask(prefix) {
    const p = Math.min(32, Math.max(0, Number(prefix) || 0));
    return p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
  }

  function getFieldBox(inputId) {
    return $(inputId)?.closest('.config-field') || null;
  }

  function setFieldVisible(inputId, visible) {
    const box = getFieldBox(inputId);
    if (box) box.classList.toggle('nf2-hidden', !visible);
  }

  /* Bangun UI tambahan di dalam #deviceConfigModal */
  function ensureUI() {
    const modal = $('deviceConfigModal');
    const dialog = modal?.querySelector('.config-modal');
    const grid = dialog?.querySelector('.config-grid');
    if (!modal || !dialog || !grid) return false;

    if (!$('nf2HeaderBar')) {
      const bar = document.createElement('div');
      bar.id = 'nf2HeaderBar';
      bar.className = 'nf2-header-bar';
      bar.innerHTML = `
        <div class="nf2-role-pills" role="group" aria-label="Tipe perangkat">
          <button type="button" data-role="pc">Workstation</button>
          <button type="button" data-role="switch">Switch</button>
          <button type="button" data-role="router">Router</button>
          <button type="button" data-role="server">Server</button>
        </div>
        <div class="nf2-mode-tabs" role="tablist">
          <button type="button" role="tab" id="nf2TabGui" class="active" aria-selected="true">⚙ GUI</button>
          <button type="button" role="tab" id="nf2TabCli" aria-selected="false">&gt;_ CLI</button>
        </div>
      `;
      grid.parentElement.insertBefore(bar, grid);

      bar.querySelectorAll('.nf2-role-pills button').forEach(btn => {
        btn.addEventListener('click', () => {
          currentRole = btn.dataset.role;
          applyRoleLayout();
        });
      });

      $('nf2TabGui').addEventListener('click', () => switchInspectorTab('gui'));
      $('nf2TabCli').addEventListener('click', () => switchInspectorTab('cli'));
    }

    if (!$('nf2SubnetHint')) {
      const hint = document.createElement('div');
      hint.id = 'nf2SubnetHint';
      hint.className = 'nf2-subnet-hint';
      const prefixBox = getFieldBox('cfgPrefix');
      if (prefixBox) {
        prefixBox.insertAdjacentElement('afterend', hint);
      } else {
        grid.appendChild(hint);
      }
    }

    if (!$('nf2PortStripBox')) {
      const box = document.createElement('div');
      box.id = 'nf2PortStripBox';
      box.className = 'nf2-port-strip-box';
      box.hidden = true;
      box.innerHTML = `
        <div class="nf2-port-strip-head">
          <span>🔌 SWITCH PORT PANEL · LAYER 2</span>
          <span id="nf2PortSummary">8 Ports</span>
        </div>
        <div class="nf2-port-grid" id="nf2PortGrid"></div>
        <div class="nf2-port-editor" id="nf2PortEditor">
          <strong id="nf2SelPortName">Fa0/1</strong>
          <label>Mode:
            <select id="nf2PortMode">
              <option value="access">Access</option>
              <option value="trunk">Trunk (802.1Q)</option>
            </select>
          </label>
          <label id="nf2PortVlanWrap">VLAN:
            <input id="nf2PortVlan" type="number" min="1" max="4094" value="10" style="width:68px"/>
          </label>
          <span id="nf2PortSpeed" class="nf2-port-meta">100Mbps</span>
        </div>
      `;
      grid.parentElement.insertBefore(box, grid);

      $('nf2PortMode').addEventListener('change', updateSelectedPort);
      $('nf2PortVlan').addEventListener('input', updateSelectedPort);
    }

    if (!$('nf2CliWrap')) {
      const cli = document.createElement('div');
      cli.id = 'nf2CliWrap';
      cli.className = 'nf2-cli-wrap';
      cli.hidden = true;
      cli.innerHTML = `
        <div class="nf2-cli-quick" aria-label="Perintah cepat">
          <button type="button" data-cmd="ip addr">ip addr</button>
          <button type="button" data-cmd="show ip route">ip route</button>
          <button type="button" data-cmd="show vlan">show vlan</button>
          <button type="button" data-cmd="ping gateway">ping gw</button>
          <button type="button" data-cmd="help">help</button>
        </div>
        <pre class="nf2-cli-screen" id="nf2CliScreen" aria-live="polite"></pre>
        <div class="nf2-cli-inputrow">
          <span class="nf2-cli-prompt" id="nf2CliPrompt">host&gt;</span>
          <input class="nf2-cli-input" id="nf2CliInput" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik perintah (mis: ip addr, ping 192.168.10.1, help)"/>
        </div>
      `;
      grid.insertAdjacentElement('afterend', cli);

      cli.querySelectorAll('.nf2-cli-quick button').forEach(btn => {
        btn.addEventListener('click', () => runCliCommand(btn.dataset.cmd));
      });

      const input = $('nf2CliInput');
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const cmd = input.value.trim();
          if (cmd) {
            cliHistory.unshift(cmd);
            historyPtr = -1;
            runCliCommand(cmd);
          }
          input.value = '';
        } else if (e.key === 'ArrowUp') {
          if (cliHistory.length && historyPtr + 1 < cliHistory.length) {
            historyPtr++;
            input.value = cliHistory[historyPtr];
            e.preventDefault();
          }
        } else if (e.key === 'ArrowDown') {
          if (historyPtr > 0) {
            historyPtr--;
            input.value = cliHistory[historyPtr];
          } else {
            historyPtr = -1;
            input.value = '';
          }
          e.preventDefault();
        }
      });
    }

    if (!modal.__nf2Bound) {
      modal.__nf2Bound = true;
      ['cfgIP', 'cfgPrefix', 'cfgGateway', 'cfgMode', 'cfgDHCP', 'cfgPoolStart', 'cfgPoolEnd'].forEach(id => {
        $(id)?.addEventListener('input', updateLiveHints);
        $(id)?.addEventListener('change', updateLiveHints);
      });
    }

    return true;
  }

  function switchInspectorTab(tab) {
    activeTab = tab;
    const isGui = tab === 'gui';
    const grid = document.querySelector('#deviceConfigModal .config-grid');
    const strip = $('nf2PortStripBox');
    const cli = $('nf2CliWrap');

    if (grid) grid.style.display = isGui ? '' : 'none';
    if (strip) strip.hidden = !isGui || currentRole !== 'switch';
    if (cli) cli.hidden = isGui;

    $('nf2TabGui')?.classList.toggle('active', isGui);
    $('nf2TabGui')?.setAttribute('aria-selected', String(isGui));
    $('nf2TabCli')?.classList.toggle('active', !isGui);
    $('nf2TabCli')?.setAttribute('aria-selected', String(!isGui));

    if (!isGui) {
      updateCliPrompt();
      const screen = $('nf2CliScreen');
      if (screen && !screen.textContent.trim()) {
        appendCli(`NET FORGE Device CLI · Ketik 'help' untuk daftar perintah.\n`);
        runCliCommand('ip addr', true);
      }
      setTimeout(() => $('nf2CliInput')?.focus(), 40);
    }
  }

  function applyRoleLayout() {
    document.querySelectorAll('#nf2HeaderBar .nf2-role-pills button').forEach(b => {
      b.classList.toggle('active', b.dataset.role === currentRole);
    });

    const isRouter = currentRole === 'router';
    const isSwitch = currentRole === 'switch';
    const isEndpoint = currentRole === 'pc' || currentRole === 'server';

    setFieldVisible('cfgMode', isEndpoint);
    setFieldVisible('cfgIP', !isSwitch);
    setFieldVisible('cfgPrefix', !isSwitch);
    setFieldVisible('cfgGateway', isEndpoint);
    setFieldVisible('cfgDNS', isEndpoint);
    setFieldVisible('cfgVLAN', isSwitch || currentRole === 'pc');
    setFieldVisible('cfgInterface', true);

    const showDhcpPool = isRouter;
    $('dhcpToggleField')?.classList.toggle('nf2-hidden', !showDhcpPool);
    $('dhcpStartField')?.classList.toggle('nf2-hidden', !showDhcpPool);
    $('dhcpEndField')?.classList.toggle('nf2-hidden', !showDhcpPool);

    const strip = $('nf2PortStripBox');
    if (strip) strip.hidden = activeTab !== 'gui' || !isSwitch;
    if (isSwitch) renderPortStrip();

    updateLiveHints();
    updateCliPrompt();
  }

  function updateLiveHints() {
    const hint = $('nf2SubnetHint');
    if (!hint) return;

    const isDhcpClient = (currentRole === 'pc' || currentRole === 'server') && $('cfgMode')?.value === 'dhcp';
    ['cfgIP', 'cfgPrefix', 'cfgGateway', 'cfgDNS'].forEach(id => {
      getFieldBox(id)?.classList.toggle('nf2-dimmed', isDhcpClient);
    });

    if (currentRole === 'switch') {
      hint.innerHTML = `<span class="nf2-ok">● Layer 2 Switch</span><span>Kelola port Access/Trunk pada strip di atas.</span>`;
      return;
    }

    if (isDhcpClient) {
      hint.innerHTML = `<span class="nf2-ok">● DHCP Client Aktif</span><span>IP, Prefix, Gateway, dan DNS akan diperoleh otomatis dari Router.</span>`;
      return;
    }

    const ipInt = parseIPv4($('cfgIP')?.value);
    const prefix = parseInt($('cfgPrefix')?.value, 10);
    if (ipInt === null || isNaN(prefix) || prefix < 1 || prefix > 32) {
      hint.innerHTML = `<span class="nf2-warn">⚠ Masukkan IPv4 valid &amp; Prefix (1–32) untuk melihat kalkulasi subnet.</span>`;
      return;
    }

    const maskInt = prefixToMask(prefix);
    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | (~maskInt >>> 0)) >>> 0;
    let html = `<span>Mask: <b>${intToIPv4(maskInt)}</b></span><span>Network: <b>${intToIPv4(netInt)}/${prefix}</b></span>`;

    const gwStr = ($('cfgGateway')?.value || '').trim();
    if (gwStr && (currentRole === 'pc' || currentRole === 'server')) {
      const gwInt = parseIPv4(gwStr);
      if (gwInt === null) {
        html += `<span class="nf2-warn">⚠ Format Gateway tidak valid</span>`;
      } else if (((gwInt & maskInt) >>> 0) !== netInt || gwInt === netInt || gwInt === bcastInt) {
        html += `<span class="nf2-warn">⚠ Gateway di luar subnet ${intToIPv4(netInt)}/${prefix}</span>`;
      } else {
        html += `<span class="nf2-ok">✓ Gateway satu subnet</span>`;
      }
    }

    if (currentRole === 'router' && $('cfgDHCP')?.value === 'on') {
      const s = parseIPv4($('cfgPoolStart')?.value);
      const e = parseIPv4($('cfgPoolEnd')?.value);
      if (s !== null && e !== null && e >= s) {
        html += `<span class="nf2-ok">Pool DHCP: ${e - s + 1} alamat</span>`;
      } else {
        html += `<span class="nf2-warn">⚠ Rentang DHCP belum valid</span>`;
      }
    }

    hint.innerHTML = html;
  }

  /* Switch Port Strip State */
  function getSwitchPorts() {
    const key = ($('cfgName')?.value || 'switch').trim();
    if (!switchPortStore.has(key)) {
      const baseVlan = parseInt($('cfgVLAN')?.value, 10) || 10;
      const cloned = DEFAULT_PORTS.map((p, idx) => ({
        ...p,
        vlan: p.mode === 'access' && idx < 2 ? baseVlan : p.vlan
      }));
      switchPortStore.set(key, cloned);
    }
    return switchPortStore.get(key);
  }

  function renderPortStrip() {
    const grid = $('nf2PortGrid');
    if (!grid) return;
    const ports = getSwitchPorts();
    grid.innerHTML = '';

    ports.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nf2-port-btn' + (idx === selectedPortIdx ? ' selected' : '');
      const ledClass = p.mode === 'trunk' && p.up ? 'trunk' : p.up ? 'up' : '';
      const label = p.mode === 'trunk' ? 'TRUNK' : `VLAN ${p.vlan}`;
      btn.innerHTML = `
        <span class="nf2-port-top"><span>${p.id}</span><i class="nf2-port-led ${ledClass}"></i></span>
        <span class="nf2-port-meta">${label} · ${p.speed}</span>
      `;
      btn.addEventListener('click', () => {
        selectedPortIdx = idx;
        renderPortStrip();
      });
      grid.appendChild(btn);
    });

    const cur = ports[selectedPortIdx] || ports[0];
    $('nf2SelPortName').textContent = cur.id;
    $('nf2PortMode').value = cur.mode;
    $('nf2PortVlan').value = cur.vlan;
    $('nf2PortVlanWrap').style.display = cur.mode === 'trunk' ? 'none' : '';
    $('nf2PortSpeed').textContent = `${cur.speed} · ${cur.up ? 'LINK UP' : 'READY'}`;
  }

  function updateSelectedPort() {
    const ports = getSwitchPorts();
    const cur = ports[selectedPortIdx];
    if (!cur) return;
    cur.mode = $('nf2PortMode').value;
    const v = Math.min(4094, Math.max(1, parseInt($('nf2PortVlan').value, 10) || 1));
    cur.vlan = v;

    const hasTrunk = ports.some(p => p.mode === 'trunk');
    const uniqueAccessVlans = [...new Set(ports.filter(p => p.mode === 'access').map(p => p.vlan))].sort((a, b) => a - b);
    if ($('cfgInterface')) {
      $('cfgInterface').value = hasTrunk ? 'trunk' : 'access';
    }
    if ($('cfgVLAN')) {
      $('cfgVLAN').value = hasTrunk
        ? (uniqueAccessVlans.length ? uniqueAccessVlans.join(',') : String(v))
        : String(v);
    }
    renderPortStrip();
  }

  /* Mini Terminal CLI per perangkat */
  function updateCliPrompt() {
    const p = $('nf2CliPrompt');
    if (!p) return;
    const host = ($('cfgName')?.value || currentRole || 'device').trim().replace(/\s+/g, '-');
    p.textContent = currentRole === 'router' || currentRole === 'switch' ? `${host}#` : `${host}$`;
  }

  function appendCli(text) {
    const screen = $('nf2CliScreen');
    if (!screen) return;
    screen.textContent += text;
    screen.scrollTop = screen.scrollHeight;
  }

  function runCliCommand(raw, silentEcho) {
    const cmd = String(raw || '').trim();
    if (!cmd) return;
    const prompt = $('nf2CliPrompt')?.textContent || '>';
    if (!silentEcho) appendCli(`${prompt} ${cmd}\n`);

    const parts = cmd.split(/\s+/);
    const head = parts[0].toLowerCase();
    const rest = parts.slice(1).join(' ');
    const ip = $('cfgIP')?.value || 'unassigned';
    const prefix = $('cfgPrefix')?.value || '24';
    const gw = $('cfgGateway')?.value || 'none';
    const dns = $('cfgDNS')?.value || 'none';
    const iface = $('cfgInterface')?.value || 'eth0';
    const mode = $('cfgMode')?.value || 'static';
    const vlan = $('cfgVLAN')?.value || '1';

    if (head === 'clear' || head === 'cls') {
      $('nf2CliScreen').textContent = '';
      return;
    }

    if (head === 'help' || head === '?') {
      appendCli(
        `Perintah tersedia:\n` +
        `  ip addr | show ip int brief   Tampilkan IP, mask, gateway & VLAN\n` +
        `  show ip route                 Tampilkan tabel rute lokal\n` +
        `  show vlan                     Tampilkan tabel port VLAN (Switch)\n` +
        `  set ip <ip>/<prefix>          Ubah IP (lalu klik Simpan)\n` +
        `  set gw <ip> | set vlan <id>   Ubah gateway atau VLAN\n` +
        `  ping <target>                 Uji koneksi via engine game\n` +
        `  traceroute <target>           Lacak hop ke tujuan\n` +
        `  clear                         Bersihkan layar\n`
      );
      return;
    }

    if (cmd === 'ip addr' || cmd === 'ifconfig' || /^show\s+ip\s+int/i.test(cmd)) {
      const mask = intToIPv4(prefixToMask(prefix));
      appendCli(
        `${iface}: <UP,BROADCAST,MULTICAST> mtu 1500 mode=${mode} vlan=${vlan}\n` +
        `    inet ${ip}/${prefix} netmask ${mask}\n` +
        `    default-gw ${gw}  dns ${dns}\n`
      );
      if (currentRole === 'router' && $('cfgDHCP')?.value === 'on') {
        appendCli(`    dhcp-server pool: ${$('cfgPoolStart')?.value} - ${$('cfgPoolEnd')?.value}\n`);
      }
      return;
    }

    if (/^(show\s+)?ip\s+route$/i.test(cmd) || cmd === 'route') {
      const ipInt = parseIPv4(ip);
      const maskInt = prefixToMask(prefix);
      const net = ipInt !== null ? intToIPv4((ipInt & maskInt) >>> 0) : '0.0.0.0';
      appendCli(
        `C   ${net}/${prefix} is directly connected, ${iface}\n` +
        (gw !== 'none' && gw ? `S*  0.0.0.0/0 via ${gw}, ${iface}\n` : '')
      );
      return;
    }

    if (/^show\s+vlan/i.test(cmd)) {
      const ports = getSwitchPorts();
      appendCli(`Port     Mode     VLAN   Speed   Status\n`);
      ports.forEach(p => {
        appendCli(
          `${p.id.padEnd(8)} ${p.mode.padEnd(8)} ${(p.mode === 'trunk' ? '1-4094' : String(p.vlan)).padEnd(6)} ${p.speed.padEnd(7)} ${p.up ? 'up' : 'down'}\n`
        );
      });
      return;
    }

    if (head === 'set' && parts[1]) {
      const key = parts[1].toLowerCase();
      const val = parts[2] || '';
      if (key === 'ip' && val) {
        const [newIp, newPref] = val.split('/');
        if (parseIPv4(newIp) !== null && $('cfgIP')) {
          $('cfgIP').value = newIp;
          if (newPref && $('cfgPrefix')) $('cfgPrefix').value = newPref;
          if ($('cfgMode')) $('cfgMode').value = 'static';
          updateLiveHints();
          appendCli(`OK: IP diatur ke ${newIp}/${$('cfgPrefix')?.value || prefix} (klik "Simpan konfigurasi" untuk menerapkan).\n`);
          return;
        }
      } else if ((key === 'gw' || key === 'gateway') && parseIPv4(val) !== null) {
        if ($('cfgGateway')) $('cfgGateway').value = val;
        updateLiveHints();
        appendCli(`OK: Default gateway diatur ke ${val}.\n`);
        return;
      } else if (key === 'vlan' && Number(val) >= 1 && Number(val) <= 4094) {
        if ($('cfgVLAN')) $('cfgVLAN').value = String(Number(val));
        appendCli(`OK: VLAN diatur ke ${Number(val)}.\n`);
        return;
      }
      appendCli(`Format salah. Contoh: set ip 192.168.10.15/24 | set gw 192.168.10.1 | set vlan 10\n`);
      return;
    }

    if (head === 'ping' || head === 'traceroute') {
      delegatePingOrTrace(head, rest);
      return;
    }

    appendCli(`Perintah tidak dikenal: '${cmd}'. Ketik 'help'.\n`);
  }

  function delegatePingOrTrace(kind, targetText) {
    const srcSel = $('pingSource');
    const dstSel = $('pingTarget');
    const btn = kind === 'traceroute' ? $('traceBtn') : $('pingBtn');
    const resBox = $('pingResult');
    if (!srcSel || !dstSel || !btn || !resBox) {
      appendCli(`Engine terminal utama tidak ditemukan.\n`);
      return;
    }

    const hostName = ($('cfgName')?.value || '').toLowerCase();
    const myIp = ($('cfgIP')?.value || '').toLowerCase();

    const srcMatch = [...srcSel.options].find(o =>
      (hostName && o.textContent.toLowerCase().includes(hostName)) ||
      (myIp && o.textContent.toLowerCase().includes(myIp))
    );
    if (srcMatch) srcSel.value = srcMatch.value;

    const q = String(targetText || '').toLowerCase();
    if (q) {
      const dstMatch = [...dstSel.options].find(o =>
        o.value.toLowerCase().includes(q) || o.textContent.toLowerCase().includes(q)
      );
      if (dstMatch) dstSel.value = dstMatch.value;
    }

    btn.click();
    setTimeout(() => {
      const out = (resBox.textContent || '').trim();
      appendCli((out || 'Menunggu hasil...') + '\n');
    }, 120);
  }

  /* Pantau saat #deviceConfigModal dibuka oleh core-engine.js */
  function onModalStateChange() {
    const modal = $('deviceConfigModal');
    if (!modal) return;
    const isOpen = modal.classList.contains('open') || getComputedStyle(modal).display !== 'none';
    if (!isOpen) return;

    ensureUI();
    currentRole = detectDeviceRole();
    activeTab = 'gui';
    if ($('nf2CliScreen')) $('nf2CliScreen').textContent = '';
    switchInspectorTab('gui');
    applyRoleLayout();
  }


  /* =========================================================================
     v0.69.8 — Unified Canvas (#nf400Inspector) Live Subnet Hint & Quick CLI
     ========================================================================= */
  function enhanceUnifiedInspector() {
    const el = $('nf400Inspector');
    if (!el || !el.classList.contains('nf4014-open')) return;
    if (el.querySelector('.nf2-unified-addon')) return;

    const addon = document.createElement('div');
    addon.className = 'nf2-unified-addon';
    addon.style.cssText = 'margin-top:10px;display:flex;flex-direction:column;gap:8px;';

    const hint = document.createElement('div');
    hint.className = 'nf2-subnet-hint';
    addon.appendChild(hint);

    const cliBtn = document.createElement('button');
    cliBtn.type = 'button';
    cliBtn.textContent = '>_ Buka Terminal CLI Perangkat';
    cliBtn.style.cssText = 'align-self:flex-start;padding:5px 10px;border-radius:7px;border:1px solid #34d399;background:rgba(6,78,59,0.45);color:#6ee7b7;font:700 11.5px ui-monospace,monospace;cursor:pointer;';
    cliBtn.addEventListener('click', () => {
      window.NetForgeNetTools?.open?.('cli');
    });
    addon.appendChild(cliBtn);

    function refreshUnifiedHint() {
      const inputs = [...el.querySelectorAll('input')];
      const ipInp = inputs.find(i => /192\.168|ipv4/i.test(i.placeholder || '') || /ipv4/i.test(i.parentElement?.textContent || ''));
      const gwInp = inputs.find(i => /gateway/i.test(i.placeholder || '') || /gateway/i.test(i.parentElement?.textContent || ''));
      const maskInp = inputs.find(i => /255\.255|mask|prefix/i.test(i.placeholder || '') || /mask|prefix/i.test(i.parentElement?.textContent || ''));

      const titleTxt = (el.querySelector('strong')?.textContent || '').toLowerCase();
      if (/\bswitch\b/.test(titleTxt)) {
        hint.innerHTML = '<span class="nf2-ok">● Layer 2 Switch</span><span>Gunakan VLAN ID (mis. 10,20) &amp; mode trunk jika diperlukan oleh misi/ujian.</span>';
        return;
      }
      const ipStr = (ipInp?.value || '').trim();
      const ipInt = parseIPv4(ipStr);
      if (ipInt === null) {
        hint.innerHTML = '<span class="nf2-warn">⚠ Isi alamat IPv4 valid (mis. 192.168.10.20) untuk melihat validasi subnet live.</span>';
        return;
      }
      let prefix = 24;
      const mVal = (maskInp?.value || '').trim();
      if (/^\d{1,2}$/.test(mVal)) {
        prefix = Math.min(32, Math.max(1, Number(mVal)));
      } else if (parseIPv4(mVal) !== null) {
        const mInt = parseIPv4(mVal);
        prefix = mInt.toString(2).replace(/0/g, '').length;
      }
      const maskInt = prefixToMask(prefix);
      const netInt = (ipInt & maskInt) >>> 0;
      const bcastInt = (netInt | (~maskInt >>> 0)) >>> 0;
      let html = `<span>Mask: <b>${intToIPv4(maskInt)}</b></span><span>Network: <b>${intToIPv4(netInt)}/${prefix}</b></span>`;
      const gwStr = (gwInp?.value || '').trim();
      if (gwStr) {
        const gwInt = parseIPv4(gwStr);
        if (gwInt === null) {
          html += '<span class="nf2-warn">⚠ Format Gateway tidak valid</span>';
        } else if (((gwInt & maskInt) >>> 0) !== netInt || gwInt === netInt || gwInt === bcastInt) {
          html += `<span class="nf2-warn">⚠ Gateway di luar subnet ${intToIPv4(netInt)}/${prefix}</span>`;
        } else {
          html += '<span class="nf2-ok">✓ Gateway satu subnet</span>';
        }
      }
      hint.innerHTML = html;
    }

    el.addEventListener('input', refreshUnifiedHint);
    el.addEventListener('change', refreshUnifiedHint);
    el.appendChild(addon);
    refreshUnifiedHint();
  }

  function bindUnifiedInspectorObserver() {
    const el = $('nf400Inspector');
    if (!el || el.__nf2UniBound) return Boolean(el);
    el.__nf2UniBound = true;
    const obs = new MutationObserver(() => enhanceUnifiedInspector());
    obs.observe(el, { childList: true, attributes: true, attributeFilter: ['class'] });
    enhanceUnifiedInspector();
    return true;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const modal = $('deviceConfigModal');
    if (modal) {
      ensureUI();
      new MutationObserver(onModalStateChange).observe(modal, {
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }
    if (!bindUnifiedInspectorObserver() && window.MutationObserver) {
      const bodyObs = new MutationObserver(() => {
        if (bindUnifiedInspectorObserver()) bodyObs.disconnect();
      });
      bodyObs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => bodyObs.disconnect(), 20000);
    }
  });
})();
