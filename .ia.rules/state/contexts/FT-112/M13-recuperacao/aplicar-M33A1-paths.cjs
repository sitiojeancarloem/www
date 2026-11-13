// Preparação mecânica delimitada; não executa o renderizador nem altera artigo.
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const target = path.join(__dirname, 'renderizar-M33.rb');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const original = fs.readFileSync(target);
if (hash(original) !== '3e75e7c39152b5b4b49dea0cb2a90c3f2fd5f82164ec855a8aa3e6185dfb555a') throw Error('Precondição: arquivo-base divergente; não reaplicar');
let text = original.toString('utf8');
function replace(before, after, count = 1) {
  if (text.split(before).length - 1 !== count) throw Error('Âncora divergente: ' + before);
  text = text.split(before).join(after);
}
replace("abort 'M33A_PENDING: adaptar antes de executar'", "abort 'M33B_PENDING: compor acessibilidade e diagnóstico antes de executar'");
replace("require_relative '../../../../", "require_relative '../../../../../", 3);
replace("File.expand_path('../../../..', __dir__)", "File.expand_path('../../../../..', __dir__)");
replace("'_drafts/carta-aberta-hierarquia-romanda-na-igreja'", "'_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md'");
replace("body = source.split('-->', 2).last", "frontmatter = source.match(/\\A(?:\\uFEFF)?---[ \\t]*\\r?\\n.*?\\r?\\n---[ \\t]*(?:\\r?\\n|\\z)/m)\nraise 'Frontmatter ausente ou incompleto' unless frontmatter\nbody = source[frontmatter.end(0)..]");
if (text.includes("split('-->'") || text.includes('romanda-na-igreja')) throw Error('Pós-condição: extração ou caminho antigo');
fs.writeFileSync(target, text, 'utf8');
console.log(JSON.stringify({unit:'M33A1',status:'prepared',before:hash(original),after:hash(Buffer.from(text)),limit:'Somente caminhos e extração do corpo; bloqueio de execução mantido. Renderização e acessibilidade pendentes.'}));
