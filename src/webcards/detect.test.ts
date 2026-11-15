import { describe, expect, it } from "vitest";
import { detectPlatform } from "./detect";
import { isSafeFetchUrl } from "./safeUrl";

describe("detectPlatform", () => {
  it("recognizes GitHub repo / user / issue / pull", () => {
    expect(detectPlatform("https://github.com/withastro/astro")).toMatchObject({
      platform: "github",
      kind: "repo",
      params: { owner: "withastro", repo: "astro" },
    });
    expect(detectPlatform("https://github.com/withastro")).toMatchObject({
      platform: "github",
      kind: "user",
      params: { user: "withastro" },
    });
    expect(
      detectPlatform("https://github.com/withastro/astro/issues/1"),
    ).toMatchObject({
      platform: "github",
      kind: "issue",
      params: { number: "1" },
    });
    expect(
      detectPlatform("https://github.com/withastro/astro/pull/2"),
    ).toMatchObject({
      platform: "github",
      kind: "pull",
      params: { number: "2" },
    });
  });

  it("recognizes Hugging Face model and Bilibili video", () => {
    expect(
      detectPlatform("https://huggingface.co/google-bert/bert-base-uncased"),
    ).toMatchObject({ platform: "huggingface", kind: "model" });
    expect(
      detectPlatform("https://www.bilibili.com/video/BV1xx411c7mD"),
    ).toMatchObject({ platform: "bilibili", kind: "video" });
  });

  it("falls back to generic for unknown hosts", () => {
    expect(detectPlatform("https://astro.build/blog")).toMatchObject({
      platform: "generic",
      kind: "page",
    });
  });

  it("rejects non-http(s)", () => {
    expect(detectPlatform("ftp://example.com/a")).toBeNull();
    expect(detectPlatform("not a url")).toBeNull();
  });
});

describe("isSafeFetchUrl", () => {
  it("allows public https", () => {
    expect(isSafeFetchUrl("https://github.com/withastro/astro")).toBe(true);
    expect(isSafeFetchUrl("http://example.com")).toBe(true);
  });

  it("blocks localhost and private literals", () => {
    expect(isSafeFetchUrl("http://localhost/meta")).toBe(false);
    expect(isSafeFetchUrl("http://127.0.0.1/")).toBe(false);
    expect(isSafeFetchUrl("http://192.168.1.1/")).toBe(false);
    expect(isSafeFetchUrl("http://10.0.0.5/a")).toBe(false);
    expect(isSafeFetchUrl("http://172.16.0.1/a")).toBe(false);
    expect(isSafeFetchUrl("http://[::1]/")).toBe(false);
    expect(isSafeFetchUrl("http://169.254.169.254/latest")).toBe(false);
  });

  it("blocks credentials and non-http", () => {
    expect(isSafeFetchUrl("https://user:pass@example.com/")).toBe(false);
    expect(isSafeFetchUrl("file:///etc/passwd")).toBe(false);
  });
  it("blocks link-local metadata IPv6 and CGNAT", () => {
    expect(isSafeFetchUrl("http://[fe80::1]/")).toBe(false);
    expect(isSafeFetchUrl("http://100.64.0.1/")).toBe(false);
    expect(isSafeFetchUrl("http://0.0.0.0/")).toBe(false);
  });
});
