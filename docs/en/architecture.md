# Architecture Overview

This document describes Xingluo's overall architecture, directory layout, config flow, render flow, and build pipeline, to help you understand code organization and how to extend it.

## Directory Structure

```
xingluo/
├── astro.config.ts          # Astro config (integrations, i18n, markdown, fonts, env)
├── xingluo.config.ts        # User config entry
├── tsconfig.json            # TypeScript config (strict + @/* path alias)
├── package.json             # Dependencies and scripts
├── public/                  # Static assets (favicon.svg, default OG image, etc.)
├── docs/                    # Project docs (this directory)
├── references/              # Read-only reference project sources (must not be depended on)
└── src/
    ├── config.ts            # Merge config defaults, export resolved config
    ├── content.config.ts    # Content collection schemas (posts, pages)
    ├── env.d.ts             # Third-party module and env var type declarations
    ├── assets/              # Icon components
    │   └── icons/           # astro-icon + Font Awesome (includes socials/)
    ├── components/          # UI components
    │   ├── ui/              # shadcn-style components (Button, Card, Badge, etc.)
    │   ├── post/            # Post page components (prev/next nav, back, share, etc.)
    │   ├── comments/        # Comment system components
    │   ├── mdx/             # MDX custom components (APlayer, DPlayer)
    │   ├── pageViews/       # Page views (centralized page render logic)
    │   └── *.astro          # Root-level components (Header, Footer, PostCard, etc.)
    ├── content/             # Content files
    │   ├── posts/           # Blog posts
    │   └── pages/           # Static pages
    ├── i18n/                # Internationalization
    │   ├── index.ts         # Language loading and useTranslations
    │   ├── types.ts         # Full UIStrings type
    │   ├── routing.ts       # locale path resolution
    │   ├── staticPaths.ts   # getStaticPaths for non-default locales
    │   ├── format.ts        # Template string replacement
    │   └── lang/            # Language resource files (zh-cn.ts, en.ts)
    ├── layouts/             # Layouts
    │   ├── Layout.astro     # Base skeleton (head, SEO, FOUC)
    │   └── PostLayout.astro # Post layout (JSON-LD, article meta)
    ├── lib/                 # Foundational utilities
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # dayjs instance and timezone plugin
    │   └── socialIcons.ts   # Social icon dynamic resolution
    ├── pages/               # Routes (root + [locale]/ mirror)
    ├── scripts/             # Client-side scripts
    │   ├── theme.ts         # Theme toggle
    │   ├── postEnhancements.ts # Post enhancements (anchors, copy, lightbox, progress)
    │   ├── comments.ts      # Comment lazy loading and theme sync
    │   └── players.ts       # Player lazy loading
    ├── styles/              # Styles
    │   ├── global.css       # Tailwind entry + base layer + custom utilities
    │   ├── theme.css        # shadcn theme variables (OKLCH)
    │   └── typography.css   # .app-prose typography and code block styles
    ├── types/               # Type declarations
    │   ├── config.ts        # Config types
    │   └── *.d.ts           # Declarations for untyped third-party modules
    └── utils/               # Utility functions
        ├── getPostPaths.ts  # Post slug and URL derivation
        ├── getSortedPosts.ts# Post sorting
        ├── postFilter.ts    # Draft and scheduled post filtering
        ├── getUniqueTags.ts # Tag deduplication
        ├── remarkPlayers.ts # Player remark plugin
        ├── rehypeWrapTable.ts# Table scroll wrapper
        └── ...              # Other utilities
```

## Config Flow

```
xingluo.config.ts
   │ defineXingluoConfig (type constraints, passthrough)
   ▼
src/config.ts
   │ resolveConfig (merge defaults + resolveComments + resolvePlayers)
   ▼
src/types/config.ts
   │ XingluoConfig (full type)
   ▼
Referenced site-wide via import config from "@/config"
```

Key points:

- `xingluo.config.ts` is the only config file users need to edit
- `resolveConfig` in `src/config.ts` does shallow merges (`site`/`posts`) and deep merges (`features.editPost`, `features.comments`, `features.players`)
- `astro.config.ts` reads the unresolved `./xingluo.config` (because integration loading is decided at the Astro config layer), so it accesses `features` with optional chaining
- `src/content.config.ts` reads the resolved `@/config`, so `features` is required

## Render Flow

### Page Rendering

Xingluo uses a "thin page wrapper + view component" pattern, centralizing render logic in `src/components/pageViews/`:

```
src/pages/posts/[...slug]/index.astro   ← thin wrapper: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← render logic
    │
    ▼
src/layouts/PostLayout.astro  ← post layout (JSON-LD, article meta)
    │
    ▼
src/layouts/Layout.astro      ← base skeleton (head, SEO, FOUC, ClientRouter)
```

The thin wrapper page handles only `getStaticPaths` and passing props; the view component holds all render logic. The `[locale]/` mirror pages are likewise thin wrappers, generating only non-default locales via `getLocaleParams()`.

### Routing

```
src/pages/
├── 404.astro                      # 404 (not mirrored)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # Site-level OG image endpoint
├── rss.xml.ts                     # RSS endpoint
├── robots.txt.ts                  # robots.txt endpoint
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # Post-level OG image endpoint
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Non-default locale mirror (getStaticPaths=getLocaleParams)
    └── (structure mirrors the root, except 404, og.png, rss, robots)
```

### Post URL Derivation

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: derives the routing slug from the content collection `id` and file path, filtering `_`-prefixed directories
- `getPostUrl(id, filePath, locale)`: generates a navigable URL with the locale prefix (default locale has no prefix)

### Post Filtering and Sorting

- [`postFilter.ts`](../src/utils/postFilter.ts): excludes drafts; filters future posts in production using `pubDatetime - scheduledPostMargin`; dev shows all
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): after filtering, sorts descending by `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): deduplicates and sorts tags by slug

## Client-Side Scripts

Xingluo's client-side interactions are loaded via `<script>` tags at the bottom of pages, all adapted for View Transitions:

| Script                | Load location                                            | Event adaptation                                                                                      | Responsibilities                                             |
| --------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `theme.ts`            | end of `Layout.astro` body                               | rebind on `astro:after-swap`, carry theme-color on `astro:before-swap`, `prefers-color-scheme` change | Theme persistence and toggle                                 |
| `postEnhancements.ts` | `PostDetailView.astro`                                   | reinit on `astro:page-load`                                                                           | Heading anchors, code copy, reading progress, image lightbox |
| `comments.ts`         | `Comments.astro`                                         | rescan on `astro:page-load`                                                                           | Comment lazy loading and theme sync                          |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (conditional) | rescan on `astro:page-load`                                                                           | Player lazy loading                                          |

> Note: `comments.ts` and `players.ts` have no top-level import/export; add `export {}` at the end of the file to mark them as modules and avoid global declaration conflicts with other files.

## Build Pipeline

`pnpm run build` = `astro check && astro build && pagefind --site dist`

1. **`astro check`**: TypeScript + Astro template type checking
2. **`astro build`**:
   - Collect content collections (include `.mdx` based on `features.mdx`)
   - Statically generate all pages (including `[locale]/` mirrors)
   - Generate endpoints: RSS, sitemap, robots.txt, site-level and post-level OG images
   - Conditionally load the `mdx()` integration; conditionally inject `remarkPlayers`
   - Inline SVG icons at build time (astro-icon, zero runtime JS)
   - Dynamically imported comment and player modules are split into standalone chunks (lazy-loaded)
3. **`pagefind --site dist`**: scans `dist/` content marked with `data-pagefind-body`, generating per-language search indexes into `dist/pagefind/`

## Performance Strategies

- **Zero runtime JS icons**: astro-icon inlines Font Awesome SVGs at build time (sprite `<symbol>` mode)
- **SVG optimization**: `experimental.svgOptimizer` (svgo) compresses inlined and referenced SVGs
- **On-demand lazy loading**: comments and players dynamically import via IntersectionObserver when scrolled into view; zero bundle when disabled
- **Conditional integrations**: with MDX off, the `mdx()` integration is not loaded; with players off, the remark plugin is not injected
- **CSS size**: Tailwind v4 generates on demand; OKLCH variables are centrally managed
- **OG image fonts**: used only by satori, not injected into site CSS
- **View Transitions**: `<ClientRouter/>` powers page transition animations; the search box uses `transition:persist` to keep state

## Extension Guide

### Adding a Page

1. Create an `.astro` file in `src/pages/` (thin wrapper)
2. Create the corresponding View component in `src/components/pageViews/`
3. For multilingual support, create a same-named mirror thin wrapper in `src/pages/[locale]/`

### Adding a UI Component

Follow the shadcn style: create `.astro` components and `.ts` variant configs under `src/components/ui/` (using `class-variance-authority`).

### Adding a Client-Side Script

Create a `.ts` file in `src/scripts/`, add `export {}` at the end to mark it as a module, listen for `astro:page-load` to adapt to View Transitions, and import it in a `<script>` tag on the relevant page.
