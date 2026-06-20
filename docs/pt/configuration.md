# Guia de configuração

Todas as opções configuráveis do Xingluo estão no arquivo raiz [`xingluo.config.ts`](../xingluo.config.ts). O arquivo fornece restrições de tipo completas via `defineXingluoConfig`; as alterações entram em vigor imediatamente sem tocar no código-fonte.

## site

```ts
site: {
  url: "https://xingluo.example.com/",  // URL do site, usado para links absolutos, RSS, sitemap
  title: "Xingluo",                      // Título do site
  description: "Um CMS de blog moderno construído com Astro e shadcn",
  author: "Xingluo",                     // Nome do autor padrão
  profile: "https://xingluo.example.com", // Página inicial do autor (usado para JSON-LD)
  ogImage: "default-og.jpg",              // Imagem OG padrão (no diretório public)
  lang: "zh-cn",                          // Idioma padrão
  timezone: "Asia/Shanghai",              // Fuso horário (exibição de data do post)
  dir: "ltr",                             // Direção do texto: ltr | rtl
  googleVerification: "",                 // Valor de verificação do Google Search Console (ou via env var)
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
  scheduledPostMargin: 900000, // Tolerância de publicação agendada (ms), 15 minutos
}
```

- `perPage`: tamanho da página para `/posts/[...page]` e `/tags/[tag]/[...page]`
- `perIndex`: número de posts mostrados na seção "Últimos" da página inicial
- `scheduledPostMargin`: posts futuros dentro desta janela são tratados como publicados (efetivo em produção; desenvolvimento mostra todos)

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

| Campo              | Padrão             | Notas                                                                                  |
| ------------------ | ------------------ | -------------------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`             | Ativar alternância de modo claro/escuro                                                |
| `dynamicOgImage`   | `true`             | Gerar imagens OG dinamicamente (satori + sharp)                                        |
| `showArchives`     | `true`             | Mostrar página de arquivos (sitemap filtra quando desativado)                          |
| `showCategories`   | `true`             | Mostrar página de categorias e entrada de navegação (sitemap filtra quando desativado) |
| `showBackButton`   | `true`             | Mostrar botão de voltar nas páginas de post                                            |
| `editPost.enabled` | `false`            | Mostrar link "Editar esta página"                                                      |
| `editPost.url`     | `""`               | Prefixo do link de edição; o caminho relativo do post é anexado                        |
| `search`           | `"pagefind"`       | Solução de busca: `"pagefind"` ou `false`                                              |
| `mdx`              | `true`             | Ativar análise e renderização MDX (veja [Criação de conteúdo](./content.md))           |
| `comments`         | `{provider:false}` | Configuração do sistema de comentários (veja [Sistema de comentários](./comments.md))  |
| `players.aplayer`  | `false`            | Ativar player de áudio APlayer (veja [Reprodutores de mídia](./media-players.md))      |
| `players.dplayer`  | `false`            | Ativar player de vídeo DPlayer                                                         |

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

Estas entradas de compartilhamento aparecem na parte inferior das páginas de posts. `url` é um prefixo de URL de compartilhamento; Xingluo anexa a URL absoluta do post atual. `name` também é mapeado para um ícone em `src/assets/icons/socials/`.

## Variáveis de Ambiente

Declarado via `env.schema` em `astro.config.ts`.

| Variável                          | Nível de acesso | Descrição                                               |
| --------------------------------- | --------------- | ------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | public / client | Valor de verificação do Google Search Console, opcional |

Exemplo (PowerShell):

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-verification-code"
pnpm build
```

O valor é injetado em `config.site.googleVerification` e renderizado como `<meta name="google-site-verification">`.

## Exemplo Completo

Veja [`xingluo.config.ts`](../xingluo.config.ts). As seções `features.comments` e `features.players` incluem exemplos comentados para giscus / twikoo / waline; descomente e preencha com valores reais para ativar.
