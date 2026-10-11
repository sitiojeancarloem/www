const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../../..'),file=path.join(root,'_drafts/carta-aberta-hierarquia-romanda-na-igreja');
const {applyEditorialEdits}=require(path.join(root,'.ia.rules/core/runtime/scripts/editorial-authoring.js'));
const original=fs.readFileSync(file,'utf8'),headerEnd=original.indexOf('-->')+3,edits=[];
function exact(expected,replacement){const start=original.indexOf(expected,headerEnd);if(start<0||original.indexOf(expected,start+1)>=0)throw Error('Não unívoco: '+expected);edits.push({start,end:start+expected.length,expected,replacement,kind:'mechanical',reason:'FT-112 M06: normalização bibliográfica exigida pelo cabeçalho'});}
const prefixes={
 majvitoria:['Ellen G. White, *Mensagens aos Jovens*, cap. 27, “Assumir a vitória”, pp. 105–106.','Mensagens aos Jovens - Assumir a vitória, p. 105, 106. Ellen G. White.'],
 dtnvitoria:['Ellen G. White, *O Desejado de Todas as Nações*, cap. 31, “O sermão da montanha”, p. 213','O Desejado de Todas as Nações - O sermão da montanha, p. 213'],
 dtnespirito:['Ellen G. White, *O Desejado de Todas as Nações*, cap. 73, “Não se turbe o vosso coração”, p. 475','O Desejado de Todas as Nações - Não se turbe o vosso coração, p. 475'],
 oevitoria:['Ellen G. White, *Obreiros Evangélicos*, “O Espírito Santo”, p. 286','Obreiros Evangélicos - O Espírito Santo, p. 286'],
 dtncativeiro:['Ellen G. White, *O Desejado de Todas as Nações*, cap. 2, “O povo escolhido”, pp. 16–17','O Desejado de Todas as Nações - O povo escolhido, p. 16, 17'],
 gcsabado:['Ellen G. White, *O Grande Conflito*, cap. 3, “Como começaram as trevas morais”, pp. 52–53.','O Grande Conflito - Como começaram as trevas morais, p. 52, 53. Ellen G. White.'],
 gcpecado:['Ellen G. White, *O Grande Conflito*, “Por que existe o sofrimento”, pp. 492–493.','O Grande Conflito - Por que existe o sofrimento, p. 492, 493. Ellen G. White.'],
 gcescolha:['Ellen G. White, *O Grande Conflito*, “É o homem imortal?”, p. 543; “Será desolada a Terra”, pp. 660–661.','O Grande Conflito - É o homem imortal?, p. 543; Será desolada a Terra, p. 660, 661. Ellen G. White.'],
 gcnaum:['Ellen G. White, *O Grande Conflito*, “Por que existe o sofrimento”, p. 504: “Jamais o mal se manifestará de novo”;','O Grande Conflito - Por que existe o sofrimento, p. 504. Ellen G. White. _“Jamais o mal se manifestará de novo”_;']
};
for(const [key,[from,to]] of Object.entries(prefixes)){const prefix='[^'+key+']: ';exact(prefix+from,prefix+to);}
exact('pp. 15–16 na paginação editorial do EPUB; pp. 39–40 na paginação impressa do PDF consultado','p. 15, 16 na paginação editorial do EPUB; p. 39, 40 na paginação impressa do PDF consultado');
exact('_“afligireis as vossas almas”_ e proibiu o trabalho naquele dia.[^lvexp]','_“afligireis as vossas almas”_[^lvexp] e proibiu o trabalho naquele dia.');
exact('_“Deus considera Seu povo, como **um corpo**, responsável pelos pecados que existem em indivíduos em seu meio.”_ Em seguida, responsabiliza os dirigentes que negligenciam enfrentar o mal.[^t3269]','_“Deus considera Seu povo, como **um corpo**, responsável pelos pecados que existem em indivíduos em seu meio.”_[^t3269] Em seguida, responsabiliza os dirigentes que negligenciam enfrentar o mal.');
exact('_“pedras vivas”_ que formam','_“pedras vivas”_[^1pe25] que formam');
exact('_“amou a igreja e a si mesmo se entregou por ela”_ para','_“amou a igreja e a si mesmo se entregou por ela”_[^ef525] para');
exact('contentar-se com “não peques mais”.[^jo811]','contentar-se com _“não peques mais”_[^jo811].');
let output=applyEditorialEdits(original,edits).markedOutput;
// A autoria foi deslocada para o fim dos dados editoriais; restaurá-la expressamente nas quatro notas.
for(const key of ['dtnvitoria','dtnespirito','oevitoria','dtncativeiro'])output=output.replace(new RegExp('^(\\[\\^'+key+'\\]:.*)$','m'),'$1 Ellen G. White.');
const key='coerenciavitoria';output=output.replace(new RegExp('^(\\[\\^'+key+'\\]:.*)$','m'),line=>line.replace('Referências bíblicas nesta nota: ARA. ','').replace('1 Coríntios 10:13 atribui','Bíblia, ARA. 1 Coríntios 10:13 atribui').replace('João 16:8–11, Romanos 8:13 e Gálatas 5:16 relacionam','Bíblia, ARA. João 16:8–11; Bíblia, ARA. Romanos 8:13; Bíblia, ARA. Gálatas 5:16 relacionam').replace('Apocalipse 19:10 integra','Bíblia, ARA. Apocalipse 19:10 integra').replace('(Apocalipse 12:17; 14:12)','(Bíblia, ARA. Apocalipse 12:17; 14:12)').replace('(14:6–12)','(Bíblia, ARA. Apocalipse 14:6–12)').replace('(7:2–3)','(Bíblia, ARA. Apocalipse 7:2–3)').replace('(Êxodo 20:8–11; Ezequiel 20:12,20)','(Bíblia, ARA. Êxodo 20:8–11; Bíblia, ARA. Ezequiel 20:12,20)').replace('(João 15:5; Filipenses 2:13; 1 João 2:1; Apocalipse 3:21)','(Bíblia, ARA. João 15:5; Bíblia, ARA. Filipenses 2:13; Bíblia, ARA. 1 João 2:1; Bíblia, ARA. Apocalipse 3:21)'));
fs.writeFileSync(file,output);console.log(edits.length+' ajustes bibliográficos/inline aplicados.');
