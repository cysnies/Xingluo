---
title: "Aŭdvidaĵaj Ludiloj"
pubDatetime: 2026-06-20T10:00:00+08:00
description: "Gvidilo pri aŭdvidaĵaj ludiloj de Xingluo kovranta APlayer-aŭdion kaj DPlayer-videon per Markdown-bariloj kaj MDX-komponantoj."
tags:
  - documentation
  - media-players
category: "Documentation"
translationKey: doc-media-players
locale: eo
---

Xingluo integras APlayer (aŭdio) kaj DPlayer (video), subtenante du manierojn krei ludilojn en Markdown kaj MDX, ĉiuj malŝarĝitaj.

## Aktivigo

Ŝaltu ĉiun ludilon laŭbezone en `features.players` en [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // Aktivigi APlayer aŭdio-ludilon
    dplayer: true,  // Aktivigi DPlayer video-ludilon
  },
}
```

La du estas sendependaj. Kiam malŝaltitaj:

- La kromprogramo `remarkPlayers` ne estas injektita (MD-bariloj ne estas analizitaj)
- La klienta skripto de ludilo ne estas ŝarĝita
- La konstrutaj rezultoj ne havas aplayer / dplayer blokojn

## Du uzo-reĝimoj

| Reĝimo         | Aplikebla al            | Sintakso                                              |
| -------------- | ----------------------- | ----------------------------------------------------- |
| MD barilo      | Simpla `.md` kaj `.mdx` | ` ```aplayer ` / ` ```dplayer ` + JSON agorda korpo   |
| MDX komponanto | Nur `.mdx`              | `import { APlayer, DPlayer } from "@/components/mdx"` |

Ambaŭ reĝimoj finfine produktas la saman lokokupilan div-strukturon (`<div class="xng-aplayer|xng-dplayer" data-config>`), malŝarĝitan kaj realigitan de [`src/scripts/players.ts`](../src/scripts/players.ts).

## APlayer Aŭdio-Ludilo

### MD Barilo

````markdown
```aplayer
{
  "audio": [
    {
      "name": "Song",
      "artist": "Artist",
      "url": "/audio/song.mp3",
      "cover": "/images/cover.jpg",
      "lrc": "[00:00.00] First lyric line"
    }
  ],
  "theme": "#b7daff",
  "loop": "all",
  "autoplay": false
}
```
````

### MDX Komponanto

```mdx
import { APlayer } from "@/components/mdx";

<APlayer
  audio={[
    {
      name: "Kanto",
      artist: "Artisto",
      url: "/audio/song.mp3",
      cover: "/images/cover.jpg",
    },
  ]}
  theme="#b7daff"
  loop="all"
/>
```

### Opcioj

| Kampo           | Tipo                           | Defaŭlte  | Notoj                                            |
| --------------- | ------------------------------ | --------- | ------------------------------------------------ |
| `audio`         | Audio \| Audio[]               | deviga    | Aŭdio-objekto aŭ listo                           |
| `theme`         | string                         | `#b7daff` | Ludila tema koloro                               |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`     | Ripeta reĝimo                                    |
| `order`         | `"list"` \| `"random"`         | `list`    | Ludada ordo                                      |
| `volume`        | number                         | `0.7`     | Komenca volumo (0–1)                             |
| `autoplay`      | boolean                        | `false`   | Aŭtomata ludado (submetita al retumila politiko) |
| `listFolded`    | boolean                        | `false`   | Listo faldita                                    |
| `listMaxHeight` | string                         | —         | Lista maksimuma alto (CSS-valoro)                |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`       | Kantspeco: 0 neniu / 1 ĉeno / 2 URL              |

### audio-Objekto

| Kampo    | Notoj                                                    |
| -------- | -------------------------------------------------------- |
| `name`   | Kanto-nomo (falas reen al `title`, poste `'Audio name'`) |
| `artist` | Artisto (falas reen al `author`)                         |
| `url`    | Aŭdio-URL (deviga)                                       |
| `cover`  | Koversiko (falas reen al `pic`)                          |
| `lrc`    | Kantoteksto (ĉeno aŭ URL, kunigita kun `lrcType`)        |
| `theme`  | Po-kanta tema koloro                                     |
| `type`   | Aŭdio-tipo: `auto` \| `hls` \| `normal`                  |

## DPlayer Video-Ludilo

### MD Barilo

````markdown
```dplayer
{
  "video": {
    "url": "/videos/demo.mp4",
    "pic": "/images/video-cover.jpg",
    "type": "auto"
  },
  "theme": "#b7daff",
  "autoplay": false,
  "loop": false
}
```
````

### MDX Komponanto

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### Opcioj

| Kampo           | Tipo                                 | Defaŭlte  | Notoj                           |
| --------------- | ------------------------------------ | --------- | ------------------------------- |
| `video`         | Video                                | deviga    | Video-agordo                    |
| `theme`         | string                               | `#b7daff` | Tema koloro                     |
| `autoplay`      | boolean                              | `false`   | Aŭtomata ludado                 |
| `loop`          | boolean                              | `false`   | Ripeta ludado                   |
| `screenshot`    | boolean                              | `false`   | Ekrankopia funkcio              |
| `hotkey`        | boolean                              | `true`    | Klavaraj ŝparvojoj              |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`    | Antaŭŝarĝo                      |
| `volume`        | number                               | `0.7`     | Komenca volumo                  |
| `playbackSpeed` | number[]                             | —         | Ludada rapideca listo           |
| `subtitle`      | Subtitle                             | —         | Subtekstoj                      |
| `danmaku`       | Danmaku                              | —         | Danmaku (kuglaj komentoj)       |
| `live`          | boolean                              | `false`   | Rekta reĝimo                    |
| `mutex`         | boolean                              | `true`    | Mutex (nur unu ludilo por paĝo) |

### video-Objekto

| Kampo        | Notoj                                                      |
| ------------ | ---------------------------------------------------------- |
| `url`        | Video-URL (deviga)                                         |
| `pic`        | Kovrilo                                                    |
| `thumbnails` | Bildeta URL                                                |
| `type`       | Video-tipo: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Kvalita listo + `defaultQuality` indekso                   |

### subtitle-Objekto

| Kampo      | Notoj                  |
| ---------- | ---------------------- |
| `url`      | Subteksta URL (deviga) |
| `type`     | `webvtt` \| `ass`      |
| `fontSize` | Tipara grando          |
| `bottom`   | Distanco de malsupro   |
| `color`    | Koloro                 |

### danmaku-Objekto

| Kampo     | Notoj                            |
| --------- | -------------------------------- |
| `id`      | Unika danmaka laguna ID (deviga) |
| `api`     | Danmaka API-URL (deviga)         |
| `user`    | Uzanta identigilo                |
| `maximum` | Maksimuma danmaka nombro         |

## Pigra Ŝarĝa Mekanismo

Ludiloj estas pigre ŝarĝitaj per IntersectionObserver: la lokokupila div dinamike `import`as la ludilan modulon kaj stilojn kaj realiĝas nur kiam ene de 200px de la viewport.

- **APlayer**: dinamika `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: dinamika `import("dplayer")` (stiloj estas enliniaj en JS; neniu aparta CSS necesas)

Modula ŝarĝado uzas komunan Promise-kaŝmemoron por eviti ripetajn dinamikajn importojn. Re-realigo estas malhelpita per `dataset` markiloj (`xng-init`, `xng-observed`).

## View Transitions Adaptado

La ludila skripto aŭskultas `astro:page-load` kaj reskanas lokokupilajn divojn post ĉiu paĝa ŝarĝo. Post View Transitions paĝa ŝanĝo, la ludilaj lokokupiloj de la nova paĝo estas re-observitaj kaj pigre ŝarĝitaj.

## Rendimiento

- Nula pakaĵo kiam ludiloj estas malŝaltitaj (remark kromprogramo ne injektita, klienta skripto ne ŝarĝita)
- Nula rultempo kiam ebligitaj sed neniuj ludiloj sur paĝo (skripto ŝarĝiĝas sed ne realiĝas)
- Ludilaj moduloj estas memstaraj blokoj, ŝarĝitaj laŭ-petante nur sur paĝoj kiuj uzas ilin
- CSS kaj JS estas importitaj aparte por certigi ke stiloj estas pretaj antaŭ realigo

## Tipaj Deklaroj

APlayer kaj DPlayer ne havas oficialajn TypeScript-tipojn; Xingluo provizas malstriktajn modulajn deklarojn en [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) kaj [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), kun opciaj kampoj por disvastiga kongrueco. MDX-komponantaj Props havas plenajn tipajn limigojn.
