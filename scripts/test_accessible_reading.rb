# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/blog
# Autor: Jean Carlo EM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/

require_relative "jekyll_compat"
require "jekyll"
require "json"
require "tmpdir"
require_relative "../_plugins/jcem_charts"
require_relative "../_plugins/jcem_zz_accessible_reading"

def assert(condition, message)
  abort "accessible_reading=erro detalhe=#{message}" unless condition
end

html = <<~HTML
  <!doctype html><html lang="pt-BR"><body>
  <article class="jcem-post"><h1 id="page-title">Artigo</h1><section class="page__content">
  <div role="blockquote"><p>Texto citado.</p></div>
  <table><caption>Valores</caption><thead><tr><th></th><th>Total</th></tr></thead><tbody><tr><th>A</th><td>2</td></tr></tbody></table>
  <img src="/informativa.svg" alt="Informação suficiente">
  <p>Consulte a <a href="/documentacao/">documentação acessível</a> para detalhes.</p>
  <p>— Bíblia. NVI. Isaías 53:10<sup><a href="#fn:1" role="doc-noteref">1</a></sup> e reuso<sup><a href="#fn:1" role="doc-noteref">1</a></sup>.</p>
  <h2 id="primeira-secao">Primeira <a href="/secao/">seção</a><sup id="fnref:1"><a href="#fn:1" class="footnote">1</a></sup></h2>
  <h3 id="terceiro-nivel">Terceiro nível</h3>
  <h4 id="quarto-nivel">Quarto nível</h4>
  <div class="footnotes"><ol><li id="fn:1">Bíblia, NVI, Isaías 12:3; 53:10. <span class="jcem-footnote-backrefs"><a class="jcem-footnote-backref">a</a> <a class="jcem-footnote-backref">b</a></span></li></ol></div>
  </section></article></body></html>
HTML

normalized = Jcem::AccessibleReading.normalize_html(html, toc: true)
assert(normalized.include?('data-jcem-accessible-document="1"'), "artigo não foi marcado")
assert(normalized.include?('aria-roledescription="citação"'), "citação perdeu distinção")
assert(normalized.include?('data-jcem-spoken-reference="Isaías 53:10 NVI"'), "referência bíblica por ocorrência não foi reduzida")
assert(normalized.include?('data-jcem-reference-full="Bíblia, NVI, Isaías 12:3; 53:10"'), "referência integral não foi preservada")
assert(normalized.include?('aria-details="fn:1"'), "relação deliberada com a nota foi perdida")
parsed_references = Nokogiri::HTML.parse(normalized).css(Jcem::AccessibleReading::NOTEREF_SELECTOR)
assert(parsed_references.any? { |link| link["class"] == "footnote" && link["role"] == "doc-noteref" }, "footnote equivalente em sup não recebeu semântica de referência")
assert(parsed_references.map(&:text).all? { |text| text.match?(/\A\[\d+\]\z/) }, "chamada ordinária sem gramática [N]")
assert(parsed_references.map { |link| link["data-jcem-reference-identifier"] }.all? { |id| id&.match?(/\A\d+\z/) }, "namespace numérico ordinário ausente")
assert(!normalized.include?('aria-describedby="fn:1"'), "nota longa permaneceu achatada em aria-describedby")
assert(!normalized.include?('class="visually-hidden jcem-spoken-reference"'), "texto de referência intrusivo permaneceu no HTML")
assert(!normalized.include?("Referência: Isaías 53:10 NVI Referência:"), "referências reutilizadas contaminaram a ocorrência seguinte")
assert(!normalized.include?('data-jcem-spoken-reference="Bíblia, NVI, Isaías 12:3; 53:10. a b"'), "backlinks vazaram para a referência falada")
assert(normalized.include?('scope="col"'), "cabeçalho de coluna sem scope")
assert(normalized.include?('scope="row"'), "cabeçalho de linha sem scope")
assert(normalized.include?('>Linha</span>'), "cabeçalho vazio não recebeu nome")
parsed = Nokogiri::HTML.parse(normalized)
consecutive = Nokogiri::HTML.fragment('<sup><a href="#fn:4">4</a></sup><sup><a href="#fn:5">5</a></sup><sup><a href="#fn:6">6</a></sup>')
consecutive.css("a").each do |link|
  identifier = link.text
  Jcem::AccessibleReading.normalize_noteref(consecutive, link, nil, "Nota #{identifier}", "fn:#{identifier}")
end
assert(consecutive.text == "[4][5][6]", "chamadas contíguas perderam isolamento semântico")
toc = parsed.at_css('[data-jcem-article-toc="true"]')
assert(toc, "sumário automático não foi gerado")
assert(toc.at_css('summary')&.text == "Sumário do artigo", "sumário perdeu rótulo")
assert(toc.at_css('nav[aria-label="Sumário do artigo"] a[href="#primeira-secao"]'), "heading não entrou no sumário")
assert(toc.at_css('a[href="#primeira-secao"]')&.text == "Primeira seção", "TOC verbalizaria link ou número de referência do heading")
assert(toc.css('a').all? { |link| link.text !~ /\d/ }, "numeração de referência vazou para links do TOC")
assert(toc.previous_element&.name == "p", "sumário não foi inserido após o primeiro parágrafo real")
assert(toc.previous_element&.text&.include?("documentação acessível"), "sumário não sucedeu o primeiro parágrafo editorial")
assert(!toc.previous_element&.ancestors&.any? { |ancestor| ancestor.name == "blockquote" || ancestor["role"] == "blockquote" }, "blockquote inicial foi aceito como primeiro parágrafo")
renormalized = Jcem::AccessibleReading.normalize_html(normalized, toc: true)
assert(Nokogiri::HTML.parse(renormalized).css('[data-jcem-article-toc]').length == 1, "sumário não é idempotente")

local_caption_html = html.sub("<caption>Valores</caption>", "").sub("<table>", '<table data-jcem-caption="Valores locais">')
local_caption = Nokogiri::HTML.parse(Jcem::AccessibleReading.normalize_html(local_caption_html))
assert(local_caption.at_css("table > caption")&.text == "Valores locais", "caption local não foi materializado")
assert(!local_caption.at_css("table")&.key?("data-jcem-caption"), "metadado local de caption vazou no HTML")

fallback_html = html
  .sub('<p>Consulte a <a href="/documentacao/">documentação acessível</a> para detalhes.</p>', '')
  .sub('<p>— Bíblia. NVI. Isaías 53:10<sup><a href="#fn:1" role="doc-noteref">1</a></sup> e reuso<sup><a href="#fn:1" role="doc-noteref">1</a></sup>.</p>', '')
fallback = Nokogiri::HTML.parse(Jcem::AccessibleReading.normalize_html(fallback_html, toc: true))
assert(fallback.at_css('.page__content')&.element_children&.first&.matches?('[data-jcem-article-toc]'), "fallback sem parágrafo não ficou determinístico")

begin
  Jcem::AccessibleReading.normalize_html(html.sub(' alt="Informação suficiente"', ' alt=""'))
  abort "accessible_reading=erro detalhe=imagem informativa vazia foi aceita"
rescue Jekyll::Errors::FatalException => error
  assert(error.message.include?("imagem_informativa_sem_alt"), "diagnóstico de imagem foi perdido")
end

begin
  Jcem::AccessibleReading.normalize_html(html.sub("<caption>Valores</caption>", ""))
  abort "accessible_reading=erro detalhe=tabela sem caption foi aceita"
rescue Jekyll::Errors::FatalException => error
  assert(error.message.include?("tabela_sem_caption"), "diagnóstico de tabela foi perdido")
end

dataset = Jcem::Charts.load_dataset(File.expand_path("..", __dir__), "assets/data/charts/tts-accessibility.json")
chart = Jcem::Charts.render(dataset, emit_assets: true)
assert(chart.include?('data-jcem-chart-renderer="4.5.1"'), "versão efetiva do renderer ausente")
assert(chart.include?("<caption>Exemplo controlado de leituras mensais — dados</caption>"), "gráfico sem tabela estática")
assert(chart.include?('aria-hidden="true"'), "canvas duplicado permaneceu na árvore acessível")

Dir.mktmpdir("jcem-accessibility-manifest-") do |destination|
  article_path = File.join(destination, "p", "fixture", "index.html")
  FileUtils.mkdir_p(File.dirname(article_path))
  File.binwrite(article_path, normalized)
  Jcem::AccessibleReading.write_manifest(Struct.new(:dest).new(destination))
  manifest = JSON.parse(File.binread(File.join(destination, "assets", "jcem", "accessibility-manifest.json")))
  assert(manifest.fetch("pages").length == 1, "glob absoluto do manifesto perdeu publicação")
  assert(manifest.dig("pages", 0, "url") == "/p/fixture/", "URL do manifesto ficou incorreta")
  assert(manifest.dig("pages", 0, "capabilities", "toc") == 1, "manifesto não registrou o sumário")
end

root = File.expand_path("..", __dir__)
local_adapter = File.read(File.join(root, "agents.local.md"), encoding: "UTF-8")
package = JSON.parse(File.read(File.join(root, "package.json"), encoding: "UTF-8"))
tts_rcf = File.read(File.join(root, "RCFs", "leitura-acessivel-e-tts.md"), encoding: "UTF-8")

# PROTECAO: a governança genérica pertence ao núcleo; estes arquivos comprovam
# somente o roteamento e o delta Web que continua específico deste produto.
assert(local_adapter.include?(".ia.rules/resources/editorial-authoring.md"), "rota editorial canônica ausente")
assert(local_adapter.include?(".ia.rules/resources/spoken-normalization.md"), "rota de fala canônica ausente")
assert(
  package.dig("scripts", "agent:editorial") == "node .ia.rules/core/runtime/scripts/editorial-authoring.js",
  "comando editorial deixou de delegar ao runtime gerenciado"
)
assert(
  package.dig("scripts", "agent:spoken") == "node .ia.rules/core/runtime/scripts/spoken-normalization.js",
  "comando de fala deixou de delegar ao runtime gerenciado"
)
assert(tts_rcf.include?("especializações locais de produto"), "delta local TTS não foi preservado")
%w[
  _plugins/jcem_zz_accessible_reading.rb
  _includes/jcem/read-aloud.html
  assets/jcem/js/biblical-reference-speech.js
  assets/jcem/js/read-aloud.js
  scripts/test_biblical_reference_speech.mjs
  scripts/test_accessible_runtime.mjs
].each do |relative_path|
  assert(File.file?(File.join(root, relative_path)), "capacidade local removida: #{relative_path}")
end

read_aloud_include = File.read(File.join(root, "_includes", "jcem", "read-aloud.html"), encoding: "UTF-8")
read_aloud_runtime = File.read(File.join(root, "assets", "jcem", "js", "read-aloud.js"), encoding: "UTF-8")
assert(read_aloud_include.include?('type="module"'), "parser bíblico modular não será carregado")
assert(read_aloud_runtime.include?("./biblical-reference-speech.js"), "runtime não usa o parser bíblico comum")

puts "accessible_reading=ok"
