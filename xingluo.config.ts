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
    // 站点描述，用于 <meta name="description">、RSS 与 SEO
    description: "基于 Astro 与 shadcn 的现代化博客 CMS",
    // 默认作者名，文章 frontmatter 未指定 author 时回退此值
    author: "白鼠 Cysnies",
    // 作者主页链接（可选），注入 JSON-LD 结构化数据的 author.url
    profile: "https://xingluo.tcea.top/",
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
    // 搜索方案："flexsearch" 或 false（关闭搜索）
    search: "flexsearch",
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
    // Google Fonts 镜像源配置：构建时从镜像源下载字体，
    // 适用于无法直接访问 Google Fonts 官方源的环境。
    // googleFontsMirror: {
    //   enabled: true,
    //   url: "https://fonts.googleapis.cn",
    // },
    // 动效与动画配置（默认全部开启，关闭对应项可禁用）
    // animations: {
    //   spotlightCard: true,      // PostCard 悬停光晕
    //   cardTilt: true,           // PostCard 悬停倾斜视差
    //   scrollReveal: true,       // 列表滚入渐现
    //   navIndicator: true,       // 导航指示条滑动
    //   mobileMenuTransition: true, // 移动端菜单动画
    //   buttonPress: true,        // 按钮按压反馈
    //   themeTransition: true,    // 主题切换过渡
    //   textReveal: true,         // 标题渐入动效
    //   tocSmooth: true,          // TOC 平滑过渡
    //   backToTopEnhanced: true,  // 返回顶部增强
    //   adjacentPostGlow: true,   // 文章导航发光
    //   searchResultAnim: true,   // 搜索页结果动画
    // },
  },
  // 社交链接：显示在首页社交区与页脚。
  // name 对应 src/assets/icons/socials/ 下的图标文件名（不含 .astro），
  // 内置支持：github / x / mail / facebook / telegram / weibo 等。
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
