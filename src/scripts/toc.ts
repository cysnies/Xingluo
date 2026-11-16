import { getActiveHeadingIndex } from "@/utils/toc";

/** 两份目录共享章节定位，各自测量轨道和滚动区域。 */
let dispose: (() => void) | undefined;

function setupToc() {
  dispose?.();
  dispose = undefined;

  const article = document.querySelector<HTMLElement>("#article");
  const tocs = [...document.querySelectorAll<HTMLElement>("[data-toc]")];
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"),
  ];
  const ids = new Set(links.map((link) => link.dataset.tocLink));
  if (!article || tocs.length === 0) return;

  const headings = [
    ...article.querySelectorAll<HTMLElement>(
      "h2[id], h3[id], h4[id], h5[id], h6[id]",
    ),
  ].filter((heading) => ids.has(heading.id));
  if (headings.length === 0) return;

  const mobile =
    document.querySelector<HTMLDetailsElement>("[data-toc-mobile]");
  const summary = mobile?.querySelector<HTMLElement>("summary");
  const controller = new AbortController();
  const { signal } = controller;
  let frame: number | null = null;
  let revealActive = false;
  let activeId = "";

  function update(reveal: boolean) {
    const headerHeight =
      document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const offset = headerHeight + (summary?.offsetHeight ?? 0) + 24;
    const scrollOffset = `${offset}px`;
    if (
      article!.style.getPropertyValue("--toc-scroll-offset") !== scrollOffset
    ) {
      article!.style.setProperty("--toc-scroll-offset", scrollOffset);
    }
    const index = getActiveHeadingIndex(
      headings.map((heading) => heading.getBoundingClientRect().top),
      offset,
    );
    const heading = headings[index];
    if (!heading) return;
    const changed = activeId !== heading.id;
    activeId = heading.id;

    if (changed) {
      for (const link of links) {
        const active = link.dataset.tocLink === activeId;
        link.dataset.active = String(active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
      const label =
        links
          .find((link) => link.dataset.tocLink === activeId)
          ?.textContent?.trim() ?? "";
      document
        .querySelectorAll<HTMLElement>("[data-toc-current]")
        .forEach((current) => {
          current.textContent = label;
          current.title = label;
        });
    }

    for (const toc of tocs) {
      const active = toc.querySelector<HTMLElement>(
        '[aria-current="location"]',
      );
      const track = toc.querySelector<HTMLElement>("[data-toc-track]");
      const thumb = toc.querySelector<HTMLElement>("[data-toc-thumb]");
      if (!active || !track || !thumb) continue;
      if (active.getClientRects().length === 0) {
        thumb.hidden = true;
        continue;
      }
      const rect = active.getBoundingClientRect();
      const top = rect.top - track.getBoundingClientRect().top + 6;
      thumb.hidden = false;
      thumb.style.height = `${Math.max(12, rect.height - 12)}px`;
      thumb.style.transform = `translateY(${top}px)`;

      const scroller = toc.closest<HTMLElement>("[data-toc-scroll]");
      if (scroller && (changed || reveal)) {
        const area = scroller.getBoundingClientRect();
        const titleHeight =
          toc.querySelector<HTMLElement>("[data-toc-header]")?.offsetHeight ??
          0;
        const topPadding = titleHeight + 12;
        if (rect.top < area.top + topPadding)
          scroller.scrollTop += rect.top - area.top - topPadding;
        else if (rect.bottom > area.bottom - 12)
          scroller.scrollTop += rect.bottom - area.bottom + 12;
      }
    }
  }

  function schedule(reveal = false) {
    revealActive = revealActive || reveal;
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      const reveal = revealActive;
      revealActive = false;
      update(reveal);
    });
  }

  window.addEventListener("scroll", () => schedule(), {
    passive: true,
    signal,
  });
  window.addEventListener("resize", () => schedule(true), {
    passive: true,
    signal,
  });
  mobile?.addEventListener(
    "toggle",
    () => {
      if (mobile.open) schedule(true);
    },
    { signal },
  );

  document.addEventListener(
    "click",
    (event) => {
      if (!mobile?.open || !(event.target instanceof Element)) return;
      if (!mobile.contains(event.target)) {
        mobile.open = false;
        return;
      }
      const link = event.target.closest<HTMLAnchorElement>("[data-toc-link]");
      if (
        !link ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      mobile.open = false;
      const heading = headings.find(
        (heading) => heading.id === link.dataset.tocLink,
      );
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    },
    { signal },
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape" || !mobile?.open) return;
      const restoreFocus = mobile.contains(document.activeElement);
      mobile.open = false;
      if (restoreFocus) summary?.focus({ preventScroll: true });
    },
    { signal },
  );

  document.addEventListener(
    "focusin",
    (event) => {
      if (
        mobile?.open &&
        event.target instanceof Node &&
        !mobile.contains(event.target)
      ) {
        mobile.open = false;
      }
    },
    { signal },
  );

  const observer =
    typeof ResizeObserver === "undefined"
      ? undefined
      : new ResizeObserver(() => schedule(true));
  observer?.observe(article);
  tocs.forEach((toc) => observer?.observe(toc));
  if (summary) observer?.observe(summary);

  dispose = () => {
    controller.abort();
    observer?.disconnect();
    if (frame !== null) cancelAnimationFrame(frame);
  };
  schedule(true);
}

document.addEventListener("astro:page-load", setupToc);
document.addEventListener("astro:before-swap", () => {
  dispose?.();
  dispose = undefined;
});
setupToc();
