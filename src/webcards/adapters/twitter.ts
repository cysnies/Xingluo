import { fetchJson } from "../http";
import { fetchGeneric } from "./generic";
import type { PlatformMatch, WebCardData } from "../types";

interface FxTweet {
  tweet?: {
    text?: string;
    author?: { name?: string; screen_name?: string; avatar_url?: string };
    likes?: number;
    retweets?: number;
    replies?: number;
    media?: { photos?: { url?: string }[]; videos?: { thumbnail_url?: string }[] };
  };
}

function fmt(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

/** X 推文：优先 fxtwitter 构建期 JSON，其次 publish.twitter.com oEmbed，再 OG */
export async function fetchTwitter(
  match: PlatformMatch,
  timeoutMs: number,
): Promise<WebCardData> {
  const id = match.params.id;
  if (id) {
    const fx = await fetchJson<FxTweet>(`https://api.fxtwitter.com/status/${id}`, {
      timeoutMs,
    });
    const t = fx?.tweet;
    if (t?.text) {
      const img =
        t.media?.photos?.[0]?.url || t.media?.videos?.[0]?.thumbnail_url || t.author?.avatar_url;
      return {
        url: match.url,
        platform: "twitter",
        kind: "tweet",
        title: t.author?.name
          ? `${t.author.name} (@${t.author.screen_name || ""})`
          : "Post on X",
        description: t.text.slice(0, 280),
        siteName: "X",
        favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
        image: img,
        author: t.author?.screen_name ? `@${t.author.screen_name}` : undefined,
        authorAvatar: t.author?.avatar_url,
        stats: [
          { key: "likes", value: fmt(t.likes) },
          { key: "reposts", value: fmt(t.retweets) },
          { key: "replies", value: fmt(t.replies) },
        ],
      };
    }
  }

  // oEmbed（构建期）
  const oembedUrl = `https://publish.twitter.com/oembed?omit_script=true&url=${encodeURIComponent(match.url)}`;
  const oembed = await fetchJson<{ author_name?: string; html?: string; url?: string }>(
    oembedUrl,
    { timeoutMs },
  );
  if (oembed?.html) {
    const text = oembed.html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 280);
    return {
      url: match.url,
      platform: "twitter",
      kind: "tweet",
      title: oembed.author_name || "X",
      description: text || undefined,
      siteName: "X",
      favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
    };
  }

  const og = await fetchGeneric({ ...match, platform: "twitter" }, timeoutMs);
  return { ...og, platform: "twitter", kind: "tweet", siteName: og.siteName || "X" };
}
