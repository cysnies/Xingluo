/**
 * 可选依赖按需打包：功能关闭时把对应 npm 包解析为空 stub，
 * 避免 Astro 静态提升条件 <script> 仍把 waline/twikoo/aplayer/dplayer 打进产物。
 * （cleanOrphanAssets 是后置清理；本插件从源头切断依赖图）
 */
import userConfig from "../../xingluo.config";

const EMPTY_JS = "export default {};\n";
/** ?url 导入期望 default 为字符串 URL */
const EMPTY_URL = "export default 'data:text/css,';\n";
const EMPTY_CSS = "/* optional dependency disabled */\n";

type StubKind = "js" | "url" | "css";

/** 精简 Vite 插件形状，避免直接依赖 vite 类型包 */
interface VitePlugin {
  name: string;
  enforce?: "pre" | "post";
  resolveId?: (id: string) => string | null | undefined;
  load?: (id: string) => string | null | undefined;
}

function buildStubMap(): Map<string, StubKind> {
  const map = new Map<string, StubKind>();
  const commentsOff = !userConfig.features?.comments?.provider;
  const aplayerOff = userConfig.features?.players?.aplayer !== true;
  const dplayerOff = userConfig.features?.players?.dplayer !== true;

  if (commentsOff) {
    map.set("@waline/client", "js");
    map.set("@waline/client/style", "url");
    map.set("twikoo", "js");
    map.set("twikoo/dist/twikoo.css", "url");
  }
  if (aplayerOff) {
    map.set("aplayer", "js");
    map.set("aplayer/dist/APlayer.min.css", "url");
  }
  if (dplayerOff) {
    map.set("dplayer", "js");
  }
  return map;
}

function bareId(id: string): string {
  return id.split("?")[0] ?? id;
}

export function optionalDepsPlugin(): VitePlugin {
  const stubs = buildStubMap();

  return {
    name: "xingluo-optional-deps",
    enforce: "pre",
    resolveId(id: string) {
      const bare = bareId(id);
      const kind = stubs.get(bare);
      if (!kind) return null;
      const suffix = id.includes("?url") ? "?url" : "";
      return `\0xingluo-optional:${bare}${suffix}`;
    },
    load(id: string) {
      if (!id.startsWith("\0xingluo-optional:")) return null;
      const rest = id.slice("\0xingluo-optional:".length);
      const isUrl = rest.endsWith("?url");
      const bare = bareId(rest);
      const kind = stubs.get(bare);
      if (!kind) return EMPTY_JS;
      if (isUrl || kind === "url") return EMPTY_URL;
      if (kind === "css") return EMPTY_CSS;
      return EMPTY_JS;
    },
  };
}
