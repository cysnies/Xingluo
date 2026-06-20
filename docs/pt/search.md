# Pesquisa

Xingluo integra [Pagefind](https://pagefind.app/) para pesquisa de texto completo estática, com índices por idioma e persistência de estado View Transitions.

## Ativação

Configure via `features.search`:

```ts
features: {
  search: "pagefind", // "pagefind" | false
}
```

Quando definido como `false`, a página de pesquisa faz `Astro.rewrite` para 404 e nenhuma UI de pesquisa é gerada.

## Como Funciona

### Geração de Índice

A terceira etapa da build, `pagefind --site dist`, escaneia o diretório `dist/`:

- Apenas páginas com o atributo `data-pagefind-body` são indexadas
- Índices são divididos automaticamente por idioma (`zh-cn` e `en` cada um tem o seu)
- Índices são gerados em `dist/pagefind/`

### Escopo do Índice

O `<main>` nas páginas de detalhes dos posts é marcado como `data-pagefind-body`, então apenas os corpos dos posts são indexados. Outras páginas (início, listas, arquivos, etc.) não entram no índice de pesquisa.

## UI de Pesquisa

[`src/components/pageViews/SearchView.astro`](../src/components/pageViews/SearchView.astro) implementa a página de pesquisa:

- Carrega `@pagefind/default-ui` para a caixa de pesquisa e lista de resultados
- Localiza ativos de índice via `getAssetPath("pagefind/")`
- Estilos globais substituem variáveis CSS do Pagefind, mapeando-as para o tema do Xingluo (`--background`, `--foreground`, `--primary`, etc.)
- `transition:persist` preserva o estado da pesquisa entre navegações

### Fluxo de Pesquisa

1. O usuário digita na caixa de pesquisa
2. Pagefind corresponde ao índice do idioma atual
3. A lista de resultados mostra posts correspondentes (título, destaque do resumo)
4. `processTerm` escreve a URL da página de pesquisa com parâmetros de consulta no sessionStorage, para o botão voltar restaurar

## Navegação de Volta

O mecanismo de navegação de volta entre a página de pesquisa e as páginas de posts:

- O componente `Main.astro` escreve a URL da página de origem no `backUrl` do sessionStorage
- O `BackButton.astro` da página de post prefere voltar ao `backUrl` do sessionStorage, ou à página inicial se ausente
- O `processTerm` da página de pesquisa escreve a URL com parâmetros de consulta, restaurando o estado da pesquisa ao retornar de um post

## Pesquisa Multilíngue

Pagefind divide os índices pelo atributo de idioma dos elementos `data-pagefind-body`:

- Páginas `zh-cn` (raiz) → Índice chinês
- Páginas `en` (prefixo `/en/`) → Índice inglês

A pesquisa corresponde automaticamente ao índice do idioma da página atual: chinês em páginas chinesas, inglês em páginas inglesas.

## Adaptação de Tema

A UI padrão do Pagefind tem suas próprias variáveis CSS; Xingluo as substitui com estilos globais em `SearchView.astro`, mapeando para variáveis de tema shadcn:

```css
:root {
  --pagefind-ui-primary: var(--primary);
  --pagefind-ui-text: var(--foreground);
  --pagefind-ui-background: var(--background);
  /* ... */
}
```

O modo escuro alterna automaticamente via seletor `.dark`, consistente com o tema do site.

## Desempenho

- Índices Pagefind são arquivos estáticos; a pesquisa ocorre no lado do cliente sem requisições de servidor
- Índices são carregados sob demanda (fragmentos de índice baixam apenas durante a pesquisa)
- `transition:persist` evita reinicializar a UI de pesquisa na navegação
