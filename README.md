# 🌐 IP Checker

一个无服务器 (Serverless) 的 **IP 查询网页**。  
前端使用 **Cloudflare Pages** 托管，后端使用 **Pages Functions** 提供 `/api/me`（Cloudflare 边缘数据）和 `/api/geo`（代理第三方 API）。

---

## ✨ 功能

- 获取并展示访问者的 **公网 IP**
- 显示 ASN、运营商、国家、地区、城市、时区
- Cloudflare 边缘数据：colo 节点、RTT、HTTP 协议、TLS 版本
- 可选代理第三方 API（例如 ipapi），支持 Key
- JSON 原始数据展示
- 一键复制 IP、分享链接
- 支持暗色模式 (Dark Mode)

---

## 🗂 项目结构

```
ip-checker/
├─ functions/
│  └─ api/
│     ├─ me.ts          # Cloudflare 边缘信息
│     └─ geo.ts         # 代理第三方 API
├─ public/
│  ├─ favicon.svg
│  ├─ style.css
│  └─ app.js
└─ index.html
```

---

## 🚀 部署

### 1. Fork / Clone
```bash
git clone https://github.com/yourname/ip-checker.git
cd ip-checker
```

### 2. Cloudflare Pages
1. 登录 Cloudflare Dashboard → Pages → **Create a project**  
2. 选择 **Connect to Git** → 选中你的仓库  
3. Build command: **空**  
4. Output directory: `/`  
5. 部署完成即可访问 `https://xxx.pages.dev`

### 3. 环境变量（可选）
如果你要用 `/api/geo` 代理第三方 ipapi 并使用 Key：  
进入 **Pages → Settings → Environment variables** 添加：
```
IPAPI_KEY=your_api_key_here
```

---

## 🔗 示例接口

- `/api/me` → Cloudflare 边缘 JSON（不依赖第三方）
- `/api/geo` → 第三方 API 代理（可带 KEY）

---

## 📜 许可

本项目基于 [MIT License](./LICENSE) 开源，欢迎 Fork 和二次开发。
