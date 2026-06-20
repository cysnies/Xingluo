import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "@/utils/slugify";

/**
 * 计算两篇文章共享的标签数量。
 * 标签先经 slugifyStr 归一化后再比较，避免大小写/空白差异导致漏匹配。
 * @param a 文章 A 的原始标签数组
 * @param b 文章 B 的原始标签数组
 */
function countSharedTags(a: string[], b: string[]): number {
  const setA = new Set(a.map((tag) => slugifyStr(tag)));
  let count = 0;
  for (const tag of b) {
    if (setA.has(slugifyStr(tag))) count++;
  }
  return count;
}

/**
 * 选取与当前文章最相关的若干篇文章。
 *
 * 相关度按共享标签数量降序排序；共享标签数相同时，按发布时间降序排列
 * （优先推荐较新的文章）。结果截取前 limit 篇，排除当前文章自身。
 *
 * @param current 当前文章
 * @param all 全部文章（通常为已排序并过滤后的列表）
 * @param limit 返回的最大文章数，默认 2
 */
export function getRelatedPosts(
  current: CollectionEntry<"posts">,
  all: CollectionEntry<"posts">[],
  limit = 2,
): CollectionEntry<"posts">[] {
  const currentTags = current.data.tags;

  return all
    .filter((post) => post.id !== current.id)
    .map((post) => ({
      post,
      shared: countSharedTags(currentTags, post.data.tags),
    }))
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => {
      // 共享标签数多的优先
      if (b.shared !== a.shared) return b.shared - a.shared;
      // 同分时按发布时间降序，较新的优先
      const aTime = a.post.data.pubDatetime.getTime();
      const bTime = b.post.data.pubDatetime.getTime();
      return bTime - aTime;
    })
    .slice(0, limit)
    .map((entry) => entry.post);
}
