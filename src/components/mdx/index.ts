/**
 * MDX 自定义组件统一出口
 *
 * 在 .mdx 文件中引入：
 * import { APlayer, DPlayer } from "@/components/mdx";
 *
 * 注：APlayer/DPlayer 组件渲染为占位 div，由 src/scripts/players.ts 在客户端懒加载实例化
 */
export { default as APlayer } from "./APlayer.astro";
export { default as DPlayer } from "./DPlayer.astro";
