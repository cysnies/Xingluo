---
title: "Documentación de Xingluo"
pubDatetime: 2026-06-20T02:00:00+08:00
description: "Descripción general de la documentación del proyecto Xingluo con navegación, características principales y stack tecnológico."
tags:
  - documentation
  - xingluo
category: "Documentation"
translationKey: doc-README
locale: es
---

Xingluo es un CMS de blog moderno construido con [Astro](https://astro.build/) y el estilo visual [shadcn/ui](https://ui.shadcn.com/). Ofrece una experiencia visual más moderna a través de componentes shadcn planos y elegantes y el sistema de color OKLCH, e integra de forma nativa un sistema de comentarios, soporte MDX opcional y reproductores de audio/vídeo.

## Índice de documentación

| Documento                                                  | Contenido                                                                                        |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Primeros Pasos](./doc-getting-started.md)                 | Requisitos, instalación, desarrollo local, compilación y vista previa                            |
| [Guía de configuración](./doc-configuration.md)            | Referencia completa de `xingluo.config.ts`                                                       |
| [Creación de contenido](./doc-content.md)                  | Frontmatter de artículos, sintaxis Markdown/MDX, bloques de código, callouts, mejoras            |
| [Internacionalización](./doc-i18n.md)                      | Enrutamiento multilingüe, cadenas UI, traducción a nivel de contenido, agregar idioma            |
| [Visión general de la arquitectura](./doc-architecture.md) | Estructura de directorios, flujo de configuración, flujo de renderizado, pipeline de compilación |
| [Tema y estilos](./doc-theming.md)                         | Variables de tema shadcn, OKLCH, Tailwind v4, modo oscuro                                        |
| [Sistema de comentarios](./doc-comments.md)                | Elegir y configurar giscus / twikoo / waline                                                     |
| [Reproductores multimedia](./doc-media-players.md)         | Uso de APlayer / DPlayer en Markdown y MDX                                                       |
| [SEO](./doc-seo.md)                                        | Imágenes OG, RSS, mapa del sitio, hreflang, canonical, datos estructurados                       |
| [Búsqueda](./doc-search.md)                                | Integración de búsqueda de texto completo Pagefind                                               |
| [Despliegue](./doc-deployment.md)                          | Alojamiento estático, GitHub Pages, variables de entorno, Docker                                 |

## Características principales

- **Rendimiento de primer nivel**: generación estática de Astro, iconos SVG incrustados en tiempo de compilación (sin JS en tiempo de ejecución), carga diferida de comentarios y reproductores, limpieza de activos huérfanos
- **Visuales modernos**: componentes shadcn/ui new-york, espacio de color OKLCH, modo oscuro suave (protección FOUC)
- **Multilingüe**: traducción a nivel de UI y contenido, enrutamiento `prefixDefaultLocale: false`, declaraciones SEO hreflang y x-default
- **Mejora de contenido**: MDX opcional, resaltado de código Shiki de doble tema, callouts, TOC plegable, tablas desplazables
- **Tiempo de lectura**: estimación inteligente (CJK por conteo de caracteres, latín por conteo de palabras), mostrado en tarjetas y páginas de detalle
- **Artículos relacionados**: recomendados automáticamente por etiquetas compartidas
- **Categorías de artículos**: asignar mediante frontmatter, con páginas de categoría dedicadas y entrada de navegación
- **Barra lateral TOC fija**: tabla de contenidos fija a la derecha en pantallas grandes, seguimiento de desplazamiento IntersectionObserver
- **Sistema de comentarios**: giscus / twikoo / waline, consciente del tema, carga diferida
- **Reproductores multimedia**: audio APlayer y video DPlayer, con puntos de entrada MD fence y componente MDX
- **Búsqueda**: búsqueda de texto completo Pagefind, índices por idioma, persistencia de estado View Transitions
- **SEO completo**: imágenes OG dinámicas (satori + sharp), RSS, mapa del sitio, datos estructurados JSON-LD (BlogPosting + BreadcrumbList), normalización canonical

## Stack tecnológico

| Categoría           | Tecnología                                                             |
| ------------------- | ---------------------------------------------------------------------- |
| Framework           | Astro 6.x                                                              |
| Estilización        | Tailwind CSS v4, componentes estilo shadcn/ui, @tailwindcss/typography |
| Iconos              | astro-icon + Font Awesome                                              |
| Contenido           | Astro Content Collections, MDX, cadena de plugins remark/rehype        |
| Resaltado de código | Shiki                                                                  |
| Búsqueda            | Pagefind                                                               |
| Imágenes OG         | satori + sharp                                                         |
| Comentarios         | giscus / twikoo / waline                                               |
| Reproductores       | APlayer / DPlayer                                                      |
| Fecha               | dayjs                                                                  |
| Gestor de paquetes  | pnpm                                                                   |
| Lenguaje            | TypeScript                                                             |

## Licencia

AGPL-3.0
