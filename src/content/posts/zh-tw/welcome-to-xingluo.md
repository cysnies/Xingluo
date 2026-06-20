---
title: "歡迎來到星羅"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "星羅是一個基於 Astro 與 shadcn 視覺風格的現代化部落格 CMS，本文介紹專案的設計理念與核心特性。"
tags:
  - announcement
  - Astro
featured: true
locale: zh-tw
translationKey: welcome-to-xingluo
category: announcement
---

## 關於星羅

**星羅（Xingluo）** 是一個使用 Astro 和 shadcn 視覺風格構建的部落格 CMS。

## 核心特性

- ⚡ **極致效能**：基於 Astro 靜態生成，零執行階段 JavaScript 開銷
- 🎨 **現代視覺**：shadcn/ui 的 new-york 風格，OKLCH 色彩空間
- 🌗 **暗黑模式**：無閃爍切換，跟隨系統偏好
- 🔍 **全文搜尋**：基於 Pagefind 的構建時索引
- 🌐 **多語言**：繁體中文、英文雙語支援
- 📝 **Markdown**：支援 MDX、程式碼凸顯、目錄、標註框
- 📡 **RSS 與 SEO**：開箱即用的 RSS 源與結構化資料

## 程式碼範例

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 開始寫作

在 `src/content/posts/` 目錄下建立 Markdown 檔案，加入 frontmatter 即可發佈文章。詳細欄位說明請參考專案文件。

開始你的寫作之旅吧！
