export const onRequestGet: PagesFunction = async ({ request, waitUntil }) => {
  const url = new URL(request.url);
  const q = (url.searchParams.get("ip") || "").trim();

  // 仅允许常见的 IPv4/IPv6 字符，避免 SSRF 类输入
  if (!q || !/^[A-Fa-f0-9\.:]+$/.test(q)) {
    return new Response(JSON.stringify({ error: "invalid or missing ip" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  const normalize = (src: any, from: "ipwhois" | "ipapi") => {
    if (from === "ipwhois") {
      const conn = src?.connection || {};
      return {
        ip: src?.ip || q,
        country: src?.country_code || src?.country || null,
        region: src?.region || null,
        city: src?.city || null,
        postalCode: src?.postal || null,
        asn: conn?.asn || null,
        asOrganization: conn?.org || conn?.asn || null,
        isp: conn?.isp || conn?.org || null,
      };
    } else {
      // ipapi
      return {
        ip: src?.ip || q,
        country: src?.country || src?.country_code || null,
        region: src?.region || src?.region_code || null,
        city: src?.city || null,
        postalCode: src?.postal || src?.postal_code || null,
        asn: src?.asn || null,
        asOrganization: src?.org || src?.asn || null,
        isp: src?.org || null,
      };
    }
  };

  try {
    const cache = caches.default;

    // 1) ipwho.is
    const u1 = `https://ipwho.is/${encodeURIComponent(q)}`;
    const c1 = new Request(u1, request);
    let r1 = await cache.match(c1);
    if (!r1) {
      const uresp1 = await fetch(u1, { cf: { cacheTtl: 120 } });
      const j1 = await uresp1.json();
      if (j1 && j1.success !== false) {
        const body = JSON.stringify(normalize(j1, "ipwhois"), null, 2);
        r1 = new Response(body, {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "max-age=120",
            "access-control-allow-origin": "*",
          },
        });
        waitUntil(cache.put(c1, r1.clone()));
        return r1;
      }
    } else {
      return r1;
    }

    // 2) fallback: ipapi.co
    const u2 = `https://ipapi.co/${encodeURIComponent(q)}/json/`;
    const c2 = new Request(u2, request);
    let r2 = await cache.match(c2);
    if (!r2) {
      const uresp2 = await fetch(u2, { cf: { cacheTtl: 120 } });
      const j2 = await uresp2.json();
      const body2 = JSON.stringify(normalize(j2, "ipapi"), null, 2);
      r2 = new Response(body2, {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "max-age=120",
          "access-control-allow-origin": "*",
        },
      });
      waitUntil(cache.put(c2, r2.clone()));
    }
    return r2;
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" },
    });
  }
};
