---
title: "媒體播放器"
pubDatetime: 2026-06-20T10:00:00+08:00
description: "星羅媒體播放器使用指南，涵蓋 APlayer 音樂播放器與 DPlayer 影片播放器的 Markdown 圍欄與 MDX 元件用法。"
tags:
  - documentation
  - media-players
category: "Documentation"
translationKey: doc-media-players
locale: zh-tw
---

# 媒體播放器

星羅整合 APlayer（音樂播放器）與 DPlayer（影片播放器），支援在 Markdown 與 MDX 中透過兩種方式建立播放器，統一懶載入。

## 啟用

在 [`xingluo.config.ts`](../xingluo.config.ts) 的 `features.players` 中按需開啟：

```ts
features: {
  players: {
    aplayer: true,  // 啟用 APlayer 音樂播放器
    dplayer: true,  // 啟用 DPlayer 影片播放器
  },
}
```

兩者可獨立開關。關閉時：

- `remarkPlayers` 外掛不注入（MD 圍欄不解析）
- 播放器客戶端指令碼不載入
- 產物無 aplayer / dplayer chunk

## 兩種使用方式

| 方式     | 適用場景             | 語法                                                  |
| -------- | -------------------- | ----------------------------------------------------- |
| MD 圍欄  | 普通 `.md` 與 `.mdx` | ` ```aplayer ` / ` ```dplayer ` + JSON 設定體         |
| MDX 元件 | 僅 `.mdx`            | `import { APlayer, DPlayer } from "@/components/mdx"` |

兩種方式最終輸出相同的佔位 div 結構（`<div class="xng-aplayer|xng-dplayer" data-config>`），由 [`src/scripts/players.ts`](../src/scripts/players.ts) 統一懶載入實例化。

## APlayer 音樂播放器

### MD 圍欄

````markdown
```aplayer
{
  "audio": [
    {
      "name": "曲名",
      "artist": "藝術家",
      "url": "/audio/song.mp3",
      "cover": "/images/cover.jpg",
      "lrc": "[00:00.00] 歌詞第一行"
    }
  ],
  "theme": "#b7daff",
  "loop": "all",
  "autoplay": false
}
```
````

### MDX 元件

```mdx
import { APlayer } from "@/components/mdx";

<APlayer
  audio={[
    {
      name: "曲名",
      artist: "藝術家",
      url: "/audio/song.mp3",
      cover: "/images/cover.jpg",
    },
  ]}
  theme="#b7daff"
  loop="all"
/>
```

### 設定項

| 欄位            | 類型                           | 預設值    | 說明                                |
| --------------- | ------------------------------ | --------- | ----------------------------------- |
| `audio`         | Audio \| Audio[]               | 必填      | 音訊物件或列表                      |
| `theme`         | string                         | `#b7daff` | 播放器主題色                        |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`     | 迴圈模式                            |
| `order`         | `"list"` \| `"random"`         | `list`    | 播放順序                            |
| `volume`        | number                         | `0.7`     | 初始音量（0~1）                     |
| `autoplay`      | boolean                        | `false`   | 自動播放（受瀏覽器策略限制）        |
| `listFolded`    | boolean                        | `false`   | 列表折疊                            |
| `listMaxHeight` | string                         | —         | 列表最大高度（CSS 值）              |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`       | 歌詞類型：0 不解析 / 1 字串 / 2 URL |

### audio 物件

| 欄位     | 說明                                            |
| -------- | ----------------------------------------------- |
| `name`   | 曲目名（預設取 `title`，再預設 `'Audio name'`） |
| `artist` | 藝術家（預設取 `author`）                       |
| `url`    | 音訊位址（必填）                                |
| `cover`  | 封面（預設取 `pic`）                            |
| `lrc`    | 歌詞（字串或 URL，配合 `lrcType`）              |
| `theme`  | 單曲主題色                                      |
| `type`   | 音訊類型：`auto` \| `hls` \| `normal`           |

## DPlayer 影片播放器

### MD 圍欄

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

### MDX 元件

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### 設定項

| 欄位            | 類型                                 | 預設值    | 說明                   |
| --------------- | ------------------------------------ | --------- | ---------------------- |
| `video`         | Video                                | 必填      | 影片設定               |
| `theme`         | string                               | `#b7daff` | 主題色                 |
| `autoplay`      | boolean                              | `false`   | 自動播放               |
| `loop`          | boolean                              | `false`   | 迴圈播放               |
| `screenshot`    | boolean                              | `false`   | 截圖功能               |
| `hotkey`        | boolean                              | `true`    | 熱鍵                   |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`    | 預載入                 |
| `volume`        | number                               | `0.7`     | 初始音量               |
| `playbackSpeed` | number[]                             | —         | 播放速度列表           |
| `subtitle`      | Subtitle                             | —         | 字幕                   |
| `danmaku`       | Danmaku                              | —         | 彈幕                   |
| `live`          | boolean                              | `false`   | 直播模式               |
| `mutex`         | boolean                              | `true`    | 互斥（同頁僅一個播放） |

### video 物件

| 欄位         | 說明                                                     |
| ------------ | -------------------------------------------------------- |
| `url`        | 影片位址（必填）                                         |
| `pic`        | 封面                                                     |
| `thumbnails` | 縮圖位址                                                 |
| `type`       | 影片類型：`auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | 多清晰度列表 + `defaultQuality` 索引                     |

### subtitle 物件

| 欄位       | 說明              |
| ---------- | ----------------- |
| `url`      | 字幕位址（必填）  |
| `type`     | `webvtt` \| `ass` |
| `fontSize` | 字型大小          |
| `bottom`   | 距底部距離        |
| `color`    | 顏色              |

### danmaku 物件（彈幕）

| 欄位      | 說明                  |
| --------- | --------------------- |
| `id`      | 彈幕池唯一 ID（必填） |
| `api`     | 彈幕 API 位址（必填） |
| `user`    | 使用者標識            |
| `maximum` | 最大彈幕數            |

## 懶載入機制

播放器透過 IntersectionObserver 懶載入：佔位 div 進入視口前 200px 時才動態 `import` 播放器模組與樣式並實例化。

- **APlayer**：動態 `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**：動態 `import("dplayer")`（樣式內聯於 JS，無需單獨載入 CSS）

模組載入透過共享 Promise 快取，避免重複動態 import。防重複實例化透過 `dataset` 標記（`xng-init`、`xng-observed`）。

## View Transitions 適配

播放器指令碼監聽 `astro:page-load`，每次頁面載入後重新掃描佔位 div。View Transitions 切換頁面後，新頁面的播放器佔位會被重新觀察與懶載入。

## 效能最佳化

- 關閉播放器時零打包（remark 外掛不注入、客戶端指令碼不載入）
- 啟用但頁面無播放器時零執行時（指令碼載入但不實例化）
- 播放器模組獨立 chunk，僅在使用頁面按需載入
- CSS 與 JS 分開 import，確保樣式先於實例化就緒

## 型別宣告

APlayer 與 DPlayer 無官方 TypeScript 型別，星羅在 [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) 與 [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts) 提供寬鬆模組宣告，options 欄位設為可選以相容 spread 呼叫。MDX 元件的 Props 有完整型別約束。
