/** 轻量 base 拼接，避免把站点配置引入搜索脚本。 */
function getAssetPath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const root = base === "" ? "/" : `${base}/`;
  const norm = path.replace(/^\/+/, "");
  if (!norm) return base === "" ? "/" : base;
  return root + norm;
}

interface PagefindSubResult {
  title?: string;
  url: string;
  excerpt: string;
}

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: Record<string, string>;
  filters?: Record<string, string[]>;
  sub_results?: PagefindSubResult[];
}

interface PagefindResult {
  data(): Promise<PagefindResultData>;
}

interface PagefindSearchResponse {
  results: PagefindResult[];
  unfilteredResultCount?: number;
}

interface PagefindModule {
  init(): Promise<void>;
  options(options: Record<string, unknown>): Promise<void> | void;
  search(
    query: string,
    options?: Record<string, unknown>,
  ): Promise<PagefindSearchResponse>;
  filters(): Promise<Record<string, Record<string, number>>>;
}

interface SearchRecord {
  url: string;
  title: string;
  description: string;
  pubDatetime: string;
  category: string;
  tags: string[];
  excerpt: string;
  subResults: PagefindSubResult[];
}

interface SearchState {
  pagefind: PagefindModule | null;
  loading: Promise<PagefindModule> | null;
  records: SearchRecord[];
  allRecords: SearchRecord[];
  availableCategories: string[];
  locale: string;
  requestId: number;
  params: URLSearchParams;
  debounceTimer: ReturnType<typeof setTimeout> | null;
  input: HTMLInputElement | null;
  clearBtn: HTMLElement | null;
  resultsEl: HTMLElement | null;
  workspaceEl: HTMLElement | null;
  filterPanelEl: HTMLElement | null;
  filtersEl: HTMLElement | null;
  hintEl: HTMLElement | null;
  noResultsEl: HTMLElement | null;
  statsEl: HTMLElement | null;
  lastQuery: string;
  selectedCategories: Set<string>;
}

function getSearchState(container: HTMLElement): SearchState {
  const key = "_searchState";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = container as any;
  if (c[key]) return c[key] as SearchState;

  const state: SearchState = {
    pagefind: null,
    loading: null,
    records: [],
    allRecords: [],
    availableCategories: [],
    locale: "zh-cn",
    requestId: 0,
    params: new URLSearchParams(window.location.search),
    debounceTimer: null,
    input: null,
    clearBtn: null,
    resultsEl: null,
    workspaceEl: null,
    filterPanelEl: null,
    filtersEl: null,
    hintEl: null,
    noResultsEl: null,
    statsEl: null,
    lastQuery: "",
    selectedCategories: new Set(),
  };
  c[key] = state;
  return state;
}

const LOCALES = "zh-cn,zh-tw,en,ja,ko,fr,de,es,pt,ru,ar,eo".split(",");

function detectLocale(): string {
  const segments = window.location.pathname.replace(/\/+$/, "").split("/");
  for (let index = 1; index < segments.length; index += 1) {
    const segment = segments[index]!;
    if (LOCALES.includes(segment)) return segment;
  }
  return "zh-cn";
}

function escapeHtml(value: string): string {
  return value
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
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!terms.length) return escapeHtml(text);
  return escapeHtml(text).replace(
    new RegExp(`(${terms.map(escapeHtml).join("|")})`, "gi"),
    '<mark class="search-highlight">$1</mark>',
  );
}

function fmtDate(iso: string): string {
  if (!iso) return "";
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

function normalizeResultUrl(url: string): string {
  if (/^(?:https?:)?\/\//.test(url)) return url;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const normalized = `/${url.replace(/^\/+/, "")}`;
  if (base && (normalized === base || normalized.startsWith(`${base}/`))) {
    return normalized;
  }
  return getAssetPath(normalized);
}

export interface CategoryFacet {
  category: string;
  count: number;
}

export function getCategoryFacets(
  categories: string[],
  results: Array<Pick<SearchRecord, "category">>,
): CategoryFacet[] {
  const counts = new Map(categories.map((category) => [category, 0]));
  for (const result of results) {
    if (!result.category) continue;
    counts.set(result.category, (counts.get(result.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((left, right) =>
      left.category.localeCompare(right.category, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );
}

function normalizeResult(data: PagefindResultData): SearchRecord {
  const tags = (data.meta.tags ?? "")
    .split("|")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const category = data.meta.category ?? data.filters?.category?.[0] ?? "";

  return {
    url: normalizeResultUrl(data.url),
    title: data.meta.title ?? data.url,
    description: data.meta.description ?? "",
    pubDatetime: data.meta.pubDatetime ?? "",
    category,
    tags,
    excerpt: data.excerpt ?? "",
    subResults: (data.sub_results ?? []).filter((result) => result.excerpt),
  };
}

function createResultCard(
  record: SearchRecord,
  query: string,
  index: number,
): HTMLAnchorElement {
  const card = document.createElement("a");
  card.id = `search-result-${index}`;
  card.href = record.url;
  card.className =
    "search-result-card search-result-enter group block border-b border-border py-6 first:pt-0 last:border-b-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";
  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", record.title);

  const metadata = [fmtDate(record.pubDatetime), record.category].filter(
    Boolean,
  );
  const excerpts = record.subResults.length
    ? record.subResults
        .map((result) => ({
          title: result.title ?? "",
          excerpt: result.excerpt,
        }))
        .slice(0, 3)
    : [{ title: "", excerpt: record.excerpt }];
  const excerptHtml = excerpts
    .filter((result) => result.excerpt)
    .map(
      (result) =>
        `<div class="relative text-sm leading-7 text-muted-foreground"><span class="absolute -start-5 top-0 text-muted-foreground/70" aria-hidden="true">↳</span>${
          result.title
            ? `<p class="font-medium text-foreground">${highlightText(result.title, query)}</p>`
            : ""
        }<div class="search-excerpt">${result.excerpt}</div></div>`,
    )
    .join("");
  const tags = record.tags
    .slice(0, 5)
    .map(
      (tag) =>
        `<span class="inline-block rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">${escapeHtml(tag)}</span>`,
    )
    .join("");

  card.innerHTML = `<h3 class="mb-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">${highlightText(record.title, query)}</h3>
${metadata.length ? `<div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">${metadata.map((item) => escapeHtml(item)).join(" · ")}</div>` : ""}
<div class="space-y-2 border-s border-border ps-5">${excerptHtml}</div>
${tags ? `<div class="mt-4 flex flex-wrap gap-1.5">${tags}</div>` : ""}`;
  return card;
}

function renderCategoryFilters(state: SearchState) {
  if (!state.filterPanelEl || !state.filtersEl) return;
  const facets = getCategoryFacets(state.availableCategories, state.allRecords);
  const available = new Set(facets.map(({ category }) => category));
  for (const category of state.selectedCategories) {
    if (!available.has(category)) state.selectedCategories.delete(category);
  }

  state.filtersEl.replaceChildren();
  if (!facets.length) {
    state.filterPanelEl.classList.add("hidden");
    return;
  }
  state.filterPanelEl.classList.remove("hidden");

  for (const facet of facets) {
    const label = document.createElement("label");
    label.className =
      "flex cursor-pointer items-start gap-2.5 text-sm text-foreground";
    label.innerHTML =
      '<input type="checkbox" data-search-category class="mt-0.5 size-4 shrink-0 rounded border-border accent-primary" /><span class="min-w-0 flex-1 break-words"></span><span class="shrink-0 tabular-nums text-muted-foreground"></span>';
    const input = label.querySelector("input")!;
    input.value = facet.category;
    input.checked = state.selectedCategories.has(facet.category);
    const text = label.querySelectorAll("span");
    text[0]!.textContent = facet.category;
    text[1]!.textContent = `(${facet.count})`;
    state.filtersEl.appendChild(label);
  }
}

function visibleRecords(state: SearchState): SearchRecord[] {
  return state.selectedCategories.size
    ? state.allRecords.filter((record) =>
        state.selectedCategories.has(record.category),
      )
    : state.allRecords;
}

function renderResults(state: SearchState, query: string) {
  const records = visibleRecords(state).slice(0, 50);
  state.records = records;
  state.hintEl?.classList.add("hidden");
  state.workspaceEl?.classList.remove("hidden");
  state.noResultsEl?.classList.toggle("hidden", records.length > 0);
  state.resultsEl!.replaceChildren();

  if (state.statsEl) {
    const template =
      state.statsEl.dataset.resultsTpl?.trim() || "{{count}} results";
    state.statsEl.textContent = `${query} · ${template.replace(
      /\{\{\s*count\s*\}\}/g,
      String(records.length),
    )}`;
    state.statsEl.classList.remove("hidden");
  }

  for (const [index, record] of records.entries()) {
    state.resultsEl!.appendChild(createResultCard(record, query, index));
  }
  state.input?.setAttribute("aria-expanded", String(records.length > 0));
  state.params.set("q", query);
  state.params.delete("category");
  for (const category of state.selectedCategories) {
    state.params.append("category", category);
  }
  history.replaceState(history.state, "", "?" + state.params.toString());
  sessionStorage.setItem(
    "backUrl",
    `${window.location.pathname}?${state.params.toString()}`,
  );
  renderCategoryFilters(state);
}

function showHint(state: SearchState) {
  state.hintEl?.classList.remove("hidden");
  state.noResultsEl?.classList.add("hidden");
  state.workspaceEl?.classList.add("hidden");
  state.filterPanelEl?.classList.add("hidden");
  state.resultsEl?.replaceChildren();
  state.statsEl?.classList.add("hidden");
  state.records = [];
  state.allRecords = [];
  state.lastQuery = "";
  state.selectedCategories.clear();
  state.input?.setAttribute("aria-expanded", "false");
}

async function loadPagefind(state: SearchState): Promise<PagefindModule> {
  if (state.pagefind) return state.pagefind;
  if (state.loading) return state.loading;

  state.loading = (async () => {
    const moduleUrl = getAssetPath("pagefind/pagefind.js");
    const imported = (await import(/* @vite-ignore */ moduleUrl)) as {
      default?: PagefindModule;
    } & PagefindModule;
    const pagefind = imported.default ?? imported;
    await pagefind.options({ excerptLength: 30 });
    await pagefind.init();
    state.pagefind = pagefind;

    try {
      const filters = await pagefind.filters();
      state.availableCategories = Object.keys(filters.category ?? {});
    } catch {
      state.availableCategories = [];
    }
    return pagefind;
  })();

  try {
    return await state.loading;
  } finally {
    state.loading = null;
  }
}

async function performSearch(state: SearchState, query: string) {
  if (!query.trim()) {
    showHint(state);
    return;
  }

  const requestId = ++state.requestId;
  state.lastQuery = query;
  try {
    const pagefind = await loadPagefind(state);
    const response = await pagefind.search(query, {
      filters: { language: state.locale },
      showEmptyFilters: true,
    });
    if (requestId !== state.requestId) return;

    const data = await Promise.all(
      response.results.slice(0, 50).map((result) => result.data()),
    );
    if (requestId !== state.requestId) return;
    state.allRecords = data.map(normalizeResult);
    renderResults(state, query);
  } catch (error) {
    if (requestId !== state.requestId) return;
    console.warn("[search] Pagefind 查询失败：", error);
    state.allRecords = [];
    renderResults(state, query);
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

  const current = cards.findIndex((card) => card === document.activeElement);
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
  state.requestId += 1;
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
  state.workspaceEl = container.querySelector("#search-workspace");
  state.filterPanelEl = container.querySelector("#search-filter-panel");
  state.filtersEl = container.querySelector("#search-filters");
  state.hintEl = container.querySelector("#search-hint");
  state.noResultsEl = container.querySelector("#search-no-results");
  state.statsEl = container.querySelector("#search-stats");
  const clearBtn = state.clearBtn;

  state.filtersEl!.onchange = (event: Event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (input.checked) state.selectedCategories.add(input.value);
    else state.selectedCategories.delete(input.value);
    renderResults(state, state.lastQuery);
  };

  newInput.addEventListener("input", () => {
    const query = newInput.value.trim();
    if (query) {
      clearBtn?.classList.remove("hidden");
      if (state.debounceTimer) clearTimeout(state.debounceTimer);
      state.debounceTimer = setTimeout(() => {
        void performSearch(state, query);
      }, 180);
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
  }
}

export function initSearch() {
  const container = document.querySelector<HTMLElement>("#site-search-ui");
  if (!container) return;

  const state = getSearchState(container);
  state.input = container.querySelector("#search-input");
  state.clearBtn = container.querySelector("#search-clear");
  state.resultsEl = container.querySelector("#search-results");
  state.workspaceEl = container.querySelector("#search-workspace");
  state.filterPanelEl = container.querySelector("#search-filter-panel");
  state.filtersEl = container.querySelector("#search-filters");
  state.hintEl = container.querySelector("#search-hint");
  state.noResultsEl = container.querySelector("#search-no-results");
  state.statsEl = container.querySelector("#search-stats");
  state.locale = detectLocale();
  state.params = new URLSearchParams(window.location.search);
  state.selectedCategories = new Set(state.params.getAll("category"));
  if (!state.input || !state.resultsEl) return;
  state.input.setAttribute("aria-expanded", "false");

  bindEvents(state, container);

  const query = state.params.get("q");
  if (query && state.input) {
    state.input.value = query;
    state.clearBtn?.classList.remove("hidden");
    container.setAttribute("aria-busy", "true");
    void performSearch(state, query).finally(() => {
      container.removeAttribute("aria-busy");
    });
  }
}
