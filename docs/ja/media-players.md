# メディアプレーヤー

Xingluo は APlayer（オーディオ）と DPlayer（ビデオ）を統合し、Markdown と MDX でプレーヤーを作成する2つの方法をサポート、すべて遅延読み込みされます。

## 有効化

[`xingluo.config.ts`](../xingluo.config.ts) の `features.players` で必要に応じて各プレーヤーを切り替えます：

```ts
features: {
  players: {
    aplayer: true,  // APlayer オーディオプレーヤーを有効化
    dplayer: true,  // DPlayer ビデオプレーヤーを有効化
  },
}
```

両者は独立しています。無効化すると：

- `remarkPlayers` プラグインが注入されない（MD フェンスが解析されない）
- プレーヤークライアントスクリプトが読み込まれない
- ビルド出力に aplayer / dplayer チャンクが含まれない

## 2つの使用モード

| モード             | 適用対象               | 構文                                                  |
| ------------------ | ---------------------- | ----------------------------------------------------- |
| MD フェンス        | 通常の `.md` と `.mdx` | ` ```aplayer ` / ` ```dplayer ` + JSON 設定本文       |
| MDX コンポーネント | `.mdx` のみ            | `import { APlayer, DPlayer } from "@/components/mdx"` |

どちらのモードも最終的に同じプレースホルダー div 構造（`<div class="xng-aplayer|xng-dplayer" data-config>`）を出力し、[`src/scripts/players.ts`](../src/scripts/players.ts) によって遅延読み込みおよびインスタンス化されます。

## APlayer オーディオプレーヤー

### MD フェンス

````markdown
```aplayer
{
  "audio": [
    {
      "name": "曲名",
      "artist": "アーティスト",
      "url": "/audio/song.mp3",
      "cover": "/images/cover.jpg",
      "lrc": "[00:00.00] 歌詞の最初の行"
    }
  ],
  "theme": "#b7daff",
  "loop": "all",
  "autoplay": false
}
```
````

### MDX コンポーネント

```mdx
import { APlayer } from "@/components/mdx";

<APlayer
  audio={[
    {
      name: "曲名",
      artist: "アーティスト",
      url: "/audio/song.mp3",
      cover: "/images/cover.jpg",
    },
  ]}
  theme="#b7daff"
  loop="all"
/>
```

### オプション

| フィールド      | 型                             | デフォルト | 備考                                  |
| --------------- | ------------------------------ | ---------- | ------------------------------------- |
| `audio`         | Audio \| Audio[]               | 必須       | オーディオオブジェクトまたはリスト    |
| `theme`         | string                         | `#b7daff`  | プレーヤーのテーマカラー              |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`      | ループモード                          |
| `order`         | `"list"` \| `"random"`         | `list`     | 再生順序                              |
| `volume`        | number                         | `0.7`      | 初期音量（0～1）                      |
| `autoplay`      | boolean                        | `false`    | 自動再生（ブラウザポリシーに依存）    |
| `listFolded`    | boolean                        | `false`    | リスト折りたたみ                      |
| `listMaxHeight` | string                         | —          | リスト最大高さ（CSS 値）              |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`        | 歌詞タイプ：0 なし / 1 文字列 / 2 URL |

### audio オブジェクト

| フィールド | 備考                                                                           |
| ---------- | ------------------------------------------------------------------------------ |
| `name`     | トラック名（`title` にフォールバック、さらに `'Audio name'` にフォールバック） |
| `artist`   | アーティスト（`author` にフォールバック）                                      |
| `url`      | オーディオ URL（必須）                                                         |
| `cover`    | カバー（`pic` にフォールバック）                                               |
| `lrc`      | 歌詞（文字列または URL、`lrcType` と組み合わせ）                               |
| `theme`    | トラックごとのテーマカラー                                                     |
| `type`     | オーディオタイプ：`auto` \| `hls` \| `normal`                                  |

## DPlayer ビデオプレーヤー

### MD フェンス

````markdown
```dplayer
{
  "video": {
    "url": "/videos/demo.mp4",
    "pic": "/images/video-cover.jpg",
    "type": "auto"
  },
  "theme": "#b7daff",
  "autoplay": false,
  "loop": false
}
```
````

### MDX コンポーネント

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### オプション

| フィールド      | 型                                   | デフォルト | 備考                                       |
| --------------- | ------------------------------------ | ---------- | ------------------------------------------ |
| `video`         | Video                                | 必須       | ビデオ設定                                 |
| `theme`         | string                               | `#b7daff`  | テーマカラー                               |
| `autoplay`      | boolean                              | `false`    | 自動再生                                   |
| `loop`          | boolean                              | `false`    | ループ再生                                 |
| `screenshot`    | boolean                              | `false`    | スクリーンショット機能                     |
| `hotkey`        | boolean                              | `true`     | ホットキー                                 |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`     | プリロード                                 |
| `volume`        | number                               | `0.7`      | 初期音量                                   |
| `playbackSpeed` | number[]                             | —          | 再生速度リスト                             |
| `subtitle`      | Subtitle                             | —          | 字幕                                       |
| `danmaku`       | Danmaku                              | —          | 弾幕（コメント）                           |
| `live`          | boolean                              | `false`    | ライブモード                               |
| `mutex`         | boolean                              | `true`     | ミューテックス（1ページに1プレーヤーのみ） |

### video オブジェクト

| フィールド   | 備考                                                         |
| ------------ | ------------------------------------------------------------ |
| `url`        | ビデオ URL（必須）                                           |
| `pic`        | カバー                                                       |
| `thumbnails` | サムネイル URL                                               |
| `type`       | ビデオタイプ：`auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | 品質リスト + `defaultQuality` インデックス                   |

### subtitle オブジェクト

| フィールド | 備考              |
| ---------- | ----------------- |
| `url`      | 字幕 URL（必須）  |
| `type`     | `webvtt` \| `ass` |
| `fontSize` | フォントサイズ    |
| `bottom`   | 下部からの距離    |
| `color`    | 色                |

### danmaku オブジェクト

| フィールド | 備考                            |
| ---------- | ------------------------------- |
| `id`       | ユニークな弾幕プール ID（必須） |
| `api`      | 弾幕 API URL（必須）            |
| `user`     | ユーザー識別子                  |
| `maximum`  | 最大弾幕数                      |

## 遅延読み込みメカニズム

プレーヤーは IntersectionObserver を介して遅延読み込みされます：プレースホルダー div がビューポートの200px以内に入ったときにのみ、プレーヤーモジュールとスタイルを動的 `import` してインスタンス化します。

- **APlayer**：動的 `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**：動的 `import("dplayer")`（スタイルは JS にインライン化。個別の CSS は不要）

モジュール読み込みは共有 Promise キャッシュを使用して、繰り返しの動的インポートを回避します。再インスタンス化は `dataset` マーカー（`xng-init`、`xng-observed`）によって防止されます。

## View Transitions 適応

プレーヤースクリプトは `astro:page-load` をリッスンし、各ページ読み込み後にプレースホルダー div を再スキャンします。View Transitions によるページ切り替え後、新しいページのプレーヤープレースホルダーが再観察されて遅延読み込みされます。

## パフォーマンス

- プレーヤー無効時はバンドルゼロ（remark プラグインが注入されず、クライアントスクリプトも読み込まれない）
- 有効でもページにプレーヤーがない場合はランタイムゼロ（スクリプトは読み込まれるがインスタンス化しない）
- プレーヤーモジュールはスタンドアロンチャンクで、使用するページでのみオンデマンド読み込み
- CSS と JS は別々にインポートされ、インスタンス化前にスタイルが準備されることを保証

## 型宣言

APlayer と DPlayer には公式の TypeScript 型がありません。Xingluo は [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) と [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts) で緩やかなモジュール宣言を提供し、options フィールドはスプレッド互換性のためにオプションとして設定されています。MDX コンポーネントの Props には完全な型制約があります。
