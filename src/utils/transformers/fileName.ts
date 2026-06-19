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
  /** 是否隐藏文件名前的绿色圆点 */
  hideDot?: boolean;
}

/** 不展示语言徽标的语言（无意义的高亮语言） */
const HIDDEN_LANGS = new Set(["text", "plaintext", "txt", "plain", "ansi", ""]);

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
 * Shiki 代码块头部转换器
 * 通过 ```ts filename="src/lib/utils.ts" 语法在代码块顶部显示文件名与语言徽标
 *
 * 在 pre 内部最前方注入一个 header div（作为 code 的前置兄弟节点），
 * 左侧放文件名（可选），右侧放语言徽标（可选）与复制按钮占位。
 * header 为常规文档流块级元素，不依赖绝对定位，因此不会被 pre 的
 * overflow 裁切，复制按钮也共享同一行，避免半在内半在外的错位
 */
export function transformerFileName(
  options: FileNameTransformerOptions = {},
): ShikiTransformer {
  const { hideDot = false } = options;

  return {
    name: "xingluo:filename",
    pre(node) {
      const filename = parseFileNameFromMeta(this.options?.meta);
      const lang = String(this.options?.lang ?? "").toLowerCase();
      const showLang = !HIDDEN_LANGS.has(lang);

      // header 左侧：文件名（带可选绿色圆点）
      const leftChildren: ShikiHastNode[] = [];
      if (filename) {
        const dotClass = hideDot
          ? ""
          : "before:inline-block before:size-1.5 before:rounded-full before:bg-green-500";
        leftChildren.push({
          type: "element",
          tagName: "span",
          properties: {
            class: [
              "xng-code-filename inline-flex items-center gap-1.5 font-medium text-foreground",
              dotClass,
            ]
              .filter(Boolean)
              .join(" "),
          },
          children: [{ type: "text", value: filename }],
        });
      }

      // header 右侧操作区：语言徽标 + 复制按钮（复制按钮由 postEnhancements 注入）
      const actionsChildren: ShikiHastNode[] = [];
      if (showLang) {
        actionsChildren.push({
          type: "element",
          tagName: "span",
          properties: {
            class:
              "xng-code-lang font-mono text-[0.7rem] uppercase tracking-wide text-muted-foreground",
          },
          children: [{ type: "text", value: lang }],
        });
      }

      const actions: ShikiHastNode = {
        type: "element",
        tagName: "div",
        properties: {
          class: "xng-code-actions ml-auto flex items-center gap-2",
        },
        children: actionsChildren,
      };

      // header 容器：常规文档流块级，底部边框分隔代码区
      const header: ShikiHastNode = {
        type: "element",
        tagName: "div",
        properties: {
          class:
            "xng-code-header flex items-center gap-2 border-b border-border bg-black/5 px-3 py-1.5 text-xs dark:bg-white/5",
        },
        children: [...leftChildren, actions],
      };

      // header 作为 pre 的首种子节点，置于 code 之前
      node.children = [header, ...(node.children ?? [])];
    },
  };
}
