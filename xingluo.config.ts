import { defineXingluoConfig } from "./src/types/config";

/**
 * 星罗项目用户配置
 * 修改此文件即可自定义站点信息与功能开关
 */
export default defineXingluoConfig({
  site: {
    url: "https://xingluo.example.com/",
    title: "星罗",
    description: "基于 Astro 与 shadcn 的现代化博客 CMS",
    author: "星罗",
    profile: "https://xingluo.example.com",
    ogImage: "default-og.jpg",
    lang: "zh-cn",
    timezone: "Asia/Shanghai",
    dir: "ltr",
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
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/xingluo/blog/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/xingluo/blog" },
    { name: "x", url: "https://x.com/xingluo" },
    { name: "mail", url: "mailto:hello@xingluo.example.com" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
    { name: "mail", url: "mailto:?subject=%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0&body=" },
  ],
});
