# Fonts

Xingluo ships a CJK-friendly open-font catalog. Default is **system** (no extra network). Set one CDN/local font in `xingluo.config.ts` when needed.

## Runtime switcher

Header `FontSwitcher` (`fonts.showSwitcher: false` to hide):

1. Options from `src/fonts/catalog.ts` + optional `fonts.fonts`
2. Choice stored in `localStorage` key `xingluo-font`
3. Stylesheet injected only for the active non-system font
4. Inline Layout script applies the stored choice before paint

`fonts.family` is the SSR / no-storage default (keep `system` unless you want a site-wide webfont).

## Config

```ts
export default defineXingluoConfig({
  fonts: {
    family: "lxgw-wenkai-lite",
  },
});
```

Built-in ids include `system`, `lxgw-wenkai`, `lxgw-wenkai-lite`, `lxgw-wenkai-screen`, `source-han-sans`, `source-han-serif`, `inter`, `jetbrains-mono`. WenQuanYi is **not** bundled — see the Chinese fonts doc for rationale.

## Notes

- Prefer system or Lite webfonts on mobile to limit layout shift and payload.
- PostCard vertical metrics were tuned for CJK (`leading-snug`, no negative-margin hacks); re-check after changing the default family.


## Mainland China CDN mirrors

By default `features.googleFontsMirror.enabled` is **true** (`src/config.ts`):

- Google Fonts CSS → `https://fonts.googleapis.cn` (files on `gstatic.cn`)
- jsDelivr npm webfonts (e.g. LXGW) → `https://cdn.npmmirror.com`

Set `enabled: false` to use official Google / jsDelivr. See `docs/zh-cn/fonts.md` for details.
