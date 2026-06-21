/**
 * 导航栏激活指示条
 * 页面加载时自动定位到当前激活项，View Transitions 导航后
 * 从旧位置平滑过渡到新位置，不绑定用户交互事件
 */

/** 导航容器选择器（桌面端 nav 元素） */
const NAV_SELECTOR = "nav.hidden.md\\:flex";

/** 初始化导航指示条 */
export function initNavIndicator(): void {
  const nav = document.querySelector<HTMLElement>(NAV_SELECTOR);
  if (!nav) return;

  const activeLink = nav.querySelector<HTMLElement>(
    'a[aria-current="page"], a.bg-accent',
  );
  if (!activeLink) return;

  // 复用已存在的指示条或创建新的
  let indicator = nav.querySelector<HTMLElement>("[data-nav-indicator]");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.dataset.navIndicator = "true";
    indicator.className =
      "absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out pointer-events-none";
    nav.style.position = "relative";
    nav.appendChild(indicator);
  }

  // 每次调用都重新定位到当前激活项（使 View Transitions 导航后能平滑过渡）
  updateIndicator(indicator, activeLink);
}

/** 更新指示条位置与宽度 */
function updateIndicator(indicator: HTMLElement, link: HTMLElement): void {
  const navRect = indicator.parentElement?.getBoundingClientRect() ?? {
    left: 0,
  };
  const rect = link.getBoundingClientRect();

  indicator.style.width = `${rect.width}px`;
  indicator.style.transform = `translateX(${rect.left - navRect.left}px)`;
}
