import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { initScrollReveal } from "./scrollReveal";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("scroll reveal", () => {
  it("keeps content visible before animation initialization", () => {
    const css = readFileSync("src/styles/global.css", "utf8");
    const defaultRule = css.match(/^\[data-reveal\] \{([^}]+)\}/m)?.[1];
    expect(defaultRule).toMatch(/opacity:\s*1;/);
    expect(defaultRule).toMatch(/transform:\s*translateY\(0\);/);
    expect(css).toMatch(/\[data-reveal\]\.reveal-pending\s*\{\s*opacity:\s*0;/);
  });

  it("hides observed targets until they enter the viewport", () => {
    const target = { classList: { add: vi.fn() } };
    const observe = vi.fn();
    const unobserve = vi.fn();
    let notify: IntersectionObserverCallback;

    vi.stubGlobal("document", {
      querySelectorAll: () => [target],
    });
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe = observe;
        unobserve = unobserve;
        disconnect = vi.fn();

        constructor(callback: IntersectionObserverCallback) {
          notify = callback;
        }
      },
    );

    initScrollReveal();
    expect(observe).toHaveBeenCalledWith(target);
    expect(target.classList.add).toHaveBeenCalledWith("reveal-pending");

    notify!(
      [
        {
          isIntersecting: true,
          target,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
    expect(target.classList.add).toHaveBeenCalledWith("is-visible");
    expect(unobserve).toHaveBeenCalledWith(target);
  });

  it("keeps content visible when IntersectionObserver is unavailable", () => {
    const target = { classList: { add: vi.fn() } };
    vi.stubGlobal("document", {
      querySelectorAll: () => [target],
    });
    vi.stubGlobal("IntersectionObserver", undefined);

    expect(() => initScrollReveal()).not.toThrow();
    expect(target.classList.add).not.toHaveBeenCalled();
  });
});
