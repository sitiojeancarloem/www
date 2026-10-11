# FT-112 — revisão final da carta

Entrega: `_drafts/carta-aberta-hierarquia-romanda-na-igreja`. Base autoral prevalente: `ff9f255678`; suplemento integral em `suplemento-autoral.md`. Revisão executada diretamente pelo supervisor, sem localWorker, sem delegação e sem escrita na biblioteca externa.

## Aceite do suplemento

| Critério | Resultado e evidência |
|---|---|
| Precedência atual | Snapshot integral `base-autoral-ff9f255678.md`; sete commits autorais posteriores à M05 respeitados; versões rejeitadas não reaplicadas. |
| Novos conteúdos | M08, M09a/b/c integram vitória, graça/obras, coragem, história, tentação, liberdade, expiação, Pentecostes, autoridade e hipótese institucional. Histórico discrimina correções factuais autorizadas, preservando argumentos e exemplos. |
| Contundência | Conservados advertências, Acabe/Acã/Elias, responsabilidade coletiva, bombeiro, ilustração médica e crítica à hierarquia. Relatos locais permanecem autorais; fonte inspirada, inferência e denúncia não se confundem. |
| Ênfases | Três níveis; nenhum trecho Markdown em negrito excede oito palavras. Sublinhados balanceados; último destaque corrigido para renderizar efetivamente; nenhuma marca `**` crua no HTML. |
| Continuidade | Edificação, segunda milha, consagração e solenidade da expiação reaparecem onde impedem reduzir o chamado a somente evitar transgressões. |
| Vitória e distinções | Cinco passagens EGW; vitória pelo poder de CRISTO distinguida de mérito, autossuficiência e pós-lapsarianismo. Crença 11 apenas corrobora; disciplina condicionada ao procedimento institucional. |
| Primeiros Escritos | Cena, pergunta, silêncio, mãos limpas, graça, alegria e retomada do canto preservados. AINDA QUE, HIPOTETICAMENTE explícito; neutralidade cronológica; cena anterior à transformação e ao arrebatamento, não ao fechamento da graça. EPUB p. 15, 16 e PDF p. 39, 40 distinguidos. |
| Regressões | Cabeçalho intacto; notas preservadas e ordenadas; subcitações conservadas; testes e render vinculados ao hash atual. Nenhuma regressão identificada na revisão documental. |

## Verificação atual

- 100 conferências lexicais automatizadas, sem divergência; comparação ignora pontuação, espaços e capitalização de ênfase, portanto não substitui a leitura contextual. ST em inglês conferido separadamente na fonte pública.
- 47 blocos em um parágrafo, 123 notas, 154 chamadas e tabela com sete linhas; zero avisos Kramdown e zero referências quebradas. Nenhuma nota sem chamada.
- Fontes novas em `evidencias-vitoria*.json`, `evidencias-autoral.json`, `biblia-adicoes.json` e `biblia-final.json`; fontes anteriores reaproveitadas por seu conteúdo, não por resultado antigo de teste. Manual 2025 reconferido: pastores pp. 35–37; disciplina pp. 70–74; reunião administrativa p. 139.
- `scripts/test_footnotes.rb`: `footnotes=ok`, exit 0. `scripts/test_quote_semantics.rb`: `quote_semantics=ok`, exit 0.
- `auditoria-final.json`, `validacao-citacoes-atual.json` e `validacao-render.json` identificam o mesmo SHA-256: `e6d8c10f3eba0c1c502ff7026185e3d57ab441855ff829bd2b504e2337d4552a`.
- `git diff --check` aprovado para a entrega. Scripts M06 registram reparos de itálico, referência imediata, versão bíblica, paginação, sequência de notas e parágrafos fragmentados por marcadores.

## Limites preservados

As acusações locais não foram independentemente comprovadas; permanecem testemunho do autor. A possível 3ª Guerra é reflexão pessoal, com fontes não teológicas apenas para aspectos delimitados. Hipóteses proféticas e institucionais não foram transformadas em revelação. A revisão de acessibilidade é editorial, sem teste empírico com leitores. A validação HTML é pontual do draft, não homologação de todos os temas e viewports do site. Sem publicação ou push. Alterações herdadas em runtime, teste de resiliência e `_site` ficam fora da entrega.

Microtarefas concluídas em commits próprios; registro integral em `historico-retomada.md`. Comando nativo confirmado para prévia com drafts: `npm run dev-live -- --drafts`.
