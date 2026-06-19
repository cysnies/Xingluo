import { slugifyStr } from "./slugify";

/**
 * 生成合法的 CSS <custom-ident>，用于 view-transition-name
 * CSS ident 仅允许 [a-zA-Z0-9_-] 及 Unicode U+00A0+
 * 非 ASCII 字符做十六进制编码，ASCII 特殊字符替换为连字符
 */
export const toTransitionName = (str: string): string => {
  const base = slugifyStr(str.replaceAll(".", "-"));
  const result = base
    // 编码非 ASCII 字符（中文、日文等）
    .replace(
      /[^\x00-\x7F]/gu,
      (c) => "u" + c.codePointAt(0)!.toString(16).padStart(6, "0"),
    )
    // 替换剩余非法字符（冒号、斜杠等）为连字符
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    // 合并连续连字符并修剪
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return result;
};
