---
title: "媒体播放器"
pubDatetime: 2026-06-20T10:00:00+08:00
description: "星罗媒体播放器使用指南，涵盖 APlayer 音乐播放器与 DPlayer 视频播放器的 Markdown 围栏与 MDX 组件用法。"
tags:
  - 文档
  - 播放器
category: "文档"
translationKey: doc-media-players
---

星罗整合 APlayer（音乐播放器）与 DPlayer（视频播放器），支持在 Markdown 与 MDX 中通过两种方式创建播放器，统一懒加载。

## 启用

在 [`xingluo.config.ts`](../xingluo.config.ts) 的 `features.players` 中按需开启：

```ts
features: {
  players: {
    aplayer: true,  // 启用 APlayer 音乐播放器
    dplayer: true,  // 启用 DPlayer 视频播放器
  },
}
```

两者可独立开关。关闭时：

- `remarkPlayers` 插件不注入（MD 围栏不解析）
- 播放器客户端脚本不加载
- 产物无 aplayer / dplayer chunk

## 两种使用方式

| 方式     | 适用场景             | 语法                                                  |
| -------- | -------------------- | ----------------------------------------------------- |
| MD 围栏  | 普通 `.md` 与 `.mdx` | ` ```aplayer ` / ` ```dplayer ` + JSON 配置体         |
| MDX 组件 | 仅 `.mdx`            | `import { APlayer, DPlayer } from "@/components/mdx"` |

两种方式最终输出相同的占位 div 结构（`<div class="xng-aplayer|xng-dplayer" data-config>`），由 [`src/scripts/players.ts`](../src/scripts/players.ts) 统一懒加载实例化。

## APlayer 音乐播放器

### MD 围栏

````markdown
```aplayer
{
  "audio": [
    {
      "name": "曲名",
      "artist": "艺术家",
      "url": "/audio/song.mp3",
      "cover": "/images/cover.jpg",
      "lrc": "[00:00.00] 歌词第一行"
    }
  ],
  "theme": "#b7daff",
  "loop": "all",
  "autoplay": false
}
```
````

````

### MDX 组件

```mdx
import { APlayer } from "@/components/mdx";

<APlayer
  audio={[
    { name: "曲名", artist: "艺术家", url: "/audio/song.mp3", cover: "/images/cover.jpg" }
  ]}
  theme="#b7daff"
  loop="all"
/>
````

### 配置项

| 字段            | 类型                           | 默认值    | 说明                                  |
| --------------- | ------------------------------ | --------- | ------------------------------------- |
| `audio`         | Audio \| Audio[]               | 必填      | 音频对象或列表                        |
| `theme`         | string                         | `#b7daff` | 播放器主题色                          |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`     | 循环模式                              |
| `order`         | `"list"` \| `"random"`         | `list`    | 播放顺序                              |
| `volume`        | number                         | `0.7`     | 初始音量（0~1）                       |
| `autoplay`      | boolean                        | `false`   | 自动播放（受浏览器策略限制）          |
| `listFolded`    | boolean                        | `false`   | 列表折叠                              |
| `listMaxHeight` | string                         | —         | 列表最大高度（CSS 值）                |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`       | 歌词类型：0 不解析 / 1 字符串 / 2 URL |

### audio 对象

| 字段     | 说明                                            |
| -------- | ----------------------------------------------- |
| `name`   | 曲目名（缺省取 `title`，再缺省 `'Audio name'`） |
| `artist` | 艺术家（缺省取 `author`）                       |
| `url`    | 音频地址（必填）                                |
| `cover`  | 封面（缺省取 `pic`）                            |
| `lrc`    | 歌词（字符串或 URL，配合 `lrcType`）            |
| `theme`  | 单曲主题色                                      |
| `type`   | 音频类型：`auto` \| `hls` \| `normal`           |

## DPlayer 视频播放器

### MD 围栏

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

````

### MDX 组件

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
````

### 配置项

| 字段            | 类型                                 | 默认值    | 说明                   |
| --------------- | ------------------------------------ | --------- | ---------------------- |
| `video`         | Video                                | 必填      | 视频配置               |
| `theme`         | string                               | `#b7daff` | 主题色                 |
| `autoplay`      | boolean                              | `false`   | 自动播放               |
| `loop`          | boolean                              | `false`   | 循环播放               |
| `screenshot`    | boolean                              | `false`   | 截图功能               |
| `hotkey`        | boolean                              | `true`    | 热键                   |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`    | 预加载                 |
| `volume`        | number                               | `0.7`     | 初始音量               |
| `playbackSpeed` | number[]                             | —         | 播放速度列表           |
| `subtitle`      | Subtitle                             | —         | 字幕                   |
| `danmaku`       | Danmaku                              | —         | 弹幕                   |
| `live`          | boolean                              | `false`   | 直播模式               |
| `mutex`         | boolean                              | `true`    | 互斥（同页仅一个播放） |

### video 对象

| 字段         | 说明                                                     |
| ------------ | -------------------------------------------------------- |
| `url`        | 视频地址（必填）                                         |
| `pic`        | 封面                                                     |
| `thumbnails` | 缩略图地址                                               |
| `type`       | 视频类型：`auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | 多清晰度列表 + `defaultQuality` 索引                     |

### subtitle 对象

| 字段       | 说明              |
| ---------- | ----------------- |
| `url`      | 字幕地址（必填）  |
| `type`     | `webvtt` \| `ass` |
| `fontSize` | 字号              |
| `bottom`   | 距底部距离        |
| `color`    | 颜色              |

### danmaku 对象（弹幕）

| 字段      | 说明                  |
| --------- | --------------------- |
| `id`      | 弹幕池唯一 ID（必填） |
| `api`     | 弹幕 API 地址（必填） |
| `user`    | 用户标识              |
| `maximum` | 最大弹幕数            |

## 懒加载机制

播放器通过 IntersectionObserver 懒加载：占位 div 进入视口前 200px 时才动态 `import` 播放器模块与样式并实例化。

- **APlayer**：动态 `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**：动态 `import("dplayer")`（样式内联于 JS，无需单独加载 CSS）

模块加载通过共享 Promise 缓存，避免重复动态 import。防重复实例化通过 `dataset` 标记（`xng-init`、`xng-observed`）。

## View Transitions 适配

播放器脚本监听 `astro:page-load`，每次页面加载后重新扫描占位 div。View Transitions 切换页面后，新页面的播放器占位会被重新观察与懒加载。

## 性能优化

- 关闭播放器时零打包（remark 插件不注入、客户端脚本不加载）
- 启用但页面无播放器时零运行时（脚本加载但不实例化）
- 播放器模块独立 chunk，仅在使用页面按需加载
- CSS 与 JS 分开 import，确保样式先于实例化就绪

## 类型声明

APlayer 与 DPlayer 无官方 TypeScript 类型，星罗在 [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) 与 [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts) 提供宽松模块声明，options 字段设为可选以兼容 spread 调用。MDX 组件的 Props 有完整类型约束。
