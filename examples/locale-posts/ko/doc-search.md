---
title: "검색"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Xingluo 검색 가이드 - Flexsearch 전체 텍스트 검색 통합, 인덱스 생성, UI, 다국어 검색 및 성능."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: ko
---

Xingluo는 [Flexsearch](https://github.com/nextapps-de/flexsearch)를 통합하여 클라이언트 측 전체 텍스트 검색을 제공하며, 언어별 인덱스와 View Transitions 상태 유지를 지원합니다.

## 활성화

`features.search`를 통해 구성합니다:

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

`false`로 설정하면 검색 페이지가 `Astro.rewrite`되어 404로 리디렉션되고 검색 UI가 생성되지 않습니다.

## 작동 방식

### 색인 생성

세 번째 빌드 단계인 `node scripts/generateSearchIndex.mjs`가 `dist/` 디렉토리의 HTML 파일을 스캔합니다:

- 페이지 콘텐츠를 파싱하여 게시물 본문을 추출합니다
- 색인은 언어별로 자동 분할됩니다(`zh-cn`과 `en`이 각각 자체 색인을 가짐)
- 색인은 `dist/search/`에 출력됩니다

### 색인 범위

빌드 스크립트가 게시물 상세 페이지의 `<main>` 콘텐츠를 파싱하므로 게시물 본문만 색인됩니다. 다른 페이지(홈, 목록, 아카이브 등)는 검색 색인에 포함되지 않습니다.

## 검색 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro)가 검색 페이지를 구현합니다:

- Flexsearch 클라이언트 측 색인을 사용하여 브라우저에서 검색 매칭
- `getAssetPath("search/")`를 통해 색인 자산을 찾습니다
- shadcn 테마 변수(`--background`, `--foreground`, `--primary` 등)를 사용하여 검색 상자와 결과 목록 스타일링
- `transition:persist`가 내비게이션 간 검색 상태를 유지합니다

### 검색 흐름

1. 사용자가 검색 상자에 입력합니다
2. Flexsearch가 현재 언어 색인과 매칭합니다
3. 결과 목록에 일치하는 게시물이 표시됩니다(제목, 발행/업데이트 날짜, 카테고리 배지, 태그, 일치하는 본문 발췌)
4. `processTerm`이 쿼리 매개변수가 포함된 검색 페이지 URL을 sessionStorage에 기록하여 뒤로가기 버튼이 복원할 수 있도록 합니다

## 소스 뒤로가기 내비게이션

검색 페이지와 게시물 페이지 간의 뒤로가기 메커니즘:

- `Main.astro` 컴포넌트가 소스 페이지 URL을 sessionStorage의 `backUrl`에 기록합니다
- 게시물 페이지의 `BackButton.astro`는 sessionStorage의 `backUrl`로 돌아가는 것을 선호하며, 없으면 홈페이지로 이동합니다
- 검색 페이지의 `processTerm`은 쿼리 매개변수가 포함된 URL을 기록하여 게시물에서 돌아올 때 검색 상태를 복원합니다

## 다국어 검색

Flexsearch는 페이지 언어별로 색인을 분할합니다:

- `zh-cn` 페이지 (루트) → 중국어 색인
- `en` 페이지 (`/en/` 접두사) → 영어 색인

검색은 현재 페이지 언어에 맞는 색인을 자동으로 사용합니다: 중국어 페이지에서는 중국어, 영어 페이지에서는 영어.

## 테마 적응

Flexsearch 검색 UI는 shadcn 테마 변수를 사용하며, `SearchView.astro`에서 검색 상자와 결과 목록 스타일을 정의합니다:

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

다크 모드는 `.dark` 선택기를 통해 사이트 테마와 일관되게 자동 전환됩니다.

## 성능

- Flexsearch 색인은 정적 파일입니다. 검색은 서버 요청 없이 클라이언트 측에서 발생합니다
- 색인은 필요 시 로드됩니다(색인 조각은 검색 시에만 다운로드)
- `transition:persist`는 내비게이션 시 검색 UI 재초기화를 방지합니다
