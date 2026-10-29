import type { UIStrings } from "./types";
import config from "@/config";

export { tplStr } from "./format";
export type { UIStrings } from "./types";

/** 通过 import.meta.glob 静态加载所有语言文件 */
const modules = import.meta.glob<{ default: UIStrings }>("./lang/*.ts", {
  eager: true,
});

/** 磁盘上全部可用翻译，按 locale 索引 */
const translations: Record<string, UIStrings> = {};
for (const [path, mod] of Object.entries(modules)) {
  const locale = path.slice("./lang/".length, -".ts".length);
  translations[locale] = mod.default;
}

/** 默认语言（无 URL 前缀） */
export const DEFAULT_LOCALE = "zh-cn";

/** 翻译文件中的全部语言（未按配置过滤） */
export const ALL_LOCALES = Object.keys(translations);

/**
 * 当前构建/路由启用的语言列表。
 * features.enabledLocales 省略或空数组 → 全部；否则取交集，并始终包含默认语言。
 */
function resolveEnabledLocales(): string[] {
  const requested = config.features.enabledLocales;
  if (!requested || requested.length === 0) {
    return ALL_LOCALES;
  }
  const set = new Set(requested.filter((l) => l in translations));
  set.add(DEFAULT_LOCALE);
  // 保持 ALL_LOCALES 的相对顺序
  return ALL_LOCALES.filter((l) => set.has(l));
}

/** 启用中的语言列表（受 enabledLocales 约束） */
export const LOCALES = resolveEnabledLocales();

/**
 * 获取指定语言的 UI 文案
 * @param locale 语言代码，缺省时回退到默认语言
 */
export function useTranslations(locale: string = DEFAULT_LOCALE): UIStrings {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}
