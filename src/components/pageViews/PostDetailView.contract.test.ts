import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("PostDetail content alignment", () => {
  const src = readFileSync(resolve(__dirname, "PostDetailView.astro"), "utf8");
  const typography = readFileSync(
    resolve(__dirname, "../../styles/typography.css"),
    "utf8",
  );

  it("centers the prose group between the page edge and table of contents", () => {
    expect(src).toContain(
      'class="mx-auto flex w-full max-w-[46rem] flex-col gap-5"',
    );
    expect(src).toContain("--prose-width: 46rem");
    expect(src).toContain('class="mx-auto mb-6 w-full max-w-[46rem]"');
    expect(src).toContain('class:list={["lg:grid",');
  });

  it("keeps equal article, taxonomy and share spacing", () => {
    expect(src).toContain("gap-5");
    expect(src).toContain('class="flex flex-col gap-6"');
    expect(src).not.toContain("lg:grid lg:gap-10");
    expect(src).not.toContain('class="mt-3 flex flex-wrap items-center gap-3"');
  });

  it("ends the sticky table of contents before adjacent posts", () => {
    const aside = src.indexOf("data-toc-scroll");
    const adjacentPosts = src.indexOf("<AdjacentPostNav");
    expect(aside).toBeGreaterThan(-1);
    expect(adjacentPosts).toBeGreaterThan(aside);
    expect(src).toContain('hasToc && "lg:max-w-[calc(100%-16rem)]"');
  });

  it("removes quote glyphs while keeping the quote block styling", () => {
    expect(typography).toContain("prose-blockquote:before:content-none");
    expect(typography).toContain("prose-blockquote:after:content-none");
    expect(typography).toContain("prose-blockquote:border-l-primary/40");
  });
});
