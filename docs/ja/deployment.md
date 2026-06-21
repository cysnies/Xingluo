# デプロイ

Xingluo は純粋な静的サイトです。`pnpm build` が `dist/` ディレクトリを生成し、任意の静的ホスティングサービスでホスト可能です。

## ビルド出力

```bash
pnpm build
```

生成された `dist/` には以下が含まれます：

- すべての静的 HTML ページ（`[locale]/` ミラーを含む）
- `_astro/` 下の JS / CSS / フォントアセット
- `search/` 検索インデックス
- サイトレベルの `og.png` と投稿ごとの `og.png`
- `rss.xml`、`sitemap-index.xml`、`robots.txt`
- `public/` 下の静的アセット（favicon、デフォルト OG 画像など）

## 環境変数

ビルド時に設定：

| 変数                              | 説明                                       |
| --------------------------------- | ------------------------------------------ |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console 確認値（オプション） |

PowerShell の例：

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

CI 環境（例：GitHub Actions）では、build ステップの前に `env` を介して注入します。

## デプロイ前のチェックリスト

デプロイ前に以下を確認：

1. `xingluo.config.ts` の `site.url` がプロダクションドメインに設定されている
2. `site.title`、`site.description`、`site.author` などがカスタマイズされている
3. コメントシステムが有効な場合、プロバイダ設定（giscus の repoId、twikoo の envId、waline の serverURL）に実際の値が入力されている
4. `public/default-og.jpg`（または設定した `site.ogImage`）がサイトのデフォルト OG 画像に置き換えられている
5. `public/favicon.svg` がサイトアイコンに置き換えられている

## 静的ホスティングプラットフォーム

### Netlify / Vercel / Cloudflare Pages

| 設定                 | 値           |
| -------------------- | ------------ |
| ビルドコマンド       | `pnpm build` |
| 出力ディレクトリ     | `dist`       |
| Node バージョン      | 22.12.0+     |
| パッケージマネージャ | pnpm         |

Vercel 用のオプションの `vercel.json`：

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

GitHub Actions を介してデプロイ。サンプルワークフロー：

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

> サブパスでデプロイする場合（例：`https://user.github.io/repo/`）、`astro.config.ts` で `base: "/repo/"` を設定してください。

### Nginx / セルフホスト

`dist/` をサーバーにアップロード。サンプル Nginx 設定：

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # 静的アセットのキャッシュ
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## パフォーマンスに関する注意

- `_astro/` 下のアセットはハッシュ化されたファイル名を持ち、長期キャッシュ可能（`immutable`）
- HTML ファイルはキャッシュしない（または短時間のみ）ことで、コンテンツの更新を確実に
- Flexsearch インデックスはオンデマンドで読み込まれるため、特別なキャッシュ戦略は不要
- デプロイ後、OG 画像、RSS、サイトマップがアクセス可能であることを確認

## コメントシステムのバックエンド

コメントシステムを有効にする場合、対応するバックエンドをデプロイ：

| コメントシステム | バックエンド要件                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| giscus           | 不要。giscus.app 公開サービスを使用（または [giscus-vercel](https://github.com/giscus/giscus-vercel) をセルフホスト） |
| twikoo           | twikoo サーバーをデプロイ（Vercel / CloudBase / セルフホスト）                                                        |
| waline           | waline サーバーをデプロイ（Vercel / Cloudflare / セルフホスト）                                                       |

各コメントシステムの公式ドキュメントと[コメントシステム](./comments.md)を参照。
