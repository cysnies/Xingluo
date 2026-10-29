---
title: "Guia de Configuração"
pubDatetime: 2026-06-20T04:00:00+08:00
description: "Referência completa de todas as opções de configuração do Xingluo, incluindo configuração do site, configuração de posts, recursos, links sociais, links de compartilhamento e variáveis de ambiente."
tags:
  - documentation
  - configuration
category: "Documentation"
translationKey: doc-configuration
locale: pt
---

Todas as opções configuráveis do Xingluo estão no arquivo raiz [`xingluo.config.ts`](../xingluo.config.ts). O arquivo fornece restrições de tipo completas via `defineXingluoConfig`; as alterações entram em vigor imediatamente sem tocar no código-fonte.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // URL do site, usado para links absolutos, RSS, sitemap
  title: "Xingluo",                      // Título do site
  description: "Um CMS de blog moderno construído com Astro e shadcn",
  author: "Xingluo",                     // Nome de autor padrão
  profile: "https://xingluo.example.com", // Página inicial do autor (usado para JSON-LD)
  ogImage: "default-og.jpg",              // Imagem OG padrão (no diretório public)
  lang: "zh-cn",                          // Idioma padrão
  timezone: "Asia/Shanghai",              // Fuso horário (exibição de data do post)
  dir: "ltr",                             // Direção do texto: ltr | rtl
  googleVerification: "",                 // Valor de verificação do Google Search Console (ou via variável de ambiente)
}
```

| Campo                | Padrão           | Notas                                                                                                               |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `url`                | obrigatório      | URL raiz do site; deve terminar com `/`                                                                             |
| `title`              | obrigatório      | Título do site, usado em `<title>` e OG                                                                             |
| `description`        | obrigatório      | Descrição do site, usada em meta e RSS                                                                              |
| `author`             | obrigatório      | Autor padrão; o frontmatter do post retorna a este valor                                                            |
| `profile`            | —                | Página inicial do autor, injetada em JSON-LD `author.url`                                                           |
| `ogImage`            | `default-og.jpg` | Nome do arquivo de imagem OG padrão, localizado em `public/`                                                        |
| `lang`               | obrigatório      | Código de idioma padrão; deve corresponder a `i18n.defaultLocale` em `astro.config.ts`                              |
| `timezone`           | `Asia/Shanghai`  | Fuso horário dayjs, afeta a exibição da data do post                                                                |
| `dir`                | `ltr`            | Direção do texto                                                                                                    |
| `googleVerification` | —                | Valor de verificação do Google; também pode ser injetado via variável de ambiente `PUBLIC_GOOGLE_SITE_VERIFICATION` |

## posts

```ts
posts: {
perPage: 8,              // Posts por página de lista
  perIndex: 5,             // Posts mostrados na página inicial
  scheduledPostMargin: 900000, // Tolerância de publicação programada (ms), 15 minutos
}
```

- `perPage`: tamanho da página para `/posts/[...page]` e `/tags/[tag]/[...page]`
- `perIndex`: número de posts mostrados na seção "Recentes" da página inicial
- `scheduledPostMargin`: posts futuros dentro desta janela são tratados como publicados (efetivo em produção; dev mostra todos)

## features

```ts
features: {
  lightAndDarkMode: true,
  dynamicOgImage: true,
  showArchives: true,
  showBackButton: true,
  editPost: { enabled: true, url: "https://github.com/.../edit/main/" },
  search: "flexsearch",
  mdx: true,
  comments: { provider: false /* giscus | twikoo | waline */ },
  players: { aplayer: false, dplayer: false },
}
```

| Campo              | Padrão             | Notas                                                                                    |
| ------------------ | ------------------ | ---------------------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | Ativar alternância modo claro/escuro                                                     |
| `dynamicOgImage`   | `true`             | Gerar imagens OG dinamicamente (satori + sharp)                                          |
| `showArchives`     | `true`             | Mostrar página de arquivos (sitemap filtra quando desativado)                            |
| `showCategories`   | `true`             | Mostrar página de categorias e entrada de navegação (sitemap filtra)                     |
| `showBackButton`   | `true`             | Mostrar botão voltar nas páginas de posts                                                |
| `editPost.enabled` | `false`            | Mostrar link "Editar esta página"                                                        |
| `editPost.url`     | `""`               | Prefixo do link de edição; o caminho relativo do post é anexado                          |
| `search`           | `"flexsearch"`     | Solução de busca: `"flexsearch"` ou `false`                                              |
| `mdx`              | `true`             | Ativar análise e renderização MDX (ver [Criação de conteúdo](./doc-content.md))          |
| `comments`         | `{provider:false}` | Configuração do sistema de comentários (ver [Sistema de comentários](./doc-comments.md)) |
| `players.aplayer`  | `false`            | Ativar player de áudio APlayer (ver [Reprodutores de mídia](./doc-media-players.md))     |
| `players.dplayer`  | `false`            | Ativar player de vídeo DPlayer                                                           |

### editPost

`editPost.url` é um prefixo de URL de edição do repositório; Xingluo anexa o caminho relativo do post (`src/content/posts/...`). Por exemplo:

```ts
editPost: { enabled: true, url: "https://github.com/owner/repo/edit/main/" }
```

O post `src/content/posts/welcome.md` produz o link `https://github.com/owner/repo/edit/main/src/content/posts/welcome.md`.

## socials

```ts
socials: [
  { name: "github", url: "https://github.com/xingluo/blog" },
  { name: "x", url: "https://x.com/xingluo" },
  { name: "mail", url: "mailto:hello@xingluo.example.com" },
];
```

- `name`: nome do ícone, correspondente a `src/assets/icons/socials/{name}.astro`. Integrados: `github`, `x`, `mail`, `facebook`, `telegram`, `weibo`
- `url`: URL do link; `mailto:` para email
- `linkTitle`: título acessível opcional; gerado automaticamente a partir do nome quando omitido

> Adicionar uma plataforma social: crie um componente de ícone `.astro` com o mesmo nome em `src/assets/icons/socials/`. `src/lib/socialIcons.ts` os coleta automaticamente via `import.meta.glob`.

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

Estas entradas de compartilhamento aparecem na parte inferior das páginas de posts. `url` é um prefixo de URL de compartilhamento; Xingluo anexa a URL absoluta do post atual. `name` também mapeia para um ícone em `src/assets/icons/socials/`.

## Variáveis de Ambiente

Declaradas via `env.schema` em `astro.config.ts`:

| Variável                          | Nível de acesso | Descrição                                               |
| --------------------------------- | --------------- | ------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | público/cliente | Valor de verificação do Google Search Console, opcional |

Exemplo (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "seu-código-de-verificação"
pnpm build
```

O valor é injetado em `config.site.googleVerification` e renderizado como `<meta name="google-site-verification">`.

## Exemplo Completo

Consulte [`xingluo.config.ts`](../xingluo.config.ts). As seções `features.comments` e `features.players` incluem exemplos comentados para giscus / twikoo / waline; descomente e preencha com valores reais para ativar.
