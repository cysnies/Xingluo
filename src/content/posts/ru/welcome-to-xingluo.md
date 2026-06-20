---
title: "Добро пожаловать в Xingluo"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo — это современная CMS для блогов, созданная на Astro с визуальным стилем shadcn. Эта статья представляет философию дизайна и основные возможности."
tags:
  - announcement
  - Astro
featured: true
locale: ru
translationKey: welcome-to-xingluo
category: announcement
---

## О Xingluo

**Xingluo** — это CMS для блогов, созданная на Astro с визуальным стилем shadcn.

## Основные возможности

- ⚡ **Экстремальная производительность**: статическая генерация с Astro, нулевая нагрузка JavaScript
- 🎨 **Современный внешний вид**: стиль shadcn/ui new-york, цветовое пространство OKLCH
- 🌗 **Темный режим**: переключение без мерцания, следует системным настройкам
- 🔍 **Полнотекстовый поиск**: индексация во время сборки с Pagefind
- 🌐 **Многоязычность**: поддержка русского, английского и китайского
- 📝 **Markdown**: MDX, подсветка синтаксиса, оглавление, callouts
- 📡 **RSS и SEO**: RSS-лента и структурированные данные готовы к использованию

## Пример кода

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Начало работы

Создайте Markdown-файл в директории `src/content/posts/`, добавьте frontmatter и опубликуйте статью. Подробные описания полей можно найти в документации проекта.

Начните свой путь в написании!
