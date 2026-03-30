# 神經元 NEURON 2026 — 畢業展覽官方網站

元智大學資訊傳播學系第 29 屆畢業展覽網站。

## 技術棧

- **框架**: React 19 + TypeScript + Vite
- **路由**: React Router DOM v7
- **動畫**: Framer Motion + CSS Transitions + IntersectionObserver
- **3D**: Three.js + React Three Fiber
- **樣式**: Tailwind CSS 4.1 + Inline Styles
- **字體**: LINE Seed TW（本地 WOFF2，支援 Thin/Regular/Bold/Extra Bold 四字重）
- **平滑滾動**: Lenis
- **AI 文案生成**: MiniMax API (MiniMax-M2.7) — Landing 頁面根據使用者專長動態生成跨域共創文案

## 展覽資訊

| 展覽 | 日期 | 地點 |
|------|------|------|
| 校內展 | 2026.04.24 — 04.26 | 元智大學 圖書館一樓大廳 |
| 校外展 | 2026.05.08 — 05.11 | 松山文創園區 二號倉庫 |

## 頁面結構

| 路由 | 頁面 | 說明 |
|------|------|------|
| `/` | Landing | 互動落地頁 — 滾動敘事 → 輸入專長 |
| `/home` | Home | 展覽首頁 — Hero、概念、分類、精選作品輪播、合作單位 |
| `/info` | Info | 展覽資訊 — 場地、規則 |
| `/works` | Works | 作品列表 — 篩選、卡片導航至詳情頁 |
| `/works/:slug` | WorkDetail | 單一作品詳情 — 獨立頁面，從 API 取得資料 |
| `/booking` | Booking | 4 步驟預約流程 |
| `/contact` | Contact | 聯絡表單 — 三分類 Tab + 社群連結 |

## 作品展出領域

- 互動設計
- 遊戲設計
- 行銷企劃
- 影視動畫

## 效能優化

- **路由級代碼分割**: 除 Landing 外所有頁面使用 React.lazy + Suspense 動態載入
- **圖片延遲載入**: LazyImage 元件（IntersectionObserver + 200px rootMargin + 瀏覽器原生 loading/decoding/fetchPriority）
- **圖片最佳化**: 透過 Vercel Image Optimization API (`/_vercel/image`) 實現：
  - 自動格式協商（AVIF / WebP），依瀏覽器支援度選擇最佳格式
  - 響應式圖片（`srcset` + `sizes`），依裝置寬度載入適當尺寸
  - 遠端圖片代理：API 回傳的作品圖片經由 Vercel CDN 快取 30 天
  - 圖片品質分級：縮圖 q=50、卡片/輪播 q=75、Hero q=90
- **快取策略**: 靜態資源 1 年 immutable、最佳化圖片 30 天、API 回應 5 分鐘 + stale-while-revalidate
- **Three.js 動態載入**: NeuralBackground、InteractiveNetwork 按需載入
- **Bundle 分割**: Three.js / Framer Motion / d3-force 獨立打包為 vendor chunks

## 環境變數

複製 `.env.example` 為 `.env` 並填入：

| 變數 | 說明 |
|------|------|
| `MINIMAX_API_KEY` | MiniMax 平台 API 金鑰（[取得方式](https://platform.minimaxi.com)） |
| `GEMINI_API_KEY` | Gemini AI API 金鑰（選填） |

## 本地開發

**前置條件**: Node.js 18+, pnpm

```bash
cp .env.example .env  # 填入 API key
pnpm install
pnpm dev
```

## 建置與生產部署

```bash
pnpm build
pnpm start    # Express server 同時服務靜態檔案 + AI API
```
