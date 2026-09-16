<!-- AI-PROCESSED -->
# RCF-JCEM-OPERACAO-IA-001

Status: vigente; projeção operacional materializada na FT-033.

Escopo: modus operandi da IA específico deste produto, roteamento local e relação entre o RCF detalhado e o adaptador operacional `agents.local.md`.

## Autoridade e arquitetura

- `AGENTS.md` e a raiz canônica `.ia.rules/` governam o processamento. `RCF.md` e suas sub-RCFs governam produto, requisito, arquitetura e negócio. Esta sub-RCF especializa somente a operação necessária para aplicar corretamente esses contratos no JeanCarloEM Blog.
- O `agents.local.md` canônico DEVE residir na raiz do repositório e funcionar como adaptador local compacto. Ele NÃO PODE substituir, reinterpretar ou copiar extensamente este RCF, as sub-RCFs ou a Norma.
- A árvore predecessora `.agents/` NÃO PODE ser lida, atualizada nem usada como autoridade pela projeção nova. Sua existência histórica não autoriza reintrodução, sincronização bidirecional ou fallback.
- O adaptador local DEVE conter somente precedência, contexto estável do produto, gatilhos e links para as rotas autoritativas. Regra detalhada permanece em sua sub-RCF; resumo que possa divergir é proibido.
- Subarquivo operacional novo somente PODE existir quando medição comparativa demonstrar redução recorrente de contexto sem perda semântica. A modularização já existente em `RCFs/` DEVE ser reutilizada antes de criar outra fragmentação.

## Roteamento especializado

| Gatilho material | Rotas mínimas obrigatórias, após `AGENTS.md`, índice e papéis aplicáveis |
|---|---|
| alteração editorial comum | recurso canônico `.ia.rules/resources/editorial-authoring.md`, capacidade `WEB-EDITORIAL`, `RCF.md` e sub-RCFs diretamente afetadas |
| síntese `bate-papo:` | `RCFs/bate-papo.md`, `RCFs/namespaces-editoriais.md` e publicação quando aplicável |
| citação, nota ou bibliografia | `RCFs/citacoes.md`, `RCFs/referencias-e-footnotes.md` e leitura acessível quando houver projeção falada |
| TTS, leitor de tela, idioma, pronúncia, tabela, imagem ou gráfico acessível | recurso canônico `.ia.rules/resources/spoken-normalization.md`, `RCFs/leitura-acessivel-e-tts.md` e contratos semânticos de origem citados por ela |
| PageSpeed, nova dependência ou asset client-side | `RCFs/desempenho-e-dependencias.md` e `RCFs/carregamento-progressivo.md` |
| 404, masthead, rodapé, navegação ou componente comum | `RCFs/componentes-compartilhados.md` |
| impressão ou PDF | `RCFs/impressao-ieee.md` e a sub-RCF semântica do conteúdo afetado |
| build, GitHub Pages ou publicação | `RCFs/publicacao.md` e o cenário operacional correspondente em `.ia.rules/` |

Rotas são cumulativas quando uma tarefa cruza domínios; o adaptador NÃO PODE escolher apenas uma rota e omitir dependência material.

Os recursos canônicos `editorial-authoring` e `spoken-normalization` DEVEM governar, respectivamente, transformação autoral e preparação semântico-fonética antes de qualquer especialização local; o repositório NÃO PODE copiar, renomear, substituir ou congelar essas capacidades em norma paralela.

RCF, plugin, include, TypeScript e teste deste produto PODEM especializar apenas a materialização Web editorial, o HTML acessível, os modos de leitura, a integração com o sintetizador do navegador e os datasets/gráficos locais que não pertençam à Norma Operacional.

## Método por classe de trabalho

- Antes de editar, a IA DEVE inventariar fonte, configuração, implementação, testes, artefato renderizado e estado publicado pertinentes. Ausência aparente de capacidade NÃO autoriza mecanismo paralelo.
- Equalização de TO-DO DEVE preservar o item perene literal e desmarcado, criar FTs distintas para norma e implementação e concluir todas as normatizações antes do gate humano de código.
- Criação ou edição editorial DEVE preservar voz, texto, marcações autorais e referências; transformação semântica ou falada é camada adicional e rastreável, nunca reescrita invisível do original.
- Síntese de bate-papo DEVE distinguir fala, síntese e inferência, preservar nuances, divergências, identificadores de referência e disclaimers cumulativos.
- Otimização DEVE avaliar continuamente o contrato PageSpeed por layout e amostras representativas, sem usar uma publicação isolada para degradar conteúdo editorial.
- Alteração visível DEVE validar o artefato renderizado nos estados aplicáveis. Alteração publicada só conclui quando o commit-fonte, o artefato servido e a evidência pública convergirem.
- Gate executado parcialmente, bloqueado ou externo inconclusivo DEVE permanecer declarado separadamente; resultado focado aprovado não equivale a aprovação global.

## Projeção e validação

- A FT-033 DEVE criar o adaptador a partir desta RCF somente após autorização expressa, comparar cobertura cláusula a cláusula e provar que cada gatilho alcança a rota correta.
- A primeira projeção NÃO DEVE criar subarquivo local: a tabela de roteamento acima e as sub-RCFs já modularizadas são suficientes até evidência contrária mensurável.
- Validação DEVE rejeitar regra de produto exclusiva no adaptador, cópia extensa, link inexistente, rota que omita contrato aplicável, referência à árvore predecessora como fallback e qualquer diferença de modalidade RFC 2119.
- Mudança posterior em uma rota DEVE atualizar esta RCF antes da projeção local e invalidar a aferição de cobertura anterior.
