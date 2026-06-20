# 시작하기

이 가이드는 Xingluo를 로컬 개발 및 프로덕션 빌드용으로 처음부터 시작하는 방법을 설명합니다.

## 요구 사항

| 의존성  | 최소 버전 | 비고                                             |
| ------- | --------- | ------------------------------------------------ |
| Node.js | 22.12.0   | `package.json`의 `engines.node` 참조             |
| pnpm    | 10.x      | 패키지 매니저(프로젝트는 pnpm 워크스페이스 사용) |

> 팁: [fnm](https://github.com/Schniz/fnm) 또는 [nvm](https://github.com/nvm-sh/nvm)으로 Node 버전을 관리하세요.

## 설치

저장소를 클론한 후 의존성을 설치합니다：

```bash
pnpm install
```

의존성이 설치되면 `references/` 아래의 참조 프로젝트는 TypeScript 컴파일 및 빌드에서 자동으로 제외됩니다(`tsconfig.json`의 `exclude` 참조).

## 로컬 개발

개발 서버를 시작합니다(기본값 `http://localhost:4321/`)：

```bash
pnpm dev
```

개발 모드에서는：

- 초안 및 예약 게시물은 **모두 표시**됩니다(미리보기용). 프로덕션 빌드에서만 필터링됩니다
- 콘텐츠 컬렉션 변경 시 핫 리로드가 트리거됩니다
- 클라이언트 측 동작(테마 전환, View Transitions 등)이 프로덕션과 일치합니다

## 타입 동기화

콘텐츠 컬렉션 스키마나 타입을 수정한 후 `.astro/types.d.ts`를 갱신하려면 동기화를 실행합니다：

```bash
pnpm sync
```

## 빌드

프로덕션 빌드는 세 단계로 구성됩니다(`package.json`의 `build` 스크립트 참조)：

```bash
pnpm build
```

1. **`astro check`**: TypeScript 및 Astro 템플릿 타입 검사. 오류가 있으면 빌드가 중단됩니다
2. **`astro build`**: 전체 사이트를 `dist/`에 정적으로 생성합니다(동적 OG 이미지, RSS, 사이트맵, robots.txt, pagefind UI 자산 포함)
3. **`pagefind --site dist`**: `dist/`를 스캔하여 `dist/pagefind/`에 전문 검색 인덱스를 생성합니다

> 참고: `pagefind`는 devDependency로 설치된 바이너리 도구입니다. 추가 설정이 필요하지 않습니다.

## 빌드 미리보기

`dist/`의 빌드 결과물을 로컬에서 미리봅니다：

```bash
pnpm preview
```

## 코드 품질

| 명령어              | 목적                                              |
| ------------------- | ------------------------------------------------- |
| `pnpm format`       | Prettier로 전체 코드 포맷(Astro 및 Tailwind 포함) |
| `pnpm format:check` | 포맷 준수 여부 확인(CI에서 사용)                  |
| `pnpm lint`         | ESLint 검사(`eslint-plugin-astro` 포함)           |

## 다음 단계

- [설정 가이드](./configuration.md)를 읽고 사이트 정보 및 기능 토글을 사용자 정의하세요
- [콘텐츠 작성](./content.md)을 읽고 글쓰기를 시작하세요
- [배포](./deployment.md)를 읽고 사이트를 공개하세요
