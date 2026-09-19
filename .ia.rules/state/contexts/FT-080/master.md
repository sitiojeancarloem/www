# FT-080/FT-081 — Normalização bíblica estrutural

Estado: FT-080 concluída; FT-081 tecnicamente concluída e pendente de validação auditiva humana. Fonte: `.ia.rules/state/requests/FT-080/prompt.md`.

## Objetivo

Consolidar e implementar uma gramática global para referências bíblicas no TTS local, produzindo modos curto e longo a partir da mesma estrutura interpretada e eliminando a leitura indevida de `:` como `para`.

## Diagnóstico

- O runtime do produto entrega referências bíblicas cruas ao `SpeechSynthesisUtterance`; a pronúncia do separador fica indevidamente a cargo da voz instalada.
- O normalizador gerenciado reconhece apenas uma lista parcial de livros e somente referência simples ou intervalo, sempre em forma longa; ele é contrato de governança consumido e não é a camada local autorizada pelas FTs 078/079.
- O contrato histórico preservado já exige referência por ocorrência, agrupamentos e classificação antes de horário, mas a RCF local ainda não fixa a projeção curta/longa nem sua gramática composta.
- Correção por post, livro ou exemplo violaria a solicitação e a regra canônica contra hardcode.

## Ordem

1. Consolidar na RCF a gramática falada curta/longa sem reduzir o contrato anterior.
2. Criar parser/tokenizador comum no adaptador local, com uma AST compartilhada pelas duas projeções.
3. Integrar a projeção a todas as unidades faladas pertinentes, preservando segmentos técnicos e HTML visual.
4. Adicionar regressões unitárias da gramática e regressões runtime do payload efetivamente falado.
5. Executar gates focados, build isolado, rastreabilidade e revisão de preservação.

## Restrições

- Não editar o artigo usado como exemplo nem criar exceção por rota, texto ou livro.
- Não alterar o runtime gerenciado em `.ia.rules/`.
- Não tratar horário, URL, código, fórmula ou sintaxe não editorial como referência bíblica.
- Não inserir `para`, `por`, `até`, `capítulo`, `versículo` ou equivalentes no modo curto, salvo conectivo que já faça parte semanticamente de lista/intervalo.
- Não encerrar lacunas TTS independentes nem TO-DO em avaliação humana.

## Aceite

- Uma AST única sustenta as projeções curta e longa.
- Os casos obrigatórios simples e compostos resultam nas formas especificadas.
- Outros livros, livros numerados e abreviações comprovam aplicação global.
- Horário e segmentos técnicos permanecem inalterados.
- Nenhum payload bíblico contém `para` entre capítulo e versículo.
- Modos, controles, footnotes, links, headings, TOC, tabelas, gráficos e idiomas permanecem sem regressão.

## Implementação e validação

- O adaptador local recebeu parser modular que reconhece livros simples, compostos, numerados em algarismos arábicos ou romanos, abreviações e variantes sem acento; cada ocorrência gera uma AST de grupos, capítulos, itens, intervalos, separadores e versão.
- As projeções curta e longa consomem a mesma AST. A curta usa vírgulas, ponto e vírgula, `a` e conectivos necessários; a longa explicita capítulo/versículo, pluraliza listas e intervalos e herda o livro entre grupos.
- O normalizador atua depois da extração editorial comum em parágrafos, títulos permitidos, links, tabelas, gráficos e referências derivadas, protegendo `code`, `pre`, `kbd` e `samp`; horário e sintaxe não classificados permanecem intactos.
- Onze casos unitários cobrem os exemplos obrigatórios, livros adicionais, numeração arábica/romana, abreviação, versão, listas, intervalos, grupos, conectivos, negativos e ausência de `para`, `por` ou `até` entre capítulo e versículo.
- O runtime Chromium percorreu `continuous`, `summary` e `full`, a fixture global e o artigo real `/p/5-verdades-de-genesis-27/`; todas as asserções bíblicas passaram e a execução encerrou somente na lacuna preexistente `MARCADORES_CITACAO_AUSENTES` da FT-077.
- `check:accessibility`, `check:footnotes`, `check:ts`, `check:assets`, `check:documentation`, `check:publication`, sintaxe Node e build produtivo isolado em `.tmp/ft081-site` aprovaram.
- A rastreabilidade escopada da RCF TTS aprovou 74 entradas e 74 sentenças materiais. O gate global conserva as pendências preexistentes da FT-066 e a sentença não mapeada em `RCFs/citacoes.md:53`.

## Commits

- Registro: `ff7fa0f1a7`.
- Norma: `ed5a8987a3`.
- Causal: `a1a42f1093`.
