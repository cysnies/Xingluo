# Kommentarsystem

Xingluo integriert drei Kommentarsysteme — giscus, twikoo und waline — auswählbar über `features.comments`.

## Konfiguration

Wählen Sie einen Anbieter und geben Sie dessen Konfiguration in `features.comments` in [`xingluo.config.ts`](../xingluo.config.ts) an:

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* giscus-Konfiguration */ },
    // twikoo: { /* twikoo-Konfiguration */ },
    // waline: { /* waline-Konfiguration */ },
  },
}
```

Mit `provider: false` (Standard) sind Kommentare deaktiviert und Beitragsseiten geben keine Kommentar-Marker oder Skripte aus.

## Kommentarbereich-Position

Der Kommentarbereich erscheint nur am unteren Rand von **Beitragsdetailseiten** (nach der vorherige/nächste-Navigation), gerendert von [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro).

## giscus

Ein Kommentarsystem basierend auf GitHub Discussions; das Repository muss öffentlich sein und Discussions aktiviert haben.

### Konfiguration

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // GitHub-Repository
    repoId: "R_...",              // Repository-ID (generiert von giscus.app)
    category: "Announcements",    // Name der Diskussionskategorie
    categoryId: "DIC_...",        // Kategorie-ID (generiert von giscus.app)
    mapping: "pathname",          // optional, Seite-zu-Diskussion-Zuordnung
    strict: false,                // optional, strikte Titelübereinstimmung
    reactionsEnabled: true,       // optional, Reaktionen
    inputPosition: "bottom",      // optional, Kommentarfeld-Position: top | bottom
    loading: "lazy",              // optional, Laden: lazy | eager
  },
}
```

### repoId / categoryId erhalten

1. Besuchen Sie [giscus.app](https://giscus.app)
2. Geben Sie das Repository und die Kategorie ein, um die Konfiguration zu generieren
3. Kopieren Sie `data-repo-id` und `data-category-id` in Ihre Konfiguration

### Funktionsweise

giscus injiziert einen Iframe über das offizielle `client.js`, mit `data-*`-Attributen, die die Konfiguration enthalten. Die Sprache wird automatisch auf die aktuelle Locale abgebildet (`zh-cn` → `zh-CN`, `en` → `en`). Das Theme wird beim Umschalten über `postMessage` synchronisiert.

## twikoo

Ein Kommentarsystem ohne Backend-Abhängigkeit, das Tencent CloudBase oder Self-Hosting unterstützt.

### Konfiguration

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // Cloud-Umgebungs-ID oder vollständige Self-Host-URL
    lang: "zh-CN",                            // optional, Sprache
  },
}
```

### envId-Hinweise

- Tencent CloudBase: Umgebungs-ID eingeben (erfordert das cloudbase SDK)
- Self-Hosted: vollständige URL eingeben (z. B. `https://twikoo.example.com`); twikoo erkennt den HTTP-API-Modus automatisch

### Funktionsweise

twikoo importiert dynamisch `"twikoo"` und ruft `init` auf, wenn der Kommentarcontainer in den Viewport gelangt. twikoo unterstützt kein Theme-Wechsel zur Laufzeit; die Site erstellt es bei Theme-Änderung neu, um dunkle Stile anzuwenden.

## waline

Ein backendgestütztes Kommentarsystem mit Kommentar- und Ansichtszählern.

### Konfiguration

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Waline-Serveradresse
    lang: "zh-CN",                           // optional, Sprache
    pageSize: 10,                            // optional, Kommentarseitengröße
    dark: "html.dark",                       // optional, dunkler Selektor (Standard: .dark der Site)
  },
}
```

### serverURL-Bereitstellung

Lesen Sie die [Waline-Dokumentation](https://waline.js.org/), um den Server bereitzustellen (Vercel / Cloudflare / Self-Host funktionieren alle), und geben Sie dann die Adresse in `serverURL` ein.

### Funktionsweise

waline importiert dynamisch `"@waline/client"` und das Style `@waline/client/style`, wenn der Kommentarcontainer in den Viewport gelangt, und ruft dann `init` auf. Der Selektor `dark:"html.dark"` folgt automatisch dem dunklen Modus der Site; keine manuelle Synchronisation erforderlich.

## Lazy Loading

Alle Kommentarsysteme werden über IntersectionObserver lazy-geladen: Anfragen und Initialisierung erfolgen nur, wenn der Kommentarcontainer innerhalb von 200px des Viewports ist, um die Leistungseinbußen beim ersten Rendern zu vermeiden.

Siehe [`src/scripts/comments.ts`](../src/scripts/comments.ts).

## Theme-Synchronisation

Wenn sich das Site-Theme ändert, wird das Kommentarsystem-Theme automatisch synchronisiert:

| Kommentarsystem | Synchronisationsmethode                                          |
| --------------- | ---------------------------------------------------------------- |
| giscus          | `postMessage({giscus:{setConfig:{theme}}})` an den Iframe        |
| waline          | CSS-Selektor `dark:"html.dark"` folgt automatisch                |
| twikoo          | überwacht `.dark`-Klassenänderungen und erstellt die Instanz neu |

Die Theme-Überwachung verwendet einen `MutationObserver` auf den `class`- und `data-theme`-Attributen von `document.documentElement`.

## View Transitions-Anpassung

Das Kommentarskript hört auf `astro:page-load` und scannt die Mountpunkte nach jedem Seitenladen erneut. Eine erneute Initialisierung wird über `dataset`-Marker (`xng-setup`, `xng-init`) verhindert.

## i18n

Der Titel des Kommentarbereichs wird über `UIStrings.comments.title` lokalisiert. Die UI-Sprache des Kommentarsystems wird durch das `lang`-Feld des jeweiligen Anbieters gesteuert.

## Benutzerdefinierte Erweiterungen

### Anbieter wechseln

Ändern Sie `features.comments.provider` in `xingluo.config.ts`; keine Codeänderungen erforderlich. Xingluo rendert die entsprechende Unterkomponente automatisch.

### Hinzufügen eines Kommentarsystems

1. Erstellen Sie eine neue Komponente unter `src/components/comments/` (z. B. `Disqus.astro`), die einen Mount-Placeholder rendert
2. Fügen Sie einen neuen Anbieterzweig im bedingten Rendering von `Comments.astro` hinzu
3. Fügen Sie Initialisierungslogik in `src/scripts/comments.ts` hinzu
4. Erweitern Sie `CommentProvider` und Konfigurationstypen in `src/types/config.ts`
