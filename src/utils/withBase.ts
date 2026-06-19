import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";

/** 配置的 Astro base 前缀，去掉尾部斜杠 */
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
const baseRoot = base === "" ? "/" : `${base}/`;

/**
 * 从路径中剥离语言前缀
 * 如 locale 为 "en"："/en/posts/foo" → "/posts/foo"，"/en" → "/"
 * 不以该语言前缀开头的路径原样返回
 */
export function stripLocale(pathname: string, locale: string): string {
  const prefix = `/${locale}`;
  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname;
}

/**
 * 从绝对路径中剥离配置的 Astro base 前缀
 * 返回根相对路径
 */
export function stripBase(pathname: string): string {
  if (base === "") {
    return pathname;
  }
  if (pathname === base) {
    return "/";
  }
  if (pathname.startsWith(baseRoot)) {
    const stripped = pathname.slice(base.length);
    return stripped === "" ? "/" : stripped;
  }
  return pathname;
}

/**
 * 为静态资源/文件路径加上 base 前缀
 */
export function getAssetPath(path: string): string {
  const normalizedPath = path.replace(/^\/+/, "");

  if (!normalizedPath) {
    return base === "" ? "/" : base;
  }
  return baseRoot + normalizedPath;
}

/**
 * 根据语言生成相对 URL（含 base 前缀）
 * 默认语言无前缀，其他语言加 /{locale} 前缀
 */
export function getLocaleUrl(
  locale: string = config.site.lang,
  path: string = "/",
): string {
  return getRelativeLocaleUrl(locale, path.replace(/^\/+/, ""));
}
