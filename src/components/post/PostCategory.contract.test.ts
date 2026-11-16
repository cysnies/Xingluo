import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("post category chip", () => {
  const src = readFileSync(resolve(__dirname, "PostCategory.astro"), "utf8");

  it("renders a compact, consistently shadowed category link", () => {
    expect(src).toContain("data-post-card-category");
    expect(src).toContain("data-taxonomy-category");
    expect(src).toContain("h-7");
    expect(src).toContain("bg-muted");
    expect(src).toContain("shadow-xs");
    expect(src).toContain("tplStr(t.post.categoryLabel, { category })");
  });
});
