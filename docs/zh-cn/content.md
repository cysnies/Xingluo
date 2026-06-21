# 内容创作

星罗使用 Astro Content Collections 管理内容，支持 Markdown（`.md`）与 MDX（`.mdx`，需开启 `features.mdx`）。

## 内容集合

两个内容集合定义在 [`src/content.config.ts`](../src/content.config.ts)：

| 集合    | 目录                 | 用途                 |
| ------- | -------------------- | -------------------- |
| `posts` | `src/content/posts/` | 博客文章             |
| `pages` | `src/content/pages/` | 静态页面（如关于页） |

文件命名约定：

- 以 `_` 开头的文件或目录会被忽略（草稿备用）
- 启用 MDX 时收集 `**/*.{md,mdx}`，关闭时仅 `**/*.md`
- 文章 URL 由文件路径推导（详见 [架构总览](./architecture.md) 的路由体系）

## 文章 frontmatter

`posts` 集合的完整字段：

```markdown
---
title: "文章标题" # 必填
pubDatetime: 2026-06-19T10:00:00+08:00 # 必填，发布时间
modDatetime: 2026-06-20T10:00:00+08:00 # 可选，更新时间
description: "文章摘要，用于 SEO 与列表" # 必填
tags: ["Astro", "博客"] # 可选，默认 ["others"]
featured: true # 可选，是否精选（首页展示）
draft: false # 可选，草稿不发布
author: "星罗" # 可选，默认取 site.author
ogImage: "./cover.png" # 可选，OG 图（图片导入或字符串路径）
canonicalURL: "https://..." # 可选，规范链接
hideEditPost: false # 可选，隐藏编辑链接
timezone: "Asia/Shanghai" # 可选，覆盖站点时区
comments: true # 可选，覆盖全局评论开关（true 启用 / false 关闭）
---
```

### 字段说明

| 字段             | 类型            | 默认值          | 说明                                                                                    |
| ---------------- | --------------- | --------------- | --------------------------------------------------------------------------------------- |
| `title`          | string          | 必填            | 文章标题                                                                                |
| `pubDatetime`    | date            | 必填            | 发布时间，ISO 8601 格式                                                                 |
| `modDatetime`    | date            | —               | 更新时间，显示"更新于"标签                                                              |
| `description`    | string          | 必填            | 摘要，用于 meta、RSS、列表卡片                                                          |
| `tags`           | string[]        | `["others"]`    | 标签数组，自动生成标签页                                                                |
| `featured`       | boolean         | —               | 首页"精选文章"区块展示                                                                  |
| `draft`          | boolean         | —               | 草稿，生产构建过滤（开发可见）                                                          |
| `author`         | string          | `site.author`   | 作者名                                                                                  |
| `ogImage`        | image \| string | —               | OG 图；`image()` 走 Astro 资源管线优化，字符串为 `public/` 路径或外链                   |
| `canonicalURL`   | string          | —               | 规范链接，覆盖默认（详见 [SEO](./seo.md)）                                              |
| `hideEditPost`   | boolean         | —               | 隐藏该文章的编辑链接                                                                    |
| `timezone`       | string          | `site.timezone` | 覆盖该文章的显示时区                                                                    |
| `locale`         | string          | `site.lang`     | 文章写作语言，如 `"en"`、`"ja"`。未设置时视为默认语言                                   |
| `translationKey` | string          | —               | 翻译分组键：相同 key 的文章互为译文。未设置时文章独立，不参与译文分组                   |
| `category`       | string          | —               | 文章分类（单值），生成 `/categories/<slug>/` 分类页；未设置时不属于任何分类             |
| `comments`       | boolean         | —               | 覆盖全局评论开关：`true` 启用、`false` 关闭该文章评论；未设置时跟随 `features.comments` |

### 内容级翻译

通过 `locale` 与 `translationKey` 两个 frontmatter 字段实现文章的多语言版本：

1. 默认语言文章放 `src/content/posts/<slug>.md`
2. 译文放语言子目录 `src/content/posts/<locale>/<slug>.md`（如 `en/welcome.md`）
3. 译文设置 `locale` 为自己的语言、`translationKey` 与原文一致

路由层会自动解析对应语言的译文并在列表中去重——不同语言的同一篇文章只渲染为对应语言的一张卡片。无译文的文章在非默认语言页会回退显示原文内容。详见 [国际化](./i18n.md)。

### 定时发布

未来时间的文章在生产环境按 `scheduledPostMargin` 容差过滤：若 `pubDatetime` 距当前时间小于容差（默认 15 分钟），视为已发布。开发环境下所有非草稿文章均可见。

## 静态页面 frontmatter

`pages` 集合字段较简单：

```markdown
---
title: "关于"
description: "关于本站" # 可选
ogImage: "default-og.jpg" # 可选，仅字符串
canonicalURL: "https://..." # 可选
comments: true # 可选，覆盖全局评论开关（true 启用 / false 关闭）
---
```

关于页通过 `getEntry("pages", "about")` 获取，需在 `src/content/pages/about.md` 创建。静态页面同样支持 `comments` 字段，用于单独控制该页面是否显示评论区（需全局已配置评论 provider）。

## Markdown 增强

星罗预置以下 remark / rehype 插件（见 `astro.config.ts`）：

### 目录

`remark-toc` 自动生成目录，`remark-collapse` 默认折叠。在文章中插入占位：

```markdown
## Table of contents

（目录会自动填充此处）
```

### 标注框（Callouts）

`rehype-callouts` 支持 Obsidian 风格标注：

```markdown
> [!NOTE]
> 提示内容

> [!WARNING]
> 警告内容

> [!TIP]
> 技巧内容
```

支持的类型：`NOTE`、`TIP`、`INFO`、`WARNING`、`DANGER`、`SUCCESS`、`QUESTION`、`FAILURE` 等。

### 代码高亮

Shiki 双主题（亮色 `min-light`、暗色 `night-owl`），支持：

- 行高亮：` ```js {1,3-5} `
- 单词高亮：` ```js /word/ `
- 差异标注：行首 `+` / `-`
- 文件名标注：` ```js file=src/index.ts ` 或 `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // 高亮行
}
```

### 表格

宽表格自动包裹在可横向滚动的容器中（`rehypeWrapTable` 插件），避免窄屏溢出。

## MDX 支持

开启 `features.mdx`（默认开启）后可使用 `.mdx` 文件，享受组件化写作能力。

### 自定义组件

星罗内置 MDX 组件位于 [`src/components/mdx/`](../src/components/mdx)，通过统一出口导入：

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# 我的文章

<APlayer
  audio={[
    { name: "曲名", artist: "艺术家", url: "/audio.mp3", cover: "/cover.jpg" },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

详见 [媒体播放器](./media-players.md)。

### 关闭 MDX

设置 `features.mdx: false` 后：

- `mdx()` 集成不加载
- 内容集合 glob 仅匹配 `*.md`（已存在的 `.mdx` 文件不会被收集）
- 构建产物不含 MDX 运行时

## 评论

文章详情页底部自动渲染评论系统（需在 `features.comments` 配置 provider）。详见 [评论系统](./comments.md)。

## 阅读时长

文章详情页与列表卡片自动显示估算阅读时长：

- **CJK 语言**（zh-cn、ja、ko）：按中日韩字符数计算，约每分钟 400 字
- **其他语言**：按空白分词后的单词数计算，约每分钟 200 词
- 结果向上取整，最小 1 分钟

计算前会剥离代码块、HTML 标签、Markdown 链接等非正文内容，确保估算贴近实际阅读量。无需额外配置，自动生效。

## 相关文章

文章详情页底部（上一篇/下一篇之后）展示最多 2 篇相关文章：

- 按共享标签数量降序排列
- 同分数按发布时间降序（优先推荐较新的文章）
- 无共享标签时不显示该区块
- 自动被 pagefind 搜索索引忽略

无需额外配置，自动生效。

## 粘性目录侧栏

文章详情页在大屏（≥1024px）右侧显示粘性目录侧栏：

- 基于文章内 h2~h6 标题自动生成，扁平缩进列表
- 缩进层级反映标题深度（h3 比 h2 多一级缩进）
- 滚动时自动高亮当前可视章节（IntersectionObserver）
- 点击目录项平滑滚动到对应标题
- 小屏（移动端）隐藏侧栏，可用文内折叠目录

基于 Astro `render()` 返回的 `headings` 生成，无需作者手动维护。文内亦可通过 `remark-toc` 生成折叠目录（在文中写 `## Table of contents`），与侧栏并存互补。

## 分类

通过 frontmatter 的 `category` 字段（单值字符串）为文章指定分类：

```yaml
---
title: "我的文章"
category: "教程"
---
```

- 分类页地址为 `/categories/<slug>/`，slug 经 `slugifyStr` 归一（中文保留、拉丁文小写连字符）
- 分类索引页 `/categories/` 列出全部分类
- 文章卡片与详情页自动显示分类链接（点击跳转到对应分类页）
- 一篇文章仅属于一个分类（区别于多标签 `tags`）；未设置 `category` 的文章不进入任何分类
- 分类页复用 `posts.perPage` 分页，支持多语言镜像路由（`/en/categories/...`）
- 可通过 `features.showCategories: false` 关闭分类功能（导航入口与页面同步移除，sitemap 过滤）
