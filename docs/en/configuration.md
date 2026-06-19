# Configuration Guide

All configurable options for Xingluo live in the root-level [`xingluo.config.ts`](../xingluo.config.ts). The file provides full type constraints via `defineXingluoConfig`; changes take effect immediately without touching source code.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // Site URL, used for absolute links, RSS, sitemap
  title: "Xingluo",                      // Site title
  description: "A modern blog CMS built with Astro and shadcn",
  author: "Xingluo",                     // Default author name
  profile: "https://xingluo.example.com", // Author homepage (used for JSON-LD)
  ogImage: "default-og.jpg",              // Default OG image (in the public directory)
  lang: "zh-cn",                          // Default language
  timezone: "Asia/Shanghai",              // Timezone (post date display)
  dir: "ltr",                             // Text direction: ltr | rtl
  googleVerification: "",                 // Google Search Console verification value (or via env var)
}
```

| Field                | Default          | Notes                                                                                             |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `url`                | required         | Site root URL; must end with `/`                                                                  |
| `title`              | required         | Site title, used in `<title>` and OG                                                              |
| `description`        | required         | Site description, used in meta and RSS                                                            |
| `author`             | required         | Default author; post frontmatter falls back to this                                               |
| `profile`            | —                | Author homepage, injected into JSON-LD `author.url`                                               |
| `ogImage`            | `default-og.jpg` | Default OG image filename, located in `public/`                                                   |
| `lang`               | required         | Default language code; must match `i18n.defaultLocale` in `astro.config.ts`                       |
| `timezone`           | `Asia/Shanghai`  | dayjs timezone, affects post date display                                                         |
| `dir`                | `ltr`            | Text direction                                                                                    |
| `googleVerification` | —                | Google verification value; can also be injected via the `PUBLIC_GOOGLE_SITE_VERIFICATION` env var |

## posts

```ts
posts: {
  perPage: 8,              // Posts per list page
  perIndex: 5,             // Posts shown on the homepage
  scheduledPostMargin: 900000, // Scheduled-publish tolerance (ms), 15 minutes
}
```

- `perPage`: page size for `/posts/[...page]` and `/tags/[tag]/[...page]`
- `perIndex`: number of posts shown in the homepage "Latest" section
- `scheduledPostMargin`: future posts within this window are treated as published (effective in production; dev shows all)

## features

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "pagefind",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| Field              | Default            | Notes                                                                     |
| ------------------ | ------------------ | ------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | Enable light/dark mode toggle                                             |
| `dynamicOgImage`   | `true`             | Dynamically generate OG images (satori + sharp)                           |
| `showArchives`     | `true`             | Show the archives page (sitemap filters accordingly when off)             |
| `showBackButton`   | `true`             | Show a back button on post pages                                          |
| `editPost.enabled` | `false`            | Show an "Edit this page" link                                             |
| `editPost.url`     | `""`               | Edit link prefix; the post's relative source path is appended             |
| `search`           | `"pagefind"`       | Search solution: `"pagefind"` or `false`                                  |
| `mdx`              | `true`             | Enable MDX parsing and rendering (see [Content Authoring](./content.md))  |
| `comments`         | `{provider:false}` | Comment system config (see [Comment System](./comments.md))               |
| `players.aplayer`  | `false`            | Enable the APlayer audio player (see [Media Players](./media-players.md)) |
| `players.dplayer`  | `false`            | Enable the DPlayer video player                                           |

### editPost

`editPost.url` is a repository edit URL prefix; Xingluo appends the post's relative source path (`src/content/posts/...`). For example:

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

The post `src/content/posts/welcome.md` produces the link `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: icon name, corresponding to `src/assets/icons/socials/{name}.astro`. Built-in: `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url`: link URL; `mailto:` for email
- `linkTitle`: optional accessible title; auto-generated from the name when omitted

> Adding a social platform: create a `.astro` icon component of the same name under `src/assets/icons/socials/`. `src/lib/socialIcons.ts` collects them automatically via `import.meta.glob`.

## shareLinks

```ts
shareLinks: [
  { name: "x", url: "https://x.com/intent/post?url=" },
  { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
  { name: "telegram", url: "https://t.me/share/url?url=" },
  { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
  { name: "mail", url: "mailto:?subject=...&body=" },
];
```

These share entries appear at the bottom of post pages. `url` is a share URL prefix; Xingluo appends the current post's absolute URL. `name` likewise maps to an icon under `src/assets/icons/socials/`.

## Environment Variables

Declared via `env.schema` in `astro.config.ts`:

| Variable                          | Access level    | Description                                        |
| --------------------------------- | --------------- | -------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Google Search Console verification value, optional |

Example (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

The value is injected into `config.site.googleVerification` and rendered as `<meta name="google-site-verification">`.

## Full Example

See [`xingluo.config.ts`](../xingluo.config.ts). The `features.comments` and `features.players` sections include commented examples for giscus / twikoo / waline; uncomment and fill in real values to enable.
