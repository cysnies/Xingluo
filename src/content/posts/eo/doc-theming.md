---
title: "Etoso kaj Stiloj"
pubDatetime: 2026-06-20T08:00:00+08:00
description: "Etosa kaj stila sistemo de Xingluo kovranta shadcn-etosajn variablojn, OKLCH-kolorspacon, Tailwind v4 kaj malhelan reĝimon."
tags:
  - documentation
  - theming
category: "Documentation"
translationKey: doc-theming
locale: eo
---

Xingluo uzas shadcn/ui new-york-stilajn komponantojn kaj la OKLCH-kolorspacon, konstruita sur Tailwind CSS v4.

## Strukturo de stilaj dosieroj

[`src/styles/`](../src/styles/):

| Dosiero          | Enhavo                                                         |
| ---------------- | -------------------------------------------------------------- |
| `theme.css`      | shadcn-temaj variabloj (OKLCH, hela `:root` + malhela `.dark`) |
| `global.css`     | Tailwind-eniro, baza tavolo, propraj utilecoj, alvokaj temoj   |
| `typography.css` | `.app-prose` tipografio kaj kodblokaj stiloj                   |

## Temaj variabloj

`theme.css` uzas la OKLCH-kolorspacon por difini semantikajn variablojn, kun helaj kaj malhelaj aroj:

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
  /* ... malhelaj ekvivalentoj ... */
}
```

Ĉi tiuj variabloj estas mapitaj al Tailwind-ĵetonoj en `@theme inline` de `global.css`, do vi povas uzi klasojn kiel `bg-background`, `text-foreground`, `border-border` rekte.

## Tailwind CSS v4

Xingluo uzas Tailwind v4, integrita per la `@tailwindcss/vite` kromprogramo (vidu `vite.plugins` en `astro.config.ts`).

### Ŝlosila agordo (`global.css`)

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... koloraj mapadoj ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### Propraj utilecoj

- `max-w-app`: maksimuma larĝo de enhavo (`--content-width: 72rem`)
- `app-layout`: aplikaĵa aranĝo (min-height 100vh, flex column)

## Malhela reĝimo

### Protekto kontraŭ FOUC

`Layout.astro` enigas sinkronan skripton en `<head>` (`is:inline`) kiu agordas la temon antaŭ unua pentrado:

```js
// Legi localStorage.theme, aŭ rezervi al prefers-color-scheme
// Agordi la html data-theme atributon kaj .dark klason
```

Ĉi tio evitas teman fulmon dum refreŝigo.

### Rultempa temoŝaltilo

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme`: localStorage unue, rezervas al sistema prefero
- `persist`: persistas al localStorage
- `reflect`: sinkronigas `data-theme` atributon, `.dark` klason, `#theme-btn` `aria-label`, `<meta name="theme-color">`
- Ligas `#theme-btn` klakon por ŝalti
- Adaptiĝas al View Transitions: re-ligi sur `astro:after-swap`, porti theme-color sur `astro:before-swap`
- Aŭskultas sistemajn `prefers-color-scheme` ŝanĝojn (sekvas nur kiam la uzanto ne elektis eksplicite)

### Sinkronigo de tema por komentoj kaj ludiloj

- giscus: ŝaltita per `postMessage({giscus:{setConfig:{theme}}})`
- waline: selektilo `dark:"html.dark"` aŭtomate sekvas
- twikoo: observas ŝanĝojn de `.dark` klaso kaj rekonstruas (twikoo ne subtenas rultempan ŝaltadon)
- Vidu [Komenta sistemo](./doc-comments.md)

## Tipografio (.app-prose)

`.app-prose` en `typography.css` konstruas sur `prose` de `@tailwindcss/typography` kun temaj anstataŭigoj:

- Ligo primara koloro (`--primary`)
- Enlinia koda fono (`--code`)
- Kodbloka duobla temo (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- Stiloj de diff / highlight / word linioj
- Stiloj de blockquote, hr, img
- Stiloj de faldado details / summary
- Bilda `role="button"` lightbox kursoro
- `scroll-margin` por titola ankro

Korpo-konteuiloj de afiŝoj uzas `<article class="app-prose">`.

## shadcn-komponantoj

[`src/components/ui/`](../src/components/ui/) provizas shadcn-stilajn komponantojn:

| Komponanto                                                                             | Notoj                                                                   |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `Button`                                                                               | Aŭtomate ŝaltas inter `<a>` / `<button>`, cva variantoj (variant, size) |
| `Badge`                                                                                | Insigno                                                                 |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Karta familio                                                           |
| `Input`                                                                                | Enigo                                                                   |
| `Separator`                                                                            | Disigilo                                                                |

Variaj agordoj uzas `class-variance-authority`; klasnomoj estas kunfanditaj per `cn` (`src/lib/utils.ts`, bazita sur `tailwind-merge` + `clsx`).

## Ikona sistemo

La ikonoj de Xingluo estas konstrutempaj enkonstruitaj SVG-oj per astro-icon + Font Awesome (sprite `<symbol>`-reĝimo), **nula rula JS, neniuj tiparaj retpetoj**.

### Ikona mapado (FA5)

| Uzo          | Nomo de ikono                                |
| ------------ | -------------------------------------------- |
| Serĉo        | `fa-solid:search`                            |
| Fermo        | `fa-solid:times`                             |
| Retpoŝto     | `fa-solid:envelope`                          |
| Aliaj sociaj | `fa-brands:{name}`                           |
| X (socia)    | `fa-brands:twitter` (FA5 ne havas x-twitter) |

### Dinamika rezolucio de sociaj ikonoj

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) kolektas `src/assets/icons/socials/*.astro` laŭ dosiernomo per `import.meta.glob`; `getSocialIcon(name)` solvas laŭ nomo. Aldoni socian platformon estas tiel simpla kiel aldoni ikondosieron sub `socials/`.

## Agordi la temon

Redaktu la CSS-variablojn en `src/styles/theme.css` por ĝustigi tutejajn kolorojn. Ekzemple, por ŝanĝi al blua primara:

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

Ĉiuj komponantoj kiuj referencas `bg-primary` / `text-primary` sekvas aŭtomate.
