---
title: "دليل التكوين"
pubDatetime: 2026-06-20T04:00:00+08:00
description: "مرجع كامل لجميع خيارات تكوين Xingluo، بما في ذلك تكوين الموقع وتكوين المقالات وتبديلات الميزات والروابط الاجتماعية وروابط المشاركة ومتغيرات البيئة."
tags:
  - documentation
  - configuration
category: "Documentation"
translationKey: doc-configuration
locale: ar
---

جميع الخيارات القابلة للتكوين في Xingluo موجودة في ملف الجذر [`xingluo.config.ts`](../xingluo.config.ts). يوفر الملف قيود نوع كاملة عبر `defineXingluoConfig`؛ التغييرات تصبح سارية المفعول فورًا دون لمس الكود المصدري.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // رابط الموقع، يُستخدم للروابط المطلقة و RSS و sitemap
  title: "Xingluo",                      // عنوان الموقع
  description: "نظام إدارة محتوى مدونات حديث مبني على Astro و shadcn",
  author: "Xingluo",                     // اسم المؤلف الافتراضي
  profile: "https://xingluo.example.com", // الصفحة الرئيسية للمؤلف (تُستخدم لـ JSON-LD)
  ogImage: "default-og.jpg",              // صورة OG الافتراضية (في دليل public)
  lang: "zh-cn",                          // اللغة الافتراضية
  timezone: "Asia/Shanghai",              // المنطقة الزمنية (عرض تاريخ المقال)
  dir: "ltr",                             // اتجاه النص: ltr | rtl
  googleVerification: "",                 // قيمة التحقق من Google Search Console (أو عبر متغير بيئة)
}
```

| الحقل                | القيمة الافتراضية | ملاحظات                                                                                    |
| -------------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| `url`                | مطلوب             | رابط جذر الموقع؛ يجب أن ينتهي بـ `/`                                                       |
| `title`              | مطلوب             | عنوان الموقع، يُستخدم في `<title>` و OG                                                    |
| `description`        | مطلوب             | وصف الموقع، يُستخدم في meta و RSS                                                          |
| `author`             | مطلوب             | المؤلف الافتراضي؛ frontmatter المقال يعود إلى هذا القيمة                                   |
| `profile`            | —                 | الصفحة الرئيسية للمؤلف، تُحقن في JSON-LD `author.url`                                      |
| `ogImage`            | `default-og.jpg`  | اسم ملف صورة OG الافتراضي، موجود في `public/`                                              |
| `lang`               | مطلوب             | رمز اللغة الافتراضي؛ يجب أن يتطابق مع `i18n.defaultLocale` في `astro.config.ts`            |
| `timezone`           | `Asia/Shanghai`   | المنطقة الزمنية dayjs، تؤثر على عرض تاريخ المقال                                           |
| `dir`                | `ltr`             | اتجاه النص                                                                                 |
| `googleVerification` | —                 | قيمة التحقق من Google؛ يمكن أيضًا حقنها عبر متغير البيئة `PUBLIC_GOOGLE_SITE_VERIFICATION` |

## posts

```ts
posts: {
perPage: 8,              // المقالات لكل صفحة قائمة
  perIndex: 5,             // المقالات المعروضة في الصفحة الرئيسية
  scheduledPostMargin: 900000, // تسامح النشر المجدول (مللي ثانية)، 15 دقيقة
}
```

- `perPage`: حجم الصفحة لـ `/posts/[...page]` و `/tags/[tag]/[...page]`
- `perIndex`: عدد المقالات المعروضة في قسم "الأحدث" بالصفحة الرئيسية
- `scheduledPostMargin`: المقالات المستقبلية ضمن هذه النافذة تُعتبر منشورة (فعال في الإنتاج؛ التطوير يظهر الكل)

## features

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "pagefind",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| الحقل              | الافتراضي          | ملاحظات                                                                  |
| ------------------ | ------------------ | ------------------------------------------------------------------------ |
| `lightAndDarkMode` | `true`             | تفعيل تبديل الوضع الفاتح/الداكن                                          |
| `dynamicOgImage`   | `true`             | إنشاء صور OG ديناميكياً (satori + sharp)                                 |
| `showArchives`     | `true`             | إظهار صفحة الأرشيف (خريطة الموقع تُفلتر عند الإيقاف)                     |
| `showCategories`   | `true`             | إظهار صفحة التصنيفات ومدخل التنقل (خريطة الموقع تُفلتر عند الإيقاف)      |
| `showBackButton`   | `true`             | إظهار زر الرجوع في صفحات المقالات                                        |
| `editPost.enabled` | `false`            | إظهار رابط "تعديل هذه الصفحة"                                            |
| `editPost.url`     | `""`               | بادئة رابط التحرير؛ يتم إلحاق مسار المصدر النسبي للمقال                  |
| `search`           | `"pagefind"`       | حل البحث: `"pagefind"` أو `false`                                        |
| `mdx`              | `true`             | تفعيل تحليل وعرض MDX (راجع [إنشاء المحتوى](./doc-content.md))            |
| `comments`         | `{provider:false}` | إعدادات نظام التعليقات (راجع [نظام التعليقات](./doc-comments.md))        |
| `players.aplayer`  | `false`            | تفعيل مشغل الصوت APlayer (راجع [مشغلات الوسائط](./doc-media-players.md)) |
| `players.dplayer`  | `false`            | تفعيل مشغل الفيديو DPlayer                                               |

### editPost

`editPost.url` هي بادئة رابط تحرير المستودع؛ يلحق Xingluo مسار المصدر النسبي للمقال (`src/content/posts/...`). مثال:

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

المقال `src/content/posts/welcome.md` يُنتج الرابط `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: اسم الأيقونة، المطابق لـ `src/assets/icons/socials/{name}.astro`. المضمنة: `github`، `x`، `mail`، `facebook`، `telegram`، `weibo`
- `url`: رابط URL؛ `mailto:` للبريد الإلكتروني
- `linkTitle`: عنوان وصول اختياري؛ يُنشأ تلقائياً من الاسم عند الحذف

> إضافة منصة اجتماعية: أنشئ مكون أيقونة `.astro` بنفس الاسم في `src/assets/icons/socials/`. `src/lib/socialIcons.ts` يجمعها تلقائياً عبر `import.meta.glob`.

## shareLinks

```ts
shareLinks: [
  { name: "x", url: "https://x.com/intent/post?url=" },
  { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
  { name: "telegram", url: "https://t.me/share/url?url=" },
  { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
  { name: "mail", url: "mailto:?subject=...&body=" },
];
```

تظهر إدخالات المشاركة هذه في أسفل صفحات المقالات. `url` هي بادئة رابط مشاركة؛ يلحق Xingluo الرابط المطلق للمقال الحالي. `name` يُسند كذلك إلى أيقونة في `src/assets/icons/socials/`.

## متغيرات البيئة

مُعلنة عبر `env.schema` في `astro.config.ts`:

| المتغير                           | مستوى الوصول | الوصف                                         |
| --------------------------------- | ------------ | --------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | عام/عميل     | قيمة التحقق من Google Search Console، اختياري |

مثال (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "رمز-التحقق-الخاص-بك"
pnpm build
```

يُحقن القيمة في `config.site.googleVerification` وتُعرض كـ `<meta name="google-site-verification">`.

## مثال كامل

راجع [`xingluo.config.ts`](../xingluo.config.ts). أقسام `features.comments` و `features.players` تتضمن أمثلة معلقة لـ giscus / twikoo / waline؛ قم بإلغاء التعليق واملأ بالقيم الحقيقية للتفعيل.
