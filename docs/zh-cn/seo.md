# SEO

星罗内置完整的 SEO 支持：Open Graph、Twitter Card、canonical、JSON-LD 结构化数据、动态 OG 图、RSS、sitemap、hreflang 多语言声明。

## head 输出

[`src/layouts/Layout.astro`](../src/layouts/Layout.astro) 的 `<head>` 输出：

- `charset`、`viewport`
- `favicon`（`public/favicon.svg`）
- `canonical`（规范化链接）
- `title`、`meta title`、`meta description`、`meta author`
- `sitemap` link
- **Open Graph**：`og:type`、`og:site_name`、`og:title`、`og:description`、`og:url`、`og:image`
- **Twitter Card**：`twitter:card`、`twitter:title`、`twitter:description`、`twitter:image`
- **RSS** alternate link
- **hreflang** alternate links（各语言 + x-default）
- `theme-color`（运行时由 `theme.ts` 填充）
- `google-site-verification`（条件输出）

## 文章页 meta

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) 通过 `<Fragment slot="head">` 注入文章专属 meta：

- `og:type = article`
- `article:published_time`（ISO 8601）
- `article:modified_time`（若有 `modDatetime`）
- **JSON-LD `BlogPosting` 结构化数据**：

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "文章标题",
  "image": "OG 图 URL",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "作者名",
      "url": "作者主页"
    }
  ]
}
```

## canonical 规范化

文章详情页（`PostDetailView.astro`）的 canonical 策略：

1. 文章 frontmatter 自定义 `canonicalURL` → 优先使用
2. 当前文章为该语言的**真实译文**（`locale` 与页面语言一致）→ 指向自身 URL
3. 当前文章为**回退内容**（无该语言译文，沿用原文）→ 指向默认语言原文 URL

策略 3 确保搜索引擎不会将无独立译文的内容重复页面判定为重复内容。有独立译文的文章 canonical 指向自身，可被独立索引。

## BreadcrumbList 结构化数据

所有含面包屑的页面（文章列表、标签索引、标签文章列表、归档、关于、搜索）自动输出 `BreadcrumbList` JSON-LD 结构化数据：

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
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

面包屑末项无链接时（当前页），自动使用当前页面 URL 作为 `item`。文章详情页不使用面包屑组件，故不输出此结构化数据。

## Open Graph 图

### 动态生成

启用 `features.dynamicOgImage`（默认开启）时，星罗用 satori + sharp 动态生成 1200×630 的 OG 图：

- **站点级**：[`src/pages/og.png.ts`](../src/pages/og.png.ts)，用于无自定义 OG 图的页面
- **文章级**：[`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts)，仅对未设置 `ogImage` 的文章生成

### 字体

OG 图使用 Noto Sans SC 字体（见 `astro.config.ts` 的 `fonts` 配置，CSS 变量 `--font-og`），通过 `astro:assets` 的 `fontData` 加载。字体仅供 satori 渲染，不注入站点 CSS。

### 降级

- 字体不可用（无网络环境）→ 回退 1×1 占位 PNG（不致构建失败）
- `dynamicOgImage` 关闭 → 使用 `public/` 下的静态默认 OG 图

### 文章 OG 图解析

`PostDetailView.astro` 的 OG 图四级降级：

1. frontmatter `ogImage` 为字符串 → 直接用
2. frontmatter `ogImage` 为 `image()` 对象 → 取 `.src`
3. 启用 `dynamicOgImage` → 用文章级 `og.png` 端点
4. 否则 → 站点默认静态 OG 图

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) 生成 RSS feed：

- 标题、描述、站点 URL 来自 `site` 配置
- items 来自 `getSortedPosts`（已过滤草稿与定时发布）
- 每条 item 的 `link` 为 `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` 为 `modDatetime ?? pubDatetime`

`Layout.astro` 注入 RSS 自动发现链接：

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## sitemap

`@astrojs/sitemap` 集成（见 `astro.config.ts`）：

- `filter`：按 `features.showArchives` 过滤归档页路径
- `i18n`：启用 hreflang 自动生成，映射 `zh-cn → zh-CN`、`en → en`，defaultLocale `zh-cn`

生成 `sitemap-index.xml` 与各语言 alternate 声明，`robots.txt` 引用 sitemap。

## hreflang 多语言声明

`Layout.astro` 输出各语言的 `<link rel="alternate">`：

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

路径经 `parseLocaleFromPath(stripBase(...))` 去前缀后归一化，确保各语言对应正确 URL。`x-default` 指向默认语言。

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) 生成：

```
User-agent: *
Allow: /

Sitemap: https://站点URL/sitemap-index.xml
```

## 站点验证

Google Search Console 验证通过两种方式配置 `site.googleVerification`：

1. 环境变量 `PUBLIC_GOOGLE_SITE_VERIFICATION`（运行时注入）
2. `xingluo.config.ts` 的 `site.googleVerification` 字段

输出为 `<meta name="google-site-verification" content="...">`。
