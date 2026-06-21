# 配置指南

星罗的所有可配置项集中在根目录的 [`xingluo.config.ts`](../xingluo.config.ts)。该文件通过 `defineXingluoConfig` 提供完整类型约束，修改后即生效，无需改动源码。

## site 站点配置

```ts
site: {
  url: "https://xingluo.example.com/",  // 站点 URL，用于绝对链接、RSS、sitemap
  title: "星罗",                          // 站点标题
  description: "基于 Astro 与 shadcn 的现代化博客 CMS",
  author: "星罗",                         // 默认作者名
  profile: "https://xingluo.example.com", // 作者主页链接（用于 JSON-LD）
  ogImage: "default-og.jpg",              // 默认 OG 图（位于 public 目录）
  lang: "zh-cn",                          // 默认语言
  timezone: "Asia/Shanghai",              // 时区（文章时间显示）
  dir: "ltr",                             // 文字方向：ltr | rtl
  googleVerification: "",                 // Google Search Console 验证值（也可用环境变量）
  favicon: {                              // 站点图标，文件位于 public 目录
    svg: "favicon.svg",                   // 主图标（现代浏览器）
    // ico: "favicon.ico",               // 兼容旧浏览器
    // appleTouchIcon: "apple-touch-icon.png", // iOS 主屏图标
    // manifest: "site.webmanifest",     // PWA 清单
  },
}
```

| 字段                     | 默认值           | 说明                                                                   |
| ------------------------ | ---------------- | ---------------------------------------------------------------------- |
| `url`                    | 必填             | 站点根 URL，必须以 `/` 结尾                                            |
| `title`                  | 必填             | 站点标题，用于 `<title>` 与 OG                                         |
| `description`            | 必填             | 站点描述，用于 meta 与 RSS                                             |
| `author`                 | 必填             | 默认作者，文章 frontmatter 未指定时回退此值                            |
| `profile`                | —                | 作者主页，注入 JSON-LD `author.url`                                    |
| `ogImage`                | `default-og.jpg` | 默认 OG 图文件名，位于 `public/`                                       |
| `lang`                   | 必填             | 默认语言代码，需与 `astro.config.ts` 的 `i18n.defaultLocale` 一致      |
| `timezone`               | `Asia/Shanghai`  | dayjs 时区，影响文章日期显示                                           |
| `dir`                    | `ltr`            | 文字方向                                                               |
| `googleVerification`     | —                | Google 验证值；也可通过环境变量 `PUBLIC_GOOGLE_SITE_VERIFICATION` 注入 |
| `favicon.svg`            | `favicon.svg`    | 主图标（SVG），现代浏览器首选                                          |
| `favicon.ico`            | —                | ICO 格式图标，兼容旧浏览器                                             |
| `favicon.appleTouchIcon` | —                | Apple Touch Icon，iOS 主屏图标（推荐 180×180 PNG）                     |
| `favicon.manifest`       | —                | Web App Manifest 文件名，Android/PWA 元数据                            |

## posts 文章配置

```ts
posts: {
  perPage: 8,              // 列表页每页文章数
  perIndex: 5,             // 首页显示文章数
  scheduledPostMargin: 900000, // 定时发布容差（毫秒），15 分钟
}
```

- `perPage`：`/posts/[...page]` 与 `/tags/[tag]/[...page]` 的分页大小
- `perIndex`：首页"最新文章"区块展示的文章数
- `scheduledPostMargin`：未来文章在此时间窗口内视为已发布（生产环境生效，开发环境全部可见）

## features 功能开关

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "pagefind",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| 字段               | 默认值             | 说明                                                                 |
| ------------------ | ------------------ | -------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | 是否启用亮/暗模式切换                                                |
| `dynamicOgImage`   | `true`             | 是否动态生成 OG 图（satori + sharp）                                 |
| `showArchives`     | `true`             | 是否显示归档页（关闭时 sitemap 同步过滤）                            |
| `showCategories`   | `true`             | 是否显示分类页与导航入口（关闭时 sitemap 同步过滤）                  |
| `showBackButton`   | `true`             | 文章页是否显示返回按钮                                               |
| `editPost.enabled` | `false`            | 是否显示"编辑此页"链接                                               |
| `editPost.url`     | `""`               | 编辑链接前缀，会拼接文章相对源文件路径                               |
| `search`           | `"pagefind"`       | 搜索方案：`"pagefind"` 或 `false`                                    |
| `mdx`              | `true`             | 是否启用 MDX 解析与渲染（详见 [内容创作](./content.md)）             |
| `comments`         | `{provider:false}` | 评论系统配置（详见 [评论系统](./comments.md)）                       |
| `players.aplayer`  | `false`            | 是否启用 APlayer 音乐播放器（详见 [媒体播放器](./media-players.md)） |
| `players.dplayer`  | `false`            | 是否启用 DPlayer 视频播放器                                          |

### editPost 编辑链接

`editPost.url` 是仓库编辑 URL 前缀，星罗会拼接文章的相对源文件路径（`src/content/posts/...`）。例如配置：

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

文章 `src/content/posts/welcome.md` 会生成链接 `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`。

## socials 社交链接

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`：图标名称，对应 `src/assets/icons/socials/{name}.astro`。内置支持：`github`、`x`、`mail`、`facebook`、`telegram`、`weibo`
- `url`：链接地址，`mailto:` 协议用于邮件
- `linkTitle`：可选无障碍标题，省略时按名称自动生成

> 新增社交平台：在 `src/assets/icons/socials/` 下新建同名 `.astro` 图标组件即可，`src/lib/socialIcons.ts` 通过 `import.meta.glob` 自动收集。

## shareLinks 分享链接

```ts
shareLinks: [
  { name: "x", url: "https://x.com/intent/post?url=" },
  { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
  { name: "telegram", url: "https://t.me/share/url?url=" },
  { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
  { name: "mail", url: "mailto:?subject=...&body=" },
];
```

文章页底部会展示这些分享入口，`url` 为分享 URL 前缀，星罗会拼接当前文章的绝对 URL。`name` 同样对应 `src/assets/icons/socials/` 下的图标。

## 环境变量

通过 `astro.config.ts` 的 `env.schema` 声明：

| 变量                              | 访问级别        | 说明                               |
| --------------------------------- | --------------- | ---------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Google Search Console 验证值，可选 |

设置方式（PowerShell）：

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

该值会注入到 `config.site.googleVerification`，输出为 `<meta name="google-site-verification">`。

## 完整配置示例

见 [`xingluo.config.ts`](../xingluo.config.ts)，其中 `features.comments` 与 `features.players` 段包含 giscus / twikoo / waline 的注释示例，取消注释并填入真实值即可启用。
