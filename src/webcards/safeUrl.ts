/**
 * 构建期 fetch 的 URL 安全校验，降低 SSRF 风险。
 * 拒绝非 http(s)、本机名、链路本地与常见私网字面量。
 * 域名请求请配合 isSafeResolvedHostname（dns.lookup）校验解析结果。
 *
 * 信任边界（TOCTOU）：lookup 与后续 fetch 非原子，恶意 DNS 仍可能在间隙改指私网。
 * 星罗假设构建机网络与内容源相对可信；不可信 Markdown 源请在隔离环境构建，
 * 或自行改为「解析后对 IP 建连」（pin-IP，成本更高）。详见 docs/zh-cn/webcards.md。
 */

const BLOCKED_HOSTS = new Set([
  "localhost",
  "localhost.",
  "metadata.google.internal",
  "metadata",
]);

/** IPv4 私网 / 特殊用途粗检 */
export function isBlockedIpv4(host: string): boolean {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;
  const parts = m.slice(1).map((x) => Number(x));
  if (parts.some((n) => n > 255)) return true;
  const [a, b] = parts as [number, number, number, number];
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast / reserved
  return false;
}

export function isBlockedIpv6(host: string): boolean {
  const h = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (h === "::" || h === "::1") return true;
  if (h.startsWith("fc") || h.startsWith("fd")) return true; // ULA 粗检
  if (h.startsWith("fe80")) return true;
  if (h.startsWith("::ffff:")) {
    const v4 = h.slice("::ffff:".length);
    return isBlockedIpv4(v4);
  }
  return false;
}

/**
 * @returns true 表示允许构建期请求该 URL
 */
export function isSafeFetchUrl(raw: string): boolean {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  // 用户信息易被用于混淆，直接拒绝
  if (u.username || u.password) return false;

  const host = u.hostname.replace(/\.$/, "").toLowerCase();
  if (!host) return false;
  if (BLOCKED_HOSTS.has(host)) return false;
  if (host.endsWith(".localhost") || host.endsWith(".local")) return false;
  if (host.endsWith(".internal") || host.endsWith(".lan")) return false;

  if (isBlockedIpv4(host)) return false;
  if (host.includes(":")) {
    if (isBlockedIpv6(host)) return false;
  }

  return true;
}

/** 字面量 IP 是否允许作为构建期请求目标 */
export function isSafeIpAddress(ip: string): boolean {
  const h = ip.replace(/^\[|\]$/g, "").toLowerCase();
  if (!h) return false;
  if (isBlockedIpv4(h)) return false;
  if (h.includes(":") && isBlockedIpv6(h)) return false;
  // 纯域名不应走此函数；非 IP 形态视为不安全
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(h) && !h.includes(":")) return false;
  return true;
}
