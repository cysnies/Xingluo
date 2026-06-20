# 検索

Xingluo は [Pagefind](https://pagefind.app/) を統合して静的全文検索を提供し、言語別インデックスと View Transitions 状態保持をサポートします。

## 有効化

`features.search` で設定：

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

`false` に設定すると、検索ページは `Astro.rewrite` で404になり、検索 UI は生成されません。

## 動作方法

### インデックス生成

ビルドの3番目のステップ `pagefind --site dist` が `dist/` ディレクトリをスキャン：

- `data-pagefind-body` 属性を持つページのみがインデックス化されます
- インデックスは言語ごとに自動分割（`zh-cn` と `en` はそれぞれ独自のインデックス）
- インデックスは `dist/pagefind/` に出力されます

### インデックス範囲

投稿詳細ページの `<main>` は `data-pagefind-body` とマークされているため、投稿本文のみがインデックス化されます。その他のページ（ホーム、リスト、アーカイブなど）は検索インデックスに入りません。

## 検索 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) が検索ページを実装：

- 検索ボックスと結果リストのために `@pagefind/default-ui` を読み込み
- `getAssetPath("pagefind/")` でインデックスアセットを配置
- グローバルスタイルが Pagefind CSS 変数を上書きし、Xingluo のテーマにマッピング（`--background`、`--foreground`、`--primary` など）
- `transition:persist` がナビゲーション間で検索状態を保持

### 検索フロー

1. ユーザーが検索ボックスに入力
2. Pagefind が現在の言語インデックスに対してマッチング
3. 結果リストにマッチした投稿を表示（タイトル、概要ハイライト）
4. `processTerm` がクエリパラメータ付きの検索ページ URL を sessionStorage に書き込み、戻るボタンが復元可能に

## ソースからの戻りナビゲーション

検索ページと投稿ページ間の戻りナビゲーション機構：

- `Main.astro` コンポーネントがソースページ URL を sessionStorage の `backUrl` に書き込み
- 投稿ページの `BackButton.astro` は sessionStorage の `backUrl` へのジャンプを優先。なければホームページへ
- 検索ページの `processTerm` がクエリパラメータ付き URL を書き込み、投稿から戻ったときに検索状態を復元

## 多言語検索

Pagefind は `data-pagefind-body` 要素の言語属性でインデックスを分割：

- `zh-cn` ページ（ルート）→ 中国語インデックス
- `en` ページ（`/en/` プレフィックス）→ 英語インデックス

検索は現在のページ言語のインデックスに自動一致：中国語ページは中国語、英語ページは英語。

## テーマ適応

Pagefind のデフォルト UI には独自の CSS 変数があります。Xingluo は `SearchView.astro` のグローバルスタイルでそれらを上書きし、shadcn テーマ変数にマッピング：

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

ダークモードは `.dark` セレクターを介して自動的に切り替わり、サイトテーマと一致します。

## パフォーマンス

- Pagefind インデックスは静的ファイル。検索はクライアントサイドで完了し、サーバーリクエストはありません
- インデックスはオンデマンドで読み込み（検索時のみインデックスフラグメントをダウンロード）
- `transition:persist` はナビゲーション時の検索 UI の再初期化を回避
