import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("post category chip", () => {
  const src = readFileSync(resolve(__dirname, "PostCategory.astro"), "utf8");

  it("renders the category like the other card metadata", () => {
    expect(src).toContain("data-post-card-category");
    expect(src).toContain("data-taxonomy-category");
    expect(src).toContain("text-xs leading-normal text-muted-foreground");
    expect(src).not.toContain("bg-muted");
    expect(src).not.toContain("shadow-xs");
    expect(src).not.toContain("h-7");
    expect(src).toContain("tplStr(t.post.categoryLabel, { category })");
  });
});
