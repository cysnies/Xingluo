# نظرة عامة على الهندسة

يصف هذا المستند البنية العامة لـ Xingluo، وتخطيط الدليل، وتدفق التكوين، وتدفق العرض، وخط أنابيب البناء، لمساعدتك على فهم تنظيم الكود وكيفية توسيعه.

## هيكل الدليل

```
xingluo/
├── astro.config.ts          # تكوين Astro (التكاملات، i18n، markdown، الخطوط، البيئة)
├── xingluo.config.ts        # مدخل تكوين المستخدم
├── tsconfig.json            # تكوين TypeScript (صارم + اسم مسار @/*)
├── package.json             # التبعيات والبرامج النصية
├── public/                  # الأصول الثابتة (favicon.svg، صورة OG الافتراضية، إلخ.)
├── docs/                    # وثائق المشروع (هذا الدليل)
├── references/              # مصادر المشاريع المرجعية للقراءة فقط (لا يجب الاعتماد عليها)
└── src/
    ├── config.ts            # دمج الإعدادات الافتراضية، تصدير التكوين المحلول
    ├── content.config.ts    # مخططات مجموعات المحتوى (المقالات، الصفحات)
    ├── env.d.ts             # إعلانات أنواع الوحدات الخارجية والمتغيرات البيئية
    ├── assets/              # مكونات الأيقونات
    │   └── icons/           # astro-icon + Font Awesome (يشمل socials/)
    ├── components/          # مكونات واجهة المستخدم
    │   ├── ui/              # مكونات نمط shadcn (Button، Card، Badge، إلخ.)
    │   ├── post/            # مكونات صفحة المقال (التنقل السابق/التالي، الرجوع، المشاركة، إلخ.)
    │   ├── comments/        # مكونات نظام التعليقات
    │   ├── mdx/             # مكونات MDX المخصصة (APlayer، DPlayer)
    │   ├── pageViews/       # طرق عرض الصفحات (منطق عرض الصفحات المركزية)
    │   └── *.astro          # مكونات المستوى الجذري (Header، Footer، PostCard، إلخ.)
    ├── content/             # ملفات المحتوى
    │   ├── posts/           # مقالات المدونة
    │   └── pages/           # الصفحات الثابتة
    ├── i18n/                # التدويل
    │   ├── index.ts         # تحميل اللغة واستخدام useTranslations
    │   ├── types.ts         # نوع UIStrings الكامل
    │   ├── routing.ts       # حل مسار اللغة
    │   ├── staticPaths.ts   # getStaticPaths للغات غير الافتراضية
    │   ├── format.ts        # استبدال سلاسل القوالب
    │   └── lang/            # ملفات موارد اللغة (zh-cn.ts، en.ts)
    ├── layouts/             # التخطيطات
    │   ├── Layout.astro     # الهيكل الأساسي (head، SEO، FOUC)
    │   └── PostLayout.astro # تخطيط المقال (JSON-LD، بيانات المقال)
    ├── lib/                 # الأدوات الأساسية
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # مثيل dayjs وإضافة المنطقة الزمنية
    │   └── socialIcons.ts   # الحل الديناميكي لأيقونات التواصل الاجتماعي
    ├── pages/               # المسارات (الجذر + مرآة [locale]/)
    ├── scripts/             # البرامج النصية من جانب العميل
    │   ├── theme.ts         # تبديل السمة
    │   ├── postEnhancements.ts # تحسينات المقال (المراسي، النسخ، الضوء، التقدم)
    │   ├── comments.ts      # التحميل البطيء للتعليقات ومزامنة السمة
    │   └── players.ts       # التحميل البطيء للمشغلات
    ├── styles/              # الأنماط
    │   ├── global.css       # مدخل Tailwind + الطبقة الأساسية + الأدوات المخصصة
    │   ├── theme.css        # متغيرات سمة shadcn (OKLCH)
    │   └── typography.css   # أنماط الطباعة .app-prose وأنماط كتل الكود
    ├── types/               # إعلانات الأنواع
    │   ├── config.ts        # أنواع التكوين
    │   └── *.d.ts           # إعلانات للوحدات الخارجية غير المنمطة
    └── utils/               # وظائف الأداة
        ├── getPostPaths.ts  # اشتقاق رابط المقال
        ├── getSortedPosts.ts# ترتيب المقالات
        ├── postFilter.ts    # تصفية المسودات والمقالات المجدولة
        ├── getUniqueTags.ts # إزالة تكرار الوسوم
        ├── remarkPlayers.ts # إضافة remark للمشغلات
        ├── rehypeWrapTable.ts# غلاف تمرير الجدول
        └── ...              # أدوات أخرى
```

## تدفق التكوين

```
xingluo.config.ts
   │ defineXingluoConfig (قيود النوع، تمرير)
   ▼
src/config.ts
   │ resolveConfig (دمج الافتراضيات + resolveComments + resolvePlayers)
   ▼
src/types/config.ts
   │ XingluoConfig (نوع كامل)
   ▼
يُشار إليه في جميع أنحاء الموقع عبر import config from "@/config"
```

النقاط الرئيسية:

- `xingluo.config.ts` هو ملف التكوين الوحيد الذي يحتاج المستخدمون إلى تحريره
- تقوم `resolveConfig` في `src/config.ts` بدمج سطحي (`site`/`posts`) ودمج عميق (`features.editPost`، `features.comments`، `features.players`)
- يقرأ `astro.config.ts` ملف `./xingluo.config` غير المحلول (لأن تحميل التكاملات يُقرر في طبقة تكوين Astro)، لذلك يصل إلى `features` باستخدام optional chaining
- يقرأ `src/content.config.ts` المسار المحلول `@/config`، لذلك `features` مطلوب

## تدفق العرض

### عرض الصفحة

يستخدم Xingluo نمط "غلاف صفحة رقيق + مكون عرض"، مع تركيز منطق العرض في `src/components/pageViews/`:

```
src/pages/posts/[...slug]/index.astro   ← غلاف رقيق: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← منطق العرض
    │
    ▼
src/layouts/PostLayout.astro  ← تخطيط المقال (JSON-LD، بيانات المقال)
    │
    ▼
src/layouts/Layout.astro      ← الهيكل الأساسي (head، SEO، FOUC، ClientRouter)
```

صفحة الغلاف الرقيق تتعامل فقط مع `getStaticPaths` وتمرير الخصائص؛ مكون العرض يحتوي على كل منطق العرض. صفحات المرآة `[locale]/` هي أيضًا أغلفة رقيقة، تُنشئ فقط اللغات غير الافتراضية عبر `getLocaleParams()`.

### التوجيه

```
src/pages/
├── 404.astro                      # 404 (غير معكوس)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # نقطة نهاية صورة OG على مستوى الموقع
├── rss.xml.ts                     # نقطة نهاية RSS
├── robots.txt.ts                  # نقطة نهاية robots.txt
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # نقطة نهاية صورة OG على مستوى المقال
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # مرآة اللغات غير الافتراضية (getStaticPaths=getLocaleParams)
    └── (الهيكل يعكس الجذر، باستثناء 404، og.png، rss، robots)
```

### اشتقاق رابط المقال

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: يستخرج slug التوجيه من `id` مجموعة المحتوى ومسار الملف، مع تصفية الدلائل التي تبدأ بـ `_`
- `getPostUrl(id, filePath, locale)`: يُنشئ عنوان URL قابل للتصفح مع بادئة اللغة (اللغة الافتراضية ليس لها بادئة)

### تصفية وترتيب المقالات

- [`postFilter.ts`](../src/utils/postFilter.ts): يستبعد المسودات؛ يصفي المقالات المستقبلية في الإنتاج باستخدام `pubDatetime - scheduledPostMargin`؛ في التطوير يعرض الكل
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): بعد التصفية، يرتب تنازليًا حسب `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): يزيل تكرار الوسوم ويرتبها حسب slug

## البرامج النصية من جانب العميل

يتم تحميل تفاعلات جانب العميل في Xingluo عبر علامات `<script>` في أسفل الصفحات، وكلها مُكيَّفة لـ View Transitions:

| البرنامج النصي        | موقع التحميل                                      | تكيف الحدث                                                                                                | المسؤوليات                                                 |
| --------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `theme.ts`            | نهاية جسم `Layout.astro`                          | إعادة الربط على `astro:after-swap`، حمل theme-color على `astro:before-swap`، تغيير `prefers-color-scheme` | استمرار السمة والتبديل                                     |
| `postEnhancements.ts` | `PostDetailView.astro`                            | إعادة التهيئة على `astro:page-load`                                                                       | مراسي العناوين، نسخ الكود، تقدم القراءة، صندوق الضوء للصور |
| `comments.ts`         | `Comments.astro`                                  | إعادة المسح على `astro:page-load`                                                                         | تحميل التعليقات البطيء ومزامنة السمة                       |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (شرطي) | إعادة المسح على `astro:page-load`                                                                         | تحميل المشغلات البطيء                                      |

> ملاحظة: `comments.ts` و `players.ts` ليس لديهما import/export على المستوى العلوي؛ أضف `export {}` في نهاية الملف لتعليمهما كوحدات وتجنب تعارضات الإعلان العالمية مع الملفات الأخرى.

## خط أنابيب البناء

`pnpm run build` = `astro check && astro build && pagefind --site dist`

1. **`astro check`**: فحص أنواع TypeScript + قوالب Astro
2. **`astro build`**:
   - جمع مجموعات المحتوى (تضمين `.mdx` بناءً على `features.mdx`)
   - إنشاء جميع الصفحات بشكل ثابت (بما في ذلك مرايا `[locale]/`)
   - إنشاء نقاط النهاية: RSS، sitemap، robots.txt، صور OG على مستوى الموقع والمقال
   - تحميل تكامل `mdx()` بشكل شرطي؛ حقن `remarkPlayers` بشكل شرطي
   - تضمين أيقونات SVG في وقت البناء (astro-icon، بدون JS في وقت التشغيل)
   - وحدات التعليقات والمشغلات المستوردة ديناميكيًا تُقسَّم إلى أجزاء مستقلة (تحميل بطيء)
3. **`pagefind --site dist`**: يمسح محتوى `dist/` المعلّم بـ `data-pagefind-body`، لإنشاء فهارس بحث لكل لغة في `dist/pagefind/`

## استراتيجيات الأداء

- **أيقونات بدون JS في وقت التشغيل**: astro-icon يضمّن Font Awesome SVGs في وقت البناء (وضع sprite `<symbol>`)
- **تحسين SVG**: `experimental.svgOptimizer` (svgo) يضغط SVGs المضمنة والمرجعية
- **تحميل بطيء حسب الطلب**: التعليقات والمشغلات تستورد ديناميكيًا عبر IntersectionObserver عند التمرير إلى العرض؛ بدون حزمة عند التعطيل
- **تكاملات شرطية**: مع إيقاف MDX، لا يتم تحميل تكامل `mdx()`؛ مع إيقاف المشغلات، لا يتم حقن إضافة remark
- **حجم CSS**: Tailwind v4 يُنشئ حسب الطلب؛ متغيرات OKLCH تُدار مركزيًا
- **خطوط صورة OG**: تُستخدم فقط بواسطة satori، لا تُحقن في CSS الموقع
- **View Transitions**: `<ClientRouter/>` يُشغّل رسوم انتقال الصفحة؛ مربع البحث يستخدم `transition:persist` للحفاظ على الحالة

## دليل التوسعة

### إضافة صفحة

1. أنشئ ملف `.astro` في `src/pages/` (غلاف رقيق)
2. أنشئ مكون العرض المقابل في `src/components/pageViews/`
3. للدعم متعدد اللغات، أنشئ غلافًا رقيقًا مرآة بنفس الاسم في `src/pages/[locale]/`

### إضافة مكون واجهة مستخدم

اتبع نمط shadcn: أنشئ مكونات `.astro` وتكوينات المتغيرات `.ts` تحت `src/components/ui/` (باستخدام `class-variance-authority`).

### إضافة برنامج نصي من جانب العميل

أنشئ ملف `.ts` في `src/scripts/`، أضف `export {}` في نهاية الملف لتعليمه كوحدة، استمع لحدث `astro:page-load` للتكيف مع View Transitions، واستورده في علامة `<script>` في الصفحة المعنية.
