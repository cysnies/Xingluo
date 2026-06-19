import type { FontData } from "astro:assets";

interface GetFontOptions {
  /** 字体样式，默认 normal */
  style?: "normal" | "italic";
  /** 优先匹配的字体格式，默认 truetype */
  format?: string;
}

/**
 * 按字重从 Astro 字体数据中取出字体文件路径
 * 用于动态 OG 图端点向 satori 提供字体二进制来源
 */
export function getFontPathByWeight(
  fonts: FontData[],
  weight: number,
  options?: GetFontOptions
): string | undefined {
  const style = options?.style ?? "normal";
  const format = options?.format ?? "truetype";

  for (const font of fonts) {
    if (font.weight === String(weight) && font.style === style) {
      const src = font.src.find((file) => file.format === format) ?? font.src[0];
      if (src) return src.url;
    }
  }

  return undefined;
}
