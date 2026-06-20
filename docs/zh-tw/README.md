# 星羅（Xingluo）文件

星羅是一個基於 [Astro](https://astro.build/) 與 [shadcn/ui](https://ui.shadcn.com/) 視覺風格構建的現代化部落格 CMS，以扁平、優雅的 shadcn 元件與 OKLCH 色彩體系提供更現代的視覺體驗，並原生整合評論系統、MDX 可選支援與音影片播放器。

## 文件導航

| 文件                             | 內容                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| [快速開始](./getting-started.md) | 環境要求、安裝、本機開發、構建與預覽                              |
| [設定指南](./configuration.md)   | `xingluo.config.ts` 全部設定項詳解                                |
| [內容創作](./content.md)         | 文章 frontmatter、Markdown/MDX 語法、程式碼區塊、標註框、內容增強 |
| [國際化](./i18n.md)              | 多語言路由策略、UI 文案、內容級翻譯、新增語言                     |
| [架構總覽](./architecture.md)    | 目錄結構、設定流、渲染流、構建流程                                |
| [主題與樣式](./theming.md)       | shadcn 主題變數、OKLCH、Tailwind v4、暗色模式                     |
| [評論系統](./comments.md)        | giscus / twikoo / waline 三選一設定與接入                         |
| [媒體播放器](./media-players.md) | APlayer / DPlayer 在 MD 與 MDX 中的使用                           |
| [SEO](./seo.md)                  | OG 圖、RSS、sitemap、hreflang、canonical、結構化資料              |
| [搜尋](./search.md)              | Pagefind 全文搜尋整合                                             |
| [部署](./deployment.md)          | 靜態託管、GitHub Pages、環境變數、Docker                          |

## 核心特性

- **極致效能**：Astro 靜態生成、構建期內聯 SVG 圖示（零執行階段 JS）、按需懶載入評論與播放器、構建後孤立資源清理
- **現代視覺**：shadcn/ui new-york 風格元件、OKLCH 色彩空間、平滑暗黑模式（FOUC 防護）
- **多語言**：UI 與內容級翻譯，`prefixDefaultLocale:false` 路由策略，hreflang 與 x-default SEO 宣告
- **內容增強**：MDX 可選支援、Shiki 雙主題程式碼凸顯、標註框（callouts）、目錄折疊、表格捲動
- **閱讀時長**：CJK 按字元數、拉丁文按單詞數智慧估算，卡片與詳情頁均顯示
- **相關文章**：按標籤相似度自動推薦
- **文章分類**：Frontmatter 指定分類，獨立分類頁與導航入口
- **黏性目錄側欄**：大螢幕文章頁右側黏性目錄，IntersectionObserver 捲動凸顯當前章節
- **評論系統**：giscus / twikoo / waline 三選一，主題自動跟隨，懶載入
- **媒體播放器**：APlayer 音樂播放器與 DPlayer 影片播放器，MD 圍欄與 MDX 元件雙入口
- **搜尋**：Pagefind 全文搜尋，按語言分索引，View Transitions 狀態保持
- **SEO**：動態 OG 圖（satori + sharp）、RSS、sitemap、JSON-LD 結構化資料（BlogPosting + BreadcrumbList）、canonical 規範化

## 技術棧

| 類別       | 技術                                                         |
| ---------- | ------------------------------------------------------------ |
| 框架       | Astro 6.x（靜態生成）                                        |
| 樣式       | Tailwind CSS v4、shadcn/ui 風格元件、@tailwindcss/typography |
| 圖示       | astro-icon + Font Awesome（構建期內聯）                      |
| 內容       | Astro Content Collections、MDX、remark/rehype 外掛鏈         |
| 程式碼凸顯 | Shiki（雙主題 + 標註轉換器）                                 |
| 搜尋       | Pagefind                                                     |
| OG 圖      | satori + sharp                                               |
| 評論       | giscus / twikoo / waline                                     |
| 播放器     | APlayer / DPlayer                                            |
| 日期       | dayjs（時區支援）                                            |
| 套件管理   | pnpm                                                         |
| 語言       | TypeScript（strict）                                         |

## 授權條款

AGPL-3.0
