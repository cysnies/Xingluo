/** 分类去重后的卡片标签，实际省略数量由卡片宽度在客户端计算。 */
export function getPostCardTags(tags: string[], category?: string) {
  const unique = [...new Set(tags)].filter((tag) => tag !== category);
  return { visible: unique, hidden: [] as string[] };
}
