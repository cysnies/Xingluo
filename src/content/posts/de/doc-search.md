---
title: "Suche"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Suchleitfaden für Xingluo mit Flexsearch-Volltextsuche-Integration, Indexgenerierung, UI, mehrsprachiger Suche und Leistung."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: de
---

Xingluo integriert [Flexsearch](https://github.com/nextapps-de/flexsearch) für die clientseitige Volltextsuche, mit sprachspezifischen Indizes und View Transitions-Zustandspersistenz.

## Aktivierung

Konfigurieren über `features.search`:

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

Bei `false` führt die Suchseite ein `Astro.rewrite` auf 404 durch und es wird keine Such-Benutzeroberfläche generiert.

## Funktionsweise

### Indexgenerierung

Der dritte Build-Schritt, `node scripts/generateSearchIndex.mjs`, durchsucht HTML-Dateien im `dist/`-Verzeichnis:

- Analysiert Seiteninhalte und extrahiert Beitragstexte
- Indizes werden automatisch nach Sprache aufgeteilt (`zh-cn` und `en` erhalten jeweils eigene)
- Indizes werden nach `dist/search/` ausgegeben

### Indexumfang

Das Build-Skript analysiert den `<main>`-Inhalt auf Beitragsdetailseiten, sodass nur Beitragstexte indiziert werden. Andere Seiten (Startseite, Listen, Archive usw.) gelangen nicht in den Suchindex.

## Such-Benutzeroberfläche

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementiert die Suchseite:

- Verwendet Flexsearch-Client-Index für die Suchübereinstimmung im Browser
- Findet Index-Assets über `getAssetPath("search/")`
- Verwendet shadcn-Designvariablen (`--background`, `--foreground`, `--primary`, usw.) für Suchfeld- und Ergebnislisten-Styling
- `transition:persist` bewahrt den Suchzustand bei Navigation

### Suchablauf

1. Der Benutzer gibt Text in das Suchfeld ein
2. Flexsearch sucht im Index der aktuellen Sprache
3. Die Ergebnisliste zeigt passende Beiträge (Titel, Veröffentlichungs-/Aktualisierungsdatum, Kategorie-Badge, Tags, passender Textausschnitt)
4. `processTerm` schreibt die Suchseiten-URL mit Abfrageparametern in sessionStorage, damit der Zurück-Button sie wiederherstellen kann

## Quell-Rücknavigation

Der Rückmechanismus zwischen der Suchseite und Beitragsseiten:

- Die `Main.astro`-Komponente schreibt die Quellseiten-URL in sessionStorage's `backUrl`
- Der `BackButton.astro` der Beitragsseite springt bevorzugt zu sessionStorage's `backUrl` zurück, oder zur Startseite, wenn nicht vorhanden
- Der `processTerm` der Suchseite schreibt die URL mit Abfrageparametern und stellt den Suchzustand bei Rückkehr von einem Beitrag wieder her

## Mehrsprachige Suche

Flexsearch teilt Indizes nach Seitensprache auf:

- `zh-cn`-Seiten (Root) → Chinesischer Index
- `en`-Seiten (`/en/`-Präfix) → Englischer Index

Die Suche verwendet automatisch den Index der aktuellen Seitensprache.

## Designanpassung

Flexsearch-Such-UI verwendet shadcn-Designvariablen, definiert in `SearchView.astro` für Suchfeld- und Ergebnislisten-Styling:

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

Der Dunkelmodus wechselt automatisch über den `.dark`-Selektor, konsistent mit dem Seitendesign.

## Leistung

- Flexsearch-Indizes sind statische Dateien; die Suche erfolgt clientseitig ohne Serveranfragen
- Indizes werden bei Bedarf geladen (Indexfragmente werden nur beim Suchen heruntergeladen)
- `transition:persist` vermeidet eine erneute Initialisierung der Such-UI bei Navigation
