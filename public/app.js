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

  // 顺序（两列）：
  // IP 国家
  // 州 城市
  // 邮编 ASN
  // ASN Organization ISP
  add(grid, 'IP', data.ip);
  add(grid, '国家', data.country);
  add(grid, '州', data.region);
  add(grid, '城市', data.city);
  add(grid, '邮编', data.postalCode);
  add(grid, 'ASN', data.asn);
  add(grid, 'ASN Organization', data.asOrganization);
  add(grid, 'ISP', data.isp);
}

async function loadSelf() {
  // 初始：显示“当前访问者”的信息
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
  const ip = document.getElementById('ipInput').value.trim();
  if (!ip) return;
  try {
    const info = await fetchJSON('/api/lookup?ip=' + encodeURIComponent(ip));
    // 后端已做归一化，这里直接渲染
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
