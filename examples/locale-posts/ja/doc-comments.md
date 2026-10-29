---
title: "コメントシステム"
pubDatetime: 2026-06-20T09:00:00+08:00
description: "Xingluo コメントシステム設定ガイド。giscus、twikoo、waline の3つのコメントシステムの選択、設定、統合をカバーします。"
tags:
  - documentation
  - comments
category: "Documentation"
translationKey: doc-comments
locale: ja
---

Xingluo は3つのコメントシステム（giscus、twikoo、waline）を統合しており、`features.comments` を介して選択可能です。

## 設定

[`xingluo.config.ts`](../xingluo.config.ts) の `features.comments` でプロバイダを選択し、その設定を指定します：

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* giscus 設定 */ },
    // twikoo: { /* twikoo 設定 */ },
    // waline: { /* waline 設定 */ },
  },
}
```

`provider: false`（デフォルト）の場合、コメントはオフになり、投稿ページにコメントマーカーやスクリプトは出力されません。

## コメントセクションの位置

コメントセクションは**投稿詳細ページ**の下部（前/次ナビゲーションの後）にのみ表示され、[`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro) によってレンダリングされます。

## giscus

GitHub Discussions に基づくコメントシステム。リポジトリは public で Discussions が有効である必要があります。

### 設定

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // GitHub リポジトリ
    repoId: "R_...",              // リポジトリ ID（giscus.app で生成）
    category: "Announcements",    // Discussion カテゴリ名
    categoryId: "DIC_...",        // カテゴリ ID（giscus.app で生成）
    mapping: "pathname",          // オプション、ページから discussion へのマッピング
    strict: false,                // オプション、厳密なタイトルマッチング
    reactionsEnabled: true,       // オプション、リアクション
    inputPosition: "bottom",      // オプション、コメントボックスの位置：top | bottom
    loading: "lazy",              // オプション、読み込み：lazy | eager
  },
}
```

### repoId / categoryId の取得

1. [giscus.app](https://giscus.app) にアクセス
2. リポジトリとカテゴリを入力して設定を生成
3. `data-repo-id` と `data-category-id` をコピーして設定に貼り付け

### 動作方法

giscus は公式の `client.js` を介して iframe を注入し、`data-*` 属性が設定を保持します。言語は現在のロケールに自動マッピングされます（`zh-cn` → `zh-CN`、`en` → `en`）。テーマは `postMessage` を介して切り替え時に同期されます。

## twikoo

バックエンド依存のないコメントシステム。Tencent CloudBase またはセルフホスティングをサポート。

### 設定

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // クラウド環境 ID またはセルフホスト URL
    lang: "zh-CN",                            // オプション、言語
  },
}
```

### envId の注意

- Tencent CloudBase：環境 ID を入力（cloudbase SDK が必要）
- セルフホスト：完全な URL を入力（例：`https://twikoo.example.com`）。twikoo が自動的に HTTP API モードを検出

### 動作方法

twikoo はコメントコンテナがビューポートに入ったときに動的に `import("twikoo")` し、`init` を呼び出します。twikoo はランタイムでのテーマ切り替えをサポートしていないため、サイトはテーマ変更時に再構築してダークスタイルを適用します。

## waline

バックエンドを備えたコメントシステム。コメント数とビュー数をサポート。

### 設定

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Waline サーバーアドレス
    lang: "zh-CN",                           // オプション、言語
    pageSize: 10,                            // オプション、コメントページサイズ
    dark: "html.dark",                       // オプション、ダークセレクター（デフォルトはサイトの .dark）
  },
}
```

### serverURL のデプロイ

[Waline ドキュメント](https://waline.js.org/) を参照してサーバーをデプロイ（Vercel / Cloudflare / セルフホストすべて対応）、アドレスを `serverURL` に設定。

### 動作方法

waline はコメントコンテナがビューポートに入ったときに動的に `import("@waline/client")` とスタイル `@waline/client/style` をインポートし、`init` を呼び出します。`dark:"html.dark"` セレクターがサイトのダークモードに自動追従。手動同期は不要です。

## 遅延読み込み

すべてのコメントシステムは IntersectionObserver を介して遅延読み込みされます：コメントコンテナがビューポートの200px以内に入ったときにのみリクエストと初期化が行われ、初回描画のパフォーマンスコストを回避します。

実装は [`src/scripts/comments.ts`](../src/scripts/comments.ts) を参照。

## テーマ同期

サイトテーマが変更されると、コメントシステムのテーマが自動的に同期されます：

| コメントシステム | 同期方法                                                     |
| ---------------- | ------------------------------------------------------------ |
| giscus           | `postMessage({giscus:{setConfig:{theme}}})` を iframe に送信 |
| waline           | `dark:"html.dark"` CSS セレクターで自動追従                  |
| twikoo           | `.dark` クラスの変更を監視してインスタンスを再構築           |

テーマ監視は `document.documentElement` の `class` と `data-theme` 属性の `MutationObserver` を使用します。

## View Transitions 適応

コメントスクリプトは `astro:page-load` をリッスンし、各ページ読み込み後にマウントポイントを再スキャンします。再初期化は `dataset` マーカー（`xng-setup`、`xng-init`）によって防止されます。

## i18n

コメントセクションのタイトルは `UIStrings.comments.title` によってローカライズされます。コメントシステム UI の言語は、各プロバイダの `lang` フィールドで制御されます。

## カスタム拡張

### プロバイダの切り替え

`xingluo.config.ts` の `features.comments.provider` を変更するだけで、コードの変更は不要です。Xingluo が対応するサブコンポーネントを自動的にレンダリングします。

### コメントシステムの追加

1. `src/components/comments/` の下に新しいコンポーネント（例：`Disqus.astro`）を作成し、マウントプレースホルダーをレンダリング
2. `Comments.astro` の条件付きレンダリングに新しいプロバイダブランチを追加
3. `src/scripts/comments.ts` に初期化ロジックを追加
4. `src/types/config.ts` で `CommentProvider` と設定の型を拡張
