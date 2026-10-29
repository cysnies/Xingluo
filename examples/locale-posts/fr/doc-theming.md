---
title: "Thème et styles"
pubDatetime: 2026-06-20T08:00:00+08:00
description: "Système de thème et de style Xingluo couvrant les variables de thème shadcn, l'espace colorimétrique OKLCH, Tailwind v4 et le mode sombre."
tags:
  - documentation
  - theming
category: "Documentation"
translationKey: doc-theming
locale: fr
---

Xingluo utilise des composants de style shadcn/ui new-york et l'espace colorimétrique OKLCH, construit sur Tailwind CSS v4.

## Structure des fichiers de style

[`src/styles/`](../src/styles/):

| Fichier          | Contenu                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| `theme.css`      | Variables de thème shadcn (OKLCH, `:root` clair + `.dark` sombre)          |
| `global.css`     | Entrée Tailwind, couche de base, utilitaires personnalisés, thèmes callout |
| `typography.css` | Typographie `.app-prose` et styles de blocs de code                        |

## Variables de thème

`theme.css` utilise l'espace colorimétrique OKLCH pour définir des variables sémantiques, avec des ensembles clair et sombre :

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
  /* ... équivalents sombres ... */
}
```

Ces variables sont mappées aux tokens Tailwind dans `@theme inline` de `global.css`, vous pouvez donc utiliser directement des classes comme `bg-background`, `text-foreground`, `border-border`.

## Tailwind CSS v4

Xingluo utilise Tailwind v4, intégré via le plugin `@tailwindcss/vite` (voir `vite.plugins` dans `astro.config.ts`).

### Configuration clé (`global.css`)

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... correspondances de couleurs ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### Utilitaires personnalisés

- `max-w-app` : largeur maximale du contenu (`--content-width: 72rem`)
- `app-layout` : mise en page de l'application (min-height 100vh, colonne flex)

## Mode sombre

### Protection FOUC

`Layout.astro` intègre un script synchrone dans `<head>` (`is:inline`) qui définit le thème avant le premier affichage :

```js
// Lire localStorage.theme, ou revenir à prefers-color-scheme
// Définir l'attribut data-theme et la classe .dark sur html
```

Cela évite un flash de thème au rafraîchissement.

### Basculement de thème à l'exécution

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme` : localStorage en priorité, sinon préférence système
- `persist` : persiste dans localStorage
- `reflect` : synchronise l'attribut `data-theme`, la classe `.dark`, `aria-label` de `#theme-btn`, `<meta name="theme-color">`
- Lie le clic sur `#theme-btn` pour basculer
- S'adapte aux View Transitions : rebinding sur `astro:after-swap`, conservation de theme-color sur `astro:before-swap`
- Écoute les changements `prefers-color-scheme` du système (ne suit que lorsque l'utilisateur n'a pas choisi explicitement)

### Synchronisation des thèmes des commentaires et des lecteurs

- giscus : basculé via `postMessage({giscus:{setConfig:{theme}}})`
- waline : le sélecteur `dark:"html.dark"` suit automatiquement
- twikoo : surveille les changements de classe `.dark` et se reconstruit (twikoo ne prend pas en charge le changement de thème à l'exécution)
- Voir [Système de commentaires](./doc-comments.md)

## Typographie (.app-prose)

Le `.app-prose` de `typography.css` s'appuie sur `prose` de `@tailwindcss/typography` avec des surcharges de thème :

- Couleur primaire des liens (`--primary`)
- Arrière-plan du code en ligne (`--code`)
- Thème double des blocs de code (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- Styles de lignes diff / highlight / word
- Styles blockquote, hr, img
- Styles pliables details / summary
- Curseur lightbox pour les images `role="button"`
- Marge de défilement des ancres de titres `scroll-margin`

Les conteneurs de corps d'article utilisent `<article class="app-prose">`.

## Composants shadcn

[`src/components/ui/`](../src/components/ui/) fournit des composants de style shadcn :

| Composant                                                                              | Description                                                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Button`                                                                               | Bascule automatiquement entre `<a>` / `<button>`, variantes cva (variant, size) |
| `Badge`                                                                                | Badge                                                                           |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Famille Card                                                                    |
| `Input`                                                                                | Input                                                                           |
| `Separator`                                                                            | Séparateur                                                                      |

Les configurations de variantes utilisent `class-variance-authority` ; les noms de classe sont fusionnés avec `cn` (`src/lib/utils.ts`, basé sur `tailwind-merge` + `clsx`).

## Système d'icônes

Les icônes de Xingluo sont des SVG intégrés à la construction via astro-icon + Font Awesome (mode sprite `<symbol>`), **zéro JS à l'exécution, aucune requête réseau de polices**.

### Correspondance des icônes (FA5)

| Utilisation    | Nom de l'icône                              |
| -------------- | ------------------------------------------- |
| Recherche      | `fa-solid:search`                           |
| Fermer         | `fa-solid:times`                            |
| Mail           | `fa-solid:envelope`                         |
| Autres réseaux | `fa-brands:{name}`                          |
| X (social)     | `fa-brands:twitter` (FA5 n'a pas x-twitter) |

### Résolution dynamique des icônes sociales

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) collecte les fichiers `src/assets/icons/socials/*.astro` par nom de fichier via `import.meta.glob` ; `getSocialIcon(name)` résout par nom. Ajouter une plateforme sociale est aussi simple que d'ajouter un fichier d'icône dans `socials/`.

## Personnalisation du thème

Modifiez les variables CSS dans `src/styles/theme.css` pour ajuster les couleurs du site. Par exemple, pour passer à un bleu primaire :

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

Tous les composants qui référencent `bg-primary` / `text-primary` suivent automatiquement.
