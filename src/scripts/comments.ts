/**
 * 评论系统客户端脚本
 *
 * 职责：
 * 1. 懒加载：评论容器进入视口时才初始化对应评论系统（giscus/twikoo/waline）
 * 2. 主题同步：站点主题切换时同步评论系统主题（giscus 用 postMessage、waline 用 dark 选择器、twikoo 重建）
 * 3. View Transitions 适配：监听 astro:page-load 重新扫描挂载点
 *
 * 设计要点：
 * - 各评论系统按需动态 import，未启用 provider 时本脚本几乎零开销
 * - 通过 data-* 属性读取配置，避免重复 SSR 注入
 * - 防重复初始化：用 dataset 标记
 */

/** 当前是否暗色主题（站点主题脚本会在 html 上加 .dark 类） */
function isDarkTheme(): boolean {
  return document.documentElement.classList.contains("dark");
}

/** giscus 期望的主题字符串 */
function giscusTheme(): string {
  return isDarkTheme() ? "dark_dimmed" : "light";
}

/** giscus iframe 已挂载后，通过 postMessage 切换主题 */
function syncGiscusTheme(): void {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame",
  );
  if (!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: giscusTheme() } } },
    "https://giscus.app",
  );
}

/** 已初始化的 twikoo 实例句柄，用于主题切换时重建 */
let twikooCleanup: (() => void) | null = null;

// 以 ?url 形式引入 Waline 样式：仅取得资源 URL 字符串，不触发 Vite 自动注入 <link>，
// 改为运行时按需注入，避免功能关闭时页面仍加载无用 CSS
import walineCssUrl from "@waline/client/style?url";

/** 运行时注入 Waline 样式 <link>，仅首次调用时生效 */
let walineCssLoaded = false;
function ensureWalineCss(): void {
  if (walineCssLoaded) return;
  walineCssLoaded = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = walineCssUrl;
  document.head.appendChild(link);
}

/** 初始化 twikoo：动态 import 后调用 init */
async function initTwikoo(mount: HTMLElement): Promise<void> {
  if (mount.dataset.xngInit === "1") return;
  const envId = mount.dataset.envId;
  const lang = mount.dataset.lang ?? "zh-CN";
  if (!envId) return;
  try {
    const twikoo = (await import("twikoo")).default;
    mount.innerHTML = "";
    twikoo({ envId, el: `#${mount.id}`, lang });
    mount.dataset.xngInit = "1";
    // twikoo 不支持运行时主题切换，记录用于重建的清理函数
    twikooCleanup = () => {
      mount.innerHTML = "";
      mount.dataset.xngInit = "";
    };
  } catch (err) {
    console.error("[xingluo] twikoo 初始化失败：", err);
  }
}

/** 初始化 waline：动态 import @waline/client 后调用 init */
async function initWaline(mount: HTMLElement): Promise<void> {
  if (mount.dataset.xngInit === "1") return;
  const serverURL = mount.dataset.serverUrl;
  const lang = mount.dataset.lang ?? "zh-CN";
  const pageSize = Number(mount.dataset.pageSize ?? 10);
  if (!serverURL) return;
  try {
    ensureWalineCss();
    const waline = await import("@waline/client");
    waline.init({
      el: `#${mount.id}`,
      serverURL,
      lang,
      pageSize,
      // 跟随站点 .dark 类自动切换暗色
      dark: "html.dark",
      path: window.location.pathname,
    });
    mount.dataset.xngInit = "1";
  } catch (err) {
    console.error("[xingluo] waline 初始化失败：", err);
  }
}

/** giscus 由其自身 client.js 注入，无需手动 init；仅需主题同步 */
function initGiscus(mount: HTMLElement): void {
  if (mount.dataset.xngInit === "1") return;
  mount.dataset.xngInit = "1";
  // client.js 已在 Giscus.astro 输出，这里仅做主题同步兜底
  syncGiscusTheme();
}

/** 扫描评论挂载点并按 provider 初始化 */
function setupComments(): void {
  const root = document.querySelector<HTMLElement>(".xng-comments-mount");
  if (!root || root.dataset.xngSetup === "1") return;
  root.dataset.xngSetup = "1";

  const provider = root.dataset.provider;
  if (!provider || provider === "false") return;

  // IntersectionObserver 懒触发：评论容器进入视口才加载
  const section = root.closest<HTMLElement>(".xng-comments");
  if (!section) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = root.querySelector<HTMLElement>(
          provider === "giscus"
            ? ".xng-giscus"
            : provider === "twikoo"
              ? ".xng-twikoo"
              : ".xng-waline",
        );
        if (!target) continue;
        if (provider === "giscus") initGiscus(target);
        else if (provider === "twikoo") void initTwikoo(target);
        else if (provider === "waline") void initWaline(target);
        io.disconnect();
        break;
      }
    },
    { rootMargin: "200px" },
  );
  io.observe(section);
}

/** 主题切换监听：观察 html class 变化，同步评论系统主题 */
function setupThemeSync(): void {
  // MutationObserver 观察 html 的 class 属性变化
  const observer = new MutationObserver(() => {
    const provider = document.querySelector<HTMLElement>(".xng-comments-mount")
      ?.dataset.provider;
    if (!provider) return;
    if (provider === "giscus") {
      syncGiscusTheme();
    } else if (provider === "twikoo" && twikooCleanup) {
      // twikoo 不支持运行时切换，重建以应用暗色样式
      twikooCleanup();
      setupComments();
    }
    // waline 通过 dark:'html.dark' 选择器自动跟随，无需处理
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
}

/** 初始化入口：兼容首次加载与 View Transitions 跳转 */
function init(): void {
  setupComments();
  setupThemeSync();
}

// 标记为模块，避免被当作全局脚本与其他文件顶层声明冲突
export {};

// 首次加载
init();

// View Transitions：每次页面加载后重新扫描
document.addEventListener("astro:page-load", init);
