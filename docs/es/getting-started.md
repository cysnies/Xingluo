# Primeros Pasos

Esta guía te ayuda a poner en marcha Xingluo para el desarrollo local y las compilaciones de producción desde cero.

## Requisitos

| Dependencia | Versión mínima | Notas                                               |
| ----------- | -------------- | --------------------------------------------------- |
| Node.js     | 22.12.0        | Consulta `engines.node` en `package.json`           |
| pnpm        | 10.x           | Gestor de paquetes (el proyecto usa pnpm workspace) |

> Consejo: gestiona las versiones de Node con [fnm](https://github.com/Schniz/fnm) o [nvm](https://github.com/nvm-sh/nvm).

## Instalación

Después de clonar el repositorio, instala las dependencias:

```bash
pnpm install
```

Una vez instaladas las dependencias, los proyectos de referencia en `references/` se excluyen automáticamente de la compilación de TypeScript y las builds (ver `exclude` en `tsconfig.json`).

## Desarrollo local

Inicia el servidor de desarrollo (por defecto en `http://localhost:4321/`):

```bash
pnpm dev
```

En modo de desarrollo:

- Los borradores y las publicaciones programadas son **todas visibles** (para vista previa); solo se filtran durante las compilaciones de producción
- Los cambios en las colecciones de contenido activan la recarga en caliente
- Los comportamientos del lado del cliente (cambio de tema, View Transitions, etc.) coinciden con la producción

## Sincronización de tipos

Después de modificar los esquemas o tipos de las colecciones de contenido, ejecuta sync para actualizar `.astro/types.d.ts`:

```bash
pnpm sync
```

## Compilación

La compilación de producción tiene tres pasos (ver el script `build` en `package.json`):

```bash
pnpm build
```

1. **`astro check`**: verificación de tipos de TypeScript y plantillas Astro; cualquier error aborta la compilación
2. **`astro build`**: genera estáticamente todo el sitio en `dist/` (incluyendo imágenes OG dinámicas, RSS, sitemap, robots.txt, assets de UI de pagefind)
3. **`pagefind --site dist`**: escanea `dist/` para generar el índice de búsqueda de texto completo en `dist/pagefind/`

> Nota: `pagefind` es una herramienta binaria instalada como devDependency; no se necesita configuración adicional.

## Vista previa de la compilación

Previsualiza el resultado de la compilación en `dist/` localmente:

```bash
pnpm preview
```

## Calidad del código

| Comando             | Propósito                                                          |
| ------------------- | ------------------------------------------------------------------ |
| `pnpm format`       | Formatea todo el código con Prettier (incluyendo Astro y Tailwind) |
| `pnpm format:check` | Verifica el cumplimiento del formato (usado en CI)                 |
| `pnpm lint`         | Verificaciones de ESLint (incluyendo `eslint-plugin-astro`)        |

## Próximos pasos

- Lee la [Guía de configuración](./configuration.md) para personalizar la información del sitio y las funciones
- Lee [Creación de contenido](./content.md) para empezar a escribir
- Lee [Despliegue](./deployment.md) para publicar tu sitio
