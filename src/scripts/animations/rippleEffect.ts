/**
 * 按钮点击涟漪效果
 * 为标记的按钮绑定点击事件，在点击位置生成 CSS 涟漪元素
 */

/** 涟漪按钮选择器 */
const RIPPLE_SELECTOR = "[data-ripple]";

/** 涟漪 CSS 类名 */
const RIPPLE_CLASS = "ripple-effect";

/** 涟漪动画持续时间（ms），与 CSS 中的 animation-duration 一致 */
const DURATION = 600;

/** 初始化涟漪效果 */
export function initRipple(): void {
  const buttons = document.querySelectorAll<HTMLElement>(RIPPLE_SELECTOR);
  for (const btn of buttons) {
    setupRipple(btn);
  }
}

/** 为单个按钮绑定事件 */
function setupRipple(btn: HTMLElement): void {
  if (btn.dataset.rippleReady === "true") return;
  btn.dataset.rippleReady = "true";

  // 确保按钮有相对定位
  if (getComputedStyle(btn).position === "static") {
    btn.style.position = "relative";
  }
  // 确保 overflow hidden
  btn.style.overflow = "hidden";

  btn.addEventListener("click", (e: MouseEvent) => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = RIPPLE_CLASS;
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      background: currentColor;
      opacity: 0.15;
      transform: scale(0);
      animation: ripple-animation ${DURATION}ms ease-out forwards;
    `;

    btn.appendChild(ripple);

    // 动画结束后移除 DOM 元素
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  });
}
