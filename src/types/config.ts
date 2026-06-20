/**
 * 星罗用户配置类型定义
 * 提供配置项的完整类型与默认值合并工具
 */

/** 站点级配置 */
export interface SiteConfig {
  /** 站点 URL（用于生成绝对链接、RSS、sitemap） */
  url: string;
  /** 站点标题 */
  title: string;
  /** 站点描述（用于 SEO 与 RSS） */
  description: string;
  /** 默认作者名 */
  author: string;
  /** 作者主页链接 */
  profile?: string;
  /** 默认 OG 图文件名（位于 public 目录） */
  ogImage?: string;
  /** 默认语言 */
  lang: string;
  /** 时区（用于文章时间显示） */
  timezone?: string;
  /** 文字方向 */
  dir: "ltr" | "rtl";
  /** Google Search Console 站点验证值 */
  googleVerification?: string;
}

/** 文章列表相关配置 */
export interface PostsConfig {
  /** 列表页每页文章数 */
  perPage: number;
  /** 首页显示文章数 */
  perIndex: number;
  /** 定时发布容差（毫秒），在此时间内的未来文章视为已发布 */
  scheduledPostMargin: number;
}

/** 编辑文章链接配置 */
export interface EditPostConfig {
  enabled: boolean;
  /** 编辑链接前缀，会拼接文章路径 */
  url: string;
}

/** 评论系统提供者类型 */
export type CommentProvider = "giscus" | "twikoo" | "waline" | false;

/** giscus 评论系统配置 */
export interface GiscusConfig {
  /** GitHub 仓库，形如 owner/repo */
  repo: string;
  /** 仓库 ID（giscus.app 生成） */
  repoId: string;
  /** Discussion 分类名 */
  category: string;
  /** 分类 ID（giscus.app 生成） */
  categoryId: string;
  /** 页面到 discussion 的映射方式 */
  mapping?: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
  /** 是否启用严格标题匹配 */
  strict?: boolean;
  /** 是否启用表情反应 */
  reactionsEnabled?: boolean;
  /** 评论输入框位置 */
  inputPosition?: "top" | "bottom";
  /** 加载方式 */
  loading?: "lazy" | "eager";
}

/** twikoo 评论系统配置 */
export interface TwikooConfig {
  /** 云环境 ID 或自托管服务完整 URL */
  envId: string;
  /** 语言代码（如 zh-CN） */
  lang?: string;
}

/** waline 评论系统配置 */
export interface WalineConfig {
  /** Waline 服务端地址 */
  serverURL: string;
  /** 语言代码（如 zh-CN） */
  lang?: string;
  /** 评论分页大小 */
  pageSize?: number;
  /** 暗色模式选择器或布尔，留空则跟随站点 .dark 类 */
  dark?: string | boolean;
}

/** 评论系统统一配置（同时仅启用一个 provider） */
export interface CommentsConfig {
  /** 评论系统提供者，false 表示关闭 */
  provider: CommentProvider;
  /** giscus 配置，provider 为 giscus 时必填 */
  giscus?: GiscusConfig;
  /** twikoo 配置，provider 为 twikoo 时必填 */
  twikoo?: TwikooConfig;
  /** waline 配置，provider 为 waline 时必填 */
  waline?: WalineConfig;
}

/** 媒体播放器开关配置 */
export interface PlayersConfig {
  /** 是否启用 APlayer 音乐播放器 */
  aplayer: boolean;
  /** 是否启用 DPlayer 视频播放器 */
  dplayer: boolean;
}

/** 功能开关配置 */
export interface FeaturesConfig {
  /** 是否启用亮/暗模式切换 */
  lightAndDarkMode: boolean;
  /** 是否动态生成 OG 图 */
  dynamicOgImage: boolean;
  /** 是否显示归档页 */
  showArchives: boolean;
  /** 是否显示分类页与导航入口 */
  showCategories: boolean;
  /** 是否显示返回按钮 */
  showBackButton: boolean;
  /** 编辑文章链接配置 */
  editPost: EditPostConfig;
  /** 搜索方案 */
  search: "pagefind" | false;
  /** 是否启用 MDX 解析与渲染（关闭时仅收集 .md 且不加载 mdx 集成） */
  mdx: boolean;
  /** 评论系统配置 */
  comments: CommentsConfig;
  /** 媒体播放器开关 */
  players: PlayersConfig;
}

/** 社交链接项 */
export interface SocialItem {
  name: string;
  url: string;
  /** 无障碍标题/tooltip，省略时按名称自动生成 */
  linkTitle?: string;
}

/** 分享链接项 */
export interface ShareLinkItem {
  name: string;
  url: string;
  /** 无障碍标题/tooltip，省略时按名称自动生成 */
  linkTitle?: string;
}

/** 完整的星罗配置 */
export interface XingluoConfig {
  site: SiteConfig;
  posts: PostsConfig;
  features: FeaturesConfig;
  socials: SocialItem[];
  shareLinks: ShareLinkItem[];
}

/** 用于 xingluo.config.ts 的可选配置（部分字段可省略，由默认值补全） */
export type PartialXingluoConfig = {
  [K in keyof XingluoConfig]?: K extends "site"
    ? Partial<SiteConfig>
    : K extends "posts"
      ? Partial<PostsConfig>
      : K extends "features"
        ? Partial<FeaturesConfig>
        : XingluoConfig[K];
};

/**
 * 用户配置定义工具
 * 仅做类型约束，实际默认值合并在 src/config.ts 中完成
 */
export function defineXingluoConfig(
  config: PartialXingluoConfig,
): PartialXingluoConfig {
  return config;
}
