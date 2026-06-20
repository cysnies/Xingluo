# Медиаплееры

Xingluo интегрирует APlayer (аудио) и DPlayer (видео), поддерживая два способа создания плееров в Markdown и MDX, все с ленивой загрузкой.

## Включение

Включайте или отключайте каждый плеер по мере необходимости в `features.players` в [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // Включить аудиоплеер APlayer
    dplayer: true,  // Включить видеоплеер DPlayer
  },
}
```

Они независимы. При отключении:

- Плагин `remarkPlayers` не внедряется (MD-ограничители не анализируются)
- Клиентский скрипт плеера не загружается
- Результат сборки не содержит чанков aplayer / dplayer

## Два режима использования

| Режим           | Применимо к            | Синтаксис                                                |
| --------------- | ---------------------- | -------------------------------------------------------- |
| MD-ограничитель | Обычные `.md` и `.mdx` | ` ```aplayer ` / ` ```dplayer ` + тело JSON конфигурации |
| MDX-компонент   | Только `.mdx`          | `import { APlayer, DPlayer } from "@/components/mdx"`    |

Оба режима в конечном итоге выводят одну и ту же структуру div-заполнителя (`<div class="xng-aplayer|xng-dplayer" data-config>`), лениво загружаемую и инстанцируемую [`src/scripts/players.ts`](../src/scripts/players.ts).

## APlayer Audio Player

### MD Fence

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

### MDX Component

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

### Options

| Поле            | Тип                            | По умолчанию | Примечания                                         |
| --------------- | ------------------------------ | ------------ | -------------------------------------------------- |
| `audio`         | Audio \| Audio[]               | обязательно  | Аудиообъект или список                             |
| `theme`         | string                         | `#b7daff`    | Цвет темы плеера                                   |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`        | Режим повтора                                      |
| `order`         | `"list"` \| `"random"`         | `list`       | Порядок воспроизведения                            |
| `volume`        | number                         | `0.7`        | Начальная громкость (0–1)                          |
| `autoplay`      | boolean                        | `false`      | Автовоспроизведение (зависит от политики браузера) |
| `listFolded`    | boolean                        | `false`      | Список свернут                                     |
| `listMaxHeight` | string                         | —            | Макс. высота списка (значение CSS)                 |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`          | Тип текста: 0 нет / 1 строка / 2 URL               |

### Объект audio

| Поле     | Примечания                                               |
| -------- | -------------------------------------------------------- |
| `name`   | Название трека (возврат к `title`, затем `'Audio name'`) |
| `artist` | Исполнитель (возврат к `author`)                         |
| `url`    | URL аудио (обязательно)                                  |
| `cover`  | Обложка (возврат к `pic`)                                |
| `lrc`    | Текст песни (строка или URL, в паре с `lrcType`)         |
| `theme`  | Цвет темы для трека                                      |
| `type`   | Тип аудио: `auto` \| `hls` \| `normal`                   |

## Видеоплеер DPlayer

### MD-ограничитель

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

### MDX-компонент

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### Опции

| Поле            | Тип                                  | По умолчанию | Примечания                            |
| --------------- | ------------------------------------ | ------------ | ------------------------------------- |
| `video`         | Video                                | обязательно  | Конфигурация видео                    |
| `theme`         | string                               | `#b7daff`    | Цвет темы                             |
| `autoplay`      | boolean                              | `false`      | Автовоспроизведение                   |
| `loop`          | boolean                              | `false`      | Зацикленное воспроизведение           |
| `screenshot`    | boolean                              | `false`      | Функция скриншота                     |
| `hotkey`        | boolean                              | `true`       | Горячие клавиши                       |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`       | Предзагрузка                          |
| `volume`        | number                               | `0.7`        | Начальная громкость                   |
| `playbackSpeed` | number[]                             | —            | Список скоростей воспроизведения      |
| `subtitle`      | Subtitle                             | —            | Субтитры                              |
| `danmaku`       | Danmaku                              | —            | Данмаку (комментарии)                 |
| `live`          | boolean                              | `false`      | Прямой эфир                           |
| `mutex`         | boolean                              | `true`       | Mutex (только один плеер на странице) |

### Объект video

| Поле         | Примечания                                                |
| ------------ | --------------------------------------------------------- |
| `url`        | URL видео (обязательно)                                   |
| `pic`        | Обложка                                                   |
| `thumbnails` | URL миниатюр                                              |
| `type`       | Тип видео: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Список качества + индекс `defaultQuality`                 |

### Объект subtitle

| Поле       | Примечания                  |
| ---------- | --------------------------- |
| `url`      | URL субтитров (обязательно) |
| `type`     | `webvtt` \| `ass`           |
| `fontSize` | Размер шрифта               |
| `bottom`   | Расстояние от низа          |
| `color`    | Цвет                        |

### Объект danmaku

| Поле      | Примечания                               |
| --------- | ---------------------------------------- |
| `id`      | Уникальный ID пула danmaku (обязательно) |
| `api`     | URL API danmaku (обязательно)            |
| `user`    | Идентификатор пользователя               |
| `maximum` | Макс. количество danmaku                 |

## Механизм ленивой загрузки

Плееры загружаются лениво через IntersectionObserver: div-заполнитель динамически импортирует модуль плеера и стили и инстанцируется только когда находится в пределах 200px от области просмотра.

- **APlayer**: dynamic `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: dynamic `import("dplayer")` (styles are inlined in JS; no separate CSS needed)

Загрузка модулей использует общий кэш Promise для предотвращения повторных динамических импортов. Повторная инстанциация предотвращается через маркеры `dataset` (`xng-init`, `xng-observed`).

## Адаптация View Transitions

Скрипт плеера прослушивает `astro:page-load` и повторно сканирует div-заполнители после каждой загрузки страницы. После смены страницы с View Transitions заполнители плеера новой страницы повторно наблюдаются и загружаются лениво.

## Производительность

- Нулевой бандл при отключенных плеерах (плагин remark не внедряется, клиентский скрипт не загружается)
- Нулевой рантайм при включенных, но отсутствующих на странице плеерах (скрипт загружается, но не создает экземпляры)
- Модули плееров — отдельные чанки, загружаемые по требованию только на страницах, где они используются
- CSS и JS импортируются отдельно, чтобы стили были готовы до создания экземпляра

## Объявления типов

APlayer и DPlayer не имеют официальных типов TypeScript; Xingluo предоставляет свободные объявления модулей в [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) и [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), поля options установлены как необязательные для совместимости с spread. MDX-компоненты Props имеют полные ограничения типов.
