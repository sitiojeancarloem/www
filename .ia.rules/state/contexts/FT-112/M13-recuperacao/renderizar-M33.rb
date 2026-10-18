# Verificação pontual do draft FT-112 com os mecanismos existentes do projeto.
require_relative '../../../../../scripts/jekyll_compat'
require 'jekyll'
require 'kramdown'
require 'nokogiri'
require 'json'
require 'digest'
require_relative '../../../../../_plugins/jcem_footnotes'
require_relative '../../../../../_plugins/jcem_quote_semantics'
require_relative '../../../../../_plugins/jcem_zz_accessible_reading'
root = File.expand_path('../../../../..', __dir__)
source = File.read(File.join(root, '_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md'), encoding: 'UTF-8')
frontmatter = source.match(/\A(?:\uFEFF)?---[ \t]*\r?\n.*?\r?\n---[ \t]*(?:\r?\n|\z)/m)
raise 'Frontmatter ausente ou incompleto' unless frontmatter
body = source[frontmatter.end(0)..]
prepared = Jcem::Footnotes.prepare(body, 'FT-112')
document = Kramdown::Document.new(prepared, input: 'GFM', hard_wrap: false)
html = document.to_html
config = Jcem::QuoteSemantics.load_config(root)
html = Jcem::QuoteSemantics.normalize_html(html, config)

# Item 1: Envolver html em documento HTML completo antes de normalize_html
html_envolvido = "<!DOCTYPE html><html lang=\"pt-BR\"><body><article class=\"jcem-post\"><h1 id=\"page-title\">Revisão FT-112</h1><section class=\"page__content\">#{html}</section></article></body></html>"
html_normalizado = Jcem::AccessibleReading.normalize_html(html_envolvido, locale: 'pt-BR', toc: false)

# Confirmar via assert presença de data-jcem-accessible-document="1"
dom = Nokogiri::HTML(html_normalizado)
raise 'Assert data-jcem-accessible-document="1" ausente' unless dom.at_xpath('//html[@data-jcem-accessible-document="1"]')

# Item 2: Definir result/status/sha fora do begin; proteger conversão, normalização e asserts por begin/rescue
sha256_draft = Digest::SHA256.hexdigest(source)
html_convertido = html
html_apos_normalizacao = html_normalizado

begin
  # Item 3: Asserts tabela única e tbody com sete linhas, ausência de ** cru e AI-PROCESSED visível
  table_count = dom.css('table').length
  raise 'Assert tabela única falhou: ' + table_count.to_s + ' tabelas encontradas' unless table_count == 1
  tbody_rows = dom.css('tbody tr').length
  raise 'Assert tbody com sete linhas falhou: ' + tbody_rows.to_s + ' linhas encontradas' unless tbody_rows == 7
  raise 'Assert ausência de ** cru falhou' if html_apos_normalizacao.include?('<strong>**')
  raise 'Assert AI-PROCESSED visível falhou' if html_apos_normalizacao.include?('AI-PROCESSED')

  # Item 3: Verificar caption da própria tabela igual à legenda existente
  caption_elements = dom.css('caption')
  raise 'Assert caption da própria tabela ausente' if caption_elements.length != 1
  expected_caption = 'Termos de Mateus 23 e comparações retóricas do autor'
  raise "Assert caption incorreta: '#{caption_elements[0].text.strip}'" unless caption_elements[0].text.strip == expected_caption

  # Item 3: Verificar thead th com scope="col"
  thead_th_scope_col = dom.css('thead th[scope="col"]')
  raise 'Assert thead th com scope="col" ausente' if thead_th_scope_col.length == 0

  # Item 3: Registrar contagens de citações e parágrafos
  quotes = dom.css('blockquote')
  paragraph_count = dom.css('p').length

  # Item 4: Para cada a.footnote, destino href presente no DOM, aria-details igual ao destino e data-jcem-reference-full não vazio
  refs = dom.css('a.footnote')
  missing_refs = refs.reject { |a| dom.xpath(".//*[@id='#{a['href'].delete_prefix('#')}']").any? }
  raise 'Nota sem destino' unless missing_refs.empty?
  invalid_aria_details = refs.select { |a| a['href'] && a['aria-details'] != a['href'].delete_prefix('#') }
  raise 'Nota com aria-details inválido' unless invalid_aria_details.empty?
  invalid_reference_full = refs.select { |a| a['data-jcem-reference-full'].nil? || a['data-jcem-reference-full'].empty? }
  raise 'Nota com data-jcem-reference-full vazio' unless invalid_reference_full.empty?

  # Item 4: Para todo a.reversefootnote e a.jcem-footnote-backref com href local, exigir destino presente
  reverse_refs = dom.css('a.reversefootnote, a.jcem-footnote-backref')
  missing_reverse = reverse_refs.select { |a| a['href'] && a['href'].start_with?('#') && !dom.xpath(".//*[@id='#{a['href'].delete_prefix('#')}']").any? }
  raise 'Referência reversa sem destino' unless missing_reverse.empty?

  # Item 4: Verificar que a nota ap1217 existe pela ocorrência de seu ID real e há chamada apontando a ela
  footnote_ids = dom.css('.footnotes li').map { |li| li['id'] }
  raise 'Nota ap1217 não encontrada' unless footnote_ids.include?('ap1217')
  footnote_call_count = dom.css('a.footnote[href="#ap1217"]').length
  raise 'Chamada da nota ap1217 não encontrada' if footnote_call_count == 0

  result = {status: 'passed', renderer: 'Kramdown '+Kramdown::VERSION, sha256_draft: sha256_draft, warnings: document.warnings, citations: quotes.length, footnote_calls: refs.length, footnotes: dom.css('.footnotes li').length, table_rows: tbody_rows, broken_references: missing_refs.length, captions: caption_elements.length, thead_th_scope_col: thead_th_scope_col.length, paragraph_count: paragraph_count, footnote_ids: footnote_ids, ap1217_call_count: footnote_call_count}
  File.write(File.join(__dir__, 'validacao-render-M33.json'), JSON.pretty_generate(result))
  puts JSON.generate(result)
rescue StandardError => e
  result = {status: 'failed', sha256_draft: sha256_draft, error_class: e.class.to_s, error_message: e.message}
  File.write(File.join(__dir__, 'validacao-render-M33.json'), JSON.pretty_generate(result))
  puts JSON.generate(result)
  raise
end

