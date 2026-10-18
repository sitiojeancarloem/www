# FT-112 — entrega editorial após ampliações autorais

Revisão executada no arquivo corrente `_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md`. O nome antigo, as versões rejeitadas e o cabeçalho removido pelo autor não foram restaurados. Esta entrega substitui os estados de conclusão anteriores à ampliação M13. Aceite autoral continua separado da execução técnica.

SHA-256 final: `549c46c77e77ad40e6817a4fd34f21a83854f9441cad957094c5b9d0352290c4`. Corpo: `52024f7c9020ca5032ba16aa0100eb2c6f8a8c67345c62f2df3ef3b6e01dffde`. Data de revisão: 18/10/2026, 04:46:23, America/Sao_Paulo.

## Cobertura e preservação

| Critério | Execução e evidência |
|---|---|
| Autoridade e continuidade | Instruções humanas posteriores prevaleceram: localWorker reautorizado, metadados próprios, base autoral atual e correções factuais permitidas. Inventário M13 cobre oito hunks antigos e cinco novos, com correções das leituras equivocadas preservadas em revisao-inventario-final.md e demais revisões. |
| Voz, intensidade e estrutura | Introdução e integração anteriores preservadas; M11 restaurou 26 afirmações indevidamente modalizadas. M14–M42 não fazem normalização geral, corte de retórica ou troca de convicção por hipótese. Acabe/Elias, maioria/minoria, carteiro, cuidado/zelo e crítica institucional mantêm suas advertências. Recibos e revisões discriminam cada região alterada e sua razão. |
| Novas fontes e notas | M14–M19 corrigem identidade/páginas EGW, abertura, autoexame e discernimento; M20–M28 conferem e integram Acabe/Elias, muitos/poucos e lavradores; M29–M31 tratam parêntese de Ap18, Ester, duração profética e decreto. M39–M40 corrigem somente atribuição de motivo não documentado a Uzá, conservando a advertência categórica e acrescentando PP p.655,656, edição 2007. |
| Contexto profético e inferências | Ap12/17 continua hipótese sustentada na discussão adventista, sem consenso inventado. Durações futuras permanecem construção interpretativa, sem datas para a volta de Cristo; decreto e última praga são distinguidos. Convicções institucionais não foram tornadas conjecturas. Reflexão sobre guerra permanece pessoal; testemunhos locais não foram apresentados como apuração independente. |
| Citações e subcitações | Fontes novas verificadas por Bíblia/EGW e registros locais; fontes não teológicas ficam no seu âmbito próprio. Referências editoriais e conteúdo literal interno são distintos; não se modernizam subcitações silenciosamente. M37A compara os 44 blocos e M37B 60 inline sem divergência lexical; ST foi excluída explicitamente do comparador e sua identidade com versão auditada foi comprovada na M38A. Novas citações nas notas têm evidências próprias M14–M31, sem fingir cobertura pelo regex inline. |
| Formatação e acessibilidade | M32 regulariza notas, inclusive ap1217; M34 associa legenda existente à tabela; M35 preserva NUNCA em negrito e sublinhado. M40 renderiza 44 blocos, 200 chamadas e 160 notas sem avisos, destino/retorno quebrado ou marcadores editoriais visíveis; tabela com sete linhas, caption nativo e três cabeçalhos scope col. M36B confirma um parágrafo, travessão e ausência de chamadas de notas em todos os 44 blocos. M41 confere números sobrescritos e referências dos 25 blocos bíblicos. |
| Metadados | YAML próprio da carta, descrição PT e abstract EN, autor/data de origem preservados, imagem real e campos aninhados, categorias/tags/TOC pertinentes. M42 altera somente last_modified_at; corpo byte a byte idêntico à M40. Nenhum dado de Devaneios foi recuperado. |
| Recuperação e regressão | Reconstrução M38 reproduz exatamente os 14 recibos M14–M35 a partir da base autoral; M38A aproveita essa prova e corrige apenas a baseline histórica de ST. Recibos M40/M42 documentam as alterações posteriores. Falhas e saídas parciais foram preservadas, sem reexecutar patches aplicados. Microtarefas e commits permitem retomada. Alterações herdadas em outras FTs, runtime e _site ficam fora da entrega. |

O checklist do cabeçalho original está em [checklist-M36A.md](checklist-M36A.md), com revisões vinculantes que corrigem omissões dos resumos do Worker. O confronto final usa as intervenções e verificações específicas acima; o checklist isolado nunca foi apresentado como artigo aprovado. Os comentários/instruções de trabalho da ampliação foram executados e preservados nos registros, não deixados como placeholders visíveis.

## Validações e limites

- Renderização pontual: [validacao-render-M33.json](validacao-render-M33.json), executada na M40. Não é build global ou homologação dos temas/viewports do site.
- Estrutura/versículos: [diagnostico-blocos-M36B.json](diagnostico-blocos-M36B.json) e [validacao-versiculos-M41.json](validacao-versiculos-M41.json). Passagens citadas permaneceram intocadas pela M40.
- Literalidade lexical: [validacao-citacoes-M37A.json](validacao-citacoes-M37A.json), [validacao-citacoes-M37B.json](validacao-citacoes-M37B.json), com critérios/limites explícitos; não substituem evidências contextuais e de paginação das fontes. Não se alega exatidão tipográfica por normalização lexical.
- Preservação: [validacao-preservacao-M38.json](validacao-preservacao-M38.json), cujo status original de falha ST foi mantido, e [validacao-ST-M38A.json](validacao-ST-M38A.json), que resolve somente essa falha. Nenhuma falha histórica foi apagada para aparentar aprovação.
- Fechamento de metadados/corpo: [validacao-metadados-M42.json](validacao-metadados-M42.json). Os testes do corpo não foram repetidos por uma alteração exclusiva de data; a igualdade exata do corpo vincula suas evidências.

Não houve publicação, push, envio a terceiros, alteração da biblioteca externa ou manutenção do Worker. Não se realizou teste empírico de leitura/acessibilidade com usuários, nem se comprovou de forma independente a totalidade das denúncias locais. Essas limitações permanecem explícitas; o aceite humano da voz e da mensagem não é substituído por testes.

Comando nativo para prévia incluindo drafts, já conferido no projeto: `npm run dev-live -- --drafts`.
