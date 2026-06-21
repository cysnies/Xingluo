---
title: "Serĉo"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Gvidilo pri serĉo de Xingluo kovranta Flexsearch-plentekstan serĉintegriĝon, indeksgeneradon, UI, plurlingvan serĉon kaj rendimenton."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: eo
---

Xingluo integras [Flexsearch](https://github.com/nextapps-de/flexsearch) por klientflanka plenteksta serĉo, kun po-lingvaj indeksoj kaj View Transitions stato-persistado.

## Aktivigo

Agordu per `features.search`:

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

Kiam agordita al `false`, la serĉpaĝo faras `Astro.rewrite` al 404 kaj neniu serĉa UI estas generita.

## Kiel ĝi funkcias

### Generado de indekso

La tria konstrutpaŝo, `node scripts/generateSearchIndex.mjs`, skanas HTML-dosierojn en la `dist/` dosierujo:

- Analizas paĝan enhavon kaj ĉerpas afiŝan tekston
- Indeksoj estas aŭtomate dividitaj per lingvo (`zh-cn` kaj `en` ĉiu ricevas sian propran)
- Indeksoj estas eligitaj al `dist/search/`

### Amplekso de indekso

La konstrua skripto analizas la `<main>` enhavon sur afiŝaj detalpaĝoj, do nur afiŝaj korpoj estas indeksitaj. Aliaj paĝoj (ĉefpaĝo, listoj, arkivoj, ktp.) ne eniras la serĉindekson.

## Serĉa UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementas la serĉpaĝon:

- Uzas Flexsearch-klientflankan indekson por serĉa kongruo en la retumilo
- Lokas indeksajn aktivaĵojn per `getAssetPath("search/")`
- Uzas shadcn-temajn variablojn (`--background`, `--foreground`, `--primary`, ktp.) por serĉokesto kaj rezultolista stilo
- `transition:persist` konservas serĉostaton trans navigado

### Serĉa fluo

1. La uzanto tajpas en la serĉokesto
2. Flexsearch kongruas kontraŭ la nuna lingva indekso
3. La rezultolisto montras kongruajn afiŝojn (titolon, publikigajn/ĝisdatigajn datojn, kategorio-emblemon, etikedojn, kongruan teksteron)
4. `processTerm` skribas la serĉpaĝan URL-on kun demando-parametroj al sessionStorage, por ke la reen-butono restarigu

## Fonta reen-navigado

La reen-navigada mekanismo inter la serĉpaĝo kaj afiŝaj paĝoj:

- La `Main.astro` komponanto skribas la fontan paĝan URL-on al `backUrl` de sessionStorage
- La `BackButton.astro` de la afiŝa paĝo preferas salti reen al `backUrl` de sessionStorage, aŭ al la ĉefpaĝo se forestas
- La `processTerm` de la serĉpaĝo skribas la URL-on kun demando-parametroj, restarigante la serĉostaton kiam revenante de afiŝo

## Plurlingva serĉo

Flexsearch dividas indeksojn per paĝa lingvo:

- `zh-cn` paĝoj (radiko) → Ĉina indekso
- `en` paĝoj (`/en/` prefikso) → Angla indekso

Serĉo aŭtomate kongruas la indekson por la nuna paĝa lingvo: Ĉina sur ĉinaj paĝoj, Angla sur anglaj paĝoj.

## Tema adaptiĝo

Flexsearch-serĉa UI uzas shadcn-temajn variablojn, difinitajn en `SearchView.astro` por serĉokesto kaj rezultolista stilo:

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

Malhela reĝimo ŝaltas aŭtomate per la selektilo `.dark`, konsista kun la reteja temo.

## Rendimento

- Flexsearch-indeksoj estas statikaj dosieroj; serĉo okazas klientflanke sen servilaj petoj
- Indeksoj estas ŝarĝitaj laŭbezone (indeksaj fragmentoj elŝutiĝas nur dum serĉado)
- `transition:persist` evitas re-inicializi la serĉan UI-on sur navigado
