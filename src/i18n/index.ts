import type { UIStrings } from "./types";

export { tplStr } from "./format";
export type { UIStrings } from "./types";

/** 通过 import.meta.glob 静态加载所有语言文件 */
const modules = import.meta.glob<{ default: UIStrings }>("./lang/*.ts", {
  eager: true,
});

/** 所有可用翻译，按 locale 索引 */
const translations: Record<string, UIStrings> = {};
for (const [path, mod] of Object.entries(modules)) {
  const locale = path.slice("./lang/".length, -".ts".length);
  translations[locale] = mod.default;
}

/** 默认语言（无 URL 前缀） */
export const DEFAULT_LOCALE = "zh-cn";

/** 所有支持的语言列表 */
export const LOCALES = Object.keys(translations);

/**
 * 获取指定语言的 UI 文案
 * @param locale 语言代码，缺省时回退到默认语言
 */
export function useTranslations(locale: string = DEFAULT_LOCALE): UIStrings {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}
