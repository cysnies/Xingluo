---
title: "مرحباً بك في Xingluo"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo هو نظام إدارة محتوى مدونات حديث مبني على Astro و shadcn. تقدم هذه المقالة فلسفة التصميم والميزات الأساسية."
tags:
  - announcement
  - Astro
featured: true
locale: ar
translationKey: welcome-to-xingluo
category: announcement
---

## حول Xingluo

**Xingluo** هو نظام إدارة محتوى مدونات مبني على Astro والنمط البصري shadcn.

## الميزات الأساسية

- ⚡ **أداء فائق**: توليد ثابت بواسطة Astro، بدون حمل JavaScript في وقت التشغيل
- 🎨 **مرئيات حديثة**: نمط shadcn/ui new-york، فضاء ألوان OKLCH
- 🌗 **وضع داكن**: تبديل بدون وميض، يتبع تفضيل النظام
- 🔍 **بحث نصي كامل**: فهرسة في وقت البناء بواسطة Pagefind
- 🌐 **متعدد اللغات**: دعم العربية والإنجليزية والصينية
- 📝 **Markdown**: MDX، تظليل الكود، جدول المحتويات، التنبيهات
- 📡 **RSS و SEO**: موجز RSS وبيانات منظمة جاهزة للاستخدام

## مثال كود

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## ابدأ الكتابة

قم بإنشاء ملف Markdown في دليل `src/content/posts/`، وأضف frontmatter وانشر مقالتك. يمكن العثور على أوصاف الحقول التفصيلية في وثائق المشروع.

ابدأ رحلتك في الكتابة!
