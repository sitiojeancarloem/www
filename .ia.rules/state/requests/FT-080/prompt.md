# FT-080/FT-081 — Leitura global de referências bíblicas

- Origem: solicitações humanas no Codex.
- Data: 2026-09-18.
- Estado: incorporada nas FTs 080 e 081.
- RCF de destino: `RCFs/leitura-acessivel-e-tts.md`.

## Solicitação integral consolidada

> Corrigir globalmente a leitura de referências bíblicas: `:` separa capítulo e versículo e jamais representa `para`, horário ou outra palavra artificial. O artigo “5 verdades de Gênesis 2:7” foi apenas exemplo e não pode delimitar a solução.
>
> No modo curto, `Gênesis 2:7` deve resultar em “Gênesis, dois, sete”; no modo longo, “Gênesis, capítulo dois, versículo sete”. A mesma regra se aplica a qualquer livro reconhecido, como `Apocalipse 14:12`.
>
> Referências compostas devem preservar intervalos, versículos avulsos, mudança de capítulo, grupos separados por ponto e vírgula, conectivos explícitos ou inferidos, contexto herdado e pausas. `Gênesis 2:7-8,15` e `Apocalipse 14:12,22;15:3-7;16:1,3 e 5` são casos obrigatórios, não hardcodes.
>
> Consultar a especificação anterior aplicável e preservar suas regras. Reutilizar parser, normalização, AST/tokens ou abstração equivalente; curto e longo devem derivar da mesma referência interpretada. Não inventar construções indefinidas.

## Especificação anterior preservada

- O contrato histórico reduz cada ocorrência somente a partir de associações reais e preserva conteúdo suficiente quando a parcela exata não é demonstrável.
- Referências agrupadas já contemplam livro, versão, capítulos, versículos avulsos e grupos sucessivos, a exemplo histórico de `Isaías 12:3,7;53:10,22;53:2`.
- A normalização canônica exige classificação bíblica antes de leitura semelhante a horário, aceita livro numerado, abreviação e versão autenticadas e proíbe transformar exemplo herdado em hardcode.
- A correção das FTs 078/079 pertence ao adaptador local do produto e não autoriza alterar o runtime gerenciado em `.ia.rules/`.

## Decomposição vinculante

- Interpretar uma referência reconhecida em uma representação estrutural única antes de gerar fala.
- Aplicar a interpretação em qualquer unidade editorial do leitor, inclusive texto, título permitido, tabela e referência derivada, sem alterar HTML ou conteúdo visual.
- No modo curto, usar números, pausas e apenas conectivos semanticamente necessários; nunca inserir palavra entre capítulo e versículo.
- No modo longo, explicitar capítulo, versículo/versículos, intervalos e mudanças de capítulo sem perder conectivos ou contexto herdado.
- Preservar horários, URLs, código e sintaxe não classificados como referência bíblica.
- Cobrir livros simples, compostos, numerados e abreviados; referências simples e compostas; intervalos; listas; grupos; conectivos explícitos/inferidos; modos curto e longo; e ausência de `para`.
