import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPostsForLocale } from "@/utils/i18nPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { DEFAULT_LOCALE } from "@/i18n";
import config from "@/config";

export async function GET() {
  const posts = await getCollection("posts");
  const sortedPosts = getPostsForLocale(posts, DEFAULT_LOCALE);

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, config.site.lang),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
