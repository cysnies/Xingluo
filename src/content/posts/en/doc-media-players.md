---
title: "Media Players"
pubDatetime: 2026-06-20T10:00:00+08:00
description: "Xingluo media players guide covering APlayer audio and DPlayer video usage via Markdown fences and MDX components."
tags:
  - documentation
  - media-players
category: "Documentation"
translationKey: doc-media-players
locale: en
---

Xingluo integrates APlayer (audio) and DPlayer (video), supporting two ways to create players in Markdown and MDX, all lazy-loaded.

## Enabling

Toggle each player as needed in `features.players` in [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // Enable APlayer audio player
    dplayer: true,  // Enable DPlayer video player
  },
}
```

The two are independent. When disabled:

- The `remarkPlayers` plugin is not injected (MD fences are not parsed)
- The player client script is not loaded
- The build output has no aplayer / dplayer chunks

## Two Usage Modes

| Mode          | Applicable to          | Syntax                                                |
| ------------- | ---------------------- | ----------------------------------------------------- |
| MD fence      | Plain `.md` and `.mdx` | ` ```aplayer ` / ` ```dplayer ` + JSON config body    |
| MDX component | `.mdx` only            | `import { APlayer, DPlayer } from "@/components/mdx"` |

Both modes ultimately output the same placeholder div structure (`<div class="xng-aplayer|xng-dplayer" data-config>`), lazy-loaded and instantiated by [`src/scripts/players.ts`](../src/scripts/players.ts).

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

| Field           | Type                           | Default   | Notes                                 |
| --------------- | ------------------------------ | --------- | ------------------------------------- |
| `audio`         | Audio \| Audio[]               | required  | Audio object or list                  |
| `theme`         | string                         | `#b7daff` | Player theme color                    |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`     | Loop mode                             |
| `order`         | `"list"` \| `"random"`         | `list`    | Play order                            |
| `volume`        | number                         | `0.7`     | Initial volume (0–1)                  |
| `autoplay`      | boolean                        | `false`   | Autoplay (subject to browser policy)  |
| `listFolded`    | boolean                        | `false`   | List folded                           |
| `listMaxHeight` | string                         | —         | List max height (CSS value)           |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`       | Lyric type: 0 none / 1 string / 2 URL |

### audio Object

| Field    | Notes                                                   |
| -------- | ------------------------------------------------------- |
| `name`   | Track name (falls back to `title`, then `'Audio name'`) |
| `artist` | Artist (falls back to `author`)                         |
| `url`    | Audio URL (required)                                    |
| `cover`  | Cover (falls back to `pic`)                             |
| `lrc`    | Lyrics (string or URL, paired with `lrcType`)           |
| `theme`  | Per-track theme color                                   |
| `type`   | Audio type: `auto` \| `hls` \| `normal`                 |

## DPlayer Video Player

### MD Fence

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

### MDX Component

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### Options

| Field           | Type                                 | Default   | Notes                            |
| --------------- | ------------------------------------ | --------- | -------------------------------- |
| `video`         | Video                                | required  | Video config                     |
| `theme`         | string                               | `#b7daff` | Theme color                      |
| `autoplay`      | boolean                              | `false`   | Autoplay                         |
| `loop`          | boolean                              | `false`   | Loop playback                    |
| `screenshot`    | boolean                              | `false`   | Screenshot feature               |
| `hotkey`        | boolean                              | `true`    | Hotkeys                          |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`    | Preload                          |
| `volume`        | number                               | `0.7`     | Initial volume                   |
| `playbackSpeed` | number[]                             | —         | Playback speed list              |
| `subtitle`      | Subtitle                             | —         | Subtitles                        |
| `danmaku`       | Danmaku                              | —         | Danmaku (bullet comments)        |
| `live`          | boolean                              | `false`   | Live mode                        |
| `mutex`         | boolean                              | `true`    | Mutex (only one player per page) |

### video Object

| Field        | Notes                                                      |
| ------------ | ---------------------------------------------------------- |
| `url`        | Video URL (required)                                       |
| `pic`        | Cover                                                      |
| `thumbnails` | Thumbnail URL                                              |
| `type`       | Video type: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Quality list + `defaultQuality` index                      |

### subtitle Object

| Field      | Notes                   |
| ---------- | ----------------------- |
| `url`      | Subtitle URL (required) |
| `type`     | `webvtt` \| `ass`       |
| `fontSize` | Font size               |
| `bottom`   | Distance from bottom    |
| `color`    | Color                   |

### danmaku Object

| Field     | Notes                             |
| --------- | --------------------------------- |
| `id`      | Unique danmaku pool ID (required) |
| `api`     | Danmaku API URL (required)        |
| `user`    | User identifier                   |
| `maximum` | Max danmaku count                 |

## Lazy Loading Mechanism

Players are lazy-loaded via IntersectionObserver: the placeholder div dynamically `import`s the player module and styles and instantiates only when within 200px of the viewport.

- **APlayer**: dynamic `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: dynamic `import("dplayer")` (styles are inlined in JS; no separate CSS needed)

Module loading uses a shared Promise cache to avoid repeated dynamic imports. Re-instantiation is prevented via `dataset` markers (`xng-init`, `xng-observed`).

## View Transitions Adaptation

The player script listens for `astro:page-load` and re-scans placeholder divs after each page load. After a View Transitions page switch, the new page's player placeholders are re-observed and lazy-loaded.

## Performance

- Zero bundle when players are disabled (remark plugin not injected, client script not loaded)
- Zero runtime when enabled but no players on a page (script loads but does not instantiate)
- Player modules are standalone chunks, loaded on demand only on pages that use them
- CSS and JS are imported separately to ensure styles are ready before instantiation

## Type Declarations

APlayer and DPlayer have no official TypeScript types; Xingluo provides loose module declarations in [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) and [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), with options fields set optional for spread compatibility. MDX component Props have full type constraints.
