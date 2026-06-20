---
title: "Tema e Estilos"
pubDatetime: 2026-06-20T08:00:00+08:00
description: "Sistema de tema e estilos do Xingluo cobrindo variáveis de tema shadcn, espaço de cor OKLCH, Tailwind v4 e modo escuro."
tags:
  - documentation
  - theming
category: "Documentation"
translationKey: doc-theming
locale: pt
---

Xingluo usa componentes de estilo shadcn/ui new-york e o espaço de cor OKLCH, construído sobre Tailwind CSS v4.

## Estrutura de Arquivos de Estilo

[`src/styles/`](../src/styles/):

| Arquivo          | Conteúdo                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| `theme.css`      | Variáveis de tema shadcn (OKLCH, claro `:root` + escuro `.dark`)            |
| `global.css`     | Entrada Tailwind, camada base, utilitários personalizados, temas de callout |
| `typography.css` | Tipografia `.app-prose` e estilos de bloco de código                        |

## Variáveis de Tema

`theme.css` usa o espaço de cor OKLCH para definir variáveis semânticas, com conjuntos claro e escuro:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  /* ... secondary, muted, accent, destructive, border, input, ring ... */
  --code: oklch(0.97 0 0);
  --content-width: 72rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... contrapartes escuras ... */
}
```

Estas variáveis são mapeadas para tokens Tailwind no `@theme inline` do `global.css`, para que você possa usar classes como `bg-background`, `text-foreground`, `border-border` diretamente.

## Tailwind CSS v4

Xingluo usa Tailwind v4, integrado através do plugin `@tailwindcss/vite` (veja `vite.plugins` em `astro.config.ts`).

### Configuração principal (`global.css`)

```css
@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... mapeamentos de cores ... */
  --radius: var(--radius);
  --font-sans: "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
  --content-width: 72rem;
}
```

### Utilitários Personalizados

- `max-w-app`: largura máxima do conteúdo (`--content-width: 72rem`)
- `app-layout`: layout do aplicativo (min-height 100vh, flex column)

## Modo Escuro

### Proteção FOUC

`Layout.astro` incorpora um script síncrono no `<head>` (`is:inline`) que define o tema antes da primeira pintura:

```js
// Ler localStorage.theme, ou recorrer a prefers-color-scheme
// Definir o atributo data-theme do html e a classe .dark
```

Isto evita um flash de tema ao atualizar.

### Alternância de Tema em Tempo de Execução

[`src/scripts/theme.ts`](../src/scripts/theme.ts):

- `getPreferredTheme`: localStorage primeiro, recorre à preferência do sistema
- `persist`: persiste no localStorage
- `reflect`: sincroniza atributo `data-theme`, classe `.dark`, `#theme-btn` `aria-label`, `<meta name="theme-color">`
- Liga o clique de `#theme-btn` para alternar
- Adapta-se a View Transitions: religar em `astro:after-swap`, transportar theme-color em `astro:before-swap`
- Escuta mudanças de `prefers-color-scheme` do sistema (segue apenas quando o usuário não escolheu explicitamente)

### Sincronização de Tema de Comentários e Players

- giscus: alternado via `postMessage({giscus:{setConfig:{theme}}})`
- waline: seletor `dark:"html.dark"` segue automaticamente
- twikoo: observa mudanças de classe `.dark` e reconstrói a instância (twikoo não suporta alternância em tempo de execução)
- Veja [Sistema de comentários](./doc-comments.md)

## Tipografia (.app-prose)

O `.app-prose` do `typography.css` baseia-se no `prose` do `@tailwindcss/typography` com substituições de tema:

- Cor primária do link (`--primary`)
- Fundo de código inline (`--code`)
- Tema duplo de bloco de código (Shiki `--shiki-light-bg` / `--shiki-dark-bg`)
- Estilos de linha diff / highlight / word
- Estilos de blockquote, hr, img
- Estilos de recolhimento details / summary
- Cursor lightbox de imagem `role="button"`
- `scroll-margin` de âncora de título

Os contêineres de corpo de post usam `<article class="app-prose">`.

## Componentes shadcn

[`src/components/ui/`](../src/components/ui/) fornece componentes estilo shadcn:

| Componente                                                                             | Notas                                                                           |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Button`                                                                               | Alterna automaticamente entre `<a>` / `<button>`, variantes cva (variant, size) |
| `Badge`                                                                                | Emblema                                                                         |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | Família de cartões                                                              |
| `Input`                                                                                | Entrada                                                                         |
| `Separator`                                                                            | Separador                                                                       |

As configurações de variante usam `class-variance-authority`; os nomes de classe são mesclados com `cn` (`src/lib/utils.ts`, baseado em `tailwind-merge` + `clsx`).

## Sistema de Ícones

Os ícones do Xingluo são SVGs embutidos em tempo de construção via astro-icon + Font Awesome (modo sprite `<symbol>`), **zero JS em tempo de execução, sem requisições de rede de fontes**.

### Mapeamento de Ícones (FA5)

| Uso          | Nome do ícone                               |
| ------------ | ------------------------------------------- |
| Pesquisa     | `fa-solid:search`                           |
| Fechar       | `fa-solid:times`                            |
| Email        | `fa-solid:envelope`                         |
| Outras redes | `fa-brands:{name}`                          |
| X (rede)     | `fa-brands:twitter` (FA5 não tem x-twitter) |

### Resolução Dinâmica de Ícones Sociais

[`src/lib/socialIcons.ts`](../src/lib/socialIcons.ts) coleta `src/assets/icons/socials/*.astro` por nome de arquivo via `import.meta.glob`; `getSocialIcon(name)` resolve por nome. Adicionar uma plataforma social é tão simples quanto adicionar um arquivo de ícone em `socials/`.

## Personalizando o Tema

Edite as variáveis CSS em `src/styles/theme.css` para ajustar as cores do site. Por exemplo, para mudar para um azul primário:

```css
:root {
  --primary: oklch(0.55 0.2 250);
}
.dark {
  --primary: oklch(0.7 0.18 250);
}
```

Todos os componentes que referenciam `bg-primary` / `text-primary` seguem automaticamente.
