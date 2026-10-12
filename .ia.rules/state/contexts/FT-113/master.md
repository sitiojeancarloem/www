# FT-113 — Correção estrutural: tabelas Markdown, acessibilidade e TTS

**Fonte:** `.ia.rules/state/requests/FT-113/prompt.md`  
**Hash SHA256:** `206EA49C619DF6737CACF5482185BF65A9B1003D1BA88E34A319F68939C7D8BF`  
**Data:** 2026-10-12  
**Escopo:** tabelas Markdown/HTML, acessibilidade/TTS, preservação de conteúdo/semântica/sintaxes reais

## Contrato mínimo IAL nativa (Kramdown 2.5.2 GFM)
- Tabelas em Markdown devem aceitar atributos de ID e classes (`{: #id .class }`) após a tabela.
- Atributo `data-jcem-caption` deve ser suportado para metadado de legenda acessível.
- Exemplo válido: `| a | b |\n|---|---|\n| 1 | 2 |\n{: #dados .compact data-jcem-caption="Valores reais"}`

## Diagnóstico
- Falha relatada pelo usuário e reproduzida pelo Worker 9ec1e23a: `jcem_accessibility=tabela_sem_caption` interrompe `npm run dev-live -- --drafts`.
- Tabelas Markdown nativas não devem ser convertidas obrigatoriamente para HTML para declarar `caption`.
- TTS e acessibilidade devem funcionar com metadados declarados em Markdown, sem parser paralelo.

## Plano de validação (mínimo)
A. Reproduzir build e identificar tabela/path exato da falha  
B. Registrar contrato mínimo IAL nativa e diagnóstico  
C. Plugin/testes: validar Kramdown GFM com `data-jcem-caption`  
D. Docs/exemplo e metadata real autorizada  
E. TTS DOM/headers/referências/testes  
F. dev-live/HTML/gates: `npm run dev-live -- --drafts` sem erros

## Estado
- FT-113: diagnóstico/contrato concluídos; FT-114: correção implementada; FT-115: validação da correção concluída, gate geral com divergência preexistente de documentação descrita abaixo.
- Reprodução Worker 9ec1e23a: exit 1, SOURCE=_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md, jcem_accessibility=tabela_sem_caption.
- Registro local desta frente; estados herdados de outras FTs preservados.
- Evidência supervisor: cee6b553 exit0 com Kramdown2.5.2 GFM aceitando IAL após tabela.

## Checkpoint de entrega — 2026-10-12
- Causa: tabela de dados do draft identificado sem legenda declarada. IAL nativa deve vir imediatamente após a última linha, sem linha vazia. Plugin já consumia `data-jcem-caption`; diagnóstico passou a indicar path e sintaxe utilizável (72fa320682).
- Correção: legenda editorial real no draft; `/visual-artifacts` excluído do build para evitar cópia de 5,82 GB de artefatos de QA/ENOSPC (42907dbda2). Markdown, conteúdo e parser existentes preservados.
- TTS/documentação/gate específico: f7249cc591. Fala usa caption uma vez, headers de thead ou primeira linha TH de tbody, headers explícitos, linhas TH de dados e tfoot; referências permanecem na linha, nos três modos.
- Testes Markdown/HTML: dc9c201f2c, 3b5c7bfbff, d5ec0263c8; negativos ausente/vazio/espaços, captions próximas, id/class/alinhamento/ênfase/link/footnote, HTML existente e idempotência. Job f7f94ad3: patch exit0, Ruby `markdown_tables=ok`.
- Testes TTS: 9b4be8be22, 27efc3a674, 78b4fdf7bd, 7db5a358ec. Job b7d4115e: patch exit0, `table_speech=ok`; fala exata validada. Stub CSS.escape limitado a IDs alfabéticos supre API ausente no JSDOM; escaping arbitrário não foi testado.
- Build production com drafts e runtime browser aprovados no job d247d901 (`accessible_runtime=ok`, spoken_units=23). Job 7b7c2de3 executou `npm run dev-live -- --drafts`: HTTP200 no artigo, caption real/data-jcem-accessible conferidos; servidor próprio encerrado.
- Gate geral job 850fe313: `npm run check` exit1 somente ao chegar em check:documentation (`inventário de modos de uso divergente`): teste espera 4 documentos e existem 5 versionados, incluindo guia anterior FT-101. Checks anteriores passaram. Não relaxado nem declarado aprovado.
- Limites: não houve avaliação auditiva humana/leitor de tela; não se afirma suporte universal a tabelas complexas com spans. Associações explícitas de headers são usadas quando presentes. Nenhum push/publicação.
- Estado Git: commits exclusivos dos arquivos desta frente; alterações herdadas de FT-112/continue e alterações geradas em `_site` preservadas. Árvore não está limpa. Jobs incompletos preservados; nenhuma exploração repetida ou manutenção do Worker nesta entrega.
