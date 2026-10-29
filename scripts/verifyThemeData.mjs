/**
 * theme-data 消费者：校验 scripts/theme-data/*.json 与 palettes.css / theme.css 选择器一致。
 * 用法：node scripts/verifyThemeData.mjs
 * 退出码 0=一致，1=漂移
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "scripts/theme-data");
const palettes = readFileSync(join(root, "src/styles/palettes.css"), "utf8");
const theme = readFileSync(join(root, "src/styles/theme.css"), "utf8");

const bases = readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

const errors = [];
for (const name of bases) {
  const json = JSON.parse(readFileSync(join(dataDir, `${name}.json`), "utf8"));
  if (!json.cssVars?.light || !json.cssVars?.dark) {
    errors.push(`${name}.json 缺少 cssVars.light/dark`);
    continue;
  }
  if (name === "zinc") {
    // zinc 默认在 theme.css :root / .dark
    for (const key of ["background", "primary", "accent"]) {
      if (!theme.includes(`--${key}:`)) errors.push(`theme.css 缺少 --${key}`);
    }
    continue;
  }
  if (!palettes.includes(`data-palette="${name}"`)) {
    errors.push(`palettes.css 缺少 data-palette="${name}"`);
  }
}

const accents = ["blue", "green", "rose", "orange", "violet"];
for (const a of accents) {
  if (!palettes.includes(`data-accent="${a}"`)) {
    errors.push(`palettes.css 缺少 data-accent="${a}"`);
  }
}

if (!theme.includes("data-ui-style=\"default\"") || !theme.includes("data-ui-style=\"new-york\"")) {
  errors.push("theme.css 缺少 data-ui-style default/new-york");
}

if (errors.length) {
  console.error("[verifyThemeData] FAIL");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log(
  `[verifyThemeData] OK bases=${bases.join(",")} accents=${accents.join(",")}`,
);
