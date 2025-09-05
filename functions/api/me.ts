export const onRequestGet: PagesFunction = async ({ request }) => {
  // @ts-ignore
  const cf = request.cf || {};
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";

  const data = {
    ip,
    asn: cf.asn,
    asOrganization: cf.asOrganization,
    country: cf.country,
    region: cf.region,
    city: cf.city,
    timezone: cf.timezone,
    latitude: cf.latitude,
    longitude: cf.longitude,
    postalCode: cf.postalCode,
    httpProtocol: cf.httpProtocol,
    tlsVersion: cf.tlsVersion,
    clientTcpRtt: cf.clientTcpRtt,
    colo: cf.colo,
    isEUCountry: !!cf.isEUCountry,
    ua: request.headers.get("User-Agent") || "",
    acceptLanguage: request.headers.get("Accept-Language") || "",
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};
