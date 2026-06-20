# Руководство по настройке

Все настраиваемые параметры Xingluo находятся в корневом файле [`xingluo.config.ts`](../xingluo.config.ts). Файл предоставляет полные ограничения типов через `defineXingluoConfig`; изменения вступают в силу немедленно без изменения исходного кода.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // URL сайта, используется для абсолютных ссылок, RSS, sitemap
  title: "Xingluo",                      // Название сайта
  description: "Современная CMS для блогов на Astro и shadcn",
  author: "Xingluo",                     // Имя автора по умолчанию
  profile: "https://xingluo.example.com", // Домашняя страница автора (используется для JSON-LD)
  ogImage: "default-og.jpg",              // Изображение OG по умолчанию (в каталоге public)
  lang: "zh-cn",                          // Язык по умолчанию
  timezone: "Asia/Shanghai",              // Часовой пояс (отображение даты поста)
  dir: "ltr",                             // Направление текста: ltr | rtl
  googleVerification: "",                 // Значение верификации Google Search Console (или через env var)
}
```

| Поле                 | По умолчанию     | Примечания                                                                                                   |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------ |
| `url`                | обязательно      | Корневой URL сайта; должен заканчиваться на `/`                                                              |
| `title`              | обязательно      | Заголовок сайта, используется в `<title>` и OG                                                               |
| `description`        | обязательно      | Описание сайта, используется в meta и RSS                                                                    |
| `author`             | обязательно      | Автор по умолчанию; frontmatter записи возвращается к этому значению                                         |
| `profile`            | —                | Домашняя страница автора, вставляется в JSON-LD `author.url`                                                 |
| `ogImage`            | `default-og.jpg` | Имя файла OG-изображения по умолчанию, находится в `public/`                                                 |
| `lang`               | обязательно      | Код языка по умолчанию; должен соответствовать `i18n.defaultLocale` в `astro.config.ts`                      |
| `timezone`           | `Asia/Shanghai`  | Часовой пояс dayjs, влияет на отображение даты записи                                                        |
| `dir`                | `ltr`            | Направление текста                                                                                           |
| `googleVerification` | —                | Значение верификации Google; также можно задать через переменную окружения `PUBLIC_GOOGLE_SITE_VERIFICATION` |

## posts

```ts
posts: {
  perPage: 8,              // Записей на странице списка
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

| Поле               | По умолчанию       | Примечания                                                                     |
| ------------------ | ------------------ | ------------------------------------------------------------------------------ |
| `lightAndDarkMode` | `true`             | Включить переключение светлой/тёмной темы                                      |
| `dynamicOgImage`   | `true`             | Динамически генерировать OG-изображения (satori + sharp)                       |
| `showArchives`     | `true`             | Показывать страницу архивов (sitemap фильтруется при отключении)               |
| `showCategories`   | `true`             | Показывать страницу категорий и навигацию (sitemap фильтруется при отключении) |
| `showBackButton`   | `true`             | Показывать кнопку «Назад» на страницах постов                                  |
| `editPost.enabled` | `false`            | Показывать ссылку «Редактировать эту страницу»                                 |
| `editPost.url`     | `""`               | Префикс ссылки редактирования; добавляется относительный путь поста            |
| `search`           | `"pagefind"`       | Решение для поиска: `"pagefind"` или `false`                                   |
| `mdx`              | `true`             | Включить разбор и рендеринг MDX (см. [Создание контента](./content.md))        |
| `comments`         | `{provider:false}` | Конфигурация системы комментариев (см. [Система комментариев](./comments.md))  |
| `players.aplayer`  | `false`            | Включить аудиоплеер APlayer (см. [Медиаплееры](./media-players.md))            |
| `players.dplayer`  | `false`            | Включить видеоплеер DPlayer                                                    |

### editPost

`editPost.url` — это префикс URL редактирования репозитория; Xingluo добавляет относительный путь поста (`src/content/posts/...`). Например:

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

Запись `src/content/posts/welcome.md` создаёт ссылку `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

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
- `linkTitle`: опциональный доступный заголовок; автоматически генерируется из имени, если опущен

> Добавление социальной платформы: создайте компонент иконки `.astro` с таким же именем в `src/assets/icons/socials/`. `src/lib/socialIcons.ts` автоматически собирает их через `import.meta.glob`.

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

Эти записи для публикации появляются в нижней части страниц записей. `url` — это префикс URL для публикации; Xingluo добавляет абсолютный URL текущей записи. `name` также сопоставляется с иконкой в `src/assets/icons/socials/`.

## Переменные окружения

Объявлено через `env.schema` в `astro.config.ts`.

| Переменная                        | Уровень доступа | Описание                                                |
| --------------------------------- | --------------- | ------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Значение верификации Google Search Console, опционально |

Пример (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

Значение вставляется в `config.site.googleVerification` и отображается как `<meta name="google-site-verification">`.

## Полный пример

См. [`xingluo.config.ts`](../xingluo.config.ts). Разделы `features.comments` и `features.players` содержат закомментированные примеры для giscus / twikoo / waline; раскомментируйте и заполните реальными значениями для включения.
