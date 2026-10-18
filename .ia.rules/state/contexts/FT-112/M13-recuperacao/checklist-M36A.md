# Checklist consolidado do cabeçalho original — FT-112

Estado: requisitos identificados; confronto editorial integral pendente. Artigo de referência SHA-256 009103297c963d1f1f9ab905e900891ce5d76c80975049794aee59885a5124f4.

Comprovado atualmente por M35: estrutura renderizada de notas e tabela, sem avisos do Kramdown. Isso não comprova literalidade, preservação autoral, cumprimento completo do cabeçalho ou revisão visual. As análises abaixo identificam requisitos, não aprovam o artigo. As correções das revisões vinculadas são parte obrigatória deste checklist.

## Segmento 1

RESULTADO  
Checklist dos critérios §§1–5 da evidência fornecida (M36A1 — análise da evidência, não implementação):

| ID | Critério | Verificável | Exceções / Observações |
|----|----------|-------------|------------------------|
| 1 | **Preservação da intensidade teológica**: não neutralizar efeito de divisão natural da VERDADE proclamada; não amenizar/suavizar. | Sim: diretiva explícita em §§1–2. | Autoriza dureza retórica paulina, desde que sem desrespeito gratuito. |
| 2 | **Tom e público**: carta dirigida a leitores; evitar tratamento coletivo excessivo; preferir neutro/pessoal; tom cordial e firme. | Sim: §2 define tom e estilo. | Primeira pessoa do singular é permitida pontualmente (ex.: estilo paulino). |
| 3 | **Estrutura e introdução**: introdução curta, natural, integrada, sem resumo prolixo; reestruturação autorizada; proibido remover fatos/conceitos; corrigir erros gramaticais. | Sim: §3 detalha requisitos mínimos. | Reestruturação completa é autorizada; não quebrar frases artificialmente; evitar parágrafos excessivamente longos. |
| 4 | **Acessibilidade**: redação direta, clara, objetiva, linguagem simples (nível 4ª série); conteúdo não se simplifica. | Sim: §4 distingue linguagem de conteúdo. | Simplicidade não reduz profundidade; usar equivalentes semânticos mais fáceis. |
| 5 | **Ênfases editoriais**: preservar capitalizações intencionais (VERDADE, AMENIZADA, etc.), negritos, itálicos, sublinhados; não normalizar automaticamente. | Sim: §5 exige preservação e equivalência semântica. | Capitalização aplica-se a palavras/expressões, não a frases inteiras sem necessidade. |

Correções e limites vinculantes: [revisao-M36A1-plano-M36A2.md](revisao-M36A1-plano-M36A2.md).

## Segmento 2

RESULTADO  
Análise da seção 6 do cabeçalho histórico da FT-112, conforme evidência fornecida.

EVIDÊNCIAS  
A seção 6 estabelece regras absolutas para citações e referências, com os seguintes blocos identificáveis:

- **§6 (regra absoluta)**:  
  - Exige referência verificável para toda citação e referência editorial.  
  - Proíbe invenção, aproximação ou atribuição sem confirmação.  
  - Exige conversão obrigatória de referências parentéticas legadas para o formato vigente, com nova verificação.  
  - Proíbe manter referência parentética legada apenas por existência prévia.  
  - Proíbe alterar o alcance semântico da referência durante conversão.

- **§6.1 (preservação de subcitações e referências internas)**:  
  - Subcitações e referências internas ao conteúdo citado devem ser preservadas literalmente (sintaxe, pontuação, abreviações, etc.).  
  - Referência parentética dentro do conteúdo literal da citação é exceção à conversão e deve permanecer intocada.  
  - Distinção obrigatória entre referência editorial externa (sujeita às regras normativas) e referência interna ao autor citado (preservada).

- **§6.2 (fontes Ellen G. White)**:  
  - Citação inline: entre aspas e itálico, seguida da referência conforme padrão vigente.  
  - Footnote: `<NomeLivro>[ - <NomeCapítulo>], p. <páginas>`.  
  - Não aglutinar referências de obras distintas.  
  - Preservar referências internas (Bíblia, autores, obras) conforme §6.1.

- **§6.3 (Bíblia)**:  
  - Footnote bíblica: `Bíblia, <VERSÃO>. <NomeLivro> <Capítulo>:<versículos>[; ...]`.  
  - Referência entre parênteses: `(<VERSÃO>. <SiglaLivro> <Capítulo>:<versículos>[; ...])`.  
  - Não aglutinar referências de livros distintos.  
  - Regras aplicam-se apenas às referências editoriais do texto, não às referências bíblicas literais dentro de citações alheias.

- **§6.4 (blockquotes)**:  
  - Todo trecho citado deve permanecer em **um único parágrafo**.  
  - Versículos bíblicos devem ter números em sobrescrito (ex: `²³`, `²⁴`).  
  - Referência completa deve aparecer imediatamente após o trecho citado, na mesma blockquote.  
  - **NÃO usar footnote para a referência da própria citação**.  
  - Subcitações internas devem permanecer no mesmo ponto e forma original.

Correções e limites vinculantes: [revisao-M36A2-plano-M36A3.md](revisao-M36A2-plano-M36A3.md).

## Segmento 3

RESULTADO  
Análise do §7 e §8 da evidência fornecida, com distinção entre obrigações e estratégias opcionais/condicionais:

**§7 – Estratégia obrigatória de pesquisa/verificação**  
- **Obrigações**:  
  - Priorizar estratégia com maior precisão e menor custo computacional.  
  - Verificar referências editoriais preexistentes **entre parênteses**, não apenas novas.  
  - Determinar, **antes de converter**, se referência parentética é *editorial* (converter) ou *interna à citação* (preservar literalmente).  
  - Garantir que citação final e sua referência editorial sejam precisas, corretas, válidas e verificadas; em dúvida material, não apresentar como confirmada.  

- **Estratégias opcionais/condicionais**:  
  - Criar/reutilizar script/ferramenta especializada (condicional à reutilizabilidade e à vantagem de custo/precisão).  
  - Combinar busca local e online (condicional à melhoria de confiabilidade/eficiência).  
  - Considerar limitações de PDF/EPUB/web (condicional à existência da fonte correspondente).  
  - Aplicar os 4 passos recomendados (localizar → conferir → validar → cruzar) quando houver divergência material ou necessidade de confirmação.  

**§8 – Critério final**  
- **Obrigações simultâneas exigidas para validade da edição**:  
  - Criar introdução adequada, sucinta e organicamente integrada.  
  - Conservar integralmente fatos, contexto, essência, conceitos, argumentos, exemplos, intensidade e intenção.  
  - Melhorar gramática, semântica, organização, progressão lógica e legibilidade.  
  - Reduzir redundância/tokens sem reducionismo.  
  - Preservar ênfases deliberadas.  
  - Manter firmeza sem desrespeito gratuito.  
  - Tornar texto acessível sem empobrecimento.  
  - Identificar, verificar e converter referências editoriais preexistentes entre parênteses.  
  - Preservar **integral e literalmente** subcitações/referências internas.  
  - Distinguir inequivocamente referência *da citação* de referência *dentro da citação*.  
  - Garantir que **toda citação e toda referência editorial apresentada tenham sido efetivamente verificadas**.  

**Condições de literalidade, fonte, paginação e preservação**  
- Literalidade: exigida para subcitações/referências internas; não se aplica a referências editoriais (devem ser convertidas conforme normas).  
- Fonte: verificação deve usar a fonte com melhor capacidade de busca (§7), e confirmar paginação na fonte adequada (não EPUB para paginação, não web para fidelidade textual).  
- Paginação: não pode ser inferida; deve ser validada na fonte apropriada.  
- Preservação: exige distinção clara entre conteúdo editorial (editável) e conteúdo citado (preservado literalmente), inclusive em referências.

Correções e limites vinculantes: [revisao-M36A3-plano-M36B.md](revisao-M36A3-plano-M36B.md).

## Pendências de fechamento

- Cruzar todos os requisitos com as evidências de conteúdo e fontes já obtidas; não confundir histórico de execução com texto atual.
- Incorporar precedência das instruções humanas posteriores e inventário M13 já aceito.
- Conferir §6.4 no HTML M35, incluindo parágrafo único, versículos e atribuição; resolver notas externas versus internas com contexto.
- Consolidar preservação, citações atuais, gates visuais pertinentes, metadados e estado final.
- Sem publicação ou push.
