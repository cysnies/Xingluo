import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("searchClient bundle guards", () => {
  const src = readFileSync(resolve("src/scripts/searchClient.ts"), "utf8");
  const view = readFileSync(
    resolve("src/components/pageViews/SearchView.astro"),
    "utf8",
  );

  it("does not import @/config or withBase (prevents 60KB+ client pull-in)", () => {
    expect(src).not.toMatch(/from\s+["']@\/config["']/);
    expect(src).not.toMatch(/from\s+["']@\/utils\/withBase["']/);
    expect(src).not.toMatch(/from\s+["']\.\.\/config["']/);
  });

  it("formats result count via {{count}} template", () => {
    expect(src).toMatch(/\{\{\s*count\s*\}\}/);
    expect(src).toMatch(/resultsTpl/);
  });

  it("uses language-aware CJK indexing and exact candidate ranking", () => {
    expect(src).toContain("new Intl.Segmenter");
    expect(src).toContain('return "CJK"');
    expect(src).toContain("encoder: createSearchEncoder(state.locale)");
    expect(src).toContain("rankSearchDocs");
  });

  it("supports keyboard result navigation and clear-on-escape", () => {
    expect(src).toContain('event.key === "ArrowDown"');
    expect(src).toContain('event.key === "ArrowUp"');
    expect(src).toContain('event.key === "Escape"');
    expect(src).toContain("focusSearchResult");
  });

  it("exposes search input and live-result semantics", () => {
    expect(view).toContain('aria-controls="search-results"');
    expect(view).toContain('aria-describedby="search-stats"');
    expect(view).toContain('aria-autocomplete="list"');
    expect(view).toContain('role="status"');
  });
});
