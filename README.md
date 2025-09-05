# 🌐 IP Checker

A beautiful, serverless **IP info checker** powered by **Cloudflare Pages + Pages Functions**.  
Supports **your current IP** and **manual lookup of any IPv4/IPv6** via an input box.  
Clean two‑column UI, centered card, compact spacing — *simple, fast, and elegant*.

---

## ✨ Features

- 🧭 **Current IP auto‑detect** (via Cloudflare edge, no third‑party call)
- 🔍 **Manual IP lookup** (IPv4/IPv6) with input box + Enter/Click
- 🧱 **Two‑column compact layout**, centered card, mobile‑friendly
- 🔌 **ISP detection** (via ipwho.is) with edge caching (~120s)
- ⚡ Zero server to manage — **fully serverless** on Cloudflare

Displayed fields (8 cards):
```
IP | 国家
州 | 城市
邮编 | ASN
ASN Organization | ISP
```

> ℹ️ **Data sources & meanings**
> - `ASN` / `ASN Organization` → **BGP/AS** info from Cloudflare edge (`request.cf`)
> - `ISP` → **Access/retail provider** from ipwho.is (`connection.isp/org`)  
>   These may differ — *not an error*, just different perspectives (BGP vs ISP vs WHOIS).

---

## 🗂 Project Structure

```
ip-checker/
├─ functions/
│  └─ api/
│     ├─ me.ts       # Cloudflare edge data (ASN/Org/国家/州/城市/邮编...)
│     ├─ isp.ts      # ISP via ipwho.is (edge cache 120s)
│     ├─ lookup.ts   # 🔎 Query any IP (ipwho.is → ipapi fallback, unified fields, cache 120s)
│     └─ geo.ts      # Optional geo endpoint (currently unused by frontend)
├─ public/
│  ├─ favicon.svg
│  ├─ style.css      # Centered card + compact two‑column UI
│  └─ app.js         # Render + input lookup logic
└─ index.html        # Page with input + button + grid
```

---

## 🚀 Deploy (Cloudflare Pages)

1. Push this repo to GitHub.
2. In **Cloudflare Dashboard → Pages → Create a project → Connect to Git**, choose your repo.
3. **Build settings**  
   - Build command: **(leave empty)**  
   - Output directory: **/** (root)  
4. Deploy and open:
   - `https://<your-project>.pages.dev/` (Home)
   - `https://<your-project>.pages.dev/api/me` (Edge JSON)
   - `https://<your-project>.pages.dev/api/isp` (ISP JSON)
   - `https://<your-project>.pages.dev/api/lookup?ip=8.8.8.8` (Lookup API)

> 🧩 Pages will auto‑detect `functions/` and enable Functions.  
> If `/api/me` returns **404**, double‑check the folder is exactly `functions/api/me.ts` (plural).

---

## 🧪 Local Dev (optional)

```bash
npm i -g wrangler
wrangler pages dev .
# Usually served at http://127.0.0.1:8788
```

Test:
- `/` home UI
- `/api/me`, `/api/isp`, `/api/lookup?ip=8.8.8.8`

---

## 🔐 Privacy & Third‑Party

- `/api/me` uses **Cloudflare edge metadata** only (no external calls).
- `/api/isp` & `/api/lookup` call **ipwho.is**, with ~120s edge caching.
- `/api/lookup` falls back to **ipapi.co** if ipwho.is fails (also cached).

> To avoid third‑party entirely, remove `ISP` from UI and skip `/api/isp` & `/api/lookup` calls.

---

## 🛠 Troubleshooting

- **Functions 404** → Ensure `functions/api/*.ts` path is correct; Output directory = `/`.
- **CSS/JS 404** → Ensure assets are under `public/` and referenced as `/public/style.css`, `/public/app.js`.
- **ISP shows ASN Org** → ipwho.is may be rate‑limited or missing data; UI falls back to `asOrganization`.
- **Different results vs other sites** → V4/V6 routes, VPN/proxy exits, and data freshness can differ.

---

## 🎛 Customization

- 🌏 Country name localization → Map country codes to Chinese names in `app.js`.
- 🏷 Add “IP Organization (WHOIS handle)” → Add an RDAP endpoint and render org + handle (e.g., ARIN `CIL-250`).
- 🎨 Tweak UI compactness → Edit `public/style.css` (card width, gap, font‑size).

---

## 📄 License

You can use **MIT License**. Drop a `LICENSE` (MIT) in the repo root if you need one.
