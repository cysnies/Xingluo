---
title: "Internacionalização"
pubDatetime: 2026-06-20T06:00:00+08:00
description: "Detalhes do sistema i18n do Xingluo cobrindo roteamento multilíngue, localização de strings de UI, tradução em nível de conteúdo e adição de novos idiomas."
tags:
  - documentation
  - i18n
category: "Documentation"
translationKey: doc-i18n
locale: pt
---

Xingluo vem com suporte de interface bilíngue (zh-CN / en), usando a estratégia de roteamento `prefixDefaultLocale: false` para que o idioma padrão não tenha prefixo de URL.

## Estratégia de Roteamento

A configuração `i18n` do Astro (veja `astro.config.ts`):

```ts
i18n: {
  locales: ["zh-cn", "en"],
  defaultLocale: "zh-cn",
  routing: { prefixDefaultLocale: false },
}
```

**Importante: `prefixDefaultLocale: false` não gera automaticamente cópias de páginas localizadas** — você deve manter manualmente as rotas espelho `[locale]/`.

Abordagem do Xingluo:

- **Páginas raiz** = idioma padrão (`zh-cn`), sem prefixo de URL, ex: `/posts/welcome/`
- **`src/pages/[locale]/`** espelha todas as páginas; `getStaticPaths` usa `getLocaleParams()` para gerar apenas locales não padrão, ex: `/en/posts/welcome/`
- Páginas espelho também são wrappers finos, reutilizando o mesmo componente View para lógica de renderização

```
/                      → início (zh-cn)
/en/                   → início (en)
/posts/welcome/        → post (zh-cn)
/en/posts/welcome/     → post (en)
```

## Resolução de Locale

Componentes View usam `Astro.currentLocale` para resolução automática:

- Páginas raiz → `zh-cn`
- Páginas com segmento `[locale]` → `en` (ou outros locales não padrão)

Não são necessárias verificações de caminho na camada de componentes; `useTranslations(locale)` obtém as strings correspondentes diretamente.

## Estrutura do Módulo i18n

[`src/i18n/`](../src/i18n/):

| Arquivo          | Responsabilidade                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`       | `import.meta.glob("./lang/*.ts", {eager:true})` carrega idiomas; exporta `DEFAULT_LOCALE`, `LOCALES`, `useTranslations(locale)`, `tplStr` |
| `types.ts`       | Interface `UIStrings` completa (todas as strings a localizar)                                                                             |
| `routing.ts`     | `getLocalePrefix`, `withLocale(path, locale)`, `parseLocaleFromPath(pathname)`                                                            |
| `staticPaths.ts` | `NON_DEFAULT_LOCALES`, `getLocaleParams()`                                                                                                |
| `format.ts`      | `tplStr(template, vars)` — substituição de placeholder `{{key}}`                                                                          |
| `lang/zh-cn.ts`  | Chinês simplificado (padrão)                                                                                                              |
| `lang/en.ts`     | Inglês                                                                                                                                    |

## Estrutura UIStrings

A interface `UIStrings` define todas as strings de UI a localizar, organizadas em grupos:

- `nav`: navegação (início/posts/tags/sobre/arquivos/pesquisa/rss)
- `post`: post (data, compartilhar, tags, voltar, editar, TOC, copiar código, lightbox de imagem, etc.)
- `pagination`: paginação
- `home`: página inicial (links sociais, destacados, recentes)
- `archives`: arquivos (contagens, meses)
- `footer`: rodapé (copyright)
- `pages`: títulos e descrições de páginas
- `a11y`: rótulos de acessibilidade
- `languageSwitcher`: seletor de idioma
- `notFound`: 404
- `comments`: seção de comentários

## Strings de Modelo

Strings com placeholders usam `{{key}}`, substituídas via `tplStr`:

```ts
import { tplStr } from "@/i18n";

// archives.postCount = "{{count}} posts"
tplStr(t.archives.postCount, { count: 5 }); // "5 posts"
```

## Declarações SEO Multilíngues

O cabeçalho de `Layout.astro` gera:

- `<link rel="alternate" hreflang="..." href="...">` para cada idioma
- `x-default` aponta para o idioma padrão
- A integração do sitemap permite que a configuração i18n gere hreflang automaticamente
- Posts em locale não padrão têm canonical apontando para o original no locale padrão (para evitar penalidades de conteúdo duplicado; veja [SEO](./doc-seo.md))

## Adicionar um Idioma

Exemplo: adicionar japonês `ja`:

1. **`astro.config.ts`**: adicione `"ja"` a `i18n.locales` e o mapeamento `"ja": "ja-JP"` ao sitemap `i18n.locales`
2. **`src/i18n/lang/`**: crie `ja.ts` exportando um `UIStrings` completo (copie `en.ts` e traduza)
3. **`src/i18n/staticPaths.ts`**: `NON_DEFAULT_LOCALES` inclui automaticamente `ja` (calculado a partir de `LOCALES`)
4. **`src/pages/[locale]/`**: páginas espelho geram automaticamente a versão `ja` (`getLocaleParams` cobre)
5. **Seletor de idioma**: adicione `"ja": "日本語"` a `languageSwitcher.names` em `zh-cn.ts` e `en.ts`

## Tradução em Nível de Conteúdo

Xingluo suporta conteúdo de post multilíngue através dos campos de frontmatter `locale` e `translationKey`.

### Uso Básico

1. **Post no idioma padrão**: coloque em `src/content/posts/<slug>.md`, defina `translationKey` como identificador de grupo:

```yaml
# src/content/posts/welcome.md
---
title: "欢迎来到星罗"
locale: zh-cn
translationKey: welcome-to-xingluo
tags: [公告, Astro]
---
```

2. **Tradução**: coloque em um subdiretório de idioma `src/content/posts/<locale>/<slug>.md`, usando o mesmo `translationKey`:

```yaml
# src/content/posts/en/welcome.md
---
title: "Welcome to Xingluo"
locale: en
translationKey: welcome-to-xingluo
tags: [announcement, Astro]
---
```

### Estrutura de Diretórios

```
src/content/posts/
├── welcome.md              # Idioma padrão (zh-cn)
├── en/
│   └── welcome.md          # Tradução em inglês
├── ja/
│   └── welcome.md          # Tradução em japonês
└── another-post.md         # Post independente (sem translationKey)
```

- Os nomes dos subdiretórios de idioma devem corresponder aos códigos de idioma em `i18n.locales` do `astro.config.ts`
- Subdiretórios de idioma são filtrados do slug de URL (ex: `/posts/welcome/`, não `/posts/en/welcome/`)
- Posts sem `translationKey` são independentes e não vinculados entre idiomas

### Comportamento de Roteamento

| Cenário                                   | Comportamento                                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| Acesso de locale padrão a um post `zh-cn` | Renderiza o original no idioma padrão                                                    |
| Locale não padrão com **tradução**        | Renderiza a tradução correspondente                                                      |
| Locale não padrão **sem** tradução        | Cai de volta para o original no idioma padrão (conteúdo idêntico, canonical protege SEO) |

### Deduplicação de Lista

Páginas de lista (início, lista de posts, tags, arquivos, RSS) usam `getPostsForLocale` para selecionar posts representativos por idioma: cada grupo de tradução mostra apenas um cartão no idioma alvo, evitando entradas duplicadas para o mesmo tópico.

### canonical e SEO

- **Tem uma tradução independente**: canonical aponta para a própria URL da tradução, indexável separadamente pelos motores de busca
- **Sem tradução (fallback)**: canonical aponta para o original no idioma padrão, evitando penalidades de conteúdo duplicado
- Declarações hreflang cobrem todos os idiomas, informando os motores de busca sobre as relações entre versões de idioma

Veja [SEO](./doc-seo.md).
