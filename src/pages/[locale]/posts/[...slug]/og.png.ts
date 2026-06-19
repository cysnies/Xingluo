import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { loadOgFonts } from "@/utils/ogFonts";
import { renderOgImage, getPlaceholderPng } from "@/utils/renderOgImage";
import { getPostSlug } from "@/utils/getPostPaths";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getLocaleParams } from "@/i18n/staticPaths";
import config from "@/config";

/** 文章级动态 OG 图：仅在启用动态 OG 且文章未自定义 ogImage 时生成 */
export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);

  // 为每个非默认语言的文章生成 OG 图，slug 不变、locale 段绑定语言前缀
  return getLocaleParams().flatMap(({ params: { locale } }) =>
    sortedPosts
      .filter(({ data }) => !data.ogImage)
      .map((post) => ({
        params: { locale, slug: getPostSlug(post.id, post.filePath) },
        props: { post },
      }))
  );
}

export const GET: APIRoute = async ({ props, url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const { post } = props as { post: { data: { title: string; description?: string } } };
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
    fonts
  );

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
