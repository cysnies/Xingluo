import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getCategoryFacets } from "./searchClient";

describe("searchClient bundle guards", () => {
  const src = readFileSync(resolve("src/scripts/searchClient.ts"), "utf8");
  const view = readFileSync(
    resolve("src/components/pageViews/SearchView.astro"),
    "utf8",
  );
  const postDetail = readFileSync(
    resolve("src/components/pageViews/PostDetailView.astro"),
    "utf8",
  );
  const buildScript = readFileSync(
    resolve("scripts/generatePagefindIndex.mjs"),
    "utf8",
  );

  it("does not import @/config or withBase into the search client", () => {
    expect(src).not.toMatch(/from\s+["']@\/config["']/);
    expect(src).not.toMatch(/from\s+["']@\/utils\/withBase["']/);
    expect(src).not.toMatch(/from\s+["']\.\.\/config["']/);
  });

  it("formats result count via {{count}} template", () => {
    expect(src).toMatch(/\{\{\s*count\s*\}\}/);
    expect(src).toMatch(/resultsTpl/);
  });

  it("loads Pagefind shards instead of a full-document FlexSearch index", () => {
    expect(src).toContain('getAssetPath("pagefind/pagefind.js")');
    expect(src).toContain("pagefind.search");
    expect(src).toContain("sub_results");
    expect(src).not.toContain("flexsearch");
    expect(buildScript).toContain("createIndex");
    expect(buildScript).toContain('rootSelector: "[data-pagefind-body]"');
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

  it("renders category facets and Pagefind sub-results", () => {
    expect(src).toContain("renderCategoryFilters");
    expect(src).toContain("record.subResults");
    expect(view).toContain('id="site-search-ui"');
    expect(view).toContain('id="search-filter-panel"');
    expect(view).toContain('id="search-filters"');
    expect(view).toContain('id="search-workspace"');
  });

  it("indexes only article bodies with language and category filters", () => {
    expect(postDetail).toContain("data-pagefind-body");
    expect(postDetail).toContain("data-pagefind-meta");
    expect(postDetail).toContain("data-pagefind-filter");
    expect(buildScript).toContain("excludeSelectors");
    expect(buildScript).toContain('"pre"');
  });

  it("builds category counts for the complete configured category set", () => {
    const facets = getCategoryFacets(
      ["文档", "随笔", "公告"],
      [{ category: "文档" }, { category: "公告" }, { category: "文档" }],
    );
    expect(facets).toEqual(
      expect.arrayContaining([
        { category: "公告", count: 1 },
        { category: "文档", count: 2 },
        { category: "随笔", count: 0 },
      ]),
    );
  });
});
