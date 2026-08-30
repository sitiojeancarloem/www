# Solicitação preservada — restauração dos modos de cover

- origem: anexo `pasted-text.txt` recebido no Codex
- recebido_em: 2026-08-30T00:30:29.0901116-03:00
- sha256: `AFA57951DAE212750A43CB25693B8D21691F9A2A9E6405B14BDB5EB35379A957`
- frentes: `FT-048`, `FT-049`
- rcf_destino: `RCFs/carregamento-progressivo.md`
- estado_incorporacao: pendente

## Conteúdo integral

Revisar e corrigir a **regressão não solicitada no sistema de `cover`**, restaurando integralmente os múltiplos modos normatizados pelo RCF e desfazendo exclusivamente as alterações indevidas introduzidas por TO-DOs anteriores consideradas concluídas.

## Gravidade da regressão

O problema NÃO é apenas visual nem uma divergência menor de interpretação.

As normas vigentes do projeto — inclusive aquelas aplicáveis ao próprio executor das TO-DOs — **já estabelecem que é PROIBIDO presumir como aceitável qualquer regressão, eliminação, substituição ou perda de recurso/feature existente sem autorização explícita do desenvolvedor**.

Portanto, a implementação anterior que, ao atender fixes localizados, resultou na **eliminação prática dos múltiplos tipos de `cover` e sua substituição generalizada pelo modo horizontalmente infinito constitui FALHA GRAVE de execução e conformidade normativa**.

Não havia autorização para:
- remover modalidades existentes;
- substituir contratos anteriores;
- transformar comportamento especializado em comportamento global;
- considerar uma regressão necessária ou aceitável;
- sacrificar features existentes para simplificar a implementação;
- preencher ambiguidades mediante decisão unilateral do executor.

Na presença de qualquer aparente conflito, impossibilidade técnica ou necessidade de perda funcional, o executor DEVERIA ter preservado o comportamento existente ou **consultado explicitamente o desenvolvedor antes de qualquer regressão**. NÃO poderia decidir silenciosamente pela eliminação de recursos.

## Problema atual

O RCF normatizava **múltiplos tipos/modos de `cover`**. Após correções anteriores, esses modos foram indevidamente descaracterizados e **todos os posts passaram, na prática, a utilizar o `cover` horizontalmente infinito**.

Isso **NUNCA foi solicitado**.

Revisar as TO-DOs anteriores relacionadas a `cover`, especialmente as marcadas como concluídas após solicitar fixes pontuais, confrontando obrigatoriamente:

1. solicitação original;
2. implementação efetivamente realizada;
3. RCF vigente;
4. normas aplicáveis ao executor das TO-DOs;
5. comportamento anterior;
6. estado atual;
7. diferenças funcionais/visuais introduzidas.

NÃO presumir que uma TO-DO marcada como concluída foi corretamente implementada. Identificar precisamente onde houve extrapolação de escopo, perda de feature ou alteração indevida e reparar os danos sem desfazer correções legítimas.

## Regra de preservação

A correção DEVE partir do princípio normativo de que **features e comportamentos preexistentes permanecem válidos até que haja determinação explícita em contrário**.

É PROIBIDO:
- inferir que uma feature deixou de ser necessária;
- eliminar alternativas por parecerem redundantes;
- fundir modalidades distintas por conveniência;
- substituir vários contratos por uma implementação única;
- usar uma correção localizada como justificativa para alterar comportamento global;
- considerar regressão aceitável sem autorização explícita do desenvolvedor.

Se alguma preservação se mostrar tecnicamente incompatível com outro requisito obrigatório e a solução não puder ser determinada inequivocamente pelo RCF/estado real, **PARAR nesse ponto e solicitar decisão explícita**, em vez de eliminar funcionalidade.

## O que foi indevidamente interpretado

### `Cover` comum/alinhado à zona do artigo

A solicitação que identificava **descasamento entre a largura visual do `cover` e as margens da zona do artigo** NUNCA determinou transformar esse modo em horizontalmente infinito.

O requisito era exclusivamente:

- preservar esse tipo de `cover` como modalidade própria;
- manter seus **limites mínimo e máximo de altura baseados em `vh`**, conforme já normatizados;
- corrigir seu alinhamento/largura para coincidir com as **bordas visíveis da zona do artigo**;
- preservar comportamento, proporção, enquadramento e demais regras já existentes.

Logo, **NÃO converter esse modo em `cover` infinito** e NÃO utilizar o modo infinito como substituto global.

### `Cover` horizontalmente infinito

O modo horizontalmente infinito também já era uma modalidade própria e recebeu **somente dois ajustes específicos**:

1. **restaurar/garantir os limites mínimo e máximo de altura** que haviam sido perdidos, mantendo a **imagem centralizada em relação à página**;
2. adicionar uma **opção adicional**, sem substituir o modo existente, para produzir o efeito horizontal infinito por meio de **3 imagens coordenadas**:
   - uma imagem central;
   - uma imagem lateral esquerda;
   - uma imagem lateral direita;

   formando visualmente o efeito/pattern contínuo previsto.

Esses requisitos NÃO autorizavam:
- tornar todos os `covers` infinitos;
- eliminar modalidades anteriores;
- fundir tipos distintos;
- substituir comportamento global;
- alterar contratos de outros covers;
- remover opções já existentes;
- modificar regras de altura, enquadramento ou alinhamento além do explicitamente solicitado.

## Correção obrigatória

Restaurar a arquitetura de **múltiplos tipos de `cover`** exatamente conforme o RCF, contratos e comportamento preexistente legítimo, preservando cada modalidade e suas diferenças semânticas, visuais e funcionais.

A implementação DEVE:

- obedecer integralmente `RCF.md`, `AGENTS.md`/`agends.md` conforme nomenclatura real do projeto e demais normas vigentes;
- inspecionar o estado real antes de editar;
- revisar o histórico das TO-DOs/fixes relevantes;
- distinguir **requisito solicitado** de **alteração introduzida sem autorização**;
- restaurar features removidas ou descaracterizadas;
- preservar fixes anteriores que estejam corretos;
- desfazer somente regressões/desvios;
- NÃO preencher lacunas por imaginação;
- NÃO remodelar novamente o subsistema por conveniência;
- NÃO substituir modalidades por uma abstração simplificadora que elimine comportamento;
- NÃO alterar posts, páginas, layouts, responsividade, impressão ou consumidores compartilhados além do necessário.

## Validação obrigatória

Validar **cada tipo de `cover` normatizado separadamente**, e não apenas um caso visual.

Verificar, no mínimo:

- existência real de todas as modalidades previstas;
- seleção/ativação correta de cada uma;
- limites mínimos/máximos de altura em `vh`;
- alinhamento às bordas da zona do artigo quando aplicável;
- centralização do modo infinito;
- modo infinito tradicional;
- variante opcional de **3 imagens**;
- enquadramento e proporção;
- responsividade;
- visualização;
- impressão, quando aplicável;
- ausência de vazamento de regras entre modalidades;
- ausência de regressão em posts antigos e novos.

A tarefa SOMENTE pode ser considerada concluída quando:

1. os múltiplos modos de `cover` estiverem efetivamente restaurados;
2. cada modo obedecer ao seu contrato específico;
3. os fixes originalmente solicitados permanecerem funcionando;
4. nenhuma feature tiver sido removida, fundida ou substituída sem autorização;
5. não houver nova regressão direta, indireta ou em cascata.

Houve desperdício de processamento anterior pela execução de alterações **não solicitadas e normativamente proibidas**. Nesta revisão, a atuação DEVE ser **cirúrgica, rastreável e conservadora quanto a recursos existentes**: corrigir o que foi pedido, restaurar o que foi indevidamente perdido e **NUNCA assumir novamente que regressão ou perda de feature pode ser aceita sem consulta explícita ao desenvolvedor**.
