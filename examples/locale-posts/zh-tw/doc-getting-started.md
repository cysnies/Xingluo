---
title: "快速開始"
pubDatetime: 2026-06-20T03:00:00+08:00
description: "從零啟動星羅專案的本機開發與生產構建指南，涵蓋環境要求、安裝、開發與部署。"
tags:
  - documentation
  - getting-started
category: "Documentation"
translationKey: doc-getting-started
locale: zh-tw
---

# 快速開始

本指南幫助你從零啟動星羅專案的本機開發與生產構建。

## 環境要求

| 依賴    | 最低版本 | 說明                                  |
| ------- | -------- | ------------------------------------- |
| Node.js | 22.12.0  | 見 `package.json` 的 `engines.node`   |
| pnpm    | 10.x     | 套件管理器（專案使用 pnpm workspace） |

> 提示：建議使用 [fnm](https://github.com/Schniz/fnm) 或 [nvm](https://github.com/nvm-sh/nvm) 管理 Node 版本。

## 安裝

複製倉庫後安裝依賴：

```bash
pnpm install
```

依賴安裝完成後，`references/` 目錄下的參考專案會被自動排除在 TypeScript 編譯與構建之外（見 `tsconfig.json` 的 `exclude`）。

## 本機開發

啟動開發伺服器（預設 `http://localhost:4321/`）：

```bash
pnpm dev
```

開發模式下：

- 文章草稿與定時發佈內容**均可見**（便於預覽），生產構建時才會被過濾
- 內容集合變更會觸發熱更新
- 主題切換、View Transitions 等客戶端行為與生產環境一致

## 型別同步

修改內容集合 schema 或型別後，執行同步以重新整理 `.astro/types.d.ts`：

```bash
pnpm sync
```

## 構建

生產構建包含三步（見 `package.json` 的 `build` 腳本）：

```bash
pnpm build
```

1. **`astro check`**：TypeScript 與 Astro 模板型別檢查，任何錯誤都會中斷構建
2. **`astro build`**：靜態生成全站到 `dist/`（含動態 OG 圖、RSS、sitemap、robots.txt）
3. **`node scripts/generateSearchIndex.mjs`**：掃描 `dist/` 生成全文搜尋索引到 `dist/search/`

> 註：搜尋索引由構建後的 Node 腳本生成。

## 預覽構建產物

本機預覽 `dist/` 中的構建結果：

```bash
pnpm preview
```

## 程式碼品質

| 指令                | 用途                                                 |
| ------------------- | ---------------------------------------------------- |
| `pnpm format`       | 用 Prettier 格式化全部程式碼（含 Astro 與 Tailwind） |
| `pnpm format:check` | 檢查格式是否合規（CI 用）                            |
| `pnpm lint`         | ESLint 檢查（含 `eslint-plugin-astro`）              |

## 下一步

- 閱讀 [設定指南](./doc-configuration.md) 定製站點資訊與功能開關
- 閱讀 [內容創作](./doc-content.md) 開始寫作
- 閱讀 [部署](./doc-deployment.md) 將站點發佈上線
