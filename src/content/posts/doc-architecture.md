---
title: "架构总览"
pubDatetime: 2026-06-20T07:00:00+08:00
description: "星罗整体架构说明，涵盖目录结构、配置流、渲染流、构建流程与扩展指南。"
tags:
  - 文档
  - 架构
category: "文档"
translationKey: doc-architecture
---

本文档阐述星罗的整体架构、目录结构、配置流、渲染流与构建流程，帮助理解代码组织与扩展方式。

## 目录结构

```
xingluo/
├── astro.config.ts          # Astro 配置（集成、i18n、markdown、字体、env）
├── xingluo.config.ts        # 用户配置入口
├── tsconfig.json            # TypeScript 配置（strict + @/* 路径别名）
├── package.json             # 依赖与脚本
├── public/                  # 静态资源（favicon.svg、默认 OG 图等）
├── docs/                    # 项目文档（本目录）
├── references/              # 只读参考项目源码（不得依赖）
└── src/
    ├── config.ts            # 配置合并默认值，导出解析后配置
    ├── content.config.ts    # 内容集合 schema（posts、pages）
    ├── env.d.ts             # 第三方模块与环境变量类型声明
    ├── assets/              # 图标组件
    │   └── icons/           # astro-icon + Font Awesome（含 socials/）
    ├── components/          # UI 组件
    │   ├── ui/              # shadcn 风格组件（Button、Card、Badge 等）
    │   ├── post/            # 文章页组件（相邻导航、返回、分享等）
    │   ├── comments/        # 评论系统组件
    │   ├── mdx/             # MDX 自定义组件（APlayer、DPlayer）
    │   ├── pageViews/       # 页面视图（页面渲染逻辑集中处）
    │   └── *.astro          # 根级组件（Header、Footer、PostCard 等）
    ├── content/             # 内容文件
    │   ├── posts/           # 博客文章
    │   └── pages/           # 静态页面
    ├── i18n/                # 国际化体系
    │   ├── index.ts         # 语言加载与 useTranslations
    │   ├── types.ts         # UIStrings 完整类型
    │   ├── routing.ts       # locale 路径解析
    │   ├── staticPaths.ts   # 非默认语言 getStaticPaths
    │   ├── format.ts        # 模板字符串替换
    │   └── lang/            # 语言资源文件（zh-cn.ts、en.ts）
    ├── layouts/             # 布局
    │   ├── Layout.astro     # 基础骨架（head、SEO、FOUC）
    │   └── PostLayout.astro # 文章布局（JSON-LD、article meta）
    ├── lib/                 # 基础工具库
    │   ├── utils.ts         # cn（tailwind-merge + clsx）
    │   ├── dayjs.ts         # dayjs 实例与时区插件
    │   └── socialIcons.ts   # 社交图标动态解析
    ├── pages/               # 路由（根目录 + [locale]/ 镜像）
    ├── scripts/             # 客户端脚本
    │   ├── theme.ts         # 主题切换
    │   ├── postEnhancements.ts # 文章增强（锚点、复制、灯箱、进度条）
    │   ├── comments.ts      # 评论懒加载与主题同步
    │   └── players.ts       # 播放器懒加载
    ├── styles/              # 样式
    │   ├── global.css       # Tailwind 入口 + 基础层 + 自定义工具类
    │   ├── theme.css        # shadcn 主题变量（OKLCH）
    │   └── typography.css   # .app-prose 排版与代码块样式
    ├── types/               # 类型声明
    │   ├── config.ts        # 配置类型
    │   └── *.d.ts           # 无类型的第三方模块声明
    └── utils/               # 工具函数
        ├── getPostPaths.ts  # 文章 slug 与 URL 推导
        ├── getSortedPosts.ts# 文章排序
        ├── postFilter.ts    # 草稿与定时发布过滤
        ├── getUniqueTags.ts # 标签去重
        ├── remarkPlayers.ts # 播放器 remark 插件
        ├── rehypeWrapTable.ts# 表格滚动包裹
        └── ...              # 其他工具
```

## 配置流

```
xingluo.config.ts
   │ defineXingluoConfig（类型约束，原样返回）
   ▼
src/config.ts
   │ resolveConfig（合并默认值 + resolveComments + resolvePlayers）
   ▼
src/types/config.ts
   │ XingluoConfig（完整类型）
   ▼
全站通过 import config from "@/config" 引用
```

关键点：

- `xingluo.config.ts` 是用户唯一需要修改的配置文件
- `src/config.ts` 的 `resolveConfig` 做浅合并（`site`/`posts`）与深合并（`features.editPost`、`features.comments`、`features.players`）
- `astro.config.ts` 读取未合并的 `./xingluo.config`（因为需在 Astro 配置层决定集成加载），故访问 `features` 用可选链
- `src/content.config.ts` 读取已合并的 `@/config`，故 `features` 必填

## 渲染流

### 页面渲染

星罗采用"页面薄包装 + 视图组件"模式，渲染逻辑集中在 `src/components/pageViews/`：

```
src/pages/posts/[...slug]/index.astro   ← 薄包装：getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← 渲染逻辑
    │
    ▼
src/layouts/PostLayout.astro  ← 文章布局（JSON-LD、article meta）
    │
    ▼
src/layouts/Layout.astro      ← 基础骨架（head、SEO、FOUC、ClientRouter）
```

薄包装页面仅负责 `getStaticPaths` 与传递 props，视图组件负责全部渲染逻辑。`[locale]/` 镜像页面同样是薄包装，通过 `getLocaleParams()` 仅生成非默认语言。

### 路由体系

```
src/pages/
├── 404.astro                      # 404（不镜像）
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # 站点级 OG 图端点
├── rss.xml.ts                     # RSS 端点
├── robots.txt.ts                  # robots.txt 端点
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # 文章级 OG 图端点
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # 非默认语言镜像（getStaticPaths=getLocaleParams）
    └── （结构完全镜像根目录，除 404、og.png、rss、robots）
```

### 文章 URL 推导

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts)：

- `getPostSlug(id, filePath)`：从内容集合 `id` 与文件路径推导路由 slug，过滤 `_` 前缀目录
- `getPostUrl(id, filePath, locale)`：生成含 locale 前缀的可导航 URL（默认语言无前缀）

### 文章过滤与排序

- [`postFilter.ts`](../src/utils/postFilter.ts)：排除草稿；生产环境按 `pubDatetime - scheduledPostMargin` 过滤未来文章；开发环境全部可见
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts)：过滤后按 `modDatetime ?? pubDatetime` 倒序
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts)：标签 slug 去重排序

## 客户端脚本体系

星罗的客户端交互通过 `<script>` 标签在页面底部加载，统一适配 View Transitions：

| 脚本                  | 加载位置                                           | 事件适配                                                                                     | 职责                                   |
| --------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| `theme.ts`            | `Layout.astro` body 末                             | `astro:after-swap` 重绑、`astro:before-swap` 携带 theme-color、`prefers-color-scheme` change | 主题持久化与切换                       |
| `postEnhancements.ts` | `PostDetailView.astro`                             | `astro:page-load` 重初始化                                                                   | 标题锚点、代码复制、阅读进度、图片灯箱 |
| `comments.ts`         | `Comments.astro`                                   | `astro:page-load` 重扫                                                                       | 评论懒加载与主题同步                   |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro`（条件） | `astro:page-load` 重扫                                                                       | 播放器懒加载                           |

> 注意：`comments.ts` 与 `players.ts` 无顶层 import/export，需在文件末尾加 `export {}` 标记为模块，避免与其他文件的全局声明冲突。

## 构建流程

`pnpm run build` = `astro check && astro build && pagefind --site dist`

1. **`astro check`**：TypeScript + Astro 模板类型检查
2. **`astro build`**：
   - 收集内容集合（按 `features.mdx` 决定是否含 `.mdx`）
   - 静态生成全部页面（含 `[locale]/` 镜像）
   - 生成端点：RSS、sitemap、robots.txt、站点级与文章级 OG 图
   - 条件加载 `mdx()` 集成、条件注入 `remarkPlayers` 插件
   - 构建期内联 SVG 图标（astro-icon，零运行时 JS）
   - 动态 import 的评论与播放器模块拆分为独立 chunk（懒加载）
3. **`pagefind --site dist`**：扫描 `dist/` 的 `data-pagefind-body` 标记内容，按语言生成搜索索引到 `dist/pagefind/`

## 性能优化策略

- **零运行时 JS 图标**：astro-icon 构建期内联 Font Awesome SVG（sprite `<symbol>` 模式）
- **SVG 优化**：`experimental.svgOptimizer`（svgo）压缩内联与引用的 SVG
- **按需懒加载**：评论与播放器通过 IntersectionObserver 在滚动到视口时动态 import，关闭时零打包
- **条件集成**：MDX 关闭时不加载 `mdx()` 集成，播放器关闭时不注入 remark 插件
- **CSS 体积**：Tailwind v4 按需生成，OKLCH 变量集中管理
- **OG 图字体**：仅供 satori 使用，不注入站点 CSS
- **View Transitions**：`<ClientRouter/>` 实现页面切换动画，搜索框 `transition:persist` 保持状态

## 扩展指南

### 新增页面

1. 在 `src/pages/` 创建 `.astro` 文件（薄包装）
2. 在 `src/components/pageViews/` 创建对应 View 组件
3. 若需多语言，在 `src/pages/[locale]/` 创建同名镜像薄包装

### 新增 UI 组件

遵循 shadcn 风格，在 `src/components/ui/` 下创建 `.astro` 组件与 `.ts` 变体配置（使用 `class-variance-authority`）。

### 新增客户端脚本

在 `src/scripts/` 创建 `.ts` 文件，末尾加 `export {}` 标记模块，监听 `astro:page-load` 适配 View Transitions，在对应页面 `<script>` 标签中 import。

### 新增 remark/rehype 插件

在 `src/utils/` 创建插件文件，在 `astro.config.ts` 的 `markdown.remarkPlugins` 或 `rehypePlugins` 中按需注入。
