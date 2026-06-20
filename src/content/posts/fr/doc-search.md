---
title: "Recherche"
pubDatetime: 2026-06-20T12:00:00+08:00
description: "Guide de recherche Xingluo couvrant l'intégration de la recherche plein texte Pagefind, la génération d'index, l'UI, la recherche multilingue et les performances."
tags:
  - documentation
  - search
category: "Documentation"
translationKey: doc-search
locale: fr
---

Xingluo intègre [Pagefind](https://pagefind.app/) pour la recherche plein texte statique, avec des index par langue et la persistance d'état View Transitions.

## Activation

Configurez via `features.search` :

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

Lorsqu'il est défini sur `false`, la page de recherche exécute `Astro.rewrite` vers 404 et aucune interface de recherche n'est générée.

## Fonctionnement

### Génération d'index

La troisième étape de construction, `pagefind --site dist`, analyse le répertoire `dist/` :

- Seules les pages avec l'attribut `data-pagefind-body` sont indexées
- Les index sont automatiquement répartis par langue (`zh-cn` et `en` ont chacun le leur)
- Les index sont générés dans `dist/pagefind/`

### Portée de l'index

Le `<main>` sur les pages de détail d'article est marqué `data-pagefind-body`, donc seuls les corps d'articles sont indexés. Les autres pages (accueil, listes, archives, etc.) n'entrent pas dans l'index de recherche.

## Interface de recherche

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implémente la page de recherche :

- Charge `@pagefind/default-ui` pour la zone de recherche et la liste de résultats
- Localise les assets d'index via `getAssetPath("pagefind/")`
- Les styles globaux remplacent les variables CSS Pagefind, les mappant au thème de Xingluo (`--background`, `--foreground`, `--primary`, etc.)
- `transition:persist` préserve l'état de recherche lors de la navigation

### Flux de recherche

1. L'utilisateur tape dans la zone de recherche
2. Pagefind recherche dans l'index de la langue actuelle
3. La liste des résultats affiche les articles correspondants (titre, surlignage du résumé)
4. `processTerm` écrit l'URL de la page de recherche avec les paramètres de requête dans sessionStorage, pour que le bouton retour puisse la restaurer

## Navigation arrière source

Le mécanisme de navigation arrière entre la page de recherche et les pages d'articles :

- Le composant `Main.astro` écrit l'URL de la page source dans `backUrl` du sessionStorage
- Le `BackButton.astro` de la page d'article préfère revenir à `backUrl` du sessionStorage, ou à la page d'accueil si absent
- Le `processTerm` de la page de recherche écrit l'URL avec les paramètres de requête, restaurant l'état de recherche lors du retour depuis un article

## Recherche multilingue

Pagefind répartit les index par attribut de langue des éléments `data-pagefind-body` :

- Pages `zh-cn` (racine) → Index chinois
- Pages `en` (préfixe `/en/`) → Index anglais

La recherche correspond automatiquement à l'index de la langue de la page actuelle.

## Adaptation du thème

L'interface utilisateur par défaut de Pagefind a ses propres variables CSS ; Xingluo les remplace avec des styles globaux dans `SearchView.astro`, en les mappant aux variables du thème shadcn :

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

Le mode sombre bascule automatiquement via le sélecteur `.dark`, cohérent avec le thème du site.

## Performances

- Les index Pagefind sont des fichiers statiques ; la recherche se fait côté client sans requêtes serveur
- Les index sont chargés à la demande (les fragments d'index ne sont téléchargés que lors de la recherche)
- `transition:persist` évite de réinitialiser l'interface de recherche lors de la navigation
