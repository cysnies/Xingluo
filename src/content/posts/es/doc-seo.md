---
title: "SEO"
pubDatetime: 2026-06-20T11:00:00+08:00
description: "Guía SEO de Xingluo que cubre Open Graph, Twitter Card, canonical, datos estructurados JSON-LD, RSS y sitemap."
tags:
  - documentation
  - seo
category: "Documentation"
translationKey: doc-seo
locale: es
---

Xingluo viene con soporte SEO completo: Open Graph, Twitter Card, canonical, datos estructurados JSON-LD, imágenes OG dinámicas, RSS, sitemap y declaraciones multilingües hreflang.

## Salida del head

El `<head>` en [`src/layouts/Layout.astro`](../src/layouts/Layout.astro) genera:

- `charset`, `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (enlace canónico)
- `title`, `meta title`, `meta description`, `meta author`
- Enlace `sitemap`
- **Open Graph**: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
- **Twitter Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **RSS** enlace alternativo
- **hreflang** enlaces alternativos (por idioma + x-default)
- `theme-color` (rellenado en tiempo de ejecución por `theme.ts`)
- `google-site-verification` (condicional)

## Metadatos de página de artículo

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) inyecta metadatos específicos del artículo mediante `<Fragment slot="head">`:

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (si `modDatetime` está establecido)
- **Datos estructurados JSON-LD `BlogPosting`**:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Título del artículo",
  "image": "URL de imagen OG",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "Nombre del autor",
      "url": "Página de inicio del autor"
    }
  ]
}
```

## Normalización canonical

La estrategia canonical en las páginas de detalle de artículo (`PostDetailView.astro`):

1. `canonicalURL` personalizado en frontmatter → usado primero
2. El artículo actual es una **traducción real** para este idioma (`locale` coincide con el idioma de la página) → apunta a su propia URL
3. El artículo actual es **contenido de respaldo** (no hay traducción disponible, se usa el original) → apunta a la URL original en el idioma predeterminado

La estrategia 3 garantiza que los motores de búsqueda no traten las páginas sin traducciones independientes como contenido duplicado. Los artículos con traducciones independientes tienen canonical que apunta a sí mismos y pueden indexarse por separado.

## Datos estructurados BreadcrumbList

Todas las páginas con migas de pan (lista de artículos, índice de etiquetas, lista de etiquetas, archivos, acerca de, búsqueda) generan automáticamente datos estructurados `BreadcrumbList` JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://..."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Artículos",
      "item": "https://.../posts/"
    }
  ]
}
```

Cuando el último elemento de la miga de pan no tiene enlace (página actual), la URL de la página actual se usa como `item`. Las páginas de detalle de artículo no usan el componente de migas de pan y por lo tanto no generan estos datos estructurados.

## Imágenes Open Graph

### Generación dinámica

Con `features.dynamicOgImage` activado (predeterminado), Xingluo genera dinámicamente imágenes OG de 1200×630 usando satori + sharp:

- **Nivel de sitio**: [`src/pages/og.png.ts`](../src/pages/og.png.ts), para páginas sin una imagen OG personalizada
- **Nivel de artículo**: [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts), generado solo para artículos sin `ogImage`

### Fuentes

Las imágenes OG usan Noto Sans SC (ver la configuración `fonts` en `astro.config.ts`, variable CSS `--font-og`), cargada mediante `fontData` de `astro:assets`. La fuente es solo para satori y no se inyecta en el CSS del sitio.

### Respaldos

- Fuente no disponible (sin red) → retrocede a un PNG de marcador de posición 1×1 (no falla la compilación)
- `dynamicOgImage` desactivado → usa la imagen OG estática predeterminada bajo `public/`

### Resolución de imagen OG de artículo

El respaldo de cuatro niveles en `PostDetailView.astro`:

1. `ogImage` del frontmatter es una cadena → usar directamente
2. `ogImage` del frontmatter es un objeto `image()` → usar `.src`
3. `dynamicOgImage` activado → usar el punto final `og.png` a nivel de artículo
4. De lo contrario → imagen OG estática predeterminada del sitio

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) genera el feed RSS:

- El título, la descripción y la URL del sitio provienen de la configuración `site`
- Los elementos provienen de `getSortedPosts` (borradores y artículos programados ya filtrados)
- El `link` de cada elemento es `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` es `modDatetime ?? pubDatetime`

`Layout.astro` inyecta el enlace de autodescubrimiento RSS:

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## Sitemap

La integración `@astrojs/sitemap` (ver `astro.config.ts`):

- `filter`: filtra las rutas de páginas de archivo según `features.showArchives`
- `i18n`: habilita la generación automática de hreflang, mapeando `zh-cn → zh-CN`, `en → en`, con defaultLocale `zh-cn`

Genera `sitemap-index.xml` y declaraciones alternativas por idioma; `robots.txt` referencia el sitemap.

## Declaraciones multilingües hreflang

`Layout.astro` genera `<link rel="alternate">` para cada idioma:

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

Las rutas se normalizan mediante `parseLocaleFromPath(stripBase(...))` después de eliminar prefijos, asegurando que cada idioma se asigne a la URL correcta. `x-default` apunta al idioma predeterminado.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) genera:

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## Verificación del sitio

La verificación de Google Search Console se configura mediante `site.googleVerification` de dos maneras:

1. Variable de entorno `PUBLIC_GOOGLE_SITE_VERIFICATION` (inyección en tiempo de ejecución)
2. El campo `site.googleVerification` en `xingluo.config.ts`

Se renderiza como `<meta name="google-site-verification" content="...">`.
