---
title: "Tema y Estilos"
pubDatetime: 2026-06-20T08:00:00+08:00
description: "Sistema de temas y estilos de Xingluo que cubre variables de tema shadcn, espacio de color OKLCH, Tailwind v4 y modo oscuro."
tags:
  - documentation
  - theming
category: "Documentation"
translationKey: doc-theming
locale: es
---

Xingluo utiliza componentes de estilo shadcn/ui new-york y el espacio de color OKLCH, construido sobre Tailwind CSS v4.

## Estructura de archivos de estilo

[`src/styles/`](../src/styles/):

| Archivo          | Contenido                                                                   |
| ---------------- | --------------------------------------------------------------------------- |
| `theme.css`      | Variables de tema shadcn (OKLCH, claro `:root` + oscuro `.dark`)            |
| `global.css`     | Entrada de Tailwind, capa base, utilidades personalizadas, temas de callout |
| `typography.css` | Tipografía `.app-prose` y estilos de bloques de código                      |

## Variables de tema

`theme.css` utiliza el espacio de color OKLCH para definir variables semánticas, con conjuntos claro y oscuro:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  /* ... secondary, muted, accent, destructive, border, input, ring ... */
  --code: oklch(0.97 0 0);
  --content-width: 72rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... contrapartes oscuras ... */
}
```

Estas variables se mapean a tokens de Tailwind en `@theme inline` de `global.css`, por lo que puede usar clases como `bg-background`, `text-foreground`, `border-border` directamente.

## Tailwind CSS v4

Xingluo usa Tailwind v4, integrado mediante el plugin `@tailwindcss/vite` (ver `vite.plugins` en `astro.config.ts`).

### Configuración clave (`global.css`)

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... mapeos de colores ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### Utilidades personalizadas

- `max-w-app`: ancho máximo del contenido (`--content-width: 72rem`)
- `app-layout`: diseño de la aplicación (min-height 100vh, flex column)

## Modo oscuro

### Protección FOUC

`Layout.astro` incluye un script síncrono en `<head>` (`is:inline`) que establece el tema antes del primer pintado:

```js
// Leer localStorage.theme, o retroceder a prefers-color-scheme
// Establecer el atributo data-theme y la clase .dark en html
```

Esto evita un destello de tema al actualizar.

### Alternancia de tema en tiempo de ejecución

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme`: localStorage primero, retrocede a preferencia del sistema
- `persist`: persiste en localStorage
- `reflect`: sincroniza el atributo `data-theme`, la clase `.dark`, `#theme-btn` `aria-label`, `<meta name="theme-color">`
- Vincula el clic de `#theme-btn` para alternar
- Se adapta a View Transitions: reenlace en `astro:after-swap`, transportar theme-color en `astro:before-swap`
- Escucha cambios del sistema `prefers-color-scheme` (solo sigue cuando el usuario no ha elegido explícitamente)

### Sincronización de tema de comentarios y reproductores

- giscus: alternado mediante `postMessage({giscus:{setConfig:{theme}}})`
- waline: el selector `dark:"html.dark"` sigue automáticamente
- twikoo: observa cambios de clase `.dark` y reconstruye (twikoo no admite cambio en tiempo de ejecución)
- Ver [Sistema de comentarios](./doc-comments.md)

## Tipografía (.app-prose)

`.app-prose` de `typography.css` se basa en `prose` de `@tailwindcss/typography` con anulaciones de tema:

- Color primario de enlaces (`--primary`)
- Fondo de código en línea (`--code`)
- Tema dual de bloques de código (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- Estilos de líneas diff / highlight / word
- Estilos de blockquote, hr, img
- Estilos de details / summary collapse
- Cursor lightbox para imagen `role="button"`
- `scroll-margin` para anclas de encabezado

Los contenedores de cuerpo de artículo usan `<article class="app-prose">`.

## Componentes shadcn

[`src/components/ui/`](../src/components/ui/) proporciona componentes de estilo shadcn:

| Componente                                                                             | Notas                                                                          |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Button`                                                                               | Cambia automáticamente entre `<a>` / `<button>`, variantes cva (variant, size) |
| `Badge`                                                                                | Insignia                                                                       |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Familia de tarjetas                                                            |
| `Input`                                                                                | Campo de entrada                                                               |
| `Separator`                                                                            | Separador                                                                      |

Las configuraciones de variantes usan `class-variance-authority`; los nombres de clases se fusionan con `cn` (`src/lib/utils.ts`, basado en `tailwind-merge` + `clsx`).

## Sistema de iconos

Los iconos de Xingluo son SVG incrustados en tiempo de compilación mediante astro-icon + Font Awesome (modo sprite `<symbol>`), **cero JS en tiempo de ejecución, sin solicitudes de red de fuentes**.

### Mapeo de iconos (FA5)

| Uso            | Nombre de icono                              |
| -------------- | -------------------------------------------- |
| Búsqueda       | `fa-solid:search`                            |
| Cerrar         | `fa-solid:times`                             |
| Correo         | `fa-solid:envelope`                          |
| Otros sociales | `fa-brands:{name}`                           |
| X (social)     | `fa-brands:twitter` (FA5 no tiene x-twitter) |

### Resolución dinámica de iconos sociales

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) recopila `src/assets/icons/socials/*.astro` por nombre de archivo mediante `import.meta.glob`; `getSocialIcon(name)` resuelve por nombre. Añadir una plataforma social es tan simple como añadir un archivo de icono bajo `socials/`.

## Personalización del tema

Edite las variables CSS en `src/styles/theme.css` para ajustar los colores del sitio. Por ejemplo, para cambiar a un primario azul:

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

Todos los componentes que referencian `bg-primary` / `text-primary` siguen automáticamente.
