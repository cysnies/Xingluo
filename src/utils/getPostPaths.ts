import { getRelativeLocaleUrl } from "astro:i18n";
import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import config from "@/config";

/** 从文章文件路径中提取目录段（不含文件名，过滤下划线前缀目录） */
function getPostPathSegments(filePath: string | undefined): string[] {
  return (
    filePath
      ?.replace(BLOG_PATH, "")
      .split("/")
      .filter((path) => path !== "")
      .filter((path) => !path.startsWith("_"))
      .slice(0, -1)
      .map((segment) => slugifyStr(segment)) ?? []
  );
}

/** 从文章 id 中提取末尾 slug */
function getIdSlug(id: string): string {
  const postId = id.split("/");
  return postId.length > 0 ? String(postId[postId.length - 1]) : id;
}

/** 组合目录段与文件 slug，得到文章的 slug 路径 */
function getPostSlugPath(id: string, filePath: string | undefined): string {
  const pathSegments = getPostPathSegments(filePath);
  const slug = getIdSlug(id);
  return pathSegments.length > 0
    ? [...pathSegments, slug].join("/")
    : String(slug);
}

/**
 * 获取文章的 slug 路径（仅 slug，无 base/locale 前缀）
 * 用于 getStaticPaths 的路由参数
 */
export function getPostSlug(id: string, filePath: string | undefined): string {
  return `/${getPostSlugPath(id, filePath)}`;
}

/**
 * 获取文章的可导航 URL（含 locale 与 base 前缀）
 * 用于 <a href> 与 RSS 链接
 */
export function getPostUrl(
  id: string,
  filePath: string | undefined,
  locale: string = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `posts/${getPostSlugPath(id, filePath)}`);
}
