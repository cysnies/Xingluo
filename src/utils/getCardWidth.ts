import type { CollectionEntry } from "astro:content";

/**
 * 文章卡片宽度类型：
 * - "full"：独占一行（卡片全宽）
 * - "half"：半宽，与其他半宽卡片同行排列
 */
export type CardWidth = "full" | "half";

/**
 * 获取文章卡片的占位宽度。
 *
 * 优先级（从高到低）：
 * 1. 文章 Frontmatter 中手动指定了 cardWidth
 * 2. 全局禁用了文章卡片头图 → 全部半宽
 * 3. 文章配置了头图 → 全宽，否则半宽
 *
 * @param post       文章条目
 * @param showHero   全局 showPostCardHero 开关
 */
export function getCardWidth(
  post: CollectionEntry<"posts">,
  showHero: boolean,
): CardWidth {
  // 最高优先级：Frontmatter 手动指定
  if (post.data.cardWidth) return post.data.cardWidth;

  // 全局禁用了卡片头图 → 全部半宽
  if (!showHero) return "half";

  // 文章配置了头图 → 全宽，否则半宽
  return post.data.heroImage ? "full" : "half";
}
