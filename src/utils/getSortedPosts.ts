import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";

/**
 * 获取用户可见的文章，按最后更新时间倒序排列
 * 使用 modDatetime（若有），否则使用 pubDatetime
 */
export function getSortedPosts(posts: CollectionEntry<"posts">[]) {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000,
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000,
        ),
    );
}
