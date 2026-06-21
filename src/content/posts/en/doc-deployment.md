---
title: "Deployment"
pubDatetime: 2026-06-20T13:00:00+08:00
description: "Xingluo deployment guide covering static hosting platforms (Netlify/Vercel/GitHub Pages), Nginx self-hosting, Docker, and environment variables."
tags:
  - documentation
  - deployment
category: "Documentation"
translationKey: doc-deployment
locale: en
---

Xingluo is a purely static site; `pnpm build` generates the `dist/` directory, hostable on any static hosting service.

## Build Output

```bash
pnpm build
```

The generated `dist/` contains:

- All static HTML pages (including `[locale]/` mirrors)
- JS / CSS / font assets under `_astro/`
- The `search/` search index
- The site-level `og.png` and per-post `og.png`
- `rss.xml`, `sitemap-index.xml`, `robots.txt`
- Static assets under `public/` (favicon, default OG image, etc.)

## Environment Variables

Set at build time:

| Variable                          | Description                                         |
| --------------------------------- | --------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification value (optional) |

PowerShell example:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

In CI environments (e.g. GitHub Actions), inject via `env` before the build step.

## Pre-Deployment Checklist

Before deploying, ensure:

1. `site.url` in `xingluo.config.ts` is set to the production domain
2. `site.title`, `site.description`, `site.author`, etc. are customized
3. If a comment system is enabled, the provider config (giscus repoId, twikoo envId, waline serverURL) has real values
4. `public/default-og.jpg` (or the configured `site.ogImage`) is replaced with the site default OG image
5. `public/favicon.svg` is replaced with the site icon

## Static Hosting Platforms

### Netlify / Vercel / Cloudflare Pages

| Config           | Value        |
| ---------------- | ------------ |
| Build command    | `pnpm build` |
| Output directory | `dist`       |
| Node version     | 22.12.0+     |
| Package manager  | pnpm         |

An optional `vercel.json` for Vercel:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

Deploy via GitHub Actions; sample workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          PUBLIC_GOOGLE_SITE_VERIFICATION: ${{ secrets.GOOGLE_VERIFICATION }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

> If deploying under a subpath (e.g. `https://user.github.io/repo/`), set `base: "/repo/"` in `astro.config.ts`.

### Nginx / Self-Hosted

Upload `dist/` to the server; sample Nginx config:

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Performance Notes

- Assets under `_astro/` have hashed filenames and can be cached long-term (`immutable`)
- HTML files should not be cached (or only briefly) to ensure timely content updates
- Flexsearch indexes load on demand; no special caching strategy needed
- After deployment, verify that OG images, RSS, and the sitemap are accessible

## Comment System Backends

If you enable a comment system, deploy the corresponding backend:

| Comment system | Backend requirement                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| giscus         | None; use the giscus.app public service (or self-host [giscus-vercel](https://github.com/giscus/giscus-vercel)) |
| twikoo         | Deploy the twikoo server (Vercel / CloudBase / self-host)                                                       |
| waline         | Deploy the waline server (Vercel / Cloudflare / self-host)                                                      |

See each comment system's official docs and [Comment System](./doc-comments.md).
