# SEO

Xingluo ships with full SEO support: Open Graph, Twitter Card, canonical, JSON-LD structured data, dynamic OG images, RSS, sitemap, and hreflang multilingual declarations.

## head Output

The `<head>` in [`src/layouts/Layout.astro`](../src/layouts/Layout.astro) outputs:

- `charset`, `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (canonical link)
- `title`, `meta title`, `meta description`, `meta author`
- `sitemap` link
- **Open Graph**: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
- **Twitter Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **RSS** alternate link
- **hreflang** alternate links (per language + x-default)
- `theme-color` (filled at runtime by `theme.ts`)
- `google-site-verification` (conditional)

## Post Page meta

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) injects post-specific meta via `<Fragment slot="head">`:

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (if `modDatetime` is set)
- **JSON-LD `BlogPosting` structured data**:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post title",
  "image": "OG image URL",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [{
    "@type": "Person",
    "name": "Author name",
    "url": "Author homepage"
  }]
}
```

## canonical Normalization

The canonical strategy on post detail pages (`PostDetailView.astro`):

1. Custom `canonicalURL` in frontmatter → used first
2. Default language (`zh-cn`) → points to the post's own URL
3. Non-default language (`en`) → points to the default-language original URL

Strategy 3 exists because Xingluo currently does UI translation + content original fallback, so non-default-locale pages have identical content to the default. Pointing to the default-language original avoids search engines flagging duplicate content.

## Open Graph Images

### Dynamic Generation

With `features.dynamicOgImage` enabled (default), Xingluo dynamically generates 1200×630 OG images using satori + sharp:

- **Site-level**: [`src/pages/og.png.ts`](../src/pages/og.png.ts), for pages without a custom OG image
- **Post-level**: [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts), generated only for posts without `ogImage`

### Fonts

OG images use Noto Sans SC (see the `fonts` config in `astro.config.ts`, CSS variable `--font-og`), loaded via `astro:assets`'s `fontData`. The font is for satori only and is not injected into site CSS.

### Fallbacks

- Font unavailable (no network) → falls back to a 1×1 placeholder PNG (does not fail the build)
- `dynamicOgImage` off → uses the static default OG image under `public/`

### Post OG Image Resolution

The four-level fallback in `PostDetailView.astro`:

1. frontmatter `ogImage` is a string → use directly
2. frontmatter `ogImage` is an `image()` object → use `.src`
3. `dynamicOgImage` enabled → use the post-level `og.png` endpoint
4. Otherwise → site default static OG image

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) generates the RSS feed:

- Title, description, and site URL come from the `site` config
- items come from `getSortedPosts` (drafts and scheduled posts already filtered)
- Each item's `link` is `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` is `modDatetime ?? pubDatetime`

`Layout.astro` injects the RSS autodiscovery link:

```html
<link rel="alternate" type="application/rss+xml" title="..." href=".../rss.xml" />
```

## sitemap

The `@astrojs/sitemap` integration (see `astro.config.ts`):

- `filter`: filters archive page paths based on `features.showArchives`
- `i18n`: enables auto hreflang generation, mapping `zh-cn → zh-CN`, `en → en`, with defaultLocale `zh-cn`

Generates `sitemap-index.xml` and per-language alternate declarations; `robots.txt` references the sitemap.

## hreflang Multilingual Declarations

`Layout.astro` outputs `<link rel="alternate">` for each language:

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

Paths are normalized via `parseLocaleFromPath(stripBase(...))` after stripping prefixes, ensuring each language maps to the correct URL. `x-default` points to the default language.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) generates:

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## Site Verification

Google Search Console verification is configured via `site.googleVerification` in two ways:

1. Environment variable `PUBLIC_GOOGLE_SITE_VERIFICATION` (runtime injection)
2. The `site.googleVerification` field in `xingluo.config.ts`

Rendered as `<meta name="google-site-verification" content="...">`.
