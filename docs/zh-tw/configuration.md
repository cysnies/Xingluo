# 設定指南

星羅的所有可設定項集中在根目錄的 [`xingluo.config.ts`](../xingluo.config.ts)。該檔案透過 `defineXingluoConfig` 提供完整型別約束，修改後即生效，無需改動原始碼。

## site 站點設定

```ts
site: {
  url: "https://xingluo.example.com/",  // 站點 URL，用於絕對連結、RSS、sitemap
  title: "星羅",                          // 站點標題
  description: "基於 Astro 與 shadcn 的現代化部落格 CMS",
  author: "星羅",                         // 預設作者名
  profile: "https://xingluo.example.com", // 作者主頁連結（用於 JSON-LD）
  ogImage: "default-og.jpg",              // 預設 OG 圖（位於 public 目錄）
  lang: "zh-cn",                          // 預設語言
  timezone: "Asia/Shanghai",              // 時區（文章時間顯示）
  dir: "ltr",                             // 文字方向：ltr | rtl
  googleVerification: "",                 // Google Search Console 驗證值（也可用環境變數）
}
```

| 欄位                 | 預設值           | 說明                                                                   |
| -------------------- | ---------------- | ---------------------------------------------------------------------- |
| `url`                | 必填             | 站點根 URL，必須以 `/` 結尾                                            |
| `title`              | 必填             | 站點標題，用於 `<title>` 與 OG                                         |
| `description`        | 必填             | 站點描述，用於 meta 與 RSS                                             |
| `author`             | 必填             | 預設作者，文章 frontmatter 未指定時回退此值                            |
| `profile`            | —                | 作者主頁，注入 JSON-LD `author.url`                                    |
| `ogImage`            | `default-og.jpg` | 預設 OG 圖檔名，位於 `public/`                                         |
| `lang`               | 必填             | 預設語言程式碼，需與 `astro.config.ts` 的 `i18n.defaultLocale` 一致    |
| `timezone`           | `Asia/Shanghai`  | dayjs 時區，影響文章日期顯示                                           |
| `dir`                | `ltr`            | 文字方向                                                               |
| `googleVerification` | —                | Google 驗證值；也可透過環境變數 `PUBLIC_GOOGLE_SITE_VERIFICATION` 注入 |

## posts 文章設定

```ts
posts: {
  perPage: 8,              // 列表頁每頁文章數
  perIndex: 5,             // 首頁顯示文章數
  scheduledPostMargin: 900000, // 定時發佈容差（毫秒），15 分鐘
}
```

- `perPage`：`/posts/[...page]` 與 `/tags/[tag]/[...page]` 的分頁大小
- `perIndex`：首頁"最新文章"區塊展示的文章數
- `scheduledPostMargin`：未來文章在此時間視窗內視為已發佈（生產環境生效，開發環境全部可見）

## features 功能開關

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "flexsearch",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| 欄位               | 預設值             | 說明                                                                 |
| ------------------ | ------------------ | -------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | 是否啟用亮/暗模式切換                                                |
| `dynamicOgImage`   | `true`             | 是否動態生成 OG 圖（satori + sharp）                                 |
| `showArchives`     | `true`             | 是否顯示歸檔頁（關閉時 sitemap 同步過濾）                            |
| `showCategories`   | `true`             | 是否顯示分類頁與導航入口（關閉時 sitemap 同步過濾）                  |
| `showBackButton`   | `true`             | 文章頁是否顯示返回按鈕                                               |
| `editPost.enabled` | `false`            | 是否顯示"編輯此頁"連結                                               |
| `editPost.url`     | `""`               | 編輯連結字首，會拼接文章相對原始檔路徑                               |
| `search`           | `"flexsearch"`     | 搜尋方案：`"flexsearch"` 或 `false`                                  |
| `mdx`              | `true`             | 是否啟用 MDX 解析與渲染（詳見 [內容創作](./content.md)）             |
| `comments`         | `{provider:false}` | 評論系統設定（詳見 [評論系統](./comments.md)）                       |
| `players.aplayer`  | `false`            | 是否啟用 APlayer 音樂播放器（詳見 [媒體播放器](./media-players.md)） |
| `players.dplayer`  | `false`            | 是否啟用 DPlayer 影片播放器                                          |

### editPost 編輯連結

`editPost.url` 是倉庫編輯 URL 字首，星羅會拼接文章的相對原始檔路徑（`src/content/posts/...`）。例如設定：

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

文章 `src/content/posts/welcome.md` 會生成連結 `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`。

## socials 社群連結

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`：圖示名稱，對應 `src/assets/icons/socials/{name}.astro`。內建支援：`github`、`x`、`mail`、`facebook`、`telegram`、`weibo`
- `url`：連結地址，`mailto:` 協定用於郵件
- `linkTitle`：可選無障礙標題，省略時按名稱自動生成

> 新增社群平臺：在 `src/assets/icons/socials/` 下新建同名 `.astro` 圖示元件即可，`src/lib/socialIcons.ts` 透過 `import.meta.glob` 自動收集。

## shareLinks 分享連結

```ts
shareLinks: [
  { name: "x", url: "https://x.com/intent/post?url=" },
  { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
  { name: "telegram", url: "https://t.me/share/url?url=" },
  { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
  { name: "mail", url: "mailto:?subject=...&body=" },
];
```

文章頁底部會展示這些分享入口，`url` 為分享 URL 字首，星羅會拼接當前文章的絕對 URL。`name` 同樣對應 `src/assets/icons/socials/` 下的圖示。

## 環境變數

透過 `astro.config.ts` 的 `env.schema` 宣告：

| 變數                              | 存取級別        | 說明                               |
| --------------------------------- | --------------- | ---------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Google Search Console 驗證值，可選 |

設定方式（PowerShell）：

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

該值會注入到 `config.site.googleVerification`，輸出為 `<meta name="google-site-verification">`。

## 完整設定範例

見 [`xingluo.config.ts`](../xingluo.config.ts)，其中 `features.comments` 與 `features.players` 段包含 giscus / twikoo / waline 的註釋範例，取消註釋並填入真實值即可啟用。
