import { describe, expect, it } from "vitest";
import { getSearchSnippet } from "./searchClient";

describe("search result snippets", () => {
  it("prefers the matching paragraph from article content", () => {
    const snippet = getSearchSnippet(
      {
        description: "这段描述没有目标词。",
        content: `${"前文 ".repeat(80)}这里解释进程调度与上下文切换。${"后文 ".repeat(80)}`,
      },
      "进程调度",
    );
    expect(snippet).toContain("进程调度");
    expect(snippet).not.toContain("这段描述");
  });

  it("uses the description when the match only exists there", () => {
    const snippet = getSearchSnippet(
      {
        description: "文章介绍 Flexsearch 全文检索。",
        content: "正文包含其他内容。",
      },
      "Flexsearch",
    );
    expect(snippet).toContain("Flexsearch");
  });
});
