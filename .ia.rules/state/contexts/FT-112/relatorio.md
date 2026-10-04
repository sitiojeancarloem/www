# FT-112 — Revisão da carta aberta

Revisão executada diretamente pelo supervisor no mesmo draft, em 4 de outubro de 2026. Nenhum uso direto ou indireto de localWorker, nenhuma delegação e nenhuma alteração na biblioteca externa.

## Escopo e decisões humanas

Entrada classificada como texto autoral. O cabeçalho integral foi lido e preservado byte a byte. Aplicaram-se as rotas editoriais e as Skills locais `editorial-accessibility-review`, `reverential-editorial-review` e `egw-source-verification`. A reestruturação e as correções factuais estavam expressamente autorizadas. A regra mais recente restringe autoridades teológicas à Bíblia e a Ellen White; fontes primárias e jornalísticas confiáveis podem corroborar outras questões. A hipótese de uma terceira guerra mundial permanece reflexão pessoal.

## Entrega e preservação

- Introdução integrada; organização dos acréscimos sobre Igreja/instituição, Elias, responsabilidade coletiva, Dia da Expiação e aplicação final.
- Revisão gramatical, explicações de termos necessários e redução de repetições, conservando advertência, exemplos, testemunho pessoal, ressalvas e ênfases.
- Cobertura dos 169 parágrafos-fonte registrada em `cobertura.json`: 159 encaminhados à montagem; os demais são instruções executadas, três citações duplicadas e material bibliográfico substituído pelas notas verificadas. Essa matriz registra destino, não é uma prova automática de equivalência semântica; houve revisão contextual pelo supervisor.
- Referências editoriais convertidas em notas; referências de blocos mantidas na linha seguinte. Subcitações bíblicas, `Carta 184, 1901` e referências internas de Ellen White preservadas como conteúdo documental, sem conversão para notas editoriais.
- Capitalização reverencial contextual fora das citações; grafia das fontes e ênfases intencionais preservadas dentro delas. Negritos internos a `<u>` passaram a `<strong>` para efetivamente renderizar as duas ênfases.
- Aplicação por `editorial-authoring.js`, com marcação AI-PROCESSED da região editorial reestruturada. Nenhum outro artigo alterado.

## Correções materiais

| Questão | Tratamento |
|---|---|
| Domingo como suposto sétimo dia em encíclicas | Corrigido: a carta apostólica *Dies Domini*, §§19 e 26, fala em primeiro e oitavo dia. Documento usado para conferir sua própria declaração, nunca como autoridade teológica. |
| GC sobre a mensagem de 1844 | Referência corrigida para p. 458, capítulo *Restauração da verdade*. |
| GC sobre purificação especial | Página 425; distinguiu-se texto literal de explicação autoral. |
| Igreja que não cairá | ME2 p. 380, *É necessária uma obra de purificação*; preservada a palavra “igreja” e limitado o alcance de deduções sobre a instituição. |
| Sacudidura | PE p. 50, T6 p. 332, testemunhos de 1850 e 1902 e Maranata, 11 de julho, p. 201. Corrigidas localização e atribuição; começo e prova futura mantidos. |
| Elias/João Batista | Apoio em Malaquias 4, Lucas 1 e ME2 p. 150, 151; substituída a referência não confirmada a SR p. 140. |
| Autoridade da Igreja | AA p. 163–165 e T9 p. 260, 261 conservados em seus contextos; não convertidos em regulamento de comissões locais. |
| Culpa maior | Lar p. 354 contextualizado na responsabilidade familiar de quem ensina. |
| Metas de batismo | Retirada a atribuição não demonstrada de proibição divina absoluta; mantida a crítica à prioridade numérica, apoiada em Evangelismo p. 343, 344. |
| Dureza e expressões atuais | Distinção entre tradução bíblica e analogias retóricas; intensidade da repreensão preservada sem atribuir insultos modernos literalmente a JESUS. |
| Filipenses 1 e PE p. 20 | Preservados desejo do Céu e tristeza pelo mundo, respeitando a continuidade da missão e a redação da fonte. |
| Mensagem do terceiro anjo | Mantidos juízo e santificação com a justificação pela fé, conforme ME1 p. 372, *“Deixaste o teu primeiro amor”*. |
| Educação | Capítulo corrigido para *Vida de grandes homens*, p. 57. |
| Bíblia | Corrigidos Lucas 13:23 e Apocalipse 3:14–22; versões, versículos e redação conferidos. |
| Geopolítica | Reflexão preservada; OTAN explica ameaças híbridas, SIPRI documenta gastos de 2024 e AP registra cooperação Rússia–Coreia do Norte em 2025. Nenhuma dessas fontes é apresentada como prova profética ou de uma guerra mundial. |

## Evidências e verificações

- Biblioteca EGW lida por extratores da Skill existente, com pesquisa EPUB, conferência PDF e hashes de integridade. Paginação citada é editorial; não é a página física do PDF. Diferenças entre títulos de metadados EPUB/PDF foram resolvidas por identidade e contexto, sem declarar confirmação automática inexistente.
- Bíblia conferida nas versões indicadas em cada referência; consulta contextual das passagens e comparação lexical das transcrições. O comparador ignora espaços, pontuação, acentos e capitalização de ênfase, segmenta omissões e trata um rodapé de extração identificado em T5 p. 676–677. Não valida sozinho interpretação nem página.
- `validacao-citacoes.json`: 73 verificações lexicais aprovadas, nenhuma divergência restante. Paráfrases e alcance das referências receberam revisão contextual separada.
- `validacao-render.json`: Kramdown 2.5.2, zero avisos, 38 blocos em um parágrafo cada, 82 notas, 102 chamadas com destino, tabela de sete linhas. Sinais de omissão escapados para não virarem possíveis links.
- Testes existentes: `scripts/test_footnotes.rb` → `footnotes=ok`; `scripts/test_quote_semantics.rb` → `quote_semantics=ok`.
- Prévia HTML local examinada no Chromium: negritos/sublinhados renderizados, sem marcadores crus. É uma prévia editorial, não uma homologação dos layouts responsivos do site publicado.
- `git diff --check` aprovado. Cabeçalho e hashes em `aplicacao.json`; índice de consultas e fontes em `fontes-verificadas.json`.

## Limites e estado

Relatos sobre a igreja local continuam atribuídos ao autor; gravações e acontecimentos pessoais não foram independentemente auditados. A conferência distingue texto da fonte, interpretação teológica e inferência pessoal; não transforma interpretação em declaração literal da fonte. Acessibilidade recebeu revisão editorial, sem teste empírico com leitores de baixa escolaridade.

Não houve publicação, push ou alteração de infraestrutura. Ruby foi executado com autorização do mecanismo de aprovação após o sandbox impedir sua inicialização; não foi instalada dependência. A entrega editorial e seus testes estão concluídos. A aprovação autoral posterior permanece uma etapa humana, sem bloqueio técnico conhecido.
