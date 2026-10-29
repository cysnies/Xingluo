# theme-data

各基色的 shadcn themes 注册表快照（HSL 分量），供对照与一致性校验。

- **消费者**：`node scripts/verifyThemeData.mjs`（由 `src/styles/themeData.contract.test.ts` 调用）
- **运行时 CSS**：`src/styles/theme.css`（zinc 默认）+ `src/styles/palettes.css`（其余基色与 data-accent）
- 改色板时：先改 JSON 或 CSS，再跑 `node scripts/verifyThemeData.mjs`，避免双源漂移

色值改编自 [ui.shadcn.com/themes](https://ui.shadcn.com/themes)，非整库照搬组件。
