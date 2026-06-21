# Обзор архитектуры

Этот документ описывает общую архитектуру Xingluo, структуру каталогов, поток конфигурации, поток рендеринга и конвейер сборки, чтобы помочь вам понять организацию кода и способы его расширения.

## Структура каталогов

```
xingluo/
├── astro.config.ts          # Конфигурация Astro (интеграции, i18n, markdown, шрифты, env)
├── xingluo.config.ts        # Входная точка конфигурации пользователя
├── tsconfig.json            # Конфигурация TypeScript (strict + псевдоним пути @/*)
├── package.json             # Зависимости и скрипты
├── public/                  # Статические ресурсы (favicon.svg, изображение OG по умолчанию и т.д.)
├── docs/                    # Документация проекта (этот каталог)
├── references/              # Эталонные проекты только для чтения (не должны использоваться как зависимости)
└── src/
    ├── config.ts            # Слияние конфигурации по умолчанию, экспорт разрешённой конфигурации
    ├── content.config.ts    # Схемы коллекций контента (posts, pages)
    ├── env.d.ts             # Объявления типов сторонних модулей и переменных окружения
    ├── assets/              # Компоненты иконок
    │   └── icons/           # astro-icon + Font Awesome (включая socials/)
    ├── components/          # UI-компоненты
    │   ├── ui/              # Компоненты в стиле shadcn (Button, Card, Badge и т.д.)
    │   ├── post/            # Компоненты страницы поста (навигация пред/след, назад, поделиться и т.д.)
    │   ├── comments/        # Компоненты системы комментариев
    │   ├── mdx/             # Пользовательские MDX-компоненты (APlayer, DPlayer)
    │   ├── pageViews/       # Представления страниц (централизованная логика рендеринга)
    │   └── *.astro          # Корневые компоненты (Header, Footer, PostCard и т.д.)
    ├── content/             # Файлы контента
    │   ├── posts/           # Записи блога
    │   └── pages/           # Статические страницы
    ├── i18n/                # Интернационализация
    │   ├── index.ts         # Загрузка языка и useTranslations
    │   ├── types.ts         # Полный тип UIStrings
    │   ├── routing.ts       # Разрешение пути локали
    │   ├── staticPaths.ts   # getStaticPaths для нестандартных локалей
    │   ├── format.ts        # Замена шаблонных строк
    │   └── lang/            # Файлы языковых ресурсов (zh-cn.ts, en.ts)
    ├── layouts/             # Макеты
    │   ├── Layout.astro     # Базовый скелет (head, SEO, FOUC)
    │   └── PostLayout.astro # Макет поста (JSON-LD, метаданные статьи)
    ├── lib/                 # Фундаментальные утилиты
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # Экземпляр dayjs и плагин часового пояса
    │   └── socialIcons.ts   # Динамическое разрешение социальных иконок
    ├── pages/               # Маршруты (корень + зеркало [locale]/)
    ├── scripts/             # Клиентские скрипты
    │   ├── theme.ts         # Переключение темы
    │   ├── postEnhancements.ts # Улучшения поста (якоря, копирование, лайтбокс, прогресс)
    │   ├── comments.ts      # Ленивая загрузка комментариев и синхронизация темы
    │   └── players.ts       # Ленивая загрузка плееров
    ├── styles/              # Стили
    │   ├── global.css       # Вход Tailwind + базовый слой + пользовательские утилиты
    │   ├── theme.css        # Переменные темы shadcn (OKLCH)
    │   └── typography.css   # Типографика .app-prose и стили блоков кода
    ├── types/               # Объявления типов
    │   ├── config.ts        # Типы конфигурации
    │   └── *.d.ts           # Объявления для нетипизированных сторонних модулей
    └── utils/               # Утилитарные функции
        ├── getPostPaths.ts  # Вывод slug и URL поста
        ├── getSortedPosts.ts# Сортировка постов
        ├── postFilter.ts    # Фильтрация черновиков и запланированных постов
        ├── getUniqueTags.ts # Дедупликация тегов
        ├── remarkPlayers.ts # Плагин remark для плееров
        ├── rehypeWrapTable.ts# Обёртка прокрутки таблицы
        └── ...              # Другие утилиты
```

## Поток конфигурации

```
xingluo.config.ts
   │ defineXingluoConfig (ограничения типов, пропуск)
   ▼
src/config.ts
   │ resolveConfig (слияние значений по умолчанию + resolveComments + resolvePlayers)
   ▼
src/types/config.ts
   │ XingluoConfig (полный тип)
   ▼
Ссылка по всему сайту через import config from "@/config"
```

Ключевые моменты:

- `xingluo.config.ts` — единственный файл конфигурации, который нужно редактировать
- `resolveConfig` в `src/config.ts` выполняет поверхностное слияние (`site`/`posts`) и глубокое слияние (`features.editPost`, `features.comments`, `features.players`)
- `astro.config.ts` читает неразрешённый `./xingluo.config` (поскольку загрузка интеграций решается на уровне конфигурации Astro), поэтому обращается к `features` с опциональной цепочкой
- `src/content.config.ts` читает разрешённый `@/config`, поэтому `features` обязателен

## Поток рендеринга

### Рендеринг страниц

Xingluo использует шаблон «тонкая обёртка страницы + компонент представления», централизуя логику рендеринга в `src/components/pageViews/`:

```
src/pages/posts/[...slug]/index.astro   ← тонкая обёртка: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← логика рендеринга
    │
    ▼
src/layouts/PostLayout.astro  ← макет поста (JSON-LD, метаданные статьи)
    │
    ▼
src/layouts/Layout.astro      ← базовый скелет (head, SEO, FOUC, ClientRouter)
```

Тонкая обёртка страницы обрабатывает только `getStaticPaths` и передачу props; компонент представления содержит всю логику рендеринга. Зеркальные страницы `[locale]/` также являются тонкими обёртками, генерируя только нестандартные локали через `getLocaleParams()`.

### Маршрутизация

```
src/pages/
├── 404.astro                      # 404 (не зеркалируется)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # Точка входа OG-изображения уровня сайта
├── rss.xml.ts                     # Точка входа RSS
├── robots.txt.ts                  # Точка входа robots.txt
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # Точка входа OG-изображения уровня поста
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Зеркало нестандартной локали (getStaticPaths=getLocaleParams)
    └── (структура зеркалирует корень, кроме 404, og.png, rss, robots)
```

### Вывод URL поста

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: выводит slug маршрутизации из `id` коллекции контента и пути файла, фильтруя каталоги с префиксом `_`
- `getPostUrl(id, filePath, locale)`: генерирует навигационный URL с префиксом локали (стандартная локаль не имеет префикса)

### Фильтрация и сортировка постов

- [`postFilter.ts`](../src/utils/postFilter.ts): исключает черновики; фильтрует будущие посты в production с помощью `pubDatetime - scheduledPostMargin`; dev показывает все
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): после фильтрации сортирует по убыванию по `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): дедуплицирует и сортирует теги по slug

## Клиентские скрипты

Клиентские взаимодействия Xingluo загружаются через теги `<script>` в нижней части страниц, все адаптированы для View Transitions:

| Скрипт                | Место загрузки                                       | Адаптация событий                                                                                                | Обязанности                                                               |
| --------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `theme.ts`            | конец body `Layout.astro`                            | перепривязка на `astro:after-swap`, перенос theme-color на `astro:before-swap`, изменение `prefers-color-scheme` | Сохранение и переключение темы                                            |
| `postEnhancements.ts` | `PostDetailView.astro`                               | переинициализация на `astro:page-load`                                                                           | Якоря заголовков, копирование кода, прогресс чтения, лайтбокс изображений |
| `comments.ts`         | `Comments.astro`                                     | повторное сканирование на `astro:page-load`                                                                      | Ленивая загрузка комментариев и синхронизация темы                        |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (условно) | повторное сканирование на `astro:page-load`                                                                      | Ленивая загрузка плееров                                                  |

> Примечание: `comments.ts` и `players.ts` не имеют импорта/экспорта верхнего уровня; добавьте `export {}` в конец файла, чтобы пометить их как модули и избежать конфликтов глобальных объявлений с другими файлами.

## Конвейер сборки

`pnpm run build` = `astro check && astro build && node scripts/generateSearchIndex.mjs`

1. **`astro check`**: Проверка типов TypeScript + шаблонов Astro
2. **`astro build`**:
   - Сбор коллекций контента (включает `.mdx` на основе `features.mdx`)
   - Статическая генерация всех страниц (включая зеркала `[locale]/`)
   - Генерация точек входа: RSS, sitemap, robots.txt, OG-изображения уровня сайта и поста
   - Условная загрузка интеграции `mdx()`; условное внедрение `remarkPlayers`
   - Встраивание SVG-иконок во время сборки (astro-icon, нулевой JS во время выполнения)
   - Динамически импортируемые модули комментариев и плееров разделяются на независимые чанки (ленивая загрузка)
3. **`node scripts/generateSearchIndex.mjs`**: сканирует HTML-файлы в `dist/`, анализирует содержимое страниц, создавая поисковые индексы по языкам в `dist/search/`

## Стратегии производительности

- **Иконки без JS во время выполнения**: astro-icon встраивает SVG Font Awesome во время сборки (режим спрайта `<symbol>`)
- **Оптимизация SVG**: `experimental.svgOptimizer` (svgo) сжимает встроенные и ссылочные SVG
- **Ленивая загрузка по требованию**: комментарии и плееры динамически импортируются через IntersectionObserver при прокрутке в область видимости; нулевой бандл при отключении
- **Условные интеграции**: при выключенном MDX интеграция `mdx()` не загружается; при выключенных плеерах плагин remark не внедряется
- **Размер CSS**: Tailwind v4 генерирует по требованию; переменные OKLCH управляются централизованно
- **Шрифты OG-изображений**: используются только satori, не внедряются в CSS сайта
- **View Transitions**: `<ClientRouter/>` обеспечивает анимацию перехода страниц; поле поиска использует `transition:persist` для сохранения состояния

## Руководство по расширению

### Добавление страницы

1. Создайте файл `.astro` в `src/pages/` (тонкая обёртка)
2. Создайте соответствующий компонент представления в `src/components/pageViews/`
3. Для многоязычной поддержки создайте одноимённую зеркальную тонкую обёртку в `src/pages/[locale]/`

### Добавление UI-компонента

Следуйте стилю shadcn: создавайте компоненты `.astro` и конфигурации вариантов `.ts` в `src/components/ui/` (используя `class-variance-authority`).

### Добавление клиентского скрипта

Создайте файл `.ts` в `src/scripts/`, добавьте `export {}` в конец файла, чтобы пометить его как модуль, слушайте `astro:page-load` для адаптации к View Transitions и импортируйте его в теге `<script>` на соответствующей странице.
