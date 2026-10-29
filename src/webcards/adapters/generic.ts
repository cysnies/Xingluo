import { fetchText } from "../http";
import type { PlatformMatch, WebCardData } from "../types";

function meta(html: string, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const prop = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i",
    );
    const prop2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
      "i",
    );
    const m = html.match(prop) || html.match(prop2);
    if (m?.[1]) return decodeHtml(m[1]);
  }
  return undefined;
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function faviconFrom(html: string, pageUrl: string): string | undefined {
  const m =
    html.match(
      /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/i,
    ) ||
    html.match(
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["']/i,
    );
  if (!m?.[1]) {
    try {
      return new URL("/favicon.ico", pageUrl).href;
    } catch {
      return undefined;
    }
  }
  try {
    return new URL(m[1], pageUrl).href;
  } catch {
    return m[1];
  }
}

function titleFrom(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1] ? decodeHtml(m[1].trim()) : undefined;
}

/** 通用 OG / 元数据抓取 */
export async function fetchGeneric(
  match: PlatformMatch,
  timeoutMs: number,
): Promise<WebCardData> {
  const html = await fetchText(match.url, { timeoutMs });
  let host = match.url;
  try {
    host = new URL(match.url).hostname;
  } catch {
    /* keep */
  }
  if (!html) {
    return {
      url: match.url,
      platform: match.platform === "generic" ? "generic" : match.platform,
      kind: match.kind === "page" ? "page" : match.kind,
      title: host,
      siteName: host,
      degraded: true,
    };
  }
  const title =
    meta(html, "og:title", "twitter:title") || titleFrom(html) || host;
  const description =
    meta(html, "og:description", "twitter:description", "description") ||
    undefined;
  const image =
    meta(html, "og:image", "twitter:image", "twitter:image:src") || undefined;
  const siteName = meta(html, "og:site_name") || host;
  let imageAbs = image;
  if (image) {
    try {
      imageAbs = new URL(image, match.url).href;
    } catch {
      imageAbs = image;
    }
  }
  return {
    url: match.url,
    platform: match.platform === "generic" ? "generic" : match.platform,
    kind: match.kind,
    title,
    description,
    siteName,
    image: imageAbs,
    favicon: faviconFrom(html, match.url),
  };
}
