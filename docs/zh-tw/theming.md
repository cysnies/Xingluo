# 主題與樣式

星羅採用 shadcn/ui new-york 風格元件與 OKLCH 色彩空間，基於 Tailwind CSS v4 構建。

## 樣式檔案結構

[`src/styles/`](../src/styles/)：

| 檔案             | 內容                                                  |
| ---------------- | ----------------------------------------------------- |
| `theme.css`      | shadcn 主題變數（OKLCH，亮色 `:root` + 暗色 `.dark`） |
| `global.css`     | Tailwind 入口、基礎層、自訂工具類、標註框主題         |
| `typography.css` | `.app-prose` 排版與程式碼區塊樣式                     |

## 主題變數

`theme.css` 使用 OKLCH 色彩空間定義語義化變數，亮色與暗色雙套：

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
  /* ... 暗色對應值 ... */
}
```

這些變數在 `global.css` 的 `@theme inline` 中對應為 Tailwind 權杖，可直接用 `bg-background`、`text-foreground`、`border-border` 等類名。

## Tailwind CSS v4

星羅使用 Tailwind v4，透過 `@tailwindcss/vite` 外掛整合（見 `astro.config.ts` 的 `vite.plugins`）。

### 關鍵設定（`global.css`）

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... 色彩對應 ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### 自訂工具類

- `max-w-app`：內容最大寬度（`--content-width: 72rem`）
- `app-layout`：應用佈局（min-height 100vh，flex 列佈局）

## 暗色模式

### FOUC 防護

`Layout.astro` 在 `<head>` 內聯同步指令碼（`is:inline`），在首屏渲染前設定主題：

```js
// 讀取 localStorage.theme，否則用 prefers-color-scheme
// 設定 html 的 data-theme 屬性與 .dark 類
```

避免重新整理時主題閃爍。

### 主題切換執行時

[`src/scripts/theme.ts`](../src/scripts/theme.ts)：

- `getPreferredTheme`：localStorage 優先，回退系統偏好
- `persist`：持久化到 localStorage
- `reflect`：同步 `data-theme` 屬性、`.dark` 類、`#theme-btn` 的 `aria-label`、`<meta name="theme-color">`
- 綁定 `#theme-btn` click 切換
- 適配 View Transitions：`astro:after-swap` 重綁、`astro:before-swap` 攜帶 theme-color
- 監聽系統 `prefers-color-scheme` 變化（僅當使用者未顯式選擇時跟隨）

### 評論與播放器主題同步

- giscus：透過 `postMessage({giscus:{setConfig:{theme}}})` 切換
- waline：`dark:"html.dark"` 選擇器自動跟隨
- twikoo：監聽 `.dark` 類變化重建（twikoo 不支援執行時切換）
- 詳見 [評論系統](./comments.md)

## 排版（.app-prose）

`typography.css` 的 `.app-prose` 基於 `@tailwindcss/typography` 的 `prose`，並做主題覆蓋：

- 連結主色（`--primary`）
- 行內程式碼背景（`--code`）
- 程式碼區塊雙主題（Shiki `--shiki-light-bg` / `--shiki-dark-bg`）
- diff / highlight / word 行高亮樣式
- blockquote、hr、img 樣式
- details / summary 折疊樣式
- 圖片 `role="button"` 燈箱游標
- 標題錨點 `scroll-margin`

文章正文容器使用 `<article class="app-prose">`。

## shadcn 元件

[`src/components/ui/`](../src/components/ui/) 提供 shadcn 風格元件：

| 元件                                                                                   | 說明                                                   |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `Button`                                                                               | `<a>` / `<button>` 自動切換，cva 變體（variant、size） |
| `Badge`                                                                                | 徽章                                                   |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Card 元件族                                            |
| `Input`                                                                                | 輸入框                                                 |
| `Separator`                                                                            | 分隔線                                                 |

變體設定使用 `class-variance-authority`，類名合併用 `cn`（`src/lib/utils.ts`，基於 `tailwind-merge` + `clsx`）。

## 圖示體系

星羅的圖示透過 astro-icon + Font Awesome 實作構建期內聯 SVG（sprite `<symbol>` 模式），**零執行時 JS、無字型網路請求**。

### 圖示對應（FA5）

| 用途         | 圖示名                                  |
| ------------ | --------------------------------------- |
| 搜尋         | `fa-solid:search`                       |
| 關閉         | `fa-solid:times`                        |
| 郵件         | `fa-solid:envelope`                     |
| 其餘 socials | `fa-brands:{name}`                      |
| x 社交       | `fa-brands:twitter`（FA5 無 x-twitter） |

### 社交圖示動態解析

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) 透過 `import.meta.glob` 按檔名收集 `src/assets/icons/socials/*.astro`，`getSocialIcon(name)` 按名稱解析。新增社交平臺只需在 `socials/` 下加圖示檔案。

## 自訂主題

修改 `src/styles/theme.css` 的 CSS 變數即可調整全站配色。例如改為藍色主色：

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

所有引用 `bg-primary`、`text-primary` 的元件自動跟隨。
