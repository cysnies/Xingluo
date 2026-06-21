# Suche

Xingluo integriert [Flexsearch](https://github.com/nextapps-de/flexsearch) für die clientseitige Volltextsuche, mit sprachspezifischen Indizes und View Transitions-Zustandspersistenz.

## Aktivierung

Konfigurieren Sie über `features.search`:

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

Wenn auf `false` gesetzt, führt die Suchseite einen `Astro.rewrite` auf 404 durch und es wird keine Suchoberfläche generiert.

## So funktioniert's

### Index-Generierung

Der dritte Build-Schritt, `node scripts/generateSearchIndex.mjs`, scannt HTML-Dateien im `dist/`-Verzeichnis:

- Analysiert Seiteninhalte und extrahiert Beitragstexte
- Indizes werden automatisch nach Sprache aufgeteilt (`zh-cn` und `en` erhalten jeweils eigene)
- Indizes werden nach `dist/search/` ausgegeben

### Index-Umfang

Das Build-Skript analysiert den `<main>`-Inhalt auf Beitragsdetailseiten, sodass nur Beitragstexte indexiert werden. Andere Seiten (Startseite, Listen, Archive usw.) gelangen nicht in den Suchindex.

## Suchoberfläche

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementiert die Suchseite:

- Verwendet Flexsearch-Client-Index für die Suchübereinstimmung im Browser
- Findet Index-Assets über `getAssetPath("search/")`
- Verwendet shadcn-Theme-Variablen (`--background`, `--foreground`, `--primary`, usw.) für Suchfeld- und Ergebnislisten-Styling
- `transition:persist` bewahrt den Suchzustand bei Navigation

### Suchablauf

1. Der Benutzer gibt Text in das Suchfeld ein
2. Flexsearch sucht im Index der aktuellen Sprache
3. Die Ergebnisliste zeigt passende Beiträge (Titel, Zusammenfassungs-Highlight)
4. `processTerm` schreibt die Suchseiten-URL mit Query-Parametern in sessionStorage, damit der Zurück-Button den Zustand wiederherstellen kann

## Quell-Rückwärtsnavigation

Der Rückwärtsnavigation-Mechanismus zwischen der Suchseite und Beitragsseiten:

- Die `Main.astro`-Komponente schreibt die Quellseiten-URL in sessionStorage's `backUrl`
- Der `BackButton.astro` der Beitragsseite springt bevorzugt zu `backUrl` in sessionStorage zurück, oder zur Startseite, wenn nicht vorhanden
- Der `processTerm` der Suchseite schreibt die URL mit Query-Parametern und stellt so den Suchzustand bei der Rückkehr von einem Beitrag wieder her

## Mehrsprachige Suche

Flexsearch teilt Indizes nach Seitensprache auf:

- `zh-cn`-Seiten (Root) → Chinesischer Index
- `en`-Seiten (`/en/`-Präfix) → Englischer Index

Die Suchfunktion verwendet automatisch den Index der aktuellen Seitensprache: Chinesisch auf chinesischen Seiten, Englisch auf englischen Seiten.

## Theme-Anpassung

Flexsearch-Such-UI verwendet shadcn-Theme-Variablen, definiert in `SearchView.astro` für Suchfeld- und Ergebnislisten-Styling:

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

Der dunkle Modus wechselt automatisch über den `.dark`-Selektor, konsistent mit dem Site-Theme.

## Leistung

- Flexsearch-Indizes sind statische Dateien; die Suche erfolgt clientseitig ohne Serveranfragen
- Indizes werden bei Bedarf geladen (Indexfragmente werden nur bei der Suche heruntergeladen)
- `transition:persist` vermeidet die erneute Initialisierung der Suchoberfläche bei Navigation
