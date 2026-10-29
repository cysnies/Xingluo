/**
 * remark 插件：将「独占一段的裸 URL」在构建期转为静态网页卡片 HTML。
 * 抓取与渲染均在构建时完成；产物无客户端 API 请求。
 */
import { resolveWebCard } from "../webcards/resolve";
import { renderWebCardHtml } from "../webcards/render";
import type { WebCardLabels } from "../webcards/labels";
import type { WebCardsConfig } from "../webcards/types";

/** 直接 glob 语言包，避免经 i18n/index 拉入 @/config（astro.config 阶段无别名） */
const langModules = import.meta.glob<{ default: { webcard: WebCardLabels } }>(
  "../i18n/lang/*.ts",
  { eager: true },
);

function webcardLabels(locale: string): WebCardLabels {
  const key = `../i18n/lang/${locale}.ts`;
  const mod =
    langModules[key] ??
    langModules["../i18n/lang/zh-cn.ts"] ??
    langModules["../i18n/lang/en.ts"];
  if (!mod) {
    throw new Error(`webcard labels missing for locale=${locale}`);
  }
  return mod.default.webcard;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MdastNode = any;

export interface RemarkWebCardsOptions {
  enabled?: boolean;
  timeoutMs?: number;
  cache?: boolean;
  locale?: string;
  labels?: WebCardLabels;
}

const KNOWN_LOCALES = new Set([
  "zh-cn",
  "zh-tw",
  "en",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "pt",
  "ru",
  "ar",
  "eo",
]);

function localeFromPath(filePath: string | undefined): string {
  if (!filePath) return "zh-cn";
  const norm = filePath.replace(/\\/g, "/");
  const m =
    norm.match(/\/(?:content\/)?(?:posts|pages)\/([a-z]{2}(?:-[a-z]{2})?)\//i) ||
    norm.match(/(?:^|\/)([a-z]{2}(?:-[a-z]{2})?)\/[^/]+\.(?:md|mdx)$/i);
  if (m?.[1] && KNOWN_LOCALES.has(m[1].toLowerCase())) {
    return m[1].toLowerCase();
  }
  return "zh-cn";
}

function labelsFor(locale: string, override?: WebCardLabels): WebCardLabels {
  if (override) return override;
  // 各语种已译 webcard.*，与 MDX WebCard 一致
  return webcardLabels(locale);
}

function isBareUrlParagraph(node: MdastNode): string | null {
  if (node?.type !== "paragraph" || !Array.isArray(node.children)) return null;
  const kids = node.children.filter(
    (c: MdastNode) =>
      !(c.type === "text" && String(c.value || "").trim() === ""),
  );
  if (kids.length !== 1) return null;
  const only = kids[0];
  if (only.type === "link" && only.url && (!only.children || only.children.length <= 1)) {
    const text =
      only.children?.[0]?.type === "text" ? String(only.children[0].value || "") : "";
    if (!text || text === only.url || text.replace(/\/$/, "") === only.url.replace(/\/$/, "")) {
      return String(only.url);
    }
  }
  if (only.type === "text") {
    const t = String(only.value || "").trim();
    if (/^https?:\/\/\S+$/i.test(t)) return t;
  }
  return null;
}

/**
 * 优先用 frontmatter.locale；否则从路径推断（posts/en/... → en）。
 */
function resolveLocale(file: {
  path?: string;
  dirname?: string;
  history?: string[];
  data?: { astro?: { frontmatter?: { locale?: string } } };
}, optionsLocale?: string): string {
  if (optionsLocale) return optionsLocale;
  const fm = file.data?.astro?.frontmatter?.locale;
  if (fm) return fm;
  const pathCandidates = [file.path, file.dirname, ...(file.history || [])].filter(
    Boolean,
  ) as string[];
  for (const c of pathCandidates) {
    const loc = localeFromPath(c);
    if (loc !== "zh-cn") return loc;
  }
  return "zh-cn";
}

export function remarkWebCards(
  options: RemarkWebCardsOptions = {},
): (tree: MdastNode, file: { path?: string }) => Promise<void> {
  const cfg: Partial<WebCardsConfig> = {
    enabled: options.enabled !== false,
    timeoutMs: options.timeoutMs ?? 8000,
    cache: options.cache !== false,
  };

  return async (tree: MdastNode, file: { path?: string }): Promise<void> => {
    if (cfg.enabled === false) return;
    if (!tree || !Array.isArray(tree.children)) return;

    const locale = resolveLocale(file as Parameters<typeof resolveLocale>[0], options.locale);
    const labels = labelsFor(locale, options.labels);

    const tasks: { index: number; url: string }[] = [];
    tree.children.forEach((node: MdastNode, index: number) => {
      const url = isBareUrlParagraph(node);
      if (url) tasks.push({ index, url });
    });
    if (tasks.length === 0) return;

    const results = await Promise.all(
      tasks.map(async (t) => {
        const data = await resolveWebCard(t.url, cfg);
        return { index: t.index, html: renderWebCardHtml(data, labels) };
      }),
    );

    for (const r of results) {
      tree.children[r.index] = {
        type: "html",
        value: `<div class="xng-webcard-wrap not-prose">${r.html}</div>`,
      };
    }
  };
}
