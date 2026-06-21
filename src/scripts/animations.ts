/**
 * 动画效果主入口
 * 读取 <html> 上的 data-animations 属性获取全局配置，
 * 按需初始化各特效模块
 */

import { initScrollReveal } from "@/scripts/animations/scrollReveal";
import { initSpotlight } from "@/scripts/animations/spotlightEffect";
import { initRipple } from "@/scripts/animations/rippleEffect";
import { initNavIndicator } from "@/scripts/animations/navIndicator";
import { initNoise } from "@/scripts/animations/noiseTexture";
import { initMagnet } from "@/scripts/animations/tagMagnet";

/** 从 <html> 读取动画配置 */
function getAnimationsConfig(): Record<string, boolean> {
  const raw = document.documentElement.dataset.animations;
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

/** 根据配置初始化各动画模块 */
export function initAnimations(): void {
  const cfg = getAnimationsConfig();

  if (cfg.scrollReveal !== false) {
    initScrollReveal();
  }
  if (cfg.spotlightCard !== false) {
    initSpotlight();
  }
  if (cfg.navIndicator !== false) {
    initNavIndicator();
  }
  if (cfg.buttonRipple !== false) {
    initRipple();
  }
  if (cfg.noiseTexture !== false) {
    initNoise();
  }
  if (cfg.tagMagnet !== false) {
    initMagnet();
  }
}

// View Transitions 导航后重新初始化
document.addEventListener("astro:page-load", () => {
  initAnimations();
});
