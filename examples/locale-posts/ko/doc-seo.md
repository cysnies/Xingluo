---
title: "SEO"
pubDatetime: 2026-06-20T11:00:00+08:00
description: "Xingluo SEO 가이드 - Open Graph, Twitter Card, canonical, JSON-LD 구조화된 데이터, RSS 및 사이트맵."
tags:
  - documentation
  - seo
category: "Documentation"
translationKey: doc-seo
locale: ko
---

Xingluo는 완전한 SEO 지원을 제공합니다: Open Graph, Twitter Card, canonical, JSON-LD 구조화 데이터, 동적 OG 이미지, RSS, 사이트맵, hreflang 다국어 선언.

## head 출력

[`src/layouts/Layout.astro`](../src/layouts/Layout.astro)의 `<head>`가 출력합니다:

- `charset`, `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (표준 링크)
- `title`, `meta title`, `meta description`, `meta author`
- `sitemap` 링크
- **Open Graph**: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
- **Twitter Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **RSS** 대체 링크
- **hreflang** 대체 링크 (언어별 + x-default)
- `theme-color` (런타임에 `theme.ts`가 채움)
- `google-site-verification` (조건부)

## 게시물 페이지 메타

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro)가 `<Fragment slot="head">`를 통해 게시물별 메타를 주입합니다:

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (`modDatetime`이 설정된 경우)
- **JSON-LD `BlogPosting` 구조화 데이터**:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "게시물 제목",
  "image": "OG 이미지 URL",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "작성자 이름",
      "url": "작성자 홈페이지"
    }
  ]
}
```

## canonical 정규화

게시물 상세 페이지(`PostDetailView.astro`)의 canonical 전략:

1. frontmatter의 사용자 정의 `canonicalURL` → 먼저 사용
2. 현재 게시물이 이 언어의 **실제 번역**인 경우(`locale`이 페이지 언어와 일치) → 자체 URL을 가리킴
3. 현재 게시물이 **대체 콘텐츠**인 경우(사용 가능한 번역 없음, 원본 사용) → 기본 언어 원본 URL을 가리킴

전략 3은 검색 엔진이 독립적인 번역이 없는 페이지를 중복 콘텐츠로 처리하지 않도록 보장합니다. 독립적인 번역이 있는 게시물은 자신을 가리키는 canonical을 가지며 별도로 색인될 수 있습니다.

## BreadcrumbList 구조화 데이터

빵 부스러기가 있는 모든 페이지(게시물 목록, 태그 색인, 태그 게시물 목록, 아카이브, 소개, 검색)는 자동으로 `BreadcrumbList` JSON-LD 구조화 데이터를 출력합니다:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "홈",
      "item": "https://..."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "게시물",
      "item": "https://.../posts/"
    }
  ]
}
```

빵 부스러기의 마지막 항목에 링크가 없는 경우(현재 페이지), 현재 페이지 URL이 `item`으로 사용됩니다. 게시물 상세 페이지는 빵 부스러기 컴포넌트를 사용하지 않으므로 이 구조화 데이터를 출력하지 않습니다.

## Open Graph 이미지

### 동적 생성

`features.dynamicOgImage`가 활성화된 경우(기본값), Xingluo는 satori + sharp를 사용하여 1200×630 OG 이미지를 동적으로 생성합니다:

- **사이트 수준**: [`src/pages/og.png.ts`](../src/pages/og.png.ts), 사용자 정의 OG 이미지가 없는 페이지용
- **게시물 수준**: [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts), `ogImage`가 없는 게시물에만 생성

### 글꼴

OG 이미지는 Noto Sans SC를 사용합니다(`astro.config.ts`의 `fonts` 설정, CSS 변수 `--font-og` 참조). 이 글꼴은 satori 전용이며 사이트 CSS에 주입되지 않습니다.

### 대체

- 글꼴을 사용할 수 없는 경우(네트워크 없음) → 1×1 플레이스홀더 PNG로 대체(빌드 실패하지 않음)
- `dynamicOgImage` 비활성화 → `public/`의 정적 기본 OG 이미지 사용

### 게시물 OG 이미지 해상도

`PostDetailView.astro`의 4단계 대체:

1. frontmatter `ogImage`가 문자열인 경우 → 직접 사용
2. frontmatter `ogImage`가 `image()` 객체인 경우 → `.src` 사용
3. `dynamicOgImage`가 활성화된 경우 → 게시물 수준 `og.png` 엔드포인트 사용
4. 그 외 → 사이트 기본 정적 OG 이미지

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts)가 RSS 피드를 생성합니다:

- 제목, 설명 및 사이트 URL은 `site` 설정에서 가져옴
- 항목은 `getSortedPosts`에서 가져옴(초안 및 예약된 게시물은 이미 필터링됨)
- 각 항목의 `link`는 `getPostUrl(id, filePath, config.site.lang)`
- `pubDate`는 `modDatetime ?? pubDatetime`

`Layout.astro`가 RSS 자동 발견 링크를 주입합니다:

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## 사이트맵

`@astrojs/sitemap` 통합(`astro.config.ts` 참조):

- `filter`: `features.showArchives`에 따라 아카이브 페이지 경로 필터링
- `i18n`: 자동 hreflang 생성을 활성화하며, `zh-cn → zh-CN`, `en → en` 매핑, defaultLocale `zh-cn`

`sitemap-index.xml` 및 언어별 대체 선언을 생성합니다. `robots.txt`가 사이트맵을 참조합니다.

## hreflang 다국어 선언

`Layout.astro`가 각 언어에 대해 `<link rel="alternate">`를 출력합니다:

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

경로는 접두사 제거 후 `parseLocaleFromPath(stripBase(...))`를 통해 정규화되어 각 언어가 올바른 URL에 매핑됩니다. `x-default`는 기본 언어를 가리킵니다.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts)가 생성합니다:

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## 사이트 확인

Google Search Console 확인은 두 가지 방법으로 `site.googleVerification`을 통해 구성됩니다:

1. 환경 변수 `PUBLIC_GOOGLE_SITE_VERIFICATION` (런타임 주입)
2. `xingluo.config.ts`의 `site.googleVerification` 필드

`<meta name="google-site-verification" content="...">`로 렌더링됩니다.
