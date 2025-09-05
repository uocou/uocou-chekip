async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(url + ' -> HTTP ' + res.status);
  return res.json();
}

function addCard(grid, label, value, extraClass = '') {
  const el = document.createElement('div');
  el.className = `item ${extraClass}`.trim();
  el.innerHTML = `<div class="key">${label}</div><div class="val">${value ?? '-'}</div>`;
  grid.appendChild(el);
}

function renderGrid(data) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // 显示顺序（10个）：ip，国家，州，城市，Postal，时区，经纬，ASN，Org，运营商
  const ipVal = data.ip;
  const latlon = (data.latitude && data.longitude) ? `${data.latitude}, ${data.longitude}` : '-';

  // 第一行：左占位、IP（居中）、右占位
  addCard(grid, '', '', 'placeholder');           // 第1列占位
  addCard(grid, 'IP', ipVal);                     // 第2列居中的 IP
  addCard(grid, '', '', 'placeholder');           // 第3列占位

  // 其余按 3 列自动排版
  const items = [
    ['国家', data.country],
    ['州', data.region],
    ['城市', data.city],
    ['Postal', data.postalCode],
    ['时区', data.timezone],
    ['经纬', latlon],
    ['ASN', data.asn],
    ['Org', data.asOrganization],
    ['运营商', data.asOrganization],
  ];

  for (const [k, v] of items) addCard(grid, k, v);
}

async function main() {
  try {
    const me = await fetchJSON('/api/me');
    renderGrid(me);
  } catch (e) {
    const grid = document.getElementById('grid');
    grid.innerHTML = `<div class="item"><div class="key">错误</div><div class="val">${String(e)}</div></div>`;
  }
}

main();
