---
title: "欢迎来到星罗"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "星罗是一个基于 Astro 与 shadcn 视觉风格的现代化博客 CMS，本文介绍项目的设计理念与核心特性。"
tags:
  - 公告
  - Astro
featured: true
locale: zh-cn
translationKey: welcome-to-xingluo
---

## 关于星罗

**星罗（Xingluo）** 是一个使用 Astro 和 shadcn 视觉风格构建的博客 CMS。

## 核心特性

- ⚡ **极致性能**：基于 Astro 静态生成，零运行时 JavaScript 开销
- 🎨 **现代视觉**：shadcn/ui 的 new-york 风格，OKLCH 色彩空间
- 🌗 **暗黑模式**：无闪烁切换，跟随系统偏好
- 🔍 **全文搜索**：基于 Pagefind 的构建时索引
- 🌐 **多语言**：简体中文与英文双语支持
- 📝 **Markdown**：支持 MDX、代码高亮、目录、标注框
- 📡 **RSS 与 SEO**：开箱即用的 RSS 源与结构化数据

## 代码示例

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 开始写作

在 `src/content/posts/` 目录下创建 Markdown 文件，添加 frontmatter 即可发布文章。详细字段说明请参考项目文档。

开始你的写作之旅吧！
