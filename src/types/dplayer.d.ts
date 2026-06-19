/**
 * DPlayer 模块类型声明
 * dplayer 未提供官方类型，此处声明为宽松模块类型，实例化时由调用方保证参数正确
 */
declare module "dplayer" {
  /** DPlayer 构造函数选项（运行时宽松类型，字段可选以兼容 spread 调用） */
  export interface DPlayerOptions {
    container?: HTMLElement;
    video?: unknown;
    [key: string]: unknown;
  }
  /** DPlayer 构造函数 */
  export default class DPlayer {
    constructor(options: DPlayerOptions);
    [key: string]: unknown;
  }
}
