export const onRequestGet: PagesFunction = async ({ request, waitUntil }) => {
  try {
    const ip = request.headers.get("CF-Connecting-IP") || "";
    const apiUrl = `https://ipwho.is/${encodeURIComponent(ip)}`;

    const cache = caches.default;
    const cacheKey = new Request(apiUrl, request);
    let resp = await cache.match(cacheKey);
    if (!resp) {
      const upstream = await fetch(apiUrl, { cf: { cacheTtl: 120, cacheEverything: false } });
      const json = await upstream.json();
      const isp = (json && json.connection && (json.connection.isp || json.connection.org)) || json.org || null;
      resp = new Response(JSON.stringify({ isp, raw_ok: json && json.success !== false ? true : false }), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "max-age=120",
          "access-control-allow-origin": "*",
        },
      });
      waitUntil(cache.put(cacheKey, resp.clone()));
    }
    return resp;
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" },
    });
  }
};
