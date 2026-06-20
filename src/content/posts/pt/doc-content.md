---
title: "Criação de Conteúdo"
pubDatetime: 2026-06-20T05:00:00+08:00
description: "Guia de criação de conteúdo do Xingluo cobrindo frontmatter de posts, sintaxe Markdown/MDX, realce de código, callouts e melhorias de conteúdo."
tags:
  - documentation
  - writing
category: "Documentation"
translationKey: doc-content
locale: pt
---

Xingluo usa Astro Content Collections para gerenciar conteúdo, suportando Markdown (`.md`) e MDX (`.mdx`, requer `features.mdx`).

## Coleções de Conteúdo

Duas coleções são definidas em [`src/content.config.ts`](../src/content.config.ts):

| Coleção | Diretório            | Propósito                            |
| ------- | -------------------- | ------------------------------------ |
| `posts` | `src/content/posts/` | Posts do blog                        |
| `pages` | `src/content/pages/` | Páginas estáticas (ex. página sobre) |

Convenções de nomenclatura de arquivos:

- Arquivos ou diretórios começando com `_` são ignorados (útil para rascunhos)
- Com MDX ativado, `**/*.{md,mdx}` é coletado; caso contrário, apenas `**/*.md`
- As URLs dos posts são derivadas do caminho do arquivo (veja a seção de roteamento em [Visão geral da arquitetura](./doc-architecture.md))

## Post Frontmatter

Campos completos para a coleção `posts`:

```markdown
---
title: "Título do Post" # obrigatório
pubDatetime: 2026-06-19T10:00:00+08:00 # obrigatório, data de publicação
modDatetime: 2026-06-20T10:00:00+08:00 # opcional, data de atualização
description: "Resumo, usado para SEO e listas" # obrigatório
tags: ["Astro", "blog"] # opcional, padrão ["others"]
featured: true # opcional, destacado (mostrado na página inicial)
draft: false # opcional, rascunhos não são publicados
author: "Xingluo" # opcional, padrão site.author
ogImage: "./cover.png" # opcional, imagem OG (importação de imagem ou caminho de string)
canonicalURL: "https://..." # opcional, link canônico
hideEditPost: false # opcional, ocultar o link de edição
timezone: "Asia/Shanghai" # opcional, substituir o fuso horário do site
---
```

### Referência de Campos

| Campo            | Tipo            | Padrão          | Notas                                                                                                            |
| ---------------- | --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `title`          | string          | obrigatório     | Título do post                                                                                                   |
| `pubDatetime`    | date            | obrigatório     | Data de publicação, ISO 8601                                                                                     |
| `modDatetime`    | date            | —               | Data de atualização; mostra um rótulo "atualizado"                                                               |
| `description`    | string          | obrigatório     | Resumo, usado em meta, RSS e cartões de lista                                                                    |
| `tags`           | string[]        | `["others"]`    | Array de tags; páginas de tags são geradas automaticamente                                                       |
| `featured`       | boolean         | —               | Mostrado na seção "Destacados" da página inicial                                                                 |
| `draft`          | boolean         | —               | Rascunho; filtrado em builds de produção (visível em desenvolvimento)                                            |
| `author`         | string          | `site.author`   | Nome do autor                                                                                                    |
| `ogImage`        | image \| string | —               | Imagem OG; `image()` passa pelo pipeline de assets do Astro, string é um caminho `public/` ou URL externa        |
| `canonicalURL`   | string          | —               | Link canônico, substitui o padrão (veja [SEO](./doc-seo.md))                                                     |
| `hideEditPost`   | boolean         | —               | Ocultar o link de edição para este post                                                                          |
| `timezone`       | string          | `site.timezone` | Substituir o fuso horário de exibição para este post                                                             |
| `locale`         | string          | `site.lang`     | Idioma em que o post foi escrito, ex. `"en"`, `"ja"`. Padrão é o idioma do site quando não definido              |
| `translationKey` | string          | —               | Chave de grupo de tradução: posts com a mesma chave são traduções um do outro. Posts sem chave são independentes |
| `category`       | string          | —               | Categoria do post (valor único), gera uma página `/categories/<slug>/`; não definido significa sem categoria     |

### Content-Level Translation

Use the `locale` and `translationKey` frontmatter fields to create multilingual versions of your posts:

1. Place the default-language post at `src/content/posts/<slug>.md`
2. Place translations in language subdirectories: `src/content/posts/<locale>/<slug>.md` (e.g. `en/welcome.md`)
3. Set `locale` to the translation's language and `translationKey` to the same value as the original

The routing layer automatically resolves the correct translation per language and deduplicates in listings — the same post in different languages only shows one card per language. Posts without a translation fall back to the original content. See [Internacionalização](./doc-i18n.md).

### Scheduled Publishing

Posts with future timestamps are filtered in production using the `scheduledPostMargin` tolerance: if `pubDatetime` is within the tolerance window (default 15 minutes) of the current time, the post is treated as published. In development, all non-draft posts are visible.

## Static Page Frontmatter

The `pages` collection has simpler fields:

```markdown
---
title: "About"
description: "About this site" # optional
ogImage: "default-og.jpg" # optional, string only
canonicalURL: "https://..." # optional
---
```

The about page is fetched via `getEntry("pages", "about")` and requires creating `src/content/pages/about.md`.

## Markdown Enhancements

Xingluo ships with the following remark / rehype plugins (see `astro.config.ts`):

### Table of Contents

`remark-toc` generates the TOC automatically; `remark-collapse` collapses it by default. Insert the placeholder in a post:

```markdown
## Table of contents

(The TOC is auto-filled here)
```

### Callouts

`rehype-callouts` supports Obsidian-style callouts:

```markdown
> [!NOTE]
> Note content

> [!WARNING]
> Warning content

> [!TIP]
> Tip content
```

Supported types: `NOTE`, `TIP`, `INFO`, `WARNING`, `DANGER`, `SUCCESS`, `QUESTION`, `FAILURE`, and more.

### Code Highlighting

Shiki dual theme (light `min-light`, dark `night-owl`) supports:

- Line highlighting: ` ```js {1,3-5} `
- Word highlighting: ` ```js /word/ `
- Diff markers: `+` / `-` at line start
- File name labels: ` ```js file=src/index.ts ` or `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // highlighted line
}
```

### Tables

Wide tables are automatically wrapped in a horizontally scrollable container (the `rehypeWrapTable` plugin), preventing overflow on narrow screens.

## MDX Support

With `features.mdx` enabled (default), you can use `.mdx` files for component-driven authoring.

### Custom Components

Xingluo's built-in MDX components live in [`src/components/mdx/`](../src/components/mdx) and are imported from a unified entry:

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# My Post

<APlayer
  audio={[
    { name: "Song", artist: "Artist", url: "/audio.mp3", cover: "/cover.jpg" },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

See [Reprodutores de mídia](./doc-media-players.md) for details.

### Disabling MDX

With `features.mdx: false`:

- The `mdx()` integration is not loaded
- The content collection glob matches only `*.md` (existing `.mdx` files are not collected)
- The build output contains no MDX runtime

## Comments

The comment system is rendered automatically at the bottom of post detail pages (configure the provider in `features.comments`). See [Sistema de comentários](./doc-comments.md).

## Reading Time

Estimated reading time is shown automatically on post detail pages and list cards:

- **CJK languages** (zh-cn, ja, ko): calculated by CJK character count, ~400 characters per minute
- **Other languages**: calculated by word count (whitespace-delimited), ~200 words per minute
- Result rounded up, minimum 1 minute

Before counting, code blocks, HTML tags, Markdown link URLs, and other non-body content are stripped to keep the estimate close to actual reading volume. No configuration needed.

## Related Posts

Up to 2 related posts are shown at the bottom of post detail pages (after previous/next navigation):

- Sorted by number of shared tags, descending
- Same score sorted by publish date, descending (preferring newer posts)
- Section is not rendered when no posts share tags
- Automatically ignored by the pagefind search index

No configuration needed.

## Sticky TOC Sidebar

A sticky table of contents sidebar appears on the right side of post detail pages on large screens (≥1024px):

- Auto-generated from h2–h6 headings in the article, presented as a flat indented list
- Indentation reflects heading depth (h3 has one more level of indent than h2)
- Current section is highlighted as you scroll (IntersectionObserver)
- Clicking a TOC entry smoothly scrolls to the corresponding heading
- Hidden on small screens (mobile), where the inline collapsible TOC is available

Generated from the `headings` returned by Astro's `render()` — no manual TOC maintenance by the author. The inline `remark-toc` collapsible TOC (write `## Table of contents` in your post) coexists with the sidebar for small-screen use.

## Categories

Assign a category to a post via the `category` frontmatter field (a single string):

```yaml
---
title: "My Post"
category: "tutorial"
---
```

- The category page lives at `/categories/<slug>/`; the slug is normalized via `slugifyStr` (CJK preserved, Latin lowercased with hyphens)
- The category index at `/categories/` lists all categories
- Post cards and detail pages automatically show a category link (click to jump to the category page)
- A post belongs to at most one category (unlike multiple `tags`); posts without `category` appear in no category
- Category pages reuse `posts.perPage` for pagination and support multilingual mirror routes (`/en/categories/...`)
- Disable categories via `features.showCategories: false` (nav entry and pages removed, sitemap filtered)
