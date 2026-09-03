---
origem: prompt humano anexado
capturado_em: 2026-09-03T20:08:22.3269933-03:00
sha256: E2F8281827A814BB75856352B82B5E3C2AFA88EDB10D3B6A463A6DDCAED96F83
duplicata_confirmada: C:/Users/admin/.codex/attachments/6d96ff79-226f-40ae-b8c0-db451c5a2ceb/pasted-text.txt
fts: [FT-058, FT-059, FT-060]
rcfs: [RCF-JCEM-CARREGAMENTO-PROGRESSIVO-001, RCF-JCEM-COMPONENTES-COMPARTILHADOS-001]
estado_incorporacao: capturada
---

# Corrigir não conformidades estruturais do COVER conforme `projeto-cover.pdf` e evidências 13–16

Continue o trabalho em andamento, mas trate esta tarefa como **correção obrigatória de implementação de FTs/TO-DOs anteriores**: o COVER atualmente renderizado NÃO cumpre, à risca, requisitos já especificados no `projeto-cover.pdf` disponível em:

```text
D:\trampo\jeancarloem.com.blog\.ia.rules\state\requests\evidencias\projeto-cover.pdf
```

Antes de editar, leia integralmente o PDF, as normas/FTs/TO-DOs correlatas e inspecione `evidencia13.png`, `evidencia14.png`, `evidencia15.png` e `evidencia16.png`, confrontando DOM, CSS, layout calculado e renderização real. Corrija **causas estruturais**, não pixels específicos das capturas.

## Fonte de verdade e proibições

- Os **textos, medidas, zonas, setas e itens explicitamente anotados no PDF** são requisitos/evidências; as screenshots usadas no próprio PDF NÃO são modelo visual integral, pois o documento declara que contêm defeitos.
- O item `[9]` e a página final advertem especificamente que exemplos exibem erros nas barras/flag; portanto, NÃO reproduza esses defeitos por estarem visíveis nas capturas.
- `evidencia13–16` são **provas do estado defeituoso atual**, não referência do resultado desejado.
- É TERMINANTEMENTE PROIBIDO eliminar/reduzir feature, compatibilidade, modo de COVER ou força/explicitude normativa para fazer a implementação “caber” no estado atual.
- Se houver aparente contradição normativa real, NÃO escolha silenciosamente uma regra nem descarte implementação: preserve-a/desacople-a com rastreabilidade para reacoplamento e solicite decisão quando necessário.
- NÃO introduza alterações visuais não solicitadas.

## 1. Restabelecer a geometria fundamental `[1] + [2] + [3]`

As evidências 13–15 mostram que o COVER comum está reduzido a uma região central estreita e sua geometria não coincide com a estrutura normativa do artigo. Isso não é apenas problema de `height`: o item `[2]` exige que, no COVER comum, suas extremidades laterais sejam **colineares às bordas da zona horizontal do artigo**; `[3]` distingue expressamente essa zona da largura total da janela.

Corrija como uma única invariável geométrica:

```text
cover comum:
  left   == article-zone.left
  right  == article-zone.right
  top    == header.bottom
  bottom == title-bars.top
  área útil preserva 1,91:1
```

Consequentemente:

- `[1]`: o COVER DEVE ocupar integralmente a altura normativa entre a borda `bottom` do cabeçalho e a borda `top` do conjunto de barras de título; NÃO pode terminar antes, deixar vazio intermediário nem invadir as barras.
- `[2]`: no modo comum `1,91:1`, largura e extremidades externas do COVER DEVEM coincidir com a zona horizontal do artigo, de borda a borda.
- `[3]`: NÃO confunda `article-zone` com `window-zone`; somente modos explicitamente full/infinite utilizam a largura da janela.
- A proporção `1,91:1` e os limites acima DEVEM ser resolvidos conjuntamente pelo layout; NÃO fixe independentemente cover e barras e depois compense com offsets.
- Se a dimensão normativa implicar reposicionamento vertical das barras, **as barras DEVEM fluir/ancorar após o COVER**, em vez de o COVER ser encolhido para preservar uma posição incorreta delas.
- NÃO use `margin`, `transform`, `top`, `translate`, `z-index` ou pixels específicos como remendo de uma geometria estrutural errada.

As evidências 13–15, nas quais a imagem comum fica muito mais estreita que a zona do artigo e existe grande faixa lateral vazia, DEVEM ser usadas como teste negativo explícito dessa violação.

## 2. COVER e conjunto `flag + barras`: nenhuma sobreposição

`evidencia13.png`, `evidencia14.png`, `evidencia15.png` e `evidencia16.png` demonstram interferência/sobreposição entre COVER e o conjunto formado pela **flag/bandeira de data + barra superior + barra inferior**. Isto reproduz precisamente a classe de defeito advertida em `[9]` e na página final do PDF.

A implementação correta DEVE garantir:

```text
header
↓
COVER
↓  fronteira geométrica única
flag + barras de título
↓
conteúdo/meta subsequente
```

- A borda inferior do COVER e a borda superior normativa do conjunto de barras DEVEM coincidir sem gap nem interpenetração.
- O COVER NÃO PODE ocultar, clipar, cobrir ou passar visualmente à frente/atrás da flag ou das barras de modo a esconder parte delas.
- A flag NÃO PODE ficar parcialmente absorvida pelo COVER, como ocorre de forma particularmente evidente em `evidencia16.png`.
- Corrija fluxo, containing block, stacking context, clipping/overflow e posicionamento conforme a causa real.
- `z-index` isolado NÃO é correção suficiente quando a geometria continua sobreposta.
- A solução DEVE valer para todos os breakpoints, resize/orientation e modos COVER; NÃO apenas para as quatro resoluções das evidências.

## 3. Reverter alteração não solicitada: título na barra correta

As evidências, especialmente `evidencia13.png`, mostram uma regressão introduzida pela implementação: o texto do título foi migrado para a **barra superior**, embora tal alteração NUNCA tenha sido solicitada.

Corrija obrigatoriamente:

- restaure o título à **barra inferior**, conforme o contrato/estado normativo anterior;
- a barra superior NÃO DEVE receber o título para contornar problemas de espaço ou sobreposição;
- preserve conteúdo, link, ícone, tipografia e funcionalidades existentes que continuem normativamente válidos;
- não use a posição eventualmente visível em screenshots defeituosas do PDF como autorização para essa migração;
- adicione teste estrutural que impeça nova inversão entre as barras.

## 4. Implementar `[8A]` literalmente: duas barras, uma estrutura visual

A implementação atual exibida nas evidências não realiza adequadamente o efeito solicitado em `[8A]`.

O conjunto DEVE possuir duas regiões distintas, porém aparentar **uma única estrutura contínua**:

### Barra superior
- fundo RGBA em **degradê vertical**;
- no topo: aparência sutil de vidro/translucidez;
- em direção à base: opacidade progressivamente maior;
- na extremidade inferior: DEVE atingir visualmente a mesma solidez/cor de encontro da barra inferior;
- a junção entre ambas NÃO pode apresentar emenda, salto de cor ou faixa artificial;
- a extremidade superior ainda DEVE permanecer minimamente perceptível, transmitindo visualmente que essa estrutura sustenta a flag.

### Barra inferior
- DEVE ser sólida;
- recebe o título conforme a regra anterior;
- DEVE continuar visualmente a barra superior, sem parecer componente desconectado.

A finalidade é **integração visual**, não efeito chamativo. Derive cores/opacidade do sistema de temas existente e valide claro/escuro; NÃO copie valores de pixels das screenshots.

## 5. Implementar `[8B]` geometricamente: flag de data × barra superior

Não confundir a flag de `[8B]` com o logotipo/ícone quadrado eventualmente presente no canto da imagem. `[8B]` refere-se à **bandeira/flag de data localizada junto às barras de título**, com extremidade triangular.

A relação obrigatória é:

```text
base/extremidade normativa do triângulo da flag
==
borda superior da barra superior
```

`evidencia15.png`, com marcações verdes, evidencia diretamente que essa colinearidade não foi satisfeita; `evidencia14.png` e `evidencia16.png` também permitem observar inconsistência/clip da relação flag–barra.

Requisitos:

- flag e barras DEVEM compartilhar referência geométrica estável;
- a colinearidade NÃO pode depender de offset calibrado para uma viewport;
- resize, mudança de orientação, tamanho do título e modo COVER NÃO podem romper essa relação;
- a flag NÃO pode ser clipada pelo COVER ou por `overflow`;
- preserve seu desenho/proporção e demais comportamentos vigentes, alterando apenas o necessário para cumprir o contrato.

## 6. Modos infinite: preservar `[5]`, `[6A–C]` e `[7]`

A correção do COVER comum NÃO PODE regressar os modos infinitos.

### Infinite em três partes
A expressão histórica “3 imagens” NÃO autoriza arbitrariedade: preserve o modelo já definido como:

```text
pattern-left | central 1,91:1 | pattern-right
```

- centro: área útil `1,91:1`, colinear à zona do artigo;
- `pattern-left`: termina exatamente na borda esquerda do centro e se estende à borda esquerda da `window-zone`;
- `pattern-right`: inicia exatamente na borda direita do centro e se estende à borda direita da `window-zone`;
- patterns PODEM ser os tipos já normatizados (imagem/cor/gradiente);
- composição completa ocupa a largura da janela sem scroll horizontal, gaps ou costuras indevidas.

### Infinite em imagem única extensa
Conforme `[7]`:

- zona infinita centralizada;
- overflow horizontal oculto;
- largura da imagem calculada a partir da altura necessária;
- região central útil mantém `1,91:1`;
- essa região central ocupa integralmente a altura normativa `[1]`;
- excedentes laterais permanecem ocultos e produzem continuidade horizontal.

`evidencia16.png` DEVE integrar a regressão visual desse modo, principalmente quanto à fronteira inferior e à preservação da flag/barras.

## 7. Não regredir os modos viewport do PDF

Revalide as correções contra todos os modos/aliases efetivamente existentes, inclusive as semânticas documentadas em `[10A–C]` e `[11A–C]`:

- `FullWindow`;
- `windowHeight`;
- `windowWidth`;
- `innerFullWindow`;
- `innerWindowHeight`;
- `innerWindowWidth`;
- aliases normatizados equivalentes.

Preserve:

- `FullWindow`: ajuste responsivo ocupando a janela, escolhendo uma dimensão de referência (`height-fit` XOR `width-fit`) e calculando proporcionalmente a outra; CSS-first;
- header do `FullWindow`: inicialmente RGBA translúcido, opacidade central configurável (PDF: 30% padrão), podendo haver override por página/post; no scroll, retorna ao comportamento normal sólido;
- `windowHeight`: força ajuste pela altura;
- `windowWidth`: força ajuste pela largura, sem permitir que a imagem ultrapasse a altura da janela;
- `inner*`: mesma semântica correspondente, porém o COVER NÃO fica atrás do cabeçalho; a área disponível exclui integralmente a altura dele e as configurações de opacidade do header pertinentes aos modos externos não se aplicam.

NÃO renomeie ou duplique modos para resolver divergência; reconcilie aliases com a implementação/RCF reais.

## 8. Diagnóstico técnico obrigatório antes da correção

Não aceite “parece certo” como validação. Inspecione no runtime, conforme aplicável:

- `getBoundingClientRect()`/geometria computada;
- box model;
- `aspect-ratio`;
- `width`/`height` efetivos;
- `object-fit`/`object-position`;
- Grid/Flex/normal flow;
- `position` e containing blocks;
- `z-index` e stacking contexts;
- `overflow`/clipping;
- transforms;
- pseudo-elementos;
- margins/paddings;
- breakpoints/media/container queries;
- altura computada do header;
- dimensões da `article-zone` e `window-zone`;
- composição e dimensões de ambas as barras e da flag.

Identifique **por que** as evidências atuais apresentam simultaneamente cover estreito, altura/fronteira incorreta e sobreposição. Se decorrerem de uma mesma decisão arquitetural, corrija-a uma única vez no nível apropriado.

## 9. Invariantes automatizadas

Onde tecnicamente viável, transforme as relações normativas em testes geométricos, evitando regressão futura. Para COVER comum:

```text
cover.left   == articleZone.left
cover.right  == articleZone.right
cover.top    == header.bottom
cover.bottom == titleBars.top
ratio(coverUsefulArea) == 1.91:1
```

Para o conjunto de título:

```text
cover ∩ titleBars == ∅
cover ∩ flag      == ∅
flagTriangleBase == upperBar.top
title.parent == lowerBar
```

Para `[8A]`, complemente testes estruturais por teste visual: continuidade de gradiente/solidez não é validável adequadamente apenas pelo DOM.

Use somente a tolerância mínima inerente ao subpixel/renderizador; É PROIBIDO ampliar tolerâncias para fazer teste defeituoso passar.

## 10. Regressão visual obrigatória

Reproduza e compare estados equivalentes a `evidencia13–16` após a correção. Valide também:

- desktop/mobile;
- claro/escuro;
- diferentes larguras, alturas e aspect ratios de viewport;
- DPR relevantes;
- resize contínuo;
- mudança de orientação;
- cover comum;
- infinite de uma imagem;
- infinite composto;
- modos `window*`;
- modos `inner*`;
- títulos curtos/longos;
- com/sem Hero quando suportado;
- flag/barras antes/depois de scroll nos modos de header aplicáveis.

O aceite visual exige simultaneamente:

- COVER comum de borda a borda da **zona do artigo**, não a região estreita observada nas evidências 13–15;
- altura `[1]` integral;
- `cover.top == header.bottom`;
- `cover.bottom == title-bars.top`;
- ausência de gap;
- ausência de sobreposição;
- flag integralmente visível;
- título na barra inferior;
- barra superior com efeito vitral → sólido;
- junção perfeita superior/inferior;
- topo da barra superior discretamente perceptível;
- triângulo da flag colinear ao topo da barra superior;
- nenhum scroll horizontal indevido;
- nenhuma regressão nos modos existentes.

## Critério absoluto de conclusão

NÃO considere esta FT/TO-DO corrigida apenas porque build/testes passam ou porque uma única página parece adequada.

A tarefa somente termina quando:

1. as causas estruturais das violações forem identificadas e corrigidas;
2. os itens `[1]`, `[2]`, `[3]`, `[5]`, `[6A–C]`, `[7]`, `[8A]`, `[8B]`, `[9]`, `[10A–C]` e `[11A–C]` pertinentes permanecerem coerentes;
3. `evidencia13–16` puderem ser reproduzidas sem as violações apontadas;
4. nenhuma correção tiver removido/degradado feature, modo, compatibilidade ou norma;
5. RCF/FT, implementação, testes e renderização real estiverem equalizados.

Se implementação e norma divergirem, **corrija a implementação**; NÃO enfraqueça a norma para legitimar o defeito.

