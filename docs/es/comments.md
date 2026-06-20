# Sistema de comentarios

Xingluo integra tres sistemas de comentarios — giscus, twikoo y waline — seleccionables a través de `features.comments`.

## Configuración

Elige un proveedor y proporciona su configuración en `features.comments` en [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* giscus config */ },
    // twikoo: { /* twikoo config */ },
    // waline: { /* waline config */ },
  },
}
```

Con `provider: false` (predeterminado), los comentarios están desactivados y las páginas de artículos no emiten marcadores ni scripts de comentarios.

## Ubicación de la sección de comentarios

La sección de comentarios aparece solo al final de las **páginas de detalle de artículos** (después de la navegación anterior/siguiente), renderizada por [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro).

## giscus

Sistema de comentarios basado en GitHub Discussions; el repositorio debe ser público con Discussions habilitado.

### Configuración

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // Repositorio de GitHub
    repoId: "R_...",              // ID del repositorio (generado por giscus.app)
    category: "Announcements",    // Nombre de la categoría de discusión
    categoryId: "DIC_...",        // ID de la categoría (generado por giscus.app)
    mapping: "pathname",          // opcional, mapeo página-a-discusión
    strict: false,                // opcional, coincidencia estricta de título
    reactionsEnabled: true,       // opcional, reacciones
    inputPosition: "bottom",      // opcional, posición del cuadro de comentarios: top | bottom
    loading: "lazy",              // opcional, carga: lazy | eager
  },
}
```

### Obtener repoId / categoryId

1. Visita [giscus.app](https://giscus.app)
2. Ingresa el repositorio y la categoría para generar la configuración
3. Copia `data-repo-id` y `data-category-id` en tu configuración

### Cómo funciona

giscus inyecta un iframe mediante el `client.js` oficial, con atributos `data-*` que contienen la configuración. El idioma se asigna automáticamente al locale actual (`zh-cn` → `zh-CN`, `en` → `en`). El tema se sincroniza al cambiar mediante `postMessage`.

## twikoo

Sistema de comentarios sin dependencia de backend, compatible con Tencent CloudBase o autoalojamiento.

### Configuración

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // ID del entorno en la nube o URL de autohospedaje completa
    lang: "zh-CN",                            // opcional, idioma
  },
}
```

### Notas sobre envId

- Tencent CloudBase: completa el ID de entorno (requiere el SDK de cloudbase)
- Autoalojado: completa la URL completa (ej. `https://twikoo.example.com`); twikoo detecta automáticamente el modo HTTP API

### Cómo funciona

twikoo importa dinámicamente `import("twikoo")` y llama a `init` cuando el contenedor de comentarios entra en el viewport. twikoo no soporta cambio de tema en tiempo de ejecución; el sitio lo reconstruye al cambiar el tema para aplicar estilos oscuros.

## waline

Sistema de comentarios con backend, con contadores de comentarios y vistas.

### Configuración

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Dirección del servidor Waline
    lang: "zh-CN",                           // opcional, idioma
    pageSize: 10,                            // opcional, tamaño de página de comentarios
    dark: "html.dark",                       // opcional, selector oscuro (por defecto sigue .dark del sitio)
  },
}
```

### Despliegue de serverURL

Consulte la [documentación de Waline](https://waline.js.org/) para implementar el servidor (Vercel / Cloudflare / autoalojado funcionan todos), luego coloque la dirección en `serverURL`.

### Cómo funciona

waline importa dinámicamente `import("@waline/client")` y el estilo `@waline/client/style` cuando el contenedor de comentarios entra en el viewport, luego llama a `init`. El selector `dark:"html.dark"` sigue automáticamente el modo oscuro del sitio; no se necesita sincronización manual.

## Carga diferida

Todos los sistemas de comentarios se cargan de forma diferida mediante IntersectionObserver: las solicitudes y la inicialización ocurren solo cuando el contenedor de comentarios está dentro de 200px del viewport, evitando el costo de rendimiento del primer pintado.

Consulte [`src/scripts/comments.ts`](../src/scripts/comments.ts).

## Sincronización de tema

Cuando el tema del sitio cambia, el tema del sistema de comentarios se sincroniza automáticamente:

| Sistema de comentarios | Método de sincronización                                    |
| ---------------------- | ----------------------------------------------------------- |
| giscus                 | `postMessage({giscus:{setConfig:{theme}}})` al iframe       |
| waline                 | El selector CSS `dark:"html.dark"` sigue automáticamente    |
| twikoo                 | Observa cambios de clase `.dark` y reconstruye la instancia |

La vigilancia del tema utiliza un `MutationObserver` en los atributos `class` y `data-theme` de `document.documentElement`.

## Adaptación de View Transitions

El script de comentarios escucha `astro:page-load` y vuelve a escanear los puntos de montaje después de cada carga de página. La reinicialización se evita mediante marcadores `dataset` (`xng-setup`, `xng-init`).

## i18n

El título de la sección de comentarios se localiza a través de `UIStrings.comments.title`. El idioma de la interfaz del sistema de comentarios es controlado por el campo `lang` de cada proveedor.

## Extensiones personalizadas

### Cambio de proveedor

Cambie `features.comments.provider` en `xingluo.config.ts`; no se necesitan cambios de código. Xingluo renderiza el subcomponente correspondiente automáticamente.

### Añadir un sistema de comentarios

1. Cree un nuevo componente en `src/components/comments/` (ej. `Disqus.astro`) que renderice un placeholder de montaje
2. Añada una nueva rama de proveedor en el renderizado condicional de `Comments.astro`
3. Añada la lógica de inicialización en `src/scripts/comments.ts`
4. Extienda `CommentProvider` y los tipos de configuración en `src/types/config.ts`
