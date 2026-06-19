import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

/** 标签项：tag 为 URL slug，tagName 为原始显示名 */
export type Tag = {
  tag: string;
  tagName: string;
};

/**
 * 从文章中提取去重并排序的标签列表
 * - 通过 postFilter 排除草稿与定时文章
 * - tag 为 URL 用的 slug，tagName 为原始标签
 * - 去重基于 slug（大小写不同的标签会合并）
 */
export function getUniqueTags(posts: CollectionEntry<"posts">[]): Tag[] {
  return posts
    .filter(postFilter)
    .flatMap((post) => post.data.tags)
    .map((tag) => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex((t) => t.tag === value.tag) === index,
    )
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
}
