# Thème et styles

Xingluo utilise des composants de style shadcn/ui new-york et l'espace colorimétrique OKLCH, construit sur Tailwind CSS v4.

## Structure des fichiers de style

[`src/styles/`](../src/styles/) :

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

### Custom Utilities

- `max-w-app` : largeur maximale du contenu (`--content-width: 72rem`)
- `app-layout` : mise en page de l'application (min-height 100vh, colonne flex)

## Dark Mode

### Protection FOUC

`Layout.astro` intègre un script synchrone dans `<head>` (`is:inline`) qui définit le thème avant le premier affichage :

```js
// Lire localStorage.theme, ou revenir à prefers-color-scheme
// Définir l'attribut data-theme et la classe .dark sur html
```

Cela évite un flash de thème au rafraîchissement.

### Changement de thème à l'exécution

[`src/scripts/theme.ts`](../src/scripts/theme.ts) :

- `getPreferredTheme` : localStorage d'abord, revient à la préférence système
- `persist` : persiste dans localStorage
- `reflect` : synchronise l'attribut `data-theme`, la classe `.dark`, `aria-label` de `#theme-btn`, `<meta name="theme-color">`
- Lie le clic de `#theme-btn` pour basculer
- S'adapte à View Transitions : reconnexion sur `astro:after-swap`, transporte theme-color sur `astro:before-swap`
- Écoute les changements de `prefers-color-scheme` du système (ne suit que lorsque l'utilisateur n'a pas explicitement choisi)

### Synchronisation des thèmes des commentaires et des lecteurs

- giscus : basculé via `postMessage({giscus:{setConfig:{theme}}})`
- waline : le sélecteur `dark:"html.dark"` suit automatiquement
- twikoo : surveille les changements de classe `.dark` et se reconstruit (twikoo ne prend pas en charge le changement de thème à l'exécution)
- Voir [Système de commentaires](./comments.md)

## Typography (.app-prose)

`.app-prose` de `typography.css` se base sur `prose` de `@tailwindcss/typography` avec des remplacements de thème :

- Link primary color (`--primary`)
- Inline code background (`--code`)
- Code block dual theme (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- diff / highlight / word line styles
- blockquote, hr, img styles
- details / summary collapse styles
- Image `role="button"` lightbox cursor
- Heading anchor `scroll-margin`

Les conteneurs de corps d'article utilisent `<article class="app-prose">`.

## Composants shadcn

[`src/components/ui/`](../src/components/ui/) fournit des composants de style shadcn :

| Composant                                                                              | Remarques                                                                       |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Button`                                                                               | Bascule automatiquement entre `<a>` / `<button>`, variantes cva (variant, size) |
| `Badge`                                                                                | Badge                                                                           |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Famille Card                                                                    |
| `Input`                                                                                | Champ de saisie                                                                 |
| `Separator`                                                                            | Séparateur                                                                      |

Les configurations de variantes utilisent `class-variance-authority`; les noms de classe sont fusionnés avec `cn` (`src/lib/utils.ts`, basé sur `tailwind-merge` + `clsx`).

## Système d'icônes

Les icônes de Xingluo sont des SVG inline à la construction via astro-icon + Font Awesome (mode sprite `<symbol>`), **zéro JS runtime, aucune requête réseau de police**.

### Correspondance des icônes (FA5)

| Utilisation    | Nom de l'icône                              |
| -------------- | ------------------------------------------- |
| Recherche      | `fa-solid:search`                           |
| Fermer         | `fa-solid:times`                            |
| E-mail         | `fa-solid:envelope`                         |
| Autres réseaux | `fa-brands:{name}`                          |
| X (réseau)     | `fa-brands:twitter` (FA5 n'a pas x-twitter) |

### Résolution dynamique des icônes sociales

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) collecte `src/assets/icons/socials/*.astro` par nom de fichier via `import.meta.glob` ; `getSocialIcon(name)` résout par nom. Ajouter une plateforme sociale est aussi simple que d'ajouter un fichier d'icône dans `socials/`.

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

Tous les composants référençant `bg-primary` / `text-primary` suivent automatiquement.
