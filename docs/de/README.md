# Xingluo Dokumentation

Xingluo ist ein modernes Blog-CMS, das mit [Astro](https://astro.build/) und dem [shadcn/ui](https://ui.shadcn.com/)-Visualstil erstellt wurde. Es bietet ein moderneres visuelles Erlebnis durch flache, elegante shadcn-Komponenten und das OKLCH-Farbsystem und integriert nativ ein Kommentarsystem, optionale MDX-Unterstützung sowie Audio-/Videoplayer.

## Dokumentationsindex

| Dokument                                      | Inhalt                                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Erste Schritte](./getting-started.md)        | Anforderungen, Installation, lokale Entwicklung, Build und Vorschau                  |
| [Konfigurationsleitfaden](./configuration.md) | Vollständige Referenz für `xingluo.config.ts`                                        |
| [Inhaltserstellung](./content.md)             | Beitrags-Frontmatter, Markdown/MDX-Syntax, Codeblöcke, Callouts, Erweiterungen       |
| [Internationalisierung](./i18n.md)            | Mehrsprachiges Routing, UI-Strings, Übersetzung auf Inhaltsebene, Sprache hinzufügen |
| [Architekturübersicht](./architecture.md)     | Verzeichnislayout, Konfigurationsfluss, Renderfluss, Build-Pipeline                  |
| [Theme und Stile](./theming.md)               | shadcn-Theme-Variablen, OKLCH, Tailwind v4, Dunkelmodus                              |
| [Kommentarsystem](./comments.md)              | Auswahl und Einrichtung von giscus / twikoo / waline                                 |
| [Medienplayer](./media-players.md)            | Verwendung von APlayer / DPlayer in Markdown und MDX                                 |
| [SEO](./seo.md)                               | OG-Bilder, RSS, Sitemap, hreflang, canonical, strukturierte Daten                    |
| [Suche](./search.md)                          | Pagefind-Volltextsuche-Integration                                                   |
| [Bereitstellung](./deployment.md)             | Statisches Hosting, GitHub Pages, Umgebungsvariablen, Docker                         |

## Kernfunktionen

- **Leistung der Spitzenklasse**: Astro statische Generierung, zur Build-Zeit eingebettete SVG-Symbole (kein JS zur Laufzeit), verzögertes Laden von Kommentaren und Playern, Bereinigung verwaister Assets
- **Moderne Optik**: shadcn/ui new-york-Komponenten, OKLCH-Farbraum, flüssiger Dunkelmodus (FOUC-Schutz)
- **Mehrsprachig**: UI- und Inhaltsebene-Übersetzung, `prefixDefaultLocale: false`-Routing, hreflang- und x-default-SEO-Deklarationen
- **Inhaltserweiterungen**: optionales MDX, Shiki Dual-Theme-Code-Hervorhebung, Callouts, einklappbares Inhaltsverzeichnis, scrollbare Tabellen
- **Lesezeit**: intelligente Schätzung (CJK nach Zeichenanzahl, Lateinisch nach Wortanzahl), auf Karten und Detailseiten angezeigt
- **Verwandte Beiträge**: automatisch durch gemeinsame Tags empfohlen
- **Beitragskategorien**: über Frontmatter zuweisen, mit eigenen Kategorieseiten und Navigationseintrag
- **Sticky-TOC-Seitenleiste**: rechts fixiertes Inhaltsverzeichnis auf großen Bildschirmen, IntersectionObserver-Scroll-Überwachung
- **Kommentarsystem**: giscus / twikoo / waline, themenbewusst, verzögert geladen
- **Medienplayer**: APlayer-Audio und DPlayer-Video, mit MD-Fence- und MDX-Komponenten-Einstiegspunkten
- **Suche**: Pagefind-Volltextsuche, sprachspezifische Indizes, View Transitions-Zustandsspeicherung
- **Vollständiges SEO**: dynamische OG-Bilder (satori + sharp), RSS, Sitemap, JSON-LD-Strukturdaten (BlogPosting + BreadcrumbList), canonical-Normalisierung

## Technologie-Stack

| Kategorie         | Technologie                                                     |
| ----------------- | --------------------------------------------------------------- |
| Framework         | Astro 6.x                                                       |
| Styling           | Tailwind CSS v4, shadcn/ui-Komponenten, @tailwindcss/typography |
| Symbole           | astro-icon + Font Awesome                                       |
| Inhalt            | Astro Content Collections, MDX, remark/rehype-Plugin-Kette      |
| Code-Hervorhebung | Shiki                                                           |
| Suche             | Pagefind                                                        |
| OG-Bilder         | satori + sharp                                                  |
| Kommentare        | giscus / twikoo / waline                                        |
| Player            | APlayer / DPlayer                                               |
| Datum             | dayjs                                                           |
| Paketmanager      | pnpm                                                            |
| Sprache           | TypeScript                                                      |

## Lizenz

AGPL-3.0
