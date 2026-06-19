# 星罗（Xingluo）

基于 Astro 与 shadcn 视觉风格的现代化博客 CMS，通过扁平、优雅的 shadcn 组件与 OKLCH 色彩体系提供更现代的视觉体验，原生集成评论系统、MDX 可选支持与音视频播放器。

## 特性

- ⚡ **极致性能**：Astro 静态生成、构建期内联 SVG 图标（零运行时 JS）、评论与播放器按需懒加载
- 🎨 **现代视觉**：shadcn/ui new-york 风格组件、OKLCH 色彩空间、平滑暗黑模式（FOUC 防护）
- 🌗 **暗黑模式**：无闪烁切换，跟随系统偏好，评论与播放器主题自动同步
- 🔍 **全文搜索**：Pagefind 构建时索引，按语言分索引，View Transitions 状态保持
- 🌐 **多语言**：简体中文（默认）与英文双语 UI，hreflang 与 x-default SEO 声明
- 📝 **内容增强**：MDX 可选支持、Shiki 双主题代码高亮、标注框、目录折叠、表格滚动
- 💬 **评论系统**：giscus / twikoo / waline 三选一，主题自动跟随，懒加载
- 🎵 **媒体播放器**：APlayer 音乐播放器与 DPlayer 视频播放器，MD 围栏与 MDX 组件双入口
- 📡 **SEO 全套**：动态 OG 图（satori + sharp）、RSS、sitemap、JSON-LD 结构化数据、canonical 规范化
- 🎬 **View Transitions**：页面切换动画，搜索状态持久化

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本（astro check + astro build + pagefind）
pnpm build

# 预览生产构建
pnpm preview
```

> 环境要求：Node.js ≥ 22.12.0，pnpm 10.x

## 项目结构

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

## 配置

修改 [`xingluo.config.ts`](./xingluo.config.ts) 自定义站点信息、功能开关、社交链接、评论系统与播放器等。完整配置项详见 [配置指南](./docs/configuration.md)。

### 启用评论系统

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { repo, repoId, category, categoryId },
  },
}
```

### 启用播放器

```ts
features: {
  players: { aplayer: true, dplayer: true },
}
```

### 关闭 MDX

```ts
features: { mdx: false },
}
```

## 写作

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

### 在 Markdown 中插入播放器

````markdown
```aplayer
{"audio":[{"name":"曲名","url":"/song.mp3","cover":"/cover.jpg"}]}
```

```dplayer
{"video":{"url":"/demo.mp4","pic":"/cover.jpg"}}
```
````

### 在 MDX 中使用组件

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

<APlayer audio={[{ name: "曲名", url: "/song.mp3" }]} />
<DPlayer video={{ url: "/demo.mp4" }} />
```

## 文档

完整的项目文档位于 [`docs/`](./docs/) 目录：

- [快速开始](./docs/getting-started.md)
- [配置指南](./docs/configuration.md)
- [内容创作](./docs/content.md)
- [架构总览](./docs/architecture.md)
- [国际化](./docs/i18n.md)
- [主题与样式](./docs/theming.md)
- [评论系统](./docs/comments.md)
- [媒体播放器](./docs/media-players.md)
- [SEO](./docs/seo.md)
- [搜索](./docs/search.md)
- [部署](./docs/deployment.md)

## 技术栈

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

## License

AGPL v3.0
