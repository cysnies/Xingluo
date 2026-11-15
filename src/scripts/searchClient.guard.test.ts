import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("searchClient bundle guards", () => {
  const src = readFileSync(resolve("src/scripts/searchClient.ts"), "utf8");

  it("does not import @/config or withBase (prevents 60KB+ client pull-in)", () => {
    expect(src).not.toMatch(/from\s+["']@\/config["']/);
    expect(src).not.toMatch(/from\s+["']@\/utils\/withBase["']/);
    expect(src).not.toMatch(/from\s+["']\.\.\/config["']/);
  });

  it("formats result count via {{count}} template", () => {
    expect(src).toMatch(/\{\{\s*count\s*\}\}/);
    expect(src).toMatch(/resultsTpl/);
  });
});
