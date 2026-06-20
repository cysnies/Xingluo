---
title: "Bonvenon al Xingluo"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo estas moderna bloga CMS konstruita kun Astro kaj la vida stilo shadcn. Ĉi tiu afiŝo enkondukas la dizajnofilozofion kaj kernajn trajtojn."
tags:
  - announcement
  - Astro
featured: true
locale: eo
translationKey: welcome-to-xingluo
category: announcement
---

## Pri Xingluo

**Xingluo** estas bloga CMS konstruita kun Astro kaj la vida stilo shadcn.

## Kernaj trajtoj

- ⚡ **Ekstrema rendimento**: statika generado per Astro, nula JavaScript-temporuna ŝarĝo
- 🎨 **Modernaj vidajxoj**: shadcn/ui novjorka stilo, OKLCH-kolorspaco
- 🌗 **Malhela reĝimo**: senbrila ŝaltado, sekvas sisteman preferon
- 🔍 **Plenteksta serĉo**: konstru-tempa indeksado per Pagefind
- 🌐 **Plurlingva**: subteno por Esperanto, angla kaj ĉina
- 📝 **Markdown**: MDX, sintaksa reliefigo, enhavtabelo, callouts
- 📡 **RSS kaj SEO**: RSS-fluo kaj strukturitaj datumoj pretaj por uzo

## Koda Ekzemplo

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Komenci Verkadon

Kreu Markdown-dosieron en la dosierujo `src/content/posts/`, aldonu frontmatter kaj publikigu vian artikolon. Detailaj kampaj priskriboj troveblas en la projekt-dokumentado.

Komencu vian verkadan vojaĝon!
