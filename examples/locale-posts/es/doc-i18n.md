---
title: "Internacionalización"
pubDatetime: 2026-06-20T06:00:00+08:00
description: "Detalles del sistema i18n de Xingluo que cubre enrutamiento multilingüe, localización de cadenas UI, traducción a nivel de contenido y adición de nuevos idiomas."
tags:
  - documentation
  - i18n
category: "Documentation"
translationKey: doc-i18n
locale: es
---

Xingluo viene con soporte de interfaz de usuario bilingüe (zh-CN / en), utilizando la estrategia de enrutamiento `prefixDefaultLocale: false` para que el idioma predeterminado no tenga prefijo de URL.

## Estrategia de enrutamiento

La configuración `i18n` de Astro (ver `astro.config.ts`):

```ts
i18n: {
  locales: ["zh-cn", "en"],
  defaultLocale: "zh-cn",
  routing: { prefixDefaultLocale: false },
}
```

**Importante: `prefixDefaultLocale: false` no genera automáticamente copias de página localizadas** — debe mantener manualmente las rutas espejo `[locale]/`.

Enfoque de Xingluo:

- **Páginas raíz** = idioma predeterminado (`zh-cn`), sin prefijo de URL, ej. `/posts/welcome/`
- **`src/pages/[locale]/`** refleja todas las páginas; `getStaticPaths` usa `getLocaleParams()` para generar solo locales no predeterminadas, ej. `/en/posts/welcome/`
- Las páginas espejo también son envoltorios finos, reutilizando el mismo componente de vista para la lógica de renderizado

```
/                      → inicio (zh-cn)
/en/                   → inicio (en)
/posts/welcome/        → artículo (zh-cn)
/en/posts/welcome/     → artículo (en)
```

## Resolución de locale

Los componentes de vista usan `Astro.currentLocale` para la resolución automática:

- Páginas raíz → `zh-cn`
- Páginas con segmento `[locale]` → `en` (u otras locales no predeterminadas)

No se necesitan verificaciones de ruta en la capa de componentes; `useTranslations(locale)` obtiene las cadenas correspondientes directamente.

## Estructura del módulo i18n

[`src/i18n/`](../src/i18n/):

| Archivo          | Responsabilidad                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`       | `import.meta.glob("./lang/*.ts", {eager:true})` carga idiomas; exporta `DEFAULT_LOCALE`, `LOCALES`, `useTranslations(locale)`, `tplStr` |
| `types.ts`       | Interfaz `UIStrings` completa (todas las cadenas a localizar)                                                                           |
| `routing.ts`     | `getLocalePrefix`, `withLocale(path, locale)`, `parseLocaleFromPath(pathname)`                                                          |
| `staticPaths.ts` | `NON_DEFAULT_LOCALES`, `getLocaleParams()`                                                                                              |
| `format.ts`      | `tplStr(template, vars)` — reemplazo de marcador `{{key}}`                                                                              |
| `lang/zh-cn.ts`  | Chino simplificado (predeterminado)                                                                                                     |
| `lang/en.ts`     | Inglés                                                                                                                                  |

## Estructura de UIStrings

La interfaz `UIStrings` define todas las cadenas de UI a localizar, organizadas en grupos:

- `nav`: navegación (inicio/artículos/etiquetas/acerca/archivos/búsqueda/rss)
- `post`: artículo (fecha, compartir, etiquetas, volver, editar, TOC, copia de código, lightbox de imágenes, etc.)
- `pagination`: paginación
- `home`: página de inicio (enlaces sociales, destacados, recientes)
- `archives`: archivos (conteos, meses)
- `footer`: pie de página (copyright)
- `pages`: títulos y descripciones de páginas
- `a11y`: etiquetas de accesibilidad
- `languageSwitcher`: selector de idioma
- `notFound`: 404
- `comments`: sección de comentarios

## Cadenas de plantilla

Las cadenas con marcadores usan `{{key}}`, reemplazadas mediante `tplStr`:

```ts
import { tplStr } from "@/i18n";

// archives.postCount = "{{count}} artículos"
tplStr(t.archives.postCount, { count: 5 }); // "5 artículos"
```

## Declaraciones SEO multilingües

El `<head>` de `Layout.astro` genera:

- `<link rel="alternate" hreflang="..." href="...">` para cada idioma
- `x-default` apunta al idioma predeterminado
- La integración del sitemap permite que la configuración i18n genere automáticamente hreflang
- Los artículos en locale no predeterminada tienen canonical apuntando al original en la locale predeterminada (para evitar penalizaciones de contenido duplicado; ver [SEO](./doc-seo.md))

## Añadir un idioma

Ejemplo: añadir japonés `ja`:

1. **`astro.config.ts`**: añada `"ja"` a `i18n.locales` y la asignación `"ja": "ja-JP"` al sitemap `i18n.locales`
2. **`src/i18n/lang/`**: cree `ja.ts` exportando un `UIStrings` completo (copie `en.ts` y traduzca)
3. **`src/i18n/staticPaths.ts`**: `NON_DEFAULT_LOCALES` incluye automáticamente `ja` (calculado desde `LOCALES`)
4. **`src/pages/[locale]/`**: las páginas espejo generan automáticamente la versión `ja` (`getLocaleParams` lo cubre)
5. **Selector de idioma**: añada `"ja": "日本語"` a `languageSwitcher.names` en `zh-cn.ts` y `en.ts`

## Traducción a nivel de contenido

Xingluo admite contenido multilingüe de artículos mediante los campos de frontmatter `locale` y `translationKey`.

### Uso básico

1. **Artículo en idioma predeterminado**: colóquelo en `src/content/posts/<slug>.md`, establezca `translationKey` como identificador de grupo:

```yaml
# src/content/posts/welcome.md
---
title: "欢迎来到星罗"
locale: zh-cn
translationKey: welcome-to-xingluo
tags: [公告, Astro]
---
```

2. **Traducción**: colóquela en un subdirectorio de idioma `src/content/posts/<locale>/<slug>.md`, usando el mismo `translationKey`:

```yaml
# src/content/posts/en/welcome.md
---
title: "Welcome to Xingluo"
locale: en
translationKey: welcome-to-xingluo
tags: [announcement, Astro]
---
```

### Estructura de directorios

```
src/content/posts/
├── welcome.md              # Idioma predeterminado (zh-cn)
├── en/
│   └── welcome.md          # Traducción al inglés
├── ja/
│   └── welcome.md          # Traducción al japonés
└── another-post.md         # Artículo independiente (sin translationKey)
```

- Los nombres de los subdirectorios de idioma deben coincidir con los códigos de idioma en `i18n.locales` de `astro.config.ts`
- Los subdirectorios de idioma se filtran del slug de URL (ej. `/posts/welcome/`, no `/posts/en/welcome/`)
- Los artículos sin `translationKey` son independientes y no están vinculados entre idiomas

### Comportamiento de enrutamiento

| Escenario                                             | Comportamiento                                                                                |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Acceso de locale predeterminada a un artículo `zh-cn` | Muestra el original en el idioma predeterminado                                               |
| Locale no predeterminada con una **traducción**       | Muestra la traducción correspondiente                                                         |
| Locale no predeterminada **sin** traducción           | Vuelve al original en el idioma predeterminado (contenido idéntico, canonical protege el SEO) |

### Deduplicación de listas

Las páginas de listado (inicio, lista de artículos, etiquetas, archivos, RSS) usan `getPostsForLocale` para seleccionar artículos representativos por idioma: cada grupo de traducción muestra solo una tarjeta en el idioma de destino, evitando entradas duplicadas para el mismo tema.

### canonical & SEO

- **Tiene una traducción independiente**: el canonical apunta a la URL propia de la traducción, indexable separadamente por los motores de búsqueda
- **Sin traducción (respaldo)**: el canonical apunta al original en el idioma predeterminado, evitando penalizaciones de contenido duplicado
- Las declaraciones hreflang cubren todos los idiomas, informando a los motores de búsqueda sobre las relaciones entre las versiones de idioma

See [SEO](./doc-seo.md).
