async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(url + ' -> HTTP ' + res.status);
  return res.json();
}

function renderGrid(data) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // 仅展示保留的字段
  const add = (k, v) => {
    const d = document.createElement('div');
    d.className = 'item';
    d.innerHTML = `<div class="key">${k}</div><div class="val">${v ?? '-'}</div>`;
    grid.appendChild(d);
  };

  add('IP', data.ip);
  add('ASN', data.asn);
  add('运营商', data.asOrganization);
  add('国家/地区', data.country);
  add('省/州', data.region);
  add('城市', data.city);
  add('时区', data.timezone);
  add('经纬度', (data.latitude && data.longitude) ? `${data.latitude}, ${data.longitude}` : '-');
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
