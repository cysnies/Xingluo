# Pesquisa

Xingluo integra [Flexsearch](https://github.com/nextapps-de/flexsearch) para pesquisa de texto completo do lado do cliente, com índices por idioma e persistência de estado View Transitions.

## Ativação

Configure via `features.search`:

```ts
features: {
  search: "flexsearch", // "flexsearch" | false
}
```

Quando definido como `false`, a página de pesquisa faz `Astro.rewrite` para 404 e nenhuma UI de pesquisa é gerada.

## Como Funciona

### Geração de Índice

A terceira etapa da build, `node scripts/generateSearchIndex.mjs`, escaneia arquivos HTML no diretório `dist/`:

- Analisa o conteúdo das páginas e extrai o texto dos posts
- Índices são divididos automaticamente por idioma (`zh-cn` e `en` cada um tem o seu)
- Índices são gerados em `dist/search/`

### Escopo do Índice

O script de build analisa o conteúdo `<main>` das páginas de detalhes dos posts, então apenas os corpos dos posts são indexados. Outras páginas (início, listas, arquivos, etc.) não entram no índice de pesquisa.

## UI de Pesquisa

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementa a página de pesquisa:

- Utiliza índice do lado do cliente Flexsearch para correspondência de pesquisa no navegador
- Localiza ativos de índice via `getAssetPath("search/")`
- Utiliza variáveis de tema shadcn (`--background`, `--foreground`, `--primary`, etc.) para estilo da caixa de pesquisa e lista de resultados
- `transition:persist` preserva o estado da pesquisa entre navegações

### Fluxo de Pesquisa

1. O usuário digita na caixa de pesquisa
2. Flexsearch corresponde ao índice do idioma atual
3. A lista de resultados mostra posts correspondentes (título, datas de publicação/atualização, selo de categoria, tags, trecho de conteúdo correspondente)
4. `processTerm` escreve a URL da página de pesquisa com parâmetros de consulta no sessionStorage, para o botão voltar restaurar

## Navegação de Volta

O mecanismo de navegação de volta entre a página de pesquisa e as páginas de posts:

- O componente `Main.astro` escreve a URL da página de origem no `backUrl` do sessionStorage
- O `BackButton.astro` da página de post prefere voltar ao `backUrl` do sessionStorage, ou à página inicial se ausente
- O `processTerm` da página de pesquisa escreve a URL com parâmetros de consulta, restaurando o estado da pesquisa ao retornar de um post

## Pesquisa Multilíngue

Flexsearch divide os índices por idioma de página:

- Páginas `zh-cn` (raiz) → Índice chinês
- Páginas `en` (prefixo `/en/`) → Índice inglês

A pesquisa corresponde automaticamente ao índice do idioma da página atual: chinês em páginas chinesas, inglês em páginas inglesas.

## Adaptação de Tema

A UI de pesquisa Flexsearch utiliza variáveis de tema shadcn, definidas em `SearchView.astro` para estilo da caixa de pesquisa e lista de resultados:

```css
:root {
  --search-primary: var(--primary);
  --search-text: var(--foreground);
  --search-background: var(--background);
  /* ... */
}
```

O modo escuro alterna automaticamente via seletor `.dark`, consistente com o tema do site.

## Desempenho

- Índices Flexsearch são arquivos estáticos; a pesquisa ocorre no lado do cliente sem requisições de servidor
- Índices são carregados sob demanda (fragmentos de índice baixam apenas durante a pesquisa)
- `transition:persist` evita reinicializar a UI de pesquisa na navegação
