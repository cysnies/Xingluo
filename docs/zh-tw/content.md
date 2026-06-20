# 內容創作

星羅使用 Astro Content Collections 管理內容，支援 Markdown（`.md`）與 MDX（`.mdx`，需開啟 `features.mdx`）。

## 內容集合

兩個內容集合定義在 [`src/content.config.ts`](../src/content.config.ts)：

| 集合    | 目錄                 | 用途                 |
| ------- | -------------------- | -------------------- |
| `posts` | `src/content/posts/` | 部落格文章           |
| `pages` | `src/content/pages/` | 靜態頁面（如關於頁） |

檔案命名約定：

- 以 `_` 開頭的檔案或目錄會被忽略（草稿備用）
- 啟用 MDX 時收集 `**/*.{md,mdx}`，關閉時僅 `**/*.md`
- 文章 URL 由檔案路徑推導（詳見 [架構總覽](./architecture.md) 的路由體系）

## 文章 frontmatter

`posts` 集合的完整欄位：

```markdown
---
title: "文章標題" # 必填
pubDatetime: 2026-06-19T10:00:00+08:00 # 必填，發佈時間
modDatetime: 2026-06-20T10:00:00+08:00 # 可選，更新時間
description: "文章摘要，用於 SEO 與列表" # 必填
tags: ["Astro", "部落格"] # 可選，預設 ["others"]
featured: true # 可選，是否精選（首頁展示）
draft: false # 可選，草稿不發佈
author: "星羅" # 可選，預設取 site.author
ogImage: "./cover.png" # 可選，OG 圖（圖片匯入或字串路徑）
canonicalURL: "https://..." # 可選，規範連結
hideEditPost: false # 可選，隱藏編輯連結
timezone: "Asia/Shanghai" # 可選，覆蓋站點時區
---
```

### 欄位說明

| 欄位             | 類型            | 預設值          | 說明                                                                        |
| ---------------- | --------------- | --------------- | --------------------------------------------------------------------------- |
| `title`          | string          | 必填            | 文章標題                                                                    |
| `pubDatetime`    | date            | 必填            | 發佈時間，ISO 8601 格式                                                     |
| `modDatetime`    | date            | —               | 更新時間，顯示"更新於"標籤                                                  |
| `description`    | string          | 必填            | 摘要，用於 meta、RSS、列表卡片                                              |
| `tags`           | string[]        | `["others"]`    | 標籤陣列，自動生成標籤頁                                                    |
| `featured`       | boolean         | —               | 首頁"精選文章"區塊展示                                                      |
| `draft`          | boolean         | —               | 草稿，生產構建過濾（開發可見）                                              |
| `author`         | string          | `site.author`   | 作者名                                                                      |
| `ogImage`        | image \| string | —               | OG 圖；`image()` 走 Astro 資源管線最佳化，字串為 `public/` 路徑或外鏈       |
| `canonicalURL`   | string          | —               | 規範連結，覆蓋預設（詳見 [SEO](./seo.md)）                                  |
| `hideEditPost`   | boolean         | —               | 隱藏該文章的編輯連結                                                        |
| `timezone`       | string          | `site.timezone` | 覆蓋該文章的顯示時區                                                        |
| `locale`         | string          | `site.lang`     | 文章寫作語言，如 `"en"`、`"ja"`。未設定時視為預設語言                       |
| `translationKey` | string          | —               | 翻譯分組鍵：相同 key 的文章互為譯文。未設定時文章獨立，不參與譯文分組       |
| `category`       | string          | —               | 文章分類（單值），生成 `/categories/<slug>/` 分類頁；未設定時不屬於任何分類 |

### 內容級翻譯

透過 `locale` 與 `translationKey` 兩個 frontmatter 欄位實作文章的多語言版本：

1. 預設語言文章放 `src/content/posts/<slug>.md`
2. 譯文放語言子目錄 `src/content/posts/<locale>/<slug>.md`（如 `en/welcome.md`）
3. 譯文設定 `locale` 為自己的語言、`translationKey` 與原文一致

路由層會自動解析對應語言的譯文並在列表中去重——不同語言的同一篇文章只渲染為對應語言的一張卡片。無譯文的文章在非預設語言頁會回退顯示原文內容。詳見 [國際化](./i18n.md)。

### 定時發佈

未來時間的文章在生產環境按 `scheduledPostMargin` 容差過濾：若 `pubDatetime` 距當前時間小於容差（預設 15 分鐘），視為已發佈。開發環境下所有非草稿文章均可見。

## 靜態頁面 frontmatter

`pages` 集合欄位較簡單：

```markdown
---
title: "關於"
description: "關於本站" # 可選
ogImage: "default-og.jpg" # 可選，僅字串
canonicalURL: "https://..." # 可選
---
```

關於頁透過 `getEntry("pages", "about")` 取得，需在 `src/content/pages/about.md` 建立。

## Markdown 增強

星羅預置以下 remark / rehype 外掛（見 `astro.config.ts`）：

### 目錄

`remark-toc` 自動生成目錄，`remark-collapse` 預設折疊。在文章中插入佔位：

```markdown
## Table of contents

（目錄會自動填充此處）
```

### 標註框（Callouts）

`rehype-callouts` 支援 Obsidian 風格標註：

```markdown
> [!NOTE]
> 提示內容

> [!WARNING]
> 警告內容

> [!TIP]
> 技巧內容
```

支援的類型：`NOTE`、`TIP`、`INFO`、`WARNING`、`DANGER`、`SUCCESS`、`QUESTION`、`FAILURE` 等。

### 程式碼高亮

Shiki 雙主題（亮色 `min-light`、暗色 `night-owl`），支援：

- 行高亮：` ```js {1,3-5} `
- 單詞高亮：` ```js /word/ `
- 差異標註：行首 `+` / `-`
- 檔名標註：` ```js file=src/index.ts ` 或 `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // 高亮行
}
```

### 表格

寬表格自動包裹在可橫向滾動的容器中（`rehypeWrapTable` 外掛），避免窄螢幕溢位。

## MDX 支援

開啟 `features.mdx`（預設開啟）後可使用 `.mdx` 檔案，享受元件化寫作能力。

### 自訂元件

星羅內建 MDX 元件位於 [`src/components/mdx/`](../src/components/mdx)，透過統一出口匯入：

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# 我的文章

<APlayer
  audio={[
    { name: "曲名", artist: "藝術家", url: "/audio.mp3", cover: "/cover.jpg" },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

詳見 [媒體播放器](./media-players.md)。

### 關閉 MDX

設定 `features.mdx: false` 後：

- `mdx()` 整合不載入
- 內容集合 glob 僅匹配 `*.md`（已存在的 `.mdx` 檔案不會被收集）
- 構建產物不含 MDX 執行時

## 評論

文章詳情頁底部自動渲染評論系統（需在 `features.comments` 設定 provider）。詳見 [評論系統](./comments.md)。

## 閱讀時長

文章詳情頁與列表卡片自動顯示估算閱讀時長：

- **CJK 語言**（zh-cn、ja、ko）：按中日韓字元數計算，約每分鐘 400 字
- **其他語言**：按空白分詞後的單詞數計算，約每分鐘 200 詞
- 結果向上取整，最小 1 分鐘

計算前會剝離程式碼區塊、HTML 標籤、Markdown 連結等非正文內容，確保估算貼近實際閱讀量。無需額外設定，自動生效。

## 相關文章

文章詳情頁底部（上一篇/下一篇之後）展示最多 2 篇相關文章：

- 按共享標籤數量降序排列
- 同分數按發佈時間降序（優先推薦較新的文章）
- 無共享標籤時不顯示該區塊
- 自動被 pagefind 搜尋索引忽略

無需額外設定，自動生效。

## 黏性目錄側欄

文章詳情頁在大螢幕（≥1024px）右側顯示黏性目錄側欄：

- 基於文章內 h2~h6 標題自動生成，扁平縮排列表
- 縮排層級反映標題深度（h3 比 h2 多一級縮排）
- 捲動時自動高亮當前可視章節（IntersectionObserver）
- 點選目錄項平滑捲動到對應標題
- 小螢幕（行動端）隱藏側欄，可用文內折疊目錄

基於 Astro `render()` 返回的 `headings` 生成，無需作者手動維護。文內亦可透過 `remark-toc` 生成折疊目錄（在文中寫 `## Table of contents`），與側欄並存互補。

## 分類

透過 frontmatter 的 `category` 欄位（單值字串）為文章指定分類：

```yaml
---
title: "我的文章"
category: "教學"
---
```

- 分類頁位址為 `/categories/<slug>/`，slug 經 `slugifyStr` 歸一（中文保留、拉丁文小寫連字元）
- 分類索引頁 `/categories/` 列出全部分類
- 文章卡片與詳情頁自動顯示分類連結（點選跳轉到對應分類頁）
- 一篇文章僅屬於一個分類（區別於多標籤 `tags`）；未設定 `category` 的文章不進入任何分類
- 分類頁複用 `posts.perPage` 分頁，支援多語言鏡像路由（`/en/categories/...`）
- 可透過 `features.showCategories: false` 關閉分類功能（導航入口與頁面同步移除，sitemap 過濾）
