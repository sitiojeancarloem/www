# Solicitação preservada — correção integral das regressões de cover

- origem: anexo `pasted-text.txt` recebido no Codex
- recebido_em: 2026-08-30T18:35:25.5019155-03:00
- sha256: `6DE0B0DD95796F51D17E2BD18D957192C4DB292B024FA811C6327EEEAC04D97F`
- frentes: `FT-050`, `FT-051`, `FT-052`
- rcf_destino: `RCFs/carregamento-progressivo.md`
- evidencias: `evidencia7b.png`, `evidencia9.png`, `evidencia10.png`, `evidencia11.png`, `evidencia12.png`
- estado_incorporacao: incorporado em `RCFs/carregamento-progressivo.md`

## Conteúdo integral

Corrigir **imediatamente e de forma integral** as regressões introduzidas no sistema de `cover`. As correções anteriores NÃO resolveram o problema e, em vários pontos, **alteraram comportamentos que já funcionavam, extrapolaram explicitamente o que havia sido solicitado e criaram novas regressões**.

Isto NÃO é uma autorização para redesenhar, simplificar ou reinterpretar o sistema de `cover`. A tarefa é **restaurar o comportamento correto, corrigir exatamente os defeitos apontados e preservar rigorosamente as features existentes**.

Antes de alterar qualquer código, revisar as TO-DOs anteriores pertinentes, o RCF vigente, a implementação anterior à regressão e as evidências em `.ia.rules\state\evidencias`. NÃO assumir que uma implementação anterior marcada como concluída estava correta. Confrontar **pedido original × comportamento normatizado × comportamento anterior × estado atual**.

## 1. `evidencia7b.png`, `evidencia9.png` e `evidencia10.png` — NÃO transformar a zona do artigo em infinito horizontal

A(s) TO-DO(s) que apontavam `evidencia7b.png` **NUNCA solicitaram que esse `cover` passasse a ocupar horizontalmente toda a página/janela**.

Reiterando de forma inequívoca: o requisito era apenas que o `cover`:

- continuasse respeitando os limites **mínimo e máximo de altura** já estabelecidos;
- tivesse sua largura ajustada até as **bordas visíveis da zona do artigo**;
- permanecesse restrito à **zona do artigo**.

`evidencia9.png` demonstra que foi aplicado indevidamente o efeito de continuidade horizontal infinita. Isso é regressão.

Para eliminar definitivamente qualquer margem de interpretação, `evidencia10.png` contém uma **linha vermelha demarcando explicitamente a borda da zona do artigo**, na mesma situação anteriormente representada por `evidencia7b.png`.

**Zona do artigo NÃO significa página. NÃO significa janela. NÃO significa viewport.**

Se a intenção fosse ocupar toda a janela, teria sido solicitado explicitamente `página`, `janela`, `viewport` ou equivalente. NÃO reinterprete novamente essa distinção.

Corrigir para que esse modo termine precisamente nas bordas da **zona do artigo**, preservando os limites de altura e os demais comportamentos legítimos preexistentes.

## 2. `evidencia9.png` e `evidencia10.png` — regressão da `FLAG`

Aquelas mesmas TO-DOs determinavam expressamente que **nenhuma regressão poderia ocorrer, inclusive como consequência indireta das correções**.

Apesar disso, `evidencia9.png` e `evidencia10.png` demonstram que a `FLAG`, cuja sobreposição/ocultação por trás do `cover` **já havia sido corrigida anteriormente**, voltou a ficar parcialmente ocultada.

Isso é uma regressão inequívoca.

Restaurar a correção anterior e garantir que a `FLAG` permaneça integralmente visível e posicionada conforme o comportamento já estabelecido, **sem resolver o problema mediante deslocamentos arbitrários que criem novas inconsistências em outros modos, resoluções ou elementos**.

## 3. `evidencia11.png` — modo de `cover` horizontalmente infinito foi descaracterizado

`evidencia11.png` demonstra outra regressão grave no modo em que o `cover` deve, **especificamente**, produzir a aparência horizontalmente infinita, ocupando de lado a lado da janela.

NUNCA foi solicitado:

- adicionar `blur`, fundo desfocado ou efeito análogo atrás da imagem;
- reduzir a imagem para fazê-la caber integralmente na largura;
- alterar o algoritmo original de enquadramento;
- transformar o comportamento em `fit width`;
- reestruturar esse modo visual.

O comportamento original **já estava aderente**.

O que havia sido solicitado era exclusivamente:

1. **garantir novamente os limites mínimo e máximo de altura**, que haviam se perdido;
2. **manter o centro da imagem coincidindo com o centro da janela**;
3. adicionar, como feature adicional e sem substituir o comportamento existente, o modo de infinito horizontal composto por:
   - imagem central;
   - pattern/imagem lateral `left`;
   - pattern/imagem lateral `right`.

A implementação atual deturpou a finalidade desse `cover`.

A imagem usada nesse modo possui **largura propositalmente extrema**, justamente para que o viewport possa **recortá-la horizontalmente conforme a largura disponível**, mantendo sua altura e o centro corretamente posicionados.

Portanto, o comportamento correto NÃO é diminuir a altura para que toda a largura da imagem caiba na janela.

É exatamente o contrário: a imagem DEVE manter a altura determinada pelas regras desse modo e o excedente horizontal DEVE poder ser naturalmente `cropado` pela janela, preservando o centro da imagem alinhado ao centro do viewport.

Forçar `fit width` elimina justamente a razão de existir desse tipo de imagem.

Além disso, essa implementação torna conceitualmente sem sentido a feature posteriormente solicitada de infinito composto por **3 imagens** — central + `left` + `right`. Se qualquer imagem simplesmente fosse reduzida para caber integralmente na largura, não haveria razão funcional para a existência dessa nova modalidade.

Portanto:

- remover qualquer `blur`/background artificial introduzido sem solicitação;
- restaurar o comportamento original de enquadramento;
- garantir mínimo/máximo de altura;
- manter centralização da imagem em relação à janela;
- permitir `crop` horizontal natural;
- preservar separadamente a variante de infinito baseada em **3 imagens**.

NÃO fundir esses comportamentos. NÃO substituir um pelo outro.

## 4. `evidencia12.png` — `cover` de largura integral não pode ultrapassar a área visível inicial

`evidencia12.png` demonstra outra regressão.

Neste modo específico, o `cover` realmente DEVE ocupar **de lado a lado da janela**, e sua altura pode variar em função da largura disponível.

Entretanto, atualmente, em janelas suficientemente largas, sua altura cresce a ponto de o `cover` ultrapassar a **área visível inicial da página (`scroll = 0`)**, sendo cortado pelo próprio viewport.

Isso é uma regressão **GRAVE**.

Neste modo:

- a imagem DEVE continuar ocupando horizontalmente toda a largura da janela;
- porém o `cover` **NUNCA pode ultrapassar verticalmente a área efetivamente visível no primeiro viewport**;
- esse cálculo DEVE considerar **cabeçalho e demais elementos já presentes acima/ao redor do `cover`**, e não simplesmente `100vh` de forma ingênua.

Quando a proporção/largura da janela fizer com que o `cover` necessário para manter o modo de largura total ultrapasse esse limite vertical, **não comprima arbitrariamente a imagem nem permita overflow vertical**.

Nesse ponto exato, o comportamento DEVE alternar para o modo equivalente ao que está sendo corrigido em `evidencia10.png`: o modo limitado à **zona do artigo**, preservando suas regras próprias.

Em outras palavras:

- enquanto o modo de largura integral couber corretamente no viewport inicial, mantê-lo;
- quando deixar de caber, alternar para o modo correspondente de `cover` restrito à zona do artigo;
- NÃO produzir `cover` parcialmente invisível;
- NÃO reduzir arbitrariamente sua altura para encaixar;
- NÃO alterar a posição de scroll do usuário.

## 5. Performance e estabilidade visual

Essa adaptação dinâmica DEVE ser feita com custo mínimo e **sem impacto significativo no PageSpeed, responsividade ou fluidez perceptível**.

As verificações/recalculos DEVEM ser implementados de maneira criteriosa:

- evitar cálculos/reflows desnecessários em alta frequência;
- preferir processamento após estabilização/conclusão dos eventos relevantes, quando tecnicamente apropriado;
- evitar ciclos contínuos de leitura/escrita de layout;
- NÃO bloquear a interface;
- NÃO manipular arbitrariamente o `scroll`;
- NÃO provocar deslocamentos intermitentes;
- NÃO gerar efeito perceptível de “ida e volta” entre modos;
- NÃO permitir que resize/recalculo produza `jank`, flicker ou reposicionamentos irritantes ao usuário.

Esses comportamentos **já existiam em algum grau e funcionavam antes das regressões**. Portanto, primeiro investigue e restaure/reaproveite o mecanismo preexistente antes de inventar outro.

## Regra de execução

Estas regressões surgiram justamente porque correções pontuais foram tratadas como autorização para reestruturar comportamentos que NÃO estavam em discussão.

**NÃO faça isso novamente.**

A implementação DEVE:

- obedecer integralmente ao RCF, `AGENTS.md`/normas equivalentes vigentes e contratos existentes;
- preservar todos os modos de `cover`;
- preservar todas as features existentes;
- restaurar comportamentos anteriormente corretos;
- limitar cada alteração estritamente ao necessário;
- NÃO generalizar requisito específico;
- NÃO transformar comportamento local em regra global;
- NÃO introduzir efeitos visuais não solicitados;
- NÃO substituir `crop` por `fit`, ou vice-versa, sem que o modo específico assim determine;
- NÃO eliminar, fundir ou descaracterizar modalidades de `cover`;
- NÃO aceitar regressão direta, indireta, encadeada ou “necessária” por conveniência de implementação.

Se houver qualquer conflito real que implique perda de feature, alteração de contrato ou regressão inevitável, **PARE e consulte explicitamente o desenvolvedor**. NÃO tome essa decisão unilateralmente.

## Validação obrigatória

Antes de considerar a correção concluída, validar individualmente os cenários de:

- `evidencia7b.png`;
- `evidencia9.png`;
- `evidencia10.png`;
- `evidencia11.png`;
- `evidencia12.png`;

e confirmar, no mínimo:

- `cover` restrito corretamente à zona do artigo;
- mínimo/máximo de altura preservados;
- modo horizontalmente infinito preservado;
- centralização correta da imagem;
- `crop` horizontal funcionando conforme finalidade original;
- ausência de `blur`/background não solicitado;
- variante de infinito com imagem central + `left` + `right` preservada;
- `FLAG` integralmente visível;
- largura integral apenas quando verticalmente compatível com o viewport inicial;
- fallback correto para o modo da zona do artigo quando necessário;
- estabilidade em resize;
- ausência de manipulação indevida de scroll;
- ausência de flicker/jank;
- ausência de regressões em outros tipos de `cover`, posts, páginas, responsividade ou impressão.

**Não marque a tarefa como concluída apenas porque as evidências específicas parecem visualmente melhores. A conclusão exige restaurar os contratos funcionais que foram quebrados e demonstrar que nenhuma nova regressão foi criada no processo.**
