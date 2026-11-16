/**
 * 构建后生成 Pagefind 分片索引。
 *
 * 与下载整份正文 JSON 再在浏览器中建索引不同，Pagefind 会把索引拆成
 * 可独立请求的压缩片段，查询时只加载命中的词典与正文片段。
 */
import { readFile, readdir, stat, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";
import { close, createIndex } from "pagefind";

const distDir = resolve("dist");
const outputDir = join(distDir, "pagefind");
const unusedUiFiles = [
  "pagefind-component-ui.css",
  "pagefind-component-ui.js",
  "pagefind-highlight.js",
  "pagefind-modular-ui.css",
  "pagefind-modular-ui.js",
  "pagefind-ui.css",
  "pagefind-ui.js",
];

async function getDirectorySize(directory) {
  let total = 0;
  let files = 0;

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = await getDirectorySize(path);
      total += nested.total;
      files += nested.files;
    } else {
      total += (await stat(path)).size;
      files += 1;
    }
  }

  return { total, files };
}

async function main() {
  const created = await createIndex({
    rootSelector: "[data-pagefind-body]",
    excludeSelectors: [
      "pre",
      "audio",
      "video",
      "button",
      "svg",
      "[aria-hidden='true']",
      "[data-pagefind-ignore]",
    ],
    includeCharacters: "#<>[](){}_+=-/@:\\",
    maxFragments: 64,
  });

  if (!created.index || created.errors.length > 0) {
    throw new Error(created.errors.join("\n") || "Pagefind 索引创建失败");
  }

  const indexed = await created.index.addDirectory({ path: distDir });
  if (indexed.errors.length > 0) {
    throw new Error(indexed.errors.join("\n"));
  }

  const written = await created.index.writeFiles({ outputPath: outputDir });
  if (written.errors.length > 0) {
    throw new Error(written.errors.join("\n"));
  }

  // 站内搜索使用自定义 shadcn 界面，不需要 Pagefind 的默认 UI 资源。
  await Promise.all(
    unusedUiFiles.map((name) =>
      unlink(join(outputDir, name)).catch((error) => {
        if (error?.code !== "ENOENT") throw error;
      }),
    ),
  );

  const bundle = await getDirectorySize(outputDir);
  const entry = JSON.parse(
    await readFile(join(outputDir, "pagefind-entry.json"), "utf8"),
  );
  const pageCount = Object.values(entry.languages ?? {}).reduce(
    (total, language) => total + Number(language.page_count ?? 0),
    0,
  );
  console.log(
    `[pagefind] 已索引 ${pageCount} 个文章页，输出 ${bundle.files} 个分片，共 ${(bundle.total / (1024 * 1024)).toFixed(2)}MB`,
  );
}

main()
  .catch((error) => {
    console.error("[pagefind] 生成失败：", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await close();
  });
