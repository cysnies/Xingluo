# 快速开始

本指南帮助你从零启动星罗项目的本地开发与生产构建。

## 环境要求

| 依赖    | 最低版本 | 说明                                |
| ------- | -------- | ----------------------------------- |
| Node.js | 22.12.0  | 见 `package.json` 的 `engines.node` |
| pnpm    | 10.x     | 包管理器（项目使用 pnpm workspace） |

> 提示：建议使用 [fnm](https://github.com/Schniz/fnm) 或 [nvm](https://github.com/nvm-sh/nvm) 管理 Node 版本。

## 安装

克隆仓库后安装依赖：

```bash
pnpm install
```

依赖安装完成后，`references/` 目录下的参考项目会被自动排除在 TypeScript 编译与构建之外（见 `tsconfig.json` 的 `exclude`）。

## 本地开发

启动开发服务器（默认 `http://localhost:4321/`）：

```bash
pnpm dev
```

开发模式下：

- 文章草稿与定时发布内容**均可见**（便于预览），生产构建时才会被过滤
- 内容集合变更会触发热更新
- 主题切换、View Transitions 等客户端行为与生产环境一致

## 类型同步

修改内容集合 schema 或类型后，运行同步以刷新 `.astro/types.d.ts`：

```bash
pnpm sync
```

## 构建

生产构建包含三步（见 `package.json` 的 `build` 脚本）：

```bash
pnpm build
```

1. **`astro check`**：TypeScript 与 Astro 模板类型检查，任何错误都会中断构建
2. **`astro build`**：静态生成全站到 `dist/`（含动态 OG 图、RSS、sitemap、robots.txt）
3. **`node scripts/generateSearchIndex.mjs`**：扫描 `dist/` 生成全文搜索索引到 `dist/search/`

> 注：搜索索引由构建后的 Node 脚本生成。

## 预览构建产物

本地预览 `dist/` 中的构建结果：

```bash
pnpm preview
```

## 代码质量

| 命令                | 用途                                               |
| ------------------- | -------------------------------------------------- |
| `pnpm format`       | 用 Prettier 格式化全部代码（含 Astro 与 Tailwind） |
| `pnpm format:check` | 检查格式是否合规（CI 用）                          |
| `pnpm lint`         | ESLint 检查（含 `eslint-plugin-astro`）            |

## 下一步

- 阅读 [配置指南](./configuration.md) 定制站点信息与功能开关
- 阅读 [内容创作](./content.md) 开始写作
- 阅读 [部署](./deployment.md) 将站点发布上线
