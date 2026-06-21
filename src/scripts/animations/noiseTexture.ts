/**
 * 噪点纹理叠加
 * 在页面上叠加半透明噪点 Canvas，增加纸张质感
 * 无交互、无事件绑定，纯视觉效果
 */

/** 噪点 Canvas 元素 id */
const NOISE_ID = "noise-overlay";

/** 是否已初始化 */
let initialized = false;

/** 初始化噪点纹理 */
export function initNoise(): void {
  if (initialized) return;
  initialized = true;

  // 检查是否已存在
  if (document.getElementById(NOISE_ID)) return;

  const canvas = document.createElement("canvas");
  canvas.id = NOISE_ID;
  canvas.className = "pointer-events-none fixed inset-0 z-50 h-full w-full";
  canvas.style.cssText =
    "opacity:0.03;image-rendering:pixelated;width:100vw;height:100vh;";

  const size = 256;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 128;
  }

  ctx.putImageData(imageData, 0, 0);
  document.body.appendChild(canvas);
}
