# SEO

Xingluo est livré avec un support SEO complet : Open Graph, Twitter Card, canonical, données structurées JSON-LD, images OG dynamiques, RSS, sitemap et déclarations multilingues hreflang.

## Sortie head

La balise `<head>` dans [`src/layouts/Layout.astro`](../src/layouts/Layout.astro) produit :

- `charset`, `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (canonical link)
- `title`, `meta title`, `meta description`, `meta author`
- `sitemap` lien
- **Open Graph** : `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
- **Twitter Card** : `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **RSS** lien alternatif
- **hreflang** liens alternatifs (par langue + x-default)
- `theme-color` (rempli à l'exécution par `theme.ts`)
- `google-site-verification` (conditionnel)

## Meta des pages d'articles

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) injecte des meta spécifiques à l'article via `<Fragment slot="head">` :

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (si `modDatetime` est défini)
- **Données structurées JSON-LD `BlogPosting`** :

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

## Normalisation canonique

La stratégie canonique sur les pages de détail d'article (`PostDetailView.astro`) :

1. `canonicalURL` personnalisé dans le frontmatter → utilisé en premier
2. L'article actuel est une **vraie traduction** pour cette langue (`locale` correspond à la langue de la page) → pointe vers sa propre URL
3. L'article actuel est un **contenu de repli** (aucune traduction disponible, utilise l'original) → pointe vers l'URL originale de la langue par défaut

La stratégie 3 empêche les moteurs de recherche de traiter les pages sans traductions indépendantes comme du contenu dupliqué. Les articles avec des traductions indépendantes ont un canonical pointant vers eux-mêmes et peuvent être indexés séparément.

## Données structurées BreadcrumbList

Toutes les pages avec fil d'Ariane (liste d'articles, index des tags, liste des articles par tag, archives, à propos, recherche) produisent automatiquement des données structurées JSON-LD `BreadcrumbList` :

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

Lorsque le dernier élément du fil d'Ariane n'a pas de lien (page actuelle), l'URL de la page actuelle est utilisée comme `item`. Les pages de détail d'article n'utilisent pas le composant de fil d'Ariane et ne produisent donc pas ces données structurées.

## Images Open Graph

### Génération dynamique

Avec `features.dynamicOgImage` activé (par défaut), Xingluo génère dynamiquement des images OG de 1200×630 en utilisant satori + sharp :

- **Au niveau du site** : [`src/pages/og.png.ts`](../src/pages/og.png.ts), pour les pages sans image OG personnalisée
- **Au niveau de l'article** : [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts), généré uniquement pour les articles sans `ogImage`

### Polices

Les images OG utilisent Noto Sans SC (voir la config `fonts` dans `astro.config.ts`, variable CSS `--font-og`), chargée via `fontData` d'`astro:assets`. La police est uniquement pour satori et n'est pas injectée dans le CSS du site.

### Replis

- Police indisponible (pas de réseau) → repli sur un PNG placeholder 1×1 (n'échoue pas la build)
- `dynamicOgImage` désactivé → utilise l'image OG statique par défaut sous `public/`

### Résolution de l'image OG d'article

Le repli à quatre niveaux dans `PostDetailView.astro` :

1. `ogImage` du frontmatter est une chaîne → utiliser directement
2. `ogImage` du frontmatter est un objet `image()` → utiliser `.src`
3. `dynamicOgImage` activé → utiliser le point de terminaison `og.png` au niveau de l'article
4. Sinon → image OG statique par défaut du site

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) génère le flux RSS :

- Le titre, la description et l'URL du site proviennent de la config `site`
- Les éléments proviennent de `getSortedPosts` (les brouillons et articles programmés sont déjà filtrés)
- Le `link` de chaque élément est `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` est `modDatetime ?? pubDatetime`

`Layout.astro` injecte le lien de découverte automatique RSS :

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## Sitemap

L'intégration `@astrojs/sitemap` (voir `astro.config.ts`) :

- `filter` : filtre les chemins des pages d'archives selon `features.showArchives`
- `i18n` : active la génération automatique de hreflang, mappant `zh-cn → zh-CN`, `en → en`, avec defaultLocale `zh-cn`

Génère `sitemap-index.xml` et les déclarations alternatives par langue ; `robots.txt` référence le sitemap.

## Déclarations multilingues hreflang

`Layout.astro` produit `<link rel="alternate">` pour chaque langue :

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

Les chemins sont normalisés via `parseLocaleFromPath(stripBase(...))` après suppression des préfixes, garantissant que chaque langue correspond à la bonne URL. `x-default` pointe vers la langue par défaut.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) génère :

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## Vérification du site

La vérification Google Search Console est configurée via `site.googleVerification` de deux manières :

1. Variable d'environnement `PUBLIC_GOOGLE_SITE_VERIFICATION` (injection au moment de l'exécution)
2. Le champ `site.googleVerification` dans `xingluo.config.ts`

Rendu sous forme de `<meta name="google-site-verification" content="...">`.
