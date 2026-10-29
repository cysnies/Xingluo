---
title: "SEO"
pubDatetime: 2026-06-20T11:00:00+08:00
description: "Guia SEO do Xingluo cobrindo Open Graph, Twitter Card, canonical, dados estruturados JSON-LD, RSS e sitemap."
tags:
  - documentation
  - seo
category: "Documentation"
translationKey: doc-seo
locale: pt
---

Xingluo vem com suporte SEO completo: Open Graph, Twitter Card, canonical, dados estruturados JSON-LD, imagens OG dinâmicas, RSS, sitemap e declarações multilingues hreflang.

## Saída do head

O `<head>` em [`src/layouts/Layout.astro`](../src/layouts/Layout.astro) gera:

- `charset`, `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (link canônico)
- `title`, `meta title`, `meta description`, `meta author`
- link do `sitemap`
- **Open Graph**: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
- **Twitter Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **RSS** link alternativo
- **hreflang** links alternativos (por idioma + x-default)
- `theme-color` (preenchido em tempo de execução por `theme.ts`)
- `google-site-verification` (condicional)

## Meta da página do post

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) injeta meta específica do post via `<Fragment slot="head">`:

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (se `modDatetime` estiver definido)
- **Dados estruturados JSON-LD `BlogPosting`**:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Título do post",
  "image": "URL da imagem OG",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "Nome do autor",
      "url": "Página inicial do autor"
    }
  ]
}
```

## Normalização canonical

A estratégia canônica nas páginas de detalhes dos posts (`PostDetailView.astro`):

1. `canonicalURL` personalizado no frontmatter → usado primeiro
2. O post atual é uma **tradução real** para este idioma (`locale` corresponde ao idioma da página) → aponta para sua própria URL
3. O post atual é **conteúdo de fallback** (nenhuma tradução disponível, usando o original) → aponta para a URL original do idioma padrão

A estratégia 3 garante que os motores de busca não tratem páginas sem traduções independentes como conteúdo duplicado. Posts com traduções independentes têm canonical apontando para si mesmos e podem ser indexados separadamente.

## Dados estruturados BreadcrumbList

Todas as páginas com breadcrumbs (lista de posts, índice de tags, lista de posts por tag, arquivos, sobre, pesquisa) geram automaticamente dados estruturados JSON-LD `BreadcrumbList`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
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

Quando o último item do breadcrumb não tem link (página atual), a URL da página atual é usada como `item`. Páginas de detalhes de posts não usam o componente breadcrumb e portanto não geram estes dados estruturados.

## Imagens Open Graph

### Geração dinâmica

Com `features.dynamicOgImage` ativado (padrão), Xingluo gera dinamicamente imagens OG de 1200×630 usando satori + sharp:

- **Nível do site**: [`src/pages/og.png.ts`](../src/pages/og.png.ts), para páginas sem imagem OG personalizada
- **Nível do post**: [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts), gerado apenas para posts sem `ogImage`

### Fontes

Imagens OG usam Noto Sans SC (veja a configuração `fonts` em `astro.config.ts`, variável CSS `--font-og`), carregado via `fontData` do `astro:assets`. A fonte é apenas para satori e não é injetada no CSS do site.

### Fallbacks

- Fonte indisponível (sem rede) → recorre a um PNG placeholder 1×1 (não falha a build)
- `dynamicOgImage` desativado → usa a imagem OG estática padrão em `public/`

### Resolução de imagem OG do post

O fallback de quatro níveis em `PostDetailView.astro`:

1. frontmatter `ogImage` é uma string → usar diretamente
2. frontmatter `ogImage` é um objeto `image()` → usar `.src`
3. `dynamicOgImage` ativado → usar o endpoint `og.png` do post
4. Caso contrário → imagem OG estática padrão do site

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) gera o feed RSS:

- Título, descrição e URL do site vêm da configuração `site`
- Itens vêm de `getSortedPosts` (rascunhos e posts agendados já filtrados)
- O `link` de cada item é `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` é `modDatetime ?? pubDatetime`

`Layout.astro` injeta o link de autodescoberta RSS:

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## Sitemap

A integração `@astrojs/sitemap` (veja `astro.config.ts`):

- `filter`: filtra caminhos de página de arquivo com base em `features.showArchives`
- `i18n`: ativa a geração automática de hreflang, mapeando `zh-cn → zh-CN`, `en → en`, com defaultLocale `zh-cn`

Gera `sitemap-index.xml` e declarações alternativas por idioma; `robots.txt` referencia o sitemap.

## Declarações multilingues hreflang

`Layout.astro` gera `<link rel="alternate">` para cada idioma:

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

Os caminhos são normalizados via `parseLocaleFromPath(stripBase(...))` após remover prefixos, garantindo que cada idioma mapeie para a URL correta. `x-default` aponta para o idioma padrão.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) gera:

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## Verificação do site

A verificação do Google Search Console é configurada via `site.googleVerification` de duas formas:

1. Variável de ambiente `PUBLIC_GOOGLE_SITE_VERIFICATION` (injeção em tempo de execução)
2. O campo `site.googleVerification` em `xingluo.config.ts`

Renderizado como `<meta name="google-site-verification" content="...">`.
