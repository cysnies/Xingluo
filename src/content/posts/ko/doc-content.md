---
title: "콘텐츠 작성"
pubDatetime: 2026-06-20T05:00:00+08:00
description: "Xingluo 콘텐츠 작성 가이드 - 게시물 프론트매터, Markdown/MDX 구문, 코드 하이라이팅, 콜아웃 및 콘텐츠 향상 기능."
tags:
  - documentation
  - writing
category: "Documentation"
translationKey: doc-content
locale: ko
---

Xingluo는 Astro Content Collections를 사용하여 콘텐츠를 관리하며, Markdown(`.md`) 및 MDX(`.mdx`, `features.mdx` 필요)를 지원합니다.

## 콘텐츠 컬렉션

[`src/content.config.ts`](../src/content.config.ts)에 두 개의 컬렉션이 정의되어 있습니다:

| 컬렉션  | 디렉토리             | 용도                         |
| ------- | -------------------- | ---------------------------- |
| `posts` | `src/content/posts/` | 블로그 게시물                |
| `pages` | `src/content/pages/` | 정적 페이지(예: 소개 페이지) |

파일 명명 규칙:

- `_`로 시작하는 파일 또는 디렉토리는 무시됩니다(초안에 편리)
- MDX가 활성화된 경우 `**/*.{md,mdx}`가 수집되고, 그렇지 않으면 `**/*.md`만 수집
- 게시물 URL은 파일 경로에서 파생됩니다([아키텍처 개요](./doc-architecture.md)의 라우팅 섹션 참조)

## 게시물 프론트매터

`posts` 컬렉션의 전체 필드:

```markdown
---
title: "게시물 제목" # 필수
pubDatetime: 2026-06-19T10:00:00+08:00 # 필수, 발행 시간
modDatetime: 2026-06-20T10:00:00+08:00 # 선택, 업데이트 시간
description: "요약, SEO 및 목록에 사용" # 필수
tags: ["Astro", "블로그"] # 선택, 기본값 ["others"]
featured: true # 선택, 홈페이지에 표시
draft: false # 선택, 초안은 게시되지 않음
author: "Xingluo" # 선택, 기본값 site.author
ogImage: "./cover.png" # 선택, OG 이미지(이미지 가져오기 또는 문자열 경로)
canonicalURL: "https://..." # 선택, 표준 링크
hideEditPost: false # 선택, 편집 링크 숨기기
timezone: "Asia/Shanghai" # 선택, 사이트 타임존 재정의
---
```

### 필드 참조

| 필드             | 타입            | 기본값          | 비고                                                                                     |
| ---------------- | --------------- | --------------- | ---------------------------------------------------------------------------------------- |
| `title`          | string          | 필수            | 게시물 제목                                                                              |
| `pubDatetime`    | date            | 필수            | 발행 시간, ISO 8601                                                                      |
| `modDatetime`    | date            | —               | 업데이트 시간; 발행 시간과 함께 표시                                                     |
| `description`    | string          | 필수            | 요약, meta·RSS·목록 카드에 사용                                                          |
| `tags`           | string[]        | `["others"]`    | 태그 배열; 태그 페이지 자동 생성                                                         |
| `featured`       | boolean         | —               | 홈페이지 "추천" 섹션에 표시                                                              |
| `draft`          | boolean         | —               | 초안; 프로덕션 빌드에서 제외(개발에서는 표시)                                            |
| `author`         | string          | `site.author`   | 저자 이름                                                                                |
| `ogImage`        | image \| string | —               | OG 이미지; `image()`는 Astro 에셋 파이프라인 사용, 문자열은 `public/` 경로 또는 외부 URL |
| `canonicalURL`   | string          | —               | 표준 링크, 기본값 재정의([SEO](./doc-seo.md) 참조)                                       |
| `hideEditPost`   | boolean         | —               | 이 게시물의 편집 링크 숨기기                                                             |
| `timezone`       | string          | `site.timezone` | 이 게시물의 표시 타임존 재정의                                                           |
| `locale`         | string          | `site.lang`     | 게시물이 작성된 언어(예: `"en"`, `"ja"`). 미설정 시 사이트 언어 사용                     |
| `translationKey` | string          | —               | 번역 그룹 키: 동일한 키를 가진 게시물은 서로의 번역. 키가 없으면 독립                    |
| `category`       | string          | —               | 게시물 카테고리(단일 값), `/categories/<slug>/` 페이지 생성. 미설정 시 카테고리 없음     |

### 콘텐츠 수준 번역

`locale` 및 `translationKey` 프론트매터 필드를 사용하여 게시물의 다국어 버전을 만듭니다:

1. 기본 언어 게시물을 `src/content/posts/<slug>.md`에 배치
2. 번역을 언어 하위 디렉토리에 배치: `src/content/posts/<locale>/<slug>.md` (예: `en/welcome.md`)
3. 번역의 `locale`을 해당 언어로 설정하고 `translationKey`를 원본과 동일하게 설정

라우팅 계층이 언어별로 올바른 번역을 자동으로 확인하고 목록에서 중복을 제거합니다. 번역이 없는 게시물은 원본 콘텐츠로 폴백됩니다. [국제화](./doc-i18n.md)를 참조하세요.

### 예약 게시

미래 타임스탬프가 있는 게시물은 `scheduledPostMargin` 허용 오차를 사용하여 프로덕션에서 필터링됩니다. `pubDatetime`이 현재 시간으로부터 허용 오차 창(기본값 15분) 내에 있으면 게시된 것으로 처리됩니다. 개발 환경에서는 모든 비초안 게시물이 표시됩니다.

## 정적 페이지 프론트매터

`pages` 컬렉션은 더 간단한 필드를 가집니다:

```markdown
---
title: "소개"
description: "이 사이트 소개" # 선택
ogImage: "default-og.jpg" # 선택, 문자열만
canonicalURL: "https://..." # 선택
---
```

소개 페이지는 `getEntry("pages", "about")`로 가져오며 `src/content/pages/about.md`를 생성해야 합니다.

## Markdown 확장

Xingluo에는 다음 remark / rehype 플러그인이 내장되어 있습니다(`astro.config.ts` 참조):

### 목차

`remark-toc`가 목차를 자동 생성하고 `remark-collapse`가 기본적으로 접습니다. 게시물에 플레이스홀더를 삽입합니다:

```markdown
## 목차

(목차가 여기에 자동으로 채워집니다)
```

### 콜아웃

`rehype-callouts`는 Obsidian 스타일 콜아웃을 지원합니다:

```markdown
> [!NOTE]
> 노트 내용

> [!WARNING]
> 경고 내용

> [!TIP]
> 팁 내용
```

지원 타입: `NOTE`, `TIP`, `INFO`, `WARNING`, `DANGER`, `SUCCESS`, `QUESTION`, `FAILURE` 등.

### 코드 하이라이팅

Shiki 듀얼 테마(라이트 `min-light`, 다크 `night-owl`)가 지원:

- 줄 하이라이팅: ` ```js {1,3-5} `
- 단어 하이라이팅: ` ```js /word/ `
- Diff 마커: 줄 시작의 `+` / `-`
- 파일명 레이블: ` ```js file=src/index.ts ` 또는 `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // 하이라이트된 줄
}
```

### 테이블

넓은 테이블은 `rehypeWrapTable` 플러그인에 의해 자동으로 가로 스크롤 가능한 컨테이너에 래핑되어 좁은 화면에서 오버플로를 방지합니다.

## MDX 지원

`features.mdx`를 활성화하면(기본값) `.mdx` 파일을 사용하여 컴포넌트 기반 작성이 가능합니다.

### 커스텀 컴포넌트

Xingluo의 내장 MDX 컴포넌트는 [`src/components/mdx/`](../src/components/mdx)에 있으며 통합 진입점에서 가져옵니다:

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# 내 게시물

<APlayer
  audio={[
    {
      name: "곡명",
      artist: "아티스트",
      url: "/audio.mp3",
      cover: "/cover.jpg",
    },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

자세한 내용은 [미디어 플레이어](./doc-media-players.md)를 참조하세요.

### MDX 비활성화

`features.mdx: false`인 경우:

- `mdx()` 통합이 로드되지 않음
- 콘텐츠 컬렉션 glob이 `*.md`만 일치(기존 `.mdx` 파일은 수집되지 않음)
- 빌드 출력에 MDX 런타임이 포함되지 않음

## 댓글

댓글 시스템은 게시물 상세 페이지 하단에 자동으로 렌더링됩니다(`features.comments`에서 제공자 구성). [댓글 시스템](./doc-comments.md)을 참조하세요.

## 읽기 시간

예상 읽기 시간이 게시물 상세 페이지와 목록 카드에 자동으로 표시됩니다:

- **CJK 언어**(zh-cn, ja, ko): CJK 문자 수로 계산, 약 400자/분
- **기타 언어**: 단어 수(공백 구분)로 계산, 약 200단어/분
- 결과는 올림, 최소 1분

계산 전에 코드 블록, HTML 태그, Markdown 링크 URL 및 기타 본문 외 콘텐츠가 제거되어 실제 읽기 양에 가까운 추정치를 제공합니다. 설정이 필요하지 않습니다.

## 관련 게시물

최대 2개의 관련 게시물이 게시물 상세 페이지 하단(이전/다음 탐색 뒤)에 표시됩니다:

- 공유 태그 수로 내림차순 정렬
- 동점인 경우 발행일로 내림차순 정렬(최신 게시물 우선)
- 태그를 공유하는 게시물이 없으면 섹션이 렌더링되지 않음
- Flexsearch 검색 인덱스에서 자동으로 무시됨

설정이 필요하지 않습니다.

## 고정 목차 사이드바

큰 화면(≥1024px)에서 게시물 상세 페이지 오른쪽에 고정 목차 사이드바가 표시됩니다:

- 기사의 h2~h6 제목에서 자동 생성, 평평한 들여쓰기 목록으로 표시
- 들여쓰기는 제목 깊이 반영(h3는 h2보다 한 단계 더 들여쓰기)
- 스크롤 시 현재 섹션 강조(IntersectionObserver)
- 목차 항목 클릭 시 해당 제목으로 부드럽게 스크롤
- 작은 화면(모바일)에서는 숨겨지며, 인라인 접이식 목차 사용 가능

Astro의 `render()`가 반환하는 `headings`에서 생성되므로 작성자가 수동으로 목차를 유지할 필요가 없습니다. 인라인 `remark-toc` 접이식 목차(게시물에 `## Table of contents` 작성)는 작은 화면에서 사이드바와 공존합니다.

## 카테고리

`category` 프론트매터 필드(단일 문자열)를 통해 게시물에 카테고리를 할당합니다:

```yaml
---
title: "내 게시물"
category: "tutorial"
---
```

- 카테고리 페이지는 `/categories/<slug>/`에 있습니다. 슬러그는 `slugifyStr`로 정규화(CJK는 유지, 라틴어는 소문자 하이픈)
- 카테고리 인덱스 `/categories/`는 모든 카테고리를 나열
- 게시물 카드와 상세 페이지는 자동으로 카테고리 링크 표시(클릭 시 카테고리 페이지로 이동)
- 게시물은 최대 하나의 카테고리에 속함(여러 `tags`와 다름). `category`가 없는 게시물은 카테고리에 표시되지 않음
- 카테고리 페이지는 `posts.perPage`를 페이지네이션에 재사용하며 다국어 미러 라우트 지원(`/en/categories/...`)
- `features.showCategories: false`로 카테고리 비활성화(탐색 항목과 페이지 제거, 사이트맵 필터링)
