# FT-080/FT-081 — Normalização bíblica estrutural

Estado: FT-080 em andamento; FT-081 aguardando a consolidação normativa. Fonte: `.ia.rules/state/requests/FT-080/prompt.md`.

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
