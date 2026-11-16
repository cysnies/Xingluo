import { describe, expect, it } from "vitest";
import { getActiveHeadingIndex } from "./toc";

describe("TOC section selection", () => {
  it("handles empty content and positions before the first heading", () => {
    expect(getActiveHeadingIndex([], 80)).toBe(-1);
    expect(getActiveHeadingIndex([250, 900], 80)).toBe(0);
  });

  it("keeps the current chapter active through long sections", () => {
    expect(getActiveHeadingIndex([-1800, 400, 2300], 80)).toBe(0);
    expect(getActiveHeadingIndex([-2400, -200, 1700], 80)).toBe(1);
  });

  it("selects the latest heading at the reading line after large jumps", () => {
    expect(getActiveHeadingIndex([-3000, -1200, 80, 1400], 80)).toBe(2);
    expect(getActiveHeadingIndex([-4000, -2200, -920, -300], 80)).toBe(3);
  });

  it("recomputes correctly when scrolling backwards", () => {
    expect(getActiveHeadingIndex([-1000, -300, 600], 80)).toBe(1);
    expect(getActiveHeadingIndex([-400, 300, 1200], 80)).toBe(0);
  });
});
