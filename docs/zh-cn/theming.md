# 主题与样式

星罗采用 shadcn/ui 风格组件与语义化 CSS 变量（默认 Zinc 基色 + new-york 圆角），基于 Tailwind CSS v4 构建。色值以官方 themes 注册表 HSL 为准。

## 样式文件结构

[`src/styles/`](../src/styles/)：

| 文件             | 内容                                              |
| ---------------- | ------------------------------------------------- |
| `theme.css`      | 默认 Zinc 主题变量（亮色 `:root` + 暗色 `.dark`） |
| `global.css`     | Tailwind 入口、基础层、自定义工具类、标注框主题   |
| `typography.css` | `.app-prose` 排版（文章/关于页按需加载）          |
| `palettes.css`   | 基色 `data-palette` + 品牌强调色 `data-accent`    |

## 主题变量

`theme.css` 以 **HSL 语义令牌**定义默认 Zinc 主题（亮色 `:root` + 暗色 `.dark`）。也可自行改成 OKLCH 等，只要保持变量名稳定：

```css
:root {
  --radius: 0.625rem;
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --primary: hsl(240 5.9% 10%);
  /* ... secondary、muted、accent（表面 hover 底）、border、ring ... */
  --code: hsl(240 4.8% 95.9%);
  --content-width: 72rem;
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  /* ... 暗色对应值 ... */
}
```

这些变量在 `global.css` 的 `@theme inline` 中映射为 Tailwind 令牌，可直接用 `bg-background`、`text-foreground`、`border-border` 等类名。

## Tailwind CSS v4

星罗使用 Tailwind v4，通过 `@tailwindcss/vite` 插件集成（见 `astro.config.ts` 的 `vite.plugins`）。

### 关键配置（`global.css`）

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... 颜色映射 ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### 自定义工具类

- `max-w-app`：壳层最大宽度（`--content-width: 72rem`）
- `max-w-prose-app`：正文舒适行宽（`--prose-width: 42rem`）
- `app-layout`：应用布局（min-height 100vh，flex 列布局）

正文排版见 `typography.css` 的 `.app-prose`（字号阶梯、窄屏代码块/图片、舒适行宽）。字体切换见 [字体配置](./fonts.md)。

## 暗色模式

### FOUC 防护

`Layout.astro` 在 `<head>` 内联同步脚本（`is:inline`），在首屏渲染前设置主题：

```js
// 读取 localStorage.theme，否则用 prefers-color-scheme
// 设置 html 的 data-theme 属性与 .dark 类
```

避免刷新时主题闪烁。

### 主题切换运行时

[`src/scripts/theme.ts`](../src/scripts/theme.ts)：

- `getPreferredTheme`：localStorage 优先，回退系统偏好
- `persist`：持久化到 localStorage
- `reflect`：同步 `data-theme` 属性、`.dark` 类、`#theme-btn` 的 `aria-label`、`<meta name="theme-color">`
- 绑定 `#theme-btn` click 切换
- 适配 View Transitions：`astro:after-swap` 重绑、`astro:before-swap` 携带 theme-color
- 监听系统 `prefers-color-scheme` 变化（仅当用户未显式选择时跟随）

### 评论与播放器主题同步

- giscus：通过 `postMessage({giscus:{setConfig:{theme}}})` 切换
- waline：`dark:"html.dark"` 选择器自动跟随
- twikoo：监听 `.dark` 类变化重建（twikoo 不支持运行时切换）
- 详见 [评论系统](./comments.md)

## 排版（.app-prose）

`typography.css` 的 `.app-prose` 基于 `@tailwindcss/typography` 的 `prose`，并做主题覆盖：

- 链接主色（`--primary`）
- 行内代码背景（`--code`）
- 代码块双主题（Shiki `--shiki-light-bg` / `--shiki-dark-bg`）
- diff / highlight / word 行高亮样式
- blockquote、hr、img 样式
- details / summary 折叠样式
- 图片 `role="button"` 灯箱光标
- 标题锚点 `scroll-margin`

文章正文容器使用 `<article class="app-prose">`。

## shadcn 组件

[`src/components/ui/`](../src/components/ui/) 提供 shadcn 风格组件：

| 组件                                                                                   | 说明                                                   |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `Button`                                                                               | `<a>` / `<button>` 自动切换，cva 变体（variant、size） |
| `Badge`                                                                                | 徽章                                                   |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Card 组件族                                            |
| `Input`                                                                                | 输入框                                                 |
| `Separator`                                                                            | 分隔线                                                 |

变体配置使用 `class-variance-authority`，类名合并用 `cn`（`src/lib/utils.ts`，基于 `tailwind-merge` + `clsx`）。

## 图标体系

星罗的图标通过 astro-icon + Font Awesome 实现构建期内联 SVG（sprite `<symbol>` 模式），**零运行时 JS、无字体网络请求**。

### 图标映射（FA5）

| 用途         | 图标名                                  |
| ------------ | --------------------------------------- |
| 搜索         | `fa-solid:search`                       |
| 关闭         | `fa-solid:times`                        |
| 邮件         | `fa-solid:envelope`                     |
| 其余 socials | `fa-brands:{name}`                      |
| x 社交       | `fa-brands:twitter`（FA5 无 x-twitter） |

### 社交图标动态解析

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) 通过 `import.meta.glob` 按文件名收集 `src/assets/icons/socials/*.astro`，`getSocialIcon(name)` 按名称解析。新增社交平台只需在 `socials/` 下加图标文件。

## 色板与视觉风格（配置切换）

构建期通过 `html[data-palette]` / `html[data-accent]` / `html[data-ui-style]` 应用 CSS 变量，零运行时主题包。

在 `xingluo.config.ts`：

```ts
features: {
  palette: "zinc",       // 基色：zinc | slate | stone | gray | neutral
  accent: "none",        // 强调色：none | blue | green | rose | orange | violet
  uiStyle: "new-york",   // 或 "default"
}
```

| 配置      | 取值                                                  | 说明                                                              |
| --------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| `palette` | `zinc`（默认）`slate` `stone` `gray` `neutral`        | 完整表面令牌；改编自 shadcn themes 注册表                         |
| `accent`  | `none`（默认）`blue` `green` `rose` `orange` `violet` | **品牌强调色**（primary 族）；≠ 表面 token `--accent`（hover 底） |
| `uiStyle` | `new-york`（默认）                                    | 圆角 0.625rem，贴近官网                                           |
| `uiStyle` | `default`                                             | 圆角 0.5rem，略强阴影                                             |

参考：[shadcn Theming](https://ui.shadcn.com/docs/theming)、官方 themes JSON（`ui.shadcn.com/r/themes/{zinc,slate,stone,gray,neutral}.json`）、[v4 colors](https://v4.shadcn.com/colors)、[theme generator](https://ui.shadcn.com/themes)。实现：`theme.css` + `palettes.css`（借鉴 token，未整库照搬组件）。

## shadcn token 对齐

含 chart、sidebar、radius 阶梯。`components.json` 标注 style；不要对 Astro 主题直接 `npx shadcn add` React 组件。

## UI 原语示例

见文章「UI 组件示例」（`doc-ui-components`）。
