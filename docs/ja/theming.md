# テーマとスタイル

Xingluo は shadcn/ui new-york スタイルコンポーネントと OKLCH 色空間を使用し、Tailwind CSS v4 上に構築されています。

## スタイルファイル構造

[`src/styles/`](../src/styles/):

| ファイル         | 内容                                                                          |
| ---------------- | ----------------------------------------------------------------------------- |
| `theme.css`      | shadcn テーマ変数（OKLCH、ライト `:root` + ダーク `.dark`）                   |
| `global.css`     | Tailwind エントリ、ベースレイヤー、カスタムユーティリティ、コールアウトテーマ |
| `typography.css` | `.app-prose` タイポグラフィとコードブロックスタイル                           |

## テーマ変数

`theme.css` は OKLCH 色空間を使用してセマンティック変数を定義し、ライトセットとダークセットの2セットがあります：

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  /* ... secondary、muted、accent、destructive、border、input、ring ... */
  --code: oklch(0.97 0 0);
  --content-width: 72rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... ダーク対応値 ... */
}
```

これらの変数は `global.css` の `@theme inline` で Tailwind トークンにマッピングされているため、`bg-background`、`text-foreground`、`border-border` などのクラスを直接使用できます。

## Tailwind CSS v4

Xingluo は Tailwind v4 を使用し、`@tailwindcss/vite` プラグインを介して統合されています（`astro.config.ts` の `vite.plugins` を参照）。

### 主要設定（`global.css`）

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... カラーマッピング ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### カスタムユーティリティ

- `max-w-app`：コンテンツ最大幅（`--content-width: 72rem`）
- `app-layout`：アプリレイアウト（min-height 100vh、flex カラム）

## ダークモード

### FOUC 保護

`Layout.astro` は `<head>` 内に同期的スクリプト（`is:inline`）をインライン化し、最初の描画前にテーマを設定します：

```js
// localStorage.theme を読み取り、なければ prefers-color-scheme にフォールバック
// html の data-theme 属性と .dark クラスを設定
```

これにより、リフレッシュ時のテーマフラッシュを回避します。

### テーマ切り替えランタイム

[`src/scripts/theme.ts`](../src/scripts/theme.ts)：

- `getPreferredTheme`：localStorage 優先、なければシステム設定にフォールバック
- `persist`：localStorage に永続化
- `reflect`：`data-theme` 属性、`.dark` クラス、`#theme-btn` の `aria-label`、`<meta name="theme-color">` を同期
- `#theme-btn` のクリックをテーマ切り替えにバインド
- View Transitions に適応：`astro:after-swap` で再バインド、`astro:before-swap` で theme-color を保持
- システムの `prefers-color-scheme` 変更をリッスン（ユーザーが明示的に選択していない場合のみ追従）

### コメントとプレーヤーのテーマ同期

- giscus：`postMessage({giscus:{setConfig:{theme}}})` で切り替え
- waline：`dark:"html.dark"` セレクターで自動追従
- twikoo：`.dark` クラスの変更を監視して再構築（twikoo はランタイム切り替え非対応）
- 詳細は[コメントシステム](./comments.md)を参照

## タイポグラフィ（.app-prose）

`typography.css` の `.app-prose` は `@tailwindcss/typography` の `prose` をベースに、テーマオーバーライドを適用：

- リンクのプライマリカラー（`--primary`）
- インラインコードの背景（`--code`）
- コードブロックのデュアルテーマ（Shiki `--shiki-light-bg` / `--shiki-dark-bg`）
- diff / highlight / word 行スタイル
- blockquote、hr、img スタイル
- details / summary 折りたたみスタイル
- 画像 `role="button"` ライトボックスカーソル
- 見出しアンカー `scroll-margin`

投稿本文コンテナは `<article class="app-prose">` を使用します。

## shadcn コンポーネント

[`src/components/ui/`](../src/components/ui/) が shadcn スタイルのコンポーネントを提供：

| コンポーネント                                                                         | 備考                                                               |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `Button`                                                                               | `<a>` / `<button>` を自動切り替え、cva バリアント（variant、size） |
| `Badge`                                                                                | バッジ                                                             |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Card ファミリー                                                    |
| `Input`                                                                                | 入力                                                               |
| `Separator`                                                                            | セパレーター                                                       |

バリアント設定は `class-variance-authority` を使用。クラス名は `cn`（`src/lib/utils.ts`、`tailwind-merge` + `clsx` ベース）でマージされます。

## アイコンシステム

Xingluo のアイコンは、astro-icon + Font Awesome を介してビルド時にインライン化される SVG です（スプライト `<symbol>` モード）。**ランタイム JS ゼロ、フォントネットワークリクエストなし**。

### アイコンマッピング（FA5）

| 用途             | アイコン名                                     |
| ---------------- | ---------------------------------------------- |
| 検索             | `fa-solid:search`                              |
| 閉じる           | `fa-solid:times`                               |
| メール           | `fa-solid:envelope`                            |
| その他ソーシャル | `fa-brands:{name}`                             |
| X（ソーシャル）  | `fa-brands:twitter`（FA5 には x-twitter なし） |

### ソーシャルアイコンの動的解決

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) は `import.meta.glob` を介してファイル名で `src/assets/icons/socials/*.astro` を収集し、`getSocialIcon(name)` で名前解決します。ソーシャルプラットフォームの追加は、`socials/` 下にアイコンファイルを追加するだけです。

## テーマのカスタマイズ

`src/styles/theme.css` の CSS 変数を編集して、サイト全体の色を調整します。例えば、青色プライマリに切り替える場合：

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

`bg-primary` / `text-primary` を参照するすべてのコンポーネントが自動的に追従します。
