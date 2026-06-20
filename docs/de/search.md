# Suche

Xingluo integriert [Pagefind](https://pagefind.app/) für die statische Volltextsuche, mit sprachspezifischen Indizes und View Transitions-Zustandspersistenz.

## Aktivierung

Konfigurieren Sie über `features.search`:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

Wenn auf `false` gesetzt, führt die Suchseite einen `Astro.rewrite` auf 404 durch und es wird keine Suchoberfläche generiert.

## So funktioniert's

### Index-Generierung

Der dritte Build-Schritt, `pagefind --site dist`, scannt das `dist/`-Verzeichnis:

- Nur Seiten mit dem `data-pagefind-body`-Attribut werden indexiert
- Indizes werden automatisch nach Sprache aufgeteilt (`zh-cn` und `en` erhalten jeweils eigene)
- Indizes werden nach `dist/pagefind/` ausgegeben

### Index-Umfang

Das `<main>` auf Beitragsdetailseiten ist mit `data-pagefind-body` markiert, sodass nur Beitragstexte indexiert werden. Andere Seiten (Startseite, Listen, Archive usw.) gelangen nicht in den Suchindex.

## Suchoberfläche

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementiert die Suchseite:

- Lädt `@pagefind/default-ui` für das Suchfeld und die Ergebnisliste
- Findet Index-Assets über `getAssetPath("pagefind/")`
- Globale Stile überschreiben Pagefind-CSS-Variablen und ordnen sie dem Xingluo-Theme zu (`--background`, `--foreground`, `--primary`, usw.)
- `transition:persist` bewahrt den Suchzustand bei Navigation

### Suchablauf

1. Der Benutzer gibt Text in das Suchfeld ein
2. Pagefind sucht im Index der aktuellen Sprache
3. Die Ergebnisliste zeigt passende Beiträge (Titel, Zusammenfassungs-Highlight)
4. `processTerm` schreibt die Suchseiten-URL mit Query-Parametern in sessionStorage, damit der Zurück-Button den Zustand wiederherstellen kann

## Quell-Rückwärtsnavigation

Der Rückwärtsnavigation-Mechanismus zwischen der Suchseite und Beitragsseiten:

- Die `Main.astro`-Komponente schreibt die Quellseiten-URL in sessionStorage's `backUrl`
- Der `BackButton.astro` der Beitragsseite springt bevorzugt zu `backUrl` in sessionStorage zurück, oder zur Startseite, wenn nicht vorhanden
- Der `processTerm` der Suchseite schreibt die URL mit Query-Parametern und stellt so den Suchzustand bei der Rückkehr von einem Beitrag wieder her

## Mehrsprachige Suche

Pagefind teilt Indizes nach dem Sprachattribut der `data-pagefind-body`-Elemente auf:

- `zh-cn`-Seiten (Root) → Chinesischer Index
- `en`-Seiten (`/en/`-Präfix) → Englischer Index

Die Suchfunktion verwendet automatisch den Index der aktuellen Seitensprache: Chinesisch auf chinesischen Seiten, Englisch auf englischen Seiten.

## Theme-Anpassung

Pagefinds Standard-UI hat eigene CSS-Variablen; Xingluo überschreibt sie mit globalen Stilen in `SearchView.astro` und ordnet sie den shadcn-Theme-Variablen zu:

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

Der dunkle Modus wechselt automatisch über den `.dark`-Selektor, konsistent mit dem Site-Theme.

## Leistung

- Pagefind-Indizes sind statische Dateien; die Suche erfolgt clientseitig ohne Serveranfragen
- Indizes werden bei Bedarf geladen (Indexfragmente werden nur bei der Suche heruntergeladen)
- `transition:persist` vermeidet die erneute Initialisierung der Suchoberfläche bei Navigation
