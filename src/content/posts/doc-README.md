---
title: "星罗文档"
pubDatetime: 2026-06-20T02:00:00+08:00
description: "星罗（Xingluo）项目文档总览，包含文档导航、核心特性介绍与技术栈说明。"
tags:
  - 文档
  - 星罗
category: "文档"
translationKey: doc-README
featured: true
---

星罗是一个基于 [Astro](https://astro.build/) 与 [shadcn/ui](https://ui.shadcn.com/) 视觉风格构建的现代化博客 CMS，以扁平、优雅的 shadcn 组件与 OKLCH 色彩体系提供更现代的视觉体验，并原生集成评论系统、MDX 可选支持与音视频播放器。

## 文档导航

| 文档                                 | 内容                                                          |
| ------------------------------------ | ------------------------------------------------------------- |
| [快速开始](./doc-getting-started.md) | 环境要求、安装、本地开发、构建与预览                          |
| [配置指南](./doc-configuration.md)   | `xingluo.config.ts` 全部配置项详解                            |
| [内容创作](./doc-content.md)         | 文章 frontmatter、Markdown/MDX 语法、代码块、标注框、内容增强 |
| [国际化](./doc-i18n.md)              | 多语言路由策略、UI 文案、内容级翻译、新增语言                 |
| [架构总览](./doc-architecture.md)    | 目录结构、配置流、渲染流、构建流程                            |
| [主题与样式](./doc-theming.md)       | shadcn 主题变量、OKLCH、Tailwind v4、暗色模式                 |
| [评论系统](./doc-comments.md)        | giscus / twikoo / waline 三选一配置与接入                     |
| [媒体播放器](./doc-media-players.md) | APlayer / DPlayer 在 MD 与 MDX 中的使用                       |
| [SEO](./doc-seo.md)                  | OG 图、RSS、sitemap、hreflang、canonical、结构化数据          |
| [搜索](./doc-search.md)              | Pagefind 全文搜索集成                                         |
| [部署](./doc-deployment.md)          | 静态托管、GitHub Pages、环境变量、Docker                      |

## 核心特性

- **极致性能**：Astro 静态生成、构建期内联 SVG 图标（零运行时 JS）、按需懒加载评论与播放器、构建后孤儿资源清理
- **现代视觉**：shadcn/ui new-york 风格组件、OKLCH 色彩空间、平滑暗黑模式（FOUC 防护）
- **多语言**：UI 与内容级翻译，`prefixDefaultLocale:false` 路由策略，hreflang 与 x-default SEO 声明
- **内容增强**：MDX 可选支持、Shiki 双主题代码高亮、标注框（callouts）、目录折叠、表格滚动
- **阅读时长**：CJK 按字符数、拉丁文按单词数智能估算，卡片与详情页均显示
- **相关文章**：按标签相似度自动推荐
- **文章分类**：Frontmatter 指定分类，独立分类页与导航入口
- **粘性目录侧栏**：大屏文章页右侧粘性目录，IntersectionObserver 滚动高亮当前章节
- **评论系统**：giscus / twikoo / waline 三选一，主题自动跟随，懒加载
- **媒体播放器**：APlayer 音乐播放器与 DPlayer 视频播放器，MD 围栏与 MDX 组件双入口
- **搜索**：Pagefind 全文搜索，按语言分索引，View Transitions 状态保持
- **SEO**：动态 OG 图（satori + sharp）、RSS、sitemap、JSON-LD 结构化数据（BlogPosting + BreadcrumbList）、canonical 规范化

## 技术栈

| 类别     | 技术                                                         |
| -------- | ------------------------------------------------------------ |
| 框架     | Astro 6.x（静态生成）                                        |
| 样式     | Tailwind CSS v4、shadcn/ui 风格组件、@tailwindcss/typography |
| 图标     | astro-icon + Font Awesome（构建期内联）                      |
| 内容     | Astro Content Collections、MDX、remark/rehype 插件链         |
| 代码高亮 | Shiki（双主题 + 标注转换器）                                 |
| 搜索     | Pagefind                                                     |
| OG 图    | satori + sharp                                               |
| 评论     | giscus / twikoo / waline                                     |
| 播放器   | APlayer / DPlayer                                            |
| 日期     | dayjs（时区支持）                                            |
| 包管理   | pnpm                                                         |
| 语言     | TypeScript（strict）                                         |

## 许可证

AGPL-3.0
