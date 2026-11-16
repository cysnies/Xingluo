---
title: "Search"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Xingluo search guide covering Flexsearch full-text search integration, index generation, UI, multilingual search, and performance."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: en
---

Xingluo integrates [Flexsearch](https://github.com/nextapps-de/flexsearch) for client-side full-text search, with per-language indexes and View Transitions state persistence.

## Enabling

Configure via `features.search`:

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

When set to `false`, the search page `Astro.rewrite`s to 404 and no search UI is generated.

## How It Works

### Index Generation

The third build step, `node scripts/generateSearchIndex.mjs`, scans HTML files in the `dist/` directory:

- Parses only post detail pages with an article content container
- Reads the title, description, category, tags, and complete post body
- Excludes the `/posts/` listing and pagination pages such as `/posts/2/`
- Indexes are split automatically by language (`zh-cn` and `en` each get their own)
- Indexes are output to `dist/search/`

### Index Scope

Only post detail pages enter the search index. Post bodies are no longer truncated at a fixed character count, so content near the end of long posts remains searchable. Other pages (home, lists, archives, etc.) do not enter the search index.

## Search UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implements the search page:

- Uses Flexsearch client-side index for search matching in the browser
- Locates index assets via `getAssetPath("search/")`
- Uses shadcn theme variables (`--background`, `--foreground`, `--primary`, etc.) for search box and result list styling
- `transition:persist` preserves search state across navigation

### Search Flow

1. The user types in the search box
2. CJK locales use `Intl.Segmenter` when available and fall back to Flexsearch's `CJK` encoder
3. Flexsearch matches the current language index, then ranks candidates by exact phrase and title matches
4. The result list shows matching posts (title, published/updated dates, category badge, tags, matched content snippet)
5. The search page URL with query params is written to sessionStorage for the back button to restore

Search results support `↑` / `↓` navigation, `Enter` to open a result, and `Esc` to return to the search input or clear the query.

## Source Back-Navigation

The back-navigation mechanism between the search page and post pages:

- The `Main.astro` component writes the source page URL to sessionStorage's `backUrl`
- The post page's `BackButton.astro` prefers to jump back to sessionStorage's `backUrl`, or to the homepage if absent
- The search page writes the URL with query params, restoring the search state when returning from a post

## Multilingual Search

Flexsearch splits indexes by page language:

- `zh-cn` pages (root) → Chinese index
- `en` pages (`/en/` prefix) → English index

Search automatically matches the index for the current page language: Chinese on Chinese pages, English on English pages.

## Theme Adaptation

Flexsearch's search UI uses shadcn theme variables, defined in `SearchView.astro` for search box and result list styling:

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

Dark mode switches automatically via the `.dark` selector, consistent with the site theme.

## Performance

- Flexsearch indexes are static files and search runs entirely in the browser
- The complete index is loaded on demand when the search input is first focused or used
- Complete post bodies are retained to preserve recall for content deep in long posts
- `transition:persist` avoids re-initializing the search UI on navigation
