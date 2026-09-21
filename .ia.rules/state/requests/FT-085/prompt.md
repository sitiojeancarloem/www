# Fonte da FT-085 — inicialização de figuras IEEE em largura total

- Origem: solicitação humana no Codex.
- Data: 2026-09-20T21:26:38.6263339-03:00.
- Identidade: usuário mantenedor do repositório corrente.
- Estado de incorporação: vinculada às FTs 085–087.
- Fonte material integral: item adicionado a `TODO.ia.md` pelo commit `d4e1465075c021fd2919c4cf020d5645cf8fd62b`.

## Solicitação integral pertinente

> continue, depois compacte o conteto e inicialize to-do não inicializadas.

## Auditoria de não duplicação

- FTs 001–084 e seus contextos foram consultados antes da inicialização.
- A única raiz operacional sem marcador de estado e sem FT correspondente era `Implementar figuras de largura total no modo de impressão IEEE, com marcação explícita, inferência automática e normatização permanente`.
- Não foi localizada FT, contexto ou pedido anterior com esse objetivo; contratos IEEE existentes admitem elemento de largura total em abstrato, mas não implementam nem inicializam esta capacidade específica.
- A solicitação autoriza registrar as fases ainda não iniciadas. Ela não autoriza, por si só, normatizar, adicionar dependências, implementar código, alterar documentação pública ou concluir a TO-DO.

## Compactação solicitada

- `npm run agent:compress` foi tentado antes desta inicialização e falhou fechado porque o runtime gerenciado exige `.ia.rules/state/continue.ia`, ausente no formato vigente.
- A migração oficial também falhou antes de escrever com `TODO_GOVERNANCA_INVALIDA`; o `AGENTS.md` vigente continua declarando `.ia.rules/continue.ia` como estado canônico.
- Nenhuma migração estrutural foi forçada e `handoff.md` não foi reescrito com informação falsa.
