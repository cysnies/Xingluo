---
title: "はじめに"
pubDatetime: 2026-06-20T03:00:00+08:00
description: "Xingluo をローカル開発および本番ビルド用にゼロから始めるためのガイド。要件、インストール、開発、デプロイをカバーします。"
tags:
  - documentation
  - getting-started
category: "Documentation"
translationKey: doc-getting-started
locale: ja
---

このガイドでは、Xingluo をローカル開発および本番ビルド用にゼロから始める方法を説明します。

## 要件

| 依存関係 | 最小バージョン | 備考                                                             |
| -------- | -------------- | ---------------------------------------------------------------- |
| Node.js  | 22.12.0        | package.json の engines.node を参照                              |
| pnpm     | 10.x           | パッケージマネージャ（プロジェクトは pnpm ワークスペースを使用） |

> ヒント：Node バージョンの管理には [fnm](https://github.com/Schniz/fnm) または [nvm](https://github.com/nvm-sh/nvm) を使用してください。

## インストール

リポジトリをクローンした後、依存関係をインストールします：

```bash
pnpm install
```

依存関係がインストールされると、`references/` 配下の参照プロジェクトは TypeScript のコンパイルとビルドから自動的に除外されます（`tsconfig.json` の `exclude` を参照）。

## ローカル開発

開発サーバーを起動します（デフォルトは `http://localhost:4321/`）：

```bash
pnpm dev
```

開発モードでは：

- 下書きと予約投稿は **すべて表示** されます（プレビュー用）。本番ビルド時にのみフィルタリングされます
- コンテンツコレクションの変更はホットリロードをトリガーします
- クライアント側の動作（テーマ切り替え、View Transitions など）は本番と一致します

## 型の同期

コンテンツコレクションのスキーマや型を変更した後は、`.astro/types.d.ts` を更新するために同期を実行します：

```bash
pnpm sync
```

## ビルド

本番ビルドは 3 つのステップで構成されます（`package.json` の `build` スクリプトを参照）：

```bash
pnpm build
```

1. **`astro check`**：TypeScript および Astro テンプレートの型チェック。エラーがあるとビルドは中断されます
2. **`astro build`**：サイト全体を `dist/` に静的に生成します（動的 OG 画像、RSS、サイトマップ、robots.txt、pagefind UI アセットを含む）
3. **`pagefind --site dist`**：`dist/` をスキャンして全文検索インデックスを `dist/pagefind/` に生成します

> 注：`pagefind` は devDependency としてインストールされたバイナリツールです。追加の設定は不要です。

## ビルドのプレビュー

`dist/` 内のビルド出力をローカルでプレビューします：

```bash
pnpm preview
```

## コード品質

| コマンド            | 目的                                                            |
| ------------------- | --------------------------------------------------------------- |
| `pnpm format`       | Prettier で全コードをフォーマット（Astro および Tailwind 含む） |
| `pnpm format:check` | フォーマット準拠をチェック（CI で使用）                         |
| `pnpm lint`         | ESLint チェック（`eslint-plugin-astro` を含む）                 |

## 次のステップ

- [設定ガイド](./doc-configuration.md) を読んでサイト情報と機能トグルをカスタマイズする
- [コンテンツ作成](./doc-content.md) を読んで執筆を始める
- [デプロイ](./doc-deployment.md) を読んでサイトを公開する
