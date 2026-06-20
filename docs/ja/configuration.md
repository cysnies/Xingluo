# 設定ガイド

Xingluo の設定可能なオプションはすべて、ルートレベルの [`xingluo.config.ts`](../xingluo.config.ts) にあります。このファイルは `defineXingluoConfig` による完全な型制約を提供し、変更はソースコードに触れることなく即座に反映されます。

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // サイトURL（絶対リンク、RSS、サイトマップに使用）
  title: "Xingluo",                      // サイトタイトル
  description: "Astro と shadcn で構築されたモダンなブログ CMS",
  author: "Xingluo",                     // デフォルトの著者名
  profile: "https://xingluo.example.com", // 著者のホームページ（JSON-LD に使用）
  ogImage: "default-og.jpg",              // デフォルトOG画像（public ディレクトリ内）
  lang: "zh-cn",                          // デフォルト言語
  timezone: "Asia/Shanghai",              // タイムゾーン（投稿日時の表示）
  dir: "ltr",                             // テキスト方向: ltr | rtl
  googleVerification: "",                 // Google Search Console 確認値（または環境変数経由）
}
```

| フィールド           | デフォルト       | 備考                                                                                     |
| -------------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| `url`                | 必須             | サイトルート URL。末尾は `/` で終わる必要があります                                      |
| `title`              | 必須             | サイトタイトル。`<title>` および OG で使用されます                                       |
| `description`        | 必須             | サイトの説明。meta および RSS で使用されます                                             |
| `author`             | 必須             | デフォルトの著者。投稿のフロントマターがこれにフォールバックします                       |
| `profile`            | —                | 著者のホームページ。JSON-LD の `author.url` に注入されます                               |
| `ogImage`            | `default-og.jpg` | デフォルト OG 画像ファイル名。`public/` 内に配置します                                   |
| `lang`               | 必須             | デフォルト言語コード。`astro.config.ts` の `i18n.defaultLocale` と一致する必要があります |
| `timezone`           | `Asia/Shanghai`  | dayjs のタイムゾーン。投稿日時の表示に影響します                                         |
| `dir`                | `ltr`            | テキスト方向                                                                             |
| `googleVerification` | —                | Google 確認値。`PUBLIC_GOOGLE_SITE_VERIFICATION` 環境変数からも注入可能です              |

## posts

```ts
posts: {
  perPage: 8,              // リストページごとの投稿数
  perIndex: 5,             // ホームページに表示する投稿数
  scheduledPostMargin: 900000, // 予約公開の許容範囲（ミリ秒）、15分
}
```

- `perPage`: `/posts/[...page]` および `/tags/[tag]/[...page]` のページサイズ
- `perIndex`: ホームページの「最新」セクションに表示する投稿数
- `scheduledPostMargin`: この時間枠内の未来の投稿は公開済みとして扱われます（本番で有効。開発ではすべて表示）

## features

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "pagefind",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| フィールド         | デフォルト         | 備考                                                                                     |
| ------------------ | ------------------ | ---------------------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | ライト/ダークモード切り替えを有効化                                                      |
| `dynamicOgImage`   | `true`             | OG 画像を動的生成（satori + sharp）                                                      |
| `showArchives`     | `true`             | アーカイブページを表示（オフの場合はサイトマップもフィルタリング）                       |
| `showCategories`   | `true`             | カテゴリページとナビゲーションエントリを表示（オフの場合はサイトマップもフィルタリング） |
| `showBackButton`   | `true`             | 投稿ページに戻るボタンを表示                                                             |
| `editPost.enabled` | `false`            | 「このページを編集」リンクを表示                                                         |
| `editPost.url`     | `""`               | 編集リンクのプレフィックス。投稿の相対ソースパスが末尾に追加されます                     |
| `search`           | `"pagefind"`       | 検索ソリューション: `"pagefind"` または `false`                                          |
| `mdx`              | `true`             | MDX の解析とレンダリングを有効化（[コンテンツ作成](./content.md) を参照）                |
| `comments`         | `{provider:false}` | コメントシステムの設定（[コメントシステム](./comments.md) を参照）                       |
| `players.aplayer`  | `false`            | APlayer オーディオプレーヤーを有効化（[メディアプレーヤー](./media-players.md) を参照）  |
| `players.dplayer`  | `false`            | DPlayer ビデオプレーヤーを有効化                                                         |

### editPost

`editPost.url` はリポジトリの編集 URL プレフィックスです。Xingluo は投稿の相対ソースパス（`src/content/posts/...`）を末尾に追加します。例：

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

投稿 `src/content/posts/welcome.md` はリンク `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md` を生成します。

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: アイコン名。`src/assets/icons/socials/{name}.astro` に対応します。組み込み: `github`、`x`、`mail`、`facebook`、`telegram`、`weibo`
- `url`: リンク URL。メールには `mailto:` を使用
- `linkTitle`: オプションのアクセシブルなタイトル。省略時は名前から自動生成

> ソーシャルプラットフォームの追加: `src/assets/icons/socials/` に同名の `.astro` アイコンコンポーネントを作成します。`src/lib/socialIcons.ts` が `import.meta.glob` で自動的に収集します。

## shareLinks

```ts
shareLinks: [
  { name: "x", url: "https://x.com/intent/post?url=" },
  { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
  { name: "telegram", url: "https://t.me/share/url?url=" },
  { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
  { name: "mail", url: "mailto:?subject=...&body=" },
];
```

これらの共有エントリは投稿ページの下部に表示されます。`url` は共有 URL プレフィックスで、Xingluo は現在の投稿の絶対 URL を末尾に追加します。`name` は同様に `src/assets/icons/socials/` 内のアイコンにマッピングされます。

## 環境変数

`astro.config.ts` の `env.schema` で宣言されます：

| 変数                              | アクセスレベル  | 説明                                       |
| --------------------------------- | --------------- | ------------------------------------------ |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Google Search Console 確認値（オプション） |

例（PowerShell）:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

この値は `config.site.googleVerification` に注入され、`<meta name="google-site-verification">` としてレンダリングされます。

## 完全な例

[`xingluo.config.ts`](../xingluo.config.ts) を参照してください。`features.comments` および `features.players` セクションには、giscus / twikoo / waline のコメントアウトされた例が含まれています。コメントを解除して実際の値を入力することで有効化できます。
