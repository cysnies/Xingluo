# Agorda gvidilo

Ĉiuj agordeblaj opcioj por Xingluo troviĝas en la radiknivela [`xingluo.config.ts`](../xingluo.config.ts). La dosiero provizas plenajn tipajn limigojn per `defineXingluoConfig`; ŝanĝoj efikas tuj sen tuŝi fontkodon.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // Retejo-URL, uzata por absolutaj ligiloj, RSS, retmapo
  title: "Xingluo",                      // Reteja titolo
  description: "Moderna bloga CMS konstruita per Astro kaj shadcn",
  author: "Xingluo",                     // Defaŭlta aŭtora nomo
  profile: "https://xingluo.example.com", // Aŭtora hejmpaĝo (uzata por JSON-LD)
  ogImage: "default-og.jpg",              // Defaŭlta OG-bildo (en la public dosierujo)
  lang: "zh-cn",                          // Defaŭlta lingvo
  timezone: "Asia/Shanghai",              // Horzono (afiŝa dato montriĝo)
  dir: "ltr",                             // Teksta direkto: ltr | rtl
  googleVerification: "",                 // Google Search Console-konfirmo-valoro (aŭ per medivariablo)
}
```

| Kampo                | Defaŭlta         | Notoj                                                                                       |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| `url`                | deviga           | Reteja radika URL; devas finiĝi per `/`                                                     |
| `title`              | deviga           | Reteja titolo, uzata en `<title>` kaj OG                                                    |
| `description`        | deviga           | Reteja priskribo, uzata en meta kaj RSS                                                     |
| `author`             | deviga           | Defaŭlta aŭtoro; afiŝa frontmatter falas reen al ĉi tio                                     |
| `profile`            | —                | Aŭtora hejmpaĝo, injektita en JSON-LD `author.url`                                          |
| `ogImage`            | `default-og.jpg` | Defaŭlta OG-bilda dosiernomo, lokita en `public/`                                           |
| `lang`               | deviga           | Defaŭlta lingva kodo; devas kongrui kun `i18n.defaultLocale` en `astro.config.ts`           |
| `timezone`           | `Asia/Shanghai`  | dayjs horzono, influas afiŝan datan montriĝon                                               |
| `dir`                | `ltr`            | Teksta direkto                                                                              |
| `googleVerification` | —                | Google-konfirmo-valoro; ankaŭ havebla per la medivariablo `PUBLIC_GOOGLE_SITE_VERIFICATION` |

## posts

```ts
posts: {
  perPage: 8,              // Afiŝoj per lista paĝo
  perIndex: 5,             // Afiŝoj montritaj sur la hejmpaĝo
  scheduledPostMargin: 900000, // Toleremo por planita publikigo (ms), 15 minutoj
}
```

- `perPage`: paĝa grandeco por `/posts/[...page]` kaj `/tags/[tag]/[...page]`
- `perIndex`: nombro da afiŝoj montritaj en la sekcio "Plej novaj" de la hejmpaĝo
- `scheduledPostMargin`: estontaj afiŝoj ene de ĉi tiu fenestro estas traktataj kiel publikigitaj (efika en produktado; disvolvo montras ĉiujn)

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

| Kampo              | Defaŭlta           | Notoj                                                                      |
| ------------------ | ------------------ | -------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | Ebligi helan/malan reĝimon-ŝaltilon                                        |
| `dynamicOgImage`   | `true`             | Dinamike generi OG-bildojn (satori + sharp)                                |
| `showArchives`     | `true`             | Montri la arĥivan paĝon (retmapo filtras laŭe kiam malŝaltita)             |
| `showCategories`   | `true`             | Montri la kategorian paĝon kaj navigan eniron (retmapo filtras laŭe)       |
| `showBackButton`   | `true`             | Montri reen-butonon sur afiŝaj paĝoj                                       |
| `editPost.enabled` | `false`            | Montri "Redakti ĉi tiun paĝon" ligilon                                     |
| `editPost.url`     | `""`               | Redakta ligila prefikso; la relativa fonta vojo de la afiŝo estas aldonita |
| `search`           | `"pagefind"`       | Serĉa solvo: `"pagefind"` aŭ `false`                                       |
| `mdx`              | `true`             | Ebligi MDX-analizon kaj bildigon (vidu [Enhava kreado](./content.md))      |
| `comments`         | `{provider:false}` | Kommenta sistemo-agordo (vidu [Komenta sistemo](./comments.md))            |
| `players.aplayer`  | `false`            | Ebligi APlayer-aŭdiludilon (vidu [Aŭdvidaĵaj ludiloj](./media-players.md)) |
| `players.dplayer`  | `false`            | Ebligi DPlayer-videoludilon                                                |

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

- `name`: ikona nomo, responda al `src/assets/icons/socials/{name}.astro`. Enkonstruitaj: `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url`: ligila URL; `mailto:` por retpoŝto
- `linkTitle`: nedeviga alirebla titolo; aŭtomate generita el la nomo kiam preterlasita

> Aldoni socian platformon: kreu `.astro`-ikonan komponanton samnoman sub `src/assets/icons/socials/`. `src/lib/socialIcons.ts` kolektas ilin aŭtomate per `import.meta.glob`.

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

Ĉi tiuj kundividaj eniroj aperas malsupre de afiŝaj paĝoj. `url` estas prefikso de kundivida URL; Xingluo aldonas la absolutan URL de la nuna afiŝo. `name` ankaŭ mapiĝas al ikono sub `src/assets/icons/socials/`.

## Medivariabloj

Deklarita per `env.schema` en `astro.config.ts`.

| Variablo                          | Alira nivelo    | Priskribo                                       |
| --------------------------------- | --------------- | ----------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Google Search Console-konfirmo-valoro, nedeviga |

Ekzemplo (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

La valoro estas injektita en `config.site.googleVerification` kaj renderita kiel `<meta name="google-site-verification">`.

## Plena ekzemplo

Vidu [`xingluo.config.ts`](../xingluo.config.ts). La sekcioj `features.comments` kaj `features.players` inkluzivas komentitajn ekzemplojn por giscus / twikoo / waline; malkomentu kaj plenigu realajn valorojn por aktivigi.
