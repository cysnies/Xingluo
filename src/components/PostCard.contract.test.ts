import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("PostCard layout contract", () => {
  const src = readFileSync(resolve(__dirname, "PostCard.astro"), "utf8");

  it("overrides Card default py-6/gap-6 for fixed-height row", () => {
    expect(src).toMatch(/h-\[200px\]/);
    expect(src).toMatch(/\bpy-0\b/);
    expect(src).toMatch(/\bgap-0\b/);
  });
});
