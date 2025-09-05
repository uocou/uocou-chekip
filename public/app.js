async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(url + ' -> HTTP ' + res.status);
  return res.json();
}

function add(grid, label, value) {
  const el = document.createElement('div');
  el.className = 'item';
  el.innerHTML = `<div class="key">${label}</div><div class="val">${value ?? '-'}</div>`;
  grid.appendChild(el);
}

function render(data) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // 两列顺序：
  // IP 国家 | 州 城市 | 邮编 ASN | ASN Organization ISP
  add(grid, 'IP', data.ip);
  add(grid, '国家', data.country);
  add(grid, '州', data.region);
  add(grid, '城市', data.city);
  add(grid, '邮编', data.postalCode);
  add(grid, 'ASN', data.asn);
  add(grid, 'ASN Organization', data.asOrganization);
  add(grid, 'ISP', data.isp);
}

/* —— UI 辅助：按钮 loading 状态 —— */
function setLoading(loading) {
  const btn = document.getElementById('ipBtn');
  if (!btn) return;
  if (loading) {
    btn.dataset._text = btn.textContent;
    btn.textContent = '查询中…';
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset._text || '查询';
    btn.disabled = false;
  }
}

/* —— 简单 IPv4/IPv6 校验（前端友好提示；后端仍有严格校验） —— */
function looksLikeIP(str) {
  if (!str) return false;
  str = str.trim();

  // IPv6（简化判断：包含冒号即认为是 IPv6 形态，由后端做严检）
  if (str.includes(':')) return /^[0-9a-fA-F:]+$/.test(str);

  // IPv4
  const m = str.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  return m.slice(1).every(oct => {
    const n = Number(oct);
    return oct.length <= 3 && n >= 0 && n <= 255;
  });
}

async function loadSelf() {
  try {
    const [me, ispData] = await Promise.all([
      fetchJSON('/api/me'),
      fetchJSON('/api/isp').catch(() => ({})),
    ]);
    const data = {
      ip: me.ip,
      country: me.country,
      region: me.region,
      city: me.city,
      postalCode: me.postalCode,
      asn: me.asn,
      asOrganization: me.asOrganization,
      isp: (ispData && (ispData.isp || ispData.connection_isp || ispData.org)) || me.asOrganization || '-',
    };
    render(data);
  } catch (e) {
    const grid = document.getElementById('grid');
    grid.innerHTML = `<div class="item"><div class="key">错误</div><div class="val">${String(e)}</div></div>`;
  }
}

async function lookupByInput() {
  const input = document.getElementById('ipInput');
  const ip = (input?.value || '').trim();
  if (!ip) return;
  if (!looksLikeIP(ip)) {
    input.focus();
    input.select?.();
    alert('请输入有效的 IPv4 或 IPv6 地址');
    return;
  }

  try {
    setLoading(true);
    const info = await fetchJSON('/api/lookup?ip=' + encodeURIComponent(ip));
    const data = {
      ip: info.ip ?? ip,
      country: info.country ?? '-',
      region: info.region ?? '-',
      city: info.city ?? '-',
      postalCode: info.postalCode ?? '-',
      asn: info.asn ?? '-',
      asOrganization: info.asOrganization ?? '-',
      isp: info.isp ?? info.asOrganization ?? '-',
    };
    render(data);
  } catch (e) {
    alert('查询失败：' + String(e));
  } finally {
    setLoading(false);
  }
}

function bindEvents() {
  const btn = document.getElementById('ipBtn');
  const input = document.getElementById('ipInput');
  if (btn) btn.addEventListener('click', lookupByInput);
  if (input) input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') lookupByInput();
  });
}

function main() {
  bindEvents();
  loadSelf();
}
main();
