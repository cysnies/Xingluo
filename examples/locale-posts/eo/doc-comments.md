---
title: "Komenta Sistemo"
pubDatetime: 2026-06-20T09:00:00+08:00
description: "Gvidilo pri komenta sistemo de Xingluo kovranta elekton, agordon kaj integradon de giscus, twikoo kaj waline."
tags:
  - documentation
  - comments
category: "Documentation"
translationKey: doc-comments
locale: eo
---

Xingluo integras tri komentajn sistemojn — giscus, twikoo kaj waline — elektablajn per `features.comments`.

## Agordo

Elektu provizanton kaj provizu ĝian agordon en `features.comments` en [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* giscus config */ },
    // twikoo: { /* twikoo config */ },
    // waline: { /* waline config */ },
  },
}
```

Kun `provider: false` (defaŭlte), komentoj estas malŝaltitaj kaj afiŝaj paĝoj eligas neniujn komentajn markilojn aŭ skriptojn.

## Lokigo de Komenta Sekcio

La komenta sekcio aperas nur ĉe la malsupro de **afiŝaj detalpaĝoj** (post la antaŭa/sekva navigado), renderita de [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro).

## giscus

A comment system based on GitHub Discussions; the repository must be public with Discussions enabled.

### Agordo

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // GitHub-deponejo
    repoId: "R_...",              // Deponeja ID (generita de giscus.app)
    category: "Announcements",    // Diskutkategoria nomo
    categoryId: "DIC_...",        // Kategoria ID (generita de giscus.app)
    mapping: "pathname",          // laŭvola, paĝo-al-diskuto mapado
    strict: false,                // laŭvola, strikta titola kongruo
    reactionsEnabled: true,       // laŭvola, reagoj
    inputPosition: "bottom",      // laŭvola, komenta skatola pozicio: top | bottom
    loading: "lazy",              // laŭvola, ŝarĝado: lazy | eager
  },
}
```

### Obtaining repoId / categoryId

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

### serverURL Deployment

Rigardu la [dokumentaron de Waline](https://waline.js.org/) por deploji la servilon (Vercel / Cloudflare / mem-gastigo ĉiuj funkcias), poste metu la adreson en `serverURL`.

### Kiel ĝi funkcias

waline dinamike importas `import("@waline/client")` kaj la stilon `@waline/client/style` kiam la komenta ujo eniras la viewport, poste vokas `init`. La selektilo `dark:"html.dark"` aŭtomate sekvas la malhelan reĝimon de la retejo; neniuj mana sinkronigo bezonata.

## Pigra ŝarĝado

Ĉiuj komentaj sistemoj estas pigre ŝarĝitaj per IntersectionObserver: petoj kaj inicializo okazas nur kiam la komenta ujo estas ene de 200px de la viewport, evitante unua-pentran rendimentan koston.

Vidu [`src/scripts/comments.ts`](../src/scripts/comments.ts).

## Tema Sinkronigo

Kiam la reteja temo ŝanĝiĝas, la komenta sistema temo sinkronigas aŭtomate:

| Komenta sistemo | Sinkroniga metodo                                               |
| --------------- | --------------------------------------------------------------- |
| giscus          | `postMessage({giscus:{setConfig:{theme}}})` al la iframo        |
| waline          | `dark:"html.dark"` CSS-selektilo aŭtomate sekvas                |
| twikoo          | observas `.dark` klasajn ŝanĝojn kaj rekonstruas la ekzempleron |

Tema observado uzas `MutationObserver` sur `document.documentElement`'s `class` kaj `data-theme` atributoj.

## View Transitions Adaptado

La komenta skripto aŭskultas `astro:page-load` kaj reskanas muntajn punktojn post ĉiu paĝa ŝarĝo. Re-inicializo estas malhelpita per `dataset` markiloj (`xng-setup`, `xng-init`).

## i18n

La titolo de la komenta sekcio estas lokalizita per `UIStrings.comments.title` ("Comments" en ambaŭ `zh-cn.ts` kaj `en.ts`). La UI-lingvo de la komenta sistemo estas kontrolata de la `lang` kampo de ĉiu provizanto.

## Propraj Etendaĵoj

### Ŝanĝi Provizantojn

Ŝanĝu `features.comments.provider` en `xingluo.config.ts`; neniuj kodaj ŝanĝoj necesas. Xingluo aŭtomate renderas la respondan sub-komponanton.

### Aldoni Komentan Sistemon

1. Kreu novan komponanton sub `src/components/comments/` (ekz. `Disqus.astro`) kiu renderas muntan lokokupilon
2. Aldonu novan provizantan branĉon en la kondiĉa renderado de `Comments.astro`
3. Aldonu inicializan logikon en `src/scripts/comments.ts`
4. Etendu `CommentProvider` kaj agordajn tipojn en `src/types/config.ts`
