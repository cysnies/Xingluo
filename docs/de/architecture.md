# Architekturübersicht

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
- `astro.config.ts` liest das unaufgelöste `./xingluo.config` (da die Laden von Integrationen auf der Astro-Konfigurationsebene entschieden wird), greift also auf `features` mit optionalem Verkettung zu
- `src/content.config.ts` liest das aufgelöste `@/config`, daher ist `features` erforderlich

## Render-Ablauf

### Seiten-Rendering

Xingluo verwendet ein „dünnes Seiten-Wrapper + View-Komponente"-Muster und zentralisiert die Renderlogik in `src/components/pageViews/`:

```
src/pages/posts/[...slug]/index.astro   ← thin wrapper: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← render logic
    │
    ▼
src/layouts/PostLayout.astro  ← post layout (JSON-LD, article meta)
    │
    ▼
src/layouts/Layout.astro      ← base skeleton (head, SEO, FOUC, ClientRouter)
```

Die dünne Wrapper-Seite behandelt nur `getStaticPaths` und die Übergabe von Props; die View-Komponente enthält die gesamte Renderlogik. Die `[locale]/`-Spiegelseiten sind ebenfalls dünne Wrapper, die nur nicht standardmäßige Locales über `getLocaleParams()` generieren.

### Routing

```
src/pages/
├── 404.astro                      # 404 (nicht gespiegelt)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # OG-Bild-Endpunkt auf Site-Ebene
├── rss.xml.ts                     # RSS-Endpunkt
├── robots.txt.ts                  # robots.txt-Endpunkt
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # OG-Bild-Endpunkt auf Beitragsebene
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Spiegel nicht standardmäßiger Locales (getStaticPaths=getLocaleParams)
    └── (Struktur spiegelt das Root, außer 404, og.png, rss, robots)
```

### Post-URL-Ableitung

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: leitet den Routing-Slug aus der Content-Collection-`id` und dem Dateipfad ab und filtert `_`-präfigierte Verzeichnisse
- `getPostUrl(id, filePath, locale)`: generiert eine navigierbare URL mit dem Locale-Präfix (Standard-Locale hat kein Präfix)

### Beitragsfilterung und -sortierung

- [`postFilter.ts`](../src/utils/postFilter.ts): schließt Entwürfe aus; filtert zukünftige Beiträge in der Produktion mit `pubDatetime - scheduledPostMargin`; Entwicklung zeigt alle
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): sortiert nach der Filterung absteigend nach `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): dedupliziert und sortiert Tags nach Slug

## Clientseitige Skripte

Die clientseitigen Interaktionen von Xingluo werden über `<script>`-Tags am Ende der Seiten geladen, alle für View Transitions angepasst:

| Skript                | Ladeort                                              | Ereignisanpassung                                                                                       | Verantwortlichkeiten                                              |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `theme.ts`            | Ende des `Layout.astro`-Body                         | Neubindung bei `astro:after-swap`, theme-color bei `astro:before-swap`, `prefers-color-scheme`-Änderung | Theme-Persistenz und -Umschaltung                                 |
| `postEnhancements.ts` | `PostDetailView.astro`                               | Neuinitialisierung bei `astro:page-load`                                                                | Überschriftenanker, Code-Kopieren, Lesefortschritt, Bild-Lightbox |
| `comments.ts`         | `Comments.astro`                                     | Erneutes Scannen bei `astro:page-load`                                                                  | Kommentar-Lazy-Loading und Theme-Synchronisation                  |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (bedingt) | Erneutes Scannen bei `astro:page-load`                                                                  | Player-Lazy-Loading                                               |

> Hinweis: `comments.ts` und `players.ts` haben keinen Import/Export auf oberster Ebene; fügen Sie `export {}` am Ende der Datei hinzu, um sie als Module zu kennzeichnen und globale Deklarationskonflikte mit anderen Dateien zu vermeiden.

## Build-Pipeline

`pnpm run build` = `astro check && astro build && pagefind --site dist`

1. **`astro check`**: TypeScript + Astro-Vorlagen-Typüberprüfung
2. **`astro build`**:
   - Content Collections sammeln (`.mdx` basierend auf `features.mdx` einschließen)
   - Alle Seiten statisch generieren (einschließlich `[locale]/`-Spiegel)
   - Endpunkte generieren: RSS, Sitemap, robots.txt, OG-Bilder auf Site- und Beitragsebene
   - Bedingtes Laden der `mdx()`-Integration; bedingtes Injizieren von `remarkPlayers`
   - SVG-Symbole zur Build-Zeit inline (astro-icon, null Runtime-JS)
   - Dynamisch importierte Kommentar- und Player-Module werden in eigenständige Chunks aufgeteilt (Lazy-Loading)
3. **`pagefind --site dist`**: scannt `dist/`-Inhalt, der mit `data-pagefind-body` markiert ist, und generiert sprachspezifische Suchindizes in `dist/pagefind/`

## Leistungsstrategien

- **Null Runtime-JS-Symbole**: astro-icon bindet Font Awesome SVGs zur Build-Zeit inline ein (Sprite-`<symbol>`-Modus)
- **SVG-Optimierung**: `experimental.svgOptimizer` (svgo) komprimiert inline und referenzierte SVGs
- **Bedarfsgesteuertes Lazy-Loading**: Kommentare und Player importieren dynamisch über IntersectionObserver, wenn sie in den Viewport gescrollt werden; kein Bundle, wenn deaktiviert
- **Bedingte Integrationen**: bei deaktiviertem MDX wird die `mdx()`-Integration nicht geladen; bei deaktivierten Playern wird das remark-Plugin nicht injiziert
- **CSS-Größe**: Tailwind v4 generiert bei Bedarf; OKLCH-Variablen werden zentral verwaltet
- **OG-Bild-Schriftarten**: nur von satori verwendet, nicht in das Site-CSS eingebunden
- **View Transitions**: `<ClientRouter/>` steuert Seitenübergangsanimationen; das Suchfeld verwendet `transition:persist`, um den Zustand zu erhalten

## Erweiterungsanleitung

### Hinzufügen einer Seite

1. Erstellen Sie eine `.astro`-Datei in `src/pages/` (dünner Wrapper)
2. Erstellen Sie die entsprechende View-Komponente in `src/components/pageViews/`
3. Erstellen Sie für mehrsprachige Unterstützung einen gleichnamigen dünnen Spiegel-Wrapper in `src/pages/[locale]/`

### Hinzufügen einer UI-Komponente

Folgen Sie dem shadcn-Stil: Erstellen Sie `.astro`-Komponenten und `.ts`-Variantenkonfigurationen unter `src/components/ui/` (mit `class-variance-authority`).

### Hinzufügen eines clientseitigen Skripts

Erstellen Sie eine `.ts`-Datei in `src/scripts/`, fügen Sie `export {}` am Ende hinzu, um sie als Modul zu kennzeichnen, hören Sie auf `astro:page-load`, um sich an View Transitions anzupassen, und importieren Sie sie in einem `<script>`-Tag auf der entsprechenden Seite.
