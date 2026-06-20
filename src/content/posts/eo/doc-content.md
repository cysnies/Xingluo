---
title: "Enhava Kreado"
pubDatetime: 2026-06-20T05:00:00+08:00
description: "Gvidilo pri enhava kreado de Xingluo kovranta afiŝan frontmatter, Markdown/MDX-sintakson, kodreliefigon, callouts kaj enhavajn plibonigojn."
tags:
  - documentation
  - writing
category: "Documentation"
translationKey: doc-content
locale: eo
---

Xingluo uzas Astro Content Collections por adminstri enhavon, subtenante Markdown (`.md`) kaj MDX (`.mdx`, postulas `features.mdx`).

## Enhavaj kolektoj

Du kolektoj estas difinitaj en [`src/content.config.ts`](../src/content.config.ts):

| Kolekto | Dosierujo            | Celo                             |
| ------- | -------------------- | -------------------------------- |
| `posts` | `src/content/posts/` | Blogaj afiŝoj                    |
| `pages` | `src/content/pages/` | Statikaj paĝoj (ekz. la pripaĝo) |

Dosiernomaj konvencioj:

- Dosieroj aŭ dosierujoj komenciĝantaj per `_` estas ignoritaj (utilaj por malnetoj)
- Kun MDX ebligita, `**/*.{md,mdx}` estas kolektita; alie nur `**/*.md`
- Afiŝaj URL-oj estas derivitaj de la dosiervojo (vidu la vojigan sekcion en [Arkitektura superrigardo](./doc-architecture.md))

## Afiŝa Frontmatter

Plenaj kampoj por la `posts` kolekto:

```markdown
---
title: "Post Title" # required
pubDatetime: 2026-06-19T10:00:00+08:00 # required, publish time
modDatetime: 2026-06-20T10:00:00+08:00 # optional, update time
description: "Summary, used for SEO and lists" # required
tags: ["Astro", "blog"] # optional, defaults to ["others"]
featured: true # optional, featured (shown on homepage)
draft: false # optional, drafts are not published
author: "Xingluo" # optional, defaults to site.author
ogImage: "./cover.png" # optional, OG image (image import or string path)
canonicalURL: "https://..." # optional, canonical link
hideEditPost: false # optional, hide the edit link
timezone: "Asia/Shanghai" # optional, override the site timezone
---
```

### Kampo-Referenco

| Kampo            | Tipo            | Defaŭlte        | Notoj                                                                                                              |
| ---------------- | --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ |
| `title`          | string          | deviga          | Titolo de afiŝo                                                                                                    |
| `pubDatetime`    | date            | deviga          | Publikiga tempo, ISO 8601                                                                                          |
| `modDatetime`    | date            | —               | Ĝisdatiga tempo; montras etikedon "ĝisdatigita"                                                                    |
| `description`    | string          | deviga          | Resumo, uzata en meta, RSS kaj listkartoj                                                                          |
| `tags`           | string[]        | `["others"]`    | Tabelo de etikedoj; etikedaj paĝoj estas aŭtomate generitaj                                                        |
| `featured`       | boolean         | —               | Montrata en la "Elstaraj" sekcio de la hejmpaĝo                                                                    |
| `draft`          | boolean         | —               | Malneto; filtrita en produktaj konstruoj (videbla en developado)                                                   |
| `author`         | string          | `site.author`   | Nomo de aŭtoro                                                                                                     |
| `ogImage`        | image \| string | —               | OG-bildo; `image()` trairas la aktivaĵtubon de Astro, ĉeno estas `public/` vojo aŭ ekstera URL                     |
| `canonicalURL`   | string          | —               | Kanona ligilo, superregas la defaŭltan (vidu [SEO](./doc-seo.md))                                                  |
| `hideEditPost`   | boolean         | —               | Kaŝi la redaktan ligilon por ĉi tiu afiŝo                                                                          |
| `timezone`       | string          | `site.timezone` | Superregi la montran horzonon por ĉi tiu afiŝo                                                                     |
| `locale`         | string          | `site.lang`     | Lingvo en kiu la afiŝo estas verkita, ekz. `"en"`, `"ja"`. Defaŭlte al la reteja lingvo kiam ne fiksita            |
| `translationKey` | string          | —               | Traduka grupa ŝlosilo: afiŝoj kun sama ŝlosilo estas tradukoj unu de la alia. Afiŝoj sen ŝlosilo estas sendependaj |
| `category`       | string          | —               | Kategorio de afiŝo (unu valoro), generas paĝon `/categories/<slug>/`; nefiksita signifas sen kategorio             |

### Enhav-Nivela Tradukado

Uzu la `locale` kaj `translationKey` frontmatter-kampojn por krei multlingvajn versiojn de viaj afiŝoj:

1. Metu la defaŭlt-lingvan afiŝon ĉe `src/content/posts/<slug>.md`
2. Metu tradukojn en lingvaj subdosierujoj: `src/content/posts/<locale>/<slug>.md` (ekz. `en/welcome.md`)
3. Agordu `locale` al la lingvo de la traduko kaj `translationKey` al la sama valoro kiel la originalo

La vojiga tavolo aŭtomate solvas la ĝustan tradukon po lingvo kaj forigas dupojn en listoj — la sama afiŝo en malsamaj lingvoj montras nur unu karton po lingvo. Afiŝoj sen traduko falas reen al la originala enhavo. Vidu [Internaciigo](./doc-i18n.md).

### Planita Publikigo

Afiŝoj kun estontaj tempomarkoj estas filtritaj en produktado uzante la `scheduledPostMargin` toleremon: se `pubDatetime` estas ene de la tolerema fenestro (defaŭlte 15 minutoj) de la nuna tempo, la afiŝo estas traktata kiel publikigita. En developado, ĉiuj ne-malnetaj afiŝoj estas videblaj.

## Statika Paĝa Frontmatter

La `pages` kolekto havas pli simplajn kampojn:

```markdown
---
title: "About"
description: "About this site" # optional
ogImage: "default-og.jpg" # optional, string only
canonicalURL: "https://..." # optional
---
```

The about page is fetched via `getEntry("pages", "about")` and requires creating `src/content/pages/about.md`.

## Markdown Plibonigoj

Xingluo inkluzivas la jenajn remark / rehype kromprogramojn (vidu `astro.config.ts`):

### Enhavtabelo

`remark-toc` generas la enhavtabelon aŭtomate; `remark-collapse` kunfalcas ĝin defaŭlte. Enmetu la lokokupilon en afiŝo:

```markdown
## Enhavtabelo

(La enhavtabelo estas aŭtomate plenigita ĉi tie)
```

### Atentigoj

`rehype-callouts` subtenas Obsidian-stilajn atentigojn:

```markdown
> [!NOTE]
> Enhavo de noto

> [!WARNING]
> Enhavo de averto

> [!TIP]
> Enhavo de konsilo
```

Subtenataj tipoj: `NOTE`, `TIP`, `INFO`, `WARNING`, `DANGER`, `SUCCESS`, `QUESTION`, `FAILURE`, kaj pli.

### Koda Reliefigo

Shiki du-tema (hela `min-light`, malhela `night-owl`) subtenas:

- Linia reliefigo: ` ```js {1,3-5} `
- Vorta reliefigo: ` ```js /word/ `
- Dif-markiloj: `+` / `-` ĉe linikomenco
- Dosiernomaj etikedoj: ` ```js file=src/index.ts ` aŭ `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // reliefigita linio
}
```

### Tabeloj

Vastaj tabeloj estas aŭtomate envolvitaj en horizontale rulebla ujo (la `rehypeWrapTable` kromprogramo), malhelpante trofluon sur mallarĝaj ekranoj.

## MDX Subteno

Kun `features.mdx` ebligita (defaŭlte), vi povas uzi `.mdx` dosierojn por komponanto-movita verkado.

### Propraj Komponantoj

La enkonstruitaj MDX-komponantoj de Xingluo estas en [`src/components/mdx/`](../src/components/mdx) kaj estas importitaj de unueca eniro:

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# Mia Afiŝo

<APlayer
  audio={[
    {
      name: "Kanto",
      artist: "Artisto",
      url: "/audio.mp3",
      cover: "/cover.jpg",
    },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

Vidu [Aŭdvidaĵaj ludiloj](./doc-media-players.md) por detaloj.

### Malŝalti MDX

Kun `features.mdx: false`:

- La `mdx()` integriĝo ne estas ŝarĝita
- La enhava kolekta glob kongruas nur `*.md` (ekzistantaj `.mdx` dosieroj ne estas kolektitaj)
- La konstrua eligo enhavas neniun MDX-runtempon

## Komentoj

La komenta sistemo estas aŭtomate renderita ĉe la malsupro de afiŝaj detalpaĝoj (agordu la provizanton en `features.comments`). Vidu [Komenta sistemo](./doc-comments.md).

## Legada Tempo

Taksita legada tempo estas aŭtomate montrata sur afiŝaj detalpaĝoj kaj listkartoj:

- **CJK-lingvoj** (zh-cn, ja, ko): kalkulita per CJK-signokvanto, ~400 signoj por minuto
- **Aliaj lingvoj**: kalkulita per vortokvanto (blankospaca divido), ~200 vortoj por minuto
- Rezulto rondigita supren, minimumo 1 minuto

Antaŭ kalkulado, kodblokoj, HTML-etikedoj, Markdown-ligilaj URL-oj kaj alia ne-enhava enhavo estas forigitaj por teni la takson proksima al efektiva lega volumo. Neniu agordo necesas.

## Rilataj Afiŝoj

Ĝis 2 rilataj afiŝoj estas montritaj ĉe la malsupro de afiŝaj detalpaĝoj (post antaŭa/sekva navigado):

- Ordigitaj laŭ nombro de komunaj etikedoj, descenda
- Sama poentaro ordigita laŭ publikiga dato, descenda (preferante pli novajn afiŝojn)
- Sekcio ne estas renderita kiam neniuj afiŝoj kunhavas etikedojn
- Aŭtomate ignorita de la pagefind serĉa indekso

Neniu agordo necesas.

## Fiksita Enhavtabela Flankbreto

Fiksita enhavtabela flankbreto aperas dekstre de afiŝaj detalpaĝoj sur grandaj ekranoj (≥1024px):

- Aŭtomate generita el h2–h6 titoloj en la artikolo, prezentita kiel plata dentita listo
- Deveno reflektas titolan profunden (h3 havas unu plian nivelon de deŝovo ol h2)
- Nuna sekcio estas reliefigita dum vi rulumas (IntersectionObserver)
- Alklako de TOC-eniro glate rulumas al la responda titolo
- Kaŝita sur malgrandaj ekranoj (poŝtelefono), kie la enlinia kunfaldebla TOC haveblas

Generita el la `headings` returnitaj de Astro's `render()` — neniuj mana TOC-bontenado de la aŭtoro. La enlinia `remark-toc` kunfaldebla TOC (skribu `## Enhavtabelo` en via afiŝo) kunekzistas kun la flankbreto por malgrandekrana uzo.

## Kategorioj

Asignu kategorion al afiŝo per la `category` frontmatter-kampo (unu ĉeno):

```yaml
---
title: "Mia Afiŝo"
category: "lernilo"
---
```

- La kategoria paĝo troviĝas ĉe `/categories/<slug>/`; la ŝlosvorto estas normaligita per `slugifyStr` (CJK konservita, Latinlitera minuskle kun streketoj)
- La kategoria indekso ĉe `/categories/` listigas ĉiujn kategoriojn
- Afiŝaj kartoj kaj detalpaĝoj aŭtomate montras kategorian ligilon (alklaku por salti al la kategoria paĝo)
- Afiŝo apartenas al maksimume unu kategorio (male al multoblaj `tags`); afiŝoj sen `category` aperas en neniu kategorio
- Kategoriaj paĝoj reuzas `posts.perPage` por paĝigado kaj subtenas multlingvajn spegulajn vojojn (`/en/categories/...`)
- Malŝalti kategoriojn per `features.showCategories: false` (nava eniro kaj paĝoj forigitaj, retmapo filtrila)
