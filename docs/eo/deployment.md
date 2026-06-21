# Deplojo

Xingluo estas pure statika retejo; `pnpm build` generas la `dist/` dosierujon, hostebla sur iu ajn statika gastiga servo.

## Konstrua eligo

```bash
pnpm build
```

La generita `dist/` enhavas:

- Ĉiujn statikajn HTML-paĝojn (inkluzive `[locale]/` spegulojn)
- JS / CSS / tiparaj aktivaĵoj sub `_astro/`
- La `search/` serĉindekson
- La retej-nivelan `og.png` kaj po-afiŝan `og.png`
- `rss.xml`, `sitemap-index.xml`, `robots.txt`
- Statikajn aktivaĵojn sub `public/` (favicon, defaŭlta OG-bildo, ktp.)

## Medivariabloj

Agordita dum konstruo:

| Variablo                          | Priskribo                                        |
| --------------------------------- | ------------------------------------------------ |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console-konfirmo-valoro (nedeviga) |

PowerShell-ekzemplo:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

En CI-medioj (ekz. GitHub Actions), injektu per `env` antaŭ la konstrua paŝo.

## Antaŭ-deploja kontrolisto

Antaŭ deplojo, certigu:

1. `site.url` en `xingluo.config.ts` estas agordita al la produktada domajno
2. `site.title`, `site.description`, `site.author`, ktp. estas personecigitaj
3. Se komenta sistemo estas ebligita, la provizora agordo (giscus repoId, twikoo envId, waline serverURL) havas realajn valorojn
4. `public/default-og.jpg` (aŭ la agordita `site.ogImage`) estas anstataŭigita kun la defaŭlta OG-bildo de la retejo
5. `public/favicon.svg` estas anstataŭigita kun la reteja ikono

## Statikaj gastigaj platformoj

### Netlify / Vercel / Cloudflare Pages

| Agordo               | Valoro       |
| -------------------- | ------------ |
| Konstrua komando     | `pnpm build` |
| Eliga dosierujo      | `dist`       |
| Node-versio          | 22.12.0+     |
| Pakaĵa administranto | pnpm         |

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

    # Kaŝmemorado de statikaj aktivaĵoj
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Rendimentaj notoj

- Aktivaĵoj sub `_astro/` havas haketitajn dosiernomojn kaj povas esti kaŝmemoritaj longtempe (`immutable`)
- HTML-dosieroj ne devus esti kaŝmemoritaj (aŭ nur mallonge) por certigi ĝustatempajn enhavajn ĝisdatigojn
- Flexsearch-indeksoj ŝarĝiĝas laŭbezone; neniu speciala kaŝmemorada strategio necesas
- Post deplojo, kontrolu ke OG-bildoj, RSS kaj la retmapo estas alireblaj

## Komentaj sistemaj backendoj

Se vi ebligas komentan sistemon, deploju la respondan backendon:

| Komenta sistemo | Backenda postulo                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| giscus          | Neniu; uzu la publikan servon de giscus.app (aŭ mem-gastigu [giscus-vercel](https://github.com/giscus/giscus-vercel)) |
| twikoo          | Deploji la twikoo-servilon (Vercel / CloudBase / mem-gastigita)                                                       |
| waline          | Deploji la waline-servilon (Vercel / Cloudflare / mem-gastigita)                                                      |

Vidu la oficialajn dokumentojn de ĉiu komenta sistemo kaj [Komenta sistemo](./comments.md).
