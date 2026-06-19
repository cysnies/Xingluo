# 主题与样式

星罗采用 shadcn/ui new-york 风格组件与 OKLCH 色彩空间，基于 Tailwind CSS v4 构建。

## 样式文件结构

[`src/styles/`](../src/styles/)：

| 文件             | 内容                                                  |
| ---------------- | ----------------------------------------------------- |
| `theme.css`      | shadcn 主题变量（OKLCH，亮色 `:root` + 暗色 `.dark`） |
| `global.css`     | Tailwind 入口、基础层、自定义工具类、标注框主题       |
| `typography.css` | `.app-prose` 排版与代码块样式                         |

## 主题变量

`theme.css` 使用 OKLCH 色彩空间定义语义化变量，亮色与暗色双套：

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  /* ... secondary、muted、accent、destructive、border、input、ring ... */
  --code: oklch(0.97 0 0);
  --content-width: 72rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
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

- `max-w-app`：内容最大宽度（`--content-width: 72rem`）
- `app-layout`：应用布局（min-height 100vh，flex 列布局）

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

## 自定义主题

修改 `src/styles/theme.css` 的 CSS 变量即可调整全站配色。例如改为蓝色主色：

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

所有引用 `bg-primary`、`text-primary` 的组件自动跟随。
