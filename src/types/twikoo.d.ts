/**
 * Twikoo 模块类型声明
 * twikoo 未提供官方类型，此处声明为宽松模块类型
 */
declare module "twikoo" {
  /** twikoo init 选项（运行时宽松类型） */
  export interface TwikooInitOptions {
    envId: string;
    el?: string | HTMLElement;
    lang?: string;
    [key: string]: unknown;
  }
  /** twikoo 默认导出的 init 函数 */
  const init: (options: TwikooInitOptions) => void;
  export default init;
  /** 评论数统计 */
  export function getCommentsCount(options: {
    envId: string;
    urls: string[];
  }): Promise<unknown>;
  /** 最近评论 */
  export function getRecentComments(options: {
    envId: string;
    pageSize?: number;
  }): Promise<unknown>;
  /** 访问量统计 */
  export function getVisitorsCount(options: {
    envId: string;
    urls: string[];
  }): Promise<unknown>;
}
