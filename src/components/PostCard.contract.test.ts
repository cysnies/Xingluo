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
    expect(src).toContain('variant === "list" ? "mt-3" : "mt-auto pt-3"');
  });
});
