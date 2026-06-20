# Medienplayer

Xingluo integriert APlayer (Audio) und DPlayer (Video) und unterstützt zwei Möglichkeiten, Player in Markdown und MDX zu erstellen, alle lazy-geladen.

## Aktivierung

Aktivieren oder deaktivieren Sie jeden Player nach Bedarf in `features.players` in [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // APlayer-Audioplayer aktivieren
    dplayer: true,  // DPlayer-Videoplayer aktivieren
  },
}
```

Die beiden sind unabhängig. Wenn deaktiviert:

- Das `remarkPlayers`-Plugin wird nicht injiziert (MD-Blöcke werden nicht analysiert)
- Das Player-Client-Skript wird nicht geladen
- Die Build-Ausgabe enthält keine Aplayer-/Dplayer-Chunks

## Zwei Verwendungsmodi

| Modus          | Anwendbar auf             | Syntax                                                      |
| -------------- | ------------------------- | ----------------------------------------------------------- |
| MD-Block       | Normales `.md` und `.mdx` | ` ```aplayer ` / ` ```dplayer ` + JSON-Konfigurationskörper |
| MDX-Komponente | Nur `.mdx`                | `import { APlayer, DPlayer } from "@/components/mdx"`       |

Beide Modi geben letztendlich dieselbe Platzhalter-div-Struktur aus (`<div class="xng-aplayer|xng-dplayer" data-config>`), die von [`src/scripts/players.ts`](../src/scripts/players.ts) lazy-geladen und instanziiert wird.

## APlayer Audio Player

### MD Fence

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

### MDX Component

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

### Options

| Feld            | Typ                            | Standard     | Hinweise                                                 |
| --------------- | ------------------------------ | ------------ | -------------------------------------------------------- |
| `audio`         | Audio \| Audio[]               | erforderlich | Audio-Objekt oder -Liste                                 |
| `theme`         | string                         | `#b7daff`    | Player-Theme-Farbe                                       |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`        | Wiederholungsmodus                                       |
| `order`         | `"list"` \| `"random"`         | `list`       | Wiedergabereihenfolge                                    |
| `volume`        | number                         | `0.7`        | Anfangslautstärke (0–1)                                  |
| `autoplay`      | boolean                        | `false`      | Automatische Wiedergabe (abhängig von Browserrichtlinie) |
| `listFolded`    | boolean                        | `false`      | Liste eingeklappt                                        |
| `listMaxHeight` | string                         | —            | Maximale Listen-höhe (CSS-Wert)                          |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`          | Liedtext-Typ: 0 kein / 1 Zeichenfolge / 2 URL            |

### audio-Objekt

| Feld     | Hinweise                                                  |
| -------- | --------------------------------------------------------- |
| `name`   | Titelname (fällt zurück auf `title`, dann `'Audio name'`) |
| `artist` | Interpret (fällt zurück auf `author`)                     |
| `url`    | Audio-URL (erforderlich)                                  |
| `cover`  | Cover (fällt zurück auf `pic`)                            |
| `lrc`    | Liedtext (Zeichenfolge oder URL, gepaart mit `lrcType`)   |
| `theme`  | Titelbezogene Theme-Farbe                                 |
| `type`   | Audio-Typ: `auto` \| `hls` \| `normal`                    |

## DPlayer Video Player

### MD-Block

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

### MDX-Komponente

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### Optionen

| Feld            | Typ                                  | Standard     | Hinweise                         |
| --------------- | ------------------------------------ | ------------ | -------------------------------- |
| `video`         | Video                                | erforderlich | Video-Konfiguration              |
| `theme`         | string                               | `#b7daff`    | Theme-Farbe                      |
| `autoplay`      | boolean                              | `false`      | Automatische Wiedergabe          |
| `loop`          | boolean                              | `false`      | Wiederholung                     |
| `screenshot`    | boolean                              | `false`      | Screenshot-Funktion              |
| `hotkey`        | boolean                              | `true`       | Tastenkürzel                     |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`       | Vorab laden                      |
| `volume`        | number                               | `0.7`        | Anfangslautstärke                |
| `playbackSpeed` | number[]                             | —            | Geschwindigkeitsliste            |
| `subtitle`      | Untertitel                           | —            | Untertitel                       |
| `danmaku`       | Danmaku                              | —            | Danmaku (Kommentare)             |
| `live`          | boolean                              | `false`      | Live-Modus                       |
| `mutex`         | boolean                              | `true`       | Mutex (nur ein Player pro Seite) |

### video-Objekt

| Feld         | Hinweise                                                  |
| ------------ | --------------------------------------------------------- |
| `url`        | Video-URL (erforderlich)                                  |
| `pic`        | Cover                                                     |
| `thumbnails` | Thumbnail-URL                                             |
| `type`       | Video-Typ: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Qualitätsliste + `defaultQuality`-Index                   |

### subtitle-Objekt

| Feld       | Hinweise                      |
| ---------- | ----------------------------- |
| `url`      | Untertitel-URL (erforderlich) |
| `type`     | `webvtt` \| `ass`             |
| `fontSize` | Schriftgröße                  |
| `bottom`   | Abstand von unten             |
| `color`    | Farbe                         |

### danmaku-Objekt

| Feld      | Hinweise                                  |
| --------- | ----------------------------------------- |
| `id`      | Eindeutige Danmaku-Pool-ID (erforderlich) |
| `api`     | Danmaku-API-URL (erforderlich)            |
| `user`    | Benutzerkennung                           |
| `maximum` | Maximale Danmaku-Anzahl                   |

## Lazy-Loading-Mechanismus

Player werden über IntersectionObserver lazy-geladen: Das Platzhalter-div `import`iert dynamisch das Player-Modul und die Styles und instanziiert nur, wenn es sich innerhalb von 200px des Viewports befindet.

- **APlayer**: dynamisches `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: dynamisches `import("dplayer")` (Styles sind in JS eingebettet; kein separates CSS erforderlich)

Das Modulladen verwendet einen gemeinsam genutzten Promise-Cache, um wiederholte dynamische Importe zu vermeiden. Die erneute Instanziierung wird über `dataset`-Marker (`xng-init`, `xng-observed`) verhindert.

## View Transitions-Anpassung

Das Player-Skript hört auf `astro:page-load` und scannt Platzhalter-divs nach jedem Seitenladen erneut. Nach einem View Transitions-Seitenwechsel werden die Player-Platzhalter der neuen Seite erneut beobachtet und lazy-geladen.

## Leistung

- Kein Bundle, wenn Player deaktiviert sind (remark-Plugin nicht injiziert, Client-Skript nicht geladen)
- Keine Laufzeit, wenn aktiviert, aber keine Player auf einer Seite (Skript lädt, instanziiert aber nicht)
- Player-Module sind eigenständige Chunks, die nur bei Bedarf auf Seiten geladen werden, die sie verwenden
- CSS und JS werden separat importiert, um sicherzustellen, dass Styles vor der Instanziierung bereit sind

## Typdeklarationen

APlayer und DPlayer haben keine offiziellen TypeScript-Typen; Xingluo bietet lockere Moduldeklarationen in [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) und [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts) mit optionalen Optionsfeldern für Spread-Kompatibilität. MDX-Komponenten-Props haben vollständige Typeinschränkungen.
