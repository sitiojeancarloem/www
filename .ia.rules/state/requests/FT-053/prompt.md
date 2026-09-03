# Solicitação preservada - Equalizer de TOC, TTS, COVER e Hero

- origem: prompt humano recebido no Codex
- recebido_em: 2026-09-03T02:32:33.4097652-03:00
- sha256_conteudo_integral: `04684C33229BE6C105EC831476A6E4895E17CBCA76F9FFB06EB70F7BC8EE9D1F`
- frentes: `FT-053`, `FT-054`, `FT-055`, `FT-056`, `FT-057`
- rcf_destino: `RCFs/leitura-acessivel-e-tts.md`, `RCFs/carregamento-progressivo.md`, `RCFs/componentes-compartilhados.md`, `RCFs/impressao-ieee.md`
- evidencia: `.ia.rules/state/requests/evidencias/projeto-cover.pdf`
- estado_incorporacao: equalizado

## Conteúdo integral

# Continuar execução, reiniciar Equalizer e concluir todas as FTs sem regressão

Continue o trabalho em andamento, preservando integralmente estado, decisões, normas, implementações e progresso válidos.

Há novas TO-DO(s); portanto, **reinicie o `equalizer` de `TODO.ia.md` a partir do estado atual**, incorporando tudo o que foi acrescentado desde a última equalização. NÃO considere execução anterior suficiente.

## Regra nuclear

É **EXPRESSAMENTE E TERMINANTEMENTE PROIBIDO**:

- introduzir regressão;
- remover, eliminar, degradar ou reduzir feature existente;
- perder compatibilidade ou comportamento válido;
- enfraquecer, reduzir, simplificar ou tornar menos explícita qualquer norma, regra, garantia, proibição ou contrato;
- produzir essas perdas direta, indireta ou progressivamente ao longo de múltiplas alterações.

Refatoração, reorganização, equalização, simplificação arquitetural ou nova norma **NÃO autorizam regressão nem eliminação de feature**.

Se surgir aparente contradição entre requisito novo e feature/norma existente:

1. **NÃO elimine nem enfraqueça nenhuma delas**;
2. se a compatibilização não for inequivocamente determinável, **questione o desenvolvedor**;
3. se for tecnicamente necessário prosseguir antes dessa decisão, **desacople a implementação conflitante em vez de removê-la**, preservando-a integralmente e registrando vínculo/rastreabilidade inequívoca que permita seu **reacoplamento simples, seguro e completo** posteriormente.

Desacoplamento NÃO significa abandono: código, feature, norma, configuração, testes e contexto necessários à recuperação DEVEM permanecer preservados e rastreáveis.

## Execução autorizada

Está expressamente autorizada a execução de todas as fases necessárias, sem nova confirmação intermediária:

- inspeção;
- normatização/RCF;
- documentação;
- implementação;
- refatoração;
- migração;
- testes;
- correções;
- equalização;
- commits;
- push conforme fluxo vigente.

NÃO pare na normatização quando houver implementação correspondente.

## FTs e Equalizer

- Conclua **TODAS as FTs em andamento** e suas dependências.
- Execute integralmente o `equalizer` até a conclusão definitiva de todas as TO-DO(s)/FTs aplicáveis.
- NÃO reduza escopo ou critérios para declarar conclusão.
- NÃO marque item concluído enquanto houver requisito material, implementação, teste, correção ou equalização pendente.

## Git e continuidade

NÃO acumule volume significativo de trabalho válido sem persistência.

Faça commits intermediários coerentes/atômicos em estados estáveis e `push` quando compatível com o fluxo vigente, evitando perda por eventual interrupção.

NÃO gere commit sem alteração material nem fragmente artificialmente o histórico.

## Contexto

Compacte/consolide o contexto antecipadamente sempre que possível e seguro, preferencialmente antes da saturação.

A compactação NÃO PODE perder:

- requisitos;
- nuances;
- decisões;
- normas;
- FTs/TO-DO(s);
- rastreabilidade;
- estado operacional;
- informações necessárias à continuidade.

## Conclusão

Somente encerre quando **TODAS as FTs e TO-DO(s) aplicáveis estiverem concluídas, implementadas, equalizadas, testadas, validadas e persistidas**, sem regressão, perda de feature, enfraquecimento normativo ou pendência material conhecida.

Qualquer conflito ainda não solucionável DEVE terminar em decisão solicitada ao desenvolvedor ou em desacoplamento rastreável e reversível - **jamais em remoção ou regressão**.
