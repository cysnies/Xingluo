# السمة والأنماط

يستخدم Xingluo مكونات نمط shadcn/ui new-york ومساحة الألوان OKLCH، المبني على Tailwind CSS v4.

## هيكل ملفات الأنماط

[`src/styles/`](../src/styles/):

| الملف            | المحتوى                                                         |
| ---------------- | --------------------------------------------------------------- |
| `theme.css`      | متغيرات سمة shadcn (OKLCH، فاتح `:root` + داكن `.dark`)         |
| `global.css`     | مدخل Tailwind، الطبقة الأساسية، الأدوات المخصصة، سمات التنبيهات |
| `typography.css` | طباعة `.app-prose` وأنماط كتل الكود                             |

## متغيرات السمة

يستخدم `theme.css` مساحة الألوان OKLCH لتعريف متغيرات دلالية، مع مجموعات فاتحة وداكنة:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  /* ... secondary, muted, accent, destructive, border, input, ring ... */
  --code: oklch(0.97 0 0);
  --content-width: 72rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... القيم المظلمة المقابلة ... */
}
```

هذه المتغيرات تُربط برموز Tailwind في `@theme inline` في `global.css`، لذا يمكنك استخدام الفئات مثل `bg-background`، `text-foreground`، `border-border` مباشرة.

## Tailwind CSS v4

يستخدم Xingluo Tailwind v4، المدمج عبر إضافة `@tailwindcss/vite` (انظر `vite.plugins` في `astro.config.ts`).

### التكوين الرئيسي (`global.css`)

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... تعيينات الألوان ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### الأدوات المخصصة

- `max-w-app`: أقصى عرض للمحتوى (`--content-width: 72rem`)
- `app-layout`: تخطيط التطبيق (min-height 100vh، flex column)

## الوضع الداكن

### حماية FOUC

`Layout.astro` يضمّن برنامجًا نصيًا متزامنًا في `<head>` (`is:inline`) يضبط السمة قبل الرسم الأول:

```js
// قراءة localStorage.theme، أو الرجوع إلى prefers-color-scheme
// تعيين سمة data-theme في html وفئة .dark
```

هذا يتجنب وميض السمة عند التحديث.

### تشغيل تبديل السمة

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme`: localStorage أولاً، يرجع إلى تفضيل النظام
- `persist`: يحفظ في localStorage
- `reflect`: يزامن سمة `data-theme`، فئة `.dark`، `#theme-btn` `aria-label`، `<meta name="theme-color">`
- يربط زر `#theme-btn` بالتبديل
- يتكيف مع View Transitions: إعادة الربط على `astro:after-swap`، حمل theme-color على `astro:before-swap`
- يستمع لتغييرات نظام `prefers-color-scheme` (يتبع فقط عندما لم يختر المستخدم صراحة)

### مزامنة سمة التعليقات والمشغلات

- giscus: يُبدل عبر `postMessage({giscus:{setConfig:{theme}}})`
- waline: محدد `dark:"html.dark"` يتبع تلقائياً
- twikoo: يراقب تغييرات فئة `.dark` ويعيد البناء (twikoo لا يدعم التبديل في وقت التشغيل)
- انظر [نظام التعليقات](./comments.md)

## الطباعة (.app-prose)

`.app-prose` في `typography.css` يبني على `prose` من `@tailwindcss/typography` مع تجاوزات السمة:

- لون الرابط الأساسي (`--primary`)
- خلفية الكود المضمن (`--code`)
- سمة مزدوجة لكتل الكود (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- أنماط خطوط الفرق/التظليل/الكلمات
- أنماط blockquote، hr، img
- أنماط طي details / summary
- مؤشر lightbox للصورة `role="button"`
- `scroll-margin` لمرساة العنوان

حاويات نص المقالات تستخدم `<article class="app-prose">`.

## مكونات shadcn

[`src/components/ui/`](../src/components/ui/) يوفر مكونات بنمط shadcn:

| المكون                                                                                 | الملاحظات                                                          |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `Button`                                                                               | يتحول تلقائيًا بين `<a>` / `<button>`، متغيرات cva (variant، size) |
| `Badge`                                                                                | شارة                                                               |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | عائلة البطاقة                                                      |
| `Input`                                                                                | حقل إدخال                                                          |
| `Separator`                                                                            | فاصل                                                               |

تكوينات المتغيرات تستخدم `class-variance-authority`؛ يتم دمج أسماء الفئات باستخدام `cn` (`src/lib/utils.ts`، استناداً إلى `tailwind-merge` + `clsx`).

## نظام الأيقونات

أيقونات Xingluo هي SVGs مضمنة في وقت البناء عبر astro-icon + Font Awesome (وضع sprite `<symbol>`)، **بدون JS في وقت التشغيل، بدون طلبات شبكة للخطوط**.

### تعيين الأيقونات (FA5)

| الاستخدام  | اسم الأيقونة                                 |
| ---------- | -------------------------------------------- |
| البحث      | `fa-solid:search`                            |
| إغلاق      | `fa-solid:times`                             |
| البريد     | `fa-solid:envelope`                          |
| تواصل أخرى | `fa-brands:{name}`                           |
| X (تواصل)  | `fa-brands:twitter` (FA5 ليس لديه x-twitter) |

### الحل الديناميكي لأيقونات التواصل الاجتماعي

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) يجمع `src/assets/icons/socials/*.astro` حسب اسم الملف عبر `import.meta.glob`؛ `getSocialIcon(name)` يحل بالاسم. إضافة منصة تواصل بسيطة مثل إضافة ملف أيقونة تحت `socials/`.

## تخصيص السمة

قم بتحرير متغيرات CSS في `src/styles/theme.css` لضبط ألوان الموقع. على سبيل المثال، للتبديل إلى اللون الأزرق الأساسي:

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

جميع المكونات التي تشير إلى `bg-primary` / `text-primary` تتبع تلقائياً.
