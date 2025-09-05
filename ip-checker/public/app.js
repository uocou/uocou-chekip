async function fetchJSON(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(url + ' -> HTTP ' + res.status);
    return res.json();
}

function renderGrid(data) {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
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
    add('边缘机房', data.colo);
    add('HTTP 协议', data.httpProtocol);
    add('TLS 版本', data.tlsVersion);
    add('RTT(估计)', data.clientTcpRtt);
    add('EU 国家', data.isEUCountry ? '是' : '否');
    add('UA', data.ua);
    add('语言', data.acceptLanguage);

    document.getElementById('json').textContent = JSON.stringify(data, null, 2);

    const share = document.getElementById('share');
    const url = new URL(location.href);
    url.searchParams.set('ip', data.ip || '');
    share.value = url.toString();
}

async function loadAll() {
    try {
        const me = await fetchJSON('/api/me');
        renderGrid(me);
    } catch (e) {
        document.getElementById('json').textContent = '加载 /api/me 失败：' + String(e);
    }

    try {
        const geo = await fetchJSON('/api/geo');
        document.getElementById('json2').textContent = JSON.stringify(geo, null, 2);
    } catch (e) {
        document.getElementById('json2').textContent = '加载 /api/geo 失败：' + String(e);
    }
}

document.getElementById('copy').onclick = async () => {
    const firstVal = document.querySelector('.val')?.textContent || '';
    try {
        await navigator.clipboard.writeText(firstVal);
        alert('已复制 IP：' + firstVal);
    } catch {
        alert('复制失败');
    }
};
document.getElementById('refresh').onclick = loadAll;

loadAll();
