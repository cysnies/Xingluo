# Arkitektura superrigardo

Ĉi tiu dokumento priskribas la ĝeneralan arkitekturon de Xingluo, dosierujan aranĝon, agordan fluon, bildigan fluon kaj konstruan dukton, por helpi vin kompreni kodorganizon kaj kiel pligrandigi ĝin.

## Dosieruja strukturo

```
xingluo/
├── astro.config.ts          # Agordo de Astro (integraloj, i18n, markdown, tiparoj, env)
├── xingluo.config.ts        # Enira agordo de uzanto
├── tsconfig.json            # TypeScript-agordo (strikta + @/* pado-aliaso)
├── package.json             # Dependecoj kaj skriptoj
├── public/                  # Statikaj aktivaĵoj (favicon.svg, defaŭlta OG-bildo, ktp.)
├── docs/                    # Projekta dokumentaro (ĉi tiu dosierujo)
├── references/              # Referencaj projektfontoj nur-legeblaj (ne dependindaj)
└── src/
    ├── config.ts            # Kunfandi defaŭltajn agordojn, eksporti solvitan agordon
    ├── content.config.ts    # Enhavkolektaj skemoj (posts, pages)
    ├── env.d.ts             # Deklaroj de triapartaj moduloj kaj mediaj variabloj
    ├── assets/              # Ikonkomponantoj
    │   └── icons/           # astro-icon + Font Awesome (inkluzivas socials/)
    ├── components/          # UI-komponantoj
    │   ├── ui/              # shadcn-stilaj komponantoj (Button, Card, Badge, ktp.)
    │   ├── post/            # Afiŝaj paĝkomponantoj (antaŭa/seka navigado, reen, dividi, ktp.)
    │   ├── comments/        # Komentaj sistemkomponantoj
    │   ├── mdx/             # Propraj MDX-komponantoj (APlayer, DPlayer)
    │   ├── pageViews/       # Paĝaj vidoj (centralizita paĝa bildiga logiko)
    │   └── *.astro          # Radiknivelaj komponantoj (Header, Footer, PostCard, ktp.)
    ├── content/             # Enhavaj dosieroj
    │   ├── posts/           # Blogaj afiŝoj
    │   └── pages/           # Statikaj paĝoj
    ├── i18n/                # Internaciigo
    │   ├── index.ts         # Lingvoŝarĝado kaj useTranslations
    │   ├── types.ts         # Plena UIStrings-tipo
    │   ├── routing.ts       # Lokala pado-solvado
    │   ├── staticPaths.ts   # getStaticPaths por ne-defaŭltaj lokoj
    │   ├── format.ts        # Anstataŭigo de ŝablona ĉeno
    │   └── lang/            # Lingvaj rimedaj dosieroj (zh-cn.ts, en.ts)
    ├── layouts/             # Aranĝoj
    │   ├── Layout.astro     # Baza skeleto (head, SEO, FOUC)
    │   └── PostLayout.astro # Afiŝa aranĝo (JSON-LD, artikola meta)
    ├── lib/                 # Fundamentaj utilaĵoj
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # dayjs-instancxo kaj horzonaj kromprogramoj
    │   └── socialIcons.ts   # Dinamika solvado de sociaj ikonoj
    ├── pages/               # Itineroj (radiko + [locale]/ spegulo)
    ├── scripts/             # Klientflankaj skriptoj
    │   ├── theme.ts         # Tema baskuligo
    │   ├── postEnhancements.ts # Afiŝaj plibonigoj (ankroj, kopio, lumkesto, progreso)
    │   ├── comments.ts      # Komenta pigra ŝarĝado kaj tema sinkronigo
    │   └── players.ts       # Ludila pigra ŝarĝado
    ├── styles/              # Stiloj
    │   ├── global.css       # Tailwind-eniro + baza tavolo + propraj utilaĵoj
    │   ├── theme.css        # shadcn-temaj variabloj (OKLCH)
    │   └── typography.css   # .app-prose tipografio kaj kodblokaj stiloj
    ├── types/               # Tipdeklaroj
    │   ├── config.ts        # Agordaj tipoj
    │   └── *.d.ts           # Deklaroj por netipitaj triapartaj moduloj
    └── utils/               # Utilaj funkcioj
        ├── getPostPaths.ts  # Derivo de afiŝa slug kaj URL
        ├── getSortedPosts.ts# Ordigado de afiŝoj
        ├── postFilter.ts    # Filtrado de malnetoj kaj planitaj afiŝoj
        ├── getUniqueTags.ts # Malduobligo de etikedoj
        ├── remarkPlayers.ts # Ludila remark-kromprogramo
        ├── rehypeWrapTable.ts# Ruluma envolvaĵo de tabelo
        └── ...              # Aliaj utilaĵoj
```

## Agorda fluo

```
xingluo.config.ts
   │ defineXingluoConfig (tipaj limigoj, trairo)
   ▼
src/config.ts
   │ resolveConfig (kunfandi defaŭltojn + resolveComments + resolvePlayers)
   ▼
src/types/config.ts
   │ XingluoConfig (plena tipo)
   ▼
Referencita tutsite per import config from "@/config"
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
src/layouts/PostLayout.astro  ← afiŝa aranĝo (JSON-LD, artikola meta)
    │
    ▼
src/layouts/Layout.astro      ← baza skeleto (head, SEO, FOUC, ClientRouter)
```

La maldika envolvaĵa paĝo pritraktas nur `getStaticPaths` kaj trapaso de props; la vida komponanto enhavas ĉiun bildigan logikon. La `[locale]/` spegulaj paĝoj estas same maldikaj envolvaĵoj, generantaj nur ne-defaŭltajn lokojn per `getLocaleParams()`.

### Vojigo

```
src/pages/
├── 404.astro                      # 404 (ne speguligita)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # Site-nivela OG-bilda finpunkto
├── rss.xml.ts                     # RSS-finpunkto
├── robots.txt.ts                  # robots.txt-finpunkto
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # Afiŝ-nivela OG-bilda finpunkto
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Ne-defaŭlta loka spegulo (getStaticPaths=getLocaleParams)
    └── (strukturo spegulas la radikon, krom 404, og.png, rss, robots)
```

### Derivo de afiŝa URL

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: derivas la vojigan slug de la `id` de enhavkolekto kaj dosierovojo, filtrado de `_`-prefiksajn dosierujojn
- `getPostUrl(id, filePath, locale)`: generas navigeblan URL kun la loka prefikso (defaŭlta loko havas neniun prefikson)

### Filtrado kaj ordigo de afiŝoj

- [`postFilter.ts`](../src/utils/postFilter.ts): ekskludas malnetojn; filtras estontajn afiŝojn en produktado uzante `pubDatetime - scheduledPostMargin`; dev montras ĉiujn
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): post filtrado, ordigas malkreske per `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): malduobligas kaj ordigas etikedojn per slug

## Klientflankaj skriptoj

La klientflankaj interagoj de Xingluo estas ŝarĝitaj per `<script>`-etikedoj ĉe la malsupro de paĝoj, ĉiuj adaptitaj por View Transitions:

| Skripto               | Ŝarĝa loko                                           | Eventa adapto                                                                                           | Respondecoj                                               |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `theme.ts`            | fino de `Layout.astro` body                          | religu je `astro:after-swap`, portu theme-color je `astro:before-swap`, ŝanĝo de `prefers-color-scheme` | Tema persisto kaj baskuligo                               |
| `postEnhancements.ts` | `PostDetailView.astro`                               | reinicu je `astro:page-load`                                                                            | Titolaj ankroj, kodo-kopio, lega progreso, bilda lumkesto |
| `comments.ts`         | `Comments.astro`                                     | reskane je `astro:page-load`                                                                            | Komenta pigra ŝarĝado kaj tema sinkronigo                 |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (kondiĉa) | reskane je `astro:page-load`                                                                            | Ludila pigra ŝarĝado                                      |

> Noto: `comments.ts` kaj `players.ts` ne havas supranivelan import/export; aldonu `export {}` ĉe la fino de la dosiero por marki ilin kiel modulojn kaj eviti tutmondajn deklarokonfliktojn kun aliaj dosieroj.

## Konstrua dukto

`pnpm run build` = `astro check && astro build && node scripts/generateSearchIndex.mjs`

1. **`astro check`**: Tipo-kontrolado de TypeScript + Astro-ŝablonoj
2. **`astro build`**:
   - Kolekti enhavkolektojn (inkluzivi `.mdx` bazitan sur `features.mdx`)
   - Statike generi ĉiujn paĝojn (inkluzive `[locale]/` spegulojn)
   - Generi finpunktojn: RSS, retmapo, robots.txt, site-nivelaj kaj afiŝ-nivelaj OG-bildoj
   - Kondiĉe ŝarĝi la `mdx()` integrigon; kondiĉe injekti `remarkPlayers`
   - Enkonstrui SVG-ikonojn dum konstruo (astro-icon, nula rula JS)
   - Dinamike importitaj komentaj kaj ludilaj moduloj estas dividitaj en memstarajn blokojn (pigre ŝarĝitaj)
3. **`node scripts/generateSearchIndex.mjs`**: skanas HTML-dosierojn en `dist/`, analizas paĝan enhavon, generante po-lingvajn serĉindeksojn en `dist/search/`

## Rendimentaj strategioj

- **Nulaj rultempaj JS-ikonoj**: astro-icon enkonstruas Font Awesome SVG-ojn dum konstruo (sprite `<symbol>`-reĝimo)
- **SVG-optimigo**: `experimental.svgOptimizer` (svgo) kunpremas enkonstruitajn kaj referencitajn SVG-ojn
- **Laŭbezona pigra ŝarĝado**: komentoj kaj ludiloj dinamike importas per IntersectionObserver kiam rulitaj en videblecon; nula pakaĵo kiam malŝaltitaj
- **Kondiĉaj integrigoj**: kun MDX malŝaltita, la `mdx()` integrigo ne estas ŝargita; kun ludiloj malŝaltitaj, la remark-kromprogramo ne estas injektita
- **CSS-grandeco**: Tailwind v4 generas laŭbezone; OKLCH-variabloj estas centre administritaj
- **OG-bildaj tiparoj**: uzataj nur de satori, ne injektitaj en la CSS de la retejo
- **View Transitions**: `<ClientRouter/>` funkciigas paĝtransirajn animaciojn; la serĉokesto uzas `transition:persist` por konservi staton

## Etendgvidilo

### Aldoni paĝon

1. Kreu `.astro`-dosieron en `src/pages/` (maldika envolvilo)
2. Kreu la respondan Vidkomponanton en `src/components/pageViews/`
3. Por plurlingva subteno, kreu samnoman spegulan maldikan envolvilon en `src/pages/[locale]/`

### Aldoni UI-komponanton

Sekvu la shadcn-stilon: kreu `.astro`-komponantojn kaj `.ts`-variantajn agordojn sub `src/components/ui/` (uzante `class-variance-authority`).

### Aldoni klientflankan skripton

Kreu `.ts`-dosieron en `src/scripts/`, aldonu `export {}` ĉe la fino por marki ĝin kiel modulon, aŭskultu `astro:page-load` por adaptiĝi al View Transitions, kaj importu ĝin en `<script>`-etikedo sur la koncerna paĝo.
