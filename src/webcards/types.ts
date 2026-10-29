/** 平台标识 */
export type WebCardPlatform =
  | "generic"
  | "github"
  | "bilibili"
  | "zhihu"
  | "twitter"
  | "huggingface";

/** 平台内资源类型 */
export type WebCardKind =
  | "page"
  | "repo"
  | "user"
  | "pull"
  | "issue"
  | "video"
  | "dynamic"
  | "article"
  | "answer"
  | "tweet"
  | "model"
  | "dataset"
  | "space";

/** 统计项（标签走 i18n key） */
export interface WebCardStat {
  /** 对应 UIStrings.webcard 下的键名，如 stars / forks / views */
  key: string;
  /** 展示用数值或短文本 */
  value: string;
}

/** 统一卡片数据（各适配器 normalize 到此结构） */
export interface WebCardData {
  url: string;
  platform: WebCardPlatform;
  kind: WebCardKind;
  title: string;
  description?: string;
  siteName?: string;
  favicon?: string;
  image?: string;
  author?: string;
  authorUrl?: string;
  authorAvatar?: string;
  stats?: WebCardStat[];
  /** 额外徽章文案（已本地化或平台名） */
  badge?: string;
  /** 抓取失败或仅降级时为 true */
  degraded?: boolean;
}

/** URL 识别结果 */
export interface PlatformMatch {
  platform: WebCardPlatform;
  kind: WebCardKind;
  url: string;
  /** 适配器所需路径参数 */
  params: Record<string, string>;
}

/** 网页卡片功能配置 */
export interface WebCardsConfig {
  /** 是否启用（remark 裸链 + 构建期抓取），默认 true */
  enabled: boolean;
  /** 单次请求超时（毫秒），默认 8000 */
  timeoutMs: number;
  /** 是否启用磁盘缓存，默认 true */
  cache: boolean;
}
