const fs = require('node:fs'), path = require('node:path');
const at = n => path.join(__dirname,n);
const target = at('checklist-M36A.md');
if (!fs.readFileSync(target,'utf8').includes('M36A pending')) throw Error('Checklist já compilado ou divergente; não repetir');
const gate = JSON.parse(fs.readFileSync(at('validacao-render-M33.json'),'utf8'));
if(gate.status !== 'passed' || gate.sha256_draft !== '009103297c963d1f1f9ab905e900891ce5d76c80975049794aee59885a5124f4') throw Error('Gate M35 divergente');
const reviewNames=['revisao-M36A1-plano-M36A2.md','revisao-M36A2-plano-M36A3.md','revisao-M36A3-plano-M36B.md'];
let output='# Checklist consolidado do cabeçalho original — FT-112\n\nEstado: requisitos identificados; confronto editorial integral pendente. Artigo de referência SHA-256 '+gate.sha256_draft+'.\n\nComprovado atualmente por M35: estrutura renderizada de notas e tabela, sem avisos do Kramdown. Isso não comprova literalidade, preservação autoral, cumprimento completo do cabeçalho ou revisão visual. As análises abaixo identificam requisitos, não aprovam o artigo. As correções das revisões vinculadas são parte obrigatória deste checklist.\n';
for(let i=1;i<=3;i++){
 const envelope=JSON.parse(fs.readFileSync(at('resultado-M36A'+i+'.json'),'utf8'));
 const data=JSON.parse(envelope.content.find(c=>c.type==='text').text);
 if(data.status!=='COMPLETED')throw Error('Análise não concluída: '+i);
 const body=data.result.split(/\n(?:LIMITE|RISCOS\/LIMITAÇÕES|EVIDÊNCIAS)\s*\n/)[0].split('EXECUÇÃO COMPROVADA PELO RUNTIME')[0];
 output+='\n## Segmento '+i+'\n\n'+body.trim()+'\n\nCorreções e limites vinculantes: ['+reviewNames[i-1]+']('+reviewNames[i-1]+').\n';
}
output+='\n## Pendências de fechamento\n\n- Cruzar todos os requisitos com as evidências de conteúdo e fontes já obtidas; não confundir histórico de execução com texto atual.\n- Incorporar precedência das instruções humanas posteriores e inventário M13 já aceito.\n- Conferir §6.4 no HTML M35, incluindo parágrafo único, versículos e atribuição; resolver notas externas versus internas com contexto.\n- Consolidar preservação, citações atuais, gates visuais pertinentes, metadados e estado final.\n- Sem publicação ou push.\n';
fs.writeFileSync(target,output,'utf8');
console.log(JSON.stringify({unit:'M36B',checklist:'written',analyses:3,limit:'Requisitos consolidados; conformidade editorial ainda pendente.'}));
