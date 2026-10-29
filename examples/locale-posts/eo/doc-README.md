---
title: "Dokumentaro Xingluo"
pubDatetime: 2026-06-20T02:00:00+08:00
description: "Superrigardo de la projektodokumentaro de Xingluo kun navigado, ĉefaj trajtoj kaj teknologia stako."
tags:
  - documentation
  - xingluo
category: "Documentation"
translationKey: doc-README
locale: eo
---

Xingluo estas moderna bloga CMS konstruita kun [Astro](https://astro.build/) kaj la vida stilo [shadcn/ui](https://ui.shadcn.com/). Ĝi liveras pli modernan vidan sperton per plataj, elegantaj shadcn-komponentoj kaj la OKLCH-kolorsistemo, kaj denaske integras komentan sistemon, nedevigan MDX-subtenon kaj aŭdio/vidaj ludilojn.

## Indekso de dokumentaro

| Dokumento                                         | Enhavo                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------- |
| [Komenci](./doc-getting-started.md)               | Postuloj, instalo, loka evoluigo, konstruo kaj antaŭrigardo               |
| [Agorda gvidilo](./doc-configuration.md)          | Plena referenco por `xingluo.config.ts`                                   |
| [Enhava kreado](./doc-content.md)                 | Afiŝa frontmatter, Markdown/MDX-sintakso, kodblokoj, callouts, plibonigoj |
| [Internaciigo](./doc-i18n.md)                     | Plurlingva vojigo, UI-ĉenoj, traduko je enhava nivelo, aldoni lingvon     |
| [Arkitektura superrigardo](./doc-architecture.md) | Dosieruja strukturo, agorda fluo, bildiga fluo, konstrutubo               |
| [Etoso kaj stiloj](./doc-theming.md)              | shadcn-etosaj variabloj, OKLCH, Tailwind v4, malhela reĝimo               |
| [Komenta sistemo](./doc-comments.md)              | Elektado kaj agordado de giscus / twikoo / waline                         |
| [Aŭdvidaĵaj ludiloj](./doc-media-players.md)      | Uzo de APlayer / DPlayer en Markdown kaj MDX                              |
| [SEO](./doc-seo.md)                               | OG-bildoj, RSS, retejmapo, hreflang, canonical, strukturitaj datumoj      |
| [Serĉo](./doc-search.md)                          | Integrado de plenteksta serĉo Flexsearch                                  |
| [Deplojo](./doc-deployment.md)                    | Statika gastigado, GitHub Pages, mediaj variabloj, Docker                 |

## Ĉefaj trajtoj

- **Plej alta rendimento**: Astro statika generado, enkonstruitaj SVG-ikonoj dum konstruo (nula JS dum rutimo), malrapida ŝargo de komentoj kaj ludiloj, purigado de orfaj aktivaĵoj
- **Modernaj vidajxoj**: shadcn/ui novjorkaj komponantoj, OKLCH-kolorspaco, glata malhela reĝimo (FOUC-protekto)
- **Plurlingva**: traduko je UI- kaj enhava nivelo, vojigo `prefixDefaultLocale: false`, hreflang- kaj x-default-SEO-deklaroj
- **Enhava plibonigo**: laŭvola MDX, Shiki-du-tema kod reliefigo, callouts, faldebla TOC, ruleblaj tabeloj
- **Legotempo**: inteligenta takso (CJK laŭ signokvanto, latina laŭ vortkvanto), montrata sur kartoj kaj detalpaĝoj
- **Rilataj afiŝoj**: aŭtomate rekomenditaj per komunaj etikedoj
- **Afiŝaj kategorioj**: asignu per frontmatter, kun dediĉitaj kategoriaj paĝoj kaj navigada eniro
- **Fiksita TOC-flankbreto**: fiksita tabelo de enhavo dekstre sur grandaj ekranoj, IntersectionObserver ruluma sekvado
- **Komenta sistemo**: giscus / twikoo / waline, tema-konscia, malrapide ŝargita
- **Aŭdvidaĵaj ludiloj**: APlayer-aŭdio kaj DPlayer-video, kun ambaŭ MD barilo kaj MDX-komponanta enirpunktoj
- **Serĉo**: Flexsearch plenteksta serĉo, po-lingvaj indeksoj, View Transitions stata persistado
- **Plena SEO**: dinamikaj OG-bildoj (satori + sharp), RSS, retejmapo, JSON-LD strukturitaj datumoj (BlogPosting + BreadcrumbList), canonical normaligo

## Teknologia stako

| Kategorio         | Teknologio                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| Frameworks        | Astro 6.x                                                              |
| Stilado           | Tailwind CSS v4, shadcn/ui-stilaj komponantoj, @tailwindcss/typography |
| Ikonoj            | astro-icon + Font Awesome                                              |
| Enhavo            | Astro Content Collections, MDX, remark/rehype kroma ĉeno               |
| Kod reliefigo     | Shiki                                                                  |
| Serĉo             | Flexsearch                                                             |
| OG-bildoj         | satori + sharp                                                         |
| Komentoj          | giscus / twikoo / waline                                               |
| Ludiloj           | APlayer / DPlayer                                                      |
| Dato              | dayjs                                                                  |
| Pakaĵadministrilo | pnpm                                                                   |
| Lingvo            | TypeScript                                                             |

## Permesilo

AGPL-3.0
