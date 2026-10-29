---
title: "SEO"
pubDatetime: 2026-06-20T11:00:00+08:00
description: "Руководство по SEO Xingluo, охватывающее Open Graph, Twitter Card, canonical, структурированные данные JSON-LD, RSS и карту сайта."
tags:
  - documentation
  - seo
category: "Documentation"
translationKey: doc-seo
locale: ru
---

Xingluo поставляется с полной поддержкой SEO: Open Graph, Twitter Card, canonical, структурированные данные JSON-LD, динамические OG-изображения, RSS, карта сайта и многоязычные объявления hreflang.

## Вывод head

`<head>` в [`src/layouts/Layout.astro`](../src/layouts/Layout.astro) выводит:

- `charset`, `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (каноническая ссылка)
- `title`, `meta title`, `meta description`, `meta author`
- Ссылка на `sitemap`
- **Open Graph**: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`
- **Twitter Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **RSS** альтернативная ссылка
- **hreflang** альтернативные ссылки (для каждого языка + x-default)
- `theme-color` (заполняется во время выполнения `theme.ts`)
- `google-site-verification` (условно)

## Метаданные страницы поста

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) внедряет метаданные, специфичные для записи, через `<Fragment slot="head">`:

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (если `modDatetime` установлен)
- **Структурированные данные JSON-LD `BlogPosting`**:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Заголовок записи",
  "image": "URL изображения OG",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "Имя автора",
      "url": "Домашняя страница автора"
    }
  ]
}
```

## Нормализация canonical

Каноническая стратегия на страницах деталей записей (`PostDetailView.astro`):

1. Пользовательский `canonicalURL` в frontmatter → используется первым
2. Текущая запись является **реальным переводом** для этого языка (`locale` совпадает с языком страницы) → указывает на свой собственный URL
3. Текущая запись является **резервным содержимым** (нет доступного перевода, используется оригинал) → указывает на оригинальный URL языка по умолчанию

Стратегия 3 гарантирует, что поисковые системы не будут рассматривать страницы без независимых переводов как дублированный контент. Записи с независимыми переводами имеют каноническую ссылку, указывающую на самих себя, и могут индексироваться отдельно.

## Структурированные данные BreadcrumbList

Все страницы с хлебными крошками (список записей, индекс тегов, список записей по тегу, архив, о сайте, поиск) автоматически выводят структурированные данные JSON-LD `BreadcrumbList`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://..."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Записи",
      "item": "https://.../posts/"
    }
  ]
}
```

Когда последний элемент хлебных крошек не имеет ссылки (текущая страница), URL текущей страницы используется как `item`. Страницы деталей записей не используют компонент хлебных крошек и поэтому не выводят эти структурированные данные.

## Изображения Open Graph

### Динамическая генерация

При включённом `features.dynamicOgImage` (по умолчанию) Xingluo динамически генерирует OG-изображения 1200×630 с помощью satori + sharp:

- **Уровень сайта**: [`src/pages/og.png.ts`](../src/pages/og.png.ts), для страниц без собственного OG-изображения
- **Уровень записи**: [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts), создаётся только для записей без `ogImage`

### Шрифты

OG-изображения используют шрифт Noto Sans SC (см. конфигурацию `fonts` в `astro.config.ts`, CSS-переменная `--font-og`), загружаемый через `fontData` из `astro:assets`. Шрифт предназначен только для satori и не внедряется в CSS сайта.

### Резервные варианты

- Шрифт недоступен (нет сети) → запасной вариант PNG 1×1 (не приводит к сбою сборки)
- `dynamicOgImage` выключен → используется статическое изображение OG по умолчанию в `public/`

### Разрешение OG-изображения записи

Четырёхуровневый запасной вариант в `PostDetailView.astro`:

1. frontmatter `ogImage` является строкой → использовать напрямую
2. frontmatter `ogImage` является объектом `image()` → использовать `.src`
3. `dynamicOgImage` включён → использовать конечную точку `og.png` на уровне записи
4. В противном случае → статическое изображение OG сайта по умолчанию

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) генерирует RSS-ленту:

- Заголовок, описание и URL сайта берутся из конфигурации `site`
- Элементы берутся из `getSortedPosts` (черновики и запланированные записи уже отфильтрованы)
- `link` каждого элемента — это `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` — это `modDatetime ?? pubDatetime`

`Layout.astro` внедряет ссылку автобнаружения RSS:

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## Карта сайта

Интеграция `@astrojs/sitemap` (см. `astro.config.ts`):

- `filter`: фильтрует пути страниц архива на основе `features.showArchives`
- `i18n`: включает автоматическую генерацию hreflang, сопоставляя `zh-cn → zh-CN`, `en → en`, с defaultLocale `zh-cn`

Генерирует `sitemap-index.xml` и альтернативные объявления для каждого языка; `robots.txt` ссылается на карту сайта.

## Многоязычные объявления hreflang

`Layout.astro` выводит `<link rel="alternate">` для каждого языка:

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

Пути нормализуются через `parseLocaleFromPath(stripBase(...))` после удаления префиксов, обеспечивая соответствие каждого языка правильному URL. `x-default` указывает на язык по умолчанию.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) генерирует:

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## Верификация сайта

Проверка Google Search Console настраивается через `site.googleVerification` двумя способами:

1. Переменная окружения `PUBLIC_GOOGLE_SITE_VERIFICATION` (внедрение во время выполнения)
2. Поле `site.googleVerification` в `xingluo.config.ts`

Отображается как `<meta name="google-site-verification" content="...">`.
