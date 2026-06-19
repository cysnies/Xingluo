/** 第三方模块类型声明补充 */

declare module "remark-collapse" {
  import type { Plugin } from "unified";
  const remarkCollapse: Plugin;
  export default remarkCollapse;
}

/** Astro 公开环境变量类型 */
interface ImportMetaEnv {
  /** Google Search Console 站点验证值（可选） */
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
