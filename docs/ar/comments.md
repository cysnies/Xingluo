# نظام التعليقات

يدمج Xingluo ثلاثة أنظمة تعليقات — giscus و twikoo و waline — قابلة للتحديد عبر `features.comments`.

## التهيئة

اختر مزودًا وقدّم إعداداته في `features.comments` في [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* giscus config */ },
    // twikoo: { /* twikoo config */ },
    // waline: { /* waline config */ },
  },
}
```

مع `provider: false` (الافتراضي)، يتم إيقاف التعليقات ولا تُصدر صفحات المقالات علامات أو نصوص التعليقات.

## موقع قسم التعليقات

يظهر قسم التعليقات فقط في أسفل **صفحات تفاصيل المقالات** (بعد التنقل السابق/التالي)، ويتم عرضه بواسطة [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro).

## giscus

نظام تعليقات مبني على مناقشات GitHub؛ يجب أن يكون المستودع عامًا مع تمكين المناقشات.

### التهيئة

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // مستودع GitHub
    repoId: "R_...",              // معرف المستودع (تم إنشاؤه بواسطة giscus.app)
    category: "Announcements",    // اسم فئة المناقشة
    categoryId: "DIC_...",        // معرف الفئة (تم إنشاؤه بواسطة giscus.app)
    mapping: "pathname",          // اختياري، تعيين الصفحة إلى المناقشة
    strict: false,                // اختياري، مطابقة عنوان صارمة
    reactionsEnabled: true,       // اختياري، ردود الفعل
    inputPosition: "bottom",      // اختياري، موضع مربع التعليق: top | bottom
    loading: "lazy",              // اختياري، التحميل: lazy | eager
  },
}
```

### الحصول على repoId / categoryId

1. قم بزيارة [giscus.app](https://giscus.app)
2. أدخل المستودع والتصنيف لإنشاء التهيئة
3. انسخ `data-repo-id` و `data-category-id` في تهيئتك

### آلية العمل

يحقن giscus iframe عبر `client.js` الرسمي، مع سمات `data-*` التي تحمل التهيئة. تُعيّن اللغة تلقائيًا إلى اللغة الحالية (`zh-cn` → `zh-CN`، `en` → `en`). تتم مزامنة السمة عند التبديل عبر `postMessage`.

## twikoo

نظام تعليقات بدون اعتماد على خادم خلفي، يدعم Tencent CloudBase أو الاستضافة الذاتية.

### التهيئة

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // معرف البيئة السحابية أو رابط الاستضافة الذاتية الكامل
    lang: "zh-CN",                            // اختياري، اللغة
  },
}
```

### ملاحظات envId

- Tencent CloudBase: املأ معرف البيئة (يتطلب cloudbase SDK)
- الاستضافة الذاتية: املأ الرابط الكامل (مثل `https://twikoo.example.com`)؛ يكتشف twikoo تلقائيًا وضع HTTP API

### آلية العمل

يقوم twikoo باستيراد `import("twikoo")` ديناميكيًا واستدعاء `init` عندما يدخل حاوية التعليقات منفذ العرض. لا يدعم twikoo تبديل السمة في وقت التشغيل؛ يعيد الموقع بنائه عند تغيير السمة لتطبيق الأنماط الداكنة.

## waline

نظام تعليقات مع خادم خلفي يدعم عدد التعليقات وعدد المشاهدات.

### التهيئة

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // عنوان خادم Waline
    lang: "zh-CN",                           // اختياري، اللغة
    pageSize: 10,                            // اختياري، حجم صفحة التعليقات
    dark: "html.dark",                       // اختياري، محدد الوضع الداكن (الافتراضي يتبع .dark للموقع)
  },
}
```

### نشر serverURL

راجع [وثائق Waline](https://waline.js.org/) لنشر الخادم (Vercel / Cloudflare / الاستضافة الذاتية كلها تعمل)، ثم ضع العنوان في `serverURL`.

### آلية العمل

يقوم waline باستيراد `import("@waline/client")` والنمط `@waline/client/style` ديناميكيًا عندما يدخل حاوية التعليقات منفذ العرض، ثم يستدعي `init`. محدد `dark:"html.dark"` يتبع تلقائيًا الوضع الداكن للموقع؛ لا حاجة لمزامنة يدوية.

## التحميل البطيء

جميع أنظمة التعليقات يتم تحميلها بتكاسل عبر IntersectionObserver: تحدث الطلبات والتهيئة فقط عندما يكون حاوية التعليقات ضمن 200 بكسل من منفذ العرض، مما يتجنب تكلفة أداء الطلاء الأول.

انظر [`src/scripts/comments.ts`](../src/scripts/comments.ts).

## مزامنة السمة

عندما تتغير سمة الموقع، تتم مزامنة سمة نظام التعليقات تلقائيًا:

| نظام التعليقات | طريقة المزامنة                                         |
| -------------- | ------------------------------------------------------ |
| giscus         | `postMessage({giscus:{setConfig:{theme}}})` إلى iframe |
| waline         | محدد CSS `dark:"html.dark"` يتبع تلقائيًا              |
| twikoo         | يراقب تغييرات فئة `.dark` ويعيد بناء المثيل            |

تستخدم مراقبة السمة `MutationObserver` على سمتي `class` و `data-theme` للعنصر `document.documentElement`.

## التكيف مع View Transitions

يستمع سكريبت التعليقات إلى `astro:page-load` ويعيد مسح نقاط التحميل بعد كل تحميل صفحة. يتم منع إعادة التهيئة عبر علامات `dataset` (`xng-setup`، `xng-init`).

## التدويل

عنوان قسم التعليقات مترجم عبر `UIStrings.comments.title`. لغة واجهة نظام التعليقات يتم التحكم فيها بواسطة حقل `lang` لكل مزود.

## التوسعات المخصصة

### تبديل المزودين

غيّر `features.comments.provider` في `xingluo.config.ts`؛ لا حاجة لتغييرات في الكود. يقوم Xingluo بعرض المكون الفرعي المقابل تلقائيًا.

### إضافة نظام تعليقات

1. أنشئ مكونًا جديدًا تحت `src/components/comments/` (مثل `Disqus.astro`) يعرض عنصرًا نائبًا للتركيب
2. أضف فرع مزود جديد في العرض الشرطي لـ `Comments.astro`
3. أضف منطق التهيئة في `src/scripts/comments.ts`
4. وسّع `CommentProvider` وأنواع التهيئة في `src/types/config.ts`
