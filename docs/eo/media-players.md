# Aŭdvidaĵaj ludiloj

Xingluo integras APlayer (aŭdio) kaj DPlayer (video), subtenante du manierojn krei ludilojn en Markdown kaj MDX, ĉiuj malŝarĝitaj.

## Ebligado

Ŝaltu ĉiun ludilon laŭbezone en `features.players` en [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // Ebligi APlayer-aŭdiludilon
    dplayer: true,  // Ebligi DPlayer-videoludilon
  },
}
```

La du estas sendependaj. Kiam malŝaltitaj:

- La `remarkPlayers`-kromprogramo ne estas injektita (MD-bariloj ne estas analizitaj)
- La ludila klienta skripto ne estas ŝarĝita
- La konstrutavolo ne havas aplayer / dplayer-blokojn

## Du Uzaj Reĝimoj

| Reĝimo         | Aplikebla al             | Sintakso                                              |
| -------------- | ------------------------ | ----------------------------------------------------- |
| MD barilo      | Simplaj `.md` kaj `.mdx` | ` ```aplayer ` / ` ```dplayer ` + JSON agorda korpo   |
| MDX komponanto | Nur `.mdx`               | `import { APlayer, DPlayer } from "@/components/mdx"` |

Ambaŭ reĝimoj fine eligas la saman lokokupan div-strukturon (`<div class="xng-aplayer|xng-dplayer" data-config>`), pigre ŝarĝitan kaj iniciatitan de [`src/scripts/players.ts`](../src/scripts/players.ts).

## APlayer Aŭdiludilo

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
      name: "Song",
      artist: "Artist",
      url: "/audio/song.mp3",
      cover: "/images/cover.jpg",
    },
  ]}
  theme="#b7daff"
  loop="all"
/>
```

### Opcioj

| Kampo           | Tipo                           | Defaŭlte  | Notoj                                          |
| --------------- | ------------------------------ | --------- | ---------------------------------------------- |
| `audio`         | Audio \| Audio[]               | deviga    | Aŭdio-objekto aŭ listo                         |
| `theme`         | string                         | `#b7daff` | Ludila temkoloro                               |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`     | Ripeta reĝimo                                  |
| `order`         | `"list"` \| `"random"`         | `list`    | Ludorda reĝimo                                 |
| `volume`        | number                         | `0.7`     | Komenca laŭteco (0–1)                          |
| `autoplay`      | boolean                        | `false`   | Aŭtomata ludado (depende de retumila politiko) |
| `listFolded`    | boolean                        | `false`   | Listo faldebla                                 |
| `listMaxHeight` | string                         | —         | Maksimuma listo-alto (CSS-valoro)              |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`       | Kanta tekstotipo: 0 neniu / 1 ĉeno / 2 URL     |

### audio-Objekto

| Kampo    | Notoj                                                      |
| -------- | ---------------------------------------------------------- |
| `name`   | Trakonomo (falas reen al `title`, poste al `'Audio name'`) |
| `artist` | Artist (falas reen al `author`)                            |
| `url`    | Aŭdio-URL (deviga)                                         |
| `cover`  | Kovrilo (falas reen al `pic`)                              |
| `lrc`    | Kantoteksto (ĉeno aŭ URL, parigita kun `lrcType`)          |
| `theme`  | Per-trakca temkoloro                                       |
| `type`   | Aŭdio-tipo: `auto` \| `hls` \| `normal`                    |

## DPlayer Videoludilo

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
| `video`         | Video                                | deviga    | Video-agordoj                   |
| `theme`         | string                               | `#b7daff` | Temkoloro                       |
| `autoplay`      | boolean                              | `false`   | Aŭtomata ludado                 |
| `loop`          | boolean                              | `false`   | Ripeta ludado                   |
| `screenshot`    | boolean                              | `false`   | Ekrankopira funkcio             |
| `hotkey`        | boolean                              | `true`    | Klavaraj ŝparvojoj              |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`    | Antaŭŝargo                      |
| `volume`        | number                               | `0.7`     | Komenca laŭteco                 |
| `playbackSpeed` | number[]                             | —         | Listo de ludrapidoj             |
| `subtitle`      | Subtitle                             | —         | Subtekstoj                      |
| `danmaku`       | Danmaku                              | —         | Danmaku (kuglokomentoj)         |
| `live`          | boolean                              | `false`   | Rekta reĝimo                    |
| `mutex`         | boolean                              | `true`    | Mutex (nur unu ludilo por paĝo) |

### video-Objekto

| Kampo        | Notoj                                                      |
| ------------ | ---------------------------------------------------------- |
| `url`        | Video-URL (deviga)                                         |
| `pic`        | Kovrilo                                                    |
| `thumbnails` | Bildet-URL                                                 |
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

| Kampo     | Notoj                           |
| --------- | ------------------------------- |
| `id`      | Unika danmaku-grupa ID (deviga) |
| `api`     | Danmaku-API-URL (deviga)        |
| `user`    | Uzanto-identigilo               |
| `maximum` | Maksimuma danmaku-kvanto        |

## Pigra Ŝarĝa Mekanismo

Ludiloj estas ŝarĝataj pigre per IntersectionObserver: la lokokupa div dinamike importas la ludilan modulon kaj stilojn kaj iniciatas nur kiam ene de 200px de la viewport.

- **APlayer**: dynamic `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: dynamic `import("dplayer")` (stiloj estas enliniaj en JS; neniu aparta CSS bezonata)

Modula ŝarĝado uzas komunan Promise-kaŝmemoron por eviti ripetajn dinamikajn importojn. Re-iniciatado estas malhelpita per `dataset`-markiloj (`xng-init`, `xng-observed`).

## Adaptado al View Transitions

La ludila skripto aŭskultas `astro:page-load` kaj reskanas lokokupajn div-ojn post ĉiu paĝoŝarĝo. Post View Transitions paĝoŝanĝo, la ludilaj lokokupoj de la nova paĝo estas re-observataj kaj pigre ŝarĝataj.

## Rendimento

- Nula pakaĵo kiam ludiloj estas malŝaltitaj (remark-kromprogramo ne injektita, klienta skripto ne ŝarĝita)
- Nula rultempo kiam ebligitaj sed neniu ludilo en paĝo (skripto ŝarĝiĝas sed ne kreas instancojn)
- Ludilaj moduloj estas memstaraj blokoj, ŝarĝataj laŭpeto nur en paĝoj kiuj uzas ilin
- CSS kaj JS estas importitaj aparte por certigi ke stiloj estas pretaj antaŭ instancigo

## Tipaj Deklaroj

APlayer kaj DPlayer ne havas oficialajn TypeScript-tipojn; Xingluo provizas malstriktajn moduldeklarojn en [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) kaj [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), kun opciokampoj agorditaj kiel nedevigaj por disvastiga kongrueco. MDX-komponantaj Props havas plenajn tipajn limigojn.
