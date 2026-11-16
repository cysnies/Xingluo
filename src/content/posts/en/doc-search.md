---
title: "Search"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Xingluo search guide covering Pagefind shard indexes, category filters, matching excerpts, multilingual search, and performance."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: en
---

Xingluo uses [Pagefind](https://pagefind.app/) for full-text search. The build creates a compressed, sharded index, and each query downloads only the matching dictionary data, filters, and content fragments instead of the full text of every post.

## Enabling

Configure `features.search`:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

The legacy `"flexsearch"` value remains accepted as an alias that enables search. Setting it to `false` makes the search route `Astro.rewrite` to 404.

## How It Works

### Index Generation

After `astro build`, `node scripts/generatePagefindIndex.mjs` uses Pagefind 1.6 to scan `dist/`:

- Indexes only post bodies marked with `data-pagefind-body`
- Captures title, description, publication time, category, and tags as metadata
- Separates page language and category through Pagefind filters
- Excludes code blocks, players, buttons, icons, and interactive controls
- Writes on-demand index fragments to `dist/pagefind/`

### Index Scope

Home, post lists, pagination, archives, category listings, and tag listings are excluded from the body index. Code blocks are excluded so tokenized source and player controls do not appear in search excerpts.

## Search UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implements the search page:

- Loads Pagefind only when a search is used
- Shows a large search box, a visible clear action, and result count
- Shows category facets and per-query category counts in the left column
- Shows Pagefind title, metadata, and multiple matching body excerpts on the right
- Uses the site yellow emphasis style for Pagefind `<mark>` highlights
- Preserves state across navigation with `transition:persist`

### Search Flow

1. The user enters a query
2. Pagefind downloads only the dictionary and body fragments needed for that query
3. Results are filtered by the current page language and selected categories
4. Category counts update on the left while matching posts and excerpts render on the right
5. Category selections update repeated `category` query parameters
6. The search URL is written to sessionStorage for back-button restoration

Results support `↑` / `↓` navigation, `Enter` to open a result, and `Esc` to return to the input or clear the query.

## Source Back-Navigation

- `Main.astro` writes the source page URL to `backUrl` in sessionStorage
- `BackButton.astro` restores that URL when available
- The search page stores its query and filter state in that URL

## Multilingual Search

Pagefind builds indexes from each document's HTML language and `language` filter field. A query only requests results for the current page language.

## Performance

- The build creates a sharded index, so browsers no longer download every post body and build a FlexSearch index in memory
- Queries fetch only the dictionary and content fragments relevant to the search
- The default bilingual example site currently produces about 0.34 MB of Pagefind assets, guarded by `scripts/budget.mjs`
- Code and interface controls are excluded from the body index
- `transition:persist` avoids reinitializing the search UI during navigation
