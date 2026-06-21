# Visão geral da arquitetura

Este documento descreve a arquitetura geral do Xingluo, estrutura de diretórios, fluxo de configuração, fluxo de renderização e pipeline de compilação, para ajudar você a entender a organização do código e como estendê-lo.

## Estrutura de Diretórios

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
    ├── config.ts            # Mesclar padrões de configuração, exportar configuração resolvida
    ├── content.config.ts    # Esquemas de coleção de conteúdo (posts, pages)
    ├── env.d.ts             # Declarações de tipo de módulo de terceiros e variáveis de ambiente
    ├── assets/              # Componentes de ícone
    │   └── icons/           # astro-icon + Font Awesome (inclui socials/)
    ├── components/          # Componentes de UI
    │   ├── ui/              # Componentes estilo shadcn (Button, Card, Badge, etc.)
    │   ├── post/            # Componentes de página de post (navegação ant/próx, voltar, compartilhar, etc.)
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
    │   ├── routing.ts       # Resolução de caminho de localidade
    │   ├── staticPaths.ts   # getStaticPaths para localidades não padrão
    │   ├── format.ts        # Substituição de string de modelo
    │   └── lang/            # Arquivos de recursos de idioma (zh-cn.ts, en.ts)
    ├── layouts/             # Layouts
    │   ├── Layout.astro     # Estrutura base (head, SEO, FOUC)
    │   └── PostLayout.astro # Layout de post (JSON-LD, meta do artigo)
    ├── lib/                 # Utilitários fundamentais
    │   ├── utils.ts         # cn (tailwind-merge + clsx)
    │   ├── dayjs.ts         # Instância dayjs e plugin de fuso horário
    │   └── socialIcons.ts   # Resolução dinâmica de ícones sociais
    ├── pages/               # Rotas (raiz + espelho [locale]/)
    ├── scripts/             # Scripts do lado do cliente
    │   ├── theme.ts         # Alternância de tema
    │   ├── postEnhancements.ts # Aprimoramentos de post (âncoras, cópia, lightbox, progresso)
    │   ├── comments.ts      # Carregamento preguiçoso de comentários e sincronização de tema
    │   └── players.ts       # Carregamento preguiçoso de players
    ├── styles/              # Estilos
    │   ├── global.css       # Entrada Tailwind + camada base + utilitários personalizados
    │   ├── theme.css        # Variáveis de tema shadcn (OKLCH)
    │   └── typography.css   # Tipografia .app-prose e estilos de bloco de código
    ├── types/               # Declarações de tipo
    │   ├── config.ts        # Tipos de configuração
    │   └── *.d.ts           # Declarações para módulos de terceiros não tipados
    └── utils/               # Funções utilitárias
        ├── getPostPaths.ts  # Derivação de slug e URL de post
        ├── getSortedPosts.ts# Ordenação de posts
        ├── postFilter.ts    # Filtragem de rascunhos e posts agendados
        ├── getUniqueTags.ts # Deduplicação de tags
        ├── remarkPlayers.ts # Plugin remark para players
        ├── rehypeWrapTable.ts# Invólucro de rolagem de tabela
        └── ...              # Outros utilitários
```

## Fluxo de Configuração

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

## Fluxo de Renderização

### Renderização de Página

Xingluo usa um padrão "wrapper de página fino + componente de visualização", centralizando a lógica de renderização em `src/components/pageViews/`:

```
src/pages/posts/[...slug]/index.astro   ← wrapper fino: getStaticPaths + <PostDetailView/>
    │
    ▼
src/components/pageViews/PostDetailView.astro  ← lógica de renderização
    │
    ▼
src/layouts/PostLayout.astro  ← layout de post (JSON-LD, meta do artigo)
    │
    ▼
src/layouts/Layout.astro      ← estrutura base (head, SEO, FOUC, ClientRouter)
```

A página wrapper fino lida apenas com `getStaticPaths` e passagem de props; o componente de visualização contém toda a lógica de renderização. As páginas espelho `[locale]/` são igualmente wrappers finos, gerando apenas localidades não padrão via `getLocaleParams()`.

### Roteamento

```
src/pages/
├── 404.astro                      # 404 (não espelhado)
├── index.astro → <HomeView/>
├── about.astro → <AboutView/>
├── search.astro → <SearchView/>
├── og.png.ts                      # Endpoint de imagem OG de nível de site
├── rss.xml.ts                     # Endpoint RSS
├── robots.txt.ts                  # Endpoint robots.txt
├── archives/index.astro → <ArchivesView/>
├── posts/
│   ├── [...page].astro → <PostListView/>
│   └── [...slug]/
│       ├── index.astro → <PostDetailView/>
│       └── og.png.ts              # Endpoint de imagem OG de nível de post
├── tags/
│   ├── index.astro → <TagsIndexView/>
│   └── [tag]/[...page].astro → <TagPostListView/>
└── [locale]/                      # Espelho de localidade não padrão (getStaticPaths=getLocaleParams)
    └── (estrutura espelha a raiz, exceto 404, og.png, rss, robots)
```

### Derivação de URL de Post

[`src/utils/getPostPaths.ts`](../src/utils/getPostPaths.ts):

- `getPostSlug(id, filePath)`: deriva o slug de roteamento do `id` da coleção de conteúdo e caminho do arquivo, filtrando diretórios prefixados com `_`
- `getPostUrl(id, filePath, locale)`: gera uma URL navegável com o prefixo de localidade (localidade padrão não tem prefixo)

### Filtragem e Ordenação de Posts

- [`postFilter.ts`](../src/utils/postFilter.ts): exclui rascunhos; filtra posts futuros em produção usando `pubDatetime - scheduledPostMargin`; desenvolvimento mostra todos
- [`getSortedPosts.ts`](../src/utils/getSortedPosts.ts): após filtrar, ordena decrescentemente por `modDatetime ?? pubDatetime`
- [`getUniqueTags.ts`](../src/utils/getUniqueTags.ts): deduplica e ordena tags por slug

## Scripts do Lado do Cliente

As interações do lado do cliente do Xingluo são carregadas via tags `<script>` no final das páginas, todas adaptadas para View Transitions:

| Script                | Local de carregamento                                    | Adaptação de evento                                                                                              | Responsabilidades                                                               |
| --------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `theme.ts`            | final do body de `Layout.astro`                          | religar em `astro:after-swap`, transportar theme-color em `astro:before-swap`, mudança de `prefers-color-scheme` | Persistência e alternância de tema                                              |
| `postEnhancements.ts` | `PostDetailView.astro`                                   | reiniciar em `astro:page-load`                                                                                   | Âncoras de cabeçalho, cópia de código, progresso de leitura, lightbox de imagem |
| `comments.ts`         | `Comments.astro`                                         | reexaminar em `astro:page-load`                                                                                  | Carregamento preguiçoso de comentários e sincronização de tema                  |
| `players.ts`          | `PostDetailView.astro` / `AboutView.astro` (condicional) | reexaminar em `astro:page-load`                                                                                  | Carregamento preguiçoso de players                                              |

> Nota: `comments.ts` e `players.ts` não têm import/export de nível superior; adicione `export {}` no final do arquivo para marcá-los como módulos e evitar conflitos de declaração global com outros arquivos.

## Pipeline de Compilação

`pnpm run build` = `astro check && astro build && node scripts/generateSearchIndex.mjs`

1. **`astro check`**: Verificação de tipos TypeScript + templates Astro
2. **`astro build`**:
   - Coleta coleções de conteúdo (inclui `.mdx` baseado em `features.mdx`)
   - Gera estaticamente todas as páginas (incluindo espelhos `[locale]/`)
   - Gera endpoints: RSS, sitemap, robots.txt, imagens OG de nível de site e post
   - Carrega condicionalmente a integração `mdx()`; injeta condicionalmente `remarkPlayers`
   - Incorpora ícones SVG inline em tempo de compilação (astro-icon, zero JS runtime)
   - Módulos de comentários e players importados dinamicamente são divididos em chunks independentes (carregamento preguiçoso)
3. **`node scripts/generateSearchIndex.mjs`**: escaneia arquivos HTML em `dist/`, analisa o conteúdo das páginas, gerando índices de busca por idioma em `dist/search/`

## Estratégias de Desempenho

- **Ícones sem JS em tempo de execução**: astro-icon incorpora SVGs Font Awesome inline em tempo de compilação (modo sprite `<symbol>`)
- **Otimização SVG**: `experimental.svgOptimizer` (svgo) compacta SVGs inline e referenciados
- **Carregamento preguiçoso sob demanda**: comentários e players importam dinamicamente via IntersectionObserver quando rolados para a vista; pacote zero quando desativados
- **Integrações condicionais**: com MDX desligado, a integração `mdx()` não é carregada; com players desligados, o plugin remark não é injetado
- **Tamanho CSS**: Tailwind v4 gera sob demanda; variáveis OKLCH são gerenciadas centralmente
- **Fontes de imagem OG**: usadas apenas pelo satori, não injetadas no CSS do site
- **View Transitions**: `<ClientRouter/>` alimenta animações de transição de página; a caixa de pesquisa usa `transition:persist` para manter o estado

## Guia de Extensão

### Adicionar uma Página

1. Crie um arquivo `.astro` em `src/pages/` (wrapper fino)
2. Crie o componente View correspondente em `src/components/pageViews/`
3. Para suporte multilíngue, crie um wrapper fino espelho com o mesmo nome em `src/pages/[locale]/`

### Adicionar um Componente UI

Siga o estilo shadcn: crie componentes `.astro` e configurações de variantes `.ts` em `src/components/ui/` (usando `class-variance-authority`).

### Adicionar um Script do Lado do Cliente

Crie um arquivo `.ts` em `src/scripts/`, adicione `export {}` no final para marcá-lo como módulo, ouça `astro:page-load` para se adaptar às View Transitions e importe-o em uma tag `<script>` na página relevante.
