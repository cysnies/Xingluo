import { describe, expect, it } from "vitest";
import type { CollectionEntry } from "astro:content";
import {
  findTranslation,
  getPostLocale,
  getPostsForLocale,
  groupTranslations,
} from "./i18nPosts";

type Post = CollectionEntry<"posts">;

function post(partial: {
  id: string;
  locale?: string;
  translationKey?: string;
  pubDatetime?: string;
  draft?: boolean;
  title?: string;
}): Post {
  return {
    id: partial.id,
    collection: "posts",
    data: {
      title: partial.title ?? partial.id,
      description: "",
      pubDatetime: partial.pubDatetime ?? "2024-01-01T00:00:00Z",
      draft: partial.draft ?? false,
      tags: [],
      locale: partial.locale,
      translationKey: partial.translationKey,
    },
  } as unknown as Post;
}

describe("i18nPosts", () => {
  it("getPostLocale falls back to default", () => {
    expect(getPostLocale(post({ id: "a" }))).toBe("zh-cn");
    expect(getPostLocale(post({ id: "b", locale: "en" }))).toBe("en");
  });

  it("groupTranslations groups by translationKey", () => {
    const posts = [
      post({ id: "zh/hello", translationKey: "hello", locale: "zh-cn" }),
      post({ id: "en/hello", translationKey: "hello", locale: "en" }),
      post({ id: "solo" }),
    ];
    const groups = groupTranslations(posts);
    expect(groups.get("hello")?.size).toBe(2);
    expect(groups.get("__single__solo")?.size).toBe(1);
  });

  it("findTranslation returns sibling locale", () => {
    const zh = post({
      id: "zh/hello",
      translationKey: "hello",
      locale: "zh-cn",
    });
    const en = post({ id: "en/hello", translationKey: "hello", locale: "en" });
    const posts = [zh, en];
    expect(findTranslation(posts, zh, "en")?.id).toBe("en/hello");
    expect(findTranslation(posts, zh, "ja")).toBeUndefined();
  });

  it("getPostsForLocale picks locale then default fallback", () => {
    const posts = [
      post({
        id: "zh/a",
        translationKey: "a",
        locale: "zh-cn",
        pubDatetime: "2024-06-01T00:00:00Z",
      }),
      post({
        id: "en/a",
        translationKey: "a",
        locale: "en",
        pubDatetime: "2024-06-02T00:00:00Z",
      }),
      post({
        id: "zh/b",
        translationKey: "b",
        locale: "zh-cn",
        pubDatetime: "2024-05-01T00:00:00Z",
      }),
    ];
    const enList = getPostsForLocale(posts, "en");
    expect(enList.map((p) => p.id)).toEqual(["en/a", "zh/b"]);
    const zhList = getPostsForLocale(posts, "zh-cn");
    expect(zhList.map((p) => p.id)).toEqual(["zh/a", "zh/b"]);
  });
});
