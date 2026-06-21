# Enhava kreado

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
- Afiŝaj URL-oj estas derivitaj de la dosiervojo (vidu la vojigan sekcion en [Arkitektura superrigardo](./architecture.md))

## Afiŝa Frontmatter

Plenaj kampoj por la `posts`-kolekto:

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
heroImage: "./hero.png" # optional, hero image (shown between back button and title, also on right of cards)
heroImageFit: "cover" # optional, hero image fit mode (cover crop-to-fill / contain full-scale), defaults to cover
canonicalURL: "https://..." # optional, canonical link
hideEditPost: false # optional, hide the edit link
timezone: "Asia/Shanghai" # optional, override the site timezone
---
```

### Kampa referenco

| Kampo            | Tipo                     | Defaŭlte        | Notoj                                                                                                                                                                        |
| ---------------- | ------------------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`          | string                   | deviga          | Afiŝa titolo                                                                                                                                                                 |
| `pubDatetime`    | date                     | deviga          | Publikiga tempo, ISO 8601                                                                                                                                                    |
| `modDatetime`    | date                     | —               | Ĝisdatiga tempo; montras "ĝisdatigitan" etikedon                                                                                                                             |
| `description`    | string                   | deviga          | Resumo, uzata en meta, RSS, kaj listaj kartoj                                                                                                                                |
| `tags`           | string[]                 | `["others"]`    | Etikeda tabelo; etikedaj paĝoj estas aŭtomate generitaj                                                                                                                      |
| `featured`       | boolean                  | —               | Montrata en la "Elstaraj" sekcio de la ĉefpaĝo                                                                                                                               |
| `draft`          | boolean                  | —               | Malneto; filtrita en produktaj konstruoj (videbla en dev)                                                                                                                    |
| `author`         | string                   | `site.author`   | Aŭtora nomo                                                                                                                                                                  |
| `ogImage`        | image \| string          | —               | OG-bildo; `image()` trapasas la aktivaĵdukton de Astro, string estas `public/` vojo aŭ ekstera URL                                                                           |
| `heroImage`      | image \| string          | —               | Hero-bildo montrata sur la detalpaĝo inter la reen-butono kaj la titolo, ankaŭ dekstre de kartoj (kontrolita de `features.showPostCardHero`/`showPostDetailHero`)            |
| `heroImageFit`   | `"cover"` \| `"contain"` | `"cover"`       | Adapta reĝimo de hero-bildo: `"cover"` tondas por plenigi (konservas proporciojn, povas tondi randojn); `"contain"` plenskale (konservas proporciojn, povas lasi malplenojn) |
| `canonicalURL`   | string                   | —               | Kanona ligilo, anstataŭas la defaŭltan (vidu [SEO](./seo.md))                                                                                                                |
| `hideEditPost`   | boolean                  | —               | Kaŝi la redaktan ligilon por tiu afiŝo                                                                                                                                       |
| `timezone`       | string                   | `site.timezone` | Anstataŭigi la montreblan horzonon por tiu afiŝo                                                                                                                             |
| `locale`         | string                   | `site.lang`     | Lingvo en kiu la afiŝo estas skribita, ekz. `"en"`, `"ja"`. Defaŭlte la reteja lingvo kiam ne fiksita                                                                        |
| `translationKey` | string                   | —               | Traduka grupo-ŝlosilo: afiŝoj kun la sama ŝlosilo estas tradukoj unu de la alia. Afiŝoj sen ŝlosilo estas sendependaj                                                        |
| `category`       | string                   | —               | Afiŝa kategorio (ununura valoro), generas `/categories/<slug>/` paĝon; nefiksita signifas neniun kategorion                                                                  |

### Enhav-nivela traduko

Uzu la frontmatter-kampojn `locale` kaj `translationKey` por krei plurlingvajn versiojn de viaj afiŝoj:

1. Metu la afiŝon en la defaŭlta lingvo ĉe `src/content/posts/<slug>.md`
2. Metu tradukojn en lingvaj subdosierujoj: `src/content/posts/<locale>/<slug>.md` (ekz. `en/welcome.md`)
3. Agordu `locale` al la lingvo de la traduko kaj `translationKey` al la sama valoro kiel la originalo

La vojiga tavolo aŭtomate solvas la ĝustan tradukon por ĉiu lingvo kaj forigas duoblaĵojn en listoj — la sama afiŝo en malsamaj lingvoj montras nur unu karton por lingvo. Afiŝoj sen traduko revenas al la originala enhavo. Vidu [Internaciigo](./i18n.md).

### Planita publikigado

Afiŝoj kun estontaj tempomarkoj estas filtritaj en produktado uzante la toleremon `scheduledPostMargin`: se `pubDatetime` estas ene de la tolerema fenestro (defaŭlte 15 minutoj) de la nuna tempo, la afiŝo estas traktata kiel publikigita. En evoluigo, ĉiuj ne-malnetaj afiŝoj estas videblaj.

## Frontmatter de statikaj paĝoj

La kolekto `pages` havas pli simplajn kampojn:

```markdown
---
title: "Pri"
description: "Pri ĉi tiu retejo" # nedeviga
ogImage: "default-og.jpg" # nedeviga, nur ĉeno
canonicalURL: "https://..." # nedeviga
---
```

La pri-paĝo estas prenita per `getEntry("pages", "about")` kaj postulas krei `src/content/pages/about.md`.

## Markdown-plibonigoj

Xingluo venas kun la sekvaj remark / rehype kromprogramoj (vidu `astro.config.ts`):

### Enhavotabelo

`remark-toc` generas la enhavotabelon aŭtomate; `remark-collapse` ĝin faldebligas defaŭlte. Enmetu la lokokupilon en afiŝo:

```markdown
## Enhavotabelo

(La enhavotabelo estas aŭtomate plenigita ĉi tie)
```

### Callouts (Atentigoj)

`rehype-callouts` subtenas Obsidian-stilajn callouts:

```markdown
> [!NOTE]
> Note content

> [!WARNING]
> Warning content

> [!TIP]
> Tip content
```

Subtenataj tipoj: `NOTE`, `TIP`, `INFO`, `WARNING`, `DANGER`, `SUCCESS`, `QUESTION`, `FAILURE` kaj pli.

### Kodreliefigo

Shiki du-tema (hela `min-light`, malhela `night-owl`) subtenas:

- Linia reliefigo: ` ```js {1,3-5} `
- Vorteca reliefigo: ` ```js /word/ `
- Diff-markiloj: `+` / `-` ĉe linikomenco
- Dosiernomaj etikedoj: ` ```js file=src/index.ts ` aŭ `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // reliefigita linio
}
```

### Tables

Vastaj tabeloj estas aŭtomate envolvataj en horizontale rulumebla ujo (la `rehypeWrapTable`-kromprogramo), evitante superfluon sur mallarĝaj ekranoj.

## MDX-subteno

Kun `features.mdx` ebligita (defaŭlte), vi povas uzi `.mdx` dosierojn por komponanto-movita kreado.

### Propraj komponantoj

La enkonstruitaj MDX-komponantoj de Xingluo troviĝas en [`src/components/mdx/`](../src/components/mdx) kaj estas importitaj el unueca eniro:

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

Vidu [Aŭdvidaĵaj ludiloj](./media-players.md) por detaloj.

### Malŝalti MDX

Kun `features.mdx: false`:

- La integraĵo `mdx()` ne estas ŝargita
- La enhavkolekta glob kongruas nur kun `*.md` (ekzistantaj `.mdx` dosieroj ne estas kolektitaj)
- La konstrutaj rezultoj ne enhavas MDX-runtempon

## Comments

La komenta sistemo estas aŭtomate renderita malsupre de paĝoj de detaloj de afiŝoj (agordu la provizanton en `features.comments`). Vidu [Komenta sistemo](./comments.md).

### Legotempo

Taksita legotempo estas montrita aŭtomate sur afiŝaj detalpaĝoj kaj listaj kartoj:

- **CJK-lingvoj** (zh-cn, ja, ko): kalkulita per CJK-signokalkulo, ~400 signoj por minuto
- **Aliaj lingvoj**: kalkulita per vortkalkulo (blankospac-disigita), ~200 vortoj por minuto
- Rezulto rondigita supren, minimumo 1 minuto

Antaŭ kalkulado, kodblokoj, HTML-etikedoj, Markdown-ligilaj URL-oj kaj aliaj ne-tekstaj enhavoj estas forigitaj por teni la takson proksima al reala legado-kvanto. Neniu agordo necesas.

### Rilataj afiŝoj

Ĝis 2 rilataj afiŝoj estas montritaj ĉe la malsupro de afiŝaj detalpaĝoj (post antaŭa/seka navigado):

- Ordigitaj laŭ nombro de komunaj etikedoj, malkreske
- Samaj poentoj ordigitaj laŭ publikiga dato, malkreske (preferante pli novajn afiŝojn)
- Sekcio ne estas bildigita kiam neniuj afiŝoj kunhavas etikedojn
- Aŭtomate ignorita de la Flexsearch-serĉa indekso

Neniu agordo necesas.

### Fiksita TOC-flankbreto

Fiksita enhavtabela flankbreto aperas dekstre de afiŝaj detalpaĝoj sur grandaj ekranoj (≥1024px):

- Aŭtomate generita el h2–h6 titoloj en la artikolo, prezentita kiel plata listo kun indentaĵoj
- Indentaĵoj reflektas titolan profundon (h3 havas unu plian nivelon de indentaĵo ol h2)
- Nuna sekcio estas reliefigita dum vi rulumas (IntersectionObserver)
- Alklako de TOC-eniro glate rulumas al la responda titolo
- Kaŝita sur malgrandaj ekranoj (poŝtelefono), kie la enlinia faldebla TOC haveblas

Generita el la `headings` returnitaj de `render()` de Astro — neniu permana TOC-prizorgado de la aŭtoro. La enlinia `remark-toc` faldebla TOC (skribu `## Enhavotabelo` en via afiŝo) kunekzistas kun la flankbreto por uzo sur malgrandaj ekranoj.

## Kategorioj

Asignu kategorion al afiŝo per la frontmatter-kampo `category` (unu ĉeno):

```yaml
---
title: "Mia Afiŝo"
category: "lernilo"
---
```

- La kategoria paĝo troviĝas ĉe `/categories/<slug>/`; la slug estas normaligita per `slugifyStr` (CJK konservita, latina minuskle kun streketoj)
- La kategoria indekso ĉe `/categories/` listigas ĉiujn kategoriojn
- Afiŝaj kartoj kaj detalpaĝoj aŭtomate montras kategorian ligilon (alklaku por salti al la kategoria paĝo)
- Afiŝo apartenas al maksimume unu kategorio (male al multoblaj `tags`); afiŝoj sen `category` aperas en neniu kategorio
- Kategoriaj paĝoj reuzas `posts.perPage` por paĝigo kaj subtenas plurlingvajn spegulajn vojojn (`/en/categories/...`)
- Malŝaltu kategoriojn per `features.showCategories: false` (nav-eniro kaj paĝoj forigitaj, sitemap filtrila)
