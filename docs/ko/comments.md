# 댓글 시스템

Xingluo는 giscus, twikoo, waline 세 가지 댓글 시스템을 통합하며, `features.comments`를 통해 선택할 수 있습니다.

## 설정

[`xingluo.config.ts`](../xingluo.config.ts)의 `features.comments`에서 제공자를 선택하고 해당 설정을 지정합니다:

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* giscus 설정 */ },
    // twikoo: { /* twikoo 설정 */ },
    // waline: { /* waline 설정 */ },
  },
}
```

`provider: false`(기본값)로 설정하면 댓글이 비활성화되고 게시물 페이지에 댓글 마커나 스크립트가 출력되지 않습니다.

## 댓글 섹션 위치

댓글 섹션은 **게시물 상세 페이지** 하단(이전/다음 탐색 뒤)에만 나타나며, [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro)에 의해 렌더링됩니다.

## giscus

GitHub Discussions 기반의 댓글 시스템입니다. 리포지토리는 public이어야 하며 Discussions가 활성화되어 있어야 합니다.

### 설정

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // GitHub 저장소
    repoId: "R_...",              // 저장소 ID (giscus.app에서 생성)
    category: "Announcements",    // 토론 카테고리 이름
    categoryId: "DIC_...",        // 카테고리 ID (giscus.app에서 생성)
    mapping: "pathname",          // 선택사항, 페이지-토론 매핑
    strict: false,                // 선택사항, 엄격한 제목 일치
    reactionsEnabled: true,       // 선택사항, 반응
    inputPosition: "bottom",      // 선택사항, 댓글 상자 위치: top | bottom
    loading: "lazy",              // 선택사항, 로딩 방식: lazy | eager
  },
}
```

### repoId / categoryId 가져오기

1. [giscus.app](https://giscus.app)에 방문합니다
2. 리포지토리와 카테고리를 입력하여 설정을 생성합니다
3. `data-repo-id`와 `data-category-id`를 설정에 복사합니다

### 작동 방식

giscus는 공식 `client.js`를 통해 iframe을 주입하며, `data-*` 속성이 설정을 전달합니다. 언어는 현재 로케일에 자동 매핑됩니다(`zh-cn` → `zh-CN`, `en` → `en`). 테마는 `postMessage`를 통해 전환 시 동기화됩니다.

## twikoo

백엔드 의존성이 없는 댓글 시스템으로, Tencent CloudBase 또는 자체 호스팅을 지원합니다.

### 설정

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // 클라우드 환경 ID 또는 자체 호스트 전체 URL
    lang: "zh-CN",                            // 선택, 언어
  },
}
```

### envId 참고 사항

- Tencent CloudBase: 환경 ID 입력(cloudbase SDK 필요)
- 자체 호스팅: 전체 URL 입력(예: `https://twikoo.example.com`). twikoo가 자동으로 HTTP API 모드를 감지합니다

### 작동 방식

twikoo는 댓글 컨테이너가 뷰포트에 들어오면 동적으로 `import("twikoo")`하고 `init`을 호출합니다. twikoo는 런타임 테마 전환을 지원하지 않으므로, 사이트가 테마 변경 시 인스턴스를 다시 빌드하여 다크 스타일을 적용합니다.

## waline

백엔드 기반의 댓글 시스템으로, 댓글 수와 조회 수를 지원합니다.

### 설정

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Waline 서버 주소
    lang: "zh-CN",                           // 선택, 언어
    pageSize: 10,                            // 선택, 댓글 페이지 크기
    dark: "html.dark",                       // 선택, 다크 선택자(기본값은 사이트 .dark)
  },
}
```

### serverURL 배포

[Waline 문서](https://waline.js.org/)를 참조하여 서버를 배포한 후(Vercel / Cloudflare / 자체 호스팅 모두 가능), 주소를 `serverURL`에 입력합니다.

### 작동 방식

waline은 댓글 컨테이너가 뷰포트에 들어오면 동적으로 `import("@waline/client")`와 스타일 `@waline/client/style`을 가져온 후 `init`을 호출합니다. `dark:"html.dark"` 선택자가 사이트 다크 모드를 자동으로 따라가므로 수동 동기화가 필요하지 않습니다.

## 지연 로딩

모든 댓글 시스템은 IntersectionObserver를 통해 지연 로딩됩니다: 댓글 컨테이너가 뷰포트의 200px 이내에 들어올 때만 요청과 초기화가 이루어져, 초기 렌더링 성능 비용을 방지합니다.

구현은 [`src/scripts/comments.ts`](../src/scripts/comments.ts)를 참조하세요.

## 테마 동기화

사이트 테마가 변경되면 댓글 시스템 테마가 자동으로 동기화됩니다:

| 댓글 시스템 | 동기화 방식                                                 |
| ----------- | ----------------------------------------------------------- |
| giscus      | iframe으로 `postMessage({giscus:{setConfig:{theme}}})` 전송 |
| waline      | `dark:"html.dark"` CSS 선택자가 자동으로 따라감             |
| twikoo      | `.dark` 클래스 변경을 감시하고 인스턴스를 다시 빌드함       |

테마 감시는 `document.documentElement`의 `class`와 `data-theme` 속성에 대한 `MutationObserver`를 사용합니다.

## View Transitions 적응

댓글 스크립트는 `astro:page-load`를 수신하고 각 페이지 로드 후 마운트 지점을 다시 스캔합니다. 재초기화는 `dataset` 마커(`xng-setup`, `xng-init`)를 통해 방지됩니다.

## i18n

댓글 섹션 제목은 `UIStrings.comments.title`을 통해 지역화됩니다. 댓글 시스템 UI 언어는 각 제공자의 `lang` 필드로 제어됩니다.

## 사용자 정의 확장

### 제공자 전환

`xingluo.config.ts`의 `features.comments.provider`를 변경하기만 하면 코드 변경이 필요하지 않습니다. Xingluo가 해당 하위 컴포넌트를 자동으로 렌더링합니다.

### 댓글 시스템 추가

1. `src/components/comments/` 아래에 마운트 플레이스홀더를 렌더링하는 새 컴포넌트(예: `Disqus.astro`)를 만듭니다
2. `Comments.astro`의 조건부 렌더링에 새 제공자 분기를 추가합니다
3. `src/scripts/comments.ts`에 초기화 로직을 추가합니다
4. `src/types/config.ts`에서 `CommentProvider`와 설정 타입을 확장합니다
