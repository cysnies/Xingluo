---
title: "Xingluo 문서"
pubDatetime: 2026-06-20T02:00:00+08:00
description: "Xingluo 프로젝트 문서 개요 - 탐색, 핵심 기능 및 기술 스택."
tags:
  - documentation
  - xingluo
category: "Documentation"
translationKey: doc-README
locale: ko
---

Xingluo는 [Astro](https://astro.build/)와 [shadcn/ui](https://ui.shadcn.com/) 비주얼 스타일로 구축된 현대적인 블로그 CMS입니다. 평면적이고 우아한 shadcn 컴포넌트와 OKLCH 색상 시스템을 통해 더욱 현대적인 시각적 경험을 제공하며, 댓글 시스템, 선택적 MDX 지원, 오디오/비디오 플레이어를 기본적으로 통합합니다.

## 문서 색인

| 문서                                      | 내용                                                               |
| ----------------------------------------- | ------------------------------------------------------------------ |
| [시작하기](./doc-getting-started.md)      | 요구 사항, 설치, 로컬 개발, 빌드 및 미리보기                       |
| [설정 가이드](./doc-configuration.md)     | `xingluo.config.ts` 전체 참조                                      |
| [콘텐츠 작성](./doc-content.md)           | 게시물 프론트매터, Markdown/MDX 구문, 코드 블록, 콜아웃, 향상 기능 |
| [국제화](./doc-i18n.md)                   | 다국어 라우팅, UI 문자열, 콘텐츠 수준 번역, 언어 추가              |
| [아키텍처 개요](./doc-architecture.md)    | 디렉터리 구조, 설정 흐름, 렌더링 흐름, 빌드 파이프라인             |
| [테마 및 스타일](./doc-theming.md)        | shadcn 테마 변수, OKLCH, Tailwind v4, 다크 모드                    |
| [댓글 시스템](./doc-comments.md)          | giscus / twikoo / waline 선택 및 연결                              |
| [미디어 플레이어](./doc-media-players.md) | Markdown 및 MDX에서 APlayer / DPlayer 사용                         |
| [SEO](./doc-seo.md)                       | OG 이미지, RSS, 사이트맵, hreflang, canonical, 구조화된 데이터     |
| [검색](./doc-search.md)                   | Flexsearch 전체 텍스트 검색 통합                                   |
| [배포](./doc-deployment.md)               | 정적 호스팅, GitHub Pages, 환경 변수, Docker                       |

## 핵심 기능

- **최고 수준의 성능**: Astro 정적 생성, 빌드 시 인라인 SVG 아이콘(런타임 JS 제로), 지연 로드 댓글 및 플레이어, 고아 자산 정리
- **현대적인 비주얼**: shadcn/ui new-york 컴포넌트, OKLCH 색 공간, 부드러운 다크 모드(FOUC 방지)
- **다국어**: UI 및 콘텐츠 수준 번역, `prefixDefaultLocale: false` 라우팅, hreflang 및 x-default SEO 선언
- **콘텐츠 향상**: 선택적 MDX, Shiki 듀얼 테마 코드 하이라이팅, 콜아웃, 접이식 목차, 스크롤 가능한 테이블
- **읽기 시간**: 스마트 추정(CJK는 문자 수, 라틴어는 단어 수), 카드 및 상세 페이지에 표시
- **관련 게시물**: 공유 태그로 자동 추천
- **게시물 카테고리**: 프론트매터로 할당, 전용 카테고리 페이지 및 내비게이션 항목 포함
- **고정 목차 사이드바**: 대형 화면에서 오른쪽 고정 목차, IntersectionObserver 스크롤 감지
- **댓글 시스템**: giscus / twikoo / waline, 테마 인식, 지연 로드
- **미디어 플레이어**: APlayer 오디오 및 DPlayer 비디오, MD 펜스 및 MDX 컴포넌트 진입점 모두 지원
- **검색**: Flexsearch 전체 텍스트 검색, 언어별 인덱스, View Transitions 상태 유지
- **완전한 SEO**: 동적 OG 이미지(satori + sharp), RSS, 사이트맵, JSON-LD 구조화된 데이터(BlogPosting + BreadcrumbList), canonical 정규화

## 기술 스택

| 카테고리        | 기술                                                                |
| --------------- | ------------------------------------------------------------------- |
| 프레임워크      | Astro 6.x                                                           |
| 스타일링        | Tailwind CSS v4, shadcn/ui 스타일 컴포넌트, @tailwindcss/typography |
| 아이콘          | astro-icon + Font Awesome                                           |
| 콘텐츠          | Astro Content Collections, MDX, remark/rehype 플러그인 체인         |
| 코드 하이라이팅 | Shiki                                                               |
| 검색            | Flexsearch                                                          |
| OG 이미지       | satori + sharp                                                      |
| 댓글            | giscus / twikoo / waline                                            |
| 플레이어        | APlayer / DPlayer                                                   |
| 날짜            | dayjs                                                               |
| 패키지 매니저   | pnpm                                                                |
| 언어            | TypeScript                                                          |

## 라이선스

AGPL-3.0
