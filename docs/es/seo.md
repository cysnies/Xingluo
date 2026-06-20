# SEO

Xingluo viene con soporte SEO completo: Open Graph, Twitter Card, canonical, datos estructurados JSON-LD, imágenes OG dinámicas, RSS, sitemap y declaraciones multilingües hreflang.

## Salida del head

El `<head>` en [`src/layouts/Layout.astro`](../src/layouts/Layout.astro) genera:

- `charset`, `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (enlace canónico)
- `title`, `meta title`, `meta description`, `meta author`
- `sitemap` link
- **Open Graph**: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
- **Twitter Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **RSS** alternate link
- **hreflang** enlaces alternativos (por idioma + x-default)
- `theme-color` (rellenado en tiempo de ejecución por `theme.ts`)
- `google-site-verification` (condicional)

## Meta de páginas de artículo

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) inyecta meta específica del artículo mediante `<Fragment slot="head">`:

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (si `modDatetime` está establecido)
- **JSON-LD `BlogPosting` datos estructurados**:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post title",
  "image": "OG image URL",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "Author name",
      "url": "Author homepage"
    }
  ]
}
```

## Normalización canonical

La estrategia canónica en las páginas de detalle de artículos (`PostDetailView.astro`):

1. `canonicalURL` personalizado en frontmatter → se usa primero
2. El artículo actual es una **traducción real** para este idioma (`locale` coincide con el idioma de la página) → apunta a su propia URL
3. El artículo actual es **contenido de respaldo** (no hay traducción disponible, se usa el original) → apunta a la URL original del idioma predeterminado

La estrategia 3 asegura que los motores de búsqueda no traten las páginas sin traducciones independientes como contenido duplicado. Los artículos con traducciones independientes tienen canonical apuntando a sí mismos y pueden indexarse por separado.

## Datos estructurados BreadcrumbList

Todas las páginas con migas de pan (lista de artículos, índice de etiquetas, lista de artículos por etiqueta, archivos, acerca de, búsqueda) generan automáticamente datos estructurados JSON-LD `BreadcrumbList`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://..."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Posts",
      "item": "https://.../posts/"
    }
  ]
}
```

Cuando el último elemento de la ruta de navegación no tiene enlace (página actual), la URL de la página actual se usa como `item`. Las páginas de detalle de artículos no usan el componente de ruta de navegación y, por lo tanto, no generan estos datos estructurados.

## Imágenes Open Graph

### Generación dinámica

Con `features.dynamicOgImage` habilitado (predeterminado), Xingluo genera dinámicamente imágenes OG de 1200×630 usando satori + sharp:

- **Nivel de sitio**: [`src/pages/og.png.ts`](../src/pages/og.png.ts), para páginas sin imagen OG personalizada
- **Nivel de artículo**: [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts), generado solo para artículos sin `ogImage`

### Fuentes

Las imágenes OG usan Noto Sans SC (consulta la configuración `fonts` en `astro.config.ts`, variable CSS `--font-og`), cargado mediante `fontData` de `astro:assets`. La fuente es solo para satori y no se inyecta en el CSS del sitio.

### Fallbacks

- Fuente no disponible (sin red) → recurre a un PNG de marcador de posición 1×1 (no falla la compilación)
- `dynamicOgImage` desactivado → usa la imagen OG estática predeterminada en `public/`

### Resolución de imagen OG de artículo

El fallback de cuatro niveles en `PostDetailView.astro`:

1. `ogImage` en frontmatter es una cadena → usar directamente
2. `ogImage` en frontmatter es un objeto `image()` → usar `.src`
3. `dynamicOgImage` habilitado → usar el endpoint `og.png` del artículo
4. De lo contrario → imagen OG estática predeterminada del sitio

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) genera el feed RSS:

- El título, la descripción y la URL del sitio provienen de la configuración `site`
- Los elementos provienen de `getSortedPosts` (borradores y publicaciones programadas ya filtrados)
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

La integración `@astrojs/sitemap` (consulta `astro.config.ts`):

- `filter`: filtra las rutas de página de archivo según `features.showArchives`
- `i18n`: habilita la generación automática de hreflang, mapeando `zh-cn → zh-CN`, `en → en`, con defaultLocale `zh-cn`

Genera `sitemap-index.xml` y declaraciones alternativas por idioma; `robots.txt` referencia el sitemap.

## Declaraciones multilingües hreflang

`Layout.astro` genera `<link rel="alternate">` para cada idioma:

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

Las rutas se normalizan a través de `parseLocaleFromPath(stripBase(...))` después de eliminar los prefijos, asegurando que cada idioma se asigne a la URL correcta. `x-default` apunta al idioma predeterminado.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) genera:

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## Verificación del sitio

La verificación de Google Search Console se configura mediante `site.googleVerification` de dos formas:

1. Variable de entorno `PUBLIC_GOOGLE_SITE_VERIFICATION` (inyección en tiempo de ejecución)
2. El campo `site.googleVerification` en `xingluo.config.ts`

Se renderiza como `<meta name="google-site-verification" content="...">`.
