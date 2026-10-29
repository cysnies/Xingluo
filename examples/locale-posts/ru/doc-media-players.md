---
title: "Медиаплееры"
pubDatetime: 2026-06-20T10:00:00+08:00
description: "Руководство по медиаплеерам Xingluo, охватывающее использование аудио APlayer и видео DPlayer через Markdown-ограждения и MDX-компоненты."
tags:
  - documentation
  - media-players
category: "Documentation"
translationKey: doc-media-players
locale: ru
---

Xingluo интегрирует APlayer (аудио) и DPlayer (видео), поддерживая два способа создания плееров в Markdown и MDX, все с ленивой загрузкой.

## Включение

Включайте каждый плеер по мере необходимости в `features.players` в [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // Включить APlayer аудиоплеер
    dplayer: true,  // Включить DPlayer видеоплеер
  },
}
```

Они независимы. При отключении:

- Плагин `remarkPlayers` не подключается (MD-ограничители не анализируются)
- Клиентский скрипт плеера не загружается
- В выводе сборки нет блоков aplayer / dplayer

## Два режима использования

| Режим         | Применяется к          | Синтаксис                                                |
| ------------- | ---------------------- | -------------------------------------------------------- |
| MD fence      | Обычные `.md` и `.mdx` | ` ```aplayer ` / ` ```dplayer ` + тело JSON конфигурации |
| MDX компонент | Только `.mdx`          | `import { APlayer, DPlayer } from "@/components/mdx"`    |

Оба режима в конечном итоге выводят одну и ту же структуру div-заполнителя (`<div class="xng-aplayer|xng-dplayer" data-config>`), лениво загружаемую и создаваемую [`src/scripts/players.ts`](../src/scripts/players.ts).

## APlayer Аудиоплеер

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

### Опции

| Поле            | Тип                            | По умолчанию | Описание                                           |
| --------------- | ------------------------------ | ------------ | -------------------------------------------------- |
| `audio`         | Audio \| Audio[]               | обязательно  | Аудио-объект или список                            |
| `theme`         | string                         | `#b7daff`    | Цвет темы плеера                                   |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`        | Режим повтора                                      |
| `order`         | `"list"` \| `"random"`         | `list`       | Порядок воспроизведения                            |
| `volume`        | number                         | `0.7`        | Начальная громкость (0–1)                          |
| `autoplay`      | boolean                        | `false`      | Автовоспроизведение (зависит от политики браузера) |
| `listFolded`    | boolean                        | `false`      | Свёрнутый список                                   |
| `listMaxHeight` | string                         | —            | Максимальная высота списка (CSS значение)          |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`          | Тип текста: 0 нет / 1 строка / 2 URL               |

### Объект audio

| Поле     | Описание                                                      |
| -------- | ------------------------------------------------------------- |
| `name`   | Название трека (возвращается к `title`, затем `'Audio name'`) |
| `artist` | Исполнитель (возвращается к `author`)                         |
| `url`    | URL аудио (обязательно)                                       |
| `cover`  | Обложка (возвращается к `pic`)                                |
| `lrc`    | Текст песни (строка или URL, в паре с `lrcType`)              |
| `theme`  | Цвет темы для трека                                           |
| `type`   | Тип аудио: `auto` \| `hls` \| `normal`                        |

## DPlayer видеоплеер

### MD-ограждение

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

| Поле            | Тип                                  | По умолчанию | Описание                                |
| --------------- | ------------------------------------ | ------------ | --------------------------------------- |
| `video`         | Video                                | обязательно  | Конфигурация видео                      |
| `theme`         | string                               | `#b7daff`    | Цвет темы                               |
| `autoplay`      | boolean                              | `false`      | Автовоспроизведение                     |
| `loop`          | boolean                              | `false`      | Повтор воспроизведения                  |
| `screenshot`    | boolean                              | `false`      | Функция скриншота                       |
| `hotkey`        | boolean                              | `true`       | Горячие клавиши                         |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`       | Предзагрузка                            |
| `volume`        | number                               | `0.7`        | Начальная громкость                     |
| `playbackSpeed` | number[]                             | —            | Список скоростей воспроизведения        |
| `subtitle`      | Subtitle                             | —            | Субтитры                                |
| `danmaku`       | Danmaku                              | —            | Данмаку (комментарии-пули)              |
| `live`          | boolean                              | `false`      | Прямой эфир                             |
| `mutex`         | boolean                              | `true`       | Мьютекс (только один плеер на странице) |

### Объект video

| Поле         | Описание                                                  |
| ------------ | --------------------------------------------------------- |
| `url`        | URL видео (обязательно)                                   |
| `pic`        | Обложка                                                   |
| `thumbnails` | URL миниатюр                                              |
| `type`       | Тип видео: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Список качества + индекс `defaultQuality`                 |

### Объект subtitle

| Поле       | Описание                    |
| ---------- | --------------------------- |
| `url`      | URL субтитров (обязательно) |
| `type`     | `webvtt` \| `ass`           |
| `fontSize` | Размер шрифта               |
| `bottom`   | Расстояние от низа          |
| `color`    | Цвет                        |

### Объект danmaku

| Поле      | Описание                                 |
| --------- | ---------------------------------------- | --- |
| `id`      | Уникальный ID пула данмаку (обязательно) |     |
| `api`     | URL API данмаку (обязательно)            |
| `user`    | Идентификатор пользователя               |
| `maximum` | Максимальное количество данмаку          |

## Механизм ленивой загрузки

Плееры загружаются лениво через IntersectionObserver: placeholder div динамически импортирует модуль плеера и стили и создаёт экземпляр только когда находится в пределах 200px от области просмотра.

- **APlayer**: динамический `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: динамический `import("dplayer")` (стили встроены в JS; отдельный CSS не требуется)

Загрузка модулей использует общий кэш Promise для избежания повторных динамических импортов. Повторное создание экземпляра предотвращается маркерами `dataset` (`xng-init`, `xng-observed`).

## Адаптация View Transitions

Скрипт плеера прослушивает `astro:page-load` и повторно сканирует placeholder divs после каждой загрузки страницы. После переключения страницы через View Transitions placeholder-ы плеера на новой странице повторно наблюдаются и загружаются лениво.

## Производительность

- Нулевой бандл, когда плееры отключены (remark-плагин не внедрён, клиентский скрипт не загружен)
- Нулевой рантайм при включённых, но отсутствующих на странице плеерах (скрипт загружается, но не создаёт экземпляры)
- Модули плееров — отдельные чанки, загружаемые по требованию только на страницах, где они используются
- CSS и JS импортируются отдельно, чтобы стили были готовы до создания экземпляра

## Объявления типов

APlayer и DPlayer не имеют официальных типов TypeScript; Xingluo предоставляет свободные объявления модулей в [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) и [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), поля options установлены как необязательные для совместимости с spread. MDX-компоненты Props имеют полные ограничения типов.
