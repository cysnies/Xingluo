/** 带超时与可选 Authorization 的 fetch 封装 */

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { isSafeFetchUrl, isSafeIpAddress } from "./safeUrl";

/** DNS 解析后校验全部 A/AAAA，拒绝落到私网/特殊用途地址 */
export async function isSafeResolvedHostname(hostname: string): Promise<boolean> {
  const host = hostname.replace(/\.$/, "").toLowerCase();
  if (!host) return false;
  const ipVer = isIP(host);
  if (ipVer) return isSafeIpAddress(host);
  try {
    const results = await lookup(host, { all: true, verbatim: true });
    if (!results.length) return false;
    return results.every((r) => isSafeIpAddress(r.address));
  } catch {
    return false;
  }
}

export interface FetchJsonOptions {
  timeoutMs?: number;
  headers?: Record<string, string>;
  /** 接受的 HTTP 状态；默认仅 2xx */
  okStatuses?: number[];
}

const MAX_REDIRECTS = 5;

/**
 * 安全 fetch：请求前与每次重定向后均校验 URL，避免 SSRF 二次跳转进私网。
 */
export async function fetchText(
  url: string,
  options: FetchJsonOptions = {},
): Promise<string | null> {
  if (!isSafeFetchUrl(url)) return null;
  const timeoutMs = options.timeoutMs ?? 8000;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const baseHeaders = {
    "user-agent":
      "XingluoWebCard/0.2 (+https://github.com/cysnies/Xingluo; build-time link preview)",
    accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
    ...options.headers,
  };

  try {
    let current = url.trim();
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      if (!isSafeFetchUrl(current)) return null;
      let hostname: string;
      try {
        hostname = new URL(current).hostname;
      } catch {
        return null;
      }
      if (!(await isSafeResolvedHostname(hostname))) return null;
      const res = await fetch(current, {
        signal: ctrl.signal,
        headers: baseHeaders,
        redirect: "manual",
      });

      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) return null;
        let next: string;
        try {
          next = new URL(loc, current).href;
        } catch {
          return null;
        }
        current = next;
        continue;
      }

      // 部分运行时仍可能填 res.url；再拦一道
      if (res.url && !isSafeFetchUrl(res.url)) return null;

      const ok =
        options.okStatuses?.includes(res.status) ||
        (res.status >= 200 && res.status < 300);
      if (!ok) return null;
      return await res.text();
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchJson<T>(
  url: string,
  options: FetchJsonOptions = {},
): Promise<T | null> {
  const text = await fetchText(url, {
    ...options,
    headers: {
      accept: "application/json",
      ...options.headers,
    },
  });
  if (text == null) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/** GitHub API 公共头：有 token 则带上，提高速率限制 */
export function githubHeaders(): Record<string, string> {
  const token =
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.XINGLUO_GITHUB_TOKEN ||
    "";
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
  };
  if (token) headers.authorization = `Bearer ${token}`;
  return headers;
}
