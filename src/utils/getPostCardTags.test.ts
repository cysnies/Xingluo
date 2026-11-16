import { describe, expect, it } from "vitest";
import { getPostCardTags } from "./getPostCardTags";

describe("post card taxonomy", () => {
  it("removes the category and duplicate tags while preserving order", () => {
    expect(getPostCardTags(["文档", "入门", "入门", "部署"], "文档")).toEqual({
      visible: ["入门", "部署"],
      hidden: [],
    });
  });

  it("keeps every unique tag available for client-side layout", () => {
    expect(getPostCardTags(["Astro", "CSS", "MDX", "CSS", "UI"])).toEqual({
      visible: ["Astro", "CSS", "MDX", "UI"],
      hidden: [],
    });
  });

  it("supports missing tags and a category without modifying the source", () => {
    const tags = ["文档"];
    expect(getPostCardTags(tags, "文档")).toEqual({ visible: [], hidden: [] });
    expect(tags).toEqual(["文档"]);
    expect(getPostCardTags([])).toEqual({ visible: [], hidden: [] });
  });
});
