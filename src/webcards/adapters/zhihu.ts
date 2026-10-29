import { fetchGeneric } from "./generic";
import type { PlatformMatch, WebCardData } from "../types";

/**
 * 知乎：公开 API / 反爬严格，构建期以 OG 元数据为主；
 * 仍标注 platform/kind 以便 UI 区分类型。
 */
export async function fetchZhihu(
  match: PlatformMatch,
  timeoutMs: number,
): Promise<WebCardData> {
  const og = await fetchGeneric({ ...match, platform: "zhihu" }, timeoutMs);
  const site =
    match.kind === "article"
      ? "知乎专栏"
      : match.kind === "answer"
        ? "知乎回答"
        : match.kind === "user"
          ? "知乎用户"
          : "知乎";
  return {
    ...og,
    platform: "zhihu",
    kind: match.kind,
    siteName: og.siteName || site,
    favicon: og.favicon || "https://static.zhihu.com/heifetz/favicon.ico",
    degraded: og.degraded || !og.description,
  };
}
