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

/** 功能开关配置 */
export interface FeaturesConfig {
  /** 是否启用亮/暗模式切换 */
  lightAndDarkMode: boolean;
  /** 是否动态生成 OG 图 */
  dynamicOgImage: boolean;
  /** 是否显示档案页 */
  showArchives: boolean;
  /** 是否显示返回按钮 */
  showBackButton: boolean;
  /** 编辑文章链接配置 */
  editPost: EditPostConfig;
  /** 搜索方案 */
  search: "pagefind" | false;
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
  config: PartialXingluoConfig
): PartialXingluoConfig {
  return config;
}
