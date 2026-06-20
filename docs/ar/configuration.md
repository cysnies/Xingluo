# دليل التكوين

جميع الخيارات القابلة للتكوين لـ Xingluo موجودة في [`xingluo.config.ts`](../xingluo.config.ts) على مستوى الجذر. يوفر الملف قيود نوع كاملة عبر `defineXingluoConfig`؛ التغييرات تسري فورًا دون لمس كود المصدر.

## site إعدادات الموقع

```ts
site: {
  url: "https://xingluo.example.com/",  // رابط الموقع، يستخدم للروابط المطلقة و RSS و sitemap
  title: "Xingluo",                      // عنوان الموقع
  description: "نظام إدارة محتوى حديث مبني على Astro و shadcn",
  author: "Xingluo",                     // اسم المؤلف الافتراضي
  profile: "https://xingluo.example.com", // الصفحة الرئيسية للمؤلف (تستخدم لـ JSON-LD)
  ogImage: "default-og.jpg",              // صورة OG الافتراضية (في دليل public)
  lang: "zh-cn",                          // اللغة الافتراضية
  timezone: "Asia/Shanghai",              // المنطقة الزمنية (عرض تاريخ المقال)
  dir: "ltr",                             // اتجاه النص: ltr | rtl
  googleVerification: "",                 // قيمة التحقق من Google Search Console (أو عبر متغير بيئي)
}
```

| الحقل                | القيمة الافتراضية | الملاحظات                                                                                    |
| -------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| `url`                | مطلوب             | رابط جذر الموقع؛ يجب أن ينتهي بـ `/`                                                         |
| `title`              | مطلوب             | عنوان الموقع، يستخدم في `<title>` و OG                                                       |
| `description`        | مطلوب             | وصف الموقع، يستخدم في meta و RSS                                                             |
| `author`             | مطلوب             | المؤلف الافتراضي؛ frontmatter المقال يرجع إليه إذا لم يُحدد                                  |
| `profile`            | —                 | الصفحة الرئيسية للمؤلف، تُحقن في JSON-LD `author.url`                                        |
| `ogImage`            | `default-og.jpg`  | اسم ملف صورة OG الافتراضي، موجود في `public/`                                                |
| `lang`               | مطلوب             | رمز اللغة الافتراضي؛ يجب أن يتطابق مع `i18n.defaultLocale` في `astro.config.ts`              |
| `timezone`           | `Asia/Shanghai`   | منطقة dayjs الزمنية، تؤثر على عرض تاريخ المقال                                               |
| `dir`                | `ltr`             | اتجاه النص                                                                                   |
| `googleVerification` | —                 | قيمة التحقق من Google؛ يمكن حقنها أيضًا عبر المتغير البيئي `PUBLIC_GOOGLE_SITE_VERIFICATION` |

## posts

```ts
posts: {
  perPage: 8,              // عدد المقالات في كل صفحة قائمة
  perIndex: 5,             // عدد المقالات المعروضة في الصفحة الرئيسية
  scheduledPostMargin: 900000, // تفاوت النشر المجدول (مللي ثانية)، 15 دقيقة
}
```

- `perPage`: حجم الصفحة لـ `/posts/[...page]` و `/tags/[tag]/[...page]`
- `perIndex`: عدد المقالات المعروضة في قسم "الأحدث" في الصفحة الرئيسية
- `scheduledPostMargin`: المقالات المستقبلية ضمن هذه النافذة تُعتبر منشورة (سارية في الإنتاج؛ التطوير يعرض الكل)

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

| الحقل              | القيمة الافتراضية  | الملاحظات                                                                |
| ------------------ | ------------------ | ------------------------------------------------------------------------ |
| `lightAndDarkMode` | `true`             | تمكين تبديل الوضع الفاتح/الداكن                                          |
| `dynamicOgImage`   | `true`             | إنشاء صور OG ديناميكيًا (satori + sharp)                                 |
| `showArchives`     | `true`             | إظهار صفحة الأرشيف (يصفّي sitemap وفقًا لذلك عند الإيقاف)                |
| `showCategories`   | `true`             | إظهار صفحة التصنيفات ومدخل التنقل (يصفّي sitemap وفقًا لذلك عند الإيقاف) |
| `showBackButton`   | `true`             | إظهار زر الرجوع في صفحات المقالات                                        |
| `editPost.enabled` | `false`            | إظهار رابط "تعديل هذه الصفحة"                                            |
| `editPost.url`     | `""`               | بادئة رابط التعديل؛ يُلحق مسار المصدر النسبي للمقال                      |
| `search`           | `"pagefind"`       | حل البحث: `"pagefind"` أو `false`                                        |
| `mdx`              | `true`             | تمكين تحليل وعرض MDX (انظر [إنشاء المحتوى](./content.md))                |
| `comments`         | `{provider:false}` | تكوين نظام التعليقات (انظر [نظام التعليقات](./comments.md))              |
| `players.aplayer`  | `false`            | تمكين مشغل APlayer الصوتي (انظر [مشغلات الوسائط](./media-players.md))    |
| `players.dplayer`  | `false`            | تمكين مشغل DPlayer الفيديو                                               |

### editPost

`editPost.url` هي بادئة رابط تعديل المستودع؛ يضيف Xingluo مسار المصدر النسبي للمقال (`src/content/posts/...`). على سبيل المثال:

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

ينتج المقال `src/content/posts/welcome.md` الرابط `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: اسم الأيقونة، يقابل `src/assets/icons/socials/{name}.astro`. المضمنة: `github`، `x`، `mail`، `facebook`، `telegram`، `weibo`
- `url`: رابط الرابط؛ `mailto:` للبريد الإلكتروني
- `linkTitle`: عنوان اختياري للوصول؛ يُنشأ تلقائياً من الاسم عند الحذف

> إضافة منصة تواصل: أنشئ مكون أيقونة `.astro` بنفس الاسم تحت `src/assets/icons/socials/`. يقوم `src/lib/socialIcons.ts` بجمعها تلقائياً عبر `import.meta.glob`.

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

تظهر إدخالات المشاركة هذه في أسفل صفحات المقالات. `url` هو بادئة رابط المشاركة؛ يضيف Xingluo الرابط المطلق للمقال الحالي. `name` يتم تعيينه أيضاً لأيقونة ضمن `src/assets/icons/socials/`.

## Environment Variables المتغيرات البيئية

مُعلن عبر `env.schema` في `astro.config.ts`.

| المتغير                           | مستوى الوصول    | الوصف                                          |
| --------------------------------- | --------------- | ---------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | قيمة التحقق من Google Search Console، اختيارية |

مثال (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

يتم حقن القيمة في `config.site.googleVerification` وعرضها كـ `<meta name="google-site-verification">`.

## مثال كامل

انظر [`xingluo.config.ts`](../xingluo.config.ts). أقسام `features.comments` و `features.players` تتضمن أمثلة مع التعليقات لـ giscus / twikoo / waline؛ قم بإلغاء التعليق وملء القيم الحقيقية لتفعيلها.
