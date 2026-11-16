import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("TagsIndexView layout contract", () => {
  const src = readFileSync(
    resolve("src/components/pageViews/TagsIndexView.astro"),
    "utf8",
  );

  it("uses compact tag capsules", () => {
    expect(src).toContain("min-h-9");
    expect(src).toContain("px-3.5 py-1 text-sm");
  });
});
