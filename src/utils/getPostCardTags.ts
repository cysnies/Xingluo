/** 分类去重后的卡片标签，前两项展示，其余合并计数。 */
export function getPostCardTags(tags: string[], category?: string) {
  const unique = [...new Set(tags)].filter((tag) => tag !== category);
  return { visible: unique.slice(0, 2), hidden: unique.slice(2) };
}
