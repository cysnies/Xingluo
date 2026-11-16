import type { Encoders } from "flexsearch";

/** 轻量 base 拼接，避免拉入 withBase→config 整包 */
function getAssetPath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const root = base === "" ? "/" : `${base}/`;
  const norm = path.replace(/^\/+/, "");
  if (!norm) return base === "" ? "/" : base;
  return root + norm;
}

export interface SearchDoc {
  [key: string]: unknown;
  id: string;
  title: string;
  description: string;
  pubDatetime: string;
  modDatetime: string;
  tags: string[];
  category: string;
  url: string;
  content: string;
}

type FlexIndex = any; // eslint-disable-line @typescript-eslint/no-explicit-any

interface SearchState {
  index: FlexIndex | null;
  documents: SearchDoc[];
  locale: string;
  params: URLSearchParams;
  debounceTimer: ReturnType<typeof setTimeout> | null;
  input: HTMLInputElement | null;
  clearBtn: HTMLElement | null;
  resultsEl: HTMLElement | null;
  hintEl: HTMLElement | null;
  noResultsEl: HTMLElement | null;
  statsEl: HTMLElement | null;
}

function getSearchState(container: HTMLElement): SearchState {
  const key = "_searchState";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = container as any;
  if (c[key]) return c[key] as SearchState;
  const state: SearchState = {
    index: null,
    documents: [],
    locale: "",
    params: new URLSearchParams(window.location.search),
    debounceTimer: null,
    input: null,
    clearBtn: null,
    resultsEl: null,
    hintEl: null,
    noResultsEl: null,
    statsEl: null,
  };
  c[key] = state;
  return state;
}

const LOCALES = "zh-cn,zh-tw,en,ja,ko,fr,de,es,pt,ru,ar,eo".split(",");
const CJK_LOCALES = new Set(["zh-cn", "zh-tw", "ja", "ko"]);

function normalizeSearchText(text: string): string {
  return text.normalize("NFKC").toLocaleLowerCase();
}

function getSearchableText(doc: SearchDoc): string {
  return normalizeSearchText(
    `${doc.title} ${doc.description} ${doc.content} ${doc.category} ${(doc.tags || []).join(" ")}`,
  );
}

function rankSearchDocs(docs: SearchDoc[], query: string): SearchDoc[] {
  const phrase = normalizeSearchText(query).replace(/\s+/g, " ").trim();
  const terms = phrase.split(" ").filter(Boolean);
  if (!terms.length) return [];

  return docs
    .map((doc, index) => {
      const text = getSearchableText(doc);
      const title = normalizeSearchText(doc.title);
      if (!terms.every((term) => text.includes(term))) return null;

      let score = 0;
      if (text.includes(phrase)) score += 8;
      if (title.includes(phrase)) score += 16;
      if (terms.every((term) => title.includes(term))) score += 6;
      return { doc, index, score };
    })
    .filter(
      (item): item is { doc: SearchDoc; index: number; score: number } =>
        item !== null,
    )
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ doc }) => doc);
}

function createSearchEncoder(locale: string): Encoders {
  if (!CJK_LOCALES.has(locale)) return "Default";
  if (typeof Intl.Segmenter !== "function") return "CJK";

  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  return (text: string): string[] => {
    return [...segmenter.segment(normalizeSearchText(text))]
      .filter((part) => part.isWordLike)
      .map((part) => part.segment);
  };
}

function detectLocale(): string {
  const segs = window.location.pathname.replace(/\/+$/, "").split("/");
  for (let i = 1; i < segs.length; i++) {
    if (LOCALES.includes(segs[i]!)) return segs[i]!;
  }
  return "zh-cn";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightText(text: string, query: string): string {
  if (!query || !text) return escapeHtml(text);
  const terms = query
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!terms.length) return escapeHtml(text);
  return escapeHtml(text).replace(
    new RegExp(`(${terms.map(escapeHtml).join("|")})`, "gi"),
    '<mark class="search-highlight">$1</mark>',
  );
}

function findMatchIndex(text: string, query: string): number {
  if (!text || !query) return -1;
  const haystack = text.toLocaleLowerCase();
  const phrase = query.replace(/\s+/g, " ").trim().toLocaleLowerCase();
  const candidates = [phrase, ...phrase.split(" ")].filter(Boolean);
  return candidates.reduce((earliest, term) => {
    const index = haystack.indexOf(term);
    if (index < 0) return earliest;
    return earliest < 0 ? index : Math.min(earliest, index);
  }, -1);
}

function snippet(text: string, query: string, win = 80): string {
  if (!text) return "";
  if (!query) return text.slice(0, 200);
  const idx = findMatchIndex(text, query);
  if (idx < 0) return text.slice(0, 200);
  const matchedLength =
    text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase(), idx) >= 0
      ? query.length
      : query.split(/\s+/)[0]?.length || 1;
  const start = Math.max(0, idx - win);
  const end = Math.min(text.length, idx + matchedLength + win);
  return `${start > 0 ? "..." : ""}${text.slice(start, end)}${end < text.length ? "..." : ""}`;
}

export function getSearchSnippet(
  doc: Pick<SearchDoc, "content" | "description">,
  query: string,
): string {
  if (findMatchIndex(doc.content, query) >= 0) {
    return snippet(doc.content, query);
  }
  if (findMatchIndex(doc.description, query) >= 0) {
    return snippet(doc.description, query);
  }
  return snippet(doc.description || doc.content, query);
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function createResultCard(
  doc: SearchDoc,
  query: string,
  index: number,
): HTMLAnchorElement {
  const card = document.createElement("a");
  card.id = `search-result-${index}`;
  card.href = getAssetPath(doc.url);
  card.className =
    "search-result-card search-result-enter block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";
  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", doc.title);

  const meta: string[] = [];
  if (doc.pubDatetime) meta.push(fmtDate(doc.pubDatetime));
  if (doc.modDatetime && doc.pubDatetime) {
    try {
      if (new Date(doc.modDatetime) > new Date(doc.pubDatetime)) {
        meta.push("↻ " + fmtDate(doc.modDatetime));
      }
    } catch {
      /* ignore */
    }
  }
  if (doc.category) {
    meta.push(
      `<span class="inline-flex items-center rounded-sm bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">${escapeHtml(doc.category)}</span>`,
    );
  }

  const desc = getSearchSnippet(doc, query);
  const tags = (doc.tags || [])
    .slice(0, 5)
    .map(
      (tag) =>
        `<span class="inline-block rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">${escapeHtml(tag)}</span>`,
    )
    .join("");

  card.innerHTML = `<h3 class="mb-1 text-lg font-semibold text-primary">${highlightText(doc.title, query)}</h3>
${meta.length ? `<div class="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">${meta.join(" · ")}</div>` : ""}
<p class="mb-2 text-sm text-muted-foreground line-clamp-3">${highlightText(desc, query)}</p>
${tags ? `<div class="flex flex-wrap gap-1.5">${tags}</div>` : ""}`;
  return card;
}

function showHint(state: SearchState) {
  state.hintEl?.classList.remove("hidden");
  state.noResultsEl?.classList.add("hidden");
  if (state.resultsEl) state.resultsEl.innerHTML = "";
  state.statsEl?.classList.add("hidden");
  state.input?.setAttribute("aria-expanded", "false");
}

function showNoResults(state: SearchState) {
  state.hintEl?.classList.add("hidden");
  state.noResultsEl?.classList.remove("hidden");
  if (state.resultsEl) state.resultsEl.innerHTML = "";
  state.statsEl?.classList.add("hidden");
  state.input?.setAttribute("aria-expanded", "false");
}

function renderResults(state: SearchState, docs: SearchDoc[], query: string) {
  state.hintEl?.classList.add("hidden");
  state.noResultsEl?.classList.add("hidden");
  state.resultsEl!.innerHTML = "";
  if (state.statsEl) {
    const tpl = state.statsEl.dataset.resultsTpl?.trim() || "{{count}} results";
    state.statsEl.textContent = tpl.replace(
      /\{\{\s*count\s*\}\}/g,
      String(docs.length),
    );
    state.statsEl.classList.remove("hidden");
  }
  for (const [index, doc] of docs.entries())
    state.resultsEl!.appendChild(createResultCard(doc, query, index));
  state.input?.setAttribute("aria-expanded", "true");
  state.params.set("q", query);
  history.replaceState(history.state, "", "?" + state.params.toString());
  sessionStorage.setItem(
    "backUrl",
    `${window.location.pathname}?${state.params.toString()}`,
  );
}

function textSearch(state: SearchState, query: string) {
  const docs = rankSearchDocs(state.documents, query);
  if (!docs.length) showNoResults(state);
  else renderResults(state, docs.slice(0, 50), query);
}

function performSearch(state: SearchState, query: string) {
  if (!query.trim()) {
    showHint(state);
    return;
  }
  if (!state.index) {
    textSearch(state, query);
    return;
  }
  const raw = state.index.search(query, { limit: 100, enrich: true }) as Array<{
    field: string;
    result: Array<{ doc: SearchDoc }>;
  }>;
  const map = new Map<string, SearchDoc>();
  for (const fr of raw || []) {
    for (const item of fr.result || []) {
      if (item.doc?.id && !map.has(item.doc.id)) map.set(item.doc.id, item.doc);
    }
  }
  const docs = rankSearchDocs(Array.from(map.values()), query);
  if (!docs.length) textSearch(state, query);
  else renderResults(state, docs.slice(0, 50), query);
}

async function loadIndex(state: SearchState, container: HTMLElement) {
  try {
    const dataUrl = getAssetPath(`search/${state.locale}.json`);
    let resp = await fetch(dataUrl);
    if (!resp.ok) {
      const mResp = await fetch(getAssetPath("search/manifest.json"));
      if (!mResp.ok) return;
      const manifest: string[] = await mResp.json();
      if (!manifest.length) return;
      const lang = manifest.includes(state.locale)
        ? state.locale
        : manifest[0]!;
      resp = await fetch(getAssetPath(`search/${lang}.json`));
      if (!resp.ok) return;
      state.locale = lang;
    }
    state.documents = await resp.json();
    if (!state.documents?.length) return;

    const flexMod = await import("flexsearch");
    const FlexSearch = flexMod.default ?? flexMod;
    const tokenize = CJK_LOCALES.has(state.locale) ? "strict" : "forward";
    state.index = new FlexSearch.Document({
      encoder: createSearchEncoder(state.locale),
      document: {
        id: "id",
        index: [
          { field: "title", tokenize, resolution: 9 },
          { field: "description", tokenize, resolution: 5 },
          { field: "content", tokenize, resolution: 3 },
          { field: "tags", tokenize, resolution: 5 },
        ],
        store: [
          "title",
          "description",
          "pubDatetime",
          "modDatetime",
          "tags",
          "category",
          "url",
          "content",
        ],
      },
      tokenize,
      cache: true,
    });
    for (const doc of state.documents) state.index.add(doc);
    container.dataset.searchReady = "true";
    const query = state.params.get("q");
    if (query && state.input) {
      state.input.value = query;
      performSearch(state, query);
    }
  } catch (err) {
    console.warn("[search] index load failed:", err);
    delete container.dataset.searchLoading;
  } finally {
    container.removeAttribute("aria-busy");
  }
}

function focusSearchResult(
  state: SearchState,
  direction: "first" | "next" | "previous",
) {
  const cards = Array.from(
    state.resultsEl?.querySelectorAll<HTMLAnchorElement>(
      ".search-result-card",
    ) ?? [],
  );
  if (!cards.length) return;

  if (direction === "first") {
    cards[0]?.focus();
    return;
  }

  const active = document.activeElement;
  const current = cards.findIndex((card) => card === active);
  const offset = direction === "next" ? 1 : -1;
  const next =
    current < 0
      ? direction === "next"
        ? 0
        : cards.length - 1
      : (current + offset + cards.length) % cards.length;
  cards[next]?.focus();
}

function clearSearch(
  state: SearchState,
  input: HTMLInputElement,
  clearBtn: HTMLElement | null,
) {
  input.value = "";
  clearBtn?.classList.add("hidden");
  if (state.debounceTimer) clearTimeout(state.debounceTimer);
  showHint(state);
  history.replaceState(history.state, "", window.location.pathname);
}

function bindEvents(state: SearchState, container: HTMLElement) {
  if (!state.input) return;
  const oldInput = state.input;
  const newInput = oldInput.cloneNode(true) as HTMLInputElement;
  oldInput.parentNode?.replaceChild(newInput, oldInput);
  state.input = newInput;
  state.clearBtn = container.querySelector("#search-clear");
  state.resultsEl = container.querySelector("#search-results");
  state.hintEl = container.querySelector("#search-hint");
  state.noResultsEl = container.querySelector("#search-no-results");
  state.statsEl = container.querySelector("#search-stats");
  const clearBtn = state.clearBtn;

  newInput.addEventListener("input", (e: Event) => {
    const query = (e.target as HTMLInputElement).value.trim();
    if (query) {
      clearBtn?.classList.remove("hidden");
      if (state.debounceTimer) clearTimeout(state.debounceTimer);
      state.debounceTimer = setTimeout(() => performSearch(state, query), 200);
    } else {
      clearSearch(state, newInput, clearBtn);
    }
  });

  clearBtn?.addEventListener("click", () => {
    clearSearch(state, newInput, clearBtn);
    newInput.focus();
  });

  newInput.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusSearchResult(state, "first");
    } else if (event.key === "Escape" && newInput.value) {
      event.preventDefault();
      clearSearch(state, newInput, clearBtn);
    }
  });

  state.resultsEl!.onkeydown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusSearchResult(state, event.key === "ArrowDown" ? "next" : "previous");
    } else if (event.key === "Escape") {
      event.preventDefault();
      newInput.focus();
    }
  };

  const query = state.params.get("q");
  if (query) {
    newInput.value = query;
    clearBtn?.classList.remove("hidden");
    if (container.dataset.searchReady === "true") performSearch(state, query);
  }
}

export function initSearch() {
  const container = document.querySelector<HTMLElement>("#flexsearch-ui");
  if (!container) return;
  const state = getSearchState(container);
  state.input = container.querySelector("#search-input");
  state.clearBtn = container.querySelector("#search-clear");
  state.resultsEl = container.querySelector("#search-results");
  state.hintEl = container.querySelector("#search-hint");
  state.noResultsEl = container.querySelector("#search-no-results");
  state.statsEl = container.querySelector("#search-stats");
  state.locale = detectLocale();
  state.params = new URLSearchParams(window.location.search);
  if (!state.input || !state.resultsEl) return;
  state.input.setAttribute("aria-expanded", "false");

  bindEvents(state, container);

  const bootIndex = () => {
    if (
      container.dataset.searchReady === "true" ||
      container.dataset.searchLoading === "true"
    ) {
      return;
    }
    container.dataset.searchLoading = "true";
    container.setAttribute("aria-busy", "true");
    void loadIndex(state, container);
  };

  if (import.meta.env.DEV && !container.dataset.devNotice) {
    container.dataset.devNotice = "1";
    const n = document.createElement("div");
    n.className = "mb-4 rounded-md bg-muted p-4 text-sm";
    n.innerHTML =
      '<p><strong>Dev:</strong> build once for search data.</p><code class="mt-2 block rounded bg-background px-2 py-1">pnpm run build</code>';
    container.prepend(n);
  }

  if (container.dataset.searchReady === "true") {
    const query = state.params.get("q");
    if (query && state.input.value !== query) {
      state.input.value = query;
      performSearch(state, query);
    }
  } else if (state.params.get("q")) {
    bootIndex();
  } else {
    state.input.addEventListener("focus", bootIndex, { once: true });
    state.input.addEventListener("input", bootIndex, { once: true });
  }
}
