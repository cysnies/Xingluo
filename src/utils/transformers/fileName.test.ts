import { describe, expect, it } from "vitest";
import { transformerFileName } from "./fileName";

describe("transformerFileName", () => {
  it("centers a filename independently from language and actions", () => {
    const transformer = transformerFileName();
    const node = {
      type: "element",
      tagName: "pre",
      children: [{ type: "element", tagName: "code", children: [] }],
    };

    transformer.pre?.call(
      { options: { meta: 'filename="src/app.ts"', lang: "ts" } },
      node,
    );

    const header = node.children[0] as {
      properties: { class: string };
      children: Array<{
        properties: { class: string };
      }>;
    };
    const filename = header.children.find((child) =>
      child.properties.class.includes("xng-code-filename"),
    );

    expect(header.properties.class).toContain("relative");
    expect(filename?.properties.class).toContain("absolute left-1/2");
    expect(filename?.properties.class).toContain("-translate-x-1/2");
  });
});
