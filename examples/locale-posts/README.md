# locale-posts

未加入默认 `enabledLocales`（`zh-cn` / `en`）的演示译文。

需要某语种时：

1. 将对应目录拷回 `src/content/posts/<locale>/`
2. 在 `xingluo.config.ts` 的 `features.enabledLocales` 中加入该 locale
3. 确保 `src/i18n/lang/<locale>.ts` 存在

默认构建不读取本目录。
