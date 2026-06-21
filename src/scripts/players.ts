/**
 * 媒体播放器客户端脚本
 *
 * 职责：
 * 1. 扫描 .xng-aplayer / .xng-dplayer 占位 div
 * 2. 滚动到视口时动态 import aplayer/dplayer（含 CSS）并实例化
 * 3. View Transitions 适配：astro:after-swap / astro:page-load 重新扫描
 * 4. 防重复实例化（dataset 标记）
 * 5. 确保 CSS 加载完成后再实例化，避免首次导航时样式错乱
 *
 * 占位 div 由 remark 围栏插件或 MDX 组件输出，data-config 为 URI 编码的 JSON 配置
 */

/** 已加载的模块缓存，避免重复动态 import */
let aplayerMod: Promise<typeof import("aplayer")> | null = null;
let dplayerMod: Promise<typeof import("dplayer")> | null = null;

// 以 ?url 形式引入 APlayer 样式：仅取得资源 URL 字符串，不触发 Vite 自动注入 <link>，
// 改为运行时按需注入，避免功能关闭时页面仍加载无用 CSS
import aplayerCssUrl from "aplayer/dist/APlayer.min.css?url";

/** 运行时注入 APlayer 样式 <link> 的 Promise，确保 CSS 加载完毕后再实例化播放器 */
let aplayerCssPromise: Promise<void> | null = null;

/**
 * 注入 APlayer 样式 <link> 并等待加载完成。
 *
 * 每次调用前会检查 <link> 是否仍在 <head> 中——View Transitions 的
 * swapHeadElements() 会移除仅存在于当前 head 但不在新文档 head 中的元素，
 * 导致导航离开再返回后 CSS 丢失。若 <link> 被移除则重新注入。
 */
function ensureAPlayerCss(): Promise<void> {
  // 检查 CSS <link> 是否仍存在于 <head> 中（View Transitions 可能已将其移除）
  const linkExists = document.head.querySelector<HTMLLinkElement>(
    `link[rel=stylesheet][href="${aplayerCssUrl}"]`,
  );
  if (!linkExists) {
    // link 被移除，重置 Promise 以便重新注入
    aplayerCssPromise = null;
  }

  if (!aplayerCssPromise) {
    aplayerCssPromise = new Promise<void>((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = aplayerCssUrl;
      // CSS 加载完成或失败均 resolve，避免阻塞播放器初始化
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.appendChild(link);
    });
  }
  return aplayerCssPromise;
}

/** 动态加载 APlayer 模块（共享 Promise 避免重复加载，不含 CSS） */
async function loadAPlayer(): Promise<typeof import("aplayer")> {
  if (!aplayerMod) {
    aplayerMod = import("aplayer");
  }
  return aplayerMod;
}

/** 缓存的 DPlayer CSS 文本内容（首次加载时从 style-loader 注入的 <style> 中捕获） */
let dplayerCssContent: string | null = null;

/** 动态加载 DPlayer 模块，并捕获 style-loader 注入的 CSS 内容 */
async function loadDPlayer(): Promise<typeof import("dplayer")> {
  if (!dplayerMod) {
    dplayerMod = (async () => {
      const mod = await import("dplayer");
      // DPlayer 的 webpack 构建使用 style-loader，在模块首次执行时同步
      // 向 <head> 注入 <style> 元素。捕获其文本内容以便后续恢复。
      for (const style of document.head.querySelectorAll("style")) {
        if (style.textContent?.includes(".dplayer")) {
          dplayerCssContent = style.textContent;
          break;
        }
      }
      return mod;
    })();
  }
  return dplayerMod;
}

/**
 * 确保 DPlayer 的 <style> 仍在 <head> 中。
 *
 * View Transitions 的 swapHeadElements() 会移除仅存在于当前 head 但不在
 * 新文档 head 中的元素。由于 DPlayer 的 CSS 由 style-loader 在 JS 首次
 * 执行时动态注入，模块缓存后不会重新注入，故需手动恢复。
 */
function ensureDPlayerCss(): void {
  if (!dplayerCssContent) return;

  const styleExists = Array.from(document.head.querySelectorAll("style")).some(
    (s) => s.textContent === dplayerCssContent,
  );
  if (!styleExists) {
    const style = document.createElement("style");
    style.textContent = dplayerCssContent;
    document.head.appendChild(style);
  }
}

/** 等待下一帧以确保 DOM 布局已稳定（View Transitions 动画可能影响容器尺寸） */
function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * 实例化单个 APlayer 占位
 *
 * 每次调用独立检查 CSS <link> 是否在 <head> 中，因为 View Transitions 的
 * swapHeadElements() 可能在导航时将其移除。若被移除则重新注入并等待加载完成。
 */
async function mountAPlayer(el: HTMLElement): Promise<void> {
  if (el.dataset.xngInit === "1") return;
  el.dataset.xngInit = "1";
  try {
    const raw = decodeURIComponent(el.dataset.config ?? "{}");
    const config = JSON.parse(raw) as Record<string, unknown>;
    // 并行加载 CSS 与 JS 模块
    const [mod] = await Promise.all([loadAPlayer(), ensureAPlayerCss()]);
    const APlayer = mod.default;
    // 等待一帧确保浏览器已完成布局计算，避免 View Transition 动画期间尺寸异常
    await waitForNextFrame();
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
    // 确保 DPlayer 的 CSS <style> 仍在 <head> 中（View Transitions 可能已移除）
    ensureDPlayerCss();
    // 等待一帧确保浏览器已完成布局计算
    await waitForNextFrame();
    new DPlayer({ container: el, ...config });
  } catch (err) {
    console.error("[xingluo] DPlayer 实例化失败：", err);
  }
}

/** 扫描页面占位并注册懒加载观察 */
function setupPlayers(): void {
  const els = document.querySelectorAll<HTMLElement>(
    ".xng-aplayer:not([data-xng-observed]), .xng-dplayer:not([data-xng-observed])",
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
    { rootMargin: "200px" },
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
