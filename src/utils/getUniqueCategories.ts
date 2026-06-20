import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

/** 分类项：category 为 URL slug，categoryName 为原始显示名 */
export type Category = {
  category: string;
  categoryName: string;
};

/**
 * 从文章中提取去重并排序的分类列表
 * - 通过 postFilter 排除草稿与定时文章
 * - 跳过未设置 category 的文章
 * - category 为 URL 用的 slug，categoryName 为原始分类名
 * - 去重基于 slug（大小写不同的分类会合并）
 * - 按 slug 字母序排序
 */
export function getUniqueCategories(
  posts: CollectionEntry<"posts">[],
): Category[] {
  return posts
    .filter(postFilter)
    .flatMap((post) => (post.data.category ? [post.data.category] : []))
    .map((category) => ({
      category: slugifyStr(category),
      categoryName: category,
    }))
    .filter(
      (value, index, self) =>
        self.findIndex((c) => c.category === value.category) === index,
    )
    .sort((a, b) => a.category.localeCompare(b.category));
}
