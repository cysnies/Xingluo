import { fetchJson } from "../http";
import { fetchGeneric } from "./generic";
import type { PlatformMatch, WebCardData } from "../types";

function fmt(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}亿`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}万`;
  return String(n);
}

interface BiliVideoResp {
  code?: number;
  data?: {
    title?: string;
    desc?: string;
    pic?: string;
    owner?: { name?: string; mid?: number; face?: string };
    stat?: { view?: number; like?: number; danmaku?: number; reply?: number };
    bvid?: string;
  };
}

interface BiliUserResp {
  code?: number;
  data?: {
    name?: string;
    sign?: string;
    face?: string;
    mid?: number;
    level?: number;
    follower?: number;
  };
}

interface BiliArticleResp {
  code?: number;
  data?: {
    title?: string;
    summary?: string;
    banner_url?: string;
    image_urls?: string[];
    author_name?: string;
    stats?: { view?: number; like?: number; reply?: number };
  };
}

/** Bilibili：视频 / 用户 / 专栏；动态多走 OG 降级 */
export async function fetchBilibili(
  match: PlatformMatch,
  timeoutMs: number,
): Promise<WebCardData> {
  if (match.kind === "video") {
    const q = match.params.bvid
      ? `bvid=${encodeURIComponent(match.params.bvid)}`
      : `aid=${encodeURIComponent(match.params.aid || "")}`;
    const resp = await fetchJson<BiliVideoResp>(
      `https://api.bilibili.com/x/web-interface/view?${q}`,
      { timeoutMs },
    );
    const d = resp?.data;
    if (resp?.code !== 0 || !d?.title) return fetchGeneric(match, timeoutMs);
    return {
      url: match.url,
      platform: "bilibili",
      kind: "video",
      title: d.title,
      description: d.desc || undefined,
      siteName: "哔哩哔哩",
      favicon: "https://www.bilibili.com/favicon.ico",
      image: d.pic,
      author: d.owner?.name,
      authorAvatar: d.owner?.face,
      stats: [
        { key: "views", value: fmt(d.stat?.view) },
        { key: "likes", value: fmt(d.stat?.like) },
        { key: "danmaku", value: fmt(d.stat?.danmaku) },
      ],
    };
  }

  if (match.kind === "user" && match.params.mid) {
    const resp = await fetchJson<BiliUserResp>(
      `https://api.bilibili.com/x/space/acc/info?mid=${encodeURIComponent(match.params.mid)}`,
      { timeoutMs },
    );
    const d = resp?.data;
    if (resp?.code !== 0 || !d?.name) return fetchGeneric(match, timeoutMs);
    return {
      url: match.url,
      platform: "bilibili",
      kind: "user",
      title: d.name,
      description: d.sign || undefined,
      siteName: "哔哩哔哩",
      favicon: "https://www.bilibili.com/favicon.ico",
      image: d.face,
      authorAvatar: d.face,
      stats:
        d.follower != null
          ? [{ key: "followers", value: fmt(d.follower) }]
          : undefined,
    };
  }

  if (match.kind === "article" && match.params.id) {
    const resp = await fetchJson<BiliArticleResp>(
      `https://api.bilibili.com/x/article/viewinfo?id=${encodeURIComponent(match.params.id)}`,
      { timeoutMs },
    );
    const d = resp?.data;
    if (resp?.code !== 0 || !d?.title) return fetchGeneric(match, timeoutMs);
    return {
      url: match.url,
      platform: "bilibili",
      kind: "article",
      title: d.title,
      description: d.summary || undefined,
      siteName: "哔哩哔哩专栏",
      favicon: "https://www.bilibili.com/favicon.ico",
      image: d.banner_url || d.image_urls?.[0],
      author: d.author_name,
      stats: [
        { key: "views", value: fmt(d.stats?.view) },
        { key: "likes", value: fmt(d.stats?.like) },
      ],
    };
  }

  // 动态等：公开接口不稳定，OG 降级
  const og = await fetchGeneric({ ...match, platform: "bilibili" }, timeoutMs);
  return {
    ...og,
    platform: "bilibili",
    kind: match.kind,
    siteName: og.siteName || "哔哩哔哩",
  };
}
