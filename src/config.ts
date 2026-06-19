import userConfig from "../xingluo.config";
import type { XingluoConfig, PartialXingluoConfig } from "@/types/config";

/** 默认 OG 图文件名 */
const DEFAULT_OG_IMAGE = "default-og.jpg";
/** 默认每页文章数 */
const DEFAULT_PER_PAGE = 8;
/** 默认首页文章数 */
const DEFAULT_PER_INDEX = 5;
/** 定时发布容差（15 分钟） */
const DEFAULT_SCHEDULED_MARGIN = 15 * 60 * 1000;

/** 站点默认值 */
const defaultSite = {
  ogImage: DEFAULT_OG_IMAGE,
  timezone: "Asia/Shanghai",
  dir: "ltr" as const,
};

/** 文章默认值 */
const defaultPosts = {
  perPage: DEFAULT_PER_PAGE,
  perIndex: DEFAULT_PER_INDEX,
  scheduledPostMargin: DEFAULT_SCHEDULED_MARGIN,
};

/** 功能开关默认值 */
const defaultFeatures = {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    url: "",
  },
  search: "pagefind" as const,
};

/** 深度合并用户配置与默认值，得到完整配置对象 */
function resolveConfig(partial: PartialXingluoConfig): XingluoConfig {
  return {
    site: { ...defaultSite, ...partial.site } as XingluoConfig["site"],
    posts: { ...defaultPosts, ...partial.posts },
    features: {
      ...defaultFeatures,
      ...partial.features,
      editPost: { ...defaultFeatures.editPost, ...partial.features?.editPost },
    },
    socials: partial.socials ?? [],
    shareLinks: partial.shareLinks ?? [],
  };
}

/** 解析后的完整配置（全站统一引用） */
const config = resolveConfig(userConfig);

export default config;
