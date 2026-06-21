# 搜尋

星羅整合 [Flexsearch](https://github.com/nextapps-de/flexsearch) 提供客戶端全文搜尋，按語言分索引，支援 View Transitions 狀態保持。

## 啟用

透過 `features.search` 設定：

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

設為 `false` 時搜尋頁 `Astro.rewrite` 到 404，不生成搜尋 UI。

## 工作原理

### 索引生成

構建流程的第三步 `node scripts/generateSearchIndex.mjs` 掃描 `dist/` 目錄中的 HTML 檔案：

- 解析頁面內容，提取文章正文
- 按語言自動分索引（`zh-cn` 與 `en` 各自獨立）
- 索引輸出到 `dist/search/`

### 索引範圍

構建腳本會解析文章詳情頁的 `<main>` 內容，僅提取文章正文構建索引。其他頁面（首頁、列表、歸檔等）不進入搜尋索引。

## 搜尋 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) 實作搜尋頁：

- 使用 Flexsearch 客戶端索引，在瀏覽器中完成搜尋匹配
- 透過 `getAssetPath("search/")` 定位索引資源
- 使用 shadcn 主題變數（`--background`、`--foreground`、`--primary` 等）設定搜尋框與結果列表樣式
- `transition:persist` 保持搜尋狀態跨導航

### 搜尋流程

1. 使用者在搜尋框輸入
2. Flexsearch 在對應語言索引中匹配
3. 結果列表展示匹配文章（標題、摘要高亮）
4. `processTerm` 將帶查詢參數的搜尋頁位址寫入 sessionStorage，供返回按鈕回跳

## 來源回跳

搜尋頁與文章頁的導航回跳機制：

- `Main.astro` 元件將來源頁位址寫入 sessionStorage 的 `backUrl`
- 文章頁的 `BackButton.astro` 優先回跳 sessionStorage 的 `backUrl`，無則回首頁
- 搜尋頁的 `processTerm` 寫入帶查詢參數的位址，從文章頁返回時恢復搜尋狀態

## 多語言搜尋

Flexsearch 按頁面語言分索引：

- `zh-cn` 頁面（根目錄）→ 中文索引
- `en` 頁面（`/en/` 前綴）→ 英文索引

搜尋時自動匹配當前頁面語言對應的索引，中文頁搜中文，英文頁搜英文。

## 主題適配

Flexsearch 搜尋 UI 使用 shadcn 主題變數，在 `SearchView.astro` 中定義搜尋框與結果列表的樣式：

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

暗色模式下透過 `.dark` 選擇器自動切換，與全站主題一致。

## 效能

- Flexsearch 索引為靜態檔案，搜尋在客戶端完成，無服務端請求
- 索引按需載入（僅搜尋時下載索引片段）
- `transition:persist` 避免導航時重複初始化搜尋 UI
