---
title: "搜索"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "星罗搜索功能说明，涵盖 Pagefind 分片索引、分类筛选、命中摘录、多语言搜索与性能优化。"
tags:
  - 文档
  - 搜索
category: "文档"
translationKey: doc-search
---

星罗使用 [Pagefind](https://pagefind.app/) 提供全文检索。索引在构建阶段生成并拆分为压缩片段，用户查询时只下载命中的词典、筛选信息和正文片段，不会先下载整站文章正文。

## 启用

通过 `features.search` 配置：

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

旧配置中的 `"flexsearch"` 仍作为兼容值启用搜索。设为 `false` 时搜索页会 `Astro.rewrite` 到 404。

## 工作原理

### 索引生成

`astro build` 完成后，`node scripts/generatePagefindIndex.mjs` 使用 Pagefind 1.6 扫描 `dist/`：

- 只索引带有 `data-pagefind-body` 的文章详情页正文
- 通过元数据保留标题、描述、发布时间、分类与标签
- 通过筛选字段区分页面语言与文章分类
- 排除代码块、播放器、按钮、图标和操作控件
- 将搜索索引拆分为按需加载的 `dist/pagefind/` 分片

### 索引范围

首页、文章列表、分页、归档、分类聚合页与标签聚合页不会进入正文索引。文章代码块也不会进入可搜索正文，避免搜索结果出现代码 token 或无意义的播放器控件文本。

## 搜索 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) 实现搜索页：

- 首次搜索时动态加载 Pagefind 客户端，不在页面初始加载阶段请求索引
- 使用大尺寸搜索框、可见的清除按钮和结果数量提示
- 左侧展示分类筛选项及当前查询下的分类命中数，筛选状态同步到 URL
- 右侧展示 Pagefind 返回的标题、元信息与多段正文命中摘录
- Pagefind 的 `<mark>` 高亮统一使用站点黄色强调样式
- `transition:persist` 保持搜索状态跨导航

### 搜索流程

1. 用户在搜索框输入
2. Pagefind 根据查询词加载最小必要的词典和正文分片
3. 结果按当前页面语言与文章分类筛选
4. 左侧生成当前查询的分类计数，右侧展示文章和多段正文命中摘录
5. 分类选择会更新 `category` 查询参数，刷新或分享链接时保持筛选状态
6. 将带查询参数的搜索页地址写入 sessionStorage，供返回按钮回跳

搜索结果支持 `↑` / `↓` 在结果之间移动，`Enter` 打开结果，`Esc` 返回搜索框或清空查询。

## 来源回跳

搜索页与文章页的导航回跳机制：

- `Main.astro` 组件将来源页地址写入 sessionStorage 的 `backUrl`
- 文章页的 `BackButton.astro` 优先回跳 sessionStorage 的 `backUrl`，无则回首页
- 搜索页写入带查询参数的地址，从文章页返回时恢复搜索状态

## 多语言搜索

Pagefind 根据文章 HTML 的语言和 `language` 筛选字段建立分语言索引。搜索时只请求当前页面语言的结果，中文页搜索中文内容，英文页搜索英文内容。

## 性能

- 构建阶段生成分片索引，浏览器不再下载全部文章正文并现场创建索引
- 查询只加载相关词典与命中正文片段，索引成本随查询范围增长
- 默认双语示例站点的 Pagefind 目录当前约为 0.34 MB，并受 `scripts/budget.mjs` 门禁约束
- 代码块与界面控件不进入正文索引，减少无效词项与摘录噪声
- `transition:persist` 避免导航时重复初始化搜索 UI
