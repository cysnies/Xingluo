---
title: "Erste Schritte"
pubDatetime: 2026-06-20T03:00:00+08:00
description: "Anleitung zum Einrichten von Xingluo für lokale Entwicklung und Produktions-Builds, mit Anforderungen, Installation, Entwicklung und Bereitstellung."
tags:
  - documentation
  - getting-started
category: "Documentation"
translationKey: doc-getting-started
locale: de
---

Diese Anleitung hilft Ihnen, Xingluo für die lokale Entwicklung und Produktions-Builds von Grund auf einzurichten.

## Voraussetzungen

| Abhängigkeit | Mindestversion | Hinweise                                            |
| ------------ | -------------- | --------------------------------------------------- |
| Node.js      | 22.12.0        | Siehe `engines.node` in `package.json`              |
| pnpm         | 10.x           | Paketmanager (das Projekt verwendet pnpm workspace) |

> Tipp: Verwalten Sie Node-Versionen mit [fnm](https://github.com/Schniz/fnm) oder [nvm](https://github.com/nvm-sh/nvm).

## Installation

Nach dem Klonen des Repositoriums, installieren Sie die Abhängigkeiten:

```bash
pnpm install
```

Sobald die Abhängigkeiten installiert sind, werden die Referenzprojekte unter `references/` automatisch von der TypeScript-Kompilierung und den Builds ausgeschlossen (siehe `exclude` in `tsconfig.json`).

## Lokale Entwicklung

Starten Sie den Entwicklungsserver (Standard `http://localhost:4321/`):

```bash
pnpm dev
```

Im Entwicklungsmodus:

- Entwürfe und zeitgesteuerte Beiträge sind **alle sichtbar** (für Vorschau); sie werden nur bei Produktions-Builds gefiltert
- Änderungen an der Content Collection lösen Hot Reload aus
- Clientseitige Verhaltensweisen (Theme-Umschaltung, View Transitions usw.) entsprechen der Produktion

## Typ-Synchronisation

Nach dem Ändern von Content-Collection-Schemas oder -Typen führen Sie sync aus, um `.astro/types.d.ts` zu aktualisieren:

```bash
pnpm sync
```

## Build

Der Produktions-Build besteht aus drei Schritten (siehe das `build`-Skript in `package.json`):

```bash
pnpm build
```

1. **`astro check`**: TypeScript- und Astro-Vorlagen-Typüberprüfung; jeder Fehler bricht den Build ab
2. **`astro build`**: generiert die gesamte Website statisch in `dist/` (einschließlich dynamischer OG-Bilder, RSS, Sitemap, robots.txt, pagefind UI-Assets)
3. **`pagefind --site dist`**: durchsucht `dist/` und generiert den Volltextsuchindex in `dist/pagefind/`

> Hinweis: `pagefind` ist ein binäres Tool, das als devDependency installiert wurde; keine zusätzliche Konfiguration erforderlich.

## Build-Vorschau

Zeigen Sie die Build-Ausgabe in `dist/` lokal an:

```bash
pnpm preview
```

## Code-Qualität

| Befehl              | Zweck                                                                         |
| ------------------- | ----------------------------------------------------------------------------- |
| `pnpm format`       | Formatiert den gesamten Code mit Prettier (einschließlich Astro und Tailwind) |
| `pnpm format:check` | Überprüft die Einhaltung der Formatierung (wird in CI verwendet)              |
| `pnpm lint`         | ESLint-Überprüfungen (einschließlich `eslint-plugin-astro`)                   |

## Nächste Schritte

- Lesen Sie den [Konfigurationsleitfaden](./doc-configuration.md), um Website-Informationen und Funktionen anzupassen
- Lesen Sie [Inhaltserstellung](./doc-content.md), um mit dem Schreiben zu beginnen
- Lesen Sie [Bereitstellung](./doc-deployment.md), um Ihre Website zu veröffentlichen
