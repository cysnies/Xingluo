# Documentação do Xingluo

Xingluo é um CMS de blog moderno construído com [Astro](https://astro.build/) e o estilo visual [shadcn/ui](https://ui.shadcn.com/). Ele oferece uma experiência visual mais moderna através de componentes shadcn planos e elegantes e do sistema de cores OKLCH, e integra nativamente um sistema de comentários, suporte MDX opcional e reprodutores de áudio/vídeo.

## Índice de documentação

| Documento                                       | Conteúdo                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [Começando](./getting-started.md)               | Requisitos, instalação, desenvolvimento local, build e preview                           |
| [Guia de configuração](./configuration.md)      | Referência completa para `xingluo.config.ts`                                             |
| [Criação de conteúdo](./content.md)             | Frontmatter de posts, sintaxe Markdown/MDX, blocos de código, callouts, melhorias        |
| [Internacionalização](./i18n.md)                | Roteamento multilíngue, strings de UI, tradução em nível de conteúdo, adicionar idioma   |
| [Visão geral da arquitetura](./architecture.md) | Estrutura de diretórios, fluxo de configuração, fluxo de renderização, pipeline de build |
| [Tema e estilos](./theming.md)                  | Variáveis de tema shadcn, OKLCH, Tailwind v4, modo escuro                                |
| [Sistema de comentários](./comments.md)         | Escolha e configuração de giscus / twikoo / waline                                       |
| [Reprodutores de mídia](./media-players.md)     | Uso de APlayer / DPlayer em Markdown e MDX                                               |
| [SEO](./seo.md)                                 | Imagens OG, RSS, sitemap, hreflang, canonical, dados estruturados                        |
| [Pesquisa](./search.md)                         | Integração de busca de texto completo Flexsearch                                         |
| [Implantação](./deployment.md)                  | Hospedagem estática, GitHub Pages, variáveis de ambiente, Docker                         |

## Funcionalidades principais

- **Desempenho de alto nível**: geração estática Astro, ícones SVG incorporados em tempo de build (zero JS em runtime), carregamento lento de comentários e players, limpeza de assets órfãos
- **Visuais modernos**: componentes shadcn/ui new-york, espaço de cor OKLCH, modo escuro suave (proteção FOUC)
- **Multilíngue**: tradução em nível de UI e conteúdo, roteamento `prefixDefaultLocale: false`, declarações SEO hreflang e x-default
- **Melhoria de conteúdo**: MDX opcional, realce de código Shiki de tema duplo, callouts, TOC recolhível, tabelas roláveis
- **Tempo de leitura**: estimativa inteligente (CJK por contagem de caracteres, latim por contagem de palavras), exibido em cartões e páginas de detalhes
- **Posts relacionados**: recomendados automaticamente por tags compartilhadas
- **Categorias de posts**: atribuir via frontmatter, com páginas de categoria dedicadas e entrada de navegação
- **Barra lateral TOC fixa**: tabela de conteúdos fixa à direita em telas grandes, rastreamento de rolagem IntersectionObserver
- **Sistema de comentários**: giscus / twikoo / waline, consciente do tema, carregamento lento
- **Players de mídia**: áudio APlayer e vídeo DPlayer, com pontos de entrada MD fence e componente MDX
- **Busca**: busca de texto completo Flexsearch, índices por idioma, persistência de estado View Transitions
- **SEO completo**: imagens OG dinâmicas (satori + sharp), RSS, sitemap, dados estruturados JSON-LD (BlogPosting + BreadcrumbList), normalização canonical

## Stack tecnológico

| Categoria              | Tecnologia                                                             |
| ---------------------- | ---------------------------------------------------------------------- |
| Framework              | Astro 6.x                                                              |
| Estilização            | Tailwind CSS v4, componentes estilo shadcn/ui, @tailwindcss/typography |
| Ícones                 | astro-icon + Font Awesome                                              |
| Conteúdo               | Astro Content Collections, MDX, cadeia de plugins remark/rehype        |
| Realce de código       | Shiki                                                                  |
| Busca                  | Flexsearch                                                             |
| Imagens OG             | satori + sharp                                                         |
| Comentários            | giscus / twikoo / waline                                               |
| Players                | APlayer / DPlayer                                                      |
| Data                   | dayjs                                                                  |
| Gerenciador de pacotes | pnpm                                                                   |
| Linguagem              | TypeScript                                                             |

## Licença

AGPL-3.0
