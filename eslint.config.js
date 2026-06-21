/** ESLint 9 扁平配置 */
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  // 构建产物、生成目录与参考项目不参与检查
  {
    ignores: ["dist/**", ".astro/**", "references/**"],
  },
  // Astro 推荐规则集
  ...eslintPluginAstro.configs.recommended,
  // TypeScript 文件解析（含 .astro 内嵌脚本）
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    // 仅对 ts/tsx 文件生效，避免污染 Astro/JS 解析
    files: ["**/*.ts", "**/*.tsx"],
  })),
  // Astro 内嵌 TypeScript 解析器
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  // 独立 JavaScript 文件（如 .mjs 脚本）
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  // 项目级规则
  {
    rules: {
      // 脚本中的 console 为合法日志输出，不做限制
      "no-console": "off",
    },
  },
];
