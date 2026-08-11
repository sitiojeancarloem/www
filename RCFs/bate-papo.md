<!-- AI-PROCESSED -->
# RCF-JCEM-BATE-PAPOS-001

Status: vigente.

Escopo: artigos que sintetizam bate-papos, conversas, estudos dialogados ou encontros equivalentes.

Dependências: [Namespaces editoriais](./namespaces-editoriais.md), [Citações](./citacoes.md) e [Referências e footnotes](./referencias-e-footnotes.md).

## Regras Normativas

- Todo conteúdo deste escopo deve iniciar, após os metadados, com o aviso padronizado, sucinto e claramente visível: **“Nota editorial: Esta é uma síntese fiel de um bate-papo, editada apenas para tornar a leitura mais clara e agradável. O material foi produzido e processado de forma automatizada, inclusive com uso de inteligência artificial, e pode conter erros, imprecisões ou interpretações inadequadas. Nem tudo o que foi dito foi necessariamente aceito por todos: formulações coletivas não significam unanimidade, aprovação integral ou ausência de objeções; cada participante pode ter ponderado, discordado, preferido não se manifestar ou silenciado por razões distintas.”**
- O aviso DEVE ser um bloco semântico de citação com modelo `alerta1`, declarado por ocorrência. A associação pertence a esta sub-RCF e não altera o default de outros `blockquote`.
- O resultado deve ser síntese temática do bate-papo, nunca transcrição, ata ou reconstrução cronológica. A organização deve desenvolver os temas e argumentos, preservando a ordem cronológica dos fatos quando ela for material à compreensão.
- A linguagem deve ser acessível a públicos com diferentes níveis de formação. Termos técnicos são admitidos quando necessários à exatidão, sem rebuscamento dispensável.
- A síntese deve explicar o tema e seu desenvolvimento argumentativo, preservando integralmente ideias, filosofias, conceitos, detalhes, nuances, divergências, hipóteses, raciocínios intermediários, hesitações, condicionais e mudanças de posição materialmente relevantes.
- A condição de síntese não autoriza converter o conteúdo em artigo autoral do redator, apagar a autoria intelectual dos participantes nem apresentar como elaboração editorial o que foi efetivamente dito, defendido, citado ou desenvolvido no bate-papo. Atribuições discretas — como “o participante argumenta” e “o instrutor observa” — devem ser usadas quando necessárias para preservar autoria, origem e contexto das ideias.
- Maximizar densidade informacional não autoriza reducionismo: cada ideia relevante deve conservar, tanto quanto possível, sua importância e ênfase proporcionais no bate-papo; somente repetição, redundância e prolixidade devem ser eliminadas.
- Áudio, software ou processo de transcrição e posições temporais não devem ser mencionados, salvo quando estritamente indispensáveis à compreensão de ponto material.
- Participantes devem receber nomes fictícios ou identificadores funcionais, salvo indicação humana inequívoca em contrário ou identificador previamente definido que deva prevalecer. Quando uma pessoa conduzir ou nortear predominantemente a discussão, a identificação funcional deve prevalecer sobre seu nome real; papel editorial observado não autoriza título ou autoridade não demonstrada.
- Ausência de manifestação nunca deve ser interpretada como concordância. Consenso, aceitação, rejeição, aprovação, conclusão ou ausência de conclusão do grupo somente podem ser mencionados quando explicitamente demonstrados e materiais ao tema; ressalvas já cobertas pelo aviso editorial não devem ser reiteradas.
- Fala documentada, síntese editorial, inferência e conjectura devem permanecer semanticamente distinguíveis, sem acrescentar conclusões não sustentadas ou apresentadas.
- A primeira ocorrência explícita de cada citação textual deve apresentar integralmente o trecho preservado na fonte disponível e sua referência nomeada `[^id]`; ocorrência posterior deve reutilizar a referência e não repetir integralmente o texto sem necessidade editorial comprovada.
- Todas as citações e referências preexistentes devem ser preservadas integralmente. A vedação a menções processuais não autoriza abreviar, parafrasear, deslocar ou suprimir conteúdo já integrante de citação ou referência; eventual menção dessa natureza dentro de referência preservada constitui a exceção estritamente necessária.
- Quando a fonte disponível conservar apenas um excerto, a edição deve identificá-lo como parcial e nunca completar por memória, hipótese ou texto não documentado.
- Quando participante fizer referência inequívoca a fonte ou citação omitida, cortada ou não localizada, complemento pequeno PODE ser acrescentado se melhorar exatidão ou continuidade, desde que identificado como nota editorial, rastreável e sem expansão livre do argumento.
- Referências devem obedecer integralmente ao `RCF-JCEM-FOOTNOTES-001`; sistema numérico manual ou paralelo é proibido.
- Títulos, subtítulos, atribuições, blockquotes, subcitações, intervenções editoriais e separação entre original e complemento DEVEM usar os contratos comuns, sem ornamentação por preferência estética.

## Namespace e roteamento

- Aplicam-se integralmente os [Namespaces editoriais](./namespaces-editoriais.md). A configuração vigente DEVE declarar `bate-papo:` como topo lógico, `Bate-papo:` como prefixo de título e `bate-papo-` como prefixo físico portável.
- Quando uma única obra-base principal iniciar ou estruturar inequivocamente o estudo, o conteúdo DEVE declarar um único subnamespace normalizado dessa obra. Obra apenas citada, quantidade de referências ou tema incidental NÃO DEVEM criar subnamespace concorrente.
- Ao concluir transformação para Markdown, arquivo e diretório DEVEM ser renomeados conforme namespace, subnamespace e título efetivo; nome temporário não prevalece sobre o contrato físico.

## Validação

- A validação editorial deve confirmar o aviso na abertura, caráter temático, anonimização, linguagem acessível, preservação proporcional do conteúdo e da autoria intelectual, ausência das referências processuais vedadas fora da exceção documental, ausência de presunção coletiva, distinção entre conteúdo documentado e elaboração editorial, preservação integral das citações e referências e ausência de repetição textual desnecessária.
- Todas as chamadas e definições `[^id]` devem ser pareadas, reutilizar identificadores semanticamente equivalentes e renderizar pelo mecanismo Jekyll/Kramdown vigente.
- O build com rascunhos deve confirmar hierarquia de títulos, blockquotes, linhas de referência, notas de rodapé e legibilidade da página renderizada.
- A validação deve confirmar o título `Bate-papo:`, a URL pública literal `/p/bate-papo:`, o path físico local hifenizado, a conversão central e a resolução da rota sem erro, redirecionamento involuntário ou divergência canônica.
- A validação DEVE confirmar modelo `alerta1` somente no disclaimer, obra-base/subnamespace quando aplicável, notas editoriais identificadas, primeira citação integral, deduplicação sem perda, autoria intelectual e ausência de particularidade de artigo na norma geral.

