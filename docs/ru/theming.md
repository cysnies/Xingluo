# Тема и стили

Xingluo использует компоненты стиля shadcn/ui new-york и цветовое пространство OKLCH, построенные на Tailwind CSS v4.

## Структура файлов стилей

[`src/styles/`](../src/styles/):

| Файл             | Содержание                                                          |
| ---------------- | ------------------------------------------------------------------- |
| `theme.css`      | Переменные темы shadcn (OKLCH, светлая `:root` + тёмная `.dark`)    |
| `global.css`     | Вход Tailwind, базовый слой, пользовательские утилиты, темы выносок |
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

Эти переменные сопоставляются с токенами Tailwind в `@theme inline` файла `global.css`, поэтому вы можете напрямую использовать классы `bg-background`, `text-foreground`, `border-border`.

## Tailwind CSS v4

Xingluo использует Tailwind v4, интегрированный через плагин `@tailwindcss/vite` (см. `vite.plugins` в `astro.config.ts`).

### Основная конфигурация (`global.css`)

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

- `max-w-app`: максимальная ширина контента (`--content-width: 72rem`)
- `app-layout`: макет приложения (min-height 100vh, flex column)

## Тёмный режим

### Защита FOUC

`Layout.astro` встраивает синхронный скрипт в `<head>` (`is:inline`), который устанавливает тему до первой отрисовки:

```js
// Чтение localStorage.theme или возврат к prefers-color-scheme
// Установка атрибута data-theme и класса .dark на html
```

Это предотвращает вспышку темы при обновлении.

### Переключение темы в runtime

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme`: localStorage в первую очередь, возврат к системным настройкам
- `persist`: сохранение в localStorage
- `reflect`: синхронизация атрибута `data-theme`, класса `.dark`, `aria-label` `#theme-btn`, `<meta name="theme-color">`
- Привязка клика по `#theme-btn` для переключения
- Адаптация к View Transitions: перепривязка на `astro:after-swap`, перенос theme-color на `astro:before-swap`
- Отслеживание системных изменений `prefers-color-scheme` (следует только если пользователь явно не выбрал)

### Синхронизация темы комментариев и плееров

- giscus: переключается через `postMessage({giscus:{setConfig:{theme}}})`
- waline: селектор `dark:"html.dark"` следует автоматически
- twikoo: отслеживает изменения класса `.dark` и перестраивается (twikoo не поддерживает переключение во время выполнения)
- См. [Система комментариев](./comments.md)

## Типографика (.app-prose)

`.app-prose` из `typography.css` основан на `prose` из `@tailwindcss/typography` с переопределениями темы:

- Link primary color (`--primary`)
- Inline code background (`--code`)
- Code block dual theme (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- diff / highlight / word line styles
- blockquote, hr, img styles
- details / summary collapse styles
- Image `role="button"` lightbox cursor
- Heading anchor `scroll-margin`

Контейнеры тела записей используют `<article class="app-prose">`.

## Компоненты shadcn

[`src/components/ui/`](../src/components/ui/) предоставляет компоненты в стиле shadcn:

| Компонент                                                                              | Примечания                                                                         |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `Button`                                                                               | Автоматическое переключение между `<a>` / `<button>`, варианты cva (variant, size) |
| `Badge`                                                                                | Значок                                                                             |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Семейство Card                                                                     |
| `Input`                                                                                | Поле ввода                                                                         |
| `Separator`                                                                            | Разделитель                                                                        |

Конфигурации вариантов используют `class-variance-authority`; имена классов объединяются с помощью `cn` (`src/lib/utils.ts`, на основе `tailwind-merge` + `clsx`).

## Система иконок

Иконки Xingluo — это встроенные во время сборки SVG через astro-icon + Font Awesome (режим спрайта `<symbol>`), **нулевой JS во время выполнения, без сетевых запросов шрифтов**.

### Сопоставление иконок (FA5)

| Использование  | Имя иконки                                |
| -------------- | ----------------------------------------- |
| Поиск          | `fa-solid:search`                         |
| Закрыть        | `fa-solid:times`                          |
| Почта          | `fa-solid:envelope`                       |
| Другие соцсети | `fa-brands:{name}`                        |
| X (соцсеть)    | `fa-brands:twitter` (в FA5 нет x-twitter) |

### Динамическое разрешение социальных иконок

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) собирает `src/assets/icons/socials/*.astro` по имени файла через `import.meta.glob`; `getSocialIcon(name)` разрешает по имени. Добавление социальной платформы так же просто, как добавление файла иконки в `socials/`.

## Настройка темы

Отредактируйте CSS-переменные в `src/styles/theme.css`, чтобы настроить цвета сайта. Например, для переключения на синий основной цвет:

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

Все компоненты, ссылающиеся на `bg-primary` / `text-primary`, следуют автоматически.
