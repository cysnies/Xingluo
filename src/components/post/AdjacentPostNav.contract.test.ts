import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("AdjacentPostNav card style", () => {
  const src = readFileSync(resolve(__dirname, "AdjacentPostNav.astro"), "utf8");

  it("uses the related-post card surface instead of the generic button style", () => {
    expect(src).toContain('import Card from "@/components/ui/Card.astro"');
    expect(src).not.toContain("@/components/ui/Button.astro");
    expect(src).toContain("rounded-xl border-border/80 p-0 shadow-none");
    expect(src).toContain("hover:border-muted-foreground/50 hover:shadow-xs");
  });
});
