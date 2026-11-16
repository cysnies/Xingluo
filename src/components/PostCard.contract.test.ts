import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("PostCard layout contract", () => {
  const src = readFileSync(resolve(__dirname, "PostCard.astro"), "utf8");

  it("keeps title, metadata and description in natural content flow", () => {
    expect(src).not.toMatch(/h-\[200px\]|min-h-14|min-h-15|justify-between/);
    expect(src).toContain('as="article"');
    expect(src).toContain('variant?: "featured" | "compact" | "list"');
    expect(src).toContain('density?: "default" | "compact"');
  });

  it("keeps three featured posts in a single desktop row", () => {
    const featured = readFileSync(
      resolve(__dirname, "post/FeaturedPosts.astro"),
      "utf8",
    );
    expect(featured).toContain("lg:grid-cols-3");
    expect(featured).not.toMatch(/row-span-2|auto-rows-fr/);
  });

  it("anchors card taxonomy below descriptions of different lengths", () => {
    expect(src).toContain('variant !== "list" && "flex-1"');
    expect(src).toContain('variant !== "list" && "flex flex-col"');
    expect(src).toContain("<PostTaxonomy");
    expect(src).toContain("<PostTaxonomy tags={tags} />");
    expect(src).not.toContain("<PostTaxonomy category=");
    expect(src).toContain('variant === "list" ? "mt-3" : "mt-auto pt-3"');
    expect(src).toContain('density === "compact" && "pt-2"');
  });

  it("places the category beside the date and reading time", () => {
    const meta = src.indexOf("data-post-card-meta");
    const category = src.indexOf("<PostCategory", meta);
    const separator = src.indexOf(
      '{data.category && <span aria-hidden="true">·</span>}',
      category,
    );
    const datetime = src.indexOf("<Datetime", meta);
    expect(meta).toBeGreaterThan(-1);
    expect(category).toBeGreaterThan(meta);
    expect(separator).toBeGreaterThan(category);
    expect(datetime).toBeGreaterThan(separator);
  });

  it("renders hero images as a fading right-side backdrop on every card", () => {
    expect(src).toContain("const useBackgroundHero = Boolean(heroImageSrc);");
    expect(src).toContain('"post-card__hero pointer-events-none');
    expect(src).toContain('useBackgroundHero && "md:pe-[42%]"');
    expect(src).toContain("mask-image: linear-gradient(");
    expect(src).toContain("background-position: right center");
  });

  it("does not render decorative arrows on article cards", () => {
    expect(src).not.toContain("@/assets/icons/ArrowRight.astro");
    expect(src).not.toContain("<ArrowRight");
  });

  it("supports a compact density for tag detail pages", () => {
    const tagPage = readFileSync(
      resolve(__dirname, "pageViews/TagPostListView.astro"),
      "utf8",
    );
    expect(src).toContain('density === "compact" && "md:p-5"');
    expect(src).toContain('density === "compact" && "gap-3 md:gap-4"');
    expect(tagPage).toContain('<PostCard post={post} density="compact" />');
  });
});
