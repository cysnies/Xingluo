import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("theme-data contract", () => {
  it("verifyThemeData.mjs passes", () => {
    const out = execFileSync("node", ["scripts/verifyThemeData.mjs"], {
      encoding: "utf8",
      cwd: resolve("."),
    });
    expect(out).toMatch(/OK/);
  });

  it("shared CSS maps shadow tokens for uiStyle", () => {
    const css = readFileSync(resolve("src/styles/global.css"), "utf8");
    expect(css).toMatch(/--shadow-xs:\s*var\(--app-shadow-xs\)/);
    expect(css).toMatch(/--shadow-md:\s*var\(--app-shadow-md\)/);
  });

  it("typography follows theme tokens instead of a fixed zinc prose scale", () => {
    const css = readFileSync(resolve("src/styles/typography.css"), "utf8");
    expect(css).not.toMatch(/@apply[^;]*prose-zinc/);
    expect(css).toMatch(/--tw-prose-body:\s*var\(--foreground\)/);
  });
});
