require 'json'
require 'digest'
require 'nokogiri'
root = File.expand_path('../../../../..', __dir__)
target = File.join(__dir__, 'diagnostico-blocos-M36B.json')
raise 'Diagnóstico já produzido' unless JSON.parse(File.read(target))['status'] == 'pending'
gate = JSON.parse(File.read(File.join(__dir__, 'validacao-render-M33.json')))
draft = File.join(root, '_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md')
raise 'Fonte mudou após M35' unless gate['status'] == 'passed' && Digest::SHA256.file(draft).hexdigest == gate['sha256_draft']
html = File.read(File.join(__dir__, 'renderizado-M33.html'), encoding: 'UTF-8')
dom = Nokogiri::HTML(html)
blocks = dom.css('blockquote').each_with_index.map do |q,i|
  text = q.text.gsub(/\s+/, ' ').strip
  {index: i+1, paragraphs: q.css('p').length, attribution_dash: text.include?('— '), note_calls: q.css('a.footnote').length, has_superscript_digits: text.match?(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/), text: text}
end
result = {status: 'diagnostic', sha256_draft: gate['sha256_draft'], html_sha256: Digest::SHA256.hexdigest(html), blocks: blocks, multiple_or_zero_paragraphs: blocks.select { |b| b[:paragraphs] != 1 }.map { |b| b[:index] }, without_attribution_dash: blocks.reject { |b| b[:attribution_dash] }.map { |b| b[:index] }, with_note_calls: blocks.select { |b| b[:note_calls] > 0 }.map { |b| b[:index] }, limit: 'Diagnóstico do HTML existente; presença de travessão ou sobrescrito não comprova referência completa nem numeração de cada versículo. Nota interna exige contexto, não é erro automático.'}
File.write(target, JSON.pretty_generate(result), encoding: 'UTF-8')
puts JSON.generate(result.reject { |k,_| k == :blocks }.merge(block_count: blocks.length))
