// Sequência de correções exatas aprovada pelo supervisor; não reimplementa plugins.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const target = path.join(__dirname, 'renderizar-M33.rb');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const original = fs.readFileSync(target);
if (hash(original) !== '6413d2bd4522f3d563c01722cab56c8f9f9cbb4d9b405de660c5c8709ab5994e') throw Error('Base divergente; não reaplicar');
let s = original.toString('utf8').replace(/\r\n/g, '\n');
let edits = 0;
function replace(a, b) {
  if (s.split(a).length !== 2) throw Error('Âncora ausente ou duplicada: '+a);
  s = s.replace(a, b); edits++;
}
replace('begin\n  # Item 3:', '  # Item 3:');
replace("sha256_draft = Digest::SHA256.hexdigest(source)\nhtml_convertido = html\nhtml_apos_normalizacao = html_normalizado", "html_apos_normalizacao = html_normalizado");
replace('frontmatter = source.match(', "sha256_draft = Digest::SHA256.hexdigest(source)\nresult = {status: 'pending', sha256_draft: sha256_draft}\nbegin\nfrontmatter = source.match(");
replace('html = document.to_html', "html = document.to_html\nFile.write(File.join(__dir__, 'renderizado-M33.html'), html, encoding: 'UTF-8')");
replace("dom = Nokogiri::HTML(html_normalizado)", "File.write(File.join(__dir__, 'renderizado-M33.html'), html_normalizado, encoding: 'UTF-8')\ndom = Nokogiri::HTML(html_normalizado)");
replace("dom.at_xpath('//html[@data-jcem-accessible-document=\"1\"]')", "dom.at_css('article.jcem-post[data-jcem-accessible-document=\"1\"]')");
replace("if html_apos_normalizacao.include?('<strong>**')", "if dom.text.include?('**')");
replace("if html_apos_normalizacao.include?('AI-PROCESSED')", "if dom.text.include?('AI-PROCESSED')");
replace("  caption_elements = dom.css('caption')", "  raise 'Nota crua no HTML' if dom.text.match?(/\\[\\^[a-zA-Z0-9]+\\]/)\n  raise 'Aviso Kramdown: '+document.warnings.join('; ') unless document.warnings.empty?\n  caption_elements = dom.at_css('table').css('caption')");
replace("if thead_th_scope_col.length == 0", "unless thead_th_scope_col.length > 0 && thead_th_scope_col.length == dom.at_css('table').css('thead th').length");
replace("  raise 'Nota ap1217 não encontrada' unless footnote_ids.include?('ap1217')\n  footnote_call_count = dom.css('a.footnote[href=\"#ap1217\"]').length", "  ap1217_id = footnote_ids.find { |id| id && id.match?(/(?:\\A|:)ap1217\\z/) }\n  raise 'Nota ap1217 não encontrada' unless ap1217_id\n  footnote_call_count = refs.count { |a| a['href'] == '#' + ap1217_id }");
fs.writeFileSync(target, s, 'utf8');
console.log(JSON.stringify({unit:'M33A4',edits,before:hash(original),after:hash(Buffer.from(s)),limit:'Correção do verificador; aprovação do artigo depende da execução seguinte.'}));
