# 搜索

星罗集成 [Flexsearch](https://github.com/nextapps-de/flexsearch) 提供客户端全文搜索，按语言分索引，支持 View Transitions 状态保持。

## 启用

通过 `features.search` 配置：

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

设为 `false` 时搜索页 `Astro.rewrite` 到 404，不生成搜索 UI。

## 工作原理

### 索引生成

构建流程的第三步 `node scripts/generateSearchIndex.mjs` 扫描 `dist/` 目录中的 HTML 文件：

- 解析页面内容，提取文章正文
- 按语言自动分索引（`zh-cn` 与 `en` 各自独立）
- 索引输出到 `dist/search/`

### 索引范围

构建脚本会解析文章详情页的 `<main>` 内容，仅提取文章正文构建索引。其他页面（首页、列表、归档等）不进入搜索索引。

## 搜索 UI

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) 实现搜索页：

- 使用 Flexsearch 客户端索引，在浏览器中完成搜索匹配
- 通过 `getAssetPath("search/")` 定位索引资源
- 使用 shadcn 主题变量（`--background`、`--foreground`、`--primary` 等）设置搜索框与结果列表样式
- `transition:persist` 保持搜索状态跨导航

### 搜索流程

1. 用户在搜索框输入
2. Flexsearch 在对应语言索引中匹配
3. 结果列表展示匹配文章（标题、发布时间与更新时间、分类徽标、标签、匹配正文片段）
4. `processTerm` 将带查询参数的搜索页地址写入 sessionStorage，供返回按钮回跳

## 来源回跳

搜索页与文章页的导航回跳机制：

- `Main.astro` 组件将来源页地址写入 sessionStorage 的 `backUrl`
- 文章页的 `BackButton.astro` 优先回跳 sessionStorage 的 `backUrl`，无则回首页
- 搜索页的 `processTerm` 写入带查询参数的地址，从文章页返回时恢复搜索状态

## 多语言搜索

Flexsearch 按页面语言分索引：

- `zh-cn` 页面（根目录）→ 中文索引
- `en` 页面（`/en/` 前缀）→ 英文索引

搜索时自动匹配当前页面语言对应的索引，中文页搜中文，英文页搜英文。

## 主题适配

Flexsearch 搜索 UI 使用 shadcn 主题变量，在 `SearchView.astro` 中定义搜索框与结果列表的样式：

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

暗色模式下通过 `.dark` 选择器自动切换，与全站主题一致。

## 性能

- Flexsearch 索引为静态文件，搜索在客户端完成，无服务端请求
- 索引按需加载（仅搜索时下载索引片段）
- `transition:persist` 避免导航时重复初始化搜索 UI
