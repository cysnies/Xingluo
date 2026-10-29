/**
 * 构建前置校验：解析 xingluo.config.ts 中的 ogImage，检查 public/ 文件存在
 */
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

async function main() {
  const cfgText = await readFile(resolve(root, "xingluo.config.ts"), "utf8");
  const ogMatch = cfgText.match(/ogImage:\s*["']([^"']+)["']/);
  const og = ogMatch?.[1] ?? "default-og.jpg";
  const dynamicOff = /dynamicOgImage:\s*false/.test(cfgText);

  if (og.includes("..") || og.includes("/") || og.includes("\\")) {
    console.error(`[checkAssets] site.ogImage 非法: ${og}`);
    process.exit(1);
  }

  const ogPath = resolve(root, "public", og);
  try {
    await access(ogPath);
    console.log(`[checkAssets] OK public/${og}`);
  } catch {
    if (dynamicOff) {
      console.error(
        `[checkAssets] 缺少 public/${og}，且 dynamicOgImage 为 false`,
      );
      process.exit(1);
    }
    console.warn(
      `[checkAssets] 警告：缺少 public/${og}（dynamicOg 开启时将回退 /og.png）`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
