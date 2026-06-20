# Lecteurs multimédia

Xingluo intègre APlayer (audio) et DPlayer (vidéo), prenant en charge deux façons de créer des lecteurs en Markdown et MDX, tous chargés paresseusement.

## Activation

Activez ou désactivez chaque lecteur selon vos besoins dans `features.players` de [`xingluo.config.ts`](../xingluo.config.ts) :

```ts
features: {
  players: {
    aplayer: true,  // Activer le lecteur audio APlayer
    dplayer: true,  // Activer le lecteur vidéo DPlayer
  },
}
```

Les deux sont indépendants. Lorsqu'ils sont désactivés :

- Le plugin `remarkPlayers` n'est pas injecté (les blocs MD ne sont pas analysés)
- Le script client du lecteur n'est pas chargé
- La sortie de build n'a pas de chunks aplayer / dplayer

## Deux modes d'utilisation

| Mode          | Applicable à            | Syntaxe                                               |
| ------------- | ----------------------- | ----------------------------------------------------- |
| MD fence      | `.md` et `.mdx` simples | ` ```aplayer ` / ` ```dplayer ` + corps JSON          |
| Composant MDX | `.mdx` uniquement       | `import { APlayer, DPlayer } from "@/components/mdx"` |

Les deux modes produisent finalement la même structure de div placeholder (`<div class="xng-aplayer|xng-dplayer" data-config>`), chargée paresseusement et instanciée par [`src/scripts/players.ts`](../src/scripts/players.ts).

## Lecteur audio APlayer

### Barrière MD

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

| Champ           | Type                           | Défaut    | Notes                                                      |
| --------------- | ------------------------------ | --------- | ---------------------------------------------------------- |
| `audio`         | Audio \| Audio[]               | requis    | Objet ou liste audio                                       |
| `theme`         | string                         | `#b7daff` | Couleur du thème du lecteur                                |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`     | Mode de répétition                                         |
| `order`         | `"list"` \| `"random"`         | `list`    | Ordre de lecture                                           |
| `volume`        | number                         | `0.7`     | Volume initial (0–1)                                       |
| `autoplay`      | boolean                        | `false`   | Lecture automatique (soumise à la politique du navigateur) |
| `listFolded`    | boolean                        | `false`   | Liste pliée                                                |
| `listMaxHeight` | string                         | —         | Hauteur max de la liste (valeur CSS)                       |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`       | Type de paroles : 0 aucun / 1 chaîne / 2 URL               |

### Objet audio

| Champ    | Notes                                                    |
| -------- | -------------------------------------------------------- |
| `name`   | Nom de la piste (revient à `title`, puis `'Audio name'`) |
| `artist` | Artiste (revient à `author`)                             |
| `url`    | URL audio (requis)                                       |
| `cover`  | Couverture (revient à `pic`)                             |
| `lrc`    | Paroles (chaîne ou URL, associé à `lrcType`)             |
| `theme`  | Couleur du thème par piste                               |
| `type`   | Type audio : `auto` \| `hls` \| `normal`                 |

## Lecteur vidéo DPlayer

### Barrière MD

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

### Composant MDX

```mdx
import { DPlayer } from "@/components/mdx";

<DPlayer
  video={{ url: "/videos/demo.mp4", pic: "/images/video-cover.jpg" }}
  theme="#b7daff"
  subtitle={{ url: "/subtitles.vtt", type: "webvtt" }}
/>
```

### Options

| Champ           | Type                                 | Défaut    | Notes                            |
| --------------- | ------------------------------------ | --------- | -------------------------------- |
| `video`         | Video                                | requis    | Configuration vidéo              |
| `theme`         | string                               | `#b7daff` | Couleur du thème                 |
| `autoplay`      | boolean                              | `false`   | Lecture automatique              |
| `loop`          | boolean                              | `false`   | Lecture en boucle                |
| `screenshot`    | boolean                              | `false`   | Capture d'écran                  |
| `hotkey`        | boolean                              | `true`    | Raccourcis clavier               |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`    | Préchargement                    |
| `volume`        | number                               | `0.7`     | Volume initial                   |
| `playbackSpeed` | number[]                             | —         | Liste des vitesses de lecture    |
| `subtitle`      | Subtitle                             | —         | Sous-titres                      |
| `danmaku`       | Danmaku                              | —         | Danmaku (commentaires animés)    |
| `live`          | boolean                              | `false`   | Mode en direct                   |
| `mutex`         | boolean                              | `true`    | Mutex (un seul lecteur par page) |

### Objet vidéo

| Champ        | Notes                                                          |
| ------------ | -------------------------------------------------------------- |
| `url`        | URL de la vidéo (requis)                                       |
| `pic`        | Couverture                                                     |
| `thumbnails` | URL des miniatures                                             |
| `type`       | Type de vidéo : `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Liste de qualités + index `defaultQuality`                     |

### Objet sous-titre

| Champ      | Notes                      |
| ---------- | -------------------------- |
| `url`      | URL du sous-titre (requis) |
| `type`     | `webvtt` \| `ass`          |
| `fontSize` | Taille de police           |
| `bottom`   | Distance depuis le bas     |
| `color`    | Couleur                    |

### Objet danmaku

| Champ     | Notes                              |
| --------- | ---------------------------------- |
| `id`      | ID unique du pool danmaku (requis) |
| `api`     | URL de l'API danmaku (requis)      |
| `user`    | Identifiant utilisateur            |
| `maximum` | Nombre max de danmaku              |

## Mécanisme de chargement paresseux

Les lecteurs sont chargés paresseusement via IntersectionObserver : le div placeholder `import` dynamiquement le module du lecteur et les styles, et instancie seulement lorsqu'il est à moins de 200px du viewport.

- **APlayer** : `import("aplayer")` dynamique + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer** : `import("dplayer")` dynamique (les styles sont intégrés dans le JS ; aucun CSS séparé nécessaire)

Le chargement des modules utilise un cache de Promise partagé pour éviter les imports dynamiques répétés. La ré-instanciation est empêchée via des marqueurs `dataset` (`xng-init`, `xng-observed`).

## View Transitions Adaptation

Le script du lecteur écoute `astro:page-load` et réanalyse les divs placeholder après chaque chargement de page. Après un changement de page View Transitions, les placeholders du lecteur de la nouvelle page sont réobservés et chargés paresseusement.

## Performance

- Bundle nul lorsque les lecteurs sont désactivés (plugin remark non injecté, script client non chargé)
- Exécution nulle lorsque activé mais aucun lecteur sur la page (le script se charge mais ne s'instancie pas)
- Les modules de lecteur sont des chunks autonomes, chargés à la demande uniquement sur les pages qui les utilisent
- CSS et JS sont importés séparément pour garantir que les styles soient prêts avant l'instanciation

## Déclarations de type

APlayer et DPlayer n'ont pas de types TypeScript officiels ; Xingluo fournit des déclarations de module souples dans [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) et [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), avec les champs d'options facultatifs pour la compatibilité de spread. Les Props des composants MDX ont des contraintes de type complètes.
