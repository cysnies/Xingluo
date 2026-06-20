import { DEFAULT_LOCALE } from "@/i18n";

/** 使用字符数计速的语言（中日韩），阅读速率约每分钟 400 字 */
const CJK_LOCALES = new Set(["zh-cn", "ja", "ko"]);
/** 中日韩字符范围：CJK 统一表意文字、平假名/片假名、谚文 */
const CJK_CHAR_REGEX = /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g;
/** 围栏代码块（``` 或 ~~~ 起始的多行块） */
const FENCED_CODE_BLOCK_REGEX = /(^|\n)(\s*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2\3[^\n]*/g;
/** 行内代码 `code` */
const INLINE_CODE_REGEX = /`[^`\n]*`/g;
/** HTML 标签 */
const HTML_TAG_REGEX = /<[^>]+>/g;
/** Markdown 链接 [text](url)，仅保留 text */
const MARKDOWN_LINK_REGEX = /\[([^\]]*)\]\([^)]*\)/g;
/** Markdown 图片 ![alt](url)，移除整段 */
const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*\]\([^)]*\)/g;

/**
 * 判断给定语言是否按字符数计算阅读时长
 * @param locale 语言代码
 */
function isCjkLocale(locale: string): boolean {
  return CJK_LOCALES.has(locale);
}

/**
 * 清理 Markdown 原文，剔除代码块、HTML 标签、链接 URL 等非正文内容，
 * 使字数/词数统计更贴近真实阅读量。
 * @param body 文章 Markdown 原文（不含 frontmatter）
 */
function sanitizeBody(body: string): string {
  return body
    .replace(MARKDOWN_IMAGE_REGEX, " ")
    .replace(FENCED_CODE_BLOCK_REGEX, " ")
    .replace(INLINE_CODE_REGEX, " ")
    .replace(MARKDOWN_LINK_REGEX, "$1")
    .replace(HTML_TAG_REGEX, " ");
}

/**
 * 统计中日韩字符数
 * @param text 已清理文本
 */
function countCjkChars(text: string): number {
  const matches = text.match(CJK_CHAR_REGEX);
  return matches ? matches.length : 0;
}

/**
 * 统计拉丁文等按空白分词的单词数
 * @param text 已清理文本
 */
function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * 估算文章阅读时长（分钟）。
 * 中日韩语言按字符数计算（约每分钟 400 字），
 * 其余语言按单词数计算（约每分钟 200 词），
 * 结果向上取整且至少为 1 分钟。
 * @param body 文章 Markdown 原文（不含 frontmatter）
 * @param locale 语言代码，缺省为默认语言
 */
export function getReadingTime(
  body: string,
  locale: string = DEFAULT_LOCALE
): number {
  const sanitized = sanitizeBody(body ?? "");

  if (isCjkLocale(locale)) {
    const chars = countCjkChars(sanitized);
    return Math.max(1, Math.ceil(chars / 400));
  }

  const words = countWords(sanitized);
  return Math.max(1, Math.ceil(words / 200));
}
