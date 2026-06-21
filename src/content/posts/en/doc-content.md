---
title: "Content Authoring"
pubDatetime: 2026-06-20T05:00:00+08:00
description: "Xingluo content authoring guide covering post frontmatter, Markdown/MDX syntax, code highlighting, callouts, and content enhancements."
tags:
  - documentation
  - writing
category: "Documentation"
translationKey: doc-content
locale: en
---

Xingluo uses Astro Content Collections to manage content, supporting Markdown (`.md`) and MDX (`.mdx`, requires `features.mdx`).

## Content Collections

Two collections are defined in [`src/content.config.ts`](../src/content.config.ts):

| Collection | Directory            | Purpose                            |
| ---------- | -------------------- | ---------------------------------- |
| `posts`    | `src/content/posts/` | Blog posts                         |
| `pages`    | `src/content/pages/` | Static pages (e.g. the about page) |

File naming conventions:

- Files or directories starting with `_` are ignored (handy for drafts)
- With MDX enabled, `**/*.{md,mdx}` is collected; otherwise only `**/*.md`
- Post URLs are derived from the file path (see the routing section in [Architecture Overview](./doc-architecture.md))

## Post Frontmatter

Full fields for the `posts` collection:

```markdown
---
title: "Post Title" # required
pubDatetime: 2026-06-19T10:00:00+08:00 # required, publish time
modDatetime: 2026-06-20T10:00:00+08:00 # optional, update time
description: "Summary, used for SEO and lists" # required
tags: ["Astro", "blog"] # optional, defaults to ["others"]
featured: true # optional, featured (shown on homepage)
draft: false # optional, drafts are not published
author: "Xingluo" # optional, defaults to site.author
ogImage: "./cover.png" # optional, OG image (image import or string path)
canonicalURL: "https://..." # optional, canonical link
hideEditPost: false # optional, hide the edit link
timezone: "Asia/Shanghai" # optional, override the site timezone
---
```

### Field Reference

| Field            | Type            | Default         | Notes                                                                                                                 |
| ---------------- | --------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `title`          | string          | required        | Post title                                                                                                            |
| `pubDatetime`    | date            | required        | Publish time, ISO 8601                                                                                                |
| `modDatetime`    | date            | —               | Modified date, shown alongside the published date, e.g. "Published 2026-06-19 · Updated 2026-06-20"                   |
| `description`    | string          | required        | Summary, used in meta, RSS, and list cards                                                                            |
| `tags`           | string[]        | `["others"]`    | Tag array; tag pages are generated automatically                                                                      |
| `featured`       | boolean         | —               | Shown in the homepage "Featured" section                                                                              |
| `draft`          | boolean         | —               | Draft; filtered out in production builds (visible in dev)                                                             |
| `author`         | string          | `site.author`   | Author name                                                                                                           |
| `ogImage`        | image \| string | —               | OG image; `image()` goes through Astro's asset pipeline, a string is a `public/` path or external URL                 |
| `canonicalURL`   | string          | —               | Canonical link, overrides the default (see [SEO](./doc-seo.md))                                                       |
| `hideEditPost`   | boolean         | —               | Hide the edit link for this post                                                                                      |
| `timezone`       | string          | `site.timezone` | Override the display timezone for this post                                                                           |
| `locale`         | string          | `site.lang`     | Language the post is written in, e.g. `"en"`, `"ja"`. Defaults to the site language when unset                        |
| `translationKey` | string          | —               | Translation group key: posts sharing the same key are translations of each other. Posts without a key are independent |
| `category`       | string          | —               | Post category (single value), generates a `/categories/<slug>/` page; unset means no category                         |

### Content-Level Translation

Use the `locale` and `translationKey` frontmatter fields to create multilingual versions of your posts:

1. Place the default-language post at `src/content/posts/<slug>.md`
2. Place translations in language subdirectories: `src/content/posts/<locale>/<slug>.md` (e.g. `en/welcome.md`)
3. Set `locale` to the translation's language and `translationKey` to the same value as the original

The routing layer automatically resolves the correct translation per language and deduplicates in listings — the same post in different languages only shows one card per language. Posts without a translation fall back to the original content. See [Internationalization](./doc-i18n.md).

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

See [Media Players](./doc-media-players.md) for details.

### Disabling MDX

With `features.mdx: false`:

- The `mdx()` integration is not loaded
- The content collection glob matches only `*.md` (existing `.mdx` files are not collected)
- The build output contains no MDX runtime

## Comments

The comment system is rendered automatically at the bottom of post detail pages (configure the provider in `features.comments`). See [Comment System](./doc-comments.md).

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
- Automatically ignored by the Flexsearch search index

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
