import userConfig from "../xingluo.config";
import type {
  AnimationsConfig,
  CommentsConfig,
  FontsConfig,
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
  copyright: "© {{year}} {{author}}",
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
  /** View Transitions / ClientRouter，关可省约 5–6KB gzip */
  viewTransitions: true,
  showCategories: true,
  showBackButton: true,
  showHomeSocials: true,
  showFooterSocials: true,
  /** 默认在文章卡片中展示文章头图 */
  showPostCardHero: true,
  /** 移动端默认关闭文章卡片中的头图展示，防止头图与文字挤在一起阻碍阅读 */
  showPostCardHeroMobile: false,
  /** 默认在文章详情页中展示文章头图 */
  showPostDetailHero: true,
  /** 默认在文章卡片中展示估算的阅读时间 */
  showReadingTime: true,
  editPost: {
    enabled: false,
    url: "",
  },
  search: "flexsearch" as const,
  /** 默认 Zinc 色板（贴近 shadcn 官网） */
  palette: "zinc" as const,
  /**
   * 品牌强调色（改 primary/ring/selection 等）
   * 勿与 CSS 表面色 --accent（hover 底）混淆
   */
  accent: "none" as const,
  /** 默认 new-york 视觉风格 */
  uiStyle: "new-york" as const,
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
  /** 网页卡片默认开启（构建期抓取） */
  webCards: {
    enabled: true,
    timeoutMs: 8000,
    cache: true,
  },
  /**
   * 字体 CDN 镜像（默认开启，大陆友好）
   * - Google Fonts → fonts.googleapis.cn（gstatic.cn）
   * - jsDelivr npm 字体包 → cdn.npmmirror.com
   * 设 enabled:false 可回退官方源
   */
  googleFontsMirror: {
    enabled: true,
    url: "https://fonts.googleapis.cn",
  },
  /**
   * 动效默认克制：保留菜单/按钮/主题/TOC 等必要反馈，
   * 关闭光晕、倾斜、滚入、标题渐入等高开销装饰动效。
   * 需要时在 xingluo.config.ts → features.animations 逐项打开。
   */
  animations: {
    spotlightCard: false,
    cardTilt: false,
    scrollReveal: false,
    navIndicator: true,
    mobileMenuTransition: true,
    buttonPress: true,
    themeTransition: true,
    textReveal: false,
    tocSmooth: true,
    backToTopEnhanced: false,
    adjacentPostGlow: false,
    searchResultAnim: false,
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


/** 默认字体：system（零额外网络请求）。切换见 xingluo.config.ts → fonts.family */
const defaultFonts: FontsConfig = {
  family: "system",
  showSwitcher: true,
};

/** 深度合并动效配置 */
function resolveAnimations(
  partial?: Partial<AnimationsConfig>,
): AnimationsConfig {
  return {
    ...defaultFeatures.animations,
    ...partial,
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
      animations: resolveAnimations(partial.features?.animations),
      enabledLocales: partial.features?.enabledLocales,
      webCards: {
        enabled: partial.features?.webCards?.enabled ?? defaultFeatures.webCards.enabled,
        timeoutMs: partial.features?.webCards?.timeoutMs ?? defaultFeatures.webCards.timeoutMs,
        cache: partial.features?.webCards?.cache ?? defaultFeatures.webCards.cache,
      },
    },
    fonts: {
      ...defaultFonts,
      ...partial.fonts,
      fonts: partial.fonts?.fonts,
    },
    socials: partial.socials ?? [],
    shareLinks: partial.shareLinks ?? [],
  };
}

/** 解析后的完整配置（全站统一引用） */
const config = resolveConfig(userConfig);

export default config;
