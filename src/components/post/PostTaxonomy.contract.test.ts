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
    expect(src).toContain("bg-muted/60");
    expect(src).toContain("shadow-[0_1px_2px_rgb(24_24_27/0.035)]");
    expect(src).toContain("hover:shadow-md");
    expect(src).toContain(
      "transition-[background-color,color,box-shadow] duration-200",
    );
    expect(src).not.toContain("shadow-none");
    expect(src).toContain(
      'import PostCategory from "@/components/post/PostCategory.astro"',
    );
    expect(src).toContain("<PostCategory category={category} />");
    expect(src).toContain("const tagChipClass = cn(");
    expect(src.match(/class=\{tagChipClass\}/g)?.length).toBeGreaterThanOrEqual(
      1,
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
