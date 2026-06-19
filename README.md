<div align="center">

<img src="public/favicon.svg" width="96" height="96" alt="星罗" />

# 星罗 · Xingluo

基于 Astro 与 shadcn 视觉体系的现代化博客 CMS

[![CI](https://github.com/cysnies/Xingluo/actions/workflows/ci.yml/badge.svg)](https://github.com/cysnies/Xingluo/actions/workflows/ci.yml)
[![Deploy Pages](https://github.com/cysnies/Xingluo/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/cysnies/Xingluo/actions/workflows/deploy-pages.yml)
[![Publish Image](https://github.com/cysnies/Xingluo/actions/workflows/publish-image.yml/badge.svg)](https://github.com/cysnies/Xingluo/pkgs/container/xingluo)
[![License: AGPL-3.0](https://img.shields.io/github/license/cysnies/Xingluo?label=License&color=blue)](./LICENSE)
[![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Node](https://img.shields.io/badge/Node-%E2%89%A5%2022.12-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Stars](https://img.shields.io/github/stars/cysnies/Xingluo?style=social)](https://github.com/cysnies/Xingluo/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/cysnies/Xingluo)](https://github.com/cysnies/Xingluo/commits/main)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/cysnies/Xingluo/compare)

</div>

> 通过扁平、优雅的 shadcn 组件与 OKLCH 色彩体系，提供更现代的视觉体验；原生集成评论系统、可选 MDX 与音视频播放器。

---

## ✨ 特性

- ⚡ **极致性能** — Astro 静态生成、构建期内联 SVG 图标（零运行时 JS）、评论与播放器按需懒加载
- 🎨 **现代视觉** — shadcn/ui new-york 风格、OKLCH 色彩空间、平滑暗黑模式（FOUC 防护）
- 🌗 **暗黑模式** — 无闪烁切换，跟随系统偏好，评论与播放器主题自动同步
- 🔍 **全文搜索** — Pagefind 构建时索引，按语言分索引，View Transitions 状态保持
- 🌐 **多语言** — 简体中文（默认）与英文双语 UI，hreflang 与 x-default SEO 声明
- 📝 **内容增强** — MDX 可选支持、Shiki 双主题代码高亮、标注框、目录折叠、表格滚动
- 💬 **评论系统** — giscus / twikoo / waline 三选一，主题自动跟随，懒加载
- 🎵 **媒体播放器** — APlayer 音乐播放器与 DPlayer 视频播放器，MD 围栏与 MDX 组件双入口
- 📡 **SEO 全套** — 动态 OG 图（satori + sharp）、RSS、sitemap、JSON-LD 结构化数据、canonical 规范化
- 🎬 **View Transitions** — 页面切换动画，搜索状态持久化

## 🚀 快速开始

```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器（http://localhost:4321）
pnpm build        # 构建生产版本（astro check + astro build + pagefind + 孤儿清理）
pnpm preview      # 预览生产构建
```

> 环境要求：Node.js ≥ 22.12.0，pnpm 10.x

## 📁 项目结构

```
src/
├── components/     # UI 组件（ui/、post/、comments/、mdx/、pageViews/）
├── content/        # 内容集合（文章与页面）
├── i18n/           # 多语言资源与工具
├── layouts/        # 布局组件（Layout、PostLayout）
├── lib/            # 工具库（cn、dayjs、社交图标）
├── pages/          # 路由页面（根目录 + [locale]/ 镜像）
├── scripts/        # 客户端脚本（主题、文章增强、评论、播放器）
├── styles/         # 全局样式与主题变量
├── types/          # 类型定义与第三方模块声明
└── utils/          # 工具函数（含 remark/rehype 插件）
```

## ⚙️ 配置

修改 [`xingluo.config.ts`](./xingluo.config.ts) 自定义站点信息、功能开关、社交链接、评论系统与播放器等。完整配置项详见 [配置指南](./docs/configuration.md)。

<details>
<summary><b>启用评论系统</b></summary>

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { repo, repoId, category, categoryId },
  },
}
```

</details>

<details>
<summary><b>启用播放器</b></summary>

```ts
features: {
  players: { aplayer: true, dplayer: true },
}
```

</details>

<details>
<summary><b>关闭 MDX</b></summary>

```ts
features: { mdx: false },
}
```

</details>

## ✍️ 写作

在 `src/content/posts/` 下创建 Markdown 或 MDX 文件，使用以下 frontmatter：

```yaml
---
title: "文章标题"
pubDatetime: 2026-06-19T10:00:00+08:00
description: "文章描述"
tags: ["标签1", "标签2"]
featured: false  # 可选，是否精选
draft: false     # 可选，是否草稿
ogImage: "./cover.png"  # 可选，OG 图
---
```

<details>
<summary><b>在 Markdown 中插入播放器</b></summary>

````markdown
```aplayer
{"audio":[{"name":"曲名","url":"/song.mp3","cover":"/cover.jpg"}]}
```

```dplayer
{"video":{"url":"/demo.mp4","pic":"/cover.jpg"}}
```
````

</details>

<details>
<summary><b>在 MDX 中使用组件</b></summary>

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

<APlayer audio={[{ name: "曲名", url: "/song.mp3" }]} />
<DPlayer video={{ url: "/demo.mp4" }} />
```

</details>

## 📚 文档

完整项目文档位于 [`docs/`](./docs/) 目录：

| 文档 | 说明 |
| --- | --- |
| [快速开始](./docs/getting-started.md) | 安装、开发与构建 |
| [配置指南](./docs/configuration.md) | 站点信息与功能开关 |
| [内容创作](./docs/content.md) | frontmatter 与写作规范 |
| [架构总览](./docs/architecture.md) | 项目结构与设计决策 |
| [国际化](./docs/i18n.md) | 多语言适配 |
| [主题与样式](./docs/theming.md) | shadcn 视觉与 OKLCH |
| [评论系统](./docs/comments.md) | giscus / twikoo / waline |
| [媒体播放器](./docs/media-players.md) | APlayer / DPlayer |
| [SEO](./docs/seo.md) | OG 图、RSS、sitemap |
| [搜索](./docs/search.md) | Pagefind 索引 |
| [部署](./docs/deployment.md) | 静态托管与 Docker |

## 🛠️ 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | [Astro](https://astro.build) 6.x |
| 样式 | [Tailwind CSS](https://tailwindcss.com) v4、[shadcn/ui](https://ui.shadcn.com) 视觉系统 |
| 图标 | astro-icon + Font Awesome（构建期内联） |
| 代码高亮 | Shiki（双主题 + 标注转换器） |
| 搜索 | [Pagefind](https://pagefind.app) |
| OG 图 | satori + sharp |
| 评论 | giscus / twikoo / waline |
| 播放器 | APlayer / DPlayer |
| 日期 | [dayjs](https://day.js.org)（时区支持） |
| 语言 | TypeScript（strict） |
| 包管理 | pnpm |

## 🐳 容器部署

项目提供多阶段构建的 [`Dockerfile`](./Dockerfile)，运行期镜像基于 `nginx:alpine`：

```bash
# 构建镜像
docker build -t xingluo .

# 运行容器（映射到本地 8080）
docker run -d -p 8080:80 --name xingluo xingluo
```

发布 Release 时会自动构建多架构（amd64 / arm64）镜像并推送至 GitHub Packages：

```bash
docker pull ghcr.io/cysnies/xingluo:latest
```

## 📜 License

[AGPL-3.0](./LICENSE) © 星罗
