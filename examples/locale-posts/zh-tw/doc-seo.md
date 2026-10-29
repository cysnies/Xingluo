---
title: "SEO"
pubDatetime: 2026-06-20T11:00:00+08:00
description: "星羅 SEO 設定說明，涵蓋 Open Graph、Twitter Card、canonical、JSON-LD 結構化資料、RSS 與 sitemap。"
tags:
  - documentation
  - seo
category: "Documentation"
translationKey: doc-seo
locale: zh-tw
---

# SEO

星羅內建完整的 SEO 支援：Open Graph、Twitter Card、canonical、JSON-LD 結構化資料、動態 OG 圖、RSS、sitemap、hreflang 多語言宣告。

## head 輸出

[`src/layouts/Layout.astro`](../src/layouts/Layout.astro) 的 `<head>` 輸出：

- `charset`、`viewport`
- `favicon`（`public/favicon.svg`）
- `canonical`（規範化連結）
- `title`、`meta title`、`meta description`、`meta author`
- `sitemap` link
- **Open Graph**：`og:type`、`og:site_name`、`og:title`、`og:description`、`og:url`、`og:image`
- **Twitter Card**：`twitter:card`、`twitter:title`、`twitter:description`、`twitter:image`
- **RSS** alternate link
- **hreflang** alternate links（各語言 + x-default）
- `theme-color`（執行時由 `theme.ts` 填充）
- `google-site-verification`（條件輸出）

## 文章頁 meta

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) 透過 `<Fragment slot="head">` 注入文章專屬 meta：

- `og:type = article`
- `article:published_time`（ISO 8601）
- `article:modified_time`（若有 `modDatetime`）
- **JSON-LD `BlogPosting` 結構化資料**：

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "文章標題",
  "image": "OG 圖 URL",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "作者名",
      "url": "作者主頁"
    }
  ]
}
```

## canonical 規範化

文章詳情頁（`PostDetailView.astro`）的 canonical 策略：

1. 文章 frontmatter 自訂 `canonicalURL` → 優先使用
2. 當前文章為該語言的**真實譯文**（`locale` 與頁面語言一致）→ 指向自身 URL
3. 當前文章為**回退內容**（無該語言譯文，沿用原文）→ 指向預設語言原文 URL

策略 3 確保搜尋引擎不會將無獨立譯文的內容重複頁面判定為重複內容。有獨立譯文的文章 canonical 指向自身，可被獨立索引。

## BreadcrumbList 結構化資料

所有含麵包屑的頁面（文章列表、標籤索引、標籤文章列表、歸檔、關於、搜尋）自動輸出 `BreadcrumbList` JSON-LD 結構化資料：

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首頁",
      "item": "https://..."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "文章",
      "item": "https://.../posts/"
    }
  ]
}
```

麵包屑末項無連結時（當前頁），自動使用當前頁面 URL 作為 `item`。文章詳情頁不使用麵包屑元件，故不輸出此結構化資料。

## Open Graph 圖

### 動態生成

啟用 `features.dynamicOgImage`（預設開啟）時，星羅用 satori + sharp 動態生成 1200×630 的 OG 圖：

- **站點級**：[`src/pages/og.png.ts`](../src/pages/og.png.ts)，用於無自訂 OG 圖的頁面
- **文章級**：[`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts)，僅對未設定 `ogImage` 的文章生成

### 字型

OG 圖使用 Noto Sans SC 字型（見 `astro.config.ts` 的 `fonts` 設定，CSS 變數 `--font-og`），透過 `astro:assets` 的 `fontData` 載入。字型僅供 satori 渲染，不注入站點 CSS。

### 降級

- 字型不可用（無網路環境）→ 回退 1×1 佔位 PNG（不致構建失敗）
- `dynamicOgImage` 關閉 → 使用 `public/` 下的靜態預設 OG 圖

### 文章 OG 圖解析

`PostDetailView.astro` 的 OG 圖四級降級：

1. frontmatter `ogImage` 為字串 → 直接用
2. frontmatter `ogImage` 為 `image()` 物件 → 取 `.src`
3. 啟用 `dynamicOgImage` → 用文章級 `og.png` 端點
4. 否則 → 站點預設靜態 OG 圖

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) 生成 RSS feed：

- 標題、描述、站點 URL 來自 `site` 設定
- items 來自 `getSortedPosts`（已過濾草稿與定時發佈）
- 每條 item 的 `link` 為 `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` 為 `modDatetime ?? pubDatetime`

`Layout.astro` 注入 RSS 自動發現連結：

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## sitemap

`@astrojs/sitemap` 整合（見 `astro.config.ts`）：

- `filter`：按 `features.showArchives` 過濾歸檔頁路徑
- `i18n`：啟用 hreflang 自動生成，對應 `zh-cn → zh-CN`、`en → en`，defaultLocale `zh-cn`

生成 `sitemap-index.xml` 與各語言 alternate 宣告，`robots.txt` 引用 sitemap。

## hreflang 多語言宣告

`Layout.astro` 輸出各語言的 `<link rel="alternate">`：

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

路徑經 `parseLocaleFromPath(stripBase(...))` 去前綴後歸一化，確保各語言對應正確 URL。`x-default` 指向預設語言。

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) 生成：

```
User-agent: *
Allow: /

Sitemap: https://站點URL/sitemap-index.xml
```

## 站點驗證

Google Search Console 驗證透過兩種方式設定 `site.googleVerification`：

1. 環境變數 `PUBLIC_GOOGLE_SITE_VERIFICATION`（執行時注入）
2. `xingluo.config.ts` 的 `site.googleVerification` 欄位

輸出為 `<meta name="google-site-verification" content="...">`。
