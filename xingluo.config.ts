import { defineXingluoConfig } from "./src/types/config";

/**
 * 星罗项目用户配置
 * 修改此文件即可自定义站点信息与功能开关
 */
export default defineXingluoConfig({
  site: {
    url: "https://xingluo.tcea.top/",
    title: "星罗",
    description: "基于 Astro 与 shadcn 的现代化博客 CMS",
    author: "白鼠 Cysnies",
    profile: "https://xingluo.tcea.top/",
    ogImage: "default-og.jpg",
    lang: "zh-cn",
    timezone: "Asia/Shanghai",
    dir: "ltr",
    // 站点图标配置，文件位于 public 目录，省略时回退到 favicon.svg
    favicon: {
      svg: "favicon.svg",
      // ico: "favicon.ico",
      // appleTouchIcon: "apple-touch-icon.png",
      // manifest: "site.webmanifest",
    },
  },
  posts: {
    perPage: 8,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    // 是否显示分类页与导航入口（文章通过 frontmatter 的 category 字段归类）
    showCategories: true,
    showBackButton: true,
    // 是否在文章卡片中展示文章头图（文章未配置头图时不显示）
    showPostCardHero: true,
    // 移动端是否在文章卡片中展示文章头图，关闭可防止头图与文字挤在一起阻碍阅读
    showPostCardHeroMobile: false,
    // 是否在文章详情页中展示文章头图（文章未配置头图时不显示）
    showPostDetailHero: true,
    editPost: {
      enabled: true,
      url: "https://github.com/cysnies/Xingluo/edit/main/",
    },
    search: "pagefind",
    // 是否启用 MDX 解析与渲染（关闭后仅收集 .md，不加载 mdx 集成）
    mdx: true,
    // 评论系统配置：三选一或关闭。provider 为某值时需提供对应子配置。
    comments: {
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
      aplayer: false,
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
    //   buttonRipple: true,       // 按钮点击涟漪
    //   buttonPress: true,        // 按钮按压反馈
    //   themeTransition: true,    // 主题切换过渡
    //   textReveal: true,         // 标题渐入动效
    //   tocSmooth: true,          // TOC 平滑过渡
    //   backToTopEnhanced: true,  // 返回顶部增强
    //   adjacentPostGlow: true,   // 文章导航发光
    //   noiseTexture: false,      // 噪点纹理（已移除）
    //   tagMagnet: false,         // 标签磁吸（已移除）
    //   searchResultAnim: true,   // 搜索页结果动画
    // },
  },
  socials: [
    { name: "github", url: "https://github.com/cysnies/Xingluo" },
    { name: "x", url: "https://x.com/Cysnies" },
    { name: "mail", url: "mailto:official@tcea.top" },
  ],
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
