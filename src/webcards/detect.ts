import type { PlatformMatch, WebCardKind, WebCardPlatform } from "./types";

const GITHUB_RESERVED = new Set([
  "settings",
  "notifications",
  "marketplace",
  "explore",
  "topics",
  "collections",
  "events",
  "sponsors",
  "login",
  "join",
  "pricing",
  "features",
  "security",
  "about",
  "orgs",
  "apps",
  "pulls",
  "issues",
  "codespaces",
  "account",
  "new",
  "organizations",
]);

function tryUrl(raw: string): URL | null {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u;
  } catch {
    return null;
  }
}

/**
 * 识别 URL 所属平台与资源类型。
 * 未命中专用规则时返回 generic/page。
 */
export function detectPlatform(rawUrl: string): PlatformMatch | null {
  const u = tryUrl(rawUrl);
  if (!u) return null;
  const host = u.hostname.replace(/^www\./, "").toLowerCase();
  const parts = u.pathname.split("/").filter(Boolean);
  const url = u.href;

  // GitHub
  if (host === "github.com") {
    if (parts.length === 1 && !GITHUB_RESERVED.has(parts[0]!)) {
      return {
        platform: "github",
        kind: "user",
        url,
        params: { user: parts[0]! },
      };
    }
    if (parts.length >= 2 && !GITHUB_RESERVED.has(parts[0]!)) {
      const owner = parts[0]!;
      const repo = parts[1]!.replace(/\.git$/, "");
      if (parts[2] === "pull" && parts[3]) {
        return {
          platform: "github",
          kind: "pull",
          url,
          params: { owner, repo, number: parts[3]! },
        };
      }
      if (parts[2] === "issues" && parts[3]) {
        return {
          platform: "github",
          kind: "issue",
          url,
          params: { owner, repo, number: parts[3]! },
        };
      }
      return { platform: "github", kind: "repo", url, params: { owner, repo } };
    }
  }

  // Bilibili
  if (
    host === "bilibili.com" ||
    host === "m.bilibili.com" ||
    host === "space.bilibili.com" ||
    host === "t.bilibili.com"
  ) {
    if (host === "space.bilibili.com" && parts[0]) {
      return {
        platform: "bilibili",
        kind: "user",
        url,
        params: { mid: parts[0]! },
      };
    }
    if (host === "t.bilibili.com" && parts[0]) {
      return {
        platform: "bilibili",
        kind: "dynamic",
        url,
        params: { id: parts[0]! },
      };
    }
    if (parts[0] === "video" && parts[1]) {
      const id = parts[1]!.split("?")[0]!;
      const params: Record<string, string> = {};
      if (/^BV/i.test(id)) params.bvid = id;
      else if (/^av/i.test(id)) params.aid = id.slice(2);
      else if (/^\d+$/.test(id)) params.aid = id;
      else params.bvid = id;
      return { platform: "bilibili", kind: "video", url, params };
    }
    if (parts[0] === "opus" && parts[1]) {
      return {
        platform: "bilibili",
        kind: "dynamic",
        url,
        params: { id: parts[1]! },
      };
    }
    if (parts[0] === "read" && parts[1]) {
      const id = parts[1]!.replace(/^cv/i, "");
      return { platform: "bilibili", kind: "article", url, params: { id } };
    }
  }

  // Zhihu
  if (host === "zhihu.com" || host === "zhuanlan.zhihu.com") {
    if (host === "zhuanlan.zhihu.com" && parts[0] === "p" && parts[1]) {
      return {
        platform: "zhihu",
        kind: "article",
        url,
        params: { id: parts[1]! },
      };
    }
    if (parts[0] === "people" && parts[1]) {
      return {
        platform: "zhihu",
        kind: "user",
        url,
        params: { id: parts[1]! },
      };
    }
    if (parts[0] === "org" && parts[1]) {
      return {
        platform: "zhihu",
        kind: "user",
        url,
        params: { id: parts[1]! },
      };
    }
    if (parts[0] === "question" && parts[2] === "answer" && parts[3]) {
      return {
        platform: "zhihu",
        kind: "answer",
        url,
        params: { questionId: parts[1]!, answerId: parts[3]! },
      };
    }
  }

  // X / Twitter
  if (
    host === "x.com" ||
    host === "twitter.com" ||
    host === "mobile.twitter.com" ||
    host === "mobile.x.com"
  ) {
    const statusIdx = parts.indexOf("status");
    if (statusIdx >= 1 && parts[statusIdx + 1]) {
      return {
        platform: "twitter",
        kind: "tweet",
        url,
        params: {
          user: parts[statusIdx - 1]!,
          id: parts[statusIdx + 1]!.split("?")[0]!,
        },
      };
    }
  }

  // Hugging Face
  if (host === "huggingface.co") {
    if (parts[0] === "datasets" && parts.length >= 3) {
      return {
        platform: "huggingface",
        kind: "dataset",
        url,
        params: { id: `${parts[1]}/${parts[2]}` },
      };
    }
    if (parts[0] === "spaces" && parts.length >= 3) {
      return {
        platform: "huggingface",
        kind: "space",
        url,
        params: { id: `${parts[1]}/${parts[2]}` },
      };
    }
    const hfReserved = new Set([
      "datasets",
      "spaces",
      "docs",
      "blog",
      "join",
      "login",
      "pricing",
      "models",
      "api",
      "organizations",
      "spaces",
      "datasets",
    ]);
    if (parts[0] === "models" && parts.length >= 3) {
      return {
        platform: "huggingface",
        kind: "model",
        url,
        params: { id: `${parts[1]}/${parts[2]}` },
      };
    }
    if (parts.length >= 2 && !hfReserved.has(parts[0]!)) {
      return {
        platform: "huggingface",
        kind: "model",
        url,
        params: { id: `${parts[0]}/${parts[1]}` },
      };
    }
    // 历史单段模型 id（如 bert-base-uncased）仍走模型 API
    if (parts.length === 1 && !hfReserved.has(parts[0]!)) {
      return {
        platform: "huggingface",
        kind: "model",
        url,
        params: { id: parts[0]! },
      };
    }
  }

  return {
    platform: "generic" satisfies WebCardPlatform,
    kind: "page" satisfies WebCardKind,
    url,
    params: {},
  };
}
