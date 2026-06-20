---
title: "评论系统"
pubDatetime: 2026-06-20T09:00:00+08:00
description: "星罗评论系统配置指南，涵盖 giscus、twikoo、waline 三种评论系统的选择、配置与接入。"
tags:
  - 文档
  - 评论
category: "文档"
translationKey: doc-comments
---

星罗整合 giscus、twikoo、waline 三个评论系统，通过 `features.comments` 配置选择。

## 配置

在 [`xingluo.config.ts`](../xingluo.config.ts) 的 `features.comments` 中选择 provider 并提供对应配置：

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* giscus 配置 */ },
    // twikoo: { /* twikoo 配置 */ },
    // waline: { /* waline 配置 */ },
  },
}
```

`provider: false`（默认）时关闭评论，文章页不输出任何评论区标记与脚本。

## 评论区位置

评论区仅出现在**文章详情页**底部（相邻文章导航之后），由 [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro) 渲染。

## giscus

基于 GitHub Discussions 的评论系统，需仓库为 public 且启用 Discussions。

### 配置

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // GitHub 仓库
    repoId: "R_...",              // 仓库 ID（giscus.app 生成）
    category: "Announcements",    // Discussion 分类名
    categoryId: "DIC_...",        // 分类 ID（giscus.app 生成）
    mapping: "pathname",          // 可选，页面到 discussion 映射
    strict: false,                // 可选，严格标题匹配
    reactionsEnabled: true,       // 可选，表情反应
    inputPosition: "bottom",      // 可选，评论框位置：top | bottom
    loading: "lazy",              // 可选，加载方式：lazy | eager
  },
}
```

### 获取 repoId / categoryId

1. 访问 [giscus.app](https://giscus.app)
2. 填入仓库与分类，生成配置
3. 复制 `data-repo-id` 与 `data-category-id` 填入配置

### 工作方式

giscus 通过官方 `client.js` 注入 iframe，`data-*` 属性承载配置。语言按当前 locale 自动映射（`zh-cn` → `zh-CN`，`en` → `en`）。主题通过 `postMessage` 在切换时同步。

## twikoo

无后端依赖的评论系统，支持腾讯云开发或自托管。

### 配置

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // 云环境 ID 或自托管服务完整 URL
    lang: "zh-CN",                            // 可选，语言
  },
}
```

### envId 说明

- 腾讯云开发：填环境 ID（需额外引入 cloudbase SDK）
- 自托管：填完整 URL（如 `https://twikoo.example.com`），twikoo 自动识别为 HTTP API 模式

### 工作方式

twikoo 在评论容器进入视口时动态 `import("twikoo")` 并调用 `init`。twikoo 不支持运行时主题切换，站点主题变化时会重建以应用暗色样式。

## waline

带后端的评论系统，支持评论数与访问量统计。

### 配置

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Waline 服务端地址
    lang: "zh-CN",                           // 可选，语言
    pageSize: 10,                            // 可选，评论分页大小
    dark: "html.dark",                       // 可选，暗色选择器（默认跟随站点 .dark）
  },
}
```

### serverURL 部署

参考 [Waline 官方文档](https://waline.js.org/) 部署服务端（Vercel / Cloudflare / 自托管均可），将地址填入 `serverURL`。

### 工作方式

waline 在评论容器进入视口时动态 `import("@waline/client")` 与样式 `@waline/client/style`，调用 `init`。通过 `dark:"html.dark"` 选择器自动跟随站点暗色模式，无需手动同步。

## 懒加载

所有评论系统均通过 IntersectionObserver 懒加载：评论容器进入视口前 200px 时才发起请求与初始化，避免首屏性能损耗。

实现见 [`src/scripts/comments.ts`](../src/scripts/comments.ts)。

## 主题同步

站点主题切换时，评论系统主题自动同步：

| 评论系统 | 同步方式                                                     |
| -------- | ------------------------------------------------------------ |
| giscus   | `postMessage({giscus:{setConfig:{theme}}})` 向 iframe 发消息 |
| waline   | `dark:"html.dark"` CSS 选择器自动跟随                        |
| twikoo   | 监听 `.dark` 类变化，重建评论实例                            |

主题监听通过 `MutationObserver` 观察 `document.documentElement` 的 `class` 与 `data-theme` 属性变化。

## View Transitions 适配

评论脚本监听 `astro:page-load` 事件，每次页面加载后重新扫描挂载点并初始化。防重复初始化通过 `dataset` 标记（`xng-setup`、`xng-init`）。

## i18n

评论区的标题文案通过 `UIStrings.comments.title` 本地化（`zh-cn.ts` 为"评论"，`en.ts` 为"Comments"）。评论系统 UI 的语言由各 provider 的 `lang` 字段控制。

## 自定义扩展

### 切换 provider

修改 `xingluo.config.ts` 的 `features.comments.provider` 即可，无需改动代码。星罗会自动渲染对应子组件。

### 新增评论系统

1. 在 `src/components/comments/` 创建新组件（如 `Disqus.astro`），渲染挂载占位
2. 在 `Comments.astro` 的条件渲染中添加新 provider 分支
3. 在 `src/scripts/comments.ts` 添加初始化逻辑
4. 在 `src/types/config.ts` 扩展 `CommentProvider` 与配置类型
