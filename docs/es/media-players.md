# Reproductores multimedia

Xingluo integra APlayer (audio) y DPlayer (video), admitiendo dos formas de crear reproductores en Markdown y MDX, todos con carga diferida.

## Habilitación

Activa o desactiva cada reproductor según sea necesario en `features.players` en [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // Activar reproductor de audio APlayer
    dplayer: true,  // Activar reproductor de vídeo DPlayer
  },
}
```

Ambos son independientes. Cuando están desactivados:

- El plugin `remarkPlayers` no se inyecta (los MD fences no se analizan)
- El script del reproductor del cliente no se carga
- La salida de compilación no tiene fragmentos aplayer / dplayer

## Dos modos de uso

| Modo           | Aplicable a            | Sintaxis                                              |
| -------------- | ---------------------- | ----------------------------------------------------- |
| MD fence       | `.md` y `.mdx` simples | ` ```aplayer ` / ` ```dplayer ` + cuerpo JSON         |
| Componente MDX | Solo `.mdx`            | `import { APlayer, DPlayer } from "@/components/mdx"` |

Ambos modos finalmente generan la misma estructura de div placeholder (`<div class="xng-aplayer|xng-dplayer" data-config>`), cargada de forma diferida e instanciada por [`src/scripts/players.ts`](../src/scripts/players.ts).

## APlayer Reproductor de audio

### Cerca MD

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

### Componente MDX

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

### Opciones

| Campo           | Tipo                           | Predeterminado | Notas                                                        |
| --------------- | ------------------------------ | -------------- | ------------------------------------------------------------ |
| `audio`         | Audio \| Audio[]               | requerido      | Objeto o lista de audio                                      |
| `theme`         | string                         | `#b7daff`      | Color del tema del reproductor                               |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`          | Modo de repetición                                           |
| `order`         | `"list"` \| `"random"`         | `list`         | Orden de reproducción                                        |
| `volume`        | number                         | `0.7`          | Volumen inicial (0–1)                                        |
| `autoplay`      | boolean                        | `false`        | Reproducción automática (sujeta a la política del navegador) |
| `listFolded`    | boolean                        | `false`        | Lista plegada                                                |
| `listMaxHeight` | string                         | —              | Altura máxima de la lista (valor CSS)                        |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`            | Tipo de letra: 0 ninguno / 1 cadena / 2 URL                  |

### Objeto audio

| Campo    | Notas                                                        |
| -------- | ------------------------------------------------------------ |
| `name`   | Nombre de la pista (recurre a `title`, luego `'Audio name'`) |
| `artist` | Artista (recurre a `author`)                                 |
| `url`    | URL de audio (requerido)                                     |
| `cover`  | Portada (recurre a `pic`)                                    |
| `lrc`    | Letra (cadena o URL, emparejado con `lrcType`)               |
| `theme`  | Color del tema por pista                                     |
| `type`   | Tipo de audio: `auto` \| `hls` \| `normal`                   |

## DPlayer Reproductor de vídeo

### Cerca MD

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

### Componente MDX

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### Opciones

| Campo           | Tipo                                 | Predeterminado | Notas                                  |
| --------------- | ------------------------------------ | -------------- | -------------------------------------- |
| `video`         | Video                                | requerido      | Configuración de vídeo                 |
| `theme`         | string                               | `#b7daff`      | Color del tema                         |
| `autoplay`      | boolean                              | `false`        | Reproducción automática                |
| `loop`          | boolean                              | `false`        | Reproducción en bucle                  |
| `screenshot`    | boolean                              | `false`        | Función de captura                     |
| `hotkey`        | boolean                              | `true`         | Atajos de teclado                      |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`         | Precarga                               |
| `volume`        | number                               | `0.7`          | Volumen inicial                        |
| `playbackSpeed` | number[]                             | —              | Lista de velocidades                   |
| `subtitle`      | Subtitle                             | —              | Subtítulos                             |
| `danmaku`       | Danmaku                              | —              | Danmaku (comentarios animados)         |
| `live`          | boolean                              | `false`        | Modo en vivo                           |
| `mutex`         | boolean                              | `true`         | Mutex (solo un reproductor por página) |

### Objeto video

| Campo        | Notas                                                         |
| ------------ | ------------------------------------------------------------- |
| `url`        | URL del vídeo (requerido)                                     |
| `pic`        | Portada                                                       |
| `thumbnails` | URL de miniaturas                                             |
| `type`       | Tipo de vídeo: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Lista de calidad + índice `defaultQuality`                    |

### Objeto subtitle

| Campo      | Notas                         |
| ---------- | ----------------------------- |
| `url`      | URL del subtítulo (requerido) |
| `type`     | `webvtt` \| `ass`             |
| `fontSize` | Tamaño de fuente              |
| `bottom`   | Distancia desde abajo         |
| `color`    | Color                         |

### Objeto danmaku

| Campo     | Notas                                 |
| --------- | ------------------------------------- |
| `id`      | ID único del pool danmaku (requerido) |
| `api`     | URL de la API danmaku (requerido)     |
| `user`    | Identificador de usuario              |
| `maximum` | Máximo de danmaku                     |

## Mecanismo de carga diferida

Los reproductores se cargan de forma diferida mediante IntersectionObserver: el div placeholder importa dinámicamente el módulo del reproductor y los estilos, y solo se instancia cuando está dentro de 200px del viewport.

- **APlayer**: dynamic `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: dynamic `import("dplayer")` (los estilos están en línea en JS; no se necesita CSS separado)

La carga de módulos utiliza un caché de Promise compartido para evitar importaciones dinámicas repetidas. La reinstanciación se evita mediante marcadores `dataset` (`xng-init`, `xng-observed`).

### Adaptación a View Transitions

El script del reproductor escucha `astro:page-load` y vuelve a escanear los divs placeholder después de cada carga de página. Después de un cambio de página con View Transitions, los placeholders del reproductor de la nueva página se vuelven a observar y cargar de forma diferida.

## Rendimiento

- Paquete cero cuando los reproductores están desactivados (plugin remark no inyectado, script del cliente no cargado)
- Ejecución cero cuando está activado pero no hay reproductores en una página (el script se carga pero no se instancia)
- Los módulos de reproductor son fragmentos independientes, se cargan bajo demanda solo en las páginas que los usan
- CSS y JS se importan por separado para garantizar que los estilos estén listos antes de la instanciación

## Declaraciones de tipo

APlayer y DPlayer no tienen tipos TypeScript oficiales; Xingluo proporciona declaraciones de módulo flexibles en [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) y [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), con los campos de opciones establecidos como opcionales para compatibilidad con spread. Los Props de los componentes MDX tienen restricciones de tipo completas.
