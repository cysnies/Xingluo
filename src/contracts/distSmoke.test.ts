/**
 * 构建产物冒烟（无需 Playwright）：有 dist 时校验关键 a11y/i18n/主题。
 * 无 dist 时跳过，避免打断未构建的本地 vitest。
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const dist = resolve("dist");
const hasDist = existsSync(resolve(dist, "index.html"));

describe.skipIf(!hasDist)("dist smoke", () => {
  it("EN home uses Xingluo brand and zinc palette by default", () => {
    const html = readFileSync(resolve(dist, "en/index.html"), "utf8");
    expect(html).toContain("Xingluo");
    expect(html).toMatch(/data-palette="zinc"/);
    expect(html).toMatch(/data-ui-style="new-york"/);
    // accent=none 时不写 data-accent
    expect(html).not.toMatch(/data-accent=/);
  });

  it("search clear button uses clearSearch label", () => {
    const html = readFileSync(resolve(dist, "en/search/index.html"), "utf8");
    expect(html).toContain('aria-label="Clear search"');
    expect(html).toContain("data-results-tpl");
  });

  it("theme toggle keeps readable aria-label", () => {
    const html = readFileSync(resolve(dist, "en/index.html"), "utf8");
    expect(html).toMatch(/id="theme-btn"[^>]*aria-label="Toggle theme"/);
    expect(html).toMatch(/aria-pressed=/);
  });

  it("shared CSS exposes uiStyle shadow tokens used by utilities", () => {
    const files = readdirSync(resolve(dist, "_astro")).filter(
      (f) => f.startsWith("Footer") && f.endsWith(".css"),
    );
    expect(files.length).toBeGreaterThan(0);
    const css = readFileSync(resolve(dist, "_astro", files[0]!), "utf8");
    expect(css).toMatch(/data-ui-style=["']?default["']?/);
    expect(css).toMatch(/--shadow-xs:/);
    // Tailwind @theme 映射后，utility 应消费 var(--shadow-xs)
    expect(css).toMatch(/\.shadow-xs\{[^}]*var\(--app-shadow-xs\)/);
  });
});
