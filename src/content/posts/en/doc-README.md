---
title: "Xingluo Documentation"
pubDatetime: 2026-06-20T02:00:00+08:00
description: "Xingluo project documentation overview with navigation, core features, and tech stack."
tags:
  - documentation
  - xingluo
category: "Documentation"
translationKey: doc-README
locale: en
---

Xingluo is a modern blog CMS built on [Astro](https://astro.build/) and the [shadcn/ui](https://ui.shadcn.com/) visual style. It delivers a more modern visual experience through flat, elegant shadcn components and the OKLCH color system, and natively integrates a comment system, optional MDX support, and audio/video players.

## Documentation Index

| Document                                       | Content                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------ |
| [Getting Started](./doc-getting-started.md)    | Requirements, installation, local dev, build and preview                       |
| [Configuration Guide](./doc-configuration.md)  | Full reference for `xingluo.config.ts`                                         |
| [Content Authoring](./doc-content.md)          | Post frontmatter, Markdown/MDX syntax, code blocks, callouts, enhancements     |
| [Internationalization](./doc-i18n.md)          | Multilingual routing, UI strings, content-level translation, adding a language |
| [Architecture Overview](./doc-architecture.md) | Directory layout, config flow, render flow, build pipeline                     |
| [Theme & Styles](./doc-theming.md)             | shadcn theme variables, OKLCH, Tailwind v4, dark mode                          |
| [Comment System](./doc-comments.md)            | Choosing and wiring up giscus / twikoo / waline                                |
| [Media Players](./doc-media-players.md)        | Using APlayer / DPlayer in Markdown and MDX                                    |
| [SEO](./doc-seo.md)                            | OG images, RSS, sitemap, hreflang, canonical, structured data                  |
| [Search](./doc-search.md)                      | Pagefind full-text search integration                                          |
| [Deployment](./doc-deployment.md)              | Static hosting, GitHub Pages, environment variables, Docker                    |

## Core Features

- **Top-tier performance**: Astro static generation, build-time inlined SVG icons (zero runtime JS), lazy-loaded comments and players, orphan asset cleanup
- **Modern visuals**: shadcn/ui new-york components, OKLCH color space, smooth dark mode (FOUC protection)
- **Multilingual**: UI and content-level translation, `prefixDefaultLocale: false` routing, hreflang and x-default SEO declarations
- **Content enhancement**: optional MDX, Shiki dual-theme code highlighting, callouts, collapsible TOC, scrollable tables
- **Reading time**: smart estimation (CJK by character count, Latin by word count), shown on cards and detail pages
- **Related posts**: automatically recommended by shared tags
- **Post categories**: assign via frontmatter, with dedicated category pages and a nav entry
- **Sticky TOC sidebar**: right-side sticky table of contents on large screens, IntersectionObserver scroll spying
- **Comment system**: giscus / twikoo / waline, theme-aware, lazy-loaded
- **Media players**: APlayer audio and DPlayer video, with both MD fence and MDX component entry points
- **Search**: Pagefind full-text search, per-language indexes, View Transitions state persistence
- **Full SEO**: dynamic OG images (satori + sharp), RSS, sitemap, JSON-LD structured data (BlogPosting + BreadcrumbList), canonical normalization

## Tech Stack

| Category          | Technology                                                           |
| ----------------- | -------------------------------------------------------------------- |
| Framework         | Astro 6.x                                                            |
| Styling           | Tailwind CSS v4, shadcn/ui style components, @tailwindcss/typography |
| Icons             | astro-icon + Font Awesome                                            |
| Content           | Astro Content Collections, MDX, remark/rehype plugin chain           |
| Code highlighting | Shiki                                                                |
| Search            | Pagefind                                                             |
| OG images         | satori + sharp                                                       |
| Comments          | giscus / twikoo / waline                                             |
| Players           | APlayer / DPlayer                                                    |
| Date              | dayjs                                                                |
| Package manager   | pnpm                                                                 |
| Language          | TypeScript                                                           |

## License

AGPL-3.0
