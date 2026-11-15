import { fetchJson, githubHeaders } from "../http";
import { fetchGeneric } from "./generic";
import type { PlatformMatch, WebCardData } from "../types";

function fmt(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

interface GhRepo {
  full_name?: string;
  description?: string | null;
  html_url?: string;
  stargazers_count?: number;
  forks_count?: number;
  open_issues_count?: number;
  language?: string | null;
  owner?: { login?: string; avatar_url?: string; html_url?: string };
  homepage?: string | null;
}

interface GhUser {
  login?: string;
  name?: string | null;
  bio?: string | null;
  html_url?: string;
  avatar_url?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
}

interface GhIssue {
  title?: string;
  body?: string | null;
  html_url?: string;
  state?: string;
  comments?: number;
  user?: { login?: string; avatar_url?: string; html_url?: string };
  pull_request?: unknown;
  reactions?: { total_count?: number };
}

/** GitHub：Repo / User / PR / Issue（公开 API；可选 GITHUB_TOKEN） */
export async function fetchGitHub(
  match: PlatformMatch,
  timeoutMs: number,
): Promise<WebCardData> {
  const h = githubHeaders();
  const { owner, repo, user, number } = match.params;

  if (match.kind === "repo" && owner && repo) {
    const data = await fetchJson<GhRepo>(
      `https://api.github.com/repos/${owner}/${repo}`,
      { timeoutMs, headers: h },
    );
    if (!data?.full_name) return fetchGeneric(match, timeoutMs);
    return {
      url: data.html_url || match.url,
      platform: "github",
      kind: "repo",
      title: data.full_name,
      description: data.description || undefined,
      siteName: "GitHub",
      favicon: "https://github.githubassets.com/favicons/favicon.svg",
      image: data.owner?.avatar_url,
      author: data.owner?.login,
      authorUrl: data.owner?.html_url,
      authorAvatar: data.owner?.avatar_url,
      stats: [
        { key: "stars", value: fmt(data.stargazers_count) },
        { key: "forks", value: fmt(data.forks_count) },
        ...(data.language ? [{ key: "language", value: data.language }] : []),
      ],
    };
  }

  if (match.kind === "user" && user) {
    const data = await fetchJson<GhUser>(
      `https://api.github.com/users/${user}`,
      { timeoutMs, headers: h },
    );
    if (!data?.login) return fetchGeneric(match, timeoutMs);
    return {
      url: data.html_url || match.url,
      platform: "github",
      kind: "user",
      title: data.name || data.login,
      description: data.bio || undefined,
      siteName: "GitHub",
      favicon: "https://github.githubassets.com/favicons/favicon.svg",
      image: data.avatar_url,
      author: data.login,
      authorAvatar: data.avatar_url,
      stats: [
        { key: "repos", value: fmt(data.public_repos) },
        { key: "followers", value: fmt(data.followers) },
      ],
    };
  }

  if (
    (match.kind === "issue" || match.kind === "pull") &&
    owner &&
    repo &&
    number
  ) {
    const path =
      match.kind === "pull"
        ? `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`
        : `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;
    const data = await fetchJson<
      GhIssue & { additions?: number; deletions?: number }
    >(path, { timeoutMs, headers: h });
    // pulls endpoint 失败时回退 issues（PR 也是 issue）
    const issue =
      data ||
      (await fetchJson<GhIssue>(
        `https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
        { timeoutMs, headers: h },
      ));
    if (!issue?.title) return fetchGeneric(match, timeoutMs);
    const isPr = match.kind === "pull" || Boolean(issue.pull_request);
    return {
      url: issue.html_url || match.url,
      platform: "github",
      kind: isPr ? "pull" : "issue",
      title: `#${number} ${issue.title}`,
      description: (issue.body || "").slice(0, 200) || undefined,
      siteName: "GitHub",
      favicon: "https://github.githubassets.com/favicons/favicon.svg",
      author: issue.user?.login,
      authorUrl: issue.user?.html_url,
      authorAvatar: issue.user?.avatar_url,
      stats: [
        { key: "state", value: issue.state || "—" },
        { key: "comments", value: fmt(issue.comments) },
      ],
    };
  }

  return fetchGeneric(match, timeoutMs);
}
