import { describe, expect, it } from "vitest";
import { createContentPatterns } from "./contentPatterns";

describe("content collection patterns", () => {
  it("collects default-language content at any depth", () => {
    const patterns = createContentPatterns("{md,mdx}", ["zh-cn", "en"]);
    expect(patterns).toContain("**/[^_]*.{md,mdx}");
  });

  it("excludes content directories for disabled locales", () => {
    const patterns = createContentPatterns("md", ["zh-cn", "en"]);
    expect(patterns).toContain("!ja/**");
    expect(patterns).toContain("!de/**");
    expect(patterns).not.toContain("!en/**");
  });

  it("collects every locale when the enabled list is omitted", () => {
    expect(createContentPatterns("md")).toBe("**/[^_]*.md");
    expect(createContentPatterns("md", [])).toBe("**/[^_]*.md");
  });
});
