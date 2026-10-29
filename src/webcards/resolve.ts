import { cacheGet, cacheSet } from "./cache";
import { detectPlatform } from "./detect";
import { fetchBilibili } from "./adapters/bilibili";
import { fetchGeneric } from "./adapters/generic";
import { fetchGitHub } from "./adapters/github";
import { fetchHuggingFace } from "./adapters/huggingface";
import { fetchTwitter } from "./adapters/twitter";
import { fetchZhihu } from "./adapters/zhihu";
import { isSafeFetchUrl } from "./safeUrl";
import type { WebCardData, WebCardsConfig } from "./types";

const DEFAULTS: WebCardsConfig = {
  enabled: true,
  timeoutMs: 8000,
  cache: true,
};

/** 构建期解析 URL → 统一卡片数据（含缓存与降级） */
export async function resolveWebCard(
  rawUrl: string,
  config: Partial<WebCardsConfig> = {},
): Promise<WebCardData> {
  const cfg = { ...DEFAULTS, ...config };
  const url = rawUrl.trim();
  if (!isSafeFetchUrl(url)) {
    return {
      url,
      platform: "generic",
      kind: "page",
      title: url,
      degraded: true,
    };
  }
  const cached = cacheGet(url, cfg.cache);
  if (cached) return cached;

  const match = detectPlatform(url);
  if (!match) {
    const degraded: WebCardData = {
      url,
      platform: "generic",
      kind: "page",
      title: url,
      degraded: true,
    };
    cacheSet(url, degraded, cfg.cache);
    return degraded;
  }

  let data: WebCardData;
  try {
    switch (match.platform) {
      case "github":
        data = await fetchGitHub(match, cfg.timeoutMs);
        break;
      case "bilibili":
        data = await fetchBilibili(match, cfg.timeoutMs);
        break;
      case "zhihu":
        data = await fetchZhihu(match, cfg.timeoutMs);
        break;
      case "twitter":
        data = await fetchTwitter(match, cfg.timeoutMs);
        break;
      case "huggingface":
        data = await fetchHuggingFace(match, cfg.timeoutMs);
        break;
      default:
        data = await fetchGeneric(match, cfg.timeoutMs);
    }
  } catch {
    data = await fetchGeneric(match, cfg.timeoutMs).catch(() => ({
      url: match.url,
      platform: match.platform,
      kind: match.kind,
      title: match.url,
      degraded: true,
    }));
  }

  cacheSet(url, data, cfg.cache);
  return data;
}
