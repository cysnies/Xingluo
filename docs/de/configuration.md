# Konfigurationsleitfaden

Alle konfigurierbaren Optionen von Xingluo befinden sich in der Root-Datei [`xingluo.config.ts`](../xingluo.config.ts). Die Datei bietet vollständige Typeinschränkungen über `defineXingluoConfig`; Änderungen werden sofort wirksam, ohne den Quellcode zu berühren.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // Site-URL, verwendet für absolute Links, RSS, Sitemap
  title: "Xingluo",                      // Site-Titel
  description: "Ein modernes Blog-CMS, erstellt mit Astro und shadcn",
  author: "Xingluo",                     // Standard-Autorenname
  profile: "https://xingluo.example.com", // Autoren-Startseite (verwendet für JSON-LD)
  ogImage: "default-og.jpg",              // Standard-OG-Bild (im public-Verzeichnis)
  lang: "zh-cn",                          // Standardsprache
  timezone: "Asia/Shanghai",              // Zeitzone (Beitragsdatum-Anzeige)
  dir: "ltr",                             // Textrichtung: ltr | rtl
  googleVerification: "",                 // Google Search Console-Verifizierungswert (oder über Umgebungsvariable)
}
```

| Feld                 | Standard         | Hinweise                                                                                                           |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `url`                | erforderlich     | Site-Stamm-URL; muss mit `/` enden                                                                                 |
| `title`              | erforderlich     | Site-Titel, verwendet in `<title>` und OG                                                                          |
| `description`        | erforderlich     | Site-Beschreibung, verwendet in Meta und RSS                                                                       |
| `author`             | erforderlich     | Standard-Autor; Beitrags-Frontmatter fällt darauf zurück                                                           |
| `profile`            | —                | Autoren-Startseite, eingefügt in JSON-LD `author.url`                                                              |
| `ogImage`            | `default-og.jpg` | Standard-OG-Bilddateiname, befindet sich in `public/`                                                              |
| `lang`               | erforderlich     | Standard-Sprachcode; muss mit `i18n.defaultLocale` in `astro.config.ts` übereinstimmen                             |
| `timezone`           | `Asia/Shanghai`  | dayjs-Zeitzone, beeinflusst die Beitragsdatum-Anzeige                                                              |
| `dir`                | `ltr`            | Textrichtung                                                                                                       |
| `googleVerification` | —                | Google-Verifizierungswert; kann auch über die `PUBLIC_GOOGLE_SITE_VERIFICATION`-Umgebungsvariable injiziert werden |

## posts

```ts
posts: {
  perPage: 8,              // Beiträge pro Listenseite
  perIndex: 5,             // Beiträge auf der Startseite
  scheduledPostMargin: 900000, // Toleranz für zeitgesteuerte Veröffentlichung (ms), 15 Minuten
}
```

- `perPage`: Seitengröße für `/posts/[...page]` und `/tags/[tag]/[...page]`
- `perIndex`: Anzahl der Beiträge im Bereich "Neueste" der Startseite
- `scheduledPostMargin`: zukünftige Beiträge innerhalb dieses Fensters gelten als veröffentlicht (in Produktion wirksam; Entwicklung zeigt alle)

## features

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "pagefind",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| Feld               | Standard           | Hinweise                                                                        |
| ------------------ | ------------------ | ------------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | Hell/Dunkel-Modus-Umschaltung aktivieren                                        |
| `dynamicOgImage`   | `true`             | OG-Bilder dynamisch generieren (satori + sharp)                                 |
| `showArchives`     | `true`             | Archivseite anzeigen (Sitemap filtert entsprechend, wenn aus)                   |
| `showCategories`   | `true`             | Kategorieseite und Navigationspunkt anzeigen (Sitemap filtert entsprechend)     |
| `showBackButton`   | `true`             | "Zurück"-Button auf Beitragsseiten anzeigen                                     |
| `editPost.enabled` | `false`            | "Seite bearbeiten"-Link anzeigen                                                |
| `editPost.url`     | `""`               | Bearbeitungslink-Präfix; der relative Quellpfad des Beitrags wird angehängt     |
| `search`           | `"pagefind"`       | Suchlösung: `"pagefind"` oder `false`                                           |
| `mdx`              | `true`             | MDX-Parsing und -Rendering aktivieren (siehe [Inhaltserstellung](./content.md)) |
| `comments`         | `{provider:false}` | Kommentarsystem-Konfiguration (siehe [Kommentarsystem](./comments.md))          |
| `players.aplayer`  | `false`            | APlayer-Audioplayer aktivieren (siehe [Medienplayer](./media-players.md))       |
| `players.dplayer`  | `false`            | DPlayer-Videoplayer aktivieren                                                  |

### editPost

`editPost.url` ist ein Repository-Bearbeitungs-URL-Präfix; Xingluo hängt den relativen Quellpfad des Beitrags (`src/content/posts/...`) an. Zum Beispiel:

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

Der Beitrag `src/content/posts/welcome.md` erzeugt den Link `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: Symbolname, entsprechend `src/assets/icons/socials/{name}.astro`. Integriert: `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url`: Link-URL; `mailto:` für E-Mail
- `linkTitle`: optionaler barrierefreier Titel; bei Weglassen automatisch aus dem Namen generiert

> Soziale Plattform hinzufügen: Erstellen Sie eine gleichnamige `.astro`-Symbolkomponente unter `src/assets/icons/socials/`. `src/lib/socialIcons.ts` sammelt sie automatisch über `import.meta.glob`.

## shareLinks

```ts
shareLinks: [
  { name: "x", url: "https://x.com/intent/post?url=" },
  { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
  { name: "telegram", url: "https://t.me/share/url?url=" },
  { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
  { name: "mail", url: "mailto:?subject=...&body=" },
];
```

Diese Teilen-Einträge erscheinen am Ende von Beitragsseiten. `url` ist ein Teilen-URL-Präfix; Xingluo hängt die absolute URL des aktuellen Beitrags an. `name` wird ebenfalls einem Symbol unter `src/assets/icons/socials/` zugeordnet.

## Umgebungsvariablen

Deklariert über `env.schema` in `astro.config.ts`:

| Variable                          | Zugriffsstufe   | Beschreibung                                       |
| --------------------------------- | --------------- | -------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Google Search Console-Verifizierungswert, optional |

Beispiel (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

Der Wert wird in `config.site.googleVerification` injiziert und als `<meta name="google-site-verification">` gerendert.

## Vollständiges Beispiel

Siehe [`xingluo.config.ts`](../xingluo.config.ts). Die Abschnitte `features.comments` und `features.players` enthalten kommentierte Beispiele für giscus / twikoo / waline; kommentieren Sie sie aus und füllen Sie echte Werte ein, um sie zu aktivieren.
