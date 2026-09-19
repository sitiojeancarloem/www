<!-- AI-PROCESSED -->
# RCF-JCEM-REVISAO-EDITORIAL-REVERENCIAL-001

Status: normatização concluída na FT-082; implementação local pendente na FT-083.

Escopo: revisão autoral e pré-publicação deste produto quando houver capitalização reverencial, caixa alta autoral, citação ou decisão contextual correlata.

## Autoridade e ativação

- A capacidade gerenciada `.ia.rules/resources/editorial-authoring.md` DEVE governar primeiro preservação de voz, conteúdo, representação, ambiguidade e intervenção editorial; esta sub-RCF contém somente a especialização reverencial do produto e NÃO PODE copiar, substituir ou reduzir o contrato canônico. [357e91d]
- A especialização DEVE ser ativada somente em edição, revisão autoral ou pré-publicação com ocorrência material de referência potencialmente divina, cadeia correferente ou caixa alta; correção técnica, formatação mecânica e tarefa sem esses sinais NÃO DEVEM carregá-la. [357e91d]
- O conteúdo editorial original DEVE permanecer a fonte de verdade: a especialização orienta a decisão de revisão e NÃO AUTORIZA varredura ou alteração automática do corpus fora do texto expressamente colocado em escopo. [357e91d]

## Precedência editorial

- Cada trecho DEVE ser processado nesta ordem: identificar citação; preservar ênfase localizada em caixa alta; normalizar sentença integral em caixa alta quando ela constituir erro editorial; fora de citação resolver o referente; confirmar se ele é inequivocamente o DEUS cristão, JESUS CRISTO ou o ESPÍRITO SANTO; aplicar capitalização reverencial; resolver concorrência correferente pela forma mais estrita; preservar toda capitalização legítima restante. [357e91d]
- Citação inline, bloco semântico de citação e outra estrutura inequivocamente citacional DEVEM preservar a capitalização da fonte e NÃO DEVEM receber capitalização reverencial automática; outra correção dentro da citação exige autorização normativa própria. [357e91d]
- Palavra ou expressão localizada que o autor/editor tenha deliberadamente mantido em CAIXA ALTA DEVE conservar essa ênfase, inclusive em citação e durante reescrita do trecho semanticamente equivalente. [357e91d]
- Frase ou sentença integral em CAIXA ALTA DEVE ser presumida erro tipográfico/editorial e normalizada, preservando após a normalização nomes próprios, siglas, capitalização reverencial aplicável e destaques pontuais que possam ser determinados inequivocamente. [357e91d]

## Referente e capitalização reverencial

- Fora de citação, nome, variante, transliteração, título, designação, pronome, demonstrativo, contração ou outra forma nominal/pronominal DEVE ser capitalizada integralmente somente quando o próprio texto ou contexto tornar inequívoco que seu referente é o DEUS cristão, JESUS CRISTO ou o ESPÍRITO SANTO. [357e91d]
- Nomes inequivocamente cristãos, incluindo DEUS, JESUS, JESUS CRISTO, CRISTO, ESPÍRITO SANTO, JEOVÁ, JAVÉ e YHWH, são exemplos abertos; a decisão NÃO PODE depender de dicionário fechado e DEVE reconhecer outra variante ou transliteração inequivocamente usada com o mesmo referente. [357e91d]
- Ocorrência relativa a outra divindade, divindade mitológica, conceito genérico, classe de deuses, ser humano, personagem tratado como deus ou qualquer outro ente NÃO DEVE receber capitalização reverencial cristã. [357e91d]
- Ocorrência materialmente ambígua DEVE conservar a forma existente; assunto geral, frequência do corpus, proximidade lexical, mera possibilidade ou interpretação teológica incerta NÃO PODEM fabricar certeza semântica. [357e91d]
- Referentes distintos no mesmo artigo, parágrafo ou sentença DEVEM ser resolvidos individualmente, inclusive quando uma ocorrência designar o DEUS cristão e outra designar Baal, divindade grega, conceito genérico ou pessoa. [357e91d]
- Quando uma construção contiver formas correferentes concorrentes e uma delas identificar explicitamente o referente com maior estriteza, somente essa forma mais estrita DEVE receber a capitalização reverencial adicional; `aquele JESUS`, `aquele ESPÍRITO SANTO` e `o próprio JEOVÁ` preservam os modificadores não necessários. [357e91d]
- Pronome, demonstrativo ou contração sem nome explícito PODE receber capitalização reverencial quando o contexto tornar o referente cristão inequívoco; existindo antecedente ambíguo, a forma atual DEVE ser preservada. [357e91d]

## Mecanismo local

- A implementação DEVE usar uma Skill local, estreita e removível, subordinada a `editorial-authoring` e a esta sub-RCF; Subagent NÃO DEVE ser criado enquanto não existir objetivo independente, paralelizável e verificável que demonstre ganho líquido sobre a Skill e o Agent primário. [357e91d]
- A Skill DEVE declarar gatilhos positivos, negativos e limítrofes, entradas, saída, efeitos, limites, precedência, operação sem hook, falha preservadora e validação; sua indisponibilidade NÃO PODE impedir a capacidade editorial canônica nem autorizar decisão simulada. [357e91d]
- A saída DEVE distinguir texto preservado, alteração proposta/aplicada e diagnóstico de ambiguidade; ausência de contexto suficiente DEVE manter a forma original e pedir revisão humana em vez de inferir referente. [357e91d]
- Regex ou léxico PODEM apoiar descoberta de candidatos, mas NÃO PODEM constituir o único critério de decisão, aplicar substituição cega ou alterar ocorrência sem resolução contextual e estrutural suficiente. [357e91d]

## Validação

- A matriz positiva DEVE cobrir DEUS, JESUS, JESUS CRISTO, CRISTO, ESPÍRITO SANTO, JEOVÁ, JAVÉ, YHWH, variante aberta, título e pronome/contração cristãos inequívocos. [357e91d]
- A matriz negativa DEVE cobrir Baal, deuses gregos, outra religião, divindade genérica, ser humano, homógrafo, antecedente ambíguo, citação inline e bloco de citação. [357e91d]
- A matriz combinada DEVE cobrir referentes cristãos e não cristãos no mesmo trecho, `aquele JESUS`, `aquele ESPÍRITO SANTO`, `o próprio JEOVÁ`, pronome inequívoco sem nome, ênfase localizada preservada, reescrita com ênfase equivalente e sentença integral em caixa alta normalizada sem perda legítima. [357e91d]
- A validação DEVE provar descoberta positiva, não ativação negativa, caso limítrofe preservador, descritor íntegro, rota local subordinada, ausência de Subagent redundante, ausência de edição do núcleo gerenciado e regressão das demais regras editoriais e de pré-publicação. [357e91d]
