/**
 * 文章详情页客户端交互增强
 *
 * 包含四项功能：
 * - 标题锚点链接：为 h2~h6 追加可复制的 # 锚点
 * - 代码块复制按钮：为每个 pre 块生成复制按钮
 * - 图片灯箱：点击文章内图片打开无障碍预览，支持缩放与平移
 * - 阅读进度条：顶部滚动进度指示
 *
 * 所有功能在 View Transitions 切换后重新初始化
 */

/** 文章正文容器 */
const ARTICLE_SELECTOR = "#article";
/** 进度条容器 id */
const PROGRESS_BAR_ID = "reading-progress-bar";

/** 从文章容器读取 i18n 文案 */
function readLabels(root: HTMLElement) {
  const ds = root.dataset;
  return {
    copy: ds.copy ?? "Copy",
    copied: ds.copied ?? "Copied",
    zoom: ds.zoom ?? "Zoom image",
    preview: ds.preview ?? "Image preview: ",
    close: ds.close ?? "Close image preview",
  };
}

/** 为标题元素追加锚点链接 */
function addHeadingLinks(root: HTMLElement) {
  const headings = Array.from(root.querySelectorAll("h2, h3, h4, h5, h6"));
  for (const heading of headings) {
    if (heading.querySelector(".heading-link")) continue;
    if (!heading.id) continue;
    heading.classList.add("group", "heading-anchor");

    const link = document.createElement("a");
    link.className =
      "heading-link ms-1 no-underline opacity-60 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100";
    link.href = "#" + heading.id;
    link.setAttribute("aria-label", "链接到此标题");

    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.textContent = "#";
    link.appendChild(span);
    heading.appendChild(link);
  }
}

/** 为代码块追加复制按钮 */
function attachCopyButtons(
  root: HTMLElement,
  labels: { copy: string; copied: string },
) {
  const codeBlocks = Array.from(root.querySelectorAll("pre"));
  for (const codeBlock of codeBlocks) {
    // transformerFileName 在 pre 内注入了 .xng-code-header
    // 复制按钮放入 header 右侧操作区，与文件名/语言徽标同行
    const header = codeBlock.querySelector<HTMLElement>(
      ":scope > .xng-code-header",
    );
    const actions = header?.querySelector<HTMLElement>(
      ":scope > .xng-code-actions",
    );

    // 跳过已注入复制按钮的代码块（View Transitions 复用）
    const existingBtn = (actions ?? codeBlock.parentElement)?.querySelector(
      ":scope > .copy-code, .copy-code",
    );
    if (existingBtn) continue;

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className =
      "copy-code inline-flex items-center rounded border border-border bg-background/60 px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
    copyButton.textContent = labels.copy;
    codeBlock.setAttribute("tabindex", "0");

    if (actions) {
      // header 存在：复制按钮归入操作区
      actions.appendChild(copyButton);
    } else {
      // 无 header 回退：包裹 pre 并将按钮绝对定位在右上角内侧
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.dataset.copyWrap = "true";
      copyButton.classList.add("absolute", "end-2", "top-2", "z-10");
      codeBlock.parentNode?.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);
      wrapper.appendChild(copyButton);
    }

    copyButton.addEventListener("click", async () => {
      const code = codeBlock.querySelector("code");
      const text = code?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // 剪贴板不可用时静默失败，不影响阅读
      }
      copyButton.textContent = labels.copied;
      setTimeout(() => {
        copyButton.textContent = labels.copy;
      }, 700);
    });
  }
}

/** 阅读进度条：创建并绑定滚动监听（监听仅绑定一次，跨导航复用） */
let progressBarBound = false;
function setupProgressBar() {
  const existing = document.getElementById(PROGRESS_BAR_ID);
  if (!existing) {
    const bar = document.createElement("div");
    bar.id = PROGRESS_BAR_ID;
    bar.className =
      "fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-75 ease-out motion-reduce:transition-none";
    document.body.appendChild(bar);
  }

  if (progressBarBound) return;
  progressBarBound = true;

  const update = () => {
    const bar = document.getElementById(PROGRESS_BAR_ID);
    if (!bar) return;
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const ratio = height > 0 ? scrollTop / height : 0;
    bar.style.transform = `scaleX(${ratio})`;
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}

/** 灯箱相关状态 */
interface LightboxState {
  overlay: HTMLElement | null;
  image: HTMLImageElement | null;
  lastFocused: Element | null;
  currentScale: number;
  translateX: number;
  translateY: number;
  initialDist: number;
  initialScale: number;
  panStartX: number;
  panStartY: number;
  panStartTranslateX: number;
  panStartTranslateY: number;
  lastTapTime: number;
}

/** 初始化图片灯箱 */
function initLightbox(
  root: HTMLElement,
  labels: {
    zoom: string;
    preview: string;
    close: string;
  },
) {
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state: LightboxState = {
    overlay: null,
    image: null,
    lastFocused: null,
    currentScale: 1,
    translateX: 0,
    translateY: 0,
    initialDist: 0,
    initialScale: 1,
    panStartX: 0,
    panStartY: 0,
    panStartTranslateX: 0,
    panStartTranslateY: 0,
    lastTapTime: 0,
  };

  // 延迟设置无障碍属性，避免影响 LCP
  requestAnimationFrame(() => {
    const images = Array.from(root.querySelectorAll("img"));
    for (const image of images) {
      if (image.closest("a")) continue;
      if (image.dataset.lightboxReady === "true") continue;
      image.setAttribute("role", "button");
      image.setAttribute("tabindex", "0");
      image.setAttribute("aria-haspopup", "dialog");
      image.setAttribute(
        "aria-label",
        image.alt ? `${labels.zoom}: ${image.alt}` : labels.zoom,
      );
      image.dataset.lightboxReady = "true";
    }
  });

  function applyTransform() {
    if (state.image) {
      state.image.style.transform = `scale(${state.currentScale}) translate(${state.translateX}px, ${state.translateY}px)`;
    }
  }

  function resetTransform() {
    state.currentScale = 1;
    state.translateX = 0;
    state.translateY = 0;
    if (state.image) state.image.style.transform = "";
  }

  function close() {
    if (!state.overlay) return;
    const el = state.overlay;
    state.overlay = null;
    state.image = null;
    window.__closeLightbox = null;

    document.removeEventListener("keydown", onKeyDown);
    document.body.style.overflow = "";
    const last = state.lastFocused as HTMLElement | null;
    state.lastFocused = null;
    last?.focus();

    if (prefersReducedMotion()) {
      el.remove();
      return;
    }
    const remove = () => el.remove();
    el.addEventListener("transitionend", remove, { once: true });
    setTimeout(remove, 250);
    el.classList.remove("opacity-100");
  }

  function trapFocus(e: KeyboardEvent) {
    if (!state.overlay) return;
    const focusables = state.overlay.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0] as HTMLElement;
    const last = focusables[focusables.length - 1] as HTMLElement;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "Tab") {
      trapFocus(e);
    }
  }

  function open(src: string, alt: string, trigger: Element | null) {
    if (state.overlay) return;
    state.lastFocused = trigger ?? document.activeElement;

    const overlay = document.createElement("div");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute(
      "aria-label",
      alt ? `${labels.preview}${alt}` : labels.zoom,
    );
    overlay.className =
      "fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-black/70 opacity-0 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", labels.close);
    closeButton.className =
      "absolute end-4 top-4 rounded p-2 text-3xl leading-none text-white transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
    closeButton.innerHTML = "&#10005;";
    closeButton.addEventListener("click", close);

    const image = document.createElement("img");
    image.src = src;
    image.alt = "";
    image.className =
      "max-h-[90dvh] max-w-[90dvw] cursor-default object-contain transition-transform motion-reduce:transition-none";

    overlay.append(closeButton, image);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay && state.currentScale <= 1) close();
    });

    state.overlay = overlay;
    state.image = image;

    // 触摸缩放与平移
    overlay.addEventListener(
      "touchstart",
      (e) => {
        const t = e.touches;
        if (t.length === 2) {
          state.initialDist = Math.hypot(
            t[1].clientX - t[0].clientX,
            t[1].clientY - t[0].clientY,
          );
          state.initialScale = state.currentScale;
        } else if (t.length === 1) {
          const now = Date.now();
          if (now - state.lastTapTime < 300) {
            e.preventDefault();
            if (state.currentScale > 1) {
              resetTransform();
            } else {
              state.currentScale = 2;
              state.translateX = 0;
              state.translateY = 0;
              applyTransform();
            }
            state.lastTapTime = 0;
          } else {
            state.lastTapTime = now;
          }
          state.panStartX = t[0].clientX;
          state.panStartY = t[0].clientY;
          state.panStartTranslateX = state.translateX;
          state.panStartTranslateY = state.translateY;
        }
      },
      { passive: false },
    );

    overlay.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches;
        if (t.length === 2) {
          e.preventDefault();
          const dist = Math.hypot(
            t[1].clientX - t[0].clientX,
            t[1].clientY - t[0].clientY,
          );
          state.currentScale = Math.min(
            4,
            Math.max(1, state.initialScale * (dist / state.initialDist)),
          );
          applyTransform();
        } else if (t.length === 1 && state.currentScale > 1) {
          e.preventDefault();
          state.translateX =
            state.panStartTranslateX +
            (t[0].clientX - state.panStartX) / state.currentScale;
          state.translateY =
            state.panStartTranslateY +
            (t[0].clientY - state.panStartY) / state.currentScale;
          const maxX = Math.max(
            0,
            (image.clientWidth - overlay.clientWidth / state.currentScale) / 2,
          );
          const maxY = Math.max(
            0,
            (image.clientHeight - overlay.clientHeight / state.currentScale) /
              2,
          );
          state.translateX = Math.min(maxX, Math.max(-maxX, state.translateX));
          state.translateY = Math.min(maxY, Math.max(-maxY, state.translateY));
          applyTransform();
        }
      },
      { passive: false },
    );

    overlay.addEventListener("touchend", (e) => {
      if (e.touches.length === 0 && state.currentScale <= 1.05) {
        resetTransform();
      }
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    window.__closeLightbox = close;

    requestAnimationFrame(() => overlay.classList.add("opacity-100"));
    closeButton.focus();
  }

  function triggerFromEvent(e: Event): HTMLImageElement | null {
    const target = e.target as Element | null;
    const image = target?.closest?.("img") as HTMLImageElement | null;
    if (!image || !root.contains(image) || image.closest("a")) return null;
    return image;
  }

  function activate(image: HTMLImageElement) {
    open(image.currentSrc || image.src, image.alt, image);
  }

  root.addEventListener("click", (e) => {
    const image = triggerFromEvent(e);
    if (!image) return;
    e.preventDefault();
    activate(image);
  });

  root.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    const image = triggerFromEvent(e);
    if (!image) return;
    e.preventDefault();
    activate(image);
  });
}

/** 初始化全部文章页交互 */
function setupPostEnhancements() {
  const root = document.querySelector<HTMLElement>(ARTICLE_SELECTOR);
  if (!root) return;

  const labels = readLabels(root);
  addHeadingLinks(root);
  attachCopyButtons(root, labels);
  initLightbox(root, labels);
  setupProgressBar();
}

setupPostEnhancements();

// View Transitions 切换后重新初始化，并回到顶部
document.addEventListener("astro:after-swap", () => {
  setupPostEnhancements();
  window.scrollTo({ left: 0, top: 0, behavior: "instant" });
});

// 切换前关闭可能打开的灯箱，避免残留
document.addEventListener("astro:before-swap", () => {
  window.__closeLightbox?.();
});

interface Window {
  __closeLightbox?: (() => void) | null;
}
