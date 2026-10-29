---
title: "테마 및 스타일"
pubDatetime: 2026-06-20T08:00:00+08:00
description: "Xingluo 테마 및 스타일 시스템 - shadcn 테마 변수, OKLCH 색 공간, Tailwind v4 및 다크 모드."
tags:
  - documentation
  - theming
category: "Documentation"
translationKey: doc-theming
locale: ko
---

Xingluo는 shadcn/ui new-york 스타일 컴포넌트와 OKLCH 색상 공간을 사용하며, Tailwind CSS v4를 기반으로 구축되었습니다.

## 스타일 파일 구조

[`src/styles/`](../src/styles/):

| 파일             | 내용                                                            |
| ---------------- | --------------------------------------------------------------- |
| `theme.css`      | shadcn 테마 변수 (OKLCH, 라이트 `:root` + 다크 `.dark`)         |
| `global.css`     | Tailwind 진입점, 기본 레이어, 사용자 정의 유틸리티, 콜아웃 테마 |
| `typography.css` | `.app-prose` 타이포그래피 및 코드 블록 스타일                   |

## 테마 변수

`theme.css`는 OKLCH 색상 공간을 사용하여 의미론적 변수를 정의하며, 라이트 및 다크 세트가 있습니다:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  /* ... secondary, muted, accent, destructive, border, input, ring ... */
  --code: oklch(0.97 0 0);
  --content-width: 72rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... 다크 대응 값 ... */
}
```

이러한 변수는 `global.css`의 `@theme inline`에서 Tailwind 토큰에 매핑되므로 `bg-background`, `text-foreground`, `border-border` 같은 클래스를 직접 사용할 수 있습니다.

## Tailwind CSS v4

Xingluo는 `@tailwindcss/vite` 플러그인을 통해 통합된 Tailwind v4를 사용합니다(`astro.config.ts`의 `vite.plugins` 참조).

### 주요 구성 (`global.css`)

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... 색상 매핑 ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### 사용자 정의 유틸리티

- `max-w-app`: 콘텐츠 최대 너비(`--content-width: 72rem`)
- `app-layout`: 앱 레이아웃(min-height 100vh, flex column)

## 다크 모드

### FOUC 보호

`Layout.astro`는 `<head>`에 동기 스크립트(`is:inline`)를 인라인하여 첫 페인트 전에 테마를 설정합니다:

```js
// localStorage.theme을 읽거나 prefers-color-scheme으로 폴백
// html의 data-theme 속성과 .dark 클래스 설정
```

이로 인해 새로고침 시 테마 섬광을 방지합니다.

### 테마 토글 런타임

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme`: localStorage 우선, 시스템 기본 설정으로 대체
- `persist`: localStorage에 저장
- `reflect`: `data-theme` 속성, `.dark` 클래스, `#theme-btn` `aria-label`, `<meta name="theme-color">` 동기화
- `#theme-btn` 클릭을 토글에 바인딩
- View Transitions에 적응: `astro:after-swap`에서 재바인딩, `astro:before-swap`에서 theme-color 전달
- 시스템 `prefers-color-scheme` 변경 사항 수신(사용자가 명시적으로 선택하지 않은 경우에만 따름)

### 댓글 및 플레이어 테마 동기화

- giscus: `postMessage({giscus:{setConfig:{theme}}})`를 통해 전환
- waline: `dark:"html.dark"` 선택기가 자동으로 따라감
- twikoo: `.dark` 클래스 변경을 감시하고 인스턴스 재구축(twikoo는 런타임 전환 미지원)
- [댓글 시스템](./doc-comments.md) 참조

## 타이포그래피 (.app-prose)

`typography.css`의 `.app-prose`는 `@tailwindcss/typography`의 `prose`를 기반으로 테마 재정의가 적용됩니다:

- 링크 기본 색상 (`--primary`)
- 인라인 코드 배경 (`--code`)
- 코드 블록 이중 테마 (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- diff / highlight / word 줄 스타일
- blockquote, hr, img 스타일
- details / summary 접기 스타일
- 이미지 `role="button"` 라이트박스 커서
- 제목 앵커 `scroll-margin`

게시물 본문 컨테이너는 `<article class="app-prose">`를 사용합니다.

## shadcn 컴포넌트

[`src/components/ui/`](../src/components/ui/)는 shadcn 스타일 컴포넌트를 제공합니다:

| 컴포넌트                                                                               | 설명                                                  |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `Button`                                                                               | `<a>` / `<button>` 자동 전환, cva 변형(variant, size) |
| `Badge`                                                                                | 배지                                                  |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | 카드 패밀리                                           |
| `Input`                                                                                | 입력                                                  |
| `Separator`                                                                            | 구분선                                                |

변형 설정은 `class-variance-authority`를 사용합니다. 클래스 이름은 `cn`(`src/lib/utils.ts`, `tailwind-merge` + `clsx` 기반)으로 병합됩니다.

## 아이콘 시스템

Xingluo의 아이콘은 astro-icon + Font Awesome을 통해 빌드 시 인라인되는 SVG입니다(스프라이트 `<symbol>` 모드). **런타임 JS 제로, 글꼴 네트워크 요청 없음**.

### 아이콘 매핑 (FA5)

| 용도      | 아이콘 이름                                    |
| --------- | ---------------------------------------------- |
| 검색      | `fa-solid:search`                              |
| 닫기      | `fa-solid:times`                               |
| 메일      | `fa-solid:envelope`                            |
| 기타 소셜 | `fa-brands:{name}`                             |
| X (소셜)  | `fa-brands:twitter` (FA5에는 x-twitter가 없음) |

### 소셜 아이콘 동적 해석

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts)는 `import.meta.glob`을 통해 파일 이름별로 `src/assets/icons/socials/*.astro`를 수집합니다. `getSocialIcon(name)`이 이름으로 해석합니다. 소셜 플랫폼 추가는 `socials/` 아래에 아이콘 파일을 추가하기만 하면 됩니다.

## 테마 사용자 정의

`src/styles/theme.css`의 CSS 변수를 편집하여 사이트 전체 색상을 조정합니다. 예를 들어, 파란색 기본 색상으로 전환하려면:

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

`bg-primary` / `text-primary`를 참조하는 모든 컴포넌트가 자동으로 따라갑니다.
