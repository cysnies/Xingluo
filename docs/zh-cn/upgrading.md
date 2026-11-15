# 从模板升级

星罗是「主题壳 + 用户内容」结构。从上游拉取更新时：

1. **保留** `xingluo.config.ts`、`src/content/`、`public/` 中你自己的文件。
2. **合并** `src/components`、`src/styles`、`src/fonts`、`src/i18n`、`scripts/` 等主题壳改动。
3. 对照 [AGENTS.md](../../AGENTS.md) 中的目录表。
4. 跑 `pnpm build` 与 `pnpm run budget`。

演示站默认 `enabledLocales: ["zh-cn", "en"]`。若需要全部 UI 语言，删除或注释该字段即可（源文件仍可保留在仓库中）。

## 字体与文泉驿

内置字体不含文泉驿（GPL + 无稳定 Web CDN）。自托管请用 `fonts.fonts` 自定义项，见 [fonts.md](./fonts.md)。
