# Criação de conteúdo

Xingluo usa Astro Content Collections para gerenciar conteúdo, suportando Markdown (`.md`) e MDX (`.mdx`, requer `features.mdx`).

## Coleções de Conteúdo

Duas coleções são definidas em [`src/content.config.ts`](../src/content.config.ts):

| Coleção | Diretório            | Propósito                            |
| ------- | -------------------- | ------------------------------------ |
| `posts` | `src/content/posts/` | Posts do blog                        |
| `pages` | `src/content/pages/` | Páginas estáticas (ex. página sobre) |

Convenções de nomenclatura de arquivos:

- Arquivos ou diretórios começando com `_` são ignorados (útil para rascunhos)
- Com MDX ativado, `**/*.{md,mdx}` é coletado; caso contrário, apenas `**/*.md`
- URLs de posts são derivadas do caminho do arquivo (veja a seção de roteamento em [Visão geral da arquitetura](./architecture.md))

## Frontmatter de Post

Campos completos para a coleção `posts`:

```markdown
---
title: "Título do Post" # obrigatório
pubDatetime: 2026-06-19T10:00:00+08:00 # obrigatório, data de publicação
modDatetime: 2026-06-20T10:00:00+08:00 # opcional, data de atualização
description: "Resumo, usado para SEO e listas" # obrigatório
tags: ["Astro", "blog"] # opcional, padrão ["others"]
featured: true # opcional, destacado (mostrado na página inicial)
draft: false # opcional, rascunhos não são publicados
author: "Xingluo" # opcional, padrão site.author
ogImage: "./cover.png" # opcional, imagem OG (importação de imagem ou caminho de string)
heroImage: "./hero.png" # opcional, imagem principal (mostrada entre o botão voltar e o título, também à direita dos cartões)
heroImageFit: "cover" # opcional, modo de ajuste da imagem principal (cover recorte para preencher / contain escala completa), padrão cover
canonicalURL: "https://..." # opcional, link canônico
hideEditPost: false # opcional, ocultar link de edição
timezone: "Asia/Shanghai" # opcional, substituir o fuso horário do site
---
```

### Referência de Campos

| Campo            | Tipo                     | Padrão          | Notas                                                                                                                                                                            |
| ---------------- | ------------------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`          | string                   | obrigatório     | Título do post                                                                                                                                                                   |
| `pubDatetime`    | date                     | obrigatório     | Data de publicação, ISO 8601                                                                                                                                                     |
| `modDatetime`    | date                     | —               | Data de atualização; exibida junto com a data de publicação                                                                                                                      |
| `description`    | string                   | obrigatório     | Resumo, usado em meta, RSS e cards de lista                                                                                                                                      |
| `tags`           | string[]                 | `["others"]`    | Array de tags; páginas de tags são geradas automaticamente                                                                                                                       |
| `featured`       | boolean                  | —               | Mostrado na seção "Destacados" da página inicial                                                                                                                                 |
| `draft`          | boolean                  | —               | Rascunho; filtrado em builds de produção (visível em dev)                                                                                                                        |
| `author`         | string                   | `site.author`   | Nome do autor                                                                                                                                                                    |
| `ogImage`        | image \| string          | —               | Imagem OG; `image()` passa pelo pipeline de assets do Astro; string é um caminho `public/` ou URL externa                                                                        |
| `heroImage`      | image \| string          | —               | Imagem principal, mostrada na página de detalhes entre o botão voltar e o título, também à direita dos cartões (controlado por `features.showPostCardHero`/`showPostDetailHero`) |
| `heroImageFit`   | `"cover"` \| `"contain"` | `"cover"`       | Modo de ajuste da imagem principal: `"cover"` recorta para preencher (mantém proporção, pode cortar bordas); `"contain"` escala completa (mantém proporção, pode deixar espaços) |
| `canonicalURL`   | string                   | —               | Link canônico, substitui o padrão (veja [SEO](./seo.md))                                                                                                                         |
| `hideEditPost`   | boolean                  | —               | Ocultar o link de edição para este post                                                                                                                                          |
| `timezone`       | string                   | `site.timezone` | Substituir o fuso horário de exibição para este post                                                                                                                             |
| `locale`         | string                   | `site.lang`     | Idioma em que o post está escrito, ex. `"en"`, `"ja"`. Padrão é o idioma do site quando não definido                                                                             |
| `translationKey` | string                   | —               | Chave de grupo de tradução: posts com a mesma chave são traduções uns dos outros. Posts sem chave são independentes                                                              |
| `category`       | string                   | —               | Categoria do post (valor único), gera página `/categories/<slug>/`; não definido significa sem categoria                                                                         |

### Tradução em Nível de Conteúdo

Use os campos de frontmatter `locale` e `translationKey` para criar versões multilíngues dos seus posts:

1. Coloque o post no idioma padrão em `src/content/posts/<slug>.md`
2. Coloque as traduções em subdiretórios de idioma: `src/content/posts/<locale>/<slug>.md` (ex. `en/welcome.md`)
3. Defina `locale` para o idioma da tradução e `translationKey` com o mesmo valor do original

A camada de roteamento resolve automaticamente a tradução correta por idioma e desduplica nas listagens — o mesmo post em diferentes idiomas mostra apenas um card por idioma. Posts sem tradução recorrem ao conteúdo original. Veja [Internacionalização](./i18n.md).

### Publicação Agendada

Posts com timestamps futuros são filtrados em produção usando a tolerância `scheduledPostMargin`: se `pubDatetime` estiver dentro da janela de tolerância (padrão 15 minutos) do horário atual, o post é tratado como publicado. Em desenvolvimento, todos os posts não rascunho são visíveis.

## Frontmatter de Página Estática

A coleção `pages` tem campos mais simples:

```markdown
---
title: "Sobre"
description: "Sobre este site" # opcional
ogImage: "default-og.jpg" # opcional, apenas string
canonicalURL: "https://..." # opcional
---
```

A página sobre é obtida via `getEntry("pages", "about")` e requer criar `src/content/pages/about.md`.

## Melhorias de Markdown

Xingluo vem com os seguintes plugins remark / rehype (veja `astro.config.ts`):

### Tabela de Conteúdos

`remark-toc` gera a tabela de conteúdos automaticamente; `remark-collapse` a recolhe por padrão. Insira o marcador em um post:

```markdown
## Tabela de conteúdos

(A TOC é preenchida automaticamente aqui)
```

### Callouts (Notas Destacadas)

`rehype-callouts` suporta callouts estilo Obsidian:

```markdown
> [!NOTE]
> Note content

> [!WARNING]
> Warning content

> [!TIP]
> Tip content
```

Tipos suportados: `NOTE`, `TIP`, `INFO`, `WARNING`, `DANGER`, `SUCCESS`, `QUESTION`, `FAILURE` e mais.

### Realce de Código

Shiki tema duplo (claro `min-light`, escuro `night-owl`) suporta:

- Realce de linha: ` ```js {1,3-5} `
- Realce de palavra: ` ```js /word/ `
- Marcadores diff: `+` / `-` no início da linha
- Rótulos de nome de arquivo: ` ```js file=src/index.ts ` ou `filename=src/index.ts`

```js file=example.js
function hello() {
  console.log("hello"); // linha destacada
}
```

### Tables

Tabelas largas são automaticamente envolvidas em um contêiner com rolagem horizontal (o plugin `rehypeWrapTable`), evitando transbordamento em telas estreitas.

## Suporte MDX

Com `features.mdx` ativado (padrão), você pode usar arquivos `.mdx` para criação de conteúdo baseada em componentes.

### Componentes Personalizados

Os componentes MDX integrados do Xingluo estão em [`src/components/mdx/`](../src/components/mdx) e são importados de uma entrada unificada:

```mdx
import { APlayer, DPlayer } from "@/components/mdx";

# Meu Post

<APlayer
  audio={[
    {
      name: "Música",
      artist: "Artista",
      url: "/audio.mp3",
      cover: "/cover.jpg",
    },
  ]}
/>

<DPlayer video={{ url: "/video.mp4", pic: "/cover.jpg" }} />
```

Veja [Reprodutores de mídia](./media-players.md) para detalhes.

### Desativando MDX

Com `features.mdx: false`:

- A integração `mdx()` não é carregada
- O glob da coleção de conteúdo corresponde apenas a `*.md` (arquivos `.mdx` existentes não são coletados)
- A saída de compilação não contém runtime MDX

## Comentários

O sistema de comentários é renderizado automaticamente na parte inferior das páginas de detalhes dos posts (configure o provedor em `features.comments`). Veja [Sistema de comentários](./comments.md).

## Tempo de Leitura

O tempo de leitura estimado é mostrado automaticamente nas páginas de detalhes dos posts e cards de lista:

- **Idiomas CJK** (zh-cn, ja, ko): calculado por contagem de caracteres CJK, ~400 caracteres por minuto
- **Outros idiomas**: calculado por contagem de palavras (delimitadas por espaços), ~200 palavras por minuto
- Resultado arredondado para cima, mínimo 1 minuto

Antes da contagem, blocos de código, tags HTML, URLs de links Markdown e outros conteúdos não textuais são removidos para manter a estimativa próxima ao volume real de leitura. Nenhuma configuração necessária.

### Posts Relacionados

Até 2 posts relacionados são mostrados na parte inferior das páginas de detalhes (após a navegação anterior/próximo):

- Ordenados por número de tags compartilhadas, decrescente
- Mesma pontuação ordenada por data de publicação, decrescente (preferindo posts mais recentes)
- A seção não é renderizada quando nenhum post compartilha tags
- Ignorado automaticamente pelo índice de busca Flexsearch

Nenhuma configuração necessária.

### Barra Lateral TOC Fixa

Uma barra lateral de tabela de conteúdos fixa aparece no lado direito das páginas de detalhes dos posts em telas grandes (≥1024px):

- Gerada automaticamente a partir dos cabeçalhos h2–h6 do artigo, apresentada como uma lista indentada plana
- A indentação reflete a profundidade do cabeçalho (h3 tem um nível a mais de indentação que h2)
- A seção atual é destacada conforme você rola (IntersectionObserver)
- Clicar em uma entrada TOC rola suavemente para o cabeçalho correspondente
- Oculta em telas pequenas (mobile), onde a TOC recolhível inline está disponível

Gerada a partir dos `headings` retornados por `render()` do Astro — sem manutenção manual de TOC pelo autor. A TOC recolhível inline `remark-toc` (escreva `## Tabela de conteúdos` em seu post) coexiste com a barra lateral para uso em telas pequenas.

## Categorias

Atribua uma categoria a um post através do campo frontmatter `category` (uma única string):

```yaml
---
title: "Meu Post"
category: "tutorial"
---
```

- A página de categoria está em `/categories/<slug>/`; o slug é normalizado via `slugifyStr` (CJK preservado, latim em minúsculas com hífens)
- O índice de categorias em `/categories/` lista todas as categorias
- Cards de posts e páginas de detalhes mostram automaticamente um link de categoria (clique para ir à página da categoria)
- Um post pertence a no máximo uma categoria (diferente de múltiplas `tags`); posts sem `category` não aparecem em nenhuma categoria
- Páginas de categoria reutilizam `posts.perPage` para paginação e suportam rotas espelho multilíngues (`/en/categories/...`)
- Desative categorias via `features.showCategories: false` (entrada de navegação e páginas removidas, sitemap filtrado)
