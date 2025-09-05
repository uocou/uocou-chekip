export const onRequestGet: PagesFunction = async ({ request, env, next, waitUntil }) => {
    try {
        const ip = request.headers.get("CF-Connecting-IP") || "";
        const key = env.IPAPI_KEY; // 在 Cloudflare Pages -> Settings -> Environment variables 设置
        const apiUrl = key
            ? `https://ipapi.co/${ip}/json/?key=${encodeURIComponent(key)}`
            : `https://ipapi.co/${ip}/json/`;

        // 60 秒边缘缓存
        const cache = caches.default;
        const cacheKey = new Request(apiUrl, request);
        let resp = await cache.match(cacheKey);

        if (!resp) {
            const upstream = await fetch(apiUrl, { cf: { cacheTtl: 60, cacheEverything: false } });
            const json = await upstream.json();
            resp = new Response(JSON.stringify(json, null, 2), {
                headers: {
                    "content-type": "application/json; charset=utf-8",
                    "cache-control": "max-age=60",
                    "access-control-allow-origin": "*",
                },
            });
            waitUntil(cache.put(cacheKey, resp.clone()));
        }

        return resp;
    } catch (e: any) {
        return new Response(JSON.stringify({ error: String(e) }), {
            status: 500,
            headers: {
                "content-type": "application/json; charset=utf-8",
                "access-control-allow-origin": "*",
            },
        });
    }
};
