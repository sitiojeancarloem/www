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
html = Jcem::AccessibleReading.normalize_html(html, locale: 'pt-BR', toc: false)
dom = Nokogiri::HTML.fragment(html)
refs = dom.css('a.footnote')
missing = refs.reject { |a| dom.xpath(".//*[@id='#{a['href'].delete_prefix('#')}']").any? }
raise 'Nota sem destino' unless missing.empty?
raise 'Nota crua no HTML' if dom.text.match?(/\[\^[a-zA-Z0-9]+\]/)
raise 'Aviso Kramdown: '+document.warnings.join('; ') unless document.warnings.empty?
quotes = dom.css('blockquote')
caption_elements = dom.css('caption')
scope_col_elements = dom.css('[scope="col"]')
aria_details_elements = dom.css('[aria-details]')
reference_full_elements = dom.css('a.footnote[title]')
File.write(File.join(__dir__, 'renderizado-M33.html'), '<!doctype html><html lang="pt-BR"><meta charset="UTF-8"><title>Revisão FT-112</title><style>body{max-width:900px;margin:40px auto;padding:20px;font:18px/1.6 Georgia}blockquote{border-left:4px solid #888;padding-left:20px}table{border-collapse:collapse}td,th{border:1px solid #888;padding:8px}sup{font-size:.7em}</style><main>'+html+'</main></html>')
begin
  result = {status: 'passed', renderer: 'Kramdown '+Kramdown::VERSION, sha256_draft: Digest::SHA256.hexdigest(source), warnings: document.warnings, citations: quotes.length, footnote_calls: refs.length, footnotes: dom.css('.footnotes li').length, table_rows: dom.css('tbody tr').length, broken_references: missing.length, captions: caption_elements.length, scope_col: scope_col_elements.length, aria_details: aria_details_elements.length, reference_full: reference_full_elements.length}
  File.write(File.join(__dir__, 'validacao-render-M33.json'), JSON.pretty_generate(result))
  puts JSON.generate(result)
rescue => e
  result = {status: 'failed', sha256_draft: Digest::SHA256.hexdigest(source), error_class: e.class.to_s, error_message: e.message}
  File.write(File.join(__dir__, 'validacao-render-M33.json'), JSON.pretty_generate(result))
  puts JSON.generate(result)
  raise
end

