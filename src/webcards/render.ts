import type { WebCardData } from "./types";
import type { WebCardLabels } from "./labels";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function platformLabel(data: WebCardData, t: WebCardLabels): string {
  switch (data.platform) {
    case "github":
      return t.platformGitHub;
    case "bilibili":
      return t.platformBilibili;
    case "zhihu":
      return t.platformZhihu;
    case "twitter":
      return t.platformTwitter;
    case "huggingface":
      return t.platformHuggingFace;
    default:
      return t.platformWeb;
  }
}

function kindLabel(data: WebCardData, t: WebCardLabels): string {
  const map: Record<string, string> = {
    repo: t.kindRepo,
    user: t.kindUser,
    pull: t.kindPull,
    issue: t.kindIssue,
    video: t.kindVideo,
    dynamic: t.kindDynamic,
    article: t.kindArticle,
    answer: t.kindAnswer,
    tweet: t.kindTweet,
    model: t.kindModel,
    dataset: t.kindDataset,
    space: t.kindSpace,
    page: t.kindPage,
  };
  return map[data.kind] || t.kindPage;
}

function statLabel(key: string, t: WebCardLabels): string {
  const map: Record<string, string> = {
    stars: t.stars,
    forks: t.forks,
    language: t.language,
    repos: t.repos,
    followers: t.followers,
    state: t.state,
    comments: t.comments,
    views: t.views,
    likes: t.likes,
    danmaku: t.danmaku,
    replies: t.replies,
    reposts: t.reposts,
    downloads: t.downloads,
    task: t.task,
    author: t.author,
    reading: t.reading,
  };
  return map[key] || key;
}

/**
 * 构建期将卡片数据渲染为静态 HTML（无客户端请求）。
 * 供 remark 插件使用；Astro 组件使用同构结构。
 */
export function renderWebCardHtml(
  data: WebCardData,
  labels: WebCardLabels,
): string {
  const badge = `${esc(platformLabel(data, labels))} · ${esc(kindLabel(data, labels))}`;
  const host = (() => {
    try {
      return new URL(data.url).hostname.replace(/^www\./, "");
    } catch {
      return data.siteName || "";
    }
  })();

  const media = data.image
    ? `<div class="xng-webcard__media"><img src="${esc(data.image)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" /></div>`
    : "";

  const desc = data.description
    ? `<p class="xng-webcard__desc">${esc(data.description)}</p>`
    : "";

  const author = data.author
    ? `<span class="xng-webcard__author">${esc(labels.author)}: ${esc(data.author)}</span>`
    : "";

  const stats =
    data.stats && data.stats.length
      ? `<ul class="xng-webcard__stats">${data.stats
          .map(
            (s) =>
              `<li><span class="xng-webcard__stat-label">${esc(statLabel(s.key, labels))}</span> <span class="xng-webcard__stat-value">${esc(s.value)}</span></li>`,
          )
          .join("")}</ul>`
      : "";

  const favicon = data.favicon
    ? `<img class="xng-webcard__favicon" src="${esc(data.favicon)}" alt="" width="14" height="14" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
    : "";

  return `<a class="xng-webcard xng-webcard--${esc(data.platform)} xng-webcard--${esc(data.kind)}${data.degraded ? " xng-webcard--degraded" : ""}" href="${esc(data.url)}" target="_blank" rel="noopener noreferrer" data-webcard="1">
  ${media}
  <div class="xng-webcard__body">
    <div class="xng-webcard__badge">${badge}</div>
    <div class="xng-webcard__title">${esc(data.title)}</div>
    ${desc}
    <div class="xng-webcard__meta">${author}${stats}</div>
    <div class="xng-webcard__footer">${favicon}<span class="xng-webcard__site">${esc(data.siteName || host)}</span></div>
  </div>
</a>`;
}
