/**
 * 导航栏激活指示条
 * 页面加载时自动定位到当前激活项，View Transitions 导航前
 * 保存旧位置，在新页面从旧位置平滑过渡到新位置
 */

/** 导航容器选择器（桌面端 nav 元素） */
const NAV_SELECTOR = "nav.hidden.md\\:flex";
/** 跨导航保存的旧指示条状态 */
let savedIndicatorState: { width: string; transform: string } | null = null;

/** 在 View Transitions 导航前捕获指示条的当前位置 */
function captureIndicatorState(): void {
  const nav = document.querySelector<HTMLElement>(NAV_SELECTOR);
  if (!nav) return;
  const indicator = nav.querySelector<HTMLElement>("[data-nav-indicator]");
  if (!indicator) return;

  savedIndicatorState = {
    width: indicator.style.width,
    transform: indicator.style.transform,
  };
}

/** 初始化导航指示条 */
export function initNavIndicator(): void {
  const nav = document.querySelector<HTMLElement>(NAV_SELECTOR);
  if (!nav) return;

  const activeLink = nav.querySelector<HTMLElement>(
    'a[aria-current="page"], a.bg-accent',
  );
  if (!activeLink) return;

  // 创建新的指示条（旧 DOM 已被 View Transitions 替换）
  const indicator = document.createElement("div");
  indicator.dataset.navIndicator = "true";
  indicator.className =
    "absolute bottom-0 left-0 h-0.5 bg-primary rounded-full pointer-events-none";
  nav.style.position = "relative";

  // 如有保存的旧位置，先无动画定位到旧位置，再启动过渡至目标位置
  if (savedIndicatorState) {
    indicator.style.transition = "none";
    indicator.style.width = savedIndicatorState.width;
    indicator.style.transform = savedIndicatorState.transform;
    nav.appendChild(indicator);

    // 触发重排后启用过渡并更新到新位置
    requestAnimationFrame(() => {
      indicator.style.transition =
        "width 0.3s ease-out, transform 0.3s ease-out";
      updateIndicator(indicator, activeLink);
    });
  } else {
    // 首次加载，直接定位
    indicator.style.transition = "width 0.3s ease-out, transform 0.3s ease-out";
    nav.appendChild(indicator);
    updateIndicator(indicator, activeLink);
  }

  // 为下一次导航捕获状态
  savedIndicatorState = null;
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

// 在 View Transitions 导航前捕获指示条当前位置
document.addEventListener("astro:before-swap", captureIndicatorState);
