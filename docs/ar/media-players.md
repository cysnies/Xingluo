# مشغلات الوسائط

يدمج Xingluo APlayer (صوت) و DPlayer (فيديو)، ويدعم طريقتين لإنشاء المشغلات في Markdown و MDX، جميعها محملة ببطء.

## التفعيل

قم بتبديل كل مشغل حسب الحاجة في `features.players` في [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // تفعيل مشغل الصوت APlayer
    dplayer: true,  // تفعيل مشغل الفيديو DPlayer
  },
}
```

الاثنان مستقلان. عند التعطيل:

- لا يتم حقن إضافة `remarkPlayers` (لا يتم تحليل حواجز MD)
- لا يتم تحميل سكريبت عميل المشغل
- لا يحتوي مخرجات البناء على أجزاء aplayer / dplayer

## وضعي الاستخدام

| الوضع    | ينطبق على             | الصيغة                                                |
| -------- | --------------------- | ----------------------------------------------------- |
| MD fence | `.md` و `.mdx` العادي | ` ```aplayer ` / ` ```dplayer ` + نص JSON للتكوين     |
| مكون MDX | `.mdx` فقط            | `import { APlayer, DPlayer } from "@/components/mdx"` |

كلا الوضعين ينتجان في النهاية نفس بنية div النائب (`<div class="xng-aplayer|xng-dplayer" data-config>`)، الذي يتم تحميله بتكاسل وإنشاء مثيل له بواسطة [`src/scripts/players.ts`](../src/scripts/players.ts).

## مشغل APlayer الصوتي

### سياج MD

````markdown
```aplayer
{
  "audio": [
    {
      "name": "Song",
      "artist": "Artist",
      "url": "/audio/song.mp3",
      "cover": "/images/cover.jpg",
      "lrc": "[00:00.00] First lyric line"
    }
  ],
  "theme": "#b7daff",
  "loop": "all",
  "autoplay": false
}
```
````

### مكون MDX

```mdx
import { APlayer } from "@/components/mdx";

<APlayer
  audio={[
    {
      name: "Song",
      artist: "Artist",
      url: "/audio/song.mp3",
      cover: "/images/cover.jpg",
    },
  ]}
  theme="#b7daff"
  loop="all"
/>
```

### الخيارات

| الحقل           | النوع                          | الافتراضي | ملاحظات                                |
| --------------- | ------------------------------ | --------- | -------------------------------------- |
| `audio`         | Audio \| Audio[]               | مطلوب     | كائن أو قائمة صوتية                    |
| `theme`         | string                         | `#b7daff` | لون سمة المشغل                         |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`     | وضع التكرار                            |
| `order`         | `"list"` \| `"random"`         | `list`    | ترتيب التشغيل                          |
| `volume`        | number                         | `0.7`     | مستوى الصوت الأولي (0–1)               |
| `autoplay`      | boolean                        | `false`   | التشغيل التلقائي (يخضع لسياسة المتصفح) |
| `listFolded`    | boolean                        | `false`   | قائمة مطوية                            |
| `listMaxHeight` | string                         | —         | أقصى ارتفاع للقائمة (قيمة CSS)         |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`       | نوع الكلمات: 0 لا شيء / 1 نص / 2 URL   |

### كائن الصوت (audio)

| الحقل    | ملاحظات                                                |
| -------- | ------------------------------------------------------ |
| `name`   | اسم المقطع (الرجوع إلى `title`، ثم إلى `'Audio name'`) |
| `artist` | الفنان (الرجوع إلى `author`)                           |
| `url`    | رابط الصوت (مطلوب)                                     |
| `cover`  | الغلاف (الرجوع إلى `pic`)                              |
| `lrc`    | الكلمات (نص أو رابط، مقترن بـ `lrcType`)               |
| `theme`  | لون السمة لكل مقطع                                     |
| `type`   | نوع الصوت: `auto` \| `hls` \| `normal`                 |

## مشغل DPlayer الفيديو

### سياج MD

````markdown
```dplayer
{
  "video": {
    "url": "/videos/demo.mp4",
    "pic": "/images/video-cover.jpg",
    "type": "auto"
  },
  "theme": "#b7daff",
  "autoplay": false,
  "loop": false
}
```
````

### مكون MDX

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### الخيارات

| الحقل           | النوع                                | الافتراضي | ملاحظات                             |
| --------------- | ------------------------------------ | --------- | ----------------------------------- |
| `video`         | Video                                | مطلوب     | إعدادات الفيديو                     |
| `theme`         | string                               | `#b7daff` | لون السمة                           |
| `autoplay`      | boolean                              | `false`   | التشغيل التلقائي                    |
| `loop`          | boolean                              | `false`   | تشغيل حلقي                          |
| `screenshot`    | boolean                              | `false`   | ميزة لقطة الشاشة                    |
| `hotkey`        | boolean                              | `true`    | مفاتيح الاختصار                     |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`    | التحميل المسبق                      |
| `volume`        | number                               | `0.7`     | مستوى الصوت الأولي                  |
| `playbackSpeed` | number[]                             | —         | قائمة سرعات التشغيل                 |
| `subtitle`      | Subtitle                             | —         | الترجمة                             |
| `danmaku`       | Danmaku                              | —         | دانماكو (تعليقات الرصاص)            |
| `live`          | boolean                              | `false`   | وضع البث المباشر                    |
| `mutex`         | boolean                              | `true`    | استبعاد متبادل (مشغل واحد لكل صفحة) |

### كائن الفيديو (video)

| الحقل        | ملاحظات                                                     |
| ------------ | ----------------------------------------------------------- |
| `url`        | رابط الفيديو (مطلوب)                                        |
| `pic`        | الغلاف                                                      |
| `thumbnails` | رابط الصور المصغرة                                          |
| `type`       | نوع الفيديو: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | قائمة الجودة + فهرس `defaultQuality`                        |

### كائن الترجمة (subtitle)

| الحقل      | ملاحظات              |
| ---------- | -------------------- |
| `url`      | رابط الترجمة (مطلوب) |
| `type`     | `webvtt` \| `ass`    |
| `fontSize` | حجم الخط             |
| `bottom`   | المسافة من الأسفل    |
| `color`    | اللون                |

### كائن الدانماكو (danmaku)

| الحقل     | ملاحظات                           |
| --------- | --------------------------------- |
| `id`      | معرف فريد لمجمع الدانماكو (مطلوب) |
| `api`     | رابط API الدانماكو (مطلوب)        |
| `user`    | معرف المستخدم                     |
| `maximum` | أقصى عدد للدانماكو                |

## آلية التحميل البطيء

يتم تحميل المشغلات بتكاسل عبر IntersectionObserver: div النائب يستورد ديناميكياً وحدة المشغل والأنماط ويقوم بإنشاء المثيل فقط عندما يكون ضمن 200 بكسل من منفذ العرض.

- **APlayer**: استيراد ديناميكي `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: استيراد ديناميكي `import("dplayer")` (الأنماط مضمنة في JS؛ لا حاجة لـ CSS منفصل)

يستخدم تحميل الوحدات ذاكرة تخزين مؤقت مشتركة للـ Promise لتجنب عمليات الاستيراد الديناميكي المتكررة. يتم منع إعادة إنشاء المثيل عبر علامات `dataset` (`xng-init`، `xng-observed`).

## التكيف مع View Transitions

يستمع سكريبت المشغل إلى `astro:page-load` ويعيد مسح أقسام div النائبة بعد كل تحميل صفحة. بعد تبديل الصفحة باستخدام View Transitions، يتم إعادة مراقبة أقسام div النائبة للمشغل في الصفحة الجديدة وتحميلها بتكاسل.

## الأداء

- حزمة صفرية عند تعطيل المشغلات (إضافة remark غير محقونة، السكريبت العميل غير محمل)
- تشغيل صفري عند التمكين ولكن لا توجد مشغلات في الصفحة (السكريبت يُحمّل لكن لا يُنشئ مثيلات)
- وحدات المشغل هي أجزاء مستقلة، تُحمّل عند الطلب فقط في الصفحات التي تستخدمها
- CSS و JS يُستوردان بشكل منفصل لضمان جاهزية الأنماط قبل الإنشاء

## إعلانات الأنواع

APlayer و DPlayer ليس لديهما أنواع TypeScript رسمية؛ يوفر Xingluo إعلانات وحدة مرنة في [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) و [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts)، مع تعيين حقول الخيارات كاختيارية للتوافق مع الانتشار. مكونات MDX Props لها قيود نوع كاملة.
