# Reprodutores de mídia

Xingluo integra APlayer (áudio) e DPlayer (vídeo), suportando duas maneiras de criar players em Markdown e MDX, todos com carregamento tardio.

## Ativação

Ative ou desative cada player conforme necessário em `features.players` em [`xingluo.config.ts`](../xingluo.config.ts):

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
- O script do cliente do player não é carregado
- A saída da build não tem chunks aplayer / dplayer

## Dois Modos de Uso

| Modo           | Aplicável a            | Sintaxe                                                      |
| -------------- | ---------------------- | ------------------------------------------------------------ |
| Cerca MD       | `.md` e `.mdx` simples | ` ```aplayer ` / ` ```dplayer ` + corpo JSON de configuração |
| Componente MDX | Apenas `.mdx`          | `import { APlayer, DPlayer } from "@/components/mdx"`        |

Ambos os modos produzem a mesma estrutura de div placeholder (`<div class="xng-aplayer|xng-dplayer" data-config>`), carregada sob demanda e instanciada por [`src/scripts/players.ts`](../src/scripts/players.ts).

## Player de Áudio APlayer

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

### Options

| Campo           | Tipo                           | Padrão      | Notas                                                   |
| --------------- | ------------------------------ | ----------- | ------------------------------------------------------- |
| `audio`         | Audio \| Audio[]               | obrigatório | Objeto ou lista de áudio                                |
| `theme`         | string                         | `#b7daff`   | Cor do tema do player                                   |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`       | Modo de repetição                                       |
| `order`         | `"list"` \| `"random"`         | `list`      | Ordem de reprodução                                     |
| `volume`        | number                         | `0.7`       | Volume inicial (0–1)                                    |
| `autoplay`      | boolean                        | `false`     | Reprodução automática (sujeita à política do navegador) |
| `listFolded`    | boolean                        | `false`     | Lista dobrada                                           |
| `listMaxHeight` | string                         | —           | Altura máxima da lista (valor CSS)                      |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`         | Tipo de letra: 0 nenhum / 1 string / 2 URL              |

### Objeto audio

| Campo    | Notas                                                    |
| -------- | -------------------------------------------------------- |
| `name`   | Nome da faixa (recorre a `title`, depois `'Audio name'`) |
| `artist` | Artista (recorre a `author`)                             |
| `url`    | URL do áudio (obrigatório)                               |
| `cover`  | Capa (recorre a `pic`)                                   |
| `lrc`    | Letra (string ou URL, emparelhado com `lrcType`)         |
| `theme`  | Cor do tema por faixa                                    |
| `type`   | Tipo de áudio: `auto` \| `hls` \| `normal`               |

## Player de Vídeo DPlayer

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

### Opções

| Campo           | Tipo                                 | Padrão      | Notas                               |
| --------------- | ------------------------------------ | ----------- | ----------------------------------- |
| `video`         | Video                                | obrigatório | Configuração de vídeo               |
| `theme`         | string                               | `#b7daff`   | Cor do tema                         |
| `autoplay`      | boolean                              | `false`     | Reprodução automática               |
| `loop`          | boolean                              | `false`     | Reprodução em loop                  |
| `screenshot`    | boolean                              | `false`     | Função de captura de tela           |
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
| `user`    | Identificador do usuário               |
| `maximum` | Máximo de danmaku                      |

## Mecanismo de Carregamento Tardio

Os players são carregados sob demanda via IntersectionObserver: o div placeholder importa dinamicamente o módulo do player e os estilos, e só instancia quando está a 200px do viewport.

- **APlayer**: importação dinâmica `import("aplayer")` + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer**: importação dinâmica `import("dplayer")` (estilos são inline no JS; nenhum CSS separado necessário)

O carregamento de módulos usa um cache de Promise compartilhado para evitar importações dinâmicas repetidas. A reinstanciação é evitada através de marcadores `dataset` (`xng-init`, `xng-observed`).

## Adaptação View Transitions

O script do player escuta `astro:page-load` e reescaneia os divs placeholder após cada carregamento de página. Após uma mudança de página com View Transitions, os placeholders do player da nova página são reobservados e carregados sob demanda.

## Desempenho

- Pacote zero quando os players estão desativados (plugin remark não injetado, script do cliente não carregado)
- Runtime zero quando ativado mas sem players na página (script carrega mas não instancia)
- Módulos de player são chunks independentes, carregados sob demanda apenas nas páginas que os usam
- CSS e JS são importados separadamente para garantir que os estilos estejam prontos antes da instanciação

## Declarações de tipo

APlayer e DPlayer não têm tipos TypeScript oficiais; o Xingluo fornece declarações de módulo flexíveis em [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) e [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), com campos de opções definidos como opcionais para compatibilidade com spread. Os componentes MDX têm restrições de tipo completas nas Props.
