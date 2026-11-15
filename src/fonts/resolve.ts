/**
 * 根据用户配置解析当前启用字体与完整目录；
 * 可选将 CDN URL 改写到大陆友好镜像。
 */
import {
  BUILTIN_FONTS,
  BUILTIN_FONT_MAP,
  type FontDefinition,
} from "./catalog";
import config from "@/config";

/** 合并内置目录与用户自定义字体（同 id 时用户覆盖） */
export function getFontCatalog(): FontDefinition[] {
  const custom = config.fonts?.fonts ?? [];
  const map = new Map<string, FontDefinition>();
  for (const f of BUILTIN_FONTS) map.set(f.id, f);
  for (const f of custom) map.set(f.id, f as FontDefinition);
  return Array.from(map.values());
}

/** 当前启用的字体定义；找不到 id 时回退 system */
export function resolveActiveFont(): FontDefinition {
  const catalog = getFontCatalog();
  const id =
    config.fonts?.mode === "user"
      ? "system"
      : (config.fonts?.family ?? "system");
  return (
    catalog.find((f) => f.id === id) ?? BUILTIN_FONT_MAP.system ?? catalog[0]!
  );
}

const DEFAULT_GF_MIRROR = "https://fonts.googleapis.cn";

/**
 * 将字体 stylesheet URL 改写到镜像（若启用 googleFontsMirror）
 * - fonts.googleapis.com → 配置的镜像根（默认 fonts.googleapis.cn）
 * - cdn.jsdelivr.net/npm/pkg@version/path → cdn.npmmirror.com/packages/pkg/version/files/path
 *
 * 仅改写已知公共 CDN 前缀，不接受任意用户主机名（降低开放重定向风险）。
 */
export function maybeMirrorCssUrl(cssUrl: string): string {
  const mirror = config.features.googleFontsMirror;
  if (!mirror?.enabled || !cssUrl) return cssUrl;

  let out = cssUrl;

  if (out.includes("fonts.googleapis.com")) {
    const base = (mirror.url || DEFAULT_GF_MIRROR).replace(/\/$/, "");
    // 只允许 https 镜像根
    if (/^https:\/\//i.test(base)) {
      out = out.replace("https://fonts.googleapis.com", base);
    }
  }

  const npmMirror = mirror.npmMirror !== false;
  if (npmMirror) {
    out = rewriteJsdelivrNpmToNpmmirror(out);
  }

  return out;
}

/**
 * jsDelivr npm 字体包 → npmmirror CDN
 * 例：https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.7.0/style.css
 *   → https://cdn.npmmirror.com/packages/lxgw-wenkai-lite-webfont/1.7.0/files/style.css
 */
export function rewriteJsdelivrNpmToNpmmirror(cssUrl: string): string {
  const m = cssUrl.match(
    /^https:\/\/cdn\.jsdelivr\.net\/npm\/([^@\/]+)@([^\/]+)\/(.+)$/i,
  );
  if (!m) return cssUrl;
  const [, pkg, ver, path] = m;
  return `https://cdn.npmmirror.com/packages/${pkg}/${ver}/files/${path}`;
}
