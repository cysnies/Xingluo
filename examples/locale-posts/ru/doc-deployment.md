---
title: "Развертывание"
pubDatetime: 2026-06-20T13:00:00+08:00
description: "Руководство по развертыванию Xingluo, охватывающее платформы статического хостинга (Netlify/Vercel/GitHub Pages), самостоятельный хостинг Nginx, Docker и переменные окружения."
tags:
  - documentation
  - deployment
category: "Documentation"
translationKey: doc-deployment
locale: ru
---

Xingluo — это чисто статический сайт; `pnpm build` генерирует каталог `dist/`, который можно разместить на любом сервисе статического хостинга.

## Результат сборки

```bash
pnpm build
```

Сгенерированный `dist/` содержит:

- Все статические HTML-страницы (включая зеркала `[locale]/`)
- Ресурсы JS / CSS / шрифтов в `_astro/`
- Поисковый индекс `search/`
- `og.png` уровня сайта и `og.png` для каждой записи
- `rss.xml`, `sitemap-index.xml`, `robots.txt`
- Статические ресурсы в `public/` (favicon, изображение OG по умолчанию и т.д.)

## Переменные окружения

Устанавливаются во время сборки:

| Переменная                        | Описание                                              |
| --------------------------------- | ----------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Значение проверки Google Search Console (опционально) |

Пример PowerShell:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

В CI-средах (например, GitHub Actions) вводите через `env` перед шагом сборки.

## Контрольный список перед развёртыванием

Перед развёртыванием убедитесь:

1. `site.url` в `xingluo.config.ts` указывает на рабочий домен
2. `site.title`, `site.description`, `site.author` и т.д. настроены
3. Если система комментариев включена, конфигурация провайдера (giscus repoId, twikoo envId, waline serverURL) содержит реальные значения
4. `public/default-og.jpg` (или настроенный `site.ogImage`) заменён на изображение OG сайта по умолчанию
5. `public/favicon.svg` заменён на иконку сайта

## Платформы статического хостинга

### Netlify / Vercel / Cloudflare Pages

| Конфигурация     | Значение     |
| ---------------- | ------------ |
| Команда сборки   | `pnpm build` |
| Выходной каталог | `dist`       |
| Версия Node      | 22.12.0+     |
| Менеджер пакетов | pnpm         |

Необязательный `vercel.json` для Vercel:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

Развёртывание через GitHub Actions; пример рабочего процесса:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          PUBLIC_GOOGLE_SITE_VERIFICATION: ${{ secrets.GOOGLE_VERIFICATION }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

> При развёртывании в подкаталоге (например, `https://user.github.io/repo/`) установите `base: "/repo/"` в `astro.config.ts`.

### Nginx / Самостоятельный хостинг

Загрузите `dist/` на сервер; пример конфигурации Nginx:

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Кэширование статических ресурсов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Примечания по производительности

- Ресурсы в `_astro/` имеют хешированные имена файлов и могут кэшироваться надолго (`immutable`)
- HTML-файлы не должны кэшироваться (или только ненадолго) для своевременного обновления контента
- Индексы Flexsearch загружаются по требованию; специальная стратегия кэширования не требуется
- После развёртывания проверьте доступность OG-изображений, RSS и карты сайта

## Бэкенды системы комментариев

Если вы включаете систему комментариев, разверните соответствующий бэкенд:

| Система комментариев | Требования к бэкенду                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| giscus               | Нет; используйте публичный сервис giscus.app (или самостоятельный хостинг [giscus-vercel](https://github.com/giscus/giscus-vercel)) |
| twikoo               | Разверните сервер twikoo (Vercel / CloudBase / самостоятельный хостинг)                                                             |
| waline               | Разверните сервер waline (Vercel / Cloudflare / самостоятельный хостинг)                                                            |

См. официальную документацию каждой системы комментариев и [Система комментариев](./doc-comments.md).
