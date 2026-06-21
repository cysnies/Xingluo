/**
 * Google Fonts 镜像源字体提供器
 *
 * 当用户无法直接访问 Google Fonts 官方 CDN 时，可使用此提供器
 * 通过自定义镜像 URL 下载字体，仅用于构建期（如 OG 图生成）。
 *
 * 实现使用 Node.js 内置 fetch API 和正则表达式解析 CSS，无外部依赖。
 */

/**
 * Astro FontProvider 接口的最小类型定义
 * 避免从 astro/config 引入（该模块未导出此类型）
 */
interface FontFaceData {
  src: Array<{ url: string; format?: string; tech?: string }>;
  display?: "auto" | "block" | "swap" | "fallback" | "optional";
  weight?: string | number | [number, number];
  style?: string;
  unicodeRange?: string[];
  featureSettings?: string;
  variationSettings?: string;
  meta?: Record<string, unknown>;
}

interface FontProvider {
  name: string;
  config?: Record<string, string>;
  init?: (context: unknown) => Promise<void>;
  resolveFont: (options: {
    familyName: string;
    weights: string[];
    styles: string[];
    subsets: string[];
    formats: string[];
  }) => Promise<{ fonts: FontFaceData[] } | undefined>;
  listFonts?: () => Promise<string[] | undefined>;
}

/** 各字体格式对应的 User-Agent，用于让 Google Fonts API 返回对应格式的 CSS */
const USER_AGENTS: Record<string, string> = {
  woff2:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  woff: "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0",
  ttf: "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
};

/** Google Fonts 镜像源提供器选项 */
export interface GoogleFontsMirrorProviderOptions {
  /** 镜像源基础 URL，如 https://fonts.googleapis.cn */
  mirrorUrl: string;
}

/** 从 CSS 中提取所有 @font-face 块 */
function extractFontFaceBlocks(css: string): string[] {
  const blocks: string[] = [];
  // 匹配 @font-face { ... } 块（支持嵌套花括号）
  const regex = /@font-face\s*\{((?:[^{}]|\{[^{}]*\})*)\}/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(css)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

/** 从 CSS 声明块中提取指定属性的值 */
function extractPropertyValue(block: string, property: string): string | null {
  const regex = new RegExp(
    `(?:^|[;\\s])${property}\\s*:\\s*([^;]+?)\\s*(?:;|$)`,
    "i",
  );
  const match = regex.exec(block);
  return match ? match[1].trim() : null;
}

/** 解析 src 属性值，提取 URL 与格式信息 */
function parseSrcValue(src: string): FontFaceData["src"] {
  const sources: FontFaceData["src"] = [];
  // 匹配 url(...) format(...) 或 url(...)
  const urlRegex =
    /url\((['"]?)([^'"]+?)\1\)\s*(?:format\((['"]?)([^'"]*?)\3\))?/gi;
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(src)) !== null) {
    const entry: { url: string; format?: string } = { url: match[2] };
    if (match[4]) {
      entry.format = match[4];
    }
    sources.push(entry);
  }
  return sources;
}

/** 处理字重值：将字符串转为数字或范围 */
function parseWeightValue(value: string): string | number | [number, number] {
  const trimmed = value.trim();
  if (trimmed.includes("..")) {
    const [min, max] = trimmed.split("..").map(Number);
    return [min, max];
  }
  const num = Number(trimmed);
  return Number.isNaN(num) ? trimmed : num;
}

/** 解析 CSS 字符串，提取 @font-face 规则中的字体数据 */
function parseFontFaceCSS(css: string): FontFaceData[] {
  const blocks = extractFontFaceBlocks(css);
  return blocks.map((block): FontFaceData => {
    const data: Partial<FontFaceData> = {};

    // 提取 src
    const srcRaw = extractPropertyValue(block, "src");
    if (srcRaw) {
      data.src = parseSrcValue(srcRaw);
    }

    // 提取 font-weight
    const weightRaw = extractPropertyValue(block, "font-weight");
    if (weightRaw) {
      data.weight = parseWeightValue(weightRaw);
    }

    // 提取 font-style
    const styleRaw = extractPropertyValue(block, "font-style");
    if (styleRaw) {
      data.style = styleRaw;
    }

    // 提取 font-display
    const displayRaw = extractPropertyValue(block, "font-display");
    if (
      displayRaw &&
      ["auto", "block", "swap", "fallback", "optional"].includes(displayRaw)
    ) {
      data.display = displayRaw as FontFaceData["display"];
    }

    // 提取 unicode-range
    const unicodeRangeRaw = extractPropertyValue(block, "unicode-range");
    if (unicodeRangeRaw) {
      data.unicodeRange = unicodeRangeRaw.split(",").map((r) => r.trim());
    }

    return data as FontFaceData;
  });
}

/**
 * 创建 Google Fonts 镜像源字体提供器
 *
 * @param options - 镜像源配置
 * @returns Astro FontProvider 实例
 */
export function googleFontsMirrorProvider(
  options: GoogleFontsMirrorProviderOptions,
): FontProvider {
  const baseUrl = options.mirrorUrl.replace(/\/+$/, "");

  return {
    name: "google-fonts-mirror",
    config: { mirrorUrl: options.mirrorUrl },

    async resolveFont({
      familyName,
      weights,
      styles,
      formats,
    }: {
      familyName: string;
      weights: string[];
      styles: string[];
      subsets: string[];
      formats: string[];
    }) {
      // 根据格式优先级依次尝试
      const formatPriority = ["woff2", "woff", "ttf", "eot", "svg"];

      for (const format of formatPriority) {
        if (!formats.includes(format)) continue;

        const userAgent = USER_AGENTS[format];
        if (!userAgent) continue;

        try {
          // 构建 Google Fonts CSS API 查询参数
          const weightParam = weights.join(";");
          const familyQuery = styles.includes("italic")
            ? `${familyName}:ital,wght@1,${weightParam};0,${weightParam}`
            : `${familyName}:wght@${weightParam}`;

          const url = new URL("/css2", baseUrl);
          url.searchParams.set("family", familyQuery);

          const response = await fetch(url.toString(), {
            headers: { "user-agent": userAgent },
          });

          if (!response.ok) continue;

          const css = await response.text();
          const fontFaces = parseFontFaceCSS(css);
          if (fontFaces.length > 0) {
            return { fonts: fontFaces };
          }
        } catch {
          // 当前格式失败，尝试下一种
          continue;
        }
      }

      return undefined;
    },
  };
}
