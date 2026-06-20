---
title: "Suche"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Suchleitfaden für Xingluo mit Pagefind-Volltextsuche-Integration, Indexgenerierung, UI, mehrsprachiger Suche und Leistung."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: de
---

Xingluo integriert [Pagefind](https://pagefind.app/) für die statische Volltextsuche, mit sprachspezifischen Indizes und View Transitions-Zustandspersistenz.

## Aktivierung

Konfigurieren über `features.search`:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

Bei `false` führt die Suchseite ein `Astro.rewrite` auf 404 durch und es wird keine Such-Benutzeroberfläche generiert.

## Funktionsweise

### Indexgenerierung

Der dritte Build-Schritt, `pagefind --site dist`, durchsucht das `dist/`-Verzeichnis:

- Nur Seiten mit dem `data-pagefind-body`-Attribut werden indiziert
- Indizes werden automatisch nach Sprache aufgeteilt (`zh-cn` und `en` erhalten jeweils eigene)
- Indizes werden nach `dist/pagefind/` ausgegeben

### Indexumfang

Der `<main>` auf Beitragsdetailseiten ist mit `data-pagefind-body` markiert, sodass nur Beitragstexte indiziert werden. Andere Seiten (Startseite, Listen, Archive usw.) gelangen nicht in den Suchindex.

## Such-Benutzeroberfläche

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementiert die Suchseite:

- Lädt `@pagefind/default-ui` für das Suchfeld und die Ergebnisliste
- Findet Index-Assets über `getAssetPath("pagefind/")`
- Globale Stile überschreiben Pagefind-CSS-Variablen und ordnen sie Xingluos Design zu (`--background`, `--foreground`, `--primary`, usw.)
- `transition:persist` bewahrt den Suchzustand bei Navigation

### Suchablauf

1. Der Benutzer gibt Text in das Suchfeld ein
2. Pagefind sucht im Index der aktuellen Sprache
3. Die Ergebnisliste zeigt passende Beiträge (Titel, Zusammenfassungs-Hervorhebung)
4. `processTerm` schreibt die Suchseiten-URL mit Abfrageparametern in sessionStorage, damit der Zurück-Button sie wiederherstellen kann

## Quell-Rücknavigation

Der Rückmechanismus zwischen der Suchseite und Beitragsseiten:

- Die `Main.astro`-Komponente schreibt die Quellseiten-URL in sessionStorage's `backUrl`
- Der `BackButton.astro` der Beitragsseite springt bevorzugt zu sessionStorage's `backUrl` zurück, oder zur Startseite, wenn nicht vorhanden
- Der `processTerm` der Suchseite schreibt die URL mit Abfrageparametern und stellt den Suchzustand bei Rückkehr von einem Beitrag wieder her

## Mehrsprachige Suche

Pagefind teilt Indizes nach dem Sprachattribut von `data-pagefind-body`-Elementen auf:

- `zh-cn`-Seiten (Root) → Chinesischer Index
- `en`-Seiten (`/en/`-Präfix) → Englischer Index

Die Suche verwendet automatisch den Index der aktuellen Seitensprache.

## Designanpassung

Pagefind's Standard-UI hat eigene CSS-Variablen; Xingluo überschreibt sie mit globalen Stilen in `SearchView.astro` und ordnet sie shadcn-Designvariablen zu:

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

Der Dunkelmodus wechselt automatisch über den `.dark`-Selektor, konsistent mit dem Seitendesign.

## Leistung

- Pagefind-Indizes sind statische Dateien; die Suche erfolgt clientseitig ohne Serveranfragen
- Indizes werden bei Bedarf geladen (Indexfragmente werden nur beim Suchen heruntergeladen)
- `transition:persist` vermeidet eine erneute Initialisierung der Such-UI bei Navigation
