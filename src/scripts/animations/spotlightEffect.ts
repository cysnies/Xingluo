/**
 * PostCard 鼠标跟随光晕 + 视差倾斜效果
 * 通过 mousemove 事件计算鼠标在卡片内的相对位置，驱动光晕位置与轻微 3D 旋转
 */

/** 光晕卡片选择器 */
const SPOTLIGHT_SELECTOR = "[data-spotlight]";
/** 光晕层选择器（卡片的第一个子元素作为光晕覆盖层） */
const GLOW_SELECTOR = "[data-spotlight-glow]";

/** 初始化光晕效果 */
export function initSpotlight(): void {
  const cards = document.querySelectorAll<HTMLElement>(SPOTLIGHT_SELECTOR);
  for (const card of cards) {
    setupCard(card);
  }
}

/** 为单张卡片绑定事件 */
function setupCard(card: HTMLElement): void {
  // 避免重复绑定
  if (card.dataset.spotlightReady === "true") return;
  card.dataset.spotlightReady = "true";

  const glow = card.querySelector<HTMLElement>(GLOW_SELECTOR);
  if (!glow) return;

  const handleMove = (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 更新光晕位置
    glow.style.setProperty("--spotlight-x", `${x}px`);
    glow.style.setProperty("--spotlight-y", `${y}px`);

    // 倾斜效果：鼠标靠近边缘时旋转幅度增大
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
    card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
  };

  const handleLeave = () => {
    glow.style.setProperty("--spotlight-opacity", "0");
    card.style.setProperty("--card-rotate-x", "0deg");
    card.style.setProperty("--card-rotate-y", "0deg");
  };

  const handleEnter = () => {
    glow.style.setProperty("--spotlight-opacity", "1");
  };

  card.addEventListener("mouseenter", handleEnter);
  card.addEventListener("mousemove", handleMove);
  card.addEventListener("mouseleave", handleLeave);
}
