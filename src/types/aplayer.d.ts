/**
 * APlayer 模块类型声明
 * aplayer 未提供官方类型，此处声明为宽松模块类型，实例化时由调用方保证参数正确
 */
declare module "aplayer" {
  /** APlayer 构造函数选项（运行时宽松类型，字段可选以兼容 spread 调用） */
  export interface APlayerOptions {
    container?: HTMLElement;
    audio?: unknown;
    [key: string]: unknown;
  }
  /** APlayer 构造函数 */
  export default class APlayer {
    constructor(options: APlayerOptions);
    [key: string]: unknown;
  }
}

/** APlayer CSS 入口 */
declare module "aplayer/dist/APlayer.min.css";
