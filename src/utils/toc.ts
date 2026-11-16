/** 以阅读线选取所属章节，首个标题出现前也能提供初始定位。 */
export function getActiveHeadingIndex(tops: number[], offset: number): number {
  if (tops.length === 0) return -1;
  let active = 0;
  for (let index = 1; index < tops.length; index++) {
    if (tops[index] > offset) break;
    active = index;
  }
  return active;
}
