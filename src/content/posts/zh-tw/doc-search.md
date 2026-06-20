---
title: "搜尋"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "星羅搜尋功能說明，涵蓋 Pagefind 全文搜尋整合的索引生成、UI、多語言搜尋與效能最佳化。"
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: zh-tw
---

# 搜尋

星羅整合 [Pagefind](https://pagefind.app/) 提供靜態全文搜尋，按語言分索引，支援 View Transitions 狀態保持。

## 啟用

透過 `features.search` 設定：

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

設為 `false` 時搜尋頁 `Astro.rewrite` 到 404，不生成搜尋 UI。

## 工作原理

### 索引生成

構建流程的第三步 `pagefind --site dist` 掃描 `dist/` 目錄：

- 僅索引帶 `data-pagefind-body` 屬性的頁面
- 按語言自動分索引（`zh-cn` 與 `en` 各自獨立）
- 索引輸出到 `dist/pagefind/`

### 索引範圍

文章詳情頁的 `<main>` 標記 `data-pagefind-body`，故僅文章正文被索引。其他頁面（首頁、列表、歸檔等）不進入搜尋索引。

## 搜尋 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) 實作搜尋頁：

- 載入 `@pagefind/default-ui` 提供搜尋框與結果列表
- 透過 `getAssetPath("pagefind/")` 定位索引資源
- 全域樣式覆蓋 pagefind CSS 變數，對應到星羅主題（`--background`、`--foreground`、`--primary` 等）
- `transition:persist` 保持搜尋狀態跨導航

### 搜尋流程

1. 使用者在搜尋框輸入
2. Pagefind 在對應語言索引中匹配
3. 結果列表展示匹配文章（標題、摘要高亮）
4. `processTerm` 將帶查詢參數的搜尋頁位址寫入 sessionStorage，供返回按鈕回跳

## 來源回跳

搜尋頁與文章頁的導航回跳機制：

- `Main.astro` 元件將來源頁位址寫入 sessionStorage 的 `backUrl`
- 文章頁的 `BackButton.astro` 優先回跳 sessionStorage 的 `backUrl`，無則回首頁
- 搜尋頁的 `processTerm` 寫入帶查詢參數的位址，從文章頁返回時恢復搜尋狀態

## 多語言搜尋

Pagefind 按 `data-pagefind-body` 元素的語言屬性分索引：

- `zh-cn` 頁面（根目錄）→ 中文索引
- `en` 頁面（`/en/` 前綴）→ 英文索引

搜尋時自動匹配當前頁面語言對應的索引，中文頁搜中文，英文頁搜英文。

## 主題適配

Pagefind 預設 UI 有自己的 CSS 變數，星羅在 `SearchView.astro` 中用全域樣式覆蓋，對應到 shadcn 主題變數：

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

暗色模式下透過 `.dark` 選擇器自動切換，與全站主題一致。

## 效能

- Pagefind 索引為靜態檔案，搜尋在客戶端完成，無服務端請求
- 索引按需載入（僅搜尋時下載索引片段）
- `transition:persist` 避免導航時重複初始化搜尋 UI
