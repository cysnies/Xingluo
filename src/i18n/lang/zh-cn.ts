import type { UIStrings } from "../types";

/** 简体中文（默认语言） */
const zhCn: UIStrings = {
  nav: {
    home: "首页",
    posts: "文章",
    tags: "标签",
    about: "关于",
    archives: "归档",
    search: "搜索",
    rss: "RSS 订阅",
  },
  post: {
    publishedAt: "发布于 {{date}}",
    updatedAt: "更新于 {{date}}",
    sharePostIntro: "分享这篇文章：",
    sharePostOn: "分享到 {{name}}",
    sharePostViaEmail: "通过邮件分享",
    tagLabel: "标签：",
    backToTop: "返回顶部",
    goBack: "返回",
    editPage: "在 GitHub 上编辑",
    previousPost: "上一篇",
    nextPost: "下一篇",
    tableOfContents: "目录",
    copyCode: "复制",
    copied: "已复制",
    zoomImage: "放大图片",
    imagePreview: "图片预览：",
    closeImagePreview: "关闭图片预览",
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
    page: "第 {{current}} / {{total}} 页",
  },
  home: {
    socialLinks: "社交链接",
    featured: "精选文章",
    recentPosts: "最新文章",
    allPosts: "查看全部文章",
  },
  archives: {
    postCount: "{{count}} 篇",
    monthLabel: "{{month}} 月",
  },
  footer: {
    copyright: "版权所有",
    allRightsReserved: "保留所有权利。",
  },
  pages: {
    tagTitle: "#{{tag}}",
    tagDesc: "标签为 {{tag}} 的全部文章",
    tagsTitle: "全部标签",
    tagsDesc: "浏览所有文章标签",
    postsTitle: "全部文章",
    postsDesc: "浏览全部文章",
    archivesTitle: "文章归档",
    archivesDesc: "按时间线浏览全部文章",
    searchTitle: "搜索",
    searchDesc: "搜索站内文章",
    aboutTitle: "关于",
    aboutDesc: "关于本站",
  },
  a11y: {
    skipToContent: "跳转到主要内容",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    toggleTheme: "切换主题",
    searchPlaceholder: "搜索文章...",
    noResults: "未找到结果",
    goToPreviousPage: "前往上一页",
    goToNextPage: "前往下一页",
    languageSwitcher: "切换语言",
  },
  languageSwitcher: {
    label: "语言",
    names: {
      "zh-cn": "简体中文",
      en: "English",
    },
  },
  notFound: {
    title: "页面未找到",
    message: "你访问的页面不存在或已被移动。",
    goHome: "返回首页",
  },
  comments: {
    title: "评论",
  },
};

export default zhCn;
