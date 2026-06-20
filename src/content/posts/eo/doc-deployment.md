---
title: "Deplojo"
pubDatetime: 2026-06-20T13:00:00+08:00
description: "Gvidilo pri deplojo de Xingluo kovranta statikajn gastigajn platformojn (Netlify/Vercel/GitHub Pages), Nginx-memgastigadon, Docker kaj mediajn variablojn."
tags:
  - documentation
  - deployment
category: "Documentation"
translationKey: doc-deployment
locale: eo
---

Xingluo estas pure statika retejo; `pnpm build` generas la `dist/` dosierujon, hostebla sur iu ajn statika gastiga servo.

## Konstrua eligo

```bash
pnpm build
```

La generita `dist/` enhavas:

- Ĉiujn statikajn HTML-paĝojn (inkluzive de `[locale]/` speguloj)
- JS / CSS / tiparaj aktivaĵoj sub `_astro/`
- La `pagefind/` serĉindekson
- La retej-nivelan `og.png` kaj po-afiŝan `og.png`
- `rss.xml`, `sitemap-index.xml`, `robots.txt`
- Statikajn aktivaĵojn sub `public/` (favicon, defaŭlta OG-bildo, ktp.)

## Mediaj variabloj

Agorditaj dum konstrutempo:

| Variablo                          | Priskribo                                           |
| --------------------------------- | --------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Konfirma valoro de Google Search Console (nedeviga) |

PowerShell-ekzemplo:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

En CI-medioj (ekz. GitHub Actions), injektu per `env` antaŭ la konstrutpaŝo.

## Kontrollisto antaŭ deplojo

Antaŭ deploji, certigu:

1. `site.url` en `xingluo.config.ts` estas agordita al la produktadomaeno
2. `site.title`, `site.description`, `site.author`, ktp. estas agorditaj
3. Se komenta sistemo estas ebligita, la agordo de provizanto (giscus repoId, twikoo envId, waline serverURL) havas realajn valorojn
4. `public/default-og.jpg` (aŭ la agordita `site.ogImage`) estas anstataŭigita per la defaŭlta OG-bildo de la retejo
5. `public/favicon.svg` estas anstataŭigita per la reteja ikono

## Statikaj gastigaj platformoj

### Netlify / Vercel / Cloudflare Pages

| Agordo            | Valoro       |
| ----------------- | ------------ |
| Konstrua komando  | `pnpm build` |
| Elira dosierujo   | `dist`       |
| Node-versio       | 22.12.0+     |
| Pakaĵadministrilo | pnpm         |

Nedeviga `vercel.json` por Vercel:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

Deploji per GitHub Actions; ekzempla laborfluo:

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

> Se deplojante sub subpado (ekz. `https://user.github.io/repo/`), agordu `base: "/repo/"` en `astro.config.ts`.

### Nginx / Mem-gastigita

Alŝutu `dist/` al la servilo; ekzempla Nginx-agordo:

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Stapling de statikaj aktivaĵoj
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Rendimentaj notoj

- Aktivaĵoj sub `_astro/` havas haketitajn dosiernomojn kaj povas esti kaŝitaj longtempe (`immutable`)
- HTML-dosieroj ne devus esti kaŝitaj (aŭ nur mallonge) por certigi ĝustatempan enhavan ĝisdatigon
- Pagefind-indeksoj ŝarĝiĝas laŭbezone; neniu speciala kaŝstrategio bezonata
- Post deplojo, kontrolu ke OG-bildoj, RSS kaj la retmapo estas atingeblaj

## Komentaj sistemaj backendoj

Se vi ebligas komentan sistemon, deploji la respondan backendon:

| Komenta sistemo | Postulo de backendo                                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| giscus          | Neniu; uzu la publikan servon giscus.app (aŭ mem-gastigado [giscus-vercel](https://github.com/giscus/giscus-vercel)) |
| twikoo          | Deploji la twikoo-servilon (Vercel / CloudBase / mem-gastigado)                                                      |
| waline          | Deploji la waline-servilon (Vercel / Cloudflare / mem-gastigado)                                                     |

Vidu la oficialan dokumentaron de ĉiu komenta sistemo kaj [Komenta sistemo](./doc-comments.md).
