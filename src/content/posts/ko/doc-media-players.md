---
title: "미디어 플레이어"
pubDatetime: 2026-06-20T10:00:00+08:00
description: "Xingluo 미디어 플레이어 가이드 - Markdown 펜스 및 MDX 컴포넌트를 통한 APlayer 오디오 및 DPlayer 비디오 사용."
tags:
  - documentation
  - media-players
category: "Documentation"
translationKey: doc-media-players
locale: ko
---

Xingluo는 APlayer(오디오)와 DPlayer(비디오)를 통합하며, Markdown 및 MDX에서 플레이어를 만드는 두 가지 방법을 지원하고 모두 지연 로드됩니다.

## 활성화

`features.players`에서 필요에 따라 각 플레이어를 전환하세요 [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // APlayer 오디오 플레이어 활성화
    dplayer: true,  // DPlayer 비디오 플레이어 활성화
  },
}
```

둘은 독립적입니다. 비활성화 시:

- `remarkPlayers` 플러그인이 주입되지 않음(MD 펜스가 분석되지 않음)
- 플레이어 클라이언트 스크립트가 로드되지 않음
- 빌드 출력에 aplayer / dplayer 청크가 없음

## 두 가지 사용 모드

| 모드         | 적용 대상            | 구문                                                  |
| ------------ | -------------------- | ----------------------------------------------------- |
| MD fence     | 일반 `.md` 및 `.mdx` | ` ```aplayer ` / ` ```dplayer ` + JSON 구성 본문      |
| MDX 컴포넌트 | `.mdx`만 해당        | `import { APlayer, DPlayer } from "@/components/mdx"` |

두 모드 모두 최종적으로 동일한 플레이스홀더 div 구조(`<div class="xng-aplayer|xng-dplayer" data-config>`)를 출력하며, [`src/scripts/players.ts`](../src/scripts/players.ts)에 의해 지연 로드되고 인스턴스화됩니다.

## APlayer 오디오 플레이어

### MD 펜스

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

### MDX 컴포넌트

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

### 옵션

| 필드 | 타입 | 기본값 | 설명 |
| `audio` | Audio \| Audio[] | 필수 | 오디오 객체 또는 목록 |
| `theme` | string | `#b7daff` | 플레이어 테마 색상 |
| `loop` | `"all"` \| `"one"` \| `"none"` | `all` | 반복 모드 |
| `order` | `"list"` \| `"random"` | `list` | 재생 순서 |
| `volume` | number | `0.7` | 초기 볼륨 (0–1) |
| `autoplay` | boolean | `false` | 자동 재생 (브라우저 정책에 따라 다름) |
| `listFolded` | boolean | `false` | 목록 접기 |
| `listMaxHeight` | string | — | 목록 최대 높이 (CSS 값) |
| `lrcType` | `0` \| `1` \| `2` \| `3` | `0` | 가사 유형: 0 없음 / 1 문자열 / 2 URL |

### audio 객체

| 필드     | 설명                                                         |
| -------- | ------------------------------------------------------------ |
| `name`   | 트랙 이름 (`title`로 폴백, 그 다음 `'오디오 이름'`으로 폴백) |
| `artist` | 아티스트 (`author`로 폴백)                                   |
| `url`    | 오디오 URL (필수)                                            |
| `cover`  | 커버 (`pic`으로 폴백)                                        |
| `lrc`    | 가사 (문자열 또는 URL, `lrcType`과 쌍을 이룸)                |
| `theme`  | 트랙별 테마 색상                                             |
| `type`   | 오디오 타입: `auto` \| `hls` \| `normal`                     |

## DPlayer 비디오 플레이어

### MD 펜스

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

### MDX 컴포넌트

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### 옵션

| 필드            | 타입                                 | 기본값    | 설명                            |
| --------------- | ------------------------------------ | --------- | ------------------------------- |
| `video`         | Video                                | 필수      | 비디오 설정                     |
| `theme`         | string                               | `#b7daff` | 테마 색상                       |
| `autoplay`      | boolean                              | `false`   | 자동 재생                       |
| `loop`          | boolean                              | `false`   | 반복 재생                       |
| `screenshot`    | boolean                              | `false`   | 스크린샷 기능                   |
| `hotkey`        | boolean                              | `true`    | 단축키                          |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`    | 사전 로드                       |
| `volume`        | number                               | `0.7`     | 초기 볼륨                       |
| `playbackSpeed` | number[]                             | —         | 재생 속도 목록                  |
| `subtitle`      | Subtitle                             | —         | 자막                            |
| `danmaku`       | Danmaku                              | —         | 단마쿠 (탄막 댓글)              |
| `live`          | boolean                              | `false`   | 라이브 모드                     |
| `mutex`         | boolean                              | `true`    | 뮤텍스 (페이지당 한 플레이어만) |

### video 객체

| 필드         | 설명                                                        |
| ------------ | ----------------------------------------------------------- |
| `url`        | 비디오 URL (필수)                                           |
| `pic`        | 커버                                                        |
| `thumbnails` | 썸네일 URL                                                  |
| `type`       | 비디오 타입: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | 품질 목록 + `defaultQuality` 인덱스                         |

### subtitle 객체

| 필드       | 설명              |
| ---------- | ----------------- |
| `url`      | 자막 URL (필수)   |
| `type`     | `webvtt` \| `ass` |
| `fontSize` | 글꼴 크기         |
| `bottom`   | 아래로부터의 거리 |
| `color`    | 색상              |

### danmaku 객체

| 필드      | 설명                     |
| --------- | ------------------------ |
| `id`      | 고유 단마쿠 풀 ID (필수) |
| `api`     | 단마쿠 API URL (필수)    |
| `user`    | 사용자 식별자            |
| `maximum` | 최대 단마쿠 수           |

## 지연 로딩 메커니즘

플레이어는 IntersectionObserver를 통해 지연 로딩됩니다: 플레이스홀더 div가 뷰포트의 200px 이내에 들어올 때만 플레이어 모듈과 스타일을 동적으로 `import`하고 인스턴스화합니다.

- **APlayer**: 동적 `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: 동적 `import("dplayer")` (스타일은 JS에 인라인됨; 별도 CSS 불필요)

모듈 로딩은 공유 Promise 캐시를 사용하여 반복된 동적 임포트를 방지합니다. 재인스턴스화는 `dataset` 마커(`xng-init`, `xng-observed`)를 통해 방지됩니다.

## View Transitions 적응

플레이어 스크립트는 `astro:page-load`를 수신하고 각 페이지 로드 후 플레이스홀더 div를 다시 스캔합니다. View Transitions 페이지 전환 후, 새 페이지의 플레이어 플레이스홀더가 다시 관찰되고 지연 로딩됩니다.

## 성능

- 플레이어 비활성화 시 번들 제로(remark 플러그인이 주입되지 않고 클라이언트 스크립트가 로드되지 않음)
- 활성화되어도 페이지에 플레이어가 없으면 런타임 제로(스크립트는 로드되지만 인스턴스화하지 않음)
- 플레이어 모듈은 독립 청크로, 사용하는 페이지에서만 필요 시 로드
- CSS와 JS는 별도로 임포트되어 인스턴스화 전에 스타일이 준비됨을 보장

## 타입 선언

APlayer와 DPlayer는 공식 TypeScript 타입이 없습니다. Xingluo는 [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) 및 [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts)에 느슨한 모듈 선언을 제공하며, 스프레드 호환성을 위해 옵션 필드는 선택 사항으로 설정됩니다. MDX 컴포넌트 Props는 완전한 타입 제약 조건을 가집니다.
