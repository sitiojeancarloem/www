from pathlib import Path
import json,re
h=Path(__file__).parent;r=h.parents[3]
a=json.loads((h/'auditoria-final.json').read_text(encoding='utf8'))
sha=a['sha256_draft']
entry='''

## M11 — correção solicitada pelo autor: afirmações não são suposições

A aprovação técnica anterior não detectou suficientemente a modalização indevida da voz autoral. O usuário rejeitou essa mudança e pediu restauração, incluindo a hipótese das mulheres de Apocalipse 12 e 17 e outros casos. A comparação foi ampliada para base-atual.md, base-autoral-ff9f255678.md e as intervenções M09. Não reaplicar M01–M10 nem o script de encerramento M06.

26 intervenções pontuais registradas nos três recibos aplicacao-M11*.json: continuidade institucional (CONTINUARÃO, SEM DÚVIDA ALGUMA, PERMANECERÁ), diagnóstico da igreja, relatos locais, confronto causado pela verdade, apostasia, escolha por omissão, joio e deveres especiais da expiação. Retiradas ressalvas editoriais que rebaixavam conclusões do autor a expectativa pessoal ou possibilidade. Não foram alteradas citações literais, dados bibliográficos já corrigidos, reflexão de guerra aprovada como pessoal, hipótese cronológica Ap9 ou neutralidade HIPOTETICAMENTE da visão PE.

Ap12/17: restaurada a transformação da mulher perseguida em perseguidora dentro da hipótese teológica defendida. GC cap. 21 conferido pelo extrator oficial em EPUB somente leitura, hash preservado; distingue igreja pura e apóstata. Razafiarivony, AJBT 17(48), 27/11/2016, p. 1–2 e nota 8, documenta a defesa dessa relação por Stefanovic (2009, p. 403–404,522); artigo consultado diretamente em https://www.biblicaltheology.com/Research/RazafiarivonyD02.pdf. O artigo critica a hipótese: foi usado para documentar sua existência e argumentos, nunca apresentado como adesão nem como consenso. O livro de Stefanovic não foi consultado diretamente. Essa limitação de acesso está explícita na cadeia de atribuição.

Validação da versão M11: 100 correspondências lexicais, zero divergências; 47 blocos, 123 notas, 154 chamadas; zero avisos Kramdown, referências quebradas ou negritos crus. Auditoria estrutural atualizada. Testes do mecanismo aprovados na M06 permanecem válidos: nenhuma alteração de código funcional. A restauração de previsões/denúncias autorais não constitui comprovação independente dos acontecimentos. Sem Worker, publicação ou push. Commit desta unidade inclui história e contexto; autoria e escolha argumentativa permanecem com o usuário.
'''
p=h/'historico-retomada.md';p.write_text(p.read_text(encoding='utf8')+entry,encoding='utf8')
p=h/'retomada.md';p.write_text(p.read_text(encoding='utf8')+'\n## Última unidade: M11 concluída\n\nPedido de desfazer conversão de afirmações em suposições atendido em 26 intervenções; incluída hipótese teológica Ap12/17 com documentação. Estado anterior foi corrigido por manifestação humana. Recibos aplicacao-M11*.json; histórico detalhado em historico-retomada.md. Não reaplicar scripts M11. Verificações atuais vinculadas ao hash '+sha+'. Próximo passo: leitura autoral ou nova correção indicada.\n',encoding='utf8')
p=h/'relatorio.md';t=p.read_text(encoding='utf8');t=re.sub(r'`[a-f0-9]{64}`','`'+sha+'`',t)
t=t.replace('Nenhuma regressão identificada na revisão documental.','A M11 corrigiu modalizações indevidas identificadas posteriormente pelo autor.')
t+='\n## Correção autoral M11 — versão vigente\n\nRestaurada a firmeza em 26 intervenções: continuidade institucional, relatos locais, confronto da verdade, apostasia, omissão, joio e expiação. Ap12/17 retomada como hipótese teológica sustentada na discussão adventista, desenvolvida afirmativamente na carta e documentada em nota. As ressalvas técnicas e bibliográficas não autorizam transformar a voz autoral em conjectura. Recibos e histórico especificam cada alteração. O relatório M06 não equivale ao aceite retórico do autor; a versão vigente incorpora sua correção.\n';p.write_text(t,encoding='utf8')
p=h/'master.md';p.write_text(p.read_text(encoding='utf8')+'\nM11 posterior: corrigida modalização indevida conforme pedido humano. Versão vigente e evidências: retomada.md, relatorio.md, aplicacao-M11*.json.\n',encoding='utf8')
p=r/'.ia.rules/state/continue.ia';t=p.read_text(encoding='utf8');start=t.index('FT-112|');section=t[start:]
section=re.sub(r'^resultado=.*$', 'resultado=Revisão M11 concluída: 26 restaurações da firmeza autoral, incluindo hipótese Ap12/17. Recibos e histórico em .ia.rules/state/contexts/FT-112/.',section,flags=re.M)
section=re.sub(r'^verificacoes=.*$', 'verificacoes=M11: 100 correspondências lexicais; 47 blocos, 123 notas, 154 chamadas; renderização e auditoria estrutural atuais sem falhas; citações preservadas.',section,flags=re.M)
p.write_text(t[:start]+section,encoding='utf8')
print('M11 documentada; SHA256 '+sha)
