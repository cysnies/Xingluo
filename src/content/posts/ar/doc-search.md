---
title: "البحث"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "دليل البحث في Xingluo ويغطي دمج البحث النصي الكامل Pagefind وتوليد الفهرس وواجهة المستخدم والبحث متعدد اللغات والأداء."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: ar
---

يدمج Xingluo [Pagefind](https://pagefind.app/) للبحث النصي الكامل الثابت، مع فهارس حسب اللغة واستمرارية حالة View Transitions.

## التفعيل

قم بالتكوين عبر `features.search`:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

عند تعيينه إلى `false`، تعيد صفحة البحث `Astro.rewrite` إلى 404 ولا يتم إنشاء واجهة بحث.

## آلية العمل

### إنشاء الفهرس

خطوة البناء الثالثة، `pagefind --site dist`، تمسح دليل `dist/`:

- فقط الصفحات التي تحتوي على السمة `data-pagefind-body` تُفهرس
- الفهارس تُقسّم تلقائيًا حسب اللغة (`zh-cn` و `en` لكل منهما فهرسه الخاص)
- الفهارس تُخرج إلى `dist/pagefind/`

### نطاق الفهرس

عنصر `<main>` في صفحات تفاصيل المقالات مُعلّم بـ `data-pagefind-body`، لذلك فقط نصوص المقالات تُفهرس. الصفحات الأخرى (الرئيسية، القوائم، الأرشيف، إلخ.) لا تدخل فهرس البحث.

## واجهة البحث

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) تنفذ صفحة البحث:

- تحميل `@pagefind/default-ui` لمربع البحث وقائمة النتائج
- تحديد موقع أصول الفهرس عبر `getAssetPath("pagefind/")`
- الأنماط العامة تتجاوز متغيرات Pagefind CSS، وتربطها بسمة Xingluo (`--background`، `--foreground`، `--primary`، إلخ.)
- `transition:persist` يحافظ على حالة البحث عبر التنقل

### تدفق البحث

1. يكتب المستخدم في مربع البحث
2. يطابق Pagefind مع فهرس اللغة الحالية
3. تُظهر قائمة النتائج المقالات المطابقة (العنوان، تمييز الملخص)
4. يكتب `processTerm` عنوان URL لصفحة البحث مع معاملات الاستعلام في sessionStorage، ليتمكن زر الرجوع من الاستعادة

## التنقل الرجعي للمصدر

آلية التنقل الرجعي بين صفحة البحث وصفحات المقالات:

- يقوم مكون `Main.astro` بكتابة عنوان URL لصفحة المصدر في `backUrl` من sessionStorage
- يفضل `BackButton.astro` في صفحة المقال القفز عائداً إلى `backUrl` في sessionStorage، أو إلى الصفحة الرئيسية إذا كان غائباً
- يكتب `processTerm` في صفحة البحث عنوان URL مع معاملات الاستعلام، لاستعادة حالة البحث عند العودة من مقال

## البحث متعدد اللغات

يقسم Pagefind الفهارس حسب سمة اللغة لعناصر `data-pagefind-body`:

- صفحات `zh-cn` (الجذر) → فهرس صيني
- صفحات `en` (بادئة `/en/`) → فهرس إنجليزي

تتطابق وظيفة البحث تلقائياً مع فهرس لغة الصفحة الحالية: الصينية في الصفحات الصينية، الإنجليزية في الصفحات الإنجليزية.

## تكيف السمة

واجهة المستخدم الافتراضية لـ Pagefind لها متغيرات CSS خاصة بها؛ يتجاوزها Xingluo بأنماط عامة في `SearchView.astro`، ويربطها بمتغيرات سمة shadcn:

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

الوضع الداكن يتحول تلقائياً عبر محدد `.dark`، بما يتوافق مع سمة الموقع.

## الأداء

- فهارس Pagefind هي ملفات ثابتة؛ يتم البحث من جانب العميل دون طلبات خادم
- يتم تحميل الفهارس حسب الطلب (تُنزّل أجزاء الفهرس فقط عند البحث)
- `transition:persist` يتجنب إعادة تهيئة واجهة البحث عند التنقل
