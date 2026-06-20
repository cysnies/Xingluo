---
title: "Bienvenido a Xingluo"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo es un CMS de blog moderno construido con Astro y el estilo visual shadcn. Este artículo presenta la filosofía de diseño y las características principales."
tags:
  - announcement
  - Astro
featured: true
locale: es
translationKey: welcome-to-xingluo
category: announcement
---

## Sobre Xingluo

**Xingluo** es un CMS de blog construido con Astro y el estilo visual shadcn.

## Características principales

- ⚡ **Rendimiento extremo**: generación estática con Astro, sin sobrecarga de JavaScript en tiempo de ejecución
- 🎨 **Visuales modernos**: estilo shadcn/ui new-york, espacio de color OKLCH
- 🌗 **Modo oscuro**: cambio sin parpadeo, sigue la preferencia del sistema
- 🔍 **Búsqueda de texto completo**: indexación en tiempo de compilación con Pagefind
- 🌐 **Multilingüe**: soporte para español, inglés y chino
- 📝 **Markdown**: MDX, resaltado de sintaxis, tabla de contenidos, callouts
- 📡 **RSS y SEO**: feed RSS y datos estructurados listos para usar

## Ejemplo de código

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Comenzar a escribir

Crea un archivo Markdown en el directorio `src/content/posts/`, agrega frontmatter y publica tu artículo. Las descripciones detalladas de los campos están disponibles en la documentación del proyecto.

¡Comienza tu viaje de escritura!
