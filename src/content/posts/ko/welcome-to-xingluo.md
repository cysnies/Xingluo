---
title: "Xingluo에 오신 것을 환영합니다"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo는 Astro와 shadcn 시각적 스타일로 구축된 현대적인 블로그 CMS입니다. 이 글은 디자인 철학과 핵심 기능을 소개합니다."
tags:
  - announcement
  - Astro
featured: true
locale: ko
translationKey: welcome-to-xingluo
category: announcement
---

## Xingluo 소개

**Xingluo**는 Astro와 shadcn 시각적 스타일로 구축된 블로그 CMS입니다.

## 핵심 기능

- ⚡ **극한의 성능**: Astro 정적 생성, 제로 런타임 JavaScript 오버헤드
- 🎨 **현대적인 비주얼**: shadcn/ui new-york 스타일, OKLCH 색 공간
- 🌗 **다크 모드**: 깜빡임 없는 전환, 시스템 설정 따름
- 🔍 **전체 텍스트 검색**: Flexsearch 기반 빌드 타임 인덱싱
- 🌐 **다국어**: 한국어, 영어, 중국어 지원
- 📝 **Markdown**: MDX, 구문 강조, 목차, 콜아웃
- 📡 **RSS 및 SEO**: RSS 피드 및 구조화된 데이터 즉시 사용 가능

## 코드 예제

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 글쓰기 시작

`src/content/posts/` 디렉토리에 Markdown 파일을 만들고 frontmatter를 추가하여 글을 게시하세요. 자세한 필드 설명은 프로젝트 문서를 참조하세요.

글쓰기 여정을 시작하세요!
