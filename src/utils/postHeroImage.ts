import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

export interface PostHeroSources {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

const sourceCache = new Map<string, Promise<PostHeroSources>>();

/** 为本地文章头图生成卡片所需的 WebP 响应式尺寸。 */
export function getPostHeroSources(
  image: ImageMetadata,
): Promise<PostHeroSources> {
  const cacheKey = `${image.src}:${image.width}x${image.height}`;
  const cached = sourceCache.get(cacheKey);
  if (cached) return cached;

  const sources = Promise.all([
    getImage({ src: image, width: 640, format: "webp", quality: 76 }),
    getImage({ src: image, width: 1200, format: "webp", quality: 80 }),
  ]).then(([small, large]) => ({
    src: large.src,
    srcSet: `${small.src} 640w, ${large.src} 1200w`,
    width: 1200,
    height: Math.round((1200 * image.height) / image.width),
  }));

  sourceCache.set(cacheKey, sources);
  return sources;
}
