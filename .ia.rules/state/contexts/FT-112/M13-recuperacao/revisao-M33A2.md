# M33A2 — implementação parcial, não aceita para execução

Job 3130d366-c215-4c10-861c-43e37fef1b34 consultado uma vez. Runtime comprova leitura dos dois alvos, edição do adaptador e syntax check exit 0. COMPLETED não satisfaz o contrato semântico. Diff revisado revela:

1. AccessibleReading exige article.jcem-post contendo título e .page__content; chamada recebe fragmento sem esse invólucro e retorna sem normalizar. A afirmação de cumprimento integral do plano é incorreta.
2. Caption/scope/aria foram apenas contados, não validados. Referência integral usa atributo title em vez do contrato data-jcem-reference-full. Não há verificação de backlinks nem da nota ap1217.
3. Rescue envolve somente escrita do resultado; falhas anteriores não seriam persistidas. HTML não é salvo antes dos primeiros asserts.
4. Assert de tabela, ênfase crua e marcador visível foram retirados indevidamente. Somente a exigência estilística de um parágrafo por blockquote devia ser substituída por diagnóstico.

Não executado renderizador. Artigo preservado: bf152ff4c0fcbced951734a10a0c49520dc35e421fcab6ff4188c06696b5d9d7. Git determinístico dev ahead58, zero commits Worker; alteração funcional da unidade somente no adaptador; demais alterações herdadas. Commit de checkpoint parcial pelo supervisor, sem alegar aceite ou HTML aprovado.

Próxima unidade M33A3 corrige exclusivamente estes desvios comprovados, preservando paths/frontmatter e composição já escrita. Não reabrir exploração editorial ou fontes.
