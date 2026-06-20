# Aperçu de l'architecture

Ce document décrit l'architecture globale de Xingluo, la structure des répertoires, le flux de configuration, le flux de rendu et le pipeline de build, pour vous aider à comprendre l'organisation du code et comment l'étendre.

## Structure du répertoire

```
xingluo/
├── astro.config.ts          # Configuration Astro (intégrations, i18n, markdown, polices, env)
├── xingluo.config.ts        # Entrée de configuration utilisateur
├── tsconfig.json            # Configuration TypeScript (strict + alias de chemin @/*)
├── package.json             # Dépendances et scripts
├── public/                  # Assets statiques (favicon.svg, image OG par défaut, etc.)
├── docs/                    # Documentation du projet (ce répertoire)
├── references/              # Sources des projets de référence en lecture seule (ne pas dépendre)
└── src/
    ├── config.ts            # Fusionner les valeurs par défaut, exporter la configuration résolue
    ├── content.config.ts    # Schémas de collection de contenu (posts, pages)
    ├── env.d.ts             # Déclarations de type pour modules tiers et variables d'environnement
    ├── assets/              # Composants d'icônes
    │   └── icons/           # astro-icon + Font Awesome (inclut socials/)
    ├── components/          # Composants UI
    │   ├── ui/              # Composants style shadcn (Button, Card, Badge, etc.)
    │   ├── post/            # Composants de page d'article (nav préc/suiv, retour, partage, etc.)
    │   ├── comments/        # Composants du système de commentaires
    │   ├── mdx/             # Composants MDX personnalisés (APlayer, DPlayer)
    │   ├── pageViews/       # Vues de page (logique de rendu centralisée)
    │   └── *.astro          # Composants de niveau racine (Header, Footer, PostCard, etc.)
    ├── content/             # Fichiers de contenu
    │   ├── posts/           # Articles de blog
    │   └── pages/           # Pages statiques
    ├── i18n/                # Internationalisation
    │   ├── index.ts         # Chargement de langue et useTranslations
    │   ├── types.ts         # Type UIStrings complet
    │   ├── routing.ts       # Résolution de chemin de locale
    │   ├── staticPaths.ts   # getStaticPaths pour les locales non par défaut
    │   ├── format.ts        # Remplacement de chaîne de modèle
    │   └── lang/            # Fichiers de ressources linguistiques (zh-cn.ts, en.ts)
    ├── layouts/             # Mises en page
    │   ├── Layout.astro     # Squelette de base (head, SEO, FOUC)
    │   └── PostLayout.astro # Mise en page d'article (JSON-LD, meta article)
    ├── lib/                 # Utilitaires fondamentaux
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # Instance dayjs et plugin de fuseau horaire
    │   └── socialIcons.ts   # Résolution dynamique d'icônes sociales
    ├── pages/               # Routes (racine + miroir [locale]/)
    ├── scripts/             # Scripts côté client
    │   ├── theme.ts         # Basculement de thème
    │   ├── postEnhancements.ts # Améliorations d'article (ancres, copie, lightbox, progression)
    │   ├── comments.ts      # Chargement différé des commentaires et synchronisation du thème
    │   └── players.ts       # Chargement différé des lecteurs
    ├── styles/              # Styles
    │   ├── global.css       # Entrée Tailwind + couche de base + utilitaires personnalisés
    │   ├── theme.css        # Variables de thème shadcn (OKLCH)
    │   └── typography.css   # Typographie .app-prose et styles de blocs de code
    ├── types/               # Déclarations de type
    │   ├── config.ts        # Types de configuration
    │   └── *.d.ts           # Déclarations pour modules tiers non typés
    └── utils/               # Fonctions utilitaires
        ├── getPostPaths.ts  # Dérivation de slug et d'URL d'article
        ├── getSortedPosts.ts# Tri des articles
        ├── postFilter.ts    # Filtrage des brouillons et articles programmés
        ├── getUniqueTags.ts # Déduplication des balises
        ├── remarkPlayers.ts # Plugin remark pour lecteurs
        ├── rehypeWrapTable.ts# Enveloppe de défilement de tableau
        └── ...              # Autres utilitaires
```

## Flux de configuration

```
xingluo.config.ts
   │ defineXingluoConfig (type constraints, passthrough)
   ▼
src/config.ts
   │ resolveConfig (merge defaults + resolveComments + resolvePlayers)
   ▼
src/types/config.ts
   │ XingluoConfig (full type)
   ▼
Referenced site-wide via import config from "@/config"
```

Points clés :

- `xingluo.config.ts` est le seul fichier de configuration que les utilisateurs doivent modifier
- `resolveConfig` dans `src/config.ts` effectue des fusions superficielles (`site`/`posts`) et des fusions profondes (`features.editPost`, `features.comments`, `features.players`)
- `astro.config.ts` lit le `./xingluo.config` non résolu (car le chargement des intégrations est décidé au niveau de la configuration Astro), donc il accède à `features` avec le chaînage optionnel
- `src/content.config.ts` lit le `@/config` résolu, donc `features` est obligatoire

## Flux de rendu

### Rendu des pages

Xingluo utilise un modèle « wrapper de page mince + composant de vue », centralisant la logique de rendu dans `src/components/pageViews/` :

```
src/pages/posts/[...slug]/index.astro   ← wrapper mince : getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← logique de rendu
    │
    ▼
src/layouts/PostLayout.astro  ← layout d'article (JSON-LD, meta article)
    │
    ▼
src/layouts/Layout.astro      ← squelette de base (head, SEO, FOUC, ClientRouter)
```

La page wrapper mince gère uniquement `getStaticPaths` et le passage des props ; le composant de vue contient toute la logique de rendu. Les pages miroir `[locale]/` sont également des wrappers minces, générant uniquement les locales non par défaut via `getLocaleParams()`.

### Routage

```
src/pages/
├── 404.astro                      # 404 (non miroir)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # Point de terminaison d'image OG niveau site
├── rss.xml.ts                     # Point de terminaison RSS
├── robots.txt.ts                  # Point de terminaison robots.txt
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # Point de terminaison d'image OG niveau article
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Miroir des locales non défaut (getStaticPaths=getLocaleParams)
    └── (la structure reflète la racine, sauf 404, og.png, rss, robots)
```

### Dérivation des URL de publication

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: dérive le slug de routage à partir de l'`id` de la collection de contenu et du chemin de fichier, en filtrant les répertoires préfixés par `_`
- `getPostUrl(id, filePath, locale)`: génère une URL navigable avec le préfixe de locale (la locale par défaut n'a pas de préfixe)

### Filtrage et tri des publications

- [`postFilter.ts`](../src/utils/postFilter.ts): exclut les brouillons ; filtre les publications futures en production en utilisant `pubDatetime - scheduledPostMargin` ; le développement montre tout
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): après filtrage, tri descendant par `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): déduplique et trie les tags par slug

## Scripts côté client

Les interactions côté client de Xingluo sont chargées via des balises `<script>` en bas des pages, toutes adaptées pour View Transitions :

| Script                | Emplacement de chargement                                 | Adaptation d'événement                                                                                                     | Responsabilités                                                           |
| --------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `theme.ts`            | fin du body de `Layout.astro`                             | reconnexion sur `astro:after-swap`, transport de theme-color sur `astro:before-swap`, changement de `prefers-color-scheme` | Persistance et basculement du thème                                       |
| `postEnhancements.ts` | `PostDetailView.astro`                                    | réinitialisation sur `astro:page-load`                                                                                     | Ancres d'en-tête, copie de code, progression de lecture, lightbox d'image |
| `comments.ts`         | `Comments.astro`                                          | réanalyse sur `astro:page-load`                                                                                            | Chargement paresseux des commentaires et synchronisation du thème         |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (conditionnel) | réanalyse sur `astro:page-load`                                                                                            | Chargement paresseux des lecteurs                                         |

> Note : `comments.ts` et `players.ts` n'ont pas d'import/export de niveau supérieur ; ajoutez `export {}` à la fin du fichier pour le marquer comme module et éviter les conflits de déclaration globale avec d'autres fichiers.

## Pipeline de build

`pnpm run build` = `astro check && astro build && pagefind --site dist`

1. **`astro check`** : Vérification des types TypeScript + templates Astro
2. **`astro build`** :
   - Collecte des collections de contenu (inclut `.mdx` selon `features.mdx`)
   - Génération statique de toutes les pages (y compris les miroirs `[locale]/`)
   - Génération des points de terminaison : RSS, sitemap, robots.txt, images OG au niveau site et article
   - Chargement conditionnel de l'intégration `mdx()` ; injection conditionnelle de `remarkPlayers`
   - SVG icônes inline au moment de la build (astro-icon, zéro JS runtime)
   - Les modules de commentaires et lecteurs importés dynamiquement sont divisés en chunks autonomes (chargés paresseusement)
3. **`pagefind --site dist`** : scanne le contenu `dist/` marqué avec `data-pagefind-body`, générant des index de recherche par langue dans `dist/pagefind/`

## Stratégies de performance

- **Icônes zéro JS runtime** : astro-icon inline les SVG Font Awesome à la build (mode sprite `<symbol>`)
- **Optimisation SVG** : `experimental.svgOptimizer` (svgo) compresse les SVG inline et référencés
- **Chargement paresseux à la demande** : les commentaires et lecteurs importent dynamiquement via IntersectionObserver lorsqu'ils défilent dans la vue ; zéro bundle quand désactivés
- **Intégrations conditionnelles** : avec MDX désactivé, l'intégration `mdx()` n'est pas chargée ; avec les lecteurs désactivés, le plugin remark n'est pas injecté
- **Taille CSS** : Tailwind v4 génère à la demande ; les variables OKLCH sont gérées centralement
- **Polices d'images OG** : utilisées uniquement par satori, non injectées dans le CSS du site
- **View Transitions** : `<ClientRouter/>` alimente les animations de transition de page ; la boîte de recherche utilise `transition:persist` pour conserver l'état

## Guide d'extension

### Ajout d'une page

1. Créez un fichier `.astro` dans `src/pages/` (wrapper mince)
2. Créez le composant View correspondant dans `src/components/pageViews/`
3. Pour le support multilingue, créez un wrapper mince miroir du même nom dans `src/pages/[locale]/`

### Ajout d'un composant UI

Suivez le style shadcn : créez des composants `.astro` et des configurations de variantes `.ts` sous `src/components/ui/` (en utilisant `class-variance-authority`).

### Ajout d'un script côté client

Créez un fichier `.ts` dans `src/scripts/`, ajoutez `export {}` à la fin pour le marquer comme module, écoutez `astro:page-load` pour vous adapter aux View Transitions, et importez-le dans une balise `<script>` sur la page concernée.
