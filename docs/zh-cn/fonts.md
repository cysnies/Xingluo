# 字体配置

星罗内置 CJK 友好的开源字体目录，通过 `xingluo.config.ts` 的 `fonts.mode` 控制全局字体与读者选择。演示站固定使用霞鹜文楷 Lite。

## 字体模式

| `fonts.mode` | 全局默认字体                        | 读者切换   | 已保存的读者选择 |
| ------------ | ----------------------------------- | ---------- | ---------------- |
| `fixed`      | 使用 `fonts.family`                 | 隐藏切换器 | 忽略             |
| `default`    | 使用 `fonts.family`                 | 允许       | 优先应用         |
| `user`       | 从系统字体起步，忽略 `fonts.family` | 允许       | 优先应用         |

```ts
fonts: {
  mode: "fixed",
  family: "lxgw-wenkai-lite",
}
```

将 `mode` 改为 `"default"`，可让读者覆盖站点默认字体并保存选择。使用 `{ mode: "user" }` 可让新访客从系统字体起步，再自行选择字体。

未设置 `mode` 的旧配置继续使用可切换的全局默认字体。旧的 `showSwitcher: false` 对应 `fixed`，显式设置的 `mode` 优先。

## 运行时切换（读者）

`default` 和 `user` 模式在页头提供字体按钮（`FontSwitcher`）。

1. 选项来自 `src/fonts/catalog.ts` + 你的 `fonts.fonts` 扩展
2. 选择写入 `localStorage` 键 `xingluo-font`
3. 仅对当前选中项按需注入 stylesheet（system 不发网络请求）
4. Layout 内联脚本在首屏绘制前应用已存选择，减轻闪烁

`fixed` 模式直接应用全局字体，已有的 `xingluo-font` 保存值也会被忽略。

## 配置默认字体

```ts
// xingluo.config.ts
export default defineXingluoConfig({
  fonts: {
    mode: "default",
    // 内置 id，见下方目录
    family: "lxgw-wenkai-lite",
  },
  // ...
});
```

改完后重新 `pnpm build` / `pnpm dev` 即可。当前启用字体会写入：

- `<html style="--font-sans: …">`（及可选 `--font-mono`）
- 若为 CDN/local：`<link rel="stylesheet">`（`media=print` + `onload` 异步，降低阻塞）

## 内置目录（`src/fonts/catalog.ts`）

| id                   | 展示名                    | 来源             | 许可     | 说明                                           |
| -------------------- | ------------------------- | ---------------- | -------- | ---------------------------------------------- |
| `system`             | 系统默认                  | system           | 系统字体 | **默认**；含 PingFang / 微软雅黑 / Noto 等回退 |
| `lxgw-wenkai`        | 霞鹜文楷                  | CDN (jsDelivr)   | OFL-1.1  | 楷体正文                                       |
| `lxgw-wenkai-lite`   | 霞鹜文楷 Lite             | CDN              | OFL-1.1  | 精简版，相对更轻，推荐「好看且克制」           |
| `lxgw-wenkai-screen` | 霞鹜文楷 Screen           | CDN              | OFL-1.1  | 屏幕阅读优化                                   |
| `source-han-sans`    | 思源黑体（Noto Sans SC）  | Google Fonts CSS | OFL-1.1  | 网页常用思源黑体等价；可用镜像                 |
| `source-han-serif`   | 思源宋体（Noto Serif SC） | Google Fonts CSS | OFL-1.1  | 网页常用思源宋体等价                           |
| `inter`              | Inter                     | Google Fonts     | OFL-1.1  | 西文无衬线；CJK 回退系统栈                     |
| `jetbrains-mono`     | JetBrains Mono            | Google Fonts     | OFL-1.1  | 等宽；适合代码向站点                           |

> 思源系列体积大，主题选用 Google Fonts CSS（按需子集）而非 npm 全量包。**默认已启用大陆友好镜像**（见下节）。

## 中国大陆镜像（开箱即用）

默认 `features.googleFontsMirror.enabled = true`（见 `src/config.ts`），读者切换 CDN 字体时无需额外配置即可访问：

| 类型                       | 官方源                     | 默认镜像                                                                   | 说明                                                       |
| -------------------------- | -------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Google Fonts CSS           | `fonts.googleapis.com`     | [`fonts.googleapis.cn`](https://fonts.googleapis.cn)                       | 返回的字文件走 `fonts.gstatic.cn`；社区常用、稳定          |
| npm 网页字体（霞鹜文楷等） | `cdn.jsdelivr.net/npm/...` | [`registry.npmmirror.com`](https://npmmirror.com/)（npmmirror / 淘宝镜像） | 将 jsDelivr npm 路径改写为 npmmirror `包名/版本/files/...` |

关闭镜像、改用官方源：

```ts
features: {
  googleFontsMirror: {
    enabled: false,
    url: "https://fonts.googleapis.cn", // enabled 时的镜像根，可换成其它兼容 Google Fonts CSS API 的镜像
    // npmMirror: false, // 仅关闭 jsDelivr→npmmirror，仍镜像 Google Fonts
  },
}
```

注意：

1. 镜像只改写**已知公共 CDN 前缀**，本地 `/fonts/...` 不受影响。
2. 许可仍以各字体 OFL 等为准；镜像站只做分发加速，请遵守原许可。
3. 构建期 OG 用 `googleFontsMirrorProvider` 时同样走安全 URL 校验。
4. 自托管仍是最稳方案：把 CSS/woff2 放到 `public/fonts/`，`source: "local"`。

## 自定义 / 本地字体

把 CSS（及 woff2）放到 `public/fonts/`，再在配置里扩展目录：

```ts
fonts: {
  family: "my-font",
  fonts: [
    {
      id: "my-font",
      label: "我的字体",
      family: "MyFont",
      stack: '"MyFont", "PingFang SC", sans-serif',
      source: "local",
      cssUrl: "/fonts/my-font.css",
      license: "OFL-1.1",
      note: "自托管子集",
    },
  ],
},
```

同 `id` 会覆盖内置项。也可把某内置项改成 `source: "local"` 指向自托管 CSS。

## 加载策略说明

1. **默认 system**：不发字体网络请求，首屏最稳。
2. **一次只启用一项**：`family` 只选一个 id，不会并行拉多套 CJK。
3. **CDN 异步**：stylesheet 使用 `media="print" onload="this.media='all'"`，降低渲染阻塞。
4. **不做 fontsource 全量 CJK**：完整思源/文楷 npm 包可达数十 MB，不适合博客默认依赖。

## 相关文件

- `src/fonts/catalog.ts` — 内置目录
- `src/fonts/resolve.ts` — 解析当前字体 / 镜像 URL
- `src/components/fonts/FontLinks.astro` — 注入 `<link>`
- `src/layouts/Layout.astro` — 写入 CSS 变量
- `xingluo.config.ts` → `fonts`

## 为何不内置文泉驿

文泉驿（WenQuanYi）字体授权为 **GPL-2.0**，网页嵌入需关注 GPL 义务；且缺少稳定、官方维护的 Web 子集 CDN，不适合作为主题默认「开箱即用」选项。若你已合规自托管子集，可通过 `fonts.fonts` 以 `source: "local"` 自行添加，不会出现在内置目录中。
