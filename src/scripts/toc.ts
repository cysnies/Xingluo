/**
 * 文章目录侧栏的滚动高亮（scrollspy）
 *
 * 通过 IntersectionObserver 监听文章内 h2~h6 标题的可见性，
 * 为当前可视区域最靠顶的标题对应的目录项设置 active 状态。
 * View Transitions 切换后重新初始化。
 */

/** 文章正文容器选择器 */
const ARTICLE_SELECTOR = "#article";
/** 目录链接选择器 */
const TOC_LINK_SELECTOR = "[data-toc-link]";
/** 顶部偏移量（与粘性头部的下沿对齐，单位 px） */
const ROOT_MARGIN_TOP = 96;

/** 清除所有目录项的 active 状态 */
function clearActive(links: NodeListOf<HTMLElement>) {
  for (const link of links) {
    if (link.dataset.active === "true") link.dataset.active = "false";
  }
}

/** 初始化滚动高亮 */
function initTocScrollSpy() {
  const article = document.querySelector<HTMLElement>(ARTICLE_SELECTOR);
  const links = document.querySelectorAll<HTMLElement>(TOC_LINK_SELECTOR);
  if (!article || links.length === 0) return;

  // 收集目录链接对应的标题元素（跳过缺失的）
  const entries: { link: HTMLElement; heading: Element }[] = [];
  for (const link of links) {
    const id = link.dataset.tocLink;
    if (!id) continue;
    const heading = article.querySelector(`#${CSS.escape(id)}`);
    if (heading) entries.push({ link, heading });
  }
  if (entries.length === 0) return;

  // 记录最近一次越过顶部线的标题，作为当前激活项
  let activeId: string | null = null;

  const observer = new IntersectionObserver(
    (records) => {
      for (const record of records) {
        const id = record.target.id;
        if (record.isIntersecting) {
          activeId = id;
        }
      }
      if (activeId) {
        clearActive(links);
        const activeLink = entries.find(
          (entry) => entry.heading.id === activeId,
        );
        if (activeLink) activeLink.link.dataset.active = "true";
      }
    },
    {
      // 顶部线略低于粘性头部，底部线贴近视口底部
      rootMargin: `-${ROOT_MARGIN_TOP}px 0px -70% 0px`,
      threshold: 0,
    },
  );

  for (const { heading } of entries) {
    observer.observe(heading);
  }
}

// 首次加载与 View Transitions 切换后均重新初始化
document.addEventListener("astro:after-swap", initTocScrollSpy);
initTocScrollSpy();

export {};
