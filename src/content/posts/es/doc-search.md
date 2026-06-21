---
title: "Búsqueda"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Guía de búsqueda de Xingluo que cubre la integración de búsqueda de texto completo Flexsearch, generación de índices, UI, búsqueda multilingüe y rendimiento."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: es
---

Xingluo integra [Flexsearch](https://github.com/nextapps-de/flexsearch) para búsqueda de texto completo del lado del cliente, con índices por idioma y persistencia de estado de View Transitions.

## Activación

Configure mediante `features.search`:

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

Cuando se establece en `false`, la página de búsqueda ejecuta `Astro.rewrite` a 404 y no se genera ninguna interfaz de búsqueda.

## Cómo funciona

### Generación de índice

El tercer paso de compilación, `node scripts/generateSearchIndex.mjs`, escanea archivos HTML en el directorio `dist/`:

- Analiza el contenido de las páginas y extrae el texto de los artículos
- Los índices se dividen automáticamente por idioma (`zh-cn` y `en` tienen cada uno el suyo)
- Los índices se generan en `dist/search/`

### Alcance del índice

El script de compilación analiza el contenido `<main>` en las páginas de detalle de artículo, por lo que solo los cuerpos de los artículos se indexan. Otras páginas (inicio, listas, archivos, etc.) no entran en el índice de búsqueda.

## Interfaz de búsqueda

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementa la página de búsqueda:

- Utiliza el índice del lado del cliente Flexsearch para la coincidencia de búsqueda en el navegador
- Localiza los activos del índice mediante `getAssetPath("search/")`
- Utiliza variables de tema shadcn (`--background`, `--foreground`, `--primary`, etc.) para el estilo del cuadro de búsqueda y la lista de resultados
- `transition:persist` preserva el estado de búsqueda durante la navegación

### Flujo de búsqueda

1. El usuario escribe en el cuadro de búsqueda
2. Flexsearch busca en el índice del idioma actual
3. La lista de resultados muestra los artículos coincidentes (título, resaltado de resumen)
4. `processTerm` escribe la URL de la página de búsqueda con parámetros de consulta en sessionStorage, para que el botón de retroceso pueda restaurarla

## Navegación de retroceso de origen

El mecanismo de navegación de retroceso entre la página de búsqueda y las páginas de artículos:

- El componente `Main.astro` escribe la URL de la página de origen en `backUrl` de sessionStorage
- El `BackButton.astro` de la página de artículo prefiere saltar de vuelta a `backUrl` de sessionStorage, o a la página de inicio si está ausente
- El `processTerm` de la página de búsqueda escribe la URL con parámetros de consulta, restaurando el estado de búsqueda al regresar de un artículo

## Búsqueda multilingüe

Flexsearch divide los índices por idioma de página:

- Páginas `zh-cn` (raíz) → Índice chino
- Páginas `en` (prefijo `/en/`) → Índice inglés

La búsqueda coincide automáticamente con el índice del idioma de la página actual.

## Adaptación del tema

La interfaz de búsqueda Flexsearch utiliza variables de tema shadcn, definidas en `SearchView.astro` para el estilo del cuadro de búsqueda y la lista de resultados:

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

El modo oscuro cambia automáticamente mediante el selector `.dark`, consistente con el tema del sitio.

## Rendimiento

- Los índices de Flexsearch son archivos estáticos; la búsqueda ocurre del lado del cliente sin solicitudes al servidor
- Los índices se cargan bajo demanda (los fragmentos de índice se descargan solo al buscar)
- `transition:persist` evita reinicializar la interfaz de búsqueda durante la navegación
