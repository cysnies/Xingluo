---
title: "Rédaction de contenu"
pubDatetime: 2026-06-20T05:00:00+08:00
description: "Guide de rédaction de contenu Xingluo couvrant le frontmatter des articles, la syntaxe Markdown/MDX, le coloration syntaxique, les callouts et les améliorations de contenu."
tags:
  - documentation
  - writing
category: "Documentation"
translationKey: doc-content
locale: fr
---

Xingluo utilise Astro Content Collections pour gérer le contenu, prenant en charge Markdown (`.md`) et MDX (`.mdx`, nécessite `features.mdx`).

## Collections de contenu

Deux collections sont définies dans [`src/content.config.ts`](../src/content.config.ts) :

| Collection | Répertoire           | Objectif                            |
| ---------- | -------------------- | ----------------------------------- |
| `posts`    | `src/content/posts/` | Articles du blog                    |
| `pages`    | `src/content/pages/` | Pages statiques (ex. page à propos) |

Conventions de nommage des fichiers :

- Les fichiers ou répertoires commençant par `_` sont ignorés (pratique pour les brouillons)
- Avec MDX activé, `**/*.{md,mdx}` est collecté ; sinon seulement `**/*.md`
- Les URL des articles sont dérivées du chemin du fichier (voir la section routage dans [Aperçu de l'architecture](./doc-architecture.md))

## Frontmatter des articles

Champs complets pour la collection `posts`:

```markdown
---
title: "Titre de l'article" # requis
pubDatetime: 2026-06-19T10:00:00+08:00 # requis, date de publication
modDatetime: 2026-06-20T10:00:00+08:00 # optionnel, date de mise à jour
description: "Résumé, utilisé pour le SEO et les listes" # requis
tags: ["Astro", "blog"] # optionnel, défaut ["others"]
featured: true # optionnel, mis en avant (affiché sur la page d'accueil)
draft: false # optionnel, les brouillons ne sont pas publiés
author: "Xingluo" # optionnel, défaut site.author
ogImage: "./cover.png" # optionnel, image OG (importation d'image ou chemin chaîne)
canonicalURL: "https://..." # optionnel, lien canonique
hideEditPost: false # optionnel, masquer le lien d'édition
timezone: "Asia/Shanghai" # optionnel, remplacer le fuseau horaire du site
---
```

### Référence des champs

| Champ            | Type            | Défaut          | Notes                                                                                                            |
| ---------------- | --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `title`          | string          | requis          | Titre de l'article                                                                                               |
| `pubDatetime`    | date            | requis          | Date de publication, ISO 8601                                                                                    |
| `modDatetime`    | date            | —               | Date de mise à jour ; affiche un label "mis à jour"                                                              |
| `description`    | string          | requis          | Résumé, utilisé dans meta, RSS et les cartes de liste                                                            |
| `tags`           | string[]        | `["others"]`    | Tableau de tags ; les pages de tags sont générées automatiquement                                                |
| `featured`       | boolean         | —               | Affiché dans la section "À la une" de la page d'accueil                                                          |
| `draft`          | boolean         | —               | Brouillon ; filtré en production (visible en développement)                                                      |
| `author`         | string          | `site.author`   | Nom de l'auteur                                                                                                  |
| `ogImage`        | image \| string | —               | Image OG ; `image()` passe par le pipeline d'assets Astro, une chaîne est un chemin `public/` ou une URL externe |
| `canonicalURL`   | string          | —               | Lien canonique, remplace la valeur par défaut (voir [SEO](./doc-seo.md))                                         |
| `hideEditPost`   | boolean         | —               | Masquer le lien d'édition pour cet article                                                                       |
| `timezone`       | string          | `site.timezone` | Remplacer le fuseau horaire d'affichage pour cet article                                                         |
| `locale`         | string          | `site.lang`     | Langue de rédaction de l'article, ex. `"en"`, `"ja"`. Par défaut : langue du site                                |
| `translationKey` | string          | —               | Clé de groupe de traduction : les articles partageant la même clé sont des traductions les uns des autres        |
| `category`       | string          | —               | Catégorie de l'article (valeur unique), génère une page `/categories/<slug>/`                                    |

### Traduction au niveau du contenu

Utilisez les champs frontmatter `locale` et `translationKey` pour créer des versions multilingues de vos articles :

1. Placez l'article dans la langue par défaut à `src/content/posts/<slug>.md`
2. Placez les traductions dans des sous-répertoires de langue : `src/content/posts/<locale>/<slug>.md` (ex. `en/welcome.md`)
3. Définissez `locale` sur la langue de la traduction et `translationKey` sur la même valeur que l'original

La couche de routage résout automatiquement la traduction correcte par langue et déduplique dans les listes — le même article dans différentes langues n'affiche qu'une carte par langue. Les articles sans traduction reviennent au contenu original. Voir [Internationalisation](./doc-i18n.md).

### Publication programmée

Les articles avec des horodatages futurs sont filtrés en production en utilisant la tolérance `scheduledPostMargin` : si `pubDatetime` est dans la fenêtre de tolérance (15 minutes par défaut) de l'heure actuelle, l'article est considéré comme publié. En développement, tous les articles non-brouillons sont visibles.

## Frontmatter des pages statiques

La collection `pages` a des champs plus simples :

```markdown
---
title: "À propos"
description: "À propos de ce site" # optionnel
ogImage: "default-og.jpg" # optionnel, chaîne uniquement
canonicalURL: "https://..." # optionnel
---
```

La page à propos est récupérée via `getEntry("pages", "about")` et nécessite la création de `src/content/pages/about.md`.

## Améliorations Markdown

Xingluo est livré avec les plugins remark / rehype suivants (voir `astro.config.ts`) :

### Table des matières

`remark-toc` génère la table des matières automatiquement ; `remark-collapse` la replie par défaut. Insérez le placeholder dans un article :

```markdown
## Table des matières

(The TOC is auto-filled here)
```

### Callouts

`rehype-callouts` prend en charge les callouts de style Obsidian :

```markdown
> [!NOTE]
> Contenu de la note

> [!WARNING]
> Contenu de l'avertissement

> [!TIP]
> Contenu du conseil
```

Types pris en charge : `NOTE`, `TIP`, `INFO`, `WARNING`, `DANGER`, `SUCCESS`, `QUESTION`, `FAILURE`, et plus.

### Code Highlighting

Le double thème Shiki (clair `min-light`, sombre `night-owl`) prend en charge :

- Surlignage de ligne : ` ```js {1,3-5} `
- Surlignage de mot : ` ```js /word/ `
- Marqueurs Diff : `+` / `-` en début de ligne
- Étiquettes de nom de fichier : ` ```js file=src/index.ts ` ou `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // ligne surlignée
}
```

### Tables

Les tableaux larges sont automatiquement enveloppés dans un conteneur à défilement horizontal (le plugin `rehypeWrapTable`), évitant les débordements sur les écrans étroits.

## MDX Support

Avec `features.mdx` activé (par défaut), vous pouvez utiliser des fichiers `.mdx` pour une rédaction basée sur les composants.

### Composants personnalisés

Les composants MDX intégrés de Xingluo se trouvent dans [`src/components/mdx/`](../src/components/mdx) et sont importés depuis une entrée unifiée :

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# Mon article

<APlayer
  audio={[
    {
      name: "Chanson",
      artist: "Artiste",
      url: "/audio.mp3",
      cover: "/cover.jpg",
    },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

Voir [Lecteurs multimédia](./doc-media-players.md) pour plus de détails.

### Disabling MDX

Avec `features.mdx: false` :

- L'intégration `mdx()` n'est pas chargée
- Le glob de la collection de contenu ne correspond qu'à `*.md` (les fichiers `.mdx` existants ne sont pas collectés)
- La sortie de build ne contient pas d'exécution MDX

## Commentaires

Le système de commentaires est rendu automatiquement en bas des pages de détail des articles (configurez le fournisseur dans `features.comments`). Voir [Système de commentaires](./doc-comments.md).

## Temps de lecture

Le temps de lecture estimé est affiché automatiquement sur les pages de détail des articles et les cartes de liste :

- **Langues CJK** (zh-cn, ja, ko) : calculé par le nombre de caractères CJK, ~400 caractères par minute
- **Autres langues** : calculé par le nombre de mots (séparés par des espaces), ~200 mots par minute
- Résultat arrondi à l'entier supérieur, minimum 1 minute

Avant le comptage, les blocs de code, les balises HTML, les URL de liens Markdown et autres contenus non-textuels sont supprimés pour garder l'estimation proche du volume de lecture réel. Aucune configuration nécessaire.

## Articles connexes

Jusqu'à 2 articles connexes sont affichés en bas des pages de détail des articles (après la navigation précédent/suivant) :

- Triés par nombre de tags partagés, décroissant
- À score égal, triés par date de publication décroissante (favorisant les articles plus récents)
- La section n'est pas rendue quand aucun article ne partage de tags
- Ignorés automatiquement par l'index de recherche pagefind

Aucune configuration nécessaire.

## Barre latérale TOC fixe

Une barre latérale de table des matières fixe apparaît sur le côté droit des pages de détail des articles sur les grands écrans (≥1024px) :

- Générée automatiquement à partir des titres h2–h6 de l'article, présentée sous forme de liste indentée plate
- L'indentation reflète la profondeur du titre (h3 a un niveau d'indentation de plus que h2)
- La section actuelle est surlignée lors du défilement (IntersectionObserver)
- Cliquer sur une entrée TOC fait défiler en douceur jusqu'au titre correspondant
- Masquée sur les petits écrans (mobile), où la TOC repliable en ligne est disponible

Générée à partir des `headings` renvoyés par `render()` d'Astro — aucune maintenance manuelle de la TOC par l'auteur. La TOC repliable `remark-toc` en ligne (écrivez `## Table des matières` dans votre article) coexiste avec la barre latérale pour une utilisation sur petit écran.

## Catégories

Attribuez une catégorie à un article via le champ frontmatter `category` (une chaîne unique) :

```yaml
---
title: "Mon article"
category: "tutoriel"
---
```

- La page de catégorie se trouve à `/categories/<slug>/` ; le slug est normalisé via `slugifyStr` (CJK préservé, latin en minuscules avec traits d'union)
- L'index des catégories à `/categories/` liste toutes les catégories
- Les cartes d'articles et les pages de détail affichent automatiquement un lien de catégorie (cliquez pour accéder à la page de catégorie)
- Un article appartient à au plus une catégorie (contrairement aux multiples `tags`) ; les articles sans `category` n'apparaissent dans aucune catégorie
- Les pages de catégorie réutilisent `posts.perPage` pour la pagination et prennent en charge les routes miroir multilingues (`/en/categories/...`)
- Désactivez les catégories via `features.showCategories: false` (entrée de navigation et pages supprimées, sitemap filtré)
