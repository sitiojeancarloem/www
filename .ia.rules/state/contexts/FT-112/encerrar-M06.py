from pathlib import Path
import json
h=Path(__file__).parent;repo=h.parents[3]
a=json.loads((h/'auditoria-final.json').read_text(encoding='utf8'))
v=json.loads((h/'validacao-citacoes-atual.json').read_text(encoding='utf8'))
r=json.loads((h/'validacao-render.json').read_text(encoding='utf8'))
assert not v['divergencias'] and not r['warnings'] and r['sha256_draft']==a['sha256_draft']
report=f'''# FT-112 — revisão final da carta

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

- {v['aprovadas']} conferências lexicais automatizadas, sem divergência; comparação ignora pontuação, espaços e capitalização de ênfase, portanto não substitui a leitura contextual. ST em inglês conferido separadamente na fonte pública.
- {r['citations']} blocos em um parágrafo, {r['footnotes']} notas, {r['footnote_calls']} chamadas e tabela com sete linhas; zero avisos Kramdown e zero referências quebradas. Nenhuma nota sem chamada.
- Fontes novas em `evidencias-vitoria*.json`, `evidencias-autoral.json`, `biblia-adicoes.json` e `biblia-final.json`; fontes anteriores reaproveitadas por seu conteúdo, não por resultado antigo de teste. Manual 2025 reconferido: pastores pp. 35–37; disciplina pp. 70–74; reunião administrativa p. 139.
- `scripts/test_footnotes.rb`: `footnotes=ok`, exit 0. `scripts/test_quote_semantics.rb`: `quote_semantics=ok`, exit 0.
- `auditoria-final.json`, `validacao-citacoes-atual.json` e `validacao-render.json` identificam o mesmo SHA-256: `{a['sha256_draft']}`.
- `git diff --check` aprovado para a entrega. Scripts M06 registram reparos de itálico, referência imediata, versão bíblica, paginação, sequência de notas e parágrafos fragmentados por marcadores.

## Limites preservados

As acusações locais não foram independentemente comprovadas; permanecem testemunho do autor. A possível 3ª Guerra é reflexão pessoal, com fontes não teológicas apenas para aspectos delimitados. Hipóteses proféticas e institucionais não foram transformadas em revelação. A revisão de acessibilidade é editorial, sem teste empírico com leitores. A validação HTML é pontual do draft, não homologação de todos os temas e viewports do site. Sem publicação ou push. Alterações herdadas em runtime, teste de resiliência e `_site` ficam fora da entrega.

Microtarefas concluídas em commits próprios; registro integral em `historico-retomada.md`. Comando nativo confirmado para prévia com drafts: `npm run dev-live -- --drafts`.
'''
(h/'relatorio.md').write_text(report,encoding='utf8')
p=h/'retomada.md';t=p.read_text(encoding='utf8');t=t.replace('6. [pendente]','6. [concluída]')
t=t.split('\nBloqueio ambiental:',1)[0]
t+='''
## Estado final recuperável

M07/M08: 48f177a4a1. M09a: 33d159cf9a. M09b/c: 70208549e1. M10: 15aa50d432. M06 concluída; commit contém este checkpoint. Não reaplicar scripts de edição: todos já executados. Relatório e verificações atuais em relatorio.md e auditoria-final.json. Não usar resultados antigos como prova do draft atual.

Bloqueio anterior de aprovação/rede foi resolvido; nenhuma limitação técnica pendente. Próximo passo exclusivamente humano: leitura e aceite autoral, ou novo pedido de revisão. Sem publicação/push. Proibição do localWorker preservada nesta conversa.
''';p.write_text(t,encoding='utf8')
p=h/'historico-retomada.md';t=p.read_text(encoding='utf8');t+='''

Checkpoint M10: 15aa50d432.

## M06 — auditoria final

Corrigidos itálicos/referências imediatas, versão das novas notas bíblicas, formato das referências EGW, sobrescrito Ap21:8 e fragmentação por marcadores. Preservadas 123 definições, ordenadas pela primeira chamada. Render final: 47 blocos, 154 chamadas, sete linhas de tabela, nenhum aviso/link quebrado/negrito cru. Um destaque dentro de `<u>` não era interpretado pelo Kramdown; reorganizada somente a sintaxe, preservando ambos os destaques. Cem conferências lexicais aprovadas; capítulos adicionais capturados e textos de apoio lidos; subcitações e cena PE conservadas. Testes existentes footnotes e quote_semantics exit 0. Nenhuma alteração alheia incluída. Relatório antigo substituído pelo resultado atual; histórico Git conserva as versões anteriores. Hash atual nos três registros de validação. Próxima ação humana: aceite autoral, não correção técnica pendente.
''';p.write_text(t,encoding='utf8')
p=h/'master.md';p.write_text(p.read_text(encoding='utf8')+'\n## Fechamento da retomada\n\nM01–M10 e M06 final concluídas. Evidência vigente em relatorio.md e auditoria-final.json; resultados anteriores acima são históricos. Base prevalente ff9f255678. Sem Worker, publicação ou push.\n',encoding='utf8')
print('Contexto, histórico e relatório atualizados.')
