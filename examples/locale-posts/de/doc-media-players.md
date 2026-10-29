---
title: "Medienplayer"
pubDatetime: 2026-06-20T10:00:00+08:00
description: "Leitfaden für Medienplayer von Xingluo mit APlayer-Audio und DPlayer-Video über Markdown-Fences und MDX-Komponenten."
tags:
  - documentation
  - media-players
category: "Documentation"
translationKey: doc-media-players
locale: de
---

Xingluo integriert APlayer (Audio) und DPlayer (Video) und unterstützt zwei Möglichkeiten, Player in Markdown und MDX zu erstellen, alle lazy-geladen.

## Aktivierung

Schalten Sie jeden Player nach Bedarf in `features.players` in [`xingluo.config.ts`](../xingluo.config.ts) um:

```ts
features: {
  players: {
    aplayer: true,  // APlayer-Audioplayer aktivieren
    dplayer: true,  // DPlayer-Videoplayer aktivieren
  },
}
```

Die beiden sind unabhängig. Bei Deaktivierung:

- Das `remarkPlayers`-Plugin wird nicht injiziert (MD-Fences werden nicht geparst)
- Das Player-Client-Skript wird nicht geladen
- Die Build-Ausgabe enthält keine APlayer-/DPlayer-Chunks

## Zwei Verwendungsmodi

| Modus          | Anwendbar auf          | Syntax                                                |
| -------------- | ---------------------- | ----------------------------------------------------- |
| MD-Fence       | Reine `.md` und `.mdx` | ` ```aplayer ` / ` ```dplayer ` + JSON-Konfiguration  |
| MDX-Komponente | Nur `.mdx`             | `import { APlayer, DPlayer } from "@/components/mdx"` |

Beide Modi geben letztendlich dieselbe Platzhalter-div-Struktur aus (`<div class="xng-aplayer|xng-dplayer" data-config>`), lazy-geladen und instanziiert von [`src/scripts/players.ts`](../src/scripts/players.ts).

## APlayer-Audioplayer

### MD-Fence

````markdown
```aplayer
{
  "audio": [
    {
      "name": "Titel",
      "artist": "Künstler",
      "url": "/audio/song.mp3",
      "cover": "/images/cover.jpg",
      "lrc": "[00:00.00] Erste Textzeile"
    }
  ],
  "theme": "#b7daff",
  "loop": "all",
  "autoplay": false
}
```
````

### MDX-Komponente

```mdx
import { APlayer } from "@/components/mdx";

<APlayer
  audio={[
    {
      name: "Titel",
      artist: "Künstler",
      url: "/audio/song.mp3",
      cover: "/images/cover.jpg",
    },
  ]}
  theme="#b7daff"
  loop="all"
/>
```

### Optionen

| Feld            | Typ                            | Standard   | Hinweise                                |
| --------------- | ------------------------------ | ---------- | --------------------------------------- |
| `audio`         | Audio \| Audio[]               | erforderl. | Audio-Objekt oder -Liste                |
| `theme`         | string                         | `#b7daff`  | Player-Designfarbe                      |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`      | Wiederholungsmodus                      |
| `order`         | `"list"` \| `"random"`         | `list`     | Wiedergabereihenfolge                   |
| `volume`        | number                         | `0.7`      | Startlautstärke (0–1)                   |
| `autoplay`      | boolean                        | `false`    | Autom. Wiedergabe (Browser-Richtlinie)  |
| `listFolded`    | boolean                        | `false`    | Liste eingeklappt                       |
| `listMaxHeight` | string                         | —          | Maximale Listen-Höhe (CSS-Wert)         |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`        | Liedtext-Typ: 0 kein / 1 String / 2 URL |

### audio-Objekt

| Feld     | Hinweise                                          |
| -------- | ------------------------------------------------- |
| `name`   | Titel (Fallback auf `title`, dann `'Audio name'`) |
| `artist` | Künstler (Fallback auf `author`)                  |
| `url`    | Audio-URL (erforderlich)                          |
| `cover`  | Cover (Fallback auf `pic`)                        |
| `lrc`    | Liedtext (String oder URL, mit `lrcType`)         |
| `theme`  | Titel-spezifische Designfarbe                     |
| `type`   | Audio-Typ: `auto` \| `hls` \| `normal`            |

## DPlayer-Videoplayer

### MD-Fence

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

| Feld            | Typ                                  | Standard   | Hinweise                         |
| --------------- | ------------------------------------ | ---------- | -------------------------------- |
| `video`         | Video                                | erforderl. | Video-Konfiguration              |
| `theme`         | string                               | `#b7daff`  | Designfarbe                      |
| `autoplay`      | boolean                              | `false`    | Autom. Wiedergabe                |
| `loop`          | boolean                              | `false`    | Wiederholung                     |
| `screenshot`    | boolean                              | `false`    | Screenshot-Funktion              |
| `hotkey`        | boolean                              | `true`     | Tastenkürzel                     |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`     | Vorladen                         |
| `volume`        | number                               | `0.7`      | Startlautstärke                  |
| `playbackSpeed` | number[]                             | —          | Geschwindigkeitsliste            |
| `subtitle`      | Subtitle                             | —          | Untertitel                       |
| `danmaku`       | Danmaku                              | —          | Danmaku (Bullet-Kommentare)      |
| `live`          | boolean                              | `false`    | Live-Modus                       |
| `mutex`         | boolean                              | `true`     | Mutex (nur ein Player pro Seite) |

### video-Objekt

| Feld         | Hinweise                                                  |
| ------------ | --------------------------------------------------------- |
| `url`        | Video-URL (erforderlich)                                  |
| `pic`        | Cover                                                     |
| `thumbnails` | Thumbnail-URL                                             |
| `type`       | Video-Typ: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Qualitätsliste + `defaultQuality`-Index                   |

### subtitle-Objekt

| Feld       | Hinweise                    |
| ---------- | --------------------------- |
| `url`      | Untertitel-URL (erforderl.) |
| `type`     | `webvtt` \| `ass`           |
| `fontSize` | Schriftgröße                |
| `bottom`   | Abstand von unten           |
| `color`    | Farbe                       |

### danmaku-Objekt

| Feld      | Hinweise                             |
| --------- | ------------------------------------ |
| `id`      | Eindeutige Danmaku-Pool-ID (erford.) |
| `api`     | Danmaku-API-URL (erforderlich)       |
| `user`    | Benutzerkennung                      |
| `maximum` | Maximale Danmaku-Anzahl              |

## Lazy-Loading-Mechanismus

Player werden über IntersectionObserver lazy-geladen: Die Platzhalter-div importiert dynamisch das Player-Modul und die Styles und instanziiert nur, wenn sie innerhalb von 200px des Viewports ist.

- **APlayer**: dynamisch `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: dynamisch `import("dplayer")` (Styles sind in JS eingebettet; kein separates CSS erforderlich)

Das Modulladen verwendet einen gemeinsamen Promise-Cache, um wiederholte dynamische Importe zu vermeiden. Eine erneute Instanziierung wird über `dataset`-Marker (`xng-init`, `xng-observed`) verhindert.

## View Transitions-Anpassung

Das Player-Skript lauscht auf `astro:page-load` und scannt Platzhalter-divs nach jedem Seitenladen erneut. Nach einem View-Transitions-Seitenwechsel werden die Player-Platzhalter der neuen Seite erneut beobachtet und lazy-geladen.

## Leistung

- Kein Bundle bei deaktivierten Playern (remark-Plugin nicht injiziert, Client-Skript nicht geladen)
- Keine Laufzeit bei aktivierten, aber keinen Playern auf einer Seite (Skript wird geladen, aber nicht instanziiert)
- Player-Module sind eigenständige Chunks, die nur bei Bedarf auf Seiten geladen werden, die sie verwenden
- CSS und JS werden getrennt importiert, um sicherzustellen, dass Styles vor der Instanziierung bereit sind

## Typdeklarationen

APlayer und DPlayer haben keine offiziellen TypeScript-Typen; Xingluo bietet lockere Moduldeklarationen in [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) und [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), Optionsfelder sind als optional für Spread-Kompatibilität gesetzt. MDX-Komponenten-Props haben vollständige Typbeschränkungen.
