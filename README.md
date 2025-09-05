# uocou-chekip

A minimalist **IP checker** built with **Cloudflare Pages + Pages Functions**. Clean, fast, and ready to deploy.

**Demo:** https://uocou-chekip.pages.dev *(after deployment)*

[![GitHub](https://img.shields.io/badge/GitHub-uocou%2Fuocou--chekip-181717?logo=github)](https://github.com/uocou/uocou-chekip)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
![License: MIT](https://img.shields.io/badge/License-MIT-2ea44f)

---

### 📖 Read this in other languages:
- **[CN 中文说明](README_CN.md)**

---

## ✅ Features

### 🎨 Design
- Pure static front-end + serverless APIs: `index.html` / `public/style.css` / `public/app.js`
- Centered card, compact two‑column layout
- Clean visual style with subtle shadows & spacing
- Smooth focus & hover states for inputs and buttons

### ♿ Accessibility
- Clear page title and landmarks
- Keyboard-friendly focus outlines
- Accessible button and input attributes

### ⚡ Performance
- No framework, no build step
- Edge‑side caching for third‑party lookups
- Minimal JavaScript, no external dependencies

### 🔌 Integration
- Cloudflare Pages + Pages Functions (no server to maintain)
- Uses Cloudflare Edge info for ASN/Org
- ISP via ipwho.is (with fallback in lookup)

---

## 🔎 What it shows (8 cards)

```
IP | Country
Region/State | City
Postal Code | ASN
ASN Organization | ISP
```

> `ASN/ASN Organization` come from **Cloudflare edge (BGP)**, while `ISP` comes from **ipwho.is** (access/retail brand).  
> They can differ — this is expected (different data sources/perspectives).

---

## 🖼 Preview

![preview](/preview.png)

---

## 🚀 Quick Start

### 1) Clone repo
```bash
git clone https://github.com/uocou/uocou-chekip.git
cd uocou-chekip
```

### 2) Local preview (choose one)

**Best (with Cloudflare Functions):**
```bash
npm i -g wrangler
wrangler pages dev .
# usually served at http://127.0.0.1:8788
```

**Simplest (UI only; APIs won't work locally):**
```bash
# with Python
python -m http.server 8000
# or open index.html directly in your browser
```

### 3) Deploy to Cloudflare Pages
1. Cloudflare Dashboard → **Pages** → Create a project → **Connect to Git** → choose this repo  
2. Build settings:
   - **Build command**: *(leave empty)*
   - **Output directory**: `/`
3. After deploy:
   - `https://<your-project>.pages.dev/` (Home)
   - `https://<your-project>.pages.dev/api/me` (Edge JSON)
   - `https://<your-project>.pages.dev/api/isp` (ISP JSON)
   - `https://<your-project>.pages.dev/api/lookup?ip=8.8.8.8` (Lookup API)

---

## 🔐 Privacy & Third‑Party

- `/api/me`: Cloudflare edge metadata only (no third‑party).
- `/api/isp` & `/api/lookup`: use **ipwho.is**, cached ~120s; lookup falls back to **ipapi.co**.
- To avoid third‑party entirely, remove the ISP card and related API calls.

---

## 🧰 Tech Stack
- **Cloudflare Pages / Pages Functions**
- **HTML + CSS + Vanilla JS**
- No frameworks, no bundlers

---

## 📜 License

Licensed under the **MIT License**. See `LICENSE`.

