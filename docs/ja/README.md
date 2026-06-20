# Xingluo ドキュメント

Xingluo は [Astro](https://astro.build/) と [shadcn/ui](https://ui.shadcn.com/) のビジュアルスタイルを基盤とした、モダンなブログ CMS です。フラットでエレガントな shadcn コンポーネントと OKLCH カラーシステムによって、よりモダンな視覚体験を提供し、コメントシステム、オプションの MDX サポート、オーディオ/ビデオプレーヤーをネイティブ統合しています。

## ドキュメント一覧

| ドキュメント                             | 内容                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| [はじめに](./getting-started.md)         | 要件、インストール、ローカル開発、ビルドとプレビュー                            |
| [設定ガイド](./configuration.md)         | `xingluo.config.ts` の完全リファレンス                                          |
| [コンテンツ作成](./content.md)           | 投稿のフロントマター、Markdown/MDX 構文、コードブロック、コールアウト、拡張機能 |
| [国際化](./i18n.md)                      | 多言語ルーティング、UI 文字列、コンテンツレベルの翻訳、言語の追加               |
| [アーキテクチャ概要](./architecture.md)  | ディレクトリ構成、設定フロー、レンダリングフロー、ビルドパイプライン            |
| [テーマとスタイル](./theming.md)         | shadcn テーマ変数、OKLCH、Tailwind v4、ダークモード                             |
| [コメントシステム](./comments.md)        | giscus / twikoo / waline の選択と接続                                           |
| [メディアプレーヤー](./media-players.md) | Markdown および MDX での APlayer / DPlayer の使用                               |
| [SEO](./seo.md)                          | OG 画像、RSS、サイトマップ、hreflang、カノニカル、構造化データ                  |
| [検索](./search.md)                      | Pagefind 全文検索の統合                                                         |
| [デプロイ](./deployment.md)              | 静的ホスティング、GitHub Pages、環境変数、Docker                                |

## 主な機能

- **最高水準のパフォーマンス**：Astro 静的生成、ビルド時インライン SVG アイコン（ランタイム JS ゼロ）、遅延読み込みコメントとプレーヤー、孤立アセットクリーンアップ
- **モダンなビジュアル**：shadcn/ui new-york コンポーネント、OKLCH 色空間、スムーズなダークモード（FOUC 保護）
- **多言語対応**：UI およびコンテンツレベルの翻訳、`prefixDefaultLocale: false` ルーティング、hreflang および x-default SEO 宣言
- **コンテンツ拡張**：オプションの MDX、Shiki デュアルテーマコードハイライト、コールアウト、折りたたみ可能な目次、スクロール可能なテーブル
- **読了時間**：スマート推定（CJK は文字数、ラテン系は単語数で計算）、カードおよび詳細ページに表示
- **関連投稿**：共有タグによる自動推薦
- **投稿カテゴリ**：フロントマターで割り当て、専用カテゴリページとナビゲーションエントリ付き
- **固定目次サイドバー**：大画面で右側に固定目次、IntersectionObserver によるスクロール追跡
- **コメントシステム**：giscus / twikoo / waline、テーマ対応、遅延読み込み
- **メディアプレーヤー**：APlayer オーディオと DPlayer ビデオ、MD フェンスと MDX コンポーネントの両方のエントリポイント
- **検索**：Pagefind 全文検索、言語別インデックス、View Transitions 状態保持
- **完全なSEO**：動的 OG 画像（satori + sharp）、RSS、サイトマップ、JSON-LD 構造化データ（BlogPosting + BreadcrumbList）、カノニカル正規化

## 技術スタック

| カテゴリ             | 技術                                                                       |
| -------------------- | -------------------------------------------------------------------------- |
| フレームワーク       | Astro 6.x                                                                  |
| スタイリング         | Tailwind CSS v4、shadcn/ui スタイルコンポーネント、@tailwindcss/typography |
| アイコン             | astro-icon + Font Awesome                                                  |
| コンテンツ           | Astro Content Collections、MDX、remark/rehype プラグインチェーン           |
| コードハイライト     | Shiki                                                                      |
| 検索                 | Pagefind                                                                   |
| OG 画像              | satori + sharp                                                             |
| コメント             | giscus / twikoo / waline                                                   |
| プレーヤー           | APlayer / DPlayer                                                          |
| 日付                 | dayjs                                                                      |
| パッケージマネージャ | pnpm                                                                       |
| 言語                 | TypeScript                                                                 |

## ライセンス

AGPL-3.0
