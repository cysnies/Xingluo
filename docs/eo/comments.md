# Komenta sistemo

Xingluo integras tri komentajn sistemojn — giscus, twikoo kaj waline — elektablajn per `features.comments`.

## Agordo

Elektu provizanton kaj enmetu ĝian agordon en `features.comments` en [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* giscus-agordo */ },
    // twikoo: { /* twikoo-agordo */ },
    // waline: { /* waline-agordo */ },
  },
}
```

Kun `provider: false` (defaŭlta), komentoj estas malŝaltitaj kaj afiŝaj paĝoj ne eligas komentajn markilojn aŭ skriptojn.

## Loko de komenta sekcio

La komenta sekcio aperas nur malsupre de **paĝoj de detaloj de afiŝoj** (post la antaŭa/sekva navigado), renderita de [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro).

## giscus

Komenta sistemo bazita sur GitHub-Diskutoj; la deponejo devas esti publika kun Diskutoj ebligitaj.

### Agordo

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // GitHub-deponejo
    repoId: "R_...",              // Deponeja ID (generita de giscus.app)
    category: "Announcements",    // Nomo de diskuta kategorio
    categoryId: "DIC_...",        // Kategoria ID (generita de giscus.app)
    mapping: "pathname",          // laŭvola, paĝo-al-diskuta mapado
    strict: false,                // laŭvola, strikta titolomendado
    reactionsEnabled: true,       // laŭvola, reagoj
    inputPosition: "bottom",      // laŭvola, pozicio de komenta skatolo: top | bottom
    loading: "lazy",              // laŭvola, ŝarĝado: lazy | eager
  },
}
```

### Akiro de repoId / categoryId

1. Vizitu [giscus.app](https://giscus.app)
2. Enigu la deponejon kaj kategorion por generi la agordon
3. Kopiu `data-repo-id` kaj `data-category-id` en vian agordon

### Kiel ĝi funkcias

giscus injektas iframe per la oficiala `client.js`, kun `data-*` atributoj portantaj la agordon. La lingvo aŭtomate mapiĝas al la nuna lokaĵo (`zh-cn` → `zh-CN`, `en` → `en`). La temo estas sinkronigita per `postMessage`.

## twikoo

Komenta sistemo sen backend-dependeco, subtenante Tencent CloudBase aŭ mem-gastigo.

### Agordo

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // Nuba media ID aŭ plena mem-gastiga URL
    lang: "zh-CN",                            // laŭvola, lingvo
  },
}
```

### Notoj pri envId

- Tencent CloudBase: plenigu la medan ID (bezonas la cloudbase SDK)
- Mem-gastigita: plenigu la plenan URL (ekz. `https://twikoo.example.com`); twikoo aŭtomate detektas HTTP API-reĝimon

### Kiel ĝi funkcias

twikoo dinamike `import("twikoo")` kaj vokas `init` kiam la komenta ujo eniras la viewport. twikoo ne subtenas dumtempan temoŝanĝon; la retejo rekonstruas ĝin ĉe tema ŝanĝo por apliki malhelajn stilojn.

## waline

Backend-subtenata komenta sistemo kun komentokalkuloj kaj vidkalkuloj.

### Agordo

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Waline-servila adreso
    lang: "zh-CN",                           // laŭvola, lingvo
    pageSize: 10,                            // laŭvola, komenta paĝgrandeco
    dark: "html.dark",                       // laŭvola, malhela selektilo (defaŭlte sekvas site .dark)
  },
}
```

### serverURL-aj deplojo

Rigardu la [dokumentaron de Waline](https://waline.js.org/) por deploji la servilon (Vercel / Cloudflare / mem-gastigo ĉiuj funkcias), poste metu la adreson en `serverURL`.

### Kiel ĝi funkcias

waline dinamike importas `import("@waline/client")` kaj la stilon `@waline/client/style` kiam la komenta ujo eniras la viewport, poste vokas `init`. La selektilo `dark:"html.dark"` aŭtomate sekvas la malhelan reĝimon de la retejo; neniuj mana sinkronigo bezonata.

## Pigra ŝarĝado

Ĉiuj komentaj sistemoj estas ŝarĝataj pigre per IntersectionObserver: petoj kaj inicializo okazas nur kiam la komenta ujo estas ene de 200px de la viewport, evitante rendimentan koston de unua pentrado.

Vidu [`src/scripts/comments.ts`](../src/scripts/comments.ts).

## Temo-sinkronigo

Kiam la reteja temo ŝanĝiĝas, la komenta sistemo-temo sinkroniĝas aŭtomate:

| Komenta sistemo | Sinkroniga metodo                                           |
| --------------- | ----------------------------------------------------------- |
| giscus          | `postMessage({giscus:{setConfig:{theme}}})` al la iframe    |
| waline          | CSS-selektilo `dark:"html.dark"` aŭtomate sekvas            |
| twikoo          | observas `.dark`-klasŝanĝojn kaj rekonstruas la ekzempleron |

Tema observado uzas `MutationObserver` sur la atributoj `class` kaj `data-theme` de `document.documentElement`.

## View Transitions-adaptado

La komenta skripto aŭskultas `astro:page-load` kaj reskanas montopunktojn post ĉiu paĝoŝarĝo. Re-inicializo estas malhelpita per `dataset`-markiloj (`xng-setup`, `xng-init`).

## i18n

La titolo de la komenta sekcio estas lokalizita per `UIStrings.comments.title`. La lingvo de la komenta sistemo-interfaco estas kontrolita de la `lang`-kampo de ĉiu provizanto.

## Propraj etendaĵoj

### Ŝanĝi provizantojn

Ŝanĝu `features.comments.provider` en `xingluo.config.ts`; neniuj kodŝanĝoj bezonatas. Xingluo aŭtomate renderas la respondan subkomponanton.

### Aldoni komentan sistemon

1. Kreu novan komponanton sub `src/components/comments/` (ekz. `Disqus.astro`) kiu renderas muntan lokokupilon
2. Aldonu novan provizantan branĉon en la kondiĉa renderado de `Comments.astro`
3. Aldonu inicialigan logikon en `src/scripts/comments.ts`
4. Etendu `CommentProvider` kaj agordajn tipojn en `src/types/config.ts`
