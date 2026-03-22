# 神經元 NEURON 2026 — 畢業展覽官方網站

元智大學資訊傳播學系第 29 屆畢業展覽網站。

## 技術棧

- **框架**: React 19 + TypeScript + Vite
- **路由**: React Router DOM v7
- **動畫**: Framer Motion + CSS Transitions + IntersectionObserver
- **3D**: Three.js + React Three Fiber
- **樣式**: Tailwind CSS 4.1 + Inline Styles
- **字體**: LINE Seed JP（預約頁標題 Bold / 內文 Regular）、Noto Sans TC、Space Grotesk
- **平滑滾動**: Lenis

## 展覽資訊

| 展覽 | 日期 | 地點 |
|------|------|------|
| 校內展 | 2026.04.24 — 04.26 | 元智大學 圖書館一樓大廳 |
| 校外展 | 2026.05.08 — 05.11 | 松山文創園區 二號倉庫 |

## 頁面結構

| 路由 | 頁面 | 說明 |
|------|------|------|
| `/` | Landing | 互動落地頁 — 輸入專長 |
| `/home` | Home | 展覽首頁 — Hero、概念、分類、精選作品輪播、合作單位 |
| `/info` | Info | 展覽資訊 — 場地、規則 |
| `/works` | Works | 作品列表 — 8 件作品、篩選、Modal 詳情 |
| `/works/:id` | WorkDetail | 單一作品詳情 — 兩欄式佈局 |
| `/booking` | Booking | 4 步驟預約流程 |
| `/contact` | Contact | 聯絡表單 — 三分類 Tab + 社群連結 |

## 作品展出領域

- 互動設計
- 遊戲設計
- 行銷企劃
- 影視動畫

## 本地開發

**前置條件**: Node.js 18+, pnpm

```bash
pnpm install
pnpm dev
```

## 建置

```bash
pnpm build
```
