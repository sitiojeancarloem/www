# Overlay editorial reutilizável para série de bate-papos sobre livro

## Parâmetros — definir somente aqui

Toda informação variável DEVE ser definida exclusivamente neste cabeçalho e, no restante do prompt, apenas referenciada. NÃO crie novos parâmetros salvo necessidade material imprevisível; informações inequivocamente deriváveis destes NÃO justificam nova variável.

- **LIVRO:** `[título/nome exato da obra]` — obrigatório.
- **DETALHES_LIVRO:** `[edição, capa, cor, acabamento, lombo, tipografia e/ou características relevantes]` — opcional; ausência = inferir somente de referência confiável.
- **CONTEXTO_ESPIRITUAL:** `[SIM/NÃO]` — opcional; ausência = `SIM`.
- **USAR_SIMBOLO_IASD:** `[SIM/NÃO]` — opcional; ausência = `SIM`.

O título exibido DEVE ser exatamente `LIVRO`.

---

## Objetivo

Gere **exclusivamente o overlay**, em **PNG com canal Alpha/transparência real**, destinado à sobreposição posterior sobre imagens temáticas distintas.

Crie **duas variantes em alta definição, coerentes como a mesma identidade visual**:

1. **horizontal:** proporção `40:21`, com no mínimo **1200×630 px**;
2. **quadrada:** proporção **4:5**, destinada a **cover de Instagram**, com no mínimo **1440×1800 px**.

O overlay identifica uma série de **bate-papos sobre `LIVRO`**. A **imagem/ilustração temática** e o **título do tópico específico de cada episódio** serão adicionados posteriormente e DEVEM constituir o maior destaque da composição final.

Hierarquia obrigatória:

1. título/tópico específico do episódio;
2. imagem/ilustração temática do episódio;
3. representação de `LIVRO`, como contexto macro e identidade recorrente;
4. título `LIVRO` e expressão **“Bate-papo”** como identificação complementar.

O overlay DEVE possuir presença editorial clara e relevante, sem competir com o assunto do dia.

---

## Fidelidade do livro

A representação de `LIVRO` DEVE ser fiel à obra/edição pretendida.

Precedência de referência:

1. imagem anexa do livro, quando existente e suficiente;
2. `DETALHES_LIVRO`, para complementar ou delimitar a referência;
3. pesquisa de imagens **oficiais, autênticas ou confiáveis**, exclusivamente para suprir informações ausentes ou insuficientes.

Quando existentes, preservar corretamente:

- capa;
- lombo/borda lateral;
- proporções;
- acabamento/materialidade;
- tipografia;
- elementos gráficos/editoriais característicos.

`LIVRO` DEVE aparecer:

- exatamente grafado;
- perfeitamente legível;
- sem letras omitidas, trocadas, deformadas ou inventadas;
- igualmente correto no **lombo/lateral**, quando ali constar.

NÃO invente características da edição sem evidência suficiente.

---

## Símbolo oficial da IASD

Somente se `USAR_SIMBOLO_IASD = SIM`:

- PODE ser utilizado o **símbolo oficial verdadeiro da Igreja Adventista do Sétimo Dia**;
- usar exclusivamente sua versão **gráfica/símbolo, sem nome, letras ou assinatura tipográfica institucional**;
- DEVE ser integrado **ao próprio livro**, na **capa e/ou lombo/borda lateral**, conforme coerência visual com a edição representada;
- NÃO DEVE funcionar como logotipo independente, assinatura institucional ou branding externo do overlay;
- NÃO DEVE existir segunda aplicação solta do símbolo;
- desenho, proporção e orientação oficiais DEVEM ser preservados, sem reinvenção ou descaracterização.

Se `USAR_SIMBOLO_IASD != SIM`, NÃO o utilize.

---

## Conteúdo fixo

O overlay DEVE conter, de forma complementar e sem redundância:

- representação de `LIVRO`;
- título `LIVRO`;
- expressão **“Bate-papo”**, admitindo iconização discreta e pertinente.

Esses elementos constituem a identidade fixa da série; **NÃO** o assunto principal do episódio.

---

## Robustez sobre qualquer fundo

O overlay DEVE manter alta legibilidade e consistência quando sobreposto a fundos:

- claros ou escuros;
- simples ou detalhados;
- fotográficos ou ilustrados;
- monocromáticos ou multicoloridos;
- de baixo ou alto contraste.

PODEM ser usados, com moderação:

- sombra;
- halo/glow;
- degradê;
- contraste localizado;
- transição de opacidade;
- elementos flat/infográficos;
- recurso equivalente.

Esses recursos DEVEM proteger a legibilidade e integrar o overlay ao fundo sem criar massas opacas excessivas nem reduzir desnecessariamente a área reservada ao episódio.

---

## Ocupação e transparência

O **conteúdo útil real** — livro, título, “Bate-papo” e demais informações fixas — DEVE terminar, no máximo, em aproximadamente **40% do eixo de ocupação do overlay**:

- **largura**, quando a composição for lateral/horizontal;
- **altura**, quando a variante 4:5 adotar composição vertical.

O overlay NÃO DEVE bloquear densamente mais de **50% desse mesmo eixo**.

Efeitos exclusivamente transitórios — fade, degradê, sombra, brilho ou equivalentes — PODEM ultrapassar 40%, desde que:

- NÃO contenham informação principal;
- ao atingir 50% do eixo, possuam **alpha/opacidade ≤ 50%**;
- depois disso, caminhem progressivamente para maior transparência;
- NÃO prejudiquem a futura ilustração ou o título do episódio.

Regra:

- **0–40%:** conteúdo editorial útil permitido;
- **40–50%:** somente integração/transição visual;
- **≥50%:** apenas transição com alpha ≤ 50%, reduzindo progressivamente.

A transparência DEVE ser **real**. É PROIBIDO simulá-la com branco, preto, quadriculado ou qualquer preenchimento.

---

## Variante horizontal — `40:21`

DEVE:

- possuir no mínimo **1200×630 px**;
- preferencialmente concentrar o overlay em um único lado;
- manter o núcleo informacional nos primeiros ~40% da largura;
- reservar a maior área nobre para:
  - imagem/ilustração temática;
  - título do episódio;
  - eventual informação complementar futura.

A transição visual PODE ultrapassar 40% somente conforme a regra global de ocupação/transparência.

---

## Variante 4:5 — Instagram

DEVE preservar a mesma identidade visual, porém ser **recomposta especificamente para 4:5**, e NÃO apenas redimensionada/comprimida e ter no mínimo 1440x1800px.

A composição PODE:

- permanecer lateral/horizontal; ou
- ser reorganizada verticalmente,

conforme a solução que melhor preserve:

- protagonismo do tópico futuro;
- ampla área para título e ilustração;
- leitura mobile;
- equilíbrio e legibilidade do livro;
- coerência com a versão horizontal;
- baixa interferência visual do overlay.

Se permanecer horizontal, aplique os limites de 40/50% à **largura**.  
Se adotar orientação vertical, aplique-os proporcionalmente à **altura**.

Em qualquer caso, prevalece o princípio: **identidade concentrada; conteúdo futuro dominante**.

---

## Direção estética

Ambas as variantes DEVEM ser:

- profissionais;
- editoriais;
- premium;
- elegantes;
- contemporâneas;
- visualmente ricas sem poluição;
- consistentes entre si;
- reutilizáveis sobre temas variados.

### Contexto espiritual

Se `CONTEXTO_ESPIRITUAL = SIM`, a linguagem visual DEVE sugerir, com sobriedade:

- inspiração;
- espiritualidade reverente;
- fé;
- revelação;
- profecia;
- contemplação;
- solenidade.

DEVE evitar associações visuais com:

- espiritualismo;
- espiritismo;
- ocultismo;
- esoterismo;
- misticismo genérico;
- sincretismo;
- fantasia espiritual ambígua.

Se `CONTEXTO_ESPIRITUAL = NÃO`, NÃO force essa camada semântica.

---

## Restrições

É PROIBIDO:

- transformar o overlay em thumbnail completa;
- ocupar excessivamente a área destinada ao episódio;
- competir com título/ilustração futuros;
- colocar conteúdo útil além do limite de 40%;
- usar grandes massas opacas;
- criar faixa/moldura rígida sem integração visual;
- repetir elementos sem função;
- usar ornamentos genéricos excessivos;
- comprometer legibilidade sobre fundos variados;
- inventar características do livro sem referência;
- usar o símbolo da IASD fora das condições definidas.

---

## Resultado

Entregue **somente as duas variantes do overlay**:

- **40:21**;
- **4:5 para Instagram**.

Ambas DEVEM estabelecer `LIVRO` como **contexto macro recorrente**, preservando ampla área visual dominante para a **imagem e o título do tópico específico de cada episódio**, que serão adicionados posteriormente.
