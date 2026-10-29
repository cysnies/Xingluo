import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

/** 博客文章内容目录 */
export const BLOG_PATH = "src/content/posts";
/** 静态页面内容目录 */
export const PAGES_PATH = "src/content/pages";

/** 内容树中可能出现的非默认语种子目录（与 src/i18n/lang 对齐） */
const CONTENT_LOCALE_DIRS = [
  "zh-tw",
  "en",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "pt",
  "ru",
  "ar",
  "eo",
] as const;

const DEFAULT_LOCALE = "zh-cn";

/**
 * 内容 glob：仅收集默认语种根目录 + enabledLocales 下的语种子目录，
 * 避免未启用语种示例进集合。未配置 enabledLocales 时全量。
 */
function contentPatterns(): string | string[] {
  const ext = config.features.mdx ? "{md,mdx}" : "md";
  const requested = config.features.enabledLocales;
  if (!requested || requested.length === 0) {
    return `**/[^_]*.${ext}`;
  }
  const enabled = new Set(requested);
  enabled.add(DEFAULT_LOCALE);
  const patterns: string[] = [`[^_]*.${ext}`];
  for (const loc of CONTENT_LOCALE_DIRS) {
    if (enabled.has(loc)) {
      patterns.push(`${loc}/**/[^_]*.${ext}`);
    }
  }
  return patterns;
}

const contentPattern = contentPatterns();

/** 文章集合 schema */
const posts = defineCollection({
  loader: glob({ pattern: contentPattern, base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      /**
       * 文章头图：显示在文章详情页返回按钮与标题之间。
       * image() 走 Astro 资源管线优化，字符串为 public/ 路径或外链。
       */
      heroImage: image().or(z.string()).optional(),
      /**
       * 文章头图适配方式：
       * - "cover"：裁切填充，保持宽高比（默认）
       * - "contain"：完整缩放，保持宽高比
       */
      heroImageFit: z.enum(["cover", "contain"]).optional().default("cover"),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      /** 文章写作语言；未设置时视为默认语言 */
      locale: z.string().optional(),
      /**
       * 翻译分组键：相同 translationKey 的文章互为译文。
       * 未设置时该文章独立，不参与译文分组。
       */
      translationKey: z.string().optional(),
      /** 文章分类（单值），未设置时文章不属于任何分类 */
      category: z.string().optional(),
      /**
       * 文章卡片宽度：手动指定卡片占位宽度。
       * - "full"：独占一行（卡片全宽）
       * - "half"：半宽，与其他半宽卡片同行排列
       * 未设置时根据全局 showPostCardHero 和 heroImage 自动决定。
       */
      cardWidth: z.enum(["full", "half"]).optional(),
      /**
       * 该文章是否启用评论，覆盖全局 features.comments 设置。
       * 未设置时跟随全局配置；true 强制启用、false 强制关闭。
       */
      comments: z.boolean().optional(),
    }),
});

/** 静态页面集合 schema */
const pages = defineCollection({
  loader: glob({ pattern: contentPattern, base: `./${PAGES_PATH}` }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
    /**
     * 该页面是否启用评论，覆盖全局 features.comments 设置。
     * 未设置时跟随全局配置；true 强制启用、false 强制关闭。
     */
    comments: z.boolean().optional(),
  }),
});

export const collections = { posts, pages };
