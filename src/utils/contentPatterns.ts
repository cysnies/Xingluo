/** 内容树中可能出现的非默认语种子目录（与 src/i18n/lang 对齐） */
export const CONTENT_LOCALE_DIRS = [
  "zh-tw",
  "en",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "pt",
  "ru",
  "ar",
  "eo",
] as const;

export const DEFAULT_LOCALE = "zh-cn";

/**
 * 收集默认语言的任意层级内容，并排除未启用的语言目录。
 */
export function createContentPatterns(
  extension: "md" | "{md,mdx}",
  requestedLocales?: string[],
): string | string[] {
  if (!requestedLocales || requestedLocales.length === 0) {
    return `**/[^_]*.${extension}`;
  }

  const enabled = new Set(requestedLocales);
  enabled.add(DEFAULT_LOCALE);
  const disabledDirectories = CONTENT_LOCALE_DIRS.filter(
    (locale) => !enabled.has(locale),
  ).map((locale) => `!${locale}/**`);

  return [`**/[^_]*.${extension}`, ...disabledDirectories];
}
