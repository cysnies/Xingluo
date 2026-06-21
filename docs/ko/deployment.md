# 배포

Xingluo는 순수 정적 사이트입니다. `pnpm build`가 `dist/` 디렉토리를 생성하며, 모든 정적 호스팅 서비스에서 호스팅 가능합니다.

## 빌드 출력

```bash
pnpm build
```

## 빌드 출력

생성된 `dist/`에는 다음이 포함됩니다:

- 모든 정적 HTML 페이지 (`[locale]/` 미러 포함)
- `_astro/` 아래의 JS / CSS / 글꼴 자산
- `search/` Flexsearch 검색 인덱스
- 사이트 수준 `og.png` 및 게시물별 `og.png`
- `rss.xml`, `sitemap-index.xml`, `robots.txt`
- `public/` 아래의 정적 자산 (파비콘, 기본 OG 이미지 등)

## 환경 변수

빌드 시 설정:

| 변수                              | 설명                                      |
| --------------------------------- | ----------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console 인증 값 (선택 사항) |

PowerShell 예시:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

CI 환경(예: GitHub Actions)에서는 빌드 단계 전에 `env`를 통해 주입합니다.

## 배포 전 체크리스트

배포 전에 다음을 확인하세요:

1. `xingluo.config.ts`의 `site.url`이 프로덕션 도메인으로 설정되어 있는지 확인
2. `site.title`, `site.description`, `site.author` 등이 사용자 정의되었는지 확인
3. 댓글 시스템이 활성화된 경우 제공자 설정(giscus repoId, twikoo envId, waline serverURL)에 실제 값이 있는지 확인
4. `public/default-og.jpg`(또는 설정된 `site.ogImage`)를 사이트 기본 OG 이미지로 교체
5. `public/favicon.svg`를 사이트 아이콘으로 교체

## 정적 호스팅 플랫폼

### Netlify / Vercel / Cloudflare Pages

| 설정          | 값           |
| ------------- | ------------ |
| 빌드 명령어   | `pnpm build` |
| 출력 디렉토리 | `dist`       |
| Node 버전     | 22.12.0+     |
| 패키지 관리자 | pnpm         |

Vercel용 선택적 `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

GitHub Actions를 통해 배포; 샘플 워크플로우:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          PUBLIC_GOOGLE_SITE_VERIFICATION: ${{ secrets.GOOGLE_VERIFICATION }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

> 하위 경로(예: `https://user.github.io/repo/`)에서 배포하는 경우 `astro.config.ts`에서 `base: "/repo/"`를 설정하세요.

### Nginx / 자체 호스팅

`dist/`를 서버에 업로드; 샘플 Nginx 설정:

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 성능 참고 사항

- `_astro/` 아래의 자산은 해시된 파일 이름을 가지며 장기 캐싱(`immutable`)이 가능합니다
- HTML 파일은 시기적절한 콘텐츠 업데이트를 보장하기 위해 캐싱하지 않거나(또는 짧게만) 캐싱해야 합니다
- Flexsearch 인덱스는 필요 시 로드되므로 특별한 캐싱 전략이 필요하지 않습니다
- 배포 후 OG 이미지, RSS, 사이트맵에 접근 가능한지 확인하세요

## 댓글 시스템 백엔드

댓글 시스템을 활성화하는 경우 해당 백엔드를 배포하세요:

| 댓글 시스템 | 백엔드 요구 사항                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| giscus      | 없음; giscus.app 공개 서비스 사용 (또는 [giscus-vercel](https://github.com/giscus/giscus-vercel) 자체 호스팅) |
| twikoo      | twikoo 서버 배포 (Vercel / CloudBase / 자체 호스팅)                                                           |
| waline      | waline 서버 배포 (Vercel / Cloudflare / 자체 호스팅)                                                          |

각 댓글 시스템의 공식 문서와 [댓글 시스템](./comments.md)을 참조하세요.
