/** Shiki 转换器最小类型定义（避免依赖 shiki 主包） */
interface ShikiHastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: ShikiHastNode[];
  value?: string;
}

interface ShikiTransformer {
  name: string;
  // 使用 any 以兼容 @shikijs/types 的 ShikiTransformer，避免类型耦合
  pre?: (this: any, node: any) => any;
}

interface FileNameTransformerOptions {
  /** 样式版本：v1 旧版标签式、v2 新版带边框徽标 */
  style?: "v1" | "v2";
  /** 是否隐藏文件名前的绿色圆点 */
  hideDot?: boolean;
}

/** 从 meta 原始字符串解析文件名，兼容 file= 与 filename= 两种写法 */
function parseRawMeta(raw: string): string | undefined {
  for (const item of raw.split(/\s+/)) {
    const [key, value] = item.split("=");
    if ((key === "file" || key === "filename") && value) {
      return value.replace(/["'`]/g, "");
    }
  }
  return undefined;
}

/** 从 meta 解析文件名，兼容字符串与对象两种形态 */
function parseFileNameFromMeta(meta: unknown): string | undefined {
  if (!meta) return undefined;

  // 字符串形态：直接解析
  if (typeof meta === "string") {
    return parseRawMeta(meta);
  }

  // 对象形态：优先取已解析字段，再回退 __raw
  if (typeof meta === "object") {
    const obj = meta as Record<string, unknown>;
    if (typeof obj.filename === "string") return obj.filename;
    if (typeof obj.file === "string") return obj.file;
    if (typeof obj.__raw === "string") return parseRawMeta(obj.__raw);
  }

  return undefined;
}

/**
 * Shiki 代码块文件名显示转换器
 * 通过 ```ts filename="src/lib/utils.ts" 语法在代码块上方显示文件名标签
 * 并写入 --file-name-offset 变量，供复制按钮与文件名标签共享垂直定位
 */
export function transformerFileName(
  options: FileNameTransformerOptions = {}
): ShikiTransformer {
  const { style = "v2", hideDot = false } = options;

  return {
    name: "xingluo:filename",
    pre(node) {
      const filename = parseFileNameFromMeta(this.options?.meta);
      if (!filename) return;
      if (hideDot && filename.startsWith(".")) return;

      // 写入垂直偏移变量：复制按钮与文件名标签共用
      const offset = style === "v1" ? "0.75rem" : "-0.75rem";
      const existingStyle = (node.properties?.style as string | undefined) ?? "";
      node.properties = {
        ...node.properties,
        style: `${existingStyle}--file-name-offset: ${offset};`,
      };

      this.addClassToHast?.(node, "relative mt-8");

      // 文件名标签：绝对定位于代码块，依据样式版本调整外观
      const dotClass = hideDot
        ? "px-2"
        : "pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2";
      const positionClass =
        style === "v1"
          ? "left-0 -top-6 rounded-t-md border border-b-0 bg-muted/50"
          : "left-2 top-(--file-name-offset) border rounded-md bg-background";

      const labelNode: ShikiHastNode = {
        type: "element",
        tagName: "span",
        properties: {
          class: [
            "absolute z-10 py-1 font-medium leading-4 text-xs text-foreground",
            dotClass,
            positionClass,
          ],
        },
        children: [{ type: "text", value: filename }],
      };

      node.children = [...(node.children ?? []), labelNode];
    },
  };
}
