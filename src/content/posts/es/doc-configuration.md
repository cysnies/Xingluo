---
title: "Guía de Configuración"
pubDatetime: 2026-06-20T04:00:00+08:00
description: "Referencia completa de todas las opciones de configuración de Xingluo, incluyendo configuración del sitio, configuración de artículos, funciones, enlaces sociales, enlaces para compartir y variables de entorno."
tags:
  - documentation
  - configuration
category: "Documentation"
translationKey: doc-configuration
locale: es
---

Todas las opciones configurables de Xingluo se encuentran en [`xingluo.config.ts`](../xingluo.config.ts) en la raíz. El archivo proporciona restricciones de tipo completas a través de `defineXingluoConfig`; los cambios surten efecto de inmediato sin tocar el código fuente.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // URL del sitio, usado para enlaces absolutos, RSS, sitemap
  title: "Xingluo",                      // Título del sitio
  description: "Un CMS de blog moderno construido con Astro y shadcn",
  author: "Xingluo",                     // Nombre de autor predeterminado
  profile: "https://xingluo.example.com", // Página de inicio del autor (usado para JSON-LD)
  ogImage: "default-og.jpg",              // Imagen OG predeterminada (en el directorio public)
  lang: "zh-cn",                          // Idioma predeterminado
  timezone: "Asia/Shanghai",              // Zona horaria (visualización de fecha de artículos)
  dir: "ltr",                             // Dirección del texto: ltr | rtl
  googleVerification: "",                 // Valor de verificación de Google Search Console (o mediante variable de entorno)
}
```

| Campo                | Predeterminado   | Notas                                                                                                                        |
| -------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `url`                | requerido        | URL raíz del sitio; debe terminar con `/`                                                                                    |
| `title`              | requerido        | Título del sitio, usado en `<title>` y OG                                                                                    |
| `description`        | requerido        | Descripción del sitio, usada en meta y RSS                                                                                   |
| `author`             | requerido        | Autor predeterminado; el frontmatter del artículo vuelve a este valor                                                        |
| `profile`            | —                | Página de inicio del autor, inyectada en JSON-LD `author.url`                                                                |
| `ogImage`            | `default-og.jpg` | Nombre de archivo de imagen OG predeterminada, ubicada en `public/`                                                          |
| `lang`               | requerido        | Código de idioma predeterminado; debe coincidir con `i18n.defaultLocale` en `astro.config.ts`                                |
| `timezone`           | `Asia/Shanghai`  | Zona horaria de dayjs, afecta la visualización de fechas de artículos                                                        |
| `dir`                | `ltr`            | Dirección del texto                                                                                                          |
| `googleVerification` | —                | Valor de verificación de Google; también se puede inyectar mediante la variable de entorno `PUBLIC_GOOGLE_SITE_VERIFICATION` |

## posts

```ts
posts: {
perPage: 8,              // Artículos por página de lista
  perIndex: 5,             // Artículos mostrados en la página de inicio
  scheduledPostMargin: 900000, // Tolerancia de publicación programada (ms), 15 minutos
}
```

- `perPage`: tamaño de página para `/posts/[...page]` y `/tags/[tag]/[...page]`
- `perIndex`: número de artículos mostrados en la sección "Últimos" de la página de inicio
- `scheduledPostMargin`: los artículos futuros dentro de esta ventana se tratan como publicados (efectivo en producción; dev muestra todos)

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

| Campo              | Predeterminado     | Notas                                                                                            |
| ------------------ | ------------------ | ------------------------------------------------------------------------------------------------ |
| `lightAndDarkMode` | `true`             | Activar el cambio de modo claro/oscuro                                                           |
| `dynamicOgImage`   | `true`             | Generar imágenes OG dinámicamente (satori + sharp)                                               |
| `showArchives`     | `true`             | Mostrar la página de archivos (el sitemap filtra cuando está desactivado)                        |
| `showCategories`   | `true`             | Mostrar la página de categorías y la entrada de navegación (el sitemap filtra)                   |
| `showBackButton`   | `true`             | Mostrar un botón de retroceso en las páginas de artículos                                        |
| `editPost.enabled` | `false`            | Mostrar un enlace "Editar esta página"                                                           |
| `editPost.url`     | `""`               | Prefijo del enlace de edición; se añade la ruta fuente relativa del artículo                     |
| `search`           | `"pagefind"`       | Solución de búsqueda: `"pagefind"` o `false`                                                     |
| `mdx`              | `true`             | Activar el análisis y renderizado MDX (ver [Creación de contenido](./doc-content.md))            |
| `comments`         | `{provider:false}` | Configuración del sistema de comentarios (ver [Sistema de comentarios](./doc-comments.md))       |
| `players.aplayer`  | `false`            | Activar el reproductor de audio APlayer (ver [Reproductores multimedia](./doc-media-players.md)) |
| `players.dplayer`  | `false`            | Activar el reproductor de vídeo DPlayer                                                          |

### editPost

`editPost.url` es un prefijo de URL de edición de repositorio; Xingluo añade la ruta fuente relativa del artículo (`src/content/posts/...`). Por ejemplo:

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

El artículo `src/content/posts/welcome.md` produce el enlace `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: nombre del icono, correspondiente a `src/assets/icons/socials/{name}.astro`. Integrados: `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url`: URL del enlace; `mailto:` para correo electrónico
- `linkTitle`: título accesible opcional; se genera automáticamente a partir del nombre cuando se omite

> Añadir una plataforma social: cree un componente de icono `.astro` con el mismo nombre en `src/assets/icons/socials/`. `src/lib/socialIcons.ts` los recopila automáticamente mediante `import.meta.glob`.

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

Estas entradas para compartir aparecen al final de las páginas de artículos. `url` es un prefijo de URL para compartir; Xingluo añade la URL absoluta del artículo actual. `name` se asigna igualmente a un icono en `src/assets/icons/socials/`.

## Variables de entorno

Declaradas mediante `env.schema` en `astro.config.ts`:

| Variable                          | Nivel de acceso | Descripción                                              |
| --------------------------------- | --------------- | -------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | público/cliente | Valor de verificación de Google Search Console, opcional |

Ejemplo (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "su-código-de-verificación"
pnpm build
```

El valor se inyecta en `config.site.googleVerification` y se renderiza como `<meta name="google-site-verification">`.

## Ejemplo completo

Consulte [`xingluo.config.ts`](../xingluo.config.ts). Las secciones `features.comments` y `features.players` incluyen ejemplos comentados para giscus / twikoo / waline; descomente y complete con valores reales para activarlos.
