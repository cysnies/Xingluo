import { join } from "node:path";
import { describe, expect, it } from "vitest";
// The build script is plain ESM and does not ship TypeScript declarations.
// @ts-expect-error -- JavaScript build script
import {
  decodeHtmlEntities,
  extractSearchData,
  isPostPage,
} from "../../scripts/generateSearchIndex.mjs";

const distFile = (...segments: string[]) =>
  join(process.cwd(), "dist", ...segments);

describe("search index generation", () => {
  it("only selects article detail pages", () => {
    expect(isPostPage(distFile("posts", "guide", "index.html"))).toBe(true);
    expect(isPostPage(distFile("en", "posts", "guide", "index.html"))).toBe(
      true,
    );
    expect(isPostPage(distFile("posts", "index.html"))).toBe(false);
    expect(isPostPage(distFile("posts", "2", "index.html"))).toBe(false);
    expect(isPostPage(distFile("en", "posts", "index.html"))).toBe(false);
  });

  it("keeps the complete article body and localizes taxonomy links", () => {
    const fullBody = `${"正文".repeat(1200)} 进程调度`;
    const html = `
      <html>
        <head>
          <title>调度系统 | Xingluo</title>
          <meta name="description" content="调度说明">
        </head>
        <body>
          <a href="/en/categories/系统/">系统</a>
          <a href="/en/tags/Scheduler/">Scheduler</a>
          <article class="app-prose" id="article"><p>${fullBody}</p></article>
        </body>
      </html>
    `;

    const data = extractSearchData(
      html,
      distFile("en", "posts", "scheduler", "index.html"),
    );

    expect(data).toMatchObject({
      category: "系统",
      locale: "en",
      tags: ["Scheduler"],
      title: "调度系统",
      url: "/en/posts/scheduler/",
    });
    expect(data?.content.length).toBeGreaterThan(1800);
    expect(data?.content).toContain("进程调度");
  });

  it("rejects list pages even when they match the posts path", () => {
    const html =
      "<html><head><title>全部文章</title></head><body><main>列表</main></body></html>";
    expect(extractSearchData(html, distFile("posts", "index.html"))).toBeNull();
  });

  it("decodes numeric and named HTML entities", () => {
    expect(decodeHtmlEntities("A&amp;B &#20013; &#x6587;")).toBe("A&B 中 文");
  });
});
