---
title: "Bienvenue sur Xingluo"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo est un CMS de blog moderne construit avec Astro et le style visuel shadcn. Cet article présente la philosophie de conception et les fonctionnalités principales."
tags:
  - announcement
  - Astro
featured: true
locale: fr
translationKey: welcome-to-xingluo
category: announcement
---

## À propos de Xingluo

**Xingluo** est un CMS de blog construit avec Astro et le style visuel shadcn.

## Fonctionnalités principales

- ⚡ **Performances extrêmes** : génération statique avec Astro, zéro surcharge JavaScript
- 🎨 **Visuels modernes** : style shadcn/ui new-york, espace colorimétrique OKLCH
- 🌗 **Mode sombre** : commutation sans scintillement, suit les préférences système
- 🔍 **Recherche plein texte** : indexation au moment de la construction avec Pagefind
- 🌐 **Multilingue** : support français, anglais et chinois
- 📝 **Markdown** : MDX, coloration syntaxique, table des matières, callouts
- 📡 **RSS et SEO** : flux RSS et données structurées prêts à l'emploi

## Exemple de code

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Commencer à écrire

Créez un fichier Markdown dans le répertoire `src/content/posts/`, ajoutez un frontmatter et publiez votre article. Les descriptions détaillées des champs sont disponibles dans la documentation du projet.

Commencez votre voyage d'écriture !
