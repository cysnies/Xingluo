import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { rehypeWrapTable } from "./src/utils/rehypeWrapTable";
import { remarkPlayers } from "./src/utils/remarkPlayers";
import config from "./xingluo.config";

/** MDX 集成按需启用：关闭时既不加载集成，也不收集 .mdx 文件 */
const mdxEnabled = config.features?.mdx !== false;
const integrations = [
  ...(mdxEnabled ? [mdx()] : []),
  sitemap({
    filter: (page) =>
      (config.features?.showArchives !== false ||
        !page.endsWith("/archives/")) &&
      (config.features?.showCategories !== false ||
        !page.includes("/categories/")),
    // 启用 sitemap 内 hreflang 声明，映射 locale 到 hreflang 值
    i18n: {
      defaultLocale: "zh-cn",
      locales: {
        "zh-cn": "zh-CN",
        "zh-tw": "zh-TW",
        en: "en",
        ja: "ja",
        ko: "ko",
        fr: "fr",
        de: "de",
        es: "es",
        pt: "pt",
        ru: "ru",
        ar: "ar",
        eo: "eo",
      },
    },
  }),
  // 构建期内联 Font Awesome SVG 图标，零运行时 JS
  icon(),
];

/** 播放器 remark 插件按需启用：任一播放器开启时才注入 */
const playersConfig = config.features?.players;
const playersEnabled = Boolean(
  playersConfig && (playersConfig.aplayer || playersConfig.dplayer),
);
// remark 插件类型复杂（unified PluggableList），用 any[] 保持配置可读性
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remarkPlugins: any[] = [
  remarkToc,
  [remarkCollapse, { test: "Table of contents" }],
];
if (playersEnabled) {
  remarkPlugins.push([
    remarkPlayers,
    {
      aplayer: playersConfig?.aplayer ?? false,
      dplayer: playersConfig?.dplayer ?? false,
    },
  ]);
}

/**
 * CI 环境变量覆盖：允许在构建期通过环境变量改写站点 URL 与 base 子路径，
 * 用于 GitHub Pages 项目页（https://<user>.github.io/<repo>/）等子路径部署场景。
 * 未设置时回退到 xingluo.config.ts 的用户配置。
 */
const ciSiteUrl = process.env.CI_SITE_URL;
const ciBaseUrl = process.env.CI_BASE_URL;
const siteUrl = ciSiteUrl || config.site?.url;
const baseUrl = ciBaseUrl || undefined;

export default defineConfig({
  site: siteUrl,
  base: baseUrl,
  integrations,
  i18n: {
    locales: [
      "zh-cn",
      "zh-tw",
      "en",
      "ja",
      "ko",
      "fr",
      "de",
      "es",
      "pt",
      "ru",
      "ar",
      "eo",
    ],
    defaultLocale: "zh-cn",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    remarkPlugins,
    rehypePlugins: [rehypeCallouts, rehypeWrapTable],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    // 启用 SVG 优化，自动压缩内联与引用的 SVG 图标
    svgOptimizer: svgoOptimizer(),
  },
  // 动态 OG 图使用的字体：仅构建期供 satori 取用，不注入站点 CSS
  fonts: [
    {
      name: "Noto Sans SC",
      cssVariable: "--font-og",
      provider: fontProviders.google(),
      fallbacks: ["sans-serif"],
      weights: [400, 700],
      styles: ["normal"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
});
