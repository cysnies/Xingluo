---
title: "Búsqueda"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Guía de búsqueda de Xingluo que cubre la integración de búsqueda de texto completo Pagefind, generación de índices, UI, búsqueda multilingüe y rendimiento."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: es
---

Xingluo integra [Pagefind](https://pagefind.app/) para búsqueda de texto completo estática, con índices por idioma y persistencia de estado de View Transitions.

## Activación

Configure mediante `features.search`:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

Cuando se establece en `false`, la página de búsqueda ejecuta `Astro.rewrite` a 404 y no se genera ninguna interfaz de búsqueda.

## Cómo funciona

### Generación de índice

El tercer paso de compilación, `pagefind --site dist`, escanea el directorio `dist/`:

- Solo se indexan las páginas con el atributo `data-pagefind-body`
- Los índices se dividen automáticamente por idioma (`zh-cn` y `en` tienen cada uno el suyo)
- Los índices se generan en `dist/pagefind/`

### Alcance del índice

El `<main>` en las páginas de detalle de artículo está marcado con `data-pagefind-body`, por lo que solo los cuerpos de los artículos se indexan. Otras páginas (inicio, listas, archivos, etc.) no entran en el índice de búsqueda.

## Interfaz de búsqueda

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementa la página de búsqueda:

- Carga `@pagefind/default-ui` para el cuadro de búsqueda y la lista de resultados
- Localiza los activos del índice mediante `getAssetPath("pagefind/")`
- Los estilos globales anulan las variables CSS de Pagefind, mapeándolas al tema de Xingluo (`--background`, `--foreground`, `--primary`, etc.)
- `transition:persist` preserva el estado de búsqueda durante la navegación

### Flujo de búsqueda

1. El usuario escribe en el cuadro de búsqueda
2. Pagefind busca en el índice del idioma actual
3. La lista de resultados muestra los artículos coincidentes (título, resaltado de resumen)
4. `processTerm` escribe la URL de la página de búsqueda con parámetros de consulta en sessionStorage, para que el botón de retroceso pueda restaurarla

## Navegación de retroceso de origen

El mecanismo de navegación de retroceso entre la página de búsqueda y las páginas de artículos:

- El componente `Main.astro` escribe la URL de la página de origen en `backUrl` de sessionStorage
- El `BackButton.astro` de la página de artículo prefiere saltar de vuelta a `backUrl` de sessionStorage, o a la página de inicio si está ausente
- El `processTerm` de la página de búsqueda escribe la URL con parámetros de consulta, restaurando el estado de búsqueda al regresar de un artículo

## Búsqueda multilingüe

Pagefind divide los índices por el atributo de idioma de los elementos `data-pagefind-body`:

- Páginas `zh-cn` (raíz) → Índice chino
- Páginas `en` (prefijo `/en/`) → Índice inglés

La búsqueda coincide automáticamente con el índice del idioma de la página actual.

## Adaptación del tema

La interfaz de usuario predeterminada de Pagefind tiene sus propias variables CSS; Xingluo las anula con estilos globales en `SearchView.astro`, mapeándolas a las variables del tema shadcn:

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

El modo oscuro cambia automáticamente mediante el selector `.dark`, consistente con el tema del sitio.

## Rendimiento

- Los índices de Pagefind son archivos estáticos; la búsqueda ocurre del lado del cliente sin solicitudes al servidor
- Los índices se cargan bajo demanda (los fragmentos de índice se descargan solo al buscar)
- `transition:persist` evita reinicializar la interfaz de búsqueda durante la navegación
