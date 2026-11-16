import { defineXingluoConfig } from "./src/types/config";

/**
 * 星罗项目用户配置
 * 修改此文件即可自定义站点信息与功能开关
 */
export default defineXingluoConfig({
  site: {
    // 站点完整 URL，以 / 结尾，用于生成绝对链接、RSS、sitemap
    url: "https://xingluo.tcea.top/",
    // 站点标题，用于 <title> 与 Open Graph
    title: "星罗",
    // 英文等非默认语种可用拉丁品牌名
    titleByLocale: { en: "Xingluo" },
    // 导航栏品牌：text 纯文字 | image-text 图片+文字 | image 纯图片
    // 文字默认跟随当前语言的站点标题，也可设置 text / textByLocale
    navbarBrand: { mode: "text" },
    // navbarBrand: { mode: "image-text", src: "favicon.svg", text: "星罗" },
    // navbarBrand: { mode: "image", src: "favicon.svg", alt: "星罗" },
    // 站点描述，用于 <meta name="description">、RSS 与 SEO
    description: "基于 Astro 与 shadcn 的现代化博客 CMS",
    descriptionByLocale: {
      en: "A modern blog CMS built with Astro and shadcn",
    },
    // 默认作者名，文章 frontmatter 未指定 author 时回退此值
    author: "白鼠 Cysnies",
    // 作者主页链接（可选），注入 JSON-LD 结构化数据的 author.url
    profile: "https://xingluo.tcea.top/",
    // 首页头像：设为 false 可隐藏；图片路径相对 public，也可使用 HTTPS URL
    avatar: {
      src: "favicon.svg",
      alt: "Xingluo Logo",
      // square 正方形 | rounded 圆角矩形 | circle 圆形
      shape: "circle",
    },
    // 默认 OG 图文件名（位于 public 目录），文章未配置 ogImage 时使用
    ogImage: "default-og.jpg",
    // 默认语言代码，需与 astro.config.ts 的 i18n.defaultLocale 一致
    lang: "zh-cn",
    // 时区，影响文章日期显示（如 Asia/Shanghai、America/New_York）
    timezone: "Asia/Shanghai",
    // 文字方向：ltr（从左到右）| rtl（从右到左，如阿拉伯语）
    dir: "ltr",
    // 站点图标配置，文件位于 public 目录，省略时回退到 favicon.svg
    favicon: {
      svg: "favicon.svg",
      // ico: "favicon.ico",              // 传统 ICO 格式，兼容旧浏览器
      // appleTouchIcon: "apple-touch-icon.png", // iOS 添加到主屏幕图标，推荐 180x180
      // manifest: "site.webmanifest",    // Web App Manifest 文件路径
    },
  },
  posts: {
    // 列表页每页文章数（/posts/、/tags/[tag]/ 等分页）
    perPage: 8,
    // 首页"最新文章"区块展示的文章数
    perIndex: 5,
    // 定时发布容差（毫秒）：未来文章在此时间窗口内视为已发布
    // 默认 15 分钟，适用于 CI 构建延迟导致的发布时间偏差
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    // 是否启用亮色/暗色模式切换按钮
    lightAndDarkMode: true,
    // 是否动态生成 OG 图（基于 satori + sharp），关闭时使用 site.ogImage
    dynamicOgImage: true,
    // 是否显示归档页（关闭时 /archives/ 路由 Astro.rewrite 到 404）
    showArchives: true,
    // 是否启用 View Transitions（ClientRouter）；false 可略减全局 JS
    // viewTransitions: true,
    // 是否显示分类页与导航入口（文章通过 frontmatter 的 category 字段归类）
    showCategories: true,
    // 文章详情页是否显示返回按钮
    showBackButton: true,
    // 是否在首页展示社交链接
    showHomeSocials: true,
    // 是否在页脚展示社交按钮
    showFooterSocials: true,
    // 是否在文章卡片中展示文章头图（文章未配置头图时不显示）
    showPostCardHero: true,
    // 移动端是否在文章卡片中展示文章头图，关闭可防止头图与文字挤在一起阻碍阅读
    showPostCardHeroMobile: false,
    // 是否在文章详情页中展示文章头图（文章未配置头图时不显示）
    showPostDetailHero: true,
    // 是否在文章卡片中展示估算的阅读时间
    // showReadingTime: true,
    // 编辑文章链接配置：在文章详情页显示"在 GitHub 上编辑"链接
    editPost: {
      // 是否启用编辑链接
      enabled: true,
      // 编辑链接前缀，会拼接文章相对源文件路径
      url: "https://github.com/cysnies/Xingluo/edit/main/",
    },
    // 搜索方案："pagefind" 或 false（关闭搜索）
    search: "pagefind",
    // 是否启用 MDX 解析与渲染（关闭后仅收集 .md，不加载 mdx 集成）
    mdx: true,
    // 评论系统配置：三选一或关闭。provider 为某值时需提供对应子配置。
    comments: {
      // 评论系统提供者："giscus" | "twikoo" | "waline" | false（关闭）
      provider: false,
      // giscus 示例（需在 https://giscus.app 生成 repoId/categoryId）：
      // giscus: {
      //   repo: "owner/repo",
      //   repoId: "R_...",
      //   category: "Announcements",
      //   categoryId: "DIC_...",
      //   mapping: "pathname",
      //   reactionsEnabled: true,
      //   inputPosition: "bottom",
      //   loading: "lazy",
      // },
      // twikoo 示例（envId 为云环境 ID 或自托管服务完整 URL）：
      // twikoo: { envId: "https://your-twikoo.example.com", lang: "zh-CN" },
      // waline 示例：
      // waline: { serverURL: "https://waline.example.com", lang: "zh-CN" },
    },
    // 媒体播放器开关：在 md 中通过 ```aplayer / ```dplayer 围栏创建，
    // 在 mdx 中通过 import { APlayer, DPlayer } from "@/components/mdx" 使用。
    players: {
      // 是否启用 APlayer 音乐播放器
      aplayer: false,
      // 是否启用 DPlayer 视频播放器
      dplayer: false,
    },
    // 字体 CDN 镜像：默认已在 src/config.ts 开启（大陆友好）
    // - Google Fonts → https://fonts.googleapis.cn（配套 gstatic.cn）
    // - jsDelivr npm 字体（霞鹜等）→ https://cdn.npmmirror.com
    // 若部署环境可直连官方源，可显式关闭：
    // googleFontsMirror: {
    //   enabled: false,
    //   url: "https://fonts.googleapis.cn",
    // },
    /**
     * 构建启用的语言（须为已有 UI 语言子集）。
     * 省略则启用全部 UI 语言（演示多语言会显著增大产物）。
     * 个人博客建议只开实际用到的语言。
     */
    enabledLocales: ["zh-cn", "en"],
    /** 色板基色/强调色：zinc|slate|stone|gray|neutral 或 blue|green|rose|orange|violet */
    palette: "zinc",
    accent: "none",
    /** 视觉风格：new-york（默认）| default */
    uiStyle: "new-york",
    // 动效：默认已克制（见 src/config.ts）。需要装饰动效时再打开：
    // animations: {
    //   spotlightCard: true,
    //   cardTilt: true,
    //   scrollReveal: true,
    //   textReveal: true,
    //   backToTopEnhanced: true,
    //   adjacentPostGlow: true,
    //   searchResultAnim: true,
    // },
  },
  // 社交链接：显示在首页社交区与页脚。
  // name 对应 src/assets/icons/socials/ 下的图标文件名（不含 .astro），
  // 内置支持：github / x / mail / facebook / telegram / weibo 等。
  /**
   * 正文字体（CJK 友好，按需启用）
   * - family: 内置 id，见 src/fonts/catalog.ts
   *   system | lxgw-wenkai | lxgw-wenkai-lite | lxgw-wenkai-screen |
   *   source-han-sans | source-han-serif | inter | jetbrains-mono
   * - mode: fixed 固定全局字体 | default 全局默认且允许切换 | user 由读者自选
   * - 演示站固定使用霞鹜文楷 Lite
   * - system 使用系统字体，不拉网络字体
   * - 启用 CDN 字体时仅加载当前一项；可自备 /public/fonts/*.css 用 source: "local"
   * - 文档：docs/zh-cn/fonts.md
   */
  fonts: {
    mode: "fixed",
    family: "lxgw-wenkai-lite",
    // fonts: [{ id: "my-font", label: "自定义", family: "MyFont", stack: '"MyFont", sans-serif', source: "local", cssUrl: "/fonts/my-font.css", license: "OFL-1.1" }],
  },

  socials: [
    { name: "github", url: "https://github.com/cysnies/Xingluo" },
    { name: "x", url: "https://x.com/Cysnies" },
    { name: "mail", url: "mailto:official@tcea.top" },
  ],
  // 分享链接：文章详情页"分享这篇文章"区域展示的按钮
  // name 对应 src/assets/icons/socials/ 下的图标文件名（不含 .astro）
  // url 为分享目标的基础链接，实际分享时会自动拼接当前文章 URL
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
    {
      name: "mail",
      url: "mailto:?subject=%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0&body=",
    },
  ],
});
