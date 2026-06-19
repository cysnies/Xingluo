/**
 * 媒体播放器客户端脚本
 *
 * 职责：
 * 1. 扫描 .xng-aplayer / .xng-dplayer 占位 div
 * 2. 滚动到视口时动态 import aplayer/dplayer（含 CSS）并实例化
 * 3. View Transitions 适配：astro:page-load 重新扫描
 * 4. 防重复实例化（dataset 标记）
 *
 * 占位 div 由 remark 围栏插件或 MDX 组件输出，data-config 为 URI 编码的 JSON 配置
 */

/** 已加载的模块缓存，避免重复动态 import */
let aplayerMod: Promise<typeof import("aplayer")> | null = null;
let dplayerMod: Promise<typeof import("dplayer")> | null = null;

// 以 ?url 形式引入 APlayer 样式：仅取得资源 URL 字符串，不触发 Vite 自动注入 <link>，
// 改为运行时按需注入，避免功能关闭时页面仍加载无用 CSS
import aplayerCssUrl from "aplayer/dist/APlayer.min.css?url";

/** 运行时注入 APlayer 样式 <link>，仅首次调用时生效 */
let aplayerCssLoaded = false;
function ensureAPlayerCss(): void {
  if (aplayerCssLoaded) return;
  aplayerCssLoaded = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = aplayerCssUrl;
  document.head.appendChild(link);
}

/** 动态加载 APlayer 模块与样式（共享 Promise 避免重复加载） */
async function loadAPlayer(): Promise<typeof import("aplayer")> {
  if (!aplayerMod) {
    aplayerMod = (async () => {
      ensureAPlayerCss();
      return await import("aplayer");
    })();
  }
  return aplayerMod;
}

/** 动态加载 DPlayer 模块（样式已内联于 JS） */
async function loadDPlayer(): Promise<typeof import("dplayer")> {
  if (!dplayerMod) {
    dplayerMod = (async () => {
      // DPlayer 的样式打包在 JS 中，无需单独 import CSS
      return await import("dplayer");
    })();
  }
  return dplayerMod;
}

/** 实例化单个 APlayer 占位 */
async function mountAPlayer(el: HTMLElement): Promise<void> {
  if (el.dataset.xngInit === "1") return;
  el.dataset.xngInit = "1";
  try {
    const raw = decodeURIComponent(el.dataset.config ?? "{}");
    const config = JSON.parse(raw) as Record<string, unknown>;
    const APlayer = (await loadAPlayer()).default;
    new APlayer({ container: el, ...config });
  } catch (err) {
    console.error("[xingluo] APlayer 实例化失败：", err);
  }
}

/** 实例化单个 DPlayer 占位 */
async function mountDPlayer(el: HTMLElement): Promise<void> {
  if (el.dataset.xngInit === "1") return;
  el.dataset.xngInit = "1";
  try {
    const raw = decodeURIComponent(el.dataset.config ?? "{}");
    const config = JSON.parse(raw) as Record<string, unknown>;
    const DPlayer = (await loadDPlayer()).default;
    new DPlayer({ container: el, ...config });
  } catch (err) {
    console.error("[xingluo] DPlayer 实例化失败：", err);
  }
}

/** 扫描页面占位并注册懒加载观察 */
function setupPlayers(): void {
  const els = document.querySelectorAll<HTMLElement>(
    ".xng-aplayer:not([data-xng-observed]), .xng-dplayer:not([data-xng-observed])"
  );
  if (els.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        if (el.classList.contains("xng-aplayer")) {
          void mountAPlayer(el);
        } else if (el.classList.contains("xng-dplayer")) {
          void mountDPlayer(el);
        }
      }
    },
    { rootMargin: "200px" }
  );

  for (const el of els) {
    el.dataset.xngObserved = "1";
    io.observe(el);
  }
}

/** 初始化入口 */
function init(): void {
  setupPlayers();
}

// 首次加载
init();
// View Transitions：每次页面加载后重新扫描
document.addEventListener("astro:page-load", init);

// 标记为模块，避免被当作全局脚本与其他文件顶层声明冲突
export {};
