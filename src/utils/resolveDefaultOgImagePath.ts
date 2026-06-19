import config from "@/config";
import { getAssetPath } from "./withBase";

/** 静态扫描 public 目录文件，用于判断 OG 图是否存在 */
const publicFiles = import.meta.glob("/public/*", { eager: false });

/** 判断指定文件名是否存在于 public 目录 */
function existsInPublic(filename: string): boolean {
  return `/public/${filename}` in publicFiles;
}

/**
 * 解析用于页面/文章的绝对 OG 图路径
 *
 * 安全约束：site.ogImage 必须是 public/ 下的单个文件名，防止路径穿越
 *
 * 行为：
 * - 启用 dynamicOgImage 时，优先使用 public/{site.ogImage}，否则回退到生成的 /og.png
 * - 未启用时，要求 public/{site.ogImage} 必须存在
 */
export function resolveDefaultOgImagePath(): string {
  const filename = config.site.ogImage ?? "default-og.jpg";

  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    throw new Error(
      `site.ogImage 必须是 public/ 下的单个文件名（如 "default-og.jpg"），实际值为 "${filename}"`,
    );
  }

  if (config.features.dynamicOgImage) {
    return existsInPublic(filename)
      ? getAssetPath(filename)
      : getAssetPath("og.png");
  }

  // 未启用动态 OG 图：若配置的文件存在则使用，否则回退到 favicon
  return existsInPublic(filename)
    ? getAssetPath(filename)
    : getAssetPath("favicon.svg");
}
