---
title: "Xingluo へようこそ"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo は Astro と shadcn ビジュアルスタイルで構築されたモダンなブログ CMS です。この投稿では、デザイン哲学とコア機能を紹介します。"
tags:
  - announcement
  - Astro
featured: true
locale: ja
translationKey: welcome-to-xingluo
category: announcement
---

## Xingluo について

**Xingluo** は Astro と shadcn ビジュアルスタイルで構築されたブログ CMS です。

## 主な機能

- ⚡ **最高のパフォーマンス**: Astro による静的生成、JavaScript ランタイムオーバーヘッドゼロ
- 🎨 **モダンなビジュアル**: shadcn/ui new-york スタイル、OKLCH 色空間
- 🌗 **ダークモード**: フリッカーフリーの切り替え、システム設定に追従
- 🔍 **全文検索**: Flexsearch によるビルド時インデックス作成
- 🌐 **多言語対応**: 日本語、英語、中国語をサポート
- 📝 **Markdown**: MDX、シンタックスハイライト、目次、コールアウト
- 📡 **RSS & SEO**: RSS フィードと構造化データをすぐに利用可能

## コード例

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 書き始める

`src/content/posts/` ディレクトリに Markdown ファイルを作成し、frontmatter を追加して記事を公開します。詳細なフィールドの説明はプロジェクトドキュメントを参照してください。

執筆の旅を始めましょう！
