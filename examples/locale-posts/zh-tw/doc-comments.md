---
title: "評論系統"
pubDatetime: 2026-06-20T09:00:00+08:00
description: "星羅評論系統設定指南，涵蓋 giscus、twikoo、waline 三種評論系統的選擇、設定與接入。"
tags:
  - documentation
  - comments
category: "Documentation"
translationKey: doc-comments
locale: zh-tw
---

# 評論系統

星羅整合 giscus、twikoo、waline 三個評論系統，透過 `features.comments` 設定選擇。

## 設定

在 [`xingluo.config.ts`](../xingluo.config.ts) 的 `features.comments` 中選擇 provider 並提供對應設定：

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* giscus 設定 */ },
    // twikoo: { /* twikoo 設定 */ },
    // waline: { /* waline 設定 */ },
  },
}
```

`provider: false`（預設）時關閉評論，文章頁不輸出任何評論區標記與指令碼。

## 評論區位置

評論區僅出現在**文章詳情頁**底部（相鄰文章導航之後），由 [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro) 渲染。

## giscus

基於 GitHub Discussions 的評論系統，需倉庫為 public 且啟用 Discussions。

### 設定

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // GitHub 倉庫
    repoId: "R_...",              // 倉庫 ID（giscus.app 生成）
    category: "Announcements",    // Discussion 分類名
    categoryId: "DIC_...",        // 分類 ID（giscus.app 生成）
    mapping: "pathname",          // 可選，頁面到 discussion 對應
    strict: false,                // 可選，嚴格標題匹配
    reactionsEnabled: true,       // 可選，表情反應
    inputPosition: "bottom",      // 可選，評論框位置：top | bottom
    loading: "lazy",              // 可選，載入方式：lazy | eager
  },
}
```

### 取得 repoId / categoryId

1. 存取 [giscus.app](https://giscus.app)
2. 填入倉庫與分類，生成設定
3. 複製 `data-repo-id` 與 `data-category-id` 填入設定

### 工作方式

giscus 透過官方 `client.js` 注入 iframe，`data-*` 屬性承載設定。語言按當前 locale 自動對應（`zh-cn` → `zh-CN`，`en` → `en`）。主題透過 `postMessage` 在切換時同步。

## twikoo

無後端依賴的評論系統，支援騰訊雲開發或自託管。

### 設定

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // 雲環境 ID 或自託管服務完整 URL
    lang: "zh-CN",                            // 可選，語言
  },
}
```

### envId 說明

- 騰訊雲開發：填環境 ID（需額外引入 cloudbase SDK）
- 自託管：填完整 URL（如 `https://twikoo.example.com`），twikoo 自動識別為 HTTP API 模式

### 工作方式

twikoo 在評論容器進入視口時動態 `import("twikoo")` 並呼叫 `init`。twikoo 不支援執行時主題切換，站點主題變化時會重建以應用暗色樣式。

## waline

帶後端的評論系統，支援評論數與存取量統計。

### 設定

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Waline 服務端位址
    lang: "zh-CN",                           // 可選，語言
    pageSize: 10,                            // 可選，評論分頁大小
    dark: "html.dark",                       // 可選，暗色選擇器（預設跟隨站點 .dark）
  },
}
```

### serverURL 部署

參考 [Waline 官方文件](https://waline.js.org/) 部署服務端（Vercel / Cloudflare / 自託管均可），將位址填入 `serverURL`。

### 工作方式

waline 在評論容器進入視口時動態 `import("@waline/client")` 與樣式 `@waline/client/style`，呼叫 `init`。透過 `dark:"html.dark"` 選擇器自動跟隨站點暗色模式，無需手動同步。

## 懶載入

所有評論系統均透過 IntersectionObserver 懶載入：評論容器進入視口前 200px 時才發起請求與初始化，避免首屏效能損耗。

實作見 [`src/scripts/comments.ts`](../src/scripts/comments.ts)。

## 主題同步

站點主題切換時，評論系統主題自動同步：

| 評論系統 | 同步方式                                                     |
| -------- | ------------------------------------------------------------ |
| giscus   | `postMessage({giscus:{setConfig:{theme}}})` 向 iframe 發訊息 |
| waline   | `dark:"html.dark"` CSS 選擇器自動跟隨                        |
| twikoo   | 監聽 `.dark` 類變化，重建評論實例                            |

主題監聽透過 `MutationObserver` 觀察 `document.documentElement` 的 `class` 與 `data-theme` 屬性變化。

## View Transitions 適配

評論指令碼監聽 `astro:page-load` 事件，每次頁面載入後重新掃描掛載點並初始化。防重複初始化透過 `dataset` 標記（`xng-setup`、`xng-init`）。

## i18n

評論區的標題文案透過 `UIStrings.comments.title` 在地化（`zh-cn.ts` 為"評論"，`en.ts` 為"Comments"）。評論系統 UI 的語言由各 provider 的 `lang` 欄位控制。

## 自訂擴充

### 切換 provider

修改 `xingluo.config.ts` 的 `features.comments.provider` 即可，無需改動程式碼。星羅會自動渲染對應子元件。

### 新增評論系統

1. 在 `src/components/comments/` 建立新元件（如 `Disqus.astro`），渲染掛載佔位
2. 在 `Comments.astro` 的條件渲染中新增新 provider 分支
3. 在 `src/scripts/comments.ts` 新增初始化邏輯
4. 在 `src/types/config.ts` 擴充 `CommentProvider` 與設定型別
