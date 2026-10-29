---
title: "SEO"
pubDatetime: 2026-06-20T11:00:00+08:00
description: "SEO-Leitfaden für Xingluo mit Open Graph, Twitter Card, canonical, JSON-LD-Strukturdaten, RSS und Sitemap."
tags:
  - documentation
  - seo
category: "Documentation"
translationKey: doc-seo
locale: de
---

Xingluo wird mit vollständiger SEO-Unterstützung ausgeliefert: Open Graph, Twitter Card, canonical, JSON-LD-Strukturdaten, dynamische OG-Bilder, RSS, Sitemap und hreflang mehrsprachige Deklarationen.

## head-Ausgabe

Der `<head>` in [`src/layouts/Layout.astro`](../src/layouts/Layout.astro) gibt aus:

- `charset`, `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (kanonischer Link)
- `title`, `meta title`, `meta description`, `meta author`
- `sitemap`-Link
- **Open Graph**: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
- **Twitter Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **RSS**-Alternativlink
- **hreflang**-Alternativlinks (pro Sprache + x-default)
- `theme-color` (zur Laufzeit von `theme.ts` gesetzt)
- `google-site-verification` (bedingt)

## Beitragsseiten-Meta

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) injiziert beitragsspezifische Meta über `<Fragment slot="head">`:

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (falls `modDatetime` gesetzt ist)
- **JSON-LD `BlogPosting`-Strukturdaten**:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Beitragstitel",
  "image": "OG-Bild-URL",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "Autorenname",
      "url": "Autoren-Startseite"
    }
  ]
}
```

## canonical-Normalisierung

Die canonical-Strategie auf Beitragsdetailseiten (`PostDetailView.astro`):

1. Benutzerdefinierte `canonicalURL` im Frontmatter → zuerst verwendet
2. Der aktuelle Beitrag ist eine **echte Übersetzung** für diese Sprache (`locale` stimmt mit Seitensprache überein) → verweist auf eigene URL
3. Der aktuelle Beitrag ist **Fallback-Inhalt** (keine Übersetzung verfügbar, Original wird verwendet) → verweist auf die URL des Originals in der Standardsprache

Strategie 3 stellt sicher, dass Suchmaschinen Seiten ohne eigenständige Übersetzungen nicht als Duplicate Content behandeln. Beiträge mit eigenständigen Übersetzungen haben canonical, das auf sich selbst verweist, und können separat indiziert werden.

## BreadcrumbList-Strukturdaten

Alle Seiten mit Breadcrumbs (Beitragsliste, Tag-Index, Tag-Beitragsliste, Archive, Über, Suche) geben automatisch `BreadcrumbList` JSON-LD-Strukturdaten aus:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Startseite",
      "item": "https://..."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Beiträge",
      "item": "https://.../posts/"
    }
  ]
}
```

Wenn das letzte Breadcrumb-Element keinen Link hat (aktuelle Seite), wird die aktuelle Seiten-URL als `item` verwendet. Beitragsdetailseiten verwenden keine Breadcrumb-Komponente und geben daher diese Strukturdaten nicht aus.

## Open-Graph-Bilder

### Dynamische Generierung

Mit aktiviertem `features.dynamicOgImage` (Standard) generiert Xingluo dynamisch 1200×630 OG-Bilder mit satori + sharp:

- **Site-Ebene**: [`src/pages/og.png.ts`](../src/pages/og.png.ts), für Seiten ohne benutzerdefiniertes OG-Bild
- **Beitragsebene**: [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts), nur für Beiträge ohne `ogImage` generiert

### Schriftarten

OG-Bilder verwenden Noto Sans SC (siehe die `fonts`-Konfiguration in `astro.config.ts`, CSS-Variable `--font-og`), geladen über `astro:assets`'s `fontData`. Die Schriftart ist nur für satori und wird nicht in das Site-CSS eingebunden.

### Fallbacks

- Schriftart nicht verfügbar (kein Netzwerk) → Fallback auf ein 1×1-Platzhalter-PNG (bricht den Build nicht ab)
- `dynamicOgImage` deaktiviert → verwendet das statische Standard-OG-Bild unter `public/`

### Beitrags-OG-Bild-Auflösung

Der vierstufige Fallback in `PostDetailView.astro`:

1. Frontmatter `ogImage` ist ein String → direkt verwenden
2. Frontmatter `ogImage` ist ein `image()`-Objekt → `.src` verwenden
3. `dynamicOgImage` aktiviert → den beitragsspezifischen `og.png`-Endpunkt verwenden
4. Andernfalls → Standard-OG-Bild der Site

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) generiert den RSS-Feed:

- Titel, Beschreibung und Site-URL stammen aus der `site`-Konfiguration
- Einträge stammen von `getSortedPosts` (Entwürfe und geplante Beiträge bereits gefiltert)
- Der `link` jedes Eintrags ist `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` ist `modDatetime ?? pubDatetime`

`Layout.astro` injiziert den RSS-Autodiscovery-Link:

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## Sitemap

Die `@astrojs/sitemap`-Integration (siehe `astro.config.ts`):

- `filter`: filtert Archivseitenpfade basierend auf `features.showArchives`
- `i18n`: ermöglicht automatische hreflang-Generierung, Zuordnung `zh-cn → zh-CN`, `en → en`, mit defaultLocale `zh-cn`

Generiert `sitemap-index.xml` und sprachspezifische Alternativdeklarationen; `robots.txt` verweist auf die Sitemap.

## hreflang-Mehrsprachigkeitsdeklarationen

`Layout.astro` gibt `<link rel="alternate">` für jede Sprache aus:

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

Pfade werden über `parseLocaleFromPath(stripBase(...))` nach Entfernen von Präfixen normalisiert, sodass jede Sprache der korrekten URL zugeordnet wird. `x-default` verweist auf die Standardsprache.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) generiert:

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## Site-Verifizierung

Die Google Search Console-Verifizierung wird über `site.googleVerification` auf zwei Arten konfiguriert:

1. Umgebungsvariable `PUBLIC_GOOGLE_SITE_VERIFICATION` (Laufzeit-Injektion)
2. Das Feld `site.googleVerification` in `xingluo.config.ts`

Gerendert als `<meta name="google-site-verification" content="...">`.
