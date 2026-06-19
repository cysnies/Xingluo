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
import config from "./xingluo.config";

export default defineConfig({
  site: config.site?.url,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
    // 构建期内联 Font Awesome SVG 图标，零运行时 JS
    icon(),
  ],
  i18n: {
    locales: ["zh-cn", "en"],
    defaultLocale: "zh-cn",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    rehypePlugins: [rehypeCallouts, rehypeWrapTable],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
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
