# Recherche

Xingluo intègre [Flexsearch](https://github.com/nextapps-de/flexsearch) pour la recherche plein texte côté client, avec des index par langue et la persistance d'état View Transitions.

## Activation

Configurez via `features.search` :

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

Lorsqu'elle est définie sur `false`, la page de recherche fait un `Astro.rewrite` vers 404 et aucune UI de recherche n'est générée.

## Comment ça fonctionne

### Génération d'index

La troisième étape de build, `node scripts/generateSearchIndex.mjs`, scanne les fichiers HTML dans le répertoire `dist/` :

- Analyse le contenu des pages et extrait le texte des articles
- Les index sont automatiquement divisés par langue (`zh-cn` et `en` ont chacun le leur)
- Les index sont générés dans `dist/search/`

### Périmètre d'indexation

Le script de build analyse le contenu `<main>` des pages de détail d'article, donc seuls les corps d'articles sont indexés. Les autres pages (accueil, listes, archives, etc.) n'entrent pas dans l'index de recherche.

## UI de recherche

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implémente la page de recherche :

- Utilise l'index côté client Flexsearch pour la correspondance de recherche dans le navigateur
- Localise les assets d'index via `getAssetPath("search/")`
- Utilise les variables de thème shadcn (`--background`, `--foreground`, `--primary`, etc.) pour le style de la boîte de recherche et de la liste de résultats
- `transition:persist` préserve l'état de recherche lors de la navigation

### Flux de recherche

1. L'utilisateur tape dans la boîte de recherche
2. Flexsearch recherche dans l'index de la langue actuelle
3. La liste de résultats affiche les articles correspondants (titre, surlignage du résumé)
4. `processTerm` écrit l'URL de la page de recherche avec les paramètres de requête dans sessionStorage, pour que le bouton retour puisse restaurer l'état

## Navigation retour

Le mécanisme de navigation retour entre la page de recherche et les pages d'articles :

- Le composant `Main.astro` écrit l'URL de la page source dans `backUrl` de sessionStorage
- Le `BackButton.astro` de la page d'article préfère revenir à `backUrl` de sessionStorage, ou à la page d'accueil si absent
- Le `processTerm` de la page de recherche écrit l'URL avec les paramètres de requête, restaurant l'état de recherche lors du retour depuis un article

## Recherche multilingue

Flexsearch divise les index par langue de page :

- Pages `zh-cn` (racine) → index chinois
- Pages `en` (préfixe `/en/`) → index anglais

La recherche utilise automatiquement l'index correspondant à la langue de la page actuelle : chinois sur les pages chinoises, anglais sur les pages anglaises.

## Adaptation du thème

L'UI de recherche Flexsearch utilise les variables de thème shadcn, définies dans `SearchView.astro` pour le style de la boîte de recherche et de la liste de résultats :

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
- Les index sont chargés à la demande (les fragments d'index se téléchargent uniquement lors de la recherche)
- `transition:persist` évite de réinitialiser l'UI de recherche lors de la navigation
