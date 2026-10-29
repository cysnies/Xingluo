---
title: "Architekturübersicht"
pubDatetime: 2026-06-20T07:00:00+08:00
description: "Architekturübersicht von Xingluo mit Verzeichnislayout, Konfigurationsfluss, Renderfluss, Build-Pipeline und Erweiterungsanleitung."
tags:
  - documentation
  - architecture
category: "Documentation"
translationKey: doc-architecture
locale: de
---

Dieses Dokument beschreibt die Gesamtarchitektur von Xingluo, das Verzeichnislayout, den Konfigurationsfluss, den Renderfluss und die Build-Pipeline, um Ihnen zu helfen, die Code-Organisation und Erweiterungsmöglichkeiten zu verstehen.

## Verzeichnisstruktur

```
xingluo/
├── astro.config.ts          # Astro-Konfiguration (Integrationen, i18n, Markdown, Schriftarten, Umgebung)
├── xingluo.config.ts        # Benutzerkonfigurationseinstieg
├── tsconfig.json            # TypeScript-Konfiguration (streng + @/*-Pfad-Alias)
├── package.json             # Abhängigkeiten und Skripte
├── public/                  # Statische Assets (favicon.svg, Standard-OG-Bild usw.)
├── docs/                    # Projektdokumentation (dieses Verzeichnis)
├── references/              # Schreibgeschützte Referenzprojektquellen (keine Abhängigkeit)
└── src/
    ├── config.ts            # Standardkonfiguration zusammenführen, aufgelöste Konfiguration exportieren
    ├── content.config.ts    # Content-Collection-Schemas (Beiträge, Seiten)
    ├── env.d.ts             # Typdeklarationen für Module von Drittanbietern und Umgebungsvariablen
    ├── assets/              # Symbolkomponenten
    │   └── icons/           # astro-icon + Font Awesome (enthält socials/)
    ├── components/          # UI-Komponenten
    │   ├── ui/              # shadcn-Komponenten (Button, Card, Badge usw.)
    │   ├── post/            # Beitragsseitenkomponenten (vor/zurück, teilen usw.)
    │   ├── comments/        # Kommentarsystemkomponenten
    │   ├── mdx/             # MDX-Benutzerkomponenten (APlayer, DPlayer)
    │   ├── pageViews/       # Seitenansichten (zentralisierte Seitenrenderlogik)
    │   └── *.astro          # Root-level-Komponenten (Header, Footer, PostCard usw.)
    ├── content/             # Inhaltsdateien
    │   ├── posts/           # Blogbeiträge
    │   └── pages/           # Statische Seiten
    ├── i18n/                # Internationalisierung
    │   ├── index.ts         # Sprachladung und useTranslations
    │   ├── types.ts         # Vollständiger UIStrings-Typ
    │   ├── routing.ts       # Locale-Pfadauflösung
    │   ├── staticPaths.ts   # getStaticPaths für nicht standardmäßige Locales
    │   ├── format.ts        # Vorlagenzeichenfolgenersetzung
    │   └── lang/            # Sprachressourcendateien (zh-cn.ts, en.ts)
    ├── layouts/             # Layouts
    │   ├── Layout.astro     # Basis-Skeleton (head, SEO, FOUC)
    │   └── PostLayout.astro # Beitragslayout (JSON-LD, Artikel-Meta)
    ├── lib/                 # Grundlegende Dienstprogramme
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # dayjs-Instanz und Zeitzonen-Plugin
    │   └── socialIcons.ts   # Dynamische Auflösung sozialer Symbole
    ├── pages/               # Routen (Root + [locale]/Spiegel)
    ├── scripts/             # Clientseitige Skripte
    │   ├── theme.ts         # Theme-Umschalter
    │   ├── postEnhancements.ts # Beitragserweiterungen (Anker, Kopieren, Lightbox, Fortschritt)
    │   ├── comments.ts      # Kommentar-Lazy-Loading und Theme-Synchronisation
    │   └── players.ts       # Player-Lazy-Loading
    ├── styles/              # Stile
    │   ├── global.css       # Tailwind-Einstieg + Basis-Layer + benutzerdefinierte Dienstprogramme
    │   ├── theme.css        # shadcn-Theme-Variablen (OKLCH)
    │   └── typography.css   # .app-prose Typografie und Code-Block-Stile
    ├── types/               # Typdeklarationen
    │   ├── config.ts        # Konfigurationstypen
    │   └── *.d.ts           # Deklarationen für nicht typisierte Drittanbietermodule
    └── utils/               # Dienstprogrammfunktionen
        ├── getPostPaths.ts  # Beitrags-Slug und URL-Ableitung
        ├── getSortedPosts.ts# Beitragssortierung
        ├── postFilter.ts    # Entwurfs- und zeitgesteuerte Beitragsfilterung
        ├── getUniqueTags.ts # Tag-Deduplizierung
        ├── remarkPlayers.ts # Player-remark-Plugin
        ├── rehypeWrapTable.ts# Tabellen-Scroll-Wrapper
        └── ...              # Andere Dienstprogramme
```

## Konfigurationsablauf

```
xingluo.config.ts
   │ defineXingluoConfig (Typeinschränkungen, Durchleitung)
   ▼
src/config.ts
   │ resolveConfig (Standards zusammenführen + Kommentare auflösen + Player auflösen)
   ▼
src/types/config.ts
   │ XingluoConfig (vollständiger Typ)
   ▼
Seitenweit referenziert über import config from "@/config"
```

Wichtige Punkte:

- `xingluo.config.ts` ist die einzige Konfigurationsdatei, die Benutzer bearbeiten müssen
- `resolveConfig` in `src/config.ts` führt flache Zusammenführungen (`site`/`posts`) und tiefe Zusammenführungen (`features.editPost`, `features.comments`, `features.players`) durch
- `astro.config.ts` liest das unaufgelöste `./xingluo.config` (da die Integrationsladung auf der Astro-Konfigurationsebene entschieden wird), daher greift es auf `features` mit optionaler Verkettung zu
- `src/content.config.ts` liest das aufgelöste `@/config`, daher ist `features` erforderlich

## Render-Ablauf

### Seitenrendering

Xingluo verwendet ein "dünner Wrapper + View-Komponente"-Muster, das die Rendering-Logik in `src/components/pageViews/` zentralisiert:

```
src/pages/posts/[...slug]/index.astro   ← dünner Wrapper: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← Rendering-Logik
    │
    ▼
src/layouts/PostLayout.astro  ← Beitragslayout (JSON-LD, Artikel-Meta)
    │
    ▼
src/layouts/Layout.astro      ← Basis-Skeleton (head, SEO, FOUC, ClientRouter)
```

Die dünne Wrapper-Seite behandelt nur `getStaticPaths` und die Übergabe von Props; die View-Komponente enthält die gesamte Rendering-Logik. Die `[locale]/`-Spiegel-Seiten sind ebenfalls dünne Wrapper und generieren nur nicht-standard-Sprachen über `getLocaleParams()`.

### Routing

```
src/pages/
├── 404.astro                      # 404 (not mirrored)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # Site-level OG image endpoint
├── rss.xml.ts                     # RSS endpoint
├── robots.txt.ts                  # robots.txt endpoint
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # Post-level OG image endpoint
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Non-default locale mirror (getStaticPaths=getLocaleParams)
    └── (structure mirrors the root, except 404, og.png, rss, robots)
```

### Beitrags-URL-Ableitung

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: leitet den Routing-Slug aus der Content-Collection-`id` und dem Dateipfad ab, filtert Verzeichnisse mit `_`-Präfix
- `getPostUrl(id, filePath, locale)`: generiert eine navigierbare URL mit dem Sprachpräfix (Standardsprache hat kein Präfix)

### Beitragsfilterung und -sortierung

- [`postFilter.ts`](../src/utils/postFilter.ts): schließt Entwürfe aus; filtert zukünftige Beiträge in der Produktion mit `pubDatetime - scheduledPostMargin`; dev zeigt alle
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): sortiert nach Filterung absteigend nach `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): dedupliziert und sortiert Tags nach Slug

## Clientseitige Skripte

Die clientseitigen Interaktionen von Xingluo werden über `<script>`-Tags am unteren Rand der Seiten geladen, alle für View Transitions angepasst:

| Skript                | Ladeort                                              | Ereignisanpassung                                                                                       | Verantwortlichkeiten                                               |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `theme.ts`            | Ende von `Layout.astro` body                         | Neubindung bei `astro:after-swap`, theme-color bei `astro:before-swap`, `prefers-color-scheme`-Änderung | Theme-Persistenz und -Umschaltung                                  |
| `postEnhancements.ts` | `PostDetailView.astro`                               | Reinit bei `astro:page-load`                                                                            | Überschriften-Anker, Code-Kopieren, Lesefortschritt, Bild-Lightbox |
| `comments.ts`         | `Comments.astro`                                     | Neuprüfung bei `astro:page-load`                                                                        | Kommentar-Lazy-Loading und Theme-Synchronisation                   |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (bedingt) | Neuprüfung bei `astro:page-load`                                                                        | Player-Lazy-Loading                                                |

> Hinweis: `comments.ts` und `players.ts` haben keine Importe/Exporte auf oberster Ebene; fügen Sie `export {}` am Ende der Datei hinzu, um sie als Module zu kennzeichnen und Konflikte mit globalen Deklarationen zu vermeiden.

## Build-Pipeline

`pnpm run build` = `astro check && astro build && node scripts/generateSearchIndex.mjs`

1. **`astro check`**: TypeScript- und Astro-Vorlagen-Typüberprüfung
2. **`astro build`**:
   - Inhaltssammlungen sammeln (inkl. `.mdx` basierend auf `features.mdx`)
   - Statische Generierung aller Seiten (inkl. `[locale]/`-Spiegel)
   - Endpunkte generieren: RSS, Sitemap, robots.txt, site- und beitragsbezogene OG-Bilder
   - Bedingtes Laden der `mdx()`-Integration; bedingtes Injizieren von `remarkPlayers`
   - Inline-SVG-Symbole zur Build-Zeit (astro-icon, kein Runtime-JS)
   - Dynamisch importierte Kommentar- und Player-Module werden in eigenständige Chunks aufgeteilt (lazy-loaded)
3. **`node scripts/generateSearchIndex.mjs`**: durchsucht HTML-Dateien in `dist/`, analysiert Seiteninhalte, generiert sprachspezifische Suchindizes in `dist/search/`

## Leistungsstrategien

- **Zero-Runtime-JS-Symbole**: astro-icon bindet Font-Awesome-SVGs zur Build-Zeit ein (Sprite-`<symbol>`-Modus)
- **SVG-Optimierung**: `experimental.svgOptimizer` (svgo) komprimiert eingebettete und referenzierte SVGs
- **On-Demand-Lazy-Loading**: Kommentare und Player werden dynamisch über IntersectionObserver importiert, wenn sie in den Viewport scrollen; kein Bundle bei Deaktivierung
- **Bedingte Integrationen**: bei deaktiviertem MDX wird die `mdx()`-Integration nicht geladen; bei deaktivierten Playern wird das remark-Plugin nicht injiziert
- **CSS-Größe**: Tailwind v4 generiert bei Bedarf; OKLCH-Variablen werden zentral verwaltet
- **OG-Bild-Schriftarten**: nur von satori verwendet, nicht in Site-CSS eingebunden
- **View Transitions**: `<ClientRouter/>` steuert Seitenübergangsanimationen; das Suchfeld verwendet `transition:persist`, um den Zustand zu erhalten

## Erweiterungsanleitung

### Seite hinzufügen

1. Erstellen Sie eine `.astro`-Datei in `src/pages/` (dünner Wrapper)
2. Erstellen Sie die entsprechende View-Komponente in `src/components/pageViews/`
3. Für mehrsprachige Unterstützung erstellen Sie einen gleichnamigen Spiegel-Wrapper in `src/pages/[locale]/`

### UI-Komponente hinzufügen

Folgen Sie dem shadcn-Stil: Erstellen Sie `.astro`-Komponenten und `.ts`-Variantenkonfigurationen unter `src/components/ui/` (mit `class-variance-authority`).

### Clientseitiges Skript hinzufügen

Erstellen Sie eine `.ts`-Datei in `src/scripts/`, fügen Sie `export {}` am Ende hinzu, um sie als Modul zu kennzeichnen, lauschen Sie auf `astro:page-load` zur Anpassung an View Transitions, und importieren Sie sie in einem `<script>`-Tag auf der entsprechenden Seite.

### Neues remark/rehype-Plugin hinzufügen

Erstellen Sie die Plugin-Datei in `src/utils/` und injizieren Sie sie nach Bedarf in `markdown.remarkPlugins` oder `rehypePlugins` in `astro.config.ts`.
