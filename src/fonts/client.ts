/**
 * 字体运行时：catalog 序列化、localStorage、按需注入 stylesheet
 * 在浏览器与 SSR 注入脚本间共用约定（键名/属性名）
 */
import type { FontDefinition } from "./catalog";
import { maybeMirrorCssUrl } from "./resolve";
import { getAssetPath } from "@/utils/withBase";

export const FONT_STORAGE_KEY = "xingluo-font";
export const FONT_LINK_ATTR = "data-xingluo-font-link";
export const FONT_CATALOG_SCRIPT_ID = "xingluo-font-catalog";

/** 下发到客户端的精简字体条目 */
export interface ClientFontEntry {
  id: string;
  label: string;
  stack: string;
  monoStack?: string;
  cssUrl?: string;
  cssUrls?: string[];
  source: FontDefinition["source"];
}

/** 序列化给浏览器：CDN URL 已按镜像策略改写 */
export function toClientFontEntry(f: FontDefinition): ClientFontEntry {
  const resolveCssUrl = (cssUrl: string) =>
    /^https?:\/\//i.test(cssUrl)
      ? maybeMirrorCssUrl(cssUrl)
      : getAssetPath(cssUrl);

  return {
    id: f.id,
    label: f.label,
    stack: f.stack,
    monoStack: f.monoStack,
    cssUrl: f.cssUrl ? resolveCssUrl(f.cssUrl) : undefined,
    cssUrls: f.cssUrls?.map(resolveCssUrl),
    source: f.source,
  };
}
