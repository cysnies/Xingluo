---
title: "Internationalisierung"
pubDatetime: 2026-06-20T06:00:00+08:00
description: "Details zum i18n-System von Xingluo mit mehrsprachigem Routing, UI-String-Lokalisierung, Übersetzung auf Inhaltsebene und Hinzufügen neuer Sprachen."
tags:
  - documentation
  - i18n
category: "Documentation"
translationKey: doc-i18n
locale: de
---

Xingluo wird mit zweisprachiger UI-Unterstützung (zh-CN / en) ausgeliefert und verwendet die Routing-Strategie `prefixDefaultLocale: false`, sodass die Standardsprache kein URL-Präfix hat.

## Routing-Strategie

Astros `i18n`-Konfiguration (siehe `astro.config.ts`):

```ts
i18n: {
  locales: ["zh-cn", "en"],
  defaultLocale: "zh-cn",
  routing: { prefixDefaultLocale: false },
}
```

**Wichtig: `prefixDefaultLocale: false` generiert keine lokalisierten Seitenkopien automatisch** — Sie müssen `[locale]/`-Spiegel-Routen manuell pflegen.

Xingluos Ansatz:

- **Root-Seiten** = Standardsprache (`zh-cn`), kein URL-Präfix, z. B. `/posts/welcome/`
- **`src/pages/[locale]/`** spiegelt alle Seiten; `getStaticPaths` verwendet `getLocaleParams()`, um nur nicht-standard-Sprachen zu generieren, z. B. `/en/posts/welcome/`
- Spiegel-Seiten sind ebenfalls dünne Wrapper und verwenden dieselbe View-Komponente für die Rendering-Logik

```
/                      → startseite (zh-cn)
/en/                   → startseite (en)
/posts/welcome/        → beitrag (zh-cn)
/en/posts/welcome/     → beitrag (en)
```

## Sprachauflösung

View-Komponenten verwenden `Astro.currentLocale` zur automatischen Auflösung:

- Root-Seiten → `zh-cn`
- `[locale]`-Segment-Seiten → `en` (oder andere nicht-standard-Sprachen)

Auf der Komponentenebene sind keine Pfadprüfungen erforderlich; `useTranslations(locale)` ruft die entsprechenden Zeichenfolgen direkt ab.

## i18n-Modulstruktur

[`src/i18n/`](../src/i18n/):

| Datei            | Verantwortung                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.ts`       | `import.meta.glob("./lang/*.ts", {eager:true})` lädt Sprachen; exportiert `DEFAULT_LOCALE`, `LOCALES`, `useTranslations(locale)`, `tplStr` |
| `types.ts`       | Vollständiges `UIStrings`-Interface (alle zu lokalisierenden Zeichenfolgen)                                                                |
| `routing.ts`     | `getLocalePrefix`, `withLocale(path, locale)`, `parseLocaleFromPath(pathname)`                                                             |
| `staticPaths.ts` | `NON_DEFAULT_LOCALES`, `getLocaleParams()`                                                                                                 |
| `format.ts`      | `tplStr(template, vars)` — `{{key}}`-Platzhalterersetzung                                                                                  |
| `lang/zh-cn.ts`  | Vereinfachtes Chinesisch (Standard)                                                                                                        |
| `lang/en.ts`     | Englisch                                                                                                                                   |

## UIStrings-Struktur

Das `UIStrings`-Interface definiert alle zu lokalisierenden UI-Zeichenfolgen, gruppiert in Kategorien:

- `nav`: Navigation (Startseite/Beiträge/Tags/Über/Archive/Suche/RSS)
- `post`: Beitrag (Datum, Teilen, Tags, Zurück, Bearbeiten, Inhaltsverzeichnis, Code kopieren, Bild-Lightbox, usw.)
- `pagination`: Seitennummerierung
- `home`: Startseite (soziale Links, Hervorgehoben, Neueste)
- `archives`: Archive (Anzahl, Monate)
- `footer`: Fußzeile (Copyright)
- `pages`: Seitentitel und -beschreibungen
- `a11y`: Barrierefreiheits-Labels
- `languageSwitcher`: Sprachumschalter
- `notFound`: 404
- `comments`: Kommentarbereich

## Vorlagenzeichenfolgen

Zeichenfolgen mit Platzhaltern verwenden `{{key}}`, ersetzt über `tplStr`:

```ts
import { tplStr } from "@/i18n";

// archives.postCount = "{{count}} Beiträge"
tplStr(t.archives.postCount, { count: 5 }); // "5 Beiträge"
```

## SEO-Mehrsprachigkeitsdeklarationen

Der `<head>` von `Layout.astro` gibt aus:

- `<link rel="alternate" hreflang="..." href="...">` für jede Sprache
- `x-default` verweist auf die Standardsprache
- Die Sitemap-Integration ermöglicht der i18n-Konfiguration die automatische Generierung von hreflang
- Nicht-standard-Sprachbeiträge haben canonical, das auf das Original in der Standardsprache verweist (um Duplicate-Content-Strafen zu vermeiden; siehe [SEO](./doc-seo.md))

## Sprache hinzufügen

Beispiel: Hinzufügen von Japanisch `ja`:

1. **`astro.config.ts`**: fügen Sie `"ja"` zu `i18n.locales` und die Zuordnung `"ja": "ja-JP"` zur Sitemap `i18n.locales` hinzu
2. **`src/i18n/lang/`**: erstellen Sie `ja.ts`, das ein vollständiges `UIStrings` exportiert (`en.ts` kopieren und übersetzen)
3. **`src/i18n/staticPaths.ts`**: `NON_DEFAULT_LOCALES` enthält automatisch `ja` (berechnet aus `LOCALES`)
4. **`src/pages/[locale]/`**: Spiegel-Seiten generieren automatisch die `ja`-Version (`getLocaleParams` deckt dies ab)
5. **Language switcher**: fügen Sie `"ja": "日本語"` zu `languageSwitcher.names` in `zh-cn.ts` und `en.ts` hinzu

## Übersetzung auf Inhaltsebene

Xingluo unterstützt mehrsprachige Beitragsinhalte über die Frontmatter-Felder `locale` und `translationKey`.

### Grundlegende Verwendung

1. **Beitrag in Standardsprache**: ablegen unter `src/content/posts/<slug>.md`, `translationKey` als Gruppenkennung setzen:

```yaml
# src/content/posts/welcome.md
---
title: "欢迎来到星罗"
locale: zh-cn
translationKey: welcome-to-xingluo
tags: [公告, Astro]
---
```

2. **Übersetzung**: ablegen in einem Sprachunterverzeichnis `src/content/posts/<locale>/<slug>.md`, mit demselben `translationKey`:

```yaml
# src/content/posts/en/welcome.md
---
title: "Welcome to Xingluo"
locale: en
translationKey: welcome-to-xingluo
tags: [announcement, Astro]
---
```

### Verzeichnisstruktur

```
src/content/posts/
├── welcome.md              # Standardsprache (zh-cn)
├── en/
│   └── welcome.md          # Englische Übersetzung
├── ja/
│   └── welcome.md          # Japanische Übersetzung
└── another-post.md         # Eigenständiger Beitrag (kein translationKey)
```

- Namen der Sprachunterverzeichnisse müssen mit den Sprachcodes in `astro.config.ts`'s `i18n.locales` übereinstimmen
- Sprachunterverzeichnisse werden aus dem URL-Slug herausgefiltert (z. B. `/posts/welcome/`, nicht `/posts/en/welcome/`)
- Beiträge ohne `translationKey` sind eigenständig und nicht sprachübergreifend verknüpft

### Routing-Verhalten

| Szenario                                          | Verhalten                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Standardsprache-Zugriff auf einen `zh-cn` Beitrag | Rendert das Standardsprachen-Original                                                      |
| Nicht-Standardsprache mit **Übersetzung**         | Rendert die entsprechende Übersetzung                                                      |
| Nicht-Standardsprache **ohne** Übersetzung        | Fällt auf das Standardsprachen-Original zurück (identischer Inhalt, canonical schützt SEO) |

### Listendeduplizierung

Listenseiten (Startseite, Beitragsliste, Tags, Archiv, RSS) verwenden `getPostsForLocale`, um repräsentative Beiträge pro Sprache auszuwählen: jede Übersetzungsgruppe zeigt nur eine Karte in der Zielsprache, um doppelte Einträge für dasselbe Thema zu vermeiden.

### canonical & SEO

- **Hat eine unabhängige Übersetzung**: canonical zeigt auf die eigene URL der Übersetzung, von Suchmaschinen separat indizierbar
- **Keine Übersetzung (Fallback)**: canonical zeigt auf das Standardsprachen-Original, um Duplicate-Content-Strafen zu vermeiden
- hreflang-Deklarationen decken alle Sprachen ab und teilen Suchmaschinen die Beziehungen zwischen den Sprachversionen mit

Siehe [SEO](./doc-seo.md).
