---
name: reverential-editorial-review
description: Revisa capitalização reverencial cristã de modo contextual e preservador. Use em edição, revisão autoral ou pré-publicação quando houver referência potencialmente divina, cadeia correferente ou caixa alta material; não use em correção técnica, formatação mecânica ou texto sem esses sinais.
---

# Revisão editorial reverencial

## Autoridade

Carregue e aplique primeiro `.ia.rules/resources/editorial-authoring.md`. Em seguida, aplique `RCFs/revisao-editorial-reverencial.md`. Esta Skill operacionaliza apenas a especialização local e não substitui nem reduz a capacidade editorial canônica.

Trabalhe somente no texto expressamente colocado em escopo. A ausência desta Skill não impede a revisão editorial genérica e não autoriza simular uma decisão reverencial.

## Procedimento

1. Identifique antes de tudo citações inline, blocos semânticos de citação e outras estruturas inequivocamente citacionais. Preserve nelas a capitalização da fonte.
2. Preserve palavras e expressões localizadas que constituam ênfase autoral deliberada em CAIXA ALTA, inclusive durante reescrita semanticamente equivalente.
3. Normalize sentença integral em CAIXA ALTA quando ela for erro tipográfico ou editorial. Preserve nomes próprios, siglas, capitalização reverencial aplicável e destaques pontuais inequivocamente legítimos.
4. Fora de citação, resolva cada referente pelo texto e pelo contexto. Não derive certeza de frequência, tema geral, proximidade lexical ou lista fechada.
5. Capitalize integralmente nome, variante, transliteração, título, designação, pronome, demonstrativo ou contração somente quando o referente for inequivocamente o DEUS cristão, JESUS CRISTO ou o ESPÍRITO SANTO.
6. Não aplique capitalização reverencial cristã a Baal, divindades gregas, outras religiões, conceito genérico, classe de deuses, ser humano, personagem tratado como deus ou homógrafo.
7. Resolva referentes distintos individualmente. Em formas correferentes concorrentes, capitalize adicionalmente apenas a forma mais estrita: `aquele JESUS`, `aquele ESPÍRITO SANTO` e `o próprio JEOVÁ` preservam os modificadores.
8. Quando antecedente ou referente permanecer materialmente ambíguo, mantenha a forma existente e registre a necessidade de revisão humana.

Regex e léxico podem descobrir candidatos, mas nunca decidir sozinhos nem aplicar substituição cega.

## Matriz mínima

- Positivos inequívocos: `DEUS`, `JESUS`, `JESUS CRISTO`, `CRISTO`, `ESPÍRITO SANTO`, `JEOVÁ`, `JAVÉ`, `YHWH`, variante aberta, título e pronome ou contração cristãos contextualizados.
- Negativos preservados: `Baal`, deuses gregos, outra religião, divindade genérica, ser humano, homógrafo, antecedente ambíguo, citação inline e bloco de citação.
- Combinados: referente cristão e não cristão no mesmo trecho; `aquele JESUS`; `aquele ESPÍRITO SANTO`; `o próprio JEOVÁ`; pronome inequívoco sem nome; ênfase localizada; reescrita equivalente; sentença integral em caixa alta.

## Saída

Entregue o texto revisado e um registro sucinto separado em:

- alterações propostas ou aplicadas, com o contexto que tornou o referente inequívoco;
- formas preservadas, incluindo citações e ênfases;
- ambiguidades mantidas para revisão humana.

Não invente contexto, referente, intenção autoral ou interpretação teológica para preencher lacunas.

## Verificação

Confirme antes de concluir:

- que a capacidade editorial canônica foi aplicada primeiro;
- que citações e ênfases legítimas não foram alteradas;
- que cada referente recebeu decisão individual e contextual;
- que casos ambíguos conservaram a forma original;
- que nenhuma substituição cega ou alteração fora do escopo ocorreu.
