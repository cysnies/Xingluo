# النشر

Xingluo هو موقع ثابت بحت؛ `pnpm build` يولد دليل `dist/`، يمكن استضافته على أي خدمة استضافة ثابتة.

## مخرجات البناء

```bash
pnpm build
```

يحتوي `dist/` المُنشأ على:

- جميع صفحات HTML الثابتة (بما في ذلك مرايا `[locale]/`)
- أصول JS / CSS / الخطوط تحت `_astro/`
- فهرس البحث `search/`
- `og.png` على مستوى الموقع و `og.png` لكل مقال
- `rss.xml`، `sitemap-index.xml`، `robots.txt`
- الأصول الثابتة تحت `public/` (favicon، صورة OG الافتراضية، إلخ.)

## المتغيرات البيئية

تُضبط في وقت البناء:

| المتغير                           | الوصف                                          |
| --------------------------------- | ---------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | قيمة التحقق من Google Search Console (اختياري) |

مثال PowerShell:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

في بيئات CI (مثل GitHub Actions)، قم بالحقن عبر `env` قبل خطوة البناء.

## قائمة التحقق قبل النشر

قبل النشر، تأكد من:

1. تعيين `site.url` في `xingluo.config.ts` إلى نطاق الإنتاج
2. تخصيص `site.title` و `site.description` و `site.author` إلخ.
3. إذا كانت نظام التعليقات مفعلاً، فتأكد من أن إعدادات المزود (giscus repoId، twikoo envId، waline serverURL) تحتوي على قيم حقيقية
4. استبدال `public/default-og.jpg` (أو `site.ogImage` المُعدّل) بصورة OG الافتراضية للموقع
5. استبدال `public/favicon.svg` بأيقونة الموقع

## منصات الاستضافة الثابتة

### Netlify / Vercel / Cloudflare Pages

| الإعداد      | القيمة       |
| ------------ | ------------ |
| أمر البناء   | `pnpm build` |
| دليل الإخراج | `dist`       |
| إصدار Node   | 22.12.0+     |
| مدير الحزم   | pnpm         |

ملف `vercel.json` اختياري لـ Vercel:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

انشر عبر GitHub Actions; مثال على سير العمل:

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

> إذا كان النشر في مسار فرعي (مثل `https://user.github.io/repo/`)، قم بتعيين `base: "/repo/"` في `astro.config.ts`.

### Nginx / الاستضافة الذاتية

قم برفع `dist/` إلى الخادم; مثال على إعداد Nginx:

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## ملاحظات الأداء

- الأصول تحت `_astro/` لها أسماء ملفات مشفرة ويمكن تخزينها مؤقتًا لفترة طويلة (`immutable`)
- لا ينبغي تخزين ملفات HTML مؤقتًا (أو فقط لفترة وجيزة) لضمان تحديث المحتوى في الوقت المناسب
- فهارس Flexsearch تُحمّل عند الطلب؛ لا حاجة لاستراتيجية تخزين مؤقت خاصة
- بعد النشر، تحقق من إمكانية الوصول إلى صور OG و RSS وخريطة الموقع

## الخوادم الخلفية لنظام التعليقات

إذا قمت بتفعيل نظام التعليقات، قم بنشر الخادم الخلفي المناسب:

| نظام التعليقات | متطلبات الخادم الخلفي                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| giscus         | لا شيء; استخدم الخدمة العامة giscus.app (أو استضافة ذاتية [giscus-vercel](https://github.com/giscus/giscus-vercel)) |
| twikoo         | انشر خادم twikoo (Vercel / CloudBase / استضافة ذاتية)                                                               |
| waline         | انشر خادم waline (Vercel / Cloudflare / استضافة ذاتية)                                                              |

راجع الوثائق الرسمية لكل نظام تعليق و [نظام التعليقات](./comments.md).
