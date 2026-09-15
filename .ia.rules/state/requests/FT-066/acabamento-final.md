# Fonte complementar da FT-066 — acabamento final da barra do COVER

- Origem: anexo textual do prompt humano.
- Recebido em: `2026-09-15T00:55:36.0204346-03:00`.
- Evidências vinculadas: `../evidencias/evidencia19.png` (estado rejeitado) e `../evidencias/como-deveria-ser.png` (alvo visual).
- FTs: FT-065, FT-066 e FT-067.
- RCFs: RCF-JCEM-CARREGAMENTO-PROGRESSIVO-001 e RCF-JCEM-COMPONENTES-COMPARTILHADOS-001.
- Estado de incorporação: capturada integralmente; aguardando correção e validação.

---

# Corrigir acabamento final da barra de título do COVER — `evidencia19.png` × `como-deveria-ser.png`

Continue a correção do COVER de forma **cirúrgica**, preservando tudo o que já está correto. Na pasta de evidências:

```text
evidencia19.png       → estado atual
como-deveria-ser.png  → alvo visual
```

Compare ambas e inspecione **DOM, CSS, geometria calculada, stacking contexts e renderização real** antes de editar.

## Estado a preservar

A solução atual está quase correta:

- a **flag** está aproximadamente 98% correta em posição/ancoragem;
- a barra finalmente se comporta como **uma única barra coesa**;
- responsividade, modos de COVER e correções anteriores NÃO DEVEM regredir.

Ajuste apenas o necessário.

## Correções obrigatórias

### 1. Posição

A barra inteira está **ligeiramente baixa**. Ela DEVE subir um pouco, entrando mais no COVER, como em `como-deveria-ser.png`, sem:

- desancorar a flag;
- recriar duas barras;
- introduzir gaps ou sobreposições incoerentes;
- usar offsets arbitrários específicos da screenshot.

Determine a **relação geométrica estrutural** entre COVER, barra e flag e preserve-a responsivamente em resize, orientação, diferentes viewports/aspect ratios e DPRs.

### 2. Vidro/fumê real

A barra atual possui degradê, mas **não aparenta vidro**. O alvo exige simultaneamente:

```text
alpha/transparência real
+ degradê fumê
+ backdrop real visível
+ blur dinâmico do conteúdo atrás
+ sombra externa
```

O degradê existente DEVE ser preservado/aprimorado, migrando de região mais translúcida para visualmente mais sólida **sem perder alpha**, mantendo uma única superfície contínua.

É PROIBIDO substituir isso por cor opaca, screenshot, fundo duplicado/fixo ou falsa simulação de blur.

### 3. Backdrop blur dinâmico

A região do COVER fisicamente atrás da barra DEVE permanecer visível, porém desfocada, como em `como-deveria-ser.png`.

O efeito DEVE acompanhar automaticamente:

- resize;
- mudança de orientação;
- reposicionamento/redimensionamento do COVER;
- mudança da região do COVER coberta pela barra.

Priorize solução CSS nativa, preferencialmente `backdrop-filter: blur(...)` ou equivalente, com compatibilidade/fallback pertinente.

Princípio obrigatório:

```text
barra desfoca o backdrop real
≠
barra contém cópia desfocada do COVER
```

Somente use alternativa se houver impossibilidade técnica comprovada.

### 4. Sombra somente externa

`como-deveria-ser.png` apresenta sombra clara, porém sem contaminar o vidro.

A sombra DEVE:

- projetar-se para fora da barra;
- NÃO escurecer internamente o backdrop;
- NÃO alterar o blur;
- NÃO formar camada escura entre vidro e COVER.

Se necessário, separe sombra/material por camada ou pseudo-elemento, sem complexidade desnecessária.

### 5. Foreground nítido e stacking correto

Inspecione `z-index`, stacking contexts, pseudo-elementos, `overflow`, `filter`, `backdrop-filter`, `transform` e ancestralidade.

O resultado DEVE garantir:

```text
flag correta
+ barra sobre o COVER
+ backdrop disponível ao blur
+ texto/ícones nítidos
+ sombra externa
```

O blur DEVE afetar somente o conteúdo atrás da barra, **nunca título, texto, ícones ou flag**.

## Fidelidade e proibições

`como-deveria-ser.png` é referência de **posição relativa, transparência, blur, degradê, sombra e materialidade**, NÃO autorização para pixel-hardcoding.

É PROIBIDO:

- regredir a flag;
- recriar duas barras;
- hardcodar para uma única viewport/artigo;
- rasterizar ou duplicar o COVER para fabricar blur;
- usar fundo opaco para ocultar o problema;
- aplicar blur ao foreground;
- criar sombra interna contaminando o vidro;
- alterar aspectos visuais não solicitados;
- degradar responsividade ou qualquer modo existente de COVER.

## Validação

Reproduza estado equivalente a `evidencia19.png` após a correção e compare com `como-deveria-ser.png`.

Valide:

- barra um pouco mais alta e integrada ao COVER;
- flag preservada;
- barra única/coesa;
- transparência alpha real;
- degradê progressivo;
- backdrop real visível e dinamicamente desfocado;
- efeito inequívoco de vidro/fumê;
- sombra exclusivamente externa;
- foreground nítido;
- ausência de gaps/artefatos;
- resize/orientação/DPRs;
- claro/escuro quando aplicável;
- demais modos que compartilhem o componente.

Durante resize/orientação, confirme que **o conteúdo desfocado muda conforme muda a região real do COVER atrás da barra**.

## Critério absoluto de aceite

Somente conclua quando:

1. a posição da barra corresponder ao alvo sem prejudicar a flag;
2. permanecer uma única barra coesa;
3. degradê + alpha + backdrop blur produzirem materialidade real de vidro/fumê;
4. a sombra existir apenas externamente;
5. foreground permanecer nítido;
6. o blur for dinâmico e baseado no backdrop real;
7. nenhuma solução depender de screenshot, viewport ou artigo específico;
8. nenhuma feature, responsividade, modo de COVER ou correção anterior regredir.

**A mera presença de `backdrop-filter` NÃO comprova conclusão; o aceite depende da renderização final equivaler material e geometricamente a `como-deveria-ser.png`.**
