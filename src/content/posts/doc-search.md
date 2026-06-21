---
title: "搜索"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "星罗搜索功能说明，涵盖 Flexsearch 全文检索集成的索引生成、UI、多语言搜索与性能优化。"
tags:
  - 文档
  - 搜索
category: "文档"
translationKey: doc-search
---

星罗集成 [Flexsearch](https://github.com/nextapps-de/flexsearch) 提供浏览器端全文检索，构建时预生成按语言分组的索引数据，支持 View Transitions 状态保持。

## 启用

通过 `features.search` 配置：

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

设为 `false` 时搜索页 `Astro.rewrite` 到 404，不生成搜索 UI。

## 工作原理

### 索引生成

构建流程的第三步 `node scripts/generateSearchIndex.mjs` 扫描 `dist/` 目录下的 HTML：

- 解析文章页的标题、描述、标签和正文内容
- 按语言分组生成 JSON 索引文件（`zh-cn` 与 `en` 各自独立）
- 索引输出到 `dist/search/`

### 索引范围

文章详情页（路径包含 `/posts/`）被纳入搜索索引，包含标题、描述、标签和正文内容。其他页面（首页、列表、归档等）不进入搜索索引。

## 搜索 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) 实现搜索页：

- 加载 Flexsearch 在浏览器端建立索引
- 通过 `getAssetPath("search/")` 定位索引 JSON 数据
- 自定义 shadcn 风格的搜索输入框与结果卡片
- `transition:persist` 保持搜索状态跨导航

### 搜索流程

1. 用户在搜索框输入
2. Flexsearch 在当前语言索引数据中多字段匹配（标题、描述、正文、标签）
3. 结果列表展示匹配文章（标题、摘要片段高亮、标签）
4. 将带查询参数的搜索页地址写入 sessionStorage，供返回按钮回跳

## 来源回跳

搜索页与文章页的导航回跳机制：

- `Main.astro` 组件将来源页地址写入 sessionStorage 的 `backUrl`
- 文章页的 `BackButton.astro` 优先回跳 sessionStorage 的 `backUrl`，无则回首页
- 搜索页写入带查询参数的地址，从文章页返回时恢复搜索状态

## 多语言搜索

构建时按语言分组生成独立的 JSON 索引文件：

- `zh-cn` 页面（根目录）→ `search/zh-cn.json`
- `en` 页面（`/en/` 前缀）→ `search/en.json`

搜索时自动加载当前页面语言对应的索引数据，中文页搜中文，英文页搜英文。

## 主题适配

搜索 UI 使用 shadcn 主题变量（`--background`、`--foreground`、`--primary`、`--border` 等），无需额外 CSS 变量覆盖。暗色模式下通过 `.dark` 选择器自动切换，与全站主题一致。

## 性能

- 搜索索引为静态 JSON 文件，搜索在客户端完成，无服务端请求
- Flexsearch 在浏览器端建立索引后进行高速检索
- `transition:persist` 避免导航时重复初始化搜索 UI
