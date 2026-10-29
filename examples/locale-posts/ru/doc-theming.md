---
title: "Тема и стили"
pubDatetime: 2026-06-20T08:00:00+08:00
description: "Система тем и стилей Xingluo, охватывающая переменные темы shadcn, цветовое пространство OKLCH, Tailwind v4 и темный режим."
tags:
  - documentation
  - theming
category: "Documentation"
translationKey: doc-theming
locale: ru
---

Xingluo использует компоненты стиля shadcn/ui new-york и цветовое пространство OKLCH, построенные на Tailwind CSS v4.

## Структура файлов стилей

[`src/styles/`](../src/styles/):

| Файл             | Содержание                                                          |
| ---------------- | ------------------------------------------------------------------- |
| `theme.css`      | Переменные темы shadcn (OKLCH, светлая `:root` + тёмная `.dark`)    |
| `global.css`     | Вход Tailwind, базовый слой, пользовательские утилиты, темы callout |
| `typography.css` | Типографика `.app-prose` и стили блоков кода                        |

## Переменные темы

`theme.css` использует цветовое пространство OKLCH для определения семантических переменных, со светлым и тёмным наборами:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  /* ... secondary, muted, accent, destructive, border, input, ring ... */
  --code: oklch(0.97 0 0);
  --content-width: 72rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... тёмные аналоги ... */
}
```

Эти переменные отображаются в токены Tailwind в `@theme inline` файла `global.css`, поэтому вы можете напрямую использовать классы `bg-background`, `text-foreground`, `border-border`.

## Tailwind CSS v4

Xingluo использует Tailwind v4, интегрированный через плагин `@tailwindcss/vite` (см. `vite.plugins` в `astro.config.ts`).

### Ключевая конфигурация (`global.css`)

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... сопоставления цветов ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### Пользовательские утилиты

- `max-w-app`: максимальная ширина содержимого (`--content-width: 72rem`)
- `app-layout`: макет приложения (min-height 100vh, flex column)

## Тёмный режим

### Защита от FOUC

`Layout.astro` встраивает синхронный скрипт в `<head>` (`is:inline`), который устанавливает тему до первой отрисовки:

```js
// Чтение localStorage.theme или возврат к prefers-color-scheme
// Установка атрибута data-theme и класса .dark для html
```

Это предотвращает мерцание темы при обновлении.

### Переключение темы во время выполнения

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme`: localStorage в первую очередь, затем системные настройки
- `persist`: сохраняет в localStorage
- `reflect`: синхронизирует атрибут `data-theme`, класс `.dark`, `#theme-btn` `aria-label`, `<meta name="theme-color">`
- Привязывает клик по `#theme-btn` к переключению
- Адаптируется к View Transitions: перепривязка на `astro:after-swap`, перенос theme-color на `astro:before-swap`
- Слушает изменения системного `prefers-color-scheme` (следует только когда пользователь явно не выбрал)

### Синхронизация темы комментариев и плееров

- giscus: переключается через `postMessage({giscus:{setConfig:{theme}}})`
- waline: селектор `dark:"html.dark"` автоматически следует
- twikoo: отслеживает изменения класса `.dark` и перестраивает экземпляр (twikoo не поддерживает переключение во время выполнения)
- См. [Система комментариев](./doc-comments.md)

## Типографика (.app-prose)

`.app-prose` из `typography.css` строится на `prose` из `@tailwindcss/typography` с переопределениями темы:

- Основной цвет ссылок (`--primary`)
- Фон встроенного кода (`--code`)
- Двойная тема блоков кода (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- Стили строк diff / highlight / word
- Стили blockquote, hr, img
- Стили сворачивания details / summary
- Курсор lightbox для изображений `role="button"`
- `scroll-margin` для якорей заголовков

Контейнеры тела записей используют `<article class="app-prose">`.

## Компоненты shadcn

[`src/components/ui/`](../src/components/ui/) предоставляет компоненты в стиле shadcn:

| Компонент                                                                              | Примечания                                                                         |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `Button`                                                                               | Автоматически переключается между `<a>` / `<button>`, варианты cva (variant, size) |
| `Badge`                                                                                | Значок                                                                             |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Семейство карт                                                                     |
| `Input`                                                                                | Поле ввода                                                                         |
| `Separator`                                                                            | Разделитель                                                                        |

Конфигурации вариантов используют `class-variance-authority`; имена классов объединяются с помощью `cn` (`src/lib/utils.ts`, на основе `tailwind-merge` + `clsx`).

## Система иконок

Иконки Xingluo — это SVG, встраиваемые во время сборки через astro-icon + Font Awesome (режим sprite `<symbol>`), **ноль JS во время выполнения, без сетевых запросов шрифтов**.

### Сопоставление иконок (FA5)

| Использование  | Имя иконки                                   |
| -------------- | -------------------------------------------- |
| Поиск          | `fa-solid:search`                            |
| Закрыть        | `fa-solid:times`                             |
| Почта          | `fa-solid:envelope`                          |
| Другие соцсети | `fa-brands:{name}`                           |
| X (соцсеть)    | `fa-brands:twitter` (FA5 не имеет x-twitter) |

### Динамическое разрешение иконок соцсетей

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) собирает `src/assets/icons/socials/*.astro` по имени файла через `import.meta.glob`; `getSocialIcon(name)` разрешает по имени. Добавление социальной платформы так же просто, как добавление файла иконки в `socials/`.

## Настройка темы

Отредактируйте CSS-переменные в `src/styles/theme.css` чтобы настроить цвета сайта. Например, для переключения на синий основной цвет:

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

Все компоненты, ссылающиеся на `bg-primary` / `text-primary`, следуют автоматически.
