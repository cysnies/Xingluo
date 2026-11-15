# 网页卡片（Web Cards）

构建期将链接转为信息卡片：标题、描述、封面、站点与平台统计。**所有数据在 `pnpm build` 时抓取并写入 HTML**；产物为纯静态，浏览器不会再请求 GitHub / Bilibili / oEmbed 等接口。

## 用法

### Markdown：独占一行的裸链接

前后空行，段落内只有一个 URL：

```md
https://github.com/withastro/astro
```

会在构建时替换为卡片。行内链接、列表内链接不会转换。

### MDX 组件

```mdx
import { WebCard } from "@/components/mdx";

<WebCard url="https://huggingface.co/bert-base-uncased" />
```

## 支持的平台

| 平台         | 类型                       | 数据来源（构建期）                                   |
| ------------ | -------------------------- | ---------------------------------------------------- |
| 通用         | 任意 URL                   | Open Graph / `<title>` / favicon                     |
| GitHub       | 仓库、用户、PR、Issue      | `api.github.com`（可选 `GITHUB_TOKEN` / `GH_TOKEN`） |
| Bilibili     | 视频、用户、专栏；动态     | 公开 API；动态等多走 OG 降级                         |
| 知乎         | 用户、回答、专栏           | 以 OG 为主（反爬严格，易降级）                       |
| X（Twitter） | 推文                       | fxtwitter → publish.twitter.com oEmbed → OG          |
| Hugging Face | 模型；顺带 dataset / space | `huggingface.co/api/...`                             |

失败或超时 → **通用静态卡片**（至少保留 URL / 标题 / 站点），构建不中断。

## 配置

`xingluo.config.ts`：

```ts
features: {
  webCards: {
    enabled: true,   // false 关闭 remark 转换
    timeoutMs: 8000,
    cache: true,     // .cache/webcards/
  },
}
```

## i18n

卡片内「Stars / 播放 / 作者」等标签走 `src/i18n/lang/*.ts` → `webcard.*`。remark 按内容路径推断语言（`posts/en/...` → en，默认 zh-cn）；MDX 组件用 `Astro.currentLocale`。

## 参考（思路，非整库照搬）

- [astro-embed](https://github.com/delucis/astro-embed)（MIT）Link Preview / 嵌入组件形态
- [remark-link-card-plus](https://github.com/okaryo/remark-link-card-plus)（MIT）裸链 → 卡片
- [@r4ai/remark-embed](https://github.com/r4ai/remark-embed) transformer 匹配思路
- 主题内 `remarkPlayers` 围栏 → 占位的管线模式

本实现自研适配器与静态 HTML 渲染，不引入上述运行时依赖。

## 安全与缓存

构建期会请求外链以填充卡片，因此：

- **URL 安全**：仅允许 `http:` / `https:`，拒绝 `localhost`、`*.local`、私网字面量（`10/8`、`172.16–31`、`192.168/16`、`127/8`、链路本地等）与带用户信息的 URL（见 `src/webcards/safeUrl.ts`）。命中则降级为仅含 URL 的通用卡，不发起请求。
- **磁盘缓存**：默认写入 `.cache/webcards/`。可用环境变量覆盖：
  - `XINGLUO_WEBCARDS_CACHE=0`（或 `false`）→ 强制关闭磁盘缓存
  - `XINGLUO_WEBCARDS_CACHE=1`（或 `true`）→ 强制开启
  - 未设置且 `CI=true` → **默认关闭**磁盘缓存，避免 CI 命中陈旧 stars 等元数据
- 配置项 `features.webCards.cache: false` 同样关闭磁盘缓存（内存去重仍在单次构建内生效）。

## 内容 frontmatter 规范

多语言示例文章请同时写明：

```yaml
translationKey: doc-webcards
locale: zh-cn # 或 en 等；与路径语言一致
```

缺 `locale` 时回退站点默认语言；缺 `translationKey` 时同 slug 多语可能互相抢路由。

## 相关文件

- `src/webcards/` — detect / adapters / resolve / render
- `src/utils/remarkWebCards.ts`
- `src/components/webcards/WebCard.astro`
- `src/styles/webcards.css`

## 构建期 SSRF 与信任边界

网页卡片在构建期请求外链元数据。已做：

- 仅允许 `http:` / `https:`，拒绝带用户名密码的 URL
- 拒绝本机名、链路本地与常见私网 IP 字面量
- 重定向 `manual` 且逐跳校验
- 对域名 `dns.lookup` 后校验全部 A/AAAA（`isSafeResolvedHostname`）

**已知限制（TOCTOU）：** DNS 解析与 `fetch` 之间非原子，无法在标准 `fetch(hostname)` 下完全消除 DNS rebinding。默认信任边界是「构建环境与内容源可信」。若处理不可信用户稿件，请在隔离网络构建，或自行实现解析后对 IP 直连。
