---
title: "설정 가이드"
pubDatetime: 2026-06-20T04:00:00+08:00
description: "Xingluo 설정 옵션 전체 참조 - 사이트 설정, 게시물 설정, 기능 토글, 소셜 링크, 공유 링크 및 환경 변수."
tags:
  - documentation
  - configuration
category: "Documentation"
translationKey: doc-configuration
locale: ko
---

Xingluo의 모든 설정 가능한 옵션은 루트 레벨의 [`xingluo.config.ts`](../xingluo.config.ts)에 있습니다. 이 파일은 `defineXingluoConfig`를 통한 완전한 타입 제약을 제공하며, 소스 코드를 건드리지 않고 변경 사항이 즉시 적용됩니다.

## site 사이트 설정

```ts
site: {
  url: "https://xingluo.example.com/",  // 사이트 URL(절대 링크, RSS, 사이트맵에 사용)
  title: "Xingluo",                      // 사이트 제목
  description: "A modern blog CMS built with Astro and shadcn",
  author: "Xingluo",                     // 기본 저자 이름
  profile: "https://xingluo.example.com", // 저자 홈페이지(JSON-LD에 사용)
  ogImage: "default-og.jpg",              // 기본 OG 이미지(public 디렉토리 내)
  lang: "zh-cn",                          // 기본 언어
  timezone: "Asia/Shanghai",              // 타임존(게시물 날짜 표시)
  dir: "ltr",                             // 텍스트 방향: ltr | rtl
  googleVerification: "",                 // Google Search Console 확인 값(또는 환경 변수)
}
```

| 필드                 | 기본값           | 비고                                                                      |
| -------------------- | ---------------- | ------------------------------------------------------------------------- |
| `url`                | 필수             | 사이트 루트 URL. `/`로 끝나야 함                                          |
| `title`              | 필수             | 사이트 제목. `<title>` 및 OG에 사용                                       |
| `description`        | 필수             | 사이트 설명. meta 및 RSS에 사용                                           |
| `author`             | 필수             | 기본 저자. 게시물 프론트매터가 이 값으로 폴백                             |
| `profile`            | —                | 저자 홈페이지. JSON-LD `author.url`에 주입                                |
| `ogImage`            | `default-og.jpg` | 기본 OG 이미지 파일명. `public/`에 위치                                   |
| `lang`               | 필수             | 기본 언어 코드. `astro.config.ts`의 `i18n.defaultLocale`과 일치해야 함    |
| `timezone`           | `Asia/Shanghai`  | dayjs 타임존. 게시물 날짜 표시에 영향                                     |
| `dir`                | `ltr`            | 텍스트 방향                                                               |
| `googleVerification` | —                | Google 확인 값. `PUBLIC_GOOGLE_SITE_VERIFICATION` 환경 변수로도 주입 가능 |

## posts 게시물 설정

```ts
posts: {
  perPage: 8,              // 목록 페이지당 게시물 수
  perIndex: 5,             // 홈페이지에 표시되는 게시물 수
  scheduledPostMargin: 900000, // 예약 게시 허용 시간(ms), 15분
}
```

- `perPage`: `/posts/[...page]` 및 `/tags/[tag]/[...page]`의 페이지 크기
- `perIndex`: 홈페이지 "최신" 섹션에 표시되는 게시물 수
- `scheduledPostMargin`: 이 시간 창 내의 미래 게시물은 게시된 것으로 처리됨(프로덕션에서 유효, 개발에서는 모두 표시)

## features 기능 설정

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "flexsearch",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| 필드               | 기본값             | 비고                                                                           |
| ------------------ | ------------------ | ------------------------------------------------------------------------------ |
| `lightAndDarkMode` | `true`             | 라이트/다크 모드 전환 활성화                                                   |
| `dynamicOgImage`   | `true`             | OG 이미지 동적 생성(satori + sharp)                                            |
| `showArchives`     | `true`             | 아카이브 페이지 표시(끄면 사이트맵도 필터링)                                   |
| `showCategories`   | `true`             | 카테고리 페이지 및 탐색 항목 표시(끄면 사이트맵도 필터링)                      |
| `showBackButton`   | `true`             | 게시물 페이지에 뒤로 가기 버튼 표시                                            |
| `editPost.enabled` | `false`            | "이 페이지 편집" 링크 표시                                                     |
| `editPost.url`     | `""`               | 편집 링크 접두사. 게시물의 상대 소스 경로가 추가됨                             |
| `search`           | `"flexsearch"`     | 검색 솔루션: `"flexsearch"` 또는 `false`                                       |
| `mdx`              | `true`             | MDX 파싱 및 렌더링 활성화([콘텐츠 작성](./doc-content.md) 참조)                |
| `comments`         | `{provider:false}` | 댓글 시스템 설정([댓글 시스템](./doc-comments.md) 참조)                        |
| `players.aplayer`  | `false`            | APlayer 오디오 플레이어 활성화([미디어 플레이어](./doc-media-players.md) 참조) |
| `players.dplayer`  | `false`            | DPlayer 비디오 플레이어 활성화                                                 |

### editPost 편집 링크

`editPost.url`은 저장소 편집 URL 접두사입니다. Xingluo는 게시물의 상대 소스 경로(`src/content/posts/...`)를 끝에 추가합니다. 예：

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

게시물 `src/content/posts/welcome.md`은 `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md` 링크를 생성합니다.

## socials 소셜 링크

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: 아이콘 이름. `src/assets/icons/socials/{name}.astro`에 해당. 내장: `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url`: 링크 URL. 메일은 `mailto:` 사용
- `linkTitle`: 선택적 접근성 제목. 생략 시 이름에서 자동 생성

> 소셜 플랫폼 추가: `src/assets/icons/socials/`에 동일한 이름의 `.astro` 아이콘 컴포넌트를 생성합니다. `src/lib/socialIcons.ts`가 `import.meta.glob`을 통해 자동으로 수집합니다.

## shareLinks 공유 링크

```ts
shareLinks: [
  { name: "x", url: "https://x.com/intent/post?url=" },
  { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
  { name: "telegram", url: "https://t.me/share/url?url=" },
  { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
  { name: "mail", url: "mailto:?subject=...&body=" },
];
```

이러한 공유 항목은 게시물 페이지 하단에 나타납니다. `url`은 공유 URL 접두사이며, Xingluo는 현재 게시물의 절대 URL을 끝에 추가합니다. `name`은 마찬가지로 `src/assets/icons/socials/`의 아이콘에 매핑됩니다.

## 환경 변수

`astro.config.ts`의 `env.schema`를 통해 선언:

| 변수                              | 액세스 수준     | 설명                                     |
| --------------------------------- | --------------- | ---------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Google Search Console 확인 값(선택 사항) |

예시(PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

이 값은 `config.site.googleVerification`에 주입되어 `<meta name="google-site-verification">`으로 렌더링됩니다.

## 전체 예시

[`xingluo.config.ts`](../xingluo.config.ts)를 참조하세요. `features.comments` 및 `features.players` 섹션에는 giscus / twikoo / waline에 대한 주석 처리된 예제가 포함되어 있습니다. 주석을 해제하고 실제 값을 입력하여 활성화하세요.
