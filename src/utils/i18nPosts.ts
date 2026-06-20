import type { CollectionEntry } from "astro:content";
import { DEFAULT_LOCALE } from "@/i18n";
import { getSortedPosts } from "./getSortedPosts";

/** 翻译分组：translationKey（或独立 id）到该组各语言文章的映射 */
export type TranslationGroups = Map<string, Map<string, CollectionEntry<"posts">>>;

/**
 * 获取文章的写作语言。
 * 未设置 locale 时视为默认语言。
 * @param post 文章
 */
export function getPostLocale(post: CollectionEntry<"posts">): string {
  return post.data.locale ?? DEFAULT_LOCALE;
}

/**
 * 将文章按翻译分组。
 *
 * - 设置了 translationKey 的文章按 translationKey 分组，同组即互为译文。
 * - 未设置 translationKey 的文章各自成独立分组（以 `__single__${id}` 为键），
 *   不与任何文章归为一组。
 *
 * 分组内按语言索引，便于按 locale 查找译文。
 * @param posts 全部文章（通常为 getCollection 原始结果）
 */
export function groupTranslations(
  posts: CollectionEntry<"posts">[]
): TranslationGroups {
  const groups: TranslationGroups = new Map();
  for (const post of posts) {
    const key = post.data.translationKey ?? `__single__${post.id}`;
    const locale = getPostLocale(post);
    let group = groups.get(key);
    if (!group) {
      group = new Map();
      groups.set(key, group);
    }
    // 同语言若已存在则保留先出现的，避免重复
    if (!group.has(locale)) {
      group.set(locale, post);
    }
  }
  return groups;
}

/**
 * 选取某语言下应展示的文章代表列表。
 *
 * 对每个翻译分组：优先取该语言的译文，其次取默认语言版本，再次取组内任意一篇。
 * 这样无译文的文章仍以默认语言内容回退展示，避免列表出现重复主题。
 * 结果按已排序（最后更新时间倒序）顺序返回。
 *
 * @param posts 全部文章
 * @param locale 目标语言
 */
export function getPostsForLocale(
  posts: CollectionEntry<"posts">[],
  locale: string
): CollectionEntry<"posts">[] {
  const groups = groupTranslations(posts);
  const representatives: CollectionEntry<"posts">[] = [];
  for (const group of groups.values()) {
    const picked =
      group.get(locale) ?? group.get(DEFAULT_LOCALE) ?? [...group.values()][0];
    if (picked) representatives.push(picked);
  }
  return getSortedPosts(representatives);
}

/**
 * 在同组译文中查找指定语言的版本。
 *
 * @param posts 全部文章
 * @param basePost 基准文章（用于确定翻译分组）
 * @param locale 目标语言
 * @returns 对应语言译文；若无则返回 undefined
 */
export function findTranslation(
  posts: CollectionEntry<"posts">[],
  basePost: CollectionEntry<"posts">,
  locale: string
): CollectionEntry<"posts"> | undefined {
  const groups = groupTranslations(posts);
  const key = basePost.data.translationKey ?? `__single__${basePost.id}`;
  return groups.get(key)?.get(locale);
}
