# Guide de configuration

Toutes les options configurables de Xingluo se trouvent dans [`xingluo.config.ts`](../xingluo.config.ts) à la racine. Le fichier fournit des contraintes de type complètes via `defineXingluoConfig` ; les modifications prennent effet immédiatement sans toucher au code source.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // URL du site, utilisé pour les liens absolus, RSS, sitemap
  title: "Xingluo",                      // Titre du site
  description: "A modern blog CMS built with Astro and shadcn",
  author: "Xingluo",                     // Nom d'auteur par défaut
  profile: "https://xingluo.example.com", // Page d'accueil de l'auteur (utilisé pour JSON-LD)
  ogImage: "default-og.jpg",              // Image OG par défaut (dans le répertoire public)
  lang: "zh-cn",                          // Langue par défaut
  timezone: "Asia/Shanghai",              // Fuseau horaire (affichage des dates)
  dir: "ltr",                             // Direction du texte : ltr | rtl
  googleVerification: "",                 // Valeur de vérification Google Search Console (ou via variable d'env)
}
```

| Champ                | Défaut           | Notes                                                                                                            |
| -------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| `url`                | requis           | URL racine du site ; doit se terminer par `/`                                                                    |
| `title`              | requis           | Titre du site, utilisé dans `<title>` et OG                                                                      |
| `description`        | requis           | Description du site, utilisée dans meta et RSS                                                                   |
| `author`             | requis           | Auteur par défaut ; le frontmatter de l'article revient à cette valeur                                           |
| `profile`            | —                | Page d'accueil de l'auteur, injectée dans JSON-LD `author.url`                                                   |
| `ogImage`            | `default-og.jpg` | Nom du fichier image OG par défaut, situé dans `public/`                                                         |
| `lang`               | requis           | Code de langue par défaut ; doit correspondre à `i18n.defaultLocale` dans `astro.config.ts`                      |
| `timezone`           | `Asia/Shanghai`  | Fuseau horaire dayjs, affecte l'affichage des dates                                                              |
| `dir`                | `ltr`            | Direction du texte                                                                                               |
| `googleVerification` | —                | Valeur de vérification Google ; peut aussi être injectée via la variable d'env `PUBLIC_GOOGLE_SITE_VERIFICATION` |

## posts

```ts
posts: {
  perPage: 8,              // Articles par page de liste
  perIndex: 5,             // Articles affichés sur la page d'accueil
  scheduledPostMargin: 900000, // Tolérance de publication programmée (ms), 15 minutes
}
```

- `perPage` : taille de page pour `/posts/[...page]` et `/tags/[tag]/[...page]`
- `perIndex` : nombre d'articles affichés dans la section "Récents" de la page d'accueil
- `scheduledPostMargin` : les articles futurs dans cette fenêtre sont traités comme publiés (effectif en production ; le développement montre tout)

## features

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "pagefind",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| Field              | Default            | Notes                                                                                         |
| ------------------ | ------------------ | --------------------------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | Activer le basculement mode clair/sombre                                                      |
| `dynamicOgImage`   | `true`             | Générer dynamiquement les images OG (satori + sharp)                                          |
| `showArchives`     | `true`             | Afficher la page d'archives (le sitemap filtre quand désactivé)                               |
| `showCategories`   | `true`             | Afficher la page des catégories et l'entrée de navigation (le sitemap filtre quand désactivé) |
| `showBackButton`   | `true`             | Afficher un bouton retour sur les pages d'articles                                            |
| `editPost.enabled` | `false`            | Afficher un lien "Modifier cette page"                                                        |
| `editPost.url`     | `""`               | Préfixe du lien d'édition ; le chemin source relatif de l'article est ajouté                  |
| `search`           | `"pagefind"`       | Solution de recherche : `"pagefind"` ou `false`                                               |
| `mdx`              | `true`             | Activer l'analyse et le rendu MDX (voir [Rédaction de contenu](./content.md))                 |
| `comments`         | `{provider:false}` | Configuration du système de commentaires (voir [Système de commentaires](./comments.md))      |
| `players.aplayer`  | `false`            | Activer le lecteur audio APlayer (voir [Lecteurs multimédia](./media-players.md))             |
| `players.dplayer`  | `false`            | Activer le lecteur vidéo DPlayer                                                              |

### editPost

`editPost.url` est un préfixe d'URL d'édition de dépôt ; Xingluo ajoute le chemin source relatif de l'article (`src/content/posts/...`). Par exemple :

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

L'article `src/content/posts/welcome.md` produit le lien `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name` : nom de l'icône, correspondant à `src/assets/icons/socials/{name}.astro`. Intégré : `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url` : URL du lien ; `mailto:` pour l'email
- `linkTitle` : titre accessible optionnel ; généré automatiquement à partir du nom quand omis

> Ajouter une plateforme sociale : créez un composant d'icône `.astro` du même nom dans `src/assets/icons/socials/`. `src/lib/socialIcons.ts` les collecte automatiquement via `import.meta.glob`.

## shareLinks

```ts
shareLinks: [
  { name: "x", url: "https://x.com/intent/post?url=" },
  { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
  { name: "telegram", url: "https://t.me/share/url?url=" },
  { name: "weibo", url: "https://service.weibo.com/share/share.php?url=" },
  { name: "mail", url: "mailto:?subject=...&body=" },
];
```

Ces entrées de partage apparaissent en bas des pages d'articles. `url` est un préfixe d'URL de partage ; Xingluo ajoute l'URL absolue de l'article actuel. `name` correspond également à une icône sous `src/assets/icons/socials/`.

## Variables d'environnement

Déclaré via `env.schema` dans `astro.config.ts` :

| Variable                          | Niveau d'accès  | Description                                               |
| --------------------------------- | --------------- | --------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Valeur de vérification Google Search Console, optionnelle |

Exemple (PowerShell) :

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

La valeur est injectée dans `config.site.googleVerification` et rendue sous la forme `<meta name="google-site-verification">`.

## Exemple complet

Voir [`xingluo.config.ts`](../xingluo.config.ts). Les sections `features.comments` et `features.players` incluent des exemples commentés pour giscus / twikoo / waline ; décommentez et remplissez avec des valeurs réelles pour activer.
