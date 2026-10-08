# Contexto mestre — FTs 103 a 105

Estado: FT-103 concluída no histórico; FT-104 em implementação autorizada. FT-105 depende da implementação.

## Objetivo

Consolidar uma semântica forte e operacional de resiliência: falha contornável aciona alternativa oficial finita; conclusão sem objetivo cumprido somente ocorre após esgotamento comprovado, com estado e diagnóstico preservados.

## Fases

1. FT-103 — norma global e compatibilização dos conceitos existentes.
2. FT-104 — implementação no mecanismo reutilizável apropriado e nos testes de governança.
3. FT-105 — integração, regressão e evidência de alternativas finitas.

## Limites

- Segurança, autorização, escopo e contrato prevalecem sobre qualquer fallback.
- Ausência de alternativa legítima não autoriza improvisação nem simulação de sucesso.
- A implementação deve reutilizar os contratos de scripts, hooks, fallbacks e longa duração já gerenciados.

## Plano da FT-104

1. Implementar motor local puro e síncrono de alternativas finitas em .ia.rules/local/runtime/resilient-operation.ts; sem I/O, subprocessos ou alteração do núcleo.
2. Validar matriz de estados, elegibilidade, pós-condição e preservação; preparar artefato JavaScript por compilação TypeScript e documentar contrato.
3. Integrar ao mecanismo de processos longos somente por composição, sem reproduzir timeout/cancelamento; validar na FT-105.

Checkpoint: long-running.ts fornece processos, timeout e retomada, mas não executor de alternativas nem preservação transacional do estado funcional. A afirmação anterior do worker sobre essa preservação foi rejeitada. Consulta oficial da release v0.1.14-rc5 apontou apenas package.json desatualizado (jobs 9479e1c3/efe47108); núcleo analisado sem delta no plano. Atualização efetiva fica separada porque há alterações herdadas em _site e commits locais; não executar push automático desses commits. Node disponível: 22.21.0; compilador TypeScript presente; execução em baseline Node 24+ ainda deve ser comprovada.
