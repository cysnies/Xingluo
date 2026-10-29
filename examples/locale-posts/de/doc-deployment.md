---
title: "Bereitstellung"
pubDatetime: 2026-06-20T13:00:00+08:00
description: "Bereitstellungsleitfaden für Xingluo mit statischen Hosting-Plattformen (Netlify/Vercel/GitHub Pages), Nginx-Self-Hosting, Docker und Umgebungsvariablen."
tags:
  - documentation
  - deployment
category: "Documentation"
translationKey: doc-deployment
locale: de
---

Xingluo ist eine rein statische Website; `pnpm build` erzeugt das `dist/`-Verzeichnis, das auf jedem statischen Hosting-Dienst gehostet werden kann.

## Build-Ausgabe

```bash
pnpm build
```

Das generierte `dist/` enthält:

- Alle statischen HTML-Seiten (inkl. `[locale]/`-Spiegel)
- JS-/CSS-/Schriftart-Assets unter `_astro/`
- Den `search/`-Suchindex
- Das site-weite `og.png` und beitragsbezogene `og.png`
- `rss.xml`, `sitemap-index.xml`, `robots.txt`
- Statische Assets unter `public/` (favicon, Standard-OG-Bild, usw.)

## Umgebungsvariablen

Zur Build-Zeit gesetzt:

| Variable                          | Beschreibung                                        |
| --------------------------------- | --------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console-Verifizierungswert (optional) |

PowerShell-Beispiel:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "ihr-code"
pnpm build
```

In CI-Umgebungen (z. B. GitHub Actions) über `env` vor dem Build-Schritt injizieren.

## Checkliste vor der Bereitstellung

Stellen Sie vor der Bereitstellung sicher:

1. `site.url` in `xingluo.config.ts` ist auf die Produktionsdomain gesetzt
2. `site.title`, `site.description`, `site.author` usw. sind angepasst
3. Wenn ein Kommentarsystem aktiviert ist, enthält die Anbieterkonfiguration (giscus repoId, twikoo envId, waline serverURL) echte Werte
4. `public/default-og.jpg` (oder das konfigurierte `site.ogImage`) wurde durch das Standard-OG-Bild der Site ersetzt
5. `public/favicon.svg` wurde durch das Site-Symbol ersetzt

## Statische Hosting-Plattformen

### Netlify / Vercel / Cloudflare Pages

| Konfiguration      | Wert         |
| ------------------ | ------------ |
| Build-Befehl       | `pnpm build` |
| Ausgabeverzeichnis | `dist`       |
| Node-Version       | 22.12.0+     |
| Paketmanager       | pnpm         |

Eine optionale `vercel.json` für Vercel:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

Bereitstellung über GitHub Actions; Beispiel-Workflow:

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

> Bei Bereitstellung unter einem Unterpfad (z. B. `https://user.github.io/repo/`) setzen Sie `base: "/repo/"` in `astro.config.ts`.

### Nginx / Self-Hosted

Laden Sie `dist/` auf den Server hoch; Beispiel-Nginx-Konfiguration:

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Statisches Asset-Caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Leistungshinweise

- Assets unter `_astro/` haben gehashte Dateinamen und können langfristig gecacht werden (`immutable`)
- HTML-Dateien sollten nicht (oder nur kurz) gecacht werden, um zeitnahe Inhaltsaktualisierungen zu gewährleisten
- Flexsearch-Indizes werden bei Bedarf geladen; keine spezielle Caching-Strategie erforderlich
- Überprüfen Sie nach der Bereitstellung, ob OG-Bilder, RSS und die Sitemap erreichbar sind

## Kommentarsystem-Backends

Wenn Sie ein Kommentarsystem aktivieren, stellen Sie das entsprechende Backend bereit:

| Kommentarsystem | Backend-Anforderung                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| giscus          | Keine; nutzen Sie den giscus.app-öffentlichen Dienst (oder self-host [giscus-vercel](https://github.com/giscus/giscus-vercel)) |
| twikoo          | Stellen Sie den twikoo-Server bereit (Vercel / CloudBase / Self-Host)                                                          |
| waline          | Stellen Sie den waline-Server bereit (Vercel / Cloudflare / Self-Host)                                                         |

Siehe die offizielle Dokumentation der jeweiligen Kommentarsysteme und [Kommentarsystem](./doc-comments.md).
