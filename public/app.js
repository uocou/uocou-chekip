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

function render(me, ispData) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  add(grid, 'IP', me.ip);
  add(grid, '国家', me.country);

  add(grid, '州', me.region);
  add(grid, '城市', me.city);

  add(grid, '邮编', me.postalCode);
  add(grid, 'ASN', me.asn);

  add(grid, 'ASN Organization', me.asOrganization);

  const isp =
    (ispData && (ispData.isp || ispData.connection_isp || ispData.org)) ||
    me.asOrganization || '-';
  add(grid, 'ISP', isp);
}

async function main() {
  try {
    const [me, ispData] = await Promise.all([
      fetchJSON('/api/me'),
      fetchJSON('/api/isp').catch(() => ({})),
    ]);
    render(me, ispData);
  } catch (e) {
    const grid = document.getElementById('grid');
    grid.innerHTML = `<div class="item"><div class="key">错误</div><div class="val">${String(e)}</div></div>`;
  }
}

main();
