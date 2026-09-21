# Contexto mestre — FT-085 a FT-087

Estado: fases registradas, ainda não iniciadas; FT-086 e FT-087 bloqueadas por dependência e autorização. Fonte material: `TODO.ia.md` no commit `d4e1465075c021fd2919c4cf020d5645cf8fd62b`. Pedido de inicialização: `.ia.rules/state/requests/FT-085/prompt.md`.

## Objetivo

Permitir, exclusivamente na impressão IEEE, que figuras adequadas atravessem as duas colunas por marcação manual ou inferência automática conservadora, preservando fluxo, ordem, margens, proporção, legendas, paginação, web e comportamento das demais imagens.

## Auditoria inicial e não duplicação

- O item foi adicionado integralmente a `TODO.ia.md` no commit `d4e1465075`; antes desta inicialização usava o único checkbox operacional legado do arquivo.
- Não existe FT-085 ou superior, contexto, pedido ou implementação anterior dessa capacidade.
- `RCFs/impressao-ieee.md` já prevê genericamente elementos de largura total e um contrato público capaz de registrá-los; isso é infraestrutura a inspecionar e reutilizar, não prova de implementação da nova frente.
- FTs 001–084, inclusive FT-077 e suas três correções, permanecem preservadas e não são reinicializadas.
- A marcação `📌` representa somente fases registradas. Não equivale a equalização, normatização, implementação ou aceite.

## Fases e dependências

1. FT-085 — equalização e normatização: inventariar o pipeline real, comparar mecanismos existentes, consolidar contrato, decisões, critérios, precedências e limites; nenhum código ou dependência entra nesta fase.
2. FT-086 — implementação e documentação: somente após FT-085 e autorização humana, materializar marcador, inferência, cache, integração ao build e guia ilustrado sob `docs/`.
3. FT-087 — integração e validação: somente após FT-086 e autorização humana, executar matriz positiva, negativa, limítrofe, interartigos, web, impressão real, documentação e rastreabilidade.

## Limites já declarados pela fonte

- O critério geométrico é obrigatório: altura projetada em largura total de até 35% da altura útil da página.
- Geometria isolada nunca autoriza automarcação; deve haver evidência inequívoca de densidade textual e/ou visual cuja redução comprometa leitura.
- Marcação manual válida prevalece e não pode ser removida pela inferência.
- Incerteza preserva o comportamento atual; a inferência deve ser determinística e conservadora.
- A web não pode sofrer alteração de aparência, fluxo, dimensões ou comportamento.
- Não usar sobreposição, posicionamento absoluto como contorno, margens negativas arbitrárias, duplicação ou JavaScript pós-layout quando o mecanismo declarativo real for suficiente.
- Bibliotecas maduras e dependências existentes devem ser avaliadas antes de qualquer algoritmo próprio.
- Documentação de uso canônica somente sob `docs/`, ligada pelo RCF e pelo `README.md`.

## Próxima retomada

Começar pela FT-085 somente após autorização humana para equalização e normatização. A retomada deve ler este contexto e a fonte integral em `TODO.ia.md`, inventariar implementação, configuração, testes, dependências e RCFs reais, e permanecer sem código até o commit normativo.
