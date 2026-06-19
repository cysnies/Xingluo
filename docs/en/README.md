# Xingluo Documentation

Xingluo is a modern blog CMS built on [Astro](https://astro.build/) and the [shadcn/ui](https://ui.shadcn.com/) visual style. It delivers a more modern visual experience through flat, elegant shadcn components and the OKLCH color system, and natively integrates a comment system, optional MDX support, and audio/video players.

## Documentation Index

| Document                                   | Content                                                       |
| ------------------------------------------ | ------------------------------------------------------------- |
| [Getting Started](./getting-started.md)    | Requirements, installation, local dev, build and preview      |
| [Configuration Guide](./configuration.md)  | Full reference for `xingluo.config.ts`                        |
| [Content Authoring](./content.md)          | Post frontmatter, Markdown/MDX syntax, code blocks, callouts  |
| [Architecture Overview](./architecture.md) | Directory layout, config flow, render flow, build pipeline    |
| [Internationalization](./i18n.md)          | Multilingual routing, UI strings, adding a language           |
| [Theme & Styles](./theming.md)             | shadcn theme variables, OKLCH, Tailwind v4, dark mode         |
| [Comment System](./comments.md)            | Choosing and wiring up giscus / twikoo / waline               |
| [Media Players](./media-players.md)        | Using APlayer / DPlayer in Markdown and MDX                   |
| [SEO](./seo.md)                            | OG images, RSS, sitemap, hreflang, canonical, structured data |
| [Search](./search.md)                      | Pagefind full-text search integration                         |
| [Deployment](./deployment.md)              | Static hosting, environment variables, platform adapters      |

## Core Features

- **Top-tier performance**: Astro static generation, build-time inlined SVG icons (zero runtime JS), lazy-loaded comments and players, optimized CSS bundle size
- **Modern visuals**: shadcn/ui new-york components, OKLCH color space, smooth dark mode (FOUC protection)
- **Multilingual**: bilingual UI (zh-CN / en), `prefixDefaultLocale: false` routing, hreflang and x-default SEO declarations
- **Content enhancement**: optional MDX, Shiki dual-theme code highlighting, callouts, collapsible TOC, scrollable tables
- **Comment system**: giscus / twikoo / waline, theme-aware, lazy-loaded
- **Media players**: APlayer audio and DPlayer video, with both MD fence and MDX component entry points
- **Search**: Pagefind full-text search, per-language indexes, View Transitions state persistence
- **Full SEO**: dynamic OG images (satori + sharp), RSS, sitemap, JSON-LD structured data, canonical normalization

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
