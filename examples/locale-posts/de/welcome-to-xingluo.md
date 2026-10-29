---
title: "Willkommen bei Xingluo"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo ist ein modernes Blog-CMS, das mit Astro und dem visuellen Stil von shadcn erstellt wurde. Dieser Beitrag stellt die Designphilosophie und Kernfunktionen vor."
tags:
  - announcement
  - Astro
featured: true
locale: de
translationKey: welcome-to-xingluo
category: announcement
---

## Über Xingluo

**Xingluo** ist ein Blog-CMS, das mit Astro und dem visuellen Stil von shadcn erstellt wurde.

## Kernfunktionen

- ⚡ **Extreme Leistung**: statische Generierung mit Astro, keine JavaScript-Laufzeit
- 🎨 **Moderne Optik**: shadcn/ui new-york Stil, OKLCH-Farbraum
- 🌗 **Dunkelmodus**: flackerfreies Umschalten, folgt Systemeinstellung
- 🔍 **Volltextsuche**: Build-Zeit-Indizierung mit Flexsearch
- 🌐 **Mehrsprachig**: Deutsch, Englisch und Chinesisch
- 📝 **Markdown**: MDX, Syntax-Highlighting, Inhaltsverzeichnis, Callouts
- 📡 **RSS & SEO**: RSS-Feed und strukturierte Daten sofort einsatzbereit

## Code-Beispiel

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Schreiben beginnen

Erstelle eine Markdown-Datei im Verzeichnis `src/content/posts/`, füge Frontmatter hinzu und veröffentliche deinen Artikel. Detaillierte Feldbeschreibungen findest du in der Projektdokumentation.

Starte deine Schreibreise!
