---
title: "Visão Geral da Arquitetura"
pubDatetime: 2026-06-20T07:00:00+08:00
description: "Visão geral da arquitetura do Xingluo cobrindo estrutura de diretórios, fluxo de configuração, fluxo de renderização, pipeline de compilação e guia de extensão."
tags:
  - documentation
  - architecture
category: "Documentation"
translationKey: doc-architecture
locale: pt
---

Este documento descreve a arquitetura geral do Xingluo, estrutura de diretórios, fluxo de configuração, fluxo de renderização e pipeline de compilação, para ajudar você a entender a organização do código e como estendê-lo.

## Estrutura de diretórios

```
xingluo/
├── astro.config.ts          # Configuração Astro (integrações, i18n, markdown, fontes, env)
├── xingluo.config.ts        # Entrada de configuração do usuário
├── tsconfig.json            # Configuração TypeScript (strict + alias de caminho @/*)
├── package.json             # Dependências e scripts
├── public/                  # Ativos estáticos (favicon.svg, imagem OG padrão, etc.)
├── docs/                    # Documentação do projeto (este diretório)
├── references/              # Fontes de projeto de referência somente leitura (não devem ser dependidas)
└── src/
    ├── config.ts            # Mesclar valores padrão, exportar configuração resolvida
    ├── content.config.ts    # Esquemas de coleção de conteúdo (posts, pages)
    ├── env.d.ts             # Declarações de tipo para módulos de terceiros e variáveis de ambiente
    ├── assets/              # Componentes de ícone
    │   └── icons/           # astro-icon + Font Awesome (inclui socials/)
    ├── components/          # Componentes UI
    │   ├── ui/              # Componentes estilo shadcn (Button, Card, Badge, etc.)
    │   ├── post/            # Componentes de página de post (nav ant/próx, voltar, compartilhar, etc.)
    │   ├── comments/        # Componentes do sistema de comentários
    │   ├── mdx/             # Componentes MDX personalizados (APlayer, DPlayer)
    │   ├── pageViews/       # Visualizações de página (lógica de renderização centralizada)
    │   └── *.astro          # Componentes de nível raiz (Header, Footer, PostCard, etc.)
    ├── content/             # Arquivos de conteúdo
    │   ├── posts/           # Posts do blog
    │   └── pages/           # Páginas estáticas
    ├── i18n/                # Internacionalização
    │   ├── index.ts         # Carregamento de idioma e useTranslations
    │   ├── types.ts         # Tipo UIStrings completo
    │   ├── routing.ts       # Resolução de caminho de locale
    │   ├── staticPaths.ts   # getStaticPaths para locales não padrão
    │   ├── format.ts        # Substituição de string de modelo
    │   └── lang/            # Arquivos de recurso de idioma (zh-cn.ts, en.ts)
    ├── layouts/             # Layouts
    │   ├── Layout.astro     # Esqueleto base (head, SEO, FOUC)
    │   └── PostLayout.astro # Layout de post (JSON-LD, meta artigo)
    ├── lib/                 # Utilitários fundamentais
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # Instância dayjs e plugin de fuso horário
    │   └── socialIcons.ts   # Resolução dinâmica de ícones sociais
    ├── pages/               # Rotas (raiz + espelho [locale]/)
    ├── scripts/             # Scripts do lado do cliente
    │   ├── theme.ts         # Alternância de tema
    │   ├── postEnhancements.ts # Melhorias de post (âncoras, cópia, lightbox, progresso)
    │   ├── comments.ts      # Carregamento lento de comentários e sincronização de tema
    │   └── players.ts       # Carregamento lento de players
    ├── styles/              # Estilos
    │   ├── global.css       # Entrada Tailwind + camada base + utilitários personalizados
    │   ├── theme.css        # Variáveis de tema shadcn (OKLCH)
    │   └── typography.css   # Tipografia .app-prose e estilos de bloco de código
    ├── types/               # Declarações de tipo
    │   ├── config.ts        # Tipos de configuração
    │   └── *.d.ts           # Declarações para módulos de terceiros não tipados
    └── utils/               # Funções utilitárias
        ├── getPostPaths.ts  # Derivação de slug e URL de post
        ├── getSortedPosts.ts# Classificação de posts
        ├── postFilter.ts    # Filtragem de rascunhos e posts agendados
        ├── getUniqueTags.ts # Deduplicação de tags
        ├── remarkPlayers.ts # Plugin remark para players
        ├── rehypeWrapTable.ts# Invólucro de rolagem de tabela
        └── ...              # Outras utilidades
```

## Fluxo de configuração

```
xingluo.config.ts
   │ defineXingluoConfig (restrições de tipo, passagem)
   ▼
src/config.ts
   │ resolveConfig (mesclar padrões + resolveComments + resolvePlayers)
   ▼
src/types/config.ts
   │ XingluoConfig (tipo completo)
   ▼
Referenciado em todo o site via import config from "@/config"
```

Pontos-chave:

- `xingluo.config.ts` é o único arquivo de configuração que os usuários precisam editar
- `resolveConfig` em `src/config.ts` faz mesclagens superficiais (`site`/`posts`) e mesclagens profundas (`features.editPost`, `features.comments`, `features.players`)
- `astro.config.ts` lê o `./xingluo.config` não resolvido (pois o carregamento da integração é decidido na camada de configuração do Astro), então acessa `features` com encadeamento opcional
- `src/content.config.ts` lê o `@/config` resolvido, então `features` é obrigatório

## Fluxo de renderização

### Renderização de página

Xingluo usa um padrão "wrapper fino + componente de visão", centralizando a lógica de renderização em `src/components/pageViews/`:

```
src/pages/posts/[...slug]/index.astro   ← wrapper fino: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← lógica de renderização
    │
    ▼
src/layouts/PostLayout.astro  ← layout de post (JSON-LD, metadados do artigo)
    │
    ▼
src/layouts/Layout.astro      ← esqueleto base (head, SEO, FOUC, ClientRouter)
```

A página wrapper fino lida apenas com `getStaticPaths` e passagem de props; o componente de visão contém toda a lógica de renderização. As páginas espelho `[locale]/` são também wrappers finos, gerando apenas locales não padrão via `getLocaleParams()`.

### Roteamento

```
src/pages/
├── 404.astro                      # 404 (não espelhado)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # Ponto de extremidade de imagem OG do site
├── rss.xml.ts                     # Ponto de extremidade RSS
├── robots.txt.ts                  # Ponto de extremidade robots.txt
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # Ponto de extremidade de imagem OG do post
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Espelho de locale não padrão (getStaticPaths=getLocaleParams)
    └── (estrutura espelha a raiz, exceto 404, og.png, rss, robots)
```

### Derivação de URL de post

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: deriva o slug de roteamento do `id` da coleção de conteúdo e caminho do arquivo, filtrando diretórios com prefixo `_`
- `getPostUrl(id, filePath, locale)`: gera uma URL navegável com o prefixo de locale (locale padrão não tem prefixo)

### Filtragem e classificação de posts

- [`postFilter.ts`](../src/utils/postFilter.ts): exclui rascunhos; filtra posts futuros em produção usando `pubDatetime - scheduledPostMargin`; dev mostra todos
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): após filtrar, classifica decrescente por `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): deduplica e classifica tags por slug

## Scripts do lado do cliente

As interações do lado do cliente do Xingluo são carregadas via tags `<script>` no final das páginas, todas adaptadas para View Transitions:

| Script                | Local de carregamento                                    | Adaptação de evento                                                                                           | Responsabilidades                                                               |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `theme.ts`            | Final do body de `Layout.astro`                          | Religar em `astro:after-swap`, transportar theme-color em `astro:before-swap`, mudança `prefers-color-scheme` | Persistência e alternância do tema                                              |
| `postEnhancements.ts` | `PostDetailView.astro`                                   | Reiniciar em `astro:page-load`                                                                                | Âncoras de cabeçalho, cópia de código, progresso de leitura, lightbox de imagem |
| `comments.ts`         | `Comments.astro`                                         | Reexaminar em `astro:page-load`                                                                               | Carregamento lento de comentários e sincronização de tema                       |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (condicional) | Reexaminar em `astro:page-load`                                                                               | Carregamento lento de players                                                   |

> Nota: `comments.ts` e `players.ts` não têm import/export de nível superior; adicione `export {}` ao final do arquivo para marcá-los como módulos e evitar conflitos de declaração global com outros arquivos.

## Pipeline de build

`pnpm run build` = `astro check && astro build && pagefind --site dist`

1. **`astro check`**: verificação de tipos TypeScript e modelos Astro
2. **`astro build`**:
   - Coletar coleções de conteúdo (incluir `.mdx` baseado em `features.mdx`)
   - Gerar estaticamente todas as páginas (incluindo espelhos `[locale]/`)
   - Gerar pontos de extremidade: RSS, sitemap, robots.txt, imagens OG de site e post
   - Carregar condicionalmente a integração `mdx()`; injetar condicionalmente `remarkPlayers`
   - Ícones SVG inline em tempo de build (astro-icon, zero JS em tempo de execução)
   - Módulos de comentários e players importados dinamicamente divididos em chunks independentes (carregamento lento)
3. **`pagefind --site dist`**: escaneia conteúdo de `dist/` marcado com `data-pagefind-body`, gerando índices de busca por idioma em `dist/pagefind/`

## Estratégias de desempenho

- **Ícones com zero JS em execução**: astro-icon incorpora SVGs do Font Awesome em tempo de build (modo sprite `<symbol>`)
- **Otimização SVG**: `experimental.svgOptimizer` (svgo) compacta SVGs incorporados e referenciados
- **Carregamento lento sob demanda**: comentários e players importam dinamicamente via IntersectionObserver quando rolados para a visualização; pacote zero quando desativados
- **Integrações condicionais**: com MDX desligado, a integração `mdx()` não é carregada; com players desligados, o plugin remark não é injetado
- **Tamanho CSS**: Tailwind v4 gera sob demanda; variáveis OKLCH são gerenciadas centralmente
- **Fontes de imagem OG**: usadas apenas por satori, não injetadas no CSS do site
- **View Transitions**: `<ClientRouter/>` alimenta animações de transição de página; a caixa de busca usa `transition:persist` para manter o estado

## Guia de extensão

### Adicionar uma página

1. Crie um arquivo `.astro` em `src/pages/` (wrapper fino)
2. Crie o componente de visão correspondente em `src/components/pageViews/`
3. Para suporte multilíngue, crie um wrapper fino espelho com o mesmo nome em `src/pages/[locale]/`

### Adicionar um componente UI

Siga o estilo shadcn: crie componentes `.astro` e configurações de variantes `.ts` em `src/components/ui/` (usando `class-variance-authority`).

### Adicionar um script do lado do cliente

Crie um arquivo `.ts` em `src/scripts/`, adicione `export {}` ao final para marcá-lo como módulo, escute `astro:page-load` para se adaptar a View Transitions, e importe-o em uma tag `<script>` na página relevante.

### Adicionar um plugin remark/rehype

Crie o arquivo do plugin em `src/utils/` e injete-o conforme necessário em `markdown.remarkPlugins` ou `rehypePlugins` no `astro.config.ts`.
