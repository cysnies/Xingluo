import { fetchJson } from "../http";
import { fetchGeneric } from "./generic";
import type { PlatformMatch, WebCardData, WebCardKind } from "../types";

function fmt(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

interface HfItem {
  id?: string;
  modelId?: string;
  downloads?: number;
  likes?: number;
  pipeline_tag?: string;
  tags?: string[];
  author?: string;
  lastModified?: string;
  cardData?: { pretty_name?: string };
}

/** Hugging Face：model / dataset / space */
export async function fetchHuggingFace(
  match: PlatformMatch,
  timeoutMs: number,
): Promise<WebCardData> {
  const id = match.params.id;
  if (!id) return fetchGeneric(match, timeoutMs);

  const kind = match.kind as WebCardKind;
  const apiBase =
    kind === "dataset"
      ? "https://huggingface.co/api/datasets/"
      : kind === "space"
        ? "https://huggingface.co/api/spaces/"
        : "https://huggingface.co/api/models/";

  const data = await fetchJson<HfItem>(`${apiBase}${id}`, { timeoutMs });
  if (!data?.id && !data?.modelId) return fetchGeneric(match, timeoutMs);

  const title =
    data.cardData?.pretty_name || data.id || data.modelId || id;
  const tag = data.pipeline_tag || data.tags?.[0];
  return {
    url: match.url,
    platform: "huggingface",
    kind: kind === "dataset" || kind === "space" ? kind : "model",
    title,
    description: tag ? `pipeline: ${tag}` : undefined,
    siteName: "Hugging Face",
    favicon: "https://huggingface.co/favicon.ico",
    author: data.author,
    stats: [
      { key: "downloads", value: fmt(data.downloads) },
      { key: "likes", value: fmt(data.likes) },
      ...(tag ? [{ key: "task", value: tag }] : []),
    ],
  };
}
