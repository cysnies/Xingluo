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
});
