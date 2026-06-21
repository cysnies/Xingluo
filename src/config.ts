import userConfig from "../xingluo.config";
import type {
  CommentsConfig,
  GiscusConfig,
  GoogleFontsMirrorConfig,
  PlayersConfig,
  TwikooConfig,
  WalineConfig,
  XingluoConfig,
  PartialXingluoConfig,
} from "@/types/config";

/** 默认 OG 图文件名 */
const DEFAULT_OG_IMAGE = "default-og.jpg";
/** 默认每页文章数 */
const DEFAULT_PER_PAGE = 8;
/** 默认首页文章数 */
const DEFAULT_PER_INDEX = 5;
/** 默认分类页中每个分类展示的文章数 */
const DEFAULT_PER_CATEGORY = 4;
/** 定时发布容差（15 分钟） */
const DEFAULT_SCHEDULED_MARGIN = 15 * 60 * 1000;

/** 默认站点 SVG 图标文件名 */
const DEFAULT_FAVICON_SVG = "favicon.svg";

/** 站点默认值 */
const defaultSite = {
  ogImage: DEFAULT_OG_IMAGE,
  timezone: "Asia/Shanghai",
  dir: "ltr" as const,
  googleVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION,
  favicon: {
    svg: DEFAULT_FAVICON_SVG,
  } as XingluoConfig["site"]["favicon"],
};

/** 文章默认值 */
const defaultPosts = {
  perPage: DEFAULT_PER_PAGE,
  perIndex: DEFAULT_PER_INDEX,
  scheduledPostMargin: DEFAULT_SCHEDULED_MARGIN,
  postsPerCategory: DEFAULT_PER_CATEGORY,
};

/** 功能开关默认值 */
const defaultFeatures = {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showCategories: true,
  showBackButton: true,
  /** 默认在文章卡片中展示文章头图 */
  showPostCardHero: true,
  /** 移动端默认关闭文章卡片中的头图展示，防止头图与文字挤在一起阻碍阅读 */
  showPostCardHeroMobile: false,
  /** 默认在文章详情页中展示文章头图 */
  showPostDetailHero: true,
  editPost: {
    enabled: false,
    url: "",
  },
  search: "pagefind" as const,
  /** 默认启用 MDX 解析与渲染 */
  mdx: true,
  /** 默认关闭评论系统 */
  comments: {
    provider: false as const,
  },
  /** 默认关闭媒体播放器 */
  players: {
    aplayer: false,
    dplayer: false,
  },
  /** 默认关闭 Google Fonts 镜像源 */
  googleFontsMirror: {
    enabled: false,
    url: "https://fonts.googleapis.cn",
  },
};

/** 合并评论系统配置，保留用户提供的各 provider 子配置 */
function resolveComments(partial?: Partial<CommentsConfig>): CommentsConfig {
  const userComments = partial ?? {};
  const provider = userComments.provider ?? false;
  const resolved: CommentsConfig = { provider };
  // 仅在用户提供了对应 provider 配置时透传，保持类型安全
  if (userComments.giscus) {
    resolved.giscus = userComments.giscus as GiscusConfig;
  }
  if (userComments.twikoo) {
    resolved.twikoo = userComments.twikoo as TwikooConfig;
  }
  if (userComments.waline) {
    resolved.waline = userComments.waline as WalineConfig;
  }
  return resolved;
}

/** 合并播放器开关配置 */
function resolvePlayers(partial?: Partial<PlayersConfig>): PlayersConfig {
  return {
    aplayer: partial?.aplayer ?? false,
    dplayer: partial?.dplayer ?? false,
  };
}

/** 合并 Google Fonts 镜像源配置 */
function resolveGoogleFontsMirror(
  partial?: Partial<GoogleFontsMirrorConfig>,
): GoogleFontsMirrorConfig {
  return {
    enabled: partial?.enabled ?? false,
    url: partial?.url ?? "https://fonts.googleapis.cn",
  };
}

/** 合并站点图标配置，保留用户提供的各格式子项 */
function resolveFavicon(
  partial?: XingluoConfig["site"]["favicon"],
): XingluoConfig["site"]["favicon"] {
  const userFavicon = partial ?? {};
  return {
    svg: userFavicon.svg ?? DEFAULT_FAVICON_SVG,
    ico: userFavicon.ico,
    appleTouchIcon: userFavicon.appleTouchIcon,
    manifest: userFavicon.manifest,
  };
}

/** 深度合并用户配置与默认值，得到完整配置对象 */
function resolveConfig(partial: PartialXingluoConfig): XingluoConfig {
  return {
    site: {
      ...defaultSite,
      ...partial.site,
      favicon: resolveFavicon(partial.site?.favicon),
    } as XingluoConfig["site"],
    posts: { ...defaultPosts, ...partial.posts },
    features: {
      ...defaultFeatures,
      ...partial.features,
      editPost: { ...defaultFeatures.editPost, ...partial.features?.editPost },
      comments: resolveComments(partial.features?.comments),
      players: resolvePlayers(partial.features?.players),
      googleFontsMirror: resolveGoogleFontsMirror(
        partial.features?.googleFontsMirror,
      ),
    },
    socials: partial.socials ?? [],
    shareLinks: partial.shareLinks ?? [],
  };
}

/** 解析后的完整配置（全站统一引用） */
const config = resolveConfig(userConfig);

export default config;
