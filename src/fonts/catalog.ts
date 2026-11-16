/**
 * 内置开源字体目录（CJK 友好）
 *
 * 加载策略：
 * - system：零网络请求，依赖本机/系统字体栈
 * - cdn：按需注入 <link>，不打进构建产物，避免全量 CJK 字库拖垮体积
 * - local：用户把 CSS 放到 public/ 或自行托管后填写 cssUrl（可为相对路径）
 *
 * 授权均为常见开源字体许可（以 OFL-1.1 为主）。
 * 文泉驿因 GPL 嵌入义务且无稳定官方 Web 子集 CDN，不作为内置项（见 docs/zh-cn/fonts.md）。
 */

/** 字体来源 */
export type FontSource = "system" | "cdn" | "local";

/** 单条字体定义 */
export interface FontDefinition {
  /** 配置用 id */
  id: string;
  /** 展示名 */
  label: string;
  /** CSS font-family 主名（用于 --font-sans） */
  family: string;
  /** 完整字体栈（含回退） */
  stack: string;
  /** 加载来源 */
  source: FontSource;
  /**
   * 样式表 URL：cdn 用绝对地址；local 可用 /fonts/xxx.css
   * system 无需填写
   */
  cssUrl?: string;
  /** 需要同时加载多份字体样式表时使用（例如只加载指定字重） */
  cssUrls?: string[];
  /** 可选等宽栈（代码块），省略则沿用全局 --font-mono */
  monoStack?: string;
  /** 许可说明 */
  license: string;
  /** 备注（体积、替代关系等） */
  note?: string;
}

/**
 * 内置字体列表。切换时只加载当前启用字体的 cssUrl。
 * 可在 xingluo.config.ts 的 fonts.fonts 中追加自定义项（同 id 覆盖）。
 */
export const BUILTIN_FONTS: FontDefinition[] = [
  {
    id: "system",
    label: "System",
    family: "system-ui",
    stack:
      'system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif',
    source: "system",
    license: "System",
    note: "默认方案：零额外请求；回退 PingFang / 雅黑 / Noto 等常见系统 CJK",
  },
  {
    id: "lxgw-wenkai",
    label: "LXGW WenKai",
    family: "LXGW WenKai",
    stack: '"LXGW WenKai", "LXGW WenKai Lite", "KaiTi", "STKaiti", serif',
    source: "cdn",
    cssUrl: "https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css",
    monoStack: '"LXGW WenKai Mono", ui-monospace, monospace',
    license: "OFL-1.1",
    note: "楷体风格；CDN 分包；默认经 npmmirror 镜像（见 googleFontsMirror）",
  },
  {
    id: "lxgw-wenkai-lite",
    label: "LXGW WenKai Lite",
    family: "LXGW WenKai Lite",
    stack: '"LXGW WenKai Lite", "LXGW WenKai", "KaiTi", serif',
    source: "cdn",
    cssUrl:
      "https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.7.0/lxgwwenkailite-regular.css",
    cssUrls: [
      "https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.7.0/lxgwwenkailite-regular.css",
    ],
    monoStack:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    license: "OFL-1.1",
    note: "文楷精简版；仅加载常规字重，粗体由浏览器合成以避免重复下载 CJK 子集",
  },
  {
    id: "lxgw-wenkai-screen",
    label: "LXGW WenKai Screen",
    family: "LXGW WenKai Screen",
    stack: '"LXGW WenKai Screen", "LXGW WenKai", "KaiTi", serif',
    source: "cdn",
    cssUrl:
      "https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css",
    license: "OFL-1.1",
    note: "屏幕阅读优化版文楷",
  },
  {
    id: "source-han-sans",
    label: "Noto Sans SC",
    family: "Noto Sans SC",
    stack:
      '"Noto Sans SC", "Source Han Sans SC", "Source Han Sans CN", "PingFang SC", sans-serif',
    source: "cdn",
    cssUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap",
    license: "OFL-1.1",
    note: "思源黑体等价；默认经 fonts.googleapis.cn 镜像",
  },
  {
    id: "source-han-serif",
    label: "Noto Serif SC",
    family: "Noto Serif SC",
    stack:
      '"Noto Serif SC", "Source Han Serif SC", "Source Han Serif CN", "Songti SC", serif',
    source: "cdn",
    cssUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap",
    license: "OFL-1.1",
    note: "思源宋体等价；默认经 fonts.googleapis.cn 镜像",
  },
  {
    id: "inter",
    label: "Inter",
    family: "Inter",
    stack:
      'Inter, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif',
    source: "cdn",
    cssUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    license: "OFL-1.1",
    note: "西文无衬线；默认经 fonts.googleapis.cn 镜像",
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    family: "JetBrains Mono",
    stack:
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    source: "cdn",
    cssUrl:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
    monoStack:
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    license: "OFL-1.1",
    note: "等宽；默认经 fonts.googleapis.cn；正文建议另选 CJK 或 system",
  },
];

/** 按 id 索引内置字体 */
export const BUILTIN_FONT_MAP: Record<string, FontDefinition> =
  Object.fromEntries(BUILTIN_FONTS.map((f) => [f.id, f]));
