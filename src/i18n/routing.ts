import { DEFAULT_LOCALE } from "./index";

/** 多语言路由工具：处理默认语言无前缀、其他语言带前缀的 URL 生成与解析 */

/**
 * 根据语言获取路径前缀
 * 默认语言返回空串，其他语言返回 /{locale}
 */
export function getLocalePrefix(locale: string): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * 为给定路径加上语言前缀
 * @param path 不含语言前缀的路径，如 /posts/ 或 /tags/astro/
 * @param locale 目标语言
 * @returns 带语言前缀的完整路径，如 /en/posts/ 或 /posts/
 */
export function withLocale(path: string, locale: string = DEFAULT_LOCALE): string {
  const prefix = getLocalePrefix(locale);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${prefix}${normalizedPath}`;
}

/**
 * 从 URL pathname 中解析出语言与去除前缀的路径
 * @param pathname 浏览器 pathname，如 /en/posts/foo/ 或 /posts/foo/
 */
export function parseLocaleFromPath(pathname: string): {
  locale: string;
  path: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && segments[0] !== DEFAULT_LOCALE && /^[a-z]{2}(-[a-z0-9]+)?$/i.test(segments[0])) {
    return {
      locale: segments[0],
      path: "/" + segments.slice(1).join("/"),
    };
  }
  return {
    locale: DEFAULT_LOCALE,
    path: pathname,
  };
}
