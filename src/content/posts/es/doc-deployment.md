---
title: "Despliegue"
pubDatetime: 2026-06-20T13:00:00+08:00
description: "Guía de despliegue de Xingluo que cubre plataformas de alojamiento estático (Netlify/Vercel/GitHub Pages), autoalojamiento Nginx, Docker y variables de entorno."
tags:
  - documentation
  - deployment
category: "Documentation"
translationKey: doc-deployment
locale: es
---

Xingluo es un sitio puramente estático; `pnpm build` genera el directorio `dist/`, alojable en cualquier servicio de hosting estático.

## Salida de compilación

```bash
pnpm build
```

El `dist/` generado contiene:

- Todas las páginas HTML estáticas (incluyendo espejos `[locale]/`)
- Activos JS / CSS / fuentes bajo `_astro/`
- El índice de búsqueda `search/`
- El `og.png` a nivel de sitio y por artículo
- `rss.xml`, `sitemap-index.xml`, `robots.txt`
- Activos estáticos bajo `public/` (favicon, imagen OG predeterminada, etc.)

## Variables de entorno

Establecidas en tiempo de compilación:

| Variable                          | Descripción                                               |
| --------------------------------- | --------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Valor de verificación de Google Search Console (opcional) |

Ejemplo en PowerShell:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "su-código"
pnpm build
```

En entornos CI (ej. GitHub Actions), inyecte mediante `env` antes del paso de compilación.

## Lista de verificación previa al despliegue

Antes de desplegar, asegúrese:

1. `site.url` en `xingluo.config.ts` está configurado con el dominio de producción
2. `site.title`, `site.description`, `site.author`, etc. están personalizados
3. Si un sistema de comentarios está habilitado, la configuración del proveedor (giscus repoId, twikoo envId, waline serverURL) tiene valores reales
4. `public/default-og.jpg` (o el `site.ogImage` configurado) se reemplaza con la imagen OG predeterminada del sitio
5. `public/favicon.svg` se reemplaza con el icono del sitio

## Plataformas de alojamiento estático

### Netlify / Vercel / Cloudflare Pages

| Configuración          | Valor        |
| ---------------------- | ------------ |
| Comando de compilación | `pnpm build` |
| Directorio de salida   | `dist`       |
| Versión de Node        | 22.12.0+     |
| Gestor de paquetes     | pnpm         |

Un `vercel.json` opcional para Vercel:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

Despliegue mediante GitHub Actions; ejemplo de flujo de trabajo:

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

> Si despliega bajo un subruta (ej. `https://user.github.io/repo/`), configure `base: "/repo/"` en `astro.config.ts`.

### Nginx / Autoalojado

Sube `dist/` al servidor; ejemplo de configuración Nginx:

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Caché de activos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Notas de rendimiento

- Los activos bajo `_astro/` tienen nombres de archivo hash y pueden almacenarse en caché a largo plazo (`immutable`)
- Los archivos HTML no deben almacenarse en caché (o solo brevemente) para garantizar actualizaciones oportunas del contenido
- Los índices de Flexsearch se cargan bajo demanda; no se necesita una estrategia de caché especial
- Después del despliegue, verifique que las imágenes OG, RSS y el sitemap sean accesibles

## Backends de sistemas de comentarios

Si habilita un sistema de comentarios, despliegue el backend correspondiente:

| Sistema de comentarios | Requisito de backend                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| giscus                 | Ninguno; use el servicio público de giscus.app (o autoalojado [giscus-vercel](https://github.com/giscus/giscus-vercel)) |
| twikoo                 | Despliegue el servidor twikoo (Vercel / CloudBase / autoalojado)                                                        |
| waline                 | Despliegue el servidor waline (Vercel / Cloudflare / autoalojado)                                                       |

Consulte la documentación oficial de cada sistema de comentarios y [Sistema de comentarios](./doc-comments.md).
