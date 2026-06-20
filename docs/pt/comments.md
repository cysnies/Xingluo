# Sistema de comentários

Xingluo integra três sistemas de comentários — giscus, twikoo e waline — selecionáveis através de `features.comments`.

## Configuração

Escolha um provedor e forneça sua configuração em `features.comments` em [`xingluo.config.ts`](../xingluo.config.ts):

```ts
features: {
  comments: {
    provider: "giscus", // "giscus" | "twikoo" | "waline" | false
    giscus: { /* configuração giscus */ },
    // twikoo: { /* configuração twikoo */ },
    // waline: { /* configuração waline */ },
  },
}
```

Com `provider: false` (padrão), os comentários estão desativados e as páginas de posts não emitem marcadores ou scripts de comentários.

## Localização da Seção de Comentários

A seção de comentários aparece apenas na parte inferior das **páginas de detalhes dos posts** (após a navegação anterior/próximo), renderizada por [`src/components/comments/Comments.astro`](../src/components/comments/Comments.astro).

## giscus

Um sistema de comentários baseado em GitHub Discussions; o repositório deve ser público com Discussions habilitado.

### Configuração

```ts
comments: {
  provider: "giscus",
  giscus: {
    repo: "owner/repo",           // Repositório GitHub
    repoId: "R_...",              // ID do repositório (gerado por giscus.app)
    category: "Announcements",    // Nome da categoria de discussão
    categoryId: "DIC_...",        // ID da categoria (gerado por giscus.app)
    mapping: "pathname",          // opcional, mapeamento página-discussão
    strict: false,                // opcional, correspondência estrita de título
    reactionsEnabled: true,       // opcional, reações
    inputPosition: "bottom",      // opcional, posição da caixa de comentário: top | bottom
    loading: "lazy",              // opcional, carregamento: lazy | eager
  },
}
```

### Obtendo repoId / categoryId

1. Visite [giscus.app](https://giscus.app)
2. Insira o repositório e a categoria para gerar a configuração
3. Copie `data-repo-id` e `data-category-id` para sua configuração

### Como funciona

giscus injeta um iframe através do `client.js` oficial, com atributos `data-*` carregando a configuração. O idioma é mapeado automaticamente para a localidade atual (`zh-cn` → `zh-CN`, `en` → `en`). O tema é sincronizado ao alternar via `postMessage`.

## twikoo

Um sistema de comentários sem dependência de backend, suportando Tencent CloudBase ou auto-hospedagem.

### Configuração

```ts
comments: {
  provider: "twikoo",
  twikoo: {
    envId: "https://your-twikoo.example.com", // ID do ambiente cloud ou URL completa de auto-hospedagem
    lang: "zh-CN",                            // opcional, idioma
  },
}
```

### Notas sobre envId

- Tencent CloudBase: preencha o ID do ambiente (requer o cloudbase SDK)
- Auto-hospedado: preencha a URL completa (ex. `https://twikoo.example.com`); twikoo detecta automaticamente o modo HTTP API

### Como funciona

twikoo importa dinamicamente `import("twikoo")` e chama `init` quando o contêiner de comentários entra no viewport. twikoo não suporta alternância de tema em tempo de execução; o site o reconstrói na mudança de tema para aplicar estilos escuros.

## waline

Um sistema de comentários com backend, com contadores de comentários e visualizações.

### Configuração

```ts
comments: {
  provider: "waline",
  waline: {
    serverURL: "https://waline.example.com", // Endereço do servidor Waline
    lang: "zh-CN",                           // opcional, idioma
    pageSize: 10,                            // opcional, tamanho da página de comentários
    dark: "html.dark",                       // opcional, seletor escuro (padrão segue site .dark)
  },
}
```

### serverURL Deployment

Consulte a [documentação do Waline](https://waline.js.org/) para implantar o servidor (Vercel / Cloudflare / auto-hospedagem funcionam todos) e coloque o endereço em `serverURL`.

### Como funciona

waline importa dinamicamente `import("@waline/client")` e o estilo `@waline/client/style` quando o contêiner de comentários entra no viewport, então chama `init`. O seletor `dark:"html.dark"` segue automaticamente o modo escuro do site; nenhuma sincronização manual necessária.

## Carregamento sob demanda

Todos os sistemas de comentários são carregados sob demanda via IntersectionObserver: as solicitações e a inicialização ocorrem apenas quando o contêiner de comentários está a 200px do viewport, evitando o custo de desempenho da primeira pintura.

Consulte [`src/scripts/comments.ts`](../src/scripts/comments.ts).

## Sincronização de tema

Quando o tema do site muda, o tema do sistema de comentários sincroniza automaticamente:

| Sistema de comentários | Método de sincronização                                     |
| ---------------------- | ----------------------------------------------------------- |
| giscus                 | `postMessage({giscus:{setConfig:{theme}}})` para o iframe   |
| waline                 | Seletor CSS `dark:"html.dark"` segue automaticamente        |
| twikoo                 | Observa mudanças na classe `.dark` e reconstrói a instância |

A observação do tema usa um `MutationObserver` nos atributos `class` e `data-theme` de `document.documentElement`.

## Adaptação View Transitions

O script de comentários escuta `astro:page-load` e reescaneia os pontos de montagem após cada carregamento de página. A reinicialização é evitada através de marcadores `dataset` (`xng-setup`, `xng-init`).

## i18n

O título da seção de comentários é localizado via `UIStrings.comments.title`. O idioma da interface do sistema de comentários é controlado pelo campo `lang` de cada provedor.

## Extensões personalizadas

### Alternando provedores

Altere `features.comments.provider` em `xingluo.config.ts`; nenhuma alteração de código necessária. Xingluo renderiza o subcomponente correspondente automaticamente.

### Adicionando um sistema de comentários

1. Crie um novo componente em `src/components/comments/` (ex. `Disqus.astro`) que renderiza um placeholder de montagem
2. Adicione um novo ramo de provedor na renderização condicional de `Comments.astro`
3. Adicione a lógica de inicialização em `src/scripts/comments.ts`
4. Estenda `CommentProvider` e os tipos de configuração em `src/types/config.ts`
