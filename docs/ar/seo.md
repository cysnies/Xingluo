# تحسين محركات البحث

يأتي Xingluo مع دعم SEO كامل: Open Graph وبطاقة Twitter و canonical وبيانات JSON-LD المنظمة وصور OG الديناميكية و RSS وخريطة الموقع وإعلانات hreflang متعددة اللغات.

## مخرجات head

يقوم `<head>` في [`src/layouts/Layout.astro`](../src/layouts/Layout.astro) بإخراج:

- `charset`، `viewport`
- `favicon` (`public/favicon.svg`)
- `canonical` (رابط أساسي)
- `title`، `meta title`، `meta description`، `meta author`
- رابط `sitemap`
- **Open Graph**: `og:type`، `og:site_name`، `og:title`، `og:description`، `og:url`، `og:image`
- **Twitter Card**: `twitter:card`، `twitter:title`، `twitter:description`، `twitter:image`
- **RSS** رابط بديل
- **hreflang** روابط بديلة (لكل لغة + x-default)
- `theme-color` (يُملأ في وقت التشغيل بواسطة `theme.ts`)
- `google-site-verification` (شرطي)

## meta صفحة المقال

[`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) يحقن بيانات وصفية خاصة بالمقال عبر `<Fragment slot="head">`:

- `og:type = article`
- `article:published_time` (ISO 8601)
- `article:modified_time` (إذا تم تعيين `modDatetime`)
- **بيانات JSON-LD `BlogPosting` المنظمة**:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "عنوان المقال",
  "image": "رابط صورة OG",
  "datePublished": "2026-06-19T10:00:00.000Z",
  "dateModified": "2026-06-20T10:00:00.000Z",
  "author": [
    {
      "@type": "Person",
      "name": "اسم المؤلف",
      "url": "الصفحة الرئيسية للمؤلف"
    }
  ]
}
```

## تسوية canonical

استراتيجية الرابط الأساسي في صفحات تفاصيل المقالات (`PostDetailView.astro`):

1. `canonicalURL` مخصص في frontmatter → يُستخدم أولاً
2. المقال الحالي هو **ترجمة حقيقية** لهذه اللغة (`locale` يطابق لغة الصفحة) → يشير إلى عنوان URL الخاص به
3. المقال الحالي هو **محتوى احتياطي** (لا توجد ترجمة متاحة، باستخدام الأصل) → يشير إلى عنوان URL الأصلي للغة الافتراضية

تضمن الاستراتيجية 3 أن محركات البحث لا تتعامل مع الصفحات التي ليس لها ترجمات مستقلة كمحتوى مكرر. المقالات ذات الترجمات المستقلة لها canonical يشير إلى نفسها ويمكن فهرستها بشكل منفصل.

## البيانات المنظمة BreadcrumbList

جميع الصفحات التي تحتوي على فتات الخبز (قائمة المقالات، فهرس الوسوم، قائمة مقالات الوسم، الأرشيف، حول، البحث) تُخرج تلقائياً بيانات JSON-LD المنظمة `BreadcrumbList`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "الرئيسية",
      "item": "https://..."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "المقالات",
      "item": "https://.../posts/"
    }
  ]
}
```

عندما لا يحتوي العنصر الأخير من فتات الخبز على رابط (الصفحة الحالية)، يتم استخدام رابط الصفحة الحالية كـ `item`. صفحات تفاصيل المقالات لا تستخدم مكون فتات الخبز وبالتالي لا تخرج هذه البيانات المنظمة.

## صور Open Graph

### التوليد الديناميكي

مع تمكين `features.dynamicOgImage` (افتراضي)، يُنشئ Xingluo ديناميكياً صور OG بحجم 1200×630 باستخدام satori + sharp:

- **على مستوى الموقع**: [`src/pages/og.png.ts`](../src/pages/og.png.ts)، للصفحات التي ليس لها صورة OG مخصصة
- **على مستوى المقال**: [`src/pages/posts/[...slug]/og.png.ts`](../src/pages/posts/[...slug]/og.png.ts)، يُنشأ فقط للمقالات التي ليس لها `ogImage`

### الخطوط

تستخدم صور OG خط Noto Sans SC (انظر تكوين `fonts` في `astro.config.ts`، متغير CSS `--font-og`)، محمل عبر `fontData` من `astro:assets`. الخط مخصص لـ satori فقط ولا يتم حقنه في CSS الموقع.

### البدائل

- الخط غير متاح (بدون شبكة) → يرجع إلى PNG نائب 1×1 (لا يسبب فشل البناء)
- `dynamicOgImage` معطل → يستخدم صورة OG الافتراضية الثابتة تحت `public/`

### حل صورة OG للمقال

البديل ذو الأربعة مستويات في `PostDetailView.astro`:

1. frontmatter `ogImage` هو نص → استخدام مباشر
2. frontmatter `ogImage` هو كائن `image()` → استخدام `.src`
3. `dynamicOgImage` مفعل → استخدام نقطة نهاية `og.png` على مستوى المقال
4. خلاف ذلك → صورة OG الافتراضية الثابتة للموقع

## RSS

[`src/pages/rss.xml.ts`](../src/pages/rss.xml.ts) يُنشئ موجز RSS:

- العنوان والوصف وعنوان URL للموقع من تكوين `site`
- العناصر من `getSortedPosts` (المسودات والمقالات المجدولة تمت تصفيتها بالفعل)
- `link` لكل عنصر هو `getPostUrl(id, filePath, config.site.lang)`
- `pubDate` هو `modDatetime ?? pubDatetime`

`Layout.astro` يحقن رابط الاكتشاف التلقائي لـ RSS:

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="..."
  href=".../rss.xml"
/>
```

## خريطة الموقع

تكامل `@astrojs/sitemap` (انظر `astro.config.ts`):

- `filter`: يصفي مسارات صفحة الأرشيف بناءً على `features.showArchives`
- `i18n`: يُمكن التوليد التلقائي لـ hreflang، مع تعيين `zh-cn → zh-CN`، `en → en`، مع defaultLocale `zh-cn`

يُولد `sitemap-index.xml` وإعلانات بديلة لكل لغة؛ يشير `robots.txt` إلى خريطة الموقع.

## إعلانات hreflang متعددة اللغات

`Layout.astro` يُخرج `<link rel="alternate">` لكل لغة:

```html
<link rel="alternate" hreflang="zh-CN" href="https://.../posts/welcome/" />
<link rel="alternate" hreflang="en" href="https://.../en/posts/welcome/" />
<link rel="alternate" hreflang="x-default" href="https://.../posts/welcome/" />
```

يتم تسوية المسارات عبر `parseLocaleFromPath(stripBase(...))` بعد إزالة البادئات، مما يضمن أن كل لغة تتوافق مع الرابط الصحيح. `x-default` يشير إلى اللغة الافتراضية.

## robots.txt

[`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts) يُولد:

```
User-agent: *
Allow: /

Sitemap: https://site-url/sitemap-index.xml
```

## التحقق من الموقع

يتم تكوين التحقق من Google Search Console عبر `site.googleVerification` بطريقتين:

1. متغير البيئة `PUBLIC_GOOGLE_SITE_VERIFICATION` (حقن وقت التشغيل)
2. حقل `site.googleVerification` في `xingluo.config.ts`

يتم عرضه كـ `<meta name="google-site-verification" content="...">`.
