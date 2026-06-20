# Recherche

Xingluo intègre [Pagefind](https://pagefind.app/) pour la recherche plein texte statique, avec des index par langue et la persistance d'état View Transitions.

## Activation

Configurez via `features.search` :

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

Lorsqu'elle est définie sur `false`, la page de recherche fait un `Astro.rewrite` vers 404 et aucune UI de recherche n'est générée.

## Comment ça fonctionne

### Génération d'index

La troisième étape de build, `pagefind --site dist`, scanne le répertoire `dist/` :

- Seules les pages avec l'attribut `data-pagefind-body` sont indexées
- Les index sont automatiquement divisés par langue (`zh-cn` et `en` ont chacun le leur)
- Les index sont générés dans `dist/pagefind/`

### Périmètre d'indexation

Le `<main>` des pages de détail d'article est marqué `data-pagefind-body`, donc seuls les corps d'articles sont indexés. Les autres pages (accueil, listes, archives, etc.) n'entrent pas dans l'index de recherche.

## UI de recherche

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implémente la page de recherche :

- Charge `@pagefind/default-ui` pour la boîte de recherche et la liste de résultats
- Localise les assets d'index via `getAssetPath("pagefind/")`
- Les styles globaux remplacent les variables CSS de Pagefind, les mappant au thème de Xingluo (`--background`, `--foreground`, `--primary`, etc.)
- `transition:persist` préserve l'état de recherche lors de la navigation

### Flux de recherche

1. L'utilisateur tape dans la boîte de recherche
2. Pagefind recherche dans l'index de la langue actuelle
3. La liste de résultats affiche les articles correspondants (titre, surlignage du résumé)
4. `processTerm` écrit l'URL de la page de recherche avec les paramètres de requête dans sessionStorage, pour que le bouton retour puisse restaurer l'état

## Navigation retour

Le mécanisme de navigation retour entre la page de recherche et les pages d'articles :

- Le composant `Main.astro` écrit l'URL de la page source dans `backUrl` de sessionStorage
- Le `BackButton.astro` de la page d'article préfère revenir à `backUrl` de sessionStorage, ou à la page d'accueil si absent
- Le `processTerm` de la page de recherche écrit l'URL avec les paramètres de requête, restaurant l'état de recherche lors du retour depuis un article

## Recherche multilingue

Pagefind divise les index par l'attribut de langue des éléments `data-pagefind-body` :

- Pages `zh-cn` (racine) → index chinois
- Pages `en` (préfixe `/en/`) → index anglais

La recherche utilise automatiquement l'index correspondant à la langue de la page actuelle : chinois sur les pages chinoises, anglais sur les pages anglaises.

## Adaptation du thème

L'UI par défaut de Pagefind a ses propres variables CSS ; Xingluo les remplace avec des styles globaux dans `SearchView.astro`, les mappant aux variables du thème shadcn :

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
- Les index sont chargés à la demande (les fragments d'index se téléchargent uniquement lors de la recherche)
- `transition:persist` évite de réinitialiser l'UI de recherche lors de la navigation
