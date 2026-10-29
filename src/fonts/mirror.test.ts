import { describe, expect, it, vi } from "vitest";

vi.mock("@/config", () => ({
  default: {
    fonts: { family: "system" },
    features: {
      googleFontsMirror: {
        enabled: true,
        url: "https://fonts.googleapis.cn",
        npmMirror: true,
      },
    },
  },
}));

import {
  maybeMirrorCssUrl,
  rewriteJsdelivrNpmToNpmmirror,
} from "./resolve";

describe("font CDN mirrors", () => {
  it("rewrites Google Fonts CSS to fonts.googleapis.cn", () => {
    const src =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap";
    expect(maybeMirrorCssUrl(src)).toBe(
      "https://fonts.googleapis.cn/css2?family=Inter:wght@400&display=swap",
    );
  });

  it("rewrites jsDelivr npm webfont to npmmirror", () => {
    const src =
      "https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.7.0/style.css";
    expect(rewriteJsdelivrNpmToNpmmirror(src)).toBe(
      "https://cdn.npmmirror.com/packages/lxgw-wenkai-lite-webfont/1.7.0/files/style.css",
    );
    expect(maybeMirrorCssUrl(src)).toContain("cdn.npmmirror.com");
  });

  it("leaves local paths untouched", () => {
    expect(maybeMirrorCssUrl("/fonts/mine.css")).toBe("/fonts/mine.css");
  });
});
