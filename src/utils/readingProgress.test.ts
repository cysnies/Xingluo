import { describe, expect, it } from "vitest";
import { getReadingProgress } from "./readingProgress";

describe("article reading progress", () => {
  it("starts at the article and completes when its bottom is visible", () => {
    expect(getReadingProgress(80, 1000, 600)).toBe(0);
    expect(getReadingProgress(-160, 1000, 600)).toBe(0.5);
    expect(getReadingProgress(-400, 1000, 600)).toBe(1);
  });
  it("clamps positions before and after the article", () => {
    expect(getReadingProgress(400, 1000, 600)).toBe(0);
    expect(getReadingProgress(-2000, 1000, 600)).toBe(1);
  });
  it("handles short articles without dividing by zero", () => {
    expect(getReadingProgress(300, 200, 600)).toBe(1);
    expect(getReadingProgress(500, 200, 600)).toBe(0);
    expect(getReadingProgress(80, 520, 600)).toBe(1);
  });
});
