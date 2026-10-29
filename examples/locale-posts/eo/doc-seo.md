---
title: "SEO"
pubDatetime: 2026-06-20T11:00:00+08:00
description: "Gvidilo pri SEO de Xingluo kovranta Open Graph, Twitter Card, canonical, JSON-LD strukturitajn datumojn, RSS kaj retejmapon."
tags:
  - documentation
  - seo
category: "Documentation"
translationKey: doc-seo
locale: eo
---

Xingluo venas kun plena SEO-subteno: Open Graph, Twitter Card, canonical, JSON-LD strukturitaj datumoj, dinamikaj OG-bildoj, RSS, retmapo kaj hreflang multlingvaj deklaroj.

## Eligo de head

La `<head>` en [`src/layouts/Layout.astro`](../src/layouts/Layout.astro) eligas:

- `charset`, `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (kanona ligilo)
- `title`, `meta title`, `meta description`, `meta author`
- `sitemap` ligilo
- **Open Graph**: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
- **Twitter Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **RSS** alternativa ligilo
- **hreflang** alternativaj ligiloj (po lingvo + x-default)
- `theme-color` (plenigita dum rultempo per `theme.ts`)
- `google-site-verification` (kondiĉa)

## Paĝa meta de afiŝo

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) injektas afiŝ-specifajn metadatenojn per `<Fragment slot="head">`:

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (se `modDatetime` estas fiksita)
- **JSON-LD `BlogPosting` strukturitaj datumoj**:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Titolo de afiŝo",
  "image": "URL de OG-bildo",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "Nomo de aŭtoro",
      "url": "Ĉefpaĝo de aŭtoro"
    }
  ]
}
```

## Normaligo de canonical

La kanona strategio sur paĝoj de detaloj de afiŝoj (`PostDetailView.astro`):

1. Propra `canonicalURL` en frontmatter → uzata unue
2. La nuna afiŝo estas **reala traduko** por ĉi tiu lingvo (`locale` kongruas kun la paĝa lingvo) → montras al sia propra URL
3. La nuna afiŝo estas **rezerva enhavo** (neniu traduko havebla, uzante la originalon) → montras al la originala URL de la defaŭlta lingvo

Strategio 3 certigas ke serĉiloj ne traktas paĝojn sen sendependaj tradukoj kiel duoblan enhavon. Afiŝoj kun sendependaj tradukoj havas canonical montrantan al si mem kaj povas esti indeksitaj aparte.

## BreadcrumbList strukturitaj datumoj

Ĉiuj paĝoj kun paneroj (afiŝolisto, etikedindekso, etikedaj afiŝolistoj, arkivoj, pri, serĉo) aŭtomate eligas `BreadcrumbList` JSON-LD strukturitajn datumojn:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Ĉefpaĝo",
      "item": "https://..."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Afiŝoj",
      "item": "https://.../posts/"
    }
  ]
}
```

Kiam la lasta panereto ne havas ligilon (nuna paĝo), la URL de la nuna paĝo estas uzata kiel `item`. Paĝoj de detaloj de afiŝoj ne uzas la paneretan komponanton kaj do ne eligas ĉi tiujn strukturitajn datumojn.

## Open Graph-bildoj

### Dinamika generado

Kun `features.dynamicOgImage` ebligita (defaŭlta), Xingluo dinamike generas 1200×630 OG-bildojn uzante satori + sharp:

- **Nivelo de retejo**: [`src/pages/og.png.ts`](../src/pages/og.png.ts), por paĝoj sen propra OG-bildo
- **Nivelo de afiŝo**: [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts), generita nur por afiŝoj sen `ogImage`

### Tiparoj

OG-bildoj uzas Noto Sans SC (vidu la agordon `fonts` en `astro.config.ts`, CSS-variablo `--font-og`), ŝarĝita per `fontData` de `astro:assets`. La tiparo estas nur por satori kaj ne estas injektita en retejan CSS.

### Rezervoj

- Tiparo nehavebla (sen reto) → rezervas al 1×1 lokokupila PNG (ne malsukcesigas la konstruon)
- `dynamicOgImage` malŝaltita → uzas la statikan defaŭltan OG-bildon sub `public/`

### Rezolucio de OG-bildo de afiŝo

La kvar-nivela rezervo en `PostDetailView.astro`:

1. frontmatter `ogImage` estas ĉeno → uzi rekte
2. frontmatter `ogImage` estas `image()` objekto → uzi `.src`
3. `dynamicOgImage` ebligita → uzi la afiŝ-nivelan `og.png` finpunkton
4. Alie → reteja defaŭlta statika OG-bildo

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) generas la RSS-fluon:

- Titolo, priskribo kaj reteja URL devenas de la agordo `site`
- Elementoj devenas de `getSortedPosts` (skizoj kaj planitaj afiŝoj jam filtritaj)
- `link` de ĉiu elemento estas `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` estas `modDatetime ?? pubDatetime`

`Layout.astro` injektas la RSS-aŭtomalkovran ligilon:

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## Retmapo

La `@astrojs/sitemap` integriĝo (vidu `astro.config.ts`):

- `filter`: filtras arkivajn paĝvojojn surbaze de `features.showArchives`
- `i18n`: ebligas aŭtomatan hreflang-generadon, mapante `zh-cn → zh-CN`, `en → en`, kun defaultLocale `zh-cn`

Generas `sitemap-index.xml` kaj po-lingvajn alternativajn deklarojn; `robots.txt` referencas la retmapon.

## hreflang plurlingvaj deklaroj

`Layout.astro` eligas `<link rel="alternate">` por ĉiu lingvo:

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

Vojoj estas normaligitaj per `parseLocaleFromPath(stripBase(...))` post forigo de prefiksoj, certigante ke ĉiu lingvo mapiĝas al la ĝusta URL. `x-default` indikas al la defaŭlta lingvo.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) generas:

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## Konfirmo de retejo

Konfirmo de Google Search Console estas agordita per `site.googleVerification` du-maniere:

1. Media variablo `PUBLIC_GOOGLE_SITE_VERIFICATION` (rultempa injekto)
2. La kampo `site.googleVerification` en `xingluo.config.ts`

Renderita kiel `<meta name="google-site-verification" content="...">`.
