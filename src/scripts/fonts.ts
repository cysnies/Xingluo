/**
 * 字体切换器客户端逻辑
 * - 读取 #xingluo-font-catalog JSON
 * - 应用 localStorage 选择（覆盖 SSR 默认）
 * - 下拉切换：更新 CSS 变量、按需 link、持久化
 */
import {
  FONT_STORAGE_KEY,
  FONT_LINK_ATTR,
  FONT_CATALOG_SCRIPT_ID,
  type ClientFontEntry,
} from "@/fonts/client";

function readCatalog(): ClientFontEntry[] {
  const el = document.getElementById(FONT_CATALOG_SCRIPT_ID);
  if (!el?.textContent) return [];
  try {
    return JSON.parse(el.textContent) as ClientFontEntry[];
  } catch {
    return [];
  }
}

function removeFontLinks(): void {
  document
    .querySelectorAll(`link[${FONT_LINK_ATTR}]`)
    .forEach((n) => n.remove());
}

function injectCss(cssUrl: string): void {
  removeFontLinks();
  if (!cssUrl || cssUrl.startsWith("data:")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  link.setAttribute(FONT_LINK_ATTR, "1");
  link.media = "print";
  link.onload = () => {
    link.media = "all";
  };
  document.head.appendChild(link);
}

function applyFont(entry: ClientFontEntry): void {
  const root = document.documentElement;
  root.style.setProperty("--font-sans", entry.stack);
  if (entry.monoStack) {
    root.style.setProperty("--font-mono", entry.monoStack);
  }
  root.dataset.font = entry.id;
  const meta = document.querySelector('meta[name="xingluo-font"]');
  if (meta) meta.setAttribute("content", entry.id);

  if (entry.source !== "system" && entry.cssUrl) {
    injectCss(entry.cssUrl);
  } else {
    removeFontLinks();
  }

  // 同步下拉选中态
  document.querySelectorAll<HTMLElement>("[data-font-option]").forEach((el) => {
    const active = el.dataset.fontOption === entry.id;
    el.setAttribute("aria-current", active ? "true" : "false");
    el.classList.toggle("bg-accent", active);
    el.classList.toggle("font-medium", active);
    el.classList.toggle("text-accent-foreground", active);
    el.classList.toggle("text-muted-foreground", !active);
  });
}

function setupFontSwitcher(): void {
  // 固定模式始终使用 SSR 全局字体，忽略此前保存的读者选择。
  if (document.documentElement.dataset.fontMode === "fixed") return;

  const catalog = readCatalog();
  if (catalog.length === 0) return;

  const stored = localStorage.getItem(FONT_STORAGE_KEY);
  const initial =
    catalog.find((f) => f.id === stored) ??
    catalog.find((f) => f.id === document.documentElement.dataset.font) ??
    catalog[0];
  if (initial) applyFont(initial);

  const root = document.querySelector<HTMLElement>("[data-font-switcher]");
  if (!root) return;

  root.querySelectorAll<HTMLElement>("[data-font-option]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.fontOption;
      const entry = catalog.find((f) => f.id === id);
      if (!entry) return;
      localStorage.setItem(FONT_STORAGE_KEY, entry.id);
      applyFont(entry);
      const details = root as HTMLDetailsElement;
      if ("open" in details) details.open = false;
    });
  });

  // 点击外部关闭
  const onOutside = (event: MouseEvent) => {
    const details = document.querySelector<HTMLDetailsElement>(
      "[data-font-switcher]",
    );
    if (!details?.open) return;
    if (details.contains(event.target as Node)) return;
    details.open = false;
  };
  document.removeEventListener("click", onOutside as EventListener);
  document.addEventListener("click", onOutside);
}

setupFontSwitcher();
document.addEventListener("astro:page-load", setupFontSwitcher);
export {};
