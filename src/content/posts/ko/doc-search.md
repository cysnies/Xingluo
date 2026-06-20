---
title: "검색"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Xingluo 검색 가이드 - Pagefind 전체 텍스트 검색 통합, 인덱스 생성, UI, 다국어 검색 및 성능."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: ko
---

Xingluo는 [Pagefind](https://pagefind.app/)를 통합하여 정적 전체 텍스트 검색을 제공하며, 언어별 인덱스와 View Transitions 상태 유지를 지원합니다.

## 활성화

`features.search`를 통해 구성합니다:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

`false`로 설정하면 검색 페이지가 `Astro.rewrite`되어 404로 리디렉션되고 검색 UI가 생성되지 않습니다.

## 작동 방식

### 색인 생성

세 번째 빌드 단계인 `pagefind --site dist`가 `dist/` 디렉토리를 스캔합니다:

- `data-pagefind-body` 속성이 있는 페이지만 색인됩니다
- 색인은 언어별로 자동 분할됩니다(`zh-cn`과 `en`이 각각 자체 색인을 가짐)
- 색인은 `dist/pagefind/`에 출력됩니다

### 색인 범위

게시물 상세 페이지의 `<main>`이 `data-pagefind-body`로 표시되어 게시물 본문만 색인됩니다. 다른 페이지(홈, 목록, 아카이브 등)는 검색 색인에 포함되지 않습니다.

## 검색 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro)가 검색 페이지를 구현합니다:

- 검색 상자와 결과 목록을 위해 `@pagefind/default-ui`를 로드합니다
- `getAssetPath("pagefind/")`를 통해 색인 자산을 찾습니다
- 전역 스타일이 Pagefind CSS 변수를 재정의하여 Xingluo 테마(`--background`, `--foreground`, `--primary` 등)에 매핑합니다
- `transition:persist`가 내비게이션 간 검색 상태를 유지합니다

### 검색 흐름

1. 사용자가 검색 상자에 입력합니다
2. Pagefind가 현재 언어 색인과 매칭합니다
3. 결과 목록에 일치하는 게시물이 표시됩니다(제목, 요약 하이라이트)
4. `processTerm`이 쿼리 매개변수가 포함된 검색 페이지 URL을 sessionStorage에 기록하여 뒤로가기 버튼이 복원할 수 있도록 합니다

## 소스 뒤로가기 내비게이션

검색 페이지와 게시물 페이지 간의 뒤로가기 메커니즘:

- `Main.astro` 컴포넌트가 소스 페이지 URL을 sessionStorage의 `backUrl`에 기록합니다
- 게시물 페이지의 `BackButton.astro`는 sessionStorage의 `backUrl`로 돌아가는 것을 선호하며, 없으면 홈페이지로 이동합니다
- 검색 페이지의 `processTerm`은 쿼리 매개변수가 포함된 URL을 기록하여 게시물에서 돌아올 때 검색 상태를 복원합니다

## 다국어 검색

Pagefind는 `data-pagefind-body` 요소의 언어 속성별로 색인을 분할합니다:

- `zh-cn` 페이지 (루트) → 중국어 색인
- `en` 페이지 (`/en/` 접두사) → 영어 색인

검색은 현재 페이지 언어에 맞는 색인을 자동으로 사용합니다: 중국어 페이지에서는 중국어, 영어 페이지에서는 영어.

## 테마 적응

Pagefind의 기본 UI에는 자체 CSS 변수가 있습니다. Xingluo는 `SearchView.astro`의 전역 스타일로 이를 재정의하여 shadcn 테마 변수에 매핑합니다:

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

다크 모드는 `.dark` 선택기를 통해 사이트 테마와 일관되게 자동 전환됩니다.

## 성능

- Pagefind 색인은 정적 파일입니다. 검색은 서버 요청 없이 클라이언트 측에서 발생합니다
- 색인은 필요 시 로드됩니다(색인 조각은 검색 시에만 다운로드)
- `transition:persist`는 내비게이션 시 검색 UI 재초기화를 방지합니다
