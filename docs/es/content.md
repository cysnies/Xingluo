# Creación de contenido

Xingluo utiliza Astro Content Collections para gestionar el contenido, compatible con Markdown (`.md`) y MDX (`.mdx`, requiere `features.mdx`).

## Colecciones de contenido

Dos colecciones están definidas en [`src/content.config.ts`](../src/content.config.ts):

| Colección | Directorio           | Propósito                             |
| --------- | -------------------- | ------------------------------------- |
| `posts`   | `src/content/posts/` | Artículos del blog                    |
| `pages`   | `src/content/pages/` | Páginas estáticas (ej. página acerca) |

## Frontmatter de artículos

Campos completos para la colección `posts`:

```markdown
---
title: "Título del artículo" # requerido
pubDatetime: 2026-06-19T10:00:00+08:00 # requerido, fecha de publicación
modDatetime: 2026-06-20T10:00:00+08:00 # opcional, fecha de actualización
description: "Resumen, usado para SEO y listas" # requerido
tags: ["Astro", "blog"] # opcional, por defecto ["others"]
featured: true # opcional, destacado (se muestra en la página de inicio)
draft: false # opcional, los borradores no se publican
author: "Xingluo" # opcional, por defecto site.author
ogImage: "./cover.png" # opcional, imagen OG (importación de imagen o ruta de cadena)
heroImage: "./hero.png" # opcional, imagen principal (se muestra entre el botón de retroceso y el título, también a la derecha de las tarjetas)
heroImageFit: "cover" # opcional, modo de ajuste de imagen principal (cover recorte para llenar / contain escala completa), predeterminado cover
canonicalURL: "https://..." # opcional, enlace canónico
hideEditPost: false # opcional, ocultar el enlace de edición
timezone: "Asia/Shanghai" # opcional, anular la zona horaria del sitio
---
```

### Referencia de campos

| Campo            | Tipo                     | Predeterminado  | Notas                                                                                                                                                                                                              |
| ---------------- | ------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`          | string                   | requerido       | Título del artículo                                                                                                                                                                                                |
| `pubDatetime`    | date                     | requerido       | Fecha de publicación, ISO 8601                                                                                                                                                                                     |
| `modDatetime`    | date                     | —               | Fecha de actualización; muestra una etiqueta "actualizado"                                                                                                                                                         |
| `description`    | string                   | requerido       | Resumen, usado en meta, RSS y tarjetas de lista                                                                                                                                                                    |
| `tags`           | string[]                 | `["others"]`    | Array de etiquetas; las páginas de etiquetas se generan automáticamente                                                                                                                                            |
| `featured`       | boolean                  | —               | Se muestra en la sección "Destacados" de la página de inicio                                                                                                                                                       |
| `draft`          | boolean                  | —               | Borrador; filtrado en compilaciones de producción (visible en desarrollo)                                                                                                                                          |
| `author`         | string                   | `site.author`   | Nombre del autor                                                                                                                                                                                                   |
| `ogImage`        | image \| string          | —               | Imagen OG; `image()` pasa por el pipeline de assets de Astro, una cadena es una ruta de `public/` o URL externa                                                                                                    |
| `heroImage`      | image \| string          | —               | Imagen principal, mostrada en la página de detalle entre el botón de retroceso y el título, también a la derecha de las tarjetas (controlado por `features.showPostCardHero`/`showPostDetailHero`)                 |
| `heroImageFit`   | `"cover"` \| `"contain"` | `"cover"`       | Modo de ajuste de la imagen principal: `"cover"` recorta para llenar (mantiene la relación de aspecto, puede recortar bordes); `"contain"` escala completa (mantiene la relación de aspecto, puede dejar espacios) |
| `canonicalURL`   | string                   | —               | Enlace canónico, anula el predeterminado (ver [SEO](./seo.md))                                                                                                                                                     |
| `hideEditPost`   | boolean                  | —               | Ocultar el enlace de edición para este artículo                                                                                                                                                                    |
| `timezone`       | string                   | `site.timezone` | Anular la zona horaria de visualización para este artículo                                                                                                                                                         |
| `locale`         | string                   | `site.lang`     | Idioma en el que está escrito el artículo, ej. `"en"`, `"ja"`. Por defecto el idioma del sitio                                                                                                                     |
| `translationKey` | string                   | —               | Clave de grupo de traducción: los artículos con la misma clave son traducciones entre sí                                                                                                                           |
| `category`       | string                   | —               | Categoría del artículo (valor único), genera una página `/categories/<slug>/`; sin valor significa sin categoría                                                                                                   |

### Traducción a nivel de contenido

Usa los campos frontmatter `locale` y `translationKey` para crear versiones multilingües de tus artículos:

1. Coloca el artículo en el idioma predeterminado en `src/content/posts/<slug>.md`
2. Coloca las traducciones en subdirectorios de idioma: `src/content/posts/<locale>/<slug>.md` (ej. `en/welcome.md`)
3. Establece `locale` al idioma de la traducción y `translationKey` al mismo valor que el original

La capa de enrutamiento resuelve automáticamente la traducción correcta por idioma y desduplica en los listados — el mismo artículo en diferentes idiomas solo muestra una tarjeta por idioma. Los artículos sin traducción recurren al contenido original. Ver [Internacionalización](./i18n.md).

### Publicación programada

Los artículos con marcas de tiempo futuras se filtran en producción usando la tolerancia `scheduledPostMargin`: si `pubDatetime` está dentro de la ventana de tolerancia (15 minutos por defecto) de la hora actual, el artículo se trata como publicado. En desarrollo, todos los artículos no borrador son visibles.

## Frontmatter de páginas estáticas

La colección `pages` tiene campos más simples:

```markdown
---
title: "Acerca de"
description: "Acerca de este sitio" # opcional
ogImage: "default-og.jpg" # opcional, solo cadena
canonicalURL: "https://..." # opcional
---
```

La página acerca de se obtiene mediante `getEntry("pages", "about")` y requiere crear `src/content/pages/about.md`.

## Mejoras de Markdown

Xingluo incluye los siguientes plugins remark / rehype (consulta `astro.config.ts`):

### Tabla de contenidos

`remark-toc` genera la tabla de contenidos automáticamente; `remark-collapse` la colapsa por defecto. Inserta el marcador de posición en un artículo:

```markdown
## Tabla de contenidos

(La TOC se rellena automáticamente aquí)
```

### Callouts (Notas destacadas)

`rehype-callouts` es compatible con callouts estilo Obsidian:

```markdown
> [!NOTE]
> Note content

> [!WARNING]
> Warning content

> [!TIP]
> Tip content
```

Tipos admitidos: `NOTE`, `TIP`, `INFO`, `WARNING`, `DANGER`, `SUCCESS`, `QUESTION`, `FAILURE` y más.

### Resaltado de código

Shiki con tema dual (claro `min-light`, oscuro `night-owl`) soporta:

- Resaltado de líneas: ` ```js {1,3-5} `
- Resaltado de palabras: ` ```js /word/ `
- Marcadores diff: `+` / `-` al inicio de línea
- Etiquetas de nombre de archivo: ` ```js file=src/index.ts ` o `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // highlighted line
}
```

### Tables

Las tablas anchas se envuelven automáticamente en un contenedor con desplazamiento horizontal (el plugin `rehypeWrapTable`), evitando desbordamientos en pantallas estrechas.

## Soporte MDX

Con `features.mdx` habilitado (predeterminado), puedes usar archivos `.mdx` para la creación de contenido basada en componentes.

### Componentes personalizados

Los componentes MDX integrados de Xingluo se encuentran en [`src/components/mdx/`](../src/components/mdx) y se importan desde una entrada unificada:

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# Mi Artículo

<APlayer
  audio={[
    {
      name: "Canción",
      artist: "Artista",
      url: "/audio.mp3",
      cover: "/cover.jpg",
    },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

Consulta [Reproductores multimedia](./media-players.md) para más detalles.

### Desactivar MDX

Con `features.mdx: false`:

- La integración `mdx()` no se carga
- El glob de la colección de contenido solo coincide con `*.md` (los archivos `.mdx` existentes no se recopilan)
- La salida de compilación no contiene MDX runtime

## Comentarios

El sistema de comentarios se renderiza automáticamente al final de las páginas de detalle de artículos (configure el proveedor en `features.comments`). Consulte [Sistema de comentarios](./comments.md).

## Tiempo de lectura

El tiempo de lectura estimado se muestra automáticamente en las páginas de detalle de artículos y tarjetas de lista:

- **Idiomas CJK** (zh-cn, ja, ko): calculado por recuento de caracteres CJK, ~400 caracteres por minuto
- **Otros idiomas**: calculado por recuento de palabras (delimitadas por espacios), ~200 palabras por minuto
- Resultado redondeado hacia arriba, mínimo 1 minuto

Antes de contar, se eliminan los bloques de código, las etiquetas HTML, las URLs de enlaces Markdown y otro contenido no textual para mantener la estimación cercana al volumen de lectura real. No se requiere configuración.

## Artículos relacionados

Se muestran hasta 2 artículos relacionados al final de las páginas de detalle (después de la navegación anterior/siguiente):

- Ordenados por número de etiquetas compartidas, descendente
- Misma puntuación ordenada por fecha de publicación, descendente (prefiriendo artículos más recientes)
- La sección no se renderiza cuando ningún artículo comparte etiquetas
- Ignorado automáticamente por el índice de búsqueda de pagefind

No se necesita configuración.

## Barra lateral TOC fija

Aparece una barra lateral de tabla de contenidos fija en el lado derecho de las páginas de detalle de artículos en pantallas grandes (≥1024px):

- Generada automáticamente a partir de los encabezados h2–h6 del artículo, presentada como una lista indentada plana
- La indentación refleja la profundidad del encabezado (h3 tiene un nivel más de indentación que h2)
- La sección actual se resalta mientras se desplaza (IntersectionObserver)
- Al hacer clic en una entrada de TOC, se desplaza suavemente al encabezado correspondiente
- Oculto en pantallas pequeñas (móvil), donde está disponible la TOC colapsable en línea

Generado a partir de los `headings` devueltos por `render()` de Astro — no se requiere mantenimiento manual de la TOC por parte del autor. La TOC plegable en línea `remark-toc` (escribe `## Tabla de contenidos` en tu artículo) coexiste con la barra lateral para uso en pantallas pequeñas.

## Categorías

Asigna una categoría a un artículo mediante el campo frontmatter `category` (una sola cadena):

```yaml
---
title: "Mi Artículo"
category: "tutorial"
---
```

- La página de categoría se encuentra en `/categories/<slug>/`; el slug se normaliza mediante `slugifyStr` (CJK preservado, latín en minúsculas con guiones)
- El índice de categorías en `/categories/` lista todas las categorías
- Las tarjetas de artículos y las páginas de detalle muestran automáticamente un enlace de categoría (haz clic para ir a la página de categoría)
- Un artículo pertenece como máximo a una categoría (a diferencia de múltiples `tags`); los artículos sin `category` no aparecen en ninguna categoría
- Las páginas de categoría reutilizan `posts.perPage` para la paginación y admiten rutas espejo multilingües (`/en/categories/...`)
- Desactiva las categorías mediante `features.showCategories: false` (entrada de navegación y páginas eliminadas, sitemap filtrado)
