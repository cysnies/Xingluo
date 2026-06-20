---
title: "Começando"
pubDatetime: 2026-06-20T03:00:00+08:00
description: "Guia para iniciar o Xingluo para desenvolvimento local e builds de produção, cobrindo requisitos, instalação, desenvolvimento e implantação."
tags:
  - documentation
  - getting-started
category: "Documentation"
translationKey: doc-getting-started
locale: pt
---

Este guia ajuda você a iniciar o Xingluo para desenvolvimento local e compilações de produção a partir do zero.

## Requisitos

| Dependência | Versão mínima | Observações                                           |
| ----------- | ------------- | ----------------------------------------------------- |
| Node.js     | 22.12.0       | Veja `engines.node` em `package.json`                 |
| pnpm        | 10.x          | Gerenciador de pacotes (o projeto usa pnpm workspace) |

> Dica: gerencie versões do Node com [fnm](https://github.com/Schniz/fnm) ou [nvm](https://github.com/nvm-sh/nvm).

## Instalação

Após clonar o repositório, instale as dependências:

```bash
pnpm install
```

Após a instalação das dependências, os projetos de referência em `references/` são automaticamente excluídos da compilação TypeScript e das builds (veja `exclude` em `tsconfig.json`).

## Desenvolvimento local

Inicie o servidor de desenvolvimento (padrão `http://localhost:4321/`):

```bash
pnpm dev
```

No modo de desenvolvimento:

- Rascunhos e postagens programadas são **todas visíveis** (para pré-visualização); eles são filtrados apenas durante as builds de produção
- Alterações nas coleções de conteúdo acionam recarga automática
- Comportamentos do lado do cliente (alternância de tema, View Transitions, etc.) correspondem à produção

## Sincronização de tipos

Após modificar esquemas ou tipos das coleções de conteúdo, execute sync para atualizar `.astro/types.d.ts`:

```bash
pnpm sync
```

## Compilação

A build de produção tem três etapas (veja o script `build` em `package.json`):

```bash
pnpm build
```

1. **`astro check`**: verificação de tipos TypeScript e modelos Astro; qualquer erro interrompe a build
2. **`astro build`**: gera estaticamente todo o site em `dist/` (incluindo imagens OG dinâmicas, RSS, sitemap, robots.txt, assets UI do pagefind)
3. **`pagefind --site dist`**: escaneia `dist/` para gerar o índice de busca de texto completo em `dist/pagefind/`

> Nota: `pagefind` é uma ferramenta binária instalada como devDependency; nenhuma configuração extra é necessária.

## Pré-visualização da compilação

Visualize o resultado da build em `dist/` localmente:

```bash
pnpm preview
```

## Qualidade do código

| Comando             | Propósito                                                       |
| ------------------- | --------------------------------------------------------------- |
| `pnpm format`       | Formata todo o código com Prettier (incluindo Astro e Tailwind) |
| `pnpm format:check` | Verifica conformidade de formatação (usado em CI)               |
| `pnpm lint`         | Verificações ESLint (incluindo `eslint-plugin-astro`)           |

## Próximos passos

- Leia o [Guia de configuração](./doc-configuration.md) para personalizar informações do site e recursos
- Leia [Criação de conteúdo](./doc-content.md) para começar a escrever
- Leia [Implantação](./doc-deployment.md) para publicar seu site
