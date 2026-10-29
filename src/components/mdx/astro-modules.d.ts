/**
 * 供裸 tsc 识别本目录 .astro 出口（astro check 本身已通过）。
 * 运行时仍由 Astro/Vite 编译组件。
 */
declare module "*.astro" {
  import type { AstroComponentFactory } from "astro/runtime/server/index.js";
  const Component: AstroComponentFactory;
  export default Component;
}
