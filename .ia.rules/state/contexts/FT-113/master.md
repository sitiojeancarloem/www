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
- Falha relatada e reproduzida pelo usuário (ainda sem reprodução funcional pelo supervisor/Worker): `jcem_accessibility=tabela_sem_caption` interrompe `npm run dev-live -- --drafts`.
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
- FT-113: diagnóstico/contrato, em andamento; FT-114: implementação, autorizada pelo pedido original; FT-115: integração/validação, dependente da FT-114.
- Reprodução Worker 9ec1e23a: exit 1, SOURCE=_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md, jcem_accessibility=tabela_sem_caption.
- Registro local desta frente; estados herdados de outras FTs preservados.
- Evidência supervisor: cee6b553 exit0 com Kramdown2.5.2 GFM aceitando IAL após tabela.
