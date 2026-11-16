/** 以正文进入顶部阅读线到正文底部进入视口为完整阅读区间。 */
export function getReadingProgress(
  top: number,
  height: number,
  viewportHeight: number,
  offset = 80,
): number {
  const distance = height - (viewportHeight - offset);
  if (distance <= 0) return top + height <= viewportHeight ? 1 : 0;
  return Math.min(1, Math.max(0, (offset - top) / distance));
}
