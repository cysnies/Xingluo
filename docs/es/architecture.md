# Visión general de la arquitectura

Este documento describe la arquitectura general de Xingluo, la estructura de directorios, el flujo de configuración, el flujo de renderizado y el pipeline de compilación, para ayudarle a comprender la organización del código y cómo extenderlo.

## Estructura de directorios

```
xingluo/
├── astro.config.ts          # Configuración de Astro (integraciones, i18n, markdown, fuentes, env)
├── xingluo.config.ts        # Entrada de configuración del usuario
├── tsconfig.json            # Configuración de TypeScript (strict + alias de ruta @/*)
├── package.json             # Dependencias y scripts
├── public/                  # Archivos estáticos (favicon.svg, imagen OG predeterminada, etc.)
├── docs/                    # Documentación del proyecto (este directorio)
├── references/              # Fuentes de proyecto de referencia de solo lectura (no deben ser dependencias)
└── src/
    ├── config.ts            # Fusionar valores predeterminados, exportar configuración resuelta
    ├── content.config.ts    # Esquemas de colecciones de contenido (posts, pages)
    ├── env.d.ts             # Declaraciones de tipos de módulos de terceros y variables de entorno
    ├── assets/              # Componentes de iconos
    │   └── icons/           # astro-icon + Font Awesome (incluye socials/)
    ├── components/          # Componentes de UI
    │   ├── ui/              # Componentes estilo shadcn (Button, Card, Badge, etc.)
    │   ├── post/            # Componentes de página de artículo (navegación ant/sig, volver, compartir, etc.)
    │   ├── comments/        # Componentes del sistema de comentarios
    │   ├── mdx/             # Componentes MDX personalizados (APlayer, DPlayer)
    │   ├── pageViews/       # Vistas de página (lógica de renderizado centralizada)
    │   └── *.astro          # Componentes de nivel raíz (Header, Footer, PostCard, etc.)
    ├── content/             # Archivos de contenido
    │   ├── posts/           # Artículos del blog
    │   └── pages/           # Páginas estáticas
    ├── i18n/                # Internacionalización
    │   ├── index.ts         # Carga de idiomas y useTranslations
    │   ├── types.ts         # Tipo UIStrings completo
    │   ├── routing.ts       # Resolución de rutas de locale
    │   ├── staticPaths.ts   # getStaticPaths para locales no predeterminados
    │   ├── format.ts        # Reemplazo de cadenas de plantilla
    │   └── lang/            # Archivos de recursos de idioma (zh-cn.ts, en.ts)
    ├── layouts/             # Diseños
    │   ├── Layout.astro     # Esqueleto base (head, SEO, FOUC)
    │   └── PostLayout.astro # Diseño de artículo (JSON-LD, meta del artículo)
    ├── lib/                 # Utilidades fundamentales
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # Instancia de dayjs y plugin de zona horaria
    │   └── socialIcons.ts   # Resolución dinámica de iconos sociales
    ├── pages/               # Rutas (raíz + espejo [locale]/)
    ├── scripts/             # Scripts del lado del cliente
    │   ├── theme.ts         # Alternancia de tema
    │   ├── postEnhancements.ts # Mejoras de artículo (anclas, copia, lightbox, progreso)
    │   ├── comments.ts      # Carga diferida de comentarios y sincronización de tema
    │   └── players.ts       # Carga diferida de reproductores
    ├── styles/              # Estilos
    │   ├── global.css       # Entrada de Tailwind + capa base + utilidades personalizadas
    │   ├── theme.css        # Variables de tema shadcn (OKLCH)
    │   └── typography.css   # Tipografía .app-prose y estilos de bloques de código
    ├── types/               # Declaraciones de tipos
    │   ├── config.ts        # Tipos de configuración
    │   └── *.d.ts           # Declaraciones para módulos de terceros sin tipo
    └── utils/               # Funciones auxiliares
        ├── getPostPaths.ts  # Derivación de slug y URL de artículo
        ├── getSortedPosts.ts# Ordenación de artículos
        ├── postFilter.ts    # Filtrado de borradores y artículos programados
        ├── getUniqueTags.ts # Deduplicación de etiquetas
        ├── remarkPlayers.ts # Plugin remark para reproductores
        ├── rehypeWrapTable.ts# Envoltorio de desplazamiento de tabla
        └── ...              # Otras utilidades
```

## Flujo de configuración

```
xingluo.config.ts
   │ defineXingluoConfig (restricciones de tipo, paso directo)
   ▼
src/config.ts
   │ resolveConfig (fusionar valores predeterminados + resolveComments + resolvePlayers)
   ▼
src/types/config.ts
   │ XingluoConfig (tipo completo)
   ▼
Referenciado en todo el sitio mediante import config from "@/config"
```

Puntos clave:

- `xingluo.config.ts` es el único archivo de configuración que los usuarios necesitan editar
- `resolveConfig` en `src/config.ts` realiza fusiones superficiales (`site`/`posts`) y fusiones profundas (`features.editPost`, `features.comments`, `features.players`)
- `astro.config.ts` lee el `./xingluo.config` sin resolver (porque la carga de integraciones se decide en la capa de configuración de Astro), por lo que accede a `features` con encadenamiento opcional
- `src/content.config.ts` lee el `@/config` resuelto, por lo que `features` es obligatorio

## Flujo de renderizado

### Renderizado de página

Xingluo utiliza un patrón "wrapper de página delgado + componente de vista", centralizando la lógica de renderizado en `src/components/pageViews/`:

```
src/pages/posts/[...slug]/index.astro   ← wrapper delgado: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← lógica de renderizado
    │
    ▼
src/layouts/PostLayout.astro  ← layout de artículo (JSON-LD, meta del artículo)
    │
    ▼
src/layouts/Layout.astro      ← esqueleto base (head, SEO, FOUC, ClientRouter)
```

La página wrapper delgado maneja solo `getStaticPaths` y el paso de props; el componente de vista contiene toda la lógica de renderizado. Las páginas espejo `[locale]/` son también wrappers delgados, generando solo locales no predeterminados a través de `getLocaleParams()`.

### Enrutamiento

```
src/pages/
├── 404.astro                      # 404 (no reflejado)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # Endpoint de imagen OG a nivel de sitio
├── rss.xml.ts                     # Endpoint RSS
├── robots.txt.ts                  # Endpoint robots.txt
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # Endpoint de imagen OG a nivel de artículo
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Reflejo de locale no predeterminado (getStaticPaths=getLocaleParams)
    └── (la estructura refleja la raíz, excepto 404, og.png, rss, robots)
```

### Derivación de URL de artículos

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: deriva el slug de enrutamiento del `id` de la colección de contenido y la ruta del archivo, filtrando directorios con prefijo `_`
- `getPostUrl(id, filePath, locale)`: genera una URL navegable con el prefijo de locale (el locale predeterminado no tiene prefijo)

### Filtrado y ordenación de artículos

- [`postFilter.ts`](../src/utils/postFilter.ts): excluye borradores; filtra artículos futuros en producción usando `pubDatetime - scheduledPostMargin`; desarrollo muestra todos
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): después de filtrar, ordena descendientemente por `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): deduplica y ordena etiquetas por slug

## Scripts del lado del cliente

Las interacciones del lado del cliente de Xingluo se cargan mediante etiquetas `<script>` al final de las páginas, todas adaptadas para View Transitions:

| Script                | Ubicación de carga                                       | Adaptación de eventos                                                                                         | Responsabilidades                                                                |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `theme.ts`            | final del cuerpo de `Layout.astro`                       | reconectar en `astro:after-swap`, llevar theme-color en `astro:before-swap`, cambio de `prefers-color-scheme` | Persistencia y cambio de tema                                                    |
| `postEnhancements.ts` | `PostDetailView.astro`                                   | reiniciar en `astro:page-load`                                                                                | Anclas de encabezado, copia de código, progreso de lectura, lightbox de imágenes |
| `comments.ts`         | `Comments.astro`                                         | reescanear en `astro:page-load`                                                                               | Carga diferida de comentarios y sincronización de tema                           |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (condicional) | reescanear en `astro:page-load`                                                                               | Carga diferida de reproductores                                                  |

> Nota: `comments.ts` y `players.ts` no tienen import/export de nivel superior; añade `export {}` al final del archivo para marcarlos como módulos y evitar conflictos de declaración global con otros archivos.

## Pipeline de compilación

`pnpm run build` = `astro check && astro build && node scripts/generateSearchIndex.mjs`

1. **`astro check`**: verificación de tipos de TypeScript + plantillas Astro
2. **`astro build`**:
   - Recopila colecciones de contenido (incluye `.mdx` según `features.mdx`)
   - Genera estáticamente todas las páginas (incluyendo espejos `[locale]/`)
   - Genera endpoints: RSS, sitemap, robots.txt, imágenes OG de nivel de sitio y de artículo
   - Carga condicionalmente la integración `mdx()`; inyecta condicionalmente `remarkPlayers`
   - Incrusta iconos SVG en tiempo de compilación (astro-icon, cero JS en tiempo de ejecución)
   - Los módulos de comentarios y reproductores importados dinámicamente se dividen en fragmentos independientes (carga diferida)
3. **`node scripts/generateSearchIndex.mjs`**: escanea archivos HTML en `dist/`, analiza el contenido de las páginas, generando índices de búsqueda por idioma en `dist/search/`

## Estrategias de rendimiento

- **Iconos sin JS en tiempo de ejecución**: astro-icon incrusta SVGs de Font Awesome en tiempo de compilación (modo sprite `<symbol>`)
- **Optimización SVG**: `experimental.svgOptimizer` (svgo) comprime SVGs incrustados y referenciados
- **Carga diferida bajo demanda**: los comentarios y reproductores se importan dinámicamente mediante IntersectionObserver cuando se desplazan a la vista; paquete cero cuando están desactivados
- **Integraciones condicionales**: con MDX desactivado, la integración `mdx()` no se carga; con reproductores desactivados, el plugin remark no se inyecta
- **Tamaño CSS**: Tailwind v4 genera bajo demanda; las variables OKLCH se gestionan centralizadamente
- **Fuentes de imágenes OG**: usadas solo por satori, no se inyectan en el CSS del sitio
- **View Transitions**: `<ClientRouter/>` anima las transiciones de página; el cuadro de búsqueda usa `transition:persist` para mantener el estado

## Guía de extensión

### Añadir una página

1. Crea un archivo `.astro` en `src/pages/` (wrapper delgado)
2. Crea el componente de vista correspondiente en `src/components/pageViews/`
3. Para soporte multilingüe, crea un wrapper delgado espejo con el mismo nombre en `src/pages/[locale]/`

### Añadir un componente UI

Siga el estilo shadcn: cree componentes `.astro` y configuraciones de variantes `.ts` en `src/components/ui/` (usando `class-variance-authority`).

### Añadir un script del lado del cliente

Cree un archivo `.ts` en `src/scripts/`, añada `export {}` al final para marcarlo como módulo, escuche `astro:page-load` para adaptarse a View Transitions, e impórtelo en una etiqueta `<script>` en la página correspondiente.
