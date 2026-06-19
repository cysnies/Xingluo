import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

/** 博客文章内容目录 */
export const BLOG_PATH = "src/content/posts";
/** 静态页面内容目录 */
export const PAGES_PATH = "src/content/pages";

/** 内容文件 glob 模式：启用 MDX 时收集 md+mdx，否则仅 md */
const contentPattern = config.features.mdx
  ? "**/[^_]*.{md,mdx}"
  : "**/[^_]*.md";

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
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
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
  }),
});

export const collections = { posts, pages };
