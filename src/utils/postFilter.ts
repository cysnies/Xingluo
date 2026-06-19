import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * 判断文章是否可见
 * - 草稿始终排除
 * - 生产环境下，定时发布的文章在 pubDatetime 减去容差时间后才显示
 * - 开发环境下，非草稿文章始终可见，便于预览
 */
export function postFilter({ data }: CollectionEntry<"posts">) {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
}
