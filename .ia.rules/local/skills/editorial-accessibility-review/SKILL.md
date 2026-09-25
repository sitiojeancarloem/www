---
name: editorial-accessibility-review
description: Aplica revisão editorial acessível distinguindo síntese conversacional de texto humano e preservando substância, voz e marcação autoral. Use em síntese, edição ou revisão redacional; não use para correção mecânica isolada.
---

# Revisão editorial acessível

## Autoridade

Carregue primeiro `.ia.rules/resources/editorial-authoring.md`. Depois carregue `RCFs/bate-papo.md` para síntese conversacional e as demais sub-RCFs do conteúdo. Esta Skill especializa o produto, não copia nem substitui a capacidade canônica.

Trabalhe somente na região expressamente colocada em escopo. Não faça varredura automática do corpus, não invente fonte, fato, citação, consenso, autoria ou intenção e não promova sugestão a texto final sem autorização.

## Classificação obrigatória

Antes de editar, classifique a entrada:

- `sintese-conversacional`: conversa, bate-papo, gravação, áudio transcrito ou conteúdo dialogado equivalente sem autor redacional originário;
- `texto-autoral`: post, artigo ou trecho humano cuja voz, pontuação, ritmo e peculiaridades válidas pertencem ao autor;
- `ambigua`: origem ou intenção insuficiente; preserve a forma e solicite decisão humana.

Na síntese conversacional, não imite uma voz autoral inexistente nem reproduza ruído da transcrição. Preserve autoria intelectual, atribuições, divergências, hesitações, condicionais, mudanças de posição, referências e proporção das ideias.

No texto autoral, preserve vocabulário, sintaxe, pontuação, cadência, intensidade, oralidade, formalidade, construção idiomática, intenção e personalidade. Clareza é obtida dentro dessa voz, não por homogeneização.

## Rigor acessível

Prefira a formulação mais simples que mantenha exatamente força, nuance e precisão. Reduza período excessivo, subordinação acumulada, múltipla negação, abstração encadeada e referência ambígua apenas quando não houver perda material.

Assunto complexo continua pleno. Não infantilize, não resuma por conveniência e não troque conceito preciso por aproximação. Termo técnico necessário permanece e recebe, na primeira ocorrência pertinente, uma explicação curta, simples, correta e não circular entre parênteses. Não repita a glossa automaticamente; reexplique somente quando extensão, mudança de sentido/contexto ou prejuízo demonstrado de compreensão exigir.

## Alternativa estilística excepcional

Quando uma redação autoral puder ficar materialmente mais clara apenas com alteração de estilo, preserve o original e apresente uma alternativa adjacente. Use exatamente esta estrutura, limitada ao menor trecho:

```markdown
<!-- JCEM-ORIGINAL-AUTORAL:START -->
Trecho original intacto.
<!-- JCEM-ORIGINAL-AUTORAL:END -->

<!-- JCEM-ALTERNATIVA-ESTILISTICA: alteração explícita de estilo; não substitui o original sem decisão humana. -->
Trecho alternativo.
<!-- JCEM-ALTERNATIVA-ESTILISTICA:END -->
```

Não esconda, apague ou comente apenas uma parte do original. Não aplique a exceção em massa. A saída deve declarar por que a voz existente não permitiu resolver o problema com intervenção menor.

## Saída

Entregue:

1. classificação e rotas aplicadas;
2. texto revisado ou síntese;
3. mudanças materiais, com justificativa;
4. conteúdo e formas preservados;
5. glossas introduzidas e sua primeira ocorrência;
6. ambiguidades e decisões humanas pendentes;
7. alternativa estilística, somente quando indispensável e marcada.

## Verificação

Confirme que síntese e texto autoral receberam regras distintas; nenhuma substância, referência ou nuance foi removida; a voz humana permaneceu reconhecível; glossas não foram repetidas sem motivo; alternativas não substituíram o original; e toda ambiguidade material continuou explícita.
