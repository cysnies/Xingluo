# Búsqueda

Xingluo integra [Pagefind](https://pagefind.app/) para búsqueda de texto completo estática, con índices por idioma y persistencia de estado de View Transitions.

## Habilitación

Configure via `features.search`:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

Cuando se establece en `false`, la página de búsqueda redirige con `Astro.rewrite` a 404 y no se genera ninguna interfaz de búsqueda.

## Cómo funciona

### Generación de índices

El tercer paso de compilación, `pagefind --site dist`, escanea el directorio `dist/`:

- Solo se indexan las páginas con el atributo `data-pagefind-body`
- Los índices se dividen automáticamente por idioma (`zh-cn` y `en` cada uno tiene el suyo)
- Los índices se generan en `dist/pagefind/`

### Alcance del índice

El `<main>` en las páginas de detalle de artículos está marcado con `data-pagefind-body`, por lo que solo se indexan los cuerpos de los artículos. Otras páginas (inicio, listas, archivos, etc.) no entran en el índice de búsqueda.

## Interfaz de búsqueda

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementa la página de búsqueda:

- Carga `@pagefind/default-ui` para el cuadro de búsqueda y la lista de resultados
- Localiza los índices mediante `getAssetPath("pagefind/")`
- Los estilos globales anulan las variables CSS de Pagefind, mapeándolas al tema de Xingluo (`--background`, `--foreground`, `--primary`, etc.)
- `transition:persist` conserva el estado de búsqueda entre navegaciones

### Flujo de búsqueda

1. El usuario escribe en el cuadro de búsqueda
2. Pagefind busca en el índice del idioma actual
3. La lista de resultados muestra los artículos coincidentes (título, resumen resaltado)
4. `processTerm` escribe la URL de la página de búsqueda con parámetros de consulta en sessionStorage, para que el botón de retroceso lo restaure

## Navegación hacia atrás

El mecanismo de navegación hacia atrás entre la página de búsqueda y las páginas de artículos:

- El componente `Main.astro` escribe la URL de la página de origen en `backUrl` de sessionStorage
- El `BackButton.astro` de la página de artículo prefiere volver a `backUrl` de sessionStorage, o a la página de inicio si está ausente
- El `processTerm` de la página de búsqueda escribe la URL con parámetros de consulta, restaurando el estado de búsqueda al regresar de un artículo

## Búsqueda multilingüe

Pagefind divide los índices por el atributo de idioma de los elementos `data-pagefind-body`:

- Páginas `zh-cn` (raíz) → Índice chino
- Páginas `en` (prefijo `/en/`) → Índice inglés

La búsqueda utiliza automáticamente el índice del idioma de la página actual: chino en páginas chinas, inglés en páginas inglesas.

## Adaptación de tema

La UI predeterminada de Pagefind tiene sus propias variables CSS; Xingluo las anula con estilos globales en `SearchView.astro`, mapeándolas a las variables del tema shadcn:

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

El modo oscuro cambia automáticamente a través del selector `.dark`, coherente con el tema del sitio.

## Rendimiento

- Los índices de Pagefind son archivos estáticos; la búsqueda ocurre del lado del cliente sin solicitudes al servidor
- Los índices se cargan bajo demanda (los fragmentos de índice se descargan solo al buscar)
- `transition:persist` evita reinicializar la UI de búsqueda al navegar
