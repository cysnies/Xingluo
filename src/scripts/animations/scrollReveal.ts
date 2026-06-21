/**
 * 滚动渐现动画
 * 监听元素进入视口，添加 .is-visible 类触发 CSS 过渡
 */

/** 默认选择器：标记为滚入动画的元素 */
const DEFAULT_SELECTOR = "[data-reveal]";

/** 默认 IntersectionObserver 阈值 */
const DEFAULT_THRESHOLD = 0.1;

/** 观察者实例 */
let observer: IntersectionObserver | null = null;

/** 初始化滚动渐现动画 */
export function initScrollReveal(): void {
  // 清理旧观察者（View Transitions 复用）
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      }
    },
    { threshold: DEFAULT_THRESHOLD, rootMargin: "0px 0px -40px 0px" },
  );

  const targets = document.querySelectorAll<HTMLElement>(DEFAULT_SELECTOR);
  for (const el of targets) {
    observer.observe(el);
  }
}
