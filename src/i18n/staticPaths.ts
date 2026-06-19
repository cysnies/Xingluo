import { LOCALES, DEFAULT_LOCALE } from "@/i18n";

/**
 * i18n 路由段辅助
 * 默认语言无 URL 前缀、其他语言带前缀，因此 [locale] 段仅生成非默认语言
 */

/** 需要在 [locale] 段下生成页面的语言列表（排除默认语言） */
export const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/** 为 [locale] 段生成静态路径参数 */
export function getLocaleParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ params: { locale } }));
}
