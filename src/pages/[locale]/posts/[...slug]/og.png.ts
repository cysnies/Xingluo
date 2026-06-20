import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { loadOgFonts } from "@/utils/ogFonts";
import { renderOgImage, getPlaceholderPng } from "@/utils/renderOgImage";
import { getPostSlug } from "@/utils/getPostPaths";
import { getPostsForLocale, findTranslation } from "@/utils/i18nPosts";
import { NON_DEFAULT_LOCALES } from "@/i18n/staticPaths";
import config from "@/config";

/** 文章级动态 OG 图：仅在启用动态 OG 且文章未自定义 ogImage 时生成 */
export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts");

  // 为每个非默认语言生成 OG 图，按 slug+locale 解析译文标题/描述
  return NON_DEFAULT_LOCALES.flatMap((locale) => {
    const localePosts = getPostsForLocale(posts, locale);
    return localePosts
      .filter(({ data }) => !data.ogImage)
      .map((post) => {
        const translated = findTranslation(posts, post, locale) ?? post;
        return {
          params: { locale, slug: getPostSlug(post.id, post.filePath) },
          props: { post: translated },
        };
      });
  });
}

export const GET: APIRoute = async ({ props, url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const { post } = props as {
    post: { data: { title: string; description?: string } };
  };
  const fonts = await loadOgFonts(url);
  if (!fonts) {
    // 字体不可用时回退占位图，保证端点始终输出有效文件
    return new Response(getPlaceholderPng(), {
      headers: { "Content-Type": "image/png" },
    });
  }

  const hostname = new URL(config.site.url).hostname;

  const png = await renderOgImage(
    {
      title: post.data.title,
      subtitle: post.data.description,
      hostname,
      label: config.site.author,
    },
    fonts,
  );

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
