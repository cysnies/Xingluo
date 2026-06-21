---
title: "コンテンツ作成"
pubDatetime: 2026-06-20T05:00:00+08:00
description: "Xingluo コンテンツ作成ガイド。記事の frontmatter、Markdown/MDX 構文、コードハイライト、コールアウト、コンテンツ拡張をカバーします。"
tags:
  - documentation
  - writing
category: "Documentation"
translationKey: doc-content
locale: ja
---

Xingluo は Astro Content Collections を使用してコンテンツを管理し、Markdown（`.md`）と MDX（`.mdx`、`features.mdx` が必要）をサポートしています。

## コンテンツコレクション

[`src/content.config.ts`](../src/content.config.ts) で 2 つのコレクションが定義されています：

| コレクション | ディレクトリ         | 目的                         |
| ------------ | -------------------- | ---------------------------- |
| `posts`      | `src/content/posts/` | ブログ投稿                   |
| `pages`      | `src/content/pages/` | 静的ページ（例：概要ページ） |

ファイル命名規則：

- `_` で始まるファイルまたはディレクトリは無視されます（下書きに便利）
- MDX が有効な場合、`**/*.{md,mdx}` が収集されます。それ以外は `**/*.md` のみ
- 投稿 URL はファイルパスから導出されます（[アーキテクチャ概要](./doc-architecture.md) のルーティングセクションを参照）

## 投稿のフロントマター

`posts` コレクションの全フィールド：

```markdown
---
title: "投稿タイトル" # 必須
pubDatetime: 2026-06-19T10:00:00+08:00 # 必須、公開時間
modDatetime: 2026-06-20T10:00:00+08:00 # オプション、更新時間
description: "概要、SEO とリストに使用" # 必須
tags: ["Astro", "ブログ"] # オプション、デフォルト ["others"]
featured: true # オプション、注目（ホームページに表示）
draft: false # オプション、下書きは公開されない
author: "Xingluo" # オプション、デフォルト site.author
ogImage: "./cover.png" # オプション、OG 画像（画像インポートまたは文字列パス）
canonicalURL: "https://..." # オプション、正規リンク
hideEditPost: false # オプション、編集リンクを隠す
timezone: "Asia/Shanghai" # オプション、サイトのタイムゾーンを上書き
---
```

### フィールドリファレンス

| フィールド       | 型              | デフォルト      | 備考                                                                                          |
| ---------------- | --------------- | --------------- | --------------------------------------------------------------------------------------------- |
| `title`          | string          | 必須            | 投稿タイトル                                                                                  |
| `pubDatetime`    | date            | 必須            | 公開時間、ISO 8601                                                                            |
| `modDatetime`    | date            | —               | 更新時間；「更新日」ラベルを表示                                                              |
| `description`    | string          | 必須            | 概要、meta・RSS・リストカードに使用                                                           |
| `tags`           | string[]        | `["others"]`    | タグ配列；タグページが自動生成                                                                |
| `featured`       | boolean         | —               | ホームページの「注目」セクションに表示                                                        |
| `draft`          | boolean         | —               | 下書き；本番ビルドで除外（開発では表示）                                                      |
| `author`         | string          | `site.author`   | 著者名                                                                                        |
| `ogImage`        | image \| string | —               | OG 画像；`image()` は Astro のアセットパイプライン経由、文字列は `public/` パスまたは外部 URL |
| `canonicalURL`   | string          | —               | 正規リンク、デフォルトを上書き（[SEO](./doc-seo.md) 参照）                                    |
| `hideEditPost`   | boolean         | —               | この投稿の編集リンクを非表示                                                                  |
| `timezone`       | string          | `site.timezone` | この投稿の表示タイムゾーンを上書き                                                            |
| `locale`         | string          | `site.lang`     | 投稿の作成言語（例： `"en"`、`"ja"`）。未設定時はサイト言語                                   |
| `translationKey` | string          | —               | 翻訳グループキー：同じキーの投稿は互いの翻訳。キーなしの投稿は独立                            |
| `category`       | string          | —               | 投稿カテゴリ（単一値）、`/categories/<slug>/` ページを生成。未設定はカテゴリなし              |

### コンテンツレベルの翻訳

`locale` と `translationKey` のフロントマターフィールドを使用して、投稿の多言語バージョンを作成します：

1. デフォルト言語の投稿を `src/content/posts/<slug>.md` に配置
2. 翻訳を言語サブディレクトリに配置：`src/content/posts/<locale>/<slug>.md`（例：`en/welcome.md`）
3. 翻訳の `locale` と言語を設定し、`translationKey` をオリジナルと同じ値に設定

ルーティング層が言語ごとに適切な翻訳を自動解決し、リストで重複排除します。翻訳がない投稿は元のコンテンツにフォールバックします。[国際化](./doc-i18n.md) を参照。

### 予約公開

未来のタイムスタンプを持つ投稿は、`scheduledPostMargin` 許容範囲を使用して本番でフィルタリングされます：`pubDatetime` が現在時刻から許容範囲内（デフォルト15分）の場合、公開済みとして扱われます。開発環境では、すべての非下書き投稿が表示されます。

## 静的ページの Frontmatter

`pages` コレクションはよりシンプルなフィールドを持ちます：

```markdown
---
title: "About"
description: "About this site" # optional
ogImage: "default-og.jpg" # optional, string only
canonicalURL: "https://..." # optional
---
```

概要ページは `getEntry("pages", "about")` で取得され、`src/content/pages/about.md` を作成する必要があります。

## Markdown 拡張

Xingluo には以下の remark / rehype プラグインがプリインストールされています（`astro.config.ts` を参照）：

### 目次

`remark-toc` が目次を自動生成し、`remark-collapse` がデフォルトで折りたたみます。投稿内にプレースホルダーを挿入します：

```markdown
## 目次

(The TOC is auto-filled here)
```

### コールアウト

`rehype-callouts` は Obsidian スタイルのコールアウトをサポートします：

```markdown
> [!NOTE]
> ノート内容

> [!WARNING]
> 警告内容

> [!TIP]
> ヒント内容
```

対応タイプ：`NOTE`、`TIP`、`INFO`、`WARNING`、`DANGER`、`SUCCESS`、`QUESTION`、`FAILURE` など。

### コードハイライト

Shiki デュアルテーマ（ライト `min-light`、ダーク `night-owl`）がサポート：

- 行ハイライト：` ```js {1,3-5} `
- 単語ハイライト：` ```js /word/ `
- Diff マーカー：行頭の `+` / `-`
- ファイル名ラベル：` ```js file=src/index.ts ` または `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // ハイライト行
}
```

### テーブル

幅の広いテーブルは、`rehypeWrapTable` プラグインによって自動的に水平スクロール可能なコンテナにラップされ、狭い画面でのオーバーフローを防ぎます。

## MDX サポート

`features.mdx` を有効にすると（デフォルト）、`.mdx` ファイルを使用してコンポーネント駆動の作成ができます。

### カスタムコンポーネント

Xingluo の組み込み MDX コンポーネントは [`src/components/mdx/`](../src/components/mdx) にあり、統一されたエントリからインポートされます：

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# マイポスト

<APlayer
  audio={[
    {
      name: "曲名",
      artist: "アーティスト",
      url: "/audio.mp3",
      cover: "/cover.jpg",
    },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

詳細は[メディアプレーヤー](./doc-media-players.md)を参照。

### MDX を無効にする

`features.mdx: false` の場合：

- `mdx()` インテグレーションはロードされません
- コンテンツコレクションの glob は `*.md` のみに一致します（既存の `.mdx` ファイルは収集されません）
- ビルド出力に MDX ランタイムは含まれません

## コメント

コメントシステムは投稿詳細ページの下部に自動的にレンダリングされます（`features.comments` でプロバイダを設定）。[コメントシステム](./doc-comments.md) を参照。

## 読了時間

推定読了時間は、投稿詳細ページとリストカードに自動表示されます：

- **CJK 言語**（zh-cn、ja、ko）：CJK 文字数で計算、約400文字/分
- **その他の言語**：単語数（空白区切り）で計算、約200語/分
- 結果は切り上げ、最小1分

カウント前にコードブロック、HTML タグ、Markdown リンク URL、その他の本文以外のコンテンツは除去され、実際の読書量に近い推定値が得られます。設定は不要です。

## 関連投稿

最大2件の関連投稿が、投稿詳細ページの下部（前/次ナビゲーションの後）に表示されます：

- 共有タグの数で降順ソート
- 同点の場合は公開日で降順ソート（新しい投稿を優先）
- 共有タグがない投稿はセクションを非表示
- Flexsearch 検索インデックスから自動的に無視されます

設定は不要です。

## 固定目次サイドバー

大画面（≥1024px）の投稿詳細ページの右側に、固定目次サイドバーが表示されます：

- 記事内の h2～h6 見出しから自動生成、フラットなインデントリストとして表示
- インデントは見出しの深さを反映（h3 は h2 より1段階深い）
- スクロールに応じて現在のセクションがハイライト（IntersectionObserver）
- 目次エントリをクリックすると、対応する見出しにスムーズスクロール
- 小画面（モバイル）では非表示。インラインの折りたたみ目次が利用可能

Astro の `render()` が返す `headings` から生成され、作者が手動で目次を保守する必要はありません。インラインの `remark-toc` 折りたたみ目次（投稿内に `## Table of contents` と記述）は、小画面用にサイドバーと共存します。

## カテゴリー

`category` フロントマターフィールド（単一文字列）を介して、投稿にカテゴリを割り当てます：

```yaml
---
title: "マイポスト"
category: "tutorial"
---
```

- カテゴリページは `/categories/<slug>/` にあります。スラッグは `slugifyStr` で正規化（CJK はそのまま、ラテン語は小文字ハイフン）
- カテゴリインデックス `/categories/` に全カテゴリがリストされます
- 投稿カードと詳細ページは自動的にカテゴリリンクを表示（クリックでカテゴリページへ）
- 投稿は最大1つのカテゴリに属します（複数の `tags` とは異なります）。`category` がない投稿はどのカテゴリにも表示されません
- カテゴリページは `posts.perPage` をページネーションに再利用し、多言語ミラールートをサポート（`/en/categories/...`）
- `features.showCategories: false` でカテゴリを無効化（ナビゲーションエントリとページが削除され、サイトマップもフィルタリング）
