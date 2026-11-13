# Auditoria de evidências — FT-104

Escopo: fonte versionada das FTs 103–105, executor local e evidência já aceita. Não encerra a FT nem substitui aceite humano.

## Origem e preservação
Fonte: .ia.rules/state/requests/FT-103/prompt.md. Objetivo: alternativas legítimas, finitas e determinísticas, preservando segurança, contrato, escopo e último estado válido. Autorização de implementação registrada nessa fonte.
Conteúdo atual dos arquivos abaixo coincide com HEAD, normalizando apenas CRLF/LF. Os hashes identificam os bytes auditados; não alegam comparação independente com a TODO original de 2026-09-26.
- .ia.rules/state/requests/FT-103/prompt.md | SHA-256 bytes atuais: 1c5e25bf04f6a568cd91105e9cda21264427d24fbdaffc457778071563ae369d
- RCFs/resiliencia-operacional.md | SHA-256 bytes atuais: ef553436dd3ffbe89e78bcafe3d3c16574bcde79ae543e1820f9ef0893d35e5c
- .ia.rules/local/runtime/resilient-operation.ts | SHA-256 bytes atuais: 2f6fab179d0cd8fd947f8b9046970ab66350019cbed35b54b9d0b054d15e6e2c
- .ia.rules/local/runtime/process-outcome.ts | SHA-256 bytes atuais: dea192a77d5aca82645dbcc50dcf05cb425f060b4b77b42b243cd1cade81f478
- .ia.rules/local/runtime/verified-process.ts | SHA-256 bytes atuais: 120aaa41cfcd32797201d438c1c452902617d306928f4b9ae743438206fa413e
- scripts/test_resilient_operation.ts | SHA-256 bytes atuais: 4f856c876ec50b42f676acb51627f8bcdec4d63ec461f7a32d0faaa64f1613bd
- scripts/test_process_outcome.ts | SHA-256 bytes atuais: 6fa314d6422a728e17b4f65f3b6a9b448bee4240d261a94313b4ce954703cb79
- scripts/test_verified_process.ts | SHA-256 bytes atuais: 2dc4cdda70f432a4f3a9a38fc4988eef9d40ad5d087bf2ff87fdcb5c0b9a8a51
- scripts/test_verified_process_integration.ts | SHA-256 bytes atuais: a2906f7775039e9d08fc05bbdbe4e50b0d925c7f16f39bcec723f1ac1bb55610

## Origem → contrato → implementação
Alternativas finitas e ordenadas: resilient-operation. Elegibilidade e blocked preservam fronteiras fornecidas pelo chamador; verify deve representar o contrato integral da operação. Clone JSON preserva estado funcional; não desfaz efeitos externos.
Observabilidade: códigos internos distinguem erro técnico, candidato inválido e pós-condição rejeitada. process-outcome classifica processo; verified-process compõe uma execução com verificação.
Rastreabilidade oficial do RCF (dez entradas sincronizadas):
- RCF linha 10 → .ia.rules/local/runtime/resilient-operation.ts → commit f7977d35b762d5d4825cb0aa207fa3d427e306dc
- RCF linha 12 → .ia.rules/local/runtime/resilient-operation.ts → commit f7977d35b762d5d4825cb0aa207fa3d427e306dc
- RCF linha 17 → .ia.rules/local/runtime/resilient-operation.ts → commit f7977d35b762d5d4825cb0aa207fa3d427e306dc
- RCF linha 18 → .ia.rules/local/runtime/resilient-operation.ts → commit f7977d35b762d5d4825cb0aa207fa3d427e306dc
- RCF linha 19 → .ia.rules/local/runtime/resilient-operation.ts → commit f7977d35b762d5d4825cb0aa207fa3d427e306dc
- RCF linha 23 → .ia.rules/local/runtime/resilient-operation.ts → commit f7977d35b762d5d4825cb0aa207fa3d427e306dc
- RCF linha 24 → .ia.rules/local/runtime/resilient-operation.ts → commit f7977d35b762d5d4825cb0aa207fa3d427e306dc
- RCF linha 25 → .ia.rules/local/runtime/resilient-operation.ts → commit 325f8642c83dcde666a50dcc92e47e85563d2333
- RCF linha 31 → scripts/test_resilient_operation.ts → commit f37ba4db94b2323be9f0dd63185936839ff9aaf8
- RCF linha 32 → scripts/test_verified_process_integration.ts → commit 090649d1f5201ea1f29ac59d6c72097dc20fb94a

## Evidência de validação aceita
- Job 56c15176-0e1a-4393-b0b3-40af3822a841: Node24.19.0, checagem de tipos e quatro suítes exit0 após correção de classificação de erros. É ID de job, não commit.
- Job 7a4bfd71-36da-4441-9135-bb3e08d4090c: validação oficial escopada das dez entradas exit0; preservação das demais entradas e linhas comprovada. É ID de job.
- Commit 1e19f7dc0c: últimos vínculos causais de testes versionados.

## Limites e continuidade
- Integração existente prova execução única: sucesso, exit3 e resume sem reexecução com candidato adulterado rejeitado. Não prova alternativas entre múltiplos processos; essa regressão pertence à FT-105.
- Gate global não aprovado: falha conhecida RCF_SENTENCA_NAO_MAPEADA:RCFs/bate-papo.md:12, fora desta unidade. A validação escopada não equivale a aprovação global.
- FT-105 depende do encerramento técnico da FT-104; não atribuir essa dependência diretamente ao RCF bate-papo.
- Revisão de encerramento e atualização canônica ainda pendentes. Alterações herdadas de FT-112/continue e arquivos _site não integram esta auditoria.
