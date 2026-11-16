import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("PostDetail content alignment", () => {
  const src = readFileSync(resolve(__dirname, "PostDetailView.astro"), "utf8");
  const typography = readFileSync(resolve(__dirname, "../../styles/typography.css"), "utf8");

  it("centers the prose group between the page edge and table of contents", () => {
    expect(src).toContain(
      'class="mx-auto flex w-full max-w-prose-app flex-col gap-5"',
    );
    expect(src).toContain('class:list={["lg:grid",');
  });

  it("uses one vertical gap and removes the first prose margin", () => {
    expect(src).toContain("gap-5");
    expect(src).not.toContain("lg:grid lg:gap-10");
    expect(src).not.toContain('class="mt-3 flex flex-wrap items-center gap-3"');
    expect(typography).toContain(".app-prose > :first-child");
    expect(typography).toContain("margin-top: 0;");
  });
});
