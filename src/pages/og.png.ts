import type { APIRoute } from "astro";
import { loadOgFonts } from "@/utils/ogFonts";
import { renderOgImage, getPlaceholderPng } from "@/utils/renderOgImage";
import config from "@/config";

/** 站点级动态 OG 图：渲染站点标题与描述 */
export const GET: APIRoute = async ({ url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

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
      title: config.site.title,
      subtitle: config.site.description,
      hostname,
      label: config.site.author,
    },
    fonts,
  );

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
