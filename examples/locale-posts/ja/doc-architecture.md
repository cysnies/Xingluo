---
title: "アーキテクチャ概要"
pubDatetime: 2026-06-20T07:00:00+08:00
description: "Xingluo アーキテクチャ概要 - ディレクトリ構成、設定フロー、レンダリングフロー、ビルドパイプライン、拡張ガイドをカバー。"
tags:
  - documentation
  - architecture
category: "Documentation"
translationKey: doc-architecture
locale: ja
---

このドキュメントでは、Xingluo の全体的なアーキテクチャ、ディレクトリ構成、設定フロー、レンダリングフロー、ビルドパイプラインについて説明し、コードの組織化と拡張方法を理解するのに役立ちます。

## ディレクトリ構造

```
xingluo/
├── astro.config.ts          # Astro 設定（インテグレーション、i18n、markdown、フォント、env）
├── xingluo.config.ts        # ユーザー設定エントリ
├── tsconfig.json            # TypeScript 設定（strict + @/* パスエイリアス）
├── package.json             # 依存関係とスクリプト
├── public/                  # 静的アセット（favicon.svg、デフォルト OG 画像など）
├── docs/                    # プロジェクトドキュメント（このディレクトリ）
├── references/              # 読み取り専用の参照プロジェクトソース（依存禁止）
└── src/
    ├── config.ts            # 設定デフォルトのマージ、解決済み設定をエクスポート
    ├── content.config.ts    # コンテンツコレクションスキーマ（posts、pages）
    ├── env.d.ts             # サードパーティモジュールと環境変数の型宣言
    ├── assets/              # アイコンコンポーネント
    │   └── icons/           # astro-icon + Font Awesome（socials/ を含む）
    ├── components/          # UI コンポーネント
    │   ├── ui/              # shadcn スタイルコンポーネント（Button、Card、Badge など）
    │   ├── post/            # 投稿ページコンポーネント（前/次ナビ、戻る、共有など）
    │   ├── comments/        # コメントシステムコンポーネント
    │   ├── mdx/             # MDX カスタムコンポーネント（APlayer、DPlayer）
    │   ├── pageViews/       # ページビュー（集中化されたページレンダリングロジック）
    │   └── *.astro          # ルートレベルコンポーネント（Header、Footer、PostCard など）
    ├── content/             # コンテンツファイル
    │   ├── posts/           # ブログ投稿
    │   └── pages/           # 静的ページ
    ├── i18n/                # 国際化
    │   ├── index.ts         # 言語読み込みと useTranslations
    │   ├── types.ts         # 完全な UIStrings 型
    │   ├── routing.ts       # ロケールパス解決
    │   ├── staticPaths.ts   # 非デフォルトロケールの getStaticPaths
    │   ├── format.ts        # テンプレート文字列置換
    │   └── lang/            # 言語リソースファイル（zh-cn.ts、en.ts）
    ├── layouts/             # レイアウト
    │   ├── Layout.astro     # ベーススケルトン（head、SEO、FOUC）
    │   └── PostLayout.astro # 投稿レイアウト（JSON-LD、article meta）
    ├── lib/                 # 基礎ユーティリティ
    │   ├── utils.ts         # cn（tailwind-merge + clsx）
    │   ├── dayjs.ts         # dayjs インスタンスとタイムゾーンプラグイン
    │   └── socialIcons.ts   # ソーシャルアイコンの動的解決
    ├── pages/               # ルート（ルート + [locale]/ ミラー）
    ├── scripts/             # クライアントサイドスクリプト
    │   ├── theme.ts         # テーマ切り替え
    │   ├── postEnhancements.ts # 投稿拡張（アンカー、コピー、ライトボックス、進捗）
    │   ├── comments.ts      # コメントの遅延読み込みとテーマ同期
    │   └── players.ts       # プレーヤーの遅延読み込み
    ├── styles/              # スタイル
    │   ├── global.css       # Tailwind エントリ + ベースレイヤー + カスタムユーティリティ
    │   ├── theme.css        # shadcn テーマ変数（OKLCH）
    │   └── typography.css   # .app-prose タイポグラフィとコードブロックスタイル
    ├── types/               # 型宣言
    │   ├── config.ts        # 設定の型
    │   └── *.d.ts           # 型なしサードパーティモジュールの宣言
    └── utils/               # ユーティリティ関数
        ├── getPostPaths.ts  # 投稿スラッグと URL の導出
        ├── getSortedPosts.ts# 投稿のソート
        ├── postFilter.ts    # 下書きと予約投稿のフィルタリング
        ├── getUniqueTags.ts # タグの重複排除
        ├── remarkPlayers.ts # プレーヤー remark プラグイン
        ├── rehypeWrapTable.ts# テーブルスクロールラッパー
        └── ...              # その他のユーティリティ
```

## 設定フロー

```
xingluo.config.ts
   │ defineXingluoConfig（型制約、パススルー）
   ▼
src/config.ts
   │ resolveConfig（デフォルトマージ + resolveComments + resolvePlayers）
   ▼
src/types/config.ts
   │ XingluoConfig（完全な型）
   ▼
サイト全体で import config from "@/config" により参照
```

重要なポイント：

- `xingluo.config.ts` はユーザーが編集する必要がある唯一の設定ファイル
- `src/config.ts` の `resolveConfig` は浅いマージ（`site`/`posts`）と深いマージ（`features.editPost`、`features.comments`、`features.players`）を行う
- `astro.config.ts` は未解決の `./xingluo.config` を読み取る（統合の読み込みが Astro 設定レイヤーで決定されるため）。そのため、`features` へのアクセスにはオプショナルチェーンを使用
- `src/content.config.ts` は解決済みの `@/config` を読み取るため、`features` は必須

## レンダリングフロー

### ページレンダリング

Xingluo は「薄いページラッパー + ビューコンポーネント」パターンを使用し、レンダリングロジックを `src/components/pageViews/` に集中させています：

```
src/pages/posts/[...slug]/index.astro   ← 薄いラッパー：getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← レンダリングロジック
    │
    ▼
src/layouts/PostLayout.astro  ← 投稿レイアウト（JSON-LD、article meta）
    │
    ▼
src/layouts/Layout.astro      ← ベーススケルトン（head、SEO、FOUC、ClientRouter）
```

薄いラッパーページは `getStaticPaths` と props の受け渡しのみを処理し、ビューコンポーネントがすべてのレンダリングロジックを保持します。`[locale]/` ミラーページも同様に薄いラッパーであり、`getLocaleParams()` を介して非デフォルトロケールのみを生成します。

### ルーティング

```
src/pages/
├── 404.astro                      # 404（ミラーなし）
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # サイトレベル OG 画像エンドポイント
├── rss.xml.ts                     # RSS エンドポイント
├── robots.txt.ts                  # robots.txt エンドポイント
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # 投稿レベル OG 画像エンドポイント
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # 非デフォルトロケールミラー（getStaticPaths=getLocaleParams）
    └── （構造はルートをミラーリング、404、og.png、rss、robots を除く）
```

### 投稿 URL の導出

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts)：

- `getPostSlug(id, filePath)`：コンテンツコレクションの `id` とファイルパスからルーティングスラッグを導出し、`_` プレフィックスのディレクトリをフィルタリング
- `getPostUrl(id, filePath, locale)`：ロケールプレフィックス付きのナビゲーション可能な URL を生成（デフォルトロケールはプレフィックスなし）

### 投稿のフィルタリングとソート

- [`postFilter.ts`](../src/utils/postFilter.ts)：下書きを除外。本番では `pubDatetime - scheduledPostMargin` を使用して未来の投稿をフィルタリング。開発ではすべて表示
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts)：フィルタリング後、`modDatetime ?? pubDatetime` で降順ソート
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts)：スラッグでタグを重複排除・ソート

## クライアントサイドスクリプト

Xingluo のクライアントサイドインタラクションは、ページ下部の `<script>` タグを介して読み込まれ、すべて View Transitions に対応しています：

| スクリプト            | 読み込み位置                                           | イベント適応                                                                                            | 責務                                                       |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `theme.ts`            | `Layout.astro` body 末尾                               | `astro:after-swap` で再バインド、`astro:before-swap` で theme-color を保持、`prefers-color-scheme` 変更 | テーマの永続化と切り替え                                   |
| `postEnhancements.ts` | `PostDetailView.astro`                                 | `astro:page-load` で再初期化                                                                            | 見出しアンカー、コードコピー、読書進捗、画像ライトボックス |
| `comments.ts`         | `Comments.astro`                                       | `astro:page-load` で再スキャン                                                                          | コメントの遅延読み込みとテーマ同期                         |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro`（条件付き） | `astro:page-load` で再スキャン                                                                          | プレーヤーの遅延読み込み                                   |

> 注：`comments.ts` と `players.ts` にはトップレベルの import/export がありません。ファイル末尾に `export {}` を追加してモジュールとしてマークし、他のファイルとのグローバル宣言の競合を避けてください。

## ビルドパイプライン

`pnpm run build` = `astro check && astro build && node scripts/generateSearchIndex.mjs`

1. **`astro check`**：TypeScript + Astro テンプレートの型チェック
2. **`astro build`**：
   - コンテンツコレクションを収集（`features.mdx` に基づいて `.mdx` を含める）
   - 全ページを静的に生成（`[locale]/` ミラーを含む）
   - エンドポイントを生成：RSS、sitemap、robots.txt、サイトレベルおよび投稿レベルの OG 画像
   - `mdx()` 統合を条件付きで読み込み、`remarkPlayers` を条件付きで注入
   - ビルド時に SVG アイコンをインライン化（astro-icon、ランタイム JS ゼロ）
   - 動的にインポートされるコメントとプレーヤーモジュールは、スタンドアロンチャンクに分割（遅延読み込み）
3. **`node scripts/generateSearchIndex.mjs`**：`dist/` の HTML ファイルをスキャンし、ページコンテンツを解析して言語別の検索インデックスを `dist/search/` に生成

## パフォーマンス戦略

- **ランタイム JS ゼロのアイコン**：astro-icon がビルド時に Font Awesome SVG をインライン化（スプライト `<symbol>` モード）
- **SVG 最適化**：`experimental.svgOptimizer`（svgo）がインライン化および参照された SVG を圧縮
- **オンデマンド遅延読み込み**：コメントとプレーヤーは、スクロールして表示領域に入ったときに IntersectionObserver を介して動的インポート。無効時はバンドルゼロ
- **条件付き統合**：MDX オフ時は `mdx()` 統合が読み込まれず、プレーヤーオフ時は remark プラグインが注入されない
- **CSS サイズ**：Tailwind v4 がオンデマンド生成、OKLCH 変数は集中管理
- **OG 画像フォント**：satori のみが使用、サイト CSS には注入されない
- **View Transitions**：`<ClientRouter/>` がページ遷移アニメーションを動作させ、検索ボックスは `transition:persist` を使用して状態を保持

## 拡張ガイド

### ページの追加

1. `src/pages/` に `.astro` ファイルを作成（薄いラッパー）
2. `src/components/pageViews/` に対応する View コンポーネントを作成
3. 多言語サポートのために、`src/pages/[locale]/` に同名のミラー薄いラッパーを作成

### UI コンポーネントの追加

shadcn スタイルに従い、`src/components/ui/` の下に `.astro` コンポーネントと `.ts` バリアント設定を作成します（`class-variance-authority` を使用）。

### クライアントサイドスクリプトの追加

`src/scripts/` に `.ts` ファイルを作成し、末尾に `export {}` を追加してモジュールとしてマークし、`astro:page-load` をリッスンして View Transitions に適応し、該当ページの `<script>` タグでインポートします。

### remark/rehype プラグインの追加

`src/utils/` にプラグインファイルを作成し、`astro.config.ts` の `markdown.remarkPlugins` または `rehypePlugins` で必要に応じて注入します。
