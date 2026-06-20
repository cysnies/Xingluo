---
title: "Bem-vindo ao Xingluo"
pubDatetime: 2026-06-19T10:00:00+08:00
modDatetime: 2026-06-19T10:00:00+08:00
description: "Xingluo é um CMS de blog moderno construído com Astro e o estilo visual shadcn. Este post apresenta a filosofia de design e os recursos principais."
tags:
  - announcement
  - Astro
featured: true
locale: pt
translationKey: welcome-to-xingluo
category: announcement
---

## Sobre o Xingluo

**Xingluo** é um CMS de blog construído com Astro e o estilo visual shadcn.

## Recursos principais

- ⚡ **Desempenho extremo**: geração estática com Astro, sem sobrecarga de JavaScript em tempo de execução
- 🎨 **Visuais modernos**: estilo shadcn/ui new-york, espaço de cor OKLCH
- 🌗 **Modo escuro**: alternância sem piscar, segue a preferência do sistema
- 🔍 **Busca de texto completo**: indexação em tempo de compilação com Pagefind
- 🌐 **Multilíngue**: suporte para português, inglês e chinês
- 📝 **Markdown**: MDX, realce de sintaxe, tabela de conteúdos, callouts
- 📡 **RSS e SEO**: feed RSS e dados estruturados prontos para uso

## Exemplo de código

```ts filename="src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Comece a escrever

Crie um arquivo Markdown no diretório `src/content/posts/`, adicione frontmatter e publique seu artigo. Descrições detalhadas dos campos podem ser encontradas na documentação do projeto.

Comece sua jornada de escrita!
