/** rehype 插件类型（避免依赖 @types/hast） */
type HastNode = any;

/**
 * 递归遍历 hast 树，将 table 节点包裹在可横向滚动的容器中
 * 避免宽表格在窄屏下溢出页面
 */
function wrapTables(node: HastNode): void {
  if (!node || !Array.isArray(node.children)) return;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (!child || child.type !== "element") {
      wrapTables(child);
      continue;
    }

    // 先处理子层，保证嵌套表格也能被包裹
    wrapTables(child);

    if (child.tagName === "table") {
      node.children[i] = {
        type: "element",
        tagName: "div",
        properties: { className: ["table-wrap", "w-full", "overflow-x-auto"] },
        children: [child],
      };
    }
  }
}

/** rehype 插件：包裹正文表格为可横向滚动容器 */
export function rehypeWrapTable() {
  return (tree: HastNode) => {
    wrapTables(tree);
  };
}
