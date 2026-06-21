# 検索

Xingluo は [Flexsearch](https://github.com/nextapps-de/flexsearch) を統合してクライアントサイド全文検索を提供し、言語別インデックスと View Transitions 状態保持をサポートします。

## 有効化

`features.search` で設定：

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

`false` に設定すると、検索ページは `Astro.rewrite` で404になり、検索 UI は生成されません。

## 動作方法

### インデックス生成

ビルドの3番目のステップ `node scripts/generateSearchIndex.mjs` が `dist/` ディレクトリの HTML ファイルをスキャン：

- ページコンテンツを解析し、記事本文を抽出
- インデックスは言語ごとに自動分割（`zh-cn` と `en` はそれぞれ独自のインデックス）
- インデックスは `dist/search/` に出力されます

### インデックス範囲

ビルドスクリプトが投稿詳細ページの `<main>` コンテンツを解析するため、投稿本文のみがインデックス化されます。その他のページ（ホーム、リスト、アーカイブなど）は検索インデックスに入りません。

## 検索 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) が検索ページを実装：

- Flexsearch クライアントサイドインデックスを使用してブラウザ内で検索マッチング
- `getAssetPath("search/")` でインデックスアセットを配置
- shadcn テーマ変数（`--background`、`--foreground`、`--primary` など）で検索ボックスと結果リストのスタイリング
- `transition:persist` がナビゲーション間で検索状態を保持

### 検索フロー

1. ユーザーが検索ボックスに入力
2. Flexsearch が現在の言語インデックスに対してマッチング
3. 結果リストにマッチした投稿を表示（タイトル、公開日時と更新日時、カテゴリバッジ、タグ、一致した本文抜粋）
4. `processTerm` がクエリパラメータ付きの検索ページ URL を sessionStorage に書き込み、戻るボタンが復元可能に

## ソースからの戻りナビゲーション

検索ページと投稿ページ間の戻りナビゲーション機構：

- `Main.astro` コンポーネントがソースページ URL を sessionStorage の `backUrl` に書き込み
- 投稿ページの `BackButton.astro` は sessionStorage の `backUrl` へのジャンプを優先。なければホームページへ
- 検索ページの `processTerm` がクエリパラメータ付き URL を書き込み、投稿から戻ったときに検索状態を復元

## 多言語検索

Flexsearch はページ言語でインデックスを分割：

- `zh-cn` ページ（ルート）→ 中国語インデックス
- `en` ページ（`/en/` プレフィックス）→ 英語インデックス

検索は現在のページ言語のインデックスに自動一致：中国語ページは中国語、英語ページは英語。

## テーマ適応

Flexsearch の検索 UI は shadcn テーマ変数を使用し、`SearchView.astro` で検索ボックスと結果リストのスタイルを定義：

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

ダークモードは `.dark` セレクターを介して自動的に切り替わり、サイトテーマと一致します。

## パフォーマンス

- Flexsearch インデックスは静的ファイル。検索はクライアントサイドで完了し、サーバーリクエストはありません
- インデックスはオンデマンドで読み込み（検索時のみインデックスフラグメントをダウンロード）
- `transition:persist` はナビゲーション時の検索 UI の再初期化を回避
