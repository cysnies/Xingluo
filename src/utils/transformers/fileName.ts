/** Shiki 转换器最小类型定义（避免依赖 shiki 主包） */
interface ShikiTransformer {
  name: string;
  code?: (this: any, hast: any) => any;
}

interface FileNameTransformerOptions {
  /** 样式版本：v1 旧版、v2 新版带文件名标签 */
  style?: "v1" | "v2";
  /** 是否隐藏以点开头的文件名 */
  hideDot?: boolean;
}

/**
 * Shiki 代码块文件名显示转换器
 * 通过 ```ts filename="filename" 语法在代码块上方显示文件名标签
 */
export function transformerFileName(
  options: FileNameTransformerOptions = {}
): ShikiTransformer {
  const { style = "v2", hideDot = false } = options;

  return {
    name: "xingluo:filename",
    code(hast: any) {
      const filename = this.options.meta?.["filename"] as string | undefined;
      if (!filename) return;
      if (hideDot && filename.startsWith(".")) return;

      if (style === "v1") {
        // v1：在 pre 元素上添加 data 属性，由 CSS 处理显示
        hast.properties = {
          ...hast.properties,
          "data-filename": filename,
        };
        return;
      }

      // v2：在 pre 前插入文件名标签节点
      const labelNode = {
        type: "element",
        tagName: "span",
        properties: { class: "filename" },
        children: [{ type: "text", value: filename }],
      };
      return {
        type: "element",
        tagName: "figure",
        properties: { class: "code-figure" },
        children: [labelNode, hast],
      } as unknown as typeof hast;
    },
  };
}
