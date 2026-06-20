---
title: "Implantação"
pubDatetime: 2026-06-20T13:00:00+08:00
description: "Guia de implantação do Xingluo cobrindo plataformas de hospedagem estática (Netlify/Vercel/GitHub Pages), auto-hospedagem Nginx, Docker e variáveis de ambiente."
tags:
  - documentation
  - deployment
category: "Documentation"
translationKey: doc-deployment
locale: pt
---

Xingluo é um site puramente estático; `pnpm build` gera o diretório `dist/`, hospedável em qualquer serviço de hospedagem estática.

## Saída de Build

```bash
pnpm build
```

O `dist/` gerado contém:

- Todas as páginas HTML estáticas (incluindo espelhos `[locale]/`)
- Ativos JS / CSS / fontes em `_astro/`
- O índice de busca `pagefind/`
- O `og.png` de nível de site e `og.png` por post
- `rss.xml`, `sitemap-index.xml`, `robots.txt`
- Ativos estáticos em `public/` (favicon, imagem OG padrão, etc.)

## Variáveis de Ambiente

Definidas no momento da construção:

| Variável                          | Descrição                                                |
| --------------------------------- | -------------------------------------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Valor de verificação do Google Search Console (opcional) |

Exemplo PowerShell:

```powershell
$env:PUBLIC_GOOGLE_SITE_VERIFICATION = "your-code"
pnpm build
```

Em ambientes CI (ex: GitHub Actions), injete via `env` antes da etapa de build.

## Lista de Verificação Pré-Implantação

Antes de implantar, verifique:

1. `site.url` em `xingluo.config.ts` está definido para o domínio de produção
2. `site.title`, `site.description`, `site.author`, etc. estão personalizados
3. Se um sistema de comentários estiver ativado, a configuração do provedor (giscus repoId, twikoo envId, waline serverURL) tem valores reais
4. `public/default-og.jpg` (ou o `site.ogImage` configurado) foi substituído pela imagem OG padrão do site
5. `public/favicon.svg` foi substituído pelo ícone do site

## Plataformas de Hospedagem Estática

### Netlify / Vercel / Cloudflare Pages

| Configuração           | Valor        |
| ---------------------- | ------------ |
| Comando de build       | `pnpm build` |
| Diretório de saída     | `dist`       |
| Versão do Node         | 22.12.0+     |
| Gerenciador de pacotes | pnpm         |

Um `vercel.json` opcional para Vercel:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

Implante via GitHub Actions; workflow de exemplo:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          PUBLIC_GOOGLE_SITE_VERIFICATION: ${{ secrets.GOOGLE_VERIFICATION }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

> Se estiver implantando em um subcaminho (ex: `https://user.github.io/repo/`), defina `base: "/repo/"` em `astro.config.ts`.

### Nginx / Auto-hospedado

Envie `dist/` para o servidor; configuração Nginx de exemplo:

```nginx
server {
    listen 80;
    server_name xingluo.example.com;
    root /var/www/xingluo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Cache de ativos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Notas de Desempenho

- Ativos em `_astro/` têm nomes de arquivo com hash e podem ser armazenados em cache por longo prazo (`immutable`)
- Arquivos HTML não devem ser armazenados em cache (ou apenas brevemente) para garantir atualizações oportunas de conteúdo
- Índices Pagefind carregam sob demanda; nenhuma estratégia especial de cache necessária
- Após a implantação, verifique se as imagens OG, RSS e o sitemap estão acessíveis

## Backends do Sistema de Comentários

Se você ativar um sistema de comentários, implante o backend correspondente:

| Sistema de comentários | Requisito de backend                                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| giscus                 | Nenhum; use o serviço público giscus.app (ou auto-hospedagem [giscus-vercel](https://github.com/giscus/giscus-vercel)) |
| twikoo                 | Implante o servidor twikoo (Vercel / CloudBase / auto-hospedagem)                                                      |
| waline                 | Implante o servidor waline (Vercel / Cloudflare / auto-hospedagem)                                                     |

Veja a documentação oficial de cada sistema de comentários e [Sistema de comentários](./doc-comments.md).
