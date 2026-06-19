# Search

Xingluo integrates [Pagefind](https://pagefind.app/) for static full-text search, with per-language indexes and View Transitions state persistence.

## Enabling

Configure via `features.search`:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

When set to `false`, the search page `Astro.rewrite`s to 404 and no search UI is generated.

## How It Works

### Index Generation

The third build step, `pagefind --site dist`, scans the `dist/` directory:

- Only pages with the `data-pagefind-body` attribute are indexed
- Indexes are split automatically by language (`zh-cn` and `en` each get their own)
- Indexes are output to `dist/pagefind/`

### Index Scope

The `<main>` on post detail pages is marked `data-pagefind-body`, so only post bodies are indexed. Other pages (home, lists, archives, etc.) do not enter the search index.

## Search UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implements the search page:

- Loads `@pagefind/default-ui` for the search box and result list
- Locates index assets via `getAssetPath("pagefind/")`
- Global styles override Pagefind CSS variables, mapping them to Xingluo's theme (`--background`, `--foreground`, `--primary`, etc.)
- `transition:persist` preserves search state across navigation

### Search Flow

1. The user types in the search box
2. Pagefind matches against the current language index
3. The result list shows matching posts (title, summary highlight)
4. `processTerm` writes the search page URL with query params to sessionStorage, for the back button to restore

## Source Back-Navigation

The back-navigation mechanism between the search page and post pages:

- The `Main.astro` component writes the source page URL to sessionStorage's `backUrl`
- The post page's `BackButton.astro` prefers to jump back to sessionStorage's `backUrl`, or to the homepage if absent
- The search page's `processTerm` writes the URL with query params, restoring the search state when returning from a post

## Multilingual Search

Pagefind splits indexes by the language attribute of `data-pagefind-body` elements:

- `zh-cn` pages (root) → Chinese index
- `en` pages (`/en/` prefix) → English index

Search automatically matches the index for the current page language: Chinese on Chinese pages, English on English pages.

## Theme Adaptation

Pagefind's default UI has its own CSS variables; Xingluo overrides them with global styles in `SearchView.astro`, mapping to shadcn theme variables:

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

Dark mode switches automatically via the `.dark` selector, consistent with the site theme.

## Performance

- Pagefind indexes are static files; search happens client-side with no server requests
- Indexes are loaded on demand (index fragments download only when searching)
- `transition:persist` avoids re-initializing the search UI on navigation
