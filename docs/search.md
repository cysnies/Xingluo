# 搜索

星罗集成 [Pagefind](https://pagefind.app/) 提供静态全文搜索，按语言分索引，支持 View Transitions 状态保持。

## 启用

通过 `features.search` 配置：

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

设为 `false` 时搜索页 `Astro.rewrite` 到 404，不生成搜索 UI。

## 工作原理

### 索引生成

构建流程的第三步 `pagefind --site dist` 扫描 `dist/` 目录：

- 仅索引带 `data-pagefind-body` 属性的页面
- 按语言自动分索引（`zh-cn` 与 `en` 各自独立）
- 索引输出到 `dist/pagefind/`

### 索引范围

文章详情页的 `<main>` 标记 `data-pagefind-body`，故仅文章正文被索引。其他页面（首页、列表、归档等）不进入搜索索引。

## 搜索 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) 实现搜索页：

- 加载 `@pagefind/default-ui` 提供搜索框与结果列表
- 通过 `getAssetPath("pagefind/")` 定位索引资源
- 全局样式覆盖 pagefind CSS 变量，映射到星罗主题（`--background`、`--foreground`、`--primary` 等）
- `transition:persist` 保持搜索状态跨导航

### 搜索流程

1. 用户在搜索框输入
2. Pagefind 在对应语言索引中匹配
3. 结果列表展示匹配文章（标题、摘要高亮）
4. `processTerm` 将带查询参数的搜索页地址写入 sessionStorage，供返回按钮回跳

## 来源回跳

搜索页与文章页的导航回跳机制：

- `Main.astro` 组件将来源页地址写入 sessionStorage 的 `backUrl`
- 文章页的 `BackButton.astro` 优先回跳 sessionStorage 的 `backUrl`，无则回首页
- 搜索页的 `processTerm` 写入带查询参数的地址，从文章页返回时恢复搜索状态

## 多语言搜索

Pagefind 按 `data-pagefind-body` 元素的语言属性分索引：

- `zh-cn` 页面（根目录）→ 中文索引
- `en` 页面（`/en/` 前缀）→ 英文索引

搜索时自动匹配当前页面语言对应的索引，中文页搜中文，英文页搜英文。

## 主题适配

Pagefind 默认 UI 有自己的 CSS 变量，星罗在 `SearchView.astro` 中用全局样式覆盖，映射到 shadcn 主题变量：

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

暗色模式下通过 `.dark` 选择器自动切换，与全站主题一致。

## 性能

- Pagefind 索引为静态文件，搜索在客户端完成，无服务端请求
- 索引按需加载（仅搜索时下载索引片段）
- `transition:persist` 避免导航时重复初始化搜索 UI
