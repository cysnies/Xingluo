---
title: "아키텍처 개요"
pubDatetime: 2026-06-20T07:00:00+08:00
description: "Xingluo 아키텍처 개요 - 디렉터리 구조, 설정 흐름, 렌더링 흐름, 빌드 파이프라인 및 확장 가이드."
tags:
  - documentation
  - architecture
category: "Documentation"
translationKey: doc-architecture
locale: ko
---

이 문서는 Xingluo의 전체 아키텍처, 디렉터리 구조, 설정 흐름, 렌더링 흐름 및 빌드 파이프라인을 설명하여 코드 구성을 이해하고 확장하는 방법을 돕습니다.

## 디렉터리 구조

```
xingluo/
├── astro.config.ts          # Astro 설정 (통합, i18n, markdown, 폰트, env)
├── xingluo.config.ts        # 사용자 설정 항목
├── tsconfig.json            # TypeScript 설정 (strict + @/* 경로 별칭)
├── package.json             # 종속성 및 스크립트
├── public/                  # 정적 자산 (favicon.svg, 기본 OG 이미지 등)
├── docs/                    # 프로젝트 문서 (이 디렉터리)
├── references/              # 읽기 전용 참조 프로젝트 소스 (종속 금지)
└── src/
    ├── config.ts            # 설정 기본값 병합, 해결된 설정 내보내기
    ├── content.config.ts    # 콘텐츠 컬렉션 스키마 (posts, pages)
    ├── env.d.ts             # 타사 모듈 및 환경 변수 타입 선언
    ├── assets/              # 아이콘 컴포넌트
    │   └── icons/           # astro-icon + Font Awesome (socials/ 포함)
    ├── components/          # UI 컴포넌트
    │   ├── ui/              # shadcn 스타일 컴포넌트(Button, Card, Badge 등)
    │   ├── post/            # 게시물 페이지 컴포넌트(이전/다음 탐색, 뒤로, 공유 등)
    │   ├── comments/        # 댓글 시스템 컴포넌트
    │   ├── mdx/             # MDX 커스텀 컴포넌트(APlayer, DPlayer)
    │   ├── pageViews/       # 페이지 뷰(중앙 집중식 페이지 렌더링 로직)
    │   └── *.astro          # 루트 레벨 컴포넌트(Header, Footer, PostCard 등)
    ├── content/             # 콘텐츠 파일
    │   ├── posts/           # 블로그 게시물
    │   └── pages/           # 정적 페이지
    ├── i18n/                # 국제화
    │   ├── index.ts         # 언어 로딩 및 useTranslations
    │   ├── types.ts         # 전체 UIStrings 타입
    │   ├── routing.ts       # 로케일 경로 확인
    │   ├── staticPaths.ts   # 기본값이 아닌 로케일의 getStaticPaths
    │   ├── format.ts        # 템플릿 문자열 교체
    │   └── lang/            # 언어 리소스 파일(zh-cn.ts, en.ts)
    ├── layouts/             # 레이아웃
    │   ├── Layout.astro     # 베이스 스켈레톤(head, SEO, FOUC)
    │   └── PostLayout.astro # 게시물 레이아웃(JSON-LD, article meta)
    ├── lib/                 # 기초 유틸리티
    │   ├── utils.ts         # cn(tailwind-merge + clsx)
    │   ├── dayjs.ts         # dayjs 인스턴스 및 타임존 플러그인
    │   └── socialIcons.ts   # 소셜 아이콘 동적 확인
    ├── pages/               # 라우트(루트 + [locale]/ 미러)
    ├── scripts/             # 클라이언트 사이드 스크립트
    │   ├── theme.ts         # 테마 전환
    │   ├── postEnhancements.ts # 게시물 확장(앵커, 복사, 라이트박스, 진행)
    │   ├── comments.ts      # 댓글 지연 로딩 및 테마 동기화
    │   └── players.ts       # 플레이어 지연 로딩
    ├── styles/              # 스타일
    │   ├── global.css       # Tailwind 진입점 + 베이스 레이어 + 커스텀 유틸리티
    │   ├── theme.css        # shadcn 테마 변수(OKLCH)
    │   └── typography.css   # .app-prose 타이포그래피 및 코드 블록 스타일
    ├── types/               # 타입 선언
    │   ├── config.ts        # 설정 타입
    │   └── *.d.ts           # 타입 없는 서드파티 모듈 선언
    └── utils/               # 유틸리티 함수
        ├── getPostPaths.ts  # 게시물 슬러그 및 URL 도출
        ├── getSortedPosts.ts# 게시물 정렬
        ├── postFilter.ts    # 초안 및 예약 게시물 필터링
        ├── getUniqueTags.ts # 태그 중복 제거
        ├── remarkPlayers.ts # 플레이어 remark 플러그인
        ├── rehypeWrapTable.ts# 테이블 스크롤 래퍼
        └── ...              # 기타 유틸리티
```

## 설정 흐름

```
xingluo.config.ts
   │ defineXingluoConfig (타입 제약, 통과)
   ▼
src/config.ts
   │ resolveConfig (기본값 병합 + resolveComments + resolvePlayers)
   ▼
src/types/config.ts
   │ XingluoConfig (전체 타입)
   ▼
import config from "@/config"를 통해 사이트 전체에서 참조
```

핵심 포인트:

- `xingluo.config.ts`는 사용자가 편집해야 하는 유일한 설정 파일
- `src/config.ts`의 `resolveConfig`는 얕은 병합(`site`/`posts`)과 깊은 병합(`features.editPost`, `features.comments`, `features.players`)을 수행
- `astro.config.ts`는 미해결된 `./xingluo.config`를 읽음(통합 로딩이 Astro 설정 계층에서 결정되므로). 따라서 `features`에 선택적 체이닝으로 접근
- `src/content.config.ts`는 해결된 `@/config`를 읽으므로 `features`는 필수

## 렌더링 흐름

### 페이지 렌더링

Xingluo는 "얇은 페이지 래퍼 + 뷰 컴포넌트" 패턴을 사용하여 렌더링 로직을 `src/components/pageViews/`에 중앙 집중화합니다:

```
src/pages/posts/[...slug]/index.astro   ← 얇은 래퍼: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← 렌더링 로직
    │
    ▼
src/layouts/PostLayout.astro  ← 게시물 레이아웃(JSON-LD, article meta)
    │
    ▼
src/layouts/Layout.astro      ← 베이스 스켈레톤(head, SEO, FOUC, ClientRouter)
```

얇은 래퍼 페이지는 `getStaticPaths`와 props 전달만 처리하며, 뷰 컴포넌트가 모든 렌더링 로직을 보유합니다. `[locale]/` 미러 페이지도 마찬가지로 얇은 래퍼이며, `getLocaleParams()`를 통해 기본값이 아닌 로케일만 생성합니다.

### 라우팅

```
src/pages/
├── 404.astro                      # 404 (미러 안 됨)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # 사이트 수준 OG 이미지 엔드포인트
├── rss.xml.ts                     # RSS 엔드포인트
├── robots.txt.ts                  # robots.txt 엔드포인트
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # 게시물 수준 OG 이미지 엔드포인트
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # 기본값이 아닌 로케일 미러(getStaticPaths=getLocaleParams)
    └── (404, og.png, rss, robots 제외하고 루트 구조 미러링)
```

### 게시물 URL 도출

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: 콘텐츠 컬렉션 `id`와 파일 경로에서 라우팅 슬러그 도출, `_` 접두사 디렉토리 필터링
- `getPostUrl(id, filePath, locale)`: 로케일 접두사가 있는 탐색 가능한 URL 생성(기본 로케일은 접두사 없음)

### 게시물 필터링 및 정렬

- [`postFilter.ts`](../src/utils/postFilter.ts): 초안 제외; 프로덕션에서 `pubDatetime - scheduledPostMargin`을 사용하여 미래 게시물 필터링; 개발에서는 모두 표시
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): 필터링 후 `modDatetime ?? pubDatetime`으로 내림차순 정렬
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): 슬러그로 태그 중복 제거 및 정렬

## 클라이언트 사이드 스크립트

Xingluo의 클라이언트 사이드 상호작용은 페이지 하단의 `<script>` 태그를 통해 로드되며, 모두 View Transitions에 적응합니다:

| 스크립트              | 로드 위치                                           | 이벤트 적응                                                                                            | 책임                                               |
| --------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `theme.ts`            | `Layout.astro` body 끝                              | `astro:after-swap`에서 재바인딩, `astro:before-swap`에서 theme-color 전달, `prefers-color-scheme` 변경 | 테마 지속성 및 전환                                |
| `postEnhancements.ts` | `PostDetailView.astro`                              | `astro:page-load`에서 재초기화                                                                         | 제목 앵커, 코드 복사, 읽기 진행, 이미지 라이트박스 |
| `comments.ts`         | `Comments.astro`                                    | `astro:page-load`에서 재스캔                                                                           | 댓글 지연 로딩 및 테마 동기화                      |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (조건부) | `astro:page-load`에서 재스캔                                                                           | 플레이어 지연 로딩                                 |

> 참고: `comments.ts`와 `players.ts`에는 최상위 import/export가 없습니다. 파일 끝에 `export {}`를 추가하여 모듈로 표시하고 다른 파일과의 전역 선언 충돌을 방지하세요.

## 빌드 파이프라인

`pnpm run build` = `astro check && astro build && node scripts/generateSearchIndex.mjs`

1. **`astro check`**: TypeScript + Astro 템플릿 타입 검사
2. **`astro build`**:
   - 콘텐츠 컬렉션 수집(`features.mdx`에 따라 `.mdx` 포함)
   - 모든 페이지 정적 생성(`[locale]/` 미러 포함)
   - 엔드포인트 생성: RSS, 사이트맵, robots.txt, 사이트 및 게시물 수준 OG 이미지
   - 조건부로 `mdx()` 통합 로드; 조건부로 `remarkPlayers` 주입
   - 빌드 시 SVG 아이콘 인라인(astro-icon, 런타임 JS 제로)
   - 동적으로 가져온 댓글 및 플레이어 모듈은 독립 청크로 분할(지연 로드)
3. **`node scripts/generateSearchIndex.mjs`**: `dist/`의 HTML 파일 스캔, 페이지 콘텐츠를 파싱하여 언어별 검색 인덱스를 `dist/search/`에 생성

## 성능 전략

- **런타임 JS 제로 아이콘**: astro-icon이 빌드 시 Font Awesome SVG를 인라인(스프라이트 `<symbol>` 모드)
- **SVG 최적화**: `experimental.svgOptimizer`(svgo)가 인라인 및 참조 SVG 압축
- **온디맨드 지연 로딩**: 댓글과 플레이어가 스크롤되어 보일 때 IntersectionObserver를 통해 동적 가져오기; 비활성화 시 번들 제로
- **조건부 통합**: MDX가 꺼져 있으면 `mdx()` 통합이 로드되지 않음; 플레이어가 꺼져 있으면 remark 플러그인이 주입되지 않음
- **CSS 크기**: Tailwind v4가 온디맨드 생성; OKLCH 변수는 중앙 관리
- **OG 이미지 폰트**: satori만 사용, 사이트 CSS에 주입되지 않음
- **View Transitions**: `<ClientRouter/>`가 페이지 전환 애니메이션 구동; 검색 상자는 `transition:persist`를 사용하여 상태 유지

## 확장 가이드

### 페이지 추가

1. `src/pages/`에 `.astro` 파일 생성(얇은 래퍼)
2. `src/components/pageViews/`에 해당 View 컴포넌트 생성
3. 다국어 지원을 위해 `src/pages/[locale]/`에 동일한 이름의 미러 얇은 래퍼 생성

### UI 컴포넌트 추가

shadcn 스타일을 따릅니다: `src/components/ui/` 아래에 `.astro` 컴포넌트와 `.ts` 변형 설정을 생성합니다(`class-variance-authority` 사용).

### 클라이언트 사이드 스크립트 추가

`src/scripts/`에 `.ts` 파일을 생성하고, 파일 끝에 `export {}`를 추가하여 모듈로 표시한 후, `astro:page-load`를 수신하여 View Transitions에 적응하고, 해당 페이지의 `<script>` 태그에서 가져옵니다.

### 새 remark/rehype 플러그인 추가

`src/utils/`에 플러그인 파일을 생성하고 `astro.config.ts`의 `markdown.remarkPlugins` 또는 `rehypePlugins`에서 필요에 따라 주입합니다.
