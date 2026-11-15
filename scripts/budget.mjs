/**
 * 构建后体积预算（默认语言精简构建）
 * 超限时以非零退出，便于 CI 门禁；本地也可 pnpm run budget
 */
import { readdir, stat, readFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { gzipSync } from "node:zlib";

const dist = resolve("dist");
/** 软预算：默认 enabledLocales 精简后的合理上限 */
const BUDGET = {
  distMB: 15,
  /** 精简 searchClient 后约 2–3KB；收紧以防再拖入 config */
  searchJsGzipKB: 15,
  searchJsRawKB: 25,
  homeHtmlGzipKB: 20,
  /** 动态 OG 合计上限（MB） */
  ogMB: 2.0,
  /** 默认 zh-cn+en 约 80–90 页；全开 12 语会远超此值 */
  htmlPages: 120,
};

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, files);
    else files.push(full);
  }
  return files;
}

async function main() {
  const files = await walk(dist);
  let total = 0;
  for (const f of files) total += (await stat(f)).size;
  const distMB = total / (1024 * 1024);

  const htmlPages = files.filter((f) => f.endsWith(".html")).length;

  const searchJs = files.find((f) => /SearchView.*\.js$/.test(f));
  let searchGzipKB = 0;
  if (searchJs) {
    const buf = await readFile(searchJs);
    searchGzipKB = gzipSync(buf).length / 1024;
  }

  const home = join(dist, "index.html");
  let homeGzipKB = 0;
  try {
    homeGzipKB = gzipSync(await readFile(home)).length / 1024;
  } catch {}

  let searchRawKB = 0;
  if (searchJs) {
    searchRawKB = (await stat(searchJs)).size / 1024;
  }

  let ogBytes = 0;
  for (const f of files) {
    if (
      f.endsWith(`${sep}og.png`) ||
      f.endsWith("/og.png") ||
      /[/\\]og\.png$/.test(f)
    ) {
      ogBytes += (await stat(f)).size;
    }
  }
  const ogMB = ogBytes / (1024 * 1024);

  console.log(
    `[budget] dist=${distMB.toFixed(2)}MB htmlPages=${htmlPages} searchJsGzip=${searchGzipKB.toFixed(1)}KB searchJsRaw=${searchRawKB.toFixed(1)}KB homeGzip=${homeGzipKB.toFixed(1)}KB og=${ogMB.toFixed(2)}MB`,
  );

  const fails = [];
  if (distMB > BUDGET.distMB)
    fails.push(`dist ${distMB.toFixed(2)}MB > ${BUDGET.distMB}MB`);
  if (htmlPages > BUDGET.htmlPages)
    fails.push(
      `html pages ${htmlPages} > ${BUDGET.htmlPages}（请检查 enabledLocales；示例多语言包勿全开）`,
    );
  if (searchJs && searchGzipKB > BUDGET.searchJsGzipKB)
    fails.push(
      `search JS gzip ${searchGzipKB.toFixed(1)}KB > ${BUDGET.searchJsGzipKB}KB`,
    );
  if (searchJs && searchRawKB > BUDGET.searchJsRawKB)
    fails.push(
      `search JS raw ${searchRawKB.toFixed(1)}KB > ${BUDGET.searchJsRawKB}KB`,
    );
  if (ogMB > BUDGET.ogMB)
    fails.push(`og png ${ogMB.toFixed(2)}MB > ${BUDGET.ogMB}MB`);
  if (homeGzipKB > BUDGET.homeHtmlGzipKB)
    fails.push(
      `home HTML gzip ${homeGzipKB.toFixed(1)}KB > ${BUDGET.homeHtmlGzipKB}KB`,
    );

  if (fails.length) {
    console.error("[budget] 超限：\n - " + fails.join("\n - "));
    process.exit(1);
  }
  console.log("[budget] OK");
}

main();
