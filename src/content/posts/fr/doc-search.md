---
title: "Recherche"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Guide de recherche Xingluo couvrant l'intégration de la recherche plein texte Flexsearch, la génération d'index, l'UI, la recherche multilingue et les performances."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: fr
---

Xingluo intègre [Flexsearch](https://github.com/nextapps-de/flexsearch) pour la recherche plein texte côté client, avec des index par langue et la persistance d'état View Transitions.

## Activation

Configurez via `features.search` :

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

Lorsqu'il est défini sur `false`, la page de recherche exécute `Astro.rewrite` vers 404 et aucune interface de recherche n'est générée.

## Fonctionnement

### Génération d'index

La troisième étape de construction, `node scripts/generateSearchIndex.mjs`, analyse les fichiers HTML dans le répertoire `dist/` :

- Analyse le contenu des pages et extrait le texte des articles
- Les index sont automatiquement répartis par langue (`zh-cn` et `en` ont chacun le leur)
- Les index sont générés dans `dist/search/`

### Portée de l'index

Le script de construction analyse le contenu `<main>` sur les pages de détail d'article, donc seuls les corps d'articles sont indexés. Les autres pages (accueil, listes, archives, etc.) n'entrent pas dans l'index de recherche.

## Interface de recherche

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implémente la page de recherche :

- Utilise l'index côté client Flexsearch pour la correspondance de recherche dans le navigateur
- Localise les assets d'index via `getAssetPath("search/")`
- Utilise les variables de thème shadcn (`--background`, `--foreground`, `--primary`, etc.) pour le style de la zone de recherche et de la liste de résultats
- `transition:persist` préserve l'état de recherche lors de la navigation

### Flux de recherche

1. L'utilisateur tape dans la zone de recherche
2. Flexsearch recherche dans l'index de la langue actuelle
3. La liste des résultats affiche les articles correspondants (titre, dates de publication/mise à jour, badge de catégorie, tags, extrait de contenu correspondant)
4. `processTerm` écrit l'URL de la page de recherche avec les paramètres de requête dans sessionStorage, pour que le bouton retour puisse la restaurer

## Navigation arrière source

Le mécanisme de navigation arrière entre la page de recherche et les pages d'articles :

- Le composant `Main.astro` écrit l'URL de la page source dans `backUrl` du sessionStorage
- Le `BackButton.astro` de la page d'article préfère revenir à `backUrl` du sessionStorage, ou à la page d'accueil si absent
- Le `processTerm` de la page de recherche écrit l'URL avec les paramètres de requête, restaurant l'état de recherche lors du retour depuis un article

## Recherche multilingue

Flexsearch répartit les index par langue de page :

- Pages `zh-cn` (racine) → Index chinois
- Pages `en` (préfixe `/en/`) → Index anglais

La recherche correspond automatiquement à l'index de la langue de la page actuelle.

## Adaptation du thème

L'interface de recherche Flexsearch utilise les variables de thème shadcn, définies dans `SearchView.astro` pour le style de la zone de recherche et de la liste de résultats :

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

Le mode sombre bascule automatiquement via le sélecteur `.dark`, cohérent avec le thème du site.

## Performances

- Les index Flexsearch sont des fichiers statiques ; la recherche se fait côté client sans requêtes serveur
- Les index sont chargés à la demande (les fragments d'index ne sont téléchargés que lors de la recherche)
- `transition:persist` évite de réinitialiser l'interface de recherche lors de la navigation
