# Serĉo

Xingluo integras [Pagefind](https://pagefind.app/) por statika plenteksta serĉo, kun po-lingvaj indeksoj kaj View Transitions stato-persistado.

## Aktivigo

Agordu per `features.search`:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

Kiam agordita al `false`, la serĉpaĝo faras `Astro.rewrite` al 404 kaj neniu serĉa UI estas generita.

## Kiel ĝi funkcias

### Generado de indekso

La tria konstrutpaŝo, `pagefind --site dist`, skanas la `dist/` dosierujon:

- Nur paĝoj kun la atributo `data-pagefind-body` estas indeksitaj
- Indeksoj estas aŭtomate dividitaj per lingvo (`zh-cn` kaj `en` ĉiu ricevas sian propran)
- Indeksoj estas eligitaj al `dist/pagefind/`

### Amplekso de indekso

La `<main>` sur afiŝaj detalpaĝoj estas markita `data-pagefind-body`, do nur afiŝaj korpoj estas indeksitaj. Aliaj paĝoj (ĉefpaĝo, listoj, arkivoj, ktp.) ne eniras la serĉindekson.

## Serĉa UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementas la serĉpaĝon:

- Ŝarĝas `@pagefind/default-ui` por la serĉokesto kaj rezultolisto
- Lokas indeksajn aktivaĵojn per `getAssetPath("pagefind/")`
- Tutmondaj stiloj anstataŭas Pagefind-CSS-variablojn, mapante ilin al la temo de Xingluo (`--background`, `--foreground`, `--primary`, ktp.)
- `transition:persist` konservas serĉostaton trans navigado

### Serĉa fluo

1. La uzanto tajpas en la serĉokesto
2. Pagefind kongruas kontraŭ la nuna lingva indekso
3. La rezultolisto montras kongruajn afiŝojn (titolon, resuman reliefigon)
4. `processTerm` skribas la serĉpaĝan URL-on kun demando-parametroj al sessionStorage, por ke la reen-butono restarigu

## Fonta reen-navigado

La reen-navigada mekanismo inter la serĉpaĝo kaj afiŝaj paĝoj:

- La `Main.astro` komponanto skribas la fontan paĝan URL-on al `backUrl` de sessionStorage
- La `BackButton.astro` de la afiŝa paĝo preferas salti reen al `backUrl` de sessionStorage, aŭ al la ĉefpaĝo se forestas
- La `processTerm` de la serĉpaĝo skribas la URL-on kun demando-parametroj, restarigante la serĉostaton kiam revenante de afiŝo

## Plurlingva serĉo

Pagefind dividas indeksojn per la lingva atributo de `data-pagefind-body` elementoj:

- `zh-cn` paĝoj (radiko) → Ĉina indekso
- `en` paĝoj (`/en/` prefikso) → Angla indekso

Serĉo aŭtomate kongruas la indekson por la nuna paĝa lingvo: Ĉina sur ĉinaj paĝoj, Angla sur anglaj paĝoj.

## Tema adaptiĝo

La defaŭlta UI de Pagefind havas siajn proprajn CSS-variablojn; Xingluo anstataŭas ilin per tutmondaj stiloj en `SearchView.astro`, mapante al shadcn-temaj variabloj:

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

Malhela reĝimo ŝaltas aŭtomate per la selektilo `.dark`, konsista kun la reteja temo.

## Rendimento

- Pagefind-indeksoj estas statikaj dosieroj; serĉo okazas klientflanke sen servilaj petoj
- Indeksoj estas ŝarĝitaj laŭbezone (indeksaj fragmentoj elŝutiĝas nur dum serĉado)
- `transition:persist` evitas re-inicializi la serĉan UI-on sur navigado
