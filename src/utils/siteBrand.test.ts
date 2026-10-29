import { describe, expect, it } from "vitest";
import { getSiteDescription, getSiteTitle } from "./siteBrand";

describe("getSiteTitle / getSiteDescription", () => {
  it("uses titleByLocale for en and falls back for zh-cn", () => {
    expect(getSiteTitle("en")).toBe("Xingluo");
    expect(getSiteTitle("zh-cn")).toBe("星罗");
  });

  it("uses descriptionByLocale for en", () => {
    expect(getSiteDescription("en")).toMatch(/Astro/i);
    expect(getSiteDescription("zh-cn")).toMatch(/博客|CMS|Astro/i);
  });
});
