# Theme und Stile

Xingluo verwendet shadcn/ui new-york Style-Komponenten und den OKLCH-Farbraum, basierend auf Tailwind CSS v4.

## Stildateistruktur

[`src/styles/`](../src/styles/):

| Datei            | Inhalt                                                                            |
| ---------------- | --------------------------------------------------------------------------------- |
| `theme.css`      | shadcn-Theme-Variablen (OKLCH, hell `:root` + dunkel `.dark`)                     |
| `global.css`     | Tailwind-Einstieg, Basis-Layer, benutzerdefinierte Dienstprogramme, Callout-Theme |
| `typography.css` | `.app-prose` Typografie und Code-Block-Stile                                      |

## Theme-Variablen

`theme.css` verwendet den OKLCH-Farbraum, um semantische Variablen mit hellen und dunklen Sätzen zu definieren:

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
  /* ... dunkle Gegenstücke ... */
}
```

Diese Variablen werden in `global.css`'s `@theme inline` auf Tailwind-Tokens abgebildet, sodass Sie Klassen wie `bg-background`, `text-foreground`, `border-border` direkt verwenden können.

## Tailwind CSS v4

Xingluo verwendet Tailwind v4, integriert über das `@tailwindcss/vite`-Plugin (siehe `vite.plugins` in `astro.config.ts`).

### Wichtige Konfiguration (`global.css`)

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... Farbzuordnungen ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### Benutzerdefinierte Dienstprogramme

- `max-w-app`: maximale Inhaltsbreite (`--content-width: 72rem`)
- `app-layout`: App-Layout (min-height 100vh, Flex-Spalte)

## Dunkler Modus

### FOUC-Schutz

`Layout.astro` bindet ein synchrones Skript in `<head>` ein (`is:inline`), das das Theme vor dem ersten Paint setzt:

```js
// Read localStorage.theme, or fall back to prefers-color-scheme
// Set the html data-theme attribute and .dark class
```

Dies vermeidet einen Theme-Flash beim Aktualisieren.

### Theme-Umschaltung zur Laufzeit

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme`: localStorage zuerst, fällt auf Systemeinstellung zurück
- `persist`: speichert in localStorage
- `reflect`: synchronisiert `data-theme`-Attribut, `.dark`-Klasse, `#theme-btn` `aria-label`, `<meta name="theme-color">`
- Bindet `#theme-btn`-Klick zum Umschalten
- Passt sich an View Transitions an: Neubindung bei `astro:after-swap`, theme-color bei `astro:before-swap`
- Hört auf System-`prefers-color-scheme`-Änderungen (folgt nur, wenn der Benutzer nicht explizit gewählt hat)

### Kommentar- und Player-Theme-Synchronisation

- giscus: umgeschaltet über `postMessage({giscus:{setConfig:{theme}}})`
- waline: `dark:"html.dark"`-Selektor folgt automatisch
- twikoo: überwacht `.dark`-Klassenänderungen und erstellt neu (twikoo unterstützt keine Laufzeitumschaltung)
- Siehe [Kommentarsystem](./comments.md)

## Typografie (.app-prose)

`.app-prose` von `typography.css` baut auf `prose` von `@tailwindcss/typography` mit Themenüberschreibungen auf:

- Link primary color (`--primary`)
- Inline code background (`--code`)
- Code block dual theme (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- diff / highlight / word line styles
- blockquote, hr, img styles
- details / summary collapse styles
- Image `role="button"` lightbox cursor
- Heading anchor `scroll-margin`

Beitragstextcontainer verwenden `<article class="app-prose">`.

## shadcn-Komponenten

[`src/components/ui/`](../src/components/ui/) bietet shadcn-Komponenten:

| Komponente                                                                             | Hinweise                                                                        |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Button`                                                                               | Wechselt automatisch zwischen `<a>` / `<button>`, cva-Varianten (variant, size) |
| `Badge`                                                                                | Badge                                                                           |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Card-Familie                                                                    |
| `Input`                                                                                | Input                                                                           |
| `Separator`                                                                            | Separator                                                                       |

Variantenkonfigurationen verwenden `class-variance-authority`; Klassennamen werden mit `cn` (`src/lib/utils.ts`, basierend auf `tailwind-merge` + `clsx`) zusammengeführt.

## Symbolsystem

Xingluos Symbole sind zur Build-Zeit inline eingebundene SVGs über astro-icon + Font Awesome (Sprite-`<symbol>`-Modus), **kein Runtime-JS, keine Schriftart-Netzwerkanfragen**.

### Symbolzuordnung (FA5)

| Verwendung     | Symbolname                                   |
| -------------- | -------------------------------------------- |
| Suche          | `fa-solid:search`                            |
| Schließen      | `fa-solid:times`                             |
| E-Mail         | `fa-solid:envelope`                          |
| Andere soziale | `fa-brands:{name}`                           |
| X (sozial)     | `fa-brands:twitter` (FA5 hat kein x-twitter) |

### Dynamische Auflösung sozialer Symbole

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) sammelt `src/assets/icons/socials/*.astro` nach Dateinamen über `import.meta.glob`; `getSocialIcon(name)` löst nach Namen auf. Das Hinzufügen einer sozialen Plattform ist so einfach wie das Hinzufügen einer Symboldatei unter `socials/`.

## Anpassen des Themes

Bearbeiten Sie die CSS-Variablen in `src/styles/theme.css`, um die siteweiten Farben anzupassen. Beispielsweise für einen blauen Primärton:

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

Alle Komponenten, die `bg-primary` / `text-primary` referenzieren, folgen automatisch.
