import { afterEach, describe, expect, it, vi } from "vitest";
import type { FontMode, FontsConfig } from "../types/config";

afterEach(() => {
  vi.doUnmock("../../xingluo.config");
  vi.resetModules();
});

const cases: Array<{
  name: string;
  fonts: Partial<FontsConfig>;
  mode: FontMode;
  active: string;
}> = [
  {
    name: "fixed mode overrides the legacy switcher flag",
    fonts: { mode: "fixed", family: "lxgw-wenkai-lite", showSwitcher: true },
    mode: "fixed",
    active: "lxgw-wenkai-lite",
  },
  {
    name: "default mode allows overriding the configured global font",
    fonts: { mode: "default", family: "lxgw-wenkai-lite", showSwitcher: false },
    mode: "default",
    active: "lxgw-wenkai-lite",
  },
  {
    name: "user mode starts with the system font even when family is provided",
    fonts: { mode: "user", family: "lxgw-wenkai-lite" },
    mode: "user",
    active: "system",
  },
  {
    name: "legacy family-only configurations remain selectable",
    fonts: { family: "lxgw-wenkai-lite" },
    mode: "default",
    active: "lxgw-wenkai-lite",
  },
  {
    name: "legacy hidden switchers resolve to a fixed global font",
    fonts: { family: "lxgw-wenkai-lite", showSwitcher: false },
    mode: "fixed",
    active: "lxgw-wenkai-lite",
  },
  {
    name: "omitted font settings retain the system font and reader selection",
    fonts: {},
    mode: "default",
    active: "system",
  },
];

describe("font modes", () => {
  it.each(cases)("$name", async ({ fonts, mode, active }) => {
    vi.resetModules();
    vi.doMock("../../xingluo.config", () => ({ default: { fonts } }));
    const { default: config } = await import("../config");
    const { getFontCatalog, resolveActiveFont } = await import("./resolve");

    expect(config.fonts.mode).toBe(mode);
    expect(resolveActiveFont().id).toBe(active);
    if (active === "lxgw-wenkai-lite") {
      const lite = getFontCatalog().find((font) => font.id === active);
      expect(lite?.cssUrls).toEqual([lite?.cssUrl]);
      expect(lite?.cssUrl).toMatch(/lxgwwenkailite-regular\.css$/);
    }
  });
});
