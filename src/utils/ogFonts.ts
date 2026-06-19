import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "./getFontPathByWeight";

/** OG 图字体在 astro.config 中注册的 CSS 变量名 */
const OG_FONT_VARIABLE = "--font-og";
/** OG 图字体在 satori 中注册的 family 名 */
export const OG_FONT_FAMILY = "Noto Sans SC";

/** satori 字体描述项 */
export interface SatoriFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}

/**
 * 判断 OG 图字体是否就绪
 * 构建环境无网络时字体注册表为空，此时应跳过动态生成而非中断构建
 */
export function isOgFontAvailable(): boolean {
  const fonts = fontData[OG_FONT_VARIABLE];
  return Array.isArray(fonts) && fonts.length > 0;
}

/**
 * 加载动态 OG 图所需字体（常规 + 粗体）
 * 通过 Astro 字体注册表取得文件 URL 后拉取二进制
 * 字体不可用时返回 null，由调用方决定降级策略
 */
export async function loadOgFonts(
  url: URL,
): Promise<{ regular: SatoriFont; bold: SatoriFont } | null> {
  if (!isOgFontAvailable()) {
    console.warn("[OG] 字体未就绪（构建环境可能无网络），跳过动态 OG 图生成");
    return null;
  }

  const fonts = fontData[OG_FONT_VARIABLE];
  const regularPath = getFontPathByWeight(fonts, 400);
  const boldPath = getFontPathByWeight(fonts, 700);

  if (!regularPath || !boldPath) {
    console.warn("[OG] 未找到所需字重的字体文件，跳过动态 OG 图生成");
    return null;
  }

  try {
    const [regularData, boldData] = await Promise.all([
      fetch(experimental_getFontFileURL(regularPath, url)).then((res) =>
        res.arrayBuffer(),
      ),
      fetch(experimental_getFontFileURL(boldPath, url)).then((res) =>
        res.arrayBuffer(),
      ),
    ]);

    return {
      regular: {
        name: OG_FONT_FAMILY,
        data: regularData,
        weight: 400,
        style: "normal",
      },
      bold: {
        name: OG_FONT_FAMILY,
        data: boldData,
        weight: 700,
        style: "normal",
      },
    };
  } catch (error) {
    console.warn("[OG] 字体加载失败，跳过动态 OG 图生成:", error);
    return null;
  }
}
