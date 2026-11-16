import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("post taxonomy chips", () => {
  const src = readFileSync(resolve(__dirname, "PostTaxonomy.astro"), "utf8");

  it("uses one compact chip surface for categories and tags", () => {
    expect(src).toContain("const chipClass =");
    expect(src).toContain("h-7");
    expect(src).toContain("rounded-md");
    expect(src).toContain("shadow-xs");
    expect(src.match(/shadow-none/g)?.length).toBeGreaterThanOrEqual(2);
    expect(src).toContain(
      'import PostCategory from "@/components/post/PostCategory.astro"',
    );
    expect(src).toContain("<PostCategory category={category} />");
    expect(src.match(/class=\{cn\(chipClass/g)?.length).toBeGreaterThanOrEqual(
      2,
    );
  });

  it("collapses tags only after the single row genuinely overflows", () => {
    expect(src).toContain("row.scrollWidth <= row.clientWidth");
    expect(src).toContain(
      'querySelectorAll<HTMLElement>("[data-taxonomy-tag]")',
    );
    expect(src).toContain("hiddenTags.unshift");
    expect(src).toContain("hiddenTags.length");
    expect(src).toContain("new ResizeObserver(() => layoutTaxonomy(row))");
    expect(src).not.toContain("overflow-hidden whitespace-nowrap");
    expect(src).toContain("data-taxonomy-overflow");
    expect(src).toContain("hidden\n      />");
    expect(src).not.toContain('cn(chipClass, "hidden shrink-0');
  });
});
