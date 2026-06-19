/** 第三方模块类型声明补充 */

declare module "remark-collapse" {
  import type { Plugin } from "unified";
  const remarkCollapse: Plugin;
  export default remarkCollapse;
}
