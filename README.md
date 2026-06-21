<div align="center">

<img src="public/favicon.svg" width="96" height="96" alt="星罗" />

# 星罗 · Xingluo

基于 Astro 与 shadcn 视觉风格的现代化博客主题

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

<p>
  <a href="./docs/zh-cn/README.md">简体中文</a> · <a href="./docs/en/README.md">English</a> ·
  <a href="./docs/de/README.md">Deutsch</a> · <a href="./docs/es/README.md">Español</a> ·
  <a href="./docs/fr/README.md">Français</a> · <a href="./docs/ja/README.md">日本語</a> ·
  <a href="./docs/ko/README.md">한국어</a> · <a href="./docs/pt/README.md">Português</a> ·
  <a href="./docs/ru/README.md">Русский</a> · <a href="./docs/ar/README.md">العربية</a> ·
  <a href="./docs/eo/README.md">Esperanto</a> ·
  <a href="./docs/zh-tw/README.md">繁體中文</a>
</p>

</div>

## ✨ 特性

- ⚡ **极致性能** — Astro 静态生成、零运行时 JS、评论与播放器按需懒加载
- 🎨 **现代视觉** — shadcn/ui new-york 风格、OKLCH 色彩空间、平滑暗黑模式
- 🌗 **暗黑模式** — 无闪烁切换，跟随系统偏好，评论与播放器主题自动同步
- 🔍 **全文搜索** — 基于 Flexsearch 实现浏览器端全文检索，构建时预生成按语言分组的索引数据
- 🌐 **多语言** — 多语言 UI 与内容级翻译，hreflang 与 x-default SEO 声明
- 📝 **内容增强** — 支持 Markdown 与 MDX，Shiki 双主题代码高亮、标注框、目录折叠、表格滚动
- 📖 **阅读时长** — CJK 按字符数、拉丁文按单词数智能估算，卡片与详情页均显示
- 🔗 **相关文章** — 按标签相似度推荐，自动排序
- 🏷️ **文章分类** — Frontmatter 指定分类，独立分类页与导航入口
- 📌 **粘性目录侧栏** — 大屏文章页右侧粘性目录，IntersectionObserver 滚动高亮当前章节
- 💬 **评论系统** — 支持使用 Giscus / Twikoo / Waline 评论系统，主题自动跟随，懒加载
- 🎵 **媒体播放器** — 集成 APlayer 音乐播放器与 DPlayer 视频播放器，并支持在 Markdown 和 MDX 中调用
- 📡 **SEO** — 实现动态 OG 图、RSS、Sitemap、JSON-LD 结构化数据（BlogPosting + BreadcrumbList）、Canonical 规范化

## 🚀 快速开始

环境要求：

- Node.js ≥ 22.12.0
- pnpm 10.x

```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览生产构建
```

## 📁 项目结构

```
src/
├── components/     # UI 组件
├── content/        # 内容集合（文章与独立页面）
├── i18n/           # 多语言资源与工具
├── layouts/        # 布局组件
├── lib/            # 工具库
├── pages/          # 路由页面
├── scripts/        # 客户端脚本
├── styles/         # 全局样式与主题变量
├── types/          # 类型定义与第三方模块声明
└── utils/          # 工具函数
```

## ⚙️ 配置

配置文件为 [`xingluo.config.ts`](./xingluo.config.ts)，可自定义站点信息、功能开关、社交链接、评论系统与播放器等。

完整配置项详见 [配置指南](./docs/zh-cn/configuration.md)。

## ✍️ 开始写作

在 `src/content/posts/` 下创建 Markdown 或 MDX 文件，使用以下 frontmatter：

```yaml
---
title: "文章标题"
pubDatetime: 2026-06-19T10:00:00+08:00
description: "文章描述"
tags: ["标签1", "标签2"]
featured: false # 可选，是否精选
draft: false # 可选，是否草稿
ogImage: "./cover.png" # 可选，OG 图
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

完整项目文档位于 [`docs/`](./docs/) 目录，支持多语言版本：

| 语言      | 文档入口                              |
| --------- | ------------------------------------- |
| 简体中文  | [docs/zh-cn/](./docs/zh-cn/README.md) |
| English   | [docs/en/](./docs/en/README.md)       |
| Deutsch   | [docs/de/](./docs/de/README.md)       |
| Español   | [docs/es/](./docs/es/README.md)       |
| Français  | [docs/fr/](./docs/fr/README.md)       |
| 日本語    | [docs/ja/](./docs/ja/README.md)       |
| 한국어    | [docs/ko/](./docs/ko/README.md)       |
| Português | [docs/pt/](./docs/pt/README.md)       |
| Русский   | [docs/ru/](./docs/ru/README.md)       |
| العربية   | [docs/ar/](./docs/ar/README.md)       |
| Esperanto | [docs/eo/](./docs/eo/README.md)       |
| 繁體中文  | [docs/zh-tw/](./docs/zh-tw/README.md) |

各语言文档均包含以下内容：

| 文档       | 内容                             |
| ---------- | -------------------------------- |
| 快速开始   | 安装、开发与构建                 |
| 配置指南   | 站点信息与功能开关               |
| 内容创作   | frontmatter、写作规范与内容增强  |
| 国际化     | UI 与内容级多语言翻译            |
| 架构总览   | 项目结构与设计决策               |
| 主题与样式 | shadcn 视觉与 OKLCH              |
| 评论系统   | giscus / twikoo / waline         |
| 媒体播放器 | APlayer / DPlayer                |
| SEO        | OG 图、RSS、sitemap、结构化数据  |
| 搜索       | Flexsearch 全文检索索引          |
| 部署       | 静态托管、GitHub Pages 与 Docker |

## 🛠️ 技术栈

| 类别     | 项目                                                                           |
| -------- | ------------------------------------------------------------------------------ |
| 框架     | [Astro](https://astro.build) 6.x                                               |
| 样式     | [Tailwind CSS](https://tailwindcss.com) v4、[shadcn/ui](https://ui.shadcn.com) |
| 图标     | astro-icon + Font Awesome                                                      |
| 代码高亮 | Shiki                                                                          |
| 搜索     | [Flexsearch](https://github.com/nextapps-de/flexsearch)                        |
| OG 图    | satori + sharp                                                                 |
| 评论     | giscus / twikoo / waline                                                       |
| 播放器   | APlayer / DPlayer                                                              |
| 日期     | [dayjs](https://day.js.org)                                                    |
| 语言     | TypeScript（strict）                                                           |
| 包管理   | pnpm                                                                           |

## 🐳 容器部署

```bash
# 构建镜像
docker build -t xingluo .

# 运行容器
docker run -d -p 8080:80 --name xingluo xingluo
```

## 📜 License

[AGPL-3.0](./LICENSE)
