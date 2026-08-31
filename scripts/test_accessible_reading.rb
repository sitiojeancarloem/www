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
  <p>— Bíblia. NVI. Isaías 53:10<sup><a href="#fn:1" role="doc-noteref">1</a></sup> e reuso<sup><a href="#fn:1" role="doc-noteref">1</a></sup>.</p>
  <div class="footnotes"><ol><li id="fn:1">Bíblia, NVI, Isaías 12:3; 53:10. <span class="jcem-footnote-backrefs"><a class="jcem-footnote-backref">a</a> <a class="jcem-footnote-backref">b</a></span></li></ol></div>
  </section></article></body></html>
HTML

normalized = Jcem::AccessibleReading.normalize_html(html)
assert(normalized.include?('data-jcem-accessible-document="1"'), "artigo não foi marcado")
assert(normalized.include?('aria-roledescription="citação"'), "citação perdeu distinção")
assert(normalized.include?('data-jcem-spoken-reference="Isaías 53:10 NVI"'), "referência bíblica por ocorrência não foi reduzida")
assert(normalized.include?('data-jcem-reference-full="Bíblia, NVI, Isaías 12:3; 53:10"'), "referência integral não foi preservada")
assert(normalized.include?('aria-details="fn:1"'), "relação deliberada com a nota foi perdida")
assert(!normalized.include?('aria-describedby="fn:1"'), "nota longa permaneceu achatada em aria-describedby")
assert(!normalized.include?('class="visually-hidden jcem-spoken-reference"'), "texto de referência intrusivo permaneceu no HTML")
assert(!normalized.include?("Referência: Isaías 53:10 NVI Referência:"), "referências reutilizadas contaminaram a ocorrência seguinte")
assert(!normalized.include?('data-jcem-spoken-reference="Bíblia, NVI, Isaías 12:3; 53:10. a b"'), "backlinks vazaram para a referência falada")
assert(normalized.include?('scope="col"'), "cabeçalho de coluna sem scope")
assert(normalized.include?('scope="row"'), "cabeçalho de linha sem scope")
assert(normalized.include?('>Linha</span>'), "cabeçalho vazio não recebeu nome")

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
end

puts "accessible_reading=ok"
