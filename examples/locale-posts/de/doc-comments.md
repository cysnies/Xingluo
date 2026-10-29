---
title: "Kommentarsystem"
pubDatetime: 2026-06-20T09:00:00+08:00
description: "Leitfaden zum Kommentarsystem von Xingluo mit Auswahl, Konfiguration und Integration von giscus, twikoo und waline."
tags:
  - documentation
  - comments
category: "Documentation"
translationKey: doc-comments
locale: de
---

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

## Position des Kommentarbereichs

Der Kommentarbereich erscheint nur am unteren Rand von **Beitragsdetailseiten** (nach der vorherigen/nächsten Navigation), gerendert von [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro).

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
    mapping: "pathname",          // optional, Seiten-zu-Diskussions-Zuordnung
    strict: false,                // optional, strikte Titelübereinstimmung
    reactionsEnabled: true,       // optional, Reaktionen
    inputPosition: "bottom",      // optional, Position des Kommentarfelds: top | bottom
    loading: "lazy",              // optional, Laden: lazy | eager
  },
}
```

### repoId / categoryId abrufen

1. Besuchen Sie [giscus.app](https://giscus.app)
2. Geben Sie das Repository und die Kategorie ein, um die Konfiguration zu generieren
3. Kopieren Sie `data-repo-id` und `data-category-id` in Ihre Konfiguration

### Funktionsweise

giscus injiziert einen iframe über das offizielle `client.js`, mit `data-*`-Attributen, die die Konfiguration enthalten. Die Sprache wird automatisch der aktuellen Sprache zugeordnet (`zh-cn` → `zh-CN`, `en` → `en`). Das Thema wird beim Umschalten über `postMessage` synchronisiert.

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

- Tencent CloudBase: Geben Sie die Umgebungs-ID ein (erfordert das cloudbase SDK)
- Self-Hosted: Geben Sie die vollständige URL ein (z. B. `https://twikoo.example.com`); twikoo erkennt den HTTP-API-Modus automatisch

### Funktionsweise

twikoo importiert dynamisch `import("twikoo")` und ruft `init` auf, wenn der Kommentarcontainer in den Viewport gelangt. twikoo unterstützt kein Laufzeit-Them switching; die Seite erstellt es bei Themenwechsel neu, um dunkle Stile anzuwenden.

## waline

Ein backend-gestütztes Kommentarsystem mit Kommentar- und Aufrufzahlen.

### Konfiguration

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Waline-Serveradresse
    lang: "zh-CN",                           // optional, Sprache
    pageSize: 10,                            // optional, Kommentarseitengröße
    dark: "html.dark",                       // optional, Dunkel-Selektor (Standard: site .dark)
  },
}
```

### serverURL-Bereitstellung

Lesen Sie die [Waline-Dokumentation](https://waline.js.org/), um den Server bereitzustellen (Vercel / Cloudflare / Self-Host), und tragen Sie dann die Adresse in `serverURL` ein.

### Funktionsweise

waline importiert dynamisch `import("@waline/client")` und das Stylesheet `@waline/client/style`, wenn der Kommentarcontainer in den Viewport gelangt, und ruft dann `init` auf. Der `dark:"html.dark"`-Selektor folgt automatisch dem dunklen Modus der Seite; keine manuelle Synchronisation erforderlich.

## Lazy Loading

Alle Kommentarsysteme werden über IntersectionObserver lazy-geladen: Anfragen und Initialisierung erfolgen nur, wenn der Kommentarcontainer innerhalb von 200px des Viewports ist, was die Erstladeleistung schont.

Siehe [`src/scripts/comments.ts`](../src/scripts/comments.ts).

## Themensynchronisation

Wenn sich das Seitenthema ändert, wird das Kommentarsystem-Thema automatisch synchronisiert:

| Kommentarsystem | Synchronisationsmethode                                      |
| --------------- | ------------------------------------------------------------ |
| giscus          | `postMessage({giscus:{setConfig:{theme}}})` an den iframe    |
| waline          | `dark:"html.dark"` CSS-Selektor folgt automatisch            |
| twikoo          | überwacht `.dark`-Klassenänderungen und erstellt Instanz neu |

Die Themenüberwachung verwendet einen `MutationObserver` auf den `class`- und `data-theme`-Attributen von `document.documentElement`.

## View Transitions-Anpassung

Das Kommentarskript lauscht auf `astro:page-load` und scannt die Mount-Punkte nach jedem Seitenladen erneut. Eine erneute Initialisierung wird über `dataset`-Marker (`xng-setup`, `xng-init`) verhindert.

## i18n

Der Titel des Kommentarbereichs wird über `UIStrings.comments.title` lokalisiert ("Kommentare" in `zh-cn.ts` und `en.ts`). Die UI-Sprache des Kommentarsystems wird durch das `lang`-Feld des jeweiligen Anbieters gesteuert.

## Benutzerdefinierte Erweiterungen

### Anbieter wechseln

Ändern Sie `features.comments.provider` in `xingluo.config.ts`; keine Codeänderungen erforderlich. Xingluo rendert die entsprechende Unterkomponente automatisch.

### Kommentarsystem hinzufügen

1. Erstellen Sie eine neue Komponente unter `src/components/comments/` (z. B. `Disqus.astro`), die einen Mount-Container rendert
2. Fügen Sie einen neuen Anbieterzweig im bedingten Rendering von `Comments.astro` hinzu
3. Fügen Sie Initialisierungslogik in `src/scripts/comments.ts` hinzu
4. Erweitern Sie `CommentProvider` und die Konfigurationstypen in `src/types/config.ts`
