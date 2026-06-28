# Importador de reconstrução WordPress

Processo auxiliar, isolado do build Jekyll, para reconstruir posts, páginas e mídias a partir do WXR oficial em `old-root/jeancarloem.WordPress.2023-08-09.xml`.

## Decisão de diretório

CONTRADIÇÃO DETECTADA: pedido anexo (`drafts/`) vs estrutura real do repositório (`_drafts/`) - Aplicando prioridade máxima.

A saída padrão usa `_drafts/`, porque esse é o diretório existente com reconstruções parciais e imagens já recuperadas. O caminho pode ser sobrescrito por `--drafts=outro-diretorio` quando for necessário gerar um espelho fora do fluxo Jekyll.

## Reconstrução textual

```bash
npm run import:wxr:dry
npm run import:wxr
```

`import:wxr:dry` valida e produz um plano sem escrever drafts. `import:wxr` grava os arquivos em `_drafts/<slug>/reconstruido.md` ou, quando já existir conflito, em `_drafts/<slug>/reconstruido.candidate.md`.

O parser trata o WXR 1.2 por DOM XML com `jsdom`, preserva metadados WordPress no front matter e usa `turndown` com regras conservadoras. Tabelas, embeds, scripts, estilos, templates, objetos e blocos sensíveis ficam como HTML quando a conversão para Markdown não é segura.

## Recuperação de mídias

```bash
npm run import:media:plan
npm run import:media
```

`import:media:plan` monta a fila sem baixar. `import:media` usa os provedores de `importador/providers.json`, concorrência controlada, retry, log JSONL e retomada por estado. A ordem atual tenta cópia local de `old-root`, Internet Archive CDX, Internet Archive direto e Arquivo.pt CDX.

Os downloads ficam em `_drafts/_midias-recuperadas/` e cada tentativa é registrada em `importador/state/media-attempts.jsonl`, diretório ignorado pelo Git.

Em rede instável, execute lotes menores:

```bash
npm run import:media -- --limit=10 --concurrency=1 --max-seconds=300
```

## Validação

```bash
npm run check:importador
```

Executa verificação sintática dos scripts, parse do WXR e plano reduzido de mídias.
