import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { WebCardData } from "./types";

const MEM = new Map<string, WebCardData>();
const CACHE_DIR = join(process.cwd(), ".cache", "webcards");

function keyOf(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 32);
}

/**
 * 是否启用磁盘缓存。
 * - 调用方传入 false → 关
 * - XINGLUO_WEBCARDS_CACHE=0|false → 关
 * - CI=true 且未显式 XINGLUO_WEBCARDS_CACHE=1|true → 关（避免陈旧元数据）
 * - 其余按调用方 enabled
 */
export function isDiskCacheEnabled(enabled: boolean): boolean {
  if (!enabled) return false;
  const env = (process.env.XINGLUO_WEBCARDS_CACHE || "").toLowerCase();
  if (env === "0" || env === "false" || env === "off") return false;
  if (env === "1" || env === "true" || env === "on") return true;
  if ((process.env.CI || "").toLowerCase() === "true") return false;
  return true;
}

export function cacheGet(url: string, enabled: boolean): WebCardData | null {
  const hit = MEM.get(url);
  if (hit) return hit;
  if (!isDiskCacheEnabled(enabled)) return null;
  try {
    const path = join(CACHE_DIR, `${keyOf(url)}.json`);
    if (!existsSync(path)) return null;
    const data = JSON.parse(readFileSync(path, "utf8")) as WebCardData;
    MEM.set(url, data);
    return data;
  } catch {
    return null;
  }
}

export function cacheSet(
  url: string,
  data: WebCardData,
  enabled: boolean,
): void {
  MEM.set(url, data);
  if (!isDiskCacheEnabled(enabled)) return;
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(
      join(CACHE_DIR, `${keyOf(url)}.json`),
      JSON.stringify(data),
      "utf8",
    );
  } catch {
    /* 缓存失败不影响构建 */
  }
}
