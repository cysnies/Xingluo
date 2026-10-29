---
title: "Système de commentaires"
pubDatetime: 2026-06-20T09:00:00+08:00
description: "Guide du système de commentaires Xingluo couvrant la sélection, la configuration et l'intégration de giscus, twikoo et waline."
tags:
  - documentation
  - comments
category: "Documentation"
translationKey: doc-comments
locale: fr
---

Xingluo intègre trois systèmes de commentaires — giscus, twikoo et waline — sélectionnables via `features.comments`.

## Configuration

Choisissez un fournisseur et fournissez sa configuration dans `features.comments` dans [`xingluo.config.ts`](../xingluo.config.ts) :

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* configuration giscus */ },
    // twikoo: { /* configuration twikoo */ },
    // waline: { /* configuration waline */ },
  },
}
```

Avec `provider: false` (par défaut), les commentaires sont désactivés et les pages d'articles n'émettent aucun marqueur ou script de commentaire.

## Emplacement de la section des commentaires

La section des commentaires apparaît uniquement en bas des **pages de détail des articles** (après la navigation précédent/suivant), rendue par [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro).

## giscus

Système de commentaires basé sur GitHub Discussions ; le dépôt doit être public avec Discussions activé.

### Configuration

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // Dépôt GitHub
    repoId: "R_...",              // ID du dépôt (généré par giscus.app)
    category: "Announcements",    // Nom de la catégorie de discussion
    categoryId: "DIC_...",        // ID de la catégorie (généré par giscus.app)
    mapping: "pathname",          // facultatif, mappage page-vers-discussion
    strict: false,                // facultatif, correspondance stricte du titre
    reactionsEnabled: true,       // facultatif, réactions
    inputPosition: "bottom",      // facultatif, position de la zone de commentaire : top | bottom
    loading: "lazy",              // facultatif, chargement : lazy | eager
  },
}
```

### Obtention de repoId / categoryId

1. Visitez [giscus.app](https://giscus.app)
2. Entrez le dépôt et la catégorie pour générer la configuration
3. Copiez `data-repo-id` et `data-category-id` dans votre configuration

### Fonctionnement

giscus injecte un iframe via le `client.js` officiel, avec des attributs `data-*` contenant la configuration. La langue est automatiquement mappée à la locale actuelle (`zh-cn` → `zh-CN`, `en` → `en`). Le thème est synchronisé lors du basculement via `postMessage`.

## twikoo

Système de commentaires sans dépendance backend, supportant Tencent CloudBase ou l'auto-hébergement.

### Configuration

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // ID d'environnement cloud ou URL d'auto-hébergement complète
    lang: "zh-CN",                            // facultatif, langue
  },
}
```

### Remarques sur envId

- Tencent CloudBase : saisissez l'ID d'environnement (nécessite le SDK cloudbase)
- Auto-hébergé : saisissez l'URL complète (ex. `https://twikoo.example.com`) ; twikoo détecte automatiquement le mode API HTTP

### Fonctionnement

twikoo importe dynamiquement `import("twikoo")` et appelle `init` lorsque le conteneur de commentaires entre dans la fenêtre. twikoo ne prend pas en charge le changement de thème à l'exécution ; le site le reconstruit lors du changement de thème pour appliquer les styles sombres.

## waline

Système de commentaires avec backend, avec compteurs de commentaires et de vues.

### Configuration

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Adresse du serveur Waline
    lang: "zh-CN",                           // facultatif, langue
    pageSize: 10,                            // facultatif, taille de page des commentaires
    dark: "html.dark",                       // facultatif, sélecteur sombre (par défaut site .dark)
  },
}
```

### Déploiement de serverURL

Consultez la [documentation Waline](https://waline.js.org/) pour déployer le serveur (Vercel / Cloudflare / auto-hébergement), puis mettez l'adresse dans `serverURL`.

### Fonctionnement

waline importe dynamiquement `import("@waline/client")` et le style `@waline/client/style` lorsque le conteneur de commentaires entre dans la fenêtre, puis appelle `init`. Le sélecteur `dark:"html.dark"` suit automatiquement le mode sombre du site ; aucune synchronisation manuelle nécessaire.

## Chargement différé

Tous les systèmes de commentaires sont chargés de manière différée via IntersectionObserver : les requêtes et l'initialisation se produisent uniquement lorsque le conteneur de commentaires est à moins de 200px de la fenêtre, évitant ainsi le coût de performance du premier affichage.

Voir [`src/scripts/comments.ts`](../src/scripts/comments.ts).

## Synchronisation du thème

Lorsque le thème du site change, le thème du système de commentaires se synchronise automatiquement :

| Système de commentaires | Méthode de synchronisation                                 |
| ----------------------- | ---------------------------------------------------------- |
| giscus                  | `postMessage({giscus:{setConfig:{theme}}})` vers l'iframe  |
| waline                  | Le sélecteur CSS `dark:"html.dark"` suit automatiquement   |
| twikoo                  | Surveille les changements de classe `.dark` et reconstruit |

La surveillance du thème utilise un `MutationObserver` sur les attributs `class` et `data-theme` de `document.documentElement`.

## Adaptation View Transitions

Le script de commentaire écoute `astro:page-load` et réanalyse les points de montage après chaque chargement de page. La réinitialisation est empêchée via des marqueurs `dataset` (`xng-setup`, `xng-init`).

## i18n

Le titre de la section des commentaires est localisé via `UIStrings.comments.title` ("Commentaires" dans `zh-cn.ts` et `en.ts`). La langue de l'interface du système de commentaires est contrôlée par le champ `lang` de chaque fournisseur.

## Extensions personnalisées

### Changement de fournisseur

Modifiez `features.comments.provider` dans `xingluo.config.ts` ; aucune modification de code n'est nécessaire. Xingluo rend le sous-composant correspondant automatiquement.

### Ajout d'un système de commentaires

1. Créez un nouveau composant sous `src/components/comments/` (ex. `Disqus.astro`) qui rend un conteneur de montage
2. Ajoutez une nouvelle branche de fournisseur dans le rendu conditionnel de `Comments.astro`
3. Ajoutez la logique d'initialisation dans `src/scripts/comments.ts`
4. Étendez `CommentProvider` et les types de configuration dans `src/types/config.ts`
