---
title: "Déploiement"
pubDatetime: 2026-06-20T13:00:00+08:00
description: "Guide de déploiement Xingluo couvrant les plateformes d'hébergement statique (Netlify/Vercel/GitHub Pages), l'auto-hébergement Nginx, Docker et les variables d'environnement."
tags:
  - documentation
  - deployment
category: "Documentation"
translationKey: doc-deployment
locale: fr
---

Xingluo est un site purement statique ; `pnpm build` génère le répertoire `dist/`, hébergeable sur n'importe quel service d'hébergement statique.

## Sortie de build

```bash
pnpm build
```

Le `dist/` généré contient :

- Toutes les pages HTML statiques (y compris les miroirs `[locale]/`)
- Les assets JS / CSS / polices sous `_astro/`
- L'index de recherche `search/`
- L'`og.png` au niveau du site et par article
- `rss.xml`, `sitemap-index.xml`, `robots.txt`
- Les assets statiques sous `public/` (favicon, image OG par défaut, etc.)

## Variables d'environnement

Définies au moment de la construction :

| Variable                          | Description                                                |
| --------------------------------- | ---------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Valeur de vérification Google Search Console (facultative) |

Exemple PowerShell :

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "votre-code"
pnpm build
```

Dans les environnements CI (ex. GitHub Actions), injectez via `env` avant l'étape de construction.

## Liste de vérification pré-déploiement

Avant de déployer, assurez-vous :

1. `site.url` dans `xingluo.config.ts` est défini sur le domaine de production
2. `site.title`, `site.description`, `site.author`, etc. sont personnalisés
3. Si un système de commentaires est activé, la configuration du fournisseur (giscus repoId, twikoo envId, waline serverURL) contient des valeurs réelles
4. `public/default-og.jpg` (ou le `site.ogImage` configuré) est remplacé par l'image OG par défaut du site
5. `public/favicon.svg` est remplacé par l'icône du site

## Plateformes d'hébergement statique

### Netlify / Vercel / Cloudflare Pages

| Configuration           | Valeur       |
| ----------------------- | ------------ |
| Commande de build       | `pnpm build` |
| Répertoire de sortie    | `dist`       |
| Version Node            | 22.12.0+     |
| Gestionnaire de paquets | pnpm         |

Un `vercel.json` optionnel pour Vercel :

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

Déploiement via GitHub Actions ; exemple de workflow :

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

> En cas de déploiement sous un sous-chemin (ex. `https://user.github.io/repo/`), définissez `base: "/repo/"` dans `astro.config.ts`.

### Nginx / Auto-hébergé

Téléchargez `dist/` sur le serveur ; exemple de configuration Nginx :

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Mise en cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Notes de performance

- Les assets sous `_astro/` ont des noms de fichiers hachés et peuvent être mis en cache à long terme (`immutable`)
- Les fichiers HTML ne doivent pas être mis en cache (ou seulement brièvement) pour garantir des mises à jour de contenu en temps utile
- Les index Flexsearch se chargent à la demande ; aucune stratégie de cache spéciale nécessaire
- Après le déploiement, vérifiez que les images OG, RSS et le sitemap sont accessibles

## Backends des systèmes de commentaires

Si vous activez un système de commentaires, déployez le backend correspondant :

| Système de commentaires | Exigence backend                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| giscus                  | Aucun ; utilisez le service public giscus.app (ou auto-hébergement [giscus-vercel](https://github.com/giscus/giscus-vercel)) |
| twikoo                  | Déployez le serveur twikoo (Vercel / CloudBase / auto-hébergement)                                                           |
| waline                  | Déployez le serveur waline (Vercel / Cloudflare / auto-hébergement)                                                          |

Voir la documentation officielle de chaque système de commentaires et [Système de commentaires](./doc-comments.md).
