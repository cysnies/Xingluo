# Démarrage

Ce guide vous aide à démarrer Xingluo pour le développement local et les builds de production à partir de zéro.

## Prérequis

| Dépendance | Version minimale | Notes                                                      |
| ---------- | ---------------- | ---------------------------------------------------------- |
| Node.js    | 22.12.0          | Voir `engines.node` dans `package.json`                    |
| pnpm       | 10.x             | Gestionnaire de paquets (le projet utilise pnpm workspace) |

> Astuce : gérez les versions de Node avec [fnm](https://github.com/Schniz/fnm) ou [nvm](https://github.com/nvm-sh/nvm).

## Installation

Après avoir cloné le dépôt, installez les dépendances :

```bash
pnpm install
```

Une fois les dépendances installées, les projets de référence sous `references/` sont automatiquement exclus de la compilation TypeScript et des builds (voir `exclude` dans `tsconfig.json`).

## Développement local

Démarrez le serveur de développement (par défaut sur `http://localhost:4321/`) :

```bash
pnpm dev
```

En mode développement :

- Les brouillons et les articles programmés sont **tous visibles** (pour prévisualisation) ; ils sont filtrés uniquement lors des builds de production
- Les modifications des collections de contenu déclenchent un rechargement à chaud
- Les comportements côté client (basculement de thème, View Transitions, etc.) correspondent à la production

## Synchronisation des types

Après avoir modifié les schémas ou les types de la collection de contenu, exécutez sync pour rafraîchir `.astro/types.d.ts` :

```bash
pnpm sync
```

## Construction

La build de production comporte trois étapes (voir le script `build` dans `package.json`) :

```bash
pnpm build
```

1. **`astro check`** : vérification des types TypeScript et des modèles Astro ; toute erreur interrompt la build
2. **`astro build`** : génère statiquement l'ensemble du site dans `dist/` (y compris les images OG dynamiques, RSS, sitemap, robots.txt)
3. **`node scripts/generateSearchIndex.mjs`** : scanne `dist/` pour générer l'index de recherche plein texte dans `dist/search/`

> Note : L'index de recherche est généré par un script Node après la construction.

## Aperçu de la construction

Prévisualisez la sortie de build dans `dist/` localement :

```bash
pnpm preview
```

## Qualité du code

| Commande            | Objectif                                                         |
| ------------------- | ---------------------------------------------------------------- |
| `pnpm format`       | Formate tout le code avec Prettier (y compris Astro et Tailwind) |
| `pnpm format:check` | Vérifie la conformité du formatage (utilisé en CI)               |
| `pnpm lint`         | Vérifications ESLint (y compris `eslint-plugin-astro`)           |

## Prochaines étapes

- Lisez le [Guide de configuration](./configuration.md) pour personnaliser les informations du site et les fonctionnalités
- Lisez [Rédaction de contenu](./content.md) pour commencer à écrire
- Lisez [Déploiement](./deployment.md) pour publier votre site
