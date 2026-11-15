# Fonts

Xingluo ships a CJK-friendly open-font catalog. Set `fonts.mode` in `xingluo.config.ts` to control the site font and reader preferences. The demo uses fixed LXGW WenKai Lite.

## Font modes

| `fonts.mode` | Initial font                         | Reader switcher | Saved reader preference |
| ------------ | ------------------------------------ | --------------- | ----------------------- |
| `fixed`      | `fonts.family`                       | Hidden          | Ignored                 |
| `default`    | `fonts.family`                       | Available       | Takes priority          |
| `user`       | System font, ignoring `fonts.family` | Available       | Takes priority          |

Use `{ mode: "fixed", family: "lxgw-wenkai-lite" }` to enforce the site font, `mode: "default"` to allow readers to override it, or `{ mode: "user" }` to start new visitors with their system font.

Existing configurations without `mode` retain the selectable global default. Legacy `showSwitcher: false` maps to `fixed`. An explicit `mode` takes priority.

## Runtime switcher

The header `FontSwitcher` is available in `default` and `user` modes.

1. Options from `src/fonts/catalog.ts` + optional `fonts.fonts`
2. Choice stored in `localStorage` key `xingluo-font`
3. Stylesheet injected only for the active non-system font
4. Inline Layout script applies the stored choice before paint

In `fixed` mode, the global font takes effect even when a reader has a previously saved choice.

## Config

```ts
export default defineXingluoConfig({
  fonts: {
    mode: "default",
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
