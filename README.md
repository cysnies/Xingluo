# 星罗（Xingluo）

基于 Astro 与 shadcn 视觉风格的现代化博客 CMS。

## 特性

- ⚡ **极致性能**：Astro 静态生成，零运行时 JavaScript 开销
- 🎨 **现代视觉**：shadcn/ui new-york 风格，OKLCH 色彩空间
- 🌗 **暗黑模式**：无闪烁切换，跟随系统偏好
- 🔍 **全文搜索**：Pagefind 构建时索引
- 🌐 **多语言**：简体中文（默认）与英文双语
- 📝 **Markdown**：支持 MDX、代码高亮、目录、标注框
- 📡 **RSS 与 SEO**：开箱即用的 RSS、sitemap、结构化数据

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
src/
├── components/     # UI 组件（含 shadcn 风格基础组件）
├── content/        # 内容集合（文章与页面）
├── i18n/          # 多语言资源与工具
├── layouts/       # 布局组件
├── lib/           # 工具库（cn、dayjs 配置）
├── pages/         # 路由页面
├── scripts/       # 客户端脚本（主题切换）
├── styles/        # 全局样式与主题变量
├── types/         # 类型定义
└── utils/         # 工具函数
```

## 配置

修改 `xingluo.config.ts` 自定义站点信息、功能开关、社交链接等。

## 写作

在 `src/content/posts/` 下创建 Markdown 文件，使用以下 frontmatter：

```yaml
---
title: "文章标题"
pubDatetime: 2026-06-19T10:00:00+08:00
description: "文章描述"
tags: ["标签1", "标签2"]
featured: false  # 可选，是否精选
draft: false     # 可选，是否草稿
---
```

## 技术栈

- [Astro](https://astro.build) 6.x
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) 视觉系统
- [Pagefind](https://pagefind.app) 静态搜索
- [dayjs](https://day.js.org) 日期处理

## License

AGPL v3.0
