/**
 * 导航栏激活指示条动画
 * 为桌面端导航链接添加滑动指示条，仅在点击或聚焦时移动
 */

/** 导航容器选择器（桌面端 nav 元素） */
const NAV_SELECTOR = "nav.hidden.md\\:flex";
/** 指示条容器（nav 内动态创建） */
let indicator: HTMLElement | null = null;

/** 初始化导航指示条 */
export function initNavIndicator(): void {
  const nav = document.querySelector<HTMLElement>(NAV_SELECTOR);
  if (!nav) return;

  // 避免重复创建
  if (nav.querySelector("[data-nav-indicator]")) return;

  const activeLink = nav.querySelector<HTMLElement>(
    'a[aria-current="page"], a.bg-accent',
  );
  if (!activeLink) return;

  // 创建指示条
  indicator = document.createElement("div");
  indicator.dataset.navIndicator = "true";
  indicator.className =
    "absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out pointer-events-none";
  nav.style.position = "relative";
  nav.appendChild(indicator);

  // 初始定位到当前激活项
  updateIndicator(activeLink);

  // 仅点击时移动指示条（hover 不触发）
  const links = nav.querySelectorAll<HTMLElement>("a");
  for (const link of links) {
    link.addEventListener("click", () => updateIndicator(link));
    link.addEventListener("focus", () => updateIndicator(link));
  }
}

/** 更新指示条位置与宽度 */
function updateIndicator(link: HTMLElement): void {
  if (!indicator) return;
  const rect = link.getBoundingClientRect();
  const navRect = indicator.parentElement?.getBoundingClientRect() ?? {
    left: 0,
  };

  indicator.style.width = `${rect.width}px`;
  indicator.style.transform = `translateX(${rect.left - navRect.left}px)`;
}
