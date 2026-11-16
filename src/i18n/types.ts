/** UI 文案类型定义：所有需要本地化的界面字符串 */

export interface UIStrings {
  /** 导航相关 */
  nav: {
    home: string;
    posts: string;
    tags: string;
    about: string;
    archives: string;
    categories: string;
    search: string;
    rss: string;
  };
  /** 文章相关 */
  post: {
    publishedAt: string;
    updatedAt: string;
    sharePostIntro: string;
    sharePostOn: string;
    sharePostViaEmail: string;
    tagLabel: string;
    backToTop: string;
    goBack: string;
    editPage: string;
    previousPost: string;
    nextPost: string;
    tableOfContents: string;
    /** 代码块复制按钮初始文案 */
    copyCode: string;
    /** 代码块复制成功文案 */
    copied: string;
    /** 图片放大提示（无 alt 时） */
    zoomImage: string;
    /** 图片预览对话框标题前缀（有 alt 时） */
    imagePreview: string;
    /** 关闭图片预览按钮标签 */
    closeImagePreview: string;
    /** 阅读时长，如 "{{minutes}} 分钟阅读" */
    readingTime: string;
    /** 文章目录中的阅读进度 */
    readingProgress: string;
    /** 相关文章区块标题 */
    relatedPosts: string;
    /** 文章分类标签文案，如 "分类：{{category}}" */
    categoryLabel: string;
    /** 标题锚点链接无障碍文案 */
    linkToHeading: string;
  };
  /** 分页相关 */
  pagination: {
    prev: string;
    next: string;
    page: string;
  };
  /** 首页相关 */
  home: {
    socialLinks: string;
    featured: string;
    recentPosts: string;
    allPosts: string;
  };
  /** 归档页相关 */
  archives: {
    /** 文章计数，如 "{{count}} 篇" */
    postCount: string;
    /** 月份标签，如 "{{month}} 月" */
    monthLabel: string;
  };
  /** 分类页相关 */
  categories: {
    /** 查看全部按钮文案 */
    viewAll: string;
  };
  /** 页脚相关 */
  footer: {
    copyright: string;
  };
  /** 各页面标题与描述 */
  pages: {
    tagTitle: string;
    tagDesc: string;
    tagsTitle: string;
    tagsDesc: string;
    categoryTitle: string;
    categoryDesc: string;
    categoriesTitle: string;
    categoriesDesc: string;
    postsTitle: string;
    postsDesc: string;
    archivesTitle: string;
    archivesDesc: string;
    searchTitle: string;
    searchDesc: string;
    aboutTitle: string;
    aboutDesc: string;
  };
  /** 无障碍标签 */
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    searchPlaceholder: string;
    noResults: string;
    goToPreviousPage: string;
    goToNextPage: string;
    languageSwitcher: string;
    /** 字体切换器 */
    fontSwitcher: string;
    /** 桌面主导航 */
    mainNav: string;
    /** 移动端导航抽屉 */
    mobileNav: string;
    /** 面包屑导航 */
    breadcrumb: string;
    /** 分页导航 */
    paginationNav: string;
    /** 相邻文章导航 */
    adjacentPosts: string;
    /** 关闭对话框 */
    closeDialog: string;
    /** 清除搜索输入 */
    clearSearch: string;
    /** 搜索结果计数，如 "{{count}} 条结果" */
    searchResultsCount: string;
  };
  /** 语言切换器 */
  languageSwitcher: {
    /** 触发按钮的可视标签 */
    label: string;
    /** 各语言在该语言下的自称，键为 locale */
    names: Record<string, string>;
  };
  /** 社交链接无障碍标题模板 */
  socials: {
    /** 如 "发送邮件给 {{title}}" */
    mailTo: string;
    /** 如 "{{title}} 在 {{platform}}" */
    onPlatform: string;
  };
  /** 字体切换器展示名 */
  fonts: {
    /** 系统默认字体项 */
    systemDefault: string;
  };
  /** 404 页面 */
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
  /** 评论区 */
  comments: {
    /** 评论区标题 */
    title: string;
  };
  /** 网页卡片标签 */
  webcard: {
    openLink: string;
    stars: string;
    forks: string;
    language: string;
    repos: string;
    followers: string;
    state: string;
    comments: string;
    views: string;
    likes: string;
    danmaku: string;
    replies: string;
    reposts: string;
    downloads: string;
    task: string;
    author: string;
    reading: string;
    platformGitHub: string;
    platformBilibili: string;
    platformZhihu: string;
    platformTwitter: string;
    platformHuggingFace: string;
    platformWeb: string;
    kindRepo: string;
    kindUser: string;
    kindPull: string;
    kindIssue: string;
    kindVideo: string;
    kindDynamic: string;
    kindArticle: string;
    kindAnswer: string;
    kindTweet: string;
    kindModel: string;
    kindDataset: string;
    kindSpace: string;
    kindPage: string;
  };
}
