---
title: "Создание контента"
pubDatetime: 2026-06-20T05:00:00+08:00
description: "Руководство по созданию контента Xingluo, охватывающее frontmatter постов, синтаксис Markdown/MDX, подсветку кода, callouts и улучшения контента."
tags:
  - documentation
  - writing
category: "Documentation"
translationKey: doc-content
locale: ru
---

Xingluo использует Astro Content Collections для управления контентом, поддерживая Markdown (`.md`) и MDX (`.mdx`, требуется `features.mdx`).

## Content Collections

Two collections are defined in [`src/content.config.ts`](../src/content.config.ts):

| Collection | Directory            | Purpose                            |
| ---------- | -------------------- | ---------------------------------- |
| `posts`    | `src/content/posts/` | Blog posts                         |
| `pages`    | `src/content/pages/` | Static pages (e.g. the about page) |

File naming conventions:

- Files or directories starting with `_` are ignored (handy for drafts)
- With MDX enabled, `**/*.{md,mdx}` is collected; otherwise only `**/*.md`
- Post URLs are derived from the file path (see the routing section in [Обзор архитектуры](./doc-architecture.md))

## Post Frontmatter

Full fields for the `posts` collection:

```markdown
---
title: "Post Title" # required
pubDatetime: 2026-06-19T10:00:00+08:00 # required, publish time
modDatetime: 2026-06-20T10:00:00+08:00 # optional, update time
description: "Summary, used for SEO and lists" # required
tags: ["Astro", "blog"] # optional, defaults to ["others"]
featured: true # optional, featured (shown on homepage)
draft: false # optional, drafts are not published
author: "Xingluo" # optional, defaults to site.author
ogImage: "./cover.png" # optional, OG image (image import or string path)
canonicalURL: "https://..." # optional, canonical link
hideEditPost: false # optional, hide the edit link
timezone: "Asia/Shanghai" # optional, override the site timezone
---
```

### Field Reference

| Field            | Type            | Default         | Notes                                                                                                                 |
| ---------------- | --------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `title`          | string          | required        | Post title                                                                                                            |
| `pubDatetime`    | date            | required        | Publish time, ISO 8601                                                                                                |
| `modDatetime`    | date            | —               | Update time; shows an "updated" label                                                                                 |
| `description`    | string          | required        | Summary, used in meta, RSS, and list cards                                                                            |
| `tags`           | string[]        | `["others"]`    | Tag array; tag pages are generated automatically                                                                      |
| `featured`       | boolean         | —               | Shown in the homepage "Featured" section                                                                              |
| `draft`          | boolean         | —               | Draft; filtered out in production builds (visible in dev)                                                             |
| `author`         | string          | `site.author`   | Author name                                                                                                           |
| `ogImage`        | image \| string | —               | OG image; `image()` goes through Astro's asset pipeline, a string is a `public/` path or external URL                 |
| `canonicalURL`   | string          | —               | Canonical link, overrides the default (see [SEO](./doc-seo.md))                                                       |
| `hideEditPost`   | boolean         | —               | Hide the edit link for this post                                                                                      |
| `timezone`       | string          | `site.timezone` | Override the display timezone for this post                                                                           |
| `locale`         | string          | `site.lang`     | Language the post is written in, e.g. `"en"`, `"ja"`. Defaults to the site language when unset                        |
| `translationKey` | string          | —               | Translation group key: posts sharing the same key are translations of each other. Posts without a key are independent |
| `category`       | string          | —               | Post category (single value), generates a `/categories/<slug>/` page; unset means no category                         |

### Перевод содержимого

Используйте поля frontmatter `locale` и `translationKey` для создания многоязычных версий ваших постов:

1. Разместите пост на языке по умолчанию в `src/content/posts/<slug>.md`
2. Разместите переводы в языковых поддиректориях: `src/content/posts/<locale>/<slug>.md` (например, `en/welcome.md`)
3. Установите `locale` на язык перевода и `translationKey` на то же значение, что и у оригинала

Маршрутизирующий слой автоматически определяет правильный перевод для каждого языка и удаляет дубликаты в списках — один и тот же пост на разных языках показывает только одну карточку на язык. Посты без перевода возвращаются к исходному содержимому. См. [Интернационализация](./doc-i18n.md).

### Запланированная публикация

Посты с будущими временными метками фильтруются в продакшене с использованием допуска `scheduledPostMargin`: если `pubDatetime` находится в пределах окна допуска (по умолчанию 15 минут) от текущего времени, пост считается опубликованным. В разработке все нечерновые посты видны.

## Frontmatter статической страницы

Коллекция `pages` имеет более простые поля:

```markdown
---
title: "About"
description: "About this site" # опционально
ogImage: "default-og.jpg" # опционально, только строка
canonicalURL: "https://..." # опционально
---
```

Страница "О сайте" получается через `getEntry("pages", "about")` и требует создания `src/content/pages/about.md`.

## Расширения Markdown

Xingluo поставляется со следующими плагинами remark / rehype (см. `astro.config.ts`):

### Содержание

`remark-toc` автоматически генерирует оглавление; `remark-collapse` сворачивает его по умолчанию. Вставьте заполнитель в пост:

```markdown
## Содержание

(Оглавление заполняется автоматически)
```

### Выноски

`rehype-callouts` поддерживает выноски в стиле Obsidian:

```markdown
> [!NOTE]
> Содержание заметки

> [!WARNING]
> Содержание предупреждения

> [!TIP]
> Содержание совета
```

Поддерживаемые типы: `NOTE`, `TIP`, `INFO`, `WARNING`, `DANGER`, `SUCCESS`, `QUESTION`, `FAILURE` и другие.

### Подсветка кода

Shiki двойная тема (светлая `min-light`, тёмная `night-owl`) поддерживает:

- Подсветка строк: ` ```js {1,3-5} `
- Подсветка слов: ` ```js /word/ `
- Маркеры Diff: `+` / `-` в начале строки
- Метки имени файла: ` ```js file=src/index.ts ` или `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // подсвеченная строка
}
```

### Таблицы

Широкие таблицы автоматически оборачиваются в горизонтально прокручиваемый контейнер (плагин `rehypeWrapTable`), предотвращая переполнение на узких экранах.

## Поддержка MDX

С включённым `features.mdx` (по умолчанию) вы можете использовать файлы `.mdx` для компонентно-ориентированного создания контента.

### Пользовательские компоненты

Встроенные MDX-компоненты Xingluo находятся в [`src/components/mdx/`](../src/components/mdx) и импортируются из единой точки входа:

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# Мой Пост

<APlayer
  audio={[
    {
      name: "Песня",
      artist: "Исполнитель",
      url: "/audio.mp3",
      cover: "/cover.jpg",
    },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

Подробнее см. [Медиаплееры](./doc-media-players.md).

### Отключение MDX

С `features.mdx: false`:

- Интеграция `mdx()` не загружается
- Глоб коллекции контента соответствует только `*.md` (существующие файлы `.mdx` не собираются)
- Выходные данные сборки не содержат среду выполнения MDX

## Комментарии

Система комментариев автоматически отображается внизу страниц деталей постов (настройте провайдера в `features.comments`). См. [Система комментариев](./doc-comments.md).

## Время чтения

Расчётное время чтения автоматически отображается на страницах деталей постов и в карточках списка:

- **CJK-языки** (zh-cn, ja, ko): рассчитывается по количеству символов CJK, ~400 символов в минуту
- **Другие языки**: рассчитывается по количеству слов (разделение по пробелам), ~200 слов в минуту
- Результат округляется вверх, минимум 1 минута

Перед подсчётом блоки кода, HTML-теги, URL-адреса ссылок Markdown и другой неосновной контент удаляются, чтобы оценка была близка к фактическому объёму чтения. Настройка не требуется.

## Похожие посты

До 2 похожих постов отображаются внизу страниц деталей постов (после навигации предыдущий/следующий):

- Сортировка по количеству общих тегов, по убыванию
- Одинаковое количество сортируется по дате публикации, по убыванию (предпочтение более новым постам)
- Раздел не отображается, когда ни один пост не имеет общих тегов
- Автоматически игнорируется поисковым индексом Flexsearch

Настройка не требуется.

## Фиксированная боковая панель оглавления

Фиксированная боковая панель оглавления появляется справа на страницах деталей постов на больших экранах (≥1024px):

- Автоматически генерируется из заголовков h2–h6 в статье, представлена в виде плоского списка с отступами
- Отступы отражают глубину заголовка (h3 имеет на один уровень отступа больше, чем h2)
- Текущий раздел выделяется при прокрутке (IntersectionObserver)
- Клик по элементу оглавления плавно прокручивает к соответствующему заголовку
- Скрыто на маленьких экранах (мобильных), где доступно встроенное сворачиваемое оглавление

Генерируется из `headings`, возвращаемых `render()` Astro — никакого ручного обслуживания оглавления автором. Встроенное сворачиваемое оглавление `remark-toc` (напишите `## Содержание` в своём посте) сосуществует с боковой панелью для использования на маленьких экранах.

## Категории

Назначьте категорию посту через поле `category` в frontmatter (одна строка):

```yaml
---
title: "Мой Пост"
category: "tutorial"
---
```

- Страница категории находится по адресу `/categories/<slug>/`; slug нормализуется через `slugifyStr` (CJK сохраняется, латиница в нижнем регистре с дефисами)
- Индекс категорий по адресу `/categories/` перечисляет все категории
- Карточки постов и страницы деталей автоматически показывают ссылку на категорию (клик для перехода на страницу категории)
- Пост принадлежит максимум одной категории (в отличие от нескольких `tags`); посты без `category` не отображаются ни в одной категории
- Страницы категорий используют `posts.perPage` для пагинации и поддерживают многоязычные зеркальные маршруты (`/en/categories/...`)
- Отключите категории через `features.showCategories: false` (пункт навигации и страницы удаляются, карта сайта фильтруется)
