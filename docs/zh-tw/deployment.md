# 部署

星羅為純靜態站點，`pnpm build` 生成 `dist/` 目錄，可託管於任意靜態託管服務。

## 構建產物

```bash
pnpm build
```

生成 `dist/` 包含：

- 全部靜態 HTML 頁面（含 `[locale]/` 鏡像）
- `_astro/` 下的 JS / CSS / 字型資源
- `pagefind/` 搜尋索引
- `og.png` 站點級 OG 圖、各文章級 `og.png`
- `rss.xml`、`sitemap-index.xml`、`robots.txt`
- `public/` 下的靜態資源（favicon、預設 OG 圖等）

## 環境變數

構建時可設定：

| 變數                              | 說明                                 |
| --------------------------------- | ------------------------------------ |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console 驗證值（可選） |

PowerShell 範例：

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

CI 環境（如 GitHub Actions）在 build 步驟前透過 `env` 注入即可。

## 部署前檢查

部署前確保：

1. `xingluo.config.ts` 的 `site.url` 已改為正式域名
2. `site.title`、`site.description`、`site.author` 等已定製
3. 若啟用評論系統，對應 provider 設定（giscus 的 repoId、twikoo 的 envId、waline 的 serverURL）已填入真實值
4. `public/default-og.jpg`（或設定的 `site.ogImage`）已替換為站點預設 OG 圖
5. `public/favicon.svg` 已替換為站點圖示

## 靜態託管平臺

### Netlify / Vercel / Cloudflare Pages

| 設定項     | 值           |
| ---------- | ------------ |
| 構建命令   | `pnpm build` |
| 輸出目錄   | `dist`       |
| Node 版本  | 22.12.0+     |
| 套件管理器 | pnpm         |

以 Vercel 為例的 `vercel.json`（可選）：

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

透過 GitHub Actions 部署，範例工作流程：

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

> 若部署在子路徑（如 `https://user.github.io/repo/`），需在 `astro.config.ts` 設定 `base: "/repo/"`。

### Nginx / 自託管

將 `dist/` 上傳到伺服器，Nginx 設定範例：

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # 靜態資源快取
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 效能注意事項

- `_astro/` 下的資源檔名含雜湊，可設定長期快取（`immutable`）
- HTML 檔案不快取或短快取，確保內容更新及時
- pagefind 索引按需載入，無需特殊快取策略
- 部署後檢查 OG 圖、RSS、sitemap 是否可存取

## 評論系統後端

若啟用評論系統，需額外部署對應後端：

| 評論系統 | 後端要求                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------- |
| giscus   | 無需自建，使用 giscus.app 公共服務（或自託管 [giscus-vercel](https://github.com/giscus/giscus-vercel)） |
| twikoo   | 部署 twikoo 服務端（Vercel / CloudBase / 自託管）                                                       |
| waline   | 部署 waline 服務端（Vercel / Cloudflare / 自託管）                                                      |

詳見各評論系統官方文件與 [評論系統](./comments.md)。
