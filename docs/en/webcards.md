# Web Cards

At **build time**, bare URLs become rich cards (title, description, cover, site/platform stats). Data is fetched during `pnpm build` and written into static HTML — the browser does **not** call GitHub / Bilibili / oEmbed at runtime.

## Usage

### Markdown: bare URL on its own line

Blank lines around a paragraph that contains only one URL:

```md
https://github.com/withastro/astro
```

### MDX component

```mdx
import { WebCard } from "@/components/mdx";

<WebCard url="https://huggingface.co/bert-base-uncased" />
```

## Platforms

| Platform     | Kinds                         | Build-time source                                       |
| ------------ | ----------------------------- | ------------------------------------------------------- |
| Generic      | any URL                       | Open Graph / `<title>` / favicon                        |
| GitHub       | repo, user, PR, Issue         | `api.github.com` (optional `GITHUB_TOKEN` / `GH_TOKEN`) |
| Bilibili     | video, user, column; dynamics | public API; dynamics often OG-degrade                   |
| Zhihu        | user, answer, column          | mostly OG (anti-bot; often degraded)                    |
| X (Twitter)  | posts                         | fxtwitter → publish.twitter.com oEmbed → OG             |
| Hugging Face | model; dataset / space        | `huggingface.co/api/...`                                |

Failure or timeout → **generic static card** (URL / title / site kept). Build continues.

## Config

`xingluo.config.ts`:

```ts
features: {
  webCards: {
    enabled: true,   // false disables remark transform
    timeoutMs: 8000,
    cache: true,     // .cache/webcards/
  },
}
```

## Safety and cache

- **URL safety**: only `http:` / `https:`; block `localhost`, `*.local`, private literals (`10/8`, `172.16–31`, `192.168/16`, `127/8`, link-local, etc.) and URLs with userinfo (`src/webcards/safeUrl.ts`). Blocked URLs degrade without fetching.
- **Disk cache**: default `.cache/webcards/`. Env:
  - `XINGLUO_WEBCARDS_CACHE=0` → force off
  - `XINGLUO_WEBCARDS_CACHE=1` → force on
  - unset + `CI=true` → **disk cache off** (avoid stale stars in CI)
- `features.webCards.cache: false` also disables disk cache (in-memory dedupe still applies within one build).

## Frontmatter

```yaml
translationKey: doc-webcards
locale: zh-cn # or en; match path language
```

Missing `locale` falls back to the site default; missing `translationKey` can cause slug collisions across locales.

## i18n

Card labels use `src/i18n/lang/*.ts` → `webcard.*`. Remark infers locale from content path; MDX uses `Astro.currentLocale`.

## Related files

- `src/webcards/` — detect / adapters / resolve / render
- `src/utils/remarkWebCards.ts`
- `src/components/webcards/WebCard.astro`
- `src/styles/webcards.css`

## Build-time SSRF trust boundary

Web cards fetch link metadata at build time with URL literal checks, manual redirects, and `dns.lookup` on each hop. **TOCTOU remains:** lookup and `fetch` are not atomic. Default assumption: trusted build host and content. For untrusted Markdown, build in isolation or pin connections to resolved IPs yourself.
