# Documentation Xingluo

Xingluo est un CMS de blog moderne construit avec [Astro](https://astro.build/) et le style visuel [shadcn/ui](https://ui.shadcn.com/). Il offre une expérience visuelle moderne grâce à des composants shadcn plats et élégants et au système de couleurs OKLCH, et intègre nativement un système de commentaires, un support MDX optionnel et des lecteurs audio/vidéo.

## Index de la documentation

| Document                                      | Contenu                                                                                |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| [Démarrage](./getting-started.md)             | Prérequis, installation, développement local, build et aperçu                          |
| [Guide de configuration](./configuration.md)  | Référence complète pour `xingluo.config.ts`                                            |
| [Rédaction de contenu](./content.md)          | Frontmatter des articles, syntaxe Markdown/MDX, blocs de code, callouts, améliorations |
| [Internationalisation](./i18n.md)             | Routage multilingue, chaînes UI, traduction au niveau du contenu, ajout d'une langue   |
| [Aperçu de l'architecture](./architecture.md) | Structure des répertoires, flux de configuration, flux de rendu, pipeline de build     |
| [Thème et styles](./theming.md)               | Variables de thème shadcn, OKLCH, Tailwind v4, mode sombre                             |
| [Système de commentaires](./comments.md)      | Choix et configuration de giscus / twikoo / waline                                     |
| [Lecteurs multimédia](./media-players.md)     | Utilisation d'APlayer / DPlayer en Markdown et MDX                                     |
| [SEO](./seo.md)                               | Images OG, RSS, sitemap, hreflang, canonical, données structurées                      |
| [Recherche](./search.md)                      | Intégration de la recherche plein texte Pagefind                                       |
| [Déploiement](./deployment.md)                | Hébergement statique, GitHub Pages, variables d'environnement, Docker                  |

## Fonctionnalités principales

- **Performance de premier ordre** : génération statique Astro, icônes SVG intégrées à la construction (zéro JS à l'exécution), chargement différé des commentaires et lecteurs, nettoyage des actifs orphelins
- **Visuels modernes** : composants shadcn/ui new-york, espace colorimétrique OKLCH, mode sombre fluide (protection FOUC)
- **Multilingue** : traduction au niveau UI et contenu, routage `prefixDefaultLocale: false`, déclarations SEO hreflang et x-default
- **Amélioration du contenu** : MDX optionnel, coloration syntaxique Shiki double thème, callouts, TOC pliable, tableaux défilants
- **Temps de lecture** : estimation intelligente (CJK par nombre de caractères, latin par nombre de mots), affiché sur les cartes et pages de détail
- **Articles connexes** : recommandés automatiquement par tags partagés
- **Catégories d'articles** : attribuées via frontmatter, avec pages de catégorie dédiées et entrée de navigation
- **Barre latérale TOC fixe** : table des matières fixe à droite sur les grands écrans, suivi du défilement IntersectionObserver
- **Système de commentaires** : giscus / twikoo / waline, sensible au thème, chargé à la demande
- **Lecteurs multimédia** : audio APlayer et vidéo DPlayer, avec points d'entrée MD fence et composant MDX
- **Recherche** : recherche plein texte Pagefind, index par langue, persistance d'état View Transitions
- **SEO complet** : images OG dynamiques (satori + sharp), RSS, sitemap, données structurées JSON-LD (BlogPosting + BreadcrumbList), normalisation canonical

## Stack technique

| Catégorie               | Technologie                                                     |
| ----------------------- | --------------------------------------------------------------- |
| Framework               | Astro 6.x                                                       |
| Style                   | Tailwind CSS v4, composants shadcn/ui, @tailwindcss/typography  |
| Icônes                  | astro-icon + Font Awesome                                       |
| Contenu                 | Astro Content Collections, MDX, chaîne de plugins remark/rehype |
| Coloration syntaxique   | Shiki                                                           |
| Recherche               | Pagefind                                                        |
| Images OG               | satori + sharp                                                  |
| Commentaires            | giscus / twikoo / waline                                        |
| Lecteurs                | APlayer / DPlayer                                               |
| Date                    | dayjs                                                           |
| Gestionnaire de paquets | pnpm                                                            |
| Langage                 | TypeScript                                                      |

## Licence

AGPL-3.0
