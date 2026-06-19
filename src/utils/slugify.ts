import slugifyLib from "slugify";

/** 判断字符串是否含非拉丁字符（如中文） */
const hasNonLatin = (str: string): boolean => /[^\x00-\x7F]/.test(str);

/**
 * 混合 slug 生成
 * - 拉丁字符串：使用 slugify（如 "E2E Testing" → "e2e-testing"）
 * - 含非拉丁字符的字符串：保留原文，仅做小写与连字符处理
 */
export const slugifyStr = (str: string): string => {
  if (hasNonLatin(str)) {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fa5-]/g, "");
  }
  return slugifyLib(str, { lower: true, strict: true });
};

/** 批量 slug 化 */
export const slugifyAll = (arr: string[]): string[] =>
  arr.map((str) => slugifyStr(str));
