---
title: "架構總覽"
pubDatetime: 2026-06-20T07:00:00+08:00
description: "Xingluo 架構總覽，涵蓋目錄結構、設定流、渲染流、構建流程與擴展指南。"
tags:
  - documentation
  - architecture
category: "Documentation"
translationKey: doc-architecture
locale: zh-tw
---

# 架構總覽

本文件闡述星羅的整體架構、目錄結構、設定流、渲染流與構建流程，幫助理解程式碼組織與擴充方式。

## 目錄結構

```
xingluo/
├── astro.config.ts          # Astro 設定（整合、i18n、markdown、字型、env）
├── xingluo.config.ts        # 使用者設定入口
├── tsconfig.json            # TypeScript 設定（strict + @/* 路徑別名）
├── package.json             # 依賴與指令碼
├── public/                  # 靜態資源（favicon.svg、預設 OG 圖等）
├── docs/                    # 專案文件（本目錄）
├── references/              # 唯讀參考專案原始碼（不得依賴）
└── src/
    ├── config.ts            # 設定合併預設值，匯出解析後設定
    ├── content.config.ts    # 內容集合 schema（posts、pages）
    ├── env.d.ts             # 第三方模組與環境變數型別宣告
    ├── assets/              # 圖示元件
    │   └── icons/           # astro-icon + Font Awesome（含 socials/）
    ├── components/          # UI 元件
    │   ├── ui/              # shadcn 風格元件（Button、Card、Badge 等）
    │   ├── post/            # 文章頁元件（相鄰導航、返回、分享等）
    │   ├── comments/        # 評論系統元件
    │   ├── mdx/             # MDX 自訂元件（APlayer、DPlayer）
    │   ├── pageViews/       # 頁面視圖（頁面渲染邏輯集中處）
    │   └── *.astro          # 根級元件（Header、Footer、PostCard 等）
    ├── content/             # 內容檔案
    │   ├── posts/           # 部落格文章
    │   └── pages/           # 靜態頁面
    ├── i18n/                # 國際化體系
    │   ├── index.ts         # 語言載入與 useTranslations
    │   ├── types.ts         # UIStrings 完整型別
    │   ├── routing.ts       # locale 路徑解析
    │   ├── staticPaths.ts   # 非預設語言 getStaticPaths
    │   ├── format.ts        # 模板字串替換
    │   └── lang/            # 語言資源檔案（zh-cn.ts、en.ts）
    ├── layouts/             # 佈局
    │   ├── Layout.astro     # 基礎骨架（head、SEO、FOUC）
    │   └── PostLayout.astro # 文章佈局（JSON-LD、article meta）
    ├── lib/                 # 基礎工具庫
    │   ├── utils.ts         # cn（tailwind-merge + clsx）
    │   ├── dayjs.ts         # dayjs 實例與時區外掛
    │   └── socialIcons.ts   # 社交圖示動態解析
    ├── pages/               # 路由（根目錄 + [locale]/ 鏡像）
    ├── scripts/             # 客戶端指令碼
    │   ├── theme.ts         # 主題切換
    │   ├── postEnhancements.ts # 文章增強（錨點、複製、燈箱、進度條）
    │   ├── comments.ts      # 評論懶載入與主題同步
    │   └── players.ts       # 播放器懶載入
    ├── styles/              # 樣式
    │   ├── global.css       # Tailwind 入口 + 基礎層 + 自訂工具類
    │   ├── theme.css        # shadcn 主題變數（OKLCH）
    │   └── typography.css   # .app-prose 排版與程式碼區塊樣式
    ├── types/               # 型別宣告
    │   ├── config.ts        # 設定型別
    │   └── *.d.ts           # 無型別的第三方模組宣告
    └── utils/               # 工具函式
        ├── getPostPaths.ts  # 文章 slug 與 URL 推導
        ├── getSortedPosts.ts# 文章排序
        ├── postFilter.ts    # 草稿與定時發佈過濾
        ├── getUniqueTags.ts # 標籤去重
        ├── remarkPlayers.ts # 播放器 remark 外掛
        ├── rehypeWrapTable.ts# 表格捲動包裹
        └── ...              # 其他工具
```

## 設定流

```
xingluo.config.ts
   │ defineXingluoConfig（型別約束，原樣返回）
   ▼
src/config.ts
   │ resolveConfig（合併預設值 + resolveComments + resolvePlayers）
   ▼
src/types/config.ts
   │ XingluoConfig（完整型別）
   ▼
全站透過 import config from "@/config" 引用
```

關鍵點：

- `xingluo.config.ts` 是使用者唯一需要修改的設定檔
- `src/config.ts` 的 `resolveConfig` 做淺合併（`site`/`posts`）與深合併（`features.editPost`、`features.comments`、`features.players`）
- `astro.config.ts` 讀取未合併的 `./xingluo.config`（因為需在 Astro 設定層決定整合載入），故存取 `features` 用可選鏈
- `src/content.config.ts` 讀取已合併的 `@/config`，故 `features` 必填

## 渲染流

### 頁面渲染

星羅採用"頁面薄包裝 + 視圖元件"模式，渲染邏輯集中在 `src/components/pageViews/`：

```
src/pages/posts/[...slug]/index.astro   ← 薄包裝：getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← 渲染邏輯
    │
    ▼
src/layouts/PostLayout.astro  ← 文章佈局（JSON-LD、article meta）
    │
    ▼
src/layouts/Layout.astro      ← 基礎骨架（head、SEO、FOUC、ClientRouter）
```

薄包裝頁面僅負責 `getStaticPaths` 與傳遞 props，視圖元件負責全部渲染邏輯。`[locale]/` 鏡像頁面同樣是薄包裝，透過 `getLocaleParams()` 僅生成非預設語言。

### 路由體系

```
src/pages/
├── 404.astro                      # 404（不鏡像）
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # 站點級 OG 圖端點
├── rss.xml.ts                     # RSS 端點
├── robots.txt.ts                  # robots.txt 端點
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # 文章級 OG 圖端點
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # 非預設語言鏡像（getStaticPaths=getLocaleParams）
    └── （結構完全鏡像根目錄，除 404、og.png、rss、robots）
```

### 文章 URL 推導

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts)：

- `getPostSlug(id, filePath)`：從內容集合 `id` 與檔案路徑推導路由 slug，過濾 `_` 前綴目錄
- `getPostUrl(id, filePath, locale)`：生成含 locale 前綴的可導航 URL（預設語言無前綴）

### 文章過濾與排序

- [`postFilter.ts`](../src/utils/postFilter.ts)：排除草稿；生產環境按 `pubDatetime - scheduledPostMargin` 過濾未來文章；開發環境全部可見
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts)：過濾後按 `modDatetime ?? pubDatetime` 倒序
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts)：標籤 slug 去重排序

## 客戶端指令碼體系

星羅的客戶端互動透過 `<script>` 標籤在頁面底部載入，統一適配 View Transitions：

| 指令碼                | 載入位置                                           | 事件適配                                                                                     | 職責                                     |
| --------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `theme.ts`            | `Layout.astro` body 末                             | `astro:after-swap` 重綁、`astro:before-swap` 攜帶 theme-color、`prefers-color-scheme` change | 主題持久化與切換                         |
| `postEnhancements.ts` | `PostDetailView.astro`                             | `astro:page-load` 重初始化                                                                   | 標題錨點、程式碼複製、閱讀進度、圖片燈箱 |
| `comments.ts`         | `Comments.astro`                                   | `astro:page-load` 重掃                                                                       | 評論懶載入與主題同步                     |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro`（條件） | `astro:page-load` 重掃                                                                       | 播放器懶載入                             |

> 注意：`comments.ts` 與 `players.ts` 無頂層 import/export，需在檔案末尾加 `export {}` 標記為模組，避免與其他檔案的全域宣告衝突。

## 構建流程

`pnpm run build` = `astro check && astro build && node scripts/generateSearchIndex.mjs`

1. **`astro check`**：TypeScript + Astro 模板型別檢查
2. **`astro build`**：
   - 收集內容集合（按 `features.mdx` 決定是否含 `.mdx`）
   - 靜態生成全部頁面（含 `[locale]/` 鏡像）
   - 生成端點：RSS、sitemap、robots.txt、站點級與文章級 OG 圖
   - 條件載入 `mdx()` 整合、條件注入 `remarkPlayers` 外掛
   - 構建期內聯 SVG 圖示（astro-icon，零執行時 JS）
   - 動態 import 的評論與播放器模組拆分為獨立 chunk（懶載入）
3. **`node scripts/generateSearchIndex.mjs`**：掃描 `dist/` 的 HTML 檔案，解析頁面內容，按語言生成搜尋索引到 `dist/search/`

## 效能最佳化策略

- **零執行時 JS 圖示**：astro-icon 構建期內聯 Font Awesome SVG（sprite `<symbol>` 模式）
- **SVG 最佳化**：`experimental.svgOptimizer`（svgo）壓縮內聯與引用的 SVG
- **按需懶載入**：評論與播放器透過 IntersectionObserver 在捲動到視口時動態 import，關閉時零打包
- **條件整合**：MDX 關閉時不載入 `mdx()` 整合，播放器關閉時不注入 remark 外掛
- **CSS 體積**：Tailwind v4 按需生成，OKLCH 變數集中管理
- **OG 圖字型**：僅供 satori 使用，不注入站點 CSS
- **View Transitions**：`<ClientRouter/>` 實作頁面切換動畫，搜尋框 `transition:persist` 保持狀態

## 擴充指南

### 新增頁面

1. 在 `src/pages/` 建立 `.astro` 檔案（薄包裝）
2. 在 `src/components/pageViews/` 建立對應 View 元件
3. 若需多語言，在 `src/pages/[locale]/` 建立同名鏡像薄包裝

### 新增 UI 元件

遵循 shadcn 風格，在 `src/components/ui/` 下建立 `.astro` 元件與 `.ts` 變體設定（使用 `class-variance-authority`）。

### 新增客戶端指令碼

在 `src/scripts/` 建立 `.ts` 檔案，末尾加 `export {}` 標記模組，監聽 `astro:page-load` 適配 View Transitions，在對應頁面 `<script>` 標籤中 import。

### 新增 remark/rehype 外掛

在 `src/utils/` 建立外掛檔案，在 `astro.config.ts` 的 `markdown.remarkPlugins` 或 `rehypePlugins` 中按需注入。
