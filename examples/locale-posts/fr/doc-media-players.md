---
title: "Lecteurs multimédia"
pubDatetime: 2026-06-20T10:00:00+08:00
description: "Guide des lecteurs multimédia Xingluo couvrant l'utilisation audio APlayer et vidéo DPlayer via les fences Markdown et les composants MDX."
tags:
  - documentation
  - media-players
category: "Documentation"
translationKey: doc-media-players
locale: fr
---

Xingluo intègre APlayer (audio) et DPlayer (vidéo), prenant en charge deux façons de créer des lecteurs en Markdown et MDX, tous chargés paresseusement.

## Activation

Activez chaque lecteur selon les besoins dans `features.players` dans [`xingluo.config.ts`](../xingluo.config.ts) :

```ts
features: {
  players: {
    aplayer: true,  // Activer le lecteur audio APlayer
    dplayer: true,  // Activer le lecteur vidéo DPlayer
  },
}
```

Les deux sont indépendants. Lorsqu'ils sont désactivés :

- Le plugin `remarkPlayers` n'est pas injecté (les fences MD ne sont pas analysées)
- Le script client du lecteur n'est pas chargé
- La sortie de build n'a pas de chunks aplayer / dplayer

## Deux modes d'utilisation

| Mode          | Applicable à            | Syntaxe                                               |
| ------------- | ----------------------- | ----------------------------------------------------- |
| MD fence      | `.md` et `.mdx` simples | ` ```aplayer ` / ` ```dplayer ` + corps JSON config   |
| Composant MDX | `.mdx` uniquement       | `import { APlayer, DPlayer } from "@/components/mdx"` |

Les deux modes produisent finalement la même structure de div placeholder (`<div class="xng-aplayer|xng-dplayer" data-config>`), chargée de manière différée et instanciée par [`src/scripts/players.ts`](../src/scripts/players.ts).

## Lecteur audio APlayer

### MD Fence

````markdown
```aplayer
{
  "audio": [
    {
      "name": "Titre",
      "artist": "Artiste",
      "url": "/audio/song.mp3",
      "cover": "/images/cover.jpg",
      "lrc": "[00:00.00] Première ligne de paroles"
    }
  ],
  "theme": "#b7daff",
  "loop": "all",
  "autoplay": false
}
```
````

### Composant MDX

```mdx
import { APlayer } from "@/components/mdx";

<APlayer
  audio={[
    {
      name: "Titre",
      artist: "Artiste",
      url: "/audio/song.mp3",
      cover: "/images/cover.jpg",
    },
  ]}
  theme="#b7daff"
  loop="all"
/>
```

### Options

| Champ           | Type                           | Défaut    | Remarques                                                 |
| --------------- | ------------------------------ | --------- | --------------------------------------------------------- |
| `audio`         | Audio \| Audio[]               | requis    | Objet ou liste audio                                      |
| `theme`         | string                         | `#b7daff` | Couleur du thème du lecteur                               |
| `loop`          | `"all"` \| `"one"` \| `"none"` | `all`     | Mode de répétition                                        |
| `order`         | `"list"` \| `"random"`         | `list`    | Ordre de lecture                                          |
| `volume`        | number                         | `0.7`     | Volume initial (0–1)                                      |
| `autoplay`      | boolean                        | `false`   | Lecture automatique (soumis à la politique du navigateur) |
| `listFolded`    | boolean                        | `false`   | Liste repliée                                             |
| `listMaxHeight` | string                         | —         | Hauteur max de la liste (valeur CSS)                      |
| `lrcType`       | `0` \| `1` \| `2` \| `3`       | `0`       | Type de paroles : 0 aucun / 1 chaîne / 2 URL              |

### Objet audio

| Champ    | Remarques                                                 |
| -------- | --------------------------------------------------------- |
| `name`   | Titre du morceau (repli sur `title`, puis `'Audio name'`) |
| `artist` | Artiste (repli sur `author`)                              |
| `url`    | URL audio (requis)                                        |
| `cover`  | Pochette (repli sur `pic`)                                |
| `lrc`    | Paroles (chaîne ou URL, associé à `lrcType`)              |
| `theme`  | Couleur du thème par morceau                              |
| `type`   | Type audio : `auto` \| `hls` \| `normal`                  |

## Lecteur vidéo DPlayer

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

| Champ           | Type                                 | Défaut    | Remarques                        |
| --------------- | ------------------------------------ | --------- | -------------------------------- |
| `video`         | Video                                | requis    | Configuration vidéo              |
| `theme`         | string                               | `#b7daff` | Couleur du thème                 |
| `autoplay`      | boolean                              | `false`   | Lecture automatique              |
| `loop`          | boolean                              | `false`   | Répéter                          |
| `screenshot`    | boolean                              | `false`   | Capture d'écran                  |
| `hotkey`        | boolean                              | `true`    | Raccourcis clavier               |
| `preload`       | `"none"` \| `"metadata"` \| `"auto"` | `auto`    | Préchargement                    |
| `volume`        | number                               | `0.7`     | Volume initial                   |
| `playbackSpeed` | number[]                             | —         | Liste des vitesses               |
| `subtitle`      | Subtitle                             | —         | Sous-titres                      |
| `danmaku`       | Danmaku                              | —         | Danmaku (commentaires animés)    |
| `live`          | boolean                              | `false`   | Mode direct                      |
| `mutex`         | boolean                              | `true`    | Mutex (un seul lecteur par page) |

### Objet video

| Champ        | Remarques                                                   |
| ------------ | ----------------------------------------------------------- |
| `url`        | URL vidéo (requis)                                          |
| `pic`        | Pochette                                                    |
| `thumbnails` | URL des vignettes                                           |
| `type`       | Type vidéo : `auto` \| `hls` \| `flv` \| `dash` \| `normal` |
| `quality`    | Liste des qualités + index `defaultQuality`                 |

### Objet subtitle

| Champ      | Remarques                    |
| ---------- | ---------------------------- |
| `url`      | URL des sous-titres (requis) |
| `type`     | `webvtt` \| `ass`            |
| `fontSize` | Taille de police             |
| `bottom`   | Distance depuis le bas       |
| `color`    | Couleur                      |

### Objet danmaku

| Champ     | Remarques                          |
| --------- | ---------------------------------- |
| `id`      | ID unique du pool danmaku (requis) |
| `api`     | URL de l'API danmaku (requis)      |
| `user`    | Identifiant utilisateur            |
| `maximum` | Nombre max de danmaku              |

## Mécanisme de chargement différé

Les lecteurs sont chargés de manière différée via IntersectionObserver : le div placeholder importe dynamiquement le module du lecteur et les styles, et ne s'instancie que lorsqu'il est à moins de 200px de la fenêtre.

- **APlayer** : `import("aplayer")` dynamique + `import("aplayer/dist/APlayer.min.css")`
- **DPlayer** : `import("dplayer")` dynamique (les styles sont intégrés dans le JS ; pas de CSS séparé nécessaire)

Le chargement des modules utilise un cache Promise partagé pour éviter les importations dynamiques répétées. La ré-instanciation est empêchée via des marqueurs `dataset` (`xng-init`, `xng-observed`).

## Adaptation View Transitions

Le script du lecteur écoute `astro:page-load` et réanalyse les divs placeholder après chaque chargement de page. Après un changement de page View Transitions, les placeholders du lecteur de la nouvelle page sont réobservés et chargés de manière différée.

## Performances

- Bundle zéro lorsque les lecteurs sont désactivés (plugin remark non injecté, script client non chargé)
- Exécution zéro lorsqu'ils sont activés mais qu'aucun lecteur n'est sur une page (le script se charge mais ne s'instancie pas)
- Les modules de lecteur sont des chunks autonomes, chargés à la demande uniquement sur les pages qui les utilisent
- CSS et JS sont importés séparément pour garantir que les styles sont prêts avant l'instanciation

## Déclarations de types

APlayer et DPlayer n'ont pas de types TypeScript officiels ; Xingluo fournit des déclarations de modules souples dans [`src/types/aplayer.d.ts`](../src/types/aplayer.d.ts) et [`src/types/dplayer.d.ts`](../src/types/dplayer.d.ts), avec les champs options définis comme facultatifs pour la compatibilité spread. Les Props des composants MDX ont des contraintes de type complètes.
