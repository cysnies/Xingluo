---
title: "التدويل"
pubDatetime: 2026-06-20T06:00:00+08:00
description: "تفاصيل نظام التدويل i18n في Xingluo ويغطي التوجيه متعدد اللغات وتوطين سلاسل واجهة المستخدم والترجمة على مستوى المحتوى وإضافة لغات جديدة."
tags:
  - documentation
  - i18n
category: "Documentation"
translationKey: doc-i18n
locale: ar
---

يأتي Xingluo مع دعم واجهة ثنائي اللغة (zh-CN / en)، باستخدام استراتيجية التوجيه `prefixDefaultLocale: false` بحيث لا تحتوي اللغة الافتراضية على بادئة URL.

## استراتيجية التوجيه

تهيئة `i18n` في Astro (انظر `astro.config.ts`):

```ts
i18n: {
  locales: ["zh-cn", "en"],
  defaultLocale: "zh-cn",
  routing: { prefixDefaultLocale: false },
}
```

**مهم: `prefixDefaultLocale: false` لا يُنشئ تلقائيًا نسخ صفحات مترجمة** — يجب عليك صيانة مسارات المرآة `[locale]/` يدويًا.

نهج Xingluo:

- **الصفحات الجذرية** = اللغة الافتراضية (`zh-cn`)، بدون بادئة URL، مثلاً `/posts/welcome/`
- **`src/pages/[locale]/`** تعكس جميع الصفحات؛ تستخدم `getStaticPaths` دالة `getLocaleParams()` لإنشاء اللغات غير الافتراضية فقط، مثلاً `/en/posts/welcome/`
- صفحات المرآة هي أيضًا أغلفة رقيقة، تعيد استخدام نفس مكون العرض لمنطق العرض

```
/                      → الرئيسية (zh-cn)
/en/                   → الرئيسية (en)
/posts/welcome/        → مقال (zh-cn)
/en/posts/welcome/     → مقال (en)
```

## حل اللغة

مكونات العرض تستخدم `Astro.currentLocale` للحل التلقائي:

- الصفحات الجذرية → `zh-cn`
- صفحات مقطع `[locale]` → `en` (أو لغات أخرى غير افتراضية)

لا حاجة لفحوصات المسار في طبقة المكونات؛ `useTranslations(locale)` تجلب السلاسل المقابلة مباشرة.

## هيكل وحدة i18n

[`src/i18n/`](../src/i18n/):

| الملف            | المسؤولية                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `index.ts`       | `import.meta.glob("./lang/*.ts", {eager:true})` تحميل اللغات؛ تصدير `DEFAULT_LOCALE`، `LOCALES`، `useTranslations(locale)`، `tplStr` |
| `types.ts`       | واجهة `UIStrings` الكاملة (جميع السلاسل المراد توطينها)                                                                              |
| `routing.ts`     | `getLocalePrefix`، `withLocale(path, locale)`، `parseLocaleFromPath(pathname)`                                                       |
| `staticPaths.ts` | `NON_DEFAULT_LOCALES`، `getLocaleParams()`                                                                                           |
| `format.ts`      | `tplStr(template, vars)` — استبدال العنصر النائب `{{key}}`                                                                           |
| `lang/zh-cn.ts`  | الصينية المبسطة (الافتراضية)                                                                                                         |
| `lang/en.ts`     | الإنجليزية                                                                                                                           |

## هيكل UIStrings

واجهة `UIStrings` تُعرّف جميع سلاسل UI المراد توطينها، منظمة في مجموعات:

- `nav`: التنقل (الرئيسية/المقالات/الوسوم/حول/الأرشيف/البحث/RSS)
- `post`: المقال (التاريخ، المشاركة، الوسوم، الرجوع، التعديل، جدول المحتويات، نسخ الكود، صندوق الضوء للصور، إلخ.)
- `pagination`: ترقيم الصفحات
- `home`: الصفحة الرئيسية (روابط التواصل، المميز، الأحدث)
- `archives`: الأرشيف (العدد، الأشهر)
- `footer`: التذييل (حقوق النشر)
- `pages`: عناوين الصفحات والأوصاف
- `a11y`: تسميات الوصول
- `languageSwitcher`: مبدل اللغة
- `notFound`: 404
- `comments`: قسم التعليقات

## سلاسل القوالب

السلاسل ذات العناصر النائبة تستخدم `{{key}}`، تُستبدل عبر `tplStr`:

```ts
import { tplStr } from "@/i18n";

// archives.postCount = "{{count}} posts"
tplStr(t.archives.postCount, { count: 5 }); // "5 posts"
```

## إعلانات SEO متعددة اللغات

رأس `Layout.astro` يُخرج:

- `<link rel="alternate" hreflang="..." href="...">` لكل لغة
- `x-default` يشير إلى اللغة الافتراضية
- تكامل sitemap يُفعّل تهيئة i18n لإنشاء hreflang تلقائيًا
- مقالات اللغات غير الافتراضية لها canonical يشير إلى الأصل باللغة الافتراضية (لتجنب عقوبات المحتوى المكرر؛ انظر [SEO](./doc-seo.md))

## إضافة لغة

مثال: إضافة اليابانية `ja`:

1. **`astro.config.ts`**: أضف `"ja"` إلى `i18n.locales` وتعيين `"ja": "ja-JP"` إلى sitemap `i18n.locales`
2. **`src/i18n/lang/`**: أنشئ `ja.ts` يصدر `UIStrings` كاملة (انسخ `en.ts` وترجم)
3. **`src/i18n/staticPaths.ts`**: `NON_DEFAULT_LOCALES` يتضمن `ja` تلقائيًا (محسوب من `LOCALES`)
4. **`src/pages/[locale]/`**: صفحات المرآة تنشئ تلقائيًا نسخة `ja` (`getLocaleParams` تغطيها)
5. **مبدل اللغة**: أضف `"ja": "日本語"` إلى `languageSwitcher.names` في `zh-cn.ts` و `en.ts`

## الترجمة على مستوى المحتوى

يدعم Xingluo محتوى المقالات متعدد اللغات عبر حقلي frontmatter `locale` و `translationKey`.

### الاستخدام الأساسي

1. **المقال باللغة الافتراضية**: ضعه في `src/content/posts/<slug>.md`، عيّن `translationKey` كمعرف المجموعة:

```yaml
# src/content/posts/welcome.md
---
title: "欢迎来到星罗"
locale: zh-cn
translationKey: welcome-to-xingluo
tags: [公告, Astro]
---
```

2. **الترجمة**: ضعها في دليل فرعي للغة `src/content/posts/<locale>/<slug>.md`، باستخدام نفس `translationKey`:

```yaml
# src/content/posts/en/welcome.md
---
title: "Welcome to Xingluo"
locale: en
translationKey: welcome-to-xingluo
tags: [announcement, Astro]
---
```

### هيكل الدليل

```
src/content/posts/
├── welcome.md              # اللغة الافتراضية (zh-cn)
├── en/
│   └── welcome.md          # الترجمة الإنجليزية
├── ja/
│   └── welcome.md          # الترجمة اليابانية
└── another-post.md         # مقال مستقل (بدون translationKey)
```

- أسماء الدلائل الفرعية للغة يجب أن تطابق رموز اللغة في `i18n.locales` في `astro.config.ts`
- الدلائل الفرعية للغة تُصفى من slug URL (مثلاً `/posts/welcome/`، ليس `/posts/en/welcome/`)
- المقالات بدون `translationKey` مستقلة وغير مرتبطة عبر اللغات

### سلوك التوجيه

| السيناريو                              | السلوك                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------ |
| وصول اللغة الافتراضية إلى مقال `zh-cn` | يعرض النص الأصلي باللغة الافتراضية                                       |
| لغة غير افتراضية مع **ترجمة**          | يعرض الترجمة المقابلة                                                    |
| لغة غير افتراضية **بدون** ترجمة        | يرجع إلى النص الأصلي باللغة الافتراضية (نفس المحتوى، canonical يحمي SEO) |

### إزالة التكرار من القوائم

صفحات القوائم (الرئيسية، قائمة المقالات، الوسوم، الأرشيف، RSS) تستخدم `getPostsForLocale` لاختيار المقالات التمثيلية لكل لغة: كل مجموعة ترجمة تُظهر بطاقة واحدة فقط في اللغة المستهدفة، مما يمنع الإدخالات المكررة لنفس الموضوع.

### canonical وتحسين محركات البحث

- **لديه ترجمة مستقلة**: canonical يشير إلى URL الترجمة الخاص بها، قابل للفهرسة بشكل منفصل بواسطة محركات البحث
- **لا توجد ترجمة (الرجوع للافتراضي)**: canonical يشير إلى الأصل باللغة الافتراضية، متجنبًا عقوبات المحتوى المكرر
- إعلانات hreflang تغطي جميع اللغات، تخبر محركات البحث عن العلاقات بين إصدارات اللغات

انظر [SEO](./doc-seo.md).
