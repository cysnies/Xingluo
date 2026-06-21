# Guía de configuración

Todas las opciones configurables de Xingluo se encuentran en [`xingluo.config.ts`](../xingluo.config.ts) en la raíz. El archivo proporciona restricciones de tipo completas a través de `defineXingluoConfig`; los cambios surten efecto de inmediato sin tocar el código fuente.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // URL del sitio, usada para enlaces absolutos, RSS, sitemap
  title: "Xingluo",                      // Título del sitio
  description: "Un CMS de blog moderno construido con Astro y shadcn",
  author: "Xingluo",                     // Nombre del autor predeterminado
  profile: "https://xingluo.example.com", // Página de inicio del autor (usada para JSON-LD)
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
  perPage: 8,              // Publicaciones por página de listado
  perIndex: 5,             // Publicaciones mostradas en la página de inicio
  scheduledPostMargin: 900000, // Tolerancia de publicación programada (ms), 15 minutos
}
```

- `perPage`: tamaño de página para `/posts/[...page]` y `/tags/[tag]/[...page]`
- `perIndex`: número de publicaciones mostradas en la sección "Últimas" de la página de inicio
- `scheduledPostMargin`: las publicaciones futuras dentro de esta ventana se tratan como publicadas (efectivo en producción; desarrollo muestra todas)

## features

```ts
features: {
  lightAndDarkMode: true,   // Activar cambio de modo claro/oscuro
  dynamicOgImage: true,     // Generar imágenes OG dinámicamente
  showArchives: true,       // Mostrar página de archivos
  showBackButton: true,     // Mostrar botón de retroceso
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },  // Enlace de edición
  search: "flexsearch",      // Solución de búsqueda
  mdx: true,                // Habilitar MDX
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| Campo              | Predeterminado     | Notas                                                                                               |
| ------------------ | ------------------ | --------------------------------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | Habilita el cambio de modo claro/oscuro                                                             |
| `dynamicOgImage`   | `true`             | Genera dinámicamente imágenes OG (satori + sharp)                                                   |
| `showArchives`     | `true`             | Muestra la página de archivos (el sitemap filtra cuando está desactivado)                           |
| `showCategories`   | `true`             | Muestra la página de categorías y entrada de navegación (el sitemap filtra cuando está desactivado) |
| `showBackButton`   | `true`             | Muestra un botón de retroceso en las páginas de artículos                                           |
| `editPost.enabled` | `false`            | Muestra un enlace "Editar esta página"                                                              |
| `editPost.url`     | `""`               | Prefijo del enlace de edición; se añade la ruta relativa del artículo                               |
| `search`           | `"flexsearch"`     | Solución de búsqueda: `"flexsearch"` o `false`                                                      |
| `mdx`              | `true`             | Habilita el análisis y renderizado MDX (ver [Creación de contenido](./content.md))                  |
| `comments`         | `{provider:false}` | Configuración del sistema de comentarios (ver [Sistema de comentarios](./comments.md))              |
| `players.aplayer`  | `false`            | Habilita el reproductor de audio APlayer (ver [Reproductores multimedia](./media-players.md))       |
| `players.dplayer`  | `false`            | Habilita el reproductor de video DPlayer                                                            |

### editPost

`editPost.url` es un prefijo de URL de edición del repositorio; Xingluo añade la ruta fuente relativa del artículo (`src/content/posts/...`). Por ejemplo:

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

- `name`: nombre del icono, corresponde a `src/assets/icons/socials/{name}.astro`. Integrados: `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url`: URL del enlace; `mailto:` para correo electrónico
- `linkTitle`: título accesible opcional; se genera automáticamente a partir del nombre cuando se omite

> Añadir una plataforma social: crea un componente de icono `.astro` con el mismo nombre en `src/assets/icons/socials/`. `src/lib/socialIcons.ts` los recopila automáticamente mediante `import.meta.glob`.

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

Estas entradas para compartir aparecen en la parte inferior de las páginas de artículos. `url` es un prefijo de URL para compartir; Xingluo agrega la URL absoluta del artículo actual. `name` también se asigna a un icono en `src/assets/icons/socials/`.

## Variables de entorno

Declaradas a través de `env.schema` en `astro.config.ts`.

| Variable                          | Nivel de acceso | Descripción                                              |
| --------------------------------- | --------------- | -------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | público/cliente | Valor de verificación de Google Search Console, opcional |

Ejemplo (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

El valor se inyecta en `config.site.googleVerification` y se renderiza como `<meta name="google-site-verification">`.

## Ejemplo completo

Consulta [`xingluo.config.ts`](../xingluo.config.ts). Las secciones `features.comments` y `features.players` incluyen ejemplos comentados para giscus / twikoo / waline; descomenta y completa con valores reales para activarlos.
