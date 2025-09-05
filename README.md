# IP Checker (Two-Column Compact)

一个无服务器 (Serverless) 的 **IP 信息展示页**。  
前端托管在 **Cloudflare Pages**，后端使用 **Pages Functions** 提供接口，页面为**两列紧凑布局**，显示 8 个小卡片：

```
IP | 国家
州 | 城市
邮编 | ASN
ASN Organization | ISP
```

> 说明：
> - `ASN / ASN Organization` 来自 Cloudflare 边缘的 BGP 口径  
> - `ISP` 通过后端代理第三方（ipwho.is）获取的“接入网品牌”口径  
> - 两个口径不一定相同，出现不同并不代表错误

---

## 功能特性

- 显示访问者当前 IP 的关键信息（IP/国家/州/城市/邮编/ASN/ASN Org/ISP）
- 紧凑两列 UI（更小字号与间距）
- 后端边缘缓存（`/api/isp` 约 120 秒）减少第三方压力
- 完全“无服务器”，基于 Cloudflare Pages + Functions

---

## 目录结构

```
ip-checker/
├─ functions/
│  └─ api/
│     ├─ me.ts     # Cloudflare 边缘数据（ASN/Org/国家/州/城市/邮编等）
│     ├─ isp.ts    # 通过 ipwho.is 获取 ISP（带 120s 缓存）
│     └─ geo.ts    # 备用第三方地理接口（目前前端不使用，可留作扩展）
├─ public/
│  ├─ favicon.svg
│  ├─ style.css    # 两列紧凑样式
│  └─ app.js       # 前端渲染逻辑（只请求 /api/me 与 /api/isp）
└─ index.html
```

---

## 快速开始

### 1) 部署到 Cloudflare Pages
1. 将以上文件上传到你的 GitHub 仓库（保证 **目录结构在仓库根目录**）。
2. Cloudflare Dashboard → **Pages** → Create a project → **Connect to Git** → 选择仓库
3. 构建设置：
   - **Build command**：留空
   - **Build output directory**：`/`（根目录）
4. 部署完成后访问：
   - `https://<your-project>.pages.dev/`（首页）
   - `https://<your-project>.pages.dev/api/me`（Cloudflare 边缘 JSON）
   - `https://<your-project>.pages.dev/api/isp`（ISP JSON）

> **提示**：Pages 会自动识别 `functions/` 目录并启用 Functions。若 `/api/me` 返回 404，通常是目录没识别或路径不对。

### 2) （可选）环境变量
当前前端未使用 `/api/geo`，如需启用并带 Key：
- Pages 项目 → **Settings → Environment variables** 添加：
```
IPAPI_KEY = your_api_key_here
```
> `/api/geo` 不启用也不影响本项目核心功能。

---

## 数据来源与口径说明

- **ASN / ASN Organization**（BGP 口径）：来自 Cloudflare 边缘 `request.cf`，表示该前缀的**BGP 起源 AS 组织**（例如：`ATT-INTERNET4`）。
- **ISP**（接入口径）：从 ipwho.is 返回的 `connection.isp/org` 等字段抽取，表示**接入网络品牌**（例如：`AT&T Internet`）。

**为何不同站点显示不一致？**
- 不同站点使用**不同数据源/口径**（BGP vs. WHOIS/RDAP vs. ISP）。
- 你访问网站时可能用的是 **IPv4 vs. IPv6** 不同路径，结果对应不同 AS/ISP。
- 若使用 **VPN/WARP/代理/公司网关**，对外可见的是**出口网络**的信息。

---

## 本地调试（可选）

安装 Wrangler 并本地预览 Pages：
```bash
npm i -g wrangler
wrangler pages dev .
```
打开终端显示的地址（一般是 `http://127.0.0.1:8788`）测试：
- `/` 首页布局与渲染
- `/api/me` 与 `/api/isp` 返回 JSON

---

## 隐私与第三方说明

- `/api/me` **不调用任何第三方**，数据来自 Cloudflare 边缘元信息。  
- `/api/isp` 会从 **ipwho.is** 获取 ISP 信息，并在边缘缓存 ~120 秒。  
- 若要避免任何第三方调用，可在前端仅保留 `/api/me` 的字段（会失去 ISP 字段显示）。

---

## 常见问题

- **首页样式太大 / 太小**  
  调整 `public/style.css` 中的 `max-width`、`font-size`、`gap`、`padding` 等即可。

- **`/api/me` 404**  
  说明 Functions 未被识别。检查目录是否为 `functions/api/me.ts`（注意复数）并重新部署；Pages 构建输出目录请用 `/`。

- **CSS/JS 404**  
  确保公共资源路径是 `/public/style.css`、`/public/app.js`，且文件位于仓库 `public/` 目录下。

- **ISP 显示为 ASN Org**  
  当 ipwho.is 返回不足或失败时，前端会兜底为 `asOrganization`。可刷新或稍后重试。

---


## 许可

建议使用 MIT 许可。你可以在根目录放置 `LICENSE`（MIT）文件。

---

