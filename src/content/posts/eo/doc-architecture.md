---
title: "Arkitektura Superrigardo"
pubDatetime: 2026-06-20T07:00:00+08:00
description: "Arkitektura superrigardo de Xingluo kovranta dosierujan aranĝon, agordan fluon, bildigan fluon, konstrubendon kaj etendgvidilon."
tags:
  - documentation
  - architecture
category: "Documentation"
translationKey: doc-architecture
locale: eo
---

Ĉi tiu dokumento priskribas la ĝeneralan arkitekturon de Xingluo, dosierujan aranĝon, agordan fluon, bildigan fluon kaj konstruan dukton, por helpi vin kompreni kodorganizon kaj kiel pligrandigi ĝin.

## Dosieruja strukturo

```
xingluo/
├── astro.config.ts          # Agordo de Astro (integrigoj, i18n, markdown, tiparoj, env)
├── xingluo.config.ts        # Enira agordo de uzanto
├── tsconfig.json            # TypeScript-agordo (strikta + @/* vojaliaso)
├── package.json             # Dependecoj kaj skriptoj
├── public/                  # Statikaj aktivaĵoj (favicon.svg, defaŭlta OG-bildo, ktp.)
├── docs/                    # Projekta dokumentaro (ĉi tiu dosierujo)
├── references/              # Nurlega referencprojektaj fontoj (ne dependu)
└── src/
    ├── config.ts            # Kunfandi defaŭlt-valorojn, eksporti solvitan agordon
    ├── content.config.ts    # Enhavkolektaj skemoj (afiŝoj, paĝoj)
    ├── env.d.ts             # Tipodeklaroj por triapartaj moduloj kaj mediaj variabloj
    ├── assets/              # Ikonaj komponantoj
    │   └── icons/           # astro-icon + Font Awesome (inkluzivas socials/)
    ├── components/          # UI-komponantoj
    │   ├── ui/              # shadcn-stilaj komponantoj (Button, Card, Badge, ktp.)
    │   ├── post/            # Afiŝpaĝaj komponantoj (antaŭa/seka navigado, reen, kundivido, ktp.)
    │   ├── comments/        # Komentaj sistemaj komponantoj
    │   ├── mdx/             # MDK-propraj komponantoj (APlayer, DPlayer)
    │   ├── pageViews/       # Paĝaj vidoj (centralizita paĝa bildiga logiko)
    │   └── *.astro          # Radiknivelaj komponantoj (Header, Footer, PostCard, ktp.)
    ├── content/             # Enhavaj dosieroj
    │   ├── posts/           # Blogaj afiŝoj
    │   └── pages/           # Statikaj paĝoj
    ├── i18n/                # Internaciigo
    │   ├── index.ts         # Lingva ŝarĝado kaj useTranslations
    │   ├── types.ts         # Plena UIStrings-tipo
    │   ├── routing.ts       # Lokeca vojsolvado
    │   ├── staticPaths.ts   # getStaticPaths por ne-defaŭltaj lokecoj
    │   ├── format.ts        # Ŝablona ĉenanstataŭigo
    │   └── lang/            # Lingvaj rimedaj dosieroj (zh-cn.ts, en.ts)
    ├── layouts/             # Aranĝoj
    │   ├── Layout.astro     # Baza skeleto (head, SEO, FOUC)
    │   └── PostLayout.astro # Afiŝa aranĝo (JSON-LD, artikolo-meta)
    ├── lib/                 # Fundamentaj utilaĵoj
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # dayjs-ekzemplero kaj horzonkromaĵo
    │   └── socialIcons.ts   # Dinamika solvado de sociaj ikonoj
    ├── pages/               # Itineroj (radiko + [locale]/ spegulo)
    ├── scripts/             # Klient-flankaj skriptoj
    │   ├── theme.ts         # Tema ŝaltado
    │   ├── postEnhancements.ts # Afiŝaj plibonigoj (ankroj, kopio, lumskatolo, progreso)
    │   ├── comments.ts      # Malrapida ŝarĝado de komentoj kaj tema sinkronigo
    │   └── players.ts       # Malrapida ŝarĝado de ludantoj
    ├── styles/              # Stiloj
    │   ├── global.css       # Tailwind-eniro + baza tavolo + propraj utilaĵoj
    │   ├── theme.css        # shadcn-temaj variabloj (OKLCH)
    │   └── typography.css   # .app-prose tipografio kaj kodoblokaj stiloj
    ├── types/               # Tipaj deklaroj
    │   ├── config.ts        # Agordaj tipoj
    │   └── *.d.ts           # Deklaroj por netipitaj triapartaj moduloj
    └── utils/               # Utilaj funkcioj
        ├── getPostPaths.ts  # Afiŝa slug kaj URL-derivo
        ├── getSortedPosts.ts# Afiŝa ordigo
        ├── postFilter.ts    # Filtrado de malnetoj kaj planitaj afiŝoj
        ├── getUniqueTags.ts # Etikeda malduobligo
        ├── remarkPlayers.ts # Remark-kromaĵo por ludantoj
        ├── rehypeWrapTable.ts# Tabula ruluma kovrilo
        └── ...              # Aliaj utilaĵoj
```

## Agorda fluo

```
xingluo.config.ts
   │ defineXingluoConfig (tipaj limigoj, preterpaso)
   ▼
src/config.ts
   │ resolveConfig (kunfandi defaŭlt-valorojn + resolveComments + resolvePlayers)
   ▼
src/types/config.ts
   │ XingluoConfig (plena tipo)
   ▼
Referencita tut-eje per import config from "@/config"
```

Ŝlosilaj punktoj:

- `xingluo.config.ts` estas la sola agordodosiero kiun uzantoj devas redakti
- `resolveConfig` en `src/config.ts` faras malprofundajn kunfandojn (`site`/`posts`) kaj profundajn kunfandojn (`features.editPost`, `features.comments`, `features.players`)
- `astro.config.ts` legas la ne-resolvitan `./xingluo.config` (ĉar integriga ŝarĝado estas decidita en la Astro-agorda tavolo), do ĝi aliras `features` per opsia ĉenado
- `src/content.config.ts` legas la resolvitan `@/config`, do `features` estas deviga

## Bildiga fluo

### Paĝa bildigo

Xingluo uzas ŝablonon "maldika paĝa envolvaĵo + vida komponanto", centralizante bildigan logikon en `src/components/pageViews/`:

```
src/pages/posts/[...slug]/index.astro   ← maldika envolvaĵo: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← bildiga logiko
    │
    ▼
src/layouts/PostLayout.astro  ← afiŝa aranĝo (JSON-LD, meta de afiŝo)
    │
    ▼
src/layouts/Layout.astro      ← baza skeleto (head, SEO, FOUC, ClientRouter)
```

La maldika envolvaĵa paĝo pritraktas nur `getStaticPaths` kaj pasadon de props; la vida komponanto enhavas ĉiun bildigan logikon. La `[locale]/` spegulaj paĝoj estas ankaŭ maldikaj envolvaĵoj, generante nur ne-defaŭltajn lokojn per `getLocaleParams()`.

### Routing

```
src/pages/
├── 404.astro                      # 404 (not mirrored)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # Site-level OG image endpoint
├── rss.xml.ts                     # RSS endpoint
├── robots.txt.ts                  # robots.txt endpoint
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # Post-level OG image endpoint
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Non-default locale mirror (getStaticPaths=getLocaleParams)
    └── (structure mirrors the root, except 404, og.png, rss, robots)
```

### Post URL Derivation

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: derives the routing slug from the content collection `id` and file path, filtering `_`-prefixed directories
- `getPostUrl(id, filePath, locale)`: generates a navigable URL with the locale prefix (default locale has no prefix)

### Post Filtering and Sorting

- [`postFilter.ts`](../src/utils/postFilter.ts): excludes drafts; filters future posts in production using `pubDatetime - scheduledPostMargin`; dev shows all
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): after filtering, sorts descending by `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): deduplicates and sorts tags by slug

## Klient-flankaj skriptoj

La klient-flankaj interagoj de Xingluo estas ŝarĝitaj per `<script>`-etikedoj ĉe la malsupro de paĝoj, ĉiuj adaptitaj por View Transitions:

| Skripto               | Ŝarĝa loko                                           | Eventa adapto                                                                                           | Respondecoj                                               |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `theme.ts`            | fino de `Layout.astro` korpo                         | religu je `astro:after-swap`, portu theme-color je `astro:before-swap`, ŝanĝo de `prefers-color-scheme` | Tema persisto kaj ŝaltado                                 |
| `postEnhancements.ts` | `PostDetailView.astro`                               | reinicu je `astro:page-load`                                                                            | Titolaj ankroj, kodo-kopio, lega progreso, bilda lumkesto |
| `comments.ts`         | `Comments.astro`                                     | reskanu je `astro:page-load`                                                                            | Komenta malrapida ŝarĝado kaj tema sinkronigo             |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (kondiĉe) | reskanu je `astro:page-load`                                                                            | Ludila malrapida ŝarĝado                                  |

> Noto: `comments.ts` kaj `players.ts` ne havas supranivelan import/export; aldonu `export {}` ĉe la fino de la dosiero por marki ilin kiel modulojn kaj eviti tutmondajn deklarokonfliktojn kun aliaj dosieroj.

## Konstrua dukto

`pnpm run build` = `astro check && astro build && pagefind --site dist`

1. **`astro check`**: Tipkontrolado de TypeScript + Astro-ŝablonoj
2. **`astro build`**:
   - Kolekti enhavkolektojn (inkluzivi `.mdx` laŭ `features.mdx`)
   - Statike generi ĉiujn paĝojn (inkluzive `[locale]/` spegulojn)
   - Generi finpunktojn: RSS, retmapo, robots.txt, retej-nivelaj kaj afiŝ-nivelaj OG-bildoj
   - Kondiĉe ŝarĝi la `mdx()` integrigon; kondiĉe injekti `remarkPlayers`
   - Enkonstrui SVG-ikonojn dum konstruo (astro-icon, nula rula JS)
   - Dinamike importitaj komentaj kaj ludilaj moduloj estas dividitaj en memstarajn blokojn (malrapide ŝarĝitaj)
3. **`pagefind --site dist`**: skanas `dist/` enhavon markitan per `data-pagefind-body`, generante po-lingvajn serĉindeksojn en `dist/pagefind/`

## Rendimentaj strategioj

- **Nulaj rultempaj JS-ikonoj**: astro-icon enkonstruas Font Awesome SVG-ojn dum konstruo (sprite `<symbol>`-reĝimo)
- **SVG-optimigo**: `experimental.svgOptimizer` (svgo) kunpremas enkonstruitajn kaj referencitajn SVG-ojn
- **Laŭbezona malrapida ŝarĝado**: komentoj kaj ludiloj dinamike importas per IntersectionObserver kiam rulitaj en videblecon; nula pakaĵo kiam malŝaltitaj
- **Kondiĉaj integrigoj**: kun MDX malŝaltita, la `mdx()` integrigo ne estas ŝargita; kun ludiloj malŝaltitaj, la remark-kromaĵo ne estas injektita
- **CSS-grandeco**: Tailwind v4 generas laŭbezone; OKLCH-variabloj estas centre administritaj
- **OG-bildaj tiparoj**: uzataj nur de satori, ne injektitaj en la CSS de la retejo
- **View Transitions**: `<ClientRouter/>` funkciigas paĝtransirajn animaciojn; la serĉokesto uzas `transition:persist` por konservi staton

## Etendgvidilo

### Aldoni paĝon

1. Kreu `.astro`-dosieron en `src/pages/` (maldika envolvaĵo)
2. Create the corresponding View component in `src/components/pageViews/`
3. For multilingual support, create a same-named mirror thin wrapper in `src/pages/[locale]/`

### Adding a UI Component

Follow the shadcn style: create `.astro` components and `.ts` variant configs under `src/components/ui/` (using `class-variance-authority`).

### Adding a Client-Side Script

Create a `.ts` file in `src/scripts/`, add `export {}` at the end to mark it as a module, listen for `astro:page-load` to adapt to View Transitions, and import it in a `<script>` tag on the relevant page.
