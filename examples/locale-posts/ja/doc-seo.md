---
title: "SEO"
pubDatetime: 2026-06-20T11:00:00+08:00
description: "Xingluo SEO 設定ガイド。Open Graph、Twitter Card、canonical、JSON-LD 構造化データ、RSS、sitemap をカバーします。"
tags:
  - documentation
  - seo
category: "Documentation"
translationKey: doc-seo
locale: ja
---

Xingluo は完全な SEO サポートを備えています：Open Graph、Twitter Card、canonical、JSON-LD 構造化データ、動的 OG 画像、RSS、サイトマップ、hreflang 多言語宣言。

## head 出力

[`src/layouts/Layout.astro`](../src/layouts/Layout.astro) の `<head>` が出力：

- `charset`、`viewport`
- `favicon`（`public/favicon.svg`）
- `canonical`（正規リンク）
- `title`、`meta title`、`meta description`、`meta author`
- `sitemap` リンク
- **Open Graph**：`og:type`、`og:site_name`、`og:title`、`og:description`、`og:url`、`og:image`
- **Twitter Card**：`twitter:card`、`twitter:title`、`twitter:description`、`twitter:image`
- **RSS** alternate リンク
- **hreflang** alternate リンク（言語ごと + x-default）
- `theme-color`（`theme.ts` によって実行時に設定）
- `google-site-verification`（条件付き）

## 投稿ページ meta

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) は `<Fragment slot="head">` を介して投稿固有の meta を注入：

- `og:type = article`
- `article:published_time`（ISO 8601）
- `article:modified_time`（`modDatetime` がある場合）
- **JSON-LD `BlogPosting` 構造化データ**：

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "投稿タイトル",
  "image": "OG画像URL",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "著者名",
      "url": "著者ホームページ"
    }
  ]
}
```

## canonical 正規化

投稿詳細ページ（`PostDetailView.astro`）の canonical 戦略：

1. frontmatter のカスタム `canonicalURL` → 優先使用
2. 現在の投稿がその言語の**実際の翻訳**（`locale` がページ言語と一致） → 自身の URL を指す
3. 現在の投稿が**フォールバックコンテンツ**（翻訳なし、原文を使用） → デフォルト言語の原文 URL を指す

戦略3により、検索エンジンが独立した翻訳のないページを重複コンテンツとして扱うのを防ぎます。独立した翻訳がある投稿は canonical が自身を指し、個別にインデックス可能です。

## BreadcrumbList 構造化データ

パンくずリストのあるすべてのページ（投稿リスト、タグインデックス、タグ投稿リスト、アーカイブ、概要、検索）は自動的に `BreadcrumbList` JSON-LD 構造化データを出力します：

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://..."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "投稿",
      "item": "https://.../posts/"
    }
  ]
}
```

パンくずリストの最後の項目にリンクがない場合（現在のページ）、現在のページ URL が `item` として使用されます。投稿詳細ページは Breadcrumb コンポーネントを使用しないため、この構造化データは出力されません。

## Open Graph 画像

### 動的生成

`features.dynamicOgImage` が有効（デフォルト）の場合、Xingluo は satori + sharp を使用して 1200×630 の OG 画像を動的生成します：

- **サイトレベル**：[`src/pages/og.png.ts`](../src/pages/og.png.ts)、カスタム OG 画像のないページに使用
- **投稿レベル**：[`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts)、`ogImage` が設定されていない投稿のみ生成

### フォント

OG 画像は Noto Sans SC フォントを使用します（`astro.config.ts` の `fonts` 設定、CSS 変数 `--font-og`）、`astro:assets` の `fontData` を介して読み込まれます。フォントは satori のみに使用され、サイト CSS には注入されません。

### フォールバック

- フォントが利用不可（ネットワークなし）→ 1×1 プレースホルダー PNG にフォールバック（ビルドは失敗しません）
- `dynamicOgImage` オフ → `public/` 下の静的デフォルト OG 画像を使用

### 投稿 OG 画像の解決

`PostDetailView.astro` の4段階フォールバック：

1. frontmatter `ogImage` が文字列 → 直接使用
2. frontmatter `ogImage` が `image()` オブジェクト → `.src` を使用
3. `dynamicOgImage` 有効 → 投稿レベルの `og.png` エンドポイントを使用
4. それ以外 → サイトデフォルトの静的 OG 画像

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) が RSS フィードを生成：

- タイトル、説明、サイト URL は `site` 設定から取得
- アイテムは `getSortedPosts` から（下書きと予約投稿は既にフィルタリング済み）
- 各アイテムの `link` は `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` は `modDatetime ?? pubDatetime`

`Layout.astro` が RSS 自動発見リンクを注入：

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## サイトマップ

`@astrojs/sitemap` 統合（`astro.config.ts` を参照）：

- `filter`：`features.showArchives` に基づいてアーカイブページパスをフィルタリング
- `i18n`：自動 hreflang 生成を有効化、`zh-cn → zh-CN`、`en → en`、defaultLocale `zh-cn`

` sitemap-index.xml` と言語別の代替宣言を生成。`robots.txt` がサイトマップを参照。

## hreflang 多言語宣言

`Layout.astro` が各言語の `<link rel="alternate">` を出力：

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

パスは `parseLocaleFromPath(stripBase(...))` でプレフィックス除去後に正規化され、各言語が正しい URL にマッピングされます。`x-default` はデフォルト言語を指します。

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) が生成：

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## サイト検証

Google Search Console の検証は `site.googleVerification` を介して2つの方法で設定：

1. 環境変数 `PUBLIC_GOOGLE_SITE_VERIFICATION`（実行時注入）
2. `xingluo.config.ts` の `site.googleVerification` フィールド

`<meta name="google-site-verification" content="...">` として出力されます。
