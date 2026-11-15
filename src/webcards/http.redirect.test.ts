import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("node:dns/promises", () => ({
  lookup: vi.fn(async (_hostname: string, opts?: { all?: boolean }) => {
    const row = { address: "93.184.216.34", family: 4 as const };
    if (opts?.all) return [row];
    return row;
  }),
}));

import { fetchText } from "./http";
import { isSafeIpAddress } from "./safeUrl";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchText redirect SSRF guard", () => {
  it("rejects when redirect Location points to private IP", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.redirect === "manual") {
        return {
          status: 302,
          headers: {
            get: (k: string) =>
              k.toLowerCase() === "location" ? "http://127.0.0.1/secret" : null,
          },
          url: "",
          text: async () => "",
        };
      }
      throw new Error("unexpected");
    });
    vi.stubGlobal("fetch", fetchMock);
    const out = await fetchText("https://example.com/out");
    expect(out).toBeNull();
    expect(fetchMock).toHaveBeenCalled();
  });

  it("follows safe redirects and returns body", async () => {
    let hop = 0;
    const fetchMock = vi.fn(async (url: string) => {
      hop += 1;
      if (hop === 1) {
        return {
          status: 302,
          headers: {
            get: (k: string) =>
              k.toLowerCase() === "location"
                ? "https://example.com/page"
                : null,
          },
          url: "",
          text: async () => "",
        };
      }
      expect(String(url)).toContain("example.com/page");
      return {
        status: 200,
        headers: { get: () => null },
        url: "https://example.com/page",
        text: async () => "<html>ok</html>",
      };
    });
    vi.stubGlobal("fetch", fetchMock);
    const out = await fetchText("https://example.com/start");
    expect(out).toBe("<html>ok</html>");
    expect(hop).toBe(2);
  });
});

describe("isSafeIpAddress", () => {
  it("allows public IPv4 and blocks private", () => {
    expect(isSafeIpAddress("93.184.216.34")).toBe(true);
    expect(isSafeIpAddress("8.8.8.8")).toBe(true);
    expect(isSafeIpAddress("127.0.0.1")).toBe(false);
    expect(isSafeIpAddress("10.0.0.1")).toBe(false);
    expect(isSafeIpAddress("192.168.0.1")).toBe(false);
  });
});
