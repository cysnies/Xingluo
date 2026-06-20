---
title: "Руководство по настройке"
pubDatetime: 2026-06-20T04:00:00+08:00
description: "Полная справка по всем параметрам конфигурации Xingluo, включая конфигурацию сайта, постов, функций, социальных ссылок, ссылок для обмена и переменных окружения."
tags:
  - documentation
  - configuration
category: "Documentation"
translationKey: doc-configuration
locale: ru
---

Все настраиваемые параметры Xingluo находятся в корневом файле [`xingluo.config.ts`](../xingluo.config.ts). Файл предоставляет полные ограничения типов через `defineXingluoConfig`; изменения вступают в силу немедленно без изменения исходного кода.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // URL сайта, используется для абсолютных ссылок, RSS, sitemap
  title: "Xingluo",                      // Название сайта
  description: "Современная CMS для блогов на Astro и shadcn",
  author: "Xingluo",                     // Имя автора по умолчанию
  profile: "https://xingluo.example.com", // Домашняя страница автора (используется для JSON-LD)
  ogImage: "default-og.jpg",              // OG-изображение по умолчанию (в каталоге public)
  lang: "zh-cn",                          // Язык по умолчанию
  timezone: "Asia/Shanghai",              // Часовой пояс (отображение даты поста)
  dir: "ltr",                             // Направление текста: ltr | rtl
  googleVerification: "",                 // Значение верификации Google Search Console (или через env var)
}
```

| Поле                 | По умолчанию     | Примечания                                                                                                         |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `url`                | обязательно      | Корневой URL сайта; должен заканчиваться на `/`                                                                    |
| `title`              | обязательно      | Заголовок сайта, используется в `<title>` и OG                                                                     |
| `description`        | обязательно      | Описание сайта, используется в meta и RSS                                                                          |
| `author`             | обязательно      | Автор по умолчанию; frontmatter записи возвращается к этому значению                                               |
| `profile`            | —                | Домашняя страница автора, вставляется в JSON-LD `author.url`                                                       |
| `ogImage`            | `default-og.jpg` | Имя файла OG-изображения по умолчанию, находится в `public/`                                                       |
| `lang`               | обязательно      | Код языка по умолчанию; должен совпадать с `i18n.defaultLocale` в `astro.config.ts`                                |
| `timezone`           | `Asia/Shanghai`  | Часовой пояс dayjs, влияет на отображение даты записи                                                              |
| `dir`                | `ltr`            | Направление текста                                                                                                 |
| `googleVerification` | —                | Значение верификации Google; также может быть введено через переменную окружения `PUBLIC_GOOGLE_SITE_VERIFICATION` |

## posts

```ts
posts: {
    perPage: 8,              // Записей на страницу списка
  perIndex: 5,             // Записей на главной странице
  scheduledPostMargin: 900000, // Допуск запланированной публикации (мс), 15 минут
}
```

- `perPage`: размер страницы для `/posts/[...page]` и `/tags/[tag]/[...page]`
- `perIndex`: количество записей, отображаемых в разделе "Последние" на главной странице
- `scheduledPostMargin`: будущие записи в этом окне считаются опубликованными (действует в продакшене; в разработке показаны все)

## features

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "pagefind",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| Поле               | По умолчанию       | Описание                                                                          |
| ------------------ | ------------------ | --------------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | Включить переключатель светлой/тёмной темы                                        |
| `dynamicOgImage`   | `true`             | Динамическая генерация OG-изображений (satori + sharp)                            |
| `showArchives`     | `true`             | Показать страницу архива (карта сайта фильтруется соответственно при выключении)  |
| `showCategories`   | `true`             | Показать страницу категорий и пункт навигации (карта сайта фильтруется)           |
| `showBackButton`   | `true`             | Показать кнопку "Назад" на страницах постов                                       |
| `editPost.enabled` | `false`            | Показать ссылку "Редактировать эту страницу"                                      |
| `editPost.url`     | `""`               | Префикс ссылки редактирования; добавляется относительный путь исходника поста     |
| `search`           | `"pagefind"`       | Поисковое решение: `"pagefind"` или `false`                                       |
| `mdx`              | `true`             | Включить разбор и рендеринг MDX (см. [Создание контента](./doc-content.md))       |
| `comments`         | `{provider:false}` | Конфигурация системы комментариев (см. [Система комментариев](./doc-comments.md)) |
| `players.aplayer`  | `false`            | Включить аудиоплеер APlayer (см. [Медиаплееры](./doc-media-players.md))           |
| `players.dplayer`  | `false`            | Включить видеоплеер DPlayer                                                       |

### editPost

`editPost.url` — это префикс URL редактирования репозитория; Xingluo добавляет относительный путь исходника поста (`src/content/posts/...`). Например:

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

Пост `src/content/posts/welcome.md` создаёт ссылку `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: имя иконки, соответствующее `src/assets/icons/socials/{name}.astro`. Встроенные: `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url`: URL ссылки; `mailto:` для email
- `linkTitle`: опциональный доступный заголовок; автоматически генерируется из имени при отсутствии

> Добавление социальной платформы: создайте компонент иконки `.astro` с тем же именем в `src/assets/icons/socials/`. `src/lib/socialIcons.ts` автоматически собирает их через `import.meta.glob`.

## shareLinks

```ts
shareLinks: [
  { name: "x", url: "https://x.com/intent/post?url=" },
  { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
  { name: "telegram", url: "https://t.me/share/url?url=" },
  { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
  { name: "mail", url: "mailto:?subject=...&body=" },
];
```

Эти записи для публикации отображаются внизу страниц постов. `url` — это префикс URL для публикации; Xingluo добавляет абсолютный URL текущего поста. `name` аналогично сопоставляется с иконкой в `src/assets/icons/socials/`.

## Переменные окружения

Объявляются через `env.schema` в `astro.config.ts`:

| Переменная                        | Уровень доступа | Описание                                                |
| --------------------------------- | --------------- | ------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Значение верификации Google Search Console, опционально |

Пример (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

Значение внедряется в `config.site.googleVerification` и выводится как `<meta name=\"google-site-verification\">`.

## Full Example

See [`xingluo.config.ts`](../xingluo.config.ts). The `features.comments` and `features.players` sections include commented examples for giscus / twikoo / waline; uncomment and fill in real values to enable.
