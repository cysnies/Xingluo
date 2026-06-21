/**
 * 构建后搜索索引生成
 *
 * 读取构建产物 dist/ 目录下的 HTML 文件，解析文章页的元数据和正文内容，
 * 按语言分组生成 Flexsearch 可用的 JSON 搜索索引文件到 dist/search/。
 *
 * 执行时机：astro build 之后
 */
import { readdir, readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { resolve, join } from "node:path";

const distDir = resolve("dist");
const searchDir = join(distDir, "search");

/** 语言代码到 hreflang 映射（与 astro.config.ts 保持一致） */
const LOCALE_MAP = {
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
  en: "en",
  ja: "ja",
  ko: "ko",
  fr: "fr",
  de: "de",
  es: "es",
  pt: "pt",
  ru: "ru",
  ar: "ar",
  eo: "eo",
};

/** 所有支持的语言列表 */
const LOCALES = Object.keys(LOCALE_MAP);

/**
 * 从 URL 路径中提取语言代码
 * 根路径（无语言前缀）视为默认语言 zh-cn
 */
function detectLocale(urlPath) {
  const segments = urlPath.replace(/^\/|\/$/g, "").split("/");
  const first = segments[0];
  if (first && LOCALES.includes(first)) {
    return first;
  }
  return "zh-cn";
}

/**
 * 递归收集目录下所有文件路径
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function walk(dir) {
  const files = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

/**
 * 判断文件路径是否为文章页（URL 中包含 /posts/）
 */
function isPostPage(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  // 排除搜索页自身和 404 等
  if (normalized.includes("/search/")) return false;
  if (normalized.includes("/404")) return false;
  // 文章页路径包含 /posts/
  return /\/posts\//.test(normalized);
}

/**
 * 从 HTML 中提取搜索所需数据
 */
function extractSearchData(html, filePath) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  // 计算 URL 路径：从 dist 相对路径到 URL
  const relativePath = normalizedPath
    .slice(distDir.replace(/\\/g, "/").length)
    .replace(/\/index\.html$/, "/")
    .replace(/\.html$/, "/");

  // 提取标题（去除站点后缀）
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  if (!titleMatch) return null;
  let title = titleMatch[1];
  // 去掉 " - 星罗" 或 " | Xingluo" 等站点名后缀
  title = title.replace(/\s*[-–—|]\s*[^<]*$/, "").trim();
  if (!title) return null;

  // 提取描述
  const descMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i,
  );

  // 提取发布时间和更新时间（取所有 <time datetime="...">）
  const timeMatches = [
    ...html.matchAll(/<time[^>]*datetime=["']([^"']+)["'][^>]*>/gi),
  ];
  const pubDatetime = timeMatches.length > 0 ? timeMatches[0][1] : "";
  // 如果存在第二个 time 元素且附近有"更新于"标记，则为更新时间
  let modDatetime = "";
  if (timeMatches.length > 1) {
    // 检查第二个 time 附近是否有"更新于"关键词
    const secondTimeIndex = html.indexOf(timeMatches[1][0]);
    const contextBefore = html.slice(
      Math.max(0, secondTimeIndex - 20),
      secondTimeIndex,
    );
    if (contextBefore.includes("更新于") || contextBefore.includes("Updated")) {
      modDatetime = timeMatches[1][1];
    }
  }

  // 提取分类（第一个 /categories/ 链接的文本）
  const catMatch = html.match(
    /href=["']\/categories\/([^"']+)["'][^>]*>\s*([^<]+)\s*<\//i,
  );
  const category = catMatch ? catMatch[2].trim() : "";

  // 提取标签（所有 /tags/ 链接的文本，去重）
  const tagLinkMatches = html.matchAll(
    /href=["']\/tags\/([^"']+)["'][^>]*>\s*([^<]+)\s*<\//gi,
  );
  const tags = [...new Set([...tagLinkMatches].map((m) => m[2].trim()))];

  // 提取正文内容（<main> 或 <article> 内的文本）
  let content = "";
  const contentMatch =
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (contentMatch) {
    // 去除 HTML 标签，保留文本
    content = contentMatch[1]
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&[^;]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const locale = detectLocale(relativePath);
  const id = `${locale}:${relativePath}`;

  return {
    id,
    title,
    description: descMatch ? descMatch[1] : "",
    pubDatetime,
    modDatetime,
    tags,
    category,
    content: content.slice(0, 5000), // 限制内容长度
    url: relativePath,
    locale,
  };
}

async function main() {
  // dist 目录不存在则跳过
  try {
    await stat(distDir);
  } catch {
    console.warn("[search index] dist/ 目录不存在，跳过索引生成");
    return;
  }

  const allFiles = await walk(distDir);
  const htmlFiles = allFiles.filter(
    (f) => f.endsWith(".html") && isPostPage(f),
  );

  console.log(
    `[search index] 找到 ${htmlFiles.length} 个文章页 HTML，正在解析...`,
  );

  // 按语言分组的搜索结果
  /** @type {Record<string, Array<object>>} */
  const langIndex = {};
  for (const locale of LOCALES) {
    langIndex[locale] = [];
  }

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf-8");
    const data = extractSearchData(html, file);
    if (data) {
      langIndex[data.locale].push({
        id: data.id,
        title: data.title,
        description: data.description,
        pubDatetime: data.pubDatetime,
        modDatetime: data.modDatetime,
        tags: data.tags,
        category: data.category,
        content: data.content,
        url: data.url,
      });
    }
  }

  // 创建 search 目录
  await mkdir(searchDir, { recursive: true });

  // 写入各语言索引文件
  let totalDocs = 0;
  for (const [locale, docs] of Object.entries(langIndex)) {
    if (docs.length === 0) continue;
    const filePath = join(searchDir, `${locale}.json`);
    await writeFile(filePath, JSON.stringify(docs, null, 2), "utf-8");
    totalDocs += docs.length;
    console.log(
      `[search index] 已生成 ${locale} 索引：${docs.length} 篇文章 -> search/${locale}.json`,
    );
  }

  // 生成索引清单文件，记录所有可用语言
  const manifest = Object.entries(langIndex)
    .filter(([, docs]) => docs.length > 0)
    .map(([locale]) => locale);
  await writeFile(
    join(searchDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8",
  );
  console.log(
    `[search index] 完成！共生成 ${totalDocs} 篇文章索引，${manifest.length} 种语言`,
  );
}

main().catch((err) => {
  console.error("[search index] 生成失败：", err);
  process.exit(1);
});
