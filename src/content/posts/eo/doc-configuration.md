---
title: "Agorda Gvidilo"
pubDatetime: 2026-06-20T04:00:00+08:00
description: "Plena referenco por ĉiuj agordaj elektoj de Xingluo, inkluzive retejan agordon, afiŝan agordon, funkciojn, sociajn ligilojn, kunhavigajn ligilojn kaj mediajn variablojn."
tags:
  - documentation
  - configuration
category: "Documentation"
translationKey: doc-configuration
locale: eo
---

Ĉiuj agordeblaj elektoj por Xingluo troviĝas en la radika dosiero [`xingluo.config.ts`](../xingluo.config.ts). La dosiero provizas plenajn tipajn limojn per `defineXingluoConfig`; ŝanĝoj ekvalidas tuj sen tuŝi la fontkodon.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // Reteja URL, uzata por absolutaj ligiloj, RSS, sitemap
  title: "Xingluo",                      // Reteja titolo
  description: "Moderna bloga CMS konstruita kun Astro kaj shadcn",
  author: "Xingluo",                     // Defaŭlta aŭtora nomo
  profile: "https://xingluo.example.com", // Aŭtora hejmpaĝo (uzata por JSON-LD)
  ogImage: "default-og.jpg",              // Defaŭlta OG-bildo (en la public dosierujo)
  lang: "zh-cn",                          // Defaŭlta lingvo
  timezone: "Asia/Shanghai",              // Horzono (afiŝa datuma montro)
  dir: "ltr",                             // Teksta direkto: ltr | rtl
  googleVerification: "",                 // Google Search Console kontrolvaloro (aŭ per env variablo)
}
```

| Kampo                | Defaŭlte         | Notoj                                                                                                         |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `url`                | deviga           | Radika URL de la retejo; devas finiĝi per `/`                                                                 |
| `title`              | deviga           | Reteja titolo, uzata en `<title>` kaj OG                                                                      |
| `description`        | deviga           | Reteja priskribo, uzata en meta kaj RSS                                                                       |
| `author`             | deviga           | Defaŭlta aŭtoro; afiŝa frontmatter revenas al ĉi tio                                                          |
| `profile`            | —                | Aŭtora hejmpaĝo, injektita en JSON-LD `author.url`                                                            |
| `ogImage`            | `default-og.jpg` | Defaŭlta OG-bilda dosiernomo, lokita en `public/`                                                             |
| `lang`               | deviga           | Defaŭlta lingvokodo; devas kongrui kun `i18n.defaultLocale` en `astro.config.ts`                              |
| `timezone`           | `Asia/Shanghai`  | Horzono dayjs, influas afiŝan datuman montron                                                                 |
| `dir`                | `ltr`            | Teksta direkto                                                                                                |
| `googleVerification` | —                | Valoro de Google-kontrolo; ankaŭ povas esti injektita per la media variablo `PUBLIC_GOOGLE_SITE_VERIFICATION` |

## posts

```ts
posts: {
perPage: 8,              // Afiŝoj por lista paĝo
  perIndex: 5,             // Afiŝoj montrataj sur la hejmpaĝo
  scheduledPostMargin: 900000, // Toleremo por planita publikigo (ms), 15 minutoj
}
```

- `perPage`: paĝo-grando por `/posts/[...page]` kaj `/tags/[tag]/[...page]`
- `perIndex`: nombro de afiŝoj montrataj en la sekcio "Lastaj" de la hejmpaĝo
- `scheduledPostMargin`: estontaj afiŝoj ene de ĉi tiu fenestro estas traktataj kiel publikigitaj (efika en produktado; dev montras ĉiujn)

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

| Kampo              | Defaŭlte           | Notoj                                                                          |
| ------------------ | ------------------ | ------------------------------------------------------------------------------ |
| `lightAndDarkMode` | `true`             | Ebligi hela/malhela reĝima ŝaltado                                             |
| `dynamicOgImage`   | `true`             | Dinamike generi OG-bildojn (satori + sharp)                                    |
| `showArchives`     | `true`             | Montri la arĥivan paĝon (retmapo filtras laŭe kiam malŝaltita)                 |
| `showCategories`   | `true`             | Montri la kategorio-paĝon kaj navigadan eniron (retmapo filtras laŭe)          |
| `showBackButton`   | `true`             | Montri reirbutonon sur afiŝaj paĝoj                                            |
| `editPost.enabled` | `false`            | Montri ligilon "Redakti ĉi tiun paĝon"                                         |
| `editPost.url`     | `""`               | Redakta ligila prefikso; la relativa fonta vojo de la afiŝo estas aldonita     |
| `search`           | `"pagefind"`       | Serĉa solvo: `"pagefind"` aŭ `false`                                           |
| `mdx`              | `true`             | Ebligi MDX-analizon kaj bildigon (vidu [Enhava kreado](./doc-content.md))      |
| `comments`         | `{provider:false}` | Komenta sistemo-agordo (vidu [Komenta sistemo](./doc-comments.md))             |
| `players.aplayer`  | `false`            | Ebligi APlayer-aŭdiludilon (vidu [Aŭdvidaĵaj ludiloj](./doc-media-players.md)) |
| `players.dplayer`  | `false`            | Ebligi DPlayer-videoludilon                                                    |

### editPost

`editPost.url` estas deponeja redakta URL-prefikso; Xingluo aldonas la relativan fontan vojon de la afiŝo (`src/content/posts/...`). Ekzemple:

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

La afiŝo `src/content/posts/welcome.md` produktas la ligilon `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: ikona nomo, korespondanta al `src/assets/icons/socials/{name}.astro`. Enkonstruitaj: `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url`: ligila URL; `mailto:` por retpoŝto
- `linkTitle`: laŭvola alirebla titolo; aŭtomate generita el la nomo kiam preterlasita

> Aldoni socian platformon: kreu `.astro`-ikonan komponanton kun la sama nomo sub `src/assets/icons/socials/`. `src/lib/socialIcons.ts` kolektas ilin aŭtomate per `import.meta.glob`.

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

Ĉi tiuj kundividaj enskriboj aperas malsupre de afiŝaj paĝoj. `url` estas kundivida URL-prefikso; Xingluo aldonas la absolutan URL de la nuna afiŝo. `name` simile mapas al ikono sub `src/assets/icons/socials/`.

## Mediaj Variabloj

Deklaritaj per `env.schema` en `astro.config.ts`:

| Variablo                          | Alira nivelo    | Priskribo                                       |
| --------------------------------- | --------------- | ----------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | publika/kliento | Kontrolvaloro de Google Search Console, laŭvola |

Ekzemplo (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "via-kontrolkodo"
pnpm build
```

La valoro estas injektita en `config.site.googleVerification` kaj bildigita kiel `<meta name="google-site-verification">`.

## Plena Ekzemplo

Vidu [`xingluo.config.ts`](../xingluo.config.ts). La sekcioj `features.comments` kaj `features.players` inkluzivas komentitajn ekzemplojn por giscus / twikoo / waline; mal Komentu kaj plenigu per realaj valoroj por ebligi.
