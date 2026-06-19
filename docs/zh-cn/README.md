# 星罗（Xingluo）文档

星罗是一个基于 [Astro](https://astro.build/) 与 [shadcn/ui](https://ui.shadcn.com/) 视觉风格构建的现代化博客 CMS，以扁平、优雅的 shadcn 组件与 OKLCH 色彩体系提供更现代的视觉体验，并原生集成评论系统、MDX 可选支持与音视频播放器。

## 文档导航

| 文档 | 内容 |
| --- | --- |
| [快速开始](./getting-started.md) | 环境要求、安装、本地开发、构建与预览 |
| [配置指南](./configuration.md) | `xingluo.config.ts` 全部配置项详解 |
| [内容创作](./content.md) | 文章 frontmatter、Markdown/MDX 语法、代码块、标注框 |
| [架构总览](./architecture.md) | 目录结构、配置流、渲染流、构建流程 |
| [国际化](./i18n.md) | 多语言路由策略、UI 文案、新增语言 |
| [主题与样式](./theming.md) | shadcn 主题变量、OKLCH、Tailwind v4、暗色模式 |
| [评论系统](./comments.md) | giscus / twikoo / waline 三选一配置与接入 |
| [媒体播放器](./media-players.md) | APlayer / DPlayer 在 MD 与 MDX 中的使用 |
| [SEO](./seo.md) | OG 图、RSS、sitemap、hreflang、canonical、结构化数据 |
| [搜索](./search.md) | Pagefind 全文搜索集成 |
| [部署](./deployment.md) | 静态托管、环境变量、平台适配 |

## 核心特性

- **极致性能**：Astro 静态生成、构建期内联 SVG 图标（零运行时 JS）、按需懒加载评论与播放器、CSS 体积优化
- **现代视觉**：shadcn/ui new-york 风格组件、OKLCH 色彩空间、平滑暗黑模式（FOUC 防护）
- **多语言**：中英双语 UI，`prefixDefaultLocale:false` 路由策略，hreflang 与 x-default SEO 声明
- **内容增强**：MDX 可选支持、Shiki 双主题代码高亮、标注框（callouts）、目录折叠、表格滚动
- **评论系统**：giscus / twikoo / waline 三选一，主题自动跟随，懒加载
- **媒体播放器**：APlayer 音乐播放器与 DPlayer 视频播放器，MD 围栏与 MDX 组件双入口
- **搜索**：Pagefind 全文搜索，按语言分索引，View Transitions 状态保持
- **SEO 全套**：动态 OG 图（satori + sharp）、RSS、sitemap、JSON-LD 结构化数据、canonical 规范化

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Astro 6.x（静态生成） |
| 样式 | Tailwind CSS v4、shadcn/ui 风格组件、@tailwindcss/typography |
| 图标 | astro-icon + Font Awesome（构建期内联） |
| 内容 | Astro Content Collections、MDX、remark/rehype 插件链 |
| 代码高亮 | Shiki（双主题 + 标注转换器） |
| 搜索 | Pagefind |
| OG 图 | satori + sharp |
| 评论 | giscus / twikoo / waline |
| 播放器 | APlayer / DPlayer |
| 日期 | dayjs（时区支持） |
| 包管理 | pnpm |
| 语言 | TypeScript（strict） |

## 许可证

AGPL-3.0
