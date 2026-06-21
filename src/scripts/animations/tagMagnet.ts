/**
 * 标签/分类悬停磁吸效果
 * 鼠标移入标签时标签轻微跟随鼠标偏移
 */

/** 磁吸元素选择器 */
const MAGNET_SELECTOR = "[data-magnet]";

/** 磁吸强度（像素偏移量除以该值） */
const STRENGTH = 6;

/** 初始化磁吸效果 */
export function initMagnet(): void {
  const elements = document.querySelectorAll<HTMLElement>(MAGNET_SELECTOR);
  for (const el of elements) {
    setupMagnet(el);
  }
}

/** 为单个元素绑定事件 */
function setupMagnet(el: HTMLElement): void {
  if (el.dataset.magnetReady === "true") return;
  el.dataset.magnetReady = "true";

  // 确保元素有相对定位
  if (getComputedStyle(el).position === "static") {
    el.style.position = "relative";
  }

  // 创建磁吸内层（实际偏移该元素）
  const inner = document.createElement("span");
  inner.className = "magnet-inner";
  inner.style.cssText =
    "display:inline-flex;align-items:center;gap:inherit;transition:transform 0.4s ease-out;";
  inner.innerHTML = el.innerHTML;
  el.innerHTML = "";
  el.appendChild(inner);

  el.addEventListener("mouseenter", () => {
    inner.style.transition = "transform 0.2s ease-out";
  });

  el.addEventListener("mousemove", (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / STRENGTH;
    const dy = (e.clientY - centerY) / STRENGTH;

    inner.style.transition = "none";
    inner.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  });

  el.addEventListener("mouseleave", () => {
    inner.style.transition = "transform 0.4s ease-out";
    inner.style.transform = "translate3d(0, 0, 0)";
  });
}
