import type { CollectionEntry } from "astro:content";

/** 单个月份分组 */
export interface MonthGroup {
  /** 月份（1-12） */
  month: number;
  /** 该月文章（已按时间倒序） */
  posts: CollectionEntry<"posts">[];
}

/** 单个年份分组 */
export interface YearGroup {
  /** 年份 */
  year: number;
  /** 该年全部文章 */
  posts: CollectionEntry<"posts">[];
  /** 该年各月分组（月份降序） */
  months: MonthGroup[];
}

/**
 * 将文章按年→月两级分组
 * 输入需已按发布时间倒序排列（getSortedPosts 的输出）
 * 年与月均降序，便于时间线展示
 */
export function groupPostsByYearMonth(
  posts: CollectionEntry<"posts">[],
  getDate: (post: CollectionEntry<"posts">) => Date
): YearGroup[] {
  const yearMap = new Map<number, CollectionEntry<"posts">[]>();

  for (const post of posts) {
    const date = getDate(post);
    const year = date.getFullYear();
    if (!yearMap.has(year)) yearMap.set(year, []);
    yearMap.get(year)!.push(post);
  }

  const years = Array.from(yearMap.keys()).sort((a, b) => b - a);

  return years.map((year) => {
    const yearPosts = yearMap.get(year)!;
    const monthMap = new Map<number, CollectionEntry<"posts">[]>();
    for (const post of yearPosts) {
      const month = getDate(post).getMonth() + 1;
      if (!monthMap.has(month)) monthMap.set(month, []);
      monthMap.get(month)!.push(post);
    }
    const months = Array.from(monthMap.keys())
      .sort((a, b) => b - a)
      .map((month) => ({ month, posts: monthMap.get(month)! }));
    return { year, posts: yearPosts, months };
  });
}
