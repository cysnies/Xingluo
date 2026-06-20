---
title: "Welcome to Xingluo"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo is a modern blog CMS built with Astro and shadcn visual style. This post introduces the design philosophy and core features."
tags:
  - announcement
  - Astro
featured: true
locale: en
translationKey: welcome-to-xingluo
category: announcement
---

## About Xingluo

**Xingluo** is a blog CMS built with Astro and the shadcn visual style.

## Core Features

- ⚡ **Extreme performance**: static generation with Astro, zero runtime JavaScript overhead
- 🎨 **Modern visuals**: shadcn/ui new-york style, OKLCH color space
- 🌗 **Dark mode**: flicker-free switching, follows system preference
- 🔍 **Full-text search**: build-time indexing powered by Pagefind
- 🌐 **Multilingual**: Simplified Chinese and English support
- 📝 **Markdown**: MDX, syntax highlighting, table of contents, callouts
- 📡 **RSS & SEO**: RSS feed and structured data out of the box

## Code Example

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Get Started Writing

Create a Markdown file in the `src/content/posts/` directory, add frontmatter, and publish your article. Detailed field descriptions can be found in the project documentation.

Start your writing journey!
