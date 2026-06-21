---
title: "Inhaltserstellung"
pubDatetime: 2026-06-20T05:00:00+08:00
description: "Leitfaden zur Inhaltserstellung für Xingluo mit Beitrags-Frontmatter, Markdown/MDX-Syntax, Code-Hervorhebung, Callouts und Inhaltserweiterungen."
tags:
  - documentation
  - writing
category: "Documentation"
translationKey: doc-content
locale: de
---

Xingluo verwendet Astro Content Collections zur Verwaltung von Inhalten und unterstützt Markdown (`.md`) und MDX (`.mdx`, erfordert `features.mdx`).

## Content Collections

Zwei Sammlungen sind in [`src/content.config.ts`](../src/content.config.ts) definiert:

| Sammlung | Verzeichnis          | Zweck                                   |
| -------- | -------------------- | --------------------------------------- |
| `posts`  | `src/content/posts/` | Blogbeiträge                            |
| `pages`  | `src/content/pages/` | Statische Seiten (z. B. die Über-Seite) |

Dateibenennungskonventionen:

- Dateien oder Verzeichnisse, die mit `_` beginnen, werden ignoriert (praktisch für Entwürfe)
- Mit aktiviertem MDX wird `**/*.{md,mdx}` gesammelt, andernfalls nur `**/*.md`
- Beitrags-URLs werden aus dem Dateipfad abgeleitet (siehe Routing-Abschnitt in [Architekturübersicht](./doc-architecture.md))

## Beitrags-Frontmatter

Vollständige Felder für die `posts`-Sammlung:

```markdown
---
title: "Beitragstitel" # erforderlich
pubDatetime: 2026-06-19T10:00:00+08:00 # erforderlich, Veröffentlichungszeit
modDatetime: 2026-06-20T10:00:00+08:00 # optional, Aktualisierungszeit
description: "Zusammenfassung, für SEO und Listen verwendet" # erforderlich
tags: ["Astro", "blog"] # optional, Standard ["others"]
featured: true # optional, hervorgehoben (auf Startseite)
draft: false # optional, Entwürfe werden nicht veröffentlicht
author: "Xingluo" # optional, Standard site.author
ogImage: "./cover.png" # optional, OG-Bild (Bildimport oder Zeichenfolgenpfad)
canonicalURL: "https://..." # optional, kanonischer Link
hideEditPost: false # optional, Bearbeitungslink ausblenden
timezone: "Asia/Shanghai" # optional, Zeitzone der Site überschreiben
---
```

### Feldreferenz

| Feld             | Typ             | Standard        | Hinweise                                                                                                     |
| ---------------- | --------------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| `title`          | string          | erforderlich    | Beitragstitel                                                                                                |
| `pubDatetime`    | date            | erforderlich    | Veröffentlichungszeit, ISO 8601                                                                              |
| `modDatetime`    | date            | —               | Aktualisierungszeit; wird zusammen mit der Veröffentlichungszeit angezeigt                                   |
| `description`    | string          | erforderlich    | Zusammenfassung, verwendet in Meta, RSS und Listenkarten                                                     |
| `tags`           | string[]        | `["others"]`    | Tag-Array; Tag-Seiten werden automatisch generiert                                                           |
| `featured`       | boolean         | —               | Auf der Startseite im Bereich "Hervorgehoben" angezeigt                                                      |
| `draft`          | boolean         | —               | Entwurf; in Produktions-Builds herausgefiltert (in Entwicklung sichtbar)                                     |
| `author`         | string          | `site.author`   | Autorenname                                                                                                  |
| `ogImage`        | image \| string | —               | OG-Bild; `image()` durchläuft Astros Asset-Pipeline, ein String ist ein `public/`-Pfad oder eine externe URL |
| `canonicalURL`   | string          | —               | Kanonischer Link, überschreibt den Standard (siehe [SEO](./doc-seo.md))                                      |
| `hideEditPost`   | boolean         | —               | Bearbeitungslink für diesen Beitrag ausblenden                                                               |
| `timezone`       | string          | `site.timezone` | Anzeigezeitzone für diesen Beitrag überschreiben                                                             |
| `locale`         | string          | `site.lang`     | Sprache, in der der Beitrag verfasst ist, z. B. `"en"`, `"ja"`. Standardmäßig Site-Sprache                   |
| `translationKey` | string          | —               | Übersetzungsgruppenschlüssel: Beiträge mit demselben Schlüssel sind Übersetzungen voneinander                |
| `category`       | string          | —               | Beitragskategorie (Einzelwert), generiert eine `/categories/<slug>/`-Seite                                   |

### Inhaltsbezogene Übersetzung

Verwenden Sie die Frontmatter-Felder `locale` und `translationKey`, um mehrsprachige Versionen Ihrer Beiträge zu erstellen:

1. Platzieren Sie den beitrag in der Standardsprache unter `src/content/posts/<slug>.md`
2. Platzieren Sie Übersetzungen in Sprachunterverzeichnissen: `src/content/posts/<locale>/<slug>.md` (z. B. `en/welcome.md`)
3. Setzen Sie `locale` auf die Sprache der Übersetzung und `translationKey` auf denselben Wert wie das Original

Die Routing-Ebene löst automatisch die korrekte Übersetzung pro Sprache auf und dedupliziert in Listen — derselbe Beitrag in verschiedenen Sprachen zeigt nur eine Karte pro Sprache. Beiträge ohne Übersetzung fallen auf den Originalinhalt zurück.

### Zeitgesteuerte Veröffentlichung

Beiträge mit zukünftigen Zeitstempeln werden in der Produktion mit der `scheduledPostMargin`-Toleranz gefiltert: Wenn `pubDatetime` innerhalb des Toleranzfensters (Standard 15 Minuten) der aktuellen Zeit liegt, wird der Beitrag als veröffentlicht behandelt. In der Entwicklung sind alle Nicht-Entwurf-Beiträge sichtbar.

## Frontmatter für statische Seiten

Die `pages`-Sammlung hat einfachere Felder:

```markdown
---
title: "Über"
description: "Über diese Seite" # optional
ogImage: "default-og.jpg" # optional, nur Zeichenfolge
canonicalURL: "https://..." # optional
---
```

Die Über-Seite wird über `getEntry("pages", "about")` abgerufen und erfordert die Erstellung von `src/content/pages/about.md`.

## Markdown-Erweiterungen

Xingluo wird mit den folgenden remark / rehype-Plugins ausgeliefert (siehe `astro.config.ts`):

### Inhaltsverzeichnis

`remark-toc` generiert das Inhaltsverzeichnis automatisch; `remark-collapse` klappt es standardmäßig zusammen. Fügen Sie den Platzhalter in einen Beitrag ein:

```markdown
## Inhaltsverzeichnis

(The TOC is auto-filled here)
```

### Callouts

`rehype-callouts` unterstützt Obsidian-artige Callouts:

```markdown
> [!NOTE]
> Notizinhalt

> [!WARNING]
> Warninhalt

> [!TIP]
> Tippinhalt
```

Unterstützte Typen: `NOTE`, `TIP`, `INFO`, `WARNING`, `DANGER`, `SUCCESS`, `QUESTION`, `FAILURE` und mehr.

### Code-Hervorhebung

Shiki Dual-Theme (hell `min-light`, dunkel `night-owl`) unterstützt:

- Zeilenhervorhebung: ` ```js {1,3-5} `
- Worthervorhebung: ` ```js /word/ `
- Diff-Markierungen: `+` / `-` am Zeilenanfang
- Dateinamen-Labels: ` ```js file=src/index.ts ` oder `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // hervorgehobene Zeile
}
```

### Tabellen

Breite Tabellen werden automatisch in einen horizontal scrollbaren Container eingeschlossen (das `rehypeWrapTable`-Plugin), um Überlauf auf schmalen Bildschirmen zu verhindern.

## MDX-Unterstützung

Mit aktiviertem `features.mdx` (Standard) können Sie `.mdx`-Dateien für komponentengesteuertes Schreiben verwenden.

### Benutzerdefinierte Komponenten

Die integrierten MDX-Komponenten von Xingluo befinden sich in [`src/components/mdx/`](../src/components/mdx) und werden aus einem einheitlichen Einstieg importiert:

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# Mein Beitrag

<APlayer
  audio={[
    {
      name: "Titel",
      artist: "Künstler",
      url: "/audio.mp3",
      cover: "/cover.jpg",
    },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

Details finden Sie unter [Medienplayer](./doc-media-players.md).

### MDX deaktivieren

Mit `features.mdx: false`:

- Die `mdx()`-Integration wird nicht geladen
- Der Content-Collection-Glob stimmt nur mit `*.md` überein (vorhandene `.mdx`-Dateien werden nicht gesammelt)
- Die Build-Ausgabe enthält keine MDX-Laufzeit

## Kommentare

Das Kommentarsystem wird automatisch am unteren Rand der Beitragsdetailseiten gerendert (konfigurieren Sie den Anbieter in `features.comments`). Siehe [Kommentarsystem](./doc-comments.md).

## Lesezeit

Die geschätzte Lesezeit wird automatisch auf Beitragsdetailseiten und Listenkarten angezeigt:

- **CJK-Sprachen** (zh-cn, ja, ko): berechnet nach CJK-Zeichenanzahl, ~400 Zeichen pro Minute
- **Andere Sprachen**: berechnet nach Wortanzahl (durch Leerzeichen getrennt), ~200 Wörter pro Minute
- Ergebnis aufgerundet, mindestens 1 Minute

Vor dem Zählen werden Codeblöcke, HTML-Tags, Markdown-Link-URLs und andere Nicht-Textinhalte entfernt, um die Schätzung nahe am tatsächlichen Lesevolumen zu halten. Keine Konfiguration erforderlich.

## Verwandte Beiträge

Bis zu 2 verwandte Beiträge werden am unteren Rand der Beitragsdetailseiten (nach der vorherigen/nächsten Navigation) angezeigt:

- Sortiert nach Anzahl gemeinsamer Tags, absteigend
- Gleiche Punktzahl sortiert nach Veröffentlichungsdatum, absteigend (neuere Beiträge bevorzugt)
- Abschnitt wird nicht gerendert, wenn keine Beiträge Tags teilen
- Automatisch vom Flexsearch-Suchindex ignoriert

Keine Konfiguration erforderlich.

## Sticky-TOC-Seitenleiste

Eine fixierte Inhaltsverzeichnis-Seitenleiste erscheint auf der rechten Seite von Beitragsdetailseiten auf großen Bildschirmen (≥1024px):

- Automatisch aus h2–h6-Überschriften des Artikels generiert, als flache eingerückte Liste dargestellt
- Einzug spiegelt die Überschriftentiefe wider (h3 hat eine Einzugsebene mehr als h2)
- Aktueller Abschnitt wird beim Scrollen hervorgehoben (IntersectionObserver)
- Klicken auf einen TOC-Eintrag scrollt sanft zur entsprechenden Überschrift
- Auf kleinen Bildschirmen (mobil) ausgeblendet, wo das einklappbare Inline-TOC verfügbar ist

Generiert aus den `headings`, die von Astros `render()` zurückgegeben werden — keine manuelle TOC-Wartung durch den Autor. Das einklappbare Inline-`remark-toc` (schreiben Sie `## Table of contents` in Ihren Beitrag) koexistiert mit der Seitenleiste für die Nutzung auf kleinen Bildschirmen.

## Kategorien

Weisen Sie einem Beitrag über das Frontmatter-Feld `category` (ein einzelner String) eine Kategorie zu:

```yaml
---
title: "Mein Beitrag"
category: "tutorial"
---
```

- Die Kategorieseite befindet sich unter `/categories/<slug>/`; der Slug wird über `slugifyStr` normalisiert (CJK erhalten, Lateinisch kleingeschrieben mit Bindestrichen)
- Der Kategorieindex unter `/categories/` listet alle Kategorien auf
- Beitragskarten und Detailseiten zeigen automatisch einen Kategorielink an (Klicken springt zur Kategorieseite)
- Ein Beitrag gehört zu höchstens einer Kategorie (im Gegensatz zu mehreren `tags`); Beiträge ohne `category` erscheinen in keiner Kategorie
- Kategorieseiten verwenden `posts.perPage` für die Paginierung und unterstützen mehrsprachige Mirror-Routen (`/en/categories/...`)
- Deaktivieren Sie Kategorien über `features.showCategories: false` (Navigationspunkt und Seiten entfernt, Sitemap gefiltert)
