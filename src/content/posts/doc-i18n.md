---
title: "国际化"
pubDatetime: 2026-06-20T06:00:00+08:00
description: "星罗国际化体系详解，包括多语言路由策略、UI 文案本地化、内容级翻译与新增语言方法。"
tags:
  - 文档
  - 国际化
category: "文档"
translationKey: doc-i18n
---

星罗内置中英双语 UI 支持，采用 `prefixDefaultLocale: false` 路由策略，默认语言无 URL 前缀。

## 路由策略

Astro 的 `i18n` 配置（见 `astro.config.ts`）：

```ts
i18n: {
  locales: ["zh-cn", "en"],
  defaultLocale: "zh-cn",
  routing: { prefixDefaultLocale: false },
}
```

**关键：`prefixDefaultLocale: false` 不会自动生成本地化页面副本**，需手动维护 `[locale]/` 镜像路由。

星罗的落地方式：

- **根目录页面** = 默认语言（`zh-cn`），URL 无前缀，如 `/posts/welcome/`
- **`src/pages/[locale]/`** 下镜像全部页面，`getStaticPaths` 用 `getLocaleParams()` 仅生成非默认语言，如 `/en/posts/welcome/`
- 镜像页面同样是薄包装，渲染逻辑复用同一 View 组件

```
/                      → 首页（zh-cn）
/en/                   → 首页（en）
/posts/welcome/        → 文章（zh-cn）
/en/posts/welcome/     → 文章（en）
```

## locale 解析

View 组件内部使用 `Astro.currentLocale` 自动解析：

- 根目录页 → `zh-cn`
- `[locale]` 段页 → `en`（或其他非默认语言）

无需在组件层判断路径，`useTranslations(locale)` 直接获取对应语言文案。

## i18n 模块结构

[`src/i18n/`](../src/i18n/)：

| 文件             | 职责                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`       | `import.meta.glob("./lang/*.ts", {eager:true})` 加载语言；导出 `DEFAULT_LOCALE`、`LOCALES`、`useTranslations(locale)`、`tplStr` |
| `types.ts`       | `UIStrings` 完整接口（所有需本地化的字符串）                                                                                    |
| `routing.ts`     | `getLocalePrefix`、`withLocale(path, locale)`、`parseLocaleFromPath(pathname)`                                                  |
| `staticPaths.ts` | `NON_DEFAULT_LOCALES`、`getLocaleParams()`                                                                                      |
| `format.ts`      | `tplStr(template, vars)` — `{{key}}` 占位符替换                                                                                 |
| `lang/zh-cn.ts`  | 简体中文（默认语言）                                                                                                            |
| `lang/en.ts`     | 英文                                                                                                                            |

## UIStrings 结构

`UIStrings` 接口定义所有需本地化的界面字符串，分组组织：

- `nav`：导航（home/posts/tags/about/archives/search/rss）
- `post`：文章（日期、分享、标签、返回、编辑、目录、代码复制、图片灯箱等）
- `pagination`：分页
- `home`：首页（社交链接、精选、最新）
- `archives`：归档（计数、月份）
- `footer`：页脚（版权）
- `pages`：各页面标题与描述
- `a11y`：无障碍标签
- `languageSwitcher`：语言切换器
- `notFound`：404
- `comments`：评论区

## 模板字符串

带占位符的文案用 `{{key}}`，配合 `tplStr` 替换：

```ts
import { tplStr } from "@/i18n";

// archives.postCount = "{{count}} 篇"
tplStr(t.archives.postCount, { count: 5 }); // "5 篇"
```

## SEO 多语言声明

`Layout.astro` 的 head 输出：

- 各语言 `<link rel="alternate" hreflang="..." href="...">`
- `x-default` 指向默认语言
- sitemap 集成启用 i18n 配置，自动生成 hreflang
- 非默认语言文章的 canonical 指向默认语言原文（避免重复内容判定，详见 [SEO](./doc-seo.md)）

## 新增语言

以新增日语 `ja` 为例：

1. **`astro.config.ts`** 的 `i18n.locales` 与 sitemap `i18n.locales` 添加 `"ja"` 与 `"ja-JP"` 映射
2. **`src/i18n/lang/`** 创建 `ja.ts`，导出完整的 `UIStrings`（可复制 `en.ts` 翻译）
3. **`src/i18n/staticPaths.ts`** 的 `NON_DEFAULT_LOCALES` 自动包含 `ja`（基于 `LOCALES` 计算）
4. **`src/pages/[locale]/`** 镜像页面自动生成 `ja` 版本（`getLocaleParams` 已覆盖）
5. **语言切换器**：在 `zh-cn.ts` 与 `en.ts` 的 `languageSwitcher.names` 添加 `"ja": "日本語"`

## 内容级翻译

星罗支持文章内容的多语言翻译，通过 `locale` 与 `translationKey` 两个 frontmatter 字段实现。

### 基本用法

1. **默认语言文章**放在 `src/content/posts/<slug>.md`，设置 `translationKey` 作为分组标识：

```yaml
# src/content/posts/welcome.md
---
title: "欢迎来到星罗"
locale: zh-cn
translationKey: welcome-to-xingluo
tags: [公告, Astro]
---
```

2. **译文**放在语言子目录 `src/content/posts/en/<slug>.md`，使用相同的 `translationKey`：

```yaml
# src/content/posts/en/welcome.md
---
title: "Welcome to Xingluo"
locale: en
translationKey: welcome-to-xingluo
tags: [announcement, Astro]
---
```

### 目录结构

```
src/content/posts/
├── welcome.md              # 默认语言（zh-cn）
├── en/
│   └── welcome.md          # 英文译文
├── ja/
│   └── welcome.md          # 日文译文
└── another-post.md         # 独立文章（未设置 translationKey）
```

- 语言子目录名需与 `astro.config.ts` 的 `i18n.locales` 中的语言代码一致
- 语言子目录会被路由层过滤，不进入 URL slug（如 `/posts/welcome/` 而非 `/posts/en/welcome/`）
- 无 `translationKey` 的文章各自独立，不在任何语言间关联

### 路由行为

| 场景                           | 行为                                                               |
| ------------------------------ | ------------------------------------------------------------------ |
| 默认语言访问 `zh-cn` 文章      | 渲染默认语言原文                                                   |
| 非默认语言访问**有译文的**文章 | 渲染对应语言的译文                                                 |
| 非默认语言访问**无译文的**文章 | 回退渲染默认语言原文（内容一致，non-duplicate canonical 保障 SEO） |

### 列表去重

列表页（首页、文章列表、标签、归档、RSS）使用 `getPostsForLocale` 按语言选取代表文章：每组译文只显示一条对应语言的卡片，避免同主题译文重复出现。

### canonical 与 SEO

- **有独立译文**：canonical 指向译文自身 URL，搜索引擎可独立索引
- **无译文（回退）**：canonical 指向默认语言原文，避免重复内容惩罚
- hreflang 声明覆盖全部语言，搜索引擎理解各语言版本关系

详见 [SEO](./doc-seo.md)。
