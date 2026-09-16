# Fonte complementar da FT-066 — colinearidade lateral e inicialização do blur

- Origem: anexo textual do prompt humano.
- Recebido em: `2026-09-16`.
- Anexo textual SHA-256: `425ED3B284A10BF9C01FF750A1D1EB8CBE7686D680B2D19A7A66FA4258B7BE43`.
- Evidências vinculadas: `../evidencias/evidencia21.png` (`BA1EEC03075F094405FDF2947776EF80EE92D3F3C9F7D278EA415E7CBAECAA93`) e `../evidencias/evidencia22.png` (`6F33F5F89CD9CE6AB82F8F521CA0438DD214776F33EE40FA76A9CF832FA93F48`).
- FTs: FT-065, FT-066 e FT-067.
- RCFs: RCF-JCEM-CARREGAMENTO-PROGRESSIVO-001 e RCF-JCEM-COMPONENTES-COMPARTILHADOS-001.
- Estado de incorporação: capturada integralmente; diagnóstico, correção e validação em andamento.
- Preservação explícita: os valores atuais reais de `.jcem-post-header__deck` e `.jcem-post-header__bottombar`, introduzidos manualmente pelo desenvolvedor, são o baseline visual desta rodada.

---

# Corrigir alinhamento lateral do COVER e inicialização do `backdrop-filter`

As evidências:

```text
evidencia21.png
evidencia22.png
```

demonstram dois problemas distintos no COVER atual. `evidencia22.png` contém marcação vermelha destacando o desalinhamento.

Antes de editar, inspecione **DOM, CSS, geometria calculada, containers, stacking contexts, ordem de pintura e renderização real**. Corrija a causa estrutural, preservando tudo o que já está correto.

## 1. Colinearidade lateral obrigatória

Nos modos em que o COVER **NÃO é de largura total** — isto é, modos diferentes de `infinite`, `fullWindow`, `fullWidth` ou equivalentes — sua extremidade lateral DEVE ficar **rigorosamente colinear com a borda da zona útil do artigo**.

As evidências mostram que essa regra, já prevista, não está sendo cumprida.

### Requisitos

- Identifique a **zona canônica do artigo** e faça o COVER compartilhar exatamente a mesma referência geométrica.
- Inspecione especialmente:
  - `width` / `max-width`;
  - margens/paddings;
  - grid/flex;
  - `calc()`;
  - transforms;
  - wrappers/containers;
  - breakpoints;
  - offsets herdados.
- A borda útil do COVER e a borda útil do artigo DEVEM coincidir nos modos não full-width.
- Preserve integralmente os modos que intencionalmente ocupam toda a largura.
- A correção DEVE permanecer válida em:
  - desktop;
  - mobile;
  - resize contínuo;
  - mudança de orientação;
  - diferentes aspect ratios;
  - diferentes DPRs.

É PROIBIDO:

- hardcodar offsets para as screenshots;
- corrigir uma borda criando erro na oposta;
- alterar a largura canônica do artigo para acomodar o COVER;
- regredir `infinite`, `fullWindow`, `fullWidth` ou equivalentes.

## 2. Preservar ajustes manuais do desenvolvedor

O desenvolvedor ajustou manualmente:

```css
.jcem-post-header__deck
.jcem-post-header__bottombar
```

Esses valores DEVEM ser tratados como **baseline visual atual** e NÃO PODEM regredir.

Os ajustes alteraram:

- opacidade/intensidade do fumê;
- intensidade do blur;
- aparência final do vidro.

Antes de tocar nessas regras:

1. leia os valores atuais reais;
2. preserve o resultado visual;
3. replique/normalize apenas onde necessário por responsividade, viewport ou regras duplicadas.

NÃO reintroduza valores antigos nem sobrescreva os ajustes manuais por conveniência.

## 3. Corrigir falha de inicialização do `backdrop-filter`

`evidencia22.png` demonstra ainda um problema de renderização:

- a página carrega;
- `backdrop-filter` está presente no CSS;
- o blur visual NÃO aparece;
- ao desabilitar e reabilitar a mesma propriedade no DevTools, sem alterar valor, o blur passa a funcionar.

O comportamento foi reproduzido em:

- Chrome;
- Brave.

Portanto, trate isso como provável problema de **composição, repaint/invalidation, stacking ou ordem de inicialização**, NÃO como simples ausência da propriedade.

## 4. Diagnóstico técnico obrigatório

Investigue a causa real antes de aplicar workaround.

Verifique especialmente:

- stacking contexts;
- `z-index`;
- `transform`;
- `filter`;
- `opacity`;
- `contain`;
- `isolation`;
- `overflow`;
- `will-change`;
- pseudo-elementos;
- ancestralidade;
- ordem de pintura;
- CSS assíncrono/tardio;
- classes inseridas depois do primeiro paint;
- mudanças de `background`/alpha após render inicial;
- elemento inicialmente sem dimensão/posição final;
- lazy-loading da imagem do COVER;
- hidratação/JS alterando layout;
- compositor/GPU;
- ausência de repaint após carregamento;
- `backdrop-filter` vs. `-webkit-backdrop-filter`;
- race condition entre imagem, layout e ativação do vidro.

O fato de o toggle manual ativar o efeito é evidência relevante de que o navegador pode não estar recompondo/invalidadando corretamente o estado inicial.

## 5. Correção preferida

Priorize solução **estrutural em CSS/layout** que faça o blur funcionar já na primeira renderização correta.

A solução DEVE:

- exibir o blur automaticamente no carregamento normal;
- funcionar em Chrome e Brave;
- preservar os valores atuais de fumê/blur;
- continuar dinâmica em resize/orientação;
- não depender de DevTools;
- não depender de interação do usuário.

## 6. Workaround apenas se tecnicamente necessário

Se o diagnóstico demonstrar limitação/inconsistência real do Chromium sem correção estrutural suficiente, use o workaround **mínimo, determinístico e local** necessário para forçar repaint/recomposition.

Exemplos admissíveis, apenas quando justificados:

- toggle controlado de classe;
- alteração transitória inócua de propriedade;
- `requestAnimationFrame` após layout estável;
- mecanismo equivalente de invalidação/repaint.

É PROIBIDO:

- polling/loop contínuo;
- timeout arbitrário grande;
- flicker perceptível;
- alteração do estado visual final;
- trabalho permanente desnecessário na main thread;
- workaround global para problema local.

Se JS for inevitável, documente sucintamente **qual bug ele contorna e por que existe**, evitando remoção futura equivocada.

## 7. Ordem de composição

Se pertinente ao diagnóstico, garanta que o vidro seja estabilizado na ordem correta:

```text
imagem do COVER disponível
→ dimensões/layout finais
→ barra posicionada
→ fundo/alpha aplicados
→ backdrop-filter ativo
→ repaint/composição efetiva
```

Evite que o `backdrop-filter` seja calculado antes de existir backdrop útil e permaneça sem invalidação posterior.

## 8. Validação obrigatória

Reproduza os cenários das evidências e valide:

### Geometria
- COVER colinear com a zona útil do artigo nos modos não full-width;
- ausência do erro marcado em `evidencia22.png`;
- comportamento correto em resize/orientação.

### Vidro
- blur visível imediatamente após carregamento normal;
- nenhuma necessidade de DevTools/toggle manual;
- fumê/opacidade preservados;
- intensidade do blur preservada;
- `.jcem-post-header__deck` e `.jcem-post-header__bottombar` sem regressão.

### Compatibilidade
Testar pelo menos:

- Chrome;
- Brave;
- desktop;
- mobile, quando aplicável;
- reload normal;
- reload sem cache;
- navegação direta;
- resize;
- mudança de orientação.

## Critério absoluto de aceite

Somente conclua quando:

1. nos modos não `infinite`/não `fullWindow`/não `fullWidth`, o COVER estiver colinear com a zona útil do artigo;
2. os modos full-width permanecerem intactos;
3. os ajustes manuais atuais de `.jcem-post-header__deck` e `.jcem-post-header__bottombar` forem preservados;
4. o blur aparecer automaticamente no carregamento normal;
5. Chrome e Brave não exigirem toggle manual de `backdrop-filter`;
6. qualquer workaround de repaint, se necessário, for mínimo, local, determinístico e tecnicamente justificado;
7. responsividade, viewport, modos de COVER e materialidade do vidro não regredirem.
