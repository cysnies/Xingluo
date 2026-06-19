/**
 * remark 插件：将 ```aplayer / ```dplayer 围栏代码块转换为播放器占位 div
 *
 * 围栏内容为 JSON 配置体，解析后编码进 data-config 属性，
 * 由客户端脚本（src/scripts/players.ts）在滚动到视口时懒加载实例化。
 * MD 与 MDX 走同一渲染出口，统一由本插件处理。
 */

/** remark 插件上下文与树节点（mdast），暂用宽松类型避免引入 @types/mdast */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MdastNode = any;

/** 插件选项 */
export interface RemarkPlayersOptions {
  /** 是否启用 APlayer */
  aplayer: boolean;
  /** 是否启用 DPlayer */
  dplayer: boolean;
}

/** 支持的围栏语言及其对应占位 class */
const PLAYER_LANG_MAP = {
  aplayer: "xng-aplayer",
  dplayer: "xng-dplayer",
} as const;

/**
 * 创建 remark 插件，按开关将围栏代码块转为播放器占位 div
 */
export function remarkPlayers(
  options: RemarkPlayersOptions,
): (tree: MdastNode) => void {
  // 启用的播放器语言集合
  const enabledLangs = new Set<string>();
  if (options.aplayer) enabledLangs.add("aplayer");
  if (options.dplayer) enabledLangs.add("dplayer");

  return (tree: MdastNode): void => {
    if (!tree || !Array.isArray(tree.children)) return;
    tree.children = tree.children.map((node: MdastNode): MdastNode => {
      // 仅处理围栏代码块节点
      if (node?.type !== "code") return node;
      const lang = String(node.lang ?? "").toLowerCase();
      if (!enabledLangs.has(lang)) return node;
      const className = PLAYER_LANG_MAP[lang as keyof typeof PLAYER_LANG_MAP];

      // 解析围栏内的 JSON 配置体，失败时保留原代码块以便作者排查
      let configValue: unknown;
      try {
        configValue = JSON.parse(String(node.value ?? "{}"));
      } catch {
        return node;
      }

      // 配置体编码为 URI 组件后写入 data-config，避免 HTML 转义干扰
      const encoded = encodeURIComponent(JSON.stringify(configValue));
      return {
        type: "html",
        value: `<div class="${className}" data-config="${encoded}"></div>`,
      };
    });
  };
}
