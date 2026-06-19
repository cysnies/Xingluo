import satori from "satori";
import sharp from "sharp";
import type { SatoriFont } from "./ogFonts";

/** OG 图尺寸（社交平台通用规格） */
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * 1x1 透明 PNG 占位图
 * 字体不可用（构建环境无网络）时回退输出，保证端点始终产生有效文件
 */
const PLACEHOLDER_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC";

/** 返回占位 PNG 的 ArrayBuffer */
export function getPlaceholderPng(): ArrayBuffer {
  const buffer = Buffer.from(PLACEHOLDER_PNG_BASE64, "base64");
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

/** 浅色卡片背景 */
const BG = "#fefbfb";
/** 卡片边框色 */
const BORDER = "#000000";
/** 主文字色 */
const FG = "#0a0a0a";
/** 次要文字色 */
const MUTED = "#525252";

interface RenderOgImageInput {
  /** 主标题（站点名或文章标题） */
  title: string;
  /** 副标题（站点描述或作者信息） */
  subtitle?: string;
  /** 右下角显示的域名 */
  hostname: string;
  /** 左上角小标签 */
  label?: string;
}

/**
 * 使用 satori 渲染 SVG 并经 sharp 转为 PNG Buffer
 * 供站点级与文章级 OG 图端点复用
 */
export async function renderOgImage(
  input: RenderOgImageInput,
  fonts: { regular: SatoriFont; bold: SatoriFont }
): Promise<ArrayBuffer> {
  const { title, subtitle, hostname, label } = input;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          background: BG,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Noto Sans SC",
        },
        children: {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: `4px solid ${BORDER}`,
              borderRadius: "12px",
              background: BG,
              margin: "2rem",
              width: "88%",
              height: "80%",
              padding: "48px",
            },
            children: [
              // 顶部小标签
              {
                type: "div",
                props: {
                  style: { display: "flex", justifyContent: "flex-start" },
                  children: label
                    ? {
                        type: "span",
                        props: {
                          style: {
                            fontSize: 28,
                            fontWeight: 700,
                            color: MUTED,
                          },
                          children: label,
                        },
                      }
                    : "",
                },
              },
              // 中部主标题与副标题
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "1",
                    textAlign: "center",
                    overflow: "hidden",
                  },
                  children: [
                    {
                      type: "p",
                      props: {
                        style: {
                          fontSize: 72,
                          fontWeight: 700,
                          color: FG,
                          maxHeight: "70%",
                          overflow: "hidden",
                        },
                        children: title,
                      },
                    },
                    ...(subtitle
                      ? [
                          {
                            type: "p",
                            props: {
                              style: {
                                fontSize: 30,
                                color: MUTED,
                                marginTop: "16px",
                              },
                              children: subtitle,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },
              // 底部域名
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    fontSize: 28,
                    color: MUTED,
                  },
                  children: {
                    type: "span",
                    props: {
                      style: { fontWeight: 700, overflow: "hidden" },
                      children: hostname,
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      embedFont: true,
      fonts: [fonts.regular, fonts.bold],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  // 截取为独立 ArrayBuffer，便于直接作为 Response body
  const { buffer, byteOffset, byteLength } = pngBuffer;
  return buffer.slice(byteOffset, byteOffset + byteLength) as ArrayBuffer;
}
