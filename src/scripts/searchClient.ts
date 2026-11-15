/** 轻量 base 拼接，避免拉入 withBase→config 整包 */
function getAssetPath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const root = base === "" ? "/" : `${base}/`;
  const norm = path.replace(/^\/+/, "");
  if (!norm) return base === "" ? "/" : base;
  return root + norm;
}

interface SearchDoc {
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

function snippet(text: string, query: string, win = 80): string {
  if (!text) return "";
  if (!query) return text.slice(0, 200);
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text.slice(0, 200);
  const start = Math.max(0, idx - win);
  const end = Math.min(text.length, idx + query.length + win);
  return `${start > 0 ? "..." : ""}${text.slice(start, end)}${end < text.length ? "..." : ""}`;
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

function createResultCard(doc: SearchDoc, query: string): HTMLAnchorElement {
  const card = document.createElement("a");
  card.href = doc.url;
  card.className =
    "search-result-card search-result-enter block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";
  card.setAttribute("role", "listitem");

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

  const desc = snippet(doc.description || doc.content, query);
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
}

function showNoResults(state: SearchState) {
  state.hintEl?.classList.add("hidden");
  state.noResultsEl?.classList.remove("hidden");
  if (state.resultsEl) state.resultsEl.innerHTML = "";
  state.statsEl?.classList.add("hidden");
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
  for (const doc of docs)
    state.resultsEl!.appendChild(createResultCard(doc, query));
  state.params.set("q", query);
  history.replaceState(history.state, "", "?" + state.params.toString());
  sessionStorage.setItem(
    "backUrl",
    `${window.location.pathname}?${state.params.toString()}`,
  );
}

function textSearch(state: SearchState, query: string) {
  const q = query.toLowerCase();
  const docs = state.documents.filter((d) =>
    `${d.title} ${d.description} ${d.content} ${(d.tags || []).join(" ")}`
      .toLowerCase()
      .includes(q),
  );
  if (!docs.length) showNoResults(state);
  else renderResults(state, docs, query);
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
  const raw = state.index.search(query, { limit: 50, enrich: true }) as Array<{
    field: string;
    result: Array<{ doc: SearchDoc }>;
  }>;
  const map = new Map<string, SearchDoc>();
  for (const fr of raw || []) {
    for (const item of fr.result || []) {
      if (item.doc?.id && !map.has(item.doc.id)) map.set(item.doc.id, item.doc);
    }
  }
  const docs = Array.from(map.values());
  if (!docs.length) textSearch(state, query);
  else renderResults(state, docs, query);
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
    }
    state.documents = await resp.json();
    if (!state.documents?.length) return;

    const flexMod = await import("flexsearch");
    const FlexSearch = flexMod.default ?? flexMod;
    state.index = new FlexSearch.Document({
      document: {
        id: "id",
        index: [
          { field: "title", tokenize: "forward", resolution: 9 },
          { field: "description", tokenize: "forward", resolution: 5 },
          { field: "content", tokenize: "forward", resolution: 3 },
          { field: "tags", tokenize: "forward", resolution: 5 },
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
      tokenize: "forward",
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
  }
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
      clearBtn?.classList.add("hidden");
      if (state.debounceTimer) clearTimeout(state.debounceTimer);
      showHint(state);
      history.replaceState(history.state, "", window.location.pathname);
    }
  });

  clearBtn?.addEventListener("click", () => {
    newInput.value = "";
    clearBtn.classList.add("hidden");
    if (state.debounceTimer) clearTimeout(state.debounceTimer);
    showHint(state);
    history.replaceState(history.state, "", window.location.pathname);
    newInput.focus();
  });

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

  bindEvents(state, container);

  const bootIndex = () => {
    if (
      container.dataset.searchReady === "true" ||
      container.dataset.searchLoading === "true"
    ) {
      return;
    }
    container.dataset.searchLoading = "true";
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
