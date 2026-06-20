---
title: "Theme & Styles"
pubDatetime: 2026-06-20T08:00:00+08:00
description: "Xingluo theme and styling system covering shadcn theme variables, OKLCH color space, Tailwind v4, and dark mode."
tags:
  - documentation
  - theming
category: "Documentation"
translationKey: doc-theming
locale: en
---

Xingluo uses shadcn/ui new-york style components and the OKLCH color space, built on Tailwind CSS v4.

## Style File Structure

[`src/styles/`](../src/styles/):

| File             | Content                                                      |
| ---------------- | ------------------------------------------------------------ |
| `theme.css`      | shadcn theme variables (OKLCH, light `:root` + dark `.dark`) |
| `global.css`     | Tailwind entry, base layer, custom utilities, callout themes |
| `typography.css` | `.app-prose` typography and code block styles                |

## Theme Variables

`theme.css` uses the OKLCH color space to define semantic variables, with light and dark sets:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  /* ... secondary, muted, accent, destructive, border, input, ring ... */
  --code: oklch(0.97 0 0);
  --content-width: 72rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark counterparts ... */
}
```

These variables are mapped to Tailwind tokens in `global.css`'s `@theme inline`, so you can use classes like `bg-background`, `text-foreground`, `border-border` directly.

## Tailwind CSS v4

Xingluo uses Tailwind v4, integrated via the `@tailwindcss/vite` plugin (see `vite.plugins` in `astro.config.ts`).

### Key config (`global.css`)

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... color mappings ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### Custom Utilities

- `max-w-app`: content max width (`--content-width: 72rem`)
- `app-layout`: app layout (min-height 100vh, flex column)

## Dark Mode

### FOUC Protection

`Layout.astro` inlines a synchronous script in `<head>` (`is:inline`) that sets the theme before first paint:

```js
// Read localStorage.theme, or fall back to prefers-color-scheme
// Set the html data-theme attribute and .dark class
```

This avoids a theme flash on refresh.

### Theme Toggle Runtime

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme`: localStorage first, falls back to system preference
- `persist`: persists to localStorage
- `reflect`: syncs `data-theme` attribute, `.dark` class, `#theme-btn` `aria-label`, `<meta name="theme-color">`
- Binds `#theme-btn` click to toggle
- Adapts to View Transitions: rebind on `astro:after-swap`, carry theme-color on `astro:before-swap`
- Listens for system `prefers-color-scheme` changes (follows only when the user has not explicitly chosen)

### Comment and Player Theme Sync

- giscus: switched via `postMessage({giscus:{setConfig:{theme}}})`
- waline: `dark:"html.dark"` selector auto-follows
- twikoo: watches `.dark` class changes and rebuilds (twikoo does not support runtime switching)
- See [Comment System](./doc-comments.md)

## Typography (.app-prose)

`typography.css`'s `.app-prose` builds on `@tailwindcss/typography`'s `prose` with theme overrides:

- Link primary color (`--primary`)
- Inline code background (`--code`)
- Code block dual theme (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- diff / highlight / word line styles
- blockquote, hr, img styles
- details / summary collapse styles
- Image `role="button"` lightbox cursor
- Heading anchor `scroll-margin`

Post body containers use `<article class="app-prose">`.

## shadcn Components

[`src/components/ui/`](../src/components/ui/) provides shadcn-style components:

| Component                                                                              | Notes                                                                  |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `Button`                                                                               | Auto-switches between `<a>` / `<button>`, cva variants (variant, size) |
| `Badge`                                                                                | Badge                                                                  |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Card family                                                            |
| `Input`                                                                                | Input                                                                  |
| `Separator`                                                                            | Separator                                                              |

Variant configs use `class-variance-authority`; class names are merged with `cn` (`src/lib/utils.ts`, based on `tailwind-merge` + `clsx`).

## Icon System

Xingluo's icons are build-time inlined SVGs via astro-icon + Font Awesome (sprite `<symbol>` mode), **zero runtime JS, no font network requests**.

### Icon Mapping (FA5)

| Use           | Icon name                                  |
| ------------- | ------------------------------------------ |
| Search        | `fa-solid:search`                          |
| Close         | `fa-solid:times`                           |
| Mail          | `fa-solid:envelope`                        |
| Other socials | `fa-brands:{name}`                         |
| X (social)    | `fa-brands:twitter` (FA5 has no x-twitter) |

### Social Icon Dynamic Resolution

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) collects `src/assets/icons/socials/*.astro` by filename via `import.meta.glob`; `getSocialIcon(name)` resolves by name. Adding a social platform is as simple as adding an icon file under `socials/`.

## Customizing the Theme

Edit the CSS variables in `src/styles/theme.css` to adjust site-wide colors. For example, to switch to a blue primary:

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

All components referencing `bg-primary` / `text-primary` follow automatically.
