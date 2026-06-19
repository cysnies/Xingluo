const THEME_KEY = "theme";
const LIGHT = "light";
const DARK = "dark";

/** 获取用户偏好主题：优先 localStorage，否则使用系统偏好 */
function getPreferredTheme(): string {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;
}

// 复用 FOUC 防护内联脚本已设置的主题值
let themeValue: string =
  (window as unknown as { __theme?: { value: string } }).__theme?.value ??
  getPreferredTheme();

/** 持久化主题并同步到 DOM */
function persist(): void {
  localStorage.setItem(THEME_KEY, themeValue);
  reflect();
}

/** 将当前主题反映到根元素与切换按钮 */
function reflect(): void {
  const root = document.firstElementChild;
  root?.setAttribute("data-theme", themeValue);
  root?.classList.toggle("dark", themeValue === DARK);
  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  // 用 body 的计算背景色填充 <meta name="theme-color">，
  // 使 Android 浏览器顶栏与页面背景一致
  const bg = window.getComputedStyle(document.body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bg);
}

/** 初始化主题切换 */
function setup(): void {
  reflect();
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    persist();
  });
}

setup();

// View Transitions 导航后重新绑定
document.addEventListener("astro:after-swap", setup);

// 跨 View Transitions 携带 theme-color，避免 Android 导航栏在页面切换时闪烁
document.addEventListener("astro:before-swap", (event) => {
  const color = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");
  if (color) {
    (event as unknown as { newDocument: Document }).newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", color);
  }
});

// 跟随系统级暗色/亮色偏好变化
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    themeValue = matches ? DARK : LIGHT;
    persist();
  });
