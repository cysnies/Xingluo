# Content Authoring

Xingluo uses Astro Content Collections to manage content, supporting Markdown (`.md`) and MDX (`.mdx`, requires `features.mdx`).

## Content Collections

Two collections are defined in [`src/content.config.ts`](../src/content.config.ts):

| Collection | Directory | Purpose |
| --- | --- | --- |
| `posts` | `src/content/posts/` | Blog posts |
| `pages` | `src/content/pages/` | Static pages (e.g. the about page) |

File naming conventions:

- Files or directories starting with `_` are ignored (handy for drafts)
- With MDX enabled, `**/*.{md,mdx}` is collected; otherwise only `**/*.md`
- Post URLs are derived from the file path (see the routing section in [Architecture Overview](./architecture.md))

## Post Frontmatter

Full fields for the `posts` collection:

```markdown
---
title: "Post Title"                       # required
pubDatetime: 2026-06-19T10:00:00+08:00    # required, publish time
modDatetime: 2026-06-20T10:00:00+08:00    # optional, update time
description: "Summary, used for SEO and lists" # required
tags: ["Astro", "blog"]                   # optional, defaults to ["others"]
featured: true                            # optional, featured (shown on homepage)
draft: false                              # optional, drafts are not published
author: "Xingluo"                         # optional, defaults to site.author
ogImage: "./cover.png"                    # optional, OG image (image import or string path)
canonicalURL: "https://..."               # optional, canonical link
hideEditPost: false                       # optional, hide the edit link
timezone: "Asia/Shanghai"                 # optional, override the site timezone
---
```

### Field Reference

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | string | required | Post title |
| `pubDatetime` | date | required | Publish time, ISO 8601 |
| `modDatetime` | date | — | Update time; shows an "updated" label |
| `description` | string | required | Summary, used in meta, RSS, and list cards |
| `tags` | string[] | `["others"]` | Tag array; tag pages are generated automatically |
| `featured` | boolean | — | Shown in the homepage "Featured" section |
| `draft` | boolean | — | Draft; filtered out in production builds (visible in dev) |
| `author` | string | `site.author` | Author name |
| `ogImage` | image \| string | — | OG image; `image()` goes through Astro's asset pipeline, a string is a `public/` path or external URL |
| `canonicalURL` | string | — | Canonical link, overrides the default (see [SEO](./seo.md)) |
| `hideEditPost` | boolean | — | Hide the edit link for this post |
| `timezone` | string | `site.timezone` | Override the display timezone for this post |

### Scheduled Publishing

Posts with future timestamps are filtered in production using the `scheduledPostMargin` tolerance: if `pubDatetime` is within the tolerance window (default 15 minutes) of the current time, the post is treated as published. In development, all non-draft posts are visible.

## Static Page Frontmatter

The `pages` collection has simpler fields:

```markdown
---
title: "About"
description: "About this site"     # optional
ogImage: "default-og.jpg"          # optional, string only
canonicalURL: "https://..."        # optional
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

<APlayer audio={[{ name: "Song", artist: "Artist", url: "/audio.mp3", cover: "/cover.jpg" }]} />

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

See [Media Players](./media-players.md) for details.

### Disabling MDX

With `features.mdx: false`:

- The `mdx()` integration is not loaded
- The content collection glob matches only `*.md` (existing `.mdx` files are not collected)
- The build output contains no MDX runtime

## Comments

The comment system is rendered automatically at the bottom of post detail pages (configure the provider in `features.comments`). See [Comment System](./comments.md).
