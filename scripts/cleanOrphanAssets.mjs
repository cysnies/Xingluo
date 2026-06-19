/**
 * 构建后孤儿资源清理
 *
 * 背景：Astro 会静态提升组件内 <script> 标签，即使该脚本被运行时条件
 * （如 features.comments/players 关闭）包裹，对应 chunk 仍会生成。
 * 这些 chunk 及其动态 import 的第三方库（twikoo/waline/aplayer/dplayer）
 * 不会被任何页面引用，成为 dist 中的孤儿文件。
 *
 * 策略：从所有 HTML 出发，广度优先遍历可达的 _astro 资源引用
 * （HTML 引用 → JS/CSS → 进一步的 import/url 引用），
 * 删除 _astro 目录下不可达的文件。
 *
 * 仅清理 dist/_astro/，不触及 pagefind、og.png 等其他产物。
 */
import { readdir, readFile, unlink, stat } from "node:fs/promises";
import { resolve, dirname, join, relative, sep } from "node:path";

const distDir = resolve("dist");
const astroDir = join(distDir, "_astro");

/** 递归收集目录下所有文件路径 */
async function walk(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

/**
 * 将一段文本中引用的资源字符串解析为 dist 内绝对路径
 * 覆盖：HTML 的 /_astro/x.js、JS 的 ./x.js、Vite mapDeps 的 _astro/x.js
 * @param text 文本内容
 * @param currentFile 当前文件绝对路径（用于解析相对引用）
 */
function extractAssetRefs(text, currentFile) {
  const refs = new Set();
  // 匹配所有引号字符串，过滤常见资源扩展名
  const re = /["'`]([^"'`\s]+\.(?:js|css|woff|woff2|ttf|otf|eot|png|jpg|jpeg|gif|webp|avif|svg))["'`]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const raw = m[1];
    // 跳过外部 URL 与 data URI
    if (/^(https?:|\/\/|data:)/.test(raw)) continue;
    let abs;
    if (raw.startsWith("/")) {
      // 站点根绝对路径
      abs = join(distDir, raw.slice(1));
    } else if (raw.startsWith("_astro/")) {
      // Vite mapDeps 形式，相对 dist 根
      abs = join(distDir, raw);
    } else if (raw.startsWith("./") || raw.startsWith("../")) {
      // 相对当前文件
      abs = resolve(dirname(currentFile), raw);
    } else {
      continue;
    }
    refs.add(abs);
  }
  return refs;
}

async function main() {
  // astro 目录不存在则无需清理
  try {
    await stat(astroDir);
  } catch {
    return;
  }

  const allFiles = await walk(distDir);
  const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));

  // 可达集合 + 待访问队列
  /** @type {Set<string>} */
  const reachable = new Set();
  /** @type {string[]} */
  const queue = [];

  // 起点：HTML 中引用的资源
  for (const html of htmlFiles) {
    const text = await readFile(html, "utf8");
    for (const ref of extractAssetRefs(text, html)) {
      if (!reachable.has(ref)) {
        reachable.add(ref);
        queue.push(ref);
      }
    }
  }

  // 广度优先遍历 JS/CSS 内的进一步引用
  while (queue.length > 0) {
    const file = queue.pop();
    // 仅继续解析 _astro 内的 js/css（其余如 og.png 无引用链）
    if (!file.startsWith(astroDir + sep)) continue;
    const ext = file.slice(file.lastIndexOf(".") + 1).toLowerCase();
    if (ext !== "js" && ext !== "css") continue;
    let text;
    try {
      text = await readFile(file, "utf8");
    } catch {
      continue;
    }
    for (const ref of extractAssetRefs(text, file)) {
      if (!reachable.has(ref)) {
        reachable.add(ref);
        queue.push(ref);
      }
    }
  }

  // 删除 _astro 下不可达的文件
  const astroFiles = await walk(astroDir);
  let removed = 0;
  let removedBytes = 0;
  for (const file of astroFiles) {
    if (reachable.has(file)) continue;
    try {
      const st = await stat(file);
      await unlink(file);
      removed += 1;
      removedBytes += st.size;
    } catch {
      // 文件可能已被删除或不可访问，忽略
    }
  }

  if (removed > 0) {
    const kb = (removedBytes / 1024).toFixed(1);
    console.log(
      `[cleanOrphanAssets] 删除 ${removed} 个孤儿资源，释放 ${kb} KB（${relative(distDir, astroDir)}/）`
    );
  } else {
    console.log("[cleanOrphanAssets] 未发现孤儿资源");
  }
}

main().catch((err) => {
  console.error("[cleanOrphanAssets] 清理失败：", err);
  process.exit(1);
});
