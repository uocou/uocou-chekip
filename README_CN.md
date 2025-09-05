# uocou-chekip

一个基于 **Cloudflare Pages + Pages Functions** 的极简 **IP 查询**页面。轻量、快速、即开即用。

**演示**：https://ip.uocou.com 

[![GitHub](https://img.shields.io/badge/GitHub-uocou%2Fuocou--chekip-181717?logo=github)](https://github.com/uocou/uocou-chekip)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![License: MIT](https://img.shields.io/badge/License-MIT-2ea44f)

---

### 📖 其他语言版本：
- **[English README](README.md)**

---

## ✅ 特性

### 🎨 设计
- 纯前端 + 无服务器接口：`index.html` / `public/style.css` / `public/app.js`
- 整体卡片居中、两列紧凑布局
- 清爽配色与阴影
- 输入框与按钮具备良好交互反馈

### ♿ 易用性
- 明确的标题与结构
- 键盘可见的焦点样式
- 友好的可访问属性

### ⚡ 性能
- 无框架、无打包构建
- 边缘缓存第三方请求
- 极少 JS、无外部依赖

### 🔌 集成
- Cloudflare Pages + Pages Functions（无需自备服务器）
- Cloudflare Edge 提供 ASN/Org
- ISP 来自 ipwho.is（lookup 内置回退）

---

## 🔎 页面显示（8 张卡片）

```
IP | 国家
州/省 | 城市
邮编 | ASN
ASN Organization | ISP
```

> `ASN/ASN Organization` 来自 **Cloudflare 边缘（BGP 口径）**；`ISP` 来自 **ipwho.is**（接入/零售品牌）。  
> 两者可能不同，这是**正常**现象（数据口径不同）。

---

## 🖼 预览

![预览图](/preview.png)

---

## 🚀 快速开始

### 1) 克隆仓库
```bash
git clone https://github.com/uocou/uocou-chekip.git
cd uocou-chekip
```

### 2) 本地预览（二选一）

**推荐（支持 Functions）：**
```bash
npm i -g wrangler
wrangler pages dev .
# 一般是在 http://127.0.0.1:8788
```

**最简单（仅UI，接口在本地不可用）：**
```bash
# Python 静态服务
python -m http.server 8000
# 或者直接用浏览器打开 index.html
```

### 3) 部署到 Cloudflare Pages
1. Cloudflare Dashboard → **Pages** → Create a project → **Connect to Git** → 选择仓库  
2. 构建设置：
   - **Build command**：留空
   - **Output directory**：`/`
3. 部署完成后可访问：
   - `https://<your-project>.pages.dev/`（首页）
   - `https://<your-project>.pages.dev/api/me`（边缘 JSON）
   - `https://<your-project>.pages.dev/api/isp`（ISP JSON）
   - `https://<your-project>.pages.dev/api/lookup?ip=8.8.8.8`（任意 IP 查询）

---

## 🔐 隐私与第三方

- `/api/me` 仅使用 **Cloudflare 边缘元信息**（不访问外部服务）。
- `/api/isp` 与 `/api/lookup` 调用 **ipwho.is**（约 120 秒边缘缓存）。
- `/api/lookup` 在异常时回退 **ipapi.co**。
- 若想完全避开第三方，可在前端移除 ISP 卡片与相关请求。

---

## 🧰 技术栈
- **Cloudflare Pages / Pages Functions**
- **HTML + CSS + 原生 JS**
- 无框架、无打包

---

## 📜 许可

本项目采用 **MIT License**，详见 `LICENSE`。

