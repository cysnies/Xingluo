---
title: "部署"
pubDatetime: 2026-06-20T13:00:00+08:00
description: "星罗部署指南，涵盖静态托管平台（Netlify/Vercel/GitHub Pages）、Nginx 自托管、Docker 与环境变量。"
tags:
  - 文档
  - 部署
category: "文档"
translationKey: doc-deployment
---

星罗为纯静态站点，`pnpm build` 生成 `dist/` 目录，可托管于任意静态托管服务。

## 构建产物

```bash
pnpm build
```

生成 `dist/` 包含：

- 全部静态 HTML 页面（含 `[locale]/` 镜像）
- `_astro/` 下的 JS / CSS / 字体资源
- `search/` Flexsearch 搜索索引
- `og.png` 站点级 OG 图、各文章级 `og.png`
- `rss.xml`、`sitemap-index.xml`、`robots.txt`
- `public/` 下的静态资源（favicon、默认 OG 图等）

## 环境变量

构建时可设置：

| 变量                              | 说明                                 |
| --------------------------------- | ------------------------------------ |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console 验证值（可选） |

PowerShell 示例：

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

CI 环境（如 GitHub Actions）在 build 步骤前通过 `env` 注入即可。

## 部署前检查

部署前确保：

1. `xingluo.config.ts` 的 `site.url` 已改为正式域名
2. `site.title`、`site.description`、`site.author` 等已定制
3. 若启用评论系统，对应 provider 配置（giscus 的 repoId、twikoo 的 envId、waline 的 serverURL）已填入真实值
4. `public/default-og.jpg`（或配置的 `site.ogImage`）已替换为站点默认 OG 图
5. `public/favicon.svg` 已替换为站点图标

## 静态托管平台

### Netlify / Vercel / Cloudflare Pages

| 配置项    | 值           |
| --------- | ------------ |
| 构建命令  | `pnpm build` |
| 输出目录  | `dist`       |
| Node 版本 | 22.12.0+     |
| 包管理器  | pnpm         |

以 Vercel 为例的 `vercel.json`（可选）：

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

通过 GitHub Actions 部署，示例工作流：

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          PUBLIC_GOOGLE_SITE_VERIFICATION: ${{ secrets.GOOGLE_VERIFICATION }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

> 若部署在子路径（如 `https://user.github.io/repo/`），需在 `astro.config.ts` 设置 `base: "/repo/"`。

### Nginx / 自托管

将 `dist/` 上传到服务器，Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 性能注意事项

- `_astro/` 下的资源文件名含哈希，可设置长期缓存（`immutable`）
- HTML 文件不缓存或短缓存，确保内容更新及时
- Flexsearch 索引按需加载，无需特殊缓存策略
- 部署后检查 OG 图、RSS、sitemap 是否可访问

## 评论系统后端

若启用评论系统，需额外部署对应后端：

| 评论系统 | 后端要求                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------- |
| giscus   | 无需自建，使用 giscus.app 公共服务（或自托管 [giscus-vercel](https://github.com/giscus/giscus-vercel)） |
| twikoo   | 部署 twikoo 服务端（Vercel / CloudBase / 自托管）                                                       |
| waline   | 部署 waline 服务端（Vercel / Cloudflare / 自托管）                                                      |

详见各评论系统官方文档与 [评论系统](./doc-comments.md)。
