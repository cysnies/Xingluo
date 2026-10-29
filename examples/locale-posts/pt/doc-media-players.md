---
title: "Reprodutores de Mídia"
pubDatetime: 2026-06-20T10:00:00+08:00
description: "Guia de players de mídia do Xingluo cobrindo uso de áudio APlayer e vídeo DPlayer via fences Markdown e componentes MDX."
tags:
  - documentation
  - media-players
category: "Documentation"
translationKey: doc-media-players
locale: pt
---

Xingluo integra APlayer (áudio) e DPlayer (vídeo), suportando duas maneiras de criar players em Markdown e MDX, todos com carregamento tardio.

## Ativação

Alterne cada player conforme necessário em `features.players` no [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  players: {
    aplayer: true,  // Ativar player de áudio APlayer
    dplayer: true,  // Ativar player de vídeo DPlayer
  },
}
```

Os dois são independentes. Quando desativados:

- O plugin `remarkPlayers` não é injetado (cercas MD não são analisadas)
- O script do player cliente não é carregado
- A saída da build não tem chunks aplayer / dplayer

## Dois Modos de Uso

| Modo           | Aplicável a            | Sintaxe                                                      |
| -------------- | ---------------------- | ------------------------------------------------------------ |
| MD fence       | `.md` e `.mdx` simples | ` ```aplayer ` / ` ```dplayer ` + corpo de configuração JSON |
| Componente MDX | Apenas `.mdx`          | `import { APlayer, DPlayer } from "@/components/mdx"`        |

Ambos os modos produzem a mesma estrutura de div placeholder (`<div class="xng-aplayer|xng-dplayer" data-config>`), carregada tardiamente e instanciada por [`src/scripts/players.ts`](../src/scripts/players.ts).

## Player de Áudio APlayer

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

### Opções

| Campo           | Tipo                           | Padrão      | Notas                                                   |
| --------------- | ------------------------------ | ----------- | ------------------------------------------------------- |
| `audio`         | Audio \| Audio[]               | obrigatório | Objeto de áudio ou lista                                |
| `theme`         | string                         | `#b7daff`   | Cor do tema do player                                   |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`       | Modo de repetição                                       |
| `order`         | `"list"` \| `"random"`         | `list`      | Ordem de reprodução                                     |
| `volume`        | number                         | `0.7`       | Volume inicial (0–1)                                    |
| `autoplay`      | boolean                        | `false`     | Reprodução automática (sujeita à política do navegador) |
| `listFolded`    | boolean                        | `false`     | Lista recolhida                                         |
| `listMaxHeight` | string                         | —           | Altura máxima da lista (valor CSS)                      |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`         | Tipo de letra: 0 nenhum / 1 string / 2 URL              |

### Objeto audio

| Campo    | Notas                                                    |
| -------- | -------------------------------------------------------- |
| `name`   | Nome da faixa (recorre a `title`, depois `'Audio name'`) |
| `artist` | Artista (recorre a `author`)                             |
| `url`    | URL de áudio (obrigatório)                               |
| `cover`  | Capa (recorre a `pic`)                                   |
| `lrc`    | Letra (string ou URL, combinado com `lrcType`)           |
| `theme`  | Cor do tema por faixa                                    |
| `type`   | Tipo de áudio: `auto` \| `hls` \| `normal`               |

## DPlayer Video Player

### MD Fence

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

### MDX Component

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### Opções

| Campo           | Tipo                                 | Padrão      | Notas                               |
| --------------- | ------------------------------------ | ----------- | ----------------------------------- |
| `video`         | Video                                | obrigatório | Configuração de vídeo               |
| `theme`         | string                               | `#b7daff`   | Cor do tema                         |
| `autoplay`      | boolean                              | `false`     | Reprodução automática               |
| `loop`          | boolean                              | `false`     | Reprodução em loop                  |
| `screenshot`    | boolean                              | `false`     | Função de captura                   |
| `hotkey`        | boolean                              | `true`      | Atalhos de teclado                  |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`      | Pré-carregamento                    |
| `volume`        | number                               | `0.7`       | Volume inicial                      |
| `playbackSpeed` | number[]                             | —           | Lista de velocidades                |
| `subtitle`      | Subtitle                             | —           | Legendas                            |
| `danmaku`       | Danmaku                              | —           | Danmaku (comentários animados)      |
| `live`          | boolean                              | `false`     | Modo ao vivo                        |
| `mutex`         | boolean                              | `true`      | Mutex (apenas um player por página) |

### Objeto video

| Campo        | Notas                                                         |
| ------------ | ------------------------------------------------------------- |
| `url`        | URL do vídeo (obrigatório)                                    |
| `pic`        | Capa                                                          |
| `thumbnails` | URL de miniaturas                                             |
| `type`       | Tipo de vídeo: `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Lista de qualidade + índice `defaultQuality`                  |

### Objeto subtitle

| Campo      | Notas                        |
| ---------- | ---------------------------- |
| `url`      | URL da legenda (obrigatório) |
| `type`     | `webvtt` \| `ass`            |
| `fontSize` | Tamanho da fonte             |
| `bottom`   | Distância do fundo           |
| `color`    | Cor                          |

### Objeto danmaku

| Campo     | Notas                                  |
| --------- | -------------------------------------- |
| `id`      | ID único do pool danmaku (obrigatório) |
| `api`     | URL da API danmaku (obrigatório)       |
| `user`    | Identificador de usuário               |
| `maximum` | Máximo de danmaku                      |

## Lazy Loading Mechanism

Players are lazy-loaded via IntersectionObserver: the placeholder div dynamically `import`s the player module and styles and instantiates only when within 200px of the viewport.

- **APlayer**: dynamic `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: dynamic `import("dplayer")` (styles are inlined in JS; no separate CSS needed)

Module loading uses a shared Promise cache to avoid repeated dynamic imports. Re-instantiation is prevented via `dataset` markers (`xng-init`, `xng-observed`).

## View Transitions Adaptation

The player script listens for `astro:page-load` and re-scans placeholder divs after each page load. After a View Transitions page switch, the new page's player placeholders are re-observed and lazy-loaded.

## Performance

- Pacote zero quando os players estão desativados (plugin remark não injetado, script do cliente não carregado)
- Runtime zero quando ativado mas sem players na página (script carrega mas não instancia)
- Módulos de player são chunks independentes, carregados sob demanda apenas nas páginas que os usam
- CSS e JS são importados separadamente para garantir que os estilos estejam prontos antes da instanciação

## Declarações de tipo

APlayer e DPlayer não têm tipos TypeScript oficiais; o Xingluo fornece declarações de módulo flexíveis em [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) e [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), com campos de opções definidos como opcionais para compatibilidade com spread. Os componentes MDX têm restrições de tipo completas nas Props.
