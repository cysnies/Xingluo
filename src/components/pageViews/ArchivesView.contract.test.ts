import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("ArchivesView layout contract", () => {
  const src = readFileSync(resolve(__dirname, "ArchivesView.astro"), "utf8");

  it("opens every year group and reuses the regular post cards", () => {
    expect(src).toMatch(/<details[\s\S]*?open\s*>/);
    expect(src).not.toContain("currentYear");
    expect(src).toContain("<PostCard post={post} />");
    expect(src).toContain('class="grid grid-cols-1 gap-4 md:grid-cols-2"');
  });
});
