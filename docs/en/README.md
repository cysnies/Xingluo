<div align="center">

<img src="../public/favicon.svg" width="96" height="96" alt="Xingluo" />

# Xingluo

A modern blog CMS built with Astro and the shadcn visual system

[![CI](https://github.com/cysnies/Xingluo/actions/workflows/ci.yml/badge.svg)](https://github.com/cysnies/Xingluo/actions/workflows/ci.yml)
[![Deploy Pages](https://github.com/cysnies/Xingluo/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/cysnies/Xingluo/actions/workflows/deploy-pages.yml)
[![Publish Image](https://github.com/cysnies/Xingluo/actions/workflows/publish-image.yml/badge.svg)](https://github.com/cysnies/Xingluo/pkgs/container/xingluo)
[![License: AGPL-3.0](https://img.shields.io/github/license/cysnies/Xingluo?label=License&color=blue)](../LICENSE)
[![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Node](https://img.shields.io/badge/Node-%E2%89%A5%2022.12-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Stars](https://img.shields.io/github/stars/cysnies/Xingluo?style=social)](https://github.com/cysnies/Xingluo/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/cysnies/Xingluo)](https://github.com/cysnies/Xingluo/commits/main)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/cysnies/Xingluo/compare)

<p>
  <a href="../zh-cn/README.md">简体中文</a> · <a href="./README.md">English</a> ·
  <a href="../de/README.md">Deutsch</a> · <a href="../es/README.md">Español</a> ·
  <a href="../fr/README.md">Français</a> · <a href="../ja/README.md">日本語</a> ·
  <a href="../ko/README.md">한국어</a> · <a href="../pt/README.md">Português</a> ·
  <a href="../ru/README.md">Русский</a> · <a href="../ar/README.md">العربية</a> ·
  <a href="../eo/README.md">Esperanto</a> ·
  <a href="../zh-tw/README.md">繁體中文</a>
</p>

</div>

> Delivers a more modern visual experience through flat, elegant shadcn components and the OKLCH color system; natively integrates a comment system, optional MDX, and audio/video players.

---

## ✨ Features

- ⚡ **Top-tier performance** — Astro static generation, zero runtime JS, lazy-loaded comments and players, orphan asset cleanup
- 🎨 **Modern visuals** — shadcn/ui new-york style, OKLCH color space, smooth dark mode
- 🌗 **Dark mode** — flicker-free toggle, follows system preference, comment and player themes sync automatically
- 🔍 **Full-text search** — build-time indexing powered by Flexsearch, per-language indexes
- 🌐 **Multilingual** — multilingual UI and content-level translation, hreflang and x-default SEO declarations
- 📝 **Content enhancement** — Markdown and MDX support, Shiki dual-theme code highlighting, callouts, collapsible TOC, scrollable tables
- 📖 **Reading time** — smart estimation (CJK by character count, Latin by word count), shown on cards and detail pages
- 🔗 **Related posts** — recommended by shared tags, automatically sorted
- 🏷️ **Post categories** — assign via frontmatter, with dedicated category pages and a nav entry
- 📌 **Sticky TOC sidebar** — right-side sticky table of contents on large screens, IntersectionObserver scroll spying
- 💬 **Comment system** — Giscus / Twikoo / Waline, theme-aware, lazy-loaded
- 🎵 **Media players** — APlayer (audio) and DPlayer (video), usable from both Markdown and MDX
- 📡 **SEO** — dynamic OG images, RSS, sitemap, JSON-LD structured data (BlogPosting + BreadcrumbList), canonical normalization

## 🚀 Quick Start

Requirements:

- Node.js ≥ 22.12.0
- pnpm 10.x

```bash
pnpm install      # Install dependencies
pnpm dev          # Start the dev server
pnpm build        # Build for production
pnpm preview      # Preview the production build
```

## 📁 Project Structure

```
src/
├── components/     # UI components
├── content/        # Content collections (posts and standalone pages)
├── i18n/           # Multilingual resources and tooling
├── layouts/        # Layout components
├── lib/            # Utility libraries
├── pages/          # Route pages
├── scripts/        # Client-side scripts
├── styles/         # Global styles and theme variables
├── types/          # Type definitions and third-party module declarations
└── utils/          # Utility functions
```

## ⚙️ Configuration

The configuration file is [`xingluo.config.ts`](../xingluo.config.ts), where you can customize site information, feature toggles, social links, comment systems, and players.

See the [Configuration Guide](./configuration.md) for all options.

## ✍️ Writing

Create Markdown or MDX files under `src/content/posts/` with the following frontmatter:

```yaml
---
title: "Post Title"
pubDatetime: 2026-06-19T10:00:00+08:00
description: "Post description"
tags: ["Tag1", "Tag2"]
featured: false # optional, featured post
draft: false # optional, draft
ogImage: "./cover.png" # optional, OG image
---
```

<details>
<summary><b>Inserting players in Markdown</b></summary>

````markdown
```aplayer
{"audio":[{"name":"Song","url":"/song.mp3","cover":"/cover.jpg"}]}
```

```dplayer
{"video":{"url":"/demo.mp4","pic":"/cover.jpg"}}
```
````

</details>

<details>
<summary><b>Using components in MDX</b></summary>

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

<APlayer audio={[{ name: "Song", url: "/song.mp3" }]} />
<DPlayer video={{ url: "/demo.mp4" }} />
```

</details>

## 📚 Documentation

The full project documentation lives in the [`docs/`](../docs/) directory, available in multiple languages:

| Language  | Documentation Entry               |
| --------- | --------------------------------- |
| 简体中文  | [docs/zh-cn/](../zh-cn/README.md) |
| English   | [docs/en/](./README.md)           |
| Deutsch   | [docs/de/](../de/README.md)       |
| Español   | [docs/es/](../es/README.md)       |
| Français  | [docs/fr/](../fr/README.md)       |
| 日本語    | [docs/ja/](../ja/README.md)       |
| 한국어    | [docs/ko/](../ko/README.md)       |
| Português | [docs/pt/](../pt/README.md)       |
| Русский   | [docs/ru/](../ru/README.md)       |
| العربية   | [docs/ar/](../ar/README.md)       |
| Esperanto | [docs/eo/](../eo/README.md)       |
| 繁體中文  | [docs/zh-tw/](../zh-tw/README.md) |

Each language edition includes the following documents:

| Document              | Description                                        |
| --------------------- | -------------------------------------------------- |
| Getting Started       | Install, develop, and build                        |
| Configuration Guide   | Site info and feature toggles                      |
| Content Authoring     | Frontmatter, writing conventions, and enhancements |
| Internationalization  | UI and content-level multilingual translation      |
| Architecture Overview | Project structure and design decisions             |
| Theme & Styles        | shadcn visuals and OKLCH                           |
| Comment System        | giscus / twikoo / waline                           |
| Media Players         | APlayer / DPlayer                                  |
| SEO                   | OG images, RSS, sitemap, structured data           |
| Search                | Flexsearch full-text search indexing               |
| Deployment            | Static hosting, GitHub Pages, and Docker           |

## 🛠️ Tech Stack

| Category          | Project                                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| Framework         | [Astro](https://astro.build) 6.x                                               |
| Styling           | [Tailwind CSS](https://tailwindcss.com) v4, [shadcn/ui](https://ui.shadcn.com) |
| Icons             | astro-icon + Font Awesome                                                      |
| Code highlighting | Shiki                                                                          |
| Search            | [Flexsearch](https://github.com/nextapps-de/flexsearch)                        |
| OG images         | satori + sharp                                                                 |
| Comments          | giscus / twikoo / waline                                                       |
| Players           | APlayer / DPlayer                                                              |
| Date              | [dayjs](https://day.js.org)                                                    |
| Language          | TypeScript (strict)                                                            |
| Package manager   | pnpm                                                                           |

## 🐳 Container Deployment

```bash
# Build the image
docker build -t xingluo .

# Run the container
docker run -d -p 8080:80 --name xingluo xingluo
```

## 📜 License

[AGPL-3.0](../LICENSE)
